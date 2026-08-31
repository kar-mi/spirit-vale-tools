import { CURRENT_GAME_BUILD_FINGERPRINT } from "../../game-build.ts";
import { CURRENT_BUILD_MAP_NAMES } from "../generated/map-names.current.ts";

const MAPS: Readonly<Record<string, Readonly<Record<number, string>>>> = {
  [CURRENT_GAME_BUILD_FINGERPRINT]: CURRENT_BUILD_MAP_NAMES,
};

/** Returns the public display name for a current-build FishNet map ID. */
export function resolveBundledMapName(mapId: number, buildFingerprint: string = CURRENT_GAME_BUILD_FINGERPRINT): string | undefined {
  return MAPS[buildFingerprint]?.[mapId];
}
