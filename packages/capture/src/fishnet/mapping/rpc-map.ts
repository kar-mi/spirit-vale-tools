import { applyDecodedFields, tryDecodeFields } from "../decoding/fields.ts";
import { decodeNetworkTransformData, NETWORK_TRANSFORM_RPC_NAMES } from "../decoding/network-transform.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
  FishNetRpcDefinition,
  FishNetRpcMap,
  FishNetRpcPacketName,
  FishNetRpcParameter,
  FishNetRpcResolution,
} from "../types.ts";

export interface RpcLookup {
  resolution: FishNetRpcResolution;
  wireHash?: number;
  methodName?: string;
  parameters?: readonly FishNetRpcParameter[];
  ambiguousBehaviourTypes?: readonly string[];
}

export function lookupRpc(
  map: FishNetRpcMap | undefined,
  networkBehaviourType: string | undefined,
  packetName: FishNetRpcPacketName,
  hash8: number,
  hash16: number | undefined,
): RpcLookup {
  if (!map) return { resolution: "unresolved" };
  const hashes = new Set([hash8, ...(hash16 === undefined ? [] : [hash16])]);
  const behaviours = networkBehaviourType
    ? map.behaviours.filter(({ typeName }) => typeName === networkBehaviourType)
    : map.behaviours;
  const matches = behaviours.flatMap(({ typeName, rpcs }) => rpcs
    .filter((rpc) => rpc.packetKind === packetName && hashes.has(rpc.wireHash))
    .map((rpc) => ({ ...rpc, typeName })));
  return definitionLookup(matches);
}

function signatureAdmitsPayload(lookup: RpcLookup, payload: Buffer): boolean {
  const fit = tryDecodeFields(payload, lookup.parameters);
  return fit.undecodable || (fit.complete
    && (fit.consumed === payload.length || admitsVerifiedPrefix(lookup.parameters)));
}

function admitsVerifiedPrefix(parameters: readonly FishNetRpcParameter[] | undefined): boolean {
  return parameters?.at(-1)?.prefix === true;
}

export function rejectedByPayload(packet: DecodedFishNetPacket, lookup: RpcLookup): boolean {
  return lookup.resolution === "verified" && !signatureAdmitsPayload(lookup, packet.payload);
}

export function applyRpcLookup(packet: DecodedFishNetPacket, lookup: RpcLookup): void {
  if (rejectedByPayload(packet, lookup)) {
    packet.rpcResolution = "unresolved";
    return;
  }
  packet.rpcResolution = lookup.resolution;
  if (lookup.resolution !== "verified") return;
  packet.rpcName = lookup.methodName;
  applyDecodedFields(packet, lookup.parameters);
  applyNetworkTransform(packet);
}

function applyNetworkTransform(packet: DecodedFishNetPacket): void {
  if (packet.rpcName === undefined || !NETWORK_TRANSFORM_RPC_NAMES.has(packet.rpcName)) return;
  const update = decodeNetworkTransformData(packet.payload);
  if (!update) return;
  packet.networkTransform = update;
  const fields: FishNetDecodedField[] = [];
  for (const [axis, value] of Object.entries(update.position)) {
    if (value !== undefined) fields.push({ name: `position.${axis}`, typeName: "System.Single", codec: "float32", value });
  }
  for (const [axis, value] of Object.entries(update.scale ?? {})) {
    if (value !== undefined) fields.push({ name: `scale.${axis}`, typeName: "System.Single", codec: "float32", value });
  }
  if (fields.length > 0) packet.decodedFields = [...(packet.decodedFields ?? []), ...fields];
  packet.undecodedPayload = update.consumed < packet.payload.length
    ? packet.payload.subarray(update.consumed)
    : undefined;
}

export function findBroadcast(map: FishNetRpcMap | undefined, wireHash: number) {
  if (!map) return undefined;
  const matches = (map.broadcasts ?? []).filter((broadcast) => broadcast.wireHash === wireHash);
  return matches.length === 1 ? matches[0] : undefined;
}

export function findSyncType(map: FishNetRpcMap | undefined, typeName: string | undefined, index: number) {
  if (!map || !typeName) return undefined;
  const matches = map.behaviours
    .filter((behaviour) => behaviour.typeName === typeName)
    .flatMap((behaviour) => behaviour.syncTypes ?? [])
    .filter((sync) => sync.index === index);
  return matches.length === 1 ? matches[0] : undefined;
}

export function findPrefab(map: FishNetRpcMap | undefined, collectionId: number, prefabId: number) {
  if (!map?.prefabs) return undefined;
  const matches = map.prefabs.filter((layout) => (
    layout.collectionId === collectionId && layout.prefabId === prefabId
  ));
  return matches.length === 1 ? matches[0] : undefined;
}

function definitionLookup(matches: readonly (FishNetRpcDefinition & { typeName?: string })[]): RpcLookup {
  const wireHashes = new Set(matches.map(({ wireHash }) => wireHash));
  if (matches.length === 1 && matches[0]) {
    return {
      resolution: "verified",
      wireHash: matches[0].wireHash,
      methodName: matches[0].methodName,
      parameters: matches[0].parameters,
    };
  }
  const ambiguousBehaviourTypes = matches.length > 1
    ? [...new Set(matches.map(({ typeName }) => typeName).filter((typeName): typeName is string => typeName !== undefined))]
    : undefined;
  return {
    resolution: matches.length > 1 ? "ambiguous" : "unresolved",
    ambiguousBehaviourTypes: ambiguousBehaviourTypes?.length ? ambiguousBehaviourTypes : undefined,
    wireHash: wireHashes.size === 1 ? wireHashes.values().next().value : undefined,
  };
}
