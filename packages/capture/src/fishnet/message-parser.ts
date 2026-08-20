import { applyDecodedFields, decodeFieldRun, tryDecodeFields } from "./field-decoder.ts";
import { quaternionYaw } from "./quaternion-compression.ts";
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
  eliminateBoundBehaviourTypes,
  eliminateByPayloadShape,
  findBroadcast,
  findSyncType,
  inferBehaviourType,
  lookupRpc,
  recoverComponentFromPrefabLayouts,
  rejectedByPayload,
} from "./rpc-resolution.ts";
import type { RpcLookup } from "./rpc-resolution.ts";
import { parseObjectSpawn } from "./spawn-parser.ts";
import type { SpawnCandidate } from "./spawn-parser.ts";
import {
  checkedEnd,
  readNetworkBehaviourHeader,
  readNetworkObjectReference,
  readSignedPackedWhole,
  requireBytes,
} from "./wire-reader.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetDecodeOptions,
  FishNetPacketName,
  FishNetRpcPacketName,
  FishNetSpawnSyncEntry,
  FishNetSyncEntry,
} from "./types.ts";

export interface ConnectionState {
  links: Map<number, RpcLinkRegistrationState>;
  components: Map<string, string>;
  /**
   * The link and component tables as they stood before the last `authenticated`/`disconnect`, kept
   * because this game re-authenticates on the same socket during a channel switch *without*
   * re-spawning objects that are already spawned. Registrations are only ever learned from an
   * `objectSpawn`, so dropping them outright leaves every rpcLink on those objects unresolvable
   * until something forces a real respawn. Entries here are suspects, not facts: they are only
   * believed after `corroborateStaleLink` agrees, and any fresh registration or despawn evicts them.
   */
  staleLinks: Map<number, RpcLinkRegistrationState>;
  staleComponents: Map<string, string>;
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
      packet.spawnCustomPayload = candidate.customPayload;
      packet.spawnSyncPayload = candidate.syncPayload;
      packet.spawnSyncEntries = decodeSpawnSyncTypes(candidate, options);
      if (candidate.localPosition) packet.spawnLocalPosition = candidate.localPosition;
      if (candidate.localRotation) {
        packet.spawnLocalRotation = candidate.localRotation;
        packet.spawnHeading = quaternionYaw(candidate.localRotation);
      }
      if (candidate.localScale) packet.spawnLocalScale = candidate.localScale;
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
        // Recovery deliberately does not teach the connection, unlike the fixed-RPC path. That path
        // gates on `rejectedByPayload` before writing a binding, and a SyncType packet has no
        // equivalent check to offer, so a binding learned here would enter `state.components` on
        // weaker evidence and then feed every later elimination on the object. Repeating the
        // recovery costs a scan of the component map; it measured at a few percent of decode time.
        packet.networkBehaviourType = state.components.get(componentKey(objectId, header.componentIndex))
          ?? recoverComponentFromPrefabLayouts(options.rpcMap, state.components, objectId, header.componentIndex);
        packet.syncPayload = buffer.subarray(header.nextOffset + 4, end);
        packet.payload = packet.syncPayload;
        if (packet.syncPayload.length > 0) {
          packet.syncIndex = packet.syncPayload.readUInt8(0);
          applySyncTypeEntries(packet, options);
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

  const packet = basePacket(buffer, start, end, tick, bundleIndex, packetId, "rpcLink");
  packet.linkId = packetId;
  packet.payload = buffer.subarray(payloadStart, end);

  const registration = state.links.get(packetId);
  const stale = registration === undefined ? state.staleLinks.get(packetId) : undefined;
  const resolved = registration ?? stale;
  packet.linkResolved = resolved !== undefined;
  if (!resolved) return { packet, end, stop };

  const behaviourType = resolved.networkBehaviourType
    ?? state.components.get(componentKey(resolved.objectId, resolved.componentIndex))
    ?? state.staleComponents.get(componentKey(resolved.objectId, resolved.componentIndex));
  const lookup = lookupRpc(options.rpcMap, behaviourType, resolved.packetName, resolved.rpcHash, undefined);
  // A quarantined registration is only a suspect: believing it blindly would misattribute traffic
  // outright if the server had reallocated link ids on this socket, which is worse than the gap it
  // is meant to close.
  if (stale && !corroborateStaleLink(lookup, packet.payload, state, resolved)) {
    packet.linkResolved = false;
    return { packet, end, stop };
  }

  packet.linkedPacketName = resolved.packetName;
  packet.registeredObjectId = resolved.objectId;
  packet.registeredComponentIndex = resolved.componentIndex;
  packet.registeredRpcHash = resolved.rpcHash;
  packet.objectId = resolved.objectId;
  packet.networkBehaviourIndex = resolved.componentIndex;
  packet.rpcHash = resolved.rpcHash;
  packet.networkBehaviourType = behaviourType;
  applyRpcLookup(packet, lookup);
  if (!stale) return { packet, end, stop };

  // Corroborated once is enough: promote it so later packets on this link cost a plain map hit, and
  // report the weaker provenance.
  if (packet.rpcResolution === "verified") packet.rpcResolution = "recovered";
  return { packet, end, stop, registrations: [[packetId, resolved]] };
}

/**
 * Decides whether a quarantined link registration is trustworthy for this payload.
 *
 * The signature check is the strong one — an exact-length decode against the resolved method's
 * parameters. A reallocated link id would almost certainly resolve to a method whose parameters do
 * not consume these bytes exactly; the same discriminator found zero false positives across 385,742
 * captured payloads. Signatures this decoder cannot evaluate (array parameters, most notably
 * `CalibrateSummons_T`) fall back to liveness: the registration's object must still be demonstrably
 * present, since a reallocation implies the old object is gone.
 */
function corroborateStaleLink(
  lookup: RpcLookup,
  payload: Buffer,
  state: ConnectionState,
  registration: RpcLinkRegistrationState,
): boolean {
  if (lookup.resolution !== "verified") return false;
  const fit = tryDecodeFields(payload, lookup.parameters);
  if (!fit.undecodable) return fit.complete && fit.consumed === payload.length;
  const prefix = `${registration.objectId}:`;
  for (const key of state.components.keys()) if (key.startsWith(prefix)) return true;
  return false;
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
      ? recoverComponentFromPrefabLayouts(options.rpcMap, state.components, header.objectId, header.componentIndex)
        ?? inferBehaviourType(options.rpcMap, packetName as FishNetRpcPacketName, hash8, hash16)
      : undefined;
    if (inferredType !== undefined) packet.networkBehaviourType = inferredType;
    let lookup = lookupRpc(options.rpcMap, packet.networkBehaviourType, packetName as FishNetRpcPacketName, hash8, hash16);
    // Some RPCs share the same wire hash and packet kind across behaviour types (e.g.
    // HealthComponent.Recover_C vs. SkillsComponent.Recover_C) and can't be told apart by
    // signature alone. If every candidate but one is already bound to a different component
    // index on this same object, the object-has-one-instance-per-type invariant picks the
    // remaining candidate, even without ever having resolved this exact component before.
    let eliminatedType: string | undefined;
    if (lookup.resolution === "ambiguous" && lookup.ambiguousBehaviourTypes) {
      eliminatedType = eliminateBoundBehaviourTypes(state.components, header.objectId, header.componentIndex, lookup.ambiguousBehaviourTypes);
      // With nothing bound on this object there is nothing to eliminate against - the norm for an
      // object whose spawn was never captured - so fall back to asking which candidate signature
      // the payload actually fits.
      eliminatedType ??= eliminateByPayloadShape(
        options.rpcMap,
        lookup.ambiguousBehaviourTypes,
        packetName as FishNetRpcPacketName,
        hash8,
        hash16,
        buffer.subarray(rpcStart + (lookup.wireHash !== undefined && lookup.wireHash > 0xff ? 2 : 1), end),
      );
      if (eliminatedType !== undefined) {
        packet.networkBehaviourType = eliminatedType;
        lookup = lookupRpc(options.rpcMap, eliminatedType, packetName as FishNetRpcPacketName, hash8, hash16);
      }
    }
    const wireHash = lookup.wireHash;
    if (wireHash !== undefined) packet.rpcHash = wireHash;
    packet.payload = buffer.subarray(rpcStart + (wireHash !== undefined && wireHash > 0xff ? 2 : 1), end);
    // A rejected match took us here on a false hash reading, so the behaviour it implied is wrong
    // too. Undo the inference rather than teaching the connection a binding that will mis-resolve
    // every later packet on this component.
    const rejected = rejectedByPayload(packet, lookup);
    if (rejected && inferredType !== undefined) packet.networkBehaviourType = undefined;
    applyRpcLookup(packet, lookup);
    const boundType = rejected ? undefined : inferredType ?? eliminatedType;
    return {
      packet,
      end,
      stop,
      componentBindings: boundType === undefined ? undefined : [[key, boundType]],
    };
  } catch {
    return { packet: opaquePacket(buffer, start, tick, bundleIndex, packetName), end: buffer.length, stop: true };
  }
}

/**
 * Walks every SyncType entry concatenated into one length-delimited body. FishNet writes each dirty
 * SyncType as an index byte followed by its serialized value, and several can share one packet, so
 * decoding only the first left the rest as opaque bytes even when their layouts were known.
 *
 * The walk stops at the first entry that cannot be resolved or does not decode cleanly, keeping the
 * remainder as `undecodedPayload` rather than guessing where the next boundary is.
 */
function applySyncTypeEntries(packet: DecodedFishNetPacket, options: FishNetDecodeOptions): void {
  const payload = packet.syncPayload;
  if (!payload) return;
  const entries: FishNetSyncEntry[] = [];
  const fields: FishNetDecodedField[] = [];
  let offset = 0;
  while (offset < payload.length) {
    const index = payload.readUInt8(offset);
    const sync = findSyncType(options.rpcMap, packet.networkBehaviourType, index);
    if (!sync) break;
    const parameters = sync.fields ?? (sync.codec
      ? [{ name: sync.name, typeName: sync.typeName, codec: sync.codec }]
      : undefined);
    if (!parameters) break;
    const run = decodeFieldRun(payload, parameters, offset + 1);
    fields.push(...run.fields);
    if (entries.length === 0) packet.syncName = sync.name;
    // A partial run keeps the fields it read - matching the previous single-entry behaviour - but
    // its end offset is not a trustworthy boundary, so no further entry is attempted.
    if (!run.complete) {
      offset = run.consumed;
      break;
    }
    entries.push({ index, name: sync.name, fields: run.fields });
    offset = run.consumed;
  }
  if (fields.length > 0) packet.decodedFields = fields;
  if (entries.length > 0) packet.syncEntries = entries;
  if (offset < payload.length) packet.undecodedPayload = payload.subarray(offset);
}

/**
 * Decodes the SyncTypes an ObjectSpawn carries for its own components.
 *
 * This body is framed differently from a standalone SyncType packet: that packet's header already
 * names one component, whereas a spawn covers several, so each run is `componentIndex`, a count,
 * and then that many index-prefixed values.
 *
 * A component whose behaviour is unknown ends the walk. Its values cannot be sized, so where the
 * next component begins is unknowable and the rest is left alone rather than guessed at.
 *
 * A zero count ends the walk for the same reason. The writer emits a run only for a component that
 * has SyncTypes to send, so a count of zero is not an empty-but-valid run to step over - it means
 * these two bytes were not a run header, and continuing would read misaligned bytes as component
 * and count pairs. The undecoded remainder stays available as `spawnSyncPayload` either way.
 */
function decodeSpawnSyncTypes(
  candidate: SpawnCandidate,
  options: FishNetDecodeOptions,
): FishNetSpawnSyncEntry[] | undefined {
  const payload = candidate.syncPayload;
  if (payload.length === 0) return undefined;
  const bindings = new Map(candidate.componentBindings);
  const entries: FishNetSpawnSyncEntry[] = [];
  let offset = 0;
  while (offset + 2 <= payload.length) {
    const componentIndex = payload.readUInt8(offset);
    const count = payload.readUInt8(offset + 1);
    if (count === 0) break;
    const networkBehaviourType = bindings.get(componentKey(candidate.objectId, componentIndex));
    if (networkBehaviourType === undefined) break;
    let cursor = offset + 2;
    const run: FishNetSpawnSyncEntry[] = [];
    for (let index = 0; index < count; index += 1) {
      if (cursor >= payload.length) return finish(entries);
      const syncIndex = payload.readUInt8(cursor);
      const sync = findSyncType(options.rpcMap, networkBehaviourType, syncIndex);
      if (!sync) return finish(entries);
      const parameters = sync.fields ?? (sync.codec
        ? [{ name: sync.name, typeName: sync.typeName, codec: sync.codec }]
        : undefined);
      if (!parameters) return finish(entries);
      const decoded = decodeFieldRun(payload, parameters, cursor + 1);
      if (!decoded.complete) return finish(entries);
      run.push({
        componentIndex,
        networkBehaviourType,
        index: syncIndex,
        name: sync.name,
        fields: decoded.fields,
      });
      cursor = decoded.consumed;
    }
    entries.push(...run);
    offset = cursor;
  }
  return finish(entries);
}

function finish(entries: FishNetSpawnSyncEntry[]): FishNetSpawnSyncEntry[] | undefined {
  return entries.length > 0 ? entries : undefined;
}
