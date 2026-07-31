import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import { checkedEnd, readSignedPackedWhole, requireBytes } from "@kar-mi/spirit-vale-tools-capture/wire-reader";

export interface FishNetSummonCalibrationEntry {
  skillId: string;
  isPrimary: boolean;
  isMountedSummon: boolean;
}

/** Decodes the complete summon snapshot carried by CalibrateSummons_T. */
export function decodeSummonCalibration(payload: Buffer): FishNetSummonCalibrationEntry[] {
  const count = readSignedPackedWhole(payload, 0);
  if (count.value === -1) {
    requireComplete(payload, count.nextOffset);
    return [];
  }
  if (count.value < 0) throw new FishNetProtocolError("invalid summon calibration array length");

  const entries: FishNetSummonCalibrationEntry[] = [];
  let offset = count.nextOffset;
  for (let index = 0; index < count.value; index += 1) {
    const skill = readString(payload, offset);
    offset = skill.nextOffset;
    const primary = readBoolean(payload, offset, "summon primary flag");
    offset = primary.nextOffset;
    const mounted = readBoolean(payload, offset, "summon mounted flag");
    offset = mounted.nextOffset;
    entries.push({ skillId: skill.value, isPrimary: primary.value, isMountedSummon: mounted.value });
  }
  requireComplete(payload, offset);
  return entries;
}

function readString(buffer: Buffer, offset: number): { value: string; nextOffset: number } {
  const length = readSignedPackedWhole(buffer, offset);
  if (length.value < 0) throw new FishNetProtocolError("summon skill id must not be null");
  const nextOffset = checkedEnd(buffer, length.nextOffset, length.value);
  return { value: buffer.toString("utf8", length.nextOffset, nextOffset), nextOffset };
}

function readBoolean(
  buffer: Buffer,
  offset: number,
  description: string,
): { value: boolean; nextOffset: number } {
  requireBytes(buffer, offset, 1, description);
  const value = buffer[offset];
  if (value !== 0 && value !== 1) throw new FishNetProtocolError(`invalid ${description}`);
  return { value: value === 1, nextOffset: offset + 1 };
}

function requireComplete(buffer: Buffer, offset: number): void {
  if (offset !== buffer.length) {
    throw new FishNetProtocolError(`summon calibration left ${buffer.length - offset} undecoded bytes`);
  }
}
