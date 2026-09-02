import { describe, expect, test } from "bun:test";

import { encodeLogRecord, encodeLogStreamHeader } from "./record-codec.ts";
import { LogRecordLineDecoder, readTextLines } from "./record-reader.ts";

describe("LogRecordLineDecoder", () => {
  test("retains a valid header for following v2 records", () => {
    const decoder = new LogRecordLineDecoder();
    const header = {
      schemaVersion: 2 as const,
      stream: "market" as const,
      sessionId: "fictional-session",
      producer: "synthetic-producer",
      startedAt: "2026-01-01T00:00:00.000Z",
    };
    expect(decoder.decode(encodeLogStreamHeader(header))).toEqual({ kind: "header", header });
    expect(decoder.decode(encodeLogRecord(1, 1_000, "market.event", {}))).toMatchObject({
      kind: "record",
      record: { sessionId: "fictional-session", source: "synthetic-producer", sequence: 1 },
    });
  });

  test("distinguishes blank, malformed-header, and malformed-record lines", () => {
    const decoder = new LogRecordLineDecoder();
    expect(decoder.decode("  ")).toEqual({ kind: "empty" });
    expect(decoder.decode(JSON.stringify({ schemaVersion: 2, stream: "market" }))).toEqual({ kind: "invalid" });
    expect(decoder.decode("{")).toEqual({ kind: "invalid" });
  });
});

test("readTextLines decodes UTF-16LE streams", async () => {
  const bytes = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from("first\nsecond", "utf16le")]);
  const lines: string[] = [];
  for await (const line of readTextLines(new Blob([bytes]).stream())) lines.push(line);
  expect(lines).toEqual(["first", "second"]);
});
