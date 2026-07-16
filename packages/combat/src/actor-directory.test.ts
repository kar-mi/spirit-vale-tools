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
