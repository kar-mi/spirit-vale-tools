import type { FishNetDecodedValue } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetRecoveryStyle } from "./inference/recovery-style.ts";

export type FishNetCombatActionKind = "skill" | "basicAttack" | "inferred";
export type FishNetCombatActionPhase = "begin" | "complete" | "interrupt" | "cancel" | "inferred";
export type FishNetDamageAttribution = "exact" | "ambiguous" | "inferred";
export type FishNetHitResult = "normal" | "critical" | "miss" | "blocked" | "dodged" | number;

export interface FishNetCombatActorIdentity {
  readonly displayName: string;
  readonly archetype?: number;
  readonly ownerConnectionId?: number;
  readonly uid?: string;
}

/** Names a monster type. */
export interface FishNetMonsterCatalog {
  get(mobId: string): { readonly level: number; readonly displayName: string } | undefined;
}

/** Curated, build-scoped boss names keyed by a skill unique to that boss. */
export interface FishNetBossCatalog {
  get(skillId: string): { readonly displayName: string } | undefined;
}

export interface FishNetCombatTrackerOptions {
  /** Ticks to retain a completed activation for trailing hits. Defaults to 30. */
  hitGraceTicks?: number;
  /** Maximum age of an activation that never completes. Defaults to 900 ticks. */
  activationMaxAgeTicks?: number;
  /** Extracted public skill metadata. Defaults to the current bundled build when available. */
  skillCatalog?: FishNetSkillCatalog;
  buildFingerprint?: string;
  /** Resolves an attacker to a known player identity, including owner/UID continuity. */
  actorIdentityResolver?: (actorId: number) => FishNetCombatActorIdentity | undefined;
  /** Resolves healing mechanics for actors whose local character build is visible. */
  healingTraitsResolver?: (actorId: number) => FishNetHealingTraits | undefined;
  /** Names monsters seen spawning, emitting identity lifecycle events keyed by network object id. */
  monsterCatalog?: FishNetMonsterCatalog;
  /** Fallback names for otherwise-anonymous bosses; game-provided identities always win. */
  bossCatalog?: FishNetBossCatalog;
}

export type FishNetCombatMonsterIdentityEvent =
  | {
      kind: "monsterIdentity";
      operation: "upsert";
      tick: number;
      actorId: number;
      mobId: string;
      displayName: string;
      actorIdentity?: never;
    }
  | {
      kind: "monsterIdentity";
      operation: "remove";
      tick: number;
      actorId: number;
      actorIdentity?: never;
    }
  | {
      kind: "monsterIdentity";
      operation: "reset";
      tick: number;
      actorId?: never;
      actorIdentity?: never;
    };

export interface FishNetHealingTraits {
  readonly hasSiphonHealth: boolean;
  readonly hasHealthLeech: boolean;
}

export interface FishNetCombatActivationEvent {
  kind: "activation";
  rpc: string;
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  activationId?: string;
  actionKind: FishNetCombatActionKind;
  phase: FishNetCombatActionPhase;
  sourceId?: string;
  sourceLabel?: string;
  targetId?: number;
  level?: number;
  attackIndex?: number;
  inferred?: boolean;
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatDamageEvent {
  kind: "damage";
  rpc: "ApplyDamage_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  targetId: number;
  sourceId: string;
  sourceLabel: string;
  value: number;
  hitResult: FishNetHitResult;
  wireHits: number;
  damageType: number;
  team: number;
  element: number;
  weaponType: number;
  range: number;
  isClone: boolean;
  isSummon: boolean;
  position: number[];
  origin: number[];
  attribution: FishNetDamageAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatDeathEvent {
  kind: "death";
  rpc: "Death_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  targetId: number;
  sourceId: string;
  sourceLabel: string;
  value: number;
  hitResult: FishNetHitResult;
  wireHits: number;
  damageType: number;
  team: number;
  element: number;
  weaponType: number;
  range: number;
  isClone: boolean;
  isSummon: boolean;
  attribution: FishNetDamageAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  /** True when an identical ApplyDamage_C was already emitted at this tick. */
  duplicatesDamageEvent: boolean;
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatStatusEvent {
  kind: "status";
  /** `LoadCharacter_T` is a login-restore fallback: an effect already active when the client connects, from the character save's own snapshot rather than a live apply. */
  rpc: "ApplyEffect_T" | "RemoveEffect_T" | "ApplyEffectDisplays_O" | "ApplySkillDisplay_O" | "RemoveSkillDisplay_O" | "LoadCharacter_T";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  statusId: string;
  /** Absent on `ApplyEffectDisplays_O`, which carries no level; consumers keep the last known one. */
  level?: number;
  action: "applied" | "removed";
  /** Server-reported time left, from `ApplyEffectDisplays_O`/`LoadCharacter_T` only. */
  remainingSeconds?: number;
  stacks?: number;
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatSummonEvent {
  kind: "summon";
  /** `SummonSkillSync` is a login-restore fallback: one active summon reported via SyncType rather than the batch RPC. */
  rpc: "CalibrateSummons_T" | "SummonSkillSync";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  skillId: string;
  stacks: number;
  actorIdentity?: FishNetCombatActorIdentity;
}

/** A `PlayerController.FullHeal_C`, which restores an actor outright. */
export interface FishNetCombatFullHealEvent {
  kind: "fullHeal";
  rpc: "FullHeal_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  /** The restored actor: the RPC's own object. There is no healer on the wire. */
  targetId: number;
  /** No one performed this heal, so no actor may be credited for it. */
  actorId?: never;
  actorIdentity?: FishNetCombatActorIdentity;
}

export type FishNetHealAttribution = FishNetDamageAttribution | "unattributed";

export interface FishNetCombatHealEvent {
  kind: "heal";
  /** `ApplyDamage_C` is authoritative when its signed damage value is negative. */
  rpc: "ApplyDamage_C" | "Recover_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  /** The healed entity — always known (it's the RPC's objectId). */
  targetId: number;
  /** The inferred healer, when attribution succeeds. Absent when fully unattributed or ambiguous. */
  actorId?: number;
  sourceId?: string;
  sourceLabel?: string;
  value: number;
  /** Semantic style derived from the build-specific Recover_C FloaterSettings. */
  recoveryStyle?: FishNetRecoveryStyle;
  attribution: FishNetHealAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  actorIdentity?: FishNetCombatActorIdentity;
}

export type FishNetShieldAction = "gained" | "absorbed" | "cleared" | "reduced";

export interface FishNetCombatShieldEvent {
  kind: "shield";
  rpc: "barrierSync";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  targetId: number;
  /** The inferred shield applier. Absent when attribution is ambiguous or unavailable. */
  actorId?: number;
  sourceId?: string;
  sourceLabel?: string;
  value: number;
  barrierBefore: number;
  barrierAfter: number;
  action: FishNetShieldAction;
  /** For `absorbed`: the incoming hit that the barrier soaked, when the tick's damage packet was seen first. */
  incomingActorId?: number;
  incomingSourceId?: string;
  incomingSourceLabel?: string;
  attribution: FishNetHealAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  actorIdentity?: FishNetCombatActorIdentity;
}

export type FishNetCombatEvent =
  | FishNetCombatMonsterIdentityEvent
  | FishNetCombatActivationEvent
  | FishNetCombatDamageEvent
  | FishNetCombatDeathEvent
  | FishNetCombatStatusEvent
  | FishNetCombatSummonEvent
  | FishNetCombatHealEvent
  | FishNetCombatShieldEvent
  | FishNetCombatFullHealEvent;
