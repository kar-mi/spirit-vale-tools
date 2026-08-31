import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./bundled-rpc-map.ts";
import { findSyncType } from "./rpc-map.ts";

describe("bundled syncvar names", () => {
  const map = loadBundledFishNetRpcMap();

  test.each([
    ["HealthComponent", 0, "healthSync"],
    ["HealthComponent", 1, "maxHealthSync"],
    ["HealthComponent", 2, "barrierSync"],
    ["HealthComponent", 3, "overhealSync"],
    ["SkillsComponent", 0, "manaSync"],
    ["SkillsComponent", 1, "maxManaSync"],
    ["SkillsComponent", 2, "BondSync"],
    ["CombatComponent", 0, "CombatData"],
    ["CombatComponent", 1, "SpeedRank"],
    ["CombatComponent", 2, "SessionReady"],
    ["PlayerSave", 0, "PlayerIdSync"],
    ["PlayerSave", 1, "ArenaRating"],
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

  test("retains the build-derived BondSync relationship layout", () => {
    expect(findSyncType(map, "SkillsComponent", 2)).toMatchObject({
      name: "BondSync",
      fields: [{
        name: "Entries",
        repeated: true,
        fields: [
          { name: "Other", codec: "networkObject" },
          { name: "SkillId", codec: "stringUtf8Packed" },
          { name: "Caster", codec: "boolean" },
        ],
      }],
    });
  });
});
