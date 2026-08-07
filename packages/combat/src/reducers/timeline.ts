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
  /**
   * Lowest bucket index changed since the last {@link takeDirtyFrom}, or `Infinity` when none is.
   *
   * The read model rewrites an encounter's stored rows on every indexing pass, and a long encounter
   * accumulates buckets without limit — so writing all of them each pass costs work quadratic in the
   * encounter's duration. A series is append-mostly, so this records how far back the writer
   * actually has to go. It is deliberately *not* set when a series is reconstructed from stored
   * rows: those buckets are already persisted, and re-marking them dirty would defeat the point.
   */
  dirtyFrom: number;
}

export function createSeries(originMs: number, widthMs = ANALYSIS_BUCKET_MS): BucketSeries {
  return { originMs, widthMs, buckets: [], dirtyFrom: Number.POSITIVE_INFINITY };
}

/**
 * Claims the dirty range and marks the series clean, returning the lowest index a writer must
 * persist from. `Infinity` means nothing changed and the writer can skip the series entirely.
 */
export function takeDirtyFrom(series: BucketSeries): number {
  const from = series.dirtyFrom;
  series.dirtyFrom = Number.POSITIVE_INFINITY;
  return from;
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
  // Taken before padding: a hit past the end appends zero buckets, and those are new rows too, so
  // the dirty range has to start at the old end rather than at the hit's own index.
  series.dirtyFrom = Math.min(series.dirtyFrom, series.buckets.length, index);
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
  // Every bucket now covers a different span and the series is shorter, so nothing already stored
  // for it is still valid. Writers treat a range starting at 0 as "replace the series".
  series.dirtyFrom = 0;
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
 * Renders the series over `durationMs`: a leading zero point, then one point per bucket, padded
 * with zeroes to cover the full duration.
 *
 * Anything at or beyond the final bucket folds into it. `addToSeries` places a hit by its own
 * timestamp and knows nothing of the duration the series is later rendered over, so a hit landing
 * exactly on the closing boundary sits one bucket past the last rendered one — and `durationMs` is
 * `lastDamageAtMs - startedAtMs`, which puts the closing hit of every encounter on that boundary
 * whenever the duration is a whole number of buckets. Without this fold that damage disappears from
 * the timeline while still counting toward `damage` and `dps`.
 */
export function seriesPoints(series: BucketSeries, durationMs: number): TimelinePoint[] {
  const bucketCount = Math.max(1, Math.ceil(durationMs / series.widthMs));
  const points: TimelinePoint[] = [{ elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 }];
  let cumulativeDamage = 0;
  for (let index = 0; index < bucketCount; index += 1) {
    const elapsedMs = Math.min(durationMs, (index + 1) * series.widthMs);
    const bucketDurationMs = Math.max(1, elapsedMs - index * series.widthMs);
    let damage = series.buckets[index] ?? 0;
    if (index === bucketCount - 1) {
      for (let overflow = bucketCount; overflow < series.buckets.length; overflow += 1) {
        damage += series.buckets[overflow] ?? 0;
      }
    }
    cumulativeDamage += damage;
    points.push({ elapsedMs, damage, cumulativeDamage, dps: damage / (bucketDurationMs / 1_000) });
  }
  return points;
}
