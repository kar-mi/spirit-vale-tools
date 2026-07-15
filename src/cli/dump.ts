import { PacketCapture } from "../index.ts";
import type { CaptureProtocol } from "../types.ts";
import { formatLiteNetLibPacket, formatTransportPacket } from "./format-packet.ts";

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
const decodeLiteNetLib = Bun.argv.includes("--decode-litenetlib");

const capture = new PacketCapture();
capture.on("started", () => console.error("capture started; press Ctrl+C to stop"));
capture.on("warning", (message) => console.error(`[warning] ${message}`));
capture.on("error", (error) => console.error(`[error] ${error.message}`));
capture.on("targetStatus", (status) => {
  const pids = status.processIds.length === 0 ? "" : ` (PID ${status.processIds.join(", ")})`;
  console.error(`target ${status.processName}: ${status.state}${pids}`);
});
capture.on("transportPacket", (packet) => {
  console.log(formatTransportPacket(packet));
});
capture.on("liteNetPacket", (packet) => console.log(formatLiteNetLibPacket(packet)));

let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  await capture.stop();
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());

await capture.start({
  filter: option("--filter"),
  helperPath: option("--helper"),
  protocols: protocols as CaptureProtocol[],
  targetProcessName,
  decodeLiteNetLib,
});
if (durationSeconds !== undefined) {
  await Bun.sleep(durationSeconds * 1000);
  await stop();
}
