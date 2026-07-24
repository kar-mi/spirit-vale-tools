import { describe, expect, test } from "bun:test";
import { bigintRatio, buildCumulativeTrend, buildRateTrend, trendExtent } from "./trend.ts";

const samples = [
  { recordedAt: "2026-01-01T00:00:00.000Z", experience: 10, jobExperience: 3, coins: "4" },
  { recordedAt: "2026-01-01T00:00:02.000Z", experience: 20, jobExperience: 7, coins: "6" },
  { recordedAt: "2026-01-01T00:00:04.000Z", experience: 30, jobExperience: 11, coins: "10" },
];

describe("rewards trend model", () => {
  test("builds session-wide cumulative totals inside a zoomed range", () => {
    const points = buildCumulativeTrend(samples, "experience", {
      start: Date.parse("2026-01-01T00:00:01.000Z"),
      end: Date.parse("2026-01-01T00:00:03.000Z"),
    });
    expect(points.map(({ value }) => value)).toEqual([10n, 30n, 30n]);
  });

  test("creates adaptive per-second buckets including empty intervals", () => {
    const range = trendExtent(samples)!;
    const points = buildRateTrend(samples, "coins", range, 288);
    expect(points).toHaveLength(4);
    expect(points.map(({ gain }) => gain)).toEqual([4n, 0n, 6n, 10n]);
    expect(points.map(({ value }) => value)).toEqual([4, 0, 6, 10]);
  });

  test("expands a single timestamp and safely scales large integers", () => {
    expect(trendExtent(samples.slice(0, 1))).toEqual({
      start: Date.parse("2025-12-31T23:59:59.500Z"),
      end: Date.parse("2026-01-01T00:00:00.500Z"),
    });
    expect(bigintRatio(10n ** 400n, 2n * 10n ** 400n)).toBe(0.5);
  });
});
