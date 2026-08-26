import type { CaptureProtocol } from "@kar-mi/spirit-vale-tools-capture";
import { PacketCapture } from "@kar-mi/spirit-vale-tools-capture/capture";
import { FishNetActorDirectory, FishNetPositionTracker } from "@kar-mi/spirit-vale-tools-combat";
import { FishNetCharacterTracker } from "@kar-mi/spirit-vale-tools-character";

function option(name: string): string | undefined {
  const index = Bun.argv.indexOf(name);
  return index >= 0 ? Bun.argv[index + 1] : undefined;
}

const targetProcessName = Bun.argv.includes("--all-processes") ? undefined : option("--process") ?? "SpiritVale.exe";
const fishNetBuildFingerprint = option("--fishnet-build");

const directory = new FishNetActorDirectory();
const character = new FishNetCharacterTracker();
const positions = new FishNetPositionTracker({ directory });

let lastPrinted: { x?: number; y?: number; z?: number; heading?: number } | undefined;

function maybePrint(tick: number, objectId: number, heading: number | undefined): void {
  const position = positions.get(objectId);
  const current = { x: position?.x, y: position?.y, z: position?.z, heading };
  if (
    lastPrinted && lastPrinted.x === current.x && lastPrinted.y === current.y
    && lastPrinted.z === current.z && lastPrinted.heading === current.heading
  ) return;
  lastPrinted = current;

  const headingDeg = heading === undefined ? "?".padStart(6) : ((heading * 180) / Math.PI).toFixed(1).padStart(6);
  const pos = position === undefined
    ? "?"
    : `(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`;
  console.log(`tick=${tick}  heading=${headingDeg}deg  pos=${pos}`);
}

const capture = new PacketCapture();
capture.on("started", () => console.error("capture started; press Ctrl+C to stop"));
capture.on("warning", (message) => console.error(`[warning] ${message}`));
capture.on("error", (error) => console.error(`[error] ${error.message}`));
capture.on("targetStatus", (status) => {
  const pids = status.processIds.length === 0 ? "" : ` (PID ${status.processIds.join(", ")})`;
  console.error(`target ${status.processName}: ${status.state}${pids}`);
});
capture.on("fishNetPacket", (packet) => {
  directory.consume(packet);
  character.consume(packet);
  const selfId = character.currentObjectId();
  positions.setLocalObjectId(selfId);
  positions.consume(packet);

  if (packet.objectId === undefined || packet.objectId !== selfId) return;
  // A heading-only update (turning without ever having moved since spawn) never gives
  // FishNetPositionTracker a complete position, so its own events would stay silent forever;
  // read the heading straight off the packet instead of waiting for that.
  const heading = packet.packetName === "objectSpawn" ? packet.spawnHeading : packet.networkTransform?.heading;
  if (heading === undefined && !packet.networkTransform && packet.packetName !== "objectSpawn") return;
  maybePrint(packet.tick, packet.objectId, heading ?? positions.get(packet.objectId)?.heading);
});
capture.on("stopped", () => {
  directory.reset();
  positions.reset();
  lastPrinted = undefined;
});

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
  deviceName: option("--adapter"),
  protocols: ["udp"] as CaptureProtocol[],
  targetProcessName,
  decodeLiteNetLib: true,
  decodeFishNet: true,
  fishNetBuildFingerprint,
});
