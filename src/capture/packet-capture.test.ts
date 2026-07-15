import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { PacketCapture, type NativeProcess, type NativeProcessFactory } from "./packet-capture.ts";

const testRoot = path.join(import.meta.dir, ".capture-test-runtime");

afterEach(() => rmSync(testRoot, { recursive: true, force: true }));

function prepareRuntime(): string {
  mkdirSync(testRoot, { recursive: true });
  for (const name of ["helper.exe", "WinDivert.dll", "WinDivert64.sys"]) {
    writeFileSync(path.join(testRoot, name), "fixture");
  }
  return path.join(testRoot, "helper.exe");
}

function frame(type: number, body = Buffer.alloc(0)): Buffer {
  const header = Buffer.alloc(12);
  header.write("SVCP", 0, "ascii");
  header.writeUInt16LE(2, 4);
  header.writeUInt8(type, 6);
  header.writeUInt32LE(body.length, 8);
  return Buffer.concat([header, body]);
}

function mockFactory(options: { failBeforeReady?: boolean; records?: Buffer[] } = {}): {
  factory: NativeProcessFactory;
  commands: string[][];
  writes: Uint8Array[];
} {
  const commands: string[][] = [];
  const writes: Uint8Array[] = [];
  const factory: NativeProcessFactory = (command) => {
    commands.push(command);
    let stdoutController!: ReadableStreamDefaultController<Uint8Array>;
    let resolveExit!: (code: number) => void;
    const exited = new Promise<number>((resolve) => {
      resolveExit = resolve;
    });
    const stdout = new ReadableStream<Uint8Array>({
      start(controller) {
        stdoutController = controller;
        if (options.failBeforeReady) {
          controller.enqueue(frame(4, Buffer.from("permission denied")));
          controller.close();
          resolveExit(1);
        } else {
          controller.enqueue(frame(1));
          for (const record of options.records ?? []) controller.enqueue(record);
        }
      },
    });
    const stderr = new ReadableStream<Uint8Array>({ start: (controller) => controller.close() });
    const process: NativeProcess = {
      stdin: {
        write(data) {
          writes.push(Uint8Array.from(data));
          return data.byteLength;
        },
        flush: () => 0,
        end() {
          stdoutController.enqueue(frame(5));
          stdoutController.close();
          resolveExit(0);
          return 0;
        },
      },
      stdout,
      stderr,
      exited,
      kill() {
        stdoutController.close();
        resolveExit(1);
      },
    };
    return process;
  };
  return { factory, commands, writes };
}

function udpFrame(payload: Buffer): Buffer {
  const body = Buffer.alloc(60 + payload.length);
  body.writeBigInt64LE(42n, 0);
  body.writeUInt32LE(3, 8);
  body.writeUInt32LE(4, 12);
  body.writeUInt8(0, 16);
  body.writeUInt8(4, 17);
  body.set([198, 51, 100, 20], 32);
  body.set([192, 0, 2, 10], 48);
  body.writeUInt16LE(7004, 52);
  body.writeUInt16LE(50000, 54);
  body.writeUInt32LE(payload.length, 56);
  body.set(payload, 60);
  return frame(6, body);
}

describe("PacketCapture lifecycle", () => {
  test("starts the helper, sends shutdown control, and stops cleanly", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory();
    const capture = new PacketCapture(mock.factory);
    let started = 0;
    let stopped = 0;
    capture.on("started", () => started += 1);
    capture.on("stopped", () => stopped += 1);

    await capture.start({ helperPath, filter: "tcp.DstPort == 443", targetProcessName: "SpiritVale.exe" });
    expect(capture.state).toBe("running");
    expect(mock.commands[0]).toEqual([
      helperPath,
      "--filter",
      "tcp.DstPort == 443",
      "--process-name",
      "SpiritVale.exe",
    ]);
    expect(started).toBe(1);

    await capture.stop();
    expect(capture.state).toBe("stopped");
    expect(mock.writes).toEqual([Uint8Array.of(1)]);
    expect(stopped).toBe(1);
  });

  test("rejects startup when the helper reports an error", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory({ failBeforeReady: true });
    const capture = new PacketCapture(mock.factory);
    await expect(capture.start({ helperPath })).rejects.toThrow("permission denied");
  });

  test("rejects duplicate starts", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory();
    const capture = new PacketCapture(mock.factory);
    await capture.start({ helperPath });
    await expect(capture.start({ helperPath })).rejects.toThrow("cannot start capture while it is running");
    await capture.stop();
  });

  test("derives a protocol filter and supports untargeted capture", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory();
    const capture = new PacketCapture(mock.factory);
    await capture.start({ helperPath, protocols: ["udp"] });
    expect(mock.commands[0]).toEqual([helperPath, "--filter", "udp"]);
    await capture.stop();
  });

  test("emits raw UDP before flattened LiteNetLib leaves", async () => {
    const helperPath = prepareRuntime();
    const merged = Buffer.from("0c03000320000b000420000100000000000000", "hex");
    const mock = mockFactory({ records: [udpFrame(merged)] });
    const capture = new PacketCapture(mock.factory);
    const order: string[] = [];
    capture.on("transportPacket", () => order.push("raw"));
    capture.on("liteNetPacket", ({ packet, mergePath }) => order.push(`${packet.property}:${mergePath.join(".")}`));

    await capture.start({ helperPath, protocols: ["udp"], decodeLiteNetLib: true });
    await Bun.sleep(0);
    expect(order).toEqual(["raw", "ping:0", "pong:1"]);
    await capture.stop();
  });

  test("warns on malformed LiteNetLib without suppressing raw UDP", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory({ records: [udpFrame(Buffer.from([0x12]))] });
    const capture = new PacketCapture(mock.factory);
    let rawPackets = 0;
    const warnings: string[] = [];
    capture.on("udpPacket", () => rawPackets += 1);
    capture.on("warning", (message) => warnings.push(message));

    await capture.start({ helperPath, decodeLiteNetLib: true });
    await Bun.sleep(0);
    expect(rawPackets).toBe(1);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("198.51.100.20:7004 -> 192.0.2.10:50000");
    expect(warnings[0]).toContain("unknown LiteNetLib 1.x property 18 at byte 0");
    expect(capture.state).toBe("running");
    await capture.stop();
  });

  test("leaves UDP untouched when LiteNetLib decoding is disabled", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory({ records: [udpFrame(Buffer.from([0x12]))] });
    const capture = new PacketCapture(mock.factory);
    let rawPackets = 0;
    let decodedPackets = 0;
    const warnings: string[] = [];
    capture.on("udpPacket", () => rawPackets += 1);
    capture.on("liteNetPacket", () => decodedPackets += 1);
    capture.on("warning", (message) => warnings.push(message));

    await capture.start({ helperPath });
    await Bun.sleep(0);
    expect(rawPackets).toBe(1);
    expect(decodedPackets).toBe(0);
    expect(warnings).toEqual([]);
    await capture.stop();
  });
});
