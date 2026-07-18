import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "@spiritvale/core";
import type { MobRewardCatalog } from "../catalog.ts";
import { ExperienceRequirementDefinitions } from "./experience-requirements.ts";
import { MobDefinitions } from "./mobs.ts";

export class MobRewardCatalogDefinitions {
  private constructor() {}

  static readonly catalog = {
    buildFingerprint: CURRENT_FISHNET_BUILD_FINGERPRINT,
    experienceRequirements: ExperienceRequirementDefinitions.values,
    mobs: MobDefinitions.values,
  } as const satisfies MobRewardCatalog;
}
