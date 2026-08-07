import { FishNetSessionDecoder, loadBundledFishNetRpcMap, decodeLiteNetLibDatagram } from "@kar-mi/spirit-vale-tools-capture";
import { isLogStreamHeader, parseLogRecord } from "@kar-mi/spirit-vale-tools-logging";
import { FishNetActorDirectory } from "./actor-directory.ts";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import { FishNetCombatTracker } from "./combat-tracker.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";

export interface CombatCaptureReplayOptions {
  tracker: FishNetCombatTracker;
  directory: FishNetActorDirectory;
  /**
   * Receives every decoded event in wire order, so a caller can drive reducers as it replays.
   *
   * `observedAtMs` is the capture record's own timestamp, which is what the live indexing path uses
   * (`history/importer.ts`) — the game tick alone has no epoch to align an encounter to.
   */
  onEvent?: (event: FishNetActorIdentityEvent | FishNetCombatEvent, observedAtMs: number) => void;
}

export interface CombatCaptureReplayResult {
  datagrams: number;
  combatEvents: number;
  identityEvents: number;
  invalidLines: number;
  decodeWarnings: number;
}

/** Replays structured transport records without retaining endpoint metadata. */
export function decodeCombatCaptureJsonLines(
  text: string,
  options: CombatCaptureReplayOptions,
): CombatCaptureReplayResult {
  const replay = new CombatCaptureReplay(options);
  for (const line of text.split(/\r?\n/)) replay.consumeLine(line);
  return replay.result();
}

/**
 * Re-runs a raw packet capture through the combat trackers.
 *
 * Needs a capture that carries `transport.packet` records — `dump.ts --combat-only` writes decoded
 * events instead, and those replay through {@link loadDpsReplay}.
 */
export async function replayCombatCapture(
  path: string,
  options: CombatCaptureReplayOptions,
): Promise<CombatCaptureReplayResult> {
  const replay = new CombatCaptureReplay(options);
  for await (const line of readLines(Bun.file(path).stream())) replay.consumeLine(line);
  return replay.result();
}

class CombatCaptureReplay {
  private readonly session = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
  private datagrams = 0;
  private combatEvents = 0;
  private identityEvents = 0;
  private invalidLines = 0;
  private decodeWarnings = 0;

  constructor(private readonly options: CombatCaptureReplayOptions) {}

  consumeLine(line: string): void {
    if (!line.trim()) return;
    let record;
    try {
      const value: unknown = JSON.parse(line);
      if (isLogStreamHeader(value)) return; // Stream metadata, not a record.
      record = parseLogRecord(value);
    } catch {
      record = undefined;
    }
    if (!record) {
      this.invalidLines += 1;
      return;
    }
    if (record.type !== "transport.packet") return;
    const packet = parseUdpRecord(record.data);
    if (!packet) {
      this.invalidLines += 1;
      return;
    }
    this.datagrams += 1;
    const observedAtMs = Date.parse(record.recordedAt);
    const source = `${packet.sourceIP}:${packet.sourcePort}`;
    const destination = `${packet.destinationIP}:${packet.destinationPort}`;
    const endpoints = [source, destination].sort();
    const connectionBase = `${endpoints[0]}<->${endpoints[1]}`;
    const direction = source === endpoints[0] ? "a-to-b" : "b-to-a";
    try {
      for (const decoded of decodeLiteNetLibDatagram(Buffer.from(packet.payloadHex, "hex"))) {
        const packet = decoded.packet;
        const connectionId = `${connectionBase}#${packet.connectionNumber}`;
        if (packet.property === "connectRequest" || packet.property === "connectAccept" || packet.property === "disconnect") {
          this.session.reset(connectionId);
          continue;
        }
        if ((packet.property !== "unreliable" && packet.property !== "channeled") || packet.payload.length < 6) continue;
        const fishNetPackets = this.session.decode(packet.payload, {
          reliable: packet.property === "channeled",
          connectionId,
          direction,
          channel: packet.property === "channeled" ? packet.channel : 1,
          sequence: packet.property === "channeled" ? packet.sequence : undefined,
        });
        // The directory is fed first so an actor's identity is known before the events naming it.
        for (const fishNetPacket of fishNetPackets) {
          for (const event of this.options.directory.consume(fishNetPacket)) {
            this.identityEvents += 1;
            if (Number.isFinite(observedAtMs)) this.options.onEvent?.(event, observedAtMs);
          }
          for (const event of this.options.tracker.consume(fishNetPacket)) {
            this.combatEvents += 1;
            if (Number.isFinite(observedAtMs)) this.options.onEvent?.(event, observedAtMs);
          }
        }
      }
    } catch {
      this.decodeWarnings += 1;
    }
  }

  result(): CombatCaptureReplayResult {
    return {
      datagrams: this.datagrams,
      combatEvents: this.combatEvents,
      identityEvents: this.identityEvents,
      invalidLines: this.invalidLines,
      decodeWarnings: this.decodeWarnings,
    };
  }
}

interface UdpRecord {
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  payloadHex: string;
}

function parseUdpRecord(data: Record<string, unknown>): UdpRecord | undefined {
  if (data["protocol"] !== "udp" || typeof data["sourceIP"] !== "string"
    || typeof data["destinationIP"] !== "string" || !isPort(data["sourcePort"])
    || !isPort(data["destinationPort"]) || typeof data["payloadHex"] !== "string"
    || !/^(?:[0-9a-fA-F]{2})*$/.test(data["payloadHex"])) return undefined;
  return data as unknown as UdpRecord;
}

function isPort(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 65_535;
}

async function* readLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      pending += decoder.decode(value, { stream: true });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";
      yield* lines;
    }
    pending += decoder.decode();
    if (pending) yield pending;
  } finally {
    reader.releaseLock();
  }
}
