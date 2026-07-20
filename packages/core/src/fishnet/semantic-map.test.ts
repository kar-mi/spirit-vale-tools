import { expect, test } from "bun:test";

import { CURRENT_GAME_BUILD_FINGERPRINT, LEGACY_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
import { loadBundledFishNetSemanticMap } from "./semantic-map.ts";

test("loads compile-time semantic definitions for the current build", () => {
  const map = loadBundledFishNetSemanticMap();
  expect(map.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
  expect(map.verifiedSkillLabels).toHaveLength(0);
  expect(loadBundledFishNetSemanticMap()).toBe(map);
  expect(loadBundledFishNetSemanticMap(LEGACY_GAME_BUILD_FINGERPRINT).verifiedSkillLabels).toHaveLength(3);
  expect(() => loadBundledFishNetSemanticMap("fictional-build")).toThrow("no bundled semantic map");
});
