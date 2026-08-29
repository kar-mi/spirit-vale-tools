import { describe, expect, test } from "bun:test";

import { DROP_FLOW_LIMIT, DROP_VERDICT_MIN_SAMPLES, DropDiagnostics } from "./drop-diagnostics.ts";
import type { CapturedTransportPacket } from "../types.ts";

describe("DropDiagnostics", () => {
  test("calls a stream with consecutive sequence numbers game traffic", () => {
    const diagnostics = new DropDiagnostics();
    for (let sequence = 0; sequence < 40; sequence += 1) diagnostics.record(channeled(sequence));
    const [flow] = diagnostics.topFlows();
    expect(flow?.verdict).toBe("game traffic");
    expect(flow?.packets).toBe(40);
    expect(diagnostics.hasGameTraffic).toBe(true);
  });

  test("calls a flow that merely parses as LiteNetLib unrelated", () => {
    // The trap this exists to avoid: a header-shaped first byte with no ordering behind it.
    const diagnostics = new DropDiagnostics();
    for (let index = 0; index < 40; index += 1) diagnostics.record(channeled(index % 3 === 0 ? 32 : 161));
    expect(diagnostics.topFlows()[0]?.verdict).toBe("unrelated");
    expect(diagnostics.hasGameTraffic).toBe(false);
  });

  test("withholds a verdict until enough sequenced packets have been seen", () => {
    const diagnostics = new DropDiagnostics();
    for (let sequence = 0; sequence < DROP_VERDICT_MIN_SAMPLES - 1; sequence += 1) {
      diagnostics.record(channeled(sequence));
    }
    expect(diagnostics.topFlows()[0]?.verdict).toBe("unknown");
    expect(diagnostics.hasGameTraffic).toBe(false);
  });

  test("treats a sequence wrap as consecutive", () => {
    const diagnostics = new DropDiagnostics();
    for (let index = 0; index < 40; index += 1) diagnostics.record(channeled((32_750 + index) % 32_768));
    expect(diagnostics.topFlows()[0]?.verdict).toBe("game traffic");
  });

  test("separates flows and ranks them by packet count", () => {
    const diagnostics = new DropDiagnostics();
    for (let sequence = 0; sequence < 5; sequence += 1) diagnostics.record(channeled(sequence, 7001));
    for (let sequence = 0; sequence < 30; sequence += 1) diagnostics.record(channeled(sequence, 7002));
    const flows = diagnostics.topFlows();
    expect(flows).toHaveLength(2);
    expect(flows[0]?.packets).toBe(30);
    expect(flows[0]?.flow).toContain(":7002");
    expect(flows[1]?.packets).toBe(5);
  });

  test("stops tracking new flows once the ceiling is reached", () => {
    const diagnostics = new DropDiagnostics();
    for (let port = 0; port < DROP_FLOW_LIMIT + 10; port += 1) diagnostics.record(channeled(0, 1_000 + port));
    expect(diagnostics.topFlows(DROP_FLOW_LIMIT + 10)).toHaveLength(DROP_FLOW_LIMIT);
  });

  test("retains no payload, only counts and ordering statistics", () => {
    const diagnostics = new DropDiagnostics();
    diagnostics.record(channeled(1));
    expect(JSON.stringify(diagnostics.topFlows())).not.toContain("payload");
    diagnostics.reset();
    expect(diagnostics.topFlows()).toEqual([]);
  });
});

/** A LiteNetLib channeled datagram: property 1, u16 sequence, channel byte. */
function channeled(sequence: number, sourcePort = 7001): CapturedTransportPacket {
  const payload = Buffer.alloc(5);
  payload.writeUInt8(1, 0);
  payload.writeUInt16LE(sequence, 1);
  payload.writeUInt8(2, 3);
  return {
    protocol: "udp",
    timestampTicks: 0n,
    capturedAt: new Date(0),
    interfaceIndex: 0,
    subinterfaceIndex: 0,
    direction: "inbound",
    loopback: false,
    ipVersion: 4,
    sourceIP: "198.51.100.20",
    destinationIP: "192.0.2.10",
    sourcePort,
    destinationPort: 57472,
    truncated: false,
    payload,
  } as CapturedTransportPacket;
}
