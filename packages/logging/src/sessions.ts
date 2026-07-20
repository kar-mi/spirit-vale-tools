import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { currentStreamPointerPath, defaultLogDirectory } from "./paths.ts";
import { isMissing, isRecord } from "./predicates.ts";
import type { CurrentLogStream, ListedLogSession, LogSessionMetadata, LogStream } from "./types.ts";

export async function listLogSessions(
  stream: LogStream,
  logDirectory = defaultLogDirectory(),
  limit = 25,
): Promise<ListedLogSession[]> {
  if (!Number.isSafeInteger(limit) || limit < 0) throw new RangeError("session limit must be a non-negative integer");
  const sessionsRoot = path.resolve(logDirectory, "sessions");
  let entries;
  try {
    entries = await readdir(sessionsRoot, { withFileTypes: true });
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }

  const current = await readCurrentPointer(stream, logDirectory);
  const sessions = await Promise.all(entries.map(async (entry): Promise<ListedLogSession | undefined> => {
    if (!entry.isDirectory() || entry.isSymbolicLink()) return undefined;
    const directory = path.join(sessionsRoot, entry.name);
    const metadataPath = path.join(directory, "session.json");
    const streamPath = path.join(directory, `${stream}.jsonl`);
    try {
      const [directoryInfo, metadataInfo, streamInfo, source] = await Promise.all([
        lstat(directory),
        lstat(metadataPath),
        lstat(streamPath),
        readFile(metadataPath, "utf8"),
      ]);
      if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()
        || !metadataInfo.isFile() || metadataInfo.isSymbolicLink()
        || !streamInfo.isFile() || streamInfo.isSymbolicLink()) return undefined;
      const metadata = parseSessionMetadata(JSON.parse(source));
      if (!metadata || metadata.sessionId !== entry.name || !metadata.streams.includes(stream)) return undefined;
      return {
        id: metadata.sessionId,
        createdAt: metadata.createdAt,
        path: streamPath,
        active: current?.sessionId === metadata.sessionId && current.path === path.resolve(streamPath),
      };
    } catch {
      return undefined;
    }
  }));

  return sessions
    .filter((session): session is ListedLogSession => session !== undefined)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt) || right.id.localeCompare(left.id))
    .slice(0, limit);
}

function parseSessionMetadata(value: unknown): LogSessionMetadata | undefined {
  if (!isRecord(value) || value["schemaVersion"] !== 1 || typeof value["sessionId"] !== "string"
    || value["sessionId"].length === 0 || typeof value["producer"] !== "string" || value["producer"].length === 0
    || typeof value["createdAt"] !== "string" || !Number.isFinite(Date.parse(value["createdAt"]))
    || !Array.isArray(value["streams"]) || !value["streams"].every(isLogStream)) return undefined;
  return value as unknown as LogSessionMetadata;
}

async function readCurrentPointer(
  stream: LogStream,
  logDirectory: string,
): Promise<(CurrentLogStream & { path: string }) | undefined> {
  try {
    const value: unknown = JSON.parse(await readFile(currentStreamPointerPath(stream, logDirectory), "utf8"));
    if (!isRecord(value) || value["schemaVersion"] !== 1 || value["stream"] !== stream
      || typeof value["sessionId"] !== "string" || typeof value["startedAt"] !== "string"
      || !Number.isFinite(Date.parse(value["startedAt"])) || typeof value["relativePath"] !== "string") return undefined;
    const resolved = path.resolve(logDirectory, value["relativePath"]);
    const root = `${path.resolve(logDirectory)}${path.sep}`;
    if (!resolved.startsWith(root)) return undefined;
    return { ...(value as unknown as CurrentLogStream), path: resolved };
  } catch { return undefined; }
}

function isLogStream(value: unknown): value is LogStream {
  return value === "capture" || value === "combat" || value === "market" || value === "rewards" || value === "other";
}
