import { lstat, open, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { currentStreamPointerPath, defaultLogDirectory, streamCategoryDirectory } from "./paths.ts";
import { isMissing, isRecord } from "./predicates.ts";
import { parseLogStreamHeader } from "./record-codec.ts";
import type { CurrentLogStream, ListedLogSession, LogStream, LogStreamHeader } from "./types.ts";

const HEADER_PROBE_BYTES = 4096;

export async function listLogSessions(
  stream: LogStream,
  logDirectory = defaultLogDirectory(),
  limit = 25,
): Promise<ListedLogSession[]> {
  if (!Number.isSafeInteger(limit) || limit < 0) throw new RangeError("session limit must be a non-negative integer");
  const categoryDirectory = streamCategoryDirectory(stream, logDirectory);
  let entries;
  try {
    entries = await readdir(categoryDirectory, { withFileTypes: true });
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }

  const current = await readCurrentPointer(stream, logDirectory);
  const sessions = await Promise.all(entries.map(async (entry): Promise<ListedLogSession | undefined> => {
    if (!entry.isFile() || entry.isSymbolicLink() || !entry.name.endsWith(".jsonl")) return undefined;
    const sessionId = entry.name.slice(0, -".jsonl".length);
    const filePath = path.join(categoryDirectory, entry.name);
    try {
      const info = await lstat(filePath);
      if (!info.isFile() || info.isSymbolicLink()) return undefined;
      const header = await readHeaderLine(filePath);
      if (header && (header.sessionId !== sessionId || header.stream !== stream)) return undefined;
      const createdAt = header?.startedAt ?? info.mtime.toISOString();
      return {
        id: sessionId,
        createdAt,
        path: filePath,
        active: current?.sessionId === sessionId && current.path === path.resolve(filePath),
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

/** Reads just the first line of a stream file and parses it as a v2 header, without loading the rest. */
async function readHeaderLine(filePath: string): Promise<LogStreamHeader | undefined> {
  let handle;
  try {
    handle = await open(filePath, "r");
  } catch {
    return undefined;
  }
  try {
    const buffer = Buffer.alloc(HEADER_PROBE_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, HEADER_PROBE_BYTES, 0);
    const text = buffer.toString("utf8", 0, bytesRead);
    const newline = text.indexOf("\n");
    const line = newline === -1 ? text : text.slice(0, newline);
    if (!line.trim()) return undefined;
    return parseLogStreamHeader(JSON.parse(line));
  } catch {
    return undefined;
  } finally {
    await handle.close();
  }
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
