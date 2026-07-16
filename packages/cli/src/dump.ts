import { createWriteStream, mkdirSync } from "node:fs";
import path from "node:path";
import { finished } from "node:stream/promises";

import {
  BUNDLED_FISHNET_BUILD_FINGERPRINTS,
  PacketCapture,
  loadBundledFishNetSemanticMap,
  loadFishNetRpcMap,
} from "@spiritvale/core";
import type { CaptureProtocol } from "@spiritvale/core";
import { FishNetActorDirectory, FishNetCombatTracker, defaultCombatLogPath } from "@spiritvale/combat";
import {
  formatActorIdentityEventJson,
  formatCombatEvent,
  formatCombatEventJson,
  formatFishNetPacket,
  formatLiteNetLibPacket,
  formatTransportPacket,
} from "./format-packet.ts";

function option(name: string): string | undefined {
  const index = Bun.argv.indexOf(name);
  return index >= 0 ? Bun.argv[index + 1] : undefined;
}

const durationText = option("--duration");
const durationSeconds = durationText === undefined ? undefined : Number(durationText);
if (durationSeconds !== undefined && (!Number.isFinite(durationSeconds) || durationSeconds <= 0)) {
  throw new Error("--duration must be a positive number of seconds");
}

const protocols = (option("--protocols") ?? "tcp,udp").split(",").map((value) => value.trim().toLowerCase());
if (protocols.length === 0 || protocols.some((protocol) => protocol !== "tcp" && protocol !== "udp")) {
  throw new Error("--protocols must be tcp, udp, or tcp,udp");
}
const targetProcessName = Bun.argv.includes("--all-processes") ? undefined : option("--process") ?? "SpiritVale.exe";
const combatJson = Bun.argv.includes("--combat-json");
const sharedCombatLog = Bun.argv.includes("--combat-log");
const outputPath = option("--output") ?? (sharedCombatLog ? defaultCombatLogPath() : undefined);
if (outputPath && !combatJson) throw new Error("--output requires --combat-json");
if (outputPath) mkdirSync(path.dirname(outputPath), { recursive: true });
const combatLog = outputPath ? createWriteStream(outputPath, { flags: "a", encoding: "utf8" }) : undefined;
const combatOnly = Bun.argv.includes("--combat-only") || combatJson;
const decodeFishNet = Bun.argv.includes("--decode-fishnet") || combatOnly;
const decodeLiteNetLib = Bun.argv.includes("--decode-litenetlib") || decodeFishNet;
const mapOption = option("--fishnet-map");
const mapPath = decodeFishNet ? mapOption : undefined;
const fishNetRpcMap = mapPath ? loadFishNetRpcMap(mapPath) : undefined;
const fishNetBuildFingerprint = option("--fishnet-build");
const combatFingerprint = fishNetRpcMap?.buildFingerprint ?? fishNetBuildFingerprint;
const semanticMap = combatOnly && combatFingerprint
  && BUNDLED_FISHNET_BUILD_FINGERPRINTS.some((fingerprint) => fingerprint === combatFingerprint)
  ? loadBundledFishNetSemanticMap(combatFingerprint)
  : combatOnly && fishNetRpcMap
    ? { schemaVersion: 1 as const, buildFingerprint: fishNetRpcMap.buildFingerprint, verifiedSkillLabels: [] }
    : undefined;
const combatTracker = combatOnly
  ? new FishNetCombatTracker({ buildFingerprint: fishNetBuildFingerprint, semanticMap })
  : undefined;
const actorDirectory = combatJson ? new FishNetActorDirectory() : undefined;

const capture = new PacketCapture();
capture.on("started", () => console.error("capture started; press Ctrl+C to stop"));
capture.on("warning", (message) => console.error(`[warning] ${message}`));
capture.on("error", (error) => console.error(`[error] ${error.message}`));
capture.on("targetStatus", (status) => {
  const pids = status.processIds.length === 0 ? "" : ` (PID ${status.processIds.join(", ")})`;
  console.error(`target ${status.processName}: ${status.state}${pids}`);
});
capture.on("transportPacket", (packet) => {
  if (!combatOnly) console.log(formatTransportPacket(packet));
});
capture.on("liteNetPacket", (packet) => {
  if (!combatOnly) console.log(formatLiteNetLibPacket(packet));
});
capture.on("fishNetPacket", (packet) => {
  if (!combatOnly) {
    console.log(formatFishNetPacket(packet));
    return;
  }
  for (const event of actorDirectory?.consume(packet) ?? []) {
    writeCombatLine(formatActorIdentityEventJson(event));
  }
  for (const event of combatTracker?.consume(packet) ?? []) {
    const line = combatJson ? formatCombatEventJson(event) : formatCombatEvent(event);
    if (combatJson) writeCombatLine(line);
    else console.log(line);
  }
});
capture.on("stopped", () => {
  actorDirectory?.reset();
  combatTracker?.reset();
});

let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  await capture.stop();
  if (combatLog) {
    combatLog.end();
    await finished(combatLog);
  }
}

function writeCombatLine(line: string): void {
  if (combatLog) combatLog.write(`${line}\n`);
  else console.log(line);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());

await capture.start({
  filter: option("--filter"),
  helperPath: option("--helper"),
  protocols: protocols as CaptureProtocol[],
  targetProcessName,
  decodeLiteNetLib,
  decodeFishNet,
  fishNetBuildFingerprint,
  fishNetRpcMap,
});
if (durationSeconds !== undefined) {
  await Bun.sleep(durationSeconds * 1000);
  await stop();
}
