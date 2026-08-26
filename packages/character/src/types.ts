export const ATTRIBUTE_NAMES = ["STR", "VIT", "AGI", "DEX", "INT", "LUK"] as const;
export type CharacterAttributeName = typeof ATTRIBUTE_NAMES[number];

export interface CharacterAttributes {
  STR: number;
  VIT: number;
  AGI: number;
  DEX: number;
  INT: number;
  LUK: number;
}

export interface CharacterSnapshot {
  schemaVersion: 1;
  buildFingerprint: string;
  name: string;
  title?: string;
  archetypes: string[];
  level: number;
  experience: number;
  jobLevel: number;
  jobExperience: number;
  attributes: CharacterAttributes;
  activeLoadout: "Normal" | "Secondary" | "Heavy";
  equipment: CharacterEquipment[];
  artifacts: CharacterArtifact[];
  /** The skill-TREE allocation: what the player actually spent points on. */
  skills: CharacterSkill[];
  /** The action bar (`SkillSystemData.Assigned`, 40 slots). */
  assignedSkills?: CharacterSkill[];
  /** The three stored weapon loadouts (Normal, Secondary, Heavy) in wire order, when the payload carried them. */
  loadouts?: CharacterEquipment[][];
  /** Equipped grimoires in wire order. Absent when the payload ended before the build section. */
  grimoires?: CharacterEquipment[];
  playtimeSeconds?: number;
  monsterKills?: number;
  bossKills?: number;
  deaths?: number;
  updatedAt: string;
  source: "live" | "cached";
}

export interface CharacterSubstat {
  type: number;
  name: string;
  roll: number;
  value?: number;
  percent: boolean;
  /** `StatData.ValueStr` — the qualifier scoping this stat to one skill or element (e.g. a damage bonus that only applies to a single skill). */
  qualifier?: string;
  /** Position of this substat in the item's wire array. */
  index?: number;
}

export interface CharacterEquipment {
  slot: string;
  itemId: string;
  refine: number;
  cards: string[];
  substats: CharacterSubstat[];
  /** `EquipData.ChaosType` — the `EquipType` whose substat pool the chaos roll was drawn from, or -1 when the item has no chaos substat. */
  chaosType?: number;
  /** Cards by socket position; `null` is an empty socket. */
  cardsBySlot?: Array<string | null>;
}

export interface CharacterArtifact {
  slot: string;
  itemId: string;
  refine: number;
  gems: CharacterRefinableItem[];
  substats: CharacterSubstat[];
}

export interface CharacterRefinableItem {
  id: string;
  refine: number;
}

/** A learned skill as sent by the character callback. */
export interface CharacterSkill {
  id: string;
  displayName: string;
  level: number;
  effects: CharacterSkillEffect[];
}

export interface CharacterSkillEffect {
  type: number;
  label: string;
  value: number;
  percent: boolean;
}

export interface CharacterStatBreakdown {
  id: string;
  label: string;
  category: "Offense" | "Accuracy" | "Defense" | "Resources" | "Recovery" | "Speed" | "Sustain" | "Mitigation" | "Utility";
  tab: "basic" | "advanced";
  base: number;
  gear: number;
  value: number;
  /** Server-actual value captured from the wire, when the protocol surfaces one. */
  record?: number;
  unit?: "%";
  formula: string;
  inputs: Record<string, number>;
}

/** Server-actual values synced for the local player's unit components. */
export interface CharacterRecordValues {
  currentHealth?: number;
  /** Effective HP ceiling: authoritative `maxHealth` when present, otherwise a settled regen inference. */
  normalizedMaxHp?: number;
  maxHealth?: number;
  currentMana?: number;
  /** Effective MP ceiling: authoritative `maxMana` when present, otherwise a settled regen inference. */
  normalizedMaxMp?: number;
  maxMana?: number;
  moveSpeed?: number;
  updatedAt?: string;
}

/** Live inventory weight reconstructed from the same character payload used by the game UI. */
export interface CharacterWeight {
  current: number;
  maximum: number;
}

export interface GearStatTotal {
  type: number;
  name: string;
  total: number;
  percent: boolean;
  unresolvedRolls: number;
}

export interface CharacterIdentity {
  name: string;
  level?: number;
  jobLevel?: number;
}

export interface CharacterViewState {
  snapshot?: CharacterSnapshot;
  identity?: CharacterIdentity;
  stats: CharacterStatBreakdown[];
  gearTotals: GearStatTotal[];
  records?: CharacterRecordValues;
  weight?: CharacterWeight;
  status: "waiting" | "cached" | "live" | "unsupported";
  statusDetail: string;
}

export interface CharacterHealingTraits {
  hasSiphonHealth: boolean;
  hasHealthLeech: boolean;
}
