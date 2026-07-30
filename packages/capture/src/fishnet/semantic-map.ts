import { CURRENT_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
import { FishNetSemanticDefinitions } from "./semantic-definitions.ts";

export interface FishNetSkillLabel {
  readonly networkBehaviourType: string;
  readonly rpcName: string;
  readonly field: string;
  readonly value: string;
  readonly label: string;
  readonly confidence: string;
  readonly repetitions: number;
}

export type FishNetRecoveryStyle = "standard" | "passive-regeneration" | "drain" | "unknown";

export interface FishNetRecoveryStyleDefinition {
  readonly networkBehaviourType: string;
  readonly rpcName: string;
  readonly undecodedPayloadHex: string;
  readonly style: Exclude<FishNetRecoveryStyle, "unknown">;
}

export interface FishNetSemanticMap {
  readonly buildFingerprint: string;
  readonly verifiedSkillLabels: readonly FishNetSkillLabel[];
  readonly recoveryStyles?: readonly FishNetRecoveryStyleDefinition[];
}

const SEMANTIC_MAPS = {
  [CURRENT_GAME_BUILD_FINGERPRINT]: FishNetSemanticDefinitions.currentMap,
} as const;

export function loadBundledFishNetSemanticMap(
  buildFingerprint: string = CURRENT_GAME_BUILD_FINGERPRINT,
): FishNetSemanticMap {
  if (!Object.hasOwn(SEMANTIC_MAPS, buildFingerprint)) {
    throw new Error(`no bundled semantic map for FishNet build ${JSON.stringify(buildFingerprint)}`);
  }
  return SEMANTIC_MAPS[buildFingerprint as keyof typeof SEMANTIC_MAPS];
}
