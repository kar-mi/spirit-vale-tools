import { stat } from "node:fs/promises";

import { JsonlTailReader, isLogStreamHeader, isMissing, parseLogRecord } from "@kar-mi/spirit-vale-tools-logging";
import type { Database } from "bun:sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";

import { fingerprintSource } from "./fingerprint.ts";
import type { IndexedStreamRow } from "./schema.ts";
import type { IndexStreamRequest, IndexStreamResult, StreamRebuildReason } from "./types.ts";

const DEFAULT_BATCH_BYTES = 1024 * 1024;

type Transactional = <T>(run: () => T) => T;

interface SourceInfo {
  size: number;
  modifiedAt: string;
  fingerprint?: string;
}

/** Indexes whatever the source has gained since the recorded byte offset, rebuilding the stream from scratch when the source was truncated, replaced, or rewound. */
export async function indexStream(
  database: Database,
  request: IndexStreamRequest,
  transaction: Transactional,
): Promise<IndexStreamResult> {
  const { sessionId, stream, domain, sourcePath } = request;
  const batchBytes = request.batchBytes ?? DEFAULT_BATCH_BYTES;
  if (!Number.isSafeInteger(batchBytes) || batchBytes < 1) throw new RangeError("batchBytes must be a positive integer");

  const row = selectProgress(database, sessionId, stream, domain);

  let size: number;
  let modifiedAt: string;
  try {
    const info = await stat(sourcePath);
    size = info.size;
    modifiedAt = info.mtime.toISOString();
  } catch (error) {
    if (!isMissing(error)) throw error;
    return unchanged(request, row, { missing: true });
  }

  // Everything already consumed and the file untouched since: nothing to read, nothing to verify.
  if (row && row.byte_offset === size && row.source_modified_at === modifiedAt) {
    return unchanged(request, row, { missing: false });
  }

  const source: SourceInfo = { size, modifiedAt, fingerprint: await fingerprintSource(sourcePath) };
  const reason = decideRebuild(row, source);

  if (reason && reason !== "new") rebuild(database, request, source, transaction);

  const pass = await indexFrom(database, request, startOf(reason, row), source, batchBytes, transaction);
  if (!pass.regressed) {
    return {
      sessionId, stream, missing: false,
      rebuilt: reason !== undefined && reason !== "new",
      ...(reason ? { rebuildReason: reason } : {}),
      recordsIndexed: pass.recordsIndexed, invalidLines: pass.invalidLines,
      byteOffset: pass.byteOffset, lastSequence: pass.lastSequence,
    };
  }

  // A record at or below the last indexed sequence means the file was rewound underneath us.
  rebuild(database, request, source, transaction);
  const retry = await indexFrom(database, request, { byteOffset: 0, lastSequence: 0 }, source, batchBytes, transaction, false);
  return {
    sessionId, stream, missing: false, rebuilt: true, rebuildReason: "sequence-regression",
    recordsIndexed: retry.recordsIndexed, invalidLines: retry.invalidLines,
    byteOffset: retry.byteOffset, lastSequence: retry.lastSequence,
  };
}

interface Position {
  byteOffset: number;
  lastSequence: number;
}

interface PassResult extends Position {
  recordsIndexed: number;
  invalidLines: number;
  regressed: boolean;
}

async function indexFrom(
  database: Database,
  request: IndexStreamRequest,
  start: Position,
  source: SourceInfo,
  batchBytes: number,
  transaction: Transactional,
  allowRegression = true,
): Promise<PassResult> {
  const reader = new JsonlTailReader(request.sourcePath, { startOffset: start.byteOffset, maxReadBytes: batchBytes });
  let recordsIndexed = 0;
  let invalidLines = 0;
  let lastSequence = start.lastSequence;

  for (;;) {
    const { missing, bytesRead, lines } = await reader.read();
    if (missing || bytesRead === 0) break;

    const batch: LogRecord[] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      let value: unknown;
      try {
        value = JSON.parse(line);
      } catch {
        invalidLines += 1;
        continue;
      }
      // A v2 file opens with a stream header, which carries no record and is not a malformed line.
      if (isLogStreamHeader(value)) continue;
      const record = parseLogRecord(value);
      if (!record) {
        invalidLines += 1;
        continue;
      }
      if (record.sequence <= lastSequence) {
        if (allowRegression) return { recordsIndexed, invalidLines, ...start, regressed: true };
        // Already re-read from byte 0, so a still-rewound record is anomalous data, not a stale offset.
        invalidLines += 1;
        continue;
      }
      lastSequence = record.sequence;
      batch.push(record);
    }

    const position = { byteOffset: reader.offset, lastSequence };
    transaction(() => {
      if (batch.length > 0) invalidLines += request.apply(batch, database) ?? 0;
      writeProgress(database, request, position, source);
    });
    recordsIndexed += batch.length;
  }

  return { recordsIndexed, invalidLines, byteOffset: reader.offset, lastSequence, regressed: false };
}

function decideRebuild(row: IndexedStreamRow | undefined, source: SourceInfo): StreamRebuildReason | undefined {
  if (!row) return "new";
  if (source.size < row.byte_offset) return "truncated";
  // An empty or unreadable source has no fingerprint to compare; truncation already covers that case.
  if (source.fingerprint !== undefined && row.source_fingerprint !== "" && source.fingerprint !== row.source_fingerprint) {
    return "replaced";
  }
  return undefined;
}

function startOf(reason: StreamRebuildReason | undefined, row: IndexedStreamRow | undefined): Position {
  if (reason || !row) return { byteOffset: 0, lastSequence: 0 };
  return { byteOffset: row.byte_offset, lastSequence: row.last_sequence };
}

function rebuild(database: Database, request: IndexStreamRequest, source: SourceInfo, transaction: Transactional): void {
  transaction(() => {
    request.clear({ sessionId: request.sessionId, stream: request.stream }, database);
    writeProgress(database, request, { byteOffset: 0, lastSequence: 0 }, source);
  });
}

function unchanged(
  request: IndexStreamRequest,
  row: IndexedStreamRow | undefined,
  state: { missing: boolean },
): IndexStreamResult {
  return {
    sessionId: request.sessionId,
    stream: request.stream,
    missing: state.missing,
    rebuilt: false,
    recordsIndexed: 0,
    invalidLines: 0,
    byteOffset: row?.byte_offset ?? 0,
    lastSequence: row?.last_sequence ?? 0,
  };
}

function selectProgress(database: Database, sessionId: string, stream: string, domain: string): IndexedStreamRow | undefined {
  return database
    .query<IndexedStreamRow, { sessionId: string; stream: string; domain: string }>(
      "select * from indexed_streams where session_id = $sessionId and stream = $stream and domain = $domain",
    )
    .get({ sessionId, stream, domain }) ?? undefined;
}

function writeProgress(database: Database, request: IndexStreamRequest, position: Position, source: SourceInfo): void {
  database
    .query(`insert or replace into indexed_streams
      (session_id, stream, domain, source_path, source_fingerprint, byte_offset, last_sequence, source_size, source_modified_at, indexed_at)
      values ($sessionId, $stream, $domain, $sourcePath, $fingerprint, $byteOffset, $lastSequence, $size, $modifiedAt, $indexedAt)`)
    .run({
      sessionId: request.sessionId,
      stream: request.stream,
      domain: request.domain,
      sourcePath: request.sourcePath,
      fingerprint: source.fingerprint ?? "",
      byteOffset: position.byteOffset,
      lastSequence: position.lastSequence,
      // The log can grow while a pass runs; recording a size below the offset would look like a truncation on the next call.
      size: Math.max(source.size, position.byteOffset),
      modifiedAt: source.modifiedAt,
      indexedAt: new Date().toISOString(),
    });
}
