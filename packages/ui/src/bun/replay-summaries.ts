import { loadRewardReplay } from "@spiritvale/rewards";

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
  return `${count(summary.kills, "kill")} · ${count(summary.mobs, "mob")} · ${compact(summary.experience)} XP · ${compactBigInt(summary.coins)} coins${warnings(summary.invalidLines)}`;
}

function count(value: number, label: string): string { return `${value} ${label}${value === 1 ? "" : "s"}`; }
function compact(value: number): string { return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function compactBigInt(value: bigint): string { return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function warnings(value: number): string { return value === 0 ? "" : ` · ${value} skipped`;
}
