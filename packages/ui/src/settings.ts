import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { DpsAppTab } from "./app-types.ts";

export interface DpsAppSettings {
  pinned: boolean;
  opacity: number;
  personalName: string;
  tab: DpsAppTab;
  frame: { x: number; y: number; width: number; height: number };
}

export const MINIMUM_DPS_OPACITY = 0.2;

const DEFAULT_SETTINGS: DpsAppSettings = {
  pinned: true,
  opacity: 1,
  personalName: "",
  tab: "all",
  frame: { x: 80, y: 80, width: 420, height: 560 },
};

export async function loadDpsAppSettings(settingsPath?: string): Promise<DpsAppSettings> {
  const resolvedSettingsPath = await resolveSettingsPath(settingsPath);
  try {
    const candidate = JSON.parse(await readFile(resolvedSettingsPath, "utf8")) as Partial<DpsAppSettings>;
    return {
      pinned: typeof candidate.pinned === "boolean" ? candidate.pinned : DEFAULT_SETTINGS.pinned,
      opacity: normalizeDpsOpacity(candidate.opacity),
      personalName: typeof candidate.personalName === "string" ? candidate.personalName.trim() : "",
      tab: candidate.tab === "personal" ? "personal" : "all",
      frame: validFrame(candidate.frame) ? candidate.frame : { ...DEFAULT_SETTINGS.frame },
    };
  } catch {
    return { ...DEFAULT_SETTINGS, frame: { ...DEFAULT_SETTINGS.frame } };
  }
}

export async function saveDpsAppSettings(settings: DpsAppSettings, settingsPath?: string): Promise<void> {
  const resolvedSettingsPath = await resolveSettingsPath(settingsPath);
  await mkdir(path.dirname(resolvedSettingsPath), { recursive: true });
  await writeFile(resolvedSettingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

export function normalizeDpsOpacity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_SETTINGS.opacity;
  return Math.max(MINIMUM_DPS_OPACITY, Math.min(1, value));
}

async function resolveSettingsPath(settingsPath: string | undefined): Promise<string> {
  if (settingsPath) return settingsPath;
  const { Utils } = await import("electrobun/bun");
  return path.join(Utils.paths.userData, "spirit-vale-dps", "settings.json");
}

function validFrame(value: unknown): value is DpsAppSettings["frame"] {
  if (typeof value !== "object" || value === null) return false;
  const frame = value as Record<string, unknown>;
  return ["x", "y", "width", "height"].every((key) => typeof frame[key] === "number" && Number.isFinite(frame[key]))
    && (frame["width"] as number) >= 320
    && (frame["height"] as number) >= 360;
}
