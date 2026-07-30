import { expect, test } from "bun:test";

import { CURRENT_GAME_BUILD_FINGERPRINT } from "../game-build.ts";
import { loadBundledFishNetSemanticMap } from "./semantic-map.ts";

test("loads compile-time semantic definitions for the current build", () => {
  const map = loadBundledFishNetSemanticMap();
  expect(map.buildFingerprint).toBe(CURRENT_GAME_BUILD_FINGERPRINT);
  expect(map.verifiedSkillLabels).toHaveLength(0);
  expect(map.recoveryStyles).toHaveLength(3);
  expect(loadBundledFishNetSemanticMap()).toBe(map);
  expect(() => loadBundledFishNetSemanticMap("fictional-build")).toThrow("no bundled semantic map");
});
