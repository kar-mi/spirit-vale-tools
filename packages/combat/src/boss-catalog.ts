import type { FishNetBossCatalog } from "./combat-tracker.ts";

/** Makes the deliberately small, manually maintained boss registry explicit at each call site. */
export function createBossCatalog(entries: Readonly<Record<string, string>>): FishNetBossCatalog {
  const catalog = new Map(Object.entries(entries).map(([skillId, displayName]) => [skillId, { displayName }]));
  return catalog;
}

/** Registry for the bundled game build. */
export const CURRENT_BOSS_SKILL_NAMES = createBossCatalog({});
