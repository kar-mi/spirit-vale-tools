import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
import { DamageReducer, isPositiveHit } from "./reducers/damage.ts";
import type { EncounterAggregate } from "./reducers/damage.ts";
import { renderEncounter } from "./reducers/rows.ts";
import type { FishNetDpsEncounterSnapshot } from "./dps-meter.ts";

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
}

export interface CombatEncounterRecord {
  dps: FishNetDpsEncounterSnapshot;
  tps: MeterEncounterSnapshot;
  hps: MeterEncounterSnapshot;
}

export interface LiveCombatOptions {
  currentWindowMs?: number;
  timelinePoints?: number;
  retainedFinishedEncounters?: number;
  idleGapMs?: number;
  minimumDurationMs?: number;
  onEncounterFinished?: (encounter: CombatEncounterRecord) => void | Promise<void>;
}

export interface LiveCombatState {
  revision: number;
  current?: CombatEncounterRecord;
  latestFinished?: CombatEncounterRecord;
}

interface MeterAggregate {
  amount: number;
  hits: number;
  firstAtMs?: number;
  lastAtMs?: number;
  actorIds: Set<number>;
}

interface MeterState {
  id: string;
  startedAtMs: number;
  lastEventAtMs: number;
  tps: Map<string, MeterAggregate>;
  hps: Map<string, MeterAggregate>;
}

/**
 * Bounded live combat state for overlays and other polling consumers.
 *
 * The reducer owns encounter boundaries and bounded DPS buckets. This service only retains the
 * current meter and the most recently completed one; it never stores raw damage or old encounters.
 */
export class LiveCombatService {
  private readonly reducer: DamageReducer;
  private readonly currentWindowMs: number;
  private readonly minimumDurationMs: number;
  private readonly retainedFinishedEncounters: number;
  private readonly onEncounterFinished?: LiveCombatOptions["onEncounterFinished"];
  private meter?: MeterState;
  private latestFinished?: CombatEncounterRecord;
  private revision = 0;

  constructor(options: LiveCombatOptions = {}) {
    this.currentWindowMs = positive(options.currentWindowMs ?? 5_000, "currentWindowMs");
    this.minimumDurationMs = positive(options.minimumDurationMs ?? 1_000, "minimumDurationMs");
    this.retainedFinishedEncounters = integerAtLeast(
      options.retainedFinishedEncounters ?? 1,
      "retainedFinishedEncounters",
    );
    const timelinePoints = positiveInteger(options.timelinePoints ?? 720, "timelinePoints");
    this.onEncounterFinished = options.onEncounterFinished;
    this.reducer = new DamageReducer({
      idleGapMs: options.idleGapMs,
      currentWindowMs: this.currentWindowMs,
      maxTimelineBuckets: timelinePoints,
      onEncounterFinished: (encounter) => this.finishMeter(encounter),
    });
  }

  consumeIdentity(event: FishNetActorIdentityEvent, observedAtMs: number): void {
    this.reducer.consumeIdentity(event, observedAtMs);
    this.revision += 1;
  }

  consumeCombat(event: FishNetCombatEvent, observedAtMs: number): void {
    const recordsBeforeReducer = isMeterOnlyEvent(event) && this.reducer.current !== undefined && this.meter !== undefined;
    if (recordsBeforeReducer) this.recordMeterEvent(event, observedAtMs);
    this.reducer.consumeCombat(event, observedAtMs);
    const encounter = this.reducer.current;
    if (encounter) {
      this.ensureMeter(encounter);
      if (!recordsBeforeReducer) this.recordMeterEvent(event, observedAtMs);
    }
    this.revision += 1;
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
    const current = this.reducer.current && this.meter
      ? this.renderRecord(this.reducer.current, this.meter, nowMs)
      : undefined;
    return {
      revision: this.revision,
      ...(current ? { current } : {}),
      ...(this.latestFinished ? { latestFinished: this.latestFinished } : {}),
    };
  }

  private ensureMeter(encounter: EncounterAggregate): MeterState {
    if (this.meter?.id === encounter.id) return this.meter;
    this.meter = {
      id: encounter.id,
      startedAtMs: encounter.startedAtMs,
      lastEventAtMs: encounter.startedAtMs,
      tps: new Map(),
      hps: new Map(),
    };
    return this.meter;
  }

  private recordMeterEvent(event: FishNetCombatEvent, observedAtMs: number): void {
    const meter = this.meter;
    if (!meter) return;
    if (event.kind === "damage" || event.kind === "death") {
      if (!isPositiveHit(event)) return;
      // Team zero is outgoing party damage; all other positive hits are incoming damage.
      if (event.team !== 0 && event.actorId !== event.targetId) {
        const identity = this.reducer.identities.get(event.targetId);
        this.add(meter.tps, identity?.displayName ?? "Unidentified", event.value, observedAtMs, event.targetId);
        meter.lastEventAtMs = observedAtMs;
      }
      return;
    }
    if (event.kind !== "heal" || event.value <= 0 || !Number.isFinite(event.value)) return;
    const actorId = event.actorId;
    const identity = actorId === undefined ? undefined : this.reducer.identities.get(actorId);
    this.add(meter.hps, identity?.displayName ?? "Unattributed", event.value, observedAtMs, actorId);
    meter.lastEventAtMs = observedAtMs;
  }

  private add(map: Map<string, MeterAggregate>, name: string, amount: number, atMs: number, actorId?: number): void {
    const row = map.get(name) ?? { amount: 0, hits: 0, actorIds: new Set<number>() };
    row.amount += amount;
    row.hits += 1;
    row.firstAtMs = row.firstAtMs === undefined ? atMs : Math.min(row.firstAtMs, atMs);
    row.lastAtMs = row.lastAtMs === undefined ? atMs : Math.max(row.lastAtMs, atMs);
    if (actorId !== undefined) row.actorIds.add(actorId);
    map.set(name, row);
  }

  private finishMeter(encounter: EncounterAggregate): void {
    const meter = this.meter ?? {
      id: encounter.id,
      startedAtMs: encounter.startedAtMs,
      lastEventAtMs: encounter.lastDamageAtMs,
      tps: new Map(),
      hps: new Map(),
    };
    const record = this.renderRecord(encounter, meter, encounter.endedAtMs);
    this.meter = undefined;
    if (this.retainedFinishedEncounters > 0) this.latestFinished = record;
    this.revision += 1;
    const callback = this.onEncounterFinished;
    if (callback) void Promise.resolve(callback(record));
  }

  private renderRecord(encounter: EncounterAggregate, meter: MeterState, nowMs?: number): CombatEncounterRecord {
    const atMs = Math.max(nowMs ?? meter.lastEventAtMs, encounter.lastDamageAtMs);
    return {
      dps: renderEncounter(encounter, {
        nowMs: atMs,
        currentWindowMs: this.currentWindowMs,
        minimumDurationMs: this.minimumDurationMs,
      }),
      tps: renderMeter(meter, meter.tps, atMs, this.minimumDurationMs, encounter.endedAtMs),
      hps: renderMeter(meter, meter.hps, atMs, this.minimumDurationMs, encounter.endedAtMs),
    };
  }
}

function isMeterOnlyEvent(event: FishNetCombatEvent): boolean {
  if (event.kind === "heal") return true;
  return (event.kind === "damage" || event.kind === "death") && event.team !== 0;
}

function renderMeter(
  meter: MeterState,
  values: Map<string, MeterAggregate>,
  nowMs: number,
  minimumDurationMs: number,
  endedAtMs?: number,
): MeterEncounterSnapshot {
  const end = endedAtMs ?? nowMs;
  const durationMs = Math.max(minimumDurationMs, end - meter.startedAtMs);
  const rows = [...values.entries()]
    .map(([displayName, value]): MeterRow => ({
      displayName,
      actorIds: [...value.actorIds],
      amount: value.amount,
      rate: perSecond(value.amount, durationMs),
      hits: value.hits,
      ...(value.firstAtMs === undefined ? {} : { firstAtMs: value.firstAtMs }),
      ...(value.lastAtMs === undefined ? {} : { lastAtMs: value.lastAtMs }),
    }))
    .sort((left, right) => right.amount - left.amount || left.displayName.localeCompare(right.displayName));
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  return {
    id: meter.id,
    startedAtMs: meter.startedAtMs,
    lastEventAtMs: meter.lastEventAtMs,
    ...(endedAtMs === undefined ? {} : { endedAtMs }),
    durationMs,
    total,
    rate: perSecond(total, durationMs),
    rows,
  };
}

function perSecond(amount: number, durationMs: number): number {
  return durationMs <= 0 ? 0 : amount / (durationMs / 1_000);
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
