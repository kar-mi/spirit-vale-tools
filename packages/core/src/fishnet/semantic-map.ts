import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "./builtin-maps.ts";
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
  "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4": FishNetSemanticDefinitions.map,
} as const;

export function loadBundledFishNetSemanticMap(
  buildFingerprint: string = CURRENT_FISHNET_BUILD_FINGERPRINT,
): FishNetSemanticMap {
  if (!Object.hasOwn(SEMANTIC_MAPS, buildFingerprint)) {
    throw new Error(`no bundled semantic map for FishNet build ${JSON.stringify(buildFingerprint)}`);
  }
  return SEMANTIC_MAPS[buildFingerprint as keyof typeof SEMANTIC_MAPS];
}
