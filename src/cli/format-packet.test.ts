import { describe, expect, test } from "bun:test";

import type { CapturedUdpPacket } from "../types.ts";
import { formatTransportPacket } from "./format-packet.ts";

function udpPacket(direction: "inbound" | "outbound"): CapturedUdpPacket {
  const outbound = direction === "outbound";
  return {
    protocol: "udp",
    timestampTicks: 0n,
    capturedAt: new Date(0),
    interfaceIndex: 1,
    subinterfaceIndex: 0,
    direction,
    loopback: false,
    ipVersion: 4,
    sourceIP: outbound ? "192.168.50.235" : "135.148.52.81",
    destinationIP: outbound ? "135.148.52.81" : "192.168.50.235",
    sourcePort: outbound ? 62067 : 7007,
    destinationPort: outbound ? 7007 : 62067,
    truncated: false,
    payload: Buffer.from(outbound ? "032000" : "042000e68b47f982e2de08", "hex"),
  };
}

describe("formatTransportPacket", () => {
  test("renders outbound UDP from source to destination", () => {
    expect(formatTransportPacket(udpPacket("outbound"))).toBe(
      "UDP 192.168.50.235:62067 -> 135.148.52.81:7007 payload=032000",
    );
  });

  test("renders inbound UDP from its remote source to its local destination", () => {
    expect(formatTransportPacket(udpPacket("inbound"))).toBe(
      "UDP 135.148.52.81:7007 -> 192.168.50.235:62067 payload=042000e68b47f982e2de08",
    );
  });
});
