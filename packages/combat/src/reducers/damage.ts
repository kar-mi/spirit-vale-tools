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

export interface EncounterAggregate {
  id: string;
  startedAtMs: number;
  lastDamageAtMs: number;
  endedAtMs?: number;
  actors: ActorAggregate[];
  activeActors: Map<number, ActorAggregate>;
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
export class DamageReducer {
  readonly identities = new Map<number, CombatIdentity>();
  current?: EncounterAggregate;
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
    const countedDamage = isCountedDamage(event);
    const countedKill = isCountedKill(event);
    if (!countedDamage && !countedKill) return;
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
      };
    }
    if (countedDamage) this.current.lastDamageAtMs = observedAtMs;

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

export function isMobTarget(identities: ReadonlyMap<number, unknown>, actorId: number, targetId: number): boolean {
  return targetId >= 0 && targetId !== actorId && !identities.has(targetId);
}
