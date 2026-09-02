import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import { checkedEnd, readSignedPackedWhole, requireBytes } from "@kar-mi/spirit-vale-tools-capture/wire-reader";

interface FishNetEffectDisplay {
  statusId: string;
  /** Seconds left on the status. */
  remainingSeconds?: number;
  stacks: number;
  /** Server-declared stack ceiling; 0 where the status declares none. */
  maxStacks: number;
}

export interface FishNetEffectDisplayBatch {
  applies: FishNetEffectDisplay[];
  removes: string[];
}

/** Decodes the batched status snapshot carried by `ApplyEffectDisplays_O`. */
export function decodeEffectDisplays(payload: Buffer): FishNetEffectDisplayBatch {
  const applies: FishNetEffectDisplay[] = [];
  let offset = 0;
  const count = readSignedPackedWhole(payload, offset);
  offset = count.nextOffset;
  if (count.value < -1) throw new FishNetProtocolError("invalid effect display array length");
  for (let index = 0; index < count.value; index += 1) {
    const status = readString(payload, offset);
    offset = status.nextOffset;

    requireBytes(payload, offset, 4, "effect display remaining seconds");
    const remainingSeconds = payload.readFloatLE(offset);
    offset += 4;

    const stacks = readSignedPackedWhole(payload, offset);
    offset = stacks.nextOffset;
    const maxStacks = readSignedPackedWhole(payload, offset);
    offset = maxStacks.nextOffset;
    offset = readBoolean(payload, offset, "effect display flag").nextOffset;

    if (stacks.value < 0) throw new FishNetProtocolError("negative effect display stack count");
    applies.push({
      statusId: status.value,
      ...(remainingSeconds < 0 || !Number.isFinite(remainingSeconds) ? {} : { remainingSeconds }),
      stacks: stacks.value,
      maxStacks: Math.max(0, maxStacks.value),
    });
  }

  const removes: string[] = [];
  const removeCount = readSignedPackedWhole(payload, offset);
  offset = removeCount.nextOffset;
  if (removeCount.value < -1) throw new FishNetProtocolError("invalid effect removal array length");
  for (let index = 0; index < removeCount.value; index += 1) {
    const status = readString(payload, offset);
    offset = status.nextOffset;
    removes.push(status.value);
  }

  if (offset !== payload.length) {
    throw new FishNetProtocolError(`effect displays left ${payload.length - offset} undecoded bytes`);
  }
  return { applies, removes };
}

function readString(buffer: Buffer, offset: number): { value: string; nextOffset: number } {
  const length = readSignedPackedWhole(buffer, offset);
  if (length.value < 0) throw new FishNetProtocolError("effect display status id must not be null");
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
