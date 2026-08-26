import { FishNetProtocolError } from "./protocol.ts";

export interface NetworkObjectReference {
  objectId: number;
  spawned: boolean;
  nextOffset: number;
}

export interface NetworkBehaviourHeader {
  objectId: number;
  componentIndex: number;
  nextOffset: number;
}

export function requireBytes(buffer: Buffer, offset: number, count: number, description: string): void {
  if (buffer.length - offset < count) {
    throw new FishNetProtocolError(`${description} needs ${count} bytes at byte ${offset}; ${buffer.length - offset} remain`);
  }
}

export function checkedEnd(buffer: Buffer, start: number, length: number): number {
  if (!Number.isSafeInteger(length) || length < 0 || length > buffer.length - start) {
    throw new FishNetProtocolError(`length ${length} exceeds ${buffer.length - start} remaining bytes`);
  }
  return start + length;
}

export function readUnsignedPackedWhole(buffer: Buffer, start: number): { value: bigint; nextOffset: number } {
  let value = 0n;
  let shift = 0n;
  let offset = start;
  while (offset < buffer.length && offset - start < 10) {
    const byte = buffer[offset] ?? 0;
    offset += 1;
    value |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return { value, nextOffset: offset };
    shift += 7n;
  }
  throw new FishNetProtocolError(`unterminated packed integer at byte ${start}`);
}

export function readSignedPackedWhole(buffer: Buffer, start: number): { value: number; nextOffset: number } {
  const decoded = readUnsignedPackedWhole(buffer, start);
  const signed = (decoded.value >> 1n) ^ -(decoded.value & 1n);
  const value = Number(signed);
  if (!Number.isSafeInteger(value)) throw new FishNetProtocolError("packed integer exceeds JavaScript's safe range");
  return { value, nextOffset: decoded.nextOffset };
}

/**
 * FishNet's `Reader.ReadNetworkObject`/`ReadNetworkBehaviourId` sentinel for "no object" is the
 * literal value 65535 (`ushort.MaxValue`) on the *decoded* signed value, not -1 - confirmed against
 * this build's `FishNet.Runtime.dll` disassembly (`Reader.ReadNetworkObject`,
 * `Reader.ReadNetworkBehaviourId`). A decoded value of -1 is an ordinary (if unusual) object id, not
 * a null marker.
 */
const NO_OBJECT_SENTINEL = 0xffff;

export function readNetworkObjectReference(buffer: Buffer, start: number): NetworkObjectReference {
  const object = readSignedPackedWhole(buffer, start);
  if (object.value === NO_OBJECT_SENTINEL) return { objectId: object.value, spawned: false, nextOffset: object.nextOffset };
  requireBytes(buffer, object.nextOffset, 1, "network object spawned flag");
  // Real FishNet branches on this byte being exactly 1 ("spawned"); every other value - not just 0 -
  // takes the "not spawned" path (the id is then treated as a prefab id instead of a live object id).
  // There is no invalid-flag case to reject here.
  const flag = buffer[object.nextOffset];
  return { objectId: object.value, spawned: flag === 1, nextOffset: object.nextOffset + 1 };
}

export function readNetworkBehaviourHeader(buffer: Buffer, start: number): NetworkBehaviourHeader {
  // `ReadNetworkBehaviour` reads the component index unconditionally after the object reference -
  // an unspawned (prefab-only) reference is not an error here, just an object this decoder can't
  // resolve to a live spawn; the RPC still has a real component index and hash to read.
  const reference = readNetworkObjectReference(buffer, start);
  requireBytes(buffer, reference.nextOffset, 1, "network behaviour component");
  return {
    objectId: reference.objectId,
    componentIndex: buffer[reference.nextOffset] ?? 0,
    nextOffset: reference.nextOffset + 1,
  };
}

/** Reads `count` consecutive little-endian float32 values, as Unity serializes Vector3 and Quaternion. */
export function readFloatVector(buffer: Buffer, start: number, count: number): { value: number[]; nextOffset: number } {
  requireBytes(buffer, start, count * 4, "float vector");
  return {
    value: Array.from({ length: count }, (_, index) => buffer.readFloatLE(start + (index * 4))),
    nextOffset: start + (count * 4),
  };
}
