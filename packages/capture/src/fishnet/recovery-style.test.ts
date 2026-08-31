import { describe, expect, test } from "bun:test";
import { classifyFishNetRecoveryStyle } from "./recovery-style.ts";

function recovery(disableFloater: boolean, disableSfx: boolean, offset: number, scale: number) {
  return {
    networkBehaviourType: "HealthComponent",
    rpcName: "Recover_C",
    decodedFields: [
      { name: "settings.DisableFloater", codec: "boolean" as const, value: disableFloater },
      { name: "settings.DisableSfx", codec: "boolean" as const, value: disableSfx },
      { name: "settings.Offset", codec: "packedInt32" as const, value: offset },
      { name: "settings.Scale", codec: "float32" as const, value: scale },
    ],
  };
}

describe("classifyFishNetRecoveryStyle", () => {
  test.each([
    [recovery(false, false, 150, 0), "standard"],
    [recovery(false, true, 0, 0), "passive-regeneration"],
    [recovery(false, true, -150, 0.75), "drain"],
  ] as const)("classifies decoded settings %#", (packet, expected) => {
    expect(classifyFishNetRecoveryStyle(packet)).toBe(expected);
  });

  test("keeps incomplete and unrelated settings conservative", () => {
    expect(classifyFishNetRecoveryStyle(recovery(true, true, -150, 0.75))).toBe("unknown");
    expect(classifyFishNetRecoveryStyle({ networkBehaviourType: "HealthComponent", rpcName: "Recover_C" })).toBe("unknown");
    expect(classifyFishNetRecoveryStyle({ ...recovery(false, true, 0, 0), networkBehaviourType: "SkillsComponent" })).toBe("unknown");
    expect(classifyFishNetRecoveryStyle({ ...recovery(false, true, 0, 0), rpcName: "SyntheticRecover_C" })).toBe("unknown");
  });
});
