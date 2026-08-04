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

/**
 * Decode result for callers that need to know whether a payload actually *fits* a signature rather
 * than just how much of it could be read. `undecodable` marks a parameter list this decoder cannot
 * evaluate at all - one carrying an array or a game struct with no field breakdown - which is
 * distinct from a signature that was evaluated and did not match.
 */
export interface FieldDecodeFit {
  consumed: number;
  complete: boolean;
  undecodable: boolean;
}

/**
 * Strict, non-mutating decode of one payload against one parameter list. `applyDecodedFields` is
 * deliberately lenient - it keeps whatever prefix decoded and stashes the rest as
 * `undecodedPayload` - which is right for display but useless for telling two candidate signatures
 * apart, so shape-based elimination needs the consumed length and the undecodable flag instead.
 *
 */
export function tryDecodeFields(
  payload: Buffer,
  parameters: readonly FishNetRpcParameter[] | undefined,
  startOffset = 0,
): FieldDecodeFit {
  if (!parameters || parameters.length === 0) {
    return { consumed: startOffset, complete: true, undecodable: false };
  }
  if (!isDecodable(parameters)) return { consumed: startOffset, complete: false, undecodable: true };
  const decoded = decodeParameters(payload, startOffset, parameters, "", []);
  return { consumed: decoded.offset, complete: decoded.complete, undecodable: false };
}

/** A parameter is evaluable when every leaf resolves to a codec; arrays and opaque structs do not. */
function isDecodable(parameters: readonly FishNetRpcParameter[]): boolean {
  return parameters.every((parameter) => {
    if (inferredCodec(parameter)) return true;
    return parameter.fields !== undefined && parameter.fields.length > 0 && isDecodable(parameter.fields);
  });
}

/**
 * Wire codecs for the BCL types the map leaves uncoded. The scraper records a parameter's type name
 * even when it assigns no codec, and 130 `System.String` parameters arrive that way - without this
 * table a single uncoded parameter stops the decode dead and every field after it is lost too.
 *
 * Deliberately limited to types whose encoding is unambiguous: game structs, enums and arrays stay
 * unresolved so a caller can still tell "does not match" apart from "cannot be checked".
 */
const PRIMITIVE_CODECS: Readonly<Record<string, FishNetWireCodec>> = {
  "System.Boolean": "boolean",
  "System.Byte": "uint8",
  "System.Int16": "int16",
  "System.UInt16": "uint16",
  "System.Int32": "packedInt32",
  "System.Int64": "packedInt64",
  "System.Single": "float32",
  "System.Double": "float64",
  "System.String": "stringUtf8Packed",
  "UnityEngine.Vector2": "vector2",
  "UnityEngine.Vector3": "vector3",
  "UnityEngine.Quaternion": "quaternion",
};

function inferredCodec(parameter: FishNetRpcParameter): FishNetWireCodec | undefined {
  return parameter.codec ?? (parameter.typeName === undefined ? undefined : PRIMITIVE_CODECS[parameter.typeName]);
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
    const codec = inferredCodec(parameter);
    if (codec) {
      try {
        const decoded = decodeField(buffer, offset, codec);
        fields.push({ name, typeName: parameter.typeName, codec, value: decoded.value });
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
    case "packedInt64": {
      const decoded = readUnsignedPackedWhole(buffer, offset);
      const signed = (decoded.value >> 1n) ^ -(decoded.value & 1n);
      return { value: signed.toString(), nextOffset: decoded.nextOffset };
    }
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
