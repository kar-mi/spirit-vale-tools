import { readFileSync } from "node:fs";

import type { FishNetRpcMap } from "./types.ts";

export function loadFishNetRpcMap(file: string): FishNetRpcMap {
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  if (!isRpcMap(parsed)) throw new Error(`invalid FishNet RPC map: ${file}`);
  return parsed;
}

function isRpcMap(value: unknown): value is FishNetRpcMap {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FishNetRpcMap>;
  return candidate.schemaVersion === 1
    && typeof candidate.buildFingerprint === "string"
    && Number.isInteger(candidate.metadataVersion)
    && Array.isArray(candidate.symbols);
}
