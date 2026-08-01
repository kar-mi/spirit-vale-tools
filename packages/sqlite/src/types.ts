import type { Database } from "bun:sqlite";

import type { LogRecord, LogStream } from "@kar-mi/spirit-vale-tools-logging";

/**
 * A set of tables owned by one domain package. The read model never imports domain code; a domain
 * hands it schema callbacks instead, so combat, rewards, and market stay independent of each other.
 */
export interface ReadModelDomain {
  /** Stable key, e.g. "combat". Scopes rebuilds and indexing progress. */
  readonly name: string;
  /** Bump whenever {@link createSchema} changes; this domain is then dropped and re-indexed. */
  readonly version: number;
  createSchema(database: Database): void;
  dropSchema(database: Database): void;
}

export type RebuildReason =
  /** No database existed yet. */
  | "created"
  /** The file failed an integrity check. */
  | "corrupt"
  /** The file could not be opened or configured at all. */
  | "unreadable"
  /** The infrastructure's own schema version moved. */
  | "metadata-version"
  /** One domain's registered version moved; only that domain is rebuilt. */
  | "domain-version";

export interface ReadModelRebuild {
  reason: RebuildReason;
  /** Set only for a single-domain rebuild; absent when the whole database was recreated. */
  domain?: string;
  detail?: string;
}

export type StreamRebuildReason =
  /** No progress was recorded for this stream yet. */
  | "new"
  /** The source shrank below the recorded offset. */
  | "truncated"
  /** A different file now occupies the same path. */
  | "replaced"
  /** A record arrived at or below the last indexed sequence. */
  | "sequence-regression";

export interface IndexStreamRequest {
  sessionId: string;
  stream: LogStream;
  sourcePath: string;
  /** The domain whose tables {@link apply} writes to. */
  domain: string;
  /**
   * Applies one batch of records. Runs inside the same transaction that advances the recorded byte
   * offset, so rows and progress commit or roll back together.
   */
  apply: (records: readonly LogRecord[], database: Database) => void;
  /** Removes this domain's rows for one session/stream, so a rebuild starts from empty. */
  clear: (scope: { sessionId: string; stream: LogStream }, database: Database) => void;
  /**
   * Most source bytes read — and so most rows applied — per transaction. Defaults to 1 MiB. Each
   * transaction ends on a record boundary, which is what makes an interrupted pass resumable.
   */
  batchBytes?: number;
}

export interface IndexStreamResult {
  sessionId: string;
  stream: LogStream;
  /** The source file does not exist; recorded progress was left untouched. */
  missing: boolean;
  /** The stream was re-read from byte 0. */
  rebuilt: boolean;
  rebuildReason?: StreamRebuildReason;
  recordsIndexed: number;
  /** Lines that were not a valid log record. Counted, never fatal. */
  invalidLines: number;
  byteOffset: number;
  lastSequence: number;
}

export interface IndexedStreamStatus {
  sessionId: string;
  stream: LogStream;
  domain: string;
  sourcePath: string;
  byteOffset: number;
  lastSequence: number;
  sourceSize: number;
  sourceModifiedAt: string;
  indexedAt: string;
}

export interface ReadModelHealth {
  path: string;
  schemaVersion: number;
  createdAt: string;
  lastRebuildAt?: string;
  /** Set when opening the database had to rebuild something. */
  openedWith?: ReadModelRebuild;
  domains: { name: string; version: number }[];
  streams: IndexedStreamStatus[];
}
