import { loadDpsReplay } from "@spiritvale/combat";
import { loadRewardReplay } from "@spiritvale/rewards";

export interface CombatReplaySummary {
  encounters: number;
  totalDamage: number;
  durationMs: number;
  invalidLines: number;
}

export interface RewardsReplaySummary {
  kills: number;
  mobs: number;
  experience: number;
  coins: bigint;
  invalidLines: number;
}

export async function readCombatReplaySummary(path: string): Promise<CombatReplaySummary> {
  const replay = await loadDpsReplay(path);
  const encounters = replay.meter.getSnapshots();
  return {
    encounters: encounters.length,
    totalDamage: encounters.reduce((total, encounter) => total + encounter.totalDamage, 0),
    durationMs: encounters.reduce((total, encounter) => total + encounter.durationMs, 0),
    invalidLines: replay.invalidLines,
  };
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

export async function formatCombatReplaySummary(path: string): Promise<string> {
  const summary = await readCombatReplaySummary(path);
  return `${count(summary.encounters, "encounter")} · ${compact(summary.totalDamage)} damage · ${duration(summary.durationMs)}${warnings(summary.invalidLines)}`;
}

export async function formatRewardsReplaySummary(path: string): Promise<string> {
  const summary = await readRewardsReplaySummary(path);
  return `${count(summary.kills, "kill")} · ${count(summary.mobs, "mob")} · ${compact(summary.experience)} XP · ${compactBigInt(summary.coins)} coins${warnings(summary.invalidLines)}`;
}

function count(value: number, label: string): string { return `${value} ${label}${value === 1 ? "" : "s"}`; }
function compact(value: number): string { return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function compactBigInt(value: bigint): string { return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function duration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function warnings(value: number): string { return value === 0 ? "" : ` · ${value} skipped`;
}
