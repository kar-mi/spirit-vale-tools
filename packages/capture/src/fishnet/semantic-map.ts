import { CURRENT_GAME_BUILD_FINGERPRINT, LEGACY_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
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

export interface FishNetSemanticMap {
  readonly buildFingerprint: string;
  readonly verifiedSkillLabels: readonly FishNetSkillLabel[];
}

const SEMANTIC_MAPS = {
  [LEGACY_GAME_BUILD_FINGERPRINT]: FishNetSemanticDefinitions.map,
  [CURRENT_GAME_BUILD_FINGERPRINT]: {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: [],
  },
} as const;

export function loadBundledFishNetSemanticMap(
  buildFingerprint: string = CURRENT_GAME_BUILD_FINGERPRINT,
): FishNetSemanticMap {
  if (!Object.hasOwn(SEMANTIC_MAPS, buildFingerprint)) {
    throw new Error(`no bundled semantic map for FishNet build ${JSON.stringify(buildFingerprint)}`);
  }
  return SEMANTIC_MAPS[buildFingerprint as keyof typeof SEMANTIC_MAPS];
}
