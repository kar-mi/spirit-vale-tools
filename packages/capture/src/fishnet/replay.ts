import { decodeLiteNetLibDatagram } from "../litenetlib/decoder.ts";
import type { DecodedFishNetPacket } from "./types.ts";
import { FishNetSessionDecoder } from "./decoding/decoder.ts";
import { loadBundledFishNetRpcMap } from "./mapping/bundled-rpc-map.ts";

export interface FishNetReplayLogRecord {
  readonly type: string;
  readonly recordedAt: string;
  readonly data: Record<string, unknown>;
}

export type FishNetReplayRecordResult = "ignored" | "invalid" | "decoded";

export interface FishNetTransportReplayStats {
  datagrams: number;
  decodeWarnings: number;
}

/** Replays structured UDP transport records through one connection-aware FishNet decoder. */
export class FishNetTransportReplay {
  private readonly session = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
  private datagrams = 0;
  private decodeWarnings = 0;

  consumeRecord(
    record: FishNetReplayLogRecord,
    consume: (packet: DecodedFishNetPacket, observedAtMs: number | undefined) => void,
  ): FishNetReplayRecordResult {
    if (record.type !== "transport.packet") return "ignored";
    const transport = parseUdpRecord(record.data);
    if (!transport) return "invalid";
    this.datagrams += 1;

    const source = `${transport.sourceIP}:${transport.sourcePort}`;
    const destination = `${transport.destinationIP}:${transport.destinationPort}`;
    const endpoints = [source, destination].sort();
    const connectionBase = `${endpoints[0]}<->${endpoints[1]}`;
    const direction = source === endpoints[0] ? "a-to-b" : "b-to-a";
    const parsedAtMs = Date.parse(record.recordedAt);
    const observedAtMs = Number.isFinite(parsedAtMs) ? parsedAtMs : undefined;

    try {
      for (const decoded of decodeLiteNetLibDatagram(Buffer.from(transport.payloadHex, "hex"))) {
        const packet = decoded.packet;
        const connectionId = `${connectionBase}#${packet.connectionNumber}`;
        if (packet.property === "connectRequest" || packet.property === "connectAccept" || packet.property === "disconnect") {
          this.session.reset(connectionId);
          continue;
        }
        if ((packet.property !== "unreliable" && packet.property !== "channeled") || packet.payload.length < 6) continue;
        for (const fishNetPacket of this.session.decode(packet.payload, {
          reliable: packet.property === "channeled",
          connectionId,
          direction,
          channel: packet.property === "channeled" ? packet.channel : 1,
          sequence: packet.property === "channeled" ? packet.sequence : undefined,
        })) consume(fishNetPacket, observedAtMs);
      }
    } catch {
      this.decodeWarnings += 1;
    }
    return "decoded";
  }

  stats(): FishNetTransportReplayStats {
    return { datagrams: this.datagrams, decodeWarnings: this.decodeWarnings };
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
