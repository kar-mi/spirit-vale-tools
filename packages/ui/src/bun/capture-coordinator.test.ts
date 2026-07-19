import { describe, expect, test } from "bun:test";
import { EventEmitter } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { DpsSessionLogFollower } from "@spiritvale/combat";
import type { CapturedFishNetPacket, CaptureConfig } from "@spiritvale/core";
import type { PacketCapture } from "@spiritvale/core/capture";
import { readCurrentLogStream } from "@spiritvale/logging";
import { MarketSessionLogFollower } from "@spiritvale/market";
import { RewardSessionLogFollower } from "@spiritvale/rewards";

import { CaptureCoordinator } from "./capture-coordinator.ts";

describe("central capture coordinator", () => {
  test("adds the diagnostic stream only when development diagnostics are enabled", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
        diagnosticLogging: true,
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
      expect(market.map((record) => record.type)).toContain("market.event");
      expect(other.filter((record) => record.type === "fishnet.packet")).toHaveLength(2);
      expect(other.at(-1)?.type).toBe("capture.lifecycle");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("captures all three domains before their log followers are opened", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-late-open-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
        diagnosticLogging: false,
      });
      await coordinator.start();

      capture.packet(authenticatedPacket(1, "test-connection"));
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
      capture.packet({
        tick: 5,
        packetId: 5,
        packetName: "objectSpawn",
        objectId: 40,
        ownerConnectionId: 9,
        spawnSyncPayload: Buffer.from([1, 2, 3, 4]),
        raw: Buffer.alloc(0),
        payload: Buffer.alloc(0),
      });
      await coordinator.stop();

      const combat = await new DpsSessionLogFollower(directory).poll();
      const rewards = await new RewardSessionLogFollower(directory).poll();
      const market = await new MarketSessionLogFollower(directory).poll();
      expect(new Set([combat.sessionId, rewards.sessionId, market.sessionId]).size).toBe(1);
      expect(combat.events.length).toBeGreaterThan(0);
      expect(rewards.snapshot.unmatched).toBeGreaterThan(0);
      expect(market).toMatchObject({ missing: false, status: "stopped" });
      expect(await readCurrentLogStream("other", directory)).toBeUndefined();

      const combatPointer = await readCurrentLogStream("combat", directory);
      const combatRecords = records(await readFile(combatPointer!.path, "utf8"));
      expect(combatRecords.some((record) => record.type === "combat.spawnIdentityMiss")).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("keeps new-connection actor identities when a stale connection trails a map change", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-reconnect-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
        diagnosticLogging: true,
      });
      await coordinator.start();

      capture.packet(authenticatedPacket(1_000, "conn-a"));
      capture.packet(identityPacket(1_010, 10, "Alpha", "conn-a"));
      capture.packet(authenticatedPacket(50, "conn-b"));
      capture.packet(identityPacket(60, 20, "Bravo", "conn-b"));
      capture.packet({ tick: 1_200, packetId: 3, packetName: "disconnect", raw: Buffer.alloc(0), payload: Buffer.alloc(0), connectionId: "conn-a" });
      capture.packet(identityPacket(1_210, 30, "Ghost", "conn-a"));
      capture.packet(authenticatedPacket(50, "conn-b"));
      capture.packet({
        tick: 70,
        packetId: 5,
        packetName: "objectSpawn",
        objectId: 40,
        ownerConnectionId: 9,
        spawnSyncPayload: Buffer.from([1, 2, 3, 4]),
        raw: Buffer.alloc(0),
        payload: Buffer.alloc(0),
        connectionId: "conn-b",
      });
      await coordinator.stop();

      const combatPointer = await readCurrentLogStream("combat", directory);
      const combatRecords = records(await readFile(combatPointer!.path, "utf8"));
      const combat = combatRecords
        .filter((record) => record.type === "combat.actorIdentity") as Array<{ type: string; data: { operation: string; displayName?: string } }>;
      expect(combat.map((record) => [record.data.operation, record.data.displayName])).toEqual([
        ["reset", undefined],
        ["upsert", "Alpha"],
        ["reset", undefined],
        ["upsert", "Bravo"],
      ]);

      const misses = combatRecords
        .filter((record) => record.type === "combat.spawnIdentityMiss") as unknown as Array<{ data: { objectId: number; spawnSyncPayload: string } }>;
      expect(misses).toHaveLength(1);
      expect(misses[0]!.data.objectId).toBe(40);
      expect(misses[0]!.data.spawnSyncPayload).toBe("01020304");

      const otherPointer = await readCurrentLogStream("other", directory);
      const other = records(await readFile(otherPointer!.path, "utf8"));
      expect(other.some((record) => record.type === "fishnet.packet")).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("routes local character callbacks before filtering overlapping connections", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-character-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
      });
      const receivedConnections: string[] = [];
      const internal = coordinator as unknown as {
        character: { consume: (packet: CapturedFishNetPacket) => boolean };
      };
      internal.character.consume = (packet) => {
        if (packet.rpcName !== "CharacterCallback_T") return false;
        receivedConnections.push(packet.connectionId);
        return true;
      };
      await coordinator.start();

      capture.packet(authenticatedPacket(1, "conn-a"));
      capture.packet({
        tick: 2,
        packetId: 1,
        packetName: "rpcLink",
        rpcName: "CharacterCallback_T",
        rpcResolution: "verified",
        raw: Buffer.alloc(0),
        payload: Buffer.alloc(0),
        connectionId: "conn-b",
      });

      expect(receivedConnections).toEqual(["conn-b"]);
      await coordinator.stop();
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
      expect(await readCurrentLogStream("other", directory)).toBeUndefined();
      await coordinator.stop();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("restarts capture for a new adapter and rolls back a failed selection", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-adapter-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        deviceName: "fictional-adapter-a",
        captureFactory: () => capture as unknown as PacketCapture,
      });
      await coordinator.start();
      await coordinator.reconfigure("fictional-adapter-b");
      expect(capture.configs.map((config) => config.deviceName)).toEqual(["fictional-adapter-a", "fictional-adapter-b"]);

      capture.failDeviceName = "fictional-adapter-c";
      await expect(coordinator.reconfigure("fictional-adapter-c")).rejects.toThrow("Could not switch capture adapter");
      expect(capture.configs.map((config) => config.deviceName)).toEqual([
        "fictional-adapter-a",
        "fictional-adapter-b",
        "fictional-adapter-c",
        "fictional-adapter-b",
      ]);
      expect(coordinator.state().captureStatus).toBe("capturing");
      await coordinator.stop();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("creates a fresh session and restores error handling after a full restart", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-central-restart-"));
    const capture = new FakeCapture();
    try {
      const coordinator = new CaptureCoordinator({
        logDirectory: directory,
        captureFactory: () => capture as unknown as PacketCapture,
      });
      await coordinator.start();
      const firstSession = (await readCurrentLogStream("combat", directory))?.sessionId;
      await coordinator.stop();

      await coordinator.start();
      const secondSession = (await readCurrentLogStream("combat", directory))?.sessionId;
      expect(secondSession).toBeDefined();
      expect(secondSession).not.toBe(firstSession);

      capture.fail(new Error("synthetic capture failure"));
      expect(coordinator.state()).toMatchObject({ captureStatus: "unavailable" });
      await coordinator.stop();
      expect(coordinator.state()).toMatchObject({ captureStatus: "stopped" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});

class FakeCapture extends EventEmitter {
  readonly configs: CaptureConfig[] = [];
  failDeviceName?: string;
  constructor(private readonly startError?: Error) { super(); }

  async start(config: CaptureConfig): Promise<void> {
    this.configs.push(config);
    if (this.startError) throw this.startError;
    if (config.deviceName === this.failDeviceName) throw new Error("synthetic adapter unavailable");
    this.emit("started");
    this.emit("targetStatus", { processName: "SpiritVale.exe", state: "waiting", processIds: [] });
  }

  async stop(): Promise<void> {
    this.emit("stopped");
  }

  packet(packet: TestPacket): void {
    this.emit("fishNetPacket", { connectionId: "test-connection", ...packet } as CapturedFishNetPacket);
  }

  fail(error: Error): void {
    this.emit("error", error);
  }
}

type TestPacket = Omit<CapturedFishNetPacket, "liteNetPacket" | "connectionId"> & { connectionId?: string };

function records(content: string): Array<{ type: string }> {
  return content.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as { type: string });
}

function experiencePacket(tick: number, experience: number, coins: bigint): TestPacket {
  const payload = Buffer.concat([packed(experience), packed(1), packed(0), packed(1), packed(coins)]);
  return { tick, packetId: 4, packetName: "targetRpc", rpcName: "ExpCoinsChanged_T", raw: payload, payload };
}

function authenticatedPacket(tick: number, connectionId: string): TestPacket {
  return { tick, packetId: 0, packetName: "authenticated", raw: Buffer.alloc(0), payload: Buffer.alloc(0), connectionId };
}

function identityPacket(tick: number, objectId: number, displayName: string, connectionId: string): TestPacket {
  return {
    tick,
    packetId: 7,
    packetName: "syncType",
    objectId,
    networkBehaviourType: "PlayerController",
    syncName: "VisualData",
    decodedFields: [{ name: "Appearance.DisplayName", typeName: "System.String", codec: "stringUtf8Packed", value: displayName }],
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    connectionId,
  };
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
