import { FishNetActorDirectory, FishNetCombatTracker } from "@spiritvale/combat";
import type { FishNetActorIdentityEvent } from "@spiritvale/combat";
import { PacketCapture } from "@spiritvale/core";
import type { CapturedFishNetPacket, CaptureTargetStatus } from "@spiritvale/core";
import { createLogSession } from "@spiritvale/logging";
import type { JsonData, JsonLinesLogger, JsonObject, LogSession, LogStream } from "@spiritvale/logging";
import { FishNetMarketTracker } from "@spiritvale/market";
import { FishNetMobRewardTracker } from "@spiritvale/rewards";

import type { CaptureStatus, LauncherState } from "../launcher-types.ts";

const SPAWN_PAYLOAD_LOG_LIMIT = 2_048;

export interface CaptureCoordinatorOptions {
  logDirectory: string;
  helperPath?: string;
  captureFactory?: () => PacketCapture;
  onStatus?: (state: LauncherState) => void;
  /**
   * Adds an internal "other" stream containing capture diagnostics and unclassified
   * FishNet packets. Defaults to the SPIRIT_VALE_DIAGNOSTIC_LOGS environment variable.
   */
  diagnosticLogging?: boolean;
}

export class CaptureCoordinator {
  private readonly capture: PacketCapture;
  private readonly diagnosticLogging: boolean;
  private readonly actors = new FishNetActorDirectory();
  private readonly combat = new FishNetCombatTracker();
  private readonly rewards = new FishNetMobRewardTracker();
  private readonly market = new FishNetMarketTracker();
  private session?: LogSession;
  private combatLog?: JsonLinesLogger;
  private rewardsLog?: JsonLinesLogger;
  private marketLog?: JsonLinesLogger;
  private otherLog?: JsonLinesLogger;
  private status: CaptureStatus = "stopped";
  private statusDetail = "Capture stopped";
  private stopping = false;
  private lifecycleStopped = false;
  private activeConnectionId?: string;
  private lastAuthenticated?: { connectionId: string; tick: number };

  constructor(private readonly options: CaptureCoordinatorOptions) {
    this.diagnosticLogging = options.diagnosticLogging ?? envFlag(Bun.env["SPIRIT_VALE_DIAGNOSTIC_LOGS"]);
    this.capture = options.captureFactory?.() ?? new PacketCapture();
    this.capture.on("started", () => this.captureStarted());
    this.capture.on("targetStatus", (target) => this.targetStatus(target));
    this.capture.on("warning", (message) => this.captureWarning(message));
    this.capture.on("error", (error) => this.captureError(error));
    this.capture.on("fishNetPacket", (packet) => this.routePacket(packet));
    this.capture.on("stopped", () => this.captureStopped());
  }

  state(): LauncherState {
    return { captureStatus: this.status, statusDetail: this.statusDetail };
  }

  async start(): Promise<void> {
    if (this.session || this.status === "starting" || this.status === "capturing") return;
    this.setStatus("starting", "Starting centralized capture…");
    try {
      const streams: LogStream[] = ["combat", "rewards", "market"];
      if (this.diagnosticLogging) streams.push("other");
      this.session = await createLogSession({
        producer: "desktop-capture",
        streams,
        logDirectory: this.options.logDirectory,
      });
      this.combatLog = this.session.logger("combat");
      this.rewardsLog = this.session.logger("rewards");
      this.marketLog = this.session.logger("market");
      this.otherLog = this.diagnosticLogging ? this.session.logger("other") : undefined;
      this.otherLog?.log("capture.lifecycle", { state: "starting" });
      await this.capture.start({
        protocols: ["udp"],
        targetProcessName: "SpiritVale.exe",
        decodeFishNet: true,
        helperPath: this.options.helperPath,
      });
    } catch (error) {
      const message = errorMessage(error);
      this.otherLog?.log("capture.error", { message });
      this.combatLog?.log("combat.error", { message });
      this.marketLog?.log("market.error", { message });
      this.rewardsLog?.log("rewards.error", { message });
      this.setStatus("unavailable", "Unable to capture data");
    }
  }

  async stop(): Promise<void> {
    if (this.stopping) return;
    this.stopping = true;
    try {
      await this.capture.stop();
    } catch (error) {
      this.logCaptureError(errorMessage(error));
    }
    this.writeStoppedLifecycle();
    this.actors.reset();
    this.combat.reset();
    this.rewards.reset();
    this.market.reset();
    this.activeConnectionId = undefined;
    this.lastAuthenticated = undefined;
    await this.session?.close();
    this.setStatus("stopped", "Capture stopped");
  }

  private captureStarted(): void {
    this.combatLog?.log("combat.lifecycle", { state: "started" });
    this.rewardsLog?.log("rewards.lifecycle", { state: "started" });
    this.marketLog?.log("market.lifecycle", { state: "started" });
    this.otherLog?.log("capture.lifecycle", { state: "started" });
    this.setStatus("capturing", "Capture active; waiting for Spirit Vale…");
  }

  private targetStatus(target: CaptureTargetStatus): void {
    this.otherLog?.log("capture.targetStatus", {
      processName: target.processName,
      state: target.state,
      processIds: target.processIds,
    });
    if (this.status !== "capturing") return;
    this.setStatus(
      "capturing",
      target.state === "active" ? "Capturing Spirit Vale data" : "Capture active; waiting for Spirit Vale…",
    );
  }

  private captureWarning(message: string): void {
    this.combatLog?.log("combat.warning", { message });
    this.rewardsLog?.log("rewards.warning", { message });
    this.marketLog?.log("market.warning", { message });
    this.otherLog?.log("capture.warning", { message });
  }

  private captureError(error: Error): void {
    this.logCaptureError(error.message);
    if (!this.stopping) this.setStatus("unavailable", "Unable to capture data");
  }

  private captureStopped(): void {
    this.writeStoppedLifecycle();
    if (!this.stopping && this.status !== "unavailable") this.setStatus("stopped", "Capture stopped");
  }

  private routePacket(packet: CapturedFishNetPacket): void {
    if (!this.admitPacket(packet)) return;
    let handled = false;
    try {
      const identities = this.actors.consume(packet);
      const events = this.combat.consume(packet);
      handled ||= identities.length > 0 || events.length > 0;
      for (const event of identities) this.combatLog?.log("combat.actorIdentity", jsonObject(event));
      for (const event of events) this.combatLog?.log("combat.event", jsonObject(event));
      this.logSpawnIdentityMiss(packet, identities);
    } catch (error) {
      handled = true;
      this.logDomainWarning("combat", error);
    }

    try {
      const events = this.rewards.consume(packet);
      handled ||= events.length > 0;
      for (const event of events) {
        this.rewardsLog?.log(event.kind === "kill" ? "rewards.kill" : "rewards.unmatched", jsonObject(event));
      }
    } catch (error) {
      handled = true;
      this.logDomainWarning("rewards", error);
    }

    try {
      const events = this.market.consume(packet);
      handled ||= events.length > 0;
      if (events.length > 0) {
        const snapshot = this.market.snapshot();
        this.marketLog?.log("market.snapshot", jsonObject({
          event: events.at(-1)?.kind,
          account: snapshot.account,
          lastBalanceDelta: snapshot.lastBalanceDelta,
          lastCollectedAmount: snapshot.lastCollectedAmount,
          catalogCount: snapshot.catalog.length,
          stallCount: snapshot.stalls.length,
          listings: this.market.query(),
        }));
      }
    } catch (error) {
      handled = true;
      this.logDomainWarning("market", error);
    }

    if (!handled && this.diagnosticLogging) this.otherLog?.log("fishnet.packet", unclassifiedPacket(packet));
  }

  /**
   * Routes only the active game-server connection. Map changes open a new connection whose
   * trailing authenticated/disconnect packets from the old one must not wipe fresh actor state.
   */
  private admitPacket(packet: CapturedFishNetPacket): boolean {
    const connectionId = packet.connectionId;
    this.activeConnectionId ??= connectionId;
    if (connectionId !== this.activeConnectionId) {
      if (packet.packetName !== "authenticated") return false;
      this.activeConnectionId = connectionId;
    }
    if (packet.packetName === "authenticated") {
      if (this.lastAuthenticated?.connectionId === connectionId && this.lastAuthenticated.tick === packet.tick) {
        return false;
      }
      this.lastAuthenticated = { connectionId, tick: packet.tick };
    }
    if (packet.packetName === "disconnect") this.activeConnectionId = undefined;
    return true;
  }

  private logSpawnIdentityMiss(packet: CapturedFishNetPacket, identities: FishNetActorIdentityEvent[]): void {
    if (packet.packetName !== "objectSpawn" || packet.objectId === undefined) return;
    const ownerConnectionId = packet.ownerConnectionId;
    if (ownerConnectionId === undefined || !Number.isInteger(ownerConnectionId) || ownerConnectionId < 0) return;
    const named = identities.some((event) => event.operation === "upsert" && event.actorId === packet.objectId);
    if (named) return;
    this.otherLog?.log("combat.spawnIdentityMiss", jsonObject({
      tick: packet.tick,
      objectId: packet.objectId,
      ownerConnectionId,
      spawnType: packet.spawnType,
      spawnPrefabId: packet.spawnPrefabId,
      registrations: packet.rpcLinkRegistrations?.map(({ componentIndex, rpcHash, packetName, networkBehaviourType }) => ({
        componentIndex,
        rpcHash,
        packetName,
        networkBehaviourType,
      })),
      spawnSyncPayload: packet.spawnSyncPayload?.subarray(0, SPAWN_PAYLOAD_LOG_LIMIT).toString("hex"),
      spawnSyncPayloadBytes: packet.spawnSyncPayload?.length,
      spawnCustomPayload: packet.spawnCustomPayload?.subarray(0, SPAWN_PAYLOAD_LOG_LIMIT).toString("hex"),
      spawnCustomPayloadBytes: packet.spawnCustomPayload?.length,
      raw: packet.raw.subarray(0, SPAWN_PAYLOAD_LOG_LIMIT).toString("hex"),
      rawBytes: packet.raw.length,
    }));
  }

  private logDomainWarning(domain: "combat" | "rewards" | "market", error: unknown): void {
    const message = `skipped ${domain} payload: ${errorMessage(error)}`;
    if (domain === "combat") this.combatLog?.log("combat.warning", { message });
    else if (domain === "rewards") this.rewardsLog?.log("rewards.warning", { message });
    else this.marketLog?.log("market.warning", { message });
    this.otherLog?.log("capture.warning", { domain, message });
  }

  private logCaptureError(message: string): void {
    this.combatLog?.log("combat.error", { message });
    this.rewardsLog?.log("rewards.error", { message });
    this.marketLog?.log("market.error", { message });
    this.otherLog?.log("capture.error", { message });
  }

  private writeStoppedLifecycle(): void {
    if (this.lifecycleStopped) return;
    this.lifecycleStopped = true;
    for (const event of this.rewards.flush()) {
      this.rewardsLog?.log(event.kind === "kill" ? "rewards.kill" : "rewards.unmatched", jsonObject(event));
    }
    this.combatLog?.log("combat.lifecycle", { state: "stopped" });
    this.rewardsLog?.log("rewards.lifecycle", { state: "stopped" });
    this.marketLog?.log("market.lifecycle", { state: "stopped" });
    this.otherLog?.log("capture.lifecycle", { state: "stopped" });
  }

  private setStatus(status: CaptureStatus, statusDetail: string): void {
    this.status = status;
    this.statusDetail = statusDetail;
    this.options.onStatus?.(this.state());
  }
}

function unclassifiedPacket(packet: CapturedFishNetPacket): JsonObject {
  return jsonObject({
    tick: packet.tick,
    packetId: packet.packetId,
    packetName: packet.packetName,
    objectId: packet.objectId,
    ownerConnectionId: packet.ownerConnectionId,
    rpcName: packet.rpcName,
    rpcResolution: packet.rpcResolution,
    networkBehaviourType: packet.networkBehaviourType,
    decodedFields: packet.decodedFields,
    syncName: packet.syncName,
    broadcastName: packet.broadcastName,
  });
}

function jsonObject(value: object): JsonObject {
  return jsonValue(value) as JsonObject;
}

function jsonValue(value: unknown): JsonData {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : String(value);
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return value.toString("hex");
  if (Array.isArray(value)) return value.map(jsonValue);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, entry]) => entry === undefined ? [] : [[key, jsonValue(entry)]]));
  }
  return String(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function envFlag(value: string | undefined): boolean {
  return value !== undefined && value !== "" && value !== "0" && value.toLowerCase() !== "false";
}
