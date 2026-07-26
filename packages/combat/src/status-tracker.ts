import {
  FishNetStatusDirectory,
  loadBundledStatusCatalog,
  statusDurationSeconds,
} from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent, FishNetCombatStatusEvent } from "./combat-tracker.ts";

export interface FishNetActiveStatus {
  statusId: string;
  displayName: string;
  spriteId?: string;
  isDebuff: boolean;
  level: number;
  appliedAtMs: number;
  expiresAtMs?: number;
  remainingMs?: number;
}

export interface FishNetStatusTrackerOptions {
  /** Status metadata used to resolve durations by level. Defaults to the bundled catalog. */
  statusCatalog?: FishNetStatusCatalog;
}

interface TrackedStatus {
  level: number;
  appliedAtMs: number;
  expiresAtMs?: number;
}

/** Tracks per-actor active buffs/debuffs from FishNet status apply/remove events. */
export class FishNetStatusTracker {
  private readonly directory: FishNetStatusDirectory;
  private readonly active = new Map<number, Map<string, TrackedStatus>>();
  /** Actor display names, tracked independently of damage so statuses resolve before an actor has hit anything. */
  private readonly identities = new Map<number, string>();

  constructor(options: FishNetStatusTrackerOptions = {}) {
    this.directory = new FishNetStatusDirectory(options.statusCatalog ?? loadBundledStatusCatalog());
  }

  consume(event: FishNetCombatEvent, observedAtMs: number): void {
    if (event.kind !== "status") return;
    this.consumeStatus(event, observedAtMs);
  }

  consumeIdentity(event: FishNetActorIdentityEvent): void {
    if (event.operation === "reset") {
      this.identities.clear();
      return;
    }
    if (event.operation === "remove") {
      this.identities.delete(event.actorId);
      return;
    }
    this.identities.set(event.actorId, event.displayName);
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
    const definition = this.directory.resolve(event.statusId);
    const durationSeconds = statusDurationSeconds(definition, event.level);
    statuses.set(event.statusId, {
      level: event.level,
      appliedAtMs: observedAtMs,
      ...(durationSeconds === undefined ? {} : { expiresAtMs: observedAtMs + durationSeconds * 1_000 }),
    });
    this.active.set(event.actorId, statuses);
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
      result.push({
        statusId,
        displayName: definition?.displayName ?? statusId,
        ...(definition?.spriteId === undefined ? {} : { spriteId: definition.spriteId }),
        isDebuff: definition?.isDebuff ?? false,
        level: tracked.level,
        appliedAtMs: tracked.appliedAtMs,
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
  }
}
