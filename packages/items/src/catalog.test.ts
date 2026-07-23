import { expect, test } from "bun:test";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import {
  FishNetItemDirectory,
  loadBundledItemCatalog,
  resolveFishNetItem,
} from "./catalog.ts";

test("loads a complete build-scoped item catalog", () => {
  const catalog = loadBundledItemCatalog();
  expect(catalog.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
  expect(countByType(catalog.items)).toEqual([280, 31, 647, 45, 327, 129, 1172]);
  expect(catalog.items.every((item) => item.id.length > 0 && item.displayName.length > 0)).toBe(true);
  expect(new Set(catalog.items.map((item) => `${item.itemType}\u0000${item.id}`)).size).toBe(catalog.items.length);

  const reloaded = loadBundledItemCatalog();
  expect(reloaded).not.toBe(catalog);
  expect(reloaded.items).not.toBe(catalog.items);
});

test("resolves duplicate ids independently by item type", () => {
  const directory = new FishNetItemDirectory({
    buildFingerprint: "synthetic-build",
    items: [
      { itemType: 0, id: "item-example", displayName: "Example Material" },
      { itemType: 4, id: "item-example", displayName: "Example Card" },
    ],
  });
  expect(directory.require(0, "item-example").displayName).toBe("Example Material");
  expect(directory.require(4, "item-example").displayName).toBe("Example Card");
  expect(directory.resolve(2, "item-example")).toBeUndefined();
  expect(resolveFishNetItem(2, "Axe")?.substatGroup).toBe("Melee");
  expect(resolveFishNetItem(2, "Axe")?.weight).toBe(50);
  expect(resolveFishNetItem(2, "Sword")?.weight).toBe(30);
  expect(resolveFishNetItem(2, "ArcaneFeet")?.weight).toBe(20);
  expect(resolveFishNetItem(2, "3D Glasses")?.weight).toBe(10);
});

test("includes standard artifact effects and refine scaling", () => {
  expect(resolveFishNetItem(3, "Vampiric")).toMatchObject({
    artifactSet: {
      requiredPieces: 4,
      perPiece: [{ type: 98, value: 3 }],
      fullSet: expect.arrayContaining([{ type: 98, value: 3 }]),
    },
    refineEffects: [{ type: 98, value: 0.125 }],
  });
});

test("keeps class-rune skill effects bound to their artifact slots", () => {
  expect(resolveFishNetItem(3, "Warrior")).toMatchObject({
    artifactSlotEffects: {
      Rune: [{ type: 49, value: 5, target: { kind: "skill", id: "Bash" } }],
      Jewel: [{ type: 49, value: 5, target: { kind: "skill", id: "AxeArc" } }],
    },
  });
});

test("includes gem base and per-refine skill damage", () => {
  expect(resolveFishNetItem(5, "Bash Gem")).toMatchObject({
    refineEffects: [{ type: 49, value: 2, target: { kind: "skill", id: "Bash" } }],
  });
});

test("preserves status and elemental targets separately from skills", () => {
  expect(resolveFishNetItem(4, "Alien Biteroot")).toMatchObject({
    effects: [{ type: 26, value: 50, target: { kind: "status", id: "Bleeding" } }],
  });
  expect(resolveFishNetItem(2, "Spooky Spell Hat")).toMatchObject({
    effects: expect.arrayContaining([{ type: 44, value: 10, target: { kind: "element", id: "Shadow" } }]),
  });
});

function countByType(items: readonly { itemType: number }[]): number[] {
  return Array.from({ length: 7 }, (_, type) => items.filter((item) => item.itemType === type).length);
}
