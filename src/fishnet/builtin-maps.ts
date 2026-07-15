import { fileURLToPath } from "node:url";

import { loadFishNetRpcMap } from "./rpc-map.ts";
import type { FishNetRpcMapV2 } from "./types.ts";

export const CURRENT_FISHNET_BUILD_FINGERPRINT = "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4";

const MAP_URLS = {
  "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4":
    new URL("./maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.rpc.json", import.meta.url),
} as const;

export type BundledFishNetBuildFingerprint = keyof typeof MAP_URLS;

export const BUNDLED_FISHNET_BUILD_FINGERPRINTS = Object.freeze(
  Object.keys(MAP_URLS) as BundledFishNetBuildFingerprint[],
);

const cache = new Map<BundledFishNetBuildFingerprint, FishNetRpcMapV2>();

export function loadBundledFishNetRpcMap(
  buildFingerprint: string = CURRENT_FISHNET_BUILD_FINGERPRINT,
): FishNetRpcMapV2 {
  if (!isBundledFingerprint(buildFingerprint)) {
    throw new Error(
      `unsupported bundled FishNet build fingerprint ${JSON.stringify(buildFingerprint)}; supported: ` +
        BUNDLED_FISHNET_BUILD_FINGERPRINTS.join(", "),
    );
  }
  const cached = cache.get(buildFingerprint);
  if (cached) return cached;
  const loaded = loadFishNetRpcMap(fileURLToPath(MAP_URLS[buildFingerprint]), { expectedBuildFingerprint: buildFingerprint });
  if (loaded.schemaVersion !== 2) throw new Error(`bundled FishNet map ${buildFingerprint} must use schema version 2`);
  cache.set(buildFingerprint, loaded);
  return loaded;
}

function isBundledFingerprint(value: string): value is BundledFishNetBuildFingerprint {
  return Object.hasOwn(MAP_URLS, value);
}
