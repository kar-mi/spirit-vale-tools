export const FISHNET_MARKET_STAT_NAMES = [
  "Str", "Vit", "Agi", "Dex", "Int", "Luk", "AllStats", "Hp", "Mp", "Atk", "Matk", "Def", "Mdef",
  "Hit", "Flee", "Crit", "DefFlat", "MdefFlat", "ElementWeapon", "ElementArmor", "HealthOnHit", "ManaOnHit",
  "LeechKill", "LeechKillMp", "Splash", "Range", "StatusImmune", "ReverseHealing", "NoAction", "NoMove",
  "NoAttack", "NoCast", "NoKnockback", "NoFlee", "NoCastCancel", "NoFlinch", "NoReflect", "NoRegenHp",
  "NoRegenMp", "AutocastHit", "AutocastAttack", "AutocastChance", "GrantSkill", "SkillLevel", "DamageToElement",
  "DamageToBoss", "DamageElement", "DamageMelee", "DamageMagic", "SkillDamage", "CostSkill", "CooldownSkill",
  "CritDamage", "ElementResist", "AtkWeapon", "MatkWeapon", "DamageFromElement", "DamageFromMagic", "DamageFromMelee",
  "HpRegen", "HpRegenMax", "MpRegen", "MpRegenMax", "AtkSpd", "CastSpd", "MoveSpd", "AfterCastDelay", "Healing",
  "HealingReceived", "AtkMult", "MatkMult", "HpMult", "MpMult", "DefMult", "MdefMult", "HpRegenMult", "MpRegenMult",
  "FleeMult", "HitMult", "CritMult", "DoubleAttack", "EnergyShield", "FreeCastMove", "FreeCastAtk", "SpellEcho",
  "Block", "ReflectDamage", "DualWield", "ExpRate", "DropRate", "MpCost", "LifeBond", "SummonStatShare",
  "SummonDamageShare", "ReflectSpell", "BlockShield", "RangeWand", "LeechChance", "Leech", "LeechMpChance", "LeechMp",
  "WeightLimit", "DamageRanged", "DamageFromRanged", "SkillCooldown", "SkillDuration", "SkillArea", "SkillHits",
  "SkillCost", "SkillRemoveKnockback", "SkillRemoveStatus", "Invisible", "Detector", "HpRegenRate", "MpRegenRate",
  "SummonHealingReceived", "SummonReflectDamage", "SummonHealthRegen", "HealthBarrier", "BuffDuration", "CritDef",
  "PerfectDodge", "PerfectCloak", "SkillPiercing", "SkillChains", "NoBlock", "SpellAuto", "SpellDodge", "TotalAtk",
  "TotalMatk", "Chain", "SummonAtkSpd", "SummonAtkMult", "SummonMatkMult", "SummonHpMult", "SummonAllStats",
  "SummonHealing", "SummonCrit", "FinalDamage", "FinalDamageReduction", "FinalDamageTaken", "AllResist", "DamageStatus",
  "DamageFromGround", "DamageFromStatus", "SkillCastTime", "AutoattackDamage", "NoStatusApply", "SkillSplash",
  "Sacrifice", "SacrificeDamage", "MatkPerStr", "AtkPerStr", "StrMult", "VitMult", "AgiMult", "DexMult", "IntMult",
  "LukMult", "AtkSpdMult", "CastSpdMult", "MoveSpdMult", "SkillCharges", "AutoFire", "DamageCloseRange",
  "DamageFarRange", "DamageToSummons", "DamageFromSummons", "SummonSpellEcho", "SummonDamage", "SummonDamageReduction",
  "SummonLeech", "SummonCostShare", "SummonHit", "SummonAutoattackDamage", "SummonResist", "SiphonHp", "SiphonMp",
  "HealShare", "DeathShare", "AutocastDeath", "AutocastKill", "CooldownRecovery", "StatusMaxStacks",
  "TwohandedStanceBonus", "AtkSpdLimit", "AutoattackMatk", "CastTimeReduction", "CastTimeReductionLimit", "CastRange",
  "DodgeRecovery", "AtkSpdFlat", "ThreatMult", "DefPierce", "MdefPierce", "PerfectHit", "HealingToBarrier",
  "SkillPull", "SkillDamageLowHp", "SkillRange", "SkillInstances", "SkillCrit", "SkillLeap", "SkillThreat",
  "SkillCastTimeMult", "SkillHitsMult", "SkillDurationMult", "SkillDamageReceived", "SkillDamageVsStatus", "SkillReplace",
  "StatusReplace", "StatusDuration", "SkillMaxInstances", "SkillAutocast", "SkillApplyStatus", "SkillConsumeStatus",
  "SkillRecoverHp", "SkillRecoverMp", "DamageVsStatus", "SetAtkSpd",
] as const;

export type FishNetMarketStatName = (typeof FISHNET_MARKET_STAT_NAMES)[number];

export interface ResolvedFishNetMarketStat {
  type: number;
  name?: FishNetMarketStatName;
}

const STAT_TYPES_BY_NORMALIZED_NAME = new Map<string, number>(
  FISHNET_MARKET_STAT_NAMES.map((name, type) => [normalize(name), type]),
);

export function fishNetMarketStatName(type: number): FishNetMarketStatName | undefined {
  return Number.isInteger(type) && type >= 0 ? FISHNET_MARKET_STAT_NAMES[type] : undefined;
}

export function resolveFishNetMarketStat(value: string | number): ResolvedFishNetMarketStat | undefined {
  const type = typeof value === "number" ? value : numeric(value) ?? STAT_TYPES_BY_NORMALIZED_NAME.get(normalize(value));
  if (type === undefined || !Number.isSafeInteger(type) || type < -0x8000_0000 || type > 0x7fff_ffff) return undefined;
  return { type, name: fishNetMarketStatName(type) };
}

export function parseFishNetMarketStatExpression(expression: string): { stat: number; minValue?: number } {
  const separator = expression.lastIndexOf(":");
  const statText = (separator < 0 ? expression : expression.slice(0, separator)).trim();
  const minimumText = separator < 0 ? undefined : expression.slice(separator + 1).trim();
  const resolved = resolveFishNetMarketStat(statText);
  if (!resolved) throw new Error(`unknown market stat ${JSON.stringify(statText)}`);
  if (minimumText === undefined) return { stat: resolved.type };
  if (minimumText.length === 0) throw new Error(`market stat minimum is missing in ${JSON.stringify(expression)}`);
  const minValue = Number(minimumText);
  if (!Number.isFinite(minValue)) throw new Error(`market stat minimum must be finite in ${JSON.stringify(expression)}`);
  return { stat: resolved.type, minValue };
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/[\s_-]+/g, "");
}

function numeric(value: string): number | undefined {
  if (!/^-?\d+$/.test(value.trim())) return undefined;
  return Number(value);
}
