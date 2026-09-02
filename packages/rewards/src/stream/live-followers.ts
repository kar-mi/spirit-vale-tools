import {
  DEFAULT_STREAM_BATCH_BYTES,
  JsonlTailReader,
  LogRecordLineDecoder,
  LiveLogSessionFollower,
} from "@kar-mi/spirit-vale-tools-logging";
import type {
  JsonlTailReadResult,
  LiveLogSessionFollowerOptions,
  LiveLogStatus,
} from "@kar-mi/spirit-vale-tools-logging";
import { LiveRewardService } from "../aggregation/live-rewards.ts";
import type { LiveRewardOptions, RewardAggregateSnapshot } from "../aggregation/live-rewards.ts";
import { emptySnapshot, MobRewardSession } from "../aggregation/session.ts";
import type { MobRewardSessionSnapshot } from "../aggregation/session.ts";
import { decodeRewardLines } from "./record.ts";

export type RewardLogStatus = LiveLogStatus;

export interface RewardLogBatch {
  snapshot: MobRewardSessionSnapshot;
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  changed: boolean;
  status: RewardLogStatus;
  path?: string;
  sessionId?: string;
}

export interface RewardLogFollowerOptions {
  /** `recordedAtMs` is the gain's real recorded time (from the log), not wall-clock consume time. */
  onExperience?: (experience: number, recordedAtMs: number) => void;
}

export class RewardLogFollower {
  private readonly reader: JsonlTailReader;
  private readonly records = new LogRecordLineDecoder();
  private readonly session = new MobRewardSession();
  private readonly onExperience?: (experience: number, recordedAtMs: number) => void;
  private status: RewardLogStatus = "watching";

  constructor(path: string, options: RewardLogFollowerOptions = {}) {
    this.reader = new JsonlTailReader(path, { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES });
    this.onExperience = options.onExperience;
  }

  async poll(): Promise<RewardLogBatch> {
    return this.consumeRead(await this.reader.read());
  }

  consumeRead({ missing, reset, lines }: JsonlTailReadResult): RewardLogBatch {
    if (missing) return this.batch({ missing: true, reset: false, changed: false, invalidLines: 0 });
    if (reset) this.resetState();
    const { entries, invalidLines } = decodeRewardLines(this.records, lines);
    for (const entry of entries) {
      if (entry.kind === "lifecycle") {
        if (entry.state === "started") this.status = this.session.snapshot().kills.length > 0 ? "ready" : "watching";
        else if (entry.state === "stopped") this.status = "stopped";
        continue;
      }
      if (entry.kind === "error") {
        this.status = "error";
        continue;
      }
      this.session.consume(entry.event, { recordedAt: entry.recordedAt });
      if ((entry.event.kind === "kill" || entry.event.reward === "experience") && entry.event.experience > 0) {
        const recordedAtMs = Date.parse(entry.recordedAt);
        if (!Number.isNaN(recordedAtMs)) this.onExperience?.(entry.event.experience, recordedAtMs);
      }
      this.status = "ready";
    }
    return this.batch({ missing: false, reset, changed: entries.length > 0, invalidLines });
  }

  private resetState(): void {
    this.records.reset();
    this.session.reset();
    this.status = "watching";
  }

  private batch(detail: Pick<RewardLogBatch, "missing" | "reset" | "changed" | "invalidLines">): RewardLogBatch {
    return { ...detail, snapshot: this.session.snapshot(), status: detail.missing ? "waiting" : this.status };
  }
}

type RewardSessionFollowerTuning =
  Pick<LiveLogSessionFollowerOptions<RewardLogFollower, RewardLogBatch>, "fallbackPollMs" | "debounceMs" | "persistent">;

export class RewardSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<RewardLogFollower, RewardLogBatch>;

  constructor(logDirectory?: string, options: RewardLogFollowerOptions & RewardSessionFollowerTuning = {}) {
    const { fallbackPollMs, debounceMs, persistent, ...followerOptions } = options;
    this.inner = new LiveLogSessionFollower({
      stream: "rewards",
      ...(logDirectory === undefined ? {} : { logDirectory }),
      ...(fallbackPollMs === undefined ? {} : { fallbackPollMs }),
      ...(debounceMs === undefined ? {} : { debounceMs }),
      ...(persistent === undefined ? {} : { persistent }),
      readerOptions: { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES },
      createFollower: (path) => new RewardLogFollower(path, followerOptions),
      mergeSessionChange: (batch, changedSession) => ({
        ...batch,
        reset: batch.reset || changedSession,
        changed: batch.changed || changedSession,
      }),
      noStreamBatch: (reset) => ({ snapshot: emptySnapshot(), invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" }),
    });
  }

  static watch(logDirectory?: string, options: RewardLogFollowerOptions & RewardSessionFollowerTuning = {}): RewardSessionLogFollower {
    return new RewardSessionLogFollower(logDirectory, options);
  }

  poll(): Promise<RewardLogBatch> { return this.inner.poll(); }
  next(): Promise<RewardLogBatch> { return this.inner.next(); }
  [Symbol.asyncIterator](): AsyncIterator<RewardLogBatch> { return this.inner[Symbol.asyncIterator](); }
  close(): void { this.inner.close(); }
}

export interface LiveRewardLogBatch {
  snapshot: RewardAggregateSnapshot;
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  changed: boolean;
  status: RewardLogStatus;
  path?: string;
  sessionId?: string;
}

/** Bounded follower for dashboards; the legacy RewardLogFollower remains full-history. */
export class LiveRewardLogFollower {
  private readonly reader: JsonlTailReader;
  private readonly records = new LogRecordLineDecoder();
  private readonly service: LiveRewardService;
  private readonly sourcePath: string;
  private status: RewardLogStatus = "watching";

  constructor(path: string, options: LiveRewardOptions = {}) {
    this.sourcePath = path;
    this.reader = new JsonlTailReader(path, { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES });
    this.service = new LiveRewardService(options);
  }

  async poll(): Promise<LiveRewardLogBatch> {
    return this.consumeRead(await this.reader.read());
  }

  consumeRead({ missing, reset, lines }: JsonlTailReadResult): LiveRewardLogBatch {
    if (missing) return this.batch(true, false, false, 0);
    if (reset) {
      this.records.reset();
      this.service.reset();
      this.status = "watching";
    }
    const { entries, invalidLines } = decodeRewardLines(this.records, lines);
    for (const entry of entries) {
      if (entry.kind === "lifecycle") {
        if (entry.state === "started") this.status = "ready";
        else if (entry.state === "stopped") this.status = "stopped";
        continue;
      }
      if (entry.kind === "error") {
        this.status = "error";
        continue;
      }
      this.service.consume(entry.event, { recordedAt: entry.recordedAt });
      this.status = "ready";
    }
    return this.batch(false, reset, entries.length > 0, invalidLines);
  }

  private batch(missing: boolean, reset: boolean, changed: boolean, invalidLines: number): LiveRewardLogBatch {
    return { snapshot: this.service.snapshot(), invalidLines, missing, reset, changed, status: missing ? "waiting" : this.status, path: this.sourcePath };
  }
}

export { LiveRewardLogFollower as BoundedRewardLogFollower };

export class LiveRewardSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<LiveRewardLogFollower, LiveRewardLogBatch>;

  constructor(logDirectory?: string, options: LiveRewardOptions & RewardSessionFollowerTuning = {}) {
    const { fallbackPollMs, debounceMs, persistent, ...serviceOptions } = options;
    this.inner = new LiveLogSessionFollower({
      stream: "rewards",
      ...(logDirectory === undefined ? {} : { logDirectory }),
      ...(fallbackPollMs === undefined ? {} : { fallbackPollMs }),
      ...(debounceMs === undefined ? {} : { debounceMs }),
      ...(persistent === undefined ? {} : { persistent }),
      readerOptions: { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES },
      createFollower: (path) => new LiveRewardLogFollower(path, serviceOptions),
      mergeSessionChange: (batch, changedSession) => ({ ...batch, reset: batch.reset || changedSession, changed: batch.changed || changedSession }),
      noStreamBatch: (reset) => ({ snapshot: new LiveRewardService(serviceOptions).snapshot(), invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" }),
    });
  }

  static watch(logDirectory?: string, options: LiveRewardOptions & RewardSessionFollowerTuning = {}): LiveRewardSessionLogFollower {
    return new LiveRewardSessionLogFollower(logDirectory, options);
  }

  poll(): Promise<LiveRewardLogBatch> { return this.inner.poll(); }
  next(): Promise<LiveRewardLogBatch> { return this.inner.next(); }
  [Symbol.asyncIterator](): AsyncIterator<LiveRewardLogBatch> { return this.inner[Symbol.asyncIterator](); }
  close(): void { this.inner.close(); }
}

export { LiveRewardSessionLogFollower as BoundedRewardSessionLogFollower };
