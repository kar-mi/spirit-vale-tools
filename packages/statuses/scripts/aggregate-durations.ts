#!/usr/bin/env bun
/**
 * Regenerates definitions/statuses.ts's `effects` data from the Spirit Vale data-mine.
 *
 * The data-mine declares a status's duration on whatever grants it (a skill's
 * `config.StatusEffects[]`, or occasionally another status's `config.StatusEffects[]`
 * for self-granting "coating" statuses), not on the status itself. This script walks
 * both `skills.json` and `statuses.json`, aggregates every granter of each status,
 * dedupes identical duration/chance/stacks tuples, and orders them by how many
 * granters agree (so the fallback entry used by `statusDurationSeconds()` is the most
 * commonly-granted value for statuses with conflicting sources, e.g. `Stun` is granted
 * by 15 different skills with durations ranging 1s-3s).
 * Named scalar grants retain every granter because activation-based timer refreshes
 * need to identify each differently-named skill that grants ComboReady/CastReady.
 *
 * Run: `bun run packages/statuses/scripts/aggregate-durations.ts` from the repo root.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { FishNetStatusDefinition, FishNetStatusEffect } from "../src/catalog.ts";
import { StatusDefinitions } from "../src/definitions/statuses.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_MINE_JSON_DIR = path.resolve(SCRIPT_DIR, "../../../../spirit_vale_data_mine/data/json");
const OUTPUT_FILE = path.resolve(SCRIPT_DIR, "../src/definitions/statuses.ts");

interface DataMineStatusEffectRow {
  Id: string;
  Duration: number;
  DurationLv: number;
  Chance: number;
  ChanceLv: number;
  Stacks: number;
  StacksLv: number;
}

interface DataMineScalarValue {
  Value: number;
  ValueLv: number;
}

interface DataMineEntry {
  id: string;
  config?: {
    StatusEffects?: DataMineStatusEffectRow[];
    SelfStatusEffects?: DataMineStatusEffectRow[];
  } & Partial<Record<string, DataMineScalarValue>>;
}

// Some statuses aren't granted via StatusEffects/SelfStatusEffects rows at all - they're
// dedicated scalar fields on the skill sharing the status's own name (e.g. ComboReady:
// { Value: 4, ValueLv: 0 } on 29 different Combo Finisher setup skills, all agreeing on
// a flat 4s that StatusEffects has no row for whatsoever).
const NAMED_SCALAR_DURATION_FIELDS = ["ComboReady", "CastReady"];

// Statuses to always leave without duration data, regardless of what the data-mine
// declares. Might is actively/frequently re-applied and stacked by ShoutMight, while
// Fury is a toggle removed explicitly by the server. A computed expiry would clear
// either one while it can still be active.
const NO_DURATION_OVERRIDE_IDS = new Set(["Fury", "Might"]);

interface GrantTuple {
  granterId: string;
  duration: number;
  durationPerLevel: number;
  chance: number;
  chancePerLevel: number;
  stacks: number;
  stacksPerLevel: number;
  count: number;
}

function loadJson<T>(fileName: string): T {
  return JSON.parse(readFileSync(path.join(DATA_MINE_JSON_DIR, fileName), "utf8")) as T;
}

function collectGrantRows(
  rows: DataMineStatusEffectRow[] | undefined,
  granterId: string,
  grants: Map<string, GrantTuple[]>,
  retainGranter = false,
): void {
  if (!rows || rows.length === 0) return;
  for (const row of rows) {
    const list = grants.get(row.Id) ?? [];
    const existing = list.find(
      (t) =>
        (!retainGranter || t.granterId === granterId) &&
        t.duration === row.Duration &&
        t.durationPerLevel === row.DurationLv &&
        t.chance === row.Chance &&
        t.chancePerLevel === row.ChanceLv &&
        t.stacks === row.Stacks &&
        t.stacksPerLevel === row.StacksLv,
    );
    if (existing) {
      existing.count += 1;
    } else {
      list.push({
        granterId,
        duration: row.Duration,
        durationPerLevel: row.DurationLv,
        chance: row.Chance,
        chancePerLevel: row.ChanceLv,
        stacks: row.Stacks,
        stacksPerLevel: row.StacksLv,
        count: 1,
      });
    }
    grants.set(row.Id, list);
  }
}

function collectNamedScalarGrants(entry: DataMineEntry, grants: Map<string, GrantTuple[]>): void {
  for (const fieldName of NAMED_SCALAR_DURATION_FIELDS) {
    const scalar = entry.config?.[fieldName];
    if (!scalar || (scalar.Value === 0 && scalar.ValueLv === 0)) continue;
    collectGrantRows(
      [{ Id: fieldName, Duration: scalar.Value, DurationLv: scalar.ValueLv, Chance: 0, ChanceLv: 0, Stacks: 0, StacksLv: 0 }],
      entry.id,
      grants,
      true,
    );
  }
}

// Skills/statuses grant statuses onto others via `StatusEffects[]`, and onto their own
// caster via `SelfStatusEffects[]` (same row schema, e.g. Unyielding/BloodCrash are
// only ever granted this way) - both are duration sources for the granted status.
// A few statuses (ComboReady/CastReady) instead use a dedicated scalar field, see above.
function collectGrants(entries: DataMineEntry[], grants: Map<string, GrantTuple[]>): void {
  for (const entry of entries) {
    collectGrantRows(entry.config?.StatusEffects, entry.id, grants);
    collectGrantRows(entry.config?.SelfStatusEffects, entry.id, grants);
    collectNamedScalarGrants(entry, grants);
  }
}

function toEffects(tuples: GrantTuple[]): FishNetStatusEffect[] {
  // Rank by how many granters agree on the same (duration, durationPerLevel) - that's
  // all statusDurationSeconds() reads - rather than the full tuple (which also includes
  // chance/stacks fields that rarely match across unrelated skills and would otherwise
  // make the ordering look arbitrary for multi-source statuses like Stun.
  const durationFrequency = new Map<string, number>();
  for (const t of tuples) {
    const key = `${t.duration}|${t.durationPerLevel}`;
    durationFrequency.set(key, (durationFrequency.get(key) ?? 0) + t.count);
  }
  return [...tuples]
    .sort((a, b) => {
      const freqDiff =
        (durationFrequency.get(`${b.duration}|${b.durationPerLevel}`) ?? 0) -
        (durationFrequency.get(`${a.duration}|${a.durationPerLevel}`) ?? 0);
      return freqDiff !== 0 ? freqDiff : b.count - a.count;
    })
    .map((t) => ({
      id: t.granterId,
      duration: t.duration,
      durationPerLevel: t.durationPerLevel,
      chance: t.chance,
      chancePerLevel: t.chancePerLevel,
      stacks: t.stacks,
      stacksPerLevel: t.stacksPerLevel,
    }));
}

function formatDefinition(definition: FishNetStatusDefinition): string {
  const fields: string[] = [
    `id: ${JSON.stringify(definition.id)}`,
    `displayName: ${JSON.stringify(definition.displayName)}`,
  ];
  if (definition.spriteId !== undefined) fields.push(`spriteId: ${JSON.stringify(definition.spriteId)}`);
  fields.push(`isDebuff: ${definition.isDebuff}`);
  fields.push(`maxLevel: ${definition.maxLevel}`);
  fields.push(`fixedDuration: ${definition.fixedDuration}`);
  const effects = definition.effects
    .map(
      (e) =>
        `{ id: ${JSON.stringify(e.id)}, duration: ${e.duration}, durationPerLevel: ${e.durationPerLevel}, chance: ${e.chance}, chancePerLevel: ${e.chancePerLevel}, stacks: ${e.stacks}, stacksPerLevel: ${e.stacksPerLevel} }`,
    )
    .join(", ");
  fields.push(`effects: [${effects}]`);
  return `  { ${fields.join(", ")} },`;
}

function main(): void {
  const skills = loadJson<DataMineEntry[]>("skills.json");
  const statuses = loadJson<DataMineEntry[]>("statuses.json");

  const grants = new Map<string, GrantTuple[]>();
  collectGrants(skills, grants);
  collectGrants(statuses, grants);

  let updatedCount = 0;
  const updatedDefinitions = StatusDefinitions.values.map((definition) => {
    if (NO_DURATION_OVERRIDE_IDS.has(definition.id)) return { ...definition, effects: [] };
    const tuples = grants.get(definition.id);
    if (!tuples || tuples.length === 0) return definition;
    const effects = toEffects(tuples);
    // Buffs (not debuffs) whose only/leading duration source is a flat 1s are usually
    // stances/toggles (e.g. Berserk, HighGuard) where the game's declared "1s" is a
    // placeholder, not a real timer - the real lifetime is "until explicitly removed".
    // Confirmed against session logs where Berserk persisted 100+ seconds with no expiry.
    if (!definition.isDebuff && effects[0]?.duration === 1 && effects[0]?.durationPerLevel === 0) return { ...definition, effects: [] };
    updatedCount += 1;
    return { ...definition, effects };
  });

  const knownIds = new Set(StatusDefinitions.values.map((d) => d.id));
  const unmatchedStatusIds = [...grants.keys()].filter((id) => !knownIds.has(id));

  const header = `import type { FishNetStatusDefinition } from "../catalog.ts";

/**
 * Hand-ported from the Spirit Vale data-mine's statuses.json. A status's own
 * duration is aggregated from every other status/skill definition that grants it,
 * since the raw data declares durations on the granter, not the granted status.
 * Regenerate this file's effects via scripts/aggregate-durations.ts whenever the
 * data-mine's skills.json/statuses.json changes; when multiple granters disagree
 * (e.g. Stun ranges 1s-3s across 15 skills), effects[0] is the most common value.
 * isDebuff also applies manual overrides on top of the source data, which only marks
 * 8/185 statuses as debuffs and misses obvious ones like Stun/Blind/Silence/Slow.
 *
 * Known limitation: this does not account for the target's status-resist stat. The
 * game has a statusResist formula (see spirit_vale_data_mine/data/json/formulas.json)
 * but it is undecoded (no formula, no variables) as of this writing, so durations here
 * are an estimate/upper-bound - they may run longer than the real in-game expiry.
 */
export class StatusDefinitions {
  private constructor() {}

  static readonly values: readonly FishNetStatusDefinition[] = [
`;

  const body = updatedDefinitions.map(formatDefinition).join("\n");
  const footer = `\n  ];
}
`;

  writeFileSync(OUTPUT_FILE, header + body + footer, "utf8");

  console.log(`Updated ${updatedCount}/${updatedDefinitions.length} status definitions with duration data.`);
  if (unmatchedStatusIds.length > 0) {
    console.log(
      `Note: ${unmatchedStatusIds.length} status IDs granted in the data-mine have no matching catalog entry (skipped): ${unmatchedStatusIds.join(", ")}`,
    );
  }
}

main();
