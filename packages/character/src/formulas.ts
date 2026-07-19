import { resolveFishNetItem, type FishNetItemEffect } from "@spiritvale/items";
import { resolveFishNetSkill } from "@spiritvale/skills";
import type { CharacterArtifact, CharacterAttributes, CharacterEquipment, CharacterSkill, CharacterStatBreakdown, CharacterSubstat, GearStatTotal } from "./types.ts";
import { PERCENT_STATS, STAT_NAMES } from "./stat-names.ts";

const rounded = Math.round;
const integer = Math.floor;
const BASIC_SUBSTAT_TYPES = new Set([0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 52, 69, 70, 71, 72, 77, 78, 79, 120, 121]);

export function calculateCharacterStats(level: number, baseAttributes: CharacterAttributes, substats: readonly CharacterSubstat[] = [], archetypes: readonly string[] = []): CharacterStatBreakdown[] {
  const base = calculateBasicStats(level, baseAttributes, [], archetypes);
  const total = calculateBasicStats(level, baseAttributes, substats, archetypes);
  return total.map((stat, index) => ({ ...stat, tab: "basic", base: base[index]!.value, gear: stat.value - base[index]!.value }));
}

export function aggregateGearSubstats(equipment: readonly CharacterEquipment[], artifacts: readonly CharacterArtifact[]): GearStatTotal[] {
  const totals = new Map<number, GearStatTotal>();
  for (const stat of materializeGearStats(equipment, artifacts)) {
    const entry = totals.get(stat.type) ?? { type: stat.type, name: STAT_NAMES[stat.type] ?? stat.name, total: 0, percent: stat.percent, unresolvedRolls: 0 };
    if (stat.value === undefined) entry.unresolvedRolls += 1;
    else entry.total += stat.value;
    totals.set(stat.type, entry);
  }
  return [...totals.values()].sort((left, right) => left.name.localeCompare(right.name) || left.type - right.type);
}

/** Combines rolled stats with the catalogued innate effects of items, cards, artifacts, and gems. */
export function materializeGearStats(equipment: readonly CharacterEquipment[], artifacts: readonly CharacterArtifact[]): CharacterSubstat[] {
  const stats = [...equipment, ...artifacts].flatMap((item) => item.substats);
  for (const item of equipment) {
    stats.push(...itemEffects(2, item.itemId, item.refine));
    for (const card of item.cards) stats.push(...itemEffects(4, card, 0));
  }
  for (const artifact of artifacts) {
    stats.push(...itemEffects(3, artifact.itemId, artifact.refine));
    for (const gem of artifact.gems) stats.push(...itemEffects(5, gem, 0));
  }
  const sets = new Map<string, number>();
  for (const artifact of artifacts) sets.set(artifact.itemId, (sets.get(artifact.itemId) ?? 0) + 1);
  for (const [itemId, pieces] of sets) {
    const set = resolveFishNetItem(3, itemId)?.artifactSet;
    if (!set) continue;
    stats.push(...effectsToStats(set.perPieceBase, 1), ...effectsToStats(set.perPiece, pieces));
    if (pieces >= set.requiredPieces) stats.push(...effectsToStats(set.fullSet, 1));
  }
  return stats;
}

/** Converts passive-skill effects into stat inputs at their learned level. */
export function materializeSkillStats(skills: readonly CharacterSkill[]): CharacterSubstat[] {
  return skills.flatMap((skill) => (resolveFishNetSkill(skill.id)?.effects ?? []).map((effect) => ({
    type: effect.type,
    name: effect.label ?? STAT_NAMES[effect.type] ?? `Stat ${effect.type}`,
    roll: 0,
    value: effect.value + (effect.valuePerLevel ?? 0) * skill.level,
    percent: PERCENT_STATS.has(effect.type),
  })));
}

function itemEffects(itemType: number, itemId: string, refine: number): CharacterSubstat[] {
  const definition = resolveFishNetItem(itemType, itemId);
  return [...effectsToStats(definition?.effects ?? [], 1), ...effectsToStats(definition?.refineEffects ?? [], refine)];
}

function effectsToStats(effects: readonly FishNetItemEffect[], multiplier: number): CharacterSubstat[] {
  return effects
    .filter((effect) => effect.skillId === undefined)
    .map((effect) => ({
      type: effect.type,
      name: STAT_NAMES[effect.type] ?? `Stat ${effect.type}`,
      roll: 0,
      value: effect.value * multiplier,
      percent: PERCENT_STATS.has(effect.type),
    }));
}

export function calculateAdvancedGearStats(totals: readonly GearStatTotal[]): CharacterStatBreakdown[] {
  return totals.filter((stat) => !BASIC_SUBSTAT_TYPES.has(stat.type)).map((stat) => ({
    id: `gear-stat-${stat.type}`,
    label: stat.name,
    category: advancedCategory(stat.type),
    tab: "advanced",
    base: 0,
    gear: stat.total,
    value: stat.total,
    ...(stat.percent ? { unit: "%" as const } : {}),
    formula: "Gear-granted value (no base formula known)",
    inputs: { Gear: stat.total, UnresolvedRolls: stat.unresolvedRolls },
  }));
}

function calculateBasicStats(level: number, baseAttributes: CharacterAttributes, substats: readonly CharacterSubstat[], archetypes: readonly string[]): Array<Omit<CharacterStatBreakdown, "tab" | "base" | "gear">> {
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
  const statusResist = (label: string, value: number) => stat(`resist-${label.toLowerCase()}`, `${label} resistance`, "Defense", clamp(rounded(value * 2 / 3), 0, 100), "%", "clamp(round(attribute × 2 / 3), 0, 100)", { attribute: value });
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
    statusResist("STR", STR), statusResist("VIT", VIT), statusResist("AGI", AGI), statusResist("DEX", DEX), statusResist("INT", INT), statusResist("LUK", LUK),
    stat("max-health", "Maximum HP", "Resources", maxHealth, undefined, "round(((200 + level × 10 + capped level sum × archetype growth) × (1 + VIT / 100) + HP) × HP multiplier)", { level, VIT, LevelSum: levelSum, ArchetypeGrowth: healthGrowth, HP: bonus(7), HpMult: bonus(71) }),
    stat("max-mana", "Maximum MP", "Resources", maxMana, undefined, "round((45 + level × 5) × (1 + INT / 100))", { level, INT }),
    stat("health-regen", "Base HP regeneration", "Recovery", healthRegen, undefined, "round(0.5 × (MaxHP / 200 + VIT / 5) × (2 + VIT / 100))", { MaxHP: maxHealth, VIT }),
    stat("mana-regen", "Base MP regeneration", "Recovery", manaRegen, undefined, "round(0.5 × (MaxMP / 100 + INT / 5) × (2 + INT / 100))", { MaxMP: maxMana, INT }),
  ];
}

function advancedCategory(type: number): CharacterStatBreakdown["category"] {
  if ([63, 64, 65, 66, 104, 159, 160, 185, 187, 188].includes(type)) return "Speed";
  if ([20, 21, 22, 23, 59, 60, 61, 62, 67, 75, 76, 97, 98, 99, 100, 113, 114, 176, 177].includes(type)) return "Sustain";
  if ([11, 12, 16, 17, 26, 73, 74, 86].includes(type)) return "Mitigation";
  return "Utility";
}

const ARCHETYPE_HEALTH_GROWTH: Record<string, number> = { Warrior: 1.3, Knight: 1, Rogue: 0.85, Scout: 0.75, Acolyte: 0.75, Summoner: 0.7, Mage: 0.5, Weaver: 0.5 };
function stat(id: string, label: string, category: CharacterStatBreakdown["category"], value: number, unit: CharacterStatBreakdown["unit"], formula: string, inputs: Record<string, number>): Omit<CharacterStatBreakdown, "tab" | "base" | "gear"> { return { id, label, category, value, ...(unit ? { unit } : {}), formula, inputs }; }
function clamp(value: number, minimum: number, maximum: number): number { return Math.min(maximum, Math.max(minimum, value)); }
