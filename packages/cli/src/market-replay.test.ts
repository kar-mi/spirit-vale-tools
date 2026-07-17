import { describe, expect, test } from "bun:test";

import { FishNetMarketTracker } from "@spiritvale/market";
import { decodeMarketCaptureJsonLines } from "./market-replay.ts";

function record(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({
    schemaVersion: 1,
    sessionId: "20260716T120000000Z-a1b2c3d4",
    sequence: 1,
    recordedAt: "2026-07-16T12:00:00.000Z",
    source: "synthetic-test",
    type,
    data,
  });
}

describe("market capture replay", () => {
  test("accepts structured UDP records without exposing endpoint metadata", () => {
    const tracker = new FishNetMarketTracker();
    const result = decodeMarketCaptureJsonLines(
      `${record("transport.packet", {
        protocol: "udp",
        sourceIP: "192.0.2.10",
        destinationIP: "198.51.100.20",
        sourcePort: 40000,
        destinationPort: 7007,
        payloadHex: "032000",
      })}\n`,
      tracker,
    );
    expect(result).toEqual({ datagrams: 1, marketEvents: 0, invalidLines: 0, decodeWarnings: 0 });
    expect(tracker.snapshot().catalog).toEqual([]);
  });

  test("counts unrelated and malformed lines without retaining them", () => {
    const result = decodeMarketCaptureJsonLines("not-json\n{}\n", new FishNetMarketTracker());
    expect(result).toMatchObject({ datagrams: 0, invalidLines: 2, decodeWarnings: 0 });
  });

  test("ignores valid records from other streams", () => {
    const result = decodeMarketCaptureJsonLines(`${record("fishnet.packet", { tick: 1 })}\n`, new FishNetMarketTracker());
    expect(result).toMatchObject({ datagrams: 0, invalidLines: 0 });
  });
});
