import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { defaultOverlaySettings, loadOverlaySettings, saveOverlaySettings } from "./settings.ts";

let temporaryRoot: string | undefined;
const bounds = { x: 0, y: 0, width: 1280, height: 720 };

afterEach(async () => {
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
  temporaryRoot = undefined;
});

describe("overlay settings", () => {
  test("defaults to unlocked with all v1 elements enabled", () => {
    const settings = defaultOverlaySettings(bounds);
    expect(settings.locked).toBe(false);
    expect(Object.values(settings.elements).every((element) => element.enabled)).toBe(true);
  });

  test("normalizes values and clamps elements to the display", async () => {
    const settingsPath = await createSettingsPath();
    await writeFile(settingsPath, JSON.stringify({
      locked: true,
      personalName: "  Fictional Hero  ",
      elements: {
        dpsChart: { enabled: false, x: 5000, y: -50, width: 500, height: 200 },
        personalDps: { x: Number.NaN, width: 10, height: 10 },
      },
    }), "utf8");

    const settings = await loadOverlaySettings(settingsPath, bounds);
    expect(settings.locked).toBe(true);
    expect(settings.personalName).toBe("Fictional Hero");
    expect(settings.elements.dpsChart).toEqual({ enabled: false, x: 780, y: 0, width: 500, height: 200 });
    expect(settings.elements.personalDps.width).toBe(160);
    expect(settings.elements.personalDps.height).toBe(100);
  });

  test("round-trips normalized settings", async () => {
    const settingsPath = await createSettingsPath();
    const settings = defaultOverlaySettings(bounds);
    settings.personalName = "Fictional Hero";
    settings.elements.partyRanking.x = 640;
    await saveOverlaySettings(settings, settingsPath);
    expect(await loadOverlaySettings(settingsPath, bounds)).toEqual(settings);
  });
});

async function createSettingsPath(): Promise<string> {
  temporaryRoot ??= await mkdtemp(path.join(tmpdir(), "spiritvale-overlay-settings-"));
  return path.join(temporaryRoot, "settings.json");
}
