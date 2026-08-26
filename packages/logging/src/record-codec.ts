import { isRecord } from "./predicates.ts";
import type { JsonObject, LogRecord, LogStream, LogStreamHeader } from "./types.ts";

/** On-disk record encoding. */
const V2_SEQUENCE_KEY = "seq";
const V2_TIMESTAMP_KEY = "at";

/** Encodes one record from its parts. */
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

/** Decodes one line's parsed JSON into a record, accepting both encodings. */
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
  return value === "capture" || value === "combat"
    || value === "rewards" || value === "other";
}
