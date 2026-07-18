import { expect, test } from "bun:test";

import { CURRENT_FISHNET_BUILD_FINGERPRINT } from "./builtin-maps.ts";
import { loadBundledFishNetSemanticMap } from "./semantic-map.ts";

test("loads compile-time semantic definitions for the current build", () => {
  const map = loadBundledFishNetSemanticMap();
  expect(map.buildFingerprint).toBe(CURRENT_FISHNET_BUILD_FINGERPRINT);
  expect(map.verifiedSkillLabels).toHaveLength(3);
  expect(loadBundledFishNetSemanticMap()).toBe(map);
  expect(() => loadBundledFishNetSemanticMap("fictional-build")).toThrow("no bundled semantic map");
});
