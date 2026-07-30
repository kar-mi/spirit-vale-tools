const RETENTION_MS = 60 * 60 * 1_000;
const RATE_WINDOW_MS = 60 * 1_000;

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

export class XpAggregateTracker {
  private total = 0;
  private readonly buckets: XpAggregateBucket[] = [];

  record(experience: number, atMs: number): void {
    if (experience <= 0) return;
    this.total += experience;
    const second = Math.floor(atMs / 1_000) * 1_000;
    const last = this.buckets.at(-1);
    if (last && last.atMs === second) last.experience += experience;
    else this.buckets.push({ atMs: second, experience });
    this.prune(atMs);
  }

  reset(): void {
    this.total = 0;
    this.buckets.length = 0;
  }

  /** Seeds the running total from a durable checkpoint without affecting the (in-memory-only) rate/graph buckets. */
  restoreTotal(total: number): void {
    this.total = Math.max(0, total);
  }

  currentTotal(): number {
    return this.total;
  }

  snapshot(nowMs: number): XpAggregateSnapshot {
    this.prune(nowMs);
    const rateWindowStart = nowMs - RATE_WINDOW_MS;
    let rateWindowSum = 0;
    let hourSum = 0;
    for (const bucket of this.buckets) {
      hourSum += bucket.experience;
      if (bucket.atMs >= rateWindowStart) rateWindowSum += bucket.experience;
    }
    return {
      totalExperience: this.total,
      xpPerSecond: rateWindowSum / (RATE_WINDOW_MS / 1_000),
      xpPerHour: hourSum,
      timeline: this.buckets.map((bucket) => ({ ...bucket })),
    };
  }

  private prune(nowMs: number): void {
    const cutoff = nowMs - RETENTION_MS;
    while (this.buckets.length > 0 && this.buckets[0]!.atMs < cutoff) this.buckets.shift();
  }
}
