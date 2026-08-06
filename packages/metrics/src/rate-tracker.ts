import { BucketTimeline } from "./bucket-timeline.ts";
import type { TimelineBucket } from "./bucket-timeline.ts";
import { EwmaRate } from "./ewma-rate.ts";

/**
 * Sparse gains (XP, coins) arrive seconds or minutes apart, so the rate is read far more often than
 * it is updated and a short time constant would read as noise. Twenty seconds keeps a single kill
 * visible for roughly a minute.
 */
export const DEFAULT_RATE_TAU_SECONDS = 20;

export interface RateTrackerOptions {
  /** Decay constant for `perSecond`. Defaults to 20 seconds. */
  tauSeconds?: number;
  /** Width of the timeline buckets. Defaults to one second. */
  bucketMs?: number;
  /** Trailing history retained for `timeline` and summed into `perHour`. Defaults to one hour. */
  retentionMs?: number;
}

export interface RateSnapshot {
  /** Everything recorded since construction or the last `reset`. */
  total: number;
  /** Exponentially-weighted rate per second. */
  perSecond: number;
  /** Flat sum of the retention window — with the default hour of retention, the gain in the last hour. */
  perHour: number;
  timeline: TimelineBucket[];
}

/** Durable checkpoint of a tracker's progress, safe to persist and later restore with `restoreCheckpoint`. */
export interface RateCheckpoint {
  total: number;
  watermarkMs: number;
  /** How many gains were already counted at exactly `watermarkMs` — disambiguates gains that share a timestamp from a duplicate replay of the same gain. */
  watermarkOccurrences: number;
}

/**
 * Accumulates a single metric — experience, coins, or anything else countable — into a running
 * total, an exponentially-weighted per-second rate, and a bucketed timeline. Value-agnostic by
 * design: one instance per metric, all reporting through the same neutral snapshot shape.
 */
export class RateTracker {
  private total = 0;
  private watermarkMs = 0;
  private watermarkOccurrences = 0;
  private replayedAtWatermark = 0;
  private readonly rate: EwmaRate;
  private readonly timeline: BucketTimeline;

  constructor(options: RateTrackerOptions = {}) {
    this.rate = new EwmaRate({ tauSeconds: options.tauSeconds ?? DEFAULT_RATE_TAU_SECONDS });
    this.timeline = new BucketTimeline({
      ...(options.bucketMs === undefined ? {} : { bucketMs: options.bucketMs }),
      ...(options.retentionMs === undefined ? {} : { retentionMs: options.retentionMs }),
    });
  }

  /**
   * `atMs` must be the gain's real recorded time, not wall-clock consume time: a fresh log
   * follower (e.g. after a window is closed and reopened) re-tails the current session's log
   * from the start, re-emitting every gain already counted. Anything strictly before the
   * watermark is skipped outright; gains sharing the watermark's own timestamp are disambiguated
   * by position (see `watermarkOccurrences`) so a genuine tie (several gains recorded in the same
   * millisecond) isn't mistaken for a duplicate replay, and vice versa.
   */
  record(value: number, atMs: number): void {
    if (value <= 0 || atMs < this.watermarkMs) return;
    if (atMs > this.watermarkMs) {
      this.watermarkMs = atMs;
      this.watermarkOccurrences = 0;
      this.replayedAtWatermark = 0;
    }
    this.replayedAtWatermark += 1;
    if (this.replayedAtWatermark <= this.watermarkOccurrences) return;
    this.watermarkOccurrences = this.replayedAtWatermark;
    this.total += value;
    this.rate.record(value, atMs);
    this.timeline.record(value, atMs);
  }

  /** `atMs` should be "now" — everything up to this moment is treated as already accounted for. */
  reset(atMs: number): void {
    this.total = 0;
    this.timeline.reset();
    this.rate.reset(atMs);
    if (atMs >= this.watermarkMs) {
      this.watermarkMs = atMs;
      this.watermarkOccurrences = 0;
    }
    this.replayedAtWatermark = 0;
  }

  /** Seeds the running total and watermark from a durable checkpoint without affecting the (in-memory-only) rate/timeline. */
  restoreCheckpoint(checkpoint: RateCheckpoint): void {
    this.total = Math.max(0, checkpoint.total);
    this.watermarkMs = Math.max(0, checkpoint.watermarkMs);
    this.watermarkOccurrences = Math.max(0, checkpoint.watermarkOccurrences);
    this.replayedAtWatermark = 0;
  }

  currentTotal(): number {
    return this.total;
  }

  currentCheckpoint(): RateCheckpoint {
    return { total: this.total, watermarkMs: this.watermarkMs, watermarkOccurrences: this.watermarkOccurrences };
  }

  snapshot(nowMs: number): RateSnapshot {
    return {
      total: this.total,
      perSecond: this.rate.rateAt(nowMs),
      perHour: this.timeline.windowSum(nowMs),
      timeline: this.timeline.points(nowMs),
    };
  }
}
