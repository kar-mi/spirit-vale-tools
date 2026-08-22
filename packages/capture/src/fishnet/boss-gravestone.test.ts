import { describe, expect, test } from "bun:test";

import { decodeBossGravestone } from "./boss-gravestone.ts";
import type { DecodedFishNetPacket, FishNetSpawnSyncEntry } from "./types.ts";

describe("boss gravestone", () => {
  test("reads the killer, the boss, its catalog id and the server's time of death", () => {
    const diedAtMs = 1_787_247_972_751 - 51 * 60_000 - 18_000;
    const packet = spawnPacket(killInfoEntry({
      killTime: diedAtMs / 1_000,
      killerName: "Testerson",
      bossName: "Lady Fey",
      bossId: "Sunflora Pixie",
    }));

    expect(decodeBossGravestone(packet)).toEqual({
      killedBy: "Testerson",
      bossName: "Lady Fey",
      mobId: "Sunflora Pixie",
      diedAtMs,
    });
  });

  test("ignores a spawn with no BossGraveStone SyncType entry", () => {
    expect(decodeBossGravestone(spawnPacket())).toBeUndefined();

    const otherEntry: FishNetSpawnSyncEntry = {
      componentIndex: 0,
      networkBehaviourType: "MonsterController",
      index: 0,
      name: "Data",
      fields: [{ name: "Id", codec: "stringUtf8Packed", value: "training-mob" }],
    };
    expect(decodeBossGravestone(spawnPacket(otherEntry))).toBeUndefined();
  });

  test("ignores an entry missing one of the fields it needs", () => {
    const entry = killInfoEntry({ killTime: 1_700_000_000, killerName: "Testerson", bossName: "Naga", bossId: "Snake Naga" });
    const incomplete: FishNetSpawnSyncEntry = { ...entry, fields: entry.fields.filter((field) => field.name !== "BossId") };

    expect(decodeBossGravestone(spawnPacket(incomplete))).toBeUndefined();
  });
});

function killInfoEntry(options: {
  killTime: number;
  killerName: string;
  bossName: string;
  bossId: string;
}): FishNetSpawnSyncEntry {
  return {
    componentIndex: 0,
    networkBehaviourType: "BossGraveStone",
    index: 0,
    name: "_killInfo",
    fields: [
      { name: "KillTime", codec: "float64", value: options.killTime },
      { name: "KillerName", codec: "stringUtf8Packed", value: options.killerName },
      { name: "BossName", codec: "stringUtf8Packed", value: options.bossName },
      { name: "BossId", codec: "stringUtf8Packed", value: options.bossId },
    ],
  };
}

function spawnPacket(...spawnSyncEntries: FishNetSpawnSyncEntry[]): DecodedFishNetPacket {
  return {
    tick: 1,
    packetId: 3,
    packetName: "objectSpawn",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    objectId: 1,
    ...(spawnSyncEntries.length > 0 ? { spawnSyncEntries } : {}),
  };
}
