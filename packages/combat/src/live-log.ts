import { open, stat } from "node:fs/promises";

import { defaultLogDirectory, parseLogRecord, readCurrentLogStream } from "@spiritvale/logging";
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
  private offset = 0;
  private pending = "";
  private decoder?: TextDecoder;
  private originTick?: number;
  private lastTick?: number;

  constructor(private readonly path: string, private readonly ticksPerSecond = 30) {}

  async poll(): Promise<DpsLogBatch> {
    let size: number;
    try {
      size = (await stat(this.path)).size;
    } catch (error) {
      if (isMissingFile(error)) return { events: [], invalidLines: 0, missing: true, reset: false };
      throw error;
    }

    const reset = size < this.offset;
    if (reset) this.resetReader();
    if (size === this.offset) return { events: [], invalidLines: 0, missing: false, reset };

    const length = size - this.offset;
    const bytes = Buffer.allocUnsafe(length);
    const file = await open(this.path, "r");
    try {
      const { bytesRead } = await file.read(bytes, 0, length, this.offset);
      this.offset += bytesRead;
      return { ...this.consume(bytes.subarray(0, bytesRead)), missing: false, reset };
    } finally {
      await file.close();
    }
  }

  private consume(bytes: Uint8Array): Pick<DpsLogBatch, "events" | "invalidLines"> {
    this.decoder ??= decoderFor(bytes);
    this.pending += this.decoder.decode(bytes, { stream: true });
    const lines = this.pending.split(/\r?\n/);
    this.pending = lines.pop() ?? "";
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
      if (this.lastTick !== undefined && event.tick < this.lastTick) this.originTick = undefined;
      this.originTick ??= event.tick;
      this.lastTick = event.tick;
      const observedAtMs = ((event.tick - this.originTick) * 1_000) / this.ticksPerSecond;
      events.push({ event, observedAtMs });
      if (event.kind === "actorIdentity" && event.operation === "reset") {
        this.originTick = undefined;
        this.lastTick = undefined;
      }
    }
    return { events, invalidLines };
  }

  private resetReader(): void {
    this.offset = 0;
    this.pending = "";
    this.decoder = undefined;
    this.originTick = undefined;
    this.lastTick = undefined;
  }
}

/** Follows whichever combat session is named by the shared current-stream pointer. */
export class DpsSessionLogFollower {
  private sessionId?: string;
  private follower?: DpsLogFollower;

  constructor(private readonly logDirectory = defaultLogDirectory(), private readonly ticksPerSecond = 30) {}

  async poll(): Promise<DpsLogBatch> {
    const current = await readCurrentLogStream("combat", this.logDirectory);
    if (!current) {
      const reset = this.follower !== undefined;
      this.follower = undefined;
      this.sessionId = undefined;
      return { events: [], invalidLines: 0, missing: true, reset };
    }
    const changed = current.sessionId !== this.sessionId;
    if (changed) {
      this.sessionId = current.sessionId;
      this.follower = new DpsLogFollower(current.path, this.ticksPerSecond);
    }
    const batch = await this.follower!.poll();
    return { ...batch, reset: batch.reset || changed, path: current.path, sessionId: current.sessionId };
  }
}

function decoderFor(firstChunk: Uint8Array): TextDecoder {
  if (firstChunk[0] === 0xff && firstChunk[1] === 0xfe) return new TextDecoder("utf-16le");
  if (firstChunk[0] === 0xfe && firstChunk[1] === 0xff) return new TextDecoder("utf-16be");
  return new TextDecoder("utf-8");
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
