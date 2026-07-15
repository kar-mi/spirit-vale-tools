import { describe, expect, test } from "bun:test";

import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";
import type { CapturedUdpPacket } from "../types.ts";
import { formatLiteNetLibPacket, formatTransportPacket } from "./format-packet.ts";

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
    sourceIP: outbound ? "192.0.2.10" : "198.51.100.20",
    destinationIP: outbound ? "198.51.100.20" : "192.0.2.10",
    sourcePort: outbound ? 50000 : 7007,
    destinationPort: outbound ? 7007 : 50000,
    truncated: false,
    payload: Buffer.from(outbound ? "032000" : "042000e68b47f982e2de08", "hex"),
  };
}

describe("formatTransportPacket", () => {
  test("renders outbound UDP from source to destination", () => {
    expect(formatTransportPacket(udpPacket("outbound"))).toBe(
      "UDP 192.0.2.10:50000 -> 198.51.100.20:7007 payload=032000",
    );
  });

  test("renders inbound UDP from its remote source to its local destination", () => {
    expect(formatTransportPacket(udpPacket("inbound"))).toBe(
      "UDP 198.51.100.20:7007 -> 192.0.2.10:50000 payload=042000e68b47f982e2de08",
    );
  });
});

describe("formatLiteNetLibPacket", () => {
  test("formats a merged channeled leaf", () => {
    const udp = udpPacket("inbound");
    const decoded: CapturedLiteNetLibPacket = {
      udpPacket: udp,
      mergePath: [1, 0],
      packet: {
        propertyId: 1,
        property: "channeled",
        connectionNumber: 0,
        fragmented: true,
        raw: Buffer.from("81341207020104030605aabb", "hex"),
        sequence: 0x1234,
        channel: 7,
        fragment: { id: 0x0102, part: 0x0304, total: 0x0506 },
        payload: Buffer.from("aabb", "hex"),
      },
    };
    expect(formatLiteNetLibPacket(decoded)).toBe(
      "  LNL path=1.0 kind=channeled seq=4660 channel=7 fragment=258:772/1286 bytes=2 payload=aabb",
    );
  });
});
