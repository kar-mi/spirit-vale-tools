import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
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

/** An instantiated spawn that carries no RPC Link registrations, as a mid-session join sees. */
function spawnWithoutLinks(objectId: number, collectionId: number, prefabId: number): Buffer {
  return message(3, Buffer.concat([
    Buffer.from([4]), packed(objectId), u16(collectionId), packed(0), packed(-1), Buffer.from([0]),
    packed(prefabId), u32(0), u16(0), u32(0),
  ]));
}

function targetRpc(objectId: number, componentIndex: number, hash: number, payload: Buffer): Buffer {
  const wireHash = hash > 0xff ? u16(hash) : Buffer.from([hash]);
  return message(10, Buffer.concat([
    packed(objectId), Buffer.from([1, componentIndex]),
    packed(wireHash.length + payload.length), wireHash, payload,
  ]));
}

function syncType(objectId: number, componentIndex: number, body: Buffer): Buffer {
  return message(7, Buffer.concat([
    packed(objectId), Buffer.from([1, componentIndex]), u32(body.length), body,
  ]));
}

function string(value: string): Buffer {
  const encoded = Buffer.from(value, "utf8");
  return Buffer.concat([packed(encoded.length), encoded]);
}

describe("bundled FishNet maps", () => {
  test("loads the current immutable map and rejects unsupported fingerprints", () => {
    const map = loadBundledFishNetRpcMap();
    expect(map.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
    expect(loadBundledFishNetRpcMap()).toBe(map);
    expect(() => loadBundledFishNetRpcMap("fictional-build")).toThrow("supported:");
  });

  test("assembles a complete map with unique behaviour-local identifiers", () => {
    const map = loadBundledFishNetRpcMap();
    expect(map.behaviours).toHaveLength(14);
    expect(map.behaviours.reduce((count, behaviour) => count + behaviour.rpcs.length, 0)).toBe(331);
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

  test("contains collision-free component layouts for verified instantiated prefabs", () => {
    const map = loadBundledFishNetRpcMap();
    const behaviourNames = new Set(map.behaviours.map(({ typeName }) => typeName));
    expect(map.prefabs).toHaveLength(5);

    const prefabKeys = map.prefabs?.map(({ collectionId, prefabId }) => `${collectionId}:${prefabId}`) ?? [];
    expect(new Set(prefabKeys).size).toBe(prefabKeys.length);
    for (const prefab of map.prefabs ?? []) {
      const indexes = prefab.components.map(({ index }) => index);
      const types = prefab.components.map(({ typeName }) => typeName);
      expect(new Set(indexes).size).toBe(indexes.length);
      expect(new Set(types).size).toBe(types.length);
      expect(types.every((typeName) => behaviourNames.has(typeName))).toBeTrue();
    }

    const component = (prefabId: number, index: number) => map.prefabs
      ?.find((prefab) => prefab.collectionId === 0 && prefab.prefabId === prefabId)
      ?.components.find((entry) => entry.index === index)?.typeName;
    expect(component(0, 0)).toBe("LootDrop");
    expect(component(1, 1)).toBe("FishNet.Component.Transforming.NetworkTransform");
    expect(component(3, 2)).toBe("HealthComponent");
    expect(component(4, 5)).toBe("StatusComponent");
    expect(component(5, 3)).toBe("HealthComponent");
    expect(component(5, 4)).toBe("CombatComponent");
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

  test("contains client-writer-only ServerRPC registrations", () => {
    const map = loadBundledFishNetRpcMap();
    const serverMethods = (typeName: string) => map.behaviours
      .find((behaviour) => behaviour.typeName === typeName)?.rpcs
      .filter((rpc) => rpc.packetKind === "serverRpc")
      .map((rpc) => [rpc.wireHash, rpc.methodName]);
    expect(serverMethods("FishNet.Component.Animating.NetworkAnimator")).toContainEqual([1, "ServerAnimatorUpdated"]);
    expect(serverMethods("FishNet.Component.Ownership.PredictedOwner")).toContainEqual([0, "ServerTakeOwnership"]);
    expect(serverMethods("FishNet.Component.Transforming.NetworkTransform")).toEqual(expect.arrayContaining([
      [1, "ServerSetInterval"],
      [5, "ServerUpdateTransform"],
      [6, "ServerSetSynchronizedProperties"],
    ]));
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

  test("names PlayerController RPCs from prefab metadata when a spawn omits RPC Links", () => {
    // FishNet registers RPC-link ids per connection at spawn, so a capture that joins mid-session
    // never sees them. The player prefab layout is what recovers the binding — without it the
    // inspect reply is an anonymous multi-KB targetRpc and only a shape guess could claim it.
    const map = loadBundledFishNetRpcMap();
    const inspect = map.behaviours
      .find(({ typeName }) => typeName === "PlayerController")?.rpcs
      .find(({ methodName }) => methodName === "Inspect_T");
    expect(inspect).toMatchObject({ packetKind: "targetRpc" });

    const decoder = new FishNetSessionDecoder(map);
    const results = decoder.decode(tick(1, Buffer.concat([
      spawnWithoutLinks(12, 0, 4),
      targetRpc(12, 0, inspect?.wireHash ?? -1, Buffer.alloc(4878, 7)),
    ])), { reliable: true, connectionId: "prefab-inspect" });

    expect(results[1]).toMatchObject({
      packetName: "targetRpc",
      networkBehaviourType: "PlayerController",
      rpcName: "Inspect_T",
      rpcResolution: "verified",
    });
  });

  test("decodes real-player health from prefab metadata without RPC Links", () => {
    const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
    const results = decoder.decode(tick(2, Buffer.concat([
      spawnWithoutLinks(13, 0, 3),
      syncType(13, 2, Buffer.concat([Buffer.from([0]), packed(417)])),
    ])), { reliable: true, connectionId: "prefab-player-health" });

    expect(results[1]).toMatchObject({
      packetName: "syncType",
      networkBehaviourType: "HealthComponent",
      syncIndex: 0,
      syncName: "CurrentHealth",
      decodedFields: [{ name: "CurrentHealth", value: 417 }],
    });
  });

  test("decodes LootDrop DTO SyncTypes from prefab metadata", () => {
    const body = Buffer.concat([
      Buffer.from([0]),
      string("Synthetic Relic"),
      string("synthetic_relic_icon"),
      packed(2),
      f32(1.25),
      f32(0.5),
      packed(3),
    ]);
    const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
    const results = decoder.decode(tick(3, Buffer.concat([
      spawnWithoutLinks(14, 0, 0),
      syncType(14, 0, body),
    ])), { reliable: true, connectionId: "prefab-loot" });

    expect(results[1]).toMatchObject({
      packetName: "syncType",
      networkBehaviourType: "LootDrop",
      syncIndex: 0,
      syncName: "Dto",
      decodedFields: [
        { name: "DisplayName", value: "Synthetic Relic" },
        { name: "SpriteId", value: "synthetic_relic_icon" },
        { name: "Rarity", value: 2 },
        { name: "Scale", value: 1.25 },
        { name: "LootChance", value: 0.5 },
        { name: "LootType", value: 3 },
      ],
    });
  });
});
