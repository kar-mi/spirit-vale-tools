import { describe, expect, test } from "bun:test";

import {
  FishNetMarketTracker,
  decodeFishNetMarketPacket,
  resolveFishNetMarketListingDisplayName,
} from "./market.ts";
import { FishNetProtocolError } from "@spiritvale/core";
import { FishNetItemDirectory } from "@spiritvale/items";
import type { DecodedFishNetPacket } from "@spiritvale/core";

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

  test("tracks account balance changes without guessing collection values", () => {
    const tracker = new FishNetMarketTracker();
    const first = tracker.consume(packet("RequestAHAccount_T", account(2_500n)))[0];
    tracker.consume(packet("VendingCollectResult_T", Buffer.from([1])));
    const second = tracker.consume(packet("RequestAHAccount_T", account(1_250n)))[0];

    expect(first).toMatchObject({ kind: "account" });
    expect(second).toMatchObject({ kind: "account", balanceDelta: -1_250n, collectedAmount: 1_250n });
    expect(tracker.snapshot().lastBalanceDelta).toBe(-1_250n);
    expect(tracker.snapshot().lastCollectedAmount).toBe(1_250n);
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

  test("rejects truncated and trailing market payloads", () => {
    const payload = list([catalogItem("Example", listing("listing-d", "item-d", 1, 5n, "Merchant Delta"))]);
    expect(() => decodeFishNetMarketPacket(packet("RequestVendorItemList_T", payload.subarray(0, -1))))
      .toThrow(FishNetProtocolError);
    expect(() => decodeFishNetMarketPacket(packet("RequestVendorItemList_T", Buffer.concat([payload, Buffer.from([0])]))))
      .toThrow("left 1 undecoded bytes");
  });
});

function packet(rpcName: string, payload: Buffer): DecodedFishNetPacket {
  return {
    tick: 42,
    packetId: 100,
    packetName: "rpcLink",
    rpcName,
    rpcResolution: "verified",
    networkBehaviourType: "PlayerController",
    raw: payload,
    payload,
  };
}

function account(balance: bigint): Buffer {
  return reference(Buffer.concat([signed(balance), list([]), list([]), list([])]));
}

function catalogItem(searchText: string, value: Buffer): Buffer {
  return Buffer.concat([string("seller-example"), string(searchText), string("Merchant Example"), value]);
}

function listing(
  id: string,
  itemId: string,
  itemType: number,
  price: bigint,
  sellerName: string,
  sellerId = "seller-example",
  json = "{}",
): Buffer {
  return reference(Buffer.concat([
    string(id),
    string(sellerId),
    string(sellerName),
    string(itemId),
    signed(BigInt(itemType)),
    signed(10n),
    signed(2n),
    signed(price),
    string(json),
    signed(4_102_444_800n),
  ]));
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

function stall(accountId: string, shopName: string, mapId: string): Buffer {
  const appearance = reference(Buffer.concat(Array.from({ length: 10 }, () => signed(0n))));
  const body = Buffer.concat([
    string(accountId),
    string("character-example"),
    string(mapId),
    signed(3n),
    signed(4_102_444_800n),
    string(shopName),
    string("Merchant Example"),
    signed(2n),
    appearance,
    Buffer.from([1]),
    list([]),
    list([]),
    float32(90),
  ]);
  return reference(body);
}

function list(values: Buffer[]): Buffer {
  return Buffer.concat([signed(BigInt(values.length)), ...values]);
}

function reference(value: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0]), value]);
}

function string(value: string | null): Buffer {
  if (value === null) return signed(-1n);
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([signed(BigInt(bytes.length)), bytes]);
}

function signed(value: bigint): Buffer {
  let unsigned = value >= 0n ? value << 1n : ((-value) << 1n) - 1n;
  const bytes: number[] = [];
  do {
    let byte = Number(unsigned & 0x7fn);
    unsigned >>= 7n;
    if (unsigned !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (unsigned !== 0n);
  return Buffer.from(bytes);
}

function float32(value: number): Buffer {
  const result = Buffer.alloc(4);
  result.writeFloatLE(value);
  return result;
}
