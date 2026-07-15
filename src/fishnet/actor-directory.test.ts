import { describe, expect, test } from "bun:test";

import { FishNetActorDirectory } from "./actor-directory.ts";
import type { DecodedFishNetPacket, FishNetDecodedField, FishNetPacketName } from "./types.ts";

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
});
