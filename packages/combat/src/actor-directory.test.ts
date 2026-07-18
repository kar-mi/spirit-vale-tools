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

  test("reads a player identity from a captured full-state spawn payload", () => {
    // Real spawn SyncType area captured from session 20260718T221603923Z-24c5859c (object 47650).
    // VisualData (index 5) sits mid-payload after entries with codecs the rpc map cannot skip.
    const captured = Buffer.from(
      "000c12001100101e234339423045432c234138444441380f5e633a34623133636563652d303138342d343164612d61323666"
      + "2d3633383163333462663938363a33633435383339380e10426c657373696e670d0a4d657263790c000b0000000009010701"
      + "061c050c4461797669641c003e04080c180a020000140026436f6465782042696e64696e67204c6967687402144d61676520"
      + "47756172640426576869746520426973686f70277320486f6f6406104d6167654c65677308104d616765466565740a124d61"
      + "676543686573740c185363726f6c6c20436861726d0e14436c6f7564204c6f6f70121249726f6e2048616c6f1018466c616d"
      + "6520537069726974001600000100000001010100000e000a1643686573745f557262616e060000061a4c6567735f50726965"
      + "73745f4d060000081a43617375616c5f466565745f370600000e2248616e64735f5472616e73706172656e74060000121a43"
      + "617375616c5f4261636b5f37060000101e5363686f6c617220476c617373657300000014164d6f6e73746572204261740000"
      + "0102019a990d410006020201f24d00f24d0302010800cdcc8c3f0c6666663f010004040c220000004006cecc4c3fcecc4c3f"
      + "cecc4c3f000000000c000000000000404000000000000000000000404000000000040201a61600a616050605100400030002"
      + "6401ae01000c4461797669641c000702010000fa4300223736353631313937393933393736343132",
      "hex",
    );

    const directory = new FishNetActorDirectory();
    const events = directory.consume(spawn(1, 47650, 2651, "PlayerController", captured));
    expect(events).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 1,
      actorId: 47650,
      displayName: "Dayvid",
      archetype: 14,
      ownerConnectionId: 2651,
    }]);
  });

  test("names the local player from a CharacterCallback_T payload", () => {
    // Real prefix captured from session 20260718T224705686Z-bf379ac3 (object 62698, name "rak").
    const characterCallback = Buffer.from(
      "04004861366331636634652d626334312d343739352d613236642d633065336563333763633433"
      + "223736353631313938333833383738383435ac534837323931396164382d313634312d343834"
      + "652d383865642d6461656234656231646563380c6d656d6265720672616b000c262e22240c0a0a00",
      "hex",
    );

    const directory = new FishNetActorDirectory();
    directory.consume(spawn(1, 62698, 21, "PlayerController"));
    expect(directory.consume({
      ...packet(2, "rpcLink", 62698),
      rpcName: "CharacterCallback_T",
      payload: characterCallback,
    })).toEqual([{
      kind: "actorIdentity",
      operation: "upsert",
      tick: 2,
      actorId: 62698,
      displayName: "rak",
      ownerConnectionId: 21,
    }]);
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
