/**
 * Tracks which monster type each spawned network object is, from the spawn and sync packets the
 * server sends when a monster comes into view.
 *
 * This is deliberately name-free: it resolves a `mobId` (a catalog type id) and nothing else, so
 * both the reward tracker and the combat tracker can layer their own catalog lookup on top without
 * either package depending on the other.
 */

import type { DecodedFishNetPacket, FishNetDecodedValue } from "./types.ts";

export interface FishNetMonsterSpawn {
  mobId: string;
  level: number;
  rank?: number;
}

export type FishNetMonsterDirectoryChange =
  | { operation: "upsert"; objectId: number; spawn: FishNetMonsterSpawn }
  | { operation: "remove"; objectId: number }
  | { operation: "reset" };

/**
 * The spawn payload is scanned at arbitrary offsets, so a known mob's catalog level is what
 * disambiguates a real match from a coincidental one. Supplying a lookup keeps the catalog itself
 * out of this package.
 */
export interface FishNetMonsterLevels {
  get(mobId: string): { readonly level: number } | undefined;
}

export class FishNetMonsterDirectory {
  private readonly objects = new Map<number, FishNetMonsterSpawn>();

  constructor(private readonly levels: FishNetMonsterLevels) {}

  /** Returns the identity change caused by this packet, suppressing repeated identical syncs. */
  consume(packet: DecodedFishNetPacket): FishNetMonsterDirectoryChange | undefined {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.objects.clear();
      return { operation: "reset" };
    }
    if (packet.packetName === "objectDespawn" && packet.objectId !== undefined) {
      return this.objects.delete(packet.objectId)
        ? { operation: "remove", objectId: packet.objectId }
        : undefined;
    }
    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      const removed = this.objects.delete(packet.objectId);
      const spawned = decodeMonsterSpawn(packet, this.levels);
      return spawned
        ? this.set(packet.objectId, spawned)
        : removed ? { operation: "remove", objectId: packet.objectId } : undefined;
    }
    if (packet.packetName !== "syncType" || packet.objectId === undefined
      || (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "MonsterController")) {
      return undefined;
    }
    const mobId = stringField(packet, ["Data.Id", "Monster.Id", "Id"]);
    const level = numberField(packet, ["Data.Level", "Monster.Level", "Level"]);
    if (!mobId || level === undefined || !this.levels.get(mobId)) return undefined;
    const rank = numberField(packet, ["Data.Rank", "Monster.Rank", "Rank"]);
    return this.set(packet.objectId, { mobId, level, ...(rank === undefined ? {} : { rank }) });
  }

  get(objectId: number): FishNetMonsterSpawn | undefined {
    const value = this.objects.get(objectId);
    return value ? { ...value } : undefined;
  }

  reset(): void {
    this.objects.clear();
  }

  private set(objectId: number, spawn: FishNetMonsterSpawn): FishNetMonsterDirectoryChange | undefined {
    const previous = this.objects.get(objectId);
    this.objects.set(objectId, spawn);
    if (previous?.mobId === spawn.mobId && previous.level === spawn.level && previous.rank === spawn.rank) {
      return undefined;
    }
    return { operation: "upsert", objectId, spawn: { ...spawn } };
  }
}

/**
 * Reads a monster's identity from its spawn's embedded `Data` (`MonsterDto`) SyncType entry,
 * decoded structurally from the rpc map rather than scanned for.
 */
export function decodeMonsterSpawn(
  packet: DecodedFishNetPacket,
  levels: FishNetMonsterLevels,
): { mobId: string; level: number; rank?: number } | undefined {
  const entry = packet.spawnSyncEntries?.find(
    (candidate) => candidate.networkBehaviourType === "MonsterController" && candidate.name === "Data",
  );
  if (!entry) return undefined;
  const mobId = entry.fields.find((field) => field.name === "Id")?.value;
  const level = entry.fields.find((field) => field.name === "Level")?.value;
  const rank = entry.fields.find((field) => field.name === "Rank")?.value;
  if (typeof mobId !== "string" || !mobId || typeof level !== "number" || !levels.get(mobId)) return undefined;
  return { mobId, level, ...(typeof rank === "number" ? { rank } : {}) };
}

function field(packet: DecodedFishNetPacket, names: readonly string[]): FishNetDecodedValue | undefined {
  for (const name of names) {
    const value = packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
    if (value !== undefined) return value;
  }
  return undefined;
}

function stringField(packet: DecodedFishNetPacket, names: readonly string[]): string | undefined {
  const value = field(packet, names);
  return typeof value === "string" ? value : undefined;
}

function numberField(packet: DecodedFishNetPacket, names: readonly string[]): number | undefined {
  const value = field(packet, names);
  return typeof value === "number" && Number.isInteger(value) ? value : undefined;
}
