import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import { PERCENT_STATS, STAT_NAMES } from "./stat-names.ts";
import type { CharacterArtifact, CharacterAttributes, CharacterEquipment, CharacterSnapshot, CharacterSubstat } from "./types.ts";

const ARCHETYPES: Record<number, string> = {
  [-1]: "Novice", 0: "Warrior", 1: "Mage", 2: "Rogue", 3: "Knight", 4: "Summoner", 5: "Acolyte", 6: "Scout",
  10: "Paladin", 11: "Dragon Knight", 12: "Berserker", 13: "Revenant", 14: "Priest", 15: "Monk", 16: "Wizard",
  17: "Chronomancer", 18: "Druid", 19: "Warlock", 20: "Assassin", 21: "Shinobi", 22: "Gunslinger", 23: "Ranger",
  24: "Jester", 25: "Nightshade", 26: "Necromancer", 27: "Spellblade", 28: "Blade Master", 29: "Mechanist", 30: "Alchemist", 31: "Weaver",
};
const EQUIP_SLOTS = ["Main hand", "Off hand", "Head", "Legs", "Feet", "Chest", "Left accessory", "Right accessory", "Eyewear", "Back"];
const ARTIFACT_SLOTS = ["Rune", "Jewel", "Scroll", "Relic"];
const LOADOUTS = ["Normal", "Secondary", "Heavy"] as const;

export interface DecodedCharacterUpdate {
  updateType: number;
  snapshot: CharacterSnapshot;
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
  const history = readCharacterHistory(reader);
  return {
    updateType,
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
  const substats = reader.list(() => readSubstat(reader, slotIndex, false)).filter((value): value is CharacterSubstat => value !== undefined);
  const cards = reader.list(() => reader.string(256)).filter((value): value is string => Boolean(value));
  reader.packed();
  reader.packed();
  reader.packed();
  reader.string(80);
  const refine = reader.packed();
  const itemId = reader.string(256) ?? "Unknown equipment";
  reader.boolean();
  return { slot: EQUIP_SLOTS[slotIndex] ?? `Slot ${slotIndex}`, itemId, refine, cards, substats };
}

function readArtifact(reader: CharacterReader): CharacterArtifact | undefined {
  return readArtifactData(reader);
}

function readArtifactData(reader: CharacterReader): CharacterArtifact | undefined {
  if (!reader.object()) return undefined;
  const rawStats: Array<{ type: number; roll: number } | undefined> = reader.list(() => readRawSubstat(reader));
  const slotIndex = reader.packed();
  const gems = reader.list(() => readRefinableItem(reader)).filter((value): value is string => Boolean(value));
  reader.string(80);
  const refine = reader.packed();
  const itemId = reader.string(256) ?? "Unknown artifact";
  reader.boolean();
  const substats = rawStats.flatMap((stat) => stat ? [convertSubstat(stat.type, stat.roll, slotIndex, true)] : []);
  return { slot: ARTIFACT_SLOTS[slotIndex] ?? `Artifact ${slotIndex}`, itemId, refine, gems, substats };
}

function readCharacterHistory(reader: CharacterReader): Partial<Pick<CharacterSnapshot, "playtimeSeconds" | "monsterKills" | "bossKills" | "deaths">> {
  try {
    skipSkillSystem(reader);
    reader.list(() => readEquipmentData(reader, -1));
    if (reader.object()) {
      reader.dictionary(() => readEquipmentData(reader, -1));
      reader.dictionary(() => readArtifactData(reader));
      reader.dictionary(() => skipStackable(reader));
      reader.dictionary(() => readRefinableItem(reader));
      reader.dictionary(() => skipStackable(reader));
      reader.dictionary(() => skipStackable(reader));
      reader.dictionary(() => skipCosmetic(reader));
    }
    reader.packed();
    const playtimeSeconds = reader.packed();
    const monsterKills = reader.packed();
    const bossKills = reader.packed();
    const deaths = reader.packed();
    return { playtimeSeconds, monsterKills, bossKills, deaths };
  } catch {
    // A partial callback may end after build data. The already-decoded snapshot remains useful.
    return {};
  }
}

function skipSkillSystem(reader: CharacterReader): void {
  if (!reader.object()) return;
  reader.list(() => skipSkill(reader));
  reader.list(() => skipSkill(reader));
  skipSkill(reader);
  reader.list(() => reader.string(256));
}
function skipSkill(reader: CharacterReader): void { if (reader.object()) { reader.string(256); reader.packed(); } }
function skipStackable(reader: CharacterReader): void {
  if (!reader.object()) return;
  reader.packed(); reader.string(256); reader.boolean();
}
function skipCosmetic(reader: CharacterReader): void {
  if (!reader.object()) return;
  reader.packed(); reader.boolean(); reader.string(80); reader.packed(); reader.string(256); reader.boolean();
}

function readRefinableItem(reader: CharacterReader): string | undefined {
  if (!reader.object()) return undefined;
  reader.string(80);
  reader.packed();
  const id = reader.string(256) ?? undefined;
  reader.boolean();
  return id;
}

function readSubstat(reader: CharacterReader, slot: number, artifact: boolean): CharacterSubstat | undefined {
  const stat = readRawSubstat(reader);
  return stat ? convertSubstat(stat.type, stat.roll, slot, artifact) : undefined;
}

function readRawSubstat(reader: CharacterReader): { type: number; roll: number } | undefined {
  if (!reader.object()) return undefined;
  const type = reader.packed();
  const roll = reader.packed();
  reader.string(256);
  return { type, roll };
}

function convertSubstat(type: number, roll: number, slot: number, artifact: boolean): CharacterSubstat {
  const name = STAT_NAMES[type] ?? `Stat ${type}`;
  const cap = substatCap(type, slot, artifact);
  const value = cap === undefined ? undefined : roundAwayFromZero(cap * (2 / 3 + roll / 300));
  return { type, name, roll, ...(value === undefined ? {} : { value }), percent: PERCENT_STATS.has(type) };
}

function substatCap(type: number, slot: number, artifact: boolean): number | undefined {
  if (type >= 0 && type <= 5) return 3;
  if (artifact) return ({ 69: 2, 70: 2, 71: 2, 72: 2 } as Record<number, number>)[type];
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
