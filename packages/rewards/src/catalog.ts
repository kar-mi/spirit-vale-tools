import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";
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

/** Minimal combat identity metadata, including non-reward targets omitted from the reward catalog. */
export interface MobIdentityDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly level: number;
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

/**
 * The catalog keyed by mob id. Satisfies the combat tracker's `FishNetMonsterCatalog`, which is how
 * combat names the monsters it sees spawn without depending on this package.
 */
export function mobDefinitionsById(
  catalog: MobRewardCatalog = loadBundledMobRewardCatalog(),
): Map<string, MobRewardDefinition> {
  return new Map(catalog.mobs.map((mob) => [mob.id, mob]));
}

const NON_REWARD_MOB_IDENTITIES: readonly MobIdentityDefinition[] = [
  { id: "Target Dummy", displayName: "Bullseye", level: 0 },
  { id: "NightmareShadow", displayName: "Curse Manifestation", level: 0 },
  { id: "Devil Bat", displayName: "Fire Bat", level: 0 },
  { id: "Devil Hell", displayName: "Hell Bat", level: 0 },
  { id: "Devil Hades", displayName: "Inferno Bat", level: 0 },
  { id: "Training Dummy", displayName: "Sandbag", level: 0 },
  { id: "Practice Dummy", displayName: "Straw Dummy", level: 0 },
];

/** Complete datamine-backed identity catalog for combat decoding; reward eligibility remains unchanged. */
export function mobIdentityDefinitionsById(
  catalog: MobRewardCatalog = loadBundledMobRewardCatalog(),
): Map<string, MobIdentityDefinition> {
  return new Map<string, MobIdentityDefinition>([
    ...catalog.mobs.map((mob) => [mob.id, { id: mob.id, displayName: mob.displayName, level: mob.level }] as const),
    ...NON_REWARD_MOB_IDENTITIES.map((mob) => [mob.id, { ...mob }] as const),
  ]);
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
