import { PacketCapture } from "@kar-mi/spirit-vale-tools-capture/capture";
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";
import { FishNetMobRewardTracker, MobRewardSession } from "@kar-mi/spirit-vale-tools-rewards";
import type { FishNetMobRewardEvent } from "@kar-mi/spirit-vale-tools-rewards";
import type { JsonLinesLogger } from "@kar-mi/spirit-vale-tools-logging";
import { jsonObject, option } from "./args.ts";

const outputPath = option("--output");
const session = await createLogSession({
  producer: "rewards-cli",
  streams: ["rewards"],
  ...(outputPath ? { outputPaths: { rewards: outputPath } } : {}),
  onWriteError: ({ stream, error }) => console.error(`[logging error] ${stream}: ${error.message}`),
});
const logger = session.logger("rewards");
const tracker = new FishNetMobRewardTracker();
const rewards = new MobRewardSession();
const capture = new PacketCapture();

console.error(`logging rewards session ${session.id}`);
capture.on("started", () => {
  logger.log("rewards.lifecycle", { state: "started" });
  console.error("mob rewards capture started; press Ctrl+C to stop");
});
capture.on("warning", (message) => logMessage(logger, "rewards.warning", message));
capture.on("error", (error) => logMessage(logger, "rewards.error", error.message));
capture.on("fishNetPacket", (packet) => {
  try {
    for (const event of tracker.consume(packet)) emit(event);
  } catch (error) {
    logMessage(logger, "rewards.warning", `skipped reward payload: ${error instanceof Error ? error.message : String(error)}`);
  }
});

let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  await capture.stop();
  for (const event of tracker.flush()) emit(event);
  logger.log("rewards.lifecycle", { state: "stopped" });
  await session.close();
}

function emit(event: FishNetMobRewardEvent): void {
  rewards.consume(event);
  logger.log(event.kind === "kill" ? "rewards.kill" : "rewards.unmatched", jsonObject(event));
  if (event.kind === "kill") {
    console.error(`${event.mob.displayName}: +${event.experience} XP, +${event.jobExperience} job XP, +${event.coins} coins`);
  }
}

function logMessage(output: JsonLinesLogger, type: string, message: string): void {
  output.log(type, { message });
  console.error(`[${type.endsWith("error") ? "error" : "warning"}] ${message}`);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
await capture.start({ protocols: ["udp"], targetProcessName: "SpiritVale.exe", decodeFishNet: true });

const durationText = option("--duration");
if (durationText !== undefined) {
  const duration = Number(durationText);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("--duration must be a positive number of seconds");
  await Bun.sleep(duration * 1_000);
  await stop();
}
