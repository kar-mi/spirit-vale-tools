import type { FishNetBossCatalog } from "../events/combat-events.ts";

/** Makes the deliberately small, manually maintained boss registry explicit at each call site. */
export function createBossCatalog(entries: Readonly<Record<string, string>>): FishNetBossCatalog {
  const catalog = new Map(Object.entries(entries).map(([skillId, displayName]) => [skillId, { displayName }]));
  return catalog;
}
