import { describe, expect, test } from "bun:test";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import {
  FishNetSkillDirectory,
  loadBundledSkillCatalog,
  resolveFishNetSkill,
  resolveFishNetSkillDisplayName,
} from "./catalog.ts";
import type { FishNetSkillCatalog } from "./catalog.ts";

const SYNTHETIC_CATALOG: FishNetSkillCatalog = {
  buildFingerprint: "synthetic-build",
  skills: [{ id: "SyntheticFocus", displayName: "Synthetic Focus", kinds: ["passive", "mastery"] }],
};

describe("FishNetSkillDirectory", () => {
  test("loads the current reduced catalog", () => {
    const catalog = loadBundledSkillCatalog();
    expect(catalog.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
    expect(catalog.skills).toHaveLength(390);
    expect(resolveFishNetSkillDisplayName(catalog.skills[0]?.id)).toBe(catalog.skills[0]?.displayName);
    expect(() => loadBundledSkillCatalog("fictional-build")).toThrow("unknown skill catalog build");
  });

  test("resolves synthetic definitions and returns defensive copies", () => {
    const directory = new FishNetSkillDirectory(SYNTHETIC_CATALOG);
    const first = directory.require("SyntheticFocus");
    expect(first).toEqual(SYNTHETIC_CATALOG.skills[0]!);
    expect(first).not.toBe(SYNTHETIC_CATALOG.skills[0]!);
    expect(first.kinds).not.toBe(SYNTHETIC_CATALOG.skills[0]?.kinds);
    expect(directory.resolve("MissingSkill")).toBeUndefined();
    expect(() => directory.require("MissingSkill")).toThrow("unknown skill definition");
  });

  test("rejects duplicate synthetic IDs", () => {
    expect(() => new FishNetSkillDirectory({
      buildFingerprint: "synthetic-build",
      skills: [SYNTHETIC_CATALOG.skills[0]!, SYNTHETIC_CATALOG.skills[0]!],
    })).toThrow("duplicate skill definition");
  });

  test("includes extracted per-level passive effects", () => {
    expect(resolveFishNetSkill("Multistrike")).toMatchObject({
      displayName: "Multistrike",
      effects: [{ type: 80, value: 0, valuePerLevel: 10 }],
    });
  });
});
