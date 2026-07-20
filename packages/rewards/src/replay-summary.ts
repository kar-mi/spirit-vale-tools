import { compact, count, warnings } from "@spiritvale/core";
import { loadRewardReplay } from "./live-log.ts";

export interface RewardsReplaySummary {
  kills: number;
  mobs: number;
  experience: number;
  coins: bigint;
  invalidLines: number;
}

export async function readRewardsReplaySummary(path: string): Promise<RewardsReplaySummary> {
  const replay = await loadRewardReplay(path);
  return {
    kills: replay.snapshot.kills.length,
    mobs: replay.snapshot.mobs.length,
    experience: replay.snapshot.totalExperience,
    coins: replay.snapshot.totalCoins,
    invalidLines: replay.invalidLines,
  };
}

export async function formatRewardsReplaySummary(path: string): Promise<string> {
  const summary = await readRewardsReplaySummary(path);
  return `${count(summary.kills, "kill")} · ${count(summary.mobs, "mob")} · ${compact(summary.experience)} XP · ${compact(summary.coins)} coins${warnings(summary.invalidLines)}`;
}
