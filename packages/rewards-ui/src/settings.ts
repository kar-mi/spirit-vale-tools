import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveLocalStorageRoot } from "@spiritvale/ui-theme/local-storage";
import type { WindowFrame } from "@spiritvale/ui-theme/window-chrome";
import type { RewardsAppView } from "./app-types.ts";

export interface RewardsAppSettings {
  frame: WindowFrame;
  catalogFrame: WindowFrame;
  pinned: boolean;
  view: RewardsAppView;
}

const defaults: RewardsAppSettings = {
  frame: { x: 120, y: 90, width: 1020, height: 695 },
  catalogFrame: { x: 170, y: 140, width: 830, height: 745 },
  pinned: false,
  view: "summary",
};
const defaultSettingsPath = path.join(resolveLocalStorageRoot(), "data", "settings", "rewards.json");

export async function loadRewardsSettings(settingsPath = defaultSettingsPath): Promise<RewardsAppSettings> {
  try {
    const value = JSON.parse(await readFile(settingsPath, "utf8")) as Partial<RewardsAppSettings>;
    return {
      frame: validFrame(value.frame) ? value.frame : defaults.frame,
      catalogFrame: validFrame(value.catalogFrame) ? value.catalogFrame : defaults.catalogFrame,
      pinned: typeof value.pinned === "boolean" ? value.pinned : defaults.pinned,
      view: value.view === "summary" || value.view === "recent" || value.view === "trends" ? value.view : defaults.view,
    };
  } catch { return { ...defaults, frame: { ...defaults.frame }, catalogFrame: { ...defaults.catalogFrame } }; }
}

export async function saveRewardsSettings(settings: RewardsAppSettings, settingsPath = defaultSettingsPath): Promise<void> {
  await mkdir(path.dirname(settingsPath), { recursive: true });
  await writeFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

function validFrame(value: unknown): value is RewardsAppSettings["frame"] {
  if (typeof value !== "object" || value === null) return false;
  const frame = value as Record<string, unknown>;
  return ["x", "y", "width", "height"].every((key) => typeof frame[key] === "number" && Number.isFinite(frame[key]));
}
