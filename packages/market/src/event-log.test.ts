import { describe, expect, test } from "bun:test";
import { marketEventLogData, parseMarketEventLogData } from "./event-log.ts";
import type { FishNetMarketEvent } from "./market.ts";

describe("market event log codec", () => {
  test("round-trips paginated and stall-status events", () => {
    const events: FishNetMarketEvent[] = [
      { kind: "searchRequest", tick: 1, request: { query: "fictional", cursor: null, pageSize: 20 } },
      { kind: "searchPage", tick: 2, page: { success: true, code: 0, message: "ok", listings: [], nextCursor: "next", hasMore: true } },
      { kind: "stallStatus", tick: 3, status: { hasActiveStall: true, characterId: "character-example", expiresAt: 99n, occupiedCount: 2, totalSpots: 8 } },
      { kind: "collectResult", tick: 4, success: true, message: "ok" },
    ];
    for (const event of events) expect(parseMarketEventLogData(marketEventLogData(event))).toEqual(event);
  });
  test("rejects malformed event data", () => {
    expect(parseMarketEventLogData({ kind: "searchRequest", tick: 1, request: { pageSize: "many" } })).toBeUndefined();
    expect(parseMarketEventLogData({ kind: "stallStatus", tick: 1, status: { expiresAt: "invalid" } })).toBeUndefined();
  });
});
