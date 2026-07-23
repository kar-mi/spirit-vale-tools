import { describe, expect, test } from "bun:test";

import { FishNetActorDirectory } from "./actor-directory.ts";
import type { DecodedFishNetPacket, FishNetDecodedField, FishNetPacketName } from "@spiritvale/core";

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

  test("emits changes and removes stale identities on despawn or object reuse", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(packet(1, "syncType", 40, visual("Aster Vale")));
    expect(directory.consume(packet(2, "syncType", 40, visual("Aster Dawn", 3))))
      .toMatchObject([{ operation: "upsert", displayName: "Aster Dawn", archetype: 3 }]);
    expect(directory.consume(packet(3, "objectDespawn", 40))).toEqual([
      { kind: "actorIdentity", operation: "remove", tick: 3, actorId: 40 },
    ]);
    expect(directory.get(40)).toBeUndefined();

    directory.consume(packet(4, "syncType", 40, visual("Cedar North")));
    expect(directory.consume(packet(5, "objectSpawn", 40))).toEqual([
      { kind: "actorIdentity", operation: "remove", tick: 5, actorId: 40 },
    ]);
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

  test("uses the newest known class when a class-less owner update arrives", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 40, 7, "PlayerController"));
    directory.consume(spawn(2, 140, 7, "SkillsComponent"));
    directory.consume(packet(3, "syncType", 40, visual("Fictional Hero", 12)));
    directory.consume(packet(4, "syncType", 140, visual("Fictional Hero", 4)));

    const events = directory.consume({
      ...packet(5, "rpcLink", 40),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload,
    });

    expect(events).toHaveLength(2);
    expect(events.every((event) => event.operation === "upsert" && event.archetype === 4)).toBe(true);
    expect(directory.get(40)?.archetype).toBe(4);
    expect(directory.get(140)?.archetype).toBe(4);
  });

  test("reads a player identity from map-load SyncTypes embedded in the spawn", () => {
    const directory = new FishNetActorDirectory();
    const embeddedVisual = Buffer.concat([
      Buffer.from([0, 1, 5]), // component index, written SyncType count, VisualData index
      packedString("Mapload Ranger"),
      packed(6),
    ]);

    expect(directory.consume(spawn(1, 60, 12, "PlayerController", embeddedVisual))).toEqual([{
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

  test("reads a player identity from length-delimited spawn SyncType sections", () => {
    const directory = new FishNetActorDirectory();
    const visualData = Buffer.concat([Buffer.from([5]), packedString("Section Ranger"), packed(9)]);
    const movementData = Buffer.from([2, 0x10, 0x20, 0x30]);
    const embedded = Buffer.concat([
      section(1, movementData), // non-player component section skipped by the walk
      section(0, visualData),
    ]);

    expect(directory.consume(spawn(1, 61, 13, "PlayerController", embedded))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 61,
      displayName: "Section Ranger",
      archetype: 9,
      ownerConnectionId: 13,
    }]);
  });

  test("reads a player identity from a synthetic full-state spawn payload", () => {
    // Synthetic payload containing unrelated bytes before VisualData.
    // VisualData (index 5) sits mid-payload after entries with codecs the rpc map cannot skip.
    const captured = Buffer.concat([
      Buffer.from([0xaa, 0xbb, 0xcc, 0xdd]),
      Buffer.from([5]),
      packedString("Synthetic Ranger"),
      packed(14),
      Buffer.from([0x11, 0x22, 0x33]),
    ]);

    const directory = new FishNetActorDirectory();
    const events = directory.consume(spawn(1, 476, 265, "PlayerController", captured));
    expect(events).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 476,
      displayName: "Synthetic Ranger",
      archetype: 14,
      ownerConnectionId: 265,
    }]);
  });

  test("names the local player without discarding a known visual archetype", () => {
    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 62698, 21, "PlayerController"));
    directory.consume(packet(2, "syncType", 62698, visual("Fictional Hero", 12)));
    expect(directory.consume({
      ...packet(3, "rpcLink", 62698),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload,
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

  test("names a delta spawn from the UID cache across a map change", () => {
    const directory = new FishNetActorDirectory();
    const fullSpawn = Buffer.concat([
      Buffer.from([0, 2, 5]), // component index, written SyncType count, VisualData index
      packedString("Delta Ranger"),
      packed(6),
      Buffer.from([7]), // synthetic UID entry sync index
      packedString(syntheticUid),
    ]);
    expect(directory.consume(spawn(1, 60, 12, "PlayerController", fullSpawn))).toMatchObject([
      { operation: "upsert", actorId: 60, displayName: "Delta Ranger", archetype: 6 },
    ]);

    directory.consume(packet(2, "authenticated"));

    // Synthetic delta spawn with no VisualData, carrying only the UID.
    const deltaSpawn = Buffer.concat([Buffer.from([1, 1, 0, 6]), packedString(syntheticUid)]);
    expect(directory.consume(spawn(3, 70, 44, "PlayerController", deltaSpawn))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 3,
      actorId: 70,
      displayName: "Delta Ranger",
      uid: syntheticUid,
      archetype: 6,
      ownerConnectionId: 44,
    }]);
  });

  test("names a delta spawn from a UID learned via CharacterCallback_T", () => {
    const directory = new FishNetActorDirectory();
    directory.setLocalIdentity({ displayName: "Fictional Hero", archetype: 12 });
    directory.consume(spawn(1, 62698, 21, "PlayerController"));
    directory.consume({
      ...packet(2, "rpcLink", 62698),
      rpcName: "CharacterCallback_T",
      payload: characterCallbackPayload,
    });
    directory.consume(packet(3, "authenticated"));

    const deltaSpawn = Buffer.concat([Buffer.from([1, 1, 0, 6]), packedString(syntheticUid)]);
    expect(directory.consume(spawn(4, 71, 30, "PlayerController", deltaSpawn))).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 4,
      actorId: 71,
      displayName: "Fictional Hero",
      uid: syntheticUid,
      archetype: 12,
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

  test("leaves empty delta spawns unnamed and wipes the UID cache on reset", () => {
    const directory = new FishNetActorDirectory();
    const fullSpawn = Buffer.concat([
      Buffer.from([0, 1, 5]),
      packedString("Delta Ranger"),
      packed(6),
      packedString(syntheticUid),
    ]);
    directory.consume(spawn(1, 60, 12, "PlayerController", fullSpawn));

    // Empty synthetic delta spawn: nothing to name from.
    expect(directory.consume(spawn(2, 61, 13, "PlayerController", Buffer.from("0101000603010108", "hex"))))
      .toEqual([]);

    directory.reset();
    const deltaSpawn = Buffer.concat([Buffer.from([1, 1]), packedString(syntheticUid)]);
    expect(directory.consume(spawn(3, 70, 44, "PlayerController", deltaSpawn))).toEqual([]);
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

    expect(directory.consume(ownership(4, 140, 8))).toEqual([{
      kind: "actorIdentity",
      operation: "remove",
      tick: 4,
      actorId: 140,
    }]);

    directory.consume(spawn(5, 50, 8, "PlayerController"));
    expect(directory.consume(packet(6, "syncType", 50, visual("Briar Stone", 4))))
      .toMatchObject([
        { operation: "upsert", actorId: 140, displayName: "Briar Stone", ownerConnectionId: 8 },
        { operation: "upsert", actorId: 50, displayName: "Briar Stone", ownerConnectionId: 8 },
      ]);

    expect(directory.consume(packet(7, "objectDespawn", 50))).toEqual([
      { kind: "actorIdentity", operation: "remove", tick: 7, actorId: 50 },
      { kind: "actorIdentity", operation: "remove", tick: 7, actorId: 140 },
    ]);
  });
});

const syntheticUid = "00000000-0000-4000-8000-000000000001";
const characterCallbackPayload = Buffer.concat([
  packed(2), packedString(""), packedString(syntheticUid), packedString("account-example"), packed(0),
  packedString(""), packedString("member"), packedString("Fictional Hero"),
]);

function section(componentIndex: number, data: Buffer): Buffer {
  const header = Buffer.alloc(5);
  header.writeUInt8(componentIndex, 0);
  header.writeUInt32LE(data.length, 1);
  return Buffer.concat([header, data]);
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
