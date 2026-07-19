import type { FishNetItemCatalog } from "../catalog.ts";
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
    buildFingerprint: "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4",
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
