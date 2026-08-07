import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
import { DEFAULT_CURRENT_TAU_SECONDS, DamageReducer } from "./reducers/damage.ts";
import type { EncounterAggregate } from "./reducers/damage.ts";
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
  /**
   * The same encounter rendered with the detail the DPS snapshot carries: per-skill rows, timeline
   * buckets, crit rates, contribution shares and the personal row. {@link rows} is a flat projection
   * of `detail.actors`, not a second copy of the underlying data.
   */
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

/**
 * Bounded live combat state for overlays and other polling consumers.
 *
 * The reducer owns encounter boundaries and bounded DPS buckets. This service only retains the
 * current meter and the most recently completed one; it never stores raw damage or old encounters.
 */
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
  /**
   * The finished encounter is retained as aggregates rather than a rendered record, so changing the
   * personal actor re-renders it too. Those aggregates are the same bounded state the live encounter
   * holds - bucket series and per-skill totals, never individual hits.
   */
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
    this.reducer.consumeIdentity(event, observedAtMs);
    this.tanked.consumeIdentity(event);
    this.healing.consumeIdentity(event);
    this.revision += 1;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    // The reducer owns encounter boundaries, so it runs first: it may close an encounter that has
    // gone idle, and an incoming hit or heal arriving after that cutoff belongs to no encounter at
    // all rather than to the one that just ended.
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

  advance(observedAtMs: number): void {
    this.reducer.advance(observedAtMs);
    this.revision += 1;
  }

  reset(observedAtMs: number): void {
    this.reducer.reset(observedAtMs);
    this.revision += 1;
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
    this.tanked.consumeCombat(event, observedAtMs, identities);
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
        // Tanked and healing rates are per second *of the encounter*, not per second of the span
        // that happened to contain incoming hits, so they stay comparable with the DPS figure.
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
    enemies: new Map(),
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

/**
 * Renders a meter aggregate once, then exposes it two ways: `detail` is the full snapshot, and
 * `rows` is the flat per-actor projection of it that a compact meter needs.
 */
function renderMeter(aggregate: EncounterAggregate, options: RenderMeterOptions): MeterEncounterSnapshot {
  // Widening the aggregate's last-damage time to the encounter window is what makes every rate in
  // the snapshot — party and per actor — divide by the encounter's duration.
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
  // Rendered rows merge actors by identity, so a row's first event is the earliest across the
  // aggregates it merged.
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
