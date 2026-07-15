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
  header.writeUInt16LE(1, 4);
  header.writeUInt8(type, 6);
  header.writeUInt32LE(body.length, 8);
  return Buffer.concat([header, body]);
}

function mockFactory(options: { failBeforeReady?: boolean } = {}): {
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

describe("PacketCapture lifecycle", () => {
  test("starts the helper, sends shutdown control, and stops cleanly", async () => {
    const helperPath = prepareRuntime();
    const mock = mockFactory();
    const capture = new PacketCapture(mock.factory);
    let started = 0;
    let stopped = 0;
    capture.on("started", () => started += 1);
    capture.on("stopped", () => stopped += 1);

    await capture.start({ helperPath, filter: "tcp.DstPort == 443" });
    expect(capture.state).toBe("running");
    expect(mock.commands[0]).toEqual([helperPath, "--filter", "tcp.DstPort == 443"]);
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
});
