import type { TimelineBucket } from "./bucket-timeline.ts";
import { EwmaRate } from "./ewma-rate.ts";
import { DEFAULT_RATE_TAU_SECONDS } from "./rate-tracker.ts";

export interface EwmaSeriesPoint {
  time: number;
  value: number;
}

export interface EwmaSeriesOptions {
  /** Must match the tracker whose timeline is being replayed, or the chart will diverge from its `perSecond`. Defaults to 20 seconds. */
  tauSeconds?: number;
  /** Spacing between plotted points. Defaults to one second. */
  stepMs?: number;
}

export function ewmaSeries(
  buckets: readonly TimelineBucket[],
  range: { start: number; end: number },
  options: EwmaSeriesOptions = {},
): EwmaSeriesPoint[] {
  if (range.end <= range.start) return [];
  const stepMs = options.stepMs ?? 1_000;
  const rate = new EwmaRate({ tauSeconds: options.tauSeconds ?? DEFAULT_RATE_TAU_SECONDS });
  rate.reset(buckets[0]?.atMs ?? range.start);

  let bucketIndex = 0;
  const consumeThrough = (toMs: number): number => {
    while (bucketIndex < buckets.length) {
      const bucket = buckets[bucketIndex];
      if (!bucket || bucket.atMs > toMs) break;
      rate.record(bucket.value, bucket.atMs);
      bucketIndex += 1;
    }
    return rate.rateAt(toMs);
  };

  const points: EwmaSeriesPoint[] = [{ time: range.start, value: consumeThrough(range.start) }];
  let next = Math.ceil(range.start / stepMs) * stepMs;
  if (next <= range.start) next += stepMs;
  for (; next < range.end; next += stepMs) {
    points.push({ time: next, value: consumeThrough(next) });
  }
  points.push({ time: range.end, value: consumeThrough(range.end) });
  return points;
}
