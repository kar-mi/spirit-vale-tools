#!/usr/bin/env bun
/**
 * Regenerates `packages/items/src/definitions/*.ts` from an `items.json` export for the
 * current game build, replacing hand-pasted-into-place item data with a proper generator (the
 * same treatment `scripts/generate-rpc-map.ts` gave the RPC map).
 *
 * `items.json` groups every item by `itemType` (0-6), routed here to one file each:
 *   0 junk -> junks.ts        1 consumable -> consumables.ts   2 equipment -> equipment.ts
 *   3 artifact -> artifacts.ts 4 card -> cards.ts               5 gem -> gems.ts
 *   6 cosmetic -> cosmetics.ts
 *
 * Two equipment fields have no source anywhere in `items.json` (confirmed by exhaustive
 * search): `weight` and `substatGroup`. Both are carried forward by id from whatever is
 * currently checked into `equipment.ts` - genuinely new equipment ids get a `weight: 0`
 * placeholder and are called out in this script's summary output for manual review, rather
 * than guessed at.
 *
 * Usage: `bun run scripts/generate-items-map.ts <path/to/items.json>`
 * The path is required - this script has no default and no assumption about where a
 * data-mine-style export lives relative to this repo (that varies per machine/checkout and is
 * not this repo's concern to hardcode).
 *
 * After running: review the diff under packages/items/src/definitions/, resolve any "NEEDS
 * REVIEW" equipment ids printed below, then run the items package's build/tests.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFINITIONS_DIR = path.resolve(SCRIPT_DIR, "../packages/items/src/definitions");

interface DataMineStatValue {
  Value: number;
  ValueLv: number;
  ValueStr: string;
  ValueStr2: string;
}

interface DataMineStat {
  Name: string;
  Type: number;
  Value: DataMineStatValue;
}

interface DataMineItemConfig {
  Type?: number;
  PrimaryStats?: DataMineStat[];
  SecondaryStats?: DataMineStat[];
  Stats?: DataMineStat[];
}

interface DataMineArtifactEffect {
  name: string;
  type: number;
  value: number;
  valueLv: number;
  targetId: string | null;
}

interface DataMineArtifactSlots {
  rune: DataMineArtifactEffect[];
  jewel: DataMineArtifactEffect[];
  scroll: DataMineArtifactEffect[];
  relic: DataMineArtifactEffect[];
}

interface DataMineItem {
  itemType: number;
  id: string;
  displayName: string;
  config?: DataMineItemConfig;
  fullSet?: DataMineArtifactEffect[];
  perPiece?: DataMineArtifactEffect[];
  perRefine?: DataMineArtifactEffect[];
  individualBySlot?: DataMineArtifactSlots;
}

interface OutputEffect {
  type: number;
  value: number;
  target?: { kind: "element" | "skill" | "status"; id: string };
}

interface OutputItem {
  itemType: number;
  id: string;
  displayName: string;
  weight?: number;
  substatGroup?: string;
  effects?: OutputEffect[];
  refineEffects?: OutputEffect[];
  artifactSet?: {
    requiredPieces: number;
    perPieceBase: OutputEffect[];
    perPiece: OutputEffect[];
    fullSet: OutputEffect[];
  };
  artifactSlotEffects?: Record<string, OutputEffect[]>;
  artifactSlotRefineEffects?: Record<string, OutputEffect[]>;
}

const USAGE = "Usage: bun run scripts/generate-items-map.ts <path/to/items.json>";

function resolveInputFile(): string {
  const arg = process.argv[2];
  if (!arg) throw new Error(USAGE);
  return path.resolve(process.cwd(), arg);
}

function loadItems(inputFile: string): DataMineItem[] {
  if (!existsSync(inputFile)) {
    throw new Error(`items.json not found at ${inputFile}. Pass its path as an argument, or export a current one first.`);
  }
  return JSON.parse(readFileSync(inputFile, "utf8")) as DataMineItem[];
}

/**
 * Every stat's own `name`/`Name` (e.g. `"SkillDamage_2_AerialShot"`, `"DamageToElement_10_Fire"`,
 * `"StatusDuration_-2"`) is prefixed with the game's stat-enum name, so the target `kind` can be
 * read straight off it without needing a separate stat-enum export as input. Order matters:
 * `SkillRemoveStatus` and `SkillAutocast` must resolve to "skill", not "status", so the
 * skill/autocast check runs first.
 */
function kindFromStatName(name: string): "element" | "skill" | "status" | undefined {
  if (name.includes("Skill") || name.includes("Autocast")) return "skill";
  if (name.includes("Element")) return "element";
  if (name.includes("Status")) return "status";
  return undefined;
}

function targetFor(name: string, targetId: string | null | undefined): OutputEffect["target"] | undefined {
  if (!targetId) return undefined;
  const kind = kindFromStatName(name);
  if (!kind) {
    throw new Error(`stat ${JSON.stringify(name)} has target id ${JSON.stringify(targetId)} but no recognizable kind prefix`);
  }
  return { kind, id: targetId };
}

/** Unity float32 values round-trip through JSON as e.g. 0.30000001192092896; clean that back up. */
function roundValue(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** Splits a `Stats`/`PrimaryStats`+`SecondaryStats` list into base effects and per-refine effects. */
function effectsFromStats(stats: DataMineStat[]): { effects: OutputEffect[]; refineEffects: OutputEffect[] } {
  const effects: OutputEffect[] = [];
  const refineEffects: OutputEffect[] = [];
  for (const stat of stats) {
    const target = targetFor(stat.Name, stat.Value.ValueStr);
    if (stat.Value.Value !== 0) {
      const value = roundValue(stat.Value.Value);
      effects.push(target ? { type: stat.Type, value, target } : { type: stat.Type, value });
    }
    if (stat.Value.ValueLv !== 0) {
      const value = roundValue(stat.Value.ValueLv);
      refineEffects.push(target ? { type: stat.Type, value, target } : { type: stat.Type, value });
    }
  }
  return { effects, refineEffects };
}

/**
 * Cards aren't refinable, and each stat's magnitude lives in whichever of `Value`/`ValueLv` is
 * non-zero (which one varies per stat type) - so in general both fold into a single `effects`
 * list rather than being split into base/refine like equipment and gems.
 *
 * The one known exception: the "Delivery Robot" card's weight-limit bonus (stat type 101)
 * scales with its *equipped gear's* refine level when socketed, so it belongs in
 * `refineEffects` like a normal refine-scaling stat. This is a deliberate game-design fact with
 * no signal in items.json to derive it from (its stat entry is structurally identical to the
 * "Nozzle Robot" card's non-scaling weight bonus) - see the items package's v0.1.6 changelog
 * entry ("Correctly scale socketed card effects with their equipped gear's refine level").
 */
const CARD_REFINE_STAT_TYPES: Record<string, Set<number>> = {
  "Delivery Robot": new Set([101]),
};

function effectsForCards(id: string, stats: DataMineStat[]): { effects: OutputEffect[]; refineEffects: OutputEffect[] } {
  const effects: OutputEffect[] = [];
  const refineEffects: OutputEffect[] = [];
  const refineTypes = CARD_REFINE_STAT_TYPES[id];
  for (const stat of stats) {
    const magnitude = stat.Value.Value !== 0 ? stat.Value.Value : stat.Value.ValueLv;
    if (magnitude === 0) continue;
    const target = targetFor(stat.Name, stat.Value.ValueStr);
    const value = roundValue(magnitude);
    const entry = target ? { type: stat.Type, value, target } : { type: stat.Type, value };
    (refineTypes?.has(stat.Type) ? refineEffects : effects).push(entry);
  }
  return { effects, refineEffects };
}

/** Artifact `fullSet`/`individualBySlot` entries use `value` as the magnitude. */
function effectsFromValue(entries: DataMineArtifactEffect[]): OutputEffect[] {
  return entries.filter((e) => e.value !== 0).map((e) => {
    const target = targetFor(e.name, e.targetId);
    const value = roundValue(e.value);
    return target ? { type: e.type, value, target } : { type: e.type, value };
  });
}

/** Artifact `perPiece`/`perRefine`/`individualBySlot` refine entries use `valueLv` as the magnitude. */
function effectsFromValueLv(entries: DataMineArtifactEffect[]): OutputEffect[] {
  return entries.filter((e) => e.valueLv !== 0).map((e) => {
    const target = targetFor(e.name, e.targetId);
    const value = roundValue(e.valueLv);
    return target ? { type: e.type, value, target } : { type: e.type, value };
  });
}

function withEffects(item: OutputItem, effects: OutputEffect[], refineEffects: OutputEffect[]): void {
  if (effects.length > 0) item.effects = effects;
  if (refineEffects.length > 0) item.refineEffects = refineEffects;
}

const ARTIFACT_REQUIRED_PIECES = 4;
const ARTIFACT_SLOTS = ["rune", "jewel", "scroll", "relic"] as const;
function capitalizeSlot(slot: string): string {
  return slot[0]!.toUpperCase() + slot.slice(1);
}

function buildOutputItem(
  raw: DataMineItem,
  existingEquipment: Map<string, { weight: number; substatGroup?: string }>,
  reviewIds: string[],
): OutputItem {
  const item: OutputItem = { itemType: raw.itemType, id: raw.id, displayName: raw.displayName };

  if (raw.itemType === 2) {
    // equipment
    const stats = [...(raw.config?.PrimaryStats ?? []), ...(raw.config?.SecondaryStats ?? [])];
    const { effects, refineEffects } = effectsFromStats(stats);
    const existing = existingEquipment.get(raw.id);
    if (existing) {
      item.weight = existing.weight;
    } else {
      item.weight = 0;
      reviewIds.push(raw.id);
    }
    withEffects(item, effects, refineEffects);
    if (existing?.substatGroup) item.substatGroup = existing.substatGroup;
    return item;
  }

  if (raw.itemType === 4) {
    // card
    const { effects, refineEffects } = effectsForCards(raw.id, raw.config?.Stats ?? []);
    withEffects(item, effects, refineEffects);
    return item;
  }

  if (raw.itemType === 5) {
    // gem
    const { effects, refineEffects } = effectsFromStats(raw.config?.Stats ?? []);
    withEffects(item, effects, refineEffects);
    return item;
  }

  if (raw.itemType === 3) {
    // artifact
    const perRefine = effectsFromValueLv(raw.perRefine ?? []);
    if (perRefine.length > 0) item.refineEffects = perRefine;

    if (raw.individualBySlot) {
      const slotEffects: Record<string, OutputEffect[]> = {};
      const slotRefineEffects: Record<string, OutputEffect[]> = {};
      for (const slot of ARTIFACT_SLOTS) {
        const entries = raw.individualBySlot[slot] ?? [];
        slotEffects[capitalizeSlot(slot)] = effectsFromValue(entries);
        slotRefineEffects[capitalizeSlot(slot)] = effectsFromValueLv(entries);
      }
      if (Object.values(slotEffects).some((v) => v.length > 0)) item.artifactSlotEffects = slotEffects;
      if (Object.values(slotRefineEffects).some((v) => v.length > 0)) item.artifactSlotRefineEffects = slotRefineEffects;
    }

    const fullSet = effectsFromValue(raw.fullSet ?? []);
    const perPiece = effectsFromValueLv(raw.perPiece ?? []);
    item.artifactSet = { requiredPieces: ARTIFACT_REQUIRED_PIECES, perPieceBase: [], perPiece, fullSet };
    return item;
  }

  // junk (0), consumable (1), cosmetic (6): id/displayName only
  return item;
}

/** Reads the currently-checked-in equipment.ts to carry forward weight/substatGroup, which have no source in items.json. */
function loadExistingEquipment(): Map<string, { weight: number; substatGroup?: string }> {
  const filePath = path.join(DEFINITIONS_DIR, "equipment.ts");
  const text = readFileSync(filePath, "utf8");
  const start = text.indexOf("[");
  const end = text.indexOf("] as const satisfies");
  const arr = JSON.parse(text.slice(start, end + 1)) as { id: string; weight: number; substatGroup?: string }[];
  return new Map(arr.map((e) => [e.id, { weight: e.weight, substatGroup: e.substatGroup }]));
}

function formatArrayLiteral(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  return json
    .split("\n")
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join("\n");
}

function writeCategoryFile(fileName: string, className: string, typeName: string, items: OutputItem[]): void {
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));
  const content =
    `import type { ${typeName} } from "../catalog.ts";\n\n` +
    `export class ${className} {\n` +
    `  private constructor() {}\n\n` +
    `  static readonly values = ${formatArrayLiteral(sorted)} as const satisfies readonly ${typeName}[];\n` +
    `}\n`;
  writeFileSync(path.join(DEFINITIONS_DIR, fileName), content, "utf8");
}

const CATEGORIES = [
  { itemType: 0, fileName: "junks.ts", className: "JunkItemDefinitions", typeName: "FishNetItemDefinition" },
  { itemType: 1, fileName: "consumables.ts", className: "ConsumableItemDefinitions", typeName: "FishNetItemDefinition" },
  { itemType: 2, fileName: "equipment.ts", className: "EquipmentItemDefinitions", typeName: "FishNetEquipmentItemDefinition" },
  { itemType: 3, fileName: "artifacts.ts", className: "ArtifactItemDefinitions", typeName: "FishNetItemDefinition" },
  { itemType: 4, fileName: "cards.ts", className: "CardItemDefinitions", typeName: "FishNetItemDefinition" },
  { itemType: 5, fileName: "gems.ts", className: "GemItemDefinitions", typeName: "FishNetItemDefinition" },
  { itemType: 6, fileName: "cosmetics.ts", className: "CosmeticItemDefinitions", typeName: "FishNetItemDefinition" },
] as const;

function main(): void {
  const inputFile = resolveInputFile();
  const rawItems = loadItems(inputFile);
  const existingEquipment = loadExistingEquipment();
  const reviewIds: string[] = [];

  const byType = new Map<number, DataMineItem[]>();
  for (const raw of rawItems) {
    if (!byType.has(raw.itemType)) byType.set(raw.itemType, []);
    byType.get(raw.itemType)!.push(raw);
  }

  for (const category of CATEGORIES) {
    const rawForType = byType.get(category.itemType) ?? [];
    const items = rawForType.map((raw) => buildOutputItem(raw, existingEquipment, reviewIds));
    writeCategoryFile(category.fileName, category.className, category.typeName, items);
    console.log(`Generated ${items.length} ${category.fileName} entries from ${inputFile}.`);
  }

  if (reviewIds.length > 0) {
    console.log(`\nNEEDS REVIEW - new equipment ids with no existing weight/substatGroup to carry forward (defaulted to weight: 0):`);
    for (const id of reviewIds) console.log(`  - ${id}`);
  }
}

main();
