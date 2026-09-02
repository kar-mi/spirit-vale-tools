import { describe, expect, test } from "bun:test";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";
import {
  FishNetStatusDirectory,
  loadBundledStatusCatalog,
  resolveFishNetStatus,
  statusDurationSeconds,
} from "./catalog.ts";
import type { FishNetStatusCatalog } from "./catalog.ts";

const SYNTHETIC_CATALOG: FishNetStatusCatalog = {
  buildFingerprint: "synthetic-build",
  statuses: [{
    id: "SyntheticBurn",
    displayName: "Synthetic Burn",
    isDebuff: true,
    maxLevel: 5,
    fixedDuration: false,
    effects: [{ id: "SyntheticIgnite", duration: 3, durationPerLevel: 1, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 }],
  }],
};

describe("FishNetStatusDirectory", () => {
  test("loads the bundled catalog", () => {
    const catalog = loadBundledStatusCatalog();
    expect(catalog.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
    expect(catalog.statuses.length).toBeGreaterThan(0);
    expect(() => loadBundledStatusCatalog("fictional-build")).toThrow("unknown status catalog build");
  });

  test("resolves known statuses with duration data ported from the data-mine", () => {
    expect(resolveFishNetStatus("Bleeding")).toMatchObject({ displayName: "Bleeding", isDebuff: true });
  });

  test("preserves the current source classifications for statuses", () => {
    for (const id of ["Stun", "Blind", "Silence", "Slow", "Frozen", "Curse", "ArmorBreak", "Weaken", "Vulnerability"]) {
      expect(resolveFishNetStatus(id)).toMatchObject({ isDebuff: false });
    }
    expect(resolveFishNetStatus("Bleeding")).toMatchObject({ isDebuff: true });
  });

  test("keeps self-cast buffs with drawbacks classified as buffs", () => {
    for (const id of ["Berserk", "Counter", "Cloaking", "Taunt", "HighGuard"]) {
      expect(resolveFishNetStatus(id)).toMatchObject({ isDebuff: false });
    }
  });

  test("tracks the current grenade and class statuses", () => {
    expect(resolveFishNetStatus("ExplosiveGrenade")).toMatchObject({ displayName: "Explosive Grenade" });
    expect(resolveFishNetStatus("FrostBite")).toMatchObject({ displayName: "Frost Bite", isDebuff: true });
    expect(resolveFishNetStatus("Resolve")).toMatchObject({ displayName: "Resolve" });
    expect(resolveFishNetStatus("LauncherBoost")).toBeUndefined();
    expect(resolveFishNetStatus("LauncherPoison")).toBeUndefined();
  });

  test("resolves synthetic definitions and returns defensive copies", () => {
    const directory = new FishNetStatusDirectory(SYNTHETIC_CATALOG);
    const first = directory.require("SyntheticBurn");
    expect(first).toEqual(SYNTHETIC_CATALOG.statuses[0]!);
    expect(first).not.toBe(SYNTHETIC_CATALOG.statuses[0]!);
    expect(first.effects).not.toBe(SYNTHETIC_CATALOG.statuses[0]?.effects);
    expect(directory.resolve("MissingStatus")).toBeUndefined();
    expect(() => directory.require("MissingStatus")).toThrow("unknown status definition");
  });

  test("rejects duplicate synthetic IDs", () => {
    expect(() => new FishNetStatusDirectory({
      buildFingerprint: "synthetic-build",
      statuses: [SYNTHETIC_CATALOG.statuses[0]!, SYNTHETIC_CATALOG.statuses[0]!],
    })).toThrow("duplicate status definition");
  });
});

describe("statusDurationSeconds", () => {
  test("scales duration by level for non-fixed statuses", () => {
    const definition = SYNTHETIC_CATALOG.statuses[0]!;
    expect(statusDurationSeconds(definition, 1)).toBe(4);
    expect(statusDurationSeconds(definition, 4)).toBe(7);
  });

  test("ignores level for fixed-duration statuses", () => {
    const definition = { ...SYNTHETIC_CATALOG.statuses[0]!, fixedDuration: true };
    expect(statusDurationSeconds(definition, 1)).toBe(3);
    expect(statusDurationSeconds(definition, 10)).toBe(3);
  });

  test("returns undefined when no duration data exists", () => {
    expect(statusDurationSeconds({ id: "X", displayName: "X", isDebuff: false, maxLevel: 0, fixedDuration: false, effects: [] }, 1))
      .toBeUndefined();
    expect(statusDurationSeconds(undefined, 1)).toBeUndefined();
  });

  test("resolves durations for statuses ported via the data-mine aggregation script", () => {
    for (const id of ["Stun", "Rage", "Bleeding", "Frozen"]) {
      const duration = statusDurationSeconds(resolveFishNetStatus(id), 1);
      expect(duration).not.toBeUndefined();
      expect(duration).toBeGreaterThan(0);
    }
    expect(statusDurationSeconds(resolveFishNetStatus("Spinning"), 1)).toBe(0);
  });

  test("resolves ComboReady/CastReady from their dedicated scalar fields, not StatusEffects rows", () => {
    for (const id of ["ComboReady", "CastReady"]) {
      expect(statusDurationSeconds(resolveFishNetStatus(id), 1)).toBe(4);
    }
  });

  test("uses each status's self-granted duration before an unrelated leading effect", () => {
    expect(statusDurationSeconds(resolveFishNetStatus("EnchantPoison"), 3)).toBe(180);
    expect(statusDurationSeconds(resolveFishNetStatus("VenomCoating"), 5)).toBe(300);
    expect(statusDurationSeconds(resolveFishNetStatus("Haste"), 5)).toBe(300);
  });

  test("retains every differently-named skill that refreshes ready statuses", () => {
    expect(resolveFishNetStatus("ComboReady")?.effects.map((effect) => effect.id))
      .toEqual(expect.arrayContaining(["AerialShot", "VenomStrike", "WildCharge"]));
    expect(resolveFishNetStatus("CastReady")?.effects.map((effect) => effect.id))
      .toEqual(expect.arrayContaining(["ShadowFeint", "ShadowSeal"]));
  });

  test("leaves explicit toggles and placeholder-duration buffs without computed timers", () => {
    for (const id of ["Focus", "Might", "Fury", "Berserk", "HighGuard", "Elusive"]) {
      expect(statusDurationSeconds(resolveFishNetStatus(id), 1)).toBeUndefined();
    }
  });
});
