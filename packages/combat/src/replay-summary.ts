import { compact, count, warnings } from "@spiritvale/core";
import { loadDpsReplay } from "./replay.ts";

export interface CombatReplaySummary {
  encounters: number;
  totalDamage: number;
  durationMs: number;
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

export async function formatCombatReplaySummary(path: string): Promise<string> {
  const summary = await readCombatReplaySummary(path);
  return `${count(summary.encounters, "encounter")} · ${compact(summary.totalDamage)} damage · ${duration(summary.durationMs)}${warnings(summary.invalidLines)}`;
}

function duration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
