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

export function readNetworkObjectReference(buffer: Buffer, start: number): NetworkObjectReference {
  const object = readSignedPackedWhole(buffer, start);
  if (object.value === -1) return { objectId: object.value, spawned: false, nextOffset: object.nextOffset };
  requireBytes(buffer, object.nextOffset, 1, "network object spawned flag");
  const flag = buffer[object.nextOffset];
  if (flag !== 0 && flag !== 1) throw new FishNetProtocolError("invalid network object spawned flag");
  return { objectId: object.value, spawned: flag === 1, nextOffset: object.nextOffset + 1 };
}

export function readNetworkBehaviourHeader(buffer: Buffer, start: number): NetworkBehaviourHeader {
  const reference = readNetworkObjectReference(buffer, start);
  if (!reference.spawned) throw new FishNetProtocolError("RPC object is not spawned");
  requireBytes(buffer, reference.nextOffset, 1, "network behaviour component");
  return {
    objectId: reference.objectId,
    componentIndex: buffer[reference.nextOffset] ?? 0,
    nextOffset: reference.nextOffset + 1,
  };
}
