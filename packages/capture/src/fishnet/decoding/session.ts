import { parseMessage } from "./messages.ts";
import type { ConnectionState } from "./messages.ts";
import { FishNetProtocolError, opaquePacket } from "./protocol.ts";
import { readSignedPackedWhole } from "./wire-reader.ts";
import type { DecodedFishNetPacket, FishNetDecodeOptions, FishNetRpcMap } from "../types.ts";

interface SplitState {
  expected: number;
  chunks: { sequence?: number; chunk: Buffer }[];
  sequences: Set<number>;
  totalBytes: number;
  lastSeen: number;
}

const MAX_SPLIT_CHUNKS = 1_024;
const MAX_SPLIT_BYTES = 1024 * 1024;
const MAX_CONCURRENT_SPLITS_PER_CONNECTION = 32;

/** Stateful decoder for RPC-link registration, despawn cleanup, and split reassembly. */
export class FishNetSessionDecoder {
  private readonly connections = new Map<string, ConnectionState>();
  private readonly splits = new Map<string, SplitState>();
  private splitClock = 0;

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
      state = { links: new Map(), components: new Map(), staleLinks: new Map(), staleComponents: new Map() };
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
      if (splitKey.startsWith(`${key} `)) this.splits.delete(splitKey);
    }
  }

  private evictOldestConnectionSplit(connectionKey: string): void {
    const prefix = `${connectionKey} `;
    const connectionSplits = [...this.splits.entries()].filter(([key]) => key.startsWith(prefix));
    if (connectionSplits.length < MAX_CONCURRENT_SPLITS_PER_CONNECTION) return;
    const [oldestKey] = connectionSplits.reduce((oldest, entry) => entry[1].lastSeen < oldest[1].lastSeen ? entry : oldest);
    this.splits.delete(oldestKey);
  }

  private decodeSplit(
    payload: Buffer,
    tick: number,
    connectionKey: string,
    connection: ConnectionState,
    options: FishNetDecodeOptions,
  ): DecodedFishNetPacket[] {
    const direction = options.direction ?? "unknown";
    const channel = options.channel ?? (options.reliable ? 0 : 1);
    let count;
    try {
      count = readSignedPackedWhole(payload, 6);
    } catch {
      return [this.dropSplit("", payload, tick, "header")];
    }
    const splitKey = `${connectionKey} ${direction} ${channel} ${tick} ${count.value}`;
    if (count.value < 1 || count.value > MAX_SPLIT_CHUNKS) {
      return [this.dropSplit(splitKey, payload, tick, "chunk-count")];
    }

    let split = this.splits.get(splitKey);
    if (!split) {
      this.evictOldestConnectionSplit(connectionKey);
      split = { expected: count.value, chunks: [], sequences: new Set(), totalBytes: 0, lastSeen: ++this.splitClock };
      this.splits.set(splitKey, split);
    }

    if (options.sequence !== undefined && split.sequences.has(options.sequence)) return [];
    if (options.sequence !== undefined) split.sequences.add(options.sequence);
    split.lastSeen = ++this.splitClock;
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
        quarantineConnectionState(state);
      }
      if (parsed.packet.packetName === "objectSpawn" && parsed.packet.objectId !== undefined) {
        removeObjectLinks(state, parsed.packet.objectId);
        removeObjectComponents(state, parsed.packet.objectId);
      }
      // Freshly registered data always wins over a quarantined guess for the same key.
      if (parsed.componentBindings) {
        for (const [key, typeName] of parsed.componentBindings) {
          state.components.set(key, typeName);
          state.staleComponents.delete(key);
        }
      }
      if (parsed.registrations) {
        for (const [linkId, registration] of parsed.registrations) {
          state.links.set(linkId, registration);
          state.staleLinks.delete(linkId);
        }
      }
      if (parsed.packet.packetName === "objectDespawn" && parsed.packet.objectId !== undefined) {
        removeObjectLinks(state, parsed.packet.objectId);
        removeObjectComponents(state, parsed.packet.objectId);
      }
      if (parsed.packet.packetName === "disconnect") {
        quarantineConnectionState(state);
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

/**
 * Retires the current link/component tables into quarantine instead of dropping them.
 *
 * `ConnectionState` is keyed by connection id, so a genuinely new connection already starts with
 * empty tables — which means clearing here could only ever destroy state belonging to the *same*
 * socket. This game re-authenticates on the same socket during a channel switch without re-spawning
 * objects that are already spawned, so clearing left every rpcLink on those objects dead until the
 * next real map change.
 *
 * Re-authentications can arrive back-to-back (observed in practice as bursts of several within
 * seconds, e.g. entering or moving through instanced content) before any fresh registration has a
 * chance to repopulate `links`/`components`. Merging into the existing quarantine — rather than
 * replacing it — means a second or third re-auth in that window can't wipe out a still-useful
 * earlier generation with an as-yet-empty one. Freshly quarantined entries win on key collision;
 * `removeObjectLinks`/`removeObjectComponents` (on spawn/despawn) remain the real eviction path so
 * this doesn't grow unbounded, and the signature/liveness checks in `messages.ts` still guard
 * against trusting a quarantined entry whose link id has since been reallocated.
 */
function quarantineConnectionState(state: ConnectionState): void {
  for (const [linkId, registration] of state.links) {
    state.staleLinks.set(linkId, registration);
  }
  for (const [key, typeName] of state.components) {
    state.staleComponents.set(key, typeName);
  }
  state.links = new Map();
  state.components = new Map();
}

function removeObjectLinks(state: ConnectionState, objectId: number): void {
  for (const links of [state.links, state.staleLinks]) {
    for (const [linkId, registration] of links) {
      if (registration.objectId === objectId) links.delete(linkId);
    }
  }
}

function removeObjectComponents(state: ConnectionState, objectId: number): void {
  const prefix = `${objectId}:`;
  for (const components of [state.components, state.staleComponents]) {
    for (const key of components.keys()) {
      if (key.startsWith(prefix)) components.delete(key);
    }
  }
}
