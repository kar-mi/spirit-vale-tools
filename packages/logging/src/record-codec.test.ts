import { describe, expect, test } from "bun:test";

import {
  encodeLogRecord,
  encodeLogStreamHeader,
  isLogStreamHeader,
  parseLogRecord,
  parseLogStreamHeader,
} from "./record-codec.ts";
import type { LogStreamHeader } from "./types.ts";

const HEADER: LogStreamHeader = {
  schemaVersion: 2,
  stream: "combat",
  sessionId: "20260807T003906294Z-57d0c15e",
  producer: "desktop-capture",
  startedAt: "2026-08-07T00:39:06.302Z",
};

/** A v1 line exactly as the logs already on disk hold it. */
const V1_LINE = {
  schemaVersion: 1,
  sessionId: "20260807T003906294Z-57d0c15e",
  sequence: 3,
  recordedAt: "2026-08-07T00:39:10.719Z",
  source: "desktop-capture",
  type: "combat.event",
  data: { kind: "activation", tick: 448_924, actorId: 41_513 },
};

describe("log record encoding", () => {
  test("reads a v1 record unchanged", () => {
    // The 944MB of logs already recorded stay readable; nothing about them is rewritten.
    expect(parseLogRecord(V1_LINE)).toMatchObject({
      schemaVersion: 1,
      sessionId: "20260807T003906294Z-57d0c15e",
      sequence: 3,
      recordedAt: "2026-08-07T00:39:10.719Z",
      source: "desktop-capture",
      type: "combat.event",
    });
  });

  test("round-trips a v2 record through the header", () => {
    const line = encodeLogRecord(3, Date.parse("2026-08-07T00:39:10.719Z"), "combat.event", V1_LINE.data);
    const record = parseLogRecord(JSON.parse(line), HEADER);
    expect(record).toEqual({
      schemaVersion: 2,
      sessionId: HEADER.sessionId,
      sequence: 3,
      recordedAt: "2026-08-07T00:39:10.719Z",
      source: HEADER.producer,
      type: "combat.event",
      data: V1_LINE.data,
    });
  });

  test("decodes a v2 record without a header, because nothing downstream reads those fields", () => {
    // An incremental pass resuming from a byte offset never sees the header line, so a record has to decode without it.
    const line = encodeLogRecord(3, Date.parse("2026-08-07T00:39:10.719Z"), "combat.event", V1_LINE.data);
    expect(parseLogRecord(JSON.parse(line))).toMatchObject({
      sequence: 3,
      recordedAt: "2026-08-07T00:39:10.719Z",
      sessionId: "",
      source: "",
    });
  });

  test("a v2 record is materially smaller than the v1 line it replaces", () => {
    const v2 = encodeLogRecord(3, Date.parse(V1_LINE.recordedAt), V1_LINE.type, V1_LINE.data);
    const v1 = JSON.stringify(V1_LINE);
    expect(v2.length).toBeLessThan(v1.length * 0.7);
  });

  test("recognises the stream header and refuses to treat it as a record", () => {
    const parsed: unknown = JSON.parse(encodeLogStreamHeader(HEADER));
    expect(isLogStreamHeader(parsed)).toBe(true);
    expect(parseLogStreamHeader(parsed)).toEqual(HEADER);
    // Readers skip it explicitly; decoding it must not invent a record.
    expect(parseLogRecord(parsed)).toBeUndefined();
  });

  test("rejects a header whose fields are malformed", () => {
    expect(parseLogStreamHeader({ ...HEADER, stream: "not-a-stream" })).toBeUndefined();
    expect(parseLogStreamHeader({ ...HEADER, startedAt: "whenever" })).toBeUndefined();
    expect(parseLogStreamHeader({ ...HEADER, producer: "" })).toBeUndefined();
  });

  test("rejects records that are not records", () => {
    expect(parseLogRecord({ kind: "damage", tick: 1 })).toBeUndefined();
    expect(parseLogRecord({ seq: 0, at: 1, type: "combat.event", data: {} })).toBeUndefined();
    expect(parseLogRecord({ seq: 1, at: Number.NaN, type: "combat.event", data: {} })).toBeUndefined();
    expect(parseLogRecord({ seq: 1, at: 1, type: "", data: {} })).toBeUndefined();
    expect(parseLogRecord({ seq: 1, at: 1, type: "combat.event" })).toBeUndefined();
    expect(parseLogRecord(undefined)).toBeUndefined();
  });
});
