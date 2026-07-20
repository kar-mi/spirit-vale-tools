import {
  BUNDLED_GAME_BUILD_FINGERPRINTS,
  loadBundledFishNetSemanticMap,
} from "@spiritvale/core";
import { PacketCapture } from "@spiritvale/core/capture";
import type { CaptureProtocol } from "@spiritvale/core";
import { FishNetActorDirectory, FishNetCombatTracker } from "@spiritvale/combat";
import { createLogSession } from "@spiritvale/logging";
import {
  domainEventData,
  fishNetPacketData,
  liteNetLibPacketData,
  transportPacketData,
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
if (Bun.argv.includes("--combat-json") || Bun.argv.includes("--combat-log")) {
  throw new Error("--combat-json and --combat-log were replaced by automatic JSON sessions; use --combat-only");
}
const outputPath = option("--output");
const combatOnly = Bun.argv.includes("--combat-only");
const decodeFishNet = Bun.argv.includes("--decode-fishnet") || combatOnly;
const decodeLiteNetLib = Bun.argv.includes("--decode-litenetlib") || decodeFishNet;
const fishNetBuildFingerprint = option("--fishnet-build");
const combatFingerprint = fishNetBuildFingerprint;
const semanticMap = combatOnly && combatFingerprint
  && BUNDLED_GAME_BUILD_FINGERPRINTS.some((fingerprint) => fingerprint === combatFingerprint)
  ? loadBundledFishNetSemanticMap(combatFingerprint)
  : undefined;
const combatTracker = combatOnly
  ? new FishNetCombatTracker({ buildFingerprint: fishNetBuildFingerprint, semanticMap })
  : undefined;
const actorDirectory = combatOnly ? new FishNetActorDirectory() : undefined;
const stream = combatOnly ? "combat" as const : "capture" as const;
const session = await createLogSession({
  producer: "capture-cli",
  streams: [stream],
  ...(outputPath ? { outputPaths: { [stream]: outputPath } } : {}),
  onWriteError: ({ stream: failedStream, error }) => console.error(`[logging error] ${failedStream}: ${error.message}`),
});
const logger = session.logger(stream);
console.error(`logging ${stream} session ${session.id}`);

const capture = new PacketCapture();
capture.on("started", () => {
  logger.log("capture.lifecycle", { state: "started" });
  console.error("capture started; press Ctrl+C to stop");
});
capture.on("warning", (message) => {
  logger.log("capture.warning", { message });
  console.error(`[warning] ${message}`);
});
capture.on("error", (error) => {
  logger.log("capture.error", { message: error.message });
  console.error(`[error] ${error.message}`);
});
capture.on("targetStatus", (status) => {
  logger.log("capture.targetStatus", {
    processName: status.processName,
    state: status.state,
    processIds: status.processIds,
  });
  const pids = status.processIds.length === 0 ? "" : ` (PID ${status.processIds.join(", ")})`;
  console.error(`target ${status.processName}: ${status.state}${pids}`);
});
capture.on("transportPacket", (packet) => {
  if (!combatOnly) logger.log("transport.packet", transportPacketData(packet));
});
capture.on("liteNetPacket", (packet) => {
  if (!combatOnly) logger.log("litenetlib.packet", liteNetLibPacketData(packet));
});
capture.on("fishNetPacket", (packet) => {
  if (!combatOnly) {
    logger.log("fishnet.packet", fishNetPacketData(packet));
    return;
  }
  for (const event of actorDirectory?.consume(packet) ?? []) {
    logger.log("combat.actorIdentity", domainEventData(event));
  }
  for (const event of combatTracker?.consume(packet) ?? []) {
    logger.log("combat.event", domainEventData(event));
  }
});
capture.on("stopped", () => {
  logger.log("capture.lifecycle", { state: "stopped" });
  actorDirectory?.reset();
  combatTracker?.reset();
});

let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  await capture.stop();
  await session.close();
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());

await capture.start({
  filter: option("--filter"),
  deviceName: option("--adapter"),
  protocols: protocols as CaptureProtocol[],
  targetProcessName,
  decodeLiteNetLib,
  decodeFishNet,
  fishNetBuildFingerprint,
});
if (durationSeconds !== undefined) {
  await Bun.sleep(durationSeconds * 1000);
  await stop();
}
