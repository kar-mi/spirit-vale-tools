import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { DpsAppTab } from "./app-types.ts";
import {
  DPS_WINDOW_DEFAULT_HEIGHT,
  DPS_WINDOW_DEFAULT_WIDTH,
  DPS_WINDOW_MINIMUM_HEIGHT,
  DPS_WINDOW_MINIMUM_WIDTH,
} from "./window-size.ts";

export interface DpsAppSettings {
  personalName: string;
  tab: DpsAppTab;
  frame: { x: number; y: number; width: number; height: number };
}

const DEFAULT_SETTINGS: DpsAppSettings = {
  personalName: "",
  tab: "all",
  frame: { x: 80, y: 80, width: DPS_WINDOW_DEFAULT_WIDTH, height: DPS_WINDOW_DEFAULT_HEIGHT },
};

export async function loadDpsAppSettings(settingsPath?: string): Promise<DpsAppSettings> {
  const resolvedSettingsPath = await resolveSettingsPath(settingsPath);
  try {
    const candidate = JSON.parse(await readFile(resolvedSettingsPath, "utf8")) as Partial<DpsAppSettings>;
    return {
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

async function resolveSettingsPath(settingsPath: string | undefined): Promise<string> {
  if (settingsPath) return settingsPath;
  const { Utils } = await import("electrobun/bun");
  return path.join(Utils.paths.userData, "spirit-vale-dps", "settings.json");
}

function validFrame(value: unknown): value is DpsAppSettings["frame"] {
  if (typeof value !== "object" || value === null) return false;
  const frame = value as Record<string, unknown>;
  return ["x", "y", "width", "height"].every((key) => typeof frame[key] === "number" && Number.isFinite(frame[key]))
    && (frame["width"] as number) >= DPS_WINDOW_MINIMUM_WIDTH
    && (frame["height"] as number) >= DPS_WINDOW_MINIMUM_HEIGHT;
}
