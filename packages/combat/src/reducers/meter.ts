import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import { DEFAULT_CURRENT_TAU_SECONDS, createActor, isPositiveHit, positiveTau, recordHit } from "./damage.ts";
import type { CombatIdentity, EncounterAggregate } from "./damage.ts";

/** Which side of an encounter a meter measures. */
export type MeterKind = "tanked" | "healing";

export interface MeterReducerOptions {
  kind: MeterKind;
  /** Decay constant for the meter's current rate. Defaults to {@link DEFAULT_CURRENT_TAU_SECONDS}. */
  currentTauSeconds?: number;
  maxTimelineBuckets?: number;
}

export class MeterReducer {
  readonly kind: MeterKind;
  current?: EncounterAggregate;
  private readonly currentTauSeconds: number;
  private readonly maxTimelineBuckets: number;

  constructor(options: MeterReducerOptions) {
    this.kind = options.kind;
    this.currentTauSeconds = positiveTau(options.currentTauSeconds ?? DEFAULT_CURRENT_TAU_SECONDS);
    this.maxTimelineBuckets = options.maxTimelineBuckets ?? Number.POSITIVE_INFINITY;
  }

  /** Starts the meter's own aggregate for an encounter the damage reducer has opened. */
  begin(id: string, startedAtMs: number): EncounterAggregate {
    this.current = {
      id,
      startedAtMs,
      lastDamageAtMs: startedAtMs,
      actors: [],
      activeActors: new Map(),
      enemyFirstSeenAtMs: new Map(),
      enemyNames: new Map(),
      deaths: [],
    };
    return this.current;
  }

  /** Adopts an aggregate left open by an earlier indexing pass. */
  resume(encounter: EncounterAggregate): void {
    this.current = encounter;
  }

  finish(endedAtMs: number): EncounterAggregate | undefined {
    const encounter = this.current;
    if (!encounter) return undefined;
    encounter.endedAtMs = Math.max(endedAtMs, encounter.lastDamageAtMs);
    this.current = undefined;
    return encounter;
  }

  reset(): void {
    this.current = undefined;
  }

  /** Keeps a display name current on a row that is already accumulating. */
  consumeIdentity(event: FishNetActorIdentityEvent): void {
    if (!this.current || event.operation !== "upsert") return;
    const actor = this.current.activeActors.get(event.actorId);
    if (!actor) return;
    actor.displayName = event.displayName;
    if (event.archetype !== undefined) actor.archetype = event.archetype;
    actor.activeIdentity = true;
  }

  consumeCombat(
    event: FishNetCombatEvent,
    observedAtMs: number,
    identities: ReadonlyMap<number, CombatIdentity>,
  ): void {
    if (!this.current) return;
    const hit = this.kind === "tanked" ? tankedHit(event, identities) : healingHit(event, identities);
    if (!hit) return;
    this.apply(hit, observedAtMs);
  }

  private apply(hit: MeterHit, observedAtMs: number): void {
    const encounter = this.current!;
    encounter.lastDamageAtMs = Math.max(encounter.lastDamageAtMs, observedAtMs);

    let actor = encounter.activeActors.get(hit.actorId);
    if (!actor) {
      actor = createActor(hit.actorId, encounter.startedAtMs, this.currentTauSeconds);
      encounter.actors.push(actor);
      encounter.activeActors.set(hit.actorId, actor);
    }
    if (hit.identity) {
      actor.displayName = hit.identity.displayName;
      if (hit.identity.archetype !== undefined) actor.archetype = hit.identity.archetype;
      actor.activeIdentity = true;
    }

    recordHit(actor, { ...hit, atMs: observedAtMs }, this.maxTimelineBuckets);
    // `mobsHit` renders as the count of these: attackers for tanked damage, recipients for healing.
    if (hit.counterpartId !== undefined) actor.targetIds.add(hit.counterpartId);
  }
}

interface MeterHit {
  /** The row this hit belongs to: the victim for tanked damage, the healer for healing. */
  actorId: number;
  identity?: CombatIdentity;
  /** The other party to the hit, counted as this row's `mobsHit`. */
  counterpartId?: number;
  value: number;
  sourceId: string;
  sourceLabel: string;
  critical: boolean;
}

/** Incoming damage, credited to the party member who took it. */
function tankedHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind !== "damage" && event.kind !== "death") return undefined;
  // Team zero is the party's outgoing damage, which the DPS meter owns.
  const identity = identities.get(event.targetId);
  const reflected = event.team === 0 && event.actorId === event.targetId;
  const incoming = event.team !== 0 && event.actorId !== event.targetId;
  if (!identity && !reflected && !incoming) return undefined;
  if (!isPositiveHit(event)) return undefined;
  return {
    actorId: event.targetId,
    ...(identity === undefined ? {} : { identity }),
    counterpartId: event.actorId,
    value: event.value,
    sourceId: event.sourceId,
    sourceLabel: event.sourceLabel,
    critical: event.hitResult === "critical",
  };
}

/** Restored health, credited to the healer. */
function healingHit(
  event: FishNetCombatEvent,
  identities: ReadonlyMap<number, CombatIdentity>,
): MeterHit | undefined {
  if (event.kind !== "heal") return undefined;
  if (!Number.isFinite(event.value) || event.value <= 0) return undefined;
  const healerId = event.actorId ?? event.targetId;
  const identity = identities.get(healerId);
  if (!identity) return undefined;
  return {
    actorId: healerId,
    identity,
    counterpartId: event.targetId,
    value: event.value,
    sourceId: event.sourceId ?? "heal",
    sourceLabel: event.sourceLabel ?? "Healing",
    critical: false,
  };
}
