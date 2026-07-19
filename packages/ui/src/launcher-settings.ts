import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Utils } from "electrobun/bun";

export interface LauncherSettings {
  captureAdapter: "auto" | string;
}

const defaults: LauncherSettings = { captureAdapter: "auto" };
const directory = path.join(Utils.paths.userData, "spirit-vale-tools");
const defaultFile = path.join(directory, "settings.json");

export async function loadLauncherSettings(file = defaultFile): Promise<LauncherSettings> {
  try {
    const candidate = JSON.parse(await readFile(file, "utf8")) as Partial<LauncherSettings>;
    return {
      captureAdapter: typeof candidate.captureAdapter === "string" && candidate.captureAdapter.trim()
        ? candidate.captureAdapter
        : defaults.captureAdapter,
    };
  } catch {
    return { ...defaults };
  }
}

export async function saveLauncherSettings(settings: LauncherSettings, file = defaultFile): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
