/** Width the legacy meter used for analysis buckets; the read model stores this resolution. */
export const ANALYSIS_BUCKET_MS = 5_000;

export interface TimelinePoint {
  /** Milliseconds elapsed since the series origin. */
  elapsedMs: number;
  /** Damage recorded during this time bucket. */
  damage: number;
  /** Damage recorded from the origin through this time bucket. */
  cumulativeDamage: number;
  /** Damage per second for this time bucket. */
  dps: number;
}

/**
 * Damage accumulated into fixed-width buckets as events arrive, instead of a per-hit array that is
 * re-bucketed on every read.
 *
 * `widthMs` doubles whenever the bucket count would exceed `maxBuckets`, so an arbitrarily long
 * encounter stays bounded in memory. The read model keeps `maxBuckets` unbounded, so stored history
 * always holds full {@link ANALYSIS_BUCKET_MS} resolution.
 */
export interface BucketSeries {
  originMs: number;
  widthMs: number;
  buckets: number[];
}

export function createSeries(originMs: number, widthMs = ANALYSIS_BUCKET_MS): BucketSeries {
  return { originMs, widthMs, buckets: [] };
}

export function addToSeries(
  series: BucketSeries,
  atMs: number,
  damage: number,
  maxBuckets = Number.POSITIVE_INFINITY,
): void {
  let index = Math.max(0, Math.floor((atMs - series.originMs) / series.widthMs));
  // Halving the resolution moves this hit into a lower bucket, so recompute after each collapse.
  while (index >= maxBuckets) {
    collapse(series);
    index = Math.max(0, Math.floor((atMs - series.originMs) / series.widthMs));
  }
  while (series.buckets.length <= index) series.buckets.push(0);
  series.buckets[index]! += damage;
}

/** Halves the resolution in place, preserving every bucket's damage. */
function collapse(series: BucketSeries): void {
  const merged: number[] = [];
  for (let index = 0; index < series.buckets.length; index += 2) {
    merged.push((series.buckets[index] ?? 0) + (series.buckets[index + 1] ?? 0));
  }
  series.buckets = merged;
  series.widthMs *= 2;
}

/** Element-wise sum of two series that share an origin and width, e.g. when merging actor rows. */
export function addSeries(target: BucketSeries, source: BucketSeries): void {
  if (source.originMs === target.originMs && source.widthMs === target.widthMs) {
    for (const [index, damage] of source.buckets.entries()) {
      while (target.buckets.length <= index) target.buckets.push(0);
      target.buckets[index]! += damage;
    }
    return;
  }
  // Different origin or width: re-place each bucket by its start time. Exact when the offset is a
  // whole number of buckets, which is the case whenever the origins are bucket-aligned.
  for (const [index, damage] of source.buckets.entries()) {
    if (damage === 0) continue;
    addToSeries(target, source.originMs + index * source.widthMs, damage);
  }
}

/**
 * Renders the series over `durationMs`, matching the legacy meter's `buildTimeline` exactly:
 * a leading zero point, then one point per bucket, padded with zeroes to cover the full duration.
 */
export function seriesPoints(series: BucketSeries, durationMs: number): TimelinePoint[] {
  const bucketCount = Math.max(1, Math.ceil(durationMs / series.widthMs));
  const points: TimelinePoint[] = [{ elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 }];
  let cumulativeDamage = 0;
  for (let index = 0; index < bucketCount; index += 1) {
    const elapsedMs = Math.min(durationMs, (index + 1) * series.widthMs);
    const bucketDurationMs = Math.max(1, elapsedMs - index * series.widthMs);
    const damage = series.buckets[index] ?? 0;
    cumulativeDamage += damage;
    points.push({ elapsedMs, damage, cumulativeDamage, dps: damage / (bucketDurationMs / 1_000) });
  }
  return points;
}
