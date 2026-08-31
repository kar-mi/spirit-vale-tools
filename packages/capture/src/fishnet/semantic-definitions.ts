import type { FishNetSemanticMap } from "./semantic-map.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "../game-build.ts";

export class FishNetSemanticDefinitions {
  private constructor() {}

  static readonly currentMap = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    verifiedSkillLabels: [],
  } as const satisfies FishNetSemanticMap;
}
