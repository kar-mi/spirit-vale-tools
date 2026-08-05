import { expect, test } from "bun:test";
import {
  ATTRIBUTE_SUBSTAT_CAP,
  EQUIP_SLOTS,
  EQUIP_SLOT_SUBSTAT_GROUPS,
  SUBSTAT_CAPS,
  substatScaledValue,
} from "./substat-caps.ts";

test("scales a roll against its cap the way the client rounds it", () => {
  expect(substatScaledValue(5, 93)).toBe(5);
  expect(substatScaledValue(10, 73)).toBe(9);
  expect(substatScaledValue(3, 0)).toBe(2);
  expect(substatScaledValue(3, 100)).toBe(3);
  // Reductions round away from zero rather than toward negative infinity.
  expect(substatScaledValue(-10, 50)).toBe(-8);
  expect(substatScaledValue(-5, 0)).toBe(-3);
});

test("rolls every armour slot from the pool its slot names", () => {
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Head")]).toBe("Headgear");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Legs")]).toBe("Legs");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Feet")]).toBe("Feet");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Chest")]).toBe("Chest");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Left accessory")]).toBe("Accessory");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Right accessory")]).toBe("Accessory");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Eyewear")]).toBe("Headgear");
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Back")]).toBe("Headgear");
});

test("leaves the weapon slots to the weapon's own substat group", () => {
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Main hand")]).toBeUndefined();
  expect(EQUIP_SLOT_SUBSTAT_GROUPS[EQUIP_SLOTS.indexOf("Off hand")]).toBeUndefined();
});

test("caps the shared substats consistently across pools", () => {
  expect(ATTRIBUTE_SUBSTAT_CAP).toBe(3);
  // Crit (15) on a melee weapon against the same stat on an accessory.
  expect(SUBSTAT_CAPS.Melee[15]).toBe(10);
  expect(SUBSTAT_CAPS.Accessory[15]).toBe(5);
  // Atk (9) is a headgear roll but never an accessory one.
  expect(SUBSTAT_CAPS.Headgear[9]).toBe(3);
  expect(SUBSTAT_CAPS.Accessory[9]).toBeUndefined();
  // Mp cost reduction (90) is capped negative.
  expect(SUBSTAT_CAPS.Legs[90]).toBe(-10);
  expect(SUBSTAT_CAPS.Artifact).toEqual({ 69: 2, 70: 2, 71: 2, 72: 2 });
});
