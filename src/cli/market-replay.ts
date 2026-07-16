import { readFile } from "node:fs/promises";

import { FishNetSessionDecoder } from "../fishnet/session-decoder.ts";
import { loadBundledFishNetRpcMap } from "../fishnet/builtin-maps.ts";
import { FishNetMarketTracker } from "../fishnet/market.ts";
import { decodeLiteNetLibDatagram } from "../litenetlib/decoder.ts";

export interface MarketReplayResult {
  datagrams: number;
  marketEvents: number;
  invalidLines: number;
  decodeWarnings: number;
}

/** Replays raw `capture:dump` UDP lines without retaining endpoint metadata. */
export function decodeMarketCaptureText(
  text: string,
  tracker: FishNetMarketTracker,
): MarketReplayResult {
  const session = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
  let datagrams = 0;
  let marketEvents = 0;
  let invalidLines = 0;
  let decodeWarnings = 0;

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(/^UDP (.+) -> (.+) payload=([0-9a-fA-F]+)$/);
    if (!match) {
      invalidLines += 1;
      continue;
    }
    datagrams += 1;
    const source = match[1] ?? "";
    const destination = match[2] ?? "";
    const endpoints = [source, destination].sort();
    const connectionBase = `${endpoints[0]}<->${endpoints[1]}`;
    const direction = source === endpoints[0] ? "a-to-b" : "b-to-a";
    try {
      for (const decoded of decodeLiteNetLibDatagram(Buffer.from(match[3] ?? "", "hex"))) {
        const packet = decoded.packet;
        const connectionId = `${connectionBase}#${packet.connectionNumber}`;
        if (packet.property === "connectRequest" || packet.property === "connectAccept" || packet.property === "disconnect") {
          session.reset(connectionId);
          continue;
        }
        if ((packet.property !== "unreliable" && packet.property !== "channeled") || packet.payload.length < 6) continue;
        const fishNetPackets = session.decode(packet.payload, {
          reliable: packet.property === "channeled",
          connectionId,
          direction,
          channel: packet.property === "channeled" ? packet.channel : 1,
          sequence: packet.property === "channeled" ? packet.sequence : undefined,
        });
        for (const fishNetPacket of fishNetPackets) marketEvents += tracker.consume(fishNetPacket).length;
      }
    } catch {
      decodeWarnings += 1;
    }
  }
  return { datagrams, marketEvents, invalidLines, decodeWarnings };
}

export async function replayMarketCapture(path: string, tracker: FishNetMarketTracker): Promise<MarketReplayResult> {
  const bytes = await readFile(path);
  const text = bytes[0] === 0xff && bytes[1] === 0xfe
    ? new TextDecoder("utf-16le").decode(bytes.subarray(2))
    : bytes[0] === 0xfe && bytes[1] === 0xff
      ? new TextDecoder("utf-16be").decode(bytes.subarray(2))
      : new TextDecoder().decode(bytes);
  return decodeMarketCaptureText(text, tracker);
}
