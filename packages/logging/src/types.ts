export type LogStream = "capture" | "combat" | "market" | "rewards" | "other";
export type JsonData = null | boolean | number | string | JsonData[] | JsonObject;
export interface JsonObject { [key: string]: JsonData | undefined }

/**
 * A decoded record, in the shape every consumer sees regardless of how it was stored.
 *
 * `schemaVersion` is the version the line was *read* from, not a property of this object: v1 wrote
 * the whole envelope on every line, v2 writes only what varies per record and recovers the rest
 * from the stream header. See {@link LogStreamHeader}.
 */
export interface LogRecord<T extends JsonObject = JsonObject> {
  schemaVersion: 1 | 2;
  sessionId: string;
  sequence: number;
  recordedAt: string;
  source: string;
  type: string;
  data: T;
}

/**
 * First line of a v2 stream file, carrying what v1 repeated on every record.
 *
 * Measured over 130 real combat logs, `sessionId`, `source` and `schemaVersion` were 28.2% of the
 * bytes on disk while being byte-identical on every line. This line keeps a stream file
 * self-describing when it is read on its own, without that cost — it is the sole record of a
 * session's metadata, since sessions have no separate metadata file of their own.
 *
 * Nothing downstream reads `sessionId` or `source` off a record, so a reader that starts partway
 * through a file (an incremental indexing pass resuming from a byte offset) can decode records
 * without ever having seen this line. That is why `recordedAt` is stored per record as absolute
 * epoch milliseconds rather than as an offset from `startedAt`.
 */
export interface LogStreamHeader {
  schemaVersion: 2;
  stream: LogStream;
  sessionId: string;
  producer: string;
  startedAt: string;
}

export interface ListedLogSession {
  id: string;
  createdAt: string;
  path: string;
  active: boolean;
}

export interface CurrentLogStream {
  schemaVersion: 1;
  stream: LogStream;
  sessionId: string;
  startedAt: string;
  relativePath: string;
}

export interface LogSession {
  id: string;
  logger(stream: LogStream): JsonLinesLogger;
  /** Resolves once every record logged before this call has reached the disk on every stream. */
  flush(): Promise<void>;
  close(): Promise<void>;
}

import type { JsonLinesLogger } from "./logger.ts";
