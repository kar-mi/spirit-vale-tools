import type {
  FishNetRecoveryStyleDefinition,
  FishNetSemanticMap,
} from "./semantic-map.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "../game-build.ts";

export class FishNetSemanticDefinitions {
  private constructor() {}

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

  static readonly currentMap = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: [],
    recoveryStyles: this.currentRecoveryStyles,
  } as const satisfies FishNetSemanticMap;
}
