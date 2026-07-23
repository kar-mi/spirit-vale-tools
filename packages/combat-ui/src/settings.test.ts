import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadDpsAppSettings, saveDpsAppSettings } from "./settings.ts";

let temporaryRoot: string | undefined;

afterEach(async () => {
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
  temporaryRoot = undefined;
});

describe("DPS app settings", () => {
  test("round-trips DPS tool settings", async () => {
    const settingsPath = await createSettingsPath();
    const settings = {
      personalName: "Fictional Hero",
      tab: "personal" as const,
      frame: { x: 120, y: 140, width: 420, height: 560 },
    };

    await saveDpsAppSettings(settings, settingsPath);

    expect(await loadDpsAppSettings(settingsPath)).toEqual(settings);
  });
});

async function createSettingsPath(): Promise<string> {
  temporaryRoot ??= await mkdtemp(path.join(tmpdir(), "spiritvale-dps-settings-"));
  return path.join(temporaryRoot, "settings.json");
}
