import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { Database } from "bun:sqlite";
import type { Statement } from "bun:sqlite";
import { defaultLogDirectory } from "@kar-mi/spirit-vale-tools-logging";
import type { LogStream } from "@kar-mi/spirit-vale-tools-logging";

import { indexStream } from "./indexer.ts";
import { readModelFiles, readModelPath } from "./paths.ts";
import {
  READ_MODEL_SCHEMA_VERSION,
  createMetadataSchema,
  markRebuilt,
  readMetadata,
  writeMetadata,
} from "./schema.ts";
import type { IndexedStreamRow } from "./schema.ts";
import type {
  IndexStreamRequest,
  IndexStreamResult,
  IndexedStreamStatus,
  ReadModelDomain,
  ReadModelHealth,
  ReadModelRebuild,
} from "./types.ts";

export interface OpenReadModelOptions {
  domains: readonly ReadModelDomain[];
  /** Used to derive the default database path. Defaults to the shared log directory. */
  logDirectory?: string;
  /** Overrides the derived `<logDirectory>/cache/read-model.sqlite` path. */
  path?: string;
  /** Reports each rebuild performed while opening. */
  onRebuild?: (event: ReadModelRebuild) => void;
}

export interface ReadModel {
  readonly path: string;
  readonly database: Database;
  /** Prepared statement, cached for the model's lifetime and finalized by {@link close}. */
  statement(sql: string): Statement;
  /** As {@link statement}, but returns 64-bit integers as bigint instead of rounding them. */
  bigintStatement(sql: string): Statement;
  transaction<T>(run: () => T): T;
  indexStream(request: IndexStreamRequest): Promise<IndexStreamResult>;
  health(): ReadModelHealth;
  close(): void;
}

/** Opens the disposable read model, recreating or repairing whatever is unusable. */
export async function openReadModel(options: OpenReadModelOptions): Promise<ReadModel> {
  const databasePath = options.path ?? readModelPath(options.logDirectory ?? defaultLogDirectory());
  await mkdir(path.dirname(databasePath), { recursive: true });

  const duplicate = findDuplicateDomain(options.domains);
  if (duplicate) throw new Error(`domain ${duplicate} is registered more than once`);

  const rebuilds: ReadModelRebuild[] = [];
  let database = await openDatabase(databasePath, rebuilds);

  createMetadataSchema(database);
  let metadata = readMetadata(database);
  if (metadata && metadata.schema_version !== READ_MODEL_SCHEMA_VERSION) {
    closeQuietly(database);
    await deleteReadModel(databasePath);
    rebuilds.push({
      reason: "metadata-version",
      detail: `stored schema ${metadata.schema_version}, expected ${READ_MODEL_SCHEMA_VERSION}`,
    });
    database = await openDatabase(databasePath, rebuilds, { skipCreatedNotice: true });
    createMetadataSchema(database);
    metadata = undefined;
  }
  if (!metadata) {
    writeMetadata(database, new Date().toISOString());
    metadata = readMetadata(database)!;
  }

  applyDomains(database, options.domains, rebuilds);
  if (rebuilds.length > 0) markRebuilt(database, new Date().toISOString());
  for (const rebuild of rebuilds) options.onRebuild?.(rebuild);

  const statements = new Map<string, Statement>();
  const openedWith = rebuilds[0];

  // Bun allocates BEGIN/COMMIT/ROLLBACK statements per transaction wrapper, so build one wrapper for
  // the connection's lifetime and route every call through it instead of repeatedly preparing them.
  // Re-entering the same wrapper is what lets Bun nest with a savepoint, so a domain may safely start
  // a transaction of its own.
  let pending: (() => unknown) | undefined;
  const runPending = database.transaction(() => pending!());

  const model: ReadModel = {
    path: databasePath,
    database,
    statement(sql) {
      return cached(statements, sql, false, database);
    },
    bigintStatement(sql) {
      return cached(statements, sql, true, database);
    },
    transaction(run) {
      const previous = pending;
      pending = run;
      try {
        return runPending() as ReturnType<typeof run>;
      } finally {
        pending = previous;
      }
    },
    indexStream(request) {
      return indexStream(database, request, (run) => model.transaction(run));
    },
    health() {
      const stored = readMetadata(database)!;
      return {
        path: databasePath,
        schemaVersion: stored.schema_version,
        createdAt: stored.created_at,
        ...(stored.last_rebuild_at ? { lastRebuildAt: stored.last_rebuild_at } : {}),
        ...(openedWith ? { openedWith } : {}),
        domains: database
          .query<{ domain: string; version: number }, []>("select domain, version from read_model_domains order by domain")
          .all()
          .map((row) => ({ name: row.domain, version: row.version })),
        streams: database
          .query<IndexedStreamRow, []>("select * from indexed_streams order by session_id, stream, domain")
          .all()
          .map(toStatus),
      };
    },
    close() {
      for (const statement of statements.values()) statement.finalize();
      statements.clear();
      // Force-finalize anything prepared directly through the exposed Database too. Bun 1.4 owns
      // query() statements, while close(true) also finalizes outstanding prepare() statements.
      database.close(true);
    },
  };
  return model;
}

/** Removes the database and the write-ahead-log sidecars SQLite keeps beside it. */
export async function deleteReadModel(databasePath: string): Promise<void> {
  for (const file of readModelFiles(databasePath)) await rm(file, { force: true });
}

async function openDatabase(
  databasePath: string,
  rebuilds: ReadModelRebuild[],
  options: { skipCreatedNotice?: boolean } = {},
): Promise<Database> {
  const existed = await Bun.file(databasePath).exists();
  let candidate: Database | undefined;
  try {
    candidate = new Database(databasePath, { create: true, strict: true });
    configure(candidate);
    const integrity = candidate.query<{ integrity_check: string }, []>("pragma integrity_check").get();
    if (integrity?.integrity_check !== "ok") {
      throw new Error(`integrity check reported ${integrity?.integrity_check ?? "no result"}`);
    }
    if (!existed && !options.skipCreatedNotice) rebuilds.push({ reason: "created" });
    const opened = candidate;
    candidate = undefined;
    return opened;
  } catch (error) {
    // Releasing the handle first matters on Windows, where an open file cannot be deleted.
    if (candidate) closeQuietly(candidate);
    // Anything unusable is discarded rather than repaired: the canonical logs can rebuild it.
    await deleteReadModel(databasePath);
    rebuilds.push({
      reason: existed ? "corrupt" : "unreadable",
      detail: error instanceof Error ? error.message : String(error),
    });
    const replacement = new Database(databasePath, { create: true, strict: true });
    configure(replacement);
    return replacement;
  }
}

function configure(database: Database): void {
  database.exec("pragma journal_mode = wal");
  database.exec("pragma synchronous = normal");
  database.exec("pragma foreign_keys = on");
}

/** Releases the file handle without masking whatever error prompted the close. */
function closeQuietly(database: Database): void {
  try {
    database.close(true);
  } catch {
    // The handle is being discarded; a failure here has nothing left to report to.
  }
}

function applyDomains(database: Database, domains: readonly ReadModelDomain[], rebuilds: ReadModelRebuild[]): void {
  const stored = new Map(
    database
      .query<{ domain: string; version: number }, []>("select domain, version from read_model_domains")
      .all()
      .map((row) => [row.domain, row.version] as const),
  );

  database.transaction(() => {
    for (const domain of domains) {
      const current = stored.get(domain.name);
      if (current === domain.version) continue;
      if (current !== undefined) {
        domain.dropSchema(database);
        // Progress belongs to the tables that were just dropped, so this domain re-indexes from 0.
        database.query("delete from indexed_streams where domain = $domain").run({ domain: domain.name });
        rebuilds.push({ reason: "domain-version", domain: domain.name, detail: `version ${current} -> ${domain.version}` });
      }
      domain.createSchema(database);
      database
        .query("insert or replace into read_model_domains (domain, version) values ($domain, $version)")
        .run({ domain: domain.name, version: domain.version });
    }
  })();
}

/**
 * `Statement.safeIntegers()` exists at runtime but is absent from bun-types 1.4.0's declarations.
 * The bigint round-trip test in this package fails if that ever stops being true.
 */
interface SafeIntegerStatement {
  safeIntegers(enabled: boolean): void;
}

function cached(statements: Map<string, Statement>, sql: string, bigints: boolean, database: Database): Statement {
  const key = bigints ? `bigint:${sql}` : sql;
  let statement = statements.get(key);
  if (!statement) {
    statement = database.prepare(sql);
    if (bigints) (statement as unknown as SafeIntegerStatement).safeIntegers(true);
    statements.set(key, statement);
  }
  return statement;
}

function findDuplicateDomain(domains: readonly ReadModelDomain[]): string | undefined {
  const seen = new Set<string>();
  for (const domain of domains) {
    if (seen.has(domain.name)) return domain.name;
    seen.add(domain.name);
  }
  return undefined;
}

function toStatus(row: IndexedStreamRow): IndexedStreamStatus {
  return {
    sessionId: row.session_id,
    stream: row.stream as LogStream,
    domain: row.domain,
    sourcePath: row.source_path,
    byteOffset: row.byte_offset,
    lastSequence: row.last_sequence,
    sourceSize: row.source_size,
    sourceModifiedAt: row.source_modified_at,
    indexedAt: row.indexed_at,
  };
}
