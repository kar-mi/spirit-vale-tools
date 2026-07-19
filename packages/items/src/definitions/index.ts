import type { FishNetItemCatalog } from "../catalog.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import { ArtifactItemDefinitions } from "./artifacts.ts";
import { CardItemDefinitions } from "./cards.ts";
import { ConsumableItemDefinitions } from "./consumables.ts";
import { CosmeticItemDefinitions } from "./cosmetics.ts";
import { EquipmentItemDefinitions } from "./equipment.ts";
import { GemItemDefinitions } from "./gems.ts";
import { JunkItemDefinitions } from "./junks.ts";

export class ItemCatalogDefinitions {
  private constructor() {}

  static readonly catalog = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    items: [
      ...JunkItemDefinitions.values,
      ...ConsumableItemDefinitions.values,
      ...EquipmentItemDefinitions.values,
      ...ArtifactItemDefinitions.values,
      ...CardItemDefinitions.values,
      ...GemItemDefinitions.values,
      ...CosmeticItemDefinitions.values,
    ],
  } as const satisfies FishNetItemCatalog;
}
