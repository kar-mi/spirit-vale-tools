import type {
  DecodedLiteNetLibPacket,
  LiteNetLibControlPacket,
  LiteNetLibPacket,
  LiteNetLibPacketProperty,
} from "./types.ts";

const PROPERTY_MASK = 0x1f;
const CONNECTION_MASK = 0x60;
const FRAGMENTED_MASK = 0x80;
const MERGED_PROPERTY = 12;
const MAX_MERGE_DEPTH = 32;

const PROPERTY_NAMES = [
  "unreliable",
  "channeled",
  "ack",
  "ping",
  "pong",
  "connectRequest",
  "connectAccept",
  "disconnect",
  "unconnectedMessage",
  "mtuCheck",
  "mtuOk",
  "broadcast",
  "merged",
  "shutdownOk",
  "peerNotFound",
  "invalidProtocol",
  "natMessage",
  "empty",
] as const;

export class LiteNetLibProtocolError extends Error {
  constructor(message: string, public readonly offset: number) {
    super(`${message} at byte ${offset}`);
    this.name = "LiteNetLibProtocolError";
  }
}

export function decodeLiteNetLibDatagram(data: Uint8Array): DecodedLiteNetLibPacket[] {
  const bytes = Buffer.from(data);
  if (bytes.length === 0) throw new LiteNetLibProtocolError("LiteNetLib datagram is empty", 0);
  const packets: DecodedLiteNetLibPacket[] = [];
  decodePacket(bytes, 0, [], 0, packets);
  return packets;
}

function decodePacket(
  bytes: Buffer,
  absoluteOffset: number,
  mergePath: number[],
  depth: number,
  output: DecodedLiteNetLibPacket[],
): void {
  if (bytes.length === 0) throw new LiteNetLibProtocolError("LiteNetLib packet is empty", absoluteOffset);
  const first = bytes.readUInt8(0);
  const propertyId = first & PROPERTY_MASK;
  if (propertyId >= PROPERTY_NAMES.length) {
    throw new LiteNetLibProtocolError(`unknown LiteNetLib 1.x property ${propertyId}`, absoluteOffset);
  }
  if ((first & FRAGMENTED_MASK) !== 0 && propertyId !== 1) {
    throw new LiteNetLibProtocolError("fragmentation flag is valid only on channeled packets", absoluteOffset);
  }
  if (propertyId === MERGED_PROPERTY) {
    decodeMerged(bytes, absoluteOffset, mergePath, depth, output);
    return;
  }
  output.push({ packet: decodeLeaf(bytes, absoluteOffset, propertyId), mergePath });
}

function decodeMerged(
  bytes: Buffer,
  absoluteOffset: number,
  mergePath: number[],
  depth: number,
  output: DecodedLiteNetLibPacket[],
): void {
  if (depth >= MAX_MERGE_DEPTH) {
    throw new LiteNetLibProtocolError(`LiteNetLib merged nesting exceeds ${MAX_MERGE_DEPTH}`, absoluteOffset);
  }
  let offset = 1;
  let childIndex = 0;
  while (offset < bytes.length) {
    requireLength(bytes, offset, 2, absoluteOffset, "merged child length");
    const childLength = bytes.readUInt16LE(offset);
    offset += 2;
    if (childLength === 0) throw new LiteNetLibProtocolError("merged child length is zero", absoluteOffset + offset - 2);
    requireLength(bytes, offset, childLength, absoluteOffset, "merged child");
    decodePacket(
      bytes.subarray(offset, offset + childLength),
      absoluteOffset + offset,
      [...mergePath, childIndex],
      depth + 1,
      output,
    );
    offset += childLength;
    childIndex += 1;
  }
  if (childIndex === 0) throw new LiteNetLibProtocolError("merged packet has no children", absoluteOffset);
}

function decodeLeaf(bytes: Buffer, absoluteOffset: number, propertyId: number): LiteNetLibPacket {
  const first = bytes.readUInt8(0);
  const common = {
    propertyId,
    property: PROPERTY_NAMES[propertyId] as LiteNetLibPacketProperty,
    connectionNumber: (first & CONNECTION_MASK) >> 5,
    fragmented: (first & FRAGMENTED_MASK) !== 0,
    raw: bytes,
  };
  switch (propertyId) {
    case 0:
      return { ...common, propertyId: 0, property: "unreliable", payload: bytes.subarray(1) };
    case 1: {
      const headerLength = common.fragmented ? 10 : 4;
      requireLength(bytes, 0, headerLength, absoluteOffset, "channeled header");
      return {
        ...common,
        propertyId: 1,
        property: "channeled",
        sequence: bytes.readUInt16LE(1),
        channel: bytes.readUInt8(3),
        ...(common.fragmented
          ? { fragment: { id: bytes.readUInt16LE(4), part: bytes.readUInt16LE(6), total: bytes.readUInt16LE(8) } }
          : {}),
        payload: bytes.subarray(headerLength),
      };
    }
    case 2:
      requireLength(bytes, 0, 4, absoluteOffset, "ack header");
      return {
        ...common,
        propertyId: 2,
        property: "ack",
        sequence: bytes.readUInt16LE(1),
        channel: bytes.readUInt8(3),
        payload: bytes.subarray(4),
      };
    case 3:
      requireLength(bytes, 0, 3, absoluteOffset, "ping header");
      return {
        ...common,
        propertyId: 3,
        property: "ping",
        sequence: bytes.readUInt16LE(1),
        payload: bytes.subarray(3),
      };
    case 4:
      requireLength(bytes, 0, 11, absoluteOffset, "pong header");
      return {
        ...common,
        propertyId: 4,
        property: "pong",
        sequence: bytes.readUInt16LE(1),
        timestamp: bytes.readBigInt64LE(3),
        payload: bytes.subarray(11),
      };
    default:
      return { ...common, payload: bytes.subarray(1) } as LiteNetLibControlPacket;
  }
}

function requireLength(
  bytes: Buffer,
  offset: number,
  length: number,
  absoluteOffset: number,
  field: string,
): void {
  if (offset + length > bytes.length) {
    throw new LiteNetLibProtocolError(`${field} is truncated`, absoluteOffset + bytes.length);
  }
}
