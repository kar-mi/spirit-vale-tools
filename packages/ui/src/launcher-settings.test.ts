import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadLauncherSettings, saveLauncherSettings } from "./launcher-settings.ts";

let temporaryRoot: string | undefined;

afterEach(async () => {
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
  temporaryRoot = undefined;
});

test("launcher UI scale defaults to 100% and rejects unsupported values", async () => {
  const settingsPath = await createSettingsPath();
  await writeFile(settingsPath, JSON.stringify({ uiScale: 1.5 }), "utf8");
  expect((await loadLauncherSettings(settingsPath)).uiScale).toBe(1.5);

  await writeFile(settingsPath, JSON.stringify({ uiScale: 1.1 }), "utf8");
  expect((await loadLauncherSettings(settingsPath)).uiScale).toBe(1);

  await writeFile(settingsPath, "{}", "utf8");
  expect((await loadLauncherSettings(settingsPath)).uiScale).toBe(1);
});

test("launcher UI scale round-trips with capture settings", async () => {
  const settingsPath = await createSettingsPath();
  await saveLauncherSettings({ captureAdapter: "auto", uiScale: 2 }, settingsPath);
  expect(await loadLauncherSettings(settingsPath)).toEqual({ captureAdapter: "auto", uiScale: 2 });
});

async function createSettingsPath(): Promise<string> {
  temporaryRoot ??= await mkdtemp(path.join(tmpdir(), "spiritvale-launcher-settings-"));
  return path.join(temporaryRoot, "settings.json");
}
