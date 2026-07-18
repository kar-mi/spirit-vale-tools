import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "@spiritvale/core";
import bundledData from "./maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.rewards.json" with { type: "json" };

export type MobDropCategory = "equipment" | "artifact" | "card" | "gem" | "material" | "consumable" | "cosmetic";

export interface MobDropDefinition {
  category: MobDropCategory;
  itemId: string;
  itemName: string;
  count: number;
  chance: number;
}

export interface MobRewardDefinition {
  id: string;
  displayName: string;
  level: number;
  boss: boolean;
  baseExperience: number;
  baseCoins: number;
  drops: MobDropDefinition[];
}

export interface MobRewardCatalog {
  schemaVersion: 1;
  buildFingerprint: string;
  experienceRequirements: number[];
  mobs: MobRewardDefinition[];
}

export interface MobRewardCatalogQuery {
  text?: string;
  minLevel?: number;
  maxLevel?: number;
  boss?: boolean;
}

const BUNDLED_CATALOG: MobRewardCatalog = {
  schemaVersion: 1,
  buildFingerprint: CURRENT_FISHNET_BUILD_FINGERPRINT,
  // The serialized table is fixed-width and its unused tail contains signed
  // overflow sentinels. Keep only real positive level requirements.
  experienceRequirements: bundledData.experienceRequirements.filter((requirement) => requirement > 0),
  // Some game configurations are templates or other non-combat records with
  // no usable level. They cannot produce meaningful XP/coin estimates.
  mobs: (bundledData.mobs as MobRewardDefinition[]).filter((mob) => Number.isInteger(mob.level) && mob.level > 0),
};

export function loadBundledMobRewardCatalog(buildFingerprint = CURRENT_FISHNET_BUILD_FINGERPRINT): MobRewardCatalog {
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
