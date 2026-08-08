import type { FishNetBossCatalog } from "./combat-tracker.ts";

/**
 * Makes the deliberately small, manually maintained boss registry explicit at each call site.
 * Do not add common skills here: a match assigns the name to every actor casting that skill.
 */
export function createBossCatalog(entries: Readonly<Record<string, string>>): FishNetBossCatalog {
  const catalog = new Map(Object.entries(entries).map(([skillId, displayName]) => [skillId, { displayName }]));
  return catalog;
}

/**
 * Registry for the bundled game build. Add only a distinctive boss skill once its canonical name
 * has been verified from the game; ordinary spawned monsters continue to use the mob catalog.
 */
export const CURRENT_BOSS_SKILL_NAMES = createBossCatalog({});
