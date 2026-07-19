import { EventEmitter } from "node:events";

import { decodeLiteNetLibDatagram, LiteNetLibProtocolError } from "../litenetlib/decoder.ts";
import { loadBundledFishNetRpcMap } from "../fishnet/builtin-maps.ts";
import { FishNetProtocolError, FishNetSessionDecoder } from "../fishnet/decoder.ts";
import { resolveCaptureDevice } from "./adapter-selection.ts";
import { extractIpPacket, supportsDataLink } from "./link-layer.ts";
import { SystemNpcapRuntime } from "./npcap.ts";
import { parseTransportPacket } from "./packet-parser.ts";
import { WindowsTargetTracker } from "./target-tracker.ts";
import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";
import type { CapturedFishNetPacket, FishNetRpcMap } from "../fishnet/types.ts";
import type { NpcapDevice, NpcapRuntime, NpcapSession, NpcapStatus } from "./npcap.ts";
import type { TargetSnapshotProvider } from "./target-tracker.ts";
import type {
  CaptureConfig,
  CaptureTargetStatus,
  CapturedTcpPacket,
  CapturedTransportPacket,
  CapturedUdpPacket,
  CaptureState,
} from "../types.ts";

const POLL_INTERVAL_MS = 2;
const MAX_POLL_BATCH = 128;
const PENDING_PACKET_LIMIT = 4_096;
const PENDING_PACKET_MAX_AGE_MS = 1_000;
const systemRuntime = new SystemNpcapRuntime();

export interface PacketCaptureDependencies {
  runtime?: NpcapRuntime;
  targetProvider?: TargetSnapshotProvider;
  platform?: NodeJS.Platform;
}

interface PendingPacket {
  packet: CapturedTransportPacket;
  observedAt: number;
}

export async function getNpcapStatus(): Promise<NpcapStatus> {
  return systemRuntime.status();
}

export async function listNpcapDevices(): Promise<NpcapDevice[]> {
  return systemRuntime.listDevices();
}

export class PacketCapture extends EventEmitter {
  private readonly runtime: NpcapRuntime;
  private readonly targetProvider?: TargetSnapshotProvider;
  private readonly platform: NodeJS.Platform;
  private session?: NpcapSession;
  private target?: WindowsTargetTracker;
  private pollTimer?: ReturnType<typeof setInterval>;
  private pending: PendingPacket[] = [];
  private polling = false;
  private decodeLiteNetLib = false;
  private decodeFishNet = false;
  private fishNetRpcMap: FishNetRpcMap | undefined;
  private fishNetSessionDecoder: FishNetSessionDecoder | null = null;
  private _state: CaptureState = "stopped";

  constructor(dependencies: PacketCaptureDependencies = {}) {
    super();
    this.runtime = dependencies.runtime ?? systemRuntime;
    this.targetProvider = dependencies.targetProvider;
    this.platform = dependencies.platform ?? process.platform;
  }

  get state(): CaptureState {
    return this._state;
  }

  override on(event: "started", listener: () => void): this;
  override on(event: "packet", listener: (packet: CapturedTcpPacket) => void): this;
  override on(event: "udpPacket", listener: (packet: CapturedUdpPacket) => void): this;
  override on(event: "transportPacket", listener: (packet: CapturedTransportPacket) => void): this;
  override on(event: "liteNetPacket", listener: (packet: CapturedLiteNetLibPacket) => void): this;
  override on(event: "fishNetPacket", listener: (packet: CapturedFishNetPacket) => void): this;
  override on(event: "targetStatus", listener: (status: CaptureTargetStatus) => void): this;
  override on(event: "warning", listener: (message: string) => void): this;
  override on(event: "error", listener: (error: Error) => void): this;
  override on(event: "stopped", listener: () => void): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  async start(config: CaptureConfig = {}): Promise<void> {
    if (this._state !== "stopped") throw new Error(`cannot start capture while it is ${this._state}`);
    if (this.platform !== "win32") throw new Error("live packet capture is supported only on Windows");
    const protocols = config.protocols ?? ["tcp", "udp"];
    if (protocols.length === 0 || protocols.some((protocol) => protocol !== "tcp" && protocol !== "udp")) {
      throw new Error("protocols must contain tcp, udp, or both");
    }
    const targetProcessName = config.targetProcessName?.trim();
    if (config.targetProcessName !== undefined && !targetProcessName) throw new Error("targetProcessName must not be empty");
    this._state = "starting";
    try {
      const decodeFishNet = config.decodeFishNet ?? false;
      this.decodeFishNet = decodeFishNet;
      this.decodeLiteNetLib = (config.decodeLiteNetLib ?? false) || decodeFishNet;
      this.fishNetRpcMap = decodeFishNet
        ? config.fishNetRpcMap ?? loadBundledFishNetRpcMap(config.fishNetBuildFingerprint)
        : undefined;
      this.fishNetSessionDecoder = decodeFishNet ? new FishNetSessionDecoder(this.fishNetRpcMap) : null;
      const devices = await this.runtime.listDevices();
      const resolved = await resolveCaptureDevice(devices, config.deviceName);
      if (!resolved.device) throw new Error("Npcap did not report a usable network adapter");
      const filter = config.filter ?? Array.from(new Set(protocols)).join(" or ");
      this.session = await this.runtime.open(resolved.device, filter);
      if (!supportsDataLink(this.session.dataLink)) {
        throw new Error(`Npcap adapter uses unsupported data-link type ${this.session.dataLink}`);
      }
      if (resolved.detail) this.emit("warning", resolved.detail);
      if (targetProcessName) {
        this.target = new WindowsTargetTracker(
          targetProcessName,
          protocols,
          (status) => this.emit("targetStatus", status),
          this.targetProvider,
        );
        await this.target.start();
      }
      this._state = "running";
      this.pollTimer = setInterval(() => void this.poll(), POLL_INTERVAL_MS);
      this.emit("started");
    } catch (error) {
      this.closeResources();
      this.resetDecoder();
      this._state = "stopped";
      throw toError(error);
    }
  }

  async stop(): Promise<void> {
    if (this._state === "stopped") return;
    this._state = "stopping";
    this.closeResources();
    this.resetDecoder();
    this._state = "stopped";
    this.emit("stopped");
  }

  private poll(): void {
    if (this.polling || this._state !== "running" || !this.session) return;
    this.polling = true;
    try {
      this.flushPending();
      for (let index = 0; index < MAX_POLL_BATCH; index += 1) {
        const captured = this.session.nextPacket();
        if (!captured) break;
        const ipPacket = extractIpPacket(captured.data, this.session.dataLink);
        if (!ipPacket) continue;
        const provisionalDirection = inferDirection(ipPacket, this.session.device);
        const packet = parseTransportPacket(ipPacket, {
          capturedAt: captured.capturedAt,
          timestampTicks: captured.timestampTicks,
          interfaceIndex: 0,
          direction: provisionalDirection,
          loopback: this.session.device.loopback,
        });
        if (!packet) continue;
        packet.truncated ||= captured.originalLength > captured.data.length;
        if (!this.target) this.emitTransportPacket(packet);
        else {
          const direction = this.target.classify(packet);
          if (direction) {
            packet.direction = direction;
            this.emitTransportPacket(packet);
          } else {
            this.pending.push({ packet, observedAt: Date.now() });
            if (this.pending.length > PENDING_PACKET_LIMIT) this.pending.splice(0, this.pending.length - PENDING_PACKET_LIMIT);
          }
        }
      }
    } catch (error) {
      const failure = toError(error);
      if (this.listenerCount("error") > 0) this.emit("error", failure);
      else console.error("[spiritvale-capture]", failure);
      void this.stop();
    } finally {
      this.polling = false;
    }
  }

  private flushPending(): void {
    if (!this.target || this.pending.length === 0) return;
    const cutoff = Date.now() - PENDING_PACKET_MAX_AGE_MS;
    const remaining: PendingPacket[] = [];
    for (const candidate of this.pending) {
      if (candidate.observedAt < cutoff) continue;
      const direction = this.target.classify(candidate.packet);
      if (!direction) remaining.push(candidate);
      else {
        candidate.packet.direction = direction;
        this.emitTransportPacket(candidate.packet);
      }
    }
    this.pending = remaining;
  }

  private emitTransportPacket(packet: CapturedTransportPacket): void {
    if (packet.protocol === "tcp") this.emit("packet", packet);
    else this.emit("udpPacket", packet);
    this.emit("transportPacket", packet);
    if (packet.protocol === "udp" && this.decodeLiteNetLib) this.emitLiteNetLibPackets(packet);
  }

  private emitLiteNetLibPackets(packet: CapturedUdpPacket): void {
    try {
      for (const decoded of decodeLiteNetLibDatagram(packet.payload)) {
        const captured = { ...decoded, udpPacket: packet } satisfies CapturedLiteNetLibPacket;
        this.emit("liteNetPacket", captured);
        if (this.decodeFishNet) this.emitFishNetPacket(captured);
      }
    } catch (error) {
      const detail = error instanceof LiteNetLibProtocolError ? error.message : toError(error).message;
      this.emit("warning", `skipped LiteNetLib decode for ${packet.sourceIP}:${packet.sourcePort} -> ${packet.destinationIP}:${packet.destinationPort}: ${detail}`);
    }
  }

  private emitFishNetPacket(packet: CapturedLiteNetLibPacket): void {
    const { property, payload } = packet.packet;
    const udp = packet.udpPacket;
    const endpoints = [`${udp.sourceIP}:${udp.sourcePort}`, `${udp.destinationIP}:${udp.destinationPort}`].sort();
    const connectionId = `${endpoints[0]}<->${endpoints[1]}#${packet.packet.connectionNumber}`;
    if (property === "connectRequest" || property === "connectAccept" || property === "disconnect") {
      this.fishNetSessionDecoder?.reset(connectionId);
      return;
    }
    if ((property !== "unreliable" && property !== "channeled") || payload.length < 6) return;
    try {
      const decodedPackets = this.fishNetSessionDecoder?.decode(payload, {
        reliable: property === "channeled",
        rpcMap: this.fishNetRpcMap,
        connectionId,
        direction: udp.direction,
        channel: property === "channeled" ? packet.packet.channel : 1,
        sequence: property === "channeled" ? packet.packet.sequence : undefined,
      });
      for (const decoded of decodedPackets ?? []) {
        this.emit("fishNetPacket", { ...decoded, liteNetPacket: packet, connectionId } satisfies CapturedFishNetPacket);
      }
    } catch (error) {
      const detail = error instanceof FishNetProtocolError ? error.message : toError(error).message;
      this.emit("warning", `skipped FishNet decode at LiteNetLib path ${packet.mergePath.join(".") || "root"}: ${detail}`);
    }
  }

  private closeResources(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = undefined;
    this.target?.stop();
    this.target = undefined;
    this.session?.close();
    this.session = undefined;
    this.pending = [];
  }

  private resetDecoder(): void {
    this.decodeLiteNetLib = false;
    this.decodeFishNet = false;
    this.fishNetRpcMap = undefined;
    this.fishNetSessionDecoder?.reset();
    this.fishNetSessionDecoder = null;
  }
}

function inferDirection(ipPacket: Buffer, device: NpcapDevice): "inbound" | "outbound" {
  if ((ipPacket[0]! >> 4) === 4 && ipPacket.length >= 20) {
    const source = `${ipPacket[12]}.${ipPacket[13]}.${ipPacket[14]}.${ipPacket[15]}`;
    if (device.addresses.includes(source)) return "outbound";
  } else if ((ipPacket[0]! >> 4) === 6 && ipPacket.length >= 40) {
    const source = formatIpv6(ipPacket.subarray(8, 24));
    if (device.addresses.includes(source)) return "outbound";
  }
  return "inbound";
}

function formatIpv6(data: Buffer): string {
  const words = Array.from({ length: 8 }, (_, index) => data.readUInt16BE(index * 2));
  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < words.length;) {
    if (words[start] !== 0) { start += 1; continue; }
    let end = start;
    while (end < words.length && words[end] === 0) end += 1;
    if (end - start > bestLength && end - start > 1) { bestStart = start; bestLength = end - start; }
    start = end;
  }
  if (bestStart < 0) return words.map((word) => word.toString(16)).join(":");
  const before = words.slice(0, bestStart).map((word) => word.toString(16)).join(":");
  const after = words.slice(bestStart + bestLength).map((word) => word.toString(16)).join(":");
  return `${before}::${after}`;
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}
