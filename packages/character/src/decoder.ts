import { characterDataParameter, CURRENT_GAME_BUILD_FINGERPRINT, decodeFieldRun } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetDecodedField } from "@kar-mi/spirit-vale-tools-capture";
import { readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";
import { resolveFishNetItem } from "@kar-mi/spirit-vale-tools-items";
import { resolveFishNetSkill } from "@kar-mi/spirit-vale-tools-skills";
import { PERCENT_STATS, STAT_NAMES } from "./stat-names.ts";
import type { CharacterArtifact, CharacterAttributes, CharacterEquipment, CharacterSkill, CharacterSnapshot, CharacterSubstat } from "./types.ts";

const ARCHETYPES: Record<number, string> = {
  [-1]: "Novice", 0: "Warrior", 1: "Mage", 2: "Rogue", 3: "Knight", 4: "Summoner", 5: "Acolyte", 6: "Scout",
  10: "Paladin", 11: "Dragon Knight", 12: "Berserker", 13: "Revenant", 14: "Priest", 15: "Monk", 16: "Wizard",
  17: "Chronomancer", 18: "Druid", 19: "Warlock", 20: "Assassin", 21: "Shinobi", 22: "Gunslinger", 23: "Ranger",
  24: "Jester", 25: "Nightshade", 26: "Necromancer", 27: "Spellblade", 28: "Blade Master", 29: "Mechanist", 30: "Alchemist", 31: "Weaver",
};
const ARCHETYPE_IDS = new Map(Object.entries(ARCHETYPES).map(([id, name]) => [name, Number(id)]));
const EQUIP_SLOTS = ["Main hand", "Off hand", "Head", "Legs", "Feet", "Chest", "Left accessory", "Right accessory", "Eyewear", "Back"];
const ARTIFACT_SLOTS = ["Rune", "Jewel", "Scroll", "Relic"];
const LOADOUTS = ["Normal", "Secondary", "Heavy"] as const;

export interface DecodedCharacterUpdate {
  updateType: number;
  snapshot: CharacterSnapshot;
  currentWeight?: number;
}

export function resolveCharacterArchetypeId(name: string): number | undefined {
  return ARCHETYPE_IDS.get(name);
}

export function decodeCharacterRpcPayload(payload: Buffer, includesUpdateType: boolean, now = new Date()): DecodedCharacterUpdate {
  let startOffset = 0;
  let updateType = 327417855;
  if (includesUpdateType) {
    const decoded = readSignedPackedWhole(payload, 0);
    updateType = decoded.value;
    startOffset = decoded.nextOffset;
  }
  const run = decodeFieldRun(payload, [characterDataParameter()], startOffset);
  const tree = buildFieldTree(run.fields);
  const data = child(tree, "data");
  if (!data) throw new Error("CharacterData payload is null");

  const name = leafString(data, "Name") ?? "Unknown character";
  const title = leafString(data, "Title") || undefined;
  // `Archetypes` codes as a bare-int list (no nested object), so each element IS the leaf value.
  const archetypeNames = listValues(data, "Archetypes").map((value) => ARCHETYPES[Number(value)] ?? "Unknown");
  const level = leafNumber(data, "Level", 0);
  const experience = leafNumber(data, "Exp", 0);
  const jobLevel = leafNumber(data, "JobLevel", 0);
  const jobExperience = leafNumber(data, "JobExp", 0);

  const rawAttributes = listValues(data, "Attributes").map((value) => Number(value));
  if (rawAttributes.length < 6) throw new Error("CharacterData attributes are incomplete");
  const attributes: CharacterAttributes = {
    STR: rawAttributes[0]!, VIT: rawAttributes[1]!, AGI: rawAttributes[2]!,
    DEX: rawAttributes[3]!, INT: rawAttributes[4]!, LUK: rawAttributes[5]!,
  };
  for (const [label, value] of Object.entries(attributes)) {
    if (!Number.isInteger(value) || value < 0 || value > 100_000) throw new Error(`invalid ${label} attribute`);
  }

  const equipped = listItems(data, "Equips", (item) => readEquipmentSlot(item))
    .filter((value): value is CharacterEquipment => value !== undefined);
  const activeIndex = leafNumber(data, "ActiveLoadout", 0);
  const loadouts = [
    listItems(data, "LoadoutNormal", (item) => readEquipmentSlot(item)).filter((value): value is CharacterEquipment => value !== undefined),
    listItems(data, "LoadoutSecondary", (item) => readEquipmentSlot(item)).filter((value): value is CharacterEquipment => value !== undefined),
    listItems(data, "LoadoutHeavy", (item) => readEquipmentSlot(item)).filter((value): value is CharacterEquipment => value !== undefined),
  ];
  const artifacts = listItems(data, "Artifacts", (item) => readArtifactData(item))
    .filter((value): value is CharacterArtifact => value !== undefined);
  const equipment = loadouts[activeIndex]?.length ? loadouts[activeIndex]! : equipped;

  const { skills, currentWeight, ...history } = readCharacterHistory(data, run.complete, equipped, artifacts);

  return {
    updateType,
    ...(currentWeight === undefined ? {} : { currentWeight }),
    snapshot: {
      schemaVersion: 1,
      buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
      name,
      ...(title ? { title } : {}),
      archetypes: archetypeNames,
      level,
      experience,
      jobLevel,
      jobExperience,
      attributes,
      activeLoadout: LOADOUTS[activeIndex] ?? "Normal",
      equipment,
      artifacts,
      ...(loadouts.some((set) => set.length) ? { loadouts } : {}),
      skills,
      ...history,
      updatedAt: now.toISOString(),
      source: "live",
    },
  };
}

/** `data.Equips[i]` / one of the 3 loadouts: a slot index plus a nullable `Equip`. */
function readEquipmentSlot(node: FieldNode | undefined): CharacterEquipment | undefined {
  if (!node) return undefined;
  const slotIndex = leafNumber(node, "Slot", -1);
  return readEquipmentData(child(node, "Equip"), slotIndex);
}

function readEquipmentData(node: FieldNode | undefined, slotIndex: number): CharacterEquipment | undefined {
  if (!node) return undefined;
  const rawStats = listItems(node, "Substats", (item) => readRawSubstat(item));
  // Kept positional: an empty socket in the middle is not the same as a trailing one, and the
  // dense `cards` list below cannot express the difference.
  const cardsBySlot = listValues(node, "Cards").map((value) => (typeof value === "string" && value ? value : null));
  const cards = cardsBySlot.filter((value): value is string => Boolean(value));
  const chaosType = leafNumber(node, "ChaosType", -1); // EquipData.ChaosType — an EquipType; -1 = no chaos substat
  const refine = leafNumber(node, "Refine", 0);
  const itemId = leafString(node, "Id") ?? "Unknown equipment";
  const substatGroup = resolveFishNetItem(2, itemId)?.substatGroup;
  const substats = rawStats.flatMap((stat, index) => stat
    ? [convertSubstat(stat.type, stat.roll, slotIndex, false, substatGroup, { index, qualifier: stat.valueStr })]
    : []);
  return { slot: EQUIP_SLOTS[slotIndex] ?? `Slot ${slotIndex}`, itemId, refine, cards, substats, chaosType, cardsBySlot };
}

function readArtifactData(node: FieldNode | undefined): CharacterArtifact | undefined {
  if (!node) return undefined;
  const rawStats = listItems(node, "Substats", (item) => readRawSubstat(item));
  const slotIndex = leafNumber(node, "Slot", -1);
  const gems = listItems(node, "Gems", (item) => readRefinableItem(item)).filter((value): value is { id: string; refine: number } => value !== undefined);
  const refine = leafNumber(node, "Refine", 0);
  const itemId = leafString(node, "Id") ?? "Unknown artifact";
  const substats = rawStats.flatMap((stat, index) => stat
    ? [convertSubstat(stat.type, stat.roll, slotIndex, true, undefined, { index, qualifier: stat.valueStr })]
    : []);
  return { slot: ARTIFACT_SLOTS[slotIndex] ?? `Artifact ${slotIndex}`, itemId, refine, gems, substats };
}

function readCharacterHistory(
  data: FieldNode,
  decodeComplete: boolean,
  equipped: readonly CharacterEquipment[],
  artifacts: readonly CharacterArtifact[],
): Partial<Pick<CharacterSnapshot, "playtimeSeconds" | "monsterKills" | "bossKills" | "deaths">> & {
  skills: CharacterSkill[];
  assignedSkills?: CharacterSkill[];
  grimoires?: CharacterEquipment[];
  currentWeight?: number;
} {
  // A partial callback may end after build data. Unlike a raw byte reader, the schema-driven
  // decode does not throw on a truncated payload — it just stops emitting fields — so truncation
  // is detected here instead: an incomplete decode reports no history at all, matching the old
  // reader's all-or-nothing behavior (a partial weight/skill total would be actively misleading,
  // not just missing).
  if (!decodeComplete) return { skills: [] };
  const equippedWeight = equipped.reduce((total, item) => total + equipmentWeight(item.itemId), 0) + artifacts.length * 10;
  try {
    const { skills, assigned } = readSkillSystem(child(data, "Skills"));
    // Equipped grimoires. Read positionally, then labelled by slot so filtering empties cannot
    // silently promote the second book into the first slot.
    const grimoires = listItems(data, "Grimoires", (item) => readEquipmentData(item, -1))
      .map((item, index) => (item ? { ...item, slot: `Grimoire ${index + 1}` } : undefined))
      .filter((item): item is CharacterEquipment => item !== undefined);
    let inventoryWeight = 0;
    const inventory = child(data, "Inventory");
    if (inventory) {
      dictionaryValues(inventory, "Equips", (item) => {
        const equip = readEquipmentData(item, -1);
        if (equip) inventoryWeight += equipmentWeight(equip.itemId);
      });
      dictionaryValues(inventory, "Artifacts", (item) => {
        if (readArtifactData(item)) inventoryWeight += 10;
      });
      dictionaryValues(inventory, "Cards", (item) => { inventoryWeight += readStackableCount(item); });
      dictionaryValues(inventory, "Gems", (item) => {
        // The game's inventory-total routine reads gems but omits them from weight.
        readRefinableItem(item);
      });
      dictionaryValues(inventory, "Junks", (item) => { inventoryWeight += readStackableCount(item); });
      dictionaryValues(inventory, "Consumables", (item) => { inventoryWeight += readStackableCount(item); });
      dictionaryValues(inventory, "Cosmetics", () => undefined);
    }
    const playtimeSeconds = leafInt64Number(data, "Playtime", 0);
    const monsterKills = leafNumber(data, "MonsterKills", 0);
    const bossKills = leafNumber(data, "BossKills", 0);
    const deaths = leafNumber(data, "Deaths", 0);
    return {
      skills,
      ...(assigned.length ? { assignedSkills: assigned } : {}),
      grimoires,
      currentWeight: equippedWeight + inventoryWeight,
      playtimeSeconds,
      monsterKills,
      bossKills,
      deaths,
    };
  } catch {
    // Any other unexpected failure reading the (structurally complete) history section - the
    // already-decoded identity/equipment snapshot remains useful without it.
    return { skills: [] };
  }
}

/**
 * `SkillSystemData { Skills, Assigned, SkillCopy, Reanimations }`.
 *
 * `Skills` is the skill-TREE allocation. `Assigned` is the 40-slot action bar, which restates
 * skills at levels that do not match the allocation. Merging the two (as this did until the
 * positional-fields change) inflates levels and invents skills the player never spent a point on:
 * on a recorded level-121 job-70 Gunslinger the merge produced 146 points against a legal budget
 * of 120 (50 base + 70 job), adding Force Shot, Piercing Shot and Sniper Shot at full level and
 * doubling Panic Burst. They are kept apart, and only `SkillCopy` — which legitimately restates a
 * learned skill — is folded into the allocation.
 */
function readSkillSystem(node: FieldNode | undefined): { skills: CharacterSkill[]; assigned: CharacterSkill[] } {
  if (!node) return { skills: [], assigned: [] };
  const allocated = listItems(node, "Skills", (item) => readSkill(item));
  const assigned = listItems(node, "Assigned", (item) => readSkill(item));
  const copy = readSkill(child(node, "SkillCopy"));
  if (copy) allocated.push(copy);
  const unique = new Map<string, CharacterSkill>();
  for (const skill of allocated) {
    if (!skill) continue;
    const existing = unique.get(skill.id);
    if (!existing || skill.level > existing.level) unique.set(skill.id, skill);
  }
  return {
    skills: [...unique.values()].sort((left, right) => left.displayName.localeCompare(right.displayName)),
    assigned: assigned.filter((skill): skill is CharacterSkill => skill !== undefined),
  };
}

function readSkill(node: FieldNode | undefined): CharacterSkill | undefined {
  if (!node) return undefined;
  const id = leafString(node, "Id");
  const level = leafNumber(node, "Level", -1);
  if (!id || level < 0) return undefined;
  const definition = resolveFishNetSkill(id);
  return {
    id,
    displayName: definition?.displayName ?? id,
    level,
    effects: (definition?.effects ?? []).map((effect) => ({
      type: effect.type,
      label: effect.label ?? STAT_NAMES[effect.type] ?? `Stat ${effect.type}`,
      value: effect.value + (effect.valuePerLevel ?? 0) * level,
      percent: PERCENT_STATS.has(effect.type),
    })),
  };
}

/** `InventoryData.Cards`/`Junks`/`Consumables` dictionary value: a nullable 3-field struct, not a bare int. */
function readStackableCount(node: FieldNode | undefined): number {
  if (!node) return 0;
  return Math.max(0, leafNumber(node, "Count", 0));
}

function readRefinableItem(node: FieldNode | undefined): { id: string; refine: number } | undefined {
  if (!node) return undefined;
  const refine = leafNumber(node, "Refine", 0);
  const id = leafString(node, "Id") ?? undefined;
  return id ? { id, refine } : undefined;
}

function equipmentWeight(itemId: string): number {
  return resolveFishNetItem(2, itemId)?.weight ?? 10;
}

function readRawSubstat(node: FieldNode | undefined): { type: number; roll: number; valueStr: string } | undefined {
  if (!node) return undefined;
  const type = leafNumber(node, "Type", 0);
  const roll = leafNumber(node, "Value", 0); // StatData.Value.
  const valueStr = leafString(node, "ValueStr") ?? ""; // StatData.ValueStr — the skill/element this stat is scoped to
  return { type, roll, valueStr };
}

/**
 * Recomputes every derived substat field (name, scaled value, percent flag) from the raw
 * type + roll using the current tables. Stored snapshots persist values baked by whatever
 * build decoded them, so they must never be trusted for display or calculation.
 */
export function rescaleSubstats(snapshot: CharacterSnapshot, resolveItem: typeof resolveFishNetItem = resolveFishNetItem): CharacterSnapshot {
  return {
    ...snapshot,
    equipment: snapshot.equipment.map((item) => {
      const substatGroup = resolveItem(2, item.itemId)?.substatGroup;
      const slotIndex = equipSlotIndex(item.slot);
      return { ...item, substats: item.substats.map((stat) => convertSubstat(stat.type, stat.roll, slotIndex, false, substatGroup, stat)) };
    }),
    artifacts: snapshot.artifacts.map((item) => ({
      ...item,
      substats: item.substats.map((stat) => convertSubstat(stat.type, stat.roll, ARTIFACT_SLOTS.indexOf(item.slot), true, undefined, stat)),
    })),
  };
}

function equipSlotIndex(slot: string): number {
  const index = EQUIP_SLOTS.indexOf(slot);
  if (index >= 0) return index;
  const parsed = /^Slot (-?\d+)$/.exec(slot);
  return parsed ? Number(parsed[1]) : -1;
}

function convertSubstat(
  type: number,
  roll: number,
  slot: number,
  artifact: boolean,
  substatGroup?: string,
  positional?: { index?: number; qualifier?: string },
): CharacterSubstat {
  const name = STAT_NAMES[type] ?? `Stat ${type}`;
  const cap = substatCap(type, slot, artifact, substatGroup);
  const value = cap === undefined ? undefined : roundAwayFromZero(cap * (2 / 3 + roll / 300));
  return {
    type,
    name,
    roll,
    ...(value === undefined ? {} : { value }),
    percent: PERCENT_STATS.has(type),
    ...(positional?.qualifier ? { qualifier: positional.qualifier } : {}),
    ...(positional?.index === undefined ? {} : { index: positional.index }),
  };
}

function substatCap(type: number, slot: number, artifact: boolean, substatGroup?: string): number | undefined {
  if (type >= 0 && type <= 5) return 3;
  if (artifact) return ({ 69: 2, 70: 2, 71: 2, 72: 2 } as Record<number, number>)[type];
  const weaponCaps: Record<string, Record<number, number>> = {
    Magic: { 69: 5, 70: 5, 47: 5, 48: 5, 64: 10, 90: -10, 63: 10, 9: 5, 10: 5, 182: 10, 67: 10, 189: 1 },
    Melee: { 69: 5, 70: 5, 47: 5, 48: 5, 15: 10, 13: 20, 63: 10, 9: 5, 10: 5, 52: 10, 98: 5, 130: 1, 80: 20 },
    Ranged: { 69: 5, 70: 5, 102: 5, 48: 5, 15: 10, 13: 20, 63: 10, 9: 5, 10: 5, 52: 10, 98: 5, 25: 1, 80: 20 },
  };
  const weaponCap = substatGroup ? weaponCaps[substatGroup]?.[type] : undefined;
  if (weaponCap !== undefined) return weaponCap;
  const caps: Record<number, Record<number, number>> = {
    2: { 69: 2, 70: 2, 71: 2, 72: 2, 9: 3, 10: 3, 11: 5, 12: 5 },
    3: { 75: 25, 76: 25, 98: 5, 64: 10, 14: 15, 121: 5, 90: -10 },
    4: { 63: 10, 65: 10, 64: 10, 185: 1 },
    5: { 71: 10, 72: 10, 11: 10, 12: 10, 73: 5, 74: 5, 58: -5, 57: -5, 68: 10, 121: 5 },
    6: { 71: 2, 72: 2, 69: 2, 70: 2, 15: 5, 13: 10, 63: 5 },
    7: { 71: 2, 72: 2, 69: 2, 70: 2, 15: 5, 13: 10, 63: 5 },
    8: { 71: 2, 72: 2, 69: 2, 70: 2, 9: 3, 10: 3, 11: 5, 12: 5 },
    9: { 71: 2, 72: 2, 69: 2, 70: 2, 15: 5, 13: 10, 63: 5 },
  };
  return caps[slot]?.[type];
}
function roundAwayFromZero(value: number): number { return value < 0 ? -Math.round(-value) : Math.round(value); }

// --- Flat FishNetDecodedField[] -> nested lookup tree -----------------------------------------

/** A reconstructed node: either a leaf value (string/number/boolean/null) or nested named fields. */
type FieldNode = { [key: string]: unknown };

/** Rebuilds `fishnet/decoding/fields.ts`'s dot/bracket-flattened field names (e.g. `equips[0].itemId`, or
 * `equips.length` for a repeated field's element count) into a nested lookup tree, so the
 * projection logic below can read `CharacterData` by field name instead of wire position.
 */
function buildFieldTree(fields: readonly FishNetDecodedField[]): FieldNode {
  const root: FieldNode = {};
  for (const field of fields) {
    setFieldPath(root, parseFieldPath(field.name), field.value);
  }
  return root;
}

function parseFieldPath(name: string): Array<string | number> {
  const path: Array<string | number> = [];
  for (const segment of name.split(".")) {
    const match = /^(.+)\[(\d+)\]$/.exec(segment);
    if (match) path.push(match[1]!, Number(match[2]));
    else path.push(segment);
  }
  return path;
}

function setFieldPath(root: FieldNode, path: readonly (string | number)[], value: unknown): void {
  let node = root;
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = String(path[index]);
    const existing = node[key];
    if (!existing || typeof existing !== "object") node[key] = {};
    node = node[key] as FieldNode;
  }
  node[String(path[path.length - 1])] = value;
}

function child(node: FieldNode | undefined, key: string): FieldNode | undefined {
  const value = node?.[key];
  return value && typeof value === "object" ? value as FieldNode : undefined;
}

function leaf(node: FieldNode | undefined, key: string): unknown {
  return node?.[key];
}

function leafString(node: FieldNode | undefined, key: string): string | null {
  const value = leaf(node, key);
  return typeof value === "string" ? value : null;
}

function leafNumber(node: FieldNode | undefined, key: string, fallback: number): number {
  const value = leaf(node, key);
  return typeof value === "number" ? value : fallback;
}

/** `packedInt64` fields decode to a decimal string (precision-safe for currency); a play-time
 * count in seconds never approaches that range, so converting to `number` here is safe. */
function leafInt64Number(node: FieldNode | undefined, key: string, fallback: number): number {
  const value = leaf(node, key);
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return fallback;
}

function listLength(node: FieldNode | undefined, key: string): number {
  const value = child(node, key)?.["length"];
  return typeof value === "number" ? value : 0;
}

/** A repeated struct field: `node[key]` is `{ length, 0: {...}, 1: {...}, ... }`. */
function listItems<T>(node: FieldNode | undefined, key: string, map: (item: FieldNode | undefined, index: number) => T): T[] {
  const length = listLength(node, key);
  const container = child(node, key);
  return Array.from({ length }, (_unused, index) => map(child(container, String(index)), index));
}

/** A repeated leaf/scalar field: `node[key]` is `{ length, 0: value, 1: value, ... }`. */
function listValues(node: FieldNode | undefined, key: string): unknown[] {
  const length = listLength(node, key);
  const container = child(node, key);
  return Array.from({ length }, (_unused, index) => container?.[String(index)]);
}

/** A `Dictionary<string, T>` field: same shape as a repeated struct, plus a `$key` per element. */
function dictionaryValues(node: FieldNode | undefined, key: string, visit: (item: FieldNode | undefined) => void): void {
  const length = listLength(node, key);
  const container = child(node, key);
  for (let index = 0; index < length; index += 1) visit(child(container, String(index)));
}
