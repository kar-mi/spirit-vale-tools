import { lstat, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";

import { currentStreamPointerPath, defaultLogDirectory } from "./paths.ts";
import { isMissing, isRecord } from "./predicates.ts";
import type { CurrentLogStream, ListedLogSession, LogSessionMetadata, LogStream } from "./types.ts";

const ALL_STREAMS: readonly LogStream[] = ["capture", "combat", "market", "rewards", "other"];

/** Sessions kept when a caller does not say otherwise. */
export const DEFAULT_SESSION_RETENTION = 50;

export interface PruneLogSessionsOptions {
  logDirectory?: string;
  /** Newest sessions to keep. Defaults to {@link DEFAULT_SESSION_RETENTION}; 0 disables the cap. */
  keep?: number;
  /** Also remove sessions older than this, however few there are. Omit to prune by count only. */
  maxAgeMs?: number;
  /** Clock seam for tests. */
  now?: () => number;
}

export interface PruneLogSessionsResult {
  /** Session ids whose directories were removed. */
  removed: string[];
  /** Session ids kept only because a stream pointer still refers to them. */
  keptActive: string[];
  /** Sessions that could not be removed; pruning is best effort and never fails a caller. */
  failed: { id: string; reason: string }[];
}

/**
 * Removes old session directories under `<logDirectory>/sessions`.
 *
 * Nothing here prunes on its own — logs are the canonical record and the read model is rebuilt from
 * them — so this exists to stop an install growing without bound (hundreds of sessions and hundreds
 * of megabytes accumulate over a few weeks of play).
 *
 * Deliberately conservative, because it deletes user data:
 * - a session any "current stream" pointer still refers to is never removed, however old;
 * - only directories carrying a valid `session.json` whose id matches the directory name are
 *   considered, so an unrelated directory under `sessions/` is left alone;
 * - symlinks are never followed or removed;
 * - a failure to remove one session is reported, not thrown.
 */
export async function pruneLogSessions(options: PruneLogSessionsOptions = {}): Promise<PruneLogSessionsResult> {
  const logDirectory = options.logDirectory ?? defaultLogDirectory();
  const keep = options.keep ?? DEFAULT_SESSION_RETENTION;
  if (!Number.isSafeInteger(keep) || keep < 0) throw new RangeError("keep must be a non-negative integer");
  if (options.maxAgeMs !== undefined && (!Number.isFinite(options.maxAgeMs) || options.maxAgeMs < 0)) {
    throw new RangeError("maxAgeMs must be a non-negative number");
  }

  const result: PruneLogSessionsResult = { removed: [], keptActive: [], failed: [] };
  const sessionsRoot = path.resolve(logDirectory, "sessions");
  const managed = await listManagedSessions(sessionsRoot);
  if (managed.length === 0) return result;

  const active = new Set<string>();
  for (const stream of ALL_STREAMS) {
    const pointer = await readCurrentPointer(stream, logDirectory);
    if (pointer) active.add(pointer.sessionId);
  }

  // Newest first, so everything past `keep` is the tail to drop.
  managed.sort((left, right) => right.createdAtMs - left.createdAtMs || right.id.localeCompare(left.id));
  const cutoffMs = options.maxAgeMs === undefined
    ? undefined
    : (options.now?.() ?? Date.now()) - options.maxAgeMs;

  for (const [index, session] of managed.entries()) {
    const tooMany = keep > 0 && index >= keep;
    const tooOld = cutoffMs !== undefined && session.createdAtMs < cutoffMs;
    if (!tooMany && !tooOld) continue;
    if (active.has(session.id)) {
      result.keptActive.push(session.id);
      continue;
    }
    try {
      await rm(session.directory, { recursive: true, force: true });
      result.removed.push(session.id);
    } catch (error) {
      result.failed.push({ id: session.id, reason: error instanceof Error ? error.message : String(error) });
    }
  }
  return result;
}

interface ManagedSession {
  id: string;
  directory: string;
  createdAtMs: number;
}

/** Session directories carrying metadata that agrees with their own name; anything else is ignored. */
async function listManagedSessions(sessionsRoot: string): Promise<ManagedSession[]> {
  let entries;
  try {
    entries = await readdir(sessionsRoot, { withFileTypes: true });
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }

  const found = await Promise.all(entries.map(async (entry): Promise<ManagedSession | undefined> => {
    if (!entry.isDirectory() || entry.isSymbolicLink()) return undefined;
    const directory = path.join(sessionsRoot, entry.name);
    try {
      const [directoryInfo, metadataInfo, source] = await Promise.all([
        lstat(directory),
        lstat(path.join(directory, "session.json")),
        readFile(path.join(directory, "session.json"), "utf8"),
      ]);
      if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()
        || !metadataInfo.isFile() || metadataInfo.isSymbolicLink()) return undefined;
      const metadata = parseSessionMetadata(JSON.parse(source));
      if (!metadata || metadata.sessionId !== entry.name) return undefined;
      return { id: metadata.sessionId, directory, createdAtMs: Date.parse(metadata.createdAt) };
    } catch {
      return undefined;
    }
  }));
  return found.filter((session): session is ManagedSession => session !== undefined);
}

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
