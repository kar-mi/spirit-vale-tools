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
  skills: CharacterSkill[];
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
}

export interface CharacterEquipment {
  slot: string;
  itemId: string;
  refine: number;
  cards: string[];
  substats: CharacterSubstat[];
}

export interface CharacterArtifact {
  slot: string;
  itemId: string;
  refine: number;
  gems: string[];
  substats: CharacterSubstat[];
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
  unit?: "%";
  formula: string;
  inputs: Record<string, number>;
}

export interface GearStatTotal {
  type: number;
  name: string;
  total: number;
  percent: boolean;
  unresolvedRolls: number;
}

export interface CharacterViewState {
  snapshot?: CharacterSnapshot;
  stats: CharacterStatBreakdown[];
  gearTotals: GearStatTotal[];
  status: "waiting" | "cached" | "live" | "unsupported";
  statusDetail: string;
}
