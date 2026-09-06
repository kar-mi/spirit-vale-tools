import { isDamagingStatus, loadBundledStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetStatusCatalog, FishNetStatusDefinition } from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import { FishNetStatusTracker } from "./status-tracker.ts";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatEvent, FishNetCombatStatusEvent } from "../events/combat-events.ts";

const DEFAULT_CORRELATION_WINDOW_MS = 1_000;
const EPISODE_IDLE_TIMEOUT_MS = 60_000;

export interface StatusDamageAttributionOptions {
  statusCatalog?: FishNetStatusCatalog;
  skillCatalog?: FishNetSkillCatalog;
  /** Maximum delay from a hit to its corroborating observer snapshot. Defaults to one second. */
  correlationWindowMs?: number;
}

/** Estimated live stack ownership, after individually timed applications have expired. */
export interface StatusStackShares {
  /** Live ledger total; between snapshots this decreases as application batches expire. */
  totalStacks: number;
  byActor: Map<number, number>;
  unattributed: number;
}

interface StackBatch {
  stacks: number;
  expiresAtMs: number;
  /** Absent when the application cannot be established. */
  actorId?: number;
}

interface Candidate extends StackBatch {
  atMs: number;
  targetId: number;
  statusId: string;
}

interface Episode {
  lastSnapshotAtMs: number;
  batches: StackBatch[];
}

/**
 * Corroborates candidate applications against observer totals, retaining a separate expiry
 * for every accepted application. New snapshots never refresh existing batches. Durations
 * and counts are source-specific catalog estimates, not wire-reported per-stack timers.
 * Missing or conflicting evidence stays unattributed; stack shares are not damage weights
 * when different applications have different per-stack damage.
 */
export class StatusDamageAttributionTracker {
  private readonly statuses = new Map<string, FishNetStatusDefinition>();
  private readonly buffs: FishNetStatusTracker;
  private readonly correlationWindowMs: number;
  private readonly partyActorIds = new Set<number>();
  private readonly levels = new Map<number, Map<string, number>>();
  private readonly episodes = new Map<string, Episode>();
  private recentApplications: Candidate[] = [];

  constructor(options: StatusDamageAttributionOptions = {}) {
    const statusCatalog = options.statusCatalog ?? loadBundledStatusCatalog();
    for (const definition of statusCatalog.statuses) {
      if (isDamagingStatus(definition)) this.statuses.set(definition.id, definition);
    }
    this.buffs = new FishNetStatusTracker({
      statusCatalog,
      ...(options.skillCatalog ? { skillCatalog: options.skillCatalog } : {}),
    });
    this.correlationWindowMs = options.correlationWindowMs ?? DEFAULT_CORRELATION_WINDOW_MS;
    if (!Number.isFinite(this.correlationWindowMs) || this.correlationWindowMs < 0) {
      throw new Error("correlationWindowMs must be finite and non-negative");
    }
  }

  consumeIdentity(event: FishNetActorIdentityEvent): void {
    this.buffs.consumeIdentity(event);
    if (event.operation === "reset") {
      this.reset();
    } else if (event.operation === "remove") {
      this.partyActorIds.delete(event.actorId);
      this.levels.delete(event.actorId);
      this.recentApplications = this.recentApplications.filter((candidate) => candidate.actorId !== event.actorId);
    } else {
      this.partyActorIds.add(event.actorId);
    }
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    this.advance(observedAtMs);
    this.buffs.consume(event, observedAtMs);
    if (event.actorIdentity && event.actorId !== undefined) this.partyActorIds.add(event.actorId);
    if (event.kind === "monsterIdentity") {
      if (event.operation === "reset") this.endEncounter();
      else this.dropTarget(event.actorId);
    } else if (event.kind === "activation") {
      if (event.sourceId && event.level !== undefined && Number.isInteger(event.level) && event.level >= 1) {
        const levels = this.levels.get(event.actorId) ?? new Map<string, number>();
        levels.set(event.sourceId, event.level);
        this.levels.set(event.actorId, levels);
      }
    } else if (event.kind === "damage") {
      this.recordApplications(event, observedAtMs);
    } else if (event.kind === "death") {
      this.dropTarget(event.targetId);
    } else if (event.kind === "status") {
      if (this.partyActorIds.has(event.actorId) && event.action === "applied"
        && event.level !== undefined && Number.isInteger(event.level) && event.level >= 1) {
        const levels = this.levels.get(event.actorId) ?? new Map<string, number>();
        levels.set(event.statusId, event.level);
        this.levels.set(event.actorId, levels);
      }
      this.consumeStatus(event, observedAtMs);
    }
  }

  /** Also called on every combat event, so DoT ticks see expiry even without new snapshots. */
  advance(nowMs: number): void {
    this.buffs.advance(nowMs);
    this.recentApplications = this.recentApplications.filter((candidate) => candidate.atMs >= nowMs - this.correlationWindowMs);
    for (const [key, episode] of this.episodes) {
      episode.batches = episode.batches.filter((batch) => batch.expiresAtMs > nowMs);
      if (episode.batches.length === 0 && nowMs - episode.lastSnapshotAtMs >= EPISODE_IDLE_TIMEOUT_MS) {
        this.episodes.delete(key);
      }
    }
  }

  endEncounter(): void {
    this.episodes.clear();
    this.recentApplications = [];
  }

  reset(): void {
    this.buffs.reset();
    this.partyActorIds.clear();
    this.levels.clear();
    this.endEncounter();
  }

  /** Call advance (or consumeCombat) at the tick's observation time before reading shares. */
  shares(targetId: number, statusId: string): StatusStackShares | undefined {
    const episode = this.episodes.get(episodeKey(targetId, statusId));
    if (!episode?.batches.length) return undefined;
    const result: StatusStackShares = { totalStacks: 0, byActor: new Map(), unattributed: 0 };
    for (const batch of episode.batches) {
      result.totalStacks += batch.stacks;
      if (batch.actorId === undefined) result.unattributed += batch.stacks;
      else result.byActor.set(batch.actorId, (result.byActor.get(batch.actorId) ?? 0) + batch.stacks);
    }
    return result;
  }

  private recordApplications(event: FishNetCombatDamageEvent, atMs: number): void {
    // Periodic damage never constitutes a coating hit, even when its source is unrecognized.
    if (event.value <= 0 || event.damageType === 3 || this.statuses.has(event.sourceId)
      || event.hitResult === "miss" || event.hitResult === "dodged") return;
    if (!this.partyActorIds.has(event.actorId) || this.partyActorIds.has(event.targetId)) return;
    const buffs = this.buffs.getActiveStatuses(event.actorId, atMs);
    for (const [statusId, definition] of this.statuses) {
      for (const sourceId of definition.appliedBy ?? []) {
        const coating = buffs.find((buff) => buff.statusId === sourceId);
        if (sourceId !== event.sourceId && !coating) continue;
        const level = this.levels.get(event.actorId)?.get(sourceId);
        const effects = definition.effects.filter((effect) => effect.id === sourceId);
        // Do not silently pick one of several possible application configurations.
        const effect = effects.length === 1 ? effects[0] : undefined;
        let stacks = Number.NaN;
        let expiresAtMs = Number.NaN;
        if (effect && (level !== undefined || ((definition.fixedDuration || effect.durationPerLevel === 0) && effect.stacksPerLevel === 0))) {
          const duration = effect.duration + (definition.fixedDuration ? 0 : (level ?? 0) * effect.durationPerLevel);
          stacks = Math.max(1, effect.stacks + (level ?? 0) * effect.stacksPerLevel);
          if (duration > 0 && Number.isFinite(duration)) expiresAtMs = atMs + duration * 1_000;
        }
        // Unknown candidates still participate in reconciliation, preventing false sole-applier credit.
        this.recentApplications.push({ atMs, actorId: event.actorId, targetId: event.targetId, statusId, stacks, expiresAtMs });
      }
    }
  }

  private consumeStatus(event: FishNetCombatStatusEvent, atMs: number): void {
    if (this.partyActorIds.has(event.actorId) || !this.statuses.has(event.statusId)) return;
    // Owner feeds lacking counts cannot corroborate or replace the observer's stack ledger.
    const stacks = event.action === "removed" ? 0 : event.stacks;
    if (stacks === undefined || !Number.isInteger(stacks) || stacks < 0) return;
    const key = episodeKey(event.actorId, event.statusId);
    const previous = this.episodes.get(key);
    const candidates: Candidate[] = [];
    this.recentApplications = this.recentApplications.filter((candidate) => {
      if (candidate.targetId !== event.actorId || candidate.statusId !== event.statusId) return true;
      candidates.push(candidate);
      return false; // Every snapshot closes its application interval, including zero/removal/unchanged.
    });
    const episode = previous ?? { lastSnapshotAtMs: atMs, batches: [] };
    this.episodes.set(key, episode);
    episode.lastSnapshotAtMs = atMs;
    if (stacks === 0) {
      episode.batches = [];
      return;
    }
    const liveTotal = episode.batches.reduce((sum, batch) => sum + batch.stacks, 0);
    const added = stacks - liveTotal;
    const candidateTotal = candidates.reduce((sum, candidate) => sum + candidate.stacks, 0);
    const complete = candidates.length > 0 && candidates.every((candidate) =>
      Number.isInteger(candidate.stacks) && candidate.stacks > 0 && candidate.expiresAtMs > atMs);
    if (previous && added > 0 && complete && candidateTotal === added) {
      for (const candidate of candidates) {
        episode.batches.push({ actorId: candidate.actorId, stacks: candidate.stacks, expiresAtMs: candidate.expiresAtMs });
      }
    } else if (added < 0 || (candidates.length > 0 && event.maxStacks !== undefined
      && event.maxStacks > 0 && stacks >= event.maxStacks)) {
      // Unexpected losses or a saturated cap obscure which applications survived. Never
      // proportionally shrink ownership or assume the oldest/newest applier retained credit.
      const expiresAtMs = this.unknownExpiry(event, atMs, [...episode.batches, ...candidates]);
      episode.batches = [{ stacks, expiresAtMs }];
    } else if (added > 0) {
      episode.batches.push({ stacks: added, expiresAtMs: this.unknownExpiry(event, atMs, candidates) });
    }
  }

  private unknownExpiry(event: FishNetCombatStatusEvent, atMs: number, batches: readonly StackBatch[]): number {
    const deadlines = batches.map((batch) => batch.expiresAtMs).filter((deadline) => Number.isFinite(deadline) && deadline > atMs);
    if (event.remainingSeconds !== undefined && Number.isFinite(event.remainingSeconds) && event.remainingSeconds > 0) {
      deadlines.push(atMs + event.remainingSeconds * 1_000);
    }
    // This is an uncertainty timeout, not an inferred application duration.
    return deadlines.length > 0 ? Math.max(...deadlines) : atMs + EPISODE_IDLE_TIMEOUT_MS;
  }

  private dropTarget(targetId: number): void {
    const prefix = `${targetId}:`;
    for (const key of this.episodes.keys()) if (key.startsWith(prefix)) this.episodes.delete(key);
    this.recentApplications = this.recentApplications.filter((candidate) => candidate.targetId !== targetId);
  }
}

function episodeKey(targetId: number, statusId: string): string {
  return `${targetId}:${statusId}`;
}
