import { FishNetProtocolError } from "./protocol.ts";
import { checkedEnd, readSignedPackedWhole, readUnsignedPackedWhole, requireBytes } from "./wire-reader.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetDecodedValue,
  FishNetRpcParameter,
  FishNetWireCodec,
} from "./types.ts";

export function applyDecodedFields(
  packet: DecodedFishNetPacket,
  parameters: readonly FishNetRpcParameter[] | undefined,
  startOffset = 0,
): void {
  if (!parameters || parameters.length === 0) return;
  const fields: FishNetDecodedField[] = [];
  const decoded = decodeParameters(packet.payload, startOffset, parameters, "", fields);
  if (fields.length > 0) packet.decodedFields = fields;
  if (decoded.offset < packet.payload.length) packet.undecodedPayload = packet.payload.subarray(decoded.offset);
}

function decodeParameters(
  buffer: Buffer,
  start: number,
  parameters: readonly FishNetRpcParameter[],
  prefix: string,
  fields: FishNetDecodedField[],
): { offset: number; complete: boolean } {
  let offset = start;
  for (const parameter of parameters) {
    const name = prefix.length === 0 ? parameter.name : `${prefix}.${parameter.name}`;
    if (parameter.codec) {
      try {
        const decoded = decodeField(buffer, offset, parameter.codec);
        fields.push({ name, typeName: parameter.typeName, codec: parameter.codec, value: decoded.value });
        offset = decoded.nextOffset;
      } catch {
        return { offset, complete: false };
      }
      continue;
    }
    if (!parameter.fields || parameter.fields.length === 0) return { offset, complete: false };
    const nested = decodeParameters(buffer, offset, parameter.fields, name, fields);
    offset = nested.offset;
    if (!nested.complete) return { offset, complete: false };
  }
  return { offset, complete: true };
}

function decodeField(
  buffer: Buffer,
  offset: number,
  codec: FishNetWireCodec,
): { value: FishNetDecodedValue; nextOffset: number } {
  const fixed = (count: number): number => {
    requireBytes(buffer, offset, count, codec);
    return offset + count;
  };
  switch (codec) {
    case "boolean": {
      const nextOffset = fixed(1);
      const value = buffer[offset];
      if (value !== 0 && value !== 1) throw new FishNetProtocolError("invalid boolean");
      return { value: value === 1, nextOffset };
    }
    case "uint8": return { value: buffer.readUInt8(offset), nextOffset: fixed(1) };
    case "int8": return { value: buffer.readInt8(offset), nextOffset: fixed(1) };
    case "uint16": return { value: buffer.readUInt16LE(offset), nextOffset: fixed(2) };
    case "int16": return { value: buffer.readInt16LE(offset), nextOffset: fixed(2) };
    case "uint32": return { value: buffer.readUInt32LE(offset), nextOffset: fixed(4) };
    case "int32": return { value: buffer.readInt32LE(offset), nextOffset: fixed(4) };
    case "float32": return { value: buffer.readFloatLE(offset), nextOffset: fixed(4) };
    case "float64": return { value: buffer.readDoubleLE(offset), nextOffset: fixed(8) };
    case "packedInt32": return readSignedPackedWhole(buffer, offset);
    case "packedUInt64": {
      const decoded = readUnsignedPackedWhole(buffer, offset);
      return { value: `0x${decoded.value.toString(16)}`, nextOffset: decoded.nextOffset };
    }
    case "stringUtf8Packed": {
      const length = readSignedPackedWhole(buffer, offset);
      if (length.value === -1) return { value: null, nextOffset: length.nextOffset };
      if (length.value < -1) throw new FishNetProtocolError("invalid string length");
      const nextOffset = checkedEnd(buffer, length.nextOffset, length.value);
      return { value: buffer.toString("utf8", length.nextOffset, nextOffset), nextOffset };
    }
    case "vector2": return decodeFloatVector(buffer, offset, 2);
    case "vector3": return decodeFloatVector(buffer, offset, 3);
    case "vector3IntPacked": {
      const values: number[] = [];
      let nextOffset = offset;
      for (let index = 0; index < 3; index += 1) {
        const decoded = readSignedPackedWhole(buffer, nextOffset);
        values.push(decoded.value);
        nextOffset = decoded.nextOffset;
      }
      return { value: values, nextOffset };
    }
    case "quaternion": return decodeFloatVector(buffer, offset, 4);
  }
}

function decodeFloatVector(buffer: Buffer, offset: number, count: number): { value: number[]; nextOffset: number } {
  requireBytes(buffer, offset, count * 4, "float vector");
  return {
    value: Array.from({ length: count }, (_, index) => buffer.readFloatLE(offset + (index * 4))),
    nextOffset: offset + (count * 4),
  };
}
