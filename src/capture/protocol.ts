import type { CapturedTcpPacket } from "../types.ts";

const MAGIC = Buffer.from("SVCP", "ascii");
const PROTOCOL_VERSION = 1;
const HEADER_LENGTH = 12;
const PACKET_FIXED_LENGTH = 68;
const MAX_BODY_LENGTH = 1024 * 1024;

export const enum NativeRecordType {
  Ready = 1,
  Packet = 2,
  Warning = 3,
  Error = 4,
  Stopped = 5,
}

export type NativeRecord =
  | { type: NativeRecordType.Ready }
  | { type: NativeRecordType.Packet; packet: CapturedTcpPacket }
  | { type: NativeRecordType.Warning; message: string }
  | { type: NativeRecordType.Error; message: string }
  | { type: NativeRecordType.Stopped };

export class NativeProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NativeProtocolError";
  }
}

export class NativeProtocolDecoder {
  private pending = Buffer.alloc(0);

  push(chunk: Uint8Array): NativeRecord[] {
    if (chunk.byteLength === 0) return [];
    this.pending = Buffer.concat([this.pending, Buffer.from(chunk)]);
    const records: NativeRecord[] = [];
    while (this.pending.length >= HEADER_LENGTH) {
      if (!this.pending.subarray(0, 4).equals(MAGIC)) {
        throw new NativeProtocolError("capture helper emitted an invalid frame magic");
      }
      const version = this.pending.readUInt16LE(4);
      if (version !== PROTOCOL_VERSION) {
        throw new NativeProtocolError(`unsupported capture protocol version ${version}`);
      }
      const type = this.pending.readUInt8(6);
      const bodyLength = this.pending.readUInt32LE(8);
      if (bodyLength > MAX_BODY_LENGTH) {
        throw new NativeProtocolError(`capture frame body is too large: ${bodyLength}`);
      }
      const frameLength = HEADER_LENGTH + bodyLength;
      if (this.pending.length < frameLength) break;
      const body = this.pending.subarray(HEADER_LENGTH, frameLength);
      this.pending = this.pending.subarray(frameLength);
      records.push(parseRecord(type, body));
    }
    return records;
  }

  finish(): void {
    if (this.pending.length !== 0) {
      throw new NativeProtocolError("capture helper closed stdout with an incomplete frame");
    }
  }
}

function parseRecord(type: number, body: Buffer): NativeRecord {
  switch (type) {
    case NativeRecordType.Ready:
      requireEmptyBody(type, body);
      return { type };
    case NativeRecordType.Packet:
      return { type, packet: parsePacket(body) };
    case NativeRecordType.Warning:
      return { type, message: body.toString("utf8") };
    case NativeRecordType.Error:
      return { type, message: body.toString("utf8") };
    case NativeRecordType.Stopped:
      requireEmptyBody(type, body);
      return { type };
    default:
      throw new NativeProtocolError(`unknown capture record type ${type}`);
  }
}

function requireEmptyBody(type: number, body: Buffer): void {
  if (body.length !== 0) {
    throw new NativeProtocolError(`capture record type ${type} must have an empty body`);
  }
}

function parsePacket(body: Buffer): CapturedTcpPacket {
  if (body.length < PACKET_FIXED_LENGTH) {
    throw new NativeProtocolError(`packet record is too short: ${body.length}`);
  }
  const payloadLength = body.readUInt32LE(64);
  if (PACKET_FIXED_LENGTH + payloadLength !== body.length) {
    throw new NativeProtocolError("packet payload length does not match its frame");
  }
  const ipVersion = body.readUInt8(17);
  if (ipVersion !== 4 && ipVersion !== 6) {
    throw new NativeProtocolError(`invalid packet IP version ${ipVersion}`);
  }
  const attributes = body.readUInt8(19);
  return {
    timestampTicks: body.readBigInt64LE(0),
    capturedAt: new Date(),
    interfaceIndex: body.readUInt32LE(8),
    subinterfaceIndex: body.readUInt32LE(12),
    direction: body.readUInt8(16) === 0 ? "inbound" : "outbound",
    ipVersion,
    tcpFlags: body.readUInt8(18),
    truncated: (attributes & 1) !== 0,
    loopback: (attributes & 2) !== 0,
    sourceIP: formatIp(body.subarray(20, 36), ipVersion),
    destinationIP: formatIp(body.subarray(36, 52), ipVersion),
    sourcePort: body.readUInt16LE(52),
    destinationPort: body.readUInt16LE(54),
    sequenceNumber: body.readUInt32LE(56),
    acknowledgementNumber: body.readUInt32LE(60),
    payload: Buffer.from(body.subarray(PACKET_FIXED_LENGTH)),
  };
}

function formatIp(bytes: Buffer, version: 4 | 6): string {
  if (version === 4) return Array.from(bytes.subarray(12)).join(".");
  const words: number[] = [];
  for (let offset = 0; offset < 16; offset += 2) words.push(bytes.readUInt16BE(offset));

  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < words.length;) {
    if (words[start] !== 0) {
      start += 1;
      continue;
    }
    let end = start;
    while (end < words.length && words[end] === 0) end += 1;
    if (end - start > bestLength && end - start >= 2) {
      bestStart = start;
      bestLength = end - start;
    }
    start = end;
  }

  const parts = words.map((word) => word.toString(16));
  if (bestStart < 0) return parts.join(":");
  parts.splice(bestStart, bestLength, "");
  let formatted = parts.join(":");
  if (bestStart === 0) formatted = `:${formatted}`;
  if (bestStart + bestLength === words.length) formatted = `${formatted}:`;
  return formatted;
}
