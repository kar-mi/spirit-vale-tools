/** SHA-256 of the canonical current-build source manifest. */
export const CURRENT_GAME_BUILD_FINGERPRINT = "d8c3d98122064edd87c515bbc42ea8503f716e13d1139864b7cc2ec262a8b57d";

export const BUNDLED_GAME_BUILD_FINGERPRINTS = [
  CURRENT_GAME_BUILD_FINGERPRINT,
] as const;

export type GameBuildFingerprint = (typeof BUNDLED_GAME_BUILD_FINGERPRINTS)[number];
