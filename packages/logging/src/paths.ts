import path from "node:path";

export function defaultLogDirectory(workingDirectory = process.cwd()): string {
  return path.resolve(workingDirectory, "logs");
}

export function sessionDirectory(sessionId: string, logDirectory = defaultLogDirectory()): string {
  return path.join(logDirectory, "sessions", sessionId);
}

export function sessionStreamPath(sessionId: string, stream: string, logDirectory = defaultLogDirectory()): string {
  return path.join(sessionDirectory(sessionId, logDirectory), `${stream}.jsonl`);
}

export function currentStreamPointerPath(stream: string, logDirectory = defaultLogDirectory()): string {
  return path.join(logDirectory, "current", `${stream}.json`);
}
