import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "@spiritvale/core";
import { FishNetItemDirectory } from "@spiritvale/items";
import type { FishNetItemType } from "@spiritvale/items";
import type { MobDropCategory, MobRewardCatalog, MobRewardDefinition } from "../catalog.ts";
import { ExperienceRequirementDefinitions } from "./experience-requirements.ts";
import { MobDefinitions } from "./mobs.ts";
import type { MobRewardSourceDefinition } from "./types.ts";

const ITEM_DIRECTORY = new FishNetItemDirectory();

export class MobRewardCatalogDefinitions {
  private constructor() {}

  static readonly catalog = {
    buildFingerprint: CURRENT_FISHNET_BUILD_FINGERPRINT,
    experienceRequirements: ExperienceRequirementDefinitions.values,
    mobs: MobDefinitions.values.map(enrichMob),
  } as const satisfies MobRewardCatalog;
}

function enrichMob(mob: MobRewardSourceDefinition): MobRewardDefinition {
  return {
    ...mob,
    drops: mob.drops.map((drop) => ({
      ...drop,
      itemName: ITEM_DIRECTORY.require(itemTypeFor(drop.category), drop.itemId).displayName,
    })),
  };
}

function itemTypeFor(category: MobDropCategory): FishNetItemType {
  switch (category) {
    case "material": return 0;
    case "consumable": return 1;
    case "equipment": return 2;
    case "artifact": return 3;
    case "card": return 4;
    case "gem": return 5;
    case "cosmetic": return 6;
  }
}
