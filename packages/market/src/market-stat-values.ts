import {
  ATTRIBUTE_SUBSTAT_CAP,
  SUBSTAT_CAPS,
  substatScaledValue,
  type FishNetSubstatCaps,
} from "@kar-mi/spirit-vale-tools-items";
import { FISHNET_MARKET_STAT_NAMES, type FishNetMarketStatName } from "./market-stats.ts";
import {
  fishNetMarketSubstatGroup,
  type FishNetMarketSubstatGroup,
} from "./market-item-substats.ts";

export interface FishNetMarketStatValue {
  value?: number;
  percent: boolean;
}

const ATTRIBUTE_STATS = new Set<FishNetMarketStatName>(["Str", "Vit", "Agi", "Dex", "Int", "Luk"]);

const STAT_TYPES = new Map<FishNetMarketStatName, number>(
  FISHNET_MARKET_STAT_NAMES.map((name, type) => [name, type]),
);

const EQUIPMENT_CAPS: readonly FishNetSubstatCaps[] = Object.entries(SUBSTAT_CAPS)
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
    ? [SUBSTAT_CAPS.Artifact]
    : itemType === 2
      ? equipmentGroup
        ? [SUBSTAT_CAPS[equipmentGroup]]
        : EQUIPMENT_CAPS.filter((caps) => names.every((name) => capFor(caps, name) !== undefined))
      : [];

  return stats.map((stat) => {
    const percent = stat.name !== undefined && PERCENT_STATS.has(stat.name);
    if (stat.name === undefined) return { percent };
    const cap = ATTRIBUTE_STATS.has(stat.name) ? ATTRIBUTE_SUBSTAT_CAP : unambiguousCap(candidates, stat.name);
    return { value: cap === undefined ? undefined : substatScaledValue(cap, stat.roll), percent };
  });
}

function capFor(caps: FishNetSubstatCaps, name: FishNetMarketStatName): number | undefined {
  const type = STAT_TYPES.get(name);
  return type === undefined ? undefined : caps[type];
}

function unambiguousCap(candidates: readonly FishNetSubstatCaps[], name: FishNetMarketStatName): number | undefined {
  const values = new Set(candidates.flatMap((caps) => {
    const cap = capFor(caps, name);
    return cap === undefined ? [] : [cap];
  }));
  return values.size === 1 ? values.values().next().value : undefined;
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
