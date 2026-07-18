import { FISHNET_RPC_MAP } from "./rpc-definitions/index.ts";
import type { FishNetRpcMap } from "./types.ts";

export const CURRENT_FISHNET_BUILD_FINGERPRINT = "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4";

const MAPS = {
  "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4": FISHNET_RPC_MAP,
} as const;

export type BundledFishNetBuildFingerprint = keyof typeof MAPS;

export const BUNDLED_FISHNET_BUILD_FINGERPRINTS = Object.freeze(
  Object.keys(MAPS) as BundledFishNetBuildFingerprint[],
);

export function loadBundledFishNetRpcMap(
  buildFingerprint: string = CURRENT_FISHNET_BUILD_FINGERPRINT,
): FishNetRpcMap {
  if (!isBundledFingerprint(buildFingerprint)) {
    throw new Error(
      `unsupported bundled FishNet build fingerprint ${JSON.stringify(buildFingerprint)}; supported: ` +
        BUNDLED_FISHNET_BUILD_FINGERPRINTS.join(", "),
    );
  }
  return MAPS[buildFingerprint];
}

function isBundledFingerprint(value: string): value is BundledFishNetBuildFingerprint {
  return Object.hasOwn(MAPS, value);
}
