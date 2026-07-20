import { describe, expect, test } from "bun:test";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import type { DecodedFishNetPacket, FishNetDecodedField } from "@spiritvale/core";
import type { MobRewardCatalog } from "./catalog.ts";
import { FishNetMobRewardTracker } from "./reward-tracker.ts";

const catalog: MobRewardCatalog = {
  buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
  experienceRequirements: [100, 200, 300],
  mobs: [{ id: "training-mob", displayName: "Training Mob", level: 2, boss: false, baseExperience: 20, baseCoins: 6, drops: [] }],
};

describe("mob reward tracker", () => {
  test("correlates one identified death with level-aware XP, job XP, and coins", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(experience(2, 90, 1, 90, 1, 100n));
    tracker.consume(death(3, 50));
    tracker.consume(experience(4, 10, 2, 20, 2, 106n));
    const events = tracker.consume({ tick: 10, packetId: 0, packetName: "pingPong", raw: Buffer.alloc(0), payload: Buffer.alloc(0) });
    expect(events).toEqual([expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ mobId: "training-mob", displayName: "Training Mob" }),
      experience: 20,
      jobExperience: 30,
      coins: 6n,
    })]);
  });

  test("keeps simultaneous deaths out of confirmed totals", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(monsterSync(1, 51));
    tracker.consume(experience(2, 0, 1, 0, 1, 0n));
    tracker.consume(death(3, 50));
    tracker.consume(death(3, 51));
    expect(tracker.consume(experience(4, 10, 1, 5, 1, 1n))).toContainEqual({
      kind: "unmatched", tick: 4, reason: "ambiguous", reward: "experience", drops: [],
    });
    expect(tracker.flush().some((event) => event.kind === "kill")).toBe(false);
  });

  test("preserves item details for a pickup without a correlated death", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    const events = tracker.consume(pickup(10, "training-material", 3));

    expect(events).toContainEqual({
      kind: "unmatched",
      tick: 10,
      reason: "expired",
      reward: "pickup",
      drops: [{ category: "material", itemId: "training-material", count: 3 }],
    });
  });

  test("identifies map-load mobs from initial SyncTypes embedded in their spawn", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    const spawnSyncPayload = Buffer.concat([
      Buffer.from([3, 1, 7]), // behaviour index, written count, SyncType index
      string("training-mob"), packed(2), packed(0), packed(1), Buffer.from([0, 1]),
    ]);
    tracker.consume({
      tick: 1,
      packetId: 3,
      packetName: "objectSpawn",
      raw: spawnSyncPayload,
      payload: Buffer.alloc(0),
      objectId: 52,
      spawnSyncPayload,
    });
    tracker.consume(experience(2, 0, 1, 0, 1, 0n));
    tracker.consume(death(3, 52));
    tracker.consume(experience(4, 20, 1, 10, 1, 6n));

    expect(tracker.flush()).toContainEqual(expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ mobId: "training-mob", displayName: "Training Mob" }),
    }));
  });

  test("flushes complete rewards and resets correlation state at a connection boundary", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1_000, 50));
    tracker.consume(experience(1_001, 0, 1, 0, 1, 0n));
    tracker.consume(death(1_002, 50));
    tracker.consume(experience(1_003, 20, 1, 10, 1, 6n));

    const boundary = tracker.consume(lifecycle(50, "authenticated"));
    expect(boundary).toContainEqual(expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ mobId: "training-mob" }),
      experience: 20,
      coins: 6n,
    }));

    tracker.consume(monsterSync(51, 60));
    expect(tracker.consume(experience(52, 5, 1, 2, 1, 1n))).toEqual([]);
    tracker.consume(death(53, 60));
    tracker.consume(experience(54, 15, 1, 7, 1, 4n));
    expect(tracker.flush()).toContainEqual(expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ objectId: 60 }),
      experience: 10,
      jobExperience: 5,
      coins: 3n,
    }));
  });
});

function monsterSync(tick: number, objectId: number): DecodedFishNetPacket {
  const payload = Buffer.concat([Buffer.from([7]), string("training-mob"), packed(2), packed(0), packed(1), Buffer.from([0, 1])]);
  return { tick, packetId: 1, packetName: "syncType", raw: payload, payload, syncPayload: payload, syncIndex: 7, objectId, networkBehaviourType: "MonsterController" };
}

function experience(tick: number, xp: number, level: number, jobXp: number, jobLevel: number, coins: bigint): DecodedFishNetPacket {
  const payload = Buffer.concat([packed(xp), packed(level), packed(jobXp), packed(jobLevel), packed(coins)]);
  return { tick, packetId: 4, packetName: "targetRpc", raw: payload, payload, rpcName: "ExpCoinsChanged_T" };
}

function death(tick: number, objectId: number): DecodedFishNetPacket {
  const fields: FishNetDecodedField[] = [
    field("dmg.Team", 1), field("dmg.Value", 10), field("dmg.Type", 0), field("dmg.Hit", 0), field("dmg.Hits", 1),
    { name: "dmg.DamageSourceId", codec: "stringUtf8Packed", value: "training-hit" }, field("dmg.AttackerId", 7),
    { name: "dmg.IsClone", codec: "boolean", value: false }, { name: "dmg.IsSummon", codec: "boolean", value: false },
    field("dmg.Element", 0), field("dmg.WeaponType", 0), field("dmg.Range", 1),
  ];
  return { tick, packetId: 3, packetName: "observersRpc", raw: Buffer.alloc(0), payload: Buffer.alloc(0), objectId, networkBehaviourType: "HealthComponent", rpcName: "Death_C", decodedFields: fields };
}

function pickup(tick: number, itemId: string, count: number): DecodedFishNetPacket {
  const empty = packed(0);
  const material = Buffer.concat([
    packed(1), string("synthetic-uid"),
    Buffer.from([0]), packed(count), string(itemId), Buffer.from([0]),
  ]);
  const payload = Buffer.concat([Buffer.from([0]), empty, empty, empty, empty, empty, material, empty, empty]);
  return { tick, packetId: 4, packetName: "targetRpc", raw: payload, payload, rpcName: "PickupItems_T" };
}

function lifecycle(tick: number, packetName: "authenticated" | "disconnect"): DecodedFishNetPacket {
  return { tick, packetId: 0, packetName, raw: Buffer.alloc(0), payload: Buffer.alloc(0) };
}

function field(name: string, value: number): FishNetDecodedField { return { name, codec: "packedInt32", value }; }
function string(value: string): Buffer { return Buffer.concat([packed(Buffer.byteLength(value)), Buffer.from(value)]); }
function packed(value: number | bigint): Buffer {
  const signed = BigInt(value); let encoded = (signed << 1n) ^ (signed >> 63n); const bytes: number[] = [];
  while (encoded >= 0x80n) { bytes.push(Number(encoded & 0x7fn) | 0x80); encoded >>= 7n; }
  bytes.push(Number(encoded)); return Buffer.from(bytes);
}
