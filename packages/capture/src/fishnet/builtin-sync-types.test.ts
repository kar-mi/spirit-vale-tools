import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import { findSyncType } from "./rpc-resolution.ts";

/**
 * `HealthComponent` index 0/1 and `SkillsComponent` index 0/1 keep hand-verified names instead of
 * the data-mine's raw reflected field names: index 0 reconciles against accumulated damage and
 * healing on ~91% of updates in a live capture, index 1 is written alongside it on spawn and on a
 * full restore, and mana mirrors the layout. `packages/character/src/record-decoder.ts` has read
 * all four positionally for some time and would go quiet if the indexes ever moved, so pin them
 * here too. Every other index below (including `HealthComponent` 2/3 and `SkillsComponent` 2) is
 * the data-mine's own extracted name, not hand-verified against captures.
 */
describe("bundled syncvar names", () => {
  const map = loadBundledFishNetRpcMap();

  test.each([
    ["HealthComponent", 0, "CurrentHealth"],
    ["HealthComponent", 1, "MaxHealth"],
    ["SkillsComponent", 0, "CurrentMana"],
    ["SkillsComponent", 1, "MaxMana"],
  ])("%s syncvar %i is %s (hand-verified)", (behaviour, index, name) => {
    expect(findSyncType(map, behaviour as string, index as number)).toMatchObject({
      name,
      codec: "packedInt32",
    });
  });

  test.each([
    ["HealthComponent", 2, "barrierSync"],
    ["HealthComponent", 3, "overhealSync"],
    ["SkillsComponent", 2, "BondSync"],
    ["CombatComponent", 0, "CombatData"],
    ["CombatComponent", 1, "SpeedRank"],
    ["CombatComponent", 2, "SessionReady"],
  ])("%s syncvar %i is %s (data-mine extracted)", (behaviour, index, name) => {
    expect(findSyncType(map, behaviour as string, index as number)).toMatchObject({ name });
  });

  test("does not invent names for indexes no build has ever declared", () => {
    expect(findSyncType(map, "HealthComponent", 99)).toBeUndefined();
    expect(findSyncType(map, "BaseUnitController", 0)).toBeUndefined();
  });

  test("retains the build-derived LootDrop DTO and lock layouts", () => {
    expect(findSyncType(map, "LootDrop", 0)).toMatchObject({
      name: "Dto",
      fields: [
        { name: "DisplayName", codec: "stringUtf8Packed" },
        { name: "SpriteId", codec: "stringUtf8Packed" },
        { name: "Rarity", codec: "packedInt32" },
        { name: "Scale", codec: "float32" },
        { name: "LootChance", codec: "float32" },
        { name: "LootType", codec: "packedInt32" },
      ],
    });
    expect(findSyncType(map, "LootDrop", 1)).toMatchObject({
      name: "Lock",
      fields: [
        { name: "ExpireAt", codec: "packedInt64" },
        { name: "PartyId", codec: "packedInt32" },
        { name: "PlayerId", codec: "stringUtf8Packed" },
      ],
    });
  });
});
