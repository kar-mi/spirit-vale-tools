import { describe, expect, test } from "bun:test";

import { DATA_LINK } from "./link-layer.ts";
import { PacketCapture } from "./packet-capture.ts";
import type { NpcapDevice, NpcapPacket, NpcapRuntime, NpcapSession, NpcapStatus } from "./npcap.ts";
import type { TargetSnapshotProvider } from "./target-tracker.ts";

const DEVICE: NpcapDevice = {
  name: "\\Device\\NPF_{00000000-0000-4000-8000-000000000001}",
  description: "Fictional Ethernet Adapter",
  addresses: ["192.0.2.10"],
  loopback: false,
};

class FakeRuntime implements NpcapRuntime {
  readonly opened: Array<{ device: string; filter: string }> = [];
  readonly packets: NpcapPacket[] = [];
  closed = 0;

  async status(): Promise<NpcapStatus> {
    return { availability: "ready", detail: "ready", version: "Npcap test version" };
  }

  async listDevices(): Promise<NpcapDevice[]> { return [DEVICE]; }

  async open(device: NpcapDevice, filter: string): Promise<NpcapSession> {
    this.opened.push({ device: device.name, filter });
    return {
      device,
      dataLink: DATA_LINK.RAW,
      nextPacket: () => this.packets.shift(),
      close: () => { this.closed += 1; },
    };
  }
}

const targetProvider: TargetSnapshotProvider = {
  snapshot: async () => ({
    processIds: [4242],
    endpoints: [{ protocol: "udp", address: "192.0.2.10", port: 50_000, processId: 4242 }],
  }),
};

describe("PacketCapture Npcap lifecycle", () => {
  test("opens the selected adapter with a BPF filter and stops cleanly", async () => {
    const runtime = new FakeRuntime();
    const capture = new PacketCapture({ runtime, platform: "win32" });
    let started = 0;
    let stopped = 0;
    capture.on("started", () => started += 1);
    capture.on("stopped", () => stopped += 1);

    await capture.start({ protocols: ["udp"], deviceName: DEVICE.name });
    expect(runtime.opened).toEqual([{ device: DEVICE.name, filter: "udp" }]);
    expect(capture.state).toBe("running");
    expect(started).toBe(1);

    await capture.stop();
    expect(runtime.closed).toBe(1);
    expect(capture.state).toBe("stopped");
    expect(stopped).toBe(1);
  });

  test("rejects duplicate starts", async () => {
    const capture = new PacketCapture({ runtime: new FakeRuntime(), platform: "win32" });
    await capture.start();
    await expect(capture.start()).rejects.toThrow("cannot start capture while it is running");
    await capture.stop();
  });

  test("rejects an unsupported bundled FishNet build before opening capture", async () => {
    const runtime = new FakeRuntime();
    const capture = new PacketCapture({ runtime, platform: "win32" });
    await expect(capture.start({ decodeFishNet: true, fishNetBuildFingerprint: "fictional-build" }))
      .rejects.toThrow("unsupported bundled FishNet build fingerprint");
    expect(runtime.opened).toEqual([]);
  });

  test("attributes UDP packets to the target process and emits normalized payloads", async () => {
    const runtime = new FakeRuntime();
    runtime.packets.push(packet(udpDatagram(Buffer.from([1, 2, 3]))));
    const capture = new PacketCapture({ runtime, targetProvider, platform: "win32" });
    const packets: Buffer[] = [];
    const statuses: number[][] = [];
    capture.on("udpPacket", (value) => packets.push(value.payload));
    capture.on("targetStatus", (status) => statuses.push(status.processIds));

    await capture.start({ protocols: ["udp"], targetProcessName: "FictionalGame.exe" });
    await Bun.sleep(10);
    expect(statuses).toEqual([[4242]]);
    expect(packets).toEqual([Buffer.from([1, 2, 3])]);
    await capture.stop();
  });

  test("emits raw UDP before flattened LiteNetLib leaves", async () => {
    const runtime = new FakeRuntime();
    const merged = Buffer.from("0c03000320000b000420000100000000000000", "hex");
    runtime.packets.push(packet(udpDatagram(merged)));
    const capture = new PacketCapture({ runtime, platform: "win32" });
    const order: string[] = [];
    capture.on("transportPacket", () => order.push("raw"));
    capture.on("liteNetPacket", ({ packet: value, mergePath }) => order.push(`${value.property}:${mergePath.join(".")}`));

    await capture.start({ protocols: ["udp"], decodeLiteNetLib: true });
    await Bun.sleep(10);
    expect(order).toEqual(["raw", "ping:0", "pong:1"]);
    await capture.stop();
  });

  test("warns on malformed LiteNetLib without suppressing raw UDP", async () => {
    const runtime = new FakeRuntime();
    runtime.packets.push(packet(udpDatagram(Buffer.from([0x12]))));
    const capture = new PacketCapture({ runtime, platform: "win32" });
    const warnings: string[] = [];
    let rawPackets = 0;
    capture.on("udpPacket", () => rawPackets += 1);
    capture.on("warning", (message) => warnings.push(message));

    await capture.start({ protocols: ["udp"], decodeLiteNetLib: true });
    await Bun.sleep(10);
    expect(rawPackets).toBe(1);
    expect(warnings[0]).toContain("192.0.2.10:50000 -> 198.51.100.20:7004");
    await capture.stop();
  });

  test("isolates a throwing packet listener and keeps capture running", async () => {
    const runtime = new FakeRuntime();
    runtime.packets.push(packet(udpDatagram(Buffer.from([1, 2, 3]))));
    const capture = new PacketCapture({ runtime, platform: "win32" });
    const warnings: string[] = [];
    let observed = 0;
    capture.on("udpPacket", () => { throw new Error("synthetic listener failure"); });
    capture.on("udpPacket", () => observed += 1);
    capture.on("warning", (message) => warnings.push(message));

    await capture.start({ protocols: ["udp"] });
    await Bun.sleep(10);

    expect(observed).toBe(1);
    expect(warnings).toEqual(["udpPacket listener failed: synthetic listener failure"]);
    expect(capture.state).toBe("running");
    await capture.stop();
  });
});

function packet(data: Buffer): NpcapPacket {
  return { capturedAt: new Date(0), timestampTicks: 42n, data, originalLength: data.length };
}

function udpDatagram(payload: Buffer): Buffer {
  const total = 20 + 8 + payload.length;
  const data = Buffer.alloc(total);
  data[0] = 0x45;
  data.writeUInt16BE(total, 2);
  data[9] = 17;
  data.set([192, 0, 2, 10], 12);
  data.set([198, 51, 100, 20], 16);
  data.writeUInt16BE(50_000, 20);
  data.writeUInt16BE(7_004, 22);
  data.writeUInt16BE(8 + payload.length, 24);
  payload.copy(data, 28);
  return data;
}
