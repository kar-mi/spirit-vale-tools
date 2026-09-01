import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
import { DEFAULT_CURRENT_TAU_SECONDS, DamageReducer } from "./reducers/damage.ts";
import type { CombatIdentity, EncounterAggregate } from "./reducers/damage.ts";
import { MeterReducer } from "./reducers/meter.ts";
import { renderEncounter } from "./reducers/rows.ts";
import type { FishNetDpsEncounterSnapshot } from "./snapshot.ts";

export interface MeterRow {
  displayName: string;
  actorIds: number[];
  amount: number;
  rate: number;
  hits: number;
  firstAtMs?: number;
  lastAtMs?: number;
}

export interface MeterEncounterSnapshot {
  id: string;
  startedAtMs: number;
  lastEventAtMs: number;
  endedAtMs?: number;
  durationMs: number;
  total: number;
  rate: number;
  rows: MeterRow[];
  /** The same encounter rendered with the detail the DPS snapshot carries: per-skill rows, timeline buckets, crit rates, contribution shares and the personal row. */
  detail: FishNetDpsEncounterSnapshot;
}

export interface CombatEncounterRecord {
  dps: FishNetDpsEncounterSnapshot;
  tps: MeterEncounterSnapshot;
  hps: MeterEncounterSnapshot;
}

export interface LiveCombatOptions {
  /** Decay constant for every meter's current rate. Defaults to 2.5 seconds. */
  currentTauSeconds?: number;
  timelinePoints?: number;
  retainedFinishedEncounters?: number;
  idleGapMs?: number;
  minimumDurationMs?: number;
  /** Names the local player, so every meter can resolve its `personal` row. */
  personalName?: string;
  /** Selects the local player by actor id, overriding {@link personalName} when set. */
  personalActorId?: number;
  onEncounterFinished?: (encounter: CombatEncounterRecord) => void | Promise<void>;
}

export interface LiveCombatState {
  revision: number;
  current?: CombatEncounterRecord;
  latestFinished?: CombatEncounterRecord;
}

/** Bounded live combat state for overlays and other polling consumers. */
export class LiveCombatService {
  private readonly reducer: DamageReducer;
  private readonly currentTauSeconds: number;
  private readonly minimumDurationMs: number;
  private readonly retainedFinishedEncounters: number;
  private readonly onEncounterFinished?: LiveCombatOptions["onEncounterFinished"];
  private readonly tanked: MeterReducer;
  private readonly healing: MeterReducer;
  private meterId?: string;
  private lastEventAtMs?: number;
  /** The finished encounter is retained as aggregates rather than a rendered record, so changing the personal actor re-renders it too. */
  private latestFinished?: FinishedEncounter;
  private personalName: string;
  private personalActorId?: number;
  private revision = 0;

  constructor(options: LiveCombatOptions = {}) {
    this.currentTauSeconds = positive(options.currentTauSeconds ?? DEFAULT_CURRENT_TAU_SECONDS, "currentTauSeconds");
    this.minimumDurationMs = positive(options.minimumDurationMs ?? 1_000, "minimumDurationMs");
    this.retainedFinishedEncounters = integerAtLeast(
      options.retainedFinishedEncounters ?? 1,
      "retainedFinishedEncounters",
    );
    const timelinePoints = positiveInteger(options.timelinePoints ?? 720, "timelinePoints");
    this.personalName = options.personalName ?? "";
    this.personalActorId = options.personalActorId;
    this.onEncounterFinished = options.onEncounterFinished;
    this.reducer = new DamageReducer({
      idleGapMs: options.idleGapMs,
      currentTauSeconds: this.currentTauSeconds,
      maxTimelineBuckets: timelinePoints,
      onEncounterFinished: (encounter) => this.finishMeter(encounter),
    });
    this.tanked = new MeterReducer({ kind: "tanked", currentTauSeconds: this.currentTauSeconds, maxTimelineBuckets: timelinePoints });
    this.healing = new MeterReducer({ kind: "healing", currentTauSeconds: this.currentTauSeconds, maxTimelineBuckets: timelinePoints });
  }

  consumeIdentity(event: FishNetActorIdentityEvent, observedAtMs: number): void {
    // The observer feed re-states identities it has already sent, so most of these events leave the rendered state exactly as it was.
    const previous = event.operation === "reset" ? undefined : this.reducer.identities.get(event.actorId);
    const hadIdentities = this.reducer.identities.size > 0;
    this.reducer.consumeIdentity(event, observedAtMs);
    this.tanked.consumeIdentity(event);
    this.healing.consumeIdentity(event);
    if (this.identityChanged(event, previous, hadIdentities)) this.revision += 1;
  }

  private identityChanged(
    event: FishNetActorIdentityEvent,
    previous: CombatIdentity | undefined,
    hadIdentities: boolean,
  ): boolean {
    if (event.operation === "reset") return hadIdentities;
    if (event.operation === "remove") return previous !== undefined;
    const current = this.reducer.identities.get(event.actorId);
    if (!previous || !current) return true;
    return previous.displayName !== current.displayName
      || previous.archetype !== current.archetype
      || previous.ownerConnectionId !== current.ownerConnectionId
      || previous.uid !== current.uid;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    this.reducer.consumeCombat(event, observedAtMs);
    const encounter = this.reducer.current;
    if (encounter) {
      this.ensureMeter(encounter);
      this.recordMeterEvent(event, observedAtMs);
    }
    this.revision += 1;
  }

  setPersonalName(personalName: string): void {
    if (this.personalName === personalName) return;
    this.personalName = personalName;
    this.revision += 1;
  }

  setPersonalActorId(personalActorId: number | undefined): void {
    if (this.personalActorId === personalActorId) return;
    this.personalActorId = personalActorId;
    this.revision += 1;
  }

  getPersonalActorId(): number | undefined {
    return this.personalActorId;
  }

  /** Advances the idle clock. */
  advance(observedAtMs: number): void {
    this.reducer.advance(observedAtMs);
  }

  reset(observedAtMs: number): void {
    this.reducer.reset(observedAtMs);
  }

  getState(nowMs?: number): LiveCombatState {
    const current = this.reducer.current && this.meterId === this.reducer.current.id
      ? this.renderRecord(this.reducer.current, nowMs)
      : undefined;
    const latestFinished = this.latestFinished
      ? this.renderRecord(this.latestFinished.encounter, this.latestFinished.endedAtMs, this.latestFinished)
      : undefined;
    return {
      revision: this.revision,
      ...(current ? { current } : {}),
      ...(latestFinished ? { latestFinished } : {}),
    };
  }

  private ensureMeter(encounter: EncounterAggregate): void {
    if (this.meterId === encounter.id) return;
    this.meterId = encounter.id;
    this.lastEventAtMs = encounter.startedAtMs;
    this.tanked.begin(encounter.id, encounter.startedAtMs);
    this.healing.begin(encounter.id, encounter.startedAtMs);
  }

  private recordMeterEvent(event: FishNetCombatEvent, observedAtMs: number): void {
    if (this.meterId === undefined) return;
    const identities = this.reducer.identities;
    this.tanked.consumeCombat(event, observedAtMs, identities, this.reducer.mobIdentities);
    this.healing.consumeCombat(event, observedAtMs, identities);
    this.lastEventAtMs = Math.max(this.lastEventAtMs ?? observedAtMs, observedAtMs);
  }

  private finishMeter(encounter: EncounterAggregate): void {
    this.ensureMeter(encounter);
    const endedAtMs = encounter.endedAtMs ?? encounter.lastDamageAtMs;
    const finished: FinishedEncounter = {
      encounter,
      endedAtMs,
      lastEventAtMs: this.lastEventAtMs ?? encounter.lastDamageAtMs,
      ...(this.tanked.current === undefined ? {} : { tanked: this.tanked.current }),
      ...(this.healing.current === undefined ? {} : { healing: this.healing.current }),
    };
    const record = this.renderRecord(encounter, endedAtMs, finished);
    this.tanked.finish(endedAtMs);
    this.healing.finish(endedAtMs);
    this.meterId = undefined;
    this.lastEventAtMs = undefined;
    this.latestFinished = this.retainedFinishedEncounters > 0 ? finished : undefined;
    this.revision += 1;
    const callback = this.onEncounterFinished;
    if (callback) void Promise.resolve(callback(record));
  }

  private renderRecord(
    encounter: EncounterAggregate,
    nowMs?: number,
    finished?: FinishedEncounter,
  ): CombatEncounterRecord {
    const atMs = Math.max(
      nowMs ?? finished?.lastEventAtMs ?? this.lastEventAtMs ?? encounter.lastDamageAtMs,
      encounter.lastDamageAtMs,
    );
    const personal = {
      personalName: this.personalName,
      ...(this.personalActorId === undefined ? {} : { personalActorId: this.personalActorId }),
    };
    const render = (aggregate: EncounterAggregate | undefined): MeterEncounterSnapshot => renderMeter(
      aggregate ?? emptyAggregate(encounter),
      {
        nowMs: atMs,
        windowEndMs: encounter.endedAtMs ?? atMs,
        lastEventAtMs: finished?.lastEventAtMs ?? this.lastEventAtMs ?? encounter.lastDamageAtMs,
        minimumDurationMs: this.minimumDurationMs,
        ...personal,
        ...(encounter.endedAtMs === undefined ? {} : { endedAtMs: encounter.endedAtMs }),
      },
    );
    return {
      dps: renderEncounter(encounter, {
        nowMs: atMs,
        minimumDurationMs: this.minimumDurationMs,
        ...personal,
      }),
      tps: render(finished ? finished.tanked : this.tanked.current),
      hps: render(finished ? finished.healing : this.healing.current),
    };
  }
}

function emptyAggregate(encounter: EncounterAggregate): EncounterAggregate {
  return {
    id: encounter.id,
    startedAtMs: encounter.startedAtMs,
    lastDamageAtMs: encounter.startedAtMs,
    actors: [],
    activeActors: new Map(),
    enemyFirstSeenAtMs: new Map(),
    enemyNames: new Map(),
    deaths: [],
    ...(encounter.endedAtMs === undefined ? {} : { endedAtMs: encounter.endedAtMs }),
  };
}

interface FinishedEncounter {
  encounter: EncounterAggregate;
  tanked?: EncounterAggregate;
  healing?: EncounterAggregate;
  endedAtMs: number;
  lastEventAtMs: number;
}

interface RenderMeterOptions {
  nowMs: number;
  windowEndMs: number;
  lastEventAtMs: number;
  minimumDurationMs: number;
  personalName?: string;
  personalActorId?: number;
  endedAtMs?: number;
}

function renderMeter(aggregate: EncounterAggregate, options: RenderMeterOptions): MeterEncounterSnapshot {
  const windowed: EncounterAggregate = {
    ...aggregate,
    lastDamageAtMs: Math.max(aggregate.lastDamageAtMs, options.windowEndMs),
  };
  const detail = renderEncounter(windowed, {
    nowMs: options.nowMs,
    minimumDurationMs: options.minimumDurationMs,
    ...(options.personalName === undefined ? {} : { personalName: options.personalName }),
    ...(options.personalActorId === undefined ? {} : { personalActorId: options.personalActorId }),
  });
  // Rendered rows merge actors by identity, so a row's first event is the earliest across the aggregates it merged.
  const firstByActorId = new Map<number, number>();
  for (const actor of aggregate.actors) {
    if (actor.firstDamageAtMs !== undefined) firstByActorId.set(actor.actorId, actor.firstDamageAtMs);
  }
  const rows = detail.actors.map((actor): MeterRow => {
    const firstAtMs = actor.actorIds.reduce<number | undefined>((earliest, actorId) => {
      const candidate = firstByActorId.get(actorId);
      if (candidate === undefined) return earliest;
      return earliest === undefined ? candidate : Math.min(earliest, candidate);
    }, undefined);
    return {
      displayName: actor.displayName,
      actorIds: [...actor.actorIds],
      amount: actor.damage,
      rate: actor.dps,
      hits: actor.hits,
      ...(firstAtMs === undefined ? {} : { firstAtMs }),
      ...(actor.lastDamageAtMs === undefined ? {} : { lastAtMs: actor.lastDamageAtMs }),
    };
  });
  return {
    id: aggregate.id,
    startedAtMs: aggregate.startedAtMs,
    lastEventAtMs: options.lastEventAtMs,
    ...(options.endedAtMs === undefined ? {} : { endedAtMs: options.endedAtMs }),
    durationMs: detail.durationMs,
    total: detail.totalDamage,
    rate: detail.partyDps,
    rows,
    detail,
  };
}

function positive(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a positive finite number`);
  return value;
}

function integerAtLeast(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

function positiveInteger(value: number, name: string): number {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}
