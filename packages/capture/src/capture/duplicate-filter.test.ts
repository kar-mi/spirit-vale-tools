import { describe, expect, test } from "bun:test";

import { DUPLICATE_WINDOW_MS, DuplicateFilter } from "./duplicate-filter.ts";
import type { CapturedTransportPacket } from "../types.ts";

describe("DuplicateFilter", () => {
  test("suppresses a relayed copy that differs only in the rewritten endpoints", () => {
    const filter = new DuplicateFilter();
    const payload = "0413000102030405060708";
    expect(filter.admit(udpPacket({ payload, sourcePort: 59159, destinationPort: 59171 }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload, sourcePort: 7005, destinationPort: 59171 }), 1_000)).toBe(false);
    expect(filter.suppressedCount).toBe(1);
  });

  test("admits the same payload again once the window has passed", () => {
    const filter = new DuplicateFilter();
    expect(filter.admit(udpPacket({ payload: "aabb" }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload: "aabb" }), 1_000 + DUPLICATE_WINDOW_MS - 1)).toBe(false);
    expect(filter.admit(udpPacket({ payload: "aabb" }), 1_000 + DUPLICATE_WINDOW_MS)).toBe(true);
  });

  test("admits a byte-identical payload travelling the other way", () => {
    // A peer echoing a control payload back is two datagrams, not one relayed twice.
    const filter = new DuplicateFilter();
    expect(filter.admit(udpPacket({ payload: "0200000102000000", direction: "outbound" }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload: "0200000102000000", direction: "inbound" }), 1_000)).toBe(true);
    expect(filter.suppressedCount).toBe(0);
  });

  test("keeps two sockets apart when they send the same bytes at the same moment", () => {
    // Without the local port in the key the second connection is swallowed and never reported.
    const filter = new DuplicateFilter();
    const connectRequest = "05000000";
    expect(filter.admit(udpPacket({ payload: connectRequest, sourcePort: 50_000, direction: "outbound" }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload: connectRequest, sourcePort: 50_001, direction: "outbound" }), 1_000)).toBe(true);
    expect(filter.suppressedCount).toBe(0);
  });

  test("still collapses a relayed copy, whose local port the relay leaves alone", () => {
    const filter = new DuplicateFilter();
    const payload = "0413000102030405060708";
    expect(filter.admit(udpPacket({ payload, sourcePort: 7_001, destinationPort: 57_472 }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload, sourcePort: 64_878, destinationPort: 57_472 }), 1_000)).toBe(false);
    expect(filter.suppressedCount).toBe(1);
  });

  test("keeps payloads apart across protocols and by a single differing byte", () => {
    const filter = new DuplicateFilter();
    expect(filter.admit(udpPacket({ payload: "aabb" }), 1_000)).toBe(true);
    expect(filter.admit({ ...udpPacket({ payload: "aabb" }), protocol: "tcp" } as CapturedTransportPacket, 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload: "aabc" }), 1_000)).toBe(true);
    expect(filter.suppressedCount).toBe(0);
  });

  test("always admits payload-free packets, which carry nothing to tell copies apart", () => {
    const filter = new DuplicateFilter();
    expect(filter.admit(udpPacket({ payload: "" }), 1_000)).toBe(true);
    expect(filter.admit(udpPacket({ payload: "" }), 1_000)).toBe(true);
    expect(filter.suppressedCount).toBe(0);
  });

  test("evicts the least recently seen payload once the entry cap is reached", () => {
    const filter = new DuplicateFilter({ entryLimit: 2 });
    filter.admit(udpPacket({ payload: "01" }), 1_000);
    filter.admit(udpPacket({ payload: "02" }), 1_001);
    filter.admit(udpPacket({ payload: "03" }), 1_002);
    // "01" was evicted to stay under the cap, so its next sighting reads as a first sighting.
    expect(filter.admit(udpPacket({ payload: "01" }), 1_003)).toBe(true);
    expect(filter.admit(udpPacket({ payload: "03" }), 1_004)).toBe(false);
  });

  test("takeSuppressedCount drains the tally for periodic reporting", () => {
    const filter = new DuplicateFilter();
    filter.admit(udpPacket({ payload: "aabb" }), 1_000);
    filter.admit(udpPacket({ payload: "aabb" }), 1_000);
    expect(filter.takeSuppressedCount()).toBe(1);
    expect(filter.takeSuppressedCount()).toBe(0);
  });
});

function udpPacket(
  options: { payload: string; sourcePort?: number; destinationPort?: number; direction?: "inbound" | "outbound" },
): CapturedTransportPacket {
  return {
    protocol: "udp",
    timestampTicks: 0n,
    capturedAt: new Date(0),
    interfaceIndex: 0,
    subinterfaceIndex: 0,
    direction: options.direction ?? "inbound",
    loopback: false,
    ipVersion: 4,
    sourceIP: "192.0.2.10",
    destinationIP: "198.51.100.20",
    sourcePort: options.sourcePort ?? 1111,
    destinationPort: options.destinationPort ?? 2222,
    truncated: false,
    payload: Buffer.from(options.payload, "hex"),
  } as CapturedTransportPacket;
}
