import { JsonlTailReader, LiveLogSessionFollower, parseLogRecord } from "@spiritvale/logging";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
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
  path?: string;
  sessionId?: string;
}

/** Incrementally reads an actively-written combat JSON Lines file. */
export class DpsLogFollower {
  private readonly reader: JsonlTailReader;
  private recordedAtOriginMs?: number;
  private lastObservedAtMs = 0;
  private originTick?: number;
  private lastTick?: number;

  constructor(path: string, private readonly ticksPerSecond = 30) {
    this.reader = new JsonlTailReader(path, { createDecoder: decoderFor });
  }

  async poll(): Promise<DpsLogBatch> {
    const { missing, reset, lines } = await this.reader.read();
    if (missing) return { events: [], invalidLines: 0, missing: true, reset: false };
    if (reset) this.resetState();
    return { ...this.consume(lines), missing: false, reset };
  }

  private consume(lines: string[]): Pick<DpsLogBatch, "events" | "invalidLines"> {
    const events: TimedDpsLogEvent[] = [];
    let invalidLines = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      let candidate: unknown;
      try {
        candidate = JSON.parse(line);
      } catch {
        invalidLines += 1;
        continue;
      }
      const record = parseLogRecord(candidate);
      if (!record) {
        invalidLines += 1;
        continue;
      }
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
    this.recordedAtOriginMs = undefined;
    this.lastObservedAtMs = 0;
    this.originTick = undefined;
    this.lastTick = undefined;
  }
}

/** Follows whichever combat session is named by the shared current-stream pointer. */
export class DpsSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<DpsLogFollower, DpsLogBatch>;

  constructor(logDirectory?: string, ticksPerSecond = 30) {
    this.inner = new LiveLogSessionFollower({
      stream: "combat",
      logDirectory,
      createFollower: (path) => new DpsLogFollower(path, ticksPerSecond),
      mergeSessionChange: (batch, changedSession) => ({ ...batch, reset: batch.reset || changedSession }),
      noStreamBatch: (reset) => ({ events: [], invalidLines: 0, missing: true, reset }),
    });
  }

  poll(): Promise<DpsLogBatch> {
    return this.inner.poll();
  }
}

function decoderFor(firstChunk: Uint8Array): TextDecoder {
  if (firstChunk[0] === 0xff && firstChunk[1] === 0xfe) return new TextDecoder("utf-16le");
  if (firstChunk[0] === 0xfe && firstChunk[1] === 0xff) return new TextDecoder("utf-16be");
  return new TextDecoder("utf-8");
}
