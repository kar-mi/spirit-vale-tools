import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import { MobRewardCatalogDefinitions } from "./definitions/index.ts";

export type MobDropCategory = "equipment" | "artifact" | "card" | "gem" | "material" | "consumable" | "cosmetic";

export interface MobDropDefinition {
  readonly category: MobDropCategory;
  readonly itemId: string;
  readonly itemName: string;
  readonly count: number;
  readonly chance: number;
}

export interface MobRewardDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly level: number;
  readonly boss: boolean;
  readonly baseExperience: number;
  readonly baseCoins: number;
  readonly drops: readonly MobDropDefinition[];
}

export interface MobRewardCatalog {
  readonly buildFingerprint: string;
  readonly experienceRequirements: readonly number[];
  readonly mobs: readonly MobRewardDefinition[];
}

export interface MobRewardCatalogQuery {
  text?: string;
  minLevel?: number;
  maxLevel?: number;
  boss?: boolean;
}

const BUNDLED_CATALOG = MobRewardCatalogDefinitions.catalog;

export function loadBundledMobRewardCatalog(buildFingerprint = CURRENT_GAME_BUILD_FINGERPRINT): MobRewardCatalog {
  if (buildFingerprint !== BUNDLED_CATALOG.buildFingerprint) {
    throw new Error(`unknown mob reward catalog build ${JSON.stringify(buildFingerprint)}`);
  }
  return cloneCatalog(BUNDLED_CATALOG);
}

export function queryMobRewardCatalog(
  catalog: MobRewardCatalog,
  query: MobRewardCatalogQuery = {},
): MobRewardDefinition[] {
  const needle = query.text?.trim().toLocaleLowerCase() ?? "";
  return catalog.mobs
    .filter((mob) => !needle || mob.displayName.toLocaleLowerCase().includes(needle) || mob.id.toLocaleLowerCase().includes(needle))
    .filter((mob) => query.minLevel === undefined || mob.level >= query.minLevel)
    .filter((mob) => query.maxLevel === undefined || mob.level <= query.maxLevel)
    .filter((mob) => query.boss === undefined || mob.boss === query.boss)
    .sort((left, right) => left.level - right.level || left.displayName.localeCompare(right.displayName))
    .map(cloneMob);
}

function cloneCatalog(catalog: MobRewardCatalog): MobRewardCatalog {
  return {
    ...catalog,
    experienceRequirements: catalog.experienceRequirements.slice(),
    mobs: catalog.mobs.map(cloneMob),
  };
}

function cloneMob(mob: MobRewardDefinition): MobRewardDefinition {
  return { ...mob, drops: mob.drops.map((drop) => ({ ...drop })) };
}
