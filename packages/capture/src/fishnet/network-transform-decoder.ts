import { decodeQuaternion, quaternionYaw, type Quaternion } from "./quaternion-compression.ts";
import { readSignedPackedWhole } from "./wire-reader.ts";

/** Fixed-point scale FishNet's NetworkTransform applies before writing an axis as a 16-bit whole, and divides by on read. */
const COMPRESSED_SCALE = 100;

/** Quaternion packings NetworkTransform can be configured with, widest first for candidate fitting. */
const ROTATION_WIDTHS = [16, 8, 4] as const;

/** Per-axis bit pairs in the update flags: the first selects fixed-point, the second full float32. */
const AXIS_FLAGS = [
  { compressed: 0x01, float: 0x02 },
  { compressed: 0x04, float: 0x08 },
  { compressed: 0x10, float: 0x20 },
] as const;

const FLAG_ROTATION = 0x40;
const FLAG_EXTENDED = 0x80;
const FLAG_B_PARENT = 0x40;

/** Axes carried by one update. */
export interface NetworkTransformAxes {
  x?: number;
  y?: number;
  z?: number;
}

export interface DecodedNetworkTransform {
  position: NetworkTransformAxes;
  scale?: NetworkTransformAxes;
  /** Width in bytes of the rotation the update carried, when it carried one. */
  rotationBytes?: number;
  /** The rotation as `[x, y, z, w]`, decoded from whichever packing `rotationBytes` names. */
  rotation?: Quaternion;
  /** Yaw (radians, about the world up axis) derived from {@link rotation}. */
  heading?: number;
  /** True when the update also carried a parent NetworkBehaviour reference, which is not decoded. */
  reparented?: boolean;
  /** Bytes consumed from the start of the payload, including the segment's length prefix. */
  consumed: number;
}

export function decodeNetworkTransformData(payload: Buffer): DecodedNetworkTransform | undefined {
  try {
    const length = readSignedPackedWhole(payload, 0);
    if (length.value < 1 || length.value > payload.length - length.nextOffset) return undefined;
    const start = length.nextOffset;
    const end = start + length.value;
    const decoded = decodeEntry(payload, start, end);
    return decoded === undefined ? undefined : { ...decoded, consumed: end };
  } catch {
    return undefined;
  }
}

function decodeEntry(payload: Buffer, start: number, end: number): Omit<DecodedNetworkTransform, "consumed"> | undefined {
  const flags = payload[start];
  if (flags === undefined) return undefined;
  let offset = start + 1;

  const read = readAxes(payload, offset, end, flags);
  if (!read) return undefined;
  const position = read.axes;
  offset = read.nextOffset;

  const hasRotation = (flags & FLAG_ROTATION) !== 0;
  const extended = (flags & FLAG_EXTENDED) !== 0;

  // Without the extension byte the rotation is whatever is left, so its packing is known exactly.
  if (!extended) {
    if (!hasRotation) return offset === end ? { position } : undefined;
    const rotationBytes = end - offset;
    if (!isRotationWidth(rotationBytes)) return undefined;
    return { position, ...decodeRotationFields(payload, offset, rotationBytes) };
  }

  const candidates: Array<Omit<DecodedNetworkTransform, "consumed">> = [];
  for (const rotationBytes of hasRotation ? ROTATION_WIDTHS : [0]) {
    const extensionStart = offset + rotationBytes;
    if (extensionStart >= end) continue;
    const extension = decodeExtension(payload, extensionStart, end);
    if (!extension) continue;
    candidates.push({
      position,
      ...(extension.scale ? { scale: extension.scale } : {}),
      ...(rotationBytes > 0 ? decodeRotationFields(payload, offset, rotationBytes) : {}),
      ...(extension.reparented ? { reparented: true } : {}),
    });
  }
  return candidates.length === 1 ? candidates[0] : undefined;
}

function decodeExtension(
  payload: Buffer,
  start: number,
  end: number,
): { scale?: NetworkTransformAxes; reparented: boolean } | undefined {
  const flags = payload[start];
  if (flags === undefined) return undefined;
  const read = readAxes(payload, start + 1, end, flags);
  if (!read) return undefined;
  const reparented = (flags & FLAG_B_PARENT) !== 0;
  // A parent reference is a variable-width NetworkBehaviour, so the entry cannot be closed out here.
  if (!reparented && read.nextOffset !== end) return undefined;
  if (reparented && read.nextOffset > end) return undefined;
  return { ...(hasAxis(read.axes) ? { scale: read.axes } : {}), reparented };
}

/** Reads the axes one flag byte selects. Returns undefined when the flags or the length disagree. */
function readAxes(
  payload: Buffer,
  start: number,
  end: number,
  flags: number,
): { axes: NetworkTransformAxes; nextOffset: number } | undefined {
  const axes: NetworkTransformAxes = {};
  const names = ["x", "y", "z"] as const;
  let offset = start;
  for (const [index, axis] of AXIS_FLAGS.entries()) {
    const compressed = (flags & axis.compressed) !== 0;
    const full = (flags & axis.float) !== 0;
    // One axis is written one way or not at all; both bits set is not a form this build produces.
    if (compressed && full) return undefined;
    if (!compressed && !full) continue;
    const name = names[index]!;
    if (compressed) {
      if (end - offset < 2) return undefined;
      axes[name] = payload.readInt16LE(offset) / COMPRESSED_SCALE;
      offset += 2;
    } else {
      if (end - offset < 4) return undefined;
      axes[name] = payload.readFloatLE(offset);
      offset += 4;
    }
  }
  return { axes, nextOffset: offset };
}

function hasAxis(axes: NetworkTransformAxes): boolean {
  return axes.x !== undefined || axes.y !== undefined || axes.z !== undefined;
}

function isRotationWidth(value: number): boolean {
  return (ROTATION_WIDTHS as readonly number[]).includes(value);
}

/** Decodes the rotation at `offset`, if its width is one this build understands. */
function decodeRotationFields(
  payload: Buffer,
  offset: number,
  rotationBytes: number,
): Pick<DecodedNetworkTransform, "rotationBytes" | "rotation" | "heading"> {
  if (!isRotationWidth(rotationBytes)) return { rotationBytes };
  const rotationValue = decodeQuaternion(payload, offset, rotationBytes as 4 | 8 | 16);
  if (!rotationValue) return { rotationBytes };
  return { rotationBytes, rotation: rotationValue, heading: quaternionYaw(rotationValue) };
}

/** RPCs whose single `ArraySegment<byte>` parameter carries a NetworkTransform update. */
export const NETWORK_TRANSFORM_RPC_NAMES: ReadonlySet<string> = new Set([
  "TargetUpdateTransform",
  "ObserversUpdateClientAuthoritativeTransform",
  "ServerUpdateTransform",
]);
