import { describe, expect, test } from "bun:test";

import { marketEventLogData, parseMarketEventLogData } from "./event-log.ts";
import type { FishNetMarketEvent } from "./market.ts";

describe("market event log codec", () => {
  test("round-trips every event shape with decimal bigint fields", () => {
    const listing = {
      id: "listing-example",
      sellerId: "seller-example",
      sellerName: "Merchant Example",
      itemId: "item-example",
      itemType: 2,
      count: 2,
      countTraded: 0,
      price: 1250n,
      json: null,
      expiresAt: 4102444800n,
    };
    const stall = {
      accountId: "seller-example",
      characterId: "character-example",
      mapId: "map-example",
      stallIndex: 3,
      expiresAt: 4102444800n,
      shopName: "Example Shop",
      characterName: "Merchant Example",
      archetype: 1,
      rotationY: 1.5,
    };
    const events: FishNetMarketEvent[] = [
      { kind: "catalog", tick: 1, items: [{ sellerId: "seller-example", searchText: "Example Sword", sellerName: "Merchant Example", listing }] },
      {
        kind: "account",
        tick: 2,
        account: {
          balance: 5000n,
          collectables: [{ id: "collectable-example", itemType: 2, count: 1, json: null }],
          saleHistory: [{ itemDisplayName: "Example Sword", itemName: "item-example", count: 1, price: 1250n, buyerName: "Buyer Example", at: 100n }],
          ownListings: [listing],
        },
        balanceDelta: 250n,
      },
      { kind: "stalls", tick: 3, stalls: [stall, null] },
      { kind: "stallUpsert", tick: 4, stall },
      { kind: "stallRemove", tick: 5, accountId: "seller-example" },
      { kind: "listings", tick: 6, listings: [listing, null] },
      { kind: "collectResult", tick: 7, success: true },
    ];

    for (const event of events) expect(parseMarketEventLogData(marketEventLogData(event))).toEqual(event);
  });

  test("rejects malformed event data", () => {
    expect(parseMarketEventLogData({ kind: "listings", tick: 1, listings: [{ price: "invalid" }] })).toBeUndefined();
    expect(parseMarketEventLogData({ kind: "collectResult", tick: 1, success: "yes" })).toBeUndefined();
  });
});
