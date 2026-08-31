import { FishNetProtocolError } from "./protocol.ts";
import { resolveBundledMapName } from "../mapping/map-names.ts";
import { checkedEnd, readFloatVector, readNetworkObjectReference, readSignedPackedWhole, readUnsignedPackedWhole, requireBytes } from "./wire-reader.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetDecodedValue,
  FishNetRpcParameter,
  FishNetWireCodec,
} from "../types.ts";

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

/** Fields decoded from one entry, with the offset the next entry starts at. */
export interface FieldDecodeRun {
  fields: FishNetDecodedField[];
  consumed: number;
  complete: boolean;
}

/** Decodes one parameter list and reports where it ended, so a caller walking several concatenated entries in one payload can find the next boundary. */
export function decodeFieldRun(
  payload: Buffer,
  parameters: readonly FishNetRpcParameter[] | undefined,
  startOffset = 0,
): FieldDecodeRun {
  if (!parameters || parameters.length === 0) {
    return { fields: [], consumed: startOffset, complete: true };
  }
  const fields: FishNetDecodedField[] = [];
  const decoded = decodeParameters(payload, startOffset, parameters, "", fields);
  return { fields, consumed: decoded.offset, complete: decoded.complete };
}

/** Decode result for callers that need to know whether a payload actually *fits* a signature rather than just how much of it could be read. */
export interface FieldDecodeFit {
  consumed: number;
  complete: boolean;
  undecodable: boolean;
}

/** Strict, non-mutating decode of one payload against one parameter list. */
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

/** A parameter is evaluable when every leaf resolves to a codec; opaque structs do not. */
function isDecodable(parameters: readonly FishNetRpcParameter[]): boolean {
  return parameters.every((parameter) => {
    if (parameter.repeated || parameter.dictionaryKey) return isElementDecodable(parameter);
    if (inferredCodec(parameter)) return true;
    return parameter.fields !== undefined && parameter.fields.length > 0 && isDecodable(parameter.fields);
  });
}

/** Whether the per-element shape of a `repeated`/`dictionaryKey` parameter can be decoded. */
function isElementDecodable(parameter: FishNetRpcParameter): boolean {
  if (inferredCodec(parameter)) return true;
  return parameter.fields !== undefined && parameter.fields.length > 0 && isDecodable(parameter.fields);
}

/** Wire codecs for the BCL types the map leaves uncoded. */
const PRIMITIVE_CODECS: Readonly<Record<string, FishNetWireCodec>> = {
  "System.Boolean": "boolean",
  "System.Byte": "uint8",
  "System.Int16": "int16",
  "System.UInt16": "uint16",
  "System.Int32": "packedInt32",
  "System.Int32[]": "packedInt32Array",
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
    const result = parameter.repeated || parameter.dictionaryKey
      ? decodeRepeatedParameter(buffer, offset, parameter, name, fields)
      : decodeSingleValue(buffer, offset, parameter, name, fields);
    offset = result.offset;
    if (!result.complete) return { offset, complete: false };
  }
  return { offset, complete: true };
}

/** Decodes one non-repeated field: a leaf codec, or a nullable-flag-prefixed nested struct. */
function decodeSingleValue(
  buffer: Buffer,
  start: number,
  parameter: FishNetRpcParameter,
  name: string,
  fields: FishNetDecodedField[],
): { offset: number; complete: boolean } {
  let offset = start;
  const codec = inferredCodec(parameter);
  if (codec) {
    try {
      const decoded = decodeField(buffer, offset, codec);
      const resolvedName = name === "mapId" && typeof decoded.value === "number"
        ? resolveBundledMapName(decoded.value)
        : undefined;
      fields.push({
        name,
        typeName: parameter.typeName,
        codec,
        value: decoded.value,
        ...(resolvedName === undefined ? {} : { resolvedName }),
      });
      return { offset: decoded.nextOffset, complete: true };
    } catch {
      return { offset, complete: false };
    }
  }
  if (parameter.nullable) {
    try {
      requireBytes(buffer, offset, 1, `${name} nullable flag`);
      const isNull = buffer[offset];
      if (isNull === 1) {
        fields.push({ name, typeName: parameter.typeName, codec: "nullable", value: null });
        return { offset: offset + 1, complete: true };
      }
      if (isNull !== 0) throw new FishNetProtocolError(`invalid ${name} nullable flag`);
      offset += 1;
    } catch {
      return { offset, complete: false };
    }
  }
  if (!parameter.fields || parameter.fields.length === 0) return { offset, complete: false };
  return decodeParameters(buffer, offset, parameter.fields, name, fields);
}

/** Upper bound on a `repeated`/`dictionaryKey` element count, matching `CharacterReader.list`. */
const MAX_REPEATED_COUNT = 100_000;

/**
 * Decodes a `List<T>` (`repeated`) or `Dictionary<string, T>` (`dictionaryKey`) field: a packed
 * signed count (`-1`/negative meaning empty, matching FishNet's generic writer convention), then
 * that many elements - each preceded by a string key for a dictionary - shaped by the same
 * parameter's `codec`/`nullable`/`fields`.
 */
function decodeRepeatedParameter(
  buffer: Buffer,
  start: number,
  parameter: FishNetRpcParameter,
  name: string,
  fields: FishNetDecodedField[],
): { offset: number; complete: boolean } {
  let offset = start;
  let count: number;
  try {
    const decoded = readSignedPackedWhole(buffer, offset);
    count = decoded.value;
    offset = decoded.nextOffset;
  } catch {
    return { offset, complete: false };
  }
  const length = count < 0 ? 0 : count;
  if (length > MAX_REPEATED_COUNT) return { offset, complete: false };
  fields.push({ name: `${name}.length`, typeName: "System.Int32", codec: "packedInt32", value: length });
  const element: FishNetRpcParameter = {
    name: "",
    ...(parameter.typeName === undefined ? {} : { typeName: parameter.typeName }),
    ...(parameter.codec === undefined ? {} : { codec: parameter.codec }),
    ...(parameter.nullable === undefined ? {} : { nullable: parameter.nullable }),
    ...(parameter.fields === undefined ? {} : { fields: parameter.fields }),
  };
  for (let index = 0; index < length; index += 1) {
    const elementName = `${name}[${index}]`;
    if (parameter.dictionaryKey) {
      try {
        const decoded = decodeField(buffer, offset, parameter.dictionaryKey);
        fields.push({ name: `${elementName}.$key`, typeName: "System.String", codec: parameter.dictionaryKey, value: decoded.value });
        offset = decoded.nextOffset;
      } catch {
        return { offset, complete: false };
      }
    }
    const result = decodeSingleValue(buffer, offset, element, elementName, fields);
    offset = result.offset;
    if (!result.complete) return { offset, complete: false };
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
    case "packedInt32Array": {
      const count = readSignedPackedWhole(buffer, offset);
      if (count.value === -1) return { value: null, nextOffset: count.nextOffset };
      if (count.value < 0 || count.value > 100_000) throw new FishNetProtocolError("invalid packed Int32[] length");
      const value: number[] = [];
      let nextOffset = count.nextOffset;
      for (let index = 0; index < count.value; index += 1) {
        const item = readSignedPackedWhole(buffer, nextOffset);
        value.push(item.value);
        nextOffset = item.nextOffset;
      }
      return { value, nextOffset };
    }
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
    case "vector2": return readFloatVector(buffer, offset, 2);
    case "vector3": return readFloatVector(buffer, offset, 3);
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
    case "quaternion": return readFloatVector(buffer, offset, 4);
    case "networkObject": {
      const reference = readNetworkObjectReference(buffer, offset);
      return { value: reference.spawned ? reference.objectId : null, nextOffset: reference.nextOffset };
    }
  }
}

