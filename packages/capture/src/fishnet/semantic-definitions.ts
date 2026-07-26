import type { FishNetSemanticMap, FishNetSkillLabel } from "./semantic-map.ts";
import { LEGACY_GAME_BUILD_FINGERPRINT } from "../game-build.ts";

export class FishNetSemanticDefinitions {
  private constructor() {}

  static readonly verifiedSkillLabels = [
    {
      "networkBehaviourType": "SkillsComponent",
      "rpcName": "CastBegin_C",
      "field": "dto.Id",
      "value": "AxeArc",
      "label": "Twin Cleave",
      "confidence": "verifiedByRepeatedAction",
      "repetitions": 2
    },
    {
      "networkBehaviourType": "SkillsComponent",
      "rpcName": "CastBegin_C",
      "field": "dto.Id",
      "value": "AxeVortex",
      "label": "Vortex Slash",
      "confidence": "verifiedByRepeatedAction",
      "repetitions": 2
    },
    {
      "networkBehaviourType": "SkillsComponent",
      "rpcName": "CastBegin_C",
      "field": "dto.Id",
      "value": "Whirlwind",
      "label": "Whirlwind",
      "confidence": "verifiedByRepeatedAction",
      "repetitions": 2
    }
  ] as const satisfies readonly FishNetSkillLabel[];
  static readonly map = {
    buildFingerprint: LEGACY_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: this.verifiedSkillLabels,
  } as const satisfies FishNetSemanticMap;
}
