import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT, LEGACY_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
import { FishNetSessionDecoder } from "./decoder.ts";

function packed(value: number): Buffer {
  let unsigned = BigInt(value >= 0 ? value * 2 : (-value * 2) - 1);
  const bytes: number[] = [];
  do {
    let byte = Number(unsigned & 0x7fn);
    unsigned >>= 7n;
    if (unsigned !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (unsigned !== 0n);
  return Buffer.from(bytes);
}

function u16(value: number): Buffer {
  const result = Buffer.alloc(2);
  result.writeUInt16LE(value);
  return result;
}

function u32(value: number): Buffer {
  const result = Buffer.alloc(4);
  result.writeUInt32LE(value);
  return result;
}

function f32(value: number): Buffer {
  const result = Buffer.alloc(4);
  result.writeFloatLE(value);
  return result;
}

function message(id: number, payload: Buffer): Buffer {
  return Buffer.concat([u16(id), payload]);
}

function tick(value: number, messages: Buffer): Buffer {
  return Buffer.concat([u32(value), messages]);
}

function spawnWithLink(objectId: number, linkId: number): Buffer {
  const records = Buffer.concat([Buffer.from([0]), u16(1), u16(linkId), u16(0), u16(9)]);
  return message(3, Buffer.concat([
    Buffer.from([4]), packed(objectId), u16(1), packed(0), packed(-1), Buffer.from([0]), packed(3),
    u32(0), u16(records.length), records, u32(0),
  ]));
}

describe("bundled FishNet maps", () => {
  test("loads the current immutable map and rejects unsupported fingerprints", () => {
    const map = loadBundledFishNetRpcMap();
    expect(map.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
    expect(loadBundledFishNetRpcMap()).toBe(map);
    expect(loadBundledFishNetRpcMap(LEGACY_GAME_BUILD_FINGERPRINT).buildFingerprint)
      .toBe(LEGACY_GAME_BUILD_FINGERPRINT);
    expect(() => loadBundledFishNetRpcMap("fictional-build")).toThrow("supported:");
  });

  test("assembles a complete map with unique behaviour-local identifiers", () => {
    const map = loadBundledFishNetRpcMap();
    expect(map.behaviours).toHaveLength(13);
    expect(map.behaviours.reduce((count, behaviour) => count + behaviour.rpcs.length, 0)).toBe(316);
    expect(map.broadcasts).toHaveLength(6);

    const behaviourNames = map.behaviours.map(({ typeName }) => typeName);
    expect(new Set(behaviourNames).size).toBe(behaviourNames.length);
    for (const behaviour of map.behaviours) {
      const identifiers = behaviour.rpcs.map(({ packetKind, wireHash }) => `${packetKind}:${wireHash}`);
      expect(new Set(identifiers).size).toBe(identifiers.length);
    }
    const broadcastHashes = map.broadcasts?.map(({ wireHash }) => wireHash) ?? [];
    expect(new Set(broadcastHashes).size).toBe(broadcastHashes.length);
  });

  test("decodes the verified Damage writer layout from the committed map", () => {
    const fullMap = loadBundledFishNetRpcMap();
    const health = fullMap.behaviours.find(({ typeName }) => typeName === "HealthComponent");
    expect(health).toBeDefined();
    const map = { ...fullMap, behaviours: health ? [health] : [] };
    const source = Buffer.from("SyntheticStrike", "utf8");
    const damage = Buffer.concat([
      packed(0), packed(37), packed(0), packed(1), packed(1), packed(source.length), source,
      packed(41), Buffer.from([0, 1]), packed(4), packed(14), packed(3),
      f32(1), f32(2), f32(3), f32(4), f32(5), f32(6),
    ]);
    const linked = message(900, Buffer.concat([packed(damage.length), damage]));
    const decoder = new FishNetSessionDecoder(map);
    const results = decoder.decode(tick(10, Buffer.concat([spawnWithLink(7, 900), linked])), {
      reliable: true,
      connectionId: "synthetic-damage",
    });

    expect(results[1]).toMatchObject({
      rpcName: "ApplyDamage_C",
      decodedFields: [
        { name: "dmg.Team", value: 0 },
        { name: "dmg.Value", value: 37 },
        { name: "dmg.Type", value: 0 },
        { name: "dmg.Hit", value: 1 },
        { name: "dmg.Hits", value: 1 },
        { name: "dmg.DamageSourceId", value: "SyntheticStrike" },
        { name: "dmg.AttackerId", value: 41 },
        { name: "dmg.IsClone", value: false },
        { name: "dmg.IsSummon", value: true },
        { name: "dmg.Element", value: 4 },
        { name: "dmg.WeaponType", value: 14 },
        { name: "dmg.Range", value: 3 },
        { name: "position", value: [1, 2, 3] },
        { name: "origin", value: [4, 5, 6] },
      ],
    });
    expect(results[1]?.undecodedPayload).toBeUndefined();

    const unsourcedDamage = Buffer.concat([
      packed(2), packed(5), packed(4), packed(0), packed(1), packed(-1), packed(-1),
      Buffer.from([0, 0]), packed(0), packed(-1), packed(0),
      f32(0), f32(0), f32(0), f32(0), f32(0), f32(0),
    ]);
    const unsourced = new FishNetSessionDecoder(map).decode(tick(11, Buffer.concat([
      spawnWithLink(8, 901),
      message(901, Buffer.concat([packed(unsourcedDamage.length), unsourcedDamage])),
    ])), { reliable: true, connectionId: "synthetic-unsourced-damage" });
    expect(unsourced[1]?.decodedFields).toContainEqual(expect.objectContaining({
      name: "dmg.DamageSourceId",
      value: null,
    }));
    expect(unsourced[1]?.decodedFields).toContainEqual(expect.objectContaining({
      name: "dmg.AttackerId",
      value: -1,
    }));
    expect(unsourced[1]?.undecodedPayload).toBeUndefined();
  });

  test("contains verified basic-attack parameter codecs", () => {
    const combat = loadBundledFishNetRpcMap().behaviours.find(({ typeName }) => typeName === "CombatComponent");
    expect(combat?.rpcs.find(({ methodName }) => methodName === "Attack_C")?.parameters).toEqual([
      { name: "position", typeName: "UnityEngine.Vector3", codec: "vector3" },
      { name: "attackTime", typeName: "System.Single", codec: "float32" },
      { name: "attackIndex", typeName: "System.Int32", codec: "packedInt32" },
    ]);
  });

  test("contains the mapped public player identity SyncType prefix", () => {
    const player = loadBundledFishNetRpcMap().behaviours.find(({ typeName }) => typeName === "PlayerController");
    expect(player?.syncTypes?.find(({ index }) => index === 5)).toEqual({
      index: 5,
      name: "VisualData",
      typeName: "CharacterVisualDto",
      fields: [{
        name: "Appearance",
        typeName: "CharacterAppearanceDto",
        fields: [
          { name: "DisplayName", typeName: "System.String", codec: "stringUtf8Packed" },
          { name: "Archetype", typeName: "Archetype", codec: "packedInt32" },
        ],
      }],
    });
  });

  test("uses the verified Damage layout for death events", () => {
    const health = loadBundledFishNetRpcMap().behaviours.find(({ typeName }) => typeName === "HealthComponent");
    const applyDamage = health?.rpcs.find(({ methodName }) => methodName === "ApplyDamage_C");
    const death = health?.rpcs.find(({ methodName }) => methodName === "Death_C");
    expect(death?.parameters?.[0]?.fields).toEqual(applyDamage?.parameters?.[0]?.fields);
  });
});
