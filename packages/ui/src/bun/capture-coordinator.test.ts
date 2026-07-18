import { describe, expect, test } from "bun:test";
import { EventEmitter } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import type { CapturedFishNetPacket, CaptureConfig, PacketCapture } from "@spiritvale/core";
import { readCurrentLogStream } from "@spiritvale/logging";

import { CaptureCoordinator } from "./capture-coordinator.ts";

describe("central capture coordinator", () => {
  test("publishes one four-stream session and routes domain and unclassified records", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
      });
      await coordinator.start();

      capture.packet({ tick: 1, packetId: 0, packetName: "authenticated", raw: Buffer.alloc(0), payload: Buffer.alloc(0) });
      capture.packet(experiencePacket(2, 0, 0n));
      capture.packet(experiencePacket(3, 10, 2n));
      capture.packet({
        tick: 4,
        packetId: 1,
        packetName: "rpcLink",
        rpcName: "VendingCollectResult_T",
        rpcResolution: "verified",
        networkBehaviourType: "PlayerController",
        raw: Buffer.from([1]),
        payload: Buffer.from([1]),
      });
      capture.packet({ tick: 5, packetId: 2, packetName: "pingPong", raw: Buffer.alloc(0), payload: Buffer.alloc(0) });
      await coordinator.stop();

      const pointers = await Promise.all(["combat", "rewards", "market", "other"].map((stream) => {
        return readCurrentLogStream(stream as "combat" | "rewards" | "market" | "other", directory);
      }));
      expect(new Set(pointers.map((pointer) => pointer?.sessionId)).size).toBe(1);
      expect(pointers.every((pointer) => pointer !== undefined)).toBe(true);

      const streams = await Promise.all(pointers.map(async (pointer) => {
        return records(await readFile(pointer!.path, "utf8"));
      }));
      const combat = streams[0]!;
      const rewards = streams[1]!;
      const market = streams[2]!;
      const other = streams[3]!;
      expect(combat.map((record) => record.type)).toContain("combat.actorIdentity");
      expect(rewards.map((record) => record.type)).toContain("rewards.unmatched");
      expect(market.map((record) => record.type)).toContain("market.snapshot");
      expect(other.filter((record) => record.type === "fishnet.packet")).toHaveLength(2);
      expect(other.at(-1)?.type).toBe("capture.lifecycle");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("reports capture startup failure without throwing or closing the session", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-failure-"));
    const capture = new FakeCapture(new Error("synthetic capture unavailable"));
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
      });
      await coordinator.start();
      expect(coordinator.state()).toEqual({ captureStatus: "unavailable", statusDetail: "Unable to capture data" });
      expect(await readCurrentLogStream("combat", directory)).toBeDefined();
      expect(await readCurrentLogStream("rewards", directory)).toBeDefined();
      expect(await readCurrentLogStream("market", directory)).toBeDefined();
      expect(await readCurrentLogStream("other", directory)).toBeDefined();
      await coordinator.stop();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});

class FakeCapture extends EventEmitter {
  constructor(private readonly startError?: Error) { super(); }

  async start(_config: CaptureConfig): Promise<void> {
    if (this.startError) throw this.startError;
    this.emit("started");
    this.emit("targetStatus", { processName: "SpiritVale.exe", state: "waiting", processIds: [] });
  }

  async stop(): Promise<void> {
    this.emit("stopped");
  }

  packet(packet: Omit<CapturedFishNetPacket, "liteNetPacket">): void {
    this.emit("fishNetPacket", packet as CapturedFishNetPacket);
  }
}

function records(content: string): Array<{ type: string }> {
  return content.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as { type: string });
}

function experiencePacket(tick: number, experience: number, coins: bigint): Omit<CapturedFishNetPacket, "liteNetPacket"> {
  const payload = Buffer.concat([packed(experience), packed(1), packed(0), packed(1), packed(coins)]);
  return { tick, packetId: 4, packetName: "targetRpc", rpcName: "ExpCoinsChanged_T", raw: payload, payload };
}

function packed(value: number | bigint): Buffer {
  const signed = BigInt(value);
  let encoded = (signed << 1n) ^ (signed >> 63n);
  const bytes: number[] = [];
  while (encoded >= 0x80n) {
    bytes.push(Number(encoded & 0x7fn) | 0x80);
    encoded >>= 7n;
  }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}
