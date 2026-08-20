import { readFloatVector } from "./wire-reader.ts";

/** A Unity quaternion as `[x, y, z, w]`. */
export type Quaternion = readonly [number, number, number, number];

/**
 * Range the three smallest components of a "smallest three" packed quaternion are encoded into.
 * The omitted (largest-magnitude) component is always `>= this`, which is what lets the other
 * three be packed into a narrower range than [-1, 1] without losing precision.
 */
const MAXIMUM = 1 / 1.414214;

const SCALE_10_BIT = (1 << 9) - 1;
const SCALE_21_BIT = (1 << 20) - 1;
const SCALE_20_BIT = (1 << 19) - 1;

function scaleToFloat(value: number, intScale: number): number {
  const unscaled = (value * MAXIMUM) / intScale;
  return unscaled > MAXIMUM ? unscaled - MAXIMUM * 2 : unscaled;
}

/** Fills the three non-largest axes, in ascending axis order, then reconstructs the omitted one. */
function reconstruct(largestComponent: number, a: number, b: number, c: number): Quaternion | undefined {
  if (largestComponent < 0 || largestComponent > 3) return undefined;
  const parts = [undefined, undefined, undefined, undefined] as Array<number | undefined>;
  const remaining = [a, b, c];
  let next = 0;
  for (let axis = 0; axis < 4; axis += 1) {
    if (axis === largestComponent) continue;
    parts[axis] = remaining[next];
    next += 1;
  }
  const sumOfSquares = a * a + b * b + c * c;
  const largest = Math.sqrt(Math.max(0, 1 - sumOfSquares));
  parts[largestComponent] = largest;
  return parts as unknown as Quaternion;
}

function decode32(buffer: Buffer, start: number): Quaternion | undefined {
  const compressed = buffer.readUInt32LE(start);
  const largestComponent = compressed >>> 30;
  const integerA = (compressed >>> 20) & 0x3ff;
  const integerB = (compressed >>> 10) & 0x3ff;
  const integerC = compressed & 0x3ff;
  return reconstruct(
    largestComponent,
    scaleToFloat(integerA, SCALE_10_BIT),
    scaleToFloat(integerB, SCALE_10_BIT),
    scaleToFloat(integerC, SCALE_10_BIT),
  );
}

function decode64(buffer: Buffer, start: number): Quaternion | undefined {
  const compressed = buffer.readBigUInt64LE(start);
  const largestComponent = Number(compressed >> 62n);
  const integerA = Number((compressed >> 41n) & 0x1fffffn);
  const integerB = Number((compressed >> 20n) & 0x1fffffn);
  const integerC = Number(compressed & 0xfffffn);
  return reconstruct(
    largestComponent,
    scaleToFloat(integerA, SCALE_21_BIT),
    scaleToFloat(integerB, SCALE_21_BIT),
    scaleToFloat(integerC, SCALE_20_BIT),
  );
}

/**
 * Decodes a quaternion FishNet wrote in one of its three `NetworkTransform` rotation packings:
 * 16 bytes uncompressed (4x float32), 8 bytes ("PackedLess", 21/21/20-bit smallest-three), or
 * 4 bytes ("Packed", 10/10/10-bit smallest-three, the default). Neither compressed form carries a
 * sign for the reconstructed largest component — FishNet's encoder flips the other three
 * components' signs instead, which is equivalent for a rotation — so decode always takes the
 * positive square root.
 */
export function decodeQuaternion(buffer: Buffer, start: number, widthBytes: 4 | 8 | 16): Quaternion | undefined {
  if (widthBytes === 16) return readFloatVector(buffer, start, 4).value as unknown as Quaternion;
  if (widthBytes === 8) return decode64(buffer, start);
  return decode32(buffer, start);
}

/**
 * Yaw (rotation about the world up axis) in radians, derived from a Unity (Y-up) quaternion.
 *
 * Observed against this game's world axes: 90 degrees is north, -90 is south, 0 is west, and
 * 180 (or -180) is east.
 */
export function quaternionYaw(quaternion: Quaternion): number {
  const [x, y, z, w] = quaternion;
  return Math.atan2(2 * (w * y + x * z), 1 - 2 * (y * y + x * x));
}
