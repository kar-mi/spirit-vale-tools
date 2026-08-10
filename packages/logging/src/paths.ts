import path from "node:path";

import type { LogStream } from "./types.ts";

export function defaultLogDirectory(workingDirectory = process.cwd()): string {
  return path.resolve(workingDirectory, "logs");
}

export function streamCategoryDirectory(stream: LogStream, logDirectory = defaultLogDirectory()): string {
  return path.join(logDirectory, stream);
}

export function streamSessionPath(stream: LogStream, sessionId: string, logDirectory = defaultLogDirectory()): string {
  return path.join(streamCategoryDirectory(stream, logDirectory), `${sessionId}.jsonl`);
}

export function currentStreamPointerPath(stream: LogStream, logDirectory = defaultLogDirectory()): string {
  return path.join(logDirectory, "current", `${stream}.json`);
}
