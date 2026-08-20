import { describe, expect, test } from "bun:test";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetPositionTracker } from "./position-tracker.ts";

function packet(values: Partial<DecodedFishNetPacket>): DecodedFishNetPacket {
  return {
    tick: 1,
    packetId: 0,
    packetName: "observersRpc",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    ...values,
  } as DecodedFishNetPacket;
}

function spawn(objectId: number, position: readonly [number, number, number]) {
  return packet({ packetName: "objectSpawn", objectId, spawnLocalPosition: position });
}

function move(objectId: number, axes: { x?: number; y?: number; z?: number }, heading?: number) {
  return packet({ objectId, networkTransform: { position: axes, heading, consumed: 0 } });
}

describe("FishNetPositionTracker", () => {
  test("seeds a position from the spawn transform", () => {
    const tracker = new FishNetPositionTracker();
    expect(tracker.consume(spawn(1, [10, 20, 30]))).toMatchObject([
      { kind: "position", objectId: 1, position: { x: 10, y: 20, z: 30 }, self: false },
    ]);
  });

  test("applies a partial update to the axes it already knows", () => {
    const tracker = new FishNetPositionTracker();
    tracker.consume(spawn(1, [10, 20, 30]));

    expect(tracker.consume(move(1, { x: 11 }))).toMatchObject([
      { position: { x: 11, y: 20, z: 30 } },
    ]);
  });

  test("waits rather than reporting an unknown axis as zero", () => {
    const tracker = new FishNetPositionTracker();
    expect(tracker.consume(move(2, { x: 5 }))).toEqual([]);
    expect(tracker.get(2)).toBeUndefined();

    expect(tracker.consume(move(2, { x: 5, y: 6, z: 7 }))).toMatchObject([{ position: { x: 5, y: 6, z: 7 } }]);
  });

  test("marks the object the caller identified as the local player", () => {
    const tracker = new FishNetPositionTracker();
    tracker.setLocalObjectId(3);
    tracker.consume(spawn(3, [1, 2, 3]));
    tracker.consume(spawn(4, [4, 5, 6]));

    expect(tracker.self()).toEqual({ x: 1, y: 2, z: 3 });
    expect(tracker.consume(move(4, { x: 9 }))[0]?.self).toBe(false);
  });

  test("seeds a heading from the spawn rotation", () => {
    const tracker = new FishNetPositionTracker();
    expect(tracker.consume(packet({ packetName: "objectSpawn", objectId: 1, spawnLocalPosition: [10, 20, 30], spawnHeading: 1.5 })))
      .toMatchObject([{ position: { x: 10, y: 20, z: 30, heading: 1.5 } }]);
  });

  test("carries the last known heading forward across an update that omits rotation", () => {
    const tracker = new FishNetPositionTracker();
    tracker.consume(spawn(1, [10, 20, 30]));
    tracker.consume(move(1, { x: 11 }, 0.5));

    expect(tracker.consume(move(1, { x: 12 }))).toMatchObject([{ position: { x: 12, heading: 0.5 } }]);
  });

  test("forgets an object once it despawns", () => {
    const tracker = new FishNetPositionTracker();
    tracker.consume(spawn(5, [1, 2, 3]));
    tracker.consume(packet({ packetName: "objectDespawn", objectId: 5 }));

    expect(tracker.get(5)).toBeUndefined();
    expect(tracker.snapshot()).toEqual([]);
  });
});

describe("FishNetPositionTracker session boundaries", () => {
  test("drops every position when the connection is re-authenticated", () => {
    const tracker = new FishNetPositionTracker();
    tracker.setLocalObjectId(6);
    tracker.consume(spawn(6, [1, 2, 3]));

    expect(tracker.consume(packet({ packetName: "authenticated", objectId: 6 }))).toEqual([]);
    // Object ids are connection-scoped, so the old id must not name an object on the new one.
    expect(tracker.snapshot()).toEqual([]);
    expect(tracker.self()).toBeUndefined();
  });
});
