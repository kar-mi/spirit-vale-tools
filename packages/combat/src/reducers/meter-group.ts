import type { FishNetActorIdentityEvent } from "../tracking/actor-directory.ts";
import type { FishNetCombatEvent } from "../events/combat-events.ts";
import type { CombatIdentity, EncounterAggregate } from "./damage.ts";
import { MeterReducer } from "./meter.ts";
import type { MeterKind } from "./meter.ts";

export interface MeterReducerGroupOptions {
  currentTauSeconds?: number;
  maxTimelineBuckets?: number;
}

/** Keeps the tanked and healing projections on the damage reducer's encounter lifecycle. */
export class MeterReducerGroup {
  private readonly reducers: Record<MeterKind, MeterReducer>;

  constructor(options: MeterReducerGroupOptions = {}) {
    const shared = {
      ...(options.currentTauSeconds === undefined ? {} : { currentTauSeconds: options.currentTauSeconds }),
      ...(options.maxTimelineBuckets === undefined ? {} : { maxTimelineBuckets: options.maxTimelineBuckets }),
    };
    this.reducers = {
      tanked: new MeterReducer({ kind: "tanked", ...shared }),
      healing: new MeterReducer({ kind: "healing", ...shared }),
    };
  }

  current(kind: MeterKind): EncounterAggregate | undefined {
    return this.reducers[kind].current;
  }

  consumeIdentity(event: FishNetActorIdentityEvent): void {
    for (const reducer of Object.values(this.reducers)) reducer.consumeIdentity(event);
  }

  consumeCombat(
    encounter: EncounterAggregate | undefined,
    event: FishNetCombatEvent,
    observedAtMs: number,
    identities: ReadonlyMap<number, CombatIdentity>,
    mobIdentities?: ReadonlyMap<number, string>,
  ): void {
    if (!encounter) return;
    for (const reducer of Object.values(this.reducers)) {
      if (reducer.current?.id !== encounter.id) reducer.begin(encounter.id, encounter.startedAtMs);
      reducer.consumeCombat(event, observedAtMs, identities, mobIdentities);
    }
  }

  resume(kind: MeterKind, encounter: EncounterAggregate): void {
    this.reducers[kind].resume(encounter);
  }

  snapshot(): Map<MeterKind, EncounterAggregate> {
    const result = new Map<MeterKind, EncounterAggregate>();
    for (const kind of ["tanked", "healing"] as const) {
      const current = this.reducers[kind].current;
      if (current) result.set(kind, current);
    }
    return result;
  }

  finish(endedAtMs: number): Map<MeterKind, EncounterAggregate> {
    const result = this.snapshot();
    for (const reducer of Object.values(this.reducers)) reducer.finish(endedAtMs);
    return result;
  }

  reset(): void {
    for (const reducer of Object.values(this.reducers)) reducer.reset();
  }
}
