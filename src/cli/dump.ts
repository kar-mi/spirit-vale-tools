import { PacketCapture } from "../index.ts";

function option(name: string): string | undefined {
  const index = Bun.argv.indexOf(name);
  return index >= 0 ? Bun.argv[index + 1] : undefined;
}

const durationText = option("--duration");
const durationSeconds = durationText === undefined ? undefined : Number(durationText);
if (durationSeconds !== undefined && (!Number.isFinite(durationSeconds) || durationSeconds <= 0)) {
  throw new Error("--duration must be a positive number of seconds");
}

const capture = new PacketCapture();
capture.on("started", () => console.error("capture started; press Ctrl+C to stop"));
capture.on("warning", (message) => console.error(`[warning] ${message}`));
capture.on("error", (error) => console.error(`[error] ${error.message}`));
capture.on("packet", (packet) => {
  const direction = packet.direction === "outbound" ? "->" : "<-";
  console.log(
    `${packet.sourceIP}:${packet.sourcePort} ${direction} ${packet.destinationIP}:${packet.destinationPort}` +
      ` seq=${packet.sequenceNumber} ack=${packet.acknowledgementNumber}` +
      ` flags=0x${packet.tcpFlags.toString(16).padStart(2, "0")}` +
      ` payload=${packet.payload.toString("hex")}`,
  );
});

let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  await capture.stop();
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());

await capture.start({ filter: option("--filter"), helperPath: option("--helper") });
if (durationSeconds !== undefined) {
  await Bun.sleep(durationSeconds * 1000);
  await stop();
}
