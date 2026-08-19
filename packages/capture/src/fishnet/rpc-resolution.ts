import { applyDecodedFields, tryDecodeFields } from "./field-decoder.ts";
import { decodeNetworkTransformData, NETWORK_TRANSFORM_RPC_NAMES } from "./network-transform-decoder.ts";
import { componentKey } from "./protocol.ts";
import type { RpcLinkRegistrationState } from "./protocol.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodedField,
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

/**
 * Recovers component bindings from build-scoped prefab metadata when a spawn omits some or all RPC
 * Link registrations. Any contradiction with bindings proven by this spawn rejects the bundled
 * layout for the whole object; fresh wire evidence always wins.
 */
export function bindPrefabBehaviourTypes(
  collectionId: number,
  prefabId: number,
  objectId: number,
  verifiedBindings: readonly [string, string][],
  map: FishNetRpcMap | undefined,
): Array<[string, string]> {
  if (!map?.prefabs) return [];
  const layouts = map.prefabs.filter((layout) => (
    layout.collectionId === collectionId && layout.prefabId === prefabId
  ));
  if (layouts.length !== 1 || !layouts[0]) return [];

  const knownTypes = new Set(map.behaviours.map(({ typeName }) => typeName));
  const componentsByIndex = new Map<number, string>();
  const indexesByType = new Map<string, number>();
  for (const component of layouts[0].components) {
    if (!knownTypes.has(component.typeName)) return [];
    if (componentsByIndex.has(component.index) || indexesByType.has(component.typeName)) return [];
    componentsByIndex.set(component.index, component.typeName);
    indexesByType.set(component.typeName, component.index);
  }

  const prefix = `${objectId}:`;
  for (const [key, typeName] of verifiedBindings) {
    if (!key.startsWith(prefix)) continue;
    const componentIndex = Number(key.slice(prefix.length));
    const expectedType = componentsByIndex.get(componentIndex);
    if (expectedType !== undefined && expectedType !== typeName) return [];
    const expectedIndex = indexesByType.get(typeName);
    if (expectedIndex !== undefined && expectedIndex !== componentIndex) return [];
  }

  return layouts[0].components.map(({ index, typeName }) => [componentKey(objectId, index), typeName]);
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

/**
 * Recovers a component's behaviour type for an object whose spawn was never captured, using the
 * bindings already verified on that same object.
 *
 * A capture that attaches mid-session never sees the local player's spawn, so nothing registers its
 * component layout and every packet on its other components stays unresolved for the whole session.
 * What is available is the object's own verified bindings: they narrow which prefab layouts the
 * object could possibly be, and where every surviving candidate names the same type for the wanted
 * index, that type holds for all of them and is not a guess.
 *
 * The bar is deliberately high. Recovery needs at least one already-verified binding to narrow
 * from, every candidate must define the wanted index, and they must all agree on it. A layout that
 * contradicts a known binding is discarded rather than tolerated, and a single candidate that
 * leaves the index blank abandons the whole attempt.
 */
export function recoverComponentFromPrefabLayouts(
  map: FishNetRpcMap | undefined,
  components: ReadonlyMap<string, string>,
  objectId: number,
  componentIndex: number,
): string | undefined {
  if (!map?.prefabs) return undefined;
  const prefix = `${objectId}:`;
  const known = new Map<number, string>();
  for (const [key, typeName] of components) {
    if (!key.startsWith(prefix)) continue;
    const index = Number(key.slice(prefix.length));
    if (Number.isInteger(index)) known.set(index, typeName);
  }
  // With nothing bound, every layout in the build is a candidate and agreement means nothing.
  if (known.size === 0 || known.has(componentIndex)) return undefined;

  const recovered = new Set<string>();
  for (const layout of map.prefabs) {
    const byIndex = new Map(layout.components.map(({ index, typeName }) => [index, typeName]));
    let consistent = true;
    for (const [index, typeName] of known) {
      if (byIndex.get(index) !== typeName) {
        consistent = false;
        break;
      }
    }
    if (!consistent) continue;
    const candidate = byIndex.get(componentIndex);
    // A candidate layout that leaves this index blank cannot confirm anything about it.
    if (candidate === undefined) return undefined;
    recovered.add(candidate);
  }
  return recovered.size === 1 ? [...recovered][0] : undefined;
}

/**
 * Narrows an ambiguous behaviour-type match by testing the payload against each candidate's
 * signature. This complements `eliminateBoundBehaviourTypes`, which can only narrow once *something*
 * else on the object is already bound: an object whose spawn was never captured has no bindings at
 * all, so a shared hash (e.g. observersRpc 0, claimed by both `CombatComponent.Attack_C` and
 * `HealthComponent.ApplyDamage_C`) stays ambiguous for that object's entire life and every packet on
 * it is dropped.
 *
 * A candidate survives only when its parameters consume the payload *exactly* - both a short read
 * and leftover bytes disqualify it. Candidates whose signature this decoder cannot evaluate (array
 * or opaque parameters) are indeterminate rather than misfits, and their presence blocks the whole
 * pass: eliminating one because it could not be checked is how a confident wrong answer gets made.
 */
export function eliminateByPayloadShape(
  map: FishNetRpcMap | undefined,
  candidates: readonly string[],
  packetName: FishNetRpcPacketName,
  hash8: number,
  hash16: number | undefined,
  payload: Buffer,
): string | undefined {
  if (!map || candidates.length < 2) return undefined;
  const hashes = new Set([hash8, ...(hash16 === undefined ? [] : [hash16])]);
  const fitting = new Set<string>();
  for (const typeName of candidates) {
    const behaviour = map.behaviours.find((entry) => entry.typeName === typeName);
    if (!behaviour) continue;
    for (const rpc of behaviour.rpcs) {
      if (rpc.packetKind !== packetName || !hashes.has(rpc.wireHash)) continue;
      const fit = tryDecodeFields(payload, rpc.parameters);
      if (fit.undecodable) return undefined;
      if (fit.complete && fit.consumed === payload.length) fitting.add(typeName);
    }
  }
  return fitting.size === 1 ? [...fitting][0] : undefined;
}

/**
 * Rejects a match that cannot possibly be the packet in hand.
 *
 * `lookupRpc` accepts a hit on either the 8-bit or the 16-bit reading of the wire hash, and does not
 * check that the method it found could have produced these bytes. When a behaviour with many RPCs
 * uses a 16-bit hash whose low byte collides with another behaviour's 8-bit hash, the wrong method
 * wins and looks fully verified — `PlayerController.FullHeal_C` claimed 122 packets in one capture
 * that were really hash 26142 elsewhere, the stray byte being the hash's high half.
 *
 * Only the airtight case is rejected: a method that declares *no arguments* cannot explain a
 * non-empty payload. A method whose parameters merely fail to decode is left alone, because the map
 * models several payloads only partially and a stricter rule would discard real traffic.
 */
function signatureAdmitsPayload(lookup: RpcLookup, payload: Buffer): boolean {
  const fit = tryDecodeFields(payload, lookup.parameters);
  return fit.undecodable || (fit.complete && fit.consumed === payload.length);
}

/** True when `applyRpcLookup` refused a match it was handed. Callers must not learn bindings from it. */
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

/**
 * NetworkTransform's movement RPCs declare a bare `ArraySegment<byte>`, so the generated map cannot
 * describe their contents and the field decoder leaves the whole payload undecoded. Their layout is
 * fixed by FishNet rather than by the game build, so it is parsed here instead.
 */
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

/**
 * Resolves a spawn's collection and prefab IDs to the build's prefab layout. Prefab IDs are wire
 * values reassigned between builds, so consumers must match on `prefabName` through this rather
 * than on a hardcoded numeric ID.
 */
export function findPrefab(map: FishNetRpcMap | undefined, collectionId: number, prefabId: number) {
  if (!map?.prefabs) return undefined;
  const matches = map.prefabs.filter((layout) => (
    layout.collectionId === collectionId && layout.prefabId === prefabId
  ));
  return matches.length === 1 ? matches[0] : undefined;
}
