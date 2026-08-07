import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { JsonLinesLogger, activateLogSession, createLogSession, defaultLogDirectory, isLogStreamHeader, parseLogRecord, parseLogStreamHeader, readCurrentLogStream, sessionStreamPath } from "./index.ts";
import type { LogRecord } from "./types.ts";

/**
 * Decodes a stream file's records the way a reader does: v2 opens with a header line that carries
 * no record, so tests assert on decoded records rather than on raw lines.
 */
function decodeRecords(text: string): LogRecord[] {
  const records: LogRecord[] = [];
  let header;
  for (const line of text.trimEnd().split("\n")) {
    if (!line.trim()) continue;
    const value: unknown = JSON.parse(line);
    if (isLogStreamHeader(value)) {
      header = parseLogStreamHeader(value);
      if (!header) throw new Error(`malformed stream header: ${line}`);
      continue;
    }
    const record = parseLogRecord(value, header);
    if (!record) throw new Error(`undecodable line: ${line}`);
    records.push(record);
  }
  return records;
}

function decodeSequences(text: string): number[] {
  return decodeRecords(text).map((record) => record.sequence);
}

describe("shared JSON logger", () => {
  test("defaults to a logs folder under the working directory", () => {
    const root = path.resolve("synthetic-run");
    expect(defaultLogDirectory(root)).toBe(path.join(root, "logs"));
  });

  test("creates an isolated session and current stream pointer", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const session = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      session.logger("combat").log("combat.event", { actorId: 7, sourceLabel: "Training Strike" });
      await session.close();
      const current = await readCurrentLogStream("combat", root);
      expect(current?.sessionId).toBe(session.id);
      const [record] = decodeRecords(await Bun.file(current!.path).text());
      expect(record).toMatchObject({ schemaVersion: 2, sequence: 1, type: "combat.event", sessionId: session.id, source: "synthetic-test" });
      expect(session.id).toMatch(/^\d{8}T\d{9}Z-[0-9a-f]{8}$/);

      const nextSession = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      await nextSession.close();
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(nextSession.id);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("can create a session without activating it, then activate several streams together later", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const firstSession = await createLogSession({ producer: "synthetic-test", streams: ["combat", "rewards"], logDirectory: root });

      const secondSession = await createLogSession({
        producer: "synthetic-test",
        streams: ["combat", "rewards"],
        logDirectory: root,
        activate: false,
      });
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(firstSession.id);
      expect((await readCurrentLogStream("rewards", root))?.sessionId).toBe(firstSession.id);

      await activateLogSession(secondSession, ["combat", "rewards"], root);
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(secondSession.id);
      expect((await readCurrentLogStream("rewards", root))?.sessionId).toBe(secondSession.id);

      await firstSession.close();
      await secondSession.close();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("rejects records outside the versioned envelope", () => {
    expect(parseLogRecord({ kind: "damage", tick: 1 })).toBeUndefined();
  });

  // batchBytes: 1 puts each record in its own batch, so this still exercises "a failed write does
  // not stop the next one" now that the writer batches records together.
  test("continues queued writes after reporting an append failure", async () => {
    const appended: string[] = [];
    const failures: string[] = [];
    let attempts = 0;
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "combat",
      batchBytes: 1,
      append: async (_path, data) => {
        attempts += 1;
        if (attempts === 1) throw new Error("synthetic write failure");
        appended.push(String(data));
      },
      onWriteError: ({ stream, error }) => failures.push(`${stream}:${error.message}`),
    });

    logger.log("combat.event", { value: 1 });
    logger.log("combat.event", { value: 2 });
    await expect(logger.close()).rejects.toThrow("synthetic write failure");

    expect(failures).toEqual(["combat:synthetic write failure"]);
    expect(appended).toHaveLength(1);
    expect(decodeRecords(appended[0]!)).toMatchObject([{ sequence: 2, data: { value: 2 } }]);
  });

  test("reports only the first failure even when later batches keep failing", async () => {
    const failures: string[] = [];
    let attempts = 0;
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "market",
      batchBytes: 1,
      append: async () => { throw new Error(`failure ${++attempts}`); },
      onWriteError: ({ error }) => failures.push(error.message),
    });

    for (let index = 0; index < 4; index += 1) logger.log("market.event", { index });
    await expect(logger.close()).rejects.toThrow("failure 1");

    expect(attempts).toBe(4);
    expect(failures).toEqual(["failure 1"]);
    expect(logger.stats().failed).toBe(true);
  });

  test("preserves record order across many batches", async () => {
    const appended: string[] = [];
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "market",
      batchBytes: 200,
      append: async (_path, data) => {
        await Promise.resolve();
        appended.push(String(data));
      },
    });

    for (let index = 1; index <= 40; index += 1) logger.log("market.event", { index });
    await logger.close();

    expect(appended.length).toBeGreaterThan(1);
    expect(decodeSequences(appended.join(""))).toEqual(Array.from({ length: 40 }, (_value, index) => index + 1));
  });

  test("stays ordered when records arrive during an in-flight flush", async () => {
    const appended: string[] = [];
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "market",
      batchBytes: 1,
      append: async (_path, data) => {
        await Bun.sleep(1);
        appended.push(String(data));
      },
    });

    logger.log("market.event", { index: 1 });
    const flushing = logger.flush();
    logger.log("market.event", { index: 2 });
    logger.log("market.event", { index: 3 });
    await flushing;
    await logger.close();

    expect(decodeSequences(appended.join(""))).toEqual([1, 2, 3]);
  });

  test("writes a partial batch on the flush timer without flush() or close()", async () => {
    const appended: string[] = [];
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "market",
      flushIntervalMs: 5,
      append: async (_path, data) => { appended.push(String(data)); },
    });

    logger.log("market.event", { index: 1 });
    expect(appended).toHaveLength(0);
    await Bun.sleep(40);
    expect(appended).toHaveLength(1);
    await logger.close();
  });

  test("flush() makes earlier records durable and leaves the logger usable", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const session = await createLogSession({ producer: "synthetic-test", streams: ["rewards"], logDirectory: root });
      session.logger("rewards").log("rewards.event", { index: 1 });
      await session.flush();
      const afterFlush = await Bun.file(sessionStreamPath(session.id, "rewards", root)).text();
      expect(decodeSequences(afterFlush)).toEqual([1]);

      session.logger("rewards").log("rewards.event", { index: 2 });
      await session.close();
      const afterClose = await Bun.file(sessionStreamPath(session.id, "rewards", root)).text();
      expect(decodeSequences(afterClose)).toEqual([1, 2]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("never buffers past the byte cap, and accepts records again once the queue drains", async () => {
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => { release = resolve; });
    const failures: string[] = [];
    const appended: string[] = [];
    const maxBufferedBytes = 2_000;
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "market",
      batchBytes: 1,
      maxBufferedBytes,
      append: async (_path, data) => {
        await blocked;
        appended.push(String(data));
      },
      onWriteError: ({ error }) => failures.push(error.message),
    });

    for (let index = 0; index < 200; index += 1) {
      logger.log("market.event", { index, filler: "x".repeat(64) });
      expect(logger.stats().bufferedBytes).toBeLessThanOrEqual(maxBufferedBytes);
    }
    const stalled = logger.stats();
    expect(stalled.droppedRecords).toBeGreaterThan(0);
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain("log buffer exceeded");

    release();
    await logger.flush();
    expect(logger.stats().bufferedBytes).toBe(0);

    logger.log("market.event", { index: "after-recovery" });
    await logger.flush();
    expect(logger.stats().droppedRecords).toBe(stalled.droppedRecords);
    expect(appended.join("")).toContain("after-recovery");
  });

  test("sanitizes combat records on the batched path and skips sequence numbers for dropped types", async () => {
    const appended: string[] = [];
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "combat",
      append: async (_path, data) => { appended.push(String(data)); },
    });

    logger.log("combat.event", { kind: "damage", actorId: 7, value: 42, accountId: "secret" });
    logger.log("combat.warning", { message: "diagnostic only" });
    logger.log("combat.event", { kind: "damage", actorId: 7, value: 43 });
    await logger.close();

    const records = decodeRecords(appended.join(""));
    expect(records.map((record) => record.sequence)).toEqual([1, 2]);
    expect(records[0]!.data).toEqual({ kind: "damage", actorId: 7, value: 42 });
  });

  test("activateLogSession makes the session's records durable before flipping pointers", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const session = await createLogSession({
        producer: "synthetic-test",
        streams: ["combat"],
        logDirectory: root,
        activate: false,
      });
      session.logger("combat").log("combat.actorIdentity", { kind: "identity", actorId: 7, displayName: "Seeded" });

      await activateLogSession(session, ["combat"], root);

      const current = await readCurrentLogStream("combat", root);
      expect(current?.sessionId).toBe(session.id);
      const text = await Bun.file(current!.path).text();
      expect(decodeRecords(text)).toMatchObject([{ sequence: 1, data: { displayName: "Seeded" } }]);
      await session.close();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("still honours an outputPaths override when batching", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const target = path.join(root, "custom-output.jsonl");
      const session = await createLogSession({
        producer: "synthetic-test",
        streams: ["capture"],
        logDirectory: root,
        outputPaths: { capture: target },
      });
      session.logger("capture").log("capture.lifecycle", { state: "started" });
      await session.close();

      expect(decodeRecords(await Bun.file(target).text())).toMatchObject([{ sequence: 1, type: "capture.lifecycle" }]);
      expect(await readCurrentLogStream("capture", root)).toBeUndefined();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("accepts an outputPaths override with no directory component", async () => {
    // An output path with no directory component makes path.dirname() return ".", and Bun on
    // Windows rejects mkdir(".", { recursive: true }) with EEXIST despite the flag - "./" fails
    // as ENOENT.
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    const previousCwd = process.cwd();
    try {
      process.chdir(root);
      for (const target of ["bare-output.jsonl", "./dot-slash-output.jsonl"]) {
        const session = await createLogSession({
          producer: "synthetic-test",
          streams: ["capture"],
          logDirectory: root,
          outputPaths: { capture: target },
        });
        session.logger("capture").log("capture.lifecycle", { state: "started" });
        await session.close();
        expect(decodeRecords(await Bun.file(target).text())).toMatchObject([{ type: "capture.lifecycle" }]);
      }
    } finally {
      process.chdir(previousCwd);
      await rm(root, { recursive: true, force: true });
    }
  });
});
