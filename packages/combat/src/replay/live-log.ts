import {
  DEFAULT_STREAM_BATCH_BYTES,
  decoderForText,
  JsonlTailReader,
  LogRecordLineDecoder,
  LiveLogSessionFollower,
} from "@kar-mi/spirit-vale-tools-logging";
import type { JsonlTailReadResult, LiveLogSessionFollowerOptions } from "@kar-mi/spirit-vale-tools-logging";
import type { FishNetActorIdentityEvent } from "../tracking/actor-directory.ts";
import type { FishNetCombatEvent } from "../events/combat-events.ts";
import { parseDpsLogRecord } from "./replay.ts";

export interface TimedDpsLogEvent {
  event: FishNetActorIdentityEvent | FishNetCombatEvent;
  observedAtMs: number;
}
export interface DpsLogBatch {
  events: TimedDpsLogEvent[];
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  /** Whether this batch carries anything a consumer has to act on. */
  changed: boolean;
  /** Bumped once per changed batch, so a consumer can skip re-projecting on an unchanged one. */
  revision: number;
  path?: string;
  sessionId?: string;
}

/** Incrementally reads an actively-written combat JSON Lines file. */
export class DpsLogFollower {
  private readonly reader: JsonlTailReader;
  private readonly records = new LogRecordLineDecoder();
  private recordedAtOriginMs?: number;
  private lastObservedAtMs = 0;
  private originTick?: number;
  private lastTick?: number;
  private revision = 0;

  constructor(path: string, private readonly ticksPerSecond = 30) {
    this.reader = new JsonlTailReader(path, { createDecoder: decoderForText, maxReadBytes: DEFAULT_STREAM_BATCH_BYTES });
  }

  async poll(): Promise<DpsLogBatch> {
    return this.consumeRead(await this.reader.read());
  }

  consumeRead({ missing, reset, lines }: JsonlTailReadResult): DpsLogBatch {
    if (missing) {
      return { events: [], invalidLines: 0, missing: true, reset: false, changed: false, revision: this.revision };
    }
    if (reset) this.resetState();
    const consumed = this.consume(lines);
    const changed = reset || consumed.events.length > 0;
    if (changed) this.revision += 1;
    return { ...consumed, missing: false, reset, changed, revision: this.revision };
  }

  private consume(lines: string[]): Pick<DpsLogBatch, "events" | "invalidLines"> {
    const events: TimedDpsLogEvent[] = [];
    let invalidLines = 0;
    for (const line of lines) {
      const decoded = this.records.decode(line);
      if (decoded.kind === "empty" || decoded.kind === "header") continue;
      if (decoded.kind === "invalid") {
        invalidLines += 1;
        continue;
      }
      const record = decoded.record;
      const event = parseDpsLogRecord(record.type, record.data);
      if (event === null) continue;
      if (!event) {
        invalidLines += 1;
        continue;
      }
      const observedAtMs = this.observedAt(record.recordedAt, event.tick);
      events.push({ event, observedAtMs });
    }
    return { events, invalidLines };
  }

  private observedAt(recordedAt: string, tick: number): number {
    const recordedAtMs = Date.parse(recordedAt);
    if (Number.isFinite(recordedAtMs)) {
      this.recordedAtOriginMs ??= recordedAtMs;
      this.lastObservedAtMs = Math.max(this.lastObservedAtMs, recordedAtMs - this.recordedAtOriginMs);
      return this.lastObservedAtMs;
    }

    if (this.lastTick !== undefined && tick < this.lastTick) this.originTick = undefined;
    this.originTick ??= tick;
    this.lastTick = tick;
    this.lastObservedAtMs = Math.max(
      this.lastObservedAtMs,
      ((tick - this.originTick) * 1_000) / this.ticksPerSecond,
    );
    return this.lastObservedAtMs;
  }

  private resetState(): void {
    this.records.reset();
    this.recordedAtOriginMs = undefined;
    this.lastObservedAtMs = 0;
    this.originTick = undefined;
    this.lastTick = undefined;
  }
}

export type DpsSessionLogFollowerOptions =
  Pick<LiveLogSessionFollowerOptions<DpsLogFollower, DpsLogBatch>, "fallbackPollMs" | "debounceMs" | "persistent">
  & { ticksPerSecond?: number };

/** Follows whichever combat session is named by the shared current-stream pointer. */
export class DpsSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<DpsLogFollower, DpsLogBatch>;

  constructor(logDirectory?: string, options: DpsSessionLogFollowerOptions = {}) {
    const { ticksPerSecond = 30, ...tuning } = options;
    this.inner = new LiveLogSessionFollower({
      stream: "combat",
      ...(logDirectory === undefined ? {} : { logDirectory }),
      ...tuning,
      readerOptions: { createDecoder: decoderForText, maxReadBytes: DEFAULT_STREAM_BATCH_BYTES },
      createFollower: (path) => new DpsLogFollower(path, ticksPerSecond),
      mergeSessionChange: (batch, changedSession) => ({
        ...batch,
        reset: batch.reset || changedSession,
        changed: batch.changed || changedSession,
      }),
      noStreamBatch: (reset) => ({ events: [], invalidLines: 0, missing: true, reset, changed: reset, revision: 0 }),
    });
  }

  /** Follows the stream without polling: the returned follower wakes on a watcher event and yields only batches that carry something. */
  static watch(logDirectory?: string, options: DpsSessionLogFollowerOptions = {}): DpsSessionLogFollower {
    return new DpsSessionLogFollower(logDirectory, options);
  }

  poll(): Promise<DpsLogBatch> {
    return this.inner.poll();
  }

  next(): Promise<DpsLogBatch> {
    return this.inner.next();
  }

  [Symbol.asyncIterator](): AsyncIterator<DpsLogBatch> {
    return this.inner[Symbol.asyncIterator]();
  }

  close(): void {
    this.inner.close();
  }
}
