export type LogStream = "capture" | "combat" | "market" | "rewards";
export type JsonData = null | boolean | number | string | JsonData[] | JsonObject;
export interface JsonObject { [key: string]: JsonData | undefined }

export interface LogRecord<T extends JsonObject = JsonObject> {
  schemaVersion: 1;
  sessionId: string;
  sequence: number;
  recordedAt: string;
  source: string;
  type: string;
  data: T;
}

export interface LogSessionMetadata {
  schemaVersion: 1;
  sessionId: string;
  producer: string;
  createdAt: string;
  streams: LogStream[];
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
  directory: string;
  logger(stream: LogStream): JsonLinesLogger;
  close(): Promise<void>;
}

import type { JsonLinesLogger } from "./logger.ts";
