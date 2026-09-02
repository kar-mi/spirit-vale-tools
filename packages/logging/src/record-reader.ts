import { isRecord } from "./predicates.ts";
import { parseLogRecord, parseLogStreamHeader } from "./record-codec.ts";
import type { LogRecord, LogStreamHeader } from "./types.ts";

export type DecodedLogLine =
  | { kind: "empty" }
  | { kind: "header"; header: LogStreamHeader }
  | { kind: "record"; record: LogRecord }
  | { kind: "invalid" };

/** Stateful JSONL decoder that keeps v2 stream metadata while accepting legacy v1 records. */
export class LogRecordLineDecoder {
  private header?: LogStreamHeader;

  decode(line: string): DecodedLogLine {
    if (!line.trim()) return { kind: "empty" };
    let value: unknown;
    try {
      value = JSON.parse(line);
    } catch {
      return { kind: "invalid" };
    }

    // Stream headers are the only encoded lines carrying schemaVersion 2. Treat a malformed
    // candidate as invalid instead of silently skipping it as metadata.
    if (isRecord(value) && value["schemaVersion"] === 2) {
      const header = parseLogStreamHeader(value);
      if (!header) return { kind: "invalid" };
      this.header = header;
      return { kind: "header", header };
    }

    const record = parseLogRecord(value, this.header);
    return record ? { kind: "record", record } : { kind: "invalid" };
  }

  reset(): void {
    this.header = undefined;
  }
}

/** Splits a byte stream into lines, recognizing the Unicode BOMs supported by live combat logs. */
export async function* readTextLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  let decoder: TextDecoder | undefined;
  let pending = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      decoder ??= decoderForText(value);
      pending += decoder.decode(value, { stream: true });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";
      yield* lines;
    }
    pending += decoder?.decode() ?? "";
    if (pending) yield pending;
  } finally {
    reader.releaseLock();
  }
}

/** Decoder selection shared by incremental readers that need the same BOM behavior. */
export function decoderForText(firstChunk: Uint8Array): TextDecoder {
  if (firstChunk[0] === 0xff && firstChunk[1] === 0xfe) return new TextDecoder("utf-16le");
  if (firstChunk[0] === 0xfe && firstChunk[1] === 0xff) return new TextDecoder("utf-16be");
  return new TextDecoder("utf-8");
}
