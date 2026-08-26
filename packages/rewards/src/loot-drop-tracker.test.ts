import { describe, expect, test } from "bun:test";
import type { DecodedFishNetPacket, FishNetRpcMap } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetLootDropTracker } from "./loot-drop-tracker.ts";

/** Deliberately places LootDrop on a prefab id other than the current build's, so the tracker cannot pass by matching a hardcoded number. */
const map: FishNetRpcMap = {
  buildFingerprint: "synthetic-loot-build",
  metadataVersion: 31,
  behaviours: [{ typeName: "LootDrop", rpcs: [] }],
  broadcasts: [],
  prefabs: [
    { collectionId: 0, prefabId: 7, prefabName: "LootDrop", components: [{ index: 0, typeName: "LootDrop" }] },
    { collectionId: 0, prefabId: 0, prefabName: "SyntheticMonster", components: [] },
  ],
};

function packet(values: Partial<DecodedFishNetPacket>): DecodedFishNetPacket {
  return {
    tick: 1,
    packetId: 0,
    packetName: "objectSpawn",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    ...values,
  } as DecodedFishNetPacket;
}

function spawn(objectId: number, prefabId: number, position?: readonly [number, number, number]) {
  return packet({
    packetName: "objectSpawn",
    tick: 10,
    objectId,
    spawnCollectionId: 0,
    spawnPrefabId: prefabId,
    ...(position ? { spawnLocalPosition: position } : {}),
  });
}

function sync(objectId: number, fields: Array<{ name: string; value: unknown }>) {
  return packet({
    packetName: "syncType",
    tick: 11,
    objectId,
    networkBehaviourType: "LootDrop",
    decodedFields: fields.map((field) => ({ ...field, typeName: "synthetic", codec: "packedInt32" })),
  } as Partial<DecodedFishNetPacket>);
}

describe("FishNetLootDropTracker", () => {
  test("records where a drop landed and what it turned out to be", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });

    const spawned = tracker.consume(spawn(500, 7, [10.5, 2, -30]));
    expect(spawned).toMatchObject([{ kind: "spawn", drop: { objectId: 500, position: [10.5, 2, -30] } }]);

    const updated = tracker.consume(sync(500, [
      { name: "DisplayName", value: "Synthetic Relic" },
      { name: "SpriteId", value: "synthetic-relic" },
      { name: "Rarity", value: 2 },
      { name: "PartyId", value: 4 },
    ]));
    expect(updated).toMatchObject([{
      kind: "update",
      drop: { displayName: "Synthetic Relic", spriteId: "synthetic-relic", rarity: 2, partyId: 4, position: [10.5, 2, -30] },
    }]);
  });

  test("resolves the loot prefab by name, not by a hardcoded prefab id", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });
    expect(tracker.consume(spawn(501, 0, [1, 1, 1]))).toEqual([]);
    expect(tracker.active()).toEqual([]);
  });

  test("reports a despawn as gone without claiming anyone picked it up", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });
    tracker.consume(spawn(502, 7, [0, 0, 0]));
    const removed = tracker.consume(packet({ packetName: "objectDespawn", tick: 12, objectId: 502 }));

    expect(removed).toMatchObject([{ kind: "removed", drop: { objectId: 502 } }]);
    expect(Object.keys(removed[0] ?? {})).not.toContain("pickedUpBy");
    expect(tracker.active()).toEqual([]);
  });

  test("emits nothing when a sync repeats values already held", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });
    tracker.consume(spawn(503, 7, [0, 0, 0]));
    tracker.consume(sync(503, [{ name: "DisplayName", value: "Synthetic Relic" }]));

    expect(tracker.consume(sync(503, [{ name: "DisplayName", value: "Synthetic Relic" }]))).toEqual([]);
  });

  test("ignores loot syncs for an object it never saw spawn", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });
    expect(tracker.consume(sync(999, [{ name: "DisplayName", value: "Synthetic Relic" }]))).toEqual([]);
  });
});

describe("FishNetLootDropTracker session boundaries", () => {
  test("drops every open drop when the connection is re-authenticated", () => {
    const tracker = new FishNetLootDropTracker({ rpcMap: map });
    tracker.consume(spawn(600, 7, [1, 2, 3]));

    expect(tracker.consume(packet({ packetName: "disconnect", objectId: 600 }))).toEqual([]);
    expect(tracker.active()).toEqual([]);
  });
});
