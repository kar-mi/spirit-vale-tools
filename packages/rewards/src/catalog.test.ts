import { expect, test } from "bun:test";
import { loadBundledMobRewardCatalog, queryMobRewardCatalog } from "./catalog.ts";

test("loads a complete build-scoped mob reward catalog", () => {
  const catalog = loadBundledMobRewardCatalog();
  expect(catalog.mobs.length).toBeGreaterThanOrEqual(300);
  expect(catalog.experienceRequirements.length).toBeGreaterThanOrEqual(150);
  expect(catalog.experienceRequirements.every((requirement) => requirement > 0)).toBe(true);
  expect(new Set(catalog.mobs.map((mob) => mob.id)).size).toBe(catalog.mobs.length);
  expect(catalog.mobs.every((mob) => mob.level > 0 && mob.baseExperience >= 0 && mob.baseCoins >= 0)).toBe(true);
  expect(queryMobRewardCatalog(catalog, { minLevel: 10, maxLevel: 10 }).every((mob) => mob.level === 10)).toBe(true);
});
