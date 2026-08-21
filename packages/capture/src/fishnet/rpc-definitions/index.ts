import type { FishNetBehaviourDefinition, FishNetRpcDefinition, FishNetRpcMap, FishNetSyncTypeDefinition } from "../definitions/rpc-map.ts";
import { HealthComponentRpcDefinition } from "./game/health-component.ts";
import { PlayerControllerRpcDefinition } from "./game/player-controller/index.ts";
import { SkillsComponentRpcDefinition } from "./game/skills-component.ts";
import { LootDropRpcDefinition } from "./game/loot-drop.ts";
import { PlayerSaveRpcDefinition } from "./game/player-save/index.ts";
import {
  GENERATED_BEHAVIOURS,
  GENERATED_BROADCASTS,
  GENERATED_BUILD_FINGERPRINT,
  GENERATED_METADATA_VERSION,
  GENERATED_PREFAB_DEFINITIONS,
} from "./generated/index.ts";

// The data-mine doesn't extract SyncVar names for most types; these are hand-verified
// against captures (see each file's docstring) and layered onto the generated RPCs below.
const SYNC_TYPES: ReadonlyMap<string, readonly FishNetSyncTypeDefinition[]> = new Map<string, readonly FishNetSyncTypeDefinition[]>([
  [HealthComponentRpcDefinition.typeName, HealthComponentRpcDefinition.syncTypes],
  [PlayerControllerRpcDefinition.typeName, PlayerControllerRpcDefinition.syncTypes],
  [SkillsComponentRpcDefinition.typeName, SkillsComponentRpcDefinition.syncTypes],
  [LootDropRpcDefinition.typeName, LootDropRpcDefinition.syncTypes],
] as const);

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
    const syncTypes = SYNC_TYPES.get(behaviour.typeName) ?? ("syncTypes" in behaviour ? behaviour.syncTypes : undefined);
    return syncTypes === undefined ? { typeName: behaviour.typeName, rpcs } : { typeName: behaviour.typeName, rpcs, syncTypes };
  }),
  broadcasts: GENERATED_BROADCASTS,
  prefabs: GENERATED_PREFAB_DEFINITIONS,
} as const satisfies FishNetRpcMap;
