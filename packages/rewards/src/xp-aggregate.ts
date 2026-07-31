const RETENTION_MS = 60 * 60 * 1_000;
// xpPerSecond is an exponentially-weighted rate (a "leaky bucket"), not a flat rolling-window
// average: XP gains are sparse, discrete events, so a flat window either reads 0 between gains (if
// short) or barely moves per gain (if long), and always cliff-drops the instant a gain ages past
// the window edge. EWMA blends each gain in immediately, then lets it fade smoothly — no window
// edge, no discontinuity. RATE_TAU_SECONDS is a decay constant, not a cutoff: contributions never
// fully vanish, but after ~3x tau they're negligible (about 5% of their original weight).
const RATE_TAU_SECONDS = 20;

export interface XpAggregateBucket {
  atMs: number;
  experience: number;
}

export interface XpAggregateSnapshot {
  totalExperience: number;
  xpPerSecond: number;
  xpPerHour: number;
  timeline: XpAggregateBucket[];
}

/** Durable checkpoint of a tracker's progress, safe to persist and later restore with `restoreCheckpoint`. */
export interface XpAggregateCheckpoint {
  total: number;
  watermarkMs: number;
  /** How many gains were already counted at exactly `watermarkMs` — disambiguates gains that share a timestamp from a duplicate replay of the same gain. */
  watermarkOccurrences: number;
}

export class XpAggregateTracker {
  private total = 0;
  private watermarkMs = 0;
  private watermarkOccurrences = 0;
  private replayedAtWatermark = 0;
  private ewmaRate = 0;
  private ewmaUpdatedAtMs = 0;
  private readonly buckets: XpAggregateBucket[] = [];

  /**
   * `atMs` must be the gain's real recorded time, not wall-clock consume time: a fresh log
   * follower (e.g. after a window is closed and reopened) re-tails the current session's log
   * from the start, re-emitting every gain already counted. Anything strictly before the
   * watermark is skipped outright; gains sharing the watermark's own timestamp are disambiguated
   * by position (see `watermarkOccurrences`) so a genuine tie (several gains recorded in the same
   * millisecond) isn't mistaken for a duplicate replay, and vice versa.
   */
  record(experience: number, atMs: number): void {
    if (experience <= 0 || atMs < this.watermarkMs) return;
    if (atMs > this.watermarkMs) {
      this.watermarkMs = atMs;
      this.watermarkOccurrences = 0;
      this.replayedAtWatermark = 0;
    }
    this.replayedAtWatermark += 1;
    if (this.replayedAtWatermark <= this.watermarkOccurrences) return;
    this.watermarkOccurrences = this.replayedAtWatermark;
    this.total += experience;
    const dtSeconds = Math.max(0, atMs - this.ewmaUpdatedAtMs) / 1_000;
    this.ewmaRate = this.ewmaRate * Math.exp(-dtSeconds / RATE_TAU_SECONDS) + experience / RATE_TAU_SECONDS;
    this.ewmaUpdatedAtMs = atMs;
    const second = Math.floor(atMs / 1_000) * 1_000;
    const last = this.buckets.at(-1);
    if (last && last.atMs === second) last.experience += experience;
    else this.buckets.push({ atMs: second, experience });
    this.prune(atMs);
  }

  /** `atMs` should be "now" — everything up to this moment is treated as already accounted for. */
  reset(atMs: number): void {
    this.total = 0;
    this.buckets.length = 0;
    this.ewmaRate = 0;
    this.ewmaUpdatedAtMs = atMs;
    if (atMs >= this.watermarkMs) {
      this.watermarkMs = atMs;
      this.watermarkOccurrences = 0;
    }
    this.replayedAtWatermark = 0;
  }

  /** Seeds the running total and watermark from a durable checkpoint without affecting the (in-memory-only) rate/graph buckets. */
  restoreCheckpoint(checkpoint: XpAggregateCheckpoint): void {
    this.total = Math.max(0, checkpoint.total);
    this.watermarkMs = Math.max(0, checkpoint.watermarkMs);
    this.watermarkOccurrences = Math.max(0, checkpoint.watermarkOccurrences);
    this.replayedAtWatermark = 0;
  }

  currentTotal(): number {
    return this.total;
  }

  currentCheckpoint(): XpAggregateCheckpoint {
    return { total: this.total, watermarkMs: this.watermarkMs, watermarkOccurrences: this.watermarkOccurrences };
  }

  snapshot(nowMs: number): XpAggregateSnapshot {
    this.prune(nowMs);
    let hourSum = 0;
    for (const bucket of this.buckets) hourSum += bucket.experience;
    const decaySeconds = Math.max(0, nowMs - this.ewmaUpdatedAtMs) / 1_000;
    return {
      totalExperience: this.total,
      xpPerSecond: this.ewmaRate * Math.exp(-decaySeconds / RATE_TAU_SECONDS),
      xpPerHour: hourSum,
      timeline: this.buckets.map((bucket) => ({ ...bucket })),
    };
  }

  private prune(nowMs: number): void {
    const cutoff = nowMs - RETENTION_MS;
    while (this.buckets.length > 0 && this.buckets[0]!.atMs < cutoff) this.buckets.shift();
  }
}
