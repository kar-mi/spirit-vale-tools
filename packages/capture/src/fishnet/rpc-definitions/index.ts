import type { FishNetBehaviourDefinition, FishNetRpcDefinition, FishNetRpcMap, FishNetSyncTypeDefinition } from "../definitions/rpc-map.ts";
import { PlayerControllerRpcDefinition } from "./game/player-controller/index.ts";
import { PlayerSaveRpcDefinition } from "./game/player-save/index.ts";
import {
  GENERATED_BEHAVIOURS,
  GENERATED_BROADCASTS,
  GENERATED_BUILD_FINGERPRINT,
  GENERATED_METADATA_VERSION,
  GENERATED_PREFAB_DEFINITIONS,
} from "./generated/index.ts";

// The data-mine's SyncVar extraction resolves a nested DTO's index/type but not its field shape:
// promoting a type into its `_STRUCTURED_LAYOUTS` registry requires every one of the type's own
// fields to be verified, not just the one(s) a consumer actually needs (`PlayerController`'s
// `VisualData` is a `CharacterVisualDto` with 4 fields; only `Appearance` has ever been verified,
// covering the display name/archetype `combat`'s actor identity depends on). Every other
// behaviour's syncTypes now come straight from the generated data with no override.
const SYNC_TYPE_OVERRIDES: ReadonlyMap<string, readonly FishNetSyncTypeDefinition[]> = new Map<string, readonly FishNetSyncTypeDefinition[]>([
  [PlayerControllerRpcDefinition.typeName, PlayerControllerRpcDefinition.syncTypes],
] as const);

function mergeSyncTypes(
  generated: readonly FishNetSyncTypeDefinition[] | undefined,
  overrides: readonly FishNetSyncTypeDefinition[] | undefined,
): readonly FishNetSyncTypeDefinition[] | undefined {
  if (!overrides) return generated;
  const byIndex = new Map((generated ?? []).map((entry) => [entry.index, entry]));
  for (const entry of overrides) byIndex.set(entry.index, entry);
  return [...byIndex.values()].sort((a, b) => a.index - b.index);
}

// PlayerSave's ~120 RPCs are hand-split across game/player-save/*.ts by feature area for
// readability instead of the flat generated list; the generator verifies that split still
// covers exactly the same RPCs as the data-mine on every run (see checkPlayerSaveCoverage
// in scripts/generate-rpc-map.ts) and fails instead of silently drifting.
const RPC_OVERRIDES: ReadonlyMap<string, readonly FishNetRpcDefinition[]> = new Map<string, readonly FishNetRpcDefinition[]>([
  [PlayerSaveRpcDefinition.typeName, PlayerSaveRpcDefinition.rpcs],
] as const);

export const FISHNET_RPC_MAP = {
  buildFingerprint: GENERATED_BUILD_FINGERPRINT,
  metadataVersion: GENERATED_METADATA_VERSION,
  behaviours: GENERATED_BEHAVIOURS.map((behaviour): FishNetBehaviourDefinition => {
    const rpcs: readonly FishNetRpcDefinition[] = RPC_OVERRIDES.get(behaviour.typeName) ?? behaviour.rpcs;
    const syncTypes = mergeSyncTypes(
      "syncTypes" in behaviour ? behaviour.syncTypes : undefined,
      SYNC_TYPE_OVERRIDES.get(behaviour.typeName),
    );
    return syncTypes === undefined ? { typeName: behaviour.typeName, rpcs } : { typeName: behaviour.typeName, rpcs, syncTypes };
  }),
  broadcasts: GENERATED_BROADCASTS,
  prefabs: GENERATED_PREFAB_DEFINITIONS,
} as const satisfies FishNetRpcMap;
