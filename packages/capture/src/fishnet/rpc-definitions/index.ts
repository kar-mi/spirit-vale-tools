import type { FishNetRpcMap, FishNetSyncTypeDefinition } from "../definitions/rpc-map.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "../../game-build.ts";
import { HealthComponentRpcDefinition } from "./game/health-component.ts";
import { PlayerControllerRpcDefinition } from "./game/player-controller/index.ts";
import { SkillsComponentRpcDefinition } from "./game/skills-component.ts";
import { FISHNET_PREFAB_DEFINITIONS } from "./prefabs.ts";
import { CURRENT_BUILD_BROADCASTS, CURRENT_BUILD_RPC_BEHAVIOURS } from "./current-build.ts";

const SYNC_TYPES: ReadonlyMap<string, readonly FishNetSyncTypeDefinition[]> = new Map<string, readonly FishNetSyncTypeDefinition[]>([
  [HealthComponentRpcDefinition.typeName, HealthComponentRpcDefinition.syncTypes],
  [PlayerControllerRpcDefinition.typeName, PlayerControllerRpcDefinition.syncTypes],
  [SkillsComponentRpcDefinition.typeName, SkillsComponentRpcDefinition.syncTypes],
] as const);

export const FISHNET_RPC_MAP = {
  buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
  metadataVersion: 31,
  behaviours: CURRENT_BUILD_RPC_BEHAVIOURS.map((behaviour) => {
    const syncTypes = SYNC_TYPES.get(behaviour.typeName);
    return syncTypes === undefined ? behaviour : { ...behaviour, syncTypes };
  }),
  broadcasts: CURRENT_BUILD_BROADCASTS,
  prefabs: FISHNET_PREFAB_DEFINITIONS,
} as const satisfies FishNetRpcMap;
