import { expect, test } from "bun:test";
import { XpAggregateTracker } from "./xp-aggregate.ts";

test("xp aggregate tracker accumulates a running total", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(10, 1_000);
  tracker.record(5, 2_000);

  expect(tracker.currentTotal()).toBe(15);
});

test("restoring a checkpoint and re-recording the same historical kills does not double-count them", () => {
  // Simulates: a window is closed after counting some kills, then reopened — a fresh log
  // follower re-tails the current session's log from the start, re-emitting every kill
  // already reflected in the checkpoint.
  const first = new XpAggregateTracker();
  first.record(10, 1_000);
  first.record(20, 2_000);
  expect(first.currentTotal()).toBe(30);

  const reopened = new XpAggregateTracker();
  reopened.restoreCheckpoint(first.currentCheckpoint());
  reopened.record(10, 1_000);
  reopened.record(20, 2_000);
  expect(reopened.currentTotal()).toBe(30);

  reopened.record(5, 3_000);
  expect(reopened.currentTotal()).toBe(35);
});

test("a replay that repeats the watermark's own timestamp does not double-count, even with several kills tied at that timestamp", () => {
  // The last two kills of the first pass share a timestamp (e.g. an AoE clearing two mobs at once).
  const first = new XpAggregateTracker();
  first.record(10, 1_000);
  first.record(20, 2_000);
  first.record(30, 2_000);
  expect(first.currentTotal()).toBe(60);

  const reopened = new XpAggregateTracker();
  reopened.restoreCheckpoint(first.currentCheckpoint());
  reopened.record(10, 1_000);
  reopened.record(20, 2_000);
  reopened.record(30, 2_000);
  expect(reopened.currentTotal()).toBe(60);

  // A genuinely new kill arriving later at that same tied timestamp still counts.
  reopened.record(5, 2_000);
  expect(reopened.currentTotal()).toBe(65);

  reopened.record(7, 3_000);
  expect(reopened.currentTotal()).toBe(72);
});

test("reset bumps the watermark so a subsequent replay of pre-reset kills is ignored", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(10, 1_000);
  tracker.record(20, 2_000);

  tracker.reset(2_500);
  expect(tracker.currentTotal()).toBe(0);

  // A fresh follower re-tailing the session log from the start replays the pre-reset kills.
  tracker.record(10, 1_000);
  tracker.record(20, 2_000);
  expect(tracker.currentTotal()).toBe(0);

  tracker.record(7, 3_000);
  expect(tracker.currentTotal()).toBe(7);
});

test("kills sharing the same recorded timestamp within a single live pass are not treated as duplicates", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(10, 1_000);
  tracker.record(10, 1_000);

  expect(tracker.currentTotal()).toBe(20);
});

test("xpPerSecond jumps immediately when a kill lands", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(200, 0);

  // With a 20s time constant, a fresh kill's immediate contribution is experience / tau.
  expect(tracker.snapshot(0).xpPerSecond).toBeCloseTo(10, 5);
});

test("xpPerSecond decays smoothly over time with no cliff-edge, instead of dropping to 0 at a window boundary", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(200, 0);

  // After one time constant (20s) with no further kills, the rate has decayed to 1/e of its peak.
  expect(tracker.snapshot(20_000).xpPerSecond).toBeCloseTo(10 / Math.E, 5);
  // A flat rolling window would already read 0 here; EWMA never cliffs, only fades.
  expect(tracker.snapshot(20_000).xpPerSecond).toBeGreaterThan(0);
});

test("xpPerSecond blends a new kill on top of the still-decaying contribution of a previous one", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(200, 0);
  tracker.record(200, 10_000);

  const expected = 10 * Math.exp(-10 / 20) + 10;
  expect(tracker.snapshot(10_000).xpPerSecond).toBeCloseTo(expected, 5);
});

test("reset zeroes xpPerSecond immediately", () => {
  const tracker = new XpAggregateTracker();
  tracker.record(200, 0);
  tracker.reset(5_000);

  expect(tracker.snapshot(5_000).xpPerSecond).toBe(0);
});
