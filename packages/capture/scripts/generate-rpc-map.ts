#!/usr/bin/env bun
/**
 * Regenerates `fishnet/rpc-definitions/generated/` from an `rpc-build.json` export for the
 * current game build, replacing the old manual copy/paste into one 12k+ line pasted file.
 *
 * `generated/` is fully script-owned - it is wiped and rewritten every run, so nothing
 * hand-authored may live there, and nothing outside it overrides what it produces: every
 * behaviour's `rpcs`/`syncTypes`, every broadcast, and every prefab layout comes straight from
 * this script's output with no hand-maintained fallback.
 *
 * Prefab layouts (including `prefabName`, which the `rpc-build.json` export's embedded
 * `prefabs` lacks) are read separately from a `prefab-layouts.json` export: its `rpcPrefabs`
 * view is the same wire-safe component list embedded in rpc-build.json, and its `prefabs`
 * view carries the names. Joining the two by collectionId+prefabId gives the full
 * `FishNetPrefabDefinition` for `generated/prefabs.ts` - nothing about prefabs needs hand
 * maintenance either.
 *
 * Usage: `bun run packages/capture/scripts/generate-rpc-map.ts <path/to/rpc-build.json> <path/to/prefab-layouts.json>`
 * Both paths are required - this script has no default and no assumption about where a
 * data-mine-style export lives relative to this repo (that varies per machine/checkout and is
 * not this repo's concern to hardcode).
 *
 * After running: review the diff under `generated/`, then run the capture package's tests.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type {
  FishNetBroadcastDefinition,
  FishNetPrefabComponentDefinition,
  FishNetPrefabDefinition,
  FishNetRpcDefinition,
  FishNetSyncTypeDefinition,
} from "../src/fishnet/definitions/rpc-map.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.resolve(SCRIPT_DIR, "../src/fishnet/rpc-definitions/generated");
const GAME_BUILD_FILE = path.resolve(SCRIPT_DIR, "../src/game-build.ts");

interface DataMineBehaviour {
  typeName: string;
  rpcs?: FishNetRpcDefinition[];
  syncTypes?: FishNetSyncTypeDefinition[];
}

interface DataMineWireMap {
  buildFingerprint: string;
  metadataVersion: number;
  behaviours: DataMineBehaviour[];
  broadcasts?: FishNetBroadcastDefinition[];
}

interface DataMineRpcBuild {
  wireMap: DataMineWireMap;
}

interface DataMinePrefab {
  collectionId: number;
  prefabId: number;
  prefabName?: string;
  components: (FishNetPrefabComponentDefinition & { rpcKnown?: boolean })[];
}

interface DataMinePrefabLayouts {
  prefabs: DataMinePrefab[];
  rpcPrefabs: DataMinePrefab[];
}

const USAGE = "Usage: bun run packages/capture/scripts/generate-rpc-map.ts <path/to/rpc-build.json> <path/to/prefab-layouts.json>";

function resolveInputFile(): string {
  const arg = process.argv[2];
  if (!arg) throw new Error(USAGE);
  return path.resolve(process.cwd(), arg);
}

function resolvePrefabLayoutsFile(): string {
  const arg = process.argv[3];
  if (!arg) throw new Error(USAGE);
  return path.resolve(process.cwd(), arg);
}

function loadWireMap(inputFile: string): DataMineWireMap {
  if (!existsSync(inputFile)) {
    throw new Error(`rpc-build.json not found at ${inputFile}. Pass its path as an argument, or export a current one first.`);
  }
  const parsed = JSON.parse(readFileSync(inputFile, "utf8")) as DataMineRpcBuild;
  return parsed.wireMap;
}

/**
 * Joins prefab-layouts.json's wire-safe `rpcPrefabs` component lists with its `prefabs`
 * view's names, keyed by collectionId+prefabId.
 */
function loadPrefabDefinitions(prefabLayoutsFile: string): FishNetPrefabDefinition[] {
  if (!existsSync(prefabLayoutsFile)) {
    throw new Error(`prefab-layouts.json not found at ${prefabLayoutsFile}. Pass its path as an argument, or export a current one first.`);
  }
  const parsed = JSON.parse(readFileSync(prefabLayoutsFile, "utf8")) as DataMinePrefabLayouts;
  const namesByKey = new Map<string, string>();
  for (const prefab of parsed.prefabs ?? []) {
    if (prefab.prefabName) namesByKey.set(`${prefab.collectionId}:${prefab.prefabId}`, prefab.prefabName);
  }
  return (parsed.rpcPrefabs ?? []).map((prefab): FishNetPrefabDefinition => {
    const prefabName = namesByKey.get(`${prefab.collectionId}:${prefab.prefabId}`);
    const components = prefab.components.map(({ index, typeName }) => ({ index, typeName }));
    return prefabName === undefined
      ? { collectionId: prefab.collectionId, prefabId: prefab.prefabId, components }
      : { collectionId: prefab.collectionId, prefabId: prefab.prefabId, prefabName, components };
  });
}

/** "FishNet.Component.Animating.NetworkAnimator" -> "NetworkAnimator"; "HealthComponent" -> "HealthComponent". */
function lastSegment(typeName: string): string {
  const dot = typeName.lastIndexOf(".");
  return dot === -1 ? typeName : typeName.slice(dot + 1);
}

function toKebabCase(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

/** Engine (FishNet built-in) behaviours live under generated/engine/ rather than mixed in with game types. */
function isEngineType(typeName: string): boolean {
  return typeName.startsWith("FishNet.");
}

interface BehaviourFileInfo {
  typeName: string;
  kebabName: string;
  relativePath: string; // relative to GENERATED_DIR, no extension
  rpcsVar: string;
  syncTypesVar?: string;
}

function behaviourFileInfo(behaviour: DataMineBehaviour): BehaviourFileInfo {
  const kebabName = toKebabCase(lastSegment(behaviour.typeName));
  const camel = toCamelCase(kebabName);
  const relativePath = isEngineType(behaviour.typeName) ? `engine/${kebabName}` : kebabName;
  return {
    typeName: behaviour.typeName,
    kebabName,
    relativePath,
    rpcsVar: `${camel}Rpcs`,
    syncTypesVar: behaviour.syncTypes && behaviour.syncTypes.length > 0 ? `${camel}SyncTypes` : undefined,
  };
}

function formatJsonLiteral(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function writeGeneratedFile(relativePath: string, content: string): void {
  const filePath = path.join(GENERATED_DIR, `${relativePath}.ts`);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

const GENERATED_HEADER = `/**
 * AUTO-GENERATED by packages/capture/scripts/generate-rpc-map.ts from an rpc-build.json
 * export. Do not hand-edit - rerun the generator instead.
 */
`;

function depthPrefix(relativePath: string): string {
  // "health-component" -> "../.."; "engine/network-animator" -> "../../.."
  const depth = relativePath.split("/").length + 1;
  return "../".repeat(depth).slice(0, -1);
}

function writeBehaviourFile(behaviour: DataMineBehaviour, info: BehaviourFileInfo): void {
  const rpcMapImportPath = `${depthPrefix(info.relativePath)}/definitions/rpc-map.ts`;
  const types = ["FishNetRpcDefinition"];
  if (info.syncTypesVar) types.push("FishNetSyncTypeDefinition");

  let content = GENERATED_HEADER;
  content += `import type { ${types.join(", ")} } from "${rpcMapImportPath}";\n\n`;
  content += `export const ${info.rpcsVar} = ${formatJsonLiteral(behaviour.rpcs ?? [])} as const satisfies readonly FishNetRpcDefinition[];\n`;
  if (info.syncTypesVar) {
    content += `\nexport const ${info.syncTypesVar} = ${formatJsonLiteral(behaviour.syncTypes)} as const satisfies readonly FishNetSyncTypeDefinition[];\n`;
  }
  writeGeneratedFile(info.relativePath, content);
}

function writeBroadcastsFile(broadcasts: FishNetBroadcastDefinition[]): void {
  let content = GENERATED_HEADER;
  content += `import type { FishNetBroadcastDefinition } from "../../definitions/rpc-map.ts";\n\n`;
  content += `export const GENERATED_BROADCASTS = ${formatJsonLiteral(broadcasts)} as const satisfies readonly FishNetBroadcastDefinition[];\n`;
  writeGeneratedFile("broadcasts", content);
}

function writePrefabsFile(prefabs: FishNetPrefabDefinition[]): void {
  let content = GENERATED_HEADER;
  content += `import type { FishNetPrefabDefinition } from "../../definitions/rpc-map.ts";\n\n`;
  content += `export const GENERATED_PREFAB_DEFINITIONS = ${formatJsonLiteral(prefabs)} as const satisfies readonly FishNetPrefabDefinition[];\n`;
  writeGeneratedFile("prefabs", content);
}

function writeManifestFile(wireMap: DataMineWireMap): void {
  let content = GENERATED_HEADER;
  content += `export const GENERATED_BUILD_FINGERPRINT = ${JSON.stringify(wireMap.buildFingerprint)};\n`;
  content += `export const GENERATED_METADATA_VERSION = ${wireMap.metadataVersion};\n`;
  writeGeneratedFile("manifest", content);
}

function writeIndexFile(behaviours: DataMineBehaviour[], infos: BehaviourFileInfo[]): void {
  let content = GENERATED_HEADER;
  content += `import type { FishNetBehaviourDefinition } from "../../definitions/rpc-map.ts";\n`;
  for (const info of infos) {
    const names = info.syncTypesVar ? `${info.rpcsVar}, ${info.syncTypesVar}` : info.rpcsVar;
    content += `import { ${names} } from "./${info.relativePath}.ts";\n`;
  }
  content += `\nexport { GENERATED_BROADCASTS } from "./broadcasts.ts";\n`;
  content += `export { GENERATED_PREFAB_DEFINITIONS } from "./prefabs.ts";\n`;
  content += `export { GENERATED_BUILD_FINGERPRINT, GENERATED_METADATA_VERSION } from "./manifest.ts";\n\n`;
  content += `export const GENERATED_BEHAVIOURS = [\n`;
  for (const info of infos) {
    const syncTypesField = info.syncTypesVar ? `, syncTypes: ${info.syncTypesVar}` : "";
    content += `  { typeName: ${JSON.stringify(info.typeName)}, rpcs: ${info.rpcsVar}${syncTypesField} },\n`;
  }
  content += `] as const satisfies readonly FishNetBehaviourDefinition[];\n`;
  writeGeneratedFile("index", content);
  void behaviours;
}

function updateGameBuildFingerprint(fingerprint: string): boolean {
  const text = readFileSync(GAME_BUILD_FILE, "utf8");
  const pattern = /(export const CURRENT_GAME_BUILD_FINGERPRINT = ")[^"]+(";)/;
  if (!pattern.test(text)) throw new Error(`Could not find CURRENT_GAME_BUILD_FINGERPRINT in ${GAME_BUILD_FILE}`);
  const changed = !text.includes(`"${fingerprint}"`);
  writeFileSync(GAME_BUILD_FILE, text.replace(pattern, `$1${fingerprint}$2`), "utf8");
  return changed;
}

function main(): void {
  const inputFile = resolveInputFile();
  const wireMap = loadWireMap(inputFile);
  const prefabLayoutsFile = resolvePrefabLayoutsFile();
  const prefabs = loadPrefabDefinitions(prefabLayoutsFile);

  if (existsSync(GENERATED_DIR)) rmSync(GENERATED_DIR, { recursive: true, force: true });
  mkdirSync(GENERATED_DIR, { recursive: true });

  const infos = wireMap.behaviours.map(behaviourFileInfo);
  wireMap.behaviours.forEach((behaviour, i) => writeBehaviourFile(behaviour, infos[i]!));
  writeBroadcastsFile(wireMap.broadcasts ?? []);
  writePrefabsFile(prefabs);
  writeManifestFile(wireMap);
  writeIndexFile(wireMap.behaviours, infos);

  const fingerprintChanged = updateGameBuildFingerprint(wireMap.buildFingerprint);

  const totalRpcs = wireMap.behaviours.reduce((sum, b) => sum + (b.rpcs?.length ?? 0), 0);
  console.log(
    `Generated ${wireMap.behaviours.length} behaviours (${totalRpcs} RPCs) and ${wireMap.broadcasts?.length ?? 0} broadcasts from ${inputFile}.`,
  );
  console.log(`Generated ${prefabs.length} prefabs from ${prefabLayoutsFile}.`);
  console.log(`Build fingerprint: ${wireMap.buildFingerprint}${fingerprintChanged ? " (updated game-build.ts)" : " (unchanged)"}`);
}

main();
