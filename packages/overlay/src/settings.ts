import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  OVERLAY_ELEMENT_IDS,
  type OverlayElementId,
  type OverlayElementSettings,
} from "./app-types.ts";

export { OVERLAY_ELEMENT_IDS };
export type { OverlayElementId, OverlayElementSettings };

export interface OverlaySettings {
  schemaVersion: 2;
  locked: boolean;
  elements: Record<OverlayElementId, OverlayElementSettings>;
}

export interface DisplayBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_ELEMENTS: Record<OverlayElementId, OverlayElementSettings> = {
  dpsChart: { enabled: true, opacity: 1, x: 318, y: 775, width: 462, height: 226 },
  personalDps: { enabled: true, opacity: 1, x: 794, y: 873, width: 160, height: 127 },
  partyRanking: { enabled: true, opacity: 1, x: 315, y: 434, width: 360, height: 300 },
  health: { enabled: true, opacity: 1, x: 794, y: 695, width: 160, height: 40 },
  mana: { enabled: true, opacity: 1, x: 794, y: 741, width: 160, height: 40 },
  weight: { enabled: true, opacity: 1, x: 794, y: 787, width: 160, height: 40 },
};

export function defaultOverlaySettings(bounds: DisplayBounds): OverlaySettings {
  return normalizeOverlaySettings({}, bounds);
}

export async function loadOverlaySettings(
  settingsPath: string | undefined,
  bounds: DisplayBounds,
): Promise<OverlaySettings> {
  try {
    const candidate = JSON.parse(await readFile(await resolveSettingsPath(settingsPath), "utf8")) as unknown;
    return normalizeOverlaySettings(candidate, bounds);
  } catch {
    return defaultOverlaySettings(bounds);
  }
}

export async function saveOverlaySettings(settings: OverlaySettings, settingsPath?: string): Promise<void> {
  const target = await resolveSettingsPath(settingsPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

export function normalizeOverlaySettings(candidate: unknown, bounds: DisplayBounds): OverlaySettings {
  const source = candidate && typeof candidate === "object" ? candidate as Record<string, unknown> : {};
  const legacySettings = source.schemaVersion !== 2;
  const sourceElements = source.elements && typeof source.elements === "object"
    ? source.elements as Record<string, unknown>
    : {};
  const elements = Object.fromEntries(OVERLAY_ELEMENT_IDS.map((id) => {
    const defaults = DEFAULT_ELEMENTS[id];
    const value = sourceElements[id] && typeof sourceElements[id] === "object"
      ? sourceElements[id] as Record<string, unknown>
      : {};
    const width = clampNumber(value.width, defaults.width, 160, Math.max(160, bounds.width));
    const minimumHeight = id === "health" || id === "mana" || id === "weight" ? 40 : 100;
    const savedHeight = legacySettings && id === "weight" && value.height === 72
      ? defaults.height
      : value.height;
    const height = clampNumber(savedHeight, defaults.height, minimumHeight, Math.max(minimumHeight, bounds.height));
    return [id, {
      enabled: typeof value.enabled === "boolean" ? value.enabled : defaults.enabled,
      opacity: normalizeOpacity(value.opacity ?? source.opacity),
      x: clampNumber(value.x, defaults.x, 0, Math.max(0, bounds.width - width)),
      y: clampNumber(value.y, defaults.y, 0, Math.max(0, bounds.height - height)),
      width,
      height,
    }];
  })) as unknown as Record<OverlayElementId, OverlayElementSettings>;
  return {
    schemaVersion: 2,
    locked: typeof source.locked === "boolean" ? source.locked : false,
    elements,
  };
}

function normalizeOpacity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.round(Math.max(0.2, Math.min(1, value)) * 20) / 20;
}

function clampNumber(value: unknown, fallback: number, minimum: number, maximum: number): number {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.round(Math.max(minimum, Math.min(maximum, number)));
}

async function resolveSettingsPath(settingsPath: string | undefined): Promise<string> {
  if (settingsPath) return settingsPath;
  const { Utils } = await import("electrobun/bun");
  return path.join(Utils.paths.userData, "spirit-vale-overlay", "settings.json");
}
