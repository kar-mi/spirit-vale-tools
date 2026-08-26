import { describe, expect, test } from "bun:test";
import type { DecodedFishNetPacket, FishNetDecodedValue } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetItemDirectory } from "@kar-mi/spirit-vale-tools-items";
import { FishNetMarketTracker, decodeFishNetMarketPacket } from "./market.ts";

describe("FishNet market tracking", () => {
  test("accumulates continuation pages and resets on a fresh search", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(request("blade", null, 20));
    tracker.consume(page([listing("listing-alpha", 100)], "next-page", true));
    tracker.consume(request("blade", "next-page", 20));
    tracker.consume(page([listing("listing-beta", 200)], null, false));
    expect(tracker.snapshot().search).toMatchObject({ query: "blade", cursor: "next-page", hasMore: false });
    expect(tracker.query().map(({ listingId }) => listingId)).toEqual(["listing-alpha", "listing-beta"]);

    tracker.consume(request("staff", null, 20));
    expect(tracker.query()).toEqual([]);
    tracker.consume(page([listing("listing-gamma", 300)], null, false));
    expect(tracker.query().map(({ listingId }) => listingId)).toEqual(["listing-gamma"]);
  });

  test("keeps earlier pages after a failed continuation and isolates an unpaired response", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(request(null, null, 10));
    tracker.consume(page([listing("listing-first", 100)], "cursor-two", true));
    tracker.consume(request(null, "cursor-two", 10));
    tracker.consume(page([], null, false, false));
    expect(tracker.query()).toHaveLength(1);
    tracker.consume(page([listing("listing-isolated", 50)], null, false));
    expect(tracker.query().map(({ listingId }) => listingId)).toEqual(["listing-isolated"]);
  });

  test("decodes stall status and enriches listings from stall metadata", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(packet("PlayerController", "RequestVendingStallStatus_T", [
      field("dto.HasActiveStall", true), field("dto.CharacterId", "character-example"),
      field("dto.ExpiresAt", "4102444800"), field("dto.OccupiedCount", 4), field("dto.TotalSpots", 8),
    ]));
    tracker.consume(jsonPacket("LoadVendingStalls_T", "stallsJson", [stall()]));
    tracker.consume(request(null, null, 10));
    tracker.consume(page([listing("listing-stall", 125)], null, false));
    expect(tracker.snapshot().stallStatus).toMatchObject({ hasActiveStall: true, occupiedCount: 4, totalSpots: 8 });
    expect(tracker.query()[0]).toMatchObject({ shopName: "Fictional Shop", mapId: "map-example" });
  });

  test("uses the catalog item type offset and supports local queries", () => {
    const directory = new FishNetItemDirectory({ buildFingerprint: "synthetic-build", items: [
      { itemType: 2, id: "item-example", displayName: "Mapped Blade", substatGroup: "Melee" },
    ] });
    const tracker = new FishNetMarketTracker({ itemDirectory: directory });
    tracker.consume(request(null, null, 10));
    tracker.consume(page([listing("listing-mapped", 500, { itemType: 3, itemId: "item-example" })], null, false));
    expect(tracker.query({ text: "mapped", itemType: 3, minPrice: 400n })[0]).toMatchObject({ displayName: "Mapped Blade" });
    expect(tracker.query({ maxPrice: 499n })).toEqual([]);
  });

  test("rejects malformed pages and ignores non-verified or wrong-behaviour packets", () => {
    expect(() => decodeFishNetMarketPacket(jsonPacket("RequestVendorItemList_T", "pageJson", []))).toThrow("search page");
    expect(decodeFishNetMarketPacket({ ...request(null, null, 10), rpcResolution: "unresolved" })).toEqual([]);
    expect(decodeFishNetMarketPacket({ ...request(null, null, 10), networkBehaviourType: "PlayerSave" })).toEqual([]);
  });
});

function field(name: string, value: FishNetDecodedValue) { return { name, codec: "packedInt32" as const, value }; }
function packet(behaviour: string, rpcName: string, decodedFields: ReturnType<typeof field>[]): DecodedFishNetPacket {
  return { tick: 42, packetId: 3, packetName: "serverRpc", rpcName, rpcResolution: "verified",
    networkBehaviourType: behaviour, decodedFields, raw: Buffer.alloc(0), payload: Buffer.alloc(0) };
}
function request(query: string | null, cursor: string | null, pageSize: number): DecodedFishNetPacket {
  return packet("PlayerController", "RequestVendorItemList_S", [field("dto.Query", query), field("dto.Cursor", cursor), field("dto.PageSize", pageSize)]);
}
function page(listings: unknown[], nextCursor: string | null, hasMore: boolean, success = true): DecodedFishNetPacket {
  return jsonPacket("RequestVendorItemList_T", "pageJson", { Success: success, Code: success ? 0 : 1,
    Message: success ? "ok" : "failed", Listings: listings, NextCursor: nextCursor, HasMore: hasMore });
}
function jsonPacket(rpcName: string, name: string, value: unknown): DecodedFishNetPacket {
  return packet("PlayerController", rpcName, [field(name, JSON.stringify(value))]);
}
function item(overrides: { itemType?: number; itemId?: string } = {}) {
  return { ItemId: overrides.itemId ?? "item-example", InstanceId: "instance-example", Type: overrides.itemType ?? 3,
    Quantity: 1, PayloadJson: JSON.stringify({ Id: overrides.itemId ?? "item-example", Substats: [] }),
    PayloadSchemaVersion: 1, CompatibilityFingerprint: "synthetic-fingerprint" };
}
function listing(id: string, price: number, itemOverrides: { itemType?: number; itemId?: string } = {}) {
  return { ListingId: id, SellerAccountId: "seller-example", SellerDisplayName: "Fictional Merchant",
    ItemDisplayName: "Fictional Blade", Item: item(itemOverrides), InitialQuantity: 2, AvailableQuantity: 2,
    SoldQuantity: 0, UnitPrice: price, Status: 1, Version: 1, CreatedAt: "2099-01-01T00:00:00Z",
    UpdatedAt: "2099-01-01T00:00:00Z", ExpiresAt: "2100-01-01T00:00:00Z" };
}
function stall() {
  return { StallId: "stall-example", AccountId: "seller-example", CharacterId: "character-example", MapId: "map-example",
    SlotId: "slot-example", ExpiresAt: "2100-01-01T00:00:00Z", HiredAt: "2099-01-01T00:00:00Z",
    ShopName: "Fictional Shop", CharacterDisplayName: "Fictional Merchant", VisualSnapshotJson: "{\"Archetype\":2}",
    Status: 1, Version: 1 };
}
