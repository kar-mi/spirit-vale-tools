/** The rendered shape of one encounter, shared by every producer of it: the live service, the history read model, and a whole-log replay. */
export interface FishNetDpsSkillRow {
  sourceId: string;
  sourceLabel: string;
  damage: number;
  dps: number;
  contribution: number;
  hits: number;
  criticalHits: number;
  /** Critical hits as a fraction of total hits, when the skill has hit. */
  critRate?: number;
}

export interface FishNetDpsTimelinePoint {
  /** Milliseconds elapsed since the encounter began. */
  elapsedMs: number;
  /** Damage dealt during this time bucket. */
  damage: number;
  /** Damage dealt from encounter start through this time bucket. */
  cumulativeDamage: number;
  /** Damage per second for this time bucket. */
  dps: number;
}

export interface FishNetDpsActorRow {
  /** Stable identity for this rendered row, including merged and unidentified rows. */
  rowId: string;
  actorIds: number[];
  displayName: string;
  archetype?: number;
  /** Milliseconds used as the DPS divisor and timeline span for this row. */
  durationMs?: number;
  /** Timestamp of this actor's most recent positive damage in the encounter. */
  lastDamageAtMs?: number;
  damage: number;
  dps: number;
  /** Recent damage per second: an exponentially-weighted rate, not a flat window of the last few seconds. */
  currentDps: number;
  contribution: number;
  hits: number;
  criticalHits: number;
  /** Critical hits as a fraction of total hits, when the actor has hit. */
  critRate?: number;
  kills: number;
  /** Number of distinct enemy object IDs damaged by this actor during the encounter. */
  mobsHit: number;
  skills: FishNetDpsSkillRow[];
  timeline: FishNetDpsTimelinePoint[];
  /** True when the row contains damage that has not been verified to a player identity. */
  isUnidentified?: boolean;
}

export type FishNetPersonalMatch = "unconfigured" | "missing" | "matched" | "ambiguous";

export interface FishNetDpsEncounterSnapshot {
  id: string;
  startedAtMs: number;
  lastDamageAtMs: number;
  endedAtMs?: number;
  durationMs: number;
  totalDamage: number;
  partyDps: number;
  partyCurrentDps: number;
  actors: FishNetDpsActorRow[];
  /** Actor ids on rows with no verified player identity. Each such actor keeps its own row. */
  unidentifiedActorIds: number[];
  personalName: string;
  personalMatch: FishNetPersonalMatch;
  personal?: FishNetDpsActorRow;
}
