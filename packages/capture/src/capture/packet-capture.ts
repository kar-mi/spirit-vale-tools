import { EventEmitter } from "node:events";

import { decodeLiteNetLibDatagram, LiteNetLibProtocolError } from "../litenetlib/decoder.ts";
import { loadBundledFishNetRpcMap } from "../fishnet/builtin-maps.ts";
import { FishNetProtocolError, FishNetSessionDecoder } from "../fishnet/decoder.ts";
import { resolveCaptureDevice } from "./adapter-selection.ts";
import { DuplicateFilter } from "./duplicate-filter.ts";
import { DropDiagnostics } from "./drop-diagnostics.ts";
import { formatIpv6 } from "./ip-address.ts";
import { extractIpPacket, supportsDataLink } from "./link-layer.ts";
import { SystemNpcapRuntime } from "./npcap.ts";
import { parseTransportPacket } from "./packet-parser.ts";
import { TARGET_REFRESH_INTERVAL_MS, WindowsTargetTracker } from "./target-tracker.ts";
import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";
import type { CapturedFishNetPacket, FishNetRpcMap } from "../fishnet/types.ts";
import type { DroppedFlow } from "./drop-diagnostics.ts";
import type { NpcapDevice, NpcapRuntime, NpcapSession, NpcapStatus } from "./npcap.ts";
import type { TargetSnapshotProvider } from "./target-tracker.ts";
import type {
  CaptureConfig,
  CaptureConnectionEvent,
  CaptureTargetStatus,
  CapturedTcpPacket,
  CapturedTransportPacket,
  CapturedUdpPacket,
  CaptureState,
} from "../types.ts";

const POLL_INTERVAL_MS = 2;
const MAX_POLL_BATCH = 128;
const PENDING_PACKET_LIMIT = 16_384;
/**
 * How many refreshes a packet waits to be attributed to the target before it is given up on.
 *
 * A packet is held whenever neither endpoint is one the endpoint table has reported for the
 * process, which is the state every socket is in for its first moments. Holding for a single
 * refresh gave a new socket one chance to appear, and it often did not land inside that one window:
 * the opening of a connection was discarded on that race, the connect and the authentication with
 * it. Several refreshes make it a margin rather than a coin toss.
 */
const PENDING_PACKET_MAX_AGE_MS = TARGET_REFRESH_INTERVAL_MS * 5;
const PENDING_DROP_REPORT_MS = 10_000;
const DUPLICATE_REPORT_MS = 10_000;
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
  private currentConnectionId?: string;
  private droppedPending = 0;
  private droppedReportedAtMs = 0;
  private duplicateFilter: DuplicateFilter | null = null;
  private duplicateReportedAtMs = 0;
  private relayObserved = false;
  private readonly dropDiagnostics = new DropDiagnostics();
  private deviceLabel = "";
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

  /** The connection last seen opening and not since closing, undefined until one is observed. */
  get connectionId(): string | undefined {
    return this.currentConnectionId;
  }

  override on(event: "started", listener: () => void): this;
  override on(event: "packet", listener: (packet: CapturedTcpPacket) => void): this;
  override on(event: "udpPacket", listener: (packet: CapturedUdpPacket) => void): this;
  override on(event: "transportPacket", listener: (packet: CapturedTransportPacket) => void): this;
  override on(event: "liteNetPacket", listener: (packet: CapturedLiteNetLibPacket) => void): this;
  override on(event: "fishNetPacket", listener: (packet: CapturedFishNetPacket) => void): this;
  override on(event: "connection", listener: (event: CaptureConnectionEvent) => void): this;
  override on(event: "targetStatus", listener: (status: CaptureTargetStatus) => void): this;
  override on(event: "droppedFlows", listener: (flows: DroppedFlow[]) => void): this;
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
      this.duplicateFilter = (config.suppressDuplicates ?? true) ? new DuplicateFilter() : null;
      const devices = await this.runtime.listDevices();
      const resolved = await resolveCaptureDevice(devices, config.deviceName);
      if (!resolved.device) throw new Error("Npcap did not report a usable network adapter");
      this.deviceLabel = resolved.device.description || resolved.device.name;
      const filter = config.filter ?? Array.from(new Set(protocols)).join(" or ");
      this.session = await this.runtime.open(resolved.device, filter);
      if (!supportsDataLink(this.session.dataLink)) {
        throw new Error(`Npcap adapter uses unsupported data-link type ${this.session.dataLink}`);
      }
      if (resolved.detail) this.emitSafely("warning", resolved.detail);
      if (targetProcessName) {
        this.target = new WindowsTargetTracker(
          targetProcessName,
          protocols,
          (status) => this.emitSafely("targetStatus", status),
          this.targetProvider,
          (message) => this.emitSafely("warning", message),
        );
        await this.target.start();
      }
      this._state = "running";
      this.pollTimer = setInterval(() => void this.poll(), POLL_INTERVAL_MS);
      this.emitSafely("started");
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
    this.emitSafely("stopped");
  }

  private poll(): void {
    if (this.polling || this._state !== "running" || !this.session) return;
    this.polling = true;
    try {
      this.flushPending();
      this.reportSuppressedDuplicates();
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
            // The oldest held packets are a connection's opening, which is the part worth keeping,
            // so a full buffer turns away what is arriving rather than discarding what it holds.
            if (this.pending.length >= PENDING_PACKET_LIMIT) this.recordDropped(packet);
            else this.pending.push({ packet, observedAt: Date.now() });
          }
        }
      }
    } catch (error) {
      const failure = toError(error);
      if (this.listenerCount("error") > 0) this.emitSafely("error", failure);
      else console.error("[spiritvale-capture]", failure);
      void this.stop();
    } finally {
      this.polling = false;
    }
  }

  /** Counts a packet given up on and folds it into the drop diagnostics. */
  private recordDropped(packet: CapturedTransportPacket): void {
    this.droppedPending += 1;
    this.dropDiagnostics.record(packet);
  }

  private flushPending(): void {
    if (!this.target) return;
    if (this.pending.length === 0) {
      this.reportDroppedPending();
      return;
    }
    const cutoff = Date.now() - PENDING_PACKET_MAX_AGE_MS;
    const remaining: PendingPacket[] = [];
    for (const candidate of this.pending) {
      if (candidate.observedAt < cutoff) {
        this.recordDropped(candidate.packet);
        continue;
      }
      const direction = this.target.classify(candidate.packet);
      if (!direction) remaining.push(candidate);
      else {
        candidate.packet.direction = direction;
        this.emitTransportPacket(candidate.packet);
      }
    }
    this.pending = remaining;
    this.reportDroppedPending();
  }

  /** Reports copies a relay put on the wire, naming the adapter in case a better one exists. */
  private reportSuppressedDuplicates(): void {
    if (!this.duplicateFilter || this.duplicateFilter.suppressedCount === 0) return;
    const now = Date.now();
    this.duplicateReportedAtMs ||= now;
    if (now - this.duplicateReportedAtMs < DUPLICATE_REPORT_MS) return;
    const total = this.duplicateFilter.takeSuppressedCount();
    this.emitSafely(
      "warning",
      `suppressed ${total} duplicate packets on ${this.deviceLabel}; a VPN or proxy is relaying this traffic`
        + ", so select the adapter carrying it directly if decoding looks incomplete",
    );
    this.duplicateReportedAtMs = now;
  }

  /** Reports packets given up on unattributed, which is how a connection loses its opening. */
  private reportDroppedPending(): void {
    if (this.droppedPending === 0) return;
    const now = Date.now();
    this.droppedReportedAtMs ||= now;
    if (now - this.droppedReportedAtMs < PENDING_DROP_REPORT_MS) return;
    // Most of what goes unattributed is other software's UDP, so this does not blame the relay.
    const relay = this.relayObserved ? "; a VPN or proxy is also relaying traffic on this adapter" : "";
    this.emitSafely("warning", `gave up on ${this.droppedPending} packets that could not be attributed to the target process${relay}`);
    this.emitSafely("droppedFlows", this.dropDiagnostics.topFlows());
    if (this.dropDiagnostics.hasGameTraffic) {
      this.emitSafely(
        "warning",
        "some discarded traffic carries sequenced game packets, so the target process does not own"
          + " every socket its traffic uses; capture that adapter directly or report these flows",
      );
    }
    this.droppedPending = 0;
    this.droppedReportedAtMs = now;
  }

  private emitTransportPacket(packet: CapturedTransportPacket): void {
    if (this.duplicateFilter && !this.duplicateFilter.admit(packet)) {
      this.relayObserved = true;
      return;
    }
    if (packet.protocol === "tcp") this.emitSafely("packet", packet);
    else this.emitSafely("udpPacket", packet);
    this.emitSafely("transportPacket", packet);
    if (packet.protocol === "udp" && this.decodeLiteNetLib) this.emitLiteNetLibPackets(packet);
  }

  private emitLiteNetLibPackets(packet: CapturedUdpPacket): void {
    try {
      for (const decoded of decodeLiteNetLibDatagram(packet.payload)) {
        const captured = { ...decoded, udpPacket: packet } satisfies CapturedLiteNetLibPacket;
        this.emitSafely("liteNetPacket", captured);
        this.trackConnection(captured);
        if (this.decodeFishNet) this.emitFishNetPacket(captured);
      }
    } catch (error) {
      const detail = error instanceof LiteNetLibProtocolError ? error.message : toError(error).message;
      this.emitSafely("warning", `skipped LiteNetLib decode: ${detail}`);
    }
  }

  /**
   * Follows the connection the game is playing on.
   *
   * FishNet says so once per connection, in `authenticated`; a consumer that misses that packet
   * stays pinned to a connection the game has left, discarding everything the live one sends.
   * Connects and disconnects are announced continually, so losing one of those costs nothing.
   */
  private trackConnection(packet: CapturedLiteNetLibPacket): void {
    const { property } = packet.packet;
    if (property !== "connectRequest" && property !== "connectAccept" && property !== "disconnect") return;
    const connectionId = connectionIdFor(packet);
    if (property === "disconnect") {
      if (this.currentConnectionId === connectionId) this.currentConnectionId = undefined;
      this.emitSafely("connection", { connectionId, state: "closed" } satisfies CaptureConnectionEvent);
      return;
    }
    // A connect repeats until it is answered, so only the first one is worth reporting.
    if (this.currentConnectionId === connectionId) return;
    this.currentConnectionId = connectionId;
    this.emitSafely("connection", { connectionId, state: "opened" } satisfies CaptureConnectionEvent);
  }

  private emitFishNetPacket(packet: CapturedLiteNetLibPacket): void {
    const { property, payload } = packet.packet;
    const udp = packet.udpPacket;
    const connectionId = connectionIdFor(packet);
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
        this.emitSafely("fishNetPacket", { ...decoded, liteNetPacket: packet, connectionId } satisfies CapturedFishNetPacket);
      }
    } catch (error) {
      const detail = error instanceof FishNetProtocolError ? error.message : toError(error).message;
      this.emitSafely("warning", `skipped FishNet decode at LiteNetLib path ${packet.mergePath.join(".") || "root"}: ${detail}`);
    }
  }

  private emitSafely(event: string, ...args: unknown[]): boolean {
    const listeners = this.rawListeners(event);
    for (const listener of listeners) {
      try {
        Reflect.apply(listener, this, args);
      } catch (error) {
        const detail = `${event} listener failed: ${toError(error).message}`;
        if (event === "warning" || event === "error") console.error("[spiritvale-capture]", detail);
        else if (!this.emitSafely("warning", detail)) console.error("[spiritvale-capture]", detail);
      }
    }
    return listeners.length > 0;
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
    this.currentConnectionId = undefined;
    this.droppedPending = 0;
    this.droppedReportedAtMs = 0;
    this.duplicateFilter?.reset();
    this.duplicateFilter = null;
    this.duplicateReportedAtMs = 0;
    this.relayObserved = false;
    this.dropDiagnostics.reset();
    this.deviceLabel = "";
  }
}

/**
 * Names a connection by the game's own socket, so both directions of it agree.
 *
 * The endpoint pair is the obvious name and breaks behind a relay: it rewrites the peer's endpoint
 * asymmetrically, so the two directions sort to different pairs and everything keyed on the name
 * splits in half. The local port survives that and already identifies the socket on this host.
 */
function connectionIdFor(packet: CapturedLiteNetLibPacket): string {
  const udp = packet.udpPacket;
  const localPort = udp.direction === "outbound" ? udp.sourcePort : udp.destinationPort;
  return `local:${localPort}#${packet.packet.connectionNumber}`;
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

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}
