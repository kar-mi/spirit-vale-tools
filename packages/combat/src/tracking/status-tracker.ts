import {
  FishNetStatusDirectory,
  loadBundledStatusCatalog,
  statusDurationSeconds,
} from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import { FishNetSkillDirectory, loadBundledSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import { normalizeName } from "../reducers/rows.ts";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type {
  FishNetCombatActivationEvent,
  FishNetCombatEvent,
  FishNetCombatStatusEvent,
  FishNetCombatSummonEvent,
} from "../events/combat-events.ts";

export interface FishNetActiveStatus {
  statusId: string;
  displayName: string;
  spriteId?: string;
  isDebuff: boolean;
  level: number;
  appliedAtMs: number;
  expiresAtMs?: number;
  remainingMs?: number;
  stacks?: number;
}

export interface FishNetStatusTrackerOptions {
  /** Status metadata used to resolve durations by level. Defaults to the bundled catalog. */
  statusCatalog?: FishNetStatusCatalog;
  /** Skill metadata used to label summon-derived buffs. Defaults to the bundled catalog. */
  skillCatalog?: FishNetSkillCatalog;
}

interface TrackedStatus {
  level: number;
  appliedAtMs: number;
  expiresAtMs?: number;
  stacks?: number;
  summon?: true;
}

/** Feeds that repeat while a status is merely still active, rather than firing once when it starts. */
const REFRESHING_FEEDS = new Set<FishNetCombatStatusEvent["rpc"]>(["ApplyEffectDisplays_O", "ApplySkillDisplay_O"]);

/** How far a refreshed expiry may move before it counts as a new application rather than rounding. */
const EXPIRY_REFRESH_TOLERANCE_MS = 2_000;

/** Headroom added to the keep-alive window a status with no catalog duration reports. */
const KEEP_ALIVE_GRACE_MS = 1_000;

/** Tracks per-actor active buffs/debuffs from FishNet status apply/remove events. */
export class FishNetStatusTracker {
  private readonly directory: FishNetStatusDirectory;
  private readonly skillDirectory: FishNetSkillDirectory;
  private readonly active = new Map<number, Map<string, TrackedStatus>>();
  /** Actor display names, tracked independently of damage so statuses resolve before an actor has hit anything. */
  private readonly identities = new Map<number, string>();
  /** Last known actorId per uid. */
  private readonly actorIdByUid = new Map<string, number>();
  private revisionValue = 0;
  private nextExpiryRevision = -1;
  private nextExpiry?: number;

  constructor(options: FishNetStatusTrackerOptions = {}) {
    this.directory = new FishNetStatusDirectory(options.statusCatalog ?? loadBundledStatusCatalog());
    this.skillDirectory = new FishNetSkillDirectory(options.skillCatalog ?? loadBundledSkillCatalog());
  }

  /** Bumped only when the tracked set actually changed. */
  get revision(): number {
    return this.revisionValue;
  }

  /** Earliest moment a tracked status is due to disappear, or undefined when nothing is on a timer. */
  nextExpiryAtMs(): number | undefined {
    if (this.nextExpiryRevision === this.revisionValue) return this.nextExpiry;
    let earliest: number | undefined;
    for (const statuses of this.active.values()) {
      for (const tracked of statuses.values()) {
        if (tracked.expiresAtMs === undefined) continue;
        if (earliest === undefined || tracked.expiresAtMs < earliest) earliest = tracked.expiresAtMs;
      }
    }
    this.nextExpiry = earliest;
    this.nextExpiryRevision = this.revisionValue;
    return earliest;
  }

  private touch(): void {
    this.revisionValue += 1;
  }

  consume(event: FishNetCombatEvent, observedAtMs: number): void {
    if (event.kind === "status") this.consumeStatus(event, observedAtMs);
    else if (event.kind === "summon") this.consumeSummon(event, observedAtMs);
    else if (event.kind === "activation") this.consumeActivation(event, observedAtMs);
    else if (event.kind === "death" && this.active.delete(event.targetId)) this.touch();
  }

  consumeIdentity(event: FishNetActorIdentityEvent): void {
    if (event.operation === "reset") {
      this.identities.clear();
      if (this.active.size > 0) this.touch();
      this.active.clear();
      return;
    }
    if (event.operation === "remove") {
      this.identities.delete(event.actorId);
      if (this.active.delete(event.actorId)) this.touch();
      return;
    }
    if (event.uid) {
      const previousActorId = this.actorIdByUid.get(event.uid);
      if (previousActorId !== undefined && previousActorId !== event.actorId) {
        this.migrateActive(previousActorId, event.actorId);
      }
      this.actorIdByUid.set(event.uid, event.actorId);
    }
    this.identities.set(event.actorId, event.displayName);
  }

  private migrateActive(fromActorId: number, toActorId: number): void {
    const fromStatuses = this.active.get(fromActorId);
    if (!fromStatuses) return;
    this.active.delete(fromActorId);
    const toStatuses = this.active.get(toActorId) ?? new Map<string, TrackedStatus>();
    for (const [statusId, tracked] of fromStatuses) {
      if (!toStatuses.has(statusId)) toStatuses.set(statusId, tracked);
    }
    this.active.set(toActorId, toStatuses);
    this.touch();
  }

  consumeStatus(event: FishNetCombatStatusEvent, observedAtMs: number): void {
    if (event.actorIdentity) this.identities.set(event.actorId, event.actorIdentity.displayName);
    const statuses = this.active.get(event.actorId) ?? new Map<string, TrackedStatus>();
    if (event.action === "removed") {
      if (statuses.delete(event.statusId)) this.touch();
      if (statuses.size === 0) this.active.delete(event.actorId);
      else this.active.set(event.actorId, statuses);
      return;
    }
    const previous = statuses.get(event.statusId);
    const level = event.level ?? previous?.level ?? 1;
    const expiresAtMs = this.resolveExpiry(event, level, observedAtMs, previous);
    const tracked: TrackedStatus = {
      level,
      appliedAtMs: REFRESHING_FEEDS.has(event.rpc) ? previous?.appliedAtMs ?? observedAtMs : observedAtMs,
      ...(expiresAtMs === undefined ? {} : { expiresAtMs }),
      ...(event.stacks === undefined ? {} : { stacks: event.stacks }),
    };
    statuses.set(event.statusId, tracked);
    this.active.set(event.actorId, statuses);
    if (!sameTracked(previous, tracked)) this.touch();
  }

  /** Whether the status runs on a real countdown, as opposed to a toggle or aura the server merely keeps re-stating. */
  private isTimed(statusId: string, level: number): boolean {
    return statusDurationSeconds(this.directory.resolve(statusId), level) !== undefined;
  }

  /** Picks the expiry to trust. */
  private resolveExpiry(
    event: FishNetCombatStatusEvent,
    level: number,
    observedAtMs: number,
    previous: TrackedStatus | undefined,
  ): number | undefined {
    if (event.remainingSeconds !== undefined) {
      const reported = observedAtMs + event.remainingSeconds * 1_000;
      if (!this.isTimed(event.statusId, level)) return reported + KEEP_ALIVE_GRACE_MS;
      const established = previous?.expiresAtMs;
      if (established !== undefined
        && reported > established
        && reported - established < EXPIRY_REFRESH_TOLERANCE_MS) {
        return established;
      }
      return reported;
    }
    if (event.rpc === "ApplyEffectDisplays_O") return undefined;
    // The skill-icon feed carries no timing whatsoever, so it can only ever confirm that something is still on.
    if (event.rpc === "ApplySkillDisplay_O") return previous?.expiresAtMs;
    const durationSeconds = statusDurationSeconds(this.directory.resolve(event.statusId), level);
    return durationSeconds === undefined ? undefined : observedAtMs + durationSeconds * 1_000;
  }

  consumeSummon(event: FishNetCombatSummonEvent, observedAtMs: number): void {
    if (event.actorIdentity) this.identities.set(event.actorId, event.actorIdentity.displayName);
    const statuses = this.active.get(event.actorId) ?? new Map<string, TrackedStatus>();
    if (event.stacks <= 0) {
      if (statuses.delete(event.skillId)) this.touch();
      if (statuses.size === 0) this.active.delete(event.actorId);
      else this.active.set(event.actorId, statuses);
      return;
    }
    const previous = statuses.get(event.skillId);
    const tracked: TrackedStatus = { level: 1, stacks: event.stacks, appliedAtMs: observedAtMs, summon: true };
    statuses.set(event.skillId, tracked);
    this.active.set(event.actorId, statuses);
    if (!sameTracked(previous, tracked)) this.touch();
  }

  /** Refreshes a status's timer when one of its granting skills activates again. */
  private consumeActivation(event: FishNetCombatActivationEvent, observedAtMs: number): void {
    if (event.phase === "interrupt" || event.phase === "cancel") return;
    if (!event.sourceId) return;
    const statuses = this.active.get(event.actorId);
    if (!statuses) return;
    for (const [statusId, tracked] of statuses) {
      if (tracked.summon) continue;
      const definition = this.directory.resolve(statusId);
      const isGranter = statusId === event.sourceId
        || definition?.effects.some((effect) => effect.id === event.sourceId);
      if (!isGranter) continue;
      const sourceEffect = definition?.effects.find((effect) => effect.id === event.sourceId);
      const durationDefinition = definition && sourceEffect
        ? { ...definition, effects: [sourceEffect] }
        : definition;
      const durationSeconds = statusDurationSeconds(durationDefinition, event.level ?? tracked.level);
      const expiresAtMs = durationSeconds === undefined ? undefined : observedAtMs + durationSeconds * 1_000;
      if (tracked.appliedAtMs !== observedAtMs || tracked.expiresAtMs !== expiresAtMs) this.touch();
      tracked.appliedAtMs = observedAtMs;
      tracked.expiresAtMs = expiresAtMs;
    }
  }

  /** Drops statuses whose computed duration has elapsed; servers do not always send an explicit remove. */
  advance(nowMs: number): void {
    let expired = false;
    for (const [actorId, statuses] of this.active) {
      for (const [statusId, tracked] of statuses) {
        if (tracked.expiresAtMs !== undefined && tracked.expiresAtMs <= nowMs) {
          statuses.delete(statusId);
          expired = true;
        }
      }
      if (statuses.size === 0) this.active.delete(actorId);
    }
    if (expired) this.touch();
  }

  getActiveStatuses(actorId: number, nowMs: number): FishNetActiveStatus[] {
    const statuses = this.active.get(actorId);
    if (!statuses) return [];
    const result: FishNetActiveStatus[] = [];
    for (const [statusId, tracked] of statuses) {
      if (tracked.expiresAtMs !== undefined && tracked.expiresAtMs <= nowMs) continue;
      const definition = this.directory.resolve(statusId);
      const skillDefinition = this.skillDirectory.resolve(statusId);
      const spriteId = definition?.spriteId ?? skillDefinition?.spriteId;
      const timed = statusDurationSeconds(definition, tracked.level) !== undefined;
      result.push({
        statusId,
        displayName: definition?.displayName ?? skillDefinition?.displayName ?? statusId,
        ...(spriteId === undefined ? {} : { spriteId }),
        isDebuff: definition?.isDebuff ?? false,
        level: tracked.level,
        appliedAtMs: tracked.appliedAtMs,
        ...(tracked.stacks === undefined ? {} : { stacks: tracked.stacks }),
        ...(tracked.expiresAtMs === undefined || !timed
          ? {}
          : { expiresAtMs: tracked.expiresAtMs, remainingMs: Math.max(0, tracked.expiresAtMs - nowMs) }),
      });
    }
    return result.sort((left, right) => left.appliedAtMs - right.appliedAtMs);
  }

  /** Merges active statuses across actor IDs that represent the same logical actor (e.g. after a respawn). */
  getActiveStatusesForActors(actorIds: readonly number[], nowMs: number): FishNetActiveStatus[] {
    const byStatusId = new Map<string, FishNetActiveStatus>();
    for (const actorId of actorIds) {
      for (const status of this.getActiveStatuses(actorId, nowMs)) {
        const current = byStatusId.get(status.statusId);
        if (!current || status.appliedAtMs > current.appliedAtMs) byStatusId.set(status.statusId, status);
      }
    }
    return [...byStatusId.values()].sort((left, right) => left.appliedAtMs - right.appliedAtMs);
  }

  /** Resolves active statuses by display name, independent of whether that actor has dealt any damage. */
  getActiveStatusesForName(personalName: string, nowMs: number): FishNetActiveStatus[] {
    const normalized = normalizeName(personalName);
    if (!normalized) return [];
    const actorIds = [...this.identities]
      .filter(([, displayName]) => normalizeName(displayName) === normalized)
      .map(([actorId]) => actorId);
    return this.getActiveStatusesForActors(actorIds, nowMs);
  }

  /** Discards all tracked statuses, e.g. when the encounter/session resets. */
  reset(): void {
    if (this.active.size > 0) this.touch();
    this.active.clear();
    this.identities.clear();
    this.actorIdByUid.clear();
  }
}

/** Whether a re-stated status is identical to the one already tracked, field for field. */
function sameTracked(previous: TrackedStatus | undefined, next: TrackedStatus): boolean {
  return previous !== undefined
    && previous.level === next.level
    && previous.appliedAtMs === next.appliedAtMs
    && previous.expiresAtMs === next.expiresAtMs
    && previous.stacks === next.stacks
    && previous.summon === next.summon;
}

