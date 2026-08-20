import { describe, expect, test } from "bun:test";
import { decodeQuaternion, quaternionYaw, type Quaternion } from "./quaternion-compression.ts";

const MAXIMUM = 1 / 1.414214;

/** Encodes a quaternion the way FishNet's `Quaternion32Compression.Compress` does, for test fixtures. */
function encode32(quaternion: Quaternion): Buffer {
  const [x, y, z, w] = quaternion;
  const components = [x, y, z, w];
  let largestComponent = 0;
  for (let axis = 1; axis < 4; axis += 1) {
    if (Math.abs(components[axis]!) > Math.abs(components[largestComponent]!)) largestComponent = axis;
  }
  const sign = components[largestComponent]! < 0 ? -1 : 1;
  const remaining = components.filter((_, axis) => axis !== largestComponent).map((value) => value * sign);
  const scaleToUint = (value: number): number => Math.round((value * 511) / MAXIMUM) & 0x3ff;
  const compressed = (largestComponent << 30) | (scaleToUint(remaining[0]!) << 20) | (scaleToUint(remaining[1]!) << 10) | scaleToUint(remaining[2]!);
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(compressed >>> 0, 0);
  return buffer;
}

/** Encodes a quaternion the way FishNet's `Quaternion64Compression.Compress` does, for test fixtures. */
function encode64(quaternion: Quaternion): Buffer {
  const [x, y, z, w] = quaternion;
  const components = [x, y, z, w];
  let largestComponent = 0;
  for (let axis = 1; axis < 4; axis += 1) {
    if (Math.abs(components[axis]!) > Math.abs(components[largestComponent]!)) largestComponent = axis;
  }
  const sign = components[largestComponent]! < 0 ? -1 : 1;
  const remaining = components.filter((_, axis) => axis !== largestComponent).map((value) => value * sign);
  const scaleH = (value: number): bigint => BigInt(Math.round((value * 1048575) / MAXIMUM)) & 0x1fffffn;
  const scaleL = (value: number): bigint => BigInt(Math.round((value * 524287) / MAXIMUM)) & 0xfffffn;
  const compressed =
    (BigInt(largestComponent) << 62n) | (scaleH(remaining[0]!) << 41n) | (scaleH(remaining[1]!) << 20n) | scaleL(remaining[2]!);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(compressed, 0);
  return buffer;
}

const IDENTITY: Quaternion = [0, 0, 0, 1];
/** 90 degrees about Y. */
const YAW_90: Quaternion = [0, Math.SQRT1_2, 0, Math.SQRT1_2];
/** 180 degrees about Y. */
const YAW_180: Quaternion = [0, 1, 0, 0];
/** An arbitrary rotation with all four components populated. */
const ARBITRARY: Quaternion = [0.1826, 0.3651, 0.5477, 0.7303];

function expectCloseQuaternion(actual: Quaternion | undefined, expected: Quaternion, precision: number): void {
  expect(actual).toBeDefined();
  for (let axis = 0; axis < 4; axis += 1) {
    expect(actual![axis]!).toBeCloseTo(expected[axis]!, precision);
  }
}

describe("decodeQuaternion", () => {
  test("decodes the uncompressed 16-byte form", () => {
    const buffer = Buffer.alloc(16);
    ARBITRARY.forEach((value, index) => buffer.writeFloatLE(value, index * 4));
    expect(decodeQuaternion(buffer, 0, 16)).toEqual(ARBITRARY.map((value) => Math.fround(value)) as unknown as Quaternion);
  });

  for (const [name, quaternion] of [["identity", IDENTITY], ["90 degree yaw", YAW_90], ["180 degree yaw", YAW_180], ["arbitrary", ARBITRARY]] as const) {
    test(`decodes the 4-byte smallest-three form (${name})`, () => {
      expectCloseQuaternion(decodeQuaternion(encode32(quaternion), 0, 4), quaternion, 2);
    });

    test(`decodes the 8-byte smallest-three form (${name})`, () => {
      expectCloseQuaternion(decodeQuaternion(encode64(quaternion), 0, 8), quaternion, 4);
    });
  }
});

describe("quaternionYaw", () => {
  test("reads 0 radians from identity", () => {
    expect(quaternionYaw(IDENTITY)).toBeCloseTo(0, 5);
  });

  test("reads +90 degrees as pi/2", () => {
    expect(quaternionYaw(YAW_90)).toBeCloseTo(Math.PI / 2, 5);
  });

  test("reads 180 degrees as pi", () => {
    expect(Math.abs(quaternionYaw(YAW_180))).toBeCloseTo(Math.PI, 5);
  });
});
