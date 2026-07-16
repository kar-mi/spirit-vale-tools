import type { FishNetMarketStatName } from "./market-stats.ts";
import {
  fishNetMarketSubstatGroup,
  type FishNetMarketSubstatGroup,
} from "./market-item-substats.ts";

export interface FishNetMarketStatValue {
  value?: number;
  percent: boolean;
}

type StatCaps = Partial<Record<FishNetMarketStatName, number>>;

const ATTRIBUTE_STATS = new Set<FishNetMarketStatName>(["Str", "Vit", "Agi", "Dex", "Int", "Luk"]);

const MELEE_WEAPON_CAPS: StatCaps = {
  AtkMult: 5, MatkMult: 5, DamageMelee: 5, DamageMagic: 5, Crit: 10, Hit: 20, AtkSpd: 10,
  Atk: 5, Matk: 5, CritDamage: 10, Leech: 5, Chain: 1, DoubleAttack: 20,
};
const RANGED_WEAPON_CAPS: StatCaps = {
  AtkMult: 5, MatkMult: 5, DamageRanged: 5, DamageMagic: 5, Crit: 10, Hit: 20, AtkSpd: 10,
  Atk: 5, Matk: 5, CritDamage: 10, Leech: 5, Range: 1, DoubleAttack: 20,
};
const MAGIC_WEAPON_CAPS: StatCaps = {
  AtkMult: 5, MatkMult: 5, DamageMelee: 5, DamageMagic: 5, CastSpd: 10, MpCost: -10, AtkSpd: 10,
  Atk: 5, Matk: 5, CooldownRecovery: 10, Healing: 10, CastRange: 1,
};

const HEADGEAR_CAPS: StatCaps = {
  HpMult: 2, MpMult: 2, AtkMult: 2, MatkMult: 2, Atk: 3, Matk: 3, Def: 5, Mdef: 5,
};
const CHEST_CAPS: StatCaps = {
  HpMult: 10, MpMult: 10, Def: 10, Mdef: 10, DefMult: 5, MdefMult: 5, DamageFromMelee: -5,
  DamageFromMagic: -5, HealingReceived: 10, PerfectDodge: 5,
};
const LEGS_CAPS: StatCaps = {
  HpRegenMult: 25, MpRegenMult: 25, Leech: 5, CastSpd: 10, Flee: 15, PerfectDodge: 5, MpCost: -10,
};
const FEET_CAPS: StatCaps = { AtkSpd: 10, MoveSpd: 10, CastSpd: 10, AtkSpdLimit: 1 };
const ACCESSORY_CAPS: StatCaps = {
  HpMult: 2, MpMult: 2, AtkMult: 2, MatkMult: 2, Crit: 5, Hit: 10, AtkSpd: 5,
};

const ARTIFACT_CAPS: StatCaps = { HpMult: 2, MpMult: 2, AtkMult: 2, MatkMult: 2 };

const SUBSTAT_CAPS: Readonly<Record<FishNetMarketSubstatGroup, StatCaps>> = {
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

const EQUIPMENT_CAPS: readonly StatCaps[] = Object.entries(SUBSTAT_CAPS)
  .filter(([group]) => group !== "Artifact")
  .map(([, caps]) => caps);

const PERCENT_STATS = new Set<FishNetMarketStatName>([
  "DamageMelee", "DamageMagic", "DamageRanged", "CritDamage", "Leech", "AtkSpd", "CastSpd", "MoveSpd",
  "AtkMult", "MatkMult", "HpMult", "MpMult", "DefMult", "MdefMult", "HpRegenMult", "MpRegenMult",
  "DamageFromMelee", "DamageFromMagic", "HealingReceived", "PerfectDodge", "MpCost", "CooldownRecovery",
  "Healing", "DoubleAttack",
]);

export function calculateFishNetMarketStatValues(
  itemType: number,
  stats: readonly { name?: FishNetMarketStatName; roll: number }[],
  baseItemId?: string,
): FishNetMarketStatValue[] {
  const names = stats.flatMap((stat) => stat.name && !ATTRIBUTE_STATS.has(stat.name) ? [stat.name] : []);
  const equipmentGroup = itemType === 2
    ? fishNetMarketSubstatGroup(baseItemId) ?? weaponGroupFromItemId(baseItemId)
    : undefined;
  const candidates = itemType === 3
    ? [ARTIFACT_CAPS]
    : itemType === 2
      ? equipmentGroup
        ? [SUBSTAT_CAPS[equipmentGroup]]
        : EQUIPMENT_CAPS.filter((caps) => names.every((name) => caps[name] !== undefined))
      : [];

  return stats.map((stat) => {
    const percent = stat.name !== undefined && PERCENT_STATS.has(stat.name);
    if (stat.name === undefined) return { percent };
    const cap = ATTRIBUTE_STATS.has(stat.name) ? 3 : unambiguousCap(candidates, stat.name);
    return { value: cap === undefined ? undefined : scaledValue(stat.roll, cap), percent };
  });
}

function unambiguousCap(candidates: readonly StatCaps[], name: FishNetMarketStatName): number | undefined {
  const values = new Set(candidates.flatMap((caps) => caps[name] === undefined ? [] : [caps[name]]));
  return values.size === 1 ? values.values().next().value : undefined;
}

function scaledValue(roll: number, cap: number): number {
  // Mirrors Formula.GetSubstatScaledValue followed by Extensions.Round in the client.
  return roundAwayFromZero(cap * (2 / 3 + roll / 300));
}

function roundAwayFromZero(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value);
}

function weaponGroupFromItemId(baseItemId: string | undefined): FishNetMarketSubstatGroup | undefined {
  if (!baseItemId) return undefined;
  if (/\b(?:bow|crossbow|pistol|rifle|shotgun|launcher|gatling)\b/i.test(baseItemId)) return "Ranged";
  if (/\b(?:staff|wand|book|mace|rod)\b/i.test(baseItemId)) return "Magic";
  if (/\b(?:sword|blade|dagger|axe|spear|scythe|katar|kunai|twinblade|hammer)\b/i.test(baseItemId)) {
    return "Melee";
  }
  return undefined;
}
