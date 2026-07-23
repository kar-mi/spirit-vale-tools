import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent, FishNetCombatEvent } from "./combat-tracker.ts";

export interface FishNetDpsMeterOptions {
  /** Milliseconds without positive player damage before a new encounter. Defaults to 30 seconds. */
  idleGapMs?: number;
  /** Minimum duration used as the DPS divisor. Defaults to one second. */
  minimumDurationMs?: number;
  /** Milliseconds of recent damage included in current DPS. Defaults to 15 seconds. */
  currentWindowMs?: number;
  /** Milliseconds to wait for a late identity before showing unidentified damage. Defaults to ten seconds. */
  anonymousIdentityGraceMs?: number;
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
  archetype?: number;
  /** Milliseconds used as the DPS divisor and timeline span for this row. */
  durationMs?: number;
  damage: number;
  dps: number;
  currentDps: number;
  contribution: number;
  hits: number;
  criticalHits: number;
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
  uid?: string;
  activeIdentity: boolean;
  damage: number;
  firstDamageAtMs?: number;
  lastDamageAtMs?: number;
  hits: number;
  criticalHits: number;
  kills: number;
  targetIds: Set<number>;
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
const DEFAULT_CURRENT_WINDOW_MS = 15_000;
const DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS = 10_000;
const DEFAULT_REPLAY_TICKS_PER_SECOND = 30;
const ANALYSIS_BUCKET_MS = 5_000;

/** Aggregates structured FishNet identity and combat events into encounter DPS summaries. */
export class FishNetDpsMeter {
  private readonly idleGapMs: number;
  private readonly minimumDurationMs: number;
  private readonly currentWindowMs: number;
  private readonly anonymousIdentityGraceMs: number;
  private readonly replayTicksPerSecond: number;
  private readonly finished: EncounterAggregate[] = [];
  private readonly identities = new Map<number, {
    displayName: string;
    archetype?: number;
    ownerConnectionId?: number;
    uid?: string;
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
    this.currentWindowMs = positiveFinite(
      options.currentWindowMs ?? DEFAULT_CURRENT_WINDOW_MS,
      "currentWindowMs",
    );
    this.anonymousIdentityGraceMs = nonNegativeFinite(
      options.anonymousIdentityGraceMs ?? DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS,
      "anonymousIdentityGraceMs",
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

    const previousIdentity = this.identities.get(event.actorId);
    const archetype = event.archetype ?? previousIdentity?.archetype;
    this.identities.set(event.actorId, {
      displayName: event.displayName,
      ...(archetype === undefined ? {} : { archetype }),
      ...(event.ownerConnectionId ?? previousIdentity?.ownerConnectionId) === undefined
        ? {} : { ownerConnectionId: event.ownerConnectionId ?? previousIdentity?.ownerConnectionId },
      ...(event.uid ?? previousIdentity?.uid) === undefined
        ? {} : { uid: event.uid ?? previousIdentity?.uid },
    });
    if (!this.current) return;

    let actor = this.current.activeActors.get(event.actorId);
    if (!actor) {
      actor = createActor(event.actorId);
      this.current.actors.push(actor);
      this.current.activeActors.set(event.actorId, actor);
    }
    actor.displayName = event.displayName;
    if (event.archetype !== undefined) actor.archetype = event.archetype;
    if (event.ownerConnectionId !== undefined) actor.ownerConnectionId = event.ownerConnectionId;
    if (event.uid !== undefined) actor.uid = event.uid;
    actor.activeIdentity = true;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    requireTimestamp(observedAtMs);
    if (event.actorIdentity) {
      const previousIdentity = this.identities.get(event.actorId);
      this.identities.set(event.actorId, {
        displayName: event.actorIdentity.displayName,
        ...(event.actorIdentity.archetype ?? previousIdentity?.archetype) === undefined
          ? {} : { archetype: event.actorIdentity.archetype ?? previousIdentity?.archetype },
        ...(event.actorIdentity.ownerConnectionId ?? previousIdentity?.ownerConnectionId) === undefined
          ? {} : { ownerConnectionId: event.actorIdentity.ownerConnectionId ?? previousIdentity?.ownerConnectionId },
        ...(event.actorIdentity.uid ?? previousIdentity?.uid) === undefined
          ? {} : { uid: event.actorIdentity.uid ?? previousIdentity?.uid },
      });
    }
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
      actor.firstDamageAtMs ??= observedAtMs;
      actor.lastDamageAtMs = observedAtMs;
      actor.hits += 1;
      if (event.hitResult === "critical") actor.criticalHits += 1;
      actor.damagePoints.push({ observedAtMs, damage: event.value });
      if (isMobTarget(this.identities, event.actorId, event.targetId)) actor.targetIds.add(event.targetId);
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

  getSnapshots(nowMs?: number): FishNetDpsEncounterSnapshot[] {
    const encounters = this.current ? [...this.finished, this.current] : this.finished;
    return encounters.map((encounter) => this.snapshot(encounter, nowMs));
  }

  getLatestSnapshot(nowMs?: number): FishNetDpsEncounterSnapshot | undefined {
    const encounter = this.current ?? this.finished.at(-1);
    return encounter ? this.snapshot(encounter, nowMs) : undefined;
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

  private snapshot(encounter: EncounterAggregate, nowMs?: number): FishNetDpsEncounterSnapshot {
    const snapshotNowMs = Math.max(nowMs ?? encounter.lastDamageAtMs, encounter.lastDamageAtMs);
    const durationMs = Math.max(
      this.minimumDurationMs,
      encounter.lastDamageAtMs - encounter.startedAtMs,
    );
    const mergedActors = mergeActors(encounter.actors);
    const totalDamage = mergedActors.reduce((sum, actor) => sum + actor.damage, 0);
    const rowForActor = (actor: ActorAggregate): FishNetDpsActorRow => actorRow(
      actor,
      encounter.startedAtMs,
      durationMs,
      totalDamage,
      snapshotNowMs,
      this.currentWindowMs,
      this.minimumDurationMs,
      actor.displayName === undefined,
    );
    const namedActors = mergedActors.filter((actor) => actor.displayName !== undefined);
    const anonymousActors = mergedActors.filter((actor) => actor.displayName === undefined);
    const visibleAnonymousActors = anonymousActors.filter((actor) => encounter.endedAtMs !== undefined
      || (this.personalActorId !== undefined && actor.actorIds.includes(this.personalActorId))
      || actor.firstDamageAtMs === undefined
      || snapshotNowMs - actor.firstDamageAtMs >= this.anonymousIdentityGraceMs);
    const displayActors = visibleAnonymousActors.length === 0
      ? namedActors
      : [...namedActors, combineActors(visibleAnonymousActors)];
    const actors = displayActors
      .map(rowForActor)
      .sort(compareRows);
    const partyCurrentDps = mergedActors.reduce((sum, actor) => sum + rowForActor(actor).currentDps, 0);
    const normalizedPersonalName = normalizeName(this.personalName);
    const activeMatches = normalizedPersonalName
      ? new Set(encounter.actors
        .filter((actor) => actor.activeIdentity && normalizeName(actor.displayName ?? "") === normalizedPersonalName)
        .map(identityKey))
      : new Set<string>();
    const selectedPersonalActor = this.personalActorId === undefined
      ? undefined
      : mergedActors
        .find((actor) => actor.actorIds.includes(this.personalActorId!));
    const personalActor = selectedPersonalActor ?? (normalizedPersonalName
      ? namedActors.find((actor) => normalizeName(actor.displayName ?? "") === normalizedPersonalName)
      : undefined);
    const personalMatch: FishNetPersonalMatch = selectedPersonalActor
      ? "matched"
      : this.personalActorId !== undefined
        ? "missing"
        : !normalizedPersonalName
      ? "unconfigured"
      : activeMatches.size > 1
        ? "ambiguous"
        : personalActor
          ? "matched"
          : "missing";
    const personalStartMs = personalActor?.firstDamageAtMs ?? encounter.startedAtMs;
    const personalDurationMs = Math.max(
      this.minimumDurationMs,
      (personalActor?.lastDamageAtMs ?? personalStartMs) - personalStartMs,
    );
    const personal = personalActor === undefined
      ? undefined
      : actorRow(
        personalActor,
        personalStartMs,
        personalDurationMs,
        totalDamage,
        snapshotNowMs,
        this.currentWindowMs,
        this.minimumDurationMs,
        personalActor.displayName === undefined,
      );
    return {
      id: encounter.id,
      startedAtMs: encounter.startedAtMs,
      lastDamageAtMs: encounter.lastDamageAtMs,
      ...(encounter.endedAtMs === undefined ? {} : { endedAtMs: encounter.endedAtMs }),
      durationMs,
      totalDamage,
      partyDps: perSecond(totalDamage, durationMs),
      partyCurrentDps,
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
    targetIds: new Set(),
    hits: 0,
    criticalHits: 0,
    kills: 0,
    skills: new Map(),
    damagePoints: [],
  };
}

// Summon hits already carry the summoner's actor ID on the wire; isSummon needs no separate aggregation path.
function isCountedDamage(event: FishNetCombatEvent): event is FishNetCombatDamageEvent | FishNetCombatDeathEvent {
  if (event.kind === "activation"
    || event.team !== 0
    || event.actorId === event.targetId
    || !Number.isFinite(event.value)
    || event.value <= 0) return false;
  return event.kind === "damage" || !event.duplicatesDamageEvent;
}

function isCountedKill(event: FishNetCombatEvent): event is FishNetCombatDeathEvent {
  return event.kind === "death"
    && event.team === 0
    && event.actorId !== event.targetId
    && Number.isFinite(event.value)
    && event.value > 0;
}

function mergeActors(actors: ActorAggregate[]): ActorAggregate[] {
  const merged = new Map<string, ActorAggregate>();
  for (const actor of actors) {
    if (actor.damage <= 0) continue;
    const displayName = actor.displayName?.trim() || undefined;
    const key = actor.uid !== undefined
      ? `uid:${actor.uid}`
      : actor.ownerConnectionId !== undefined
      ? `owner:${actor.ownerConnectionId}`
      : displayName !== undefined
        ? `name:${normalizeName(displayName)}`
        : `actor:${actor.actorId}`;
    let target = merged.get(key);
    if (!target) {
      target = {
        ...createActor(actor.actorId),
        ...(displayName === undefined ? {} : { displayName }),
        activeIdentity: actor.activeIdentity,
        damage: 0,
        hits: 0,
        criticalHits: 0,
        kills: 0,
        ...(actor.archetype === undefined ? {} : { archetype: actor.archetype }),
        ...(actor.ownerConnectionId === undefined ? {} : { ownerConnectionId: actor.ownerConnectionId }),
        ...(actor.uid === undefined ? {} : { uid: actor.uid }),
      };
      merged.set(key, target);
    }
    if (actor.activeIdentity) {
      target.displayName = displayName;
      if (actor.archetype !== undefined) target.archetype = actor.archetype;
    } else if (target.archetype === undefined) {
      target.archetype = actor.archetype;
    }
    target.activeIdentity ||= actor.activeIdentity;
    target.damage += actor.damage;
    target.firstDamageAtMs = target.firstDamageAtMs === undefined
      ? actor.firstDamageAtMs
      : actor.firstDamageAtMs === undefined
        ? target.firstDamageAtMs
        : Math.min(target.firstDamageAtMs, actor.firstDamageAtMs);
    target.lastDamageAtMs = target.lastDamageAtMs === undefined
      ? actor.lastDamageAtMs
      : actor.lastDamageAtMs === undefined
        ? target.lastDamageAtMs
        : Math.max(target.lastDamageAtMs, actor.lastDamageAtMs);
    target.hits += actor.hits;
    target.criticalHits += actor.criticalHits;
    target.kills += actor.kills;
    target.actorIds = [...new Set([...target.actorIds, ...actor.actorIds])];
    for (const targetId of actor.targetIds) target.targetIds.add(targetId);
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

function actorRow(
  actor: ActorAggregate,
  startedAtMs: number,
  durationMs: number,
  partyDamage: number,
  nowMs: number,
  currentWindowMs: number,
  minimumDurationMs: number,
  isUnidentified: boolean,
): FishNetDpsActorRow {
  const currentCutoffMs = nowMs - currentWindowMs;
  const windowDamage = actor.damagePoints.reduce(
    (sum, point) => point.observedAtMs > currentCutoffMs ? sum + point.damage : sum,
    0,
  );
  const currentDurationMs = Math.max(
    minimumDurationMs,
    Math.min(currentWindowMs, nowMs - startedAtMs),
  );
  const skills = [...actor.skills.values()]
    .map((skill): FishNetDpsSkillRow => ({
      ...skill,
      dps: perSecond(skill.damage, durationMs),
      contribution: actor.damage === 0 ? 0 : skill.damage / actor.damage,
    }))
    .sort(compareRows);
  return {
    actorIds: [...actor.actorIds],
    displayName: actor.displayName ?? (isUnidentified ? "Unidentified" : "Unknown"),
    ...(actor.archetype === undefined ? {} : { archetype: actor.archetype }),
    durationMs,
    damage: actor.damage,
    dps: perSecond(actor.damage, durationMs),
    currentDps: perSecond(windowDamage, currentDurationMs),
    contribution: partyDamage === 0 ? 0 : actor.damage / partyDamage,
    hits: actor.hits,
    criticalHits: actor.criticalHits,
    kills: actor.kills,
    mobsHit: actor.targetIds.size,
    skills,
    timeline: buildTimeline(actor.damagePoints, startedAtMs, durationMs),
    ...(isUnidentified ? { isUnidentified: true } : {}),
  };
}

function combineActors(actors: readonly ActorAggregate[]): ActorAggregate {
  const combined = createActor(actors[0]?.actorId ?? -1);
  combined.actorIds = [];
  for (const actor of actors) {
    combined.actorIds.push(...actor.actorIds);
    combined.damage += actor.damage;
    combined.firstDamageAtMs = combined.firstDamageAtMs === undefined
      ? actor.firstDamageAtMs
      : actor.firstDamageAtMs === undefined
        ? combined.firstDamageAtMs
        : Math.min(combined.firstDamageAtMs, actor.firstDamageAtMs);
    combined.lastDamageAtMs = combined.lastDamageAtMs === undefined
      ? actor.lastDamageAtMs
      : actor.lastDamageAtMs === undefined
        ? combined.lastDamageAtMs
        : Math.max(combined.lastDamageAtMs, actor.lastDamageAtMs);
    combined.hits += actor.hits;
    combined.criticalHits += actor.criticalHits;
    combined.kills += actor.kills;
    for (const targetId of actor.targetIds) combined.targetIds.add(targetId);
    combined.damagePoints.push(...actor.damagePoints);
    for (const skill of actor.skills.values()) {
      const current = combined.skills.get(skill.sourceId);
      if (current) {
        current.sourceLabel = skill.sourceLabel;
        current.damage += skill.damage;
        current.hits += skill.hits;
        current.criticalHits += skill.criticalHits;
      } else {
        combined.skills.set(skill.sourceId, { ...skill });
      }
    }
  }
  combined.actorIds = [...new Set(combined.actorIds)];
  return combined;
}

function isMobTarget(identities: ReadonlyMap<number, unknown>, actorId: number, targetId: number): boolean {
  return targetId >= 0 && targetId !== actorId && !identities.has(targetId);
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

function nonNegativeFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be a non-negative finite number`);
  return value;
}
