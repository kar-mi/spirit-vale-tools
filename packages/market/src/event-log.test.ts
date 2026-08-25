import { describe, expect, test } from "bun:test";
import { marketEventLogData, marketLogMetadataData, parseMarketEventLogData } from "./event-log.ts";
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

  test("omits seller account identifiers while retaining display names", () => {
    const listing = {
      listingId: "listing-example", sellerAccountId: "account-example", sellerDisplayName: "Fictional Merchant",
      itemDisplayName: "Fictional Blade", item: { itemId: "item-example", instanceId: "instance-example", itemType: 3,
        quantity: 1, payloadJson: null, payloadSchemaVersion: 1, compatibilityFingerprint: "synthetic" },
      initialQuantity: 1, availableQuantity: 1, soldQuantity: 0, unitPrice: 25n, status: 1, version: 2n,
      createdAt: 10n, updatedAt: 11n, expiresAt: 12n,
    };
    const event: FishNetMarketEvent = { kind: "searchPage", tick: 5, page: {
      success: true, code: 0, message: null, listings: [listing], nextCursor: null, hasMore: false,
    } };

    const logged = marketEventLogData(event);
    expect(JSON.stringify(logged)).not.toContain("sellerAccountId");
    expect(JSON.stringify(logged)).not.toContain("compatibilityFingerprint");
    expect(JSON.stringify(logged)).not.toContain("payloadSchemaVersion");
    expect(JSON.stringify(logged)).toContain("Fictional Merchant");
    expect(marketLogMetadataData(event)).toEqual({
      compatibilityFingerprints: ["synthetic"],
      payloadSchemaVersions: [1],
    });
    expect(parseMarketEventLogData(logged)).toMatchObject({
      page: { listings: [{ sellerAccountId: null, sellerDisplayName: "Fictional Merchant",
        item: { compatibilityFingerprint: null, payloadSchemaVersion: null } }] },
    });
  });

  test("omits stall account and visual snapshot data", () => {
    const event: FishNetMarketEvent = { kind: "stallUpsert", tick: 6, stall: {
      stallId: "stall-example", accountId: "account-example", characterId: "character-example",
      mapId: "map-example", slotId: "slot-example", expiresAt: 12n, hiredAt: 10n,
      shopName: "Fictional Shop", characterName: "Fictional Merchant", archetype: 2,
      status: 1, version: 3n, visualSnapshotJson: "{\"Equips\":[]}",
    } };

    const logged = marketEventLogData(event);
    expect(JSON.stringify(logged)).not.toContain("accountId");
    expect(JSON.stringify(logged)).not.toContain("visualSnapshotJson");
    expect(JSON.stringify(logged)).not.toContain("archetype");
    expect(parseMarketEventLogData(logged)).toMatchObject({
      stall: { accountId: null, visualSnapshotJson: null, archetype: null, characterName: "Fictional Merchant" },
    });
    expect(parseMarketEventLogData(marketEventLogData({ kind: "stallRemove", tick: 7, accountId: "account-example" })))
      .toEqual({ kind: "stallRemove", tick: 7, accountId: null });
  });
});
