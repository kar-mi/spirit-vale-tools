import { FishNetSessionDecoder, loadBundledFishNetRpcMap, decodeLiteNetLibDatagram } from "@spiritvale/core";
import { parseLogRecord } from "@spiritvale/logging";
import { FishNetMarketTracker } from "./market.ts";

export interface MarketReplayResult {
  datagrams: number;
  marketEvents: number;
  invalidLines: number;
  decodeWarnings: number;
}

/** Replays structured transport records without retaining endpoint metadata. */
export function decodeMarketCaptureJsonLines(
  text: string,
  tracker: FishNetMarketTracker,
): MarketReplayResult {
  const replay = new MarketCaptureReplay(tracker);
  for (const line of text.split(/\r?\n/)) replay.consumeLine(line);
  return replay.result();
}

export async function replayMarketCapture(path: string, tracker: FishNetMarketTracker): Promise<MarketReplayResult> {
  const replay = new MarketCaptureReplay(tracker);
  for await (const line of readLines(Bun.file(path).stream())) replay.consumeLine(line);
  return replay.result();
}

class MarketCaptureReplay {
  private readonly session = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
  private datagrams = 0;
  private marketEvents = 0;
  private invalidLines = 0;
  private decodeWarnings = 0;

  constructor(private readonly tracker: FishNetMarketTracker) {}

  consumeLine(line: string): void {
    if (!line.trim()) return;
    let record;
    try {
      record = parseLogRecord(JSON.parse(line));
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
        for (const fishNetPacket of fishNetPackets) this.marketEvents += this.tracker.consume(fishNetPacket).length;
      }
    } catch {
      this.decodeWarnings += 1;
    }
  }

  result(): MarketReplayResult {
    return {
      datagrams: this.datagrams,
      marketEvents: this.marketEvents,
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
