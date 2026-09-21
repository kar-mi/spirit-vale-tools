import { expect, test } from "bun:test";
import {
  BARRIER_SKILL_IDS,
  BARRIER_STATUS_IDS,
  COMBAT_SEMANTICS_BUILD_FINGERPRINT,
  DIRECT_HEALING_SKILL_IDS,
  REGENERATION_SKILL_IDS,
} from "./combat-semantics.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";

test("contains build-derived healing and barrier capabilities", () => {
  expect(COMBAT_SEMANTICS_BUILD_FINGERPRINT).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
  expect(DIRECT_HEALING_SKILL_IDS).toEqual(new Set(["Consecration", "DeathCoilSummon", "FieldHealing", "Heal", "HighHeal"]));
  expect(REGENERATION_SKILL_IDS).toEqual(new Set([
    "ConduitWater",
    "GuardianBond",
    "HealAll",
    "Sanctuary",
    "SanctuaryField",
    "Status_Regen",
  ]));
  expect(BARRIER_SKILL_IDS).toEqual(new Set(["Barrier", "CorpseBarrier", "EclipsingAegis", "RadiantWard"]));
  expect(BARRIER_STATUS_IDS).toEqual(new Set([
    "Barrier",
    "CorpseBarrier",
    "EclipsingAegis",
    "RadiantBulwark",
    "RadiantWard",
  ]));
});
