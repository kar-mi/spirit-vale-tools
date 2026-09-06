import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";
import { StatusCatalogDefinitions } from "./definitions/index.ts";

export interface FishNetStatusEffect {
  readonly id: string;
  readonly duration: number;
  readonly durationPerLevel: number;
  readonly chance: number;
  readonly chancePerLevel: number;
  readonly stacks: number;
  readonly stacksPerLevel: number;
}

export interface FishNetStatusDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly spriteId?: string;
  readonly isDebuff: boolean;
  readonly maxLevel: number;
  readonly fixedDuration: boolean;
  readonly effects: readonly FishNetStatusEffect[];
  /** Flat per-tick damage coefficient (`config.Damage`); present only for damaging statuses. */
  readonly damage?: number;
  /** Percent-of-target per-tick damage (`config.DamagePerc`); present only for damaging statuses. */
  readonly damagePerc?: number;
  /** Element id the ticks deal (`config.Element`, 0 = physical); present only for damaging statuses. */
  readonly element?: number;
  /**
   * Skill and coating/enchant status ids observed to apply this status, from the data-mine
   * grant graph. Present only for damaging statuses, where it drives DPS-meter attribution.
   */
  readonly appliedBy?: readonly string[];
}

export interface FishNetStatusCatalog {
  readonly buildFingerprint: string;
  readonly statuses: readonly FishNetStatusDefinition[];
}

const BUNDLED_CATALOG = StatusCatalogDefinitions.catalog;

export function loadBundledStatusCatalog(
  buildFingerprint = CURRENT_GAME_BUILD_FINGERPRINT,
): FishNetStatusCatalog {
  if (buildFingerprint !== BUNDLED_CATALOG.buildFingerprint) {
    throw new Error(`unknown status catalog build ${JSON.stringify(buildFingerprint)}`);
  }
  return cloneCatalog(BUNDLED_CATALOG);
}

export class FishNetStatusDirectory {
  private readonly definitions = new Map<string, FishNetStatusDefinition>();

  constructor(catalog: FishNetStatusCatalog = loadBundledStatusCatalog()) {
    for (const definition of catalog.statuses) {
      if (this.definitions.has(definition.id)) {
        throw new Error(`duplicate status definition ${JSON.stringify(definition.id)}`);
      }
      this.definitions.set(definition.id, cloneDefinition(definition));
    }
  }

  resolve(statusId: string | null | undefined): FishNetStatusDefinition | undefined {
    const definition = statusId === null || statusId === undefined ? undefined : this.definitions.get(statusId);
    return definition ? cloneDefinition(definition) : undefined;
  }

  require(statusId: string): FishNetStatusDefinition {
    const definition = this.resolve(statusId);
    if (!definition) throw new Error(`unknown status definition ${JSON.stringify(statusId)}`);
    return definition;
  }
}

const BUNDLED_DIRECTORY = new FishNetStatusDirectory(BUNDLED_CATALOG);

export function resolveFishNetStatus(statusId: string | null | undefined): FishNetStatusDefinition | undefined {
  return BUNDLED_DIRECTORY.resolve(statusId);
}

export function requireFishNetStatus(statusId: string): FishNetStatusDefinition {
  return BUNDLED_DIRECTORY.require(statusId);
}

/**
 * Seconds a status lasts at the given level, or `undefined` when the catalog has no
 * duration data for it (many entries are permanent auras/markers with no StatusEffects row).
 */
export function statusDurationSeconds(
  definition: FishNetStatusDefinition | undefined,
  level: number,
): number | undefined {
  const effect = definition?.effects.find((candidate) => candidate.id === definition.id)
    ?? definition?.effects[0];
  if (!effect) return undefined;
  if (definition!.fixedDuration) return effect.duration;
  const effectiveLevel = Math.max(1, level);
  return effect.duration + effectiveLevel * effect.durationPerLevel;
}

/** Whether a status deals positive damage to its bearer on each tick. */
export function isDamagingStatus(definition: FishNetStatusDefinition | undefined): boolean {
  return definition !== undefined && ((definition.damage ?? 0) > 0 || (definition.damagePerc ?? 0) > 0);
}

function cloneDefinition(definition: FishNetStatusDefinition): FishNetStatusDefinition {
  return {
    ...definition,
    effects: definition.effects.map((effect) => ({ ...effect })),
    ...(definition.appliedBy ? { appliedBy: [...definition.appliedBy] } : {}),
  };
}

function cloneCatalog(catalog: FishNetStatusCatalog): FishNetStatusCatalog {
  return { ...catalog, statuses: catalog.statuses.map(cloneDefinition) };
}
