import { describe, expect, test } from "bun:test";
import type { DecodedFishNetPacket } from "@spiritvale/core";
import { decodeFishNetRewardPacket } from "./reward-decoder.ts";

describe("reward packet decoder", () => {
  test("decodes absolute character, job, and coin state", () => {
    const decoded = decodeFishNetRewardPacket(packet("ExpCoinsChanged_T", Buffer.concat([
      packed(120), packed(8), packed(45), packed(4), packed(9_001n),
    ])));
    expect(decoded).toEqual({
      kind: "experienceState",
      tick: 100,
      state: { experience: 120, level: 8, jobExperience: 45, jobLevel: 4, coins: 9_001n },
    });
  });

  test("reduces pickup dictionaries to item IDs and counts", () => {
    const empty = packed(0);
    const material = Buffer.concat([
      packed(1), string("synthetic-uid"),
      Buffer.from([0]), packed(3), string("training-material"), Buffer.from([0]),
    ]);
    const payload = Buffer.concat([
      Buffer.from([0]), // non-null PickUpList
      empty, // currency
      empty, empty, empty, empty,
      material,
      empty, empty,
    ]);
    expect(decodeFishNetRewardPacket(packet("PickupItems_T", payload))).toEqual({
      kind: "pickup",
      tick: 100,
      items: [{ category: "material", itemId: "training-material", count: 3 }],
    });
  });

  test("rejects trailing undecoded bytes", () => {
    expect(() => decodeFishNetRewardPacket(packet("ExpCoinsChanged_T", Buffer.concat([
      packed(1), packed(1), packed(1), packed(1), packed(1), Buffer.from([0]),
    ])))).toThrow("left 1 undecoded byte");
  });
});

function packet(rpcName: string, payload: Buffer): DecodedFishNetPacket {
  return { tick: 100, packetId: 4, packetName: "targetRpc", raw: payload, payload, rpcName };
}

function string(value: string): Buffer { return Buffer.concat([packed(Buffer.byteLength(value)), Buffer.from(value)]); }
function packed(value: number | bigint): Buffer {
  const signed = BigInt(value);
  let encoded = (signed << 1n) ^ (signed >> 63n);
  const bytes: number[] = [];
  while (encoded >= 0x80n) { bytes.push(Number(encoded & 0x7fn) | 0x80); encoded >>= 7n; }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}
