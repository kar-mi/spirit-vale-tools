import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
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

export interface FishNetItemEffectTarget {
  readonly kind: "element" | "skill" | "status";
  readonly id: string;
}

/** A stat contribution supplied by an item's innate effect. */
export interface FishNetItemEffect {
  readonly type: number;
  readonly value: number;
  /** Optional entity named by this stat; its meaning is determined by `kind`. */
  readonly target?: FishNetItemEffectTarget;
}

export interface FishNetArtifactSetEffects {
  readonly requiredPieces: number;
  /** Set effects applied once whenever at least one matching piece is equipped. */
  readonly perPieceBase: readonly FishNetItemEffect[];
  /** Set effects repeated for every matching equipped artifact. */
  readonly perPiece: readonly FishNetItemEffect[];
  readonly fullSet: readonly FishNetItemEffect[];
}

export type FishNetArtifactSlot = "Rune" | "Jewel" | "Scroll" | "Relic";

export interface FishNetItemDefinition {
  readonly itemType: FishNetItemType;
  readonly id: string;
  readonly displayName: string;
  /** Per-item inventory weight when this item category uses a fixed weight. */
  readonly weight?: number;
  readonly substatGroup?: FishNetItemSubstatGroup;
  readonly effects?: readonly FishNetItemEffect[];
  /** Effects added once for every refine level on this item. */
  readonly refineEffects?: readonly FishNetItemEffect[];
  /** Set-count effects for artifact definitions. */
  readonly artifactSet?: FishNetArtifactSetEffects;
  /** Individual artifact effects keyed by the artifact slot they belong to. */
  readonly artifactSlotEffects?: Partial<Record<FishNetArtifactSlot, readonly FishNetItemEffect[]>>;
  readonly artifactSlotRefineEffects?: Partial<Record<FishNetArtifactSlot, readonly FishNetItemEffect[]>>;
}

export interface FishNetEquipmentItemDefinition extends FishNetItemDefinition {
  readonly itemType: 2;
  /** Inventory weight used by the game for one copy of this equipment item. */
  readonly weight: number;
}

export interface FishNetItemCatalog {
  readonly buildFingerprint: string;
  readonly items: readonly FishNetItemDefinition[];
}

const BUNDLED_CATALOG = ItemCatalogDefinitions.catalog;

export function loadBundledItemCatalog(
  buildFingerprint = CURRENT_GAME_BUILD_FINGERPRINT,
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
