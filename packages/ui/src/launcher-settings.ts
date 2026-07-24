import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { normalizeUiScale, type UiScale } from "@spiritvale/ui-theme/ui-scale";
import { resolveLocalStorageRoot } from "@spiritvale/ui-theme/local-storage";

export interface LauncherSettings {
  captureAdapter: "auto" | string;
  uiScale: UiScale;
  minimizeToTray: boolean;
}

const defaults: LauncherSettings = { captureAdapter: "auto", uiScale: 1, minimizeToTray: false };
export async function loadLauncherSettings(file = defaultSettingsFile()): Promise<LauncherSettings> {
  try {
    const candidate = JSON.parse(await readFile(file, "utf8")) as Partial<LauncherSettings> & { closeToTray?: unknown };
    return {
      captureAdapter: typeof candidate.captureAdapter === "string" && candidate.captureAdapter.trim()
        ? candidate.captureAdapter
        : defaults.captureAdapter,
      uiScale: normalizeUiScale(candidate.uiScale),
      minimizeToTray: candidate.minimizeToTray === true || (candidate.minimizeToTray !== false && candidate.closeToTray === true),
    };
  } catch {
    return { ...defaults };
  }
}

export async function saveLauncherSettings(settings: LauncherSettings, file = defaultSettingsFile()): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

function defaultSettingsFile(): string {
  return path.join(resolveLocalStorageRoot(), "data", "settings", "launcher.json");
}
