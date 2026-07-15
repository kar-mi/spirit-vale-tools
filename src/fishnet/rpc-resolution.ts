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
  FishNetRpcSymbol,
} from "./types.ts";

export interface RpcLookup {
  resolution: FishNetRpcResolution;
  wireHash?: number;
  methodName?: string;
  parameters?: FishNetRpcParameter[];
}

export function bindBehaviourTypes(
  registrations: Array<[number, RpcLinkRegistrationState]>,
  map: FishNetRpcMap | undefined,
): Array<[string, string]> {
  if (!map || map.schemaVersion !== 2) return [];
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
  if (!map || map.schemaVersion !== 2) return undefined;
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

export function applyRpcLookup(packet: DecodedFishNetPacket, lookup: RpcLookup): void {
  packet.rpcResolution = lookup.resolution;
  if (lookup.resolution !== "verified") return;
  packet.rpcName = lookup.methodName;
  applyDecodedFields(packet, lookup.parameters);
}

export function findBroadcast(map: FishNetRpcMap | undefined, wireHash: number) {
  if (!map || map.schemaVersion !== 2) return undefined;
  const matches = (map.broadcasts ?? []).filter((broadcast) => broadcast.wireHash === wireHash);
  return matches.length === 1 ? matches[0] : undefined;
}

export function findSyncType(map: FishNetRpcMap | undefined, typeName: string | undefined, index: number) {
  if (!map || map.schemaVersion !== 2 || !typeName) return undefined;
  const matches = map.behaviours
    .filter((behaviour) => behaviour.typeName === typeName)
    .flatMap((behaviour) => behaviour.syncTypes ?? [])
    .filter((sync) => sync.index === index);
  return matches.length === 1 ? matches[0] : undefined;
}

function rpcFingerprint(values: Array<{ wireHash: number; packetKind: FishNetRpcPacketName }>): string {
  return values.map(({ wireHash, packetKind }) => `${wireHash}:${packetKind}`).sort().join(",");
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
