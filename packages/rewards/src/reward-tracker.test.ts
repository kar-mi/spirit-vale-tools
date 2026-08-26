import { describe, expect, test } from "bun:test";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket, FishNetDecodedField } from "@kar-mi/spirit-vale-tools-capture";
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

  test("reports a kill that dropped nothing and earned nothing", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(death(3, 50));

    const kills = tracker.flush().filter((event) => event.kind === "kill");
    expect(kills).toHaveLength(1);
    expect(kills[0]).toMatchObject({
      mob: expect.objectContaining({ displayName: "Training Mob" }),
      experience: 0, jobExperience: 0, coins: 0n, drops: [], attributed: false,
    });
  });

  test("ignores a mob that died without our damage and without paying out", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    // Team 1 is incoming damage, i.e. this death was not credited to our side.
    tracker.consume(death(3, 50, 1));

    expect(tracker.flush().filter((event) => event.kind === "kill")).toEqual([]);
  });

  test("reports a kill we damaged even when it pays nothing, as at max level", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(damage(2, 50));
    tracker.consume(death(3, 50, 1));

    const kills = tracker.flush().filter((event) => event.kind === "kill");
    expect(kills).toHaveLength(1);
    expect(kills[0]).toMatchObject({ experience: 0, coins: 0n, attributed: false });
  });

  test("marks a kill attributed once a reward lands on it", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(experience(2, 90, 1, 90, 1, 100n));
    tracker.consume(death(3, 50));
    tracker.consume(experience(4, 10, 2, 20, 2, 106n));

    const kills = tracker.flush().filter((event) => event.kind === "kill");
    expect(kills.map((kill) => kill.attributed)).toEqual([true]);
  });

  /** Rewards arrive as coalesced state updates, so simultaneous deaths cannot each claim one. */
  test("reports simultaneous deaths as unattributed kills, keeping their reward unmatched", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(monsterSync(1, 51));
    tracker.consume(experience(2, 0, 1, 0, 1, 0n));
    tracker.consume(death(3, 50));
    tracker.consume(death(3, 51));
    expect(tracker.consume(experience(4, 10, 1, 5, 1, 1n))).toContainEqual({
      kind: "unmatched",
      tick: 4,
      reason: "ambiguous",
      reward: "experience",
      experience: 10,
      jobExperience: 5,
      coins: 1n,
      drops: [],
    });
    const kills = tracker.flush().filter((event) => event.kind === "kill");
    expect(kills).toHaveLength(2);
    expect(kills.every((kill) => !kill.attributed)).toBe(true);
    expect(kills.every((kill) => kill.experience === 0 && kill.jobExperience === 0 && kill.coins === 0n)).toBe(true);
    expect(kills.every((kill) => kill.drops.length === 0)).toBe(true);
  });

  test("preserves XP gains that have no nearby mob death", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(experience(2, 90, 1, 190, 2, 100n));

    expect(tracker.consume(experience(10, 10, 2, 25, 3, 100n))).toContainEqual({
      kind: "unmatched",
      tick: 10,
      reason: "expired",
      reward: "experience",
      experience: 20,
      jobExperience: 35,
      coins: 0n,
      drops: [],
    });
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
    tracker.consume({
      tick: 1,
      packetId: 3,
      packetName: "objectSpawn",
      raw: Buffer.alloc(0),
      payload: Buffer.alloc(0),
      objectId: 52,
      spawnSyncEntries: [{
        index: 0,
        name: "Data",
        componentIndex: 3,
        networkBehaviourType: "MonsterController",
        fields: [
          { name: "Id", typeName: "System.String", codec: "stringUtf8Packed", value: "training-mob" },
          { name: "Level", typeName: "System.Int32", codec: "packedInt32", value: 2 },
          { name: "Rank", typeName: "MonsterRank", codec: "packedInt32", value: 0 },
        ],
      }],
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

  test("flushSessionBoundary finalizes pending kills but keeps the XP baseline and mob identities", () => {
    const tracker = new FishNetMobRewardTracker({ catalog, correlationWindowTicks: 5 });
    tracker.consume(monsterSync(1, 50));
    tracker.consume(experience(2, 0, 1, 0, 1, 0n));
    tracker.consume(death(3, 50));
    tracker.consume(experience(4, 20, 1, 10, 1, 6n));

    const boundary = tracker.flushSessionBoundary();
    expect(boundary).toContainEqual(expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ mobId: "training-mob" }),
      experience: 20,
      coins: 6n,
    }));

    // The XP baseline survived the boundary, so the next update computes a gain relative to it instead of silently reseeding with no event.
    tracker.consume(monsterSync(5, 51));
    tracker.consume(death(6, 51));
    tracker.consume(experience(7, 30, 1, 12, 1, 8n));
    expect(tracker.flush()).toContainEqual(expect.objectContaining({
      kind: "kill",
      mob: expect.objectContaining({ objectId: 51 }),
      experience: 10,
      jobExperience: 2,
      coins: 2n,
    }));
  });
});

function monsterSync(tick: number, objectId: number): DecodedFishNetPacket {
  const payload = Buffer.alloc(0);
  return {
    tick, packetId: 1, packetName: "syncType", raw: payload, payload,
    syncIndex: 0, syncName: "Data", objectId, networkBehaviourType: "MonsterController",
    decodedFields: [
      { name: "Id", typeName: "System.String", codec: "stringUtf8Packed", value: "training-mob" },
      { name: "Level", typeName: "System.Int32", codec: "packedInt32", value: 2 },
      { name: "Rank", typeName: "MonsterRank", codec: "packedInt32", value: 0 },
    ],
  };
}

function experience(tick: number, xp: number, level: number, jobXp: number, jobLevel: number, coins: bigint): DecodedFishNetPacket {
  const payload = Buffer.concat([packed(xp), packed(level), packed(jobXp), packed(jobLevel), packed(coins)]);
  return { tick, packetId: 4, packetName: "targetRpc", raw: payload, payload, rpcName: "ExpCoinsChanged_T" };
}

/** Outgoing damage our side dealt to a mob, which is what makes its death ours to report. */
function damage(tick: number, objectId: number): DecodedFishNetPacket {
  const fields: FishNetDecodedField[] = [
    field("dmg.Team", 0), field("dmg.Value", 10), field("dmg.Type", 0), field("dmg.Hit", 0), field("dmg.Hits", 1),
    { name: "dmg.DamageSourceId", codec: "stringUtf8Packed", value: "training-hit" }, field("dmg.AttackerId", 7),
    { name: "dmg.IsClone", codec: "boolean", value: false }, { name: "dmg.IsSummon", codec: "boolean", value: false },
    field("dmg.Element", 0), field("dmg.WeaponType", 0), field("dmg.Range", 1),
    { name: "position", codec: "vector3", value: [0, 0, 0] }, { name: "origin", codec: "vector3", value: [0, 0, 0] },
  ];
  return { tick, packetId: 2, packetName: "observersRpc", raw: Buffer.alloc(0), payload: Buffer.alloc(0), objectId, networkBehaviourType: "HealthComponent", rpcName: "ApplyDamage_C", decodedFields: fields };
}

/** Team 0 is our side's outgoing damage, which is what a mob we killed reports. */
function death(tick: number, objectId: number, team = 0): DecodedFishNetPacket {
  const fields: FishNetDecodedField[] = [
    field("dmg.Team", team), field("dmg.Value", 10), field("dmg.Type", 0), field("dmg.Hit", 0), field("dmg.Hits", 1),
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
