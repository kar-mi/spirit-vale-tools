import { appendFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";

import { deleteReadModel, openReadModel, readModelPath } from "./index.ts";
import type { IndexStreamRequest, ReadModel, ReadModelDomain, ReadModelRebuild } from "./index.ts";

const SESSION = "20260101T000000000Z-0000abcd";
const STREAM = "combat" as const;

/** A fictional domain, so the infrastructure package never depends on real domain code. */
function syntheticDomain(version = 1): ReadModelDomain {
  return {
    name: "synthetic",
    version,
    createSchema(database) {
      database.exec(`create table if not exists synthetic_events (
        session_id text not null, stream text not null, sequence integer not null,
        type text not null, value integer not null,
        primary key (session_id, stream, sequence)
      )`);
    },
    dropSchema(database) {
      database.exec("drop table if exists synthetic_events");
    },
  };
}

function otherDomain(): ReadModelDomain {
  return {
    name: "other",
    version: 1,
    createSchema(database) {
      database.exec("create table if not exists other_events (session_id text not null, sequence integer not null)");
    },
    dropSchema(database) {
      database.exec("drop table if exists other_events");
    },
  };
}

function request(sourcePath: string, overrides: Partial<IndexStreamRequest> = {}): IndexStreamRequest {
  return {
    sessionId: SESSION,
    stream: STREAM,
    domain: "synthetic",
    sourcePath,
    apply(records, database) {
      // query() statements are cached and finalized by the connection; prepare() would leak them.
      const insert = database.query(
        "insert or replace into synthetic_events (session_id, stream, sequence, type, value) values ($sessionId, $stream, $sequence, $type, $value)",
      );
      for (const record of records) {
        insert.run({
          sessionId: record.sessionId,
          stream: STREAM,
          sequence: record.sequence,
          type: record.type,
          value: typeof record.data["value"] === "number" ? record.data["value"] : 0,
        });
      }
    },
    clear(scope, database) {
      database
        .query("delete from synthetic_events where session_id = $sessionId and stream = $stream")
        .run({ sessionId: scope.sessionId, stream: scope.stream });
    },
    ...overrides,
  };
}

function line(sequence: number, value: number, sessionId = SESSION): string {
  const record: LogRecord = {
    schemaVersion: 1,
    sessionId,
    sequence,
    recordedAt: new Date(Date.UTC(2026, 0, 1, 0, 0, sequence)).toISOString(),
    source: "synthetic-test",
    type: "synthetic.event",
    data: { value },
  };
  return `${JSON.stringify(record)}\n`;
}

function count(database: Database): number {
  return database.query<{ total: number }, []>("select count(*) as total from synthetic_events").get()!.total;
}

function sum(database: Database): number {
  return database.query<{ total: number | null }, []>("select sum(value) as total from synthetic_events").get()!.total ?? 0;
}

interface Fixture {
  root: string;
  logPath: string;
  /** Opened models are closed by {@link cleanup}; closing early inside a test is also fine. */
  open(domains?: readonly ReadModelDomain[]): Promise<ReadModel>;
  rebuilds: ReadModelRebuild[];
  cleanup(): Promise<void>;
}

async function fixture(): Promise<Fixture> {
  const root = path.resolve(import.meta.dir, "../../../.local", `read-model-test-${crypto.randomUUID()}`);
  const logPath = path.join(root, "sessions", SESSION, `${STREAM}.jsonl`);
  await mkdir(path.dirname(logPath), { recursive: true });
  await writeFile(logPath, "");
  const rebuilds: ReadModelRebuild[] = [];
  // The fixture owns closing: an open database cannot be deleted on Windows, and a failed assertion
  // would otherwise surface as EBUSY from cleanup instead of the assertion that actually failed.
  const opened: ReadModel[] = [];
  return {
    root,
    logPath,
    rebuilds,
    async open(domains = [syntheticDomain()]) {
      const model = await openReadModel({ logDirectory: root, domains, onRebuild: (event) => rebuilds.push(event) });
      opened.push(model);
      return model;
    },
    async cleanup() {
      for (const model of opened.splice(0)) {
        try { model.close(); } catch { /* Already closed by the test. */ }
      }
      await rm(root, { recursive: true, force: true });
    },
  };
}

describe("read model lifecycle", () => {
  test("creates the database beside the logs with write-ahead logging enabled", async () => {
    const context = await fixture();
    try {
      const model = await context.open();
      expect(model.path).toBe(readModelPath(context.root));
      expect(model.database.query<{ journal_mode: string }, []>("pragma journal_mode").get()?.journal_mode).toBe("wal");
      expect(context.rebuilds).toEqual([{ reason: "created" }]);

      const health = model.health();
      expect(health.schemaVersion).toBe(1);
      expect(health.domains).toEqual([{ name: "synthetic", version: 1 }]);
      expect(health.streams).toEqual([]);
      model.close();

      context.rebuilds.length = 0;
      const reopened = await context.open();
      expect(context.rebuilds).toEqual([]);
      reopened.close();
    } finally {
      await context.cleanup();
    }
  });

  test("rejects a duplicate domain registration", async () => {
    const context = await fixture();
    try {
      await expect(context.open([syntheticDomain(), syntheticDomain()])).rejects.toThrow("registered more than once");
    } finally {
      await context.cleanup();
    }
  });

  test("round-trips an integer above Number.MAX_SAFE_INTEGER through bigintStatement", async () => {
    const context = await fixture();
    try {
      const model = await context.open();
      model.database.exec("create table synthetic_coins (id integer primary key, coins integer not null)");
      model.statement("insert into synthetic_coins (id, coins) values ($id, $coins)").run({ id: 1, coins: 9007199254740993n });

      const rounded = model.statement("select coins from synthetic_coins where id = 1").get() as { coins: number };
      expect(rounded.coins).toBe(9007199254740992);

      const exact = model.bigintStatement("select coins from synthetic_coins where id = 1").get() as { coins: bigint };
      expect(exact.coins).toBe(9007199254740993n);
      model.close();
    } finally {
      await context.cleanup();
    }
  });
});

describe("incremental indexing", () => {
  test("indexes new records and resumes from the recorded offset", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const model = await context.open();

      const first = await model.indexStream(request(context.logPath));
      expect(first).toMatchObject({ recordsIndexed: 2, invalidLines: 0, rebuilt: false, rebuildReason: "new", lastSequence: 2 });
      expect(count(model.database)).toBe(2);

      await appendFile(context.logPath, line(3, 30));
      const second = await model.indexStream(request(context.logPath));
      expect(second).toMatchObject({ recordsIndexed: 1, rebuilt: false, lastSequence: 3 });
      expect(second.rebuildReason).toBeUndefined();
      expect(count(model.database)).toBe(3);
      expect(sum(model.database)).toBe(60);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("indexing twice does not duplicate rows or advance totals", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const model = await context.open();
      await model.indexStream(request(context.logPath));

      const again = await model.indexStream(request(context.logPath));
      expect(again).toMatchObject({ recordsIndexed: 0, rebuilt: false });
      expect(count(model.database)).toBe(2);
      expect(sum(model.database)).toBe(30);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("resumes from the stored offset after a close and reopen", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10));
      const first = await context.open();
      await first.indexStream(request(context.logPath));
      const offset = first.health().streams[0]!.byteOffset;
      first.close();

      await appendFile(context.logPath, line(2, 20));
      const second = await context.open();
      const result = await second.indexStream(request(context.logPath));
      expect(result).toMatchObject({ recordsIndexed: 1, rebuilt: false, lastSequence: 2 });
      expect(second.health().streams[0]!.byteOffset).toBeGreaterThan(offset);
      expect(count(second.database)).toBe(2);
      second.close();
    } finally {
      await context.cleanup();
    }
  });

  test("commits across several batches and reports progress in health", async () => {
    const context = await fixture();
    try {
      let text = "";
      for (let sequence = 1; sequence <= 25; sequence += 1) text += line(sequence, 1);
      await appendFile(context.logPath, text);

      const model = await context.open();
      const result = await model.indexStream(request(context.logPath, { batchBytes: 400 }));
      expect(result.recordsIndexed).toBe(25);
      expect(count(model.database)).toBe(25);

      const status = model.health().streams[0]!;
      expect(status).toMatchObject({ sessionId: SESSION, stream: STREAM, domain: "synthetic", lastSequence: 25 });
      expect(status.byteOffset).toBe((await stat(context.logPath)).size);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("counts unparseable lines without failing the pass", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, `${line(1, 10)}not json\n{"schemaVersion":2}\n${line(2, 20)}`);
      const model = await context.open();
      const result = await model.indexStream(request(context.logPath));
      expect(result).toMatchObject({ recordsIndexed: 2, invalidLines: 2 });
      expect(count(model.database)).toBe(2);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("reports a missing source without disturbing recorded progress", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10));
      const model = await context.open();
      await model.indexStream(request(context.logPath));

      const result = await model.indexStream(request(path.join(context.root, "absent.jsonl"), { domain: "synthetic" }));
      expect(result).toMatchObject({ missing: true, recordsIndexed: 0, rebuilt: false });
      expect(count(model.database)).toBe(1);
      model.close();
    } finally {
      await context.cleanup();
    }
  });
});

describe("stream rebuilds", () => {
  test("rebuilds after the source is truncated", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20) + line(3, 30));
      const model = await context.open();
      await model.indexStream(request(context.logPath));
      expect(count(model.database)).toBe(3);

      await writeFile(context.logPath, line(1, 5));
      const result = await model.indexStream(request(context.logPath));
      expect(result).toMatchObject({ rebuilt: true, rebuildReason: "truncated", recordsIndexed: 1 });
      expect(count(model.database)).toBe(1);
      expect(sum(model.database)).toBe(5);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("rebuilds when a different file replaces the same path", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const model = await context.open();
      await model.indexStream(request(context.logPath));

      // A longer file from another session: size grows, so only the fingerprint reveals the swap.
      await writeFile(context.logPath, line(1, 1, "20260202T000000000Z-0000beef") + line(2, 2, "20260202T000000000Z-0000beef") + line(3, 3, "20260202T000000000Z-0000beef"));
      const result = await model.indexStream(request(context.logPath));
      expect(result).toMatchObject({ rebuilt: true, rebuildReason: "replaced", recordsIndexed: 3 });
      expect(count(model.database)).toBe(3);
      expect(sum(model.database)).toBe(6);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("rebuilds when sequence numbers rewind without the file shrinking", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20) + line(3, 30));
      const model = await context.open();
      await model.indexStream(request(context.logPath));

      // The file grows and its first line is untouched, so only the sequence reveals the rewind.
      await appendFile(context.logPath, line(1, 99));
      const result = await model.indexStream(request(context.logPath));
      expect(result).toMatchObject({ rebuilt: true, rebuildReason: "sequence-regression", recordsIndexed: 3 });
      // The re-read starts from byte 0, so the still-rewound trailing record is counted and skipped
      // rather than triggering another rebuild.
      expect(result.invalidLines).toBe(1);
      expect(count(model.database)).toBe(3);
      expect(sum(model.database)).toBe(60);
      model.close();
    } finally {
      await context.cleanup();
    }
  });

  test("leaves the canonical log untouched through every rebuild", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const before = await readFile(context.logPath);
      const modifiedBefore = (await stat(context.logPath)).mtimeMs;

      const model = await context.open();
      await model.indexStream(request(context.logPath));
      await model.indexStream(request(context.logPath));
      model.close();

      const reopened = await context.open([syntheticDomain(2)]);
      await reopened.indexStream(request(context.logPath));
      reopened.close();

      expect(await readFile(context.logPath)).toEqual(before);
      expect((await stat(context.logPath)).mtimeMs).toBe(modifiedBefore);
    } finally {
      await context.cleanup();
    }
  });
});

describe("database rebuilds", () => {
  test("a domain version bump re-indexes only that domain", async () => {
    const context = await fixture();
    try {
      const model = await context.open([syntheticDomain(1), otherDomain()]);
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      await model.indexStream(request(context.logPath));
      await model.indexStream(request(context.logPath, { domain: "other", apply: () => {}, clear: () => {} }));
      expect(model.health().streams).toHaveLength(2);
      model.close();

      context.rebuilds.length = 0;
      const bumped = await context.open([syntheticDomain(2), otherDomain()]);
      expect(context.rebuilds).toEqual([{ reason: "domain-version", domain: "synthetic", detail: "version 1 -> 2" }]);

      const streams = bumped.health().streams;
      expect(streams).toHaveLength(1);
      expect(streams[0]!.domain).toBe("other");
      expect(count(bumped.database)).toBe(0);

      const reindexed = await bumped.indexStream(request(context.logPath));
      expect(reindexed).toMatchObject({ recordsIndexed: 2, rebuildReason: "new" });
      bumped.close();
    } finally {
      await context.cleanup();
    }
  });

  test("rebuilds the whole database when the infrastructure schema version moves", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10));
      const model = await context.open();
      await model.indexStream(request(context.logPath));
      model.database.query("update read_model_metadata set schema_version = 99 where id = 1").run();
      model.close();

      context.rebuilds.length = 0;
      const reopened = await context.open();
      expect(context.rebuilds[0]).toMatchObject({ reason: "metadata-version" });
      expect(reopened.health().schemaVersion).toBe(1);
      expect(reopened.health().streams).toEqual([]);
      expect(count(reopened.database)).toBe(0);

      await reopened.indexStream(request(context.logPath));
      expect(count(reopened.database)).toBe(1);
      reopened.close();
    } finally {
      await context.cleanup();
    }
  });

  test("recreates a corrupt database and re-indexes from the logs", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const model = await context.open();
      await model.indexStream(request(context.logPath));
      const databasePath = model.path;
      model.close();

      await writeFile(databasePath, "this is not a database, it is garbage");

      context.rebuilds.length = 0;
      const reopened = await context.open();
      expect(context.rebuilds[0]).toMatchObject({ reason: "corrupt" });
      expect(reopened.health().openedWith).toMatchObject({ reason: "corrupt" });

      await reopened.indexStream(request(context.logPath));
      expect(count(reopened.database)).toBe(2);
      expect(sum(reopened.database)).toBe(30);
      reopened.close();
    } finally {
      await context.cleanup();
    }
  });

  test("deleting the database rebuilds it from the logs on the next open", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20));
      const model = await context.open();
      await model.indexStream(request(context.logPath));
      const databasePath = model.path;
      model.close();

      await deleteReadModel(databasePath);
      expect(await Bun.file(databasePath).exists()).toBe(false);

      const reopened = await context.open();
      expect(reopened.health().streams).toEqual([]);
      await reopened.indexStream(request(context.logPath));
      expect(count(reopened.database)).toBe(2);
      expect(sum(reopened.database)).toBe(30);
      reopened.close();
    } finally {
      await context.cleanup();
    }
  });

  test("a failure inside apply rolls back rows and progress together", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, line(1, 10) + line(2, 20) + line(3, 30));
      const model = await context.open();
      const working = request(context.logPath, { batchBytes: 400 });

      let fail = true;
      const failing = request(context.logPath, {
        batchBytes: 400,
        apply(records, database) {
          if (fail && records.some((record) => record.sequence === 3)) throw new Error("synthetic apply failure");
          working.apply(records, database);
        },
      });

      await expect(model.indexStream(failing)).rejects.toThrow("synthetic apply failure");
      // The first batch committed; the failed one left neither rows nor progress behind.
      expect(count(model.database)).toBe(2);
      expect(model.health().streams[0]!.lastSequence).toBe(2);

      fail = false;
      const retry = await model.indexStream(failing);
      expect(retry).toMatchObject({ recordsIndexed: 1, rebuilt: false, lastSequence: 3 });
      expect(count(model.database)).toBe(3);
      expect(sum(model.database)).toBe(60);
      model.close();
    } finally {
      await context.cleanup();
    }
  });
});
