import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Utils } from "electrobun/bun";

import type { DpsAppTab } from "./app-types.ts";

export interface DpsAppSettings {
  pinned: boolean;
  personalName: string;
  tab: DpsAppTab;
  frame: { x: number; y: number; width: number; height: number };
}

const DEFAULT_SETTINGS: DpsAppSettings = {
  pinned: true,
  personalName: "",
  tab: "all",
  frame: { x: 80, y: 80, width: 420, height: 560 },
};

const settingsDirectory = path.join(Utils.paths.userData, "spirit-vale-dps");
const settingsPath = path.join(settingsDirectory, "settings.json");

export async function loadDpsAppSettings(): Promise<DpsAppSettings> {
  try {
    const candidate = JSON.parse(await readFile(settingsPath, "utf8")) as Partial<DpsAppSettings>;
    return {
      pinned: typeof candidate.pinned === "boolean" ? candidate.pinned : DEFAULT_SETTINGS.pinned,
      personalName: typeof candidate.personalName === "string" ? candidate.personalName.trim() : "",
      tab: candidate.tab === "personal" ? "personal" : "all",
      frame: validFrame(candidate.frame) ? candidate.frame : { ...DEFAULT_SETTINGS.frame },
    };
  } catch {
    return { ...DEFAULT_SETTINGS, frame: { ...DEFAULT_SETTINGS.frame } };
  }
}

export async function saveDpsAppSettings(settings: DpsAppSettings): Promise<void> {
  await mkdir(settingsDirectory, { recursive: true });
  await writeFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

function validFrame(value: unknown): value is DpsAppSettings["frame"] {
  if (typeof value !== "object" || value === null) return false;
  const frame = value as Record<string, unknown>;
  return ["x", "y", "width", "height"].every((key) => typeof frame[key] === "number" && Number.isFinite(frame[key]))
    && (frame["width"] as number) >= 320
    && (frame["height"] as number) >= 360;
}
