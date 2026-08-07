import { EwmaRate } from "@kar-mi/spirit-vale-tools-metrics";
import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent, FishNetCombatEvent } from "../combat-tracker.ts";
import { ANALYSIS_BUCKET_MS, addToSeries, createSeries } from "./timeline.ts";
import type { BucketSeries } from "./timeline.ts";

export const DEFAULT_IDLE_GAP_MS = 30_000;
export const DEFAULT_MINIMUM_DURATION_MS = 1_000;
/**
 * Current DPS is an exponentially-weighted rate rather than a flat window of recent hits. A window
 * of width `W` and an EWMA of time constant `tau` have equal estimator variance when `W = 2 * tau`
 * and equal mean lag, so 2.5 seconds reproduces the smoothing and responsiveness of the 5-second
 * window this replaced — without its discontinuities, and in O(1) state per actor.
 */
export const DEFAULT_CURRENT_TAU_SECONDS = 2.5;

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
 * plus an O(1) rate estimator. `encounterSeries` is aligned to the encounter start (what the
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
  /** Exponentially-weighted recent rate behind `currentDps`. Two numbers, whatever the encounter length. */
  currentRate: EwmaRate;
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
  /**
   * Enemy display names, captured when the hit lands rather than looked up when the encounter is
   * written. A monster is named by its spawn packet, which the log does not carry, so resolving
   * later would lose the name entirely for anything that died without acting.
   */
  enemyNames: Map<number, string>;
  deaths: DeathRecord[];
}

export interface DamageReducerOptions {
  idleGapMs?: number;
  /** Decay constant for `currentDps`. Defaults to {@link DEFAULT_CURRENT_TAU_SECONDS}. */
  currentTauSeconds?: number;
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
/**
 * Monster display names retained at once. Names are only needed to label recent hits and the current
 * encounter's enemies, but a long session sees a great many distinct monsters, so the map is capped
 * and evicts the least recently seen rather than growing for the whole session.
 */
const MAX_MOB_IDENTITIES = 4_096;
/**
 * Player identities retained at once, capped for the same reasons as {@link MAX_MOB_IDENTITIES} and
 * evicted least-recently-seen first. An indexing pass serialises this map to the read model on every
 * batch, so an uncapped one costs repeated writes proportional to every player the session has ever
 * seen — which in a crowded hub is far more than the handful an encounter actually needs. Evicting
 * an entry does not lose a name from a stored encounter: each actor row carries its own copy.
 */
const MAX_IDENTITIES = 4_096;

export class DamageReducer {
  readonly identities = new Map<number, CombatIdentity>();
  readonly mobIdentities = new Map<number, string>();
  current?: EncounterAggregate;
  /**
   * Recent positive hits per target, trimmed to the death lookback. Exposed so an indexing pass can
   * carry it across a resume; without it a death just after the boundary would lose its hit list.
   *
   * Bounded by {@link sweepRecentHits} to the targets hit within the lookback, not by how many
   * targets the session has seen: an incremental pass serialises this map on every batch, so letting
   * it accumulate would cost far more in repeated writes than in memory.
   */
  readonly recentHits = new Map<number, { atMs: number; hit: DeathHitRecord }[]>();
  private lastSweepAtMs?: number;
  private readonly idleGapMs: number;
  private readonly currentTauSeconds: number;
  private readonly maxTimelineBuckets: number;
  private readonly createEncounterId: (startedAtMs: number) => string;
  private readonly onEncounterFinished?: (encounter: EncounterAggregate) => void;
  private nextEncounter = 1;

  constructor(options: DamageReducerOptions = {}) {
    this.idleGapMs = options.idleGapMs ?? DEFAULT_IDLE_GAP_MS;
    this.currentTauSeconds = positiveTau(options.currentTauSeconds ?? DEFAULT_CURRENT_TAU_SECONDS);
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
    this.rememberIdentity(event.actorId, {
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
    if (event.kind === "monsterIdentity") {
      if (event.operation === "reset") this.mobIdentities.clear();
      else if (event.operation === "remove") this.mobIdentities.delete(event.actorId);
      else this.rememberMobIdentity(event.actorId, event.displayName);
      return;
    }
    const actorId = event.actorId;
    if (event.actorIdentity && actorId !== undefined) {
      const previousIdentity = this.identities.get(actorId);
      const archetype = event.actorIdentity.archetype ?? previousIdentity?.archetype;
      const ownerConnectionId = event.actorIdentity.ownerConnectionId ?? previousIdentity?.ownerConnectionId;
      const uid = event.actorIdentity.uid ?? previousIdentity?.uid;
      this.rememberIdentity(actorId, {
        displayName: event.actorIdentity.displayName,
        ...(archetype === undefined ? {} : { archetype }),
        ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
        ...(uid === undefined ? {} : { uid }),
      });
    }
    if (event.kind === "activation" && event.sourceId?.startsWith(MOB_IDENTITY_PREFIX) && event.sourceLabel) {
      this.rememberMobIdentity(event.actorId, event.sourceLabel);
      return;
    }
    // The death lookback spans encounter boundaries, so it is tracked even with nothing open.
    this.trackRecentHit(event, observedAtMs);

    const countedDamage = isCountedDamage(event);
    const countedKill = isCountedKill(event);
    // Incoming damage never opens an encounter, but it does belong to one already in progress —
    // provided that encounter has not already gone idle. Without this check a hit or heal arriving
    // long after the fight ended is still counted against it.
    if (!countedDamage && !countedKill) {
      if (this.current && observedAtMs - this.current.lastDamageAtMs >= this.idleGapMs) {
        this.finish(this.current.lastDamageAtMs + this.idleGapMs);
      }
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
        enemyNames: new Map(),
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
      recordHit(actor, {
        value: event.value,
        atMs: observedAtMs,
        critical: event.hitResult === "critical",
        sourceId: event.sourceId,
        sourceLabel: event.sourceLabel,
      }, this.maxTimelineBuckets);
      if (isMobTarget(this.identities, event.actorId, event.targetId)) {
        actor.targetIds.add(event.targetId);
        actor.targetDamage.set(event.targetId, (actor.targetDamage.get(event.targetId) ?? 0) + event.value);
      }
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
    if (hits.length === 0) this.recentHits.delete(event.targetId);
    else this.recentHits.set(event.targetId, hits);
    this.sweepRecentHits(observedAtMs);
  }

  /**
   * Trims every target to the lookback immediately, regardless of when the last sweep ran.
   *
   * Used before persisting the map: the periodic sweep leaves up to two windows in memory, but only
   * one is ever read back, and the persisted copy is rewritten on every batch.
   */
  pruneRecentHits(observedAtMs: number): void {
    this.sweepRecentHits(observedAtMs, true);
  }

  /**
   * Drops targets whose hits have all aged out.
   *
   * {@link trackRecentHit} only trims the target it is currently touching, so a target hit once and
   * never again would otherwise be retained for the rest of the session. Runs at most once per
   * lookback window of log time, which makes it a rare pass over a map that stays small.
   */
  private sweepRecentHits(observedAtMs: number, force = false): void {
    if (!force && this.lastSweepAtMs !== undefined && observedAtMs - this.lastSweepAtMs < DEATH_LOOKBACK_MS) return;
    this.lastSweepAtMs = observedAtMs;
    const cutoffMs = observedAtMs - DEATH_LOOKBACK_MS;
    for (const [targetId, hits] of this.recentHits) {
      while (hits.length > 0 && hits[0]!.atMs < cutoffMs) hits.shift();
      if (hits.length === 0) this.recentHits.delete(targetId);
    }
  }

  /** Records a player's identity, evicting the least recently seen once the cap is reached. */
  private rememberIdentity(actorId: number, identity: CombatIdentity): void {
    // Re-inserting moves the entry to the end, so iteration order is least-recently-seen first.
    this.identities.delete(actorId);
    this.identities.set(actorId, identity);
    while (this.identities.size > MAX_IDENTITIES) {
      const oldest = this.identities.keys().next();
      if (oldest.done) break;
      this.identities.delete(oldest.value);
    }
  }

  /** Records a monster's display name, evicting the least recently seen once the cap is reached. */
  private rememberMobIdentity(actorId: number, displayName: string): void {
    // Re-inserting moves the entry to the end, so iteration order is least-recently-seen first.
    this.mobIdentities.delete(actorId);
    this.mobIdentities.set(actorId, displayName);
    while (this.mobIdentities.size > MAX_MOB_IDENTITIES) {
      const oldest = this.mobIdentities.keys().next();
      if (oldest.done) break;
      this.mobIdentities.delete(oldest.value);
    }
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
      // Captured now, while the identity lifecycle state is still known. The session-scoped map is
      // capped and may later evict this object, but the encounter must retain its historical label.
      const targetName = this.identities.get(event.targetId)?.displayName
        ?? this.mobIdentities.get(event.targetId);
      if (targetName !== undefined) this.current.enemyNames.set(event.targetId, targetName);
    }

    // A death belongs in the log when the victim is one of ours, which is a question about the
    // victim rather than about the team: reflected damage keeps the original caster's team, so a
    // team-0 death can still be a party member killed by their own hit bouncing back (a boss's
    // NPC_SpellGuard). A known monster is never logged. Otherwise a team-0 death is the party
    // killing something — unless the victim is a known player, or killed themselves, which is what
    // a reflect looks like on the wire and which no mob death ever does.
    // The death event itself usually carries no damage — the lethal blow is a separate damage event
    // — so it is recorded regardless of whether it qualifies as a positive hit of its own.
    if (event.kind !== "death") return;
    if (this.mobIdentities.has(event.targetId)) return;
    if (event.team === 0 && !this.identities.has(event.targetId) && event.actorId !== event.targetId) return;
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
      actor = createActor(actorId, encounter.startedAtMs, this.currentTauSeconds);
      encounter.actors.push(actor);
      encounter.activeActors.set(actorId, actor);
    }
    return actor;
  }
}

/** One positive hit's contribution to a row, shared by the damage reducer and the tanked/healing meters. */
export interface RecordedHit {
  value: number;
  atMs: number;
  critical: boolean;
  sourceId: string;
  sourceLabel: string;
}

/**
 * Folds one hit into an actor's totals, both bucket series, its current-rate estimator and its
 * per-skill row. Target attribution stays with the caller: the damage reducer counts enemies it can
 * distinguish from party members, while the meters count their hit's counterpart unconditionally.
 */
export function recordHit(actor: ActorAggregate, hit: RecordedHit, maxTimelineBuckets: number): void {
  actor.damage += hit.value;
  if (actor.firstDamageAtMs === undefined) {
    actor.firstDamageAtMs = hit.atMs;
    actor.actorSeries.originMs = hit.atMs;
  }
  actor.lastDamageAtMs = hit.atMs;
  actor.hits += 1;
  if (hit.critical) actor.criticalHits += 1;
  addToSeries(actor.encounterSeries, hit.atMs, hit.value, maxTimelineBuckets);
  addToSeries(actor.actorSeries, hit.atMs, hit.value, maxTimelineBuckets);
  actor.currentRate.record(hit.value, hit.atMs);

  let skill = actor.skills.get(hit.sourceId);
  if (!skill) {
    skill = { sourceId: hit.sourceId, sourceLabel: hit.sourceLabel, damage: 0, hits: 0, criticalHits: 0 };
    actor.skills.set(hit.sourceId, skill);
  }
  skill.sourceLabel = hit.sourceLabel;
  skill.damage += hit.value;
  skill.hits += 1;
  if (hit.critical) skill.criticalHits += 1;
}

/** Rejected at construction rather than when the first actor is created, so a bad value fails fast. */
export function positiveTau(value: number): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error("currentTauSeconds must be a positive finite number");
  return value;
}

export function createActor(
  actorId: number,
  encounterStartedAtMs: number,
  currentRate: number | EwmaRate = DEFAULT_CURRENT_TAU_SECONDS,
): ActorAggregate {
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
    currentRate: typeof currentRate === "number" ? new EwmaRate({ tauSeconds: currentRate }) : currentRate,
  };
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
