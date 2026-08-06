import { expect, test } from "bun:test";
import { RateTracker } from "./rate-tracker.ts";

test("rate tracker accumulates a running total", () => {
  const tracker = new RateTracker();
  tracker.record(10, 1_000);
  tracker.record(5, 2_000);

  expect(tracker.currentTotal()).toBe(15);
});

test("restoring a checkpoint and re-recording the same historical gains does not double-count them", () => {
  // Simulates: a window is closed after counting some gains, then reopened — a fresh log
  // follower re-tails the current session's log from the start, re-emitting every gain
  // already reflected in the checkpoint.
  const first = new RateTracker();
  first.record(10, 1_000);
  first.record(20, 2_000);
  expect(first.currentTotal()).toBe(30);

  const reopened = new RateTracker();
  reopened.restoreCheckpoint(first.currentCheckpoint());
  reopened.record(10, 1_000);
  reopened.record(20, 2_000);
  expect(reopened.currentTotal()).toBe(30);

  reopened.record(5, 3_000);
  expect(reopened.currentTotal()).toBe(35);
});

test("a replay that repeats the watermark's own timestamp does not double-count, even with several gains tied at that timestamp", () => {
  // The last two gains of the first pass share a timestamp (e.g. an AoE clearing two mobs at once).
  const first = new RateTracker();
  first.record(10, 1_000);
  first.record(20, 2_000);
  first.record(30, 2_000);
  expect(first.currentTotal()).toBe(60);

  const reopened = new RateTracker();
  reopened.restoreCheckpoint(first.currentCheckpoint());
  reopened.record(10, 1_000);
  reopened.record(20, 2_000);
  reopened.record(30, 2_000);
  expect(reopened.currentTotal()).toBe(60);

  // A genuinely new gain arriving later at that same tied timestamp still counts.
  reopened.record(5, 2_000);
  expect(reopened.currentTotal()).toBe(65);

  reopened.record(7, 3_000);
  expect(reopened.currentTotal()).toBe(72);
});

test("reset bumps the watermark so a subsequent replay of pre-reset gains is ignored", () => {
  const tracker = new RateTracker();
  tracker.record(10, 1_000);
  tracker.record(20, 2_000);

  tracker.reset(2_500);
  expect(tracker.currentTotal()).toBe(0);

  // A fresh follower re-tailing the session log from the start replays the pre-reset gains.
  tracker.record(10, 1_000);
  tracker.record(20, 2_000);
  expect(tracker.currentTotal()).toBe(0);

  tracker.record(7, 3_000);
  expect(tracker.currentTotal()).toBe(7);
});

test("gains sharing the same recorded timestamp within a single live pass are not treated as duplicates", () => {
  const tracker = new RateTracker();
  tracker.record(10, 1_000);
  tracker.record(10, 1_000);

  expect(tracker.currentTotal()).toBe(20);
});

test("perSecond jumps immediately when a gain lands", () => {
  const tracker = new RateTracker();
  tracker.record(200, 0);

  // With a 20s time constant, a fresh gain's immediate contribution is value / tau.
  expect(tracker.snapshot(0).perSecond).toBeCloseTo(10, 5);
});

test("perSecond decays smoothly over time with no cliff-edge, instead of dropping to 0 at a window boundary", () => {
  const tracker = new RateTracker();
  tracker.record(200, 0);

  // After one time constant (20s) with no further gains, the rate has decayed to 1/e of its peak.
  expect(tracker.snapshot(20_000).perSecond).toBeCloseTo(10 / Math.E, 5);
  // A flat rolling window would already read 0 here; EWMA never cliffs, only fades.
  expect(tracker.snapshot(20_000).perSecond).toBeGreaterThan(0);
});

test("perSecond blends a new gain on top of the still-decaying contribution of a previous one", () => {
  const tracker = new RateTracker();
  tracker.record(200, 0);
  tracker.record(200, 10_000);

  const expected = 10 * Math.exp(-10 / 20) + 10;
  expect(tracker.snapshot(10_000).perSecond).toBeCloseTo(expected, 5);
});

test("reset zeroes perSecond immediately", () => {
  const tracker = new RateTracker();
  tracker.record(200, 0);
  tracker.reset(5_000);

  expect(tracker.snapshot(5_000).perSecond).toBe(0);
});

test("perHour sums the retention window and the timeline buckets by second", () => {
  const tracker = new RateTracker();
  tracker.record(10, 1_000);
  tracker.record(5, 1_400);
  tracker.record(20, 2_000);

  const snapshot = tracker.snapshot(2_000);
  expect(snapshot.perHour).toBe(35);
  expect(snapshot.timeline).toEqual([{ atMs: 1_000, value: 15 }, { atMs: 2_000, value: 20 }]);
});

test("timeline buckets older than the retention window are dropped from perHour", () => {
  const tracker = new RateTracker({ retentionMs: 10_000 });
  tracker.record(10, 1_000);
  tracker.record(20, 8_000);

  expect(tracker.snapshot(15_000).perHour).toBe(20);
});

test("the tracker is metric-agnostic — a second instance fed coins behaves identically to one fed experience", () => {
  const experience = new RateTracker();
  const coins = new RateTracker();
  experience.record(200, 0);
  coins.record(200, 0);

  expect(coins.snapshot(5_000)).toEqual(experience.snapshot(5_000));
});
