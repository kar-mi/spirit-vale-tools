/** SHA-256 of the canonical current-build source manifest. */
export const CURRENT_GAME_BUILD_FINGERPRINT = "866d79aa379d16dcaca7da56514560e0b9d3c8de49bed5a368509f33b0fd860c";

export const BUNDLED_GAME_BUILD_FINGERPRINTS = [
  CURRENT_GAME_BUILD_FINGERPRINT,
] as const;

export type GameBuildFingerprint = (typeof BUNDLED_GAME_BUILD_FINGERPRINTS)[number];
