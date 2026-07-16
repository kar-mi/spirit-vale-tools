import { open, stat } from "node:fs/promises";

import type { FishNetActorIdentityEvent } from "../fishnet/actor-directory.ts";
import type { FishNetCombatEvent } from "../fishnet/combat-tracker.ts";
import { parseDpsLogEvent } from "./replay.ts";

export interface TimedDpsLogEvent {
  event: FishNetActorIdentityEvent | FishNetCombatEvent;
  observedAtMs: number;
}

export interface DpsLogBatch {
  events: TimedDpsLogEvent[];
  invalidLines: number;
  missing: boolean;
  reset: boolean;
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
      const event = parseDpsLogEvent(candidate);
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

function decoderFor(firstChunk: Uint8Array): TextDecoder {
  if (firstChunk[0] === 0xff && firstChunk[1] === 0xfe) return new TextDecoder("utf-16le");
  if (firstChunk[0] === 0xfe && firstChunk[1] === 0xff) return new TextDecoder("utf-16be");
  return new TextDecoder("utf-8");
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
