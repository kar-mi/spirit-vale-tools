import { expect, test } from "bun:test";
import { ewmaSeries } from "./ewma-series.ts";
import { RateTracker } from "./rate-tracker.ts";

test("the replayed series matches the tracker's own perSecond at the same moment", () => {
  const tracker = new RateTracker();
  tracker.record(200, 0);
  tracker.record(150, 7_000);
  const snapshot = tracker.snapshot(20_000);

  const points = ewmaSeries(snapshot.timeline, { start: 0, end: 20_000 });

  expect(points.at(-1)?.time).toBe(20_000);
  expect(points.at(-1)?.value).toBeCloseTo(snapshot.perSecond, 9);
});

test("buckets before the visible range seed the rate so the left edge continues smoothly", () => {
  const buckets = [{ atMs: 0, value: 200 }];

  const points = ewmaSeries(buckets, { start: 10_000, end: 20_000 });

  expect(points[0]?.time).toBe(10_000);
  expect(points[0]?.value).toBeCloseTo(10 * Math.exp(-10 / 20), 9);
});

test("points are emitted at the step interval, with the range edges included", () => {
  const points = ewmaSeries([{ atMs: 0, value: 200 }], { start: 0, end: 3_000 });

  expect(points.map(({ time }) => time)).toEqual([0, 1_000, 2_000, 3_000]);
});

test("an empty or inverted range yields no points", () => {
  expect(ewmaSeries([{ atMs: 0, value: 200 }], { start: 5_000, end: 5_000 })).toEqual([]);
  expect(ewmaSeries([{ atMs: 0, value: 200 }], { start: 5_000, end: 1_000 })).toEqual([]);
});

test("a custom time constant tracks a tracker built with the same constant", () => {
  const tracker = new RateTracker({ tauSeconds: 5 });
  tracker.record(200, 0);
  const snapshot = tracker.snapshot(10_000);

  const points = ewmaSeries(snapshot.timeline, { start: 0, end: 10_000 }, { tauSeconds: 5 });

  expect(points.at(-1)?.value).toBeCloseTo(snapshot.perSecond, 9);
});
