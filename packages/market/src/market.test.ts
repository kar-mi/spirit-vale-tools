import { describe, expect, test } from "bun:test";

import {
  FishNetMarketTracker,
  decodeFishNetMarketPacket,
  resolveFishNetMarketListingDisplayName,
} from "./market.ts";
import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetItemDirectory } from "@kar-mi/spirit-vale-tools-items";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";

describe("FishNet market decoding", () => {
  test("resolves build names before live names and safe fallbacks", () => {
    const directory = new FishNetItemDirectory({
      buildFingerprint: "synthetic-build",
      items: [
        { itemType: 2, id: "item-example", displayName: "Mapped Example" },
        { itemType: 3, id: "artifact-example", displayName: "Mapped Artifact" },
      ],
    });
    const tracker = new FishNetMarketTracker({ itemDirectory: directory });
    tracker.consume(packet("RequestVendorItemList_T", list([
      catalogItem("Live Example", listing("listing-name", "item-example", 2, 75n, "Merchant Example")),
    ])));

    expect(tracker.query({ text: "mapped example" })[0]).toMatchObject({
      id: "listing-name",
      displayName: "Mapped Example",
      searchText: "Live Example",
    });
    expect(resolveFishNetMarketListingDisplayName({
      itemId: "instance-example",
      itemType: 3,
      json: JSON.stringify({ Id: "artifact-example" }),
    }, null, directory)).toBe("Mapped Artifact");
    expect(resolveFishNetMarketListingDisplayName({
      itemId: "unknown-example",
      itemType: 5,
      json: null,
    }, "Live Fallback", directory)).toBe("Live Fallback");
    expect(resolveFishNetMarketListingDisplayName({
      itemId: "unknown-example",
      itemType: 5,
      json: "{invalid}",
    }, null, directory)).toBe("unknown-example");
  });

  test("decodes catalog listings and supports deterministic local queries", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(packet("RequestVendorItemList_T", list([
      catalogItem("Herb Gnat", listing("listing-a", "item-gnat", 2, 75n, "Merchant Alpha")),
      catalogItem("Polished Stone", listing("listing-b", "item-stone", 4, 120n, "Merchant Beta")),
    ])));

    expect(tracker.query({ text: "GNAT" })).toMatchObject([
      { id: "listing-a", itemId: "item-gnat", price: 75n, searchText: "Herb Gnat" },
    ]);
    expect(tracker.query({ itemType: 4, minPrice: 100n })).toHaveLength(1);
    expect(tracker.query({ sort: "price-desc", limit: 1 })[0]?.id).toBe("listing-b");
    expect(tracker.query({ offset: 1, limit: 1 })[0]?.id).toBe("listing-b");
  });

  test("tracks overview balance changes", () => {
    const tracker = new FishNetMarketTracker();
    const first = tracker.consume(packet("RequestVendingOverview_T", account(2_500n)))[0];
    const second = tracker.consume(packet("RequestVendingOverview_T", account(1_250n)))[0];

    expect(first).toMatchObject({ kind: "account" });
    expect(second).toMatchObject({ kind: "account", balanceDelta: -1_250n });
    expect(tracker.snapshot().lastBalanceDelta).toBe(-1_250n);
    expect(tracker.snapshot().lastCollectedAmount).toBeUndefined();
  });

  test("decodes stall metadata and enriches catalog results", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(packet("LoadVendingStalls_T", list([stall("seller-example", "Example Shop", "map-demo")])));
    tracker.consume(packet("RequestVendorItemList_T", list([
      catalogItem("Training Blade", listing("listing-c", "item-blade", 7, 300n, "Merchant Gamma", "seller-example")),
    ])));

    expect(tracker.query({ text: "example shop" })[0]).toMatchObject({
      id: "listing-c",
      shopName: "Example Shop",
      mapId: "map-demo",
    });
  });

  test("converts encoded rolls and filters equipment and artifacts by displayed values", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(packet("RequestVendorItemList_T", list([
      catalogItem("Example Equipment", listing(
        "listing-equip",
        "item-equip",
        2,
        500n,
        "Merchant Equip",
        "seller-equip",
        gearJson([[0, 50, null], [69, 25, ""], [1, 10, null]]),
      )),
      catalogItem("Example Artifact", listing(
        "listing-artifact",
        "item-artifact",
        3,
        600n,
        "Merchant Artifact",
        "seller-artifact",
        gearJson([[0, 40, null], [71, 80, ""], [4, 20, null]]),
      )),
      catalogItem("Malformed Example", listing(
        "listing-malformed",
        "item-malformed",
        2,
        700n,
        "Merchant Invalid",
        "seller-invalid",
        "{not-json}",
      )),
    ])));

    expect(tracker.query({ stats: [{ stat: "str" }] })).toHaveLength(2);
    expect(tracker.query({ stats: [{ stat: "Str", minValue: 2 }, { stat: "AtkMult" }] }))
      .toMatchObject([{ id: "listing-equip" }]);
    expect(tracker.query({
      stats: [{ stat: "AtkMult", minValue: 2 }, { stat: "HpMult", minValue: 2 }],
      statMode: "any",
    })).toMatchObject([{ id: "listing-artifact" }]);
    expect(tracker.query({ stats: [{ stat: 0 }, { stat: "Str", minValue: 2 }] }))
      .toMatchObject([{ id: "listing-equip" }, { id: "listing-artifact" }]);
    expect(tracker.query({ text: "Malformed" })[0]?.stats).toBeUndefined();
    expect(tracker.query({ stats: [{ stat: "Str" }] })[0]?.stats?.[0]).toEqual({
      type: 0,
      name: "Str",
      value: 3,
      roll: 50,
      percent: false,
      valueStr: null,
    });
    expect(() => tracker.query({ stats: [{ stat: "NotAStat" }] })).toThrow("unknown market stat");
    expect(tracker.query({ text: "Example Equipment" })[0]?.stats?.[1]).toMatchObject({
      name: "AtkMult",
      value: undefined,
      roll: 25,
      percent: true,
    });
  });

  test("converts a melee weapon's stat rolls to tooltip values", () => {
    const tracker = new FishNetMarketTracker();
    tracker.consume(packet("RequestVendorItemList_T", list([
      catalogItem("Example Sword", listing(
        "listing-sword",
        "item-sword",
        2,
        900n,
        "Merchant Sword",
        "seller-sword",
        gearJson([[0, 73, null], [15, 73, ""], [47, 0, ""]]),
      )),
    ])));

    expect(tracker.query()[0]?.stats).toMatchObject([
      { name: "Str", value: 3, roll: 73, percent: false },
      { name: "Crit", value: 9, roll: 73, percent: false },
      { name: "DamageMelee", value: 3, roll: 0, percent: true },
    ]);
    expect(tracker.query({ stats: [{ stat: "Crit", minValue: 9 }, { stat: "DamageMelee", minValue: 3 }] }))
      .toHaveLength(1);
    expect(tracker.query({ stats: [{ stat: "Crit", minValue: 10 }] })).toHaveLength(0);
    expect(tracker.query({ stats: [{ stat: "Crit", minValue: 9, maxValue: 9 }] })).toHaveLength(1);
    expect(tracker.query({ stats: [{ stat: "Crit", maxValue: 8 }] })).toHaveLength(0);
    expect(tracker.query({ stats: [{ stat: "Crit" }] })).toHaveLength(1);
    expect(() => tracker.query({ stats: [{ stat: "Crit", minValue: 10, maxValue: 9 }] }))
      .toThrow("minimum exceeds maximum");
  });

  test("uses a weapon item hint when its stats overlap the accessory pool", () => {
    expect(parseStats("Training Sword", [[0, 40, null], [70, 30, ""], [63, 96, ""]])).toMatchObject([
      { name: "Str", value: 2 },
      { name: "MatkMult", value: 4, percent: true },
      { name: "AtkSpd", value: 10, percent: true },
    ]);
    expect(parseStats("Practice Broad Sword", [[0, 25, null], [70, 71, ""], [13, 93, ""]])).toMatchObject([
      { name: "Str", value: 2 },
      { name: "MatkMult", value: 5, percent: true },
      { name: "Hit", value: 20, percent: false },
    ]);
    expect(parseStats("Example Sword", [[80, 100, ""]])).toMatchObject([
      { name: "DoubleAttack", value: 20, percent: true },
    ]);
  });

  test("rejects malformed market JSON", () => {
    expect(() => decodeFishNetMarketPacket(packetJson("RequestVendorItemList_T", "[")))
      .toThrow(FishNetProtocolError);
    expect(() => decodeFishNetMarketPacket(packet("RequestVendorItemList_T", {})))
      .toThrow("root is not an array");
  });
});

function packet(rpcName: string, value: unknown): DecodedFishNetPacket {
  return packetJson(rpcName, JSON.stringify(value));
}

function packetJson(rpcName: string, json: string): DecodedFishNetPacket {
  const fieldName = rpcName === "RequestVendorItemList_T" || rpcName === "RequestVendingStallListings_T"
    ? "listingsJson"
    : rpcName === "RequestVendingOverview_T" ? "responseJson"
      : rpcName === "LoadVendingStalls_T" ? "stallsJson" : "dataJson";
  return {
    tick: 42,
    packetId: 100,
    packetName: "rpcLink",
    rpcName,
    rpcResolution: "verified",
    networkBehaviourType: "PlayerController",
    decodedFields: [{ name: fieldName, value: json, codec: "stringUtf8Packed" }],
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
  };
}

function account(balance: bigint): unknown {
  return { PendingCoins: balance.toString(), MailboxItems: [], Transactions: [], OwnListings: [] };
}

function catalogItem(searchText: string, value: Record<string, unknown>): Record<string, unknown> {
  return { ...value, ItemDisplayName: searchText };
}

function listing(
  id: string,
  itemId: string,
  itemType: number,
  price: bigint,
  sellerName: string,
  sellerId = "seller-example",
  json = "{}",
): Record<string, unknown> {
  return {
    ListingId: id,
    SellerAccountId: sellerId,
    SellerDisplayName: sellerName,
    ItemDisplayName: itemId,
    Item: { ItemId: itemId, Type: itemType, Quantity: 10, PayloadJson: json },
    AvailableQuantity: 10,
    SoldQuantity: 2,
    UnitPrice: price.toString(),
    ExpiresAt: "2100-01-01T00:00:00Z",
  };
}

function gearJson(stats: Array<[number, number, string | null]>): string {
  return JSON.stringify({
    Id: "item-example",
    Favorite: false,
    Substats: stats.map(([Type, Value, ValueStr]) => ({ Type, Value, ValueStr })),
  });
}

function parseStats(id: string, stats: Array<[number, number, string | null]>) {
  const tracker = new FishNetMarketTracker();
  tracker.consume(packet("RequestVendorItemList_T", list([
    catalogItem("Synthetic Weapon", listing(
      "listing-hint",
      "item-hint",
      2,
      1n,
      "Merchant Hint",
      "seller-hint",
      JSON.stringify({ Id: id, Favorite: false, Substats: stats.map(([Type, Value, ValueStr]) => ({ Type, Value, ValueStr })) }),
    )),
  ])));
  return tracker.query()[0]?.stats;
}

function stall(accountId: string, shopName: string, mapId: string): Record<string, unknown> {
  return {
    StallId: "stall-example",
    AccountId: accountId,
    CharacterId: "character-example",
    MapId: mapId,
    SlotId: "slot-example",
    ShopName: shopName,
    CharacterDisplayName: "Merchant Example",
    VisualSnapshotJson: "{\"Archetype\":2}",
    Status: 1,
    Version: 1,
    HiredAt: "2099-12-31T23:00:00Z",
    ExpiresAt: "2100-01-01T00:00:00Z",
  };
}

function list<T>(values: T[]): T[] {
  return values;
}
