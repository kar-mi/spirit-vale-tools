import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetDecodeOptions,
  FishNetPacketName,
  FishNetRpcDefinition,
  FishNetRpcMap,
  FishNetRpcPacketName,
  FishNetRpcParameter,
  FishNetRpcResolution,
  FishNetRpcSymbol,
  FishNetWireCodec,
} from "./types.ts";

const PACKET_NAMES = new Map<number, FishNetPacketName>([
  [0, "unset"],
  [1, "authenticated"],
  [2, "split"],
  [3, "objectSpawn"],
  [4, "objectDespawn"],
  [5, "predictedSpawnResult"],
  [7, "syncType"],
  [8, "serverRpc"],
  [9, "observersRpc"],
  [10, "targetRpc"],
  [11, "ownershipChange"],
  [12, "broadcast"],
  [13, "bulkSpawnOrDespawn"],
  [14, "pingPong"],
  [15, "replicate"],
  [16, "reconcile"],
  [17, "disconnect"],
  [18, "timingUpdate"],
  [19, "unused2"],
  [20, "stateUpdate"],
  [21, "version"],
]);

/** The first value after the highest fixed PacketId in the observed FishNet build. */
const STARTING_RPC_LINK_ID = 22;
const RPC_PACKET_NAMES = new Set<FishNetPacketName>(["serverRpc", "observersRpc", "targetRpc"]);
const LINKED_PACKET_NAMES = new Map<number, FishNetRpcPacketName>([
  [9, "observersRpc"],
  [10, "targetRpc"],
  [16, "reconcile"],
]);

interface RpcLinkRegistration {
  objectId: number;
  componentIndex: number;
  rpcHash: number;
  packetName: FishNetRpcPacketName;
  networkBehaviourType?: string;
}

interface ConnectionState {
  links: Map<number, RpcLinkRegistration>;
  components: Map<string, string>;
}

interface SplitState {
  expected: number;
  chunks: Buffer[];
  sequences: Set<number>;
}

interface ParsedMessage {
  packet: DecodedFishNetPacket;
  end: number;
  stop: boolean;
  registrations?: Array<[number, RpcLinkRegistration]>;
  componentBindings?: Array<[string, string]>;
}

interface SpawnCandidate {
  end: number;
  objectId: number;
  registrations: Array<[number, RpcLinkRegistration]>;
  componentBindings: Array<[string, string]>;
  spawnType: "scene" | "instantiated" | "predicted";
  collectionId: number;
  prefabId?: number;
  sceneId?: bigint;
  nested: boolean;
}

interface RpcLookup {
  resolution: FishNetRpcResolution;
  wireHash?: number;
  methodName?: string;
  parameters?: FishNetRpcParameter[];
}

export class FishNetProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FishNetProtocolError";
  }
}

/**
 * Decodes one FishNet message with its transport tick. This strict, pure API is
 * retained for callers which do not need bundle or session state.
 */
export function decodeFishNetPayload(
  payload: Buffer,
  options: { reliable: boolean; rpcMap?: FishNetRpcMap } = { reliable: false },
): DecodedFishNetPacket {
  if (payload.length < 6) {
    throw new FishNetProtocolError(`FishNet payload needs a 4-byte tick and 2-byte packet id; received ${payload.length} bytes`);
  }

  const tick = payload.readUInt32LE(0);
  const packetId = payload.readUInt16LE(4);
  const packetName = classifyPacket(packetId);
  const decoded: DecodedFishNetPacket = {
    tick,
    packetId,
    packetName,
    raw: payload,
    payload: payload.subarray(6),
  };
  if (!RPC_PACKET_NAMES.has(packetName)) return decoded;

  let offset = 6;
  const objectId = readSignedPackedWhole(payload, offset);
  offset = objectId.nextOffset;
  requireBytes(payload, offset, 2, "network behaviour header");
  const spawned = payload[offset] !== 0;
  offset += 1;
  decoded.objectId = objectId.value;
  decoded.networkBehaviourIndex = payload[offset];
  offset += 1;
  if (!spawned) throw new FishNetProtocolError("RPC network object header did not identify a spawned object");

  if (options.reliable) {
    const length = readSignedPackedWhole(payload, offset);
    offset = length.nextOffset;
    if (length.value < 1 || length.value > payload.length - offset) {
      throw new FishNetProtocolError(`RPC payload length ${length.value} exceeds ${payload.length - offset} remaining bytes`);
    }
    decoded.rpcPayloadLength = length.value;
  }

  requireBytes(payload, offset, 1, "RPC hash");
  const hash8 = payload.readUInt8(offset);
  decoded.rpcHash = hash8;
  if (payload.length - offset >= 2) decoded.rpcHash16Candidate = payload.readUInt16LE(offset);

  const lookup = lookupRpc(options.rpcMap, undefined, packetName as FishNetRpcPacketName, hash8, decoded.rpcHash16Candidate);
  const wireHash = lookup.wireHash;
  if (wireHash !== undefined) decoded.rpcHash = wireHash;
  const hashBytes = wireHash !== undefined && wireHash > 0xff ? 2 : 1;
  decoded.payload = payload.subarray(offset + hashBytes);
  applyRpcLookup(decoded, lookup);
  return decoded;
}

/** Decodes all safely-delimited messages in one FishNet transport payload. */
export function decodeFishNetBundle(
  payload: Buffer,
  options: FishNetDecodeOptions = { reliable: false },
): DecodedFishNetPacket[] {
  return new FishNetSessionDecoder(options.rpcMap).decode(payload, options);
}

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
    let count;
    try {
      count = readSignedPackedWhole(payload, 6);
    } catch {
      return [opaquePacket(payload, 4, tick, 0, "split")];
    }
    if (count.value < 1 || count.value > 65_535) return [opaquePacket(payload, 4, tick, 0, "split")];

    const splitKey = `${connectionKey}\u0000${options.direction ?? "unknown"}\u0000${options.channel ?? (options.reliable ? 0 : 1)}`;
    let split = this.splits.get(splitKey);
    if (!split || split.expected !== count.value) {
      split = { expected: count.value, chunks: [], sequences: new Set() };
      this.splits.set(splitKey, split);
    }

    if (options.sequence !== undefined && split.sequences.has(options.sequence)) return [];
    if (options.sequence !== undefined) split.sequences.add(options.sequence);
    split.chunks.push(payload.subarray(count.nextOffset));
    if (split.chunks.length < split.expected) return [];

    this.splits.delete(splitKey);
    const reassembled = Buffer.concat(split.chunks.slice(0, split.expected));
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

function parseMessage(
  buffer: Buffer,
  start: number,
  tick: number,
  bundleIndex: number,
  state: ConnectionState,
  options: FishNetDecodeOptions,
): ParsedMessage {
  const packetId = buffer.readUInt16LE(start);
  const packetName = classifyPacket(packetId);
  const dataStart = start + 2;

  if (packetName === "rpcLink") return parseRpcLink(buffer, start, dataStart, tick, bundleIndex, packetId, state, options);
  if (RPC_PACKET_NAMES.has(packetName)) {
    return parseFixedRpc(buffer, start, dataStart, tick, bundleIndex, packetId, packetName, state, options);
  }
  if (packetName === "objectSpawn") {
    const candidate = parseObjectSpawn(buffer, dataStart, options.rpcMap);
    if (candidate) {
      const packet = basePacket(buffer, start, candidate.end, tick, bundleIndex, packetId, packetName);
      packet.objectId = candidate.objectId;
      packet.spawnType = candidate.spawnType;
      packet.spawnCollectionId = candidate.collectionId;
      packet.spawnPrefabId = candidate.prefabId;
      packet.spawnSceneId = candidate.sceneId;
      packet.spawnNested = candidate.nested;
      packet.rpcLinkRegistrations = candidate.registrations.map(([linkId, registration]) => ({ linkId, ...registration }));
      return {
        packet,
        end: candidate.end,
        stop: false,
        registrations: candidate.registrations,
        componentBindings: candidate.componentBindings,
      };
    }
    return { packet: opaquePacket(buffer, start, tick, bundleIndex, packetName), end: buffer.length, stop: true };
  }

  try {
    let end: number | undefined;
    let objectId: number | undefined;
    switch (packetName) {
      case "objectDespawn": {
        const object = readSignedPackedWhole(buffer, dataStart);
        requireBytes(buffer, object.nextOffset, 1, "despawn type");
        objectId = object.value;
        end = object.nextOffset + 1;
        break;
      }
      case "authenticated":
        end = readSignedPackedWhole(buffer, dataStart).nextOffset;
        break;
      case "predictedSpawnResult": {
        requireBytes(buffer, dataStart, 1, "predicted spawn result");
        const used = readSignedPackedWhole(buffer, dataStart + 1);
        end = readSignedPackedWhole(buffer, used.nextOffset).nextOffset;
        break;
      }
      case "syncType": {
        const header = readNetworkBehaviourHeader(buffer, dataStart);
        requireBytes(buffer, header.nextOffset, 4, "SyncType length");
        const length = buffer.readUInt32LE(header.nextOffset);
        end = checkedEnd(buffer, header.nextOffset + 4, length);
        objectId = header.objectId;
        const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, packetName);
        packet.objectId = objectId;
        packet.networkBehaviourIndex = header.componentIndex;
        packet.networkBehaviourType = state.components.get(componentKey(objectId, header.componentIndex));
        packet.syncPayload = buffer.subarray(header.nextOffset + 4, end);
        packet.payload = packet.syncPayload;
        if (packet.syncPayload.length > 0) {
          packet.syncIndex = packet.syncPayload.readUInt8(0);
          const sync = findSyncType(options.rpcMap, packet.networkBehaviourType, packet.syncIndex);
          if (sync) packet.syncName = sync.name;
        }
        return { packet, end, stop: false };
      }
      case "broadcast": {
        requireBytes(buffer, dataStart, 2, "broadcast hash");
        const length = readSignedPackedWhole(buffer, dataStart + 2);
        if (length.value < 0) throw new FishNetProtocolError("negative broadcast length");
        end = checkedEnd(buffer, length.nextOffset, length.value);
        const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, packetName);
        packet.broadcastHash = buffer.readUInt16LE(dataStart);
        packet.payload = buffer.subarray(length.nextOffset, end);
        const broadcast = findBroadcast(options.rpcMap, packet.broadcastHash);
        if (broadcast) {
          packet.broadcastName = broadcast.typeName;
          applyDecodedFields(packet, broadcast.fields);
        }
        return { packet, end, stop: false };
      }
      case "pingPong":
      case "timingUpdate":
        end = checkedEnd(buffer, dataStart, 4);
        break;
      case "version":
        end = checkedEnd(buffer, dataStart, 1);
        break;
      case "ownershipChange": {
        const object = readNetworkObjectReference(buffer, dataStart);
        end = readSignedPackedWhole(buffer, object.nextOffset).nextOffset;
        objectId = object.objectId;
        break;
      }
      case "disconnect":
        end = buffer.length;
        break;
      default:
        break;
    }

    if (end !== undefined) {
      const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, packetName);
      if (objectId !== undefined) packet.objectId = objectId;
      return { packet, end, stop: packetName === "disconnect" };
    }
  } catch {
    // The packet remains useful as opaque data; an invalid boundary must not
    // consume bytes as another guessed message.
  }
  return { packet: opaquePacket(buffer, start, tick, bundleIndex, packetName), end: buffer.length, stop: true };
}

function parseRpcLink(
  buffer: Buffer,
  start: number,
  dataStart: number,
  tick: number,
  bundleIndex: number,
  packetId: number,
  state: ConnectionState,
  options: FishNetDecodeOptions,
): ParsedMessage {
  let payloadStart = dataStart;
  let end = buffer.length;
  let stop = !options.reliable;
  if (options.reliable) {
    try {
      const length = readSignedPackedWhole(buffer, dataStart);
      if (length.value < 0) throw new FishNetProtocolError("negative RPC Link length");
      payloadStart = length.nextOffset;
      end = checkedEnd(buffer, payloadStart, length.value);
      stop = false;
    } catch {
      return { packet: unresolvedLinkPacket(buffer, start, tick, bundleIndex, packetId), end, stop: true };
    }
  }

  const registration = state.links.get(packetId);
  const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, "rpcLink");
  packet.linkId = packetId;
  packet.linkResolved = registration !== undefined;
  packet.payload = buffer.subarray(payloadStart, end);
  if (registration) {
    packet.linkedPacketName = registration.packetName;
    packet.registeredObjectId = registration.objectId;
    packet.registeredComponentIndex = registration.componentIndex;
    packet.registeredRpcHash = registration.rpcHash;
    packet.objectId = registration.objectId;
    packet.networkBehaviourIndex = registration.componentIndex;
    packet.rpcHash = registration.rpcHash;
    packet.networkBehaviourType = registration.networkBehaviourType
      ?? state.components.get(componentKey(registration.objectId, registration.componentIndex));
    const lookup = lookupRpc(
      options.rpcMap,
      packet.networkBehaviourType,
      registration.packetName,
      registration.rpcHash,
      undefined,
    );
    applyRpcLookup(packet, lookup);
  }
  return { packet, end, stop };
}

function parseFixedRpc(
  buffer: Buffer,
  start: number,
  dataStart: number,
  tick: number,
  bundleIndex: number,
  packetId: number,
  packetName: FishNetPacketName,
  state: ConnectionState,
  options: FishNetDecodeOptions,
): ParsedMessage {
  try {
    const header = readNetworkBehaviourHeader(buffer, dataStart);
    let rpcStart = header.nextOffset;
    let end = buffer.length;
    let stop = !options.reliable;
    let rpcLength: number | undefined;
    if (options.reliable) {
      const length = readSignedPackedWhole(buffer, rpcStart);
      if (length.value < 1) throw new FishNetProtocolError("invalid RPC length");
      rpcStart = length.nextOffset;
      end = checkedEnd(buffer, rpcStart, length.value);
      rpcLength = length.value;
      stop = false;
    }
    requireBytes(buffer, rpcStart, 1, "RPC hash");
    const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, packetName);
    packet.objectId = header.objectId;
    packet.networkBehaviourIndex = header.componentIndex;
    const key = componentKey(header.objectId, header.componentIndex);
    packet.networkBehaviourType = state.components.get(key);
    if (rpcLength !== undefined) packet.rpcPayloadLength = rpcLength;
    const hash8 = buffer.readUInt8(rpcStart);
    const hash16 = end - rpcStart >= 2 ? buffer.readUInt16LE(rpcStart) : undefined;
    packet.rpcHash = hash8;
    if (hash16 !== undefined) packet.rpcHash16Candidate = hash16;
    const inferredType = packet.networkBehaviourType === undefined
      ? inferBehaviourType(options.rpcMap, packetName as FishNetRpcPacketName, hash8, hash16)
      : undefined;
    if (inferredType !== undefined) packet.networkBehaviourType = inferredType;
    const lookup = lookupRpc(
      options.rpcMap,
      packet.networkBehaviourType,
      packetName as FishNetRpcPacketName,
      hash8,
      hash16,
    );
    const wireHash = lookup.wireHash;
    if (wireHash !== undefined) packet.rpcHash = wireHash;
    packet.payload = buffer.subarray(rpcStart + (wireHash !== undefined && wireHash > 0xff ? 2 : 1), end);
    applyRpcLookup(packet, lookup);
    return {
      packet,
      end,
      stop,
      componentBindings: inferredType === undefined ? undefined : [[key, inferredType]],
    };
  } catch {
    return { packet: opaquePacket(buffer, start, tick, bundleIndex, packetName), end: buffer.length, stop: true };
  }
}

function parseObjectSpawn(buffer: Buffer, start: number, map: FishNetRpcMap | undefined): SpawnCandidate | undefined {
  try {
    requireBytes(buffer, start, 1, "spawn flags");
    const flags = buffer[start] ?? 0;
    if ((flags & ~0x1f) !== 0) return undefined;
    const kindBits = flags & 0x0e;
    if (kindBits !== 0x02 && kindBits !== 0x04 && kindBits !== 0x08) return undefined;
    const spawnType = kindBits === 0x02 ? "scene" : kindBits === 0x04 ? "instantiated" : "predicted";
    const nested = (flags & 0x01) !== 0;
    let offset = start + 1;

    if (nested) {
      requireBytes(buffer, offset, 1, "nested object component");
      offset += 1;
      const parent = readNetworkObjectReference(buffer, offset);
      offset = parent.nextOffset;
      requireBytes(buffer, offset, 1, "nested parent component");
      offset += 1;
    }

    const object = readSignedPackedWhole(buffer, offset);
    if (object.value < 0) return undefined;
    offset = object.nextOffset;
    requireBytes(buffer, offset, 2, "spawn collection id");
    const collectionId = buffer.readUInt16LE(offset);
    offset += 2;
    offset = readSignedPackedWhole(buffer, offset).nextOffset; // initialize order
    offset = readSignedPackedWhole(buffer, offset).nextOffset; // owner connection
    requireBytes(buffer, offset, 1, "transform flags");
    const transformFlags = buffer[offset] ?? 0;
    if ((transformFlags & ~0x07) !== 0) return undefined;
    offset += 1;
    if ((transformFlags & 0x01) !== 0) offset = checkedEnd(buffer, offset, 12);

    const rotations = (transformFlags & 0x02) !== 0 ? [8, 4, 16] : [0];
    const candidates: SpawnCandidate[] = [];
    for (const rotationBytes of rotations) {
      try {
        let candidateOffset = checkedEnd(buffer, offset, rotationBytes);
        if ((transformFlags & 0x04) !== 0) candidateOffset = checkedEnd(buffer, candidateOffset, 12);
        let sceneId: bigint | undefined;
        let prefabId: number | undefined;
        if ((flags & 0x02) !== 0) {
          requireBytes(buffer, candidateOffset, 8, "spawn scene id");
          sceneId = buffer.readBigUInt64LE(candidateOffset);
          candidateOffset += 8;
        } else {
          const prefab = readSignedPackedWhole(buffer, candidateOffset);
          if (prefab.value < 0) continue;
          prefabId = prefab.value;
          candidateOffset = prefab.nextOffset;
        }

        requireBytes(buffer, candidateOffset, 4, "spawn payload length");
        const payloadLength = buffer.readUInt32LE(candidateOffset);
        candidateOffset = checkedEnd(buffer, candidateOffset + 4, payloadLength);

        requireBytes(buffer, candidateOffset, 2, "RPC Link segment length");
        const linksLength = buffer.readUInt16LE(candidateOffset);
        const linksStart = candidateOffset + 2;
        const linksEnd = checkedEnd(buffer, linksStart, linksLength);
        const registrations = parseLinkRegistrations(buffer, linksStart, linksEnd, object.value);
        if (!registrations) continue;
        const componentBindings = bindBehaviourTypes(registrations, map);
        candidateOffset = linksEnd;

        requireBytes(buffer, candidateOffset, 4, "spawn SyncType length");
        const syncLength = buffer.readUInt32LE(candidateOffset);
        candidateOffset = checkedEnd(buffer, candidateOffset + 4, syncLength);
        if (!isPlausibleBoundary(buffer, candidateOffset)) continue;
        candidates.push({
          end: candidateOffset,
          objectId: object.value,
          registrations,
          componentBindings,
          spawnType,
          collectionId,
          prefabId,
          sceneId,
          nested,
        });
      } catch {
        // Try the next supported quaternion packing width.
      }
    }

    const unique = new Map<string, SpawnCandidate>();
    for (const candidate of candidates) {
      const links = candidate.registrations.map(([id, value]) => `${id}:${value.componentIndex}:${value.rpcHash}:${value.packetName}`).join(",");
      unique.set(`${candidate.end}|${links}`, candidate);
    }
    return unique.size === 1 ? unique.values().next().value : undefined;
  } catch {
    return undefined;
  }
}

function parseLinkRegistrations(
  buffer: Buffer,
  start: number,
  end: number,
  objectId: number,
): Array<[number, RpcLinkRegistration]> | undefined {
  const registrations: Array<[number, RpcLinkRegistration]> = [];
  const seen = new Set<number>();
  let offset = start;
  while (offset < end) {
    if (end - offset < 3) return undefined;
    const componentIndex = buffer[offset] ?? 0;
    const count = buffer.readUInt16LE(offset + 1);
    if (count < 1 || count > Math.floor((end - offset - 3) / 6)) return undefined;
    offset += 3;
    for (let index = 0; index < count; index += 1) {
      if (end - offset < 6) return undefined;
      const linkId = buffer.readUInt16LE(offset);
      const rpcHash = buffer.readUInt16LE(offset + 2);
      const packetName = LINKED_PACKET_NAMES.get(buffer.readUInt16LE(offset + 4));
      if (linkId < STARTING_RPC_LINK_ID || !packetName || seen.has(linkId)) return undefined;
      seen.add(linkId);
      registrations.push([linkId, { objectId, componentIndex, rpcHash, packetName }]);
      offset += 6;
    }
  }
  return offset === end ? registrations : undefined;
}

function readNetworkBehaviourHeader(buffer: Buffer, start: number): {
  objectId: number;
  componentIndex: number;
  nextOffset: number;
} {
  const reference = readNetworkObjectReference(buffer, start);
  if (!reference.spawned) throw new FishNetProtocolError("RPC object is not spawned");
  requireBytes(buffer, reference.nextOffset, 1, "network behaviour component");
  return {
    objectId: reference.objectId,
    componentIndex: buffer[reference.nextOffset] ?? 0,
    nextOffset: reference.nextOffset + 1,
  };
}

function readNetworkObjectReference(buffer: Buffer, start: number): {
  objectId: number;
  spawned: boolean;
  nextOffset: number;
} {
  const object = readSignedPackedWhole(buffer, start);
  if (object.value === -1) return { objectId: object.value, spawned: false, nextOffset: object.nextOffset };
  requireBytes(buffer, object.nextOffset, 1, "network object spawned flag");
  const flag = buffer[object.nextOffset];
  if (flag !== 0 && flag !== 1) throw new FishNetProtocolError("invalid network object spawned flag");
  return { objectId: object.value, spawned: flag === 1, nextOffset: object.nextOffset + 1 };
}

function basePacket(
  buffer: Buffer,
  start: number,
  end: number,
  tick: number,
  bundleIndex: number,
  packetId: number,
  packetName: FishNetPacketName,
): DecodedFishNetPacket {
  return {
    tick,
    packetId,
    packetName,
    bundleIndex,
    raw: buffer.subarray(start, end),
    payload: buffer.subarray(start + 2, end),
  };
}

function opaquePacket(
  buffer: Buffer,
  start: number,
  tick: number,
  bundleIndex: number,
  packetName = classifyPacket(buffer.readUInt16LE(start)),
): DecodedFishNetPacket {
  return basePacket(buffer, start, buffer.length, tick, bundleIndex, buffer.readUInt16LE(start), packetName);
}

function unresolvedLinkPacket(buffer: Buffer, start: number, tick: number, bundleIndex: number, packetId: number): DecodedFishNetPacket {
  const packet = opaquePacket(buffer, start, tick, bundleIndex, "rpcLink");
  packet.linkId = packetId;
  packet.linkResolved = false;
  return packet;
}

function classifyPacket(packetId: number): FishNetPacketName {
  return PACKET_NAMES.get(packetId) ?? (packetId >= STARTING_RPC_LINK_ID ? "rpcLink" : "unknown");
}

function isPlausibleBoundary(buffer: Buffer, offset: number): boolean {
  if (offset === buffer.length) return true;
  if (buffer.length - offset < 2) return false;
  return classifyPacket(buffer.readUInt16LE(offset)) !== "unknown";
}

function checkedEnd(buffer: Buffer, start: number, length: number): number {
  if (!Number.isSafeInteger(length) || length < 0 || length > buffer.length - start) {
    throw new FishNetProtocolError(`length ${length} exceeds ${buffer.length - start} remaining bytes`);
  }
  return start + length;
}

function removeObjectLinks(links: Map<number, RpcLinkRegistration>, objectId: number): void {
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

function componentKey(objectId: number, componentIndex: number): string {
  return `${objectId}:${componentIndex}`;
}

function bindBehaviourTypes(
  registrations: Array<[number, RpcLinkRegistration]>,
  map: FishNetRpcMap | undefined,
): Array<[string, string]> {
  if (!map || map.schemaVersion !== 2) return [];
  const byComponent = new Map<string, RpcLinkRegistration[]>();
  for (const [, registration] of registrations) {
    const key = componentKey(registration.objectId, registration.componentIndex);
    const values = byComponent.get(key) ?? [];
    values.push(registration);
    byComponent.set(key, values);
  }

  const bindings: Array<[string, string]> = [];
  for (const [key, values] of byComponent) {
    const fingerprint = rpcFingerprint(values.map(({ rpcHash, packetName }) => ({ wireHash: rpcHash, packetKind: packetName })));
    const matches = map.behaviours.filter((behaviour) => {
      const outbound = behaviour.rpcs.filter(({ packetKind }) => packetKind !== "serverRpc");
      return rpcFingerprint(outbound) === fingerprint;
    });
    if (matches.length !== 1 || !matches[0]) continue;
    const typeName = matches[0].typeName;
    for (const value of values) value.networkBehaviourType = typeName;
    bindings.push([key, typeName]);
  }
  return bindings;
}

function rpcFingerprint(values: Array<{ wireHash: number; packetKind: FishNetRpcPacketName }>): string {
  return values.map(({ wireHash, packetKind }) => `${wireHash}:${packetKind}`).sort().join(",");
}

function inferBehaviourType(
  map: FishNetRpcMap | undefined,
  packetName: FishNetRpcPacketName,
  hash8: number,
  hash16: number | undefined,
): string | undefined {
  if (!map || map.schemaVersion !== 2) return undefined;
  const hashes = new Set([hash8, ...(hash16 === undefined ? [] : [hash16])]);
  const matches = map.behaviours.filter(({ rpcs }) => {
    return rpcs.some((rpc) => rpc.packetKind === packetName && hashes.has(rpc.wireHash));
  });
  return matches.length === 1 ? matches[0]?.typeName : undefined;
}

function lookupRpc(
  map: FishNetRpcMap | undefined,
  networkBehaviourType: string | undefined,
  packetName: FishNetRpcPacketName,
  hash8: number,
  hash16: number | undefined,
): RpcLookup {
  if (!map) return { resolution: "unresolved" };
  const hashes = new Set([hash8, ...(hash16 === undefined ? [] : [hash16])]);
  if (map.schemaVersion === 1) {
    const matches = map.symbols.filter((symbol) => symbol.wireHash !== undefined
      && hashes.has(symbol.wireHash)
      && (!symbol.packetKinds || symbol.packetKinds.includes(packetName as "serverRpc" | "observersRpc" | "targetRpc")));
    return legacyLookup(matches);
  }

  const behaviours = networkBehaviourType
    ? map.behaviours.filter(({ typeName }) => typeName === networkBehaviourType)
    : map.behaviours;
  const matches = behaviours.flatMap(({ rpcs }) => rpcs.filter((rpc) => {
    return rpc.packetKind === packetName && hashes.has(rpc.wireHash);
  }));
  return definitionLookup(matches);
}

function legacyLookup(matches: FishNetRpcSymbol[]): RpcLookup {
  const wireHashes = new Set(matches.flatMap(({ wireHash }) => wireHash === undefined ? [] : [wireHash]));
  if (matches.length === 1 && matches[0]) {
    return { resolution: "verified", wireHash: matches[0].wireHash, methodName: matches[0].methodName };
  }
  return {
    resolution: matches.length > 1 ? "ambiguous" : "unresolved",
    wireHash: wireHashes.size === 1 ? wireHashes.values().next().value : undefined,
  };
}

function definitionLookup(matches: FishNetRpcDefinition[]): RpcLookup {
  const wireHashes = new Set(matches.map(({ wireHash }) => wireHash));
  if (matches.length === 1 && matches[0]) {
    return {
      resolution: "verified",
      wireHash: matches[0].wireHash,
      methodName: matches[0].methodName,
      parameters: matches[0].parameters,
    };
  }
  return {
    resolution: matches.length > 1 ? "ambiguous" : "unresolved",
    wireHash: wireHashes.size === 1 ? wireHashes.values().next().value : undefined,
  };
}

function applyRpcLookup(packet: DecodedFishNetPacket, lookup: RpcLookup): void {
  packet.rpcResolution = lookup.resolution;
  if (lookup.resolution !== "verified") return;
  packet.rpcName = lookup.methodName;
  applyDecodedFields(packet, lookup.parameters);
}

function findBroadcast(map: FishNetRpcMap | undefined, wireHash: number) {
  if (!map || map.schemaVersion !== 2) return undefined;
  const matches = (map.broadcasts ?? []).filter((broadcast) => broadcast.wireHash === wireHash);
  return matches.length === 1 ? matches[0] : undefined;
}

function findSyncType(map: FishNetRpcMap | undefined, typeName: string | undefined, index: number) {
  if (!map || map.schemaVersion !== 2 || !typeName) return undefined;
  const matches = map.behaviours
    .filter((behaviour) => behaviour.typeName === typeName)
    .flatMap((behaviour) => behaviour.syncTypes ?? [])
    .filter((sync) => sync.index === index);
  return matches.length === 1 ? matches[0] : undefined;
}

function applyDecodedFields(packet: DecodedFishNetPacket, parameters: FishNetRpcParameter[] | undefined): void {
  if (!parameters || parameters.length === 0) return;
  const fields: FishNetDecodedField[] = [];
  const decoded = decodeParameters(packet.payload, 0, parameters, "", fields);
  if (fields.length > 0) packet.decodedFields = fields;
  if (decoded.offset < packet.payload.length) packet.undecodedPayload = packet.payload.subarray(decoded.offset);
}

function decodeParameters(
  buffer: Buffer,
  start: number,
  parameters: FishNetRpcParameter[],
  prefix: string,
  fields: FishNetDecodedField[],
): { offset: number; complete: boolean } {
  let offset = start;
  for (const parameter of parameters) {
    const name = prefix.length === 0 ? parameter.name : `${prefix}.${parameter.name}`;
    if (parameter.codec) {
      try {
        const decoded = decodeField(buffer, offset, parameter.codec);
        fields.push({ name, typeName: parameter.typeName, codec: parameter.codec, value: decoded.value });
        offset = decoded.nextOffset;
      } catch {
        return { offset, complete: false };
      }
      continue;
    }
    if (!parameter.fields || parameter.fields.length === 0) return { offset, complete: false };
    const nested = decodeParameters(buffer, offset, parameter.fields, name, fields);
    offset = nested.offset;
    if (!nested.complete) return { offset, complete: false };
  }
  return { offset, complete: true };
}

function decodeField(
  buffer: Buffer,
  offset: number,
  codec: FishNetWireCodec,
): { value: boolean | number | string | number[]; nextOffset: number } {
  const fixed = (count: number): number => {
    requireBytes(buffer, offset, count, codec);
    return offset + count;
  };
  switch (codec) {
    case "boolean": {
      const nextOffset = fixed(1);
      const value = buffer[offset];
      if (value !== 0 && value !== 1) throw new FishNetProtocolError("invalid boolean");
      return { value: value === 1, nextOffset };
    }
    case "uint8": return { value: buffer.readUInt8(offset), nextOffset: fixed(1) };
    case "int8": return { value: buffer.readInt8(offset), nextOffset: fixed(1) };
    case "uint16": return { value: buffer.readUInt16LE(offset), nextOffset: fixed(2) };
    case "int16": return { value: buffer.readInt16LE(offset), nextOffset: fixed(2) };
    case "uint32": return { value: buffer.readUInt32LE(offset), nextOffset: fixed(4) };
    case "int32": return { value: buffer.readInt32LE(offset), nextOffset: fixed(4) };
    case "float32": return { value: buffer.readFloatLE(offset), nextOffset: fixed(4) };
    case "float64": return { value: buffer.readDoubleLE(offset), nextOffset: fixed(8) };
    case "packedInt32": return readSignedPackedWhole(buffer, offset);
    case "packedUInt64": {
      const decoded = readUnsignedPackedWhole(buffer, offset);
      return { value: `0x${decoded.value.toString(16)}`, nextOffset: decoded.nextOffset };
    }
    case "stringUtf8Packed": {
      const length = readSignedPackedWhole(buffer, offset);
      if (length.value < 0) throw new FishNetProtocolError("negative string length");
      const nextOffset = checkedEnd(buffer, length.nextOffset, length.value);
      return { value: buffer.toString("utf8", length.nextOffset, nextOffset), nextOffset };
    }
    case "vector2": return decodeFloatVector(buffer, offset, 2);
    case "vector3": return decodeFloatVector(buffer, offset, 3);
    case "vector3IntPacked": {
      const values: number[] = [];
      let nextOffset = offset;
      for (let index = 0; index < 3; index += 1) {
        const decoded = readSignedPackedWhole(buffer, nextOffset);
        values.push(decoded.value);
        nextOffset = decoded.nextOffset;
      }
      return { value: values, nextOffset };
    }
    case "quaternion": return decodeFloatVector(buffer, offset, 4);
  }
}

function decodeFloatVector(buffer: Buffer, offset: number, count: number): { value: number[]; nextOffset: number } {
  requireBytes(buffer, offset, count * 4, "float vector");
  return {
    value: Array.from({ length: count }, (_, index) => buffer.readFloatLE(offset + (index * 4))),
    nextOffset: offset + (count * 4),
  };
}

function readSignedPackedWhole(buffer: Buffer, start: number): { value: number; nextOffset: number } {
  const decoded = readUnsignedPackedWhole(buffer, start);
  const signed = (decoded.value >> 1n) ^ -(decoded.value & 1n);
  const value = Number(signed);
  if (!Number.isSafeInteger(value)) throw new FishNetProtocolError("packed integer exceeds JavaScript's safe range");
  return { value, nextOffset: decoded.nextOffset };
}

function readUnsignedPackedWhole(buffer: Buffer, start: number): { value: bigint; nextOffset: number } {
  let value = 0n;
  let shift = 0n;
  let offset = start;
  while (offset < buffer.length && offset - start < 10) {
    const byte = buffer[offset] ?? 0;
    offset += 1;
    value |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return { value, nextOffset: offset };
    shift += 7n;
  }
  throw new FishNetProtocolError(`unterminated packed integer at byte ${start}`);
}

function requireBytes(buffer: Buffer, offset: number, count: number, description: string): void {
  if (buffer.length - offset < count) {
    throw new FishNetProtocolError(`${description} needs ${count} bytes at byte ${offset}; ${buffer.length - offset} remain`);
  }
}
