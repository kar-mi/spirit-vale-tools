import { describe, expect, test } from "bun:test";
import { decodeNetworkTransformData } from "./network-transform-decoder.ts";

/** Length prefix FishNet writes before the ArraySegment: a signed packed whole. */
function segment(...parts: Buffer[]): Buffer {
  const body = Buffer.concat(parts);
  return Buffer.concat([packed(body.length), body]);
}

function packed(value: number): Buffer {
  let zigzag = (value << 1) ^ (value >> 31);
  const bytes: number[] = [];
  do {
    const byte = zigzag & 0x7f;
    zigzag >>>= 7;
    bytes.push(zigzag > 0 ? byte | 0x80 : byte);
  } while (zigzag > 0);
  return Buffer.from(bytes);
}

function i16(value: number): Buffer {
  const buffer = Buffer.alloc(2);
  buffer.writeInt16LE(value);
  return buffer;
}

function f32(value: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeFloatLE(value);
  return buffer;
}

describe("decodeNetworkTransformData", () => {
  test("reads fixed-point axes at hundredths", () => {
    // Flags 0x15: X, Y and Z all written as scaled 16-bit wholes.
    const update = decodeNetworkTransformData(segment(Buffer.from([0x15]), i16(32738), i16(4177), i16(-1250)));

    expect(update?.position).toEqual({ x: 327.38, y: 41.77, z: -12.5 });
    expect(update?.rotationBytes).toBeUndefined();
  });

  test("reads float32 axes when the value is too large for the fixed-point form", () => {
    // Flags 0x2a: X, Y and Z all written as full floats.
    const update = decodeNetworkTransformData(segment(Buffer.from([0x2a]), f32(1000.5), f32(-2), f32(2693.25)));

    expect(update?.position).toEqual({ x: 1000.5, y: -2, z: 2693.25 });
  });

  test("omits an axis the sender did not resend", () => {
    // Flags 0x22: X as a float and Z as a float; Y carries no bit at all.
    const update = decodeNetworkTransformData(segment(Buffer.from([0x22]), f32(10), f32(20)));

    expect(update?.position).toEqual({ x: 10, z: 20 });
    expect(update?.position.y).toBeUndefined();
  });

  test("sizes the rotation from the bytes the segment has left", () => {
    const update = decodeNetworkTransformData(
      segment(Buffer.from([0x41]), i16(500), Buffer.from("aabbccdd", "hex")),
    );

    expect(update?.position).toEqual({ x: 5 });
    expect(update?.rotationBytes).toBe(4);
  });

  test("rejects a rotation whose remaining width is not a packing this build uses", () => {
    expect(decodeNetworkTransformData(segment(Buffer.from([0x41]), i16(500), Buffer.from("aabbcc", "hex")))).toBeUndefined();
  });

  test("reads scale from the extension byte", () => {
    // Flags 0x81: X fixed-point plus an extension; extension 0x05 gives scale X and Y fixed-point.
    const update = decodeNetworkTransformData(
      segment(Buffer.from([0x81]), i16(100), Buffer.from([0x05]), i16(200), i16(300)),
    );

    expect(update?.position).toEqual({ x: 1 });
    expect(update?.scale).toEqual({ x: 2, y: 3 });
  });

  test("rejects an axis claiming both the fixed-point and float forms", () => {
    expect(decodeNetworkTransformData(segment(Buffer.from([0x03]), i16(1), f32(1)))).toBeUndefined();
  });

  test("rejects a segment whose length prefix overruns the payload", () => {
    expect(decodeNetworkTransformData(Buffer.concat([packed(40), Buffer.from([0x15])]))).toBeUndefined();
  });

  test("reports where the segment ended so trailing bundled bytes stay separate", () => {
    const trailing = Buffer.from("deadbeef", "hex");
    const update = decodeNetworkTransformData(
      Buffer.concat([segment(Buffer.from([0x01]), i16(250)), trailing]),
    );

    expect(update?.position).toEqual({ x: 2.5 });
    expect(update?.consumed).toBe(4);
  });
});
