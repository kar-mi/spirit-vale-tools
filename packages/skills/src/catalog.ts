import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import { SkillCatalogDefinitions } from "./definitions/index.ts";

export type FishNetSkillKind = "active" | "passive" | "mastery";

export interface FishNetSkillEffect {
  readonly type: number;
  readonly value: number;
  readonly valuePerLevel?: number;
  readonly label?: string;
}

export interface FishNetSkillDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly kinds: readonly FishNetSkillKind[];
  readonly effects?: readonly FishNetSkillEffect[];
}

export interface FishNetSkillCatalog {
  readonly buildFingerprint: string;
  readonly skills: readonly FishNetSkillDefinition[];
}

const BUNDLED_CATALOG = SkillCatalogDefinitions.catalog;

export function loadBundledSkillCatalog(
  buildFingerprint = CURRENT_GAME_BUILD_FINGERPRINT,
): FishNetSkillCatalog {
  if (buildFingerprint !== BUNDLED_CATALOG.buildFingerprint) {
    throw new Error(`unknown skill catalog build ${JSON.stringify(buildFingerprint)}`);
  }
  return cloneCatalog(BUNDLED_CATALOG);
}

export class FishNetSkillDirectory {
  private readonly definitions = new Map<string, FishNetSkillDefinition>();

  constructor(catalog: FishNetSkillCatalog = loadBundledSkillCatalog()) {
    for (const definition of catalog.skills) {
      if (this.definitions.has(definition.id)) {
        throw new Error(`duplicate skill definition ${JSON.stringify(definition.id)}`);
      }
      this.definitions.set(definition.id, cloneDefinition(definition));
    }
  }

  resolve(skillId: string | null | undefined): FishNetSkillDefinition | undefined {
    const definition = skillId === null || skillId === undefined ? undefined : this.definitions.get(skillId);
    return definition ? cloneDefinition(definition) : undefined;
  }

  require(skillId: string): FishNetSkillDefinition {
    const definition = this.resolve(skillId);
    if (!definition) throw new Error(`unknown skill definition ${JSON.stringify(skillId)}`);
    return definition;
  }
}

const BUNDLED_DIRECTORY = new FishNetSkillDirectory(BUNDLED_CATALOG);

export function resolveFishNetSkill(skillId: string | null | undefined): FishNetSkillDefinition | undefined {
  return BUNDLED_DIRECTORY.resolve(skillId);
}

export function resolveFishNetSkillDisplayName(skillId: string | null | undefined): string | undefined {
  return resolveFishNetSkill(skillId)?.displayName;
}

export function requireFishNetSkill(skillId: string): FishNetSkillDefinition {
  return BUNDLED_DIRECTORY.require(skillId);
}

function cloneDefinition(definition: FishNetSkillDefinition): FishNetSkillDefinition {
  return { ...definition, kinds: definition.kinds.slice(), ...(definition.effects ? { effects: definition.effects.map((effect) => ({ ...effect })) } : {}) };
}

function cloneCatalog(catalog: FishNetSkillCatalog): FishNetSkillCatalog {
  return { ...catalog, skills: catalog.skills.map(cloneDefinition) };
}
