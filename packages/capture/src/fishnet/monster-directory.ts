/**
 * Tracks which monster type each spawned network object is, from the spawn and sync packets the
 * server sends when a monster comes into view.
 *
 * This is deliberately name-free: it resolves a `mobId` (a catalog type id) and nothing else, so
 * both the reward tracker and the combat tracker can layer their own catalog lookup on top without
 * either package depending on the other.
 */

import type { DecodedFishNetPacket, FishNetDecodedValue } from "./types.ts";
import { checkedEnd, readSignedPackedWhole } from "./wire-reader.ts";

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
      const spawned = packet.spawnSyncPayload
        ? decodeMonsterSpawn(packet.spawnSyncPayload, this.levels)
        : undefined;
      return spawned
        ? this.set(packet.objectId, spawned)
        : removed ? { operation: "remove", objectId: packet.objectId } : undefined;
    }
    if (packet.packetName !== "syncType" || packet.objectId === undefined
      || (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "MonsterController")) {
      return undefined;
    }
    const raw = decodeMonsterSync(packet.payload);
    const mobId = stringField(packet, ["Data.Id", "Monster.Id", "Id"]) ?? raw?.mobId;
    const level = numberField(packet, ["Data.Level", "Monster.Level", "Level"]) ?? raw?.level;
    if (!mobId || level === undefined || !this.levels.get(mobId)) return undefined;
    const rank = numberField(packet, ["Data.Rank", "Monster.Rank", "Rank"]) ?? raw?.rank;
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

export function decodeMonsterSync(payload: Buffer): { mobId: string; level: number; rank: number } | undefined {
  try {
    if (payload.length < 2) return undefined;
    let offset = 1; // SyncType index.
    const length = readSignedPackedWhole(payload, offset);
    if (length.value <= 0) return undefined;
    const end = checkedEnd(payload, length.nextOffset, length.value);
    const mobId = payload.toString("utf8", length.nextOffset, end);
    offset = end;
    const level = readSignedPackedWhole(payload, offset);
    const rank = readSignedPackedWhole(payload, level.nextOffset);
    const team = readSignedPackedWhole(payload, rank.nextOffset);
    if (level.value < 1 || level.value > 1_000 || rank.value < 0 || team.value < 0) return undefined;
    return { mobId, level: level.value, rank: rank.value };
  } catch {
    return undefined;
  }
}

export function decodeMonsterSpawn(
  payload: Buffer,
  levels: FishNetMonsterLevels,
): { mobId: string; level: number; rank: number } | undefined {
  const matches = new Map<string, { mobId: string; level: number; rank: number; exactLevel: boolean }>();
  for (let offset = 0; offset < payload.length; offset += 1) {
    try {
      const length = readSignedPackedWhole(payload, offset);
      if (length.value < 1 || length.value > 200) continue;
      const end = checkedEnd(payload, length.nextOffset, length.value);
      const mobId = payload.toString("utf8", length.nextOffset, end);
      const definition = levels.get(mobId);
      if (!definition) continue;
      const level = readSignedPackedWhole(payload, end);
      const rank = readSignedPackedWhole(payload, level.nextOffset);
      const team = readSignedPackedWhole(payload, rank.nextOffset);
      if (level.value < 1 || level.value > 1_000 || rank.value < 0 || rank.value > 100 || team.value < 0 || team.value > 100) continue;
      matches.set(`${mobId}|${level.value}|${rank.value}`, {
        mobId,
        level: level.value,
        rank: rank.value,
        exactLevel: level.value === definition.level,
      });
    } catch {
      // Arbitrary offsets are expected not to begin a packed string.
    }
  }
  const values = [...matches.values()];
  const exact = values.filter((value) => value.exactLevel);
  const selected = exact.length === 1 ? exact[0] : values.length === 1 ? values[0] : undefined;
  return selected ? { mobId: selected.mobId, level: selected.level, rank: selected.rank } : undefined;
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
