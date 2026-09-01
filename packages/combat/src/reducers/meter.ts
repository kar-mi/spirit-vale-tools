import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import { DEFAULT_CURRENT_TAU_SECONDS, createActor, foldEnemySkill, isPositiveHit, positiveTau, recordHit } from "./damage.ts";
import type { ActorAggregate, CombatIdentity, EncounterAggregate } from "./damage.ts";

/** Which side of an encounter a meter measures. */
export type MeterKind = "tanked" | "healing";

export interface MeterReducerOptions {
  kind: MeterKind;
  /** Decay constant for the meter's current rate. Defaults to {@link DEFAULT_CURRENT_TAU_SECONDS}. */
  currentTauSeconds?: number;
  maxTimelineBuckets?: number;
}

export class MeterReducer {
  readonly kind: MeterKind;
  current?: EncounterAggregate;
  private readonly currentTauSeconds: number;
  private readonly maxTimelineBuckets: number;

  constructor(options: MeterReducerOptions) {
    this.kind = options.kind;
    this.currentTauSeconds = positiveTau(options.currentTauSeconds ?? DEFAULT_CURRENT_TAU_SECONDS);
    this.maxTimelineBuckets = options.maxTimelineBuckets ?? Number.POSITIVE_INFINITY;
  }

  /** Starts the meter's own aggregate for an encounter the damage reducer has opened. */
  begin(id: string, startedAtMs: number): EncounterAggregate {
    this.current = {
      id,
      startedAtMs,
      lastDamageAtMs: startedAtMs,
      actors: [],
      activeActors: new Map(),
      enemyFirstSeenAtMs: new Map(),
      enemyNames: new Map(),
      deaths: [],
    };
    return this.current;
  }

  /** Adopts an aggregate left open by an earlier indexing pass. */
  resume(encounter: EncounterAggregate): void {
    this.current = encounter;
  }

  finish(endedAtMs: number): EncounterAggregate | undefined {
    const encounter = this.current;
    if (!encounter) return undefined;
    encounter.endedAtMs = Math.max(endedAtMs, encounter.lastDamageAtMs);
    this.current = undefined;
    return encounter;
  }

  reset(): void {
    this.current = undefined;
  }

  /** Keeps a display name current on a row that is already accumulating. */
  consumeIdentity(event: FishNetActorIdentityEvent): void {
    if (!this.current || event.operation !== "upsert") return;
    const actor = this.current.activeActors.get(event.actorId);
    if (!actor) return;
    actor.displayName = event.displayName;
    if (event.archetype !== undefined) actor.archetype = event.archetype;
    actor.activeIdentity = true;
  }

  consumeCombat(
    event: FishNetCombatEvent,
    observedAtMs: number,
    identities: ReadonlyMap<number, CombatIdentity>,
    mobIdentities?: ReadonlyMap<number, string>,
  ): void {
    if (!this.current) return;
    const hit = this.kind === "tanked" ? tankedHit(event, identities) : healingHit(event, identities);
    if (!hit) return;
    this.apply(hit, observedAtMs, mobIdentities);
  }

  private apply(hit: MeterHit, observedAtMs: number, mobIdentities?: ReadonlyMap<number, string>): void {
    const encounter = this.current!;
    encounter.lastDamageAtMs = Math.max(encounter.lastDamageAtMs, observedAtMs);

    let actor = encounter.activeActors.get(hit.actorId);
    if (!actor) {
      actor = createActor(hit.actorId, encounter.startedAtMs, this.currentTauSeconds);
      encounter.actors.push(actor);
      encounter.activeActors.set(hit.actorId, actor);
    }
    if (hit.identity) {
      actor.displayName = hit.identity.displayName;
      if (hit.identity.archetype !== undefined) actor.archetype = hit.identity.archetype;
      actor.activeIdentity = true;
    }

    if (hit.channel === "absorbed") {
      recordAbsorbed(actor, hit);
      return;
    }

    recordHit(actor, { ...hit, atMs: observedAtMs }, this.maxTimelineBuckets);
    // `mobsHit` renders as the count of these: attackers for tanked damage, recipients for healing.
    if (hit.counterpartId !== undefined) actor.targetIds.add(hit.counterpartId);

    // Tanked damage keeps a per-attacker breakdown so the combat window can filter TPS by enemy.
    if (this.kind === "tanked" && hit.counterpartId !== undefined) {
      const enemyId = hit.counterpartId;
      actor.targetDamage.set(enemyId, (actor.targetDamage.get(enemyId) ?? 0) + hit.value);
      foldEnemySkill(actor.enemySkills, enemyId, hit.sourceId, hit.sourceLabel, hit.value, hit.critical);
      if (!encounter.enemyFirstSeenAtMs.has(enemyId)) encounter.enemyFirstSeenAtMs.set(enemyId, observedAtMs);
      // Captured now, while the identity map still has the name — a mob that despawns later would
      // otherwise be lost from both this map and the persisted session-wide one.
      const name = mobIdentities?.get(enemyId);
      if (name !== undefined) encounter.enemyNames.set(enemyId, name);
    }
  }
}

/** Damage a shield soaked, kept apart from the actor's raw damage-taken totals. */
function recordAbsorbed(actor: ActorAggregate, hit: MeterHit): void {
  actor.absorbed += hit.value;
  const skill = actor.absorbedSkills.get(hit.sourceId)
    ?? { sourceId: hit.sourceId, sourceLabel: hit.sourceLabel, damage: 0, hits: 0, criticalHits: 0 };
  skill.sourceLabel = hit.sourceLabel;
  skill.damage += hit.value;
  skill.hits += 1;
  actor.absorbedSkills.set(hit.sourceId, skill);
  if (hit.counterpartId !== undefined) {
    actor.absorbedByEnemy.set(hit.counterpartId, (actor.absorbedByEnemy.get(hit.counterpartId) ?? 0) + hit.value);
  }
}

interface MeterHit {
  /** The row this hit belongs to: the victim for tanked damage, the healer for healing. */
  actorId: number;
  identity?: CombatIdentity;
  /** The other party to the hit, counted as this row's `mobsHit`. */
  counterpartId?: number;
  value: number;
  sourceId: string;
  sourceLabel: string;
  critical: boolean;
  /** `absorbed` routes to the shield-absorption totals instead of damage taken. */
  channel?: "damage" | "absorbed";
}

/** Incoming damage, credited to the party member who took it. */
function tankedHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind === "shield") return shieldAbsorbedHit(event, identities);
  if (event.kind !== "damage" && event.kind !== "death") return undefined;
  // Team zero is the party's outgoing damage, which the DPS meter owns.
  const identity = identities.get(event.targetId);
  const reflected = event.team === 0 && event.actorId === event.targetId;
  const incoming = event.team !== 0 && event.actorId !== event.targetId;
  if (!identity && !reflected && !incoming) return undefined;
  if (!isPositiveHit(event)) return undefined;
  return {
    actorId: event.targetId,
    ...(identity === undefined ? {} : { identity }),
    counterpartId: event.actorId,
    value: event.value,
    sourceId: event.sourceId,
    sourceLabel: event.sourceLabel,
    critical: event.hitResult === "critical",
  };
}

/** Restored health, credited to the healer. */
function healingHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind === "shield") return shieldAppliedHit(event, identities);
  if (event.kind !== "heal") return undefined;
  if (!Number.isFinite(event.value) || event.value <= 0) return undefined;
  const healerId = event.actorId;
  if (healerId === undefined) return undefined;
  const identity = identities.get(healerId);
  if (!identity) return undefined;
  return {
    actorId: healerId,
    identity,
    counterpartId: event.targetId,
    value: event.value,
    sourceId: event.sourceId ?? "heal",
    sourceLabel: event.sourceLabel ?? "Healing",
    critical: false,
  };
}

/**
 * Shield applied to a target, credited to the caster as healing done.
 * Only the initial `gained` grant is counted; refreshes that meld with an
 * existing barrier arrive as other actions and are left out.
 */
function shieldAppliedHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind !== "shield" || event.action !== "gained") return undefined;
  if (!Number.isFinite(event.value) || event.value <= 0) return undefined;
  const casterId = event.actorId;
  if (casterId === undefined) return undefined;
  const identity = identities.get(casterId);
  if (!identity) return undefined;
  return {
    actorId: casterId,
    identity,
    counterpartId: event.targetId,
    value: event.value,
    sourceId: event.sourceId ?? "shield",
    sourceLabel: event.sourceLabel ?? "Shield",
    critical: false,
  };
}

/**
 * Shield that absorbed incoming damage, credited to the shielded player on the `absorbed`
 * channel — kept out of raw damage-taken totals. Attributed to the enemy skill that was
 * soaked (when the tick's damage packet was seen first), not to the shield applier: melded
 * barriers make the applier of the consumed portion unknowable.
 */
function shieldAbsorbedHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind !== "shield" || event.action !== "absorbed") return undefined;
  if (!Number.isFinite(event.value) || event.value <= 0) return undefined;
  const identity = identities.get(event.targetId);
  if (!identity) return undefined;
  return {
    actorId: event.targetId,
    identity,
    ...(event.incomingActorId === undefined ? {} : { counterpartId: event.incomingActorId }),
    value: event.value,
    sourceId: event.incomingSourceId ?? "absorbed:unknown",
    sourceLabel: event.incomingSourceLabel ?? "Absorbed (unattributed)",
    critical: false,
    channel: "absorbed",
  };
}
