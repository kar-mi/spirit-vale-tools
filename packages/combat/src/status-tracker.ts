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
  /**
   * Set for an entry that came from a summon calibration rather than a status feed. Summons are
   * filed under a *skill* id and have no timer to refresh, so the activation-driven refresh has to
   * leave them alone. This used to be inferred from `stacks` being present, which stopped working
   * once the display feed began reporting stacks for ordinary statuses too.
   */
  summon?: true;
}

/**
 * Feeds that repeat while a status is merely still active, rather than firing once when it starts.
 * Their repeats must not restart `appliedAtMs`, or it would creep forward for the whole duration.
 */
const REFRESHING_FEEDS = new Set<FishNetCombatStatusEvent["rpc"]>(["ApplyEffectDisplays_O", "ApplySkillDisplay_O"]);

/**
 * How far a refreshed expiry may move before it counts as a new application rather than rounding.
 * Measured over a live session: repeats of one status landed within 1.6s of the established expiry,
 * while the smallest genuine re-application moved it 2.4s, so 2s separates them with room either way.
 */
const EXPIRY_REFRESH_TOLERANCE_MS = 2_000;

/**
 * Headroom added to the keep-alive window a status with no catalog duration reports. The window is
 * the server's refresh cadence, not a lifetime, and it is judged against a clock that extrapolates
 * between polls - so taking the reported second literally leaves no margin for a late refresh and
 * the chip blinks out and back. Measured over a live session: refreshes land up to 0.70s apart and
 * the overlay clock runs up to 0.60s ahead of the newest event it has read, so 1s covers both.
 * Nothing publishes this value for such a status, so the only visible effect is that an aura that
 * genuinely lapsed clears a second later.
 */
const KEEP_ALIVE_GRACE_MS = 1_000;

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
   * Whether the status runs on a real countdown, as opposed to a toggle or aura the server merely
   * keeps re-stating. The catalog is the authority: a status it gives no duration never counts down,
   * whatever the wire reports for it.
   */
  private isTimed(statusId: string, level: number): boolean {
    return statusDurationSeconds(this.directory.resolve(statusId), level) !== undefined;
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
    if (event.remainingSeconds !== undefined) {
      const reported = observedAtMs + event.remainingSeconds * 1_000;
      // For a status with no catalog duration the reported second is a keep-alive window rather than
      // a countdown - the server just re-states it on every refresh - so it has to keep moving
      // forward. Holding it would pin the expiry in the past between refreshes and make the toggle
      // blink out and back. The window also needs headroom, because a refresh can land late and the
      // clock it is judged against runs ahead between polls. Nothing publishes this value for such a
      // status anyway.
      if (!this.isTimed(event.statusId, level)) return reported + KEEP_ALIVE_GRACE_MS;
      // The server quantises what it reports, so refreshes of one countdown disagree by up to ~1.5s
      // from rounding alone while a genuine re-application moves the expiry by at least ~2.4s. A
      // status still running can only have *less* time left, so an earlier expiry is real progress
      // and is taken as-is; only a later one is judged. Adopting the rounding instead re-phases the
      // countdown - the rendered seconds sit still and then skip - and, since it always leans
      // forward, walks the expiry along until the status never times out at all.
      const established = previous?.expiresAtMs;
      if (established !== undefined
        && reported > established
        && reported - established < EXPIRY_REFRESH_TOLERANCE_MS) {
        return established;
      }
      return reported;
    }
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
    statuses.set(event.skillId, { level: 1, stacks: event.stacks, appliedAtMs: observedAtMs, summon: true });
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
      // A status the catalog gives no duration is a toggle or aura: the server re-sends it about
      // once a second, so the "1s remaining" it reports is the refresh cadence, not a lifetime. That
      // countdown is still worth keeping internally - it is how a lapsed aura disappears - but
      // publishing it would show a permanent buff as forever expiring in one second, and would put
      // it in the timed-buff tile instead of the toggle tile the status picker already files it
      // under.
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

