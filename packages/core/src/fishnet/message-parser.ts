import { applyDecodedFields } from "./field-decoder.ts";
import {
  basePacket,
  classifyPacket,
  componentKey,
  FishNetProtocolError,
  opaquePacket,
  RPC_PACKET_NAMES,
  unresolvedLinkPacket,
} from "./protocol.ts";
import type { RpcLinkRegistrationState } from "./protocol.ts";
import {
  applyRpcLookup,
  findBroadcast,
  findSyncType,
  inferBehaviourType,
  lookupRpc,
} from "./rpc-resolution.ts";
import { parseObjectSpawn } from "./spawn-parser.ts";
import {
  checkedEnd,
  readNetworkBehaviourHeader,
  readNetworkObjectReference,
  readSignedPackedWhole,
  requireBytes,
} from "./wire-reader.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodeOptions,
  FishNetPacketName,
  FishNetRpcPacketName,
} from "./types.ts";

export interface ConnectionState {
  links: Map<number, RpcLinkRegistrationState>;
  components: Map<string, string>;
}

export interface ParsedMessage {
  packet: DecodedFishNetPacket;
  end: number;
  stop: boolean;
  registrations?: Array<[number, RpcLinkRegistrationState]>;
  componentBindings?: Array<[string, string]>;
}

export function parseMessage(
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
      packet.ownerConnectionId = candidate.ownerConnectionId;
      packet.spawnPrefabId = candidate.prefabId;
      packet.spawnSceneId = candidate.sceneId;
      packet.spawnNested = candidate.nested;
      packet.spawnSyncPayload = candidate.syncPayload;
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
          if (sync) {
            packet.syncName = sync.name;
            const fields = sync.fields ?? (sync.codec
              ? [{ name: sync.name, typeName: sync.typeName, codec: sync.codec }]
              : undefined);
            applyDecodedFields(packet, fields, 1);
          }
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
        const owner = readSignedPackedWhole(buffer, object.nextOffset);
        end = owner.nextOffset;
        objectId = object.objectId;
        const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, packetName);
        packet.objectId = objectId;
        packet.ownerConnectionId = owner.value;
        return { packet, end, stop: false };
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
    // Preserve malformed packets as opaque data without guessing another boundary.
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
    const lookup = lookupRpc(options.rpcMap, packet.networkBehaviourType, registration.packetName, registration.rpcHash, undefined);
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
    const lookup = lookupRpc(options.rpcMap, packet.networkBehaviourType, packetName as FishNetRpcPacketName, hash8, hash16);
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
