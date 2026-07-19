import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "@spiritvale/core";
import { ItemCatalogDefinitions } from "./definitions/index.ts";

export type FishNetItemType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type FishNetItemSubstatGroup =
  | "Accessory"
  | "Chest"
  | "Feet"
  | "Headgear"
  | "Legs"
  | "Magic"
  | "Melee"
  | "Ranged"
  | "Artifact";

export interface FishNetItemDefinition {
  readonly itemType: FishNetItemType;
  readonly id: string;
  readonly displayName: string;
  readonly substatGroup?: FishNetItemSubstatGroup;
}

export interface FishNetEquipmentItemDefinition extends FishNetItemDefinition {
  readonly itemType: 2;
}

export interface FishNetItemCatalog {
  readonly buildFingerprint: string;
  readonly items: readonly FishNetItemDefinition[];
}

const BUNDLED_CATALOG = ItemCatalogDefinitions.catalog;

export function loadBundledItemCatalog(
  buildFingerprint = CURRENT_FISHNET_BUILD_FINGERPRINT,
): FishNetItemCatalog {
  if (buildFingerprint !== BUNDLED_CATALOG.buildFingerprint) {
    throw new Error(`unknown item catalog build ${JSON.stringify(buildFingerprint)}`);
  }
  return {
    buildFingerprint: BUNDLED_CATALOG.buildFingerprint,
    items: BUNDLED_CATALOG.items.map((item) => ({ ...item })),
  };
}

export class FishNetItemDirectory {
  private readonly definitions = new Map<string, FishNetItemDefinition>();

  constructor(catalog: FishNetItemCatalog = loadBundledItemCatalog()) {
    for (const definition of catalog.items) {
      const key = itemKey(definition.itemType, definition.id);
      if (this.definitions.has(key)) {
        throw new Error(`duplicate item definition for type ${definition.itemType} ${JSON.stringify(definition.id)}`);
      }
      this.definitions.set(key, definition);
    }
  }

  resolve(itemType: number, itemId: string | null | undefined): FishNetItemDefinition | undefined {
    return itemId === null || itemId === undefined
      ? undefined
      : this.definitions.get(itemKey(itemType, itemId));
  }

  require(itemType: number, itemId: string): FishNetItemDefinition {
    const definition = this.resolve(itemType, itemId);
    if (!definition) throw new Error(`unknown item definition for type ${itemType} ${JSON.stringify(itemId)}`);
    return definition;
  }
}

const BUNDLED_DIRECTORY = new FishNetItemDirectory(BUNDLED_CATALOG);

export function resolveFishNetItem(itemType: number, itemId: string | null | undefined): FishNetItemDefinition | undefined {
  return BUNDLED_DIRECTORY.resolve(itemType, itemId);
}

export function resolveFishNetItemDisplayName(itemType: number, itemId: string | null | undefined): string | undefined {
  return resolveFishNetItem(itemType, itemId)?.displayName;
}

export function requireFishNetItem(itemType: number, itemId: string): FishNetItemDefinition {
  return BUNDLED_DIRECTORY.require(itemType, itemId);
}

function itemKey(itemType: number, itemId: string): string {
  return `${itemType}\u0000${itemId}`;
}
