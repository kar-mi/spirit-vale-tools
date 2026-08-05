import type { FishNetItemSubstatGroup } from "./catalog.ts";

/** Maximum value a substat can reach at a perfect roll, keyed by stat type. */
export type FishNetSubstatCaps = Readonly<Record<number, number>>;

const MELEE_WEAPON_CAPS: FishNetSubstatCaps = {
  9: 5, 10: 5, 13: 20, 15: 10, 47: 5, 48: 5, 52: 10, 63: 10, 69: 5, 70: 5, 80: 20, 98: 5, 130: 1,
};
const RANGED_WEAPON_CAPS: FishNetSubstatCaps = {
  9: 5, 10: 5, 13: 20, 15: 10, 25: 1, 48: 5, 52: 10, 63: 10, 69: 5, 70: 5, 80: 20, 98: 5, 102: 5,
};
const MAGIC_WEAPON_CAPS: FishNetSubstatCaps = {
  9: 5, 10: 5, 47: 5, 48: 5, 63: 10, 64: 10, 67: 10, 69: 5, 70: 5, 90: -10, 182: 10, 189: 1,
};

const HEADGEAR_CAPS: FishNetSubstatCaps = { 9: 3, 10: 3, 11: 5, 12: 5, 69: 2, 70: 2, 71: 2, 72: 2 };
const CHEST_CAPS: FishNetSubstatCaps = {
  11: 10, 12: 10, 57: -5, 58: -5, 68: 10, 71: 10, 72: 10, 73: 5, 74: 5, 121: 5,
};
const LEGS_CAPS: FishNetSubstatCaps = { 14: 15, 64: 10, 75: 25, 76: 25, 90: -10, 98: 5, 121: 5 };
const FEET_CAPS: FishNetSubstatCaps = { 63: 10, 64: 10, 65: 10, 185: 1 };
const ACCESSORY_CAPS: FishNetSubstatCaps = { 13: 10, 15: 5, 63: 5, 69: 2, 70: 2, 71: 2, 72: 2 };

const ARTIFACT_CAPS: FishNetSubstatCaps = { 69: 2, 70: 2, 71: 2, 72: 2 };

/** Substat caps for every pool the game rolls from, shared by the character and market readers. */
export const SUBSTAT_CAPS: Readonly<Record<FishNetItemSubstatGroup, FishNetSubstatCaps>> = {
  Accessory: ACCESSORY_CAPS,
  Artifact: ARTIFACT_CAPS,
  Chest: CHEST_CAPS,
  Feet: FEET_CAPS,
  Headgear: HEADGEAR_CAPS,
  Legs: LEGS_CAPS,
  Magic: MAGIC_WEAPON_CAPS,
  Melee: MELEE_WEAPON_CAPS,
  Ranged: RANGED_WEAPON_CAPS,
};

/** Equipment slot names in wire order. */
export const EQUIP_SLOTS = [
  "Main hand", "Off hand", "Head", "Legs", "Feet", "Chest",
  "Left accessory", "Right accessory", "Eyewear", "Back",
] as const;

/**
 * Substat pool each equip slot rolls from. Weapon slots are absent because their pool depends on
 * the weapon rather than the slot; resolve those from the item's own `substatGroup`.
 */
export const EQUIP_SLOT_SUBSTAT_GROUPS: Readonly<Record<number, FishNetItemSubstatGroup>> = {
  2: "Headgear",
  3: "Legs",
  4: "Feet",
  5: "Chest",
  6: "Accessory",
  7: "Accessory",
  8: "Headgear",
  9: "Headgear",
};

/** Attribute substats (Str through Luk) share one cap across every pool. */
export const ATTRIBUTE_SUBSTAT_CAP = 3;

/** Mirrors Formula.GetSubstatScaledValue followed by Extensions.Round in the client. */
export function substatScaledValue(cap: number, roll: number): number {
  return roundAwayFromZero(cap * (2 / 3 + roll / 300));
}

function roundAwayFromZero(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value);
}
