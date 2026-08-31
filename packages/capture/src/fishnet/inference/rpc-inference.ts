import { tryDecodeFields } from "../decoding/fields.ts";
import { componentKey } from "../decoding/protocol.ts";
import type { RpcLinkRegistrationState } from "../decoding/protocol.ts";
import type { FishNetRpcMap, FishNetRpcPacketName } from "../types.ts";

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

export function bindPrefabBehaviourTypes(
  collectionId: number,
  prefabId: number,
  objectId: number,
  verifiedBindings: readonly [string, string][],
  map: FishNetRpcMap | undefined,
): Array<[string, string]> {
  if (!map?.prefabs) return [];
  const layouts = map.prefabs.filter((layout) => layout.collectionId === collectionId && layout.prefabId === prefabId);
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
  const matches = map.behaviours.filter(({ rpcs }) => (
    rpcs.some((rpc) => rpc.packetKind === packetName && hashes.has(rpc.wireHash))
  ));
  return matches.length === 1 ? matches[0]?.typeName : undefined;
}

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
    if (candidate === undefined) return undefined;
    recovered.add(candidate);
  }
  return recovered.size === 1 ? [...recovered][0] : undefined;
}

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
      if (fit.complete && (fit.consumed === payload.length || rpc.parameters?.at(-1)?.prefix === true)) fitting.add(typeName);
    }
  }
  return fitting.size === 1 ? [...fitting][0] : undefined;
}

function rpcFingerprint(values: Array<{ wireHash: number; packetKind: FishNetRpcPacketName }>): string {
  return values.map(({ wireHash, packetKind }) => `${wireHash}:${packetKind}`).sort().join(",");
}
