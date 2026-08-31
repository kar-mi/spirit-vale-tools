import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodeCharacterRecordSync, decodeCharacterSpawnRecords } from "./record-decoder.ts";

function syncPacket(networkBehaviourType: string | undefined, payloadHex: string): CapturedFishNetPacket {
  return {
    tick: 1,
    packetId: 7,
    packetName: "syncType",
    objectId: 47472,
    ...(networkBehaviourType === undefined ? {} : { networkBehaviourType }),
    raw: Buffer.alloc(0),
    payload: Buffer.from(payloadHex, "hex"),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

describe("decodeCharacterRecordSync", () => {
  test("decodes current and maximum HP from a HealthComponent sync", () => {
    // Hand-constructed: index 0 (current) and index 1 (max) both zigzag-varint-encode 1,000.
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "00d00f01d00f")))
      .toEqual({ currentHealth: 1_000, maxHealth: 1_000 });
  });

  test("decodes a current-HP-only sync during combat", () => {
    // Hand-constructed: only syncvar 0 (current HP), zigzag-varint-encoding 500.
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "00e807")))
      .toEqual({ currentHealth: 500 });
  });

  test("decodes the current shield from a HealthComponent sync", () => {
    // Hand-constructed: syncvar 2 (`barrierSync`), zigzag-varint-encoding 350.
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "02bc05")))
      .toEqual({ currentShield: 350 });
  });

  test("decodes mana from a SkillsComponent sync", () => {
    // Hand-constructed: index 1 (max) then index 0 (current), both zigzag-varint-encoding 200.
    expect(decodeCharacterRecordSync(syncPacket("SkillsComponent", "019003009003")))
      .toEqual({ currentMana: 200, maxMana: 200 });
  });

  test("decodes the move-speed float from a MoveComponent sync", () => {
    // Hand-constructed: syncvar 1, float32 LE for 10.0.
    const update = decodeCharacterRecordSync(syncPacket("MoveComponent", "0100002041"));
    expect(update?.moveSpeed).toBeCloseTo(10.0, 3);
  });

  test("skips the MoveComponent state byte before the speed float", () => {
    // Hand-constructed: index 0 (state, one byte skipped) then index 1, float32 LE for 10.0.
    const update = decodeCharacterRecordSync(syncPacket("MoveComponent", "00aa0100002041"));
    expect(update?.moveSpeed).toBeCloseTo(10.0, 3);
  });

  test("ignores unsupported components, truncated payloads, and implausible values", () => {
    expect(decodeCharacterRecordSync(syncPacket("StatusComponent", "0001020304"))).toBeUndefined();
    expect(decodeCharacterRecordSync(syncPacket(undefined, "00e807"))).toBeUndefined();
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "00ff"))).toBeUndefined();
    // Hand-constructed: syncvar 1, float32 LE for -10.0 - negative move speed is implausible.
    expect(decodeCharacterRecordSync(syncPacket("MoveComponent", "01000020c1"))).toBeUndefined();
  });
});

describe("decodeCharacterSpawnRecords", () => {
  test("uses exact decoded behaviour and SyncType names", () => {
    expect(decodeCharacterSpawnRecords([
      spawnEntry("HealthComponent", "healthSync", 750),
      spawnEntry("HealthComponent", "maxHealthSync", 1_000),
      spawnEntry("HealthComponent", "barrierSync", 350),
      spawnEntry("SkillsComponent", "manaSync", 120),
      spawnEntry("SkillsComponent", "maxManaSync", 240),
      spawnEntry("MoveComponent", "MoveSpeed", 8.925),
      spawnEntry("OtherComponent", "healthSync", 1),
    ])).toEqual({
      currentHealth: 750,
      maxHealth: 1_000,
      currentShield: 350,
      currentMana: 120,
      maxMana: 240,
      moveSpeed: 8.925,
    });
  });
});

function spawnEntry(networkBehaviourType: string, name: string, value: number) {
  return {
    componentIndex: 0,
    networkBehaviourType,
    index: 0,
    name,
    fields: [{ name, typeName: "Synthetic", codec: "packedInt32" as const, value }],
  };
}
