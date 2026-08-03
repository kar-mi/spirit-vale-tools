import {
  FishNetStatusDirectory,
  loadBundledStatusCatalog,
  statusDurationSeconds,
} from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import { FishNetSkillDirectory, loadBundledSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type {
  FishNetCombatActivationEvent,
  FishNetCombatEvent,
  FishNetCombatStatusEvent,
  FishNetCombatSummonEvent,
} from "./combat-tracker.ts";

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
}

/**
 * Feeds that repeat while a status is merely still active, rather than firing once when it starts.
 * Their repeats must not restart `appliedAtMs`, or it would creep forward for the whole duration.
 */
const REFRESHING_FEEDS = new Set<FishNetCombatStatusEvent["rpc"]>(["ApplyEffectDisplays_O", "ApplySkillDisplay_O"]);

/** Tracks per-actor active buffs/debuffs from FishNet status apply/remove events. */
export class FishNetStatusTracker {
  private readonly directory: FishNetStatusDirectory;
  private readonly skillDirectory: FishNetSkillDirectory;
  private readonly active = new Map<number, Map<string, TrackedStatus>>();
  /** Actor display names, tracked independently of damage so statuses resolve before an actor has hit anything. */
  private readonly identities = new Map<number, string>();
  /**
   * Last known actorId per uid. A `reset` (zone transition/relog) always clears `active` for
   * every actorId before any later upsert is processed, so migrateActive is a no-op on that
   * path; it only matters for a uid re-upserting under a new actorId without an intervening
   * reset (e.g. ownership handoff), where it still carries statuses forward.
   */
  private readonly actorIdByUid = new Map<string, number>();

  constructor(options: FishNetStatusTrackerOptions = {}) {
    this.directory = new FishNetStatusDirectory(options.statusCatalog ?? loadBundledStatusCatalog());
    this.skillDirectory = new FishNetSkillDirectory(options.skillCatalog ?? loadBundledSkillCatalog());
  }

  consume(event: FishNetCombatEvent, observedAtMs: number): void {
    if (event.kind === "status") this.consumeStatus(event, observedAtMs);
    else if (event.kind === "summon") this.consumeSummon(event, observedAtMs);
    else if (event.kind === "activation") this.consumeActivation(event, observedAtMs);
    else if (event.kind === "death") this.active.delete(event.targetId);
  }

  consumeIdentity(event: FishNetActorIdentityEvent): void {
    if (event.operation === "reset") {
      this.identities.clear();
      this.active.clear();
      return;
    }
    if (event.operation === "remove") {
      this.identities.delete(event.actorId);
      this.active.delete(event.actorId);
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

  /**
   * Carries statuses tracked under a stale actorId over to the actorId the same uid was just
   * reassigned, for a uid re-upsert that wasn't preceded by a `reset` (e.g. ownership handoff).
   * Statuses that were merely orphaned by a `reset` are already gone by the time this runs -
   * a zone transition re-syncs whatever's genuinely still active via fresh ApplyEffect_T
   * packets, so nothing still-active is lost by clearing on reset.
   */
  private migrateActive(fromActorId: number, toActorId: number): void {
    const fromStatuses = this.active.get(fromActorId);
    if (!fromStatuses) return;
    this.active.delete(fromActorId);
    const toStatuses = this.active.get(toActorId) ?? new Map<string, TrackedStatus>();
    for (const [statusId, tracked] of fromStatuses) {
      if (!toStatuses.has(statusId)) toStatuses.set(statusId, tracked);
    }
    this.active.set(toActorId, toStatuses);
  }

  consumeStatus(event: FishNetCombatStatusEvent, observedAtMs: number): void {
    if (event.actorIdentity) this.identities.set(event.actorId, event.actorIdentity.displayName);
    const statuses = this.active.get(event.actorId) ?? new Map<string, TrackedStatus>();
    if (event.action === "removed") {
      statuses.delete(event.statusId);
      if (statuses.size === 0) this.active.delete(event.actorId);
      else this.active.set(event.actorId, statuses);
      return;
    }
    const previous = statuses.get(event.statusId);
    // The display feed reports no level, so keep whatever the owner-only feed last established
    // rather than resetting to 1 and mis-deriving every level-scaled duration from then on.
    const level = event.level ?? previous?.level ?? 1;
    const expiresAtMs = this.resolveExpiry(event, level, observedAtMs, previous);
    statuses.set(event.statusId, {
      level,
      // The display feed repeats while a status is merely still active, so treating every packet as
      // a fresh application would make "applied at" drift forward for the whole duration.
      appliedAtMs: REFRESHING_FEEDS.has(event.rpc) ? previous?.appliedAtMs ?? observedAtMs : observedAtMs,
      ...(expiresAtMs === undefined ? {} : { expiresAtMs }),
      ...(event.stacks === undefined ? {} : { stacks: event.stacks }),
    });
    this.active.set(event.actorId, statuses);
  }

  /**
   * Picks the expiry to trust.
   *
   * A server-reported remaining time always wins - the catalog's nominal duration is only ever an
   * estimate of the number the server is already sending. The subtlety is what *absence* means: on
   * the display feed the server states remaining time for every status it reports, so nothing there
   * means the status genuinely has no expiry, and falling back to the catalog would expire a
   * permanent buff on a timer it never had. On the owner-only feed absence just means the wire never
   * carried a duration, and the catalog is the best available answer.
   */
  private resolveExpiry(
    event: FishNetCombatStatusEvent,
    level: number,
    observedAtMs: number,
    previous: TrackedStatus | undefined,
  ): number | undefined {
    if (event.remainingSeconds !== undefined) return observedAtMs + event.remainingSeconds * 1_000;
    if (event.rpc === "ApplyEffectDisplays_O") return undefined;
    // The skill-icon feed carries no timing whatsoever, so it can only ever confirm that something
    // is still on. Letting it answer here would erase a countdown the effect feed already reported
    // for the same id - they overlap on statuses like FlowState.
    if (event.rpc === "ApplySkillDisplay_O") return previous?.expiresAtMs;
    const durationSeconds = statusDurationSeconds(this.directory.resolve(event.statusId), level);
    return durationSeconds === undefined ? undefined : observedAtMs + durationSeconds * 1_000;
  }

  consumeSummon(event: FishNetCombatSummonEvent, observedAtMs: number): void {
    if (event.actorIdentity) this.identities.set(event.actorId, event.actorIdentity.displayName);
    const statuses = this.active.get(event.actorId) ?? new Map<string, TrackedStatus>();
    if (event.stacks <= 0) {
      statuses.delete(event.skillId);
      if (statuses.size === 0) this.active.delete(event.actorId);
      else this.active.set(event.actorId, statuses);
      return;
    }
    statuses.set(event.skillId, { level: 1, stacks: event.stacks, appliedAtMs: observedAtMs });
    this.active.set(event.actorId, statuses);
  }

  /**
   * Refreshes a status's timer when one of its granting skills activates again.
   * Some skills (e.g. Haste, Axe Quicken) don't resend ApplyEffect_T on recast while
   * already active - the activation event is the only wire-level trace of the recast,
   * so it's used as a refresh signal. Catalog grant relationships also cover statuses
   * such as ComboReady, whose qualifying skills have different ids from the status.
   */
  private consumeActivation(event: FishNetCombatActivationEvent, observedAtMs: number): void {
    if (event.phase === "interrupt" || event.phase === "cancel") return;
    if (!event.sourceId) return;
    const statuses = this.active.get(event.actorId);
    if (!statuses) return;
    for (const [statusId, tracked] of statuses) {
      if (tracked.stacks !== undefined) continue;
      const definition = this.directory.resolve(statusId);
      const isGranter = statusId === event.sourceId
        || definition?.effects.some((effect) => effect.id === event.sourceId);
      if (!isGranter) continue;
      const sourceEffect = definition?.effects.find((effect) => effect.id === event.sourceId);
      const durationDefinition = definition && sourceEffect
        ? { ...definition, effects: [sourceEffect] }
        : definition;
      const durationSeconds = statusDurationSeconds(durationDefinition, event.level ?? tracked.level);
      tracked.appliedAtMs = observedAtMs;
      tracked.expiresAtMs = durationSeconds === undefined ? undefined : observedAtMs + durationSeconds * 1_000;
    }
  }

  /** Drops statuses whose computed duration has elapsed; servers do not always send an explicit remove. */
  advance(nowMs: number): void {
    for (const [actorId, statuses] of this.active) {
      for (const [statusId, tracked] of statuses) {
        if (tracked.expiresAtMs !== undefined && tracked.expiresAtMs <= nowMs) statuses.delete(statusId);
      }
      if (statuses.size === 0) this.active.delete(actorId);
    }
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
      result.push({
        statusId,
        displayName: definition?.displayName ?? skillDefinition?.displayName ?? statusId,
        ...(spriteId === undefined ? {} : { spriteId }),
        isDebuff: definition?.isDebuff ?? false,
        level: tracked.level,
        appliedAtMs: tracked.appliedAtMs,
        ...(tracked.stacks === undefined ? {} : { stacks: tracked.stacks }),
        ...(tracked.expiresAtMs === undefined
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
    const normalized = personalName.trim().toLocaleLowerCase();
    if (!normalized) return [];
    const actorIds = [...this.identities]
      .filter(([, displayName]) => displayName.trim().toLocaleLowerCase() === normalized)
      .map(([actorId]) => actorId);
    return this.getActiveStatusesForActors(actorIds, nowMs);
  }

  /** Discards all tracked statuses, e.g. when the encounter/session resets. */
  reset(): void {
    this.active.clear();
    this.identities.clear();
    this.actorIdByUid.clear();
  }
}

