import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "./builtin-maps.ts";

export interface FishNetSkillLabel {
  networkBehaviourType: string;
  rpcName: string;
  field: string;
  value: string;
  label: string;
  confidence: string;
  repetitions: number;
}

export interface FishNetSemanticMap {
  schemaVersion: 1;
  buildFingerprint: string;
  verifiedSkillLabels: FishNetSkillLabel[];
}

const SEMANTIC_URLS: Readonly<Record<string, URL>> = {
  "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4":
    new URL("./maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.semantics.json", import.meta.url),
};
const cache = new Map<string, FishNetSemanticMap>();

export function loadBundledFishNetSemanticMap(
  buildFingerprint: string = CURRENT_FISHNET_BUILD_FINGERPRINT,
): FishNetSemanticMap {
  const url = SEMANTIC_URLS[buildFingerprint];
  if (!url) throw new Error(`no bundled semantic map for FishNet build ${JSON.stringify(buildFingerprint)}`);
  const cached = cache.get(buildFingerprint);
  if (cached) return cached;
  const parsed: unknown = JSON.parse(readFileSync(fileURLToPath(url), "utf8"));
  if (!isSemanticMap(parsed) || parsed.buildFingerprint !== buildFingerprint) {
    throw new Error(`invalid bundled semantic map for FishNet build ${buildFingerprint}`);
  }
  cache.set(buildFingerprint, parsed);
  return parsed;
}

function isSemanticMap(value: unknown): value is FishNetSemanticMap {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FishNetSemanticMap>;
  return candidate.schemaVersion === 1
    && typeof candidate.buildFingerprint === "string"
    && Array.isArray(candidate.verifiedSkillLabels)
    && candidate.verifiedSkillLabels.every((entry) => {
      return entry !== null
        && typeof entry === "object"
        && typeof entry.value === "string"
        && typeof entry.label === "string"
        && typeof entry.networkBehaviourType === "string"
        && typeof entry.rpcName === "string"
        && typeof entry.field === "string"
        && typeof entry.confidence === "string"
        && Number.isInteger(entry.repetitions);
    });
}
