import { isRecord } from "./predicates.ts";
import type { JsonObject, LogRecord, LogStream, LogStreamHeader } from "./types.ts";

/**
 * On-disk record encoding.
 *
 * v1 wrote the full envelope on every line:
 * `{"schemaVersion":1,"sessionId":"…","sequence":3,"recordedAt":"2026-08-07T00:39:10.719Z",
 *   "source":"desktop-capture","type":"combat.event","data":{…}}`
 *
 * Of that, `schemaVersion`, `sessionId` and `source` never varied within a file and were already
 * recorded in `session.json`; `recordedAt` spent 24 bytes on an ISO string for a value every reader
 * immediately `Date.parse`d back to a number. Across 130 real combat logs that was 34% of the bytes
 * on disk. v2 keeps only what varies:
 * `{"seq":3,"at":1754526750719,"type":"combat.event","data":{…}}`
 *
 * `type` stays: it is *not* recoverable from `data`. 743,106 records in those logs carry no
 * `data.kind` at all (packet diagnostics, lifecycle and warning records), so deriving it would be
 * guesswork exactly where it matters.
 *
 * Reading stays backward compatible: {@link parseLogRecord} accepts either shape, so the logs
 * already on disk keep working untouched.
 */
const V2_SEQUENCE_KEY = "seq";
const V2_TIMESTAMP_KEY = "at";

/**
 * Encodes one record from its parts. Takes epoch milliseconds rather than a {@link LogRecord}
 * because this runs once per logged event: the writer already has the clock reading, and formatting
 * it as an ISO string only to parse it straight back would be pure overhead on that path.
 */
export function encodeLogRecord(sequence: number, atMs: number, type: string, data: JsonObject): string {
  return JSON.stringify({
    [V2_SEQUENCE_KEY]: sequence,
    [V2_TIMESTAMP_KEY]: atMs,
    type,
    data,
  });
}

export function encodeLogStreamHeader(header: LogStreamHeader): string {
  return JSON.stringify(header);
}

/** True for the metadata line a v2 stream file opens with, which carries no record of its own. */
export function isLogStreamHeader(value: unknown): value is LogStreamHeader {
  return isRecord(value) && value["schemaVersion"] === 2 && isNonEmptyString(value["sessionId"]);
}

export function parseLogStreamHeader(value: unknown): LogStreamHeader | undefined {
  if (!isLogStreamHeader(value)) return undefined;
  const candidate = value as unknown as Record<string, unknown>;
  if (!isLogStream(candidate["stream"]) || !isNonEmptyString(candidate["producer"])
    || !isIsoDate(candidate["startedAt"])) return undefined;
  return value;
}

/**
 * Decodes one line's parsed JSON into a record, accepting both encodings.
 *
 * `header` supplies the `sessionId` and `source` a v2 line does not carry. It is optional because
 * no consumer reads either field, and an incremental pass resuming from a byte offset never sees
 * the header line; those records decode with both fields empty rather than failing.
 */
export function parseLogRecord(value: unknown, header?: LogStreamHeader): LogRecord | undefined {
  if (!isRecord(value)) return undefined;
  if (value["schemaVersion"] === 1) return parseV1(value);
  if (isLogStreamHeader(value)) return undefined; // The header is not a record.
  return parseV2(value, header);
}

function parseV1(value: Record<string, unknown>): LogRecord | undefined {
  if (!isNonEmptyString(value["sessionId"]) || !isSequence(value["sequence"])) return undefined;
  if (!isIsoDate(value["recordedAt"]) || !isNonEmptyString(value["source"])
    || !isNonEmptyString(value["type"])) return undefined;
  if (!isRecord(value["data"])) return undefined;
  return value as unknown as LogRecord;
}

function parseV2(value: Record<string, unknown>, header?: LogStreamHeader): LogRecord | undefined {
  const sequence = value[V2_SEQUENCE_KEY];
  const at = value[V2_TIMESTAMP_KEY];
  if (!isSequence(sequence) || typeof at !== "number" || !Number.isFinite(at)) return undefined;
  if (!isNonEmptyString(value["type"]) || !isRecord(value["data"])) return undefined;
  return {
    schemaVersion: 2,
    sessionId: header?.sessionId ?? "",
    sequence,
    recordedAt: new Date(at).toISOString(),
    source: header?.producer ?? "",
    type: value["type"],
    data: value["data"] as JsonObject,
  };
}

function isSequence(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 1;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isIsoDate(value: unknown): value is string {
  return isNonEmptyString(value) && Number.isFinite(Date.parse(value));
}

function isLogStream(value: unknown): value is LogStream {
  return value === "capture" || value === "combat" || value === "market"
    || value === "rewards" || value === "other";
}
