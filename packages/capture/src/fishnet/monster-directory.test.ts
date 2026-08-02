import { describe, expect, test } from "bun:test";

import { FishNetMonsterDirectory } from "./monster-directory.ts";
import type { DecodedFishNetPacket } from "./types.ts";

const LEVELS = new Map([["training-mob", { level: 2 }]]);

describe("FishNetMonsterDirectory", () => {
  test("identifies a monster from its sync packet", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);

    expect(directory.consume(monsterSync(1, 52))).toMatchObject({
      operation: "upsert",
      objectId: 52,
      spawn: { mobId: "training-mob", level: 2 },
    });
    expect(directory.get(52)).toMatchObject({ mobId: "training-mob" });
  });

  test("identifies a monster from its spawn payload", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);

    directory.consume(monsterSpawn(1, 53));

    expect(directory.get(53)).toMatchObject({ mobId: "training-mob", level: 2 });
  });

  test("does not report an unchanged identity twice", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);

    expect(directory.consume(monsterSync(1, 52))).toMatchObject({ operation: "upsert", objectId: 52 });
    expect(directory.consume(monsterSync(2, 52))).toBeUndefined();
  });

  test("ignores objects that are not monsters", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);
    const payload = Buffer.concat([Buffer.from([7]), string("training-mob")]);

    directory.consume({
      tick: 1, packetId: 1, packetName: "syncType", raw: payload, payload,
      objectId: 54, networkBehaviourType: "PlayerController",
    });

    expect(directory.get(54)).toBeUndefined();
  });

  test("forgets a monster once it despawns", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);
    directory.consume(monsterSync(1, 52));

    expect(directory.consume({
      tick: 2, packetId: 3, packetName: "objectDespawn",
      raw: Buffer.alloc(0), payload: Buffer.alloc(0), objectId: 52,
    })).toEqual({ operation: "remove", objectId: 52 });

    expect(directory.get(52)).toBeUndefined();
  });

  test("clears everything when the connection restarts", () => {
    const directory = new FishNetMonsterDirectory(LEVELS);
    directory.consume(monsterSync(1, 52));

    expect(directory.consume({
      tick: 2, packetId: 0, packetName: "authenticated", raw: Buffer.alloc(0), payload: Buffer.alloc(0),
    })).toEqual({ operation: "reset" });

    expect(directory.get(52)).toBeUndefined();
  });
});

function monsterSync(tick: number, objectId: number): DecodedFishNetPacket {
  const payload = Buffer.concat([
    Buffer.from([7]), string("training-mob"), packed(2), packed(0), packed(1), Buffer.from([0, 1]),
  ]);
  return {
    tick, packetId: 1, packetName: "syncType", raw: payload, payload,
    syncPayload: payload, syncIndex: 7, objectId, networkBehaviourType: "MonsterController",
  };
}

function monsterSpawn(tick: number, objectId: number): DecodedFishNetPacket {
  const spawnSyncPayload = Buffer.concat([string("training-mob"), packed(2), packed(0), packed(1)]);
  return {
    tick, packetId: 3, packetName: "objectSpawn", raw: spawnSyncPayload,
    payload: Buffer.alloc(0), objectId, spawnSyncPayload,
  };
}

function string(value: string): Buffer {
  return Buffer.concat([packed(Buffer.byteLength(value)), Buffer.from(value)]);
}

function packed(value: number | bigint): Buffer {
  const signed = BigInt(value);
  let encoded = (signed << 1n) ^ (signed >> 63n);
  const bytes: number[] = [];
  while (encoded >= 0x80n) { bytes.push(Number(encoded & 0x7fn) | 0x80); encoded >>= 7n; }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}
