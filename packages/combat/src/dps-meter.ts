import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent, FishNetCombatEvent } from "./combat-tracker.ts";

export interface FishNetDpsMeterOptions {
  /** Milliseconds without positive player damage before a new encounter. Defaults to 30 seconds. */
  idleGapMs?: number;
  /** Minimum duration used as the DPS divisor. Defaults to one second. */
  minimumDurationMs?: number;
  /** FishNet ticks per second used for replay records without wall-clock timestamps. Defaults to 30. */
  replayTicksPerSecond?: number;
  personalName?: string;
  personalActorId?: number;
}

export interface FishNetDpsSkillRow {
  sourceId: string;
  sourceLabel: string;
  damage: number;
  dps: number;
  contribution: number;
  hits: number;
  criticalHits: number;
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
  actorIds: number[];
  displayName: string;
  damage: number;
  dps: number;
  contribution: number;
  hits: number;
  criticalHits: number;
  kills: number;
  skills: FishNetDpsSkillRow[];
  timeline: FishNetDpsTimelinePoint[];
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
  actors: FishNetDpsActorRow[];
  personalName: string;
  personalMatch: FishNetPersonalMatch;
  personal?: FishNetDpsActorRow;
}

interface SkillAggregate {
  sourceId: string;
  sourceLabel: string;
  damage: number;
  hits: number;
  criticalHits: number;
}

interface ActorAggregate {
  actorId: number;
  actorIds: number[];
  displayName?: string;
  archetype?: number;
  ownerConnectionId?: number;
  activeIdentity: boolean;
  damage: number;
  hits: number;
  criticalHits: number;
  kills: number;
  skills: Map<string, SkillAggregate>;
  damagePoints: DamagePoint[];
}

interface DamagePoint {
  observedAtMs: number;
  damage: number;
}

interface EncounterAggregate {
  id: string;
  startedAtMs: number;
  lastDamageAtMs: number;
  endedAtMs?: number;
  actors: ActorAggregate[];
  activeActors: Map<number, ActorAggregate>;
}

const DEFAULT_IDLE_GAP_MS = 30_000;
const DEFAULT_MINIMUM_DURATION_MS = 1_000;
const DEFAULT_REPLAY_TICKS_PER_SECOND = 30;
const ANALYSIS_BUCKET_MS = 5_000;

/** Aggregates structured FishNet identity and combat events into encounter DPS summaries. */
export class FishNetDpsMeter {
  private readonly idleGapMs: number;
  private readonly minimumDurationMs: number;
  private readonly replayTicksPerSecond: number;
  private readonly finished: EncounterAggregate[] = [];
  private readonly identities = new Map<number, {
    displayName: string;
    archetype?: number;
    ownerConnectionId?: number;
  }>();
  private current?: EncounterAggregate;
  private nextEncounter = 1;
  private personalName: string;
  private personalActorId?: number;

  constructor(options: FishNetDpsMeterOptions = {}) {
    this.idleGapMs = positiveFinite(options.idleGapMs ?? DEFAULT_IDLE_GAP_MS, "idleGapMs");
    this.minimumDurationMs = positiveFinite(
      options.minimumDurationMs ?? DEFAULT_MINIMUM_DURATION_MS,
      "minimumDurationMs",
    );
    this.replayTicksPerSecond = positiveFinite(
      options.replayTicksPerSecond ?? DEFAULT_REPLAY_TICKS_PER_SECOND,
      "replayTicksPerSecond",
    );
    this.personalName = options.personalName?.trim() ?? "";
    this.personalActorId = options.personalActorId;
  }

  consumeIdentity(event: FishNetActorIdentityEvent, observedAtMs: number): void {
    requireTimestamp(observedAtMs);
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

    this.identities.set(event.actorId, {
      displayName: event.displayName,
      ...(event.archetype === undefined ? {} : { archetype: event.archetype }),
      ...(event.ownerConnectionId === undefined ? {} : { ownerConnectionId: event.ownerConnectionId }),
    });
    if (!this.current) return;

    let actor = this.current.activeActors.get(event.actorId);
    if (!actor) {
      actor = createActor(event.actorId);
      this.current.actors.push(actor);
      this.current.activeActors.set(event.actorId, actor);
    }
    actor.displayName = event.displayName;
    actor.archetype = event.archetype;
    actor.ownerConnectionId = event.ownerConnectionId;
    actor.activeIdentity = true;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    requireTimestamp(observedAtMs);
    const countedDamage = isCountedDamage(event);
    const countedKill = isCountedKill(event);
    if (!countedDamage && !countedKill) return;
    if (this.current && observedAtMs - this.current.lastDamageAtMs >= this.idleGapMs) {
      this.finishCurrent(this.current.lastDamageAtMs + this.idleGapMs);
    }
    if (!this.current && !countedDamage) return;
    if (!this.current) {
      const actors = [...this.identities].map(([actorId, identity]) => ({
        ...createActor(actorId),
        ...identity,
        activeIdentity: true,
      }));
      this.current = {
        id: `encounter-${this.nextEncounter++}`,
        startedAtMs: observedAtMs,
        lastDamageAtMs: observedAtMs,
        actors,
        activeActors: new Map(actors.map((actor) => [actor.actorId, actor])),
      };
    }
    if (countedDamage) this.current.lastDamageAtMs = observedAtMs;

    let actor = this.current.activeActors.get(event.actorId);
    if (!actor) {
      actor = createActor(event.actorId);
      this.current.actors.push(actor);
      this.current.activeActors.set(event.actorId, actor);
    }
    if (countedDamage) {
      actor.damage += event.value;
      actor.hits += 1;
      if (event.hitResult === "critical") actor.criticalHits += 1;
      actor.damagePoints.push({ observedAtMs, damage: event.value });
      let skill = actor.skills.get(event.sourceId);
      if (!skill) {
        skill = {
          sourceId: event.sourceId,
          sourceLabel: event.sourceLabel,
          damage: 0,
          hits: 0,
          criticalHits: 0,
        };
        actor.skills.set(event.sourceId, skill);
      }
      skill.sourceLabel = event.sourceLabel;
      skill.damage += event.value;
      skill.hits += 1;
      if (event.hitResult === "critical") skill.criticalHits += 1;
    }
    if (countedKill) actor.kills += 1;
  }

  /** Finalizes an idle encounter. Calling this regularly keeps live status current. */
  advance(observedAtMs: number): void {
    requireTimestamp(observedAtMs);
    if (this.current && observedAtMs - this.current.lastDamageAtMs >= this.idleGapMs) {
      this.finishCurrent(this.current.lastDamageAtMs + this.idleGapMs);
    }
  }

  /** Finalizes the current encounter; the next qualifying hit starts a new one. */
  reset(observedAtMs = Date.now()): void {
    requireTimestamp(observedAtMs);
    this.finishCurrent(observedAtMs);
  }

  /** Discards all encounter statistics while retaining actor and personal configuration. */
  clearEncounters(): void {
    this.finished.length = 0;
    this.current = undefined;
  }

  setPersonalName(name: string): void {
    this.personalName = name.trim();
  }

  getPersonalName(): string {
    return this.personalName;
  }

  setPersonalActorId(actorId: number | undefined): void {
    if (actorId !== undefined && (!Number.isInteger(actorId) || actorId < 0)) {
      throw new Error("personalActorId must be a non-negative integer");
    }
    this.personalActorId = actorId;
  }

  getPersonalActorId(): number | undefined {
    return this.personalActorId;
  }

  getSnapshots(): FishNetDpsEncounterSnapshot[] {
    const encounters = this.current ? [...this.finished, this.current] : this.finished;
    return encounters.map((encounter) => this.snapshot(encounter));
  }

  getLatestSnapshot(): FishNetDpsEncounterSnapshot | undefined {
    const encounter = this.current ?? this.finished.at(-1);
    return encounter ? this.snapshot(encounter) : undefined;
  }

  /** Maps a FishNet tick onto replay time relative to a caller-selected origin. */
  replayTimeMs(tick: number, originTick: number, originTimeMs = 0): number {
    if (!Number.isFinite(tick) || !Number.isFinite(originTick)) throw new Error("replay ticks must be finite numbers");
    return originTimeMs + ((tick - originTick) * 1_000) / this.replayTicksPerSecond;
  }

  private finishCurrent(endedAtMs: number): void {
    if (!this.current) return;
    this.current.endedAtMs = Math.max(endedAtMs, this.current.lastDamageAtMs);
    this.finished.push(this.current);
    this.current = undefined;
  }

  private snapshot(encounter: EncounterAggregate): FishNetDpsEncounterSnapshot {
    const durationMs = Math.max(
      this.minimumDurationMs,
      encounter.lastDamageAtMs - encounter.startedAtMs,
    );
    const mergedActors = mergeActors(encounter.actors);
    const totalDamage = mergedActors.reduce((sum, actor) => sum + actor.damage, 0);
    const actors = mergedActors
      .map((actor) => actorRow(actor, encounter.startedAtMs, durationMs, totalDamage))
      .sort(compareRows);
    const normalizedPersonalName = normalizeName(this.personalName);
    const activeMatches = normalizedPersonalName
      ? new Set(encounter.actors
        .filter((actor) => actor.activeIdentity && normalizeName(actor.displayName ?? "") === normalizedPersonalName)
        .map(identityKey))
      : new Set<string>();
    const selectedPersonal = this.personalActorId === undefined
      ? undefined
      : actors.find((actor) => actor.actorIds.includes(this.personalActorId!));
    const personal = selectedPersonal ?? (normalizedPersonalName
      ? actors.find((actor) => normalizeName(actor.displayName) === normalizedPersonalName)
      : undefined);
    const personalMatch: FishNetPersonalMatch = selectedPersonal
      ? "matched"
      : this.personalActorId !== undefined
        ? "missing"
        : !normalizedPersonalName
      ? "unconfigured"
      : activeMatches.size > 1
        ? "ambiguous"
        : personal
          ? "matched"
          : "missing";
    return {
      id: encounter.id,
      startedAtMs: encounter.startedAtMs,
      lastDamageAtMs: encounter.lastDamageAtMs,
      ...(encounter.endedAtMs === undefined ? {} : { endedAtMs: encounter.endedAtMs }),
      durationMs,
      totalDamage,
      partyDps: perSecond(totalDamage, durationMs),
      actors,
      personalName: this.personalName,
      personalMatch,
      ...(personalMatch === "matched" && personal ? { personal } : {}),
    };
  }
}

function createActor(actorId: number): ActorAggregate {
  return {
    actorId,
    actorIds: [actorId],
    activeIdentity: false,
    damage: 0,
    hits: 0,
    criticalHits: 0,
    kills: 0,
    skills: new Map(),
    damagePoints: [],
  };
}

function isCountedDamage(event: FishNetCombatEvent): event is FishNetCombatDamageEvent | FishNetCombatDeathEvent {
  if (event.kind === "activation" || event.team !== 0 || !Number.isFinite(event.value) || event.value <= 0) return false;
  return event.kind === "damage" || !event.duplicatesDamageEvent;
}

function isCountedKill(event: FishNetCombatEvent): event is FishNetCombatDeathEvent {
  return event.kind === "death" && event.team === 0 && Number.isFinite(event.value) && event.value > 0;
}

function mergeActors(actors: ActorAggregate[]): ActorAggregate[] {
  const merged = new Map<string, ActorAggregate>();
  for (const actor of actors) {
    if (actor.damage <= 0) continue;
    const displayName = actor.displayName?.trim() || `Player ${actor.actorId}`;
    const key = actor.ownerConnectionId !== undefined
      ? `owner:${actor.ownerConnectionId}`
      : actor.displayName
        ? `name:${normalizeName(displayName)}`
        : `actor:${actor.actorId}`;
    let target = merged.get(key);
    if (!target) {
      target = {
        ...createActor(actor.actorId),
        displayName,
        activeIdentity: actor.activeIdentity,
        damage: 0,
        hits: 0,
        criticalHits: 0,
        kills: 0,
        ...(actor.ownerConnectionId === undefined ? {} : { ownerConnectionId: actor.ownerConnectionId }),
      };
      merged.set(key, target);
    }
    if (actor.activeIdentity) target.displayName = displayName;
    target.activeIdentity ||= actor.activeIdentity;
    target.damage += actor.damage;
    target.hits += actor.hits;
    target.criticalHits += actor.criticalHits;
    target.kills += actor.kills;
    target.actorIds = [...new Set([...target.actorIds, ...actor.actorIds])];
    target.damagePoints.push(...actor.damagePoints);
    for (const skill of actor.skills.values()) {
      const current = target.skills.get(skill.sourceId);
      if (current) {
        current.sourceLabel = skill.sourceLabel;
        current.damage += skill.damage;
        current.hits += skill.hits;
        current.criticalHits += skill.criticalHits;
      } else {
        target.skills.set(skill.sourceId, { ...skill });
      }
    }
  }
  return [...merged.values()];
}

function actorRow(actor: ActorAggregate, startedAtMs: number, durationMs: number, partyDamage: number): FishNetDpsActorRow {
  const skills = [...actor.skills.values()]
    .map((skill): FishNetDpsSkillRow => ({
      ...skill,
      dps: perSecond(skill.damage, durationMs),
      contribution: actor.damage === 0 ? 0 : skill.damage / actor.damage,
    }))
    .sort(compareRows);
  return {
    actorIds: [...actor.actorIds],
    displayName: actor.displayName ?? "Unknown",
    damage: actor.damage,
    dps: perSecond(actor.damage, durationMs),
    contribution: partyDamage === 0 ? 0 : actor.damage / partyDamage,
    hits: actor.hits,
    criticalHits: actor.criticalHits,
    kills: actor.kills,
    skills,
    timeline: buildTimeline(actor.damagePoints, startedAtMs, durationMs),
  };
}

function buildTimeline(points: readonly DamagePoint[], startedAtMs: number, durationMs: number): FishNetDpsTimelinePoint[] {
  const bucketCount = Math.max(1, Math.ceil(durationMs / ANALYSIS_BUCKET_MS));
  const damageByBucket = new Array<number>(bucketCount).fill(0);
  for (const point of points) {
    const elapsedMs = point.observedAtMs - startedAtMs;
    const index = Math.min(bucketCount - 1, Math.max(0, Math.floor(elapsedMs / ANALYSIS_BUCKET_MS)));
    damageByBucket[index]! += point.damage;
  }
  const timeline: FishNetDpsTimelinePoint[] = [{ elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 }];
  let cumulativeDamage = 0;
  for (let index = 0; index < bucketCount; index += 1) {
    const elapsedMs = Math.min(durationMs, (index + 1) * ANALYSIS_BUCKET_MS);
    const bucketDurationMs = Math.max(1, elapsedMs - index * ANALYSIS_BUCKET_MS);
    const damage = damageByBucket[index] ?? 0;
    cumulativeDamage += damage;
    timeline.push({ elapsedMs, damage, cumulativeDamage, dps: perSecond(damage, bucketDurationMs) });
  }
  return timeline;
}

function compareRows(left: { damage: number; sourceLabel?: string; displayName?: string }, right: typeof left): number {
  return right.damage - left.damage
    || (left.sourceLabel ?? left.displayName ?? "").localeCompare(right.sourceLabel ?? right.displayName ?? "");
}

function perSecond(damage: number, durationMs: number): number {
  return damage / (durationMs / 1_000);
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function identityKey(actor: ActorAggregate): string {
  return actor.ownerConnectionId === undefined ? `actor:${actor.actorId}` : `owner:${actor.ownerConnectionId}`;
}

function positiveFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be a positive finite number`);
  return value;
}

function requireTimestamp(value: number): void {
  if (!Number.isFinite(value)) throw new Error("observedAtMs must be a finite number");
}
