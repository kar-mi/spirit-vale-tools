import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import { findSyncType } from "./rpc-resolution.ts";

/**
 * These two behaviours' syncvar names come from observation rather than game metadata:
 * `HealthComponent` index 0 reconciles against accumulated damage and healing on ~91% of updates in
 * a live capture, index 1 is written alongside it on spawn and on a full restore, and mana mirrors
 * the layout. `packages/character/src/record-decoder.ts` has read all four positionally for some
 * time and would go quiet if the indexes ever moved, so pin them here too.
 */
describe("bundled syncvar names", () => {
  const map = loadBundledFishNetRpcMap();

  test.each([
    ["HealthComponent", 0, "CurrentHealth"],
    ["HealthComponent", 1, "MaxHealth"],
    ["SkillsComponent", 0, "CurrentMana"],
    ["SkillsComponent", 1, "MaxMana"],
  ])("%s syncvar %i is %s", (behaviour, index, name) => {
    expect(findSyncType(map, behaviour as string, index as number)).toMatchObject({
      name,
      codec: "packedInt32",
    });
  });

  test("does not invent names for indexes we have not established", () => {
    expect(findSyncType(map, "HealthComponent", 2)).toBeUndefined();
    expect(findSyncType(map, "CombatComponent", 0)).toBeUndefined();
  });
});
