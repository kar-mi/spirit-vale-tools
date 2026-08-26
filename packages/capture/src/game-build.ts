/** SHA-256 of the canonical current-build source manifest. */
export const CURRENT_GAME_BUILD_FINGERPRINT = "53305f369c4176d4b7644d06ad7f0cdc5c9bda6563144d0ce8cff3d12c520158";

export const BUNDLED_GAME_BUILD_FINGERPRINTS = [
  CURRENT_GAME_BUILD_FINGERPRINT,
] as const;

export type GameBuildFingerprint = (typeof BUNDLED_GAME_BUILD_FINGERPRINTS)[number];
