import { parseMessage } from "./message-parser.ts";
import type { ConnectionState } from "./message-parser.ts";
import { FishNetProtocolError, opaquePacket } from "./protocol.ts";
import type { RpcLinkRegistrationState } from "./protocol.ts";
import { readSignedPackedWhole } from "./wire-reader.ts";
import type { DecodedFishNetPacket, FishNetDecodeOptions, FishNetRpcMap } from "./types.ts";

interface SplitState {
  expected: number;
  chunks: { sequence?: number; chunk: Buffer }[];
  sequences: Set<number>;
  tick: number;
  totalBytes: number;
}

const MAX_SPLIT_CHUNKS = 1_024;
const MAX_SPLIT_BYTES = 1024 * 1024;

/** Stateful decoder for RPC-link registration, despawn cleanup, and split reassembly. */
export class FishNetSessionDecoder {
  private readonly connections = new Map<string, ConnectionState>();
  private readonly splits = new Map<string, SplitState>();

  constructor(private readonly rpcMap?: FishNetRpcMap) {}

  decode(payload: Buffer, options: FishNetDecodeOptions = { reliable: false }): DecodedFishNetPacket[] {
    if (payload.length < 6) {
      throw new FishNetProtocolError(`FishNet payload needs a 4-byte tick and 2-byte packet id; received ${payload.length} bytes`);
    }

    const tick = payload.readUInt32LE(0);
    const connectionKey = String(options.connectionId ?? "default");
    const state = this.getConnection(connectionKey);
    const map = options.rpcMap ?? this.rpcMap;

    const decoded = payload.readUInt16LE(4) === 2
      ? this.decodeSplit(payload, tick, connectionKey, state, { ...options, rpcMap: map })
      : this.decodeMessages(payload, 4, tick, state, { ...options, rpcMap: map });
    if (decoded.some((packet) => packet.packetName === "authenticated" || packet.packetName === "disconnect")) {
      this.clearConnectionSplits(connectionKey);
    }
    return decoded;
  }

  /** Clears one connection, or all decoder state when no identifier is supplied. */
  reset(connectionId?: string | number): void {
    if (connectionId === undefined) {
      this.connections.clear();
      this.splits.clear();
      return;
    }
    const key = String(connectionId);
    this.connections.delete(key);
    this.clearConnectionSplits(key);
  }

  private getConnection(key: string): ConnectionState {
    let state = this.connections.get(key);
    if (!state) {
      state = { links: new Map(), components: new Map() };
      this.connections.set(key, state);
    }
    return state;
  }

  private dropSplit(
    splitKey: string,
    payload: Buffer,
    tick: number,
    reason: NonNullable<DecodedFishNetPacket["splitDropReason"]>,
  ): DecodedFishNetPacket {
    this.splits.delete(splitKey);
    const packet = opaquePacket(payload, 4, tick, 0, "split");
    packet.splitDropReason = reason;
    return packet;
  }

  private clearConnectionSplits(key: string): void {
    for (const splitKey of this.splits.keys()) {
      if (splitKey.startsWith(`${key}\u0000`)) this.splits.delete(splitKey);
    }
  }

  private decodeSplit(
    payload: Buffer,
    tick: number,
    connectionKey: string,
    connection: ConnectionState,
    options: FishNetDecodeOptions,
  ): DecodedFishNetPacket[] {
    const splitKey = `${connectionKey}\u0000${options.direction ?? "unknown"}\u0000${options.channel ?? (options.reliable ? 0 : 1)}`;
    let count;
    try {
      count = readSignedPackedWhole(payload, 6);
    } catch {
      return [this.dropSplit(splitKey, payload, tick, "header")];
    }
    if (count.value < 1 || count.value > MAX_SPLIT_CHUNKS) {
      return [this.dropSplit(splitKey, payload, tick, "chunk-count")];
    }

    let split = this.splits.get(splitKey);
    if (!split || split.expected !== count.value || (options.sequence === undefined && split.tick !== tick)) {
      split = { expected: count.value, chunks: [], sequences: new Set(), tick, totalBytes: 0 };
      this.splits.set(splitKey, split);
    }

    if (options.sequence !== undefined && split.sequences.has(options.sequence)) return [];
    if (options.sequence !== undefined) split.sequences.add(options.sequence);
    const chunk = payload.subarray(count.nextOffset);
    split.totalBytes += chunk.length;
    if (split.totalBytes > MAX_SPLIT_BYTES) {
      return [this.dropSplit(splitKey, payload, tick, "size-cap")];
    }
    split.chunks.push({ sequence: options.sequence, chunk });
    if (split.chunks.length < split.expected) return [];

    this.splits.delete(splitKey);
    const reassembled = Buffer.concat(orderedChunks(split.chunks), split.totalBytes);
    return this.decodeMessages(reassembled, 0, tick, connection, options);
  }

  private decodeMessages(
    buffer: Buffer,
    start: number,
    tick: number,
    state: ConnectionState,
    options: FishNetDecodeOptions,
  ): DecodedFishNetPacket[] {
    const packets: DecodedFishNetPacket[] = [];
    let offset = start;
    while (buffer.length - offset >= 2) {
      const parsed = parseMessage(buffer, offset, tick, packets.length, state, options);
      packets.push(parsed.packet);

      if (parsed.packet.packetName === "authenticated") {
        state.links.clear();
        state.components.clear();
      }
      if (parsed.packet.packetName === "objectSpawn" && parsed.packet.objectId !== undefined) {
        removeObjectLinks(state.links, parsed.packet.objectId);
        removeObjectComponents(state.components, parsed.packet.objectId);
      }
      if (parsed.componentBindings) {
        for (const [key, typeName] of parsed.componentBindings) state.components.set(key, typeName);
      }
      if (parsed.registrations) {
        for (const [linkId, registration] of parsed.registrations) state.links.set(linkId, registration);
      }
      if (parsed.packet.packetName === "objectDespawn" && parsed.packet.objectId !== undefined) {
        removeObjectLinks(state.links, parsed.packet.objectId);
        removeObjectComponents(state.components, parsed.packet.objectId);
      }
      if (parsed.packet.packetName === "disconnect") {
        state.links.clear();
        state.components.clear();
      }

      if (parsed.stop || parsed.end <= offset) break;
      offset = parsed.end;
    }
    return packets;
  }
}

/**
 * Passive capture observes wire order, not delivery order: retransmits and reordering are normal,
 * and interleaved reliable traffic means chunk sequences are monotonic but not contiguous. Chunks
 * are therefore accumulated without gap checks and concatenated in wrap-aware sequence order.
 */
function orderedChunks(chunks: { sequence?: number; chunk: Buffer }[]): Buffer[] {
  if (chunks.some(({ sequence }) => sequence === undefined)) return chunks.map(({ chunk }) => chunk);
  const sequences = chunks.map(({ sequence }) => sequence!);
  const wrapped = Math.max(...sequences) - Math.min(...sequences) > 0x8000;
  const order = (sequence: number): number => (wrapped && sequence < 0x8000 ? sequence + 0x10000 : sequence);
  return chunks
    .slice()
    .sort((a, b) => order(a.sequence!) - order(b.sequence!))
    .map(({ chunk }) => chunk);
}

function removeObjectLinks(links: Map<number, RpcLinkRegistrationState>, objectId: number): void {
  for (const [linkId, registration] of links) {
    if (registration.objectId === objectId) links.delete(linkId);
  }
}

function removeObjectComponents(components: Map<string, string>, objectId: number): void {
  const prefix = `${objectId}:`;
  for (const key of components.keys()) {
    if (key.startsWith(prefix)) components.delete(key);
  }
}
