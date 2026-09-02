#!/usr/bin/env bun
/** Regenerates the reduced skill, status, and mob reward catalogs from datamine JSON. */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { FishNetSkillDefinition, FishNetSkillEffect, FishNetSkillKind } from "../packages/skills/src/catalog.ts";
import type { FishNetStatusDefinition, FishNetStatusEffect } from "../packages/statuses/src/catalog.ts";
import type { MobDropCategory } from "../packages/rewards/src/catalog/catalog.ts";
import type { MobRewardSourceDefinition } from "../packages/rewards/src/catalog/definitions/types.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_OUTPUT = path.resolve(SCRIPT_DIR, "../packages/skills/src/definitions/skills.ts");
const STATUSES_OUTPUT = path.resolve(SCRIPT_DIR, "../packages/statuses/src/definitions/statuses.ts");
const MOBS_OUTPUT = path.resolve(SCRIPT_DIR, "../packages/rewards/src/catalog/definitions/mobs.ts");

interface ScalarValue { Value: number; ValueLv: number }
interface PassiveRow { Name: string; Type: number; Value: ScalarValue }
interface StatusEffectRow {
  Id: string;
  Duration: number;
  DurationLv: number;
  Chance: number;
  ChanceLv: number;
  Stacks: number;
  StacksLv: number;
}
interface SkillEntry {
  id: string;
  displayName: string;
  kinds: FishNetSkillKind[];
  spriteId: string | null;
  config: {
    Passives?: PassiveRow[];
    StatusEffects?: StatusEffectRow[];
    SelfStatusEffects?: StatusEffectRow[];
  } & Partial<Record<string, ScalarValue>>;
}
interface StatusEntry {
  id: string;
  displayName: string;
  spriteId: string | null;
  isDebuff: boolean;
  config: {
    MaxLv: number;
    FixedDuration: number;
    StatusEffects?: StatusEffectRow[];
    SelfStatusEffects?: StatusEffectRow[];
  } & Partial<Record<string, ScalarValue>>;
}
interface MobDropEntry {
  category: MobDropCategory;
  itemId: string;
  count: number;
  chance: number;
}
interface MobEntry {
  id: string;
  displayName: string;
  level: number;
  boss: boolean;
  baseCoins: number;
  drops: MobDropEntry[];
}
interface RewardsFile { mobs: MobEntry[] }

const NAMED_SCALAR_DURATION_FIELDS = ["ComboReady", "CastReady"];
const NO_DURATION_OVERRIDE_IDS = new Set(["Focus", "Fury", "Might"]);

interface GrantTuple extends FishNetStatusEffect { count: number }

function dataMineDirectory(): string {
  const argument = process.argv[2];
  if (!argument) throw new Error("Usage: bun run scripts/generate-static-catalogs.ts <data-mine-json-directory>");
  return path.resolve(process.cwd(), argument);
}

function loadJson<T>(directory: string, fileName: string): T {
  return JSON.parse(readFileSync(path.join(directory, fileName), "utf8")) as T;
}

function skillEffect(row: PassiveRow): FishNetSkillEffect {
  const labelSegments = row.Name.split("_");
  if (labelSegments.length > 1) labelSegments.pop();
  return {
    type: row.Type,
    value: row.Value.Value,
    ...(row.Value.ValueLv !== 0 ? { valuePerLevel: row.Value.ValueLv } : {}),
    label: labelSegments.join(" ").replace(/\s+/g, " ").trim(),
  };
}

function skillDefinition(entry: SkillEntry): FishNetSkillDefinition {
  const effects = entry.config.Passives?.map(skillEffect) ?? [];
  return {
    id: entry.id,
    displayName: entry.displayName,
    kinds: entry.kinds,
    ...(entry.spriteId ? { spriteId: entry.spriteId } : {}),
    ...(effects.length > 0 ? { effects } : {}),
  };
}

function collectRows(rows: StatusEffectRow[] | undefined, granterId: string, grants: Map<string, GrantTuple[]>): void {
  for (const row of rows ?? []) {
    const values = grants.get(row.Id) ?? [];
    const existing = values.find((value) =>
      value.id === granterId &&
      value.duration === row.Duration && value.durationPerLevel === row.DurationLv &&
      value.chance === row.Chance && value.chancePerLevel === row.ChanceLv &&
      value.stacks === row.Stacks && value.stacksPerLevel === row.StacksLv
    );
    if (existing) existing.count += 1;
    else values.push({
      id: granterId,
      duration: row.Duration,
      durationPerLevel: row.DurationLv,
      chance: row.Chance,
      chancePerLevel: row.ChanceLv,
      stacks: row.Stacks,
      stacksPerLevel: row.StacksLv,
      count: 1,
    });
    grants.set(row.Id, values);
  }
}

function collectGrants(entries: readonly (SkillEntry | StatusEntry)[], grants: Map<string, GrantTuple[]>): void {
  for (const entry of entries) {
    collectRows(entry.config.StatusEffects, entry.id, grants);
    collectRows(entry.config.SelfStatusEffects, entry.id, grants);
    for (const fieldName of NAMED_SCALAR_DURATION_FIELDS) {
      const value = entry.config[fieldName];
      if (!value || (value.Value === 0 && value.ValueLv === 0)) continue;
      collectRows([{
        Id: fieldName,
        Duration: value.Value,
        DurationLv: value.ValueLv,
        Chance: 0,
        ChanceLv: 0,
        Stacks: 0,
        StacksLv: 0,
      }], entry.id, grants);
    }
  }
}

function statusEffects(id: string, isDebuff: boolean, grants: Map<string, GrantTuple[]>): FishNetStatusEffect[] {
  if (NO_DURATION_OVERRIDE_IDS.has(id)) return [];
  const tuples = grants.get(id) ?? [];
  const frequencies = new Map<string, number>();
  for (const tuple of tuples) {
    const key = `${tuple.duration}|${tuple.durationPerLevel}`;
    frequencies.set(key, (frequencies.get(key) ?? 0) + tuple.count);
  }
  const effects = tuples
    .sort((left, right) => {
      const frequencyDifference =
        (frequencies.get(`${right.duration}|${right.durationPerLevel}`) ?? 0) -
        (frequencies.get(`${left.duration}|${left.durationPerLevel}`) ?? 0);
      return frequencyDifference || right.count - left.count || left.id.localeCompare(right.id);
    })
    .map(({ count: _count, ...effect }) => effect);
  if (!isDebuff && effects[0]?.duration === 1 && effects[0].durationPerLevel === 0) return [];
  return effects;
}

function statusDefinition(entry: StatusEntry, grants: Map<string, GrantTuple[]>): FishNetStatusDefinition {
  return {
    id: entry.id,
    displayName: entry.displayName,
    ...(entry.spriteId ? { spriteId: entry.spriteId } : {}),
    isDebuff: entry.isDebuff,
    maxLevel: entry.config.MaxLv,
    fixedDuration: entry.config.FixedDuration === 1,
    effects: statusEffects(entry.id, entry.isDebuff, grants),
  };
}

function mobDefinition(entry: MobEntry): MobRewardSourceDefinition {
  return {
    id: entry.id,
    displayName: entry.displayName,
    level: entry.level,
    boss: entry.boss,
    baseExperience: entry.level * (2 * entry.level + 25),
    baseCoins: entry.baseCoins,
    drops: entry.drops.map((drop) => ({
      category: drop.category,
      itemId: drop.itemId,
      count: Math.max(1, drop.count),
      chance: drop.chance,
    })),
  };
}

function generatedClass(importLine: string, className: string, values: unknown, satisfiesType: string): string {
  return `${importLine}\n\n/** Generated from the current reduced game-data export. */\nexport class ${className} {\n  private constructor() {}\n\n  static readonly values = ${JSON.stringify(values, null, 2)} as const satisfies readonly ${satisfiesType}[];\n}\n`;
}

function main(): void {
  const directory = dataMineDirectory();
  const skills = loadJson<SkillEntry[]>(directory, "skills.json").sort((a, b) => a.id.localeCompare(b.id));
  const statuses = loadJson<StatusEntry[]>(directory, "statuses.json").sort((a, b) => a.id.localeCompare(b.id));
  const rewards = loadJson<RewardsFile>(directory, "rewards.json");
  const grants = new Map<string, GrantTuple[]>();
  collectGrants(skills, grants);
  collectGrants(statuses, grants);

  const skillDefinitions = skills.map(skillDefinition);
  const statusDefinitions = statuses.map((entry) => statusDefinition(entry, grants));
  const mobDefinitions = rewards.mobs
    .filter((entry) => entry.level > 0)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(mobDefinition);

  writeFileSync(SKILLS_OUTPUT, generatedClass(
    'import type { FishNetSkillDefinition } from "../catalog.ts";',
    "SkillDefinitions", skillDefinitions, "FishNetSkillDefinition",
  ));
  writeFileSync(STATUSES_OUTPUT, generatedClass(
    'import type { FishNetStatusDefinition } from "../catalog.ts";',
    "StatusDefinitions", statusDefinitions, "FishNetStatusDefinition",
  ));
  writeFileSync(MOBS_OUTPUT, generatedClass(
    'import type { MobRewardSourceDefinition } from "./types.ts";',
    "MobDefinitions", mobDefinitions, "MobRewardSourceDefinition",
  ));

  console.log(`Generated ${skillDefinitions.length} skills, ${statusDefinitions.length} statuses, and ${mobDefinitions.length} reward mobs.`);
}

main();
