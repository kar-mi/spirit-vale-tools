import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import type { FishNetSkillCatalog } from "../catalog.ts";
import { SkillDefinitions } from "./skills.ts";

export class SkillCatalogDefinitions {
  private constructor() {}

  static readonly catalog = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    skills: SkillDefinitions.values,
  } as const satisfies FishNetSkillCatalog;
}
