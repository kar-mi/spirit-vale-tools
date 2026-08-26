import type { CapturedFishNetPacket, FishNetSpawnSyncEntry } from "@kar-mi/spirit-vale-tools-capture";
import type { CharacterRecordValues } from "./types.ts";

export function decodeCharacterRecordSync(packet: CapturedFishNetPacket): Partial<CharacterRecordValues> | undefined {
  if (packet.packetName !== "syncType" || packet.payload.length === 0) return undefined;
  switch (packet.networkBehaviourType) {
    case "HealthComponent": {
      const values = readPackedPairs(packet.payload);
      return recordUpdate({ currentHealth: values.get(0), maxHealth: values.get(1) });
    }
    case "SkillsComponent": {
      const values = readPackedPairs(packet.payload);
      return recordUpdate({ currentMana: values.get(0), maxMana: values.get(1) });
    }
    case "MoveComponent":
      return recordUpdate({ moveSpeed: readMoveSpeed(packet.payload) });
    default:
      return undefined;
  }
}

/** Reads exact, map-decoded resource SyncTypes embedded in an ObjectSpawn. */
export function decodeCharacterSpawnRecords(entries: readonly FishNetSpawnSyncEntry[] | undefined): Partial<CharacterRecordValues> | undefined {
  if (!entries) return undefined;
  const update: Partial<CharacterRecordValues> = {};
  for (const entry of entries) {
    const value = entry.fields.find((field) => field.name === entry.name)?.value;
    if (typeof value !== "number") continue;
    if (entry.networkBehaviourType === "HealthComponent") {
      if (entry.name === "healthSync") update.currentHealth = value;
      else if (entry.name === "maxHealthSync") update.maxHealth = value;
    } else if (entry.networkBehaviourType === "SkillsComponent") {
      if (entry.name === "manaSync") update.currentMana = value;
      else if (entry.name === "maxManaSync") update.maxMana = value;
    } else if (entry.networkBehaviourType === "MoveComponent" && entry.name === "MoveSpeed") {
      update.moveSpeed = value;
    }
  }
  return recordUpdate(update);
}

function recordUpdate(update: Partial<CharacterRecordValues>): Partial<CharacterRecordValues> | undefined {
  const entries = Object.entries(update).filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100_000_000);
  return entries.length === 0 ? undefined : Object.fromEntries(entries);
}

function readPackedPairs(payload: Buffer): Map<number, number> {
  const values = new Map<number, number>();
  let offset = 0;
  try {
    while (offset < payload.length) {
      const index = payload.readUInt8(offset);
      offset += 1;
      const { value, next } = readPacked(payload, offset);
      offset = next;
      values.set(index, value);
    }
  } catch {
    // A malformed or unknown tail invalidates everything after the last good pair.
  }
  return values;
}

function readMoveSpeed(payload: Buffer): number | undefined {
  let offset = 0;
  while (offset < payload.length) {
    const index = payload.readUInt8(offset);
    offset += 1;
    if (index === 1) {
      if (offset + 4 > payload.length) return undefined;
      return payload.readFloatLE(offset);
    }
    if (index === 0) offset += 1;
    else return undefined;
  }
  return undefined;
}

function readPacked(payload: Buffer, start: number): { value: number; next: number } {
  let raw = 0n;
  let shift = 0n;
  let offset = start;
  for (let count = 0; count < 10; count += 1) {
    if (offset >= payload.length) throw new Error("truncated packed integer");
    const byte = payload[offset++]!;
    raw |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      const value = Number((raw >> 1n) ^ (-(raw & 1n)));
      if (!Number.isSafeInteger(value)) throw new Error("packed integer exceeds safe range");
      return { value, next: offset };
    }
    shift += 7n;
  }
  throw new Error("invalid packed integer");
}
