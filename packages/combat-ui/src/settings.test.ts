import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadDpsAppSettings, saveDpsAppSettings } from "./settings.ts";

let temporaryRoot: string | undefined;

afterEach(async () => {
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
  temporaryRoot = undefined;
});

describe("DPS app settings", () => {
  test("defaults and clamps persisted opacity", async () => {
    const settingsPath = await createSettingsPath();
    const cases = [
      { value: undefined, expected: 1 },
      { value: 0.65, expected: 0.65 },
      { value: 0.1, expected: 0.2 },
      { value: -0.2, expected: 0.2 },
      { value: 2, expected: 1 },
      { value: "invalid", expected: 1 },
    ];

    for (const { value, expected } of cases) {
      await writeFile(settingsPath, JSON.stringify({ opacity: value }), "utf8");
      expect((await loadDpsAppSettings(settingsPath)).opacity).toBe(expected);
    }
  });

  test("round-trips opacity with the remaining DPS settings", async () => {
    const settingsPath = await createSettingsPath();
    const settings = {
      pinned: false,
      opacity: 0.7,
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
