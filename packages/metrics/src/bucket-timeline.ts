export interface BucketTimelineOptions {
  /** Width of each bucket. Defaults to one second. */
  bucketMs?: number;
  /** How much trailing history to retain. Defaults to one hour. */
  retentionMs?: number;
}

export interface TimelineBucket {
  atMs: number;
  value: number;
}

const DEFAULT_BUCKET_MS = 1_000;
const DEFAULT_RETENTION_MS = 60 * 60 * 1_000;

/** A trailing FIFO of fixed-width buckets: the graphable history behind a rate, and its window sum. */
export class BucketTimeline {
  private readonly bucketMs: number;
  private readonly retentionMs: number;
  private readonly buckets: TimelineBucket[] = [];

  constructor(options: BucketTimelineOptions = {}) {
    this.bucketMs = positiveFinite(options.bucketMs ?? DEFAULT_BUCKET_MS, "bucketMs");
    this.retentionMs = positiveFinite(options.retentionMs ?? DEFAULT_RETENTION_MS, "retentionMs");
  }

  record(value: number, atMs: number): void {
    const bucketAtMs = Math.floor(atMs / this.bucketMs) * this.bucketMs;
    const last = this.buckets.at(-1);
    if (last && last.atMs === bucketAtMs) last.value += value;
    else this.buckets.push({ atMs: bucketAtMs, value });
    this.prune(atMs);
  }

  /** Total of every retained bucket — i.e. the sum over the retention window as of `nowMs`. */
  windowSum(nowMs: number): number {
    this.prune(nowMs);
    let sum = 0;
    for (const bucket of this.buckets) sum += bucket.value;
    return sum;
  }

  points(nowMs: number): TimelineBucket[] {
    this.prune(nowMs);
    return this.buckets.map((bucket) => ({ ...bucket }));
  }

  reset(): void {
    this.buckets.length = 0;
  }

  private prune(nowMs: number): void {
    const cutoff = nowMs - this.retentionMs;
    while (this.buckets.length > 0 && this.buckets[0]!.atMs < cutoff) this.buckets.shift();
  }
}

function positiveFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be a positive finite number`);
  return value;
}
