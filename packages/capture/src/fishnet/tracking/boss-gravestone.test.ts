import { describe, expect, test } from "bun:test";

import { decodeBossGravestone } from "./boss-gravestone.ts";
import type { DecodedFishNetPacket, FishNetSyncEntry, FishNetSpawnSyncEntry } from "../types.ts";

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

  test("reads a marker filled in after its own spawn, which is how a witnessed kill arrives", () => {
    const diedAtMs = 1_787_375_811_000;
    const packet = syncPacket({
      killTime: diedAtMs / 1_000,
      killerName: "Vapulah",
      bossName: "Vespa",
      bossId: "Sting",
    });

    expect(decodeBossGravestone(packet)).toEqual({
      killedBy: "Vapulah",
      bossName: "Vespa",
      mobId: "Sting",
      diedAtMs,
    });
  });

  test("reads a filled-in marker from the packet's own fields when it carries no entries", () => {
    const diedAtMs = 1_787_375_811_000;
    const { syncEntries, ...withoutEntries } = syncPacket({
      killTime: diedAtMs / 1_000,
      killerName: "Vapulah",
      bossName: "Vespa",
      bossId: "Sting",
    });
    const fields = syncEntries!.flatMap((entry) => entry.fields);

    expect(decodeBossGravestone({ ...withoutEntries, decodedFields: fields })).toMatchObject({ mobId: "Sting" });
  });

  test("ignores a SyncType on any other component", () => {
    const packet = syncPacket({ killTime: 1_700_000_000, killerName: "A", bossName: "B", bossId: "C" });
    expect(decodeBossGravestone({ ...packet, networkBehaviourType: "MonsterController" })).toBeUndefined();
    const { networkBehaviourType, ...unresolved } = packet;
    expect(decodeBossGravestone(unresolved)).toBeUndefined();
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

function syncPacket(options: {
  killTime: number;
  killerName: string;
  bossName: string;
  bossId: string;
}): DecodedFishNetPacket {
  const { componentIndex, networkBehaviourType, ...entry } = killInfoEntry(options);
  const syncEntries: FishNetSyncEntry[] = [entry];
  return {
    tick: 1,
    packetId: 7,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    objectId: 1,
    networkBehaviourIndex: componentIndex,
    networkBehaviourType,
    syncEntries,
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
