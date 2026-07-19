import { FISHNET_RPC_MAP } from "./rpc-definitions/index.ts";
import type { FishNetRpcMap } from "./types.ts";
import { CURRENT_GAME_BUILD_FINGERPRINT, LEGACY_GAME_BUILD_FINGERPRINT } from "../game-build.ts";

/** @deprecated Use CURRENT_GAME_BUILD_FINGERPRINT. */
export const CURRENT_FISHNET_BUILD_FINGERPRINT = CURRENT_GAME_BUILD_FINGERPRINT;

const LEGACY_FISHNET_RPC_MAP = {
  ...FISHNET_RPC_MAP,
  buildFingerprint: LEGACY_GAME_BUILD_FINGERPRINT,
} as const satisfies FishNetRpcMap;

const MAPS = {
  [LEGACY_GAME_BUILD_FINGERPRINT]: LEGACY_FISHNET_RPC_MAP,
  [CURRENT_GAME_BUILD_FINGERPRINT]: FISHNET_RPC_MAP,
} as const;

export type BundledFishNetBuildFingerprint = keyof typeof MAPS;

/** @deprecated Use BUNDLED_GAME_BUILD_FINGERPRINTS. */
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
