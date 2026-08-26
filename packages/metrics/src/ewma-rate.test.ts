import { expect, test } from "bun:test";
import { EwmaRate } from "./ewma-rate.ts";

test("a recorded value contributes value / tau immediately", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 0);

  expect(rate.rateAt(0)).toBeCloseTo(40, 5);
});

test("the rate decays to 1/e after one time constant and never reaches zero", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 0);

  expect(rate.rateAt(2_500)).toBeCloseTo(40 / Math.E, 5);
  // A 5s rolling window would read exactly 0 here; the estimator only fades.
  expect(rate.rateAt(5_000)).toBeGreaterThan(0);
  expect(rate.rateAt(5_000)).toBeLessThan(rate.rateAt(2_500));
});

test("rateAt does not mutate state, so repeated reads at the same moment agree", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 0);

  expect(rate.rateAt(1_000)).toBe(rate.rateAt(1_000));
  expect(rate.rateAt(0)).toBeCloseTo(40, 5);
});

test("a steady stream converges to its true rate", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  // 100 damage every 100ms is 1000 damage per second.
  for (let atMs = 0; atMs <= 60_000; atMs += 100) rate.record(100, atMs);

  expect(rate.rateAt(60_000)).toBeWithin(970, 1_030);
});

test("ramp-up correction removes the cold-start bias that would otherwise under-read a fresh stream", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  for (let atMs = 0; atMs <= 2_500; atMs += 100) rate.record(100, atMs);

  // One time constant in, the uncorrected estimate is about 63% (1 - 1/e) of the true 1000/s.
  expect(rate.rateAt(2_500)).toBeWithin(630, 680);
  // Dividing by that same factor recovers it — the analogue of a window dividing by elapsed time rather than by its full width.
  expect(rate.rateAt(2_500, { fromMs: 0 })).toBeWithin(1_000, 1_060);
});

test("the ramp-up floor keeps the first instant from dividing by a near-zero factor", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 0);

  // Elapsed is clamped to the floor, so the correction is bounded even when read immediately.
  expect(rate.rateAt(0, { fromMs: 0 })).toBeCloseTo(40 / (1 - Math.exp(-1 / 2.5)), 5);
  expect(rate.rateAt(0, { fromMs: 0, minimumMs: 2_500 })).toBeCloseTo(40 / (1 - 1 / Math.E), 5);
});

test("adding two estimators equals recording both streams into one", () => {
  const left = new EwmaRate({ tauSeconds: 2.5 });
  const right = new EwmaRate({ tauSeconds: 2.5 });
  const combined = new EwmaRate({ tauSeconds: 2.5 });
  left.record(100, 0);
  left.record(50, 3_000);
  right.record(70, 1_000);
  combined.record(100, 0);
  combined.record(70, 1_000);
  combined.record(50, 3_000);

  left.add(right);
  expect(left.rateAt(5_000)).toBeCloseTo(combined.rateAt(5_000), 9);
});

test("state round-trips through persistence", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 1_000);

  const resumed = new EwmaRate({ tauSeconds: 2.5 });
  resumed.restore(rate.state());
  expect(rate.state().tauSeconds).toBe(2.5);
  resumed.record(50, 2_000);
  rate.record(50, 2_000);

  expect(resumed.rateAt(4_000)).toBe(rate.rateAt(4_000));
});

test("out-of-order and non-positive values are ignored rather than corrupting the estimate", () => {
  const rate = new EwmaRate({ tauSeconds: 2.5 });
  rate.record(100, 2_000);
  const before = rate.rateAt(2_000);

  rate.record(0, 2_500);
  rate.record(-5, 2_500);
  expect(rate.rateAt(2_000)).toBe(before);

  // A value stamped before the last update still lands, decayed to the current position.
  rate.record(100, 1_000);
  expect(rate.rateAt(2_000)).toBeGreaterThan(before);
});

test("a non-positive time constant is rejected", () => {
  expect(() => new EwmaRate({ tauSeconds: 0 })).toThrow("tauSeconds must be a positive finite number");
  expect(() => new EwmaRate({ tauSeconds: Number.NaN })).toThrow("tauSeconds must be a positive finite number");
});

test("emptyLike yields a fresh estimator that can absorb its source", () => {
  const source = new EwmaRate({ tauSeconds: 2.5 });
  source.record(100, 0);

  const target = source.emptyLike();
  target.add(source);
  expect(target.rateAt(1_000)).toBe(source.rateAt(1_000));
});

test("estimators with different time constants cannot be merged, nor restored across", () => {
  const left = new EwmaRate({ tauSeconds: 2.5 });
  expect(() => left.add(new EwmaRate({ tauSeconds: 20 }))).toThrow("different tauSeconds");
  expect(() => left.restore(new EwmaRate({ tauSeconds: 20 }).state())).toThrow("different tauSeconds");
});
