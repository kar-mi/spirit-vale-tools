export type LogStream = "capture" | "combat" | "market" | "rewards" | "other";
export type JsonData = null | boolean | number | string | JsonData[] | JsonObject;
export interface JsonObject { [key: string]: JsonData | undefined }

/** A decoded record, in the shape every consumer sees regardless of how it was stored. */
export interface LogRecord<T extends JsonObject = JsonObject> {
  schemaVersion: 1 | 2;
  sessionId: string;
  sequence: number;
  recordedAt: string;
  source: string;
  type: string;
  data: T;
}

/** First line of a v2 stream file, carrying what v1 repeated on every record. */
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
