import { describe, expect, test } from "bun:test";
import { LiveRewardService } from "./live-rewards.ts";
import type { FishNetMobRewardEvent } from "../tracking/reward-tracker.ts";

function kill(index: number): FishNetMobRewardEvent { return { kind: "kill", id: `kill-${index}`, tick: index, mob: { objectId: 1, mobId: "mob.synthetic", displayName: "Synthetic Mob", level: 1, boss: false }, experience: 10, jobExperience: 2, coins: 3n, drops: [], attributed: true }; }

describe("live reward aggregation", () => {
  test("keeps bounded state, exact totals, immutable snapshots, and reset revisions", () => {
    const service = new LiveRewardService({ recentKillLimit: 2, chartPoints: 2 });
    for (let index = 0; index < 5; index += 1) service.consume(kill(index));
    service.consume({ kind: "unmatched", tick: 10, reason: "expired", reward: "experience", experience: 4, jobExperience: 1, coins: 999n, drops: [] });
    const snapshot = service.snapshot();
    expect(snapshot.recentKills).toHaveLength(2); expect(snapshot.chart).toHaveLength(2); expect(snapshot.totalExperience).toBe(54); expect(snapshot.totalCoins).toBe(1_014n);
    snapshot.recentKills[0]!.drops.push({ category: "material", itemId: "mutated", count: 1 });
    expect(service.snapshot().recentKills[0]!.drops).toHaveLength(0);
    const revision = snapshot.revision; service.reset(); expect(service.snapshot().revision).toBe(revision + 1); expect(service.snapshot().killCount).toBe(0);
  });

  test("ignores duplicate kill ids consistently with session and history projections", () => {
    const service = new LiveRewardService();
    service.consume(kill(1));
    service.consume(kill(1));
    expect(service.snapshot()).toMatchObject({ killCount: 1, totalExperience: 10, totalCoins: 3n });
  });

  test("compacts the whole bucket generation instead of only the oldest pair", () => {
    const service = new LiveRewardService({ chartPoints: 10 });
    for (let index = 0; index < 1_000; index += 1) service.consume(kill(index));
    const chart = service.snapshot().chart;
    expect(chart.length).toBeLessThanOrEqual(10);
    expect(new Set(chart.map((bucket) => bucket.endMs - bucket.startMs))).toEqual(new Set([128]));
    expect(chart[0]!.endMs).toBeLessThanOrEqual(chart.at(-1)!.startMs);
    expect(chart.reduce((sum, bucket) => sum + bucket.experience, 0)).toBe(10_000);
  });
});
