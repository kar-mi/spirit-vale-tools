import type { CapturedTransportPacket } from "../types.ts";

export function formatTransportPacket(packet: CapturedTransportPacket): string {
  const tcp = packet.protocol === "tcp"
    ? ` seq=${packet.sequenceNumber} ack=${packet.acknowledgementNumber} flags=0x${packet.tcpFlags.toString(16).padStart(2, "0")}`
    : "";
  return `${packet.protocol.toUpperCase()} ${packet.sourceIP}:${packet.sourcePort} -> ${packet.destinationIP}:${packet.destinationPort}` +
    `${tcp} payload=${packet.payload.toString("hex")}`;
}
