export const LEGACY_GAME_BUILD_FINGERPRINT = "9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4";

/** SHA-256 of the canonical current-build source manifest. */
export const CURRENT_GAME_BUILD_FINGERPRINT = "fc0593967b49f4202a0d5915c3a858734ae5836d87ed6a92a098a5d9d13b40d7";

export const BUNDLED_GAME_BUILD_FINGERPRINTS = [
  LEGACY_GAME_BUILD_FINGERPRINT,
  CURRENT_GAME_BUILD_FINGERPRINT,
] as const;

export type GameBuildFingerprint = (typeof BUNDLED_GAME_BUILD_FINGERPRINTS)[number];
