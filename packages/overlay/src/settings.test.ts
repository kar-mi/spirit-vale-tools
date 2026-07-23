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
  test("defaults to unlocked with all elements, including weight, enabled", () => {
    const settings = defaultOverlaySettings(bounds);
    expect(settings.locked).toBe(false);
    expect(Object.values(settings.elements).every((element) => element.enabled)).toBe(true);
    expect(Object.values(settings.elements).every((element) => element.opacity === 1)).toBe(true);
    expect(settings.elements.weight).toEqual({ enabled: true, opacity: 1, x: 794, y: 648, width: 160, height: 72 });
  });

  test("normalizes values and clamps elements to the display", async () => {
    const settingsPath = await createSettingsPath();
    await writeFile(settingsPath, JSON.stringify({
      locked: true,
      opacity: 0.53,
      personalName: "  Fictional Hero  ",
      elements: {
        dpsChart: { enabled: false, x: 5000, y: -50, width: 500, height: 200 },
        personalDps: { x: Number.NaN, width: 10, height: 10 },
      },
    }), "utf8");

    const settings = await loadOverlaySettings(settingsPath, bounds);
    expect(settings.locked).toBe(true);
    expect(Object.values(settings.elements).every((element) => element.opacity === 0.55)).toBe(true);
    expect(settings).not.toHaveProperty("personalName");
    expect(settings.elements.dpsChart).toEqual({ enabled: false, opacity: 0.55, x: 780, y: 0, width: 500, height: 200 });
    expect(settings.elements.personalDps.width).toBe(160);
    expect(settings.elements.personalDps.height).toBe(100);
    expect(settings.elements.weight.enabled).toBe(true);
    expect(settings.elements.weight.height).toBe(72);
  });

  test("round-trips normalized settings", async () => {
    const settingsPath = await createSettingsPath();
    const settings = defaultOverlaySettings(bounds);
    settings.elements.partyRanking.x = 640;
    await saveOverlaySettings(settings, settingsPath);
    expect(await loadOverlaySettings(settingsPath, bounds)).toEqual(settings);
  });
});

async function createSettingsPath(): Promise<string> {
  temporaryRoot ??= await mkdtemp(path.join(tmpdir(), "spiritvale-overlay-settings-"));
  return path.join(temporaryRoot, "settings.json");
}
