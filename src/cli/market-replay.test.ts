import { describe, expect, test } from "bun:test";

import { FishNetMarketTracker } from "../fishnet/market.ts";
import { decodeMarketCaptureText } from "./market-replay.ts";

describe("market capture replay", () => {
  test("accepts raw UDP dump lines without exposing endpoint metadata", () => {
    const tracker = new FishNetMarketTracker();
    const result = decodeMarketCaptureText(
      "UDP 192.0.2.10:40000 -> 198.51.100.20:7007 payload=032000\n",
      tracker,
    );
    expect(result).toEqual({ datagrams: 1, marketEvents: 0, invalidLines: 0, decodeWarnings: 0 });
    expect(tracker.snapshot().catalog).toEqual([]);
  });

  test("counts unrelated and malformed lines without retaining them", () => {
    const result = decodeMarketCaptureText("not a packet\nUDP malformed\n", new FishNetMarketTracker());
    expect(result).toMatchObject({ datagrams: 0, invalidLines: 2, decodeWarnings: 0 });
  });
});
