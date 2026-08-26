import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetCharacterTracker } from "./tracker.ts";
import { syntheticCharacter } from "./synthetic-character.test-helper.ts";

function characterPacket(rpcName?: string): CapturedFishNetPacket {
  return {
    tick: 1,
    packetId: 1,
    packetName: "targetRpc",
    ...(rpcName === undefined ? {} : { rpcName }),
    raw: Buffer.alloc(0),
    payload: syntheticCharacter(true),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

describe("FishNetCharacterTracker", () => {
  test("exposes only the current local object id observed from a server RPC", () => {
    const tracker = new FishNetCharacterTracker();
    expect(tracker.currentObjectId()).toBeUndefined();

    const packet = characterPacket();
    packet.packetName = "serverRpc";
    packet.objectId = 123;
    expect(tracker.consume(packet)).toBe(false);
    expect(tracker.currentObjectId()).toBe(123);
  });

  test("accepts a uniquely resolved character RPC without a behaviour type", () => {
    const tracker = new FishNetCharacterTracker();

    expect(tracker.consume(characterPacket("CharacterCallback_T"))).toBe(true);
    expect(tracker.state()).toMatchObject({
      status: "live",
      weight: { current: 71, maximum: 3_260 },
    });
    expect(tracker.state().stats).not.toHaveLength(0);
    expect(tracker.currentArchetypeId()).toBe(12);
  });

  test("rejects packets without a character RPC name", () => {
    const tracker = new FishNetCharacterTracker();

    expect(tracker.consume(characterPacket())).toBe(false);
    expect(tracker.consume(characterPacket("UnrelatedRpc"))).toBe(false);
    expect(tracker.state()).toMatchObject({ status: "waiting", stats: [] });
    expect(tracker.currentArchetypeId()).toBeUndefined();
  });

  test("reports unsupported status when a named character payload cannot be decoded", () => {
    const tracker = new FishNetCharacterTracker();
    const packet = characterPacket("LoadCharacter_T");
    packet.payload = Buffer.from([0xff]);

    expect(tracker.consume(packet)).toBe(true);
    expect(tracker.state()).toMatchObject({ status: "unsupported", stats: [] });
    expect(tracker.state().statusDetail).toStartWith("Character data isn't recognized:");
    expect(tracker.state().statusDetail).toContain("Change maps or channels");
  });

  test("replaces cached state when a callback belongs to a different character", () => {
    const tracker = new FishNetCharacterTracker({
      schemaVersion: 1,
      buildFingerprint: "synthetic-build",
      name: "Fictional Veteran",
      archetypes: ["Mage", "Wizard"],
      level: 70,
      experience: 0,
      jobLevel: 30,
      jobExperience: 0,
      attributes: { STR: 5, VIT: 20, AGI: 10, DEX: 15, INT: 70, LUK: 10 },
      activeLoadout: "Normal",
      equipment: [],
      artifacts: [],
      skills: [],
      updatedAt: "2026-01-01T00:00:00.000Z",
      source: "cached",
    });

    expect(tracker.consume(characterPacket("CharacterCallback_T"))).toBe(true);
    expect(tracker.current()).toMatchObject({
      name: "Example Hero",
      archetypes: ["Warrior", "Berserker"],
      level: 42,
      source: "live",
    });
    expect(tracker.currentArchetypeId()).toBe(12);
  });

  test("updates the active class for the same character", () => {
    const tracker = new FishNetCharacterTracker({
      schemaVersion: 1,
      buildFingerprint: "synthetic-build",
      name: "Example Hero",
      archetypes: ["Mage", "Wizard"],
      level: 42,
      experience: 0,
      jobLevel: 18,
      jobExperience: 0,
      attributes: { STR: 5, VIT: 20, AGI: 10, DEX: 15, INT: 70, LUK: 10 },
      activeLoadout: "Normal",
      equipment: [],
      artifacts: [],
      skills: [],
      updatedAt: "2026-01-01T00:00:00.000Z",
      source: "cached",
    });
    const packet = characterPacket("CharacterCallback_T");
    packet.payload = Buffer.concat([packed(131072), packet.payload.subarray(1)]);

    expect(tracker.consume(packet)).toBe(true);
    expect(tracker.current()?.archetypes).toEqual(["Warrior", "Berserker"]);
    expect(tracker.currentArchetypeId()).toBe(12);
  });

  test("preserves the last complete weight across partial callbacks", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));
    const packet = characterPacket("CharacterCallback_T");
    packet.payload = syntheticCharacter(true, false);

    expect(tracker.consume(packet)).toBe(true);
    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("keeps weight when the local player object is re-pinned", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(pinPacket(101));

    // Weight belongs to the character, not the unit object, and nothing else can restore it.
    tracker.consume(pinPacket(202));

    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("keeps weight when a late RPC from the outgoing connection re-pins", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(101));
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(resourcePacket(101, "SkillsComponent", 120, 240));

    tracker.consume({ ...pinPacket(101), connectionId: "stale-connection" } as CapturedFishNetPacket);

    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("preserves a complete weight received before the replacement object is pinned", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(pinPacket(101));
    tracker.consume({ ...syncPacket(0, "HealthComponent", ""), packetName: "authenticated" });

    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(pinPacket(202));

    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("does not carry weight to another character on a partial callback", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));
    const packet = characterPacket("CharacterCallback_T");
    packet.payload = syntheticCharacter(true, false, "Example Adventurer");

    expect(tracker.consume(packet)).toBe(true);
    expect(tracker.current()?.name).toBe("Example Adventurer");
    expect(tracker.state().weight).toBeUndefined();
  });

  test("re-derives cached substat values from raw rolls using current tables", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.setCached({
      schemaVersion: 1,
      buildFingerprint: "stale-build",
      name: "kar",
      archetypes: ["Warrior"],
      level: 88,
      experience: 0,
      jobLevel: 1,
      jobExperience: 0,
      attributes: { STR: 99, VIT: 50, AGI: 1, DEX: 1, INT: 1, LUK: 71 },
      activeLoadout: "Normal",
      // Baked under an older build: wrong scaled value (11 instead of 9) and unnamed stat.
      equipment: [{ slot: "Left accessory", itemId: "Synthetic Visor", refine: 0, cards: [], substats: [{ type: 13, name: "Stat 13", roll: 67, value: 11, percent: false }] }],
      artifacts: [],
      skills: [],
      updatedAt: "2026-07-19T00:00:00.000Z",
      source: "cached",
    });

    const state = tracker.state();
    expect(state.weight).toBeUndefined();
    expect(state.snapshot?.equipment[0]?.substats[0]).toMatchObject({ value: 9, name: "Hit", roll: 67 });
    // round(level 88 + DEX 1 × 2 + floor(71 LUK / 3) + 25 + rescaled 9) — not 149 via the stale 11.
    expect(state.stats.find((stat) => stat.id === "hit")?.value).toBe(147);
  });

  test("promotes server-synced values that arrive before the local player is pinned", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));

    // The initial spawn sync may precede the first outbound RPC during a map change.
    expect(tracker.consume(syncPacket(47472, "HealthComponent", "01e8ce0100e8ce01"))).toBe(false);
    expect(tracker.consume(resourcePacket(47472, "SkillsComponent", 321, 654))).toBe(false);
    expect(tracker.state().records).toBeUndefined();
    tracker.consume({ ...syncPacket(47472, "HealthComponent", ""), packetName: "serverRpc", payload: Buffer.alloc(0) });

    expect(tracker.consume(syncPacket(47472, "MoveComponent", "01cdcc0e41"))).toBe(true);
    // Syncs for other objects never contribute records.
    expect(tracker.consume(syncPacket(99999, "HealthComponent", "00dcad01"))).toBe(false);

    const state = tracker.state();
    expect(state.records).toMatchObject({ currentHealth: 13_236, maxHealth: 13_236 });
    expect(state.records).toMatchObject({ currentMana: 321, maxMana: 654 });
    expect(state.records?.moveSpeed).toBeCloseTo(8.925, 3);
    expect(state.stats.find((stat) => stat.id === "max-health")?.record).toBe(13_236);
    expect(state.stats.find((stat) => stat.id === "max-mana")?.record).toBe(654);
    expect(state.stats.find((stat) => stat.id === "move-speed")?.record).toBeCloseTo(8.925, 3);
  });

  test("buffers exact resource SyncTypes embedded in a spawn until that object is pinned", () => {
    const tracker = new FishNetCharacterTracker();
    const spawn = {
      ...syncPacket(202, "PlayerController", ""),
      packetName: "objectSpawn",
      spawnSyncEntries: [
        spawnEntry("HealthComponent", "healthSync", 750),
        spawnEntry("HealthComponent", "maxHealthSync", 1_000),
        spawnEntry("SkillsComponent", "manaSync", 120),
        spawnEntry("SkillsComponent", "maxManaSync", 240),
        spawnEntry("MoveComponent", "MoveSpeed", 8.925),
      ],
    } as CapturedFishNetPacket;

    expect(tracker.consume(spawn)).toBe(false);
    expect(tracker.state().records).toBeUndefined();
    tracker.consume(pinPacket(202));

    expect(tracker.state().records).toMatchObject({
      currentHealth: 750,
      maxHealth: 1_000,
      currentMana: 120,
      maxMana: 240,
      moveSpeed: 8.925,
    });
  });

  test("rekeys a buffered physical spawn without promoting it before logical-object proof", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume({
      ...syncPacket(202, "PlayerController", ""),
      packetName: "objectSpawn",
      spawnSyncEntries: [spawnEntry("SkillsComponent", "maxManaSync", 240)],
    } as CapturedFishNetPacket);

    tracker.rekeyPendingObject("test-connection", 202, -1);
    expect(tracker.state().records).toBeUndefined();
    tracker.consume(pinPacket(-1));

    expect(tracker.state().records).toMatchObject({ maxMana: 240 });
  });

  test("normalizes a regen plateau only after consecutive increases and a quiet window", () => {
    const timing = new ManualTiming();
    const tracker = new FishNetCharacterTracker(undefined, timing.options());
    tracker.consume(pinPacket(202));

    tracker.consume(currentResourcePacket(202, "SkillsComponent", 1_000));
    timing.advance(1_000);
    tracker.consume(currentResourcePacket(202, "SkillsComponent", 1_050));
    timing.advance(1_000);
    tracker.consume(currentResourcePacket(202, "SkillsComponent", 1_100));
    expect(tracker.state().records?.normalizedMaxMp).toBeUndefined();

    timing.advance(2_249);
    expect(tracker.state().records?.normalizedMaxMp).toBeUndefined();
    timing.advance(1);
    expect(tracker.state().records).toMatchObject({ currentMana: 1_100, normalizedMaxMp: 1_100 });
  });

  test("does not normalize a single heal increase as maximum health", () => {
    const timing = new ManualTiming();
    const tracker = new FishNetCharacterTracker(undefined, timing.options());
    tracker.consume(pinPacket(202));
    tracker.consume(currentResourcePacket(202, "HealthComponent", 500));
    timing.advance(1_000);
    tracker.consume(currentResourcePacket(202, "HealthComponent", 750));

    timing.advance(10_000);
    expect(tracker.state().records?.normalizedMaxHp).toBeUndefined();
  });

  test("authoritative maxima override and cancel regen normalization", () => {
    const timing = new ManualTiming();
    const tracker = new FishNetCharacterTracker(undefined, timing.options());
    tracker.consume(pinPacket(202));
    tracker.consume(currentResourcePacket(202, "HealthComponent", 700));
    timing.advance(1_000);
    tracker.consume(currentResourcePacket(202, "HealthComponent", 710));
    timing.advance(1_000);
    tracker.consume(currentResourcePacket(202, "HealthComponent", 720));
    tracker.consume(resourcePacket(202, "HealthComponent", 720, 1_000));

    timing.advance(10_000);
    expect(tracker.state().records).toMatchObject({ maxHealth: 1_000, normalizedMaxHp: 1_000 });
  });

  test("clears server-synced resources when the local object changes", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(101));
    tracker.consume(resourcePacket(101, "HealthComponent", 750, 1_000));
    tracker.consume(resourcePacket(101, "SkillsComponent", 120, 240));
    tracker.consume(characterPacket("CharacterCallback_T"));

    // A fresh unit object reports its own health; the previous object's is worse than none.
    tracker.consume(pinPacket(202));

    expect(tracker.state().records).toBeUndefined();
    // Weight has no sync stream to refill it, so it is not collateral damage.
    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("ignores a connection boundary raised on a neighbouring connection", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(resourcePacket(202, "HealthComponent", 750, 1_000));

    // The client keeps several server connections open; only the pinned one ends our tracking.
    tracker.consume({
      ...syncPacket(0, "HealthComponent", ""),
      packetName: "authenticated",
      connectionId: "other-connection",
    } as CapturedFishNetPacket);

    expect(tracker.currentObjectId()).toBe(202);
    expect(tracker.state().records).toMatchObject({ currentHealth: 750, maxHealth: 1_000 });
    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("keeps weight across connection boundaries and refreshes records on the next pin", () => {
    for (const packetName of ["authenticated", "disconnect"] as const) {
      const tracker = new FishNetCharacterTracker();
      tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));
      tracker.consume(pinPacket(202));
      tracker.consume(characterPacket("CharacterCallback_T"));
      // A candidate for an object the player has not been pinned to must not survive the boundary.
      tracker.consume(resourcePacket(303, "HealthComponent", 5, 10));

      tracker.consume({ ...syncPacket(0, "HealthComponent", ""), packetName });

      // The snapshot outlives the boundary, so the weight derived from it does too.
      expect(tracker.currentObjectId()).toBeUndefined();
      expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
      expect(tracker.state().records).toMatchObject({ currentMana: 120, maxMana: 240 });

      // The next pin starts that object's records from scratch, and must not promote a candidate buffered before the boundary.
      tracker.consume(pinPacket(303));
      expect(tracker.state().records).toBeUndefined();
      expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
    }
  });

  test("keeps local resources and weight when the player object despawns", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(resourcePacket(202, "HealthComponent", 750, 1_000));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));
    tracker.consume(pinPacket(202));
    tracker.consume(characterPacket("CharacterCallback_T"));

    tracker.consume({ ...syncPacket(202, "HealthComponent", ""), packetName: "objectDespawn" });

    expect(tracker.currentObjectId()).toBeUndefined();
    expect(tracker.state().records).toMatchObject({ currentHealth: 750, maxHealth: 1_000 });
    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("clears resources and weight when the character changes", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));

    const other = characterPacket("CharacterCallback_T");
    other.payload = syntheticCharacter(true, false, "Example Adventurer");
    tracker.consume(other);

    expect(tracker.current()?.name).toBe("Example Adventurer");
    expect(tracker.state().records).toBeUndefined();
    expect(tracker.state().weight).toBeUndefined();
  });

  test("ignores lifecycle and sync packets that reuse the local object id on another connection", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));

    // Object ids are only unique within a connection; a neighbouring one must not touch local state.
    const foreign = { connectionId: "other-connection" };
    tracker.consume({ ...resourcePacket(202, "HealthComponent", 5, 10), ...foreign } as CapturedFishNetPacket);
    tracker.consume({ ...syncPacket(202, "HealthComponent", ""), ...foreign, packetName: "objectDespawn" } as CapturedFishNetPacket);

    expect(tracker.currentObjectId()).toBe(202);
    expect(tracker.state().records).toMatchObject({ currentMana: 120, maxMana: 240 });
    expect(tracker.state().records).not.toMatchObject({ currentHealth: 5, maxHealth: 10 });
    expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });
  });

  test("does not promote resource candidates belonging to other players", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(resourcePacket(101, "SkillsComponent", 999, 999));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));

    tracker.consume(pinPacket(202));

    expect(tracker.state().records).toMatchObject({ currentMana: 120, maxMana: 240 });
    expect(tracker.state().records).not.toMatchObject({ currentMana: 999, maxMana: 999 });
  });

  test("exposes identity from a StatusComponent Data/Level/JobLevel sync, independent of a full snapshot", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));
    tracker.consume(identityPacket(202, "Synthetic Hero", 88, 42));

    expect(tracker.state().identity).toEqual({ name: "Synthetic Hero", level: 88, jobLevel: 42 });
    expect(tracker.state().snapshot).toBeUndefined();
    expect(tracker.state().status).toBe("waiting");
  });

  test("clears identity when the local object is released", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));
    tracker.consume(identityPacket(202, "Synthetic Hero", 88, 42));
    expect(tracker.state().identity).toBeDefined();

    tracker.consume({ ...syncPacket(202, "StatusComponent", ""), packetName: "authenticated" } as CapturedFishNetPacket);

    expect(tracker.state().identity).toBeUndefined();
  });

  test("ignores identity syncs belonging to other players", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(202));

    tracker.consume(identityPacket(101, "Someone Else", 5, 5));

    expect(tracker.state().identity).toBeUndefined();
  });
});

function syncPacket(objectId: number, networkBehaviourType: string, payloadHex: string): CapturedFishNetPacket {
  return {
    tick: 2,
    packetId: 7,
    packetName: "syncType",
    objectId,
    networkBehaviourType,
    raw: Buffer.alloc(0),
    payload: Buffer.from(payloadHex, "hex"),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

function pinPacket(objectId: number): CapturedFishNetPacket {
  return {
    ...syncPacket(objectId, "HealthComponent", ""),
    packetName: "serverRpc",
  };
}

function resourcePacket(
  objectId: number,
  networkBehaviourType: "HealthComponent" | "SkillsComponent",
  current: number,
  maximum: number,
): CapturedFishNetPacket {
  const packet = syncPacket(objectId, networkBehaviourType, "");
  packet.payload = Buffer.concat([Buffer.from([0]), packed(current), Buffer.from([1]), packed(maximum)]);
  return packet;
}

function identityPacket(objectId: number, name: string, level: number, jobLevel: number): CapturedFishNetPacket {
  const packet = syncPacket(objectId, "StatusComponent", "");
  (packet as CapturedFishNetPacket & { decodedFields: unknown }).decodedFields = [
    { name: "DisplayName", typeName: "System.String", codec: "stringUtf8Packed", value: name },
    { name: "DisplayClass", typeName: "Archetype", codec: "packedInt32", value: 0 },
    { name: "Race", typeName: "Race", codec: "packedInt32", value: 0 },
    { name: "Level", typeName: "Int32", codec: "packedInt32", value: level },
    { name: "JobLevel", typeName: "Int32", codec: "packedInt32", value: jobLevel },
  ];
  return packet;
}

function currentResourcePacket(
  objectId: number,
  networkBehaviourType: "HealthComponent" | "SkillsComponent",
  current: number,
): CapturedFishNetPacket {
  const packet = syncPacket(objectId, networkBehaviourType, "");
  packet.payload = Buffer.concat([Buffer.from([0]), packed(current)]);
  return packet;
}

function spawnEntry(networkBehaviourType: string, name: string, value: number) {
  return {
    componentIndex: 0,
    networkBehaviourType,
    index: 0,
    name,
    fields: [{ name, typeName: "Synthetic", codec: "packedInt32" as const, value }],
  };
}

function packed(value: number): Buffer {
  let encoded = BigInt(value) << 1n;
  const bytes: number[] = [];
  while (encoded >= 0x80n) {
    bytes.push(Number(encoded & 0x7fn) | 0x80);
    encoded >>= 7n;
  }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}

class ManualTiming {
  private nowMs = 0;
  private nextId = 1;
  private callbacks = new Map<number, { at: number; callback: () => void }>();

  options() {
    return {
      now: () => this.nowMs,
      schedule: (callback: () => void, delayMs: number): unknown => {
        const id = this.nextId++;
        this.callbacks.set(id, { at: this.nowMs + delayMs, callback });
        return id;
      },
      cancel: (handle: unknown) => this.callbacks.delete(handle as number),
    };
  }

  advance(milliseconds: number): void {
    this.nowMs += milliseconds;
    while (true) {
      const due = [...this.callbacks]
        .filter(([, timer]) => timer.at <= this.nowMs)
        .sort(([, left], [, right]) => left.at - right.at)[0];
      if (!due) return;
      this.callbacks.delete(due[0]);
      due[1].callback();
    }
  }
}
