import type { CapturedTransportPacket } from "../types.ts";
import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";

export function formatTransportPacket(packet: CapturedTransportPacket): string {
  const tcp = packet.protocol === "tcp"
    ? ` seq=${packet.sequenceNumber} ack=${packet.acknowledgementNumber} flags=0x${packet.tcpFlags.toString(16).padStart(2, "0")}`
    : "";
  return `${packet.protocol.toUpperCase()} ${packet.sourceIP}:${packet.sourcePort} -> ${packet.destinationIP}:${packet.destinationPort}` +
    `${tcp} payload=${packet.payload.toString("hex")}`;
}

export function formatLiteNetLibPacket(decoded: CapturedLiteNetLibPacket): string {
  const { packet } = decoded;
  const path = decoded.mergePath.length === 0 ? "root" : decoded.mergePath.join(".");
  const sequence = "sequence" in packet ? ` seq=${packet.sequence}` : "";
  const channel = "channel" in packet ? ` channel=${packet.channel}` : "";
  const timestamp = packet.property === "pong" ? ` timestamp=${packet.timestamp}` : "";
  const fragment = packet.property === "channeled" && packet.fragment
    ? ` fragment=${packet.fragment.id}:${packet.fragment.part}/${packet.fragment.total}`
    : "";
  return `  LNL path=${path} kind=${packet.property}${sequence}${channel}${timestamp}${fragment}` +
    ` bytes=${packet.payload.length} payload=${packet.payload.toString("hex")}`;
}
