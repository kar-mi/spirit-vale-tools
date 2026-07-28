import { applyDecodedFields } from "./field-decoder.ts";
import { componentKey } from "./protocol.ts";
import type { RpcLinkRegistrationState } from "./protocol.ts";
import type {
  DecodedFishNetPacket,
  FishNetRpcDefinition,
  FishNetRpcMap,
  FishNetRpcPacketName,
  FishNetRpcParameter,
  FishNetRpcResolution,
} from "./types.ts";

export interface RpcLookup {
  resolution: FishNetRpcResolution;
  wireHash?: number;
  methodName?: string;
  parameters?: readonly FishNetRpcParameter[];
  /** Candidate behaviour type names, when `resolution` is `"ambiguous"`. */
  ambiguousBehaviourTypes?: readonly string[];
}

export function bindBehaviourTypes(
  registrations: Array<[number, RpcLinkRegistrationState]>,
  map: FishNetRpcMap | undefined,
): Array<[string, string]> {
  if (!map) return [];
  const byComponent = new Map<string, RpcLinkRegistrationState[]>();
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

export function inferBehaviourType(
  map: FishNetRpcMap | undefined,
  packetName: FishNetRpcPacketName,
  hash8: number,
  hash16: number | undefined,
): string | undefined {
  if (!map) return undefined;
  const hashes = new Set([hash8, ...(hash16 === undefined ? [] : [hash16])]);
  const matches = map.behaviours.filter(({ rpcs }) => {
    return rpcs.some((rpc) => rpc.packetKind === packetName && hashes.has(rpc.wireHash));
  });
  return matches.length === 1 ? matches[0]?.typeName : undefined;
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

/**
 * Narrows an ambiguous behaviour-type match using the invariant that a NetworkObject has at most
 * one instance of each behaviour type. If every candidate but one is already bound to a *different*
 * component index on the same object, the remaining candidate must be this component's real type —
 * even though its own RPC signature alone can't distinguish it (e.g. `HealthComponent.Recover_C` vs.
 * `SkillsComponent.Recover_C`, which share the same wire hash and packet kind).
 */
export function eliminateBoundBehaviourTypes(
  components: ReadonlyMap<string, string>,
  objectId: number,
  componentIndex: number,
  candidates: readonly string[],
): string | undefined {
  const selfKey = componentKey(objectId, componentIndex);
  const prefix = `${objectId}:`;
  const boundElsewhere = new Set<string>();
  for (const [key, typeName] of components) {
    if (key === selfKey || !key.startsWith(prefix)) continue;
    boundElsewhere.add(typeName);
  }
  const remaining = candidates.filter((typeName) => !boundElsewhere.has(typeName));
  return remaining.length === 1 ? remaining[0] : undefined;
}

export function applyRpcLookup(packet: DecodedFishNetPacket, lookup: RpcLookup): void {
  packet.rpcResolution = lookup.resolution;
  if (lookup.resolution !== "verified") return;
  packet.rpcName = lookup.methodName;
  applyDecodedFields(packet, lookup.parameters);
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

function rpcFingerprint(values: Array<{ wireHash: number; packetKind: FishNetRpcPacketName }>): string {
  return values.map(({ wireHash, packetKind }) => `${wireHash}:${packetKind}`).sort().join(",");
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
