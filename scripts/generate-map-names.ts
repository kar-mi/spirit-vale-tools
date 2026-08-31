#!/usr/bin/env bun
/**
 * Regenerates `packages/capture/src/fishnet/generated/map-names.current.ts` from a
 * `maps.json` export for the current game build, replacing the hand-pasted table added in
 * commit 70a8d83.
 *
 * `maps.json`'s `mapId` field is the real FishNet wire id (`Map.Id`, read directly off the
 * runtime `Map` MonoBehaviour by the data mine's extraction pipeline) - it is not a separate
 * catalog id needing translation, and duplicate display names across different ids are expected
 * (multiple `mapId`s can share one display name).
 *
 * Usage: `bun run scripts/generate-map-names.ts <path/to/maps.json>`
 * The path is required - this script has no default and no assumption about where a
 * data-mine-style export lives relative to this repo (that varies per machine/checkout and is
 * not this repo's concern to hardcode).
 *
 * After running: review `generated/map-names.current.ts`, then run the capture
 * package's tests.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.resolve(
  SCRIPT_DIR,
  "../packages/capture/src/fishnet/generated/map-names.current.ts",
);

interface DataMineMap {
  mapId: number;
  displayName: string;
}

const USAGE = "Usage: bun run scripts/generate-map-names.ts <path/to/maps.json>";
const LINE_WIDTH = 118;

function resolveInputFile(): string {
  const arg = process.argv[2];
  if (!arg) throw new Error(USAGE);
  return path.resolve(process.cwd(), arg);
}

function loadMaps(inputFile: string): DataMineMap[] {
  if (!existsSync(inputFile)) {
    throw new Error(`maps.json not found at ${inputFile}. Pass its path as an argument, or export a current one first.`);
  }
  return JSON.parse(readFileSync(inputFile, "utf8")) as DataMineMap[];
}

/** Wraps `mapId: "name",` entries into lines no wider than LINE_WIDTH, matching the prior hand-formatted table. */
function formatEntries(maps: DataMineMap[]): string {
  const entries = maps
    .slice()
    .sort((a, b) => a.mapId - b.mapId)
    .map((map) => `${map.mapId}: ${JSON.stringify(map.displayName)},`);

  const lines: string[] = [];
  let currentLine = "  ";
  for (const entry of entries) {
    const candidate = currentLine === "  " ? currentLine + entry : `${currentLine} ${entry}`;
    if (candidate.length > LINE_WIDTH && currentLine !== "  ") {
      lines.push(currentLine);
      currentLine = `  ${entry}`;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine !== "  ") lines.push(currentLine);
  return lines.join("\n");
}

function main(): void {
  const inputFile = resolveInputFile();
  const maps = loadMaps(inputFile);

  let content = "/** AUTO-GENERATED from the matched current-build static map catalog. */\n";
  content += "export const CURRENT_BUILD_MAP_NAMES: Readonly<Record<number, string>> = {\n";
  content += formatEntries(maps);
  content += "\n};\n";

  writeFileSync(OUTPUT_FILE, content, "utf8");

  console.log(`Generated ${maps.length} map names from ${inputFile}.`);
}

main();
