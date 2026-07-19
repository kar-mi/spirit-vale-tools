import type { CharacterAttributes, CharacterStatBreakdown, CharacterSubstat } from "./types.ts";

const rounded = Math.round;
const integer = Math.floor;

export function calculateCharacterStats(
  level: number,
  baseAttributes: CharacterAttributes,
  substats: readonly CharacterSubstat[] = [],
  archetypes: readonly string[] = [],
): CharacterStatBreakdown[] {
  const bonus = (type: number) => substats.reduce((total, stat) => total + (stat.type === type ? stat.value ?? 0 : 0), 0);
  const STR = baseAttributes.STR + bonus(0), VIT = baseAttributes.VIT + bonus(1), AGI = baseAttributes.AGI + bonus(2);
  const DEX = baseAttributes.DEX + bonus(3), INT = baseAttributes.INT + bonus(4), LUK = baseAttributes.LUK + bonus(5);
  const meleeBase = STR * 1.5 + integer(DEX / 5) + integer(LUK / 5);
  const rangedBase = DEX + integer(STR / 5) + integer(LUK / 5);
  const magicBase = INT * 1.5 + integer(DEX / 5) + integer(LUK / 5);
  const meleeAttack = rounded((meleeBase * (1 + integer(STR / 10) / 100) + bonus(9)) * (1 + bonus(69) / 100));
  const rangedAttack = rounded((rangedBase * (1 + integer(DEX / 10) / 100) + bonus(9)) * (1 + bonus(69) / 100));
  const magicAttack = rounded((magicBase * (1 + integer(INT / 10) / 100) + bonus(10)) * (1 + bonus(70) / 100));
  const hit = rounded((level + DEX * 2 + integer(LUK / 3) + 25 + bonus(13)) * (1 + bonus(78) / 100));
  const flee = rounded((20 + level + AGI + integer(LUK / 5) + integer(AGI / 10) * 3 + bonus(14)) * (1 + bonus(77) / 100));
  const critChance = rounded((LUK / 3 + integer(LUK / 10) + bonus(15)) * (1 + bonus(79) / 100));
  const critDamage = 120 + integer(LUK / 5) + bonus(52);
  const critDefence = integer(LUK / 5) + bonus(120);
  const perfectDodge = clamp(rounded(LUK / 10) + bonus(121), 0, 100);
  const healthGrowth = ARCHETYPE_HEALTH_GROWTH[archetypes[0] ?? ""] ?? 0;
  const cappedLevel = Math.min(level, 130);
  const levelSum = cappedLevel * (cappedLevel + 1) / 2;
  const maxHealth = Math.max(1, rounded(((200 + level * 10 + levelSum * healthGrowth) * (1 + VIT / 100) + bonus(7)) * (1 + bonus(71) / 100)));
  const maxMana = Math.max(1, rounded(((45 + level * 5) * (1 + INT / 100) + bonus(8)) * (1 + bonus(72) / 100)));
  const healthRegen = rounded(0.5 * (maxHealth / 200 + VIT / 5) * (2 + VIT / 100));
  const manaRegen = rounded(0.5 * (maxMana / 100 + INT / 5) * (2 + INT / 100));
  const statusResist = (label: string, value: number): CharacterStatBreakdown => stat(
    `resist-${label.toLowerCase()}`,
    `${label} resistance`,
    "Defense",
    clamp(rounded(value * 2 / 3), 0, 100),
    "%",
    "clamp(round(attribute × 2 / 3), 0, 100)",
    { attribute: value },
  );

  return [
    stat("melee-attack", "Melee attack scaling", "Offense", meleeAttack, undefined, "round((attribute scaling + ATK) × (1 + ATK multiplier / 100))", { STR, DEX, LUK, ATK: bonus(9), AtkMult: bonus(69) }),
    stat("ranged-attack", "Ranged attack scaling", "Offense", rangedAttack, undefined, "round((attribute scaling + ATK) × (1 + ATK multiplier / 100))", { STR, DEX, LUK, ATK: bonus(9), AtkMult: bonus(69) }),
    stat("magic-attack", "Magic attack scaling", "Offense", magicAttack, undefined, "round((attribute scaling + MATK) × (1 + MATK multiplier / 100))", { INT, DEX, LUK, MATK: bonus(10), MatkMult: bonus(70) }),
    stat("hit", "Hit", "Accuracy", hit, undefined, "round((level + DEX × 2 + floor(LUK / 3) + 25 + Hit) × Hit multiplier)", { level, DEX, LUK, Hit: bonus(13), HitMult: bonus(78) }),
    stat("flee", "Flee", "Accuracy", flee, undefined, "round((20 + level + AGI + floor(LUK / 5) + floor(AGI / 10) × 3 + Flee) × Flee multiplier)", { level, AGI, LUK, Flee: bonus(14), FleeMult: bonus(77) }),
    stat("crit-chance", "Critical chance", "Accuracy", critChance, "%", "round(LUK / 3 + floor(LUK / 10))", { LUK }),
    stat("crit-damage", "Critical damage", "Accuracy", critDamage, "%", "120 + floor(LUK / 5)", { LUK }),
    stat("crit-defence", "Critical defence", "Defense", critDefence, "%", "floor(LUK / 5)", { LUK }),
    stat("perfect-dodge", "Perfect dodge", "Defense", perfectDodge, "%", "clamp(round(LUK / 10), 0, 100)", { LUK }),
    statusResist("STR", STR), statusResist("VIT", VIT), statusResist("AGI", AGI),
    statusResist("DEX", DEX), statusResist("INT", INT), statusResist("LUK", LUK),
    stat("max-health", "Maximum HP", "Resources", maxHealth, undefined, "round(((200 + level × 10 + capped level sum × archetype growth) × (1 + VIT / 100) + HP) × HP multiplier)", { level, VIT, LevelSum: levelSum, ArchetypeGrowth: healthGrowth, HP: bonus(7), HpMult: bonus(71) }),
    stat("max-mana", "Maximum MP", "Resources", maxMana, undefined, "round((45 + level × 5) × (1 + INT / 100))", { level, INT }),
    stat("health-regen", "Base HP regeneration", "Recovery", healthRegen, undefined, "round(0.5 × (MaxHP / 200 + VIT / 5) × (2 + VIT / 100))", { MaxHP: maxHealth, VIT }),
    stat("mana-regen", "Base MP regeneration", "Recovery", manaRegen, undefined, "round(0.5 × (MaxMP / 100 + INT / 5) × (2 + INT / 100))", { MaxMP: maxMana, INT }),
  ];
}

const ARCHETYPE_HEALTH_GROWTH: Record<string, number> = {
  Warrior: 1.3, Knight: 1, Rogue: 0.85, Scout: 0.75, Acolyte: 0.75, Summoner: 0.7, Mage: 0.5, Weaver: 0.5,
};

function stat(
  id: string,
  label: string,
  category: CharacterStatBreakdown["category"],
  value: number,
  unit: CharacterStatBreakdown["unit"],
  formula: string,
  inputs: Record<string, number>,
): CharacterStatBreakdown {
  return { id, label, category, value, ...(unit ? { unit } : {}), formula, inputs };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
