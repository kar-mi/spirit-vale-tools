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
  /**
   * The action bar (`SkillSystemData.Assigned`, 40 slots). These restate learned skills at levels
   * that do not match the allocation, so they are reported separately and must never be merged
   * into `skills` — doing so invents points the character never spent.
   */
  assignedSkills?: CharacterSkill[];
  /**
   * The three stored weapon loadouts (Normal, Secondary, Heavy) in wire order, when the payload
   * carried them. `equipment` stays the active set; this is additive and may be absent.
   */
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
  /**
   * `StatData.ValueStr` — the qualifier scoping this stat to one skill or element (e.g. a damage
   * bonus that only applies to a single skill). Empty string when the stat is unscoped.
   */
  qualifier?: string;
  /**
   * Position of this substat in the item's wire array. `substats` is densified, so without this
   * an empty middle slot is indistinguishable from a shifted one.
   */
  index?: number;
}

export interface CharacterEquipment {
  slot: string;
  itemId: string;
  refine: number;
  cards: string[];
  substats: CharacterSubstat[];
  /**
   * `EquipData.ChaosType` — the `EquipType` whose substat pool the chaos roll was drawn from, or
   * -1 when the item has no chaos substat. The chaos roll is the last present substat.
   */
  chaosType?: number;
  /**
   * Cards by socket position; `null` is an empty socket. `cards` drops empties, which loses which
   * socket is free.
   */
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
  maxHealth?: number;
  currentMana?: number;
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

/**
 * Lightweight identity signal decoded from `StatusComponent`'s continuously-synced SyncVars
 * (`Data`/`Level`/`JobLevel`), independent of {@link CharacterSnapshot}. The game currently never
 * sends the `LoadCharacter_T`/`CharacterCallback_T` RPC that populates a full snapshot (equipment,
 * artifacts, skills, attributes), so this is the only live source for your own name/level right
 * now - deliberately not merged into `CharacterSnapshot`, since inventing empty gear/skills for a
 * character that has some would be misleading. Exp/JobExp have no live SyncVar and are absent here.
 */
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
