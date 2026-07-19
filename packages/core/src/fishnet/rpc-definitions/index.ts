import type { FishNetRpcMap } from "../definitions/rpc-map.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "../../game-build.ts";
import { FishNetBroadcastDefinitions } from "./broadcasts.ts";
import { BaseUnitControllerRpcDefinition } from "./game/base-unit-controller.ts";
import { CombatComponentRpcDefinition } from "./game/combat-component.ts";
import { NetworkAnimatorRpcDefinition } from "./fishnet/network-animator.ts";
import { PredictedOwnerRpcDefinition } from "./fishnet/predicted-owner.ts";
import { NetworkTransformRpcDefinition } from "./fishnet/network-transform.ts";
import { HealthComponentRpcDefinition } from "./game/health-component.ts";
import { MonsterControllerRpcDefinition } from "./game/monster-controller.ts";
import { MoveComponentRpcDefinition } from "./game/move-component.ts";
import { PlayerControllerRpcDefinition } from "./game/player-controller/index.ts";
import { PlayerSaveRpcDefinition } from "./game/player-save/index.ts";
import { SkillsComponentRpcDefinition } from "./game/skills-component.ts";
import { StatusComponentRpcDefinition } from "./game/status-component.ts";
import { SummoningComponentRpcDefinition } from "./game/summoning-component.ts";

export const FISHNET_RPC_MAP = {
  buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
  metadataVersion: 31,
  behaviours: [
    BaseUnitControllerRpcDefinition.definition,
    CombatComponentRpcDefinition.definition,
    NetworkAnimatorRpcDefinition.definition,
    PredictedOwnerRpcDefinition.definition,
    NetworkTransformRpcDefinition.definition,
    HealthComponentRpcDefinition.definition,
    MonsterControllerRpcDefinition.definition,
    MoveComponentRpcDefinition.definition,
    PlayerControllerRpcDefinition.definition,
    PlayerSaveRpcDefinition.definition,
    SkillsComponentRpcDefinition.definition,
    StatusComponentRpcDefinition.definition,
    SummoningComponentRpcDefinition.definition,
  ],
  broadcasts: FishNetBroadcastDefinitions.definitions,
} as const satisfies FishNetRpcMap;
