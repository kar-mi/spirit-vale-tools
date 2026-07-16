import { describe, expect, test } from "bun:test";

import { FishNetMarketTracker, decodeFishNetMarketPacket } from "./market.ts";
import { FishNetProtocolError } from "./protocol.ts";
import type { DecodedFishNetPacket } from "./types.ts";

describe("FishNet market decoding", () => {
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
    string("{}"),
    signed(4_102_444_800n),
  ]));
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
