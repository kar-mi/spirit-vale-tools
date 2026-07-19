/** Bun/main-process-only capture APIs. Do not import this entrypoint from a browser view. */
export { PacketCapture, getNpcapStatus, listNpcapDevices } from "./capture/packet-capture.ts";
export { resolveCaptureDevice } from "./capture/adapter-selection.ts";
export type { NpcapAvailability, NpcapDevice, NpcapStatus } from "./capture/npcap.ts";
