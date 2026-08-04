/** SHA-256 of the canonical current-build source manifest. */
export const CURRENT_GAME_BUILD_FINGERPRINT = "78097699284dd7dea7a3e81d03007cf98fde9c45a4fd1141dfbbdf2eb1ab6f1d";

export const BUNDLED_GAME_BUILD_FINGERPRINTS = [
  CURRENT_GAME_BUILD_FINGERPRINT,
] as const;

export type GameBuildFingerprint = (typeof BUNDLED_GAME_BUILD_FINGERPRINTS)[number];
