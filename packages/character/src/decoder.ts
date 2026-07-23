import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import { resolveFishNetItem } from "@spiritvale/items";
import { resolveFishNetSkill } from "@spiritvale/skills";
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
  const reader = new CharacterReader(payload);
  const updateType = includesUpdateType ? reader.packed() : 327417855;
  reader.object();
  reader.string(80); // UID; intentionally discarded.
  reader.string(80); // Account id; intentionally discarded.
  reader.packed();
  reader.string(80);
  reader.string(80);
  const name = reader.string(64) ?? "Unknown character";
  reader.object();
  for (let index = 0; index < 10; index += 1) reader.packed();
  reader.object();
  reader.booleans();
  reader.list(() => { reader.object(); reader.packed(); reader.string(256); reader.packed(); reader.boolean(); });
  const title = reader.string(256) ?? undefined;
  reader.string(256);
  reader.string(256);
  const archetypes = reader.list(() => ARCHETYPES[reader.packed()] ?? "Unknown");
  const level = reader.packed();
  const experience = reader.packed();
  const jobLevel = reader.packed();
  const jobExperience = reader.packed();
  skipCharacterState(reader);
  const values = reader.list(() => reader.packed());
  if (values.length < 6) throw new Error("CharacterData attributes are incomplete");
  const attributes: CharacterAttributes = {
    STR: values[0]!, VIT: values[1]!, AGI: values[2]!, DEX: values[3]!, INT: values[4]!, LUK: values[5]!,
  };
  for (const [label, value] of Object.entries(attributes)) {
    if (!Number.isInteger(value) || value < 0 || value > 100_000) throw new Error(`invalid ${label} attribute`);
  }
  const equipped = reader.list(() => readEquipmentSlot(reader)).filter((value): value is CharacterEquipment => value !== undefined);
  const activeIndex = reader.packed();
  const loadouts = [
    reader.list(() => readEquipmentSlot(reader)).filter((value): value is CharacterEquipment => value !== undefined),
    reader.list(() => readEquipmentSlot(reader)).filter((value): value is CharacterEquipment => value !== undefined),
    reader.list(() => readEquipmentSlot(reader)).filter((value): value is CharacterEquipment => value !== undefined),
  ];
  const artifacts = reader.list(() => readArtifact(reader)).filter((value): value is CharacterArtifact => value !== undefined);
  const equipment = loadouts[activeIndex]?.length ? loadouts[activeIndex]! : equipped;
  const { skills, currentWeight, ...history } = readCharacterHistory(reader, equipped, artifacts);
  return {
    updateType,
    ...(currentWeight === undefined ? {} : { currentWeight }),
    snapshot: {
      schemaVersion: 1,
      buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
      name,
      ...(title ? { title } : {}),
      archetypes,
      level,
      experience,
      jobLevel,
      jobExperience,
      attributes,
      activeLoadout: LOADOUTS[activeIndex] ?? "Normal",
      equipment,
      artifacts,
      skills,
      ...history,
      updatedAt: now.toISOString(),
      source: "live",
    },
  };
}

function readEquipmentSlot(reader: CharacterReader): CharacterEquipment | undefined {
  if (!reader.object()) return undefined;
  const slotIndex = reader.packed();
  return readEquipmentData(reader, slotIndex);
}

function readEquipmentData(reader: CharacterReader, slotIndex: number): CharacterEquipment | undefined {
  if (!reader.object()) return undefined;
  const rawStats = reader.list(() => readRawSubstat(reader));
  const cards = reader.list(() => reader.string(256)).filter((value): value is string => Boolean(value));
  reader.packed();
  reader.packed();
  reader.packed();
  reader.string(80);
  const refine = reader.packed();
  const itemId = reader.string(256) ?? "Unknown equipment";
  reader.boolean();
  const substatGroup = resolveFishNetItem(2, itemId)?.substatGroup;
  const substats = rawStats.flatMap((stat) => stat ? [convertSubstat(stat.type, stat.roll, slotIndex, false, substatGroup)] : []);
  return { slot: EQUIP_SLOTS[slotIndex] ?? `Slot ${slotIndex}`, itemId, refine, cards, substats };
}

function readArtifact(reader: CharacterReader): CharacterArtifact | undefined {
  return readArtifactData(reader);
}

function readArtifactData(reader: CharacterReader): CharacterArtifact | undefined {
  if (!reader.object()) return undefined;
  const rawStats: Array<{ type: number; roll: number } | undefined> = reader.list(() => readRawSubstat(reader));
  const slotIndex = reader.packed();
  const gems = reader.list(() => readRefinableItem(reader)).filter((value): value is { id: string; refine: number } => value !== undefined);
  reader.string(80);
  const refine = reader.packed();
  const itemId = reader.string(256) ?? "Unknown artifact";
  reader.boolean();
  const substats = rawStats.flatMap((stat) => stat ? [convertSubstat(stat.type, stat.roll, slotIndex, true)] : []);
  return { slot: ARTIFACT_SLOTS[slotIndex] ?? `Artifact ${slotIndex}`, itemId, refine, gems, substats };
}

function readCharacterHistory(
  reader: CharacterReader,
  equipped: readonly CharacterEquipment[],
  artifacts: readonly CharacterArtifact[],
): Partial<Pick<CharacterSnapshot, "playtimeSeconds" | "monsterKills" | "bossKills" | "deaths">> & {
  skills: CharacterSkill[];
  currentWeight?: number;
} {
  const equippedWeight = equipped.reduce((total, item) => total + equipmentWeight(item.itemId), 0) + artifacts.length * 10;
  try {
    const skills = readSkillSystem(reader);
    reader.list(() => readEquipmentData(reader, -1));
    let inventoryWeight = 0;
    if (reader.object()) {
      reader.dictionary(() => {
        const item = readEquipmentData(reader, -1);
        if (item) inventoryWeight += equipmentWeight(item.itemId);
      });
      reader.dictionary(() => {
        if (readArtifactData(reader)) inventoryWeight += 10;
      });
      reader.dictionary(() => { inventoryWeight += readStackableCount(reader); });
      reader.dictionary(() => {
        // The game's inventory-total routine reads gems but omits them from weight.
        readRefinableItem(reader);
      });
      reader.dictionary(() => { inventoryWeight += readStackableCount(reader); });
      reader.dictionary(() => { inventoryWeight += readStackableCount(reader); });
      reader.dictionary(() => skipCosmetic(reader));
    }
    reader.packed();
    const playtimeSeconds = reader.packed();
    const monsterKills = reader.packed();
    const bossKills = reader.packed();
    const deaths = reader.packed();
    return { skills, currentWeight: equippedWeight + inventoryWeight, playtimeSeconds, monsterKills, bossKills, deaths };
  } catch {
    // A partial callback may end after build data. The already-decoded snapshot remains useful.
    return { skills: [] };
  }
}

function readSkillSystem(reader: CharacterReader): CharacterSkill[] {
  if (!reader.object()) return [];
  const skills = [
    ...reader.list(() => readSkill(reader)),
    ...reader.list(() => readSkill(reader)),
  ];
  const selected = readSkill(reader);
  if (selected) skills.push(selected);
  reader.list(() => reader.string(256));
  const unique = new Map<string, CharacterSkill>();
  for (const skill of skills) {
    if (!skill) continue;
    const existing = unique.get(skill.id);
    if (!existing || skill.level > existing.level) unique.set(skill.id, skill);
  }
  return [...unique.values()].sort((left, right) => left.displayName.localeCompare(right.displayName));
}
function readSkill(reader: CharacterReader): CharacterSkill | undefined {
  if (!reader.object()) return undefined;
  const id = reader.string(256);
  const level = reader.packed();
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
function readStackableCount(reader: CharacterReader): number {
  if (!reader.object()) return 0;
  const count = reader.packed();
  reader.string(256); reader.boolean();
  return Math.max(0, count);
}
function skipCosmetic(reader: CharacterReader): void {
  if (!reader.object()) return;
  reader.packed(); reader.boolean(); reader.string(80); reader.packed(); reader.string(256); reader.boolean();
}

function readRefinableItem(reader: CharacterReader): { id: string; refine: number } | undefined {
  if (!reader.object()) return undefined;
  reader.string(80);
  const refine = reader.packed();
  const id = reader.string(256) ?? undefined;
  reader.boolean();
  return id ? { id, refine } : undefined;
}

function equipmentWeight(itemId: string): number {
  return resolveFishNetItem(2, itemId)?.weight ?? 10;
}

function readRawSubstat(reader: CharacterReader): { type: number; roll: number } | undefined {
  if (!reader.object()) return undefined;
  const type = reader.packed();
  const roll = reader.packed();
  reader.string(256);
  return { type, roll };
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
      return { ...item, substats: item.substats.map((stat) => convertSubstat(stat.type, stat.roll, slotIndex, false, substatGroup)) };
    }),
    artifacts: snapshot.artifacts.map((item) => ({
      ...item,
      substats: item.substats.map((stat) => convertSubstat(stat.type, stat.roll, ARTIFACT_SLOTS.indexOf(item.slot), true)),
    })),
  };
}

function equipSlotIndex(slot: string): number {
  const index = EQUIP_SLOTS.indexOf(slot);
  if (index >= 0) return index;
  const parsed = /^Slot (-?\d+)$/.exec(slot);
  return parsed ? Number(parsed[1]) : -1;
}

function convertSubstat(type: number, roll: number, slot: number, artifact: boolean, substatGroup?: string): CharacterSubstat {
  const name = STAT_NAMES[type] ?? `Stat ${type}`;
  const cap = substatCap(type, slot, artifact, substatGroup);
  const value = cap === undefined ? undefined : roundAwayFromZero(cap * (2 / 3 + roll / 300));
  return { type, name, roll, ...(value === undefined ? {} : { value }), percent: PERCENT_STATS.has(type) };
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

function skipCharacterState(reader: CharacterReader): void {
  if (!reader.object()) return;
  reader.float();
  reader.float();
  reader.string(256);
  if (reader.object()) { reader.float(); reader.float(); reader.float(); }
  reader.list(() => { if (!reader.object()) return; reader.string(256); reader.string(256); reader.packed(); reader.boolean(); reader.boolean(); });
  reader.packed();
  reader.list(() => { if (!reader.object()) return; reader.string(256); reader.packed(); });
  reader.list(() => { if (!reader.object()) return; reader.string(256); reader.packed(); reader.float(); reader.packed(); });
}

export class CharacterReader {
  private offset = 0;
  constructor(private readonly buffer: Buffer) {}

  boolean(): boolean {
    this.ensure(1);
    return this.buffer[this.offset++] === 1;
  }

  object(): boolean { return !this.boolean(); }

  packed(): number {
    let raw = 0n;
    let shift = 0n;
    for (let count = 0; count < 10; count += 1) {
      this.ensure(1);
      const byte = this.buffer[this.offset++]!;
      raw |= BigInt(byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) {
        const value = (raw >> 1n) ^ (-(raw & 1n));
        const result = Number(value);
        if (!Number.isSafeInteger(result)) throw new Error("packed integer exceeds safe range");
        return result;
      }
      shift += 7n;
    }
    throw new Error("invalid packed integer");
  }

  string(maximumLength: number): string | null {
    const length = this.packed();
    if (length === -1) return null;
    if (length < 0 || length > maximumLength) throw new Error("invalid CharacterData string length");
    this.ensure(length);
    const value = new TextDecoder("utf-8", { fatal: true }).decode(this.buffer.subarray(this.offset, this.offset + length));
    this.offset += length;
    return value;
  }

  float(): number {
    this.ensure(4);
    const value = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  booleans(): boolean[] { return this.list(() => this.boolean()); }

  list<T>(read: () => T): T[] {
    const length = this.packed();
    if (length === -1) return [];
    if (length < 0 || length > 100_000) throw new Error("invalid CharacterData collection length");
    return Array.from({ length }, read);
  }

  dictionary(readValue: () => unknown): void {
    const length = this.packed();
    if (length === -1) return;
    if (length < 0 || length > 100_000) throw new Error("invalid CharacterData dictionary length");
    for (let index = 0; index < length; index += 1) { this.string(256); readValue(); }
  }

  private ensure(length: number): void {
    if (this.offset + length > this.buffer.length) throw new Error("truncated CharacterData payload");
  }
}
