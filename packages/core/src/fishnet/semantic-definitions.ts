import type { FishNetSemanticMap, FishNetSkillLabel } from "./semantic-map.ts";

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
    buildFingerprint: "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4",
    verifiedSkillLabels: this.verifiedSkillLabels,
  } as const satisfies FishNetSemanticMap;
}
