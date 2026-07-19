import type { CapturedTransportPacket } from "../types.ts";

export interface PacketParseContext {
  capturedAt: Date;
  timestampTicks: bigint;
  interfaceIndex: number;
  subinterfaceIndex?: number;
  direction: "inbound" | "outbound";
  loopback: boolean;
}

export function parseTransportPacket(data: Buffer, context: PacketParseContext): CapturedTransportPacket | undefined {
  const version = data[0]! >> 4;
  if (version === 4) return parseIpv4(data, context);
  if (version === 6) return parseIpv6(data, context);
  return undefined;
}

function parseIpv4(data: Buffer, context: PacketParseContext): CapturedTransportPacket | undefined {
  if (data.length < 20) return undefined;
  const headerLength = (data[0]! & 0x0f) * 4;
  if (headerLength < 20 || headerLength > data.length) return undefined;
  const fragment = data.readUInt16BE(6);
  if ((fragment & 0x1fff) !== 0) return undefined;
  const declaredLength = data.readUInt16BE(2);
  if (declaredLength < headerLength) return undefined;
  return parseTransport(
    data,
    headerLength,
    Math.min(declaredLength, data.length),
    declaredLength > data.length,
    data[9]!,
    4,
    formatIpv4(data, 12),
    formatIpv4(data, 16),
    context,
  );
}

function parseIpv6(data: Buffer, context: PacketParseContext): CapturedTransportPacket | undefined {
  if (data.length < 40) return undefined;
  const declaredLength = 40 + data.readUInt16BE(4);
  const packetEnd = Math.min(declaredLength, data.length);
  let nextHeader = data[6]!;
  let offset = 40;
  while ([0, 43, 44, 51, 60].includes(nextHeader)) {
    if (offset + 2 > packetEnd) return undefined;
    const current = nextHeader;
    nextHeader = data[offset]!;
    const extensionLength = current === 44
      ? 8
      : current === 51
        ? (data[offset + 1]! + 2) * 4
        : (data[offset + 1]! + 1) * 8;
    if (current === 44 && (offset + 8 > packetEnd || (data.readUInt16BE(offset + 2) & 0xfff8) !== 0)) return undefined;
    offset += extensionLength;
    if (offset > packetEnd) return undefined;
  }
  return parseTransport(
    data,
    offset,
    packetEnd,
    declaredLength > data.length,
    nextHeader,
    6,
    formatIpv6(data.subarray(8, 24)),
    formatIpv6(data.subarray(24, 40)),
    context,
  );
}

function parseTransport(
  data: Buffer,
  offset: number,
  packetEnd: number,
  truncated: boolean,
  protocol: number,
  ipVersion: 4 | 6,
  sourceIP: string,
  destinationIP: string,
  context: PacketParseContext,
): CapturedTransportPacket | undefined {
  if (offset + 4 > packetEnd) return undefined;
  const common = {
    timestampTicks: context.timestampTicks,
    capturedAt: context.capturedAt,
    interfaceIndex: context.interfaceIndex,
    subinterfaceIndex: context.subinterfaceIndex ?? 0,
    direction: context.direction,
    loopback: context.loopback,
    ipVersion,
    sourceIP,
    destinationIP,
    sourcePort: data.readUInt16BE(offset),
    destinationPort: data.readUInt16BE(offset + 2),
    truncated,
  } as const;
  if (protocol === 6) {
    if (offset + 20 > packetEnd) return undefined;
    const headerLength = (data[offset + 12]! >> 4) * 4;
    if (headerLength < 20 || offset + headerLength > packetEnd) return undefined;
    return {
      ...common,
      protocol: "tcp",
      sequenceNumber: data.readUInt32BE(offset + 4),
      acknowledgementNumber: data.readUInt32BE(offset + 8),
      tcpFlags: data[offset + 13]!,
      payload: Buffer.from(data.subarray(offset + headerLength, packetEnd)),
    };
  }
  if (protocol === 17) {
    if (offset + 8 > packetEnd) return undefined;
    const udpLength = data.readUInt16BE(offset + 4);
    if (udpLength < 8) return undefined;
    const declaredEnd = offset + udpLength;
    return {
      ...common,
      protocol: "udp",
      truncated: truncated || declaredEnd > packetEnd,
      payload: Buffer.from(data.subarray(offset + 8, Math.min(declaredEnd, packetEnd))),
    };
  }
  return undefined;
}

function formatIpv4(data: Buffer, offset: number): string {
  return `${data[offset]}.${data[offset + 1]}.${data[offset + 2]}.${data[offset + 3]}`;
}

function formatIpv6(data: Buffer): string {
  const words = Array.from({ length: 8 }, (_, index) => data.readUInt16BE(index * 2));
  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < words.length;) {
    if (words[start] !== 0) { start += 1; continue; }
    let end = start;
    while (end < words.length && words[end] === 0) end += 1;
    if (end - start > bestLength && end - start > 1) {
      bestStart = start;
      bestLength = end - start;
    }
    start = end;
  }
  if (bestStart < 0) return words.map((word) => word.toString(16)).join(":");
  const before = words.slice(0, bestStart).map((word) => word.toString(16)).join(":");
  const after = words.slice(bestStart + bestLength).map((word) => word.toString(16)).join(":");
  return `${before}::${after}`;
}
