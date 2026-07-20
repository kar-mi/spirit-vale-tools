import type { CapturedFishNetPacket } from "@spiritvale/core";
import type { CharacterRecordValues } from "./types.ts";

/**
 * SyncType payloads are a stream of [syncvar index byte][value] pairs whose value
 * encoding depends on the component's syncvar declaration, so each supported
 * component parses only the indexes it knows and stops at the first unknown one.
 */
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
