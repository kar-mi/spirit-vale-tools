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

  test("clears weight when the local player object changes", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));
    tracker.consume(pinPacket(101));

    tracker.consume(pinPacket(202));

    expect(tracker.state().weight).toBeUndefined();
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
      // "Synthetic Visor" is not catalogued, so the accessory slot-cap table (Hit cap 10) applies.
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

  test("clears server-synced resources when the local object changes", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(pinPacket(101));
    tracker.consume(resourcePacket(101, "HealthComponent", 750, 1_000));
    tracker.consume(resourcePacket(101, "SkillsComponent", 120, 240));

    expect(tracker.state().records).toMatchObject({
      currentHealth: 750,
      maxHealth: 1_000,
      currentMana: 120,
      maxMana: 240,
    });

    tracker.consume(pinPacket(202));

    expect(tracker.state().records).toBeUndefined();
  });

  test("clears resource tracking at connection boundaries", () => {
    for (const packetName of ["authenticated", "disconnect"] as const) {
      const tracker = new FishNetCharacterTracker();
      tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));
      tracker.consume(pinPacket(202));
      tracker.consume(characterPacket("CharacterCallback_T"));
      expect(tracker.state().records).toMatchObject({ currentMana: 120, maxMana: 240 });
      expect(tracker.state().weight).toEqual({ current: 71, maximum: 3_260 });

      tracker.consume({ ...syncPacket(0, "HealthComponent", ""), packetName });

      expect(tracker.currentObjectId()).toBeUndefined();
      expect(tracker.state().records).toBeUndefined();
      expect(tracker.state().weight).toBeUndefined();
      // A later pin must not promote a candidate buffered before the boundary.
      tracker.consume(pinPacket(202));
      expect(tracker.state().records).toBeUndefined();
    }
  });

  test("clears local resources when the player object despawns", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(resourcePacket(202, "HealthComponent", 750, 1_000));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));
    tracker.consume(pinPacket(202));
    tracker.consume(characterPacket("CharacterCallback_T"));

    tracker.consume({ ...syncPacket(202, "HealthComponent", ""), packetName: "objectDespawn" });

    expect(tracker.currentObjectId()).toBeUndefined();
    expect(tracker.state().records).toBeUndefined();
    expect(tracker.state().weight).toBeUndefined();
  });

  test("does not promote resource candidates belonging to other players", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(resourcePacket(101, "SkillsComponent", 999, 999));
    tracker.consume(resourcePacket(202, "SkillsComponent", 120, 240));

    tracker.consume(pinPacket(202));

    expect(tracker.state().records).toMatchObject({ currentMana: 120, maxMana: 240 });
    expect(tracker.state().records).not.toMatchObject({ currentMana: 999, maxMana: 999 });
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
