import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import { checkedEnd, readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";

export interface FishNetSummonCalibrationEntry {
  skillId: string;
  summonId: string;
  level: number;
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
    const summon = readString(payload, offset);
    offset = summon.nextOffset;
    const level = readSignedPackedWhole(payload, offset);
    offset = level.nextOffset;
    if (level.value < 0) throw new FishNetProtocolError("summon level must not be negative");
    entries.push({ skillId: skill.value, summonId: summon.value, level: level.value });
  }
  requireComplete(payload, offset);
  return entries;
}

function readString(buffer: Buffer, offset: number): { value: string; nextOffset: number } {
  const length = readSignedPackedWhole(buffer, offset);
  if (length.value < 0) throw new FishNetProtocolError("summon calibration string must not be null");
  const nextOffset = checkedEnd(buffer, length.nextOffset, length.value);
  return { value: buffer.toString("utf8", length.nextOffset, nextOffset), nextOffset };
}

function requireComplete(buffer: Buffer, offset: number): void {
  if (offset !== buffer.length) {
    throw new FishNetProtocolError(`summon calibration left ${buffer.length - offset} undecoded bytes`);
  }
}
