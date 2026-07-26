import { FISHNET_RPC_MAP } from "./rpc-definitions/index.ts";
import type { FishNetRpcMap } from "./types.ts";
import {
  BUNDLED_GAME_BUILD_FINGERPRINTS,
  CURRENT_GAME_BUILD_FINGERPRINT,
  LEGACY_GAME_BUILD_FINGERPRINT,
} from "../game-build.ts";

const LEGACY_FISHNET_RPC_MAP = {
  ...FISHNET_RPC_MAP,
  buildFingerprint: LEGACY_GAME_BUILD_FINGERPRINT,
} as const satisfies FishNetRpcMap;

const MAPS = {
  [LEGACY_GAME_BUILD_FINGERPRINT]: LEGACY_FISHNET_RPC_MAP,
  [CURRENT_GAME_BUILD_FINGERPRINT]: FISHNET_RPC_MAP,
} as const;

export type BundledFishNetBuildFingerprint = keyof typeof MAPS;

export function loadBundledFishNetRpcMap(
  buildFingerprint: string = CURRENT_GAME_BUILD_FINGERPRINT,
): FishNetRpcMap {
  if (!isBundledFingerprint(buildFingerprint)) {
    throw new Error(
      `unsupported bundled FishNet build fingerprint ${JSON.stringify(buildFingerprint)}; supported: ` +
        BUNDLED_GAME_BUILD_FINGERPRINTS.join(", "),
    );
  }
  return MAPS[buildFingerprint];
}

function isBundledFingerprint(value: string): value is BundledFishNetBuildFingerprint {
  return Object.hasOwn(MAPS, value);
}
