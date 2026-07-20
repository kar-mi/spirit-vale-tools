import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Utils } from "electrobun/bun";
import { normalizeUiScale, type UiScale } from "@spiritvale/ui-theme/ui-scale";

export interface LauncherSettings {
  captureAdapter: "auto" | string;
  uiScale: UiScale;
}

const defaults: LauncherSettings = { captureAdapter: "auto", uiScale: 1 };
export async function loadLauncherSettings(file = defaultSettingsFile()): Promise<LauncherSettings> {
  try {
    const candidate = JSON.parse(await readFile(file, "utf8")) as Partial<LauncherSettings>;
    return {
      captureAdapter: typeof candidate.captureAdapter === "string" && candidate.captureAdapter.trim()
        ? candidate.captureAdapter
        : defaults.captureAdapter,
      uiScale: normalizeUiScale(candidate.uiScale),
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
  return path.join(Utils.paths.userData, "spirit-vale-tools", "settings.json");
}
