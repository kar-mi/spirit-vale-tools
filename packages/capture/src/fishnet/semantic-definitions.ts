import type {
  FishNetRecoveryStyleDefinition,
  FishNetSemanticMap,
  FishNetSkillLabel,
} from "./semantic-map.ts";
import {
  CURRENT_GAME_BUILD_FINGERPRINT,
  LEGACY_GAME_BUILD_FINGERPRINT,
} from "../game-build.ts";

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

  static readonly currentRecoveryStyles = [
    {
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      undecodedPayloadHex: "0000ac0200000000",
      style: "standard",
    },
    {
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      undecodedPayloadHex: "00010000000000",
      style: "passive-regeneration",
    },
    {
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      undecodedPayloadHex: "0001ab020000403f",
      style: "drain",
    },
  ] as const satisfies readonly FishNetRecoveryStyleDefinition[];

  static readonly legacyMap = {
    buildFingerprint: LEGACY_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: this.verifiedSkillLabels,
    recoveryStyles: [],
  } as const satisfies FishNetSemanticMap;

  static readonly currentMap = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: [],
    recoveryStyles: this.currentRecoveryStyles,
  } as const satisfies FishNetSemanticMap;
}
