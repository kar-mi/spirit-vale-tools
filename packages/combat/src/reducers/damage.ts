import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent, FishNetCombatEvent } from "../combat-tracker.ts";
import { ANALYSIS_BUCKET_MS, addToSeries, createSeries } from "./timeline.ts";
import type { BucketSeries } from "./timeline.ts";

export const DEFAULT_IDLE_GAP_MS = 30_000;
export const DEFAULT_MINIMUM_DURATION_MS = 1_000;
export const DEFAULT_CURRENT_WINDOW_MS = 5_000;

export interface CombatIdentity {
  displayName: string;
  archetype?: number;
  ownerConnectionId?: number;
  uid?: string;
}

export interface SkillAggregate {
  sourceId: string;
  sourceLabel: string;
  damage: number;
  hits: number;
  criticalHits: number;
}

/**
 * Per-actor totals for one encounter.
 *
 * Where the legacy meter kept every hit in `damagePoints`, this keeps two incremental bucket series
 * plus a short window of recent hits. `encounterSeries` is aligned to the encounter start (what the
 * actor rows and the party chart use); `actorSeries` is aligned to this actor's own first damage,
 * which is the alignment the legacy meter uses for the `personal` row.
 */
export interface ActorAggregate {
  actorId: number;
  actorIds: number[];
  displayName?: string;
  archetype?: number;
  ownerConnectionId?: number;
  uid?: string;
  activeIdentity: boolean;
  damage: number;
  firstDamageAtMs?: number;
  lastDamageAtMs?: number;
  hits: number;
  criticalHits: number;
  kills: number;
  targetIds: Set<number>;
  targetDamage: Map<number, number>;
  skills: Map<string, SkillAggregate>;
  encounterSeries: BucketSeries;
  actorSeries: BucketSeries;
  /** Recent hits, trimmed to the current-DPS window. Bounded by time, not by encounter length. */
  window: { atMs: number; damage: number }[];
}

export interface EnemySkillStats {
  sourceLabel: string;
  damage: number;
  hits: number;
  criticalHits: number;
}

export interface DeathHitRecord {
  /** Milliseconds before the death; zero is the lethal hit. */
  beforeDeathMs: number;
  attackerActorId: number;
  attackerLabel: string;
  attackerIsMonster: boolean;
  sourceLabel: string;
  damage: number;
  critical: boolean;
}

export interface DeathRecord {
  victimName: string;
  targetId: number;
  diedAtMs: number;
  totalDamage: number;
  hits: DeathHitRecord[];
}

export interface EncounterAggregate {
  id: string;
  startedAtMs: number;
  lastDamageAtMs: number;
  endedAtMs?: number;
  actors: ActorAggregate[];
  activeActors: Map<number, ActorAggregate>;
  /** attacker actor id -> enemy target id -> skill id -> totals. Counts every positive hit. */
  enemies: Map<number, Map<number, Map<string, EnemySkillStats>>>;
  /** First time each enemy was hit, which orders the enemy picker. */
  enemyFirstSeenAtMs: Map<number, number>;
  deaths: DeathRecord[];
}

export interface DamageReducerOptions {
  idleGapMs?: number;
  currentWindowMs?: number;
  /** Caps buckets per series; the read model leaves this unbounded to keep full resolution. */
  maxTimelineBuckets?: number;
  /** Supplies the encounter id when one begins. Defaults to a sequential counter. */
  createEncounterId?: (startedAtMs: number) => string;
  onEncounterFinished?: (encounter: EncounterAggregate) => void;
}

/** Windows combat events into encounters and accumulates per-actor totals. */
/** Marks an activation record the capture coordinator uses to publish a monster's display name. */
export const MOB_IDENTITY_PREFIX = "__spiritvaleMobIdentity:";

const DEATH_LOOKBACK_MS = 10_000;

export class DamageReducer {
  readonly identities = new Map<number, CombatIdentity>();
  readonly mobIdentities = new Map<number, string>();
  current?: EncounterAggregate;
  /**
   * Recent positive hits per target, trimmed to the death lookback. Exposed so an indexing pass can
   * carry it across a resume; without it a death just after the boundary would lose its hit list.
   */
  readonly recentHits = new Map<number, { atMs: number; hit: DeathHitRecord }[]>();
  private readonly idleGapMs: number;
  private readonly currentWindowMs: number;
  private readonly maxTimelineBuckets: number;
  private readonly createEncounterId: (startedAtMs: number) => string;
  private readonly onEncounterFinished?: (encounter: EncounterAggregate) => void;
  private nextEncounter = 1;

  constructor(options: DamageReducerOptions = {}) {
    this.idleGapMs = options.idleGapMs ?? DEFAULT_IDLE_GAP_MS;
    this.currentWindowMs = options.currentWindowMs ?? DEFAULT_CURRENT_WINDOW_MS;
    this.maxTimelineBuckets = options.maxTimelineBuckets ?? Number.POSITIVE_INFINITY;
    this.createEncounterId = options.createEncounterId ?? (() => `encounter-${this.nextEncounter++}`);
    if (options.onEncounterFinished) this.onEncounterFinished = options.onEncounterFinished;
  }

  /** Adopts an encounter left open by an earlier indexing pass. */
  resume(encounter: EncounterAggregate): void {
    this.current = encounter;
  }

  consumeIdentity(event: FishNetActorIdentityEvent, _observedAtMs: number): void {
    if (event.operation === "reset") {
      this.identities.clear();
      this.mobIdentities.clear();
      if (this.current) {
        for (const actor of this.current.actors) actor.activeIdentity = false;
        this.current.activeActors.clear();
      }
      return;
    }
    if (event.operation === "remove") {
      this.identities.delete(event.actorId);
      const actor = this.current?.activeActors.get(event.actorId);
      if (actor) actor.activeIdentity = false;
      this.current?.activeActors.delete(event.actorId);
      return;
    }

    const previousIdentity = this.identities.get(event.actorId);
    const archetype = event.archetype ?? previousIdentity?.archetype;
    const ownerConnectionId = event.ownerConnectionId ?? previousIdentity?.ownerConnectionId;
    const uid = event.uid ?? previousIdentity?.uid;
    this.identities.set(event.actorId, {
      displayName: event.displayName,
      ...(archetype === undefined ? {} : { archetype }),
      ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
      ...(uid === undefined ? {} : { uid }),
    });
    if (!this.current) return;

    const actor = this.actorFor(event.actorId);
    actor.displayName = event.displayName;
    if (event.archetype !== undefined) actor.archetype = event.archetype;
    if (event.ownerConnectionId !== undefined) actor.ownerConnectionId = event.ownerConnectionId;
    if (event.uid !== undefined) actor.uid = event.uid;
    actor.activeIdentity = true;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    const actorId = event.actorId;
    if (event.actorIdentity && actorId !== undefined) {
      const previousIdentity = this.identities.get(actorId);
      const archetype = event.actorIdentity.archetype ?? previousIdentity?.archetype;
      const ownerConnectionId = event.actorIdentity.ownerConnectionId ?? previousIdentity?.ownerConnectionId;
      const uid = event.actorIdentity.uid ?? previousIdentity?.uid;
      this.identities.set(actorId, {
        displayName: event.actorIdentity.displayName,
        ...(archetype === undefined ? {} : { archetype }),
        ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
        ...(uid === undefined ? {} : { uid }),
      });
    }
    if (event.kind === "activation" && event.sourceId?.startsWith(MOB_IDENTITY_PREFIX) && event.sourceLabel) {
      this.mobIdentities.set(event.actorId, event.sourceLabel);
      return;
    }
    // The death lookback spans encounter boundaries, so it is tracked even with nothing open.
    this.trackRecentHit(event, observedAtMs);

    const countedDamage = isCountedDamage(event);
    const countedKill = isCountedKill(event);
    // Incoming damage never opens an encounter, but it does belong to one already in progress.
    if (!countedDamage && !countedKill) {
      if (this.current) this.recordEncounterHit(event, observedAtMs);
      return;
    }
    if (this.current && observedAtMs - this.current.lastDamageAtMs >= this.idleGapMs) {
      this.finish(this.current.lastDamageAtMs + this.idleGapMs);
    }
    if (!this.current && !countedDamage) return;
    if (!this.current) {
      const actors = [...this.identities].map(([identityActorId, identity]) => ({
        ...createActor(identityActorId, observedAtMs),
        ...identity,
        activeIdentity: true,
      }));
      this.current = {
        id: this.createEncounterId(observedAtMs),
        startedAtMs: observedAtMs,
        lastDamageAtMs: observedAtMs,
        actors,
        activeActors: new Map(actors.map((actor) => [actor.actorId, actor])),
        enemies: new Map(),
        enemyFirstSeenAtMs: new Map(),
        deaths: [],
      };
    }
    if (countedDamage) this.current.lastDamageAtMs = observedAtMs;
    // Only now that the encounter exists, so an encounter's opening hit is not lost.
    this.recordEncounterHit(event, observedAtMs);

    const actor = this.actorFor(event.actorId);
    const eventIdentity = event.actorIdentity ?? this.identities.get(event.actorId);
    if (eventIdentity) {
      actor.displayName = eventIdentity.displayName;
      if (eventIdentity.archetype !== undefined) actor.archetype = eventIdentity.archetype;
      if (eventIdentity.ownerConnectionId !== undefined) actor.ownerConnectionId = eventIdentity.ownerConnectionId;
      if (eventIdentity.uid !== undefined) actor.uid = eventIdentity.uid;
      actor.activeIdentity = true;
    }
    if (countedDamage) {
      actor.damage += event.value;
      if (actor.firstDamageAtMs === undefined) {
        actor.firstDamageAtMs = observedAtMs;
        actor.actorSeries.originMs = observedAtMs;
      }
      actor.lastDamageAtMs = observedAtMs;
      actor.hits += 1;
      if (event.hitResult === "critical") actor.criticalHits += 1;
      addToSeries(actor.encounterSeries, observedAtMs, event.value, this.maxTimelineBuckets);
      addToSeries(actor.actorSeries, observedAtMs, event.value, this.maxTimelineBuckets);
      actor.window.push({ atMs: observedAtMs, damage: event.value });
      trimWindow(actor, observedAtMs - this.currentWindowMs);
      if (isMobTarget(this.identities, event.actorId, event.targetId)) {
        actor.targetIds.add(event.targetId);
        actor.targetDamage.set(event.targetId, (actor.targetDamage.get(event.targetId) ?? 0) + event.value);
      }
      let skill = actor.skills.get(event.sourceId);
      if (!skill) {
        skill = { sourceId: event.sourceId, sourceLabel: event.sourceLabel, damage: 0, hits: 0, criticalHits: 0 };
        actor.skills.set(event.sourceId, skill);
      }
      skill.sourceLabel = event.sourceLabel;
      skill.damage += event.value;
      skill.hits += 1;
      if (event.hitResult === "critical") skill.criticalHits += 1;
    }
    if (countedKill) actor.kills += 1;
  }

  /** Finalizes an encounter that has been idle long enough. */
  advance(observedAtMs: number): void {
    if (this.current && observedAtMs - this.current.lastDamageAtMs >= this.idleGapMs) {
      this.finish(this.current.lastDamageAtMs + this.idleGapMs);
    }
  }

  /** Finalizes the current encounter; the next qualifying hit starts a new one. */
  reset(observedAtMs: number): void {
    this.finish(observedAtMs);
  }

  private finish(endedAtMs: number): void {
    if (!this.current) return;
    const encounter = this.current;
    encounter.endedAtMs = Math.max(endedAtMs, encounter.lastDamageAtMs);
    this.current = undefined;
    this.onEncounterFinished?.(encounter);
  }

  /** Keeps the rolling window of recent positive hits per target that the death log draws from. */
  private trackRecentHit(event: FishNetCombatEvent, observedAtMs: number): void {
    if (event.kind !== "damage" && event.kind !== "death") return;
    if (!isPositiveHit(event)) return;

    const attackerLabel = this.identities.get(event.actorId)?.displayName
      ?? this.mobIdentities.get(event.actorId)
      ?? `Actor ${event.actorId}`;
    const hits = this.recentHits.get(event.targetId) ?? [];
    hits.push({
      atMs: observedAtMs,
      hit: {
        beforeDeathMs: 0,
        attackerActorId: event.actorId,
        attackerLabel,
        attackerIsMonster: this.mobIdentities.has(event.actorId),
        sourceLabel: event.sourceLabel,
        damage: event.value,
        critical: event.hitResult === "critical",
      },
    });
    const cutoffMs = observedAtMs - DEATH_LOOKBACK_MS;
    while (hits.length > 0 && hits[0]!.atMs < cutoffMs) hits.shift();
    this.recentHits.set(event.targetId, hits);
  }

  /** Attributes a hit to the open encounter's enemy breakdown and, on death, its log. */
  private recordEncounterHit(event: FishNetCombatEvent, observedAtMs: number): void {
    if (event.kind !== "damage" && event.kind !== "death") return;
    if (!this.current) return;

    if (isPositiveHit(event)) {
      const byTarget = this.current.enemies.get(event.actorId) ?? new Map<number, Map<string, EnemySkillStats>>();
      this.current.enemies.set(event.actorId, byTarget);
      const bySkill = byTarget.get(event.targetId) ?? new Map<string, EnemySkillStats>();
      byTarget.set(event.targetId, bySkill);
      const stats = bySkill.get(event.sourceId)
        ?? { sourceLabel: event.sourceLabel, damage: 0, hits: 0, criticalHits: 0 };
      stats.damage += event.value;
      stats.hits += 1;
      if (event.hitResult === "critical") stats.criticalHits += 1;
      bySkill.set(event.sourceId, stats);
      if (!this.current.enemyFirstSeenAtMs.has(event.targetId)) {
        this.current.enemyFirstSeenAtMs.set(event.targetId, observedAtMs);
      }
    }

    // Team 0 is the party's outgoing damage, so a non-zero-team death is an incoming player death.
    // The death event itself usually carries no damage — the lethal blow is a separate damage event
    // — so it is recorded regardless of whether it qualifies as a positive hit of its own.
    if (event.kind !== "death" || event.team === 0) return;
    const windowStartMs = observedAtMs - DEATH_LOOKBACK_MS;
    const victimHits = (this.recentHits.get(event.targetId) ?? [])
      .filter((entry) => entry.atMs >= windowStartMs && entry.atMs <= observedAtMs)
      .map((entry): DeathHitRecord => ({ ...entry.hit, beforeDeathMs: Math.max(0, observedAtMs - entry.atMs) }))
      .sort((left, right) => right.beforeDeathMs - left.beforeDeathMs);
    this.current.deaths.push({
      victimName: this.identities.get(event.targetId)?.displayName ?? "Unidentified player",
      targetId: event.targetId,
      diedAtMs: observedAtMs,
      totalDamage: victimHits.reduce((total, hit) => total + hit.damage, 0),
      hits: victimHits,
    });
  }

  private actorFor(actorId: number): ActorAggregate {
    const encounter = this.current!;
    let actor = encounter.activeActors.get(actorId);
    if (!actor) {
      actor = createActor(actorId, encounter.startedAtMs);
      encounter.actors.push(actor);
      encounter.activeActors.set(actorId, actor);
    }
    return actor;
  }
}

export function createActor(actorId: number, encounterStartedAtMs: number): ActorAggregate {
  return {
    actorId,
    actorIds: [actorId],
    activeIdentity: false,
    damage: 0,
    targetIds: new Set(),
    targetDamage: new Map(),
    hits: 0,
    criticalHits: 0,
    kills: 0,
    skills: new Map(),
    encounterSeries: createSeries(encounterStartedAtMs, ANALYSIS_BUCKET_MS),
    actorSeries: createSeries(encounterStartedAtMs, ANALYSIS_BUCKET_MS),
    window: [],
  };
}

function trimWindow(actor: ActorAggregate, cutoffMs: number): void {
  let retained = 0;
  while (retained < actor.window.length && actor.window[retained]!.atMs <= cutoffMs) retained += 1;
  if (retained > 0) actor.window.splice(0, retained);
}

export function isCountedDamage(event: FishNetCombatEvent): event is FishNetCombatDamageEvent | FishNetCombatDeathEvent {
  if (event.kind !== "damage" && event.kind !== "death") return false;
  if (event.team !== 0
    || event.actorId === event.targetId
    || !Number.isFinite(event.value)
    || event.value <= 0) return false;
  return event.kind === "damage" || !event.duplicatesDamageEvent;
}

export function isCountedKill(event: FishNetCombatEvent): event is FishNetCombatDeathEvent {
  return event.kind === "death"
    && event.team === 0
    && event.actorId !== event.targetId
    && Number.isFinite(event.value)
    && event.value > 0;
}

/**
 * The enemy breakdown and death log count a wider set than the DPS aggregation: any positive hit,
 * regardless of team or self-targeting, minus deaths that merely restate a damage event.
 */
export function isPositiveHit(event: FishNetCombatDamageEvent | FishNetCombatDeathEvent): boolean {
  return Number.isFinite(event.value)
    && event.value > 0
    && (event.kind === "damage" || !event.duplicatesDamageEvent);
}

export function isMobTarget(identities: ReadonlyMap<number, unknown>, actorId: number, targetId: number): boolean {
  return targetId >= 0 && targetId !== actorId && !identities.has(targetId);
}
