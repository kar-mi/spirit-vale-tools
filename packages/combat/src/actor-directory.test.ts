import { describe, expect, test } from "bun:test";

import { FishNetActorDirectory } from "./actor-directory.ts";
import { characterDataParameter } from "@kar-mi/spirit-vale-tools-capture";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetPacketName,
  FishNetRpcParameter,
  FishNetSpawnSyncEntry,
} from "@kar-mi/spirit-vale-tools-capture";

/** The `spawnSyncEntries` a real decode would produce for a PlayerController's VisualData sync. */
function visualSpawnEntries(displayName: string, archetype = 2, componentIndex = 0): FishNetSpawnSyncEntry[] {
  return [{
    index: 5,
    name: "VisualData",
    componentIndex,
    networkBehaviourType: "PlayerController",
    fields: visual(displayName, archetype),
  }];
}

function packet(
  tick: number,
  packetName: FishNetPacketName,
  objectId?: number,
  fields?: FishNetDecodedField[],
): DecodedFishNetPacket {
  return {
    tick,
    packetId: 7,
    packetName,
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    ...(objectId === undefined ? {} : { objectId }),
    ...(fields === undefined ? {} : {
      networkBehaviourType: "PlayerController",
      syncIndex: 5,
      syncName: "VisualData",
      decodedFields: fields,
    }),
  };
}

function visual(displayName: string, archetype = 2): FishNetDecodedField[] {
  return [
    { name: "Appearance.DisplayName", codec: "stringUtf8Packed", value: displayName },
    { name: "Appearance.Archetype", codec: "packedInt32", value: archetype },
  ];
}

function spawn(
  tick: number,
  objectId: number,
  ownerConnectionId: number,
  networkBehaviourType: string,
  spawnSyncPayload?: Buffer,
  spawnSyncEntries?: FishNetSpawnSyncEntry[],
): DecodedFishNetPacket {
  return {
    ...packet(tick, "objectSpawn", objectId),
    ownerConnectionId,
    rpcLinkRegistrations: [{
      linkId: 900 + objectId,
      objectId,
      componentIndex: 0,
      rpcHash: 1,
      packetName: "observersRpc",
      networkBehaviourType,
    }],
    ...(spawnSyncPayload === undefined ? {} : { spawnSyncPayload }),
    ...(spawnSyncEntries === undefined ? {} : { spawnSyncEntries }),
  };
}

function prefabSpawn(
  tick: number,
  objectId: number,
  ownerConnectionId: number,
  prefabId: number,
  spawnSyncPayload: Buffer | undefined,
  spawnSyncEntries?: FishNetSpawnSyncEntry[],
): DecodedFishNetPacket {
  return {
    ...spawn(tick, objectId, ownerConnectionId, "UnrecognizedComponent", spawnSyncPayload, spawnSyncEntries),
    rpcLinkRegistrations: [],
    spawnType: "instantiated",
    spawnCollectionId: 0,
    spawnPrefabId: prefabId,
  };
}

function ownership(tick: number, objectId: number, ownerConnectionId: number): DecodedFishNetPacket {
  return { ...packet(tick, "ownershipChange", objectId), ownerConnectionId };
}

describe("FishNetActorDirectory", () => {
  test("tracks every visible player and suppresses unchanged updates", () => {
    const directory = new FishNetActorDirectory();
    expect(directory.consume(packet(10, "syncType", 40, visual("Aster Vale")))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 10,
      actorId: 40,
      displayName: "Aster Vale",
      archetype: 2,
    }]);
    expect(directory.consume(packet(11, "syncType", 41, visual("Briar Stone", 4)))).toHaveLength(1);
    expect(directory.consume(packet(12, "syncType", 40, visual("Aster Vale")))).toEqual([]);
    expect(directory.get(40)).toEqual({ actorId: 40, displayName: "Aster Vale", archetype: 2 });
    expect(directory.get(41)).toEqual({ actorId: 41, displayName: "Briar Stone", archetype: 4 });
  });

  test("keeps an identity across despawn and object reuse until authoritative identity evidence replaces it", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(packet(1, "syncType", 40, visual("Aster Vale")));
    expect(directory.consume(packet(2, "syncType", 40, visual("Aster Dawn", 3))))
      .toMatchObject([{ operation: "upsert", displayName: "Aster Dawn", archetype: 3 }]);
    expect(directory.consume(packet(3, "objectDespawn", 40))).toEqual([]);
    expect(directory.get(40)).toMatchObject({ displayName: "Aster Dawn" });

    expect(directory.consume(packet(4, "objectSpawn", 40))).toEqual([]);
    expect(directory.get(40)).toMatchObject({ displayName: "Aster Dawn" });
    expect(directory.consume(packet(5, "syncType", 40, visual("Cedar North"))))
      .toMatchObject([{ operation: "upsert", actorId: 40, displayName: "Cedar North" }]);
  });

  test("ignores incomplete identities and resets connection state", () => {
    const directory = new FishNetActorDirectory();
    expect(directory.consume(packet(1, "syncType", 40, [{
      name: "Appearance.DisplayName",
      codec: "stringUtf8Packed",
      value: "",
    }]))).toEqual([]);
    directory.consume(packet(2, "syncType", 40, visual("Aster Vale")));
    expect(directory.consume(packet(3, "authenticated"))).toEqual([
      { kind: "actorIdentity", operation: "reset", tick: 3 },
    ]);
    expect(directory.get(40)).toBeUndefined();
  });

  test("propagates a player identity to same-owner combat objects", () => {
    const directory = new FishNetActorDirectory();
    expect(directory.consume(spawn(1, 40, 7, "PlayerController"))).toEqual([]);
    expect(directory.consume(spawn(2, 140, 7, "SkillsComponent"))).toEqual([]);
    expect(directory.consume(packet(3, "syncType", 40, visual("Aster Vale")))).toEqual([
      {
        kind: "actorIdentity",
        operation: "upsert",
        tick: 3,
        actorId: 40,
        displayName: "Aster Vale",
        archetype: 2,
        ownerConnectionId: 7,
      },
      {
        kind: "actorIdentity",
        operation: "upsert",
        tick: 3,
        actorId: 140,
        displayName: "Aster Vale",
        archetype: 2,
        ownerConnectionId: 7,
      },
    ]);
    expect(directory.get(140)).toMatchObject({ displayName: "Aster Vale", ownerConnectionId: 7 });

    expect(directory.consume(spawn(4, 240, 7, "CombatComponent"))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 4,
      actorId: 240,
      displayName: "Aster Vale",
      archetype: 2,
      ownerConnectionId: 7,
    }]);
  });

  test("propagates identity to an observed combat actor with incomplete spawn behaviour metadata", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    directory.consume(spawn(2, 140, 7, "UnrecognizedComponent"));
    directory.consume(packet(3, "syncType", 40, visual("Aster Vale")));

    expect(directory.get(140)).toBeUndefined();
    expect(directory.observePlayerActor(140, 4)).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 4,
      actorId: 140,
      displayName: "Aster Vale",
      archetype: 2,
      ownerConnectionId: 7,
    }]);
  });

  test("remembers an observed combat actor until its spawn and identity arrive", () => {
    const directory = new FishNetActorDirectory();
    expect(directory.observePlayerActor(140, 1)).toEqual([]);
    expect(directory.consume(spawn(2, 140, 7, "UnrecognizedComponent"))).toEqual([]);
    directory.consume(spawn(3, 40, 7, "PlayerController"));

    expect(directory.consume(packet(4, "syncType", 40, visual("Briar Stone", 4))))
      .toContainEqual({
        kind: "actorIdentity",
        operation: "upsert",
        tick: 4,
        actorId: 140,
        displayName: "Briar Stone",
        archetype: 4,
        ownerConnectionId: 7,
      });
  });

  test("clears observed combat actors at connection boundaries", () => {
    const directory = new FishNetActorDirectory();
    directory.observePlayerActor(140, 1);
    directory.consume(packet(2, "authenticated"));
    directory.consume(spawn(3, 140, 7, "UnrecognizedComponent"));
    directory.consume(spawn(4, 40, 7, "PlayerController"));
    directory.consume(packet(5, "syncType", 40, visual("Cedar North")));

    expect(directory.get(140)).toBeUndefined();
  });

  test("replaces a retained identity when a reused actor receives a new owner's direct identity", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    directory.consume(spawn(2, 140, 7, "UnrecognizedComponent"));
    directory.consume(packet(3, "syncType", 40, visual("Aster Vale")));
    directory.observePlayerActor(140, 4);

    expect(directory.consume(spawn(5, 140, 8, "UnrecognizedComponent"))).toEqual([]);
    expect(directory.get(140)).toMatchObject({ displayName: "Aster Vale" });

    directory.consume(spawn(6, 50, 8, "PlayerController"));
    directory.consume(packet(7, "syncType", 50, visual("Briar Stone", 4)));
    expect(directory.get(140)).toMatchObject({
      actorId: 140,
      displayName: "Briar Stone",
      ownerConnectionId: 8,
    });
  });

  test("uses the newest known class when a class-less owner update arrives", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    directory.consume(spawn(2, 140, 7, "SkillsComponent"));
    directory.consume(packet(3, "syncType", 40, visual("Fictional Hero", 12)));
    directory.consume(packet(4, "syncType", 140, visual("Fictional Hero", 4)));

    const events = directory.consume({
      ...packet(5, "rpcLink", 40),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload({ UID: syntheticUid, Name: "Fictional Hero" }),
    });

    expect(events).toHaveLength(2);
    expect(events.every((event) => event.operation === "upsert" && event.archetype === 4)).toBe(true);
    expect(directory.get(40)?.archetype).toBe(4);
    expect(directory.get(140)?.archetype).toBe(4);
  });

  test("reads a player identity from map-load SyncTypes embedded in the spawn", () => {
    const directory = new FishNetActorDirectory();

    expect(directory.consume(spawn(1, 60, 12, "PlayerController", undefined, visualSpawnEntries("Mapload Ranger", 6)))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 60,
      displayName: "Mapload Ranger",
      archetype: 6,
      ownerConnectionId: 12,
    }]);
    expect(directory.consume(spawn(2, 160, 12, "CombatComponent"))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 2,
      actorId: 160,
      displayName: "Mapload Ranger",
      archetype: 6,
      ownerConnectionId: 12,
    }]);
  });

  test("uses the verified player prefab when a spawn omits RPC-link registrations", () => {
    const directory = new FishNetActorDirectory();

    expect(directory.consume(prefabSpawn(1, 62, 14, 4, undefined, visualSpawnEntries("Prefab Ranger", 8)))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 62,
      displayName: "Prefab Ranger",
      archetype: 8,
      ownerConnectionId: 14,
    }]);
  });

  test("does not scan a non-player prefab without PlayerController evidence", () => {
    const playerShapedPayload = Buffer.concat([
      Buffer.from([0, 1, 5]),
      packedString("Fictional Decoy"),
      packed(8),
    ]);
    const directory = new FishNetActorDirectory();

    // Prefab 0 is LootDrop.
    expect(directory.consume(prefabSpawn(1, 63, 15, 0, playerShapedPayload))).toEqual([]);
    expect(directory.get(63)).toBeUndefined();
  });

  test("names a PlayerClone spawn so its damage is not stranded on an anonymous actor", () => {
    // A clone is a second network object under the owner's connection and deals damage under its own AttackerId.
    const directory = new FishNetActorDirectory();

    expect(directory.consume(prefabSpawn(1, 64, 16, 4, undefined, visualSpawnEntries("Mirror Ranger", 8)))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 64,
      displayName: "Mirror Ranger",
      archetype: 8,
      ownerConnectionId: 16,
    }]);
  });

  test("gives a clone its owner's identity so both fold into one meter row", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(prefabSpawn(1, 70, 21, 4, undefined, visualSpawnEntries("Owner Ranger", 8)));

    // The clone spawns under the same owner connection carrying no identity of its own.
    const events = directory.consume(prefabSpawn(2, 71, 21, 3, Buffer.alloc(0)));

    expect(events).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 2,
      actorId: 71,
      displayName: "Owner Ranger",
      archetype: 8,
      ownerConnectionId: 21,
    }]);
    expect(directory.get(71)?.displayName).toBe(directory.get(70)?.displayName);
  });

  test("finds the VisualData entry regardless of where it sits among a spawn's SyncType sections", () => {
    // A spawn commonly reports SyncTypes for several of its behaviours in one bundle; VisualData need not be first, or on componentIndex 0.
    const directory = new FishNetActorDirectory();
    const movementEntry: FishNetSpawnSyncEntry = {
      index: 2,
      name: "Position",
      componentIndex: 1,
      networkBehaviourType: "MoveComponent",
      fields: [{ name: "Position", typeName: "UnityEngine.Vector3", codec: "vector3", value: [1, 2, 3] }],
    };
    const entries = [movementEntry, ...visualSpawnEntries("Section Ranger", 9)];

    expect(directory.consume(spawn(1, 61, 13, "PlayerController", undefined, entries))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 61,
      displayName: "Section Ranger",
      archetype: 9,
      ownerConnectionId: 13,
    }]);
  });

  test("names the local player without discarding a known visual archetype", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 62698, 21, "PlayerController"));
    directory.consume(packet(2, "syncType", 62698, visual("Fictional Hero", 12)));
    expect(directory.consume({
      ...packet(3, "rpcLink", 62698),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload({ UID: syntheticUid, Name: "Fictional Hero" }),
    })).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 3,
      actorId: 62698,
      displayName: "Fictional Hero",
      archetype: 12,
      uid: syntheticUid,
      ownerConnectionId: 21,
    }]);
  });

  test("still resolves the local player's name when AppliedWriteIds is non-empty", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 71, 30, "PlayerController"));
    const payload = characterCallbackPayload({
      UID: syntheticUid,
      AppliedWriteIds: ["write-1", "write-2"],
      Name: "Fictional Hero",
    });
    expect(directory.consume({
      ...packet(2, "rpcLink", 71),
      rpcName: "CharacterCallback_T",
      payload,
    })).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 2,
      actorId: 71,
      displayName: "Fictional Hero",
      uid: syntheticUid,
      ownerConnectionId: 30,
    }]);
  });

  test("uses the cached local archetype for an actor discovered through serverRpc", () => {
    const directory = new FishNetActorDirectory({
      localIdentity: { displayName: "Fictional Hero", archetype: 12 },
    });
    directory.consume(spawn(1, 80, 31, "PlayerController"));

    expect(directory.consume(packet(2, "serverRpc", 80))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 2,
      actorId: 80,
      displayName: "Fictional Hero",
      archetype: 12,
      ownerConnectionId: 31,
    }]);
  });

  test("leaves a spawn with no VisualData unnamed", () => {
    const directory = new FishNetActorDirectory();
    expect(directory.consume(spawn(1, 61, 13, "PlayerController", undefined, [])))
      .toEqual([]);
    expect(directory.get(61)).toBeUndefined();
  });

  test("reports a newly learned identity via CharacterCallback_T but not an unchanged re-seed", () => {
    const learned: { uid: string; displayName: string; archetype?: number }[] = [];
    const directory = new FishNetActorDirectory({
      knownIdentities: [{ uid: syntheticUid, displayName: "Delta Ranger" }],
      onIdentityLearned: (identity) => learned.push(identity),
    });

    // Re-learning the exact identity already seeded via knownIdentities does not re-report it.
    directory.consume(spawn(1, 70, 44, "PlayerController"));
    directory.consume({
      ...packet(2, "rpcLink", 70),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload({ UID: syntheticUid, Name: "Delta Ranger" }),
    });
    expect(learned).toEqual([]);

    // A changed display name for the same uid is reported.
    directory.consume(spawn(3, 71, 45, "PlayerController"));
    directory.consume({
      ...packet(4, "rpcLink", 71),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload({ UID: syntheticUid, Name: "Renamed Ranger" }),
    });
    expect(learned).toEqual([{ uid: syntheticUid, displayName: "Renamed Ranger" }]);
  });

  test("snapshots every currently known identity without mutating the directory", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(packet(1, "syncType", 40, visual("Aster Vale")));
    directory.consume(packet(2, "syncType", 41, visual("Briar Stone", 4)));

    const snapshot = directory.snapshot();
    expect(snapshot.sort((left, right) => left.actorId - right.actorId)).toEqual([
      { actorId: 40, displayName: "Aster Vale", archetype: 2 },
      { actorId: 41, displayName: "Briar Stone", archetype: 4 },
    ]);

    directory.consume(packet(3, "syncType", 40, visual("Renamed")));
    expect(snapshot[0]).toEqual({ actorId: 40, displayName: "Aster Vale", archetype: 2 });
  });

  test("removes and reapplies aliases across ownership and source lifecycle changes", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    directory.consume(spawn(2, 140, 7, "SkillsComponent"));
    directory.consume(packet(3, "syncType", 40, visual("Aster Vale")));

    expect(directory.consume(ownership(4, 140, 8))).toEqual([]);
    expect(directory.get(140)).toMatchObject({ displayName: "Aster Vale" });

    directory.consume(spawn(5, 50, 8, "PlayerController"));
    expect(directory.consume(packet(6, "syncType", 50, visual("Briar Stone", 4))))
      .toMatchObject([
        { operation: "upsert", actorId: 140, displayName: "Briar Stone", ownerConnectionId: 8 },
        { operation: "upsert", actorId: 50, displayName: "Briar Stone", ownerConnectionId: 8 },
      ]);

    expect(directory.consume(packet(7, "objectDespawn", 50))).toEqual([]);
    expect(directory.get(50)).toMatchObject({ displayName: "Briar Stone" });
    expect(directory.get(140)).toMatchObject({ displayName: "Briar Stone" });
  });

  test("clears a retained player identity when direct MonsterController.Data identifies the reused actor", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(packet(1, "syncType", 40, visual("Aster Vale")));
    directory.consume(packet(2, "objectDespawn", 40));

    expect(directory.consume(monsterSync(3, 40, "NightmareShadow"))).toEqual([
      { kind: "actorIdentity", operation: "remove", tick: 3, actorId: 40 },
    ]);
    expect(directory.get(40)).toBeUndefined();
  });

  test("decodes non-Latin display names past the old 32-byte cap", () => {
    // Twelve Hangul characters are 36 UTF-8 bytes, and the guild role is 18.
    const koreanName = "김철수박영희이준호최지우";
    expect(Buffer.byteLength(koreanName)).toBe(36);

    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    const events = directory.consume({
      ...packet(2, "rpcLink", 40),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload({
        UID: syntheticUid,
        GuildRankId: "길드마스터대리",
        Name: koreanName,
      }),
    });

    expect(events).toMatchObject([{ operation: "upsert", actorId: 40, displayName: koreanName }]);
    expect(directory.get(40)).toMatchObject({ displayName: koreanName, uid: syntheticUid });
  });
});

const syntheticUid = "00000000-0000-4000-8000-000000000001";

/** Encodes a `CharacterData` payload from the bundled RPC map's own field schema (`characterDataParameter()`) rather than a hand-counted byte sequence. */
function encodeCharacterData(overrides: Record<string, string | number | readonly string[]>): Buffer {
  const schema = characterDataParameter();
  const nullFlag = schema.nullable ? Buffer.from([0]) : Buffer.alloc(0); // present, not null
  const fields = Buffer.concat((schema.fields ?? []).map((field) => encodeCharacterDataField(field, overrides[field.name])));
  return Buffer.concat([nullFlag, fields]);
}

/** Prefixes an encoded `CharacterData` with `CharacterCallback_T`'s leading update-type enum. */
function characterCallbackPayload(overrides: Record<string, string | number | readonly string[]> = {}, updateType = 2): Buffer {
  return Buffer.concat([packed(updateType), encodeCharacterData(overrides)]);
}

function encodeCharacterDataField(field: FishNetRpcParameter, value: string | number | readonly string[] | undefined): Buffer {
  if (field.repeated || field.dictionaryKey) {
    const elements = Array.isArray(value) ? value : [];
    return Buffer.concat([packed(elements.length), ...elements.map((element) => encodeCharacterDataLeaf(field, element))]);
  }
  if (field.codec) {
    const leaf = typeof value === "string" || typeof value === "number" ? value : undefined;
    return encodeCharacterDataLeaf(field, leaf ?? (field.codec === "stringUtf8Packed" ? "" : 0));
  }
  if (field.nullable) return Buffer.from([1]); // null flag: this test helper never populates nested structs
  if (field.fields) return Buffer.concat(field.fields.map((nested) => encodeCharacterDataField(nested, undefined)));
  throw new Error(`don't know how to encode CharacterData field "${field.name}" (${field.typeName ?? "unknown type"})`);
}

function encodeCharacterDataLeaf(field: FishNetRpcParameter, value: string | number | undefined): Buffer {
  switch (field.codec) {
    case "stringUtf8Packed": return packedString(typeof value === "string" ? value : "");
    case "boolean": return Buffer.from([typeof value === "number" && value !== 0 ? 1 : 0]);
    case "packedInt32":
    case "packedInt64": return packed(typeof value === "number" ? value : 0);
    default: throw new Error(`don't know how to encode CharacterData field "${field.name}" with codec "${field.codec ?? "none"}"`);
  }
}

function packedString(value: string): Buffer {
  return Buffer.concat([packed(Buffer.byteLength(value)), Buffer.from(value)]);
}

function packed(value: number): Buffer {
  let encoded = (BigInt(value) << 1n) ^ (BigInt(value) >> 63n);
  const bytes: number[] = [];
  while (encoded >= 0x80n) { bytes.push(Number(encoded & 0x7fn) | 0x80); encoded >>= 7n; }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}

function monsterSync(tick: number, objectId: number, mobId: string): DecodedFishNetPacket {
  return {
    tick,
    packetId: 1,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    objectId,
    networkBehaviourType: "MonsterController",
    syncIndex: 0,
    syncName: "Data",
    decodedFields: [{ name: "Id", codec: "stringUtf8Packed", value: mobId }],
  };
}
