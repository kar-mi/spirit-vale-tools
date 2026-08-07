import { describe, expect, test } from "bun:test";

import { ANALYSIS_BUCKET_MS, addToSeries, createSeries, takeDirtyFrom } from "./timeline.ts";

/**
 * The dirty range is what stops the read model rewriting an open encounter's whole timeline on
 * every indexing pass, so it has to be exact: too wide and the saving disappears, too narrow and a
 * changed bucket is never persisted.
 */
describe("bucket series dirty range", () => {
  test("a fresh series is clean until something is recorded", () => {
    const series = createSeries(0);
    expect(takeDirtyFrom(series)).toBe(Number.POSITIVE_INFINITY);
  });

  test("claiming the range marks the series clean", () => {
    const series = createSeries(0);
    addToSeries(series, ANALYSIS_BUCKET_MS * 3, 10);
    expect(takeDirtyFrom(series)).toBe(0);
    expect(takeDirtyFrom(series)).toBe(Number.POSITIVE_INFINITY);
  });

  test("covers the zero buckets a hit past the end appends", () => {
    // Buckets 1 and 2 are created as padding by the second hit, so they are new rows too and the
    // range has to reach back to them rather than starting at the hit's own bucket.
    const series = createSeries(0);
    addToSeries(series, 0, 10);
    takeDirtyFrom(series);
    addToSeries(series, ANALYSIS_BUCKET_MS * 3, 20);
    expect(takeDirtyFrom(series)).toBe(1);
  });

  test("starts at the lowest bucket changed, not the most recent", () => {
    const series = createSeries(0);
    addToSeries(series, ANALYSIS_BUCKET_MS * 4, 10);
    takeDirtyFrom(series);
    addToSeries(series, ANALYSIS_BUCKET_MS * 4, 5);
    addToSeries(series, ANALYSIS_BUCKET_MS * 1, 7);
    expect(takeDirtyFrom(series)).toBe(1);
    expect(series.buckets[1]).toBe(7);
    expect(series.buckets[4]).toBe(15);
  });

  test("a resolution collapse invalidates the whole series", () => {
    // Every bucket now spans a different range and the series is shorter, so a writer must replace
    // it outright — which it recognises by the range starting at zero.
    const series = createSeries(0);
    for (let bucket = 0; bucket < 4; bucket += 1) addToSeries(series, bucket * ANALYSIS_BUCKET_MS, 10, 4);
    takeDirtyFrom(series);
    addToSeries(series, ANALYSIS_BUCKET_MS * 4, 10, 4);
    expect(series.widthMs).toBe(ANALYSIS_BUCKET_MS * 2);
    expect(takeDirtyFrom(series)).toBe(0);
  });
});
