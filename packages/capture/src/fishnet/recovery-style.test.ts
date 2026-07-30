import { describe, expect, test } from "bun:test";
import { loadBundledFishNetSemanticMap } from "./semantic-map.ts";
import { classifyFishNetRecoveryStyle } from "./recovery-style.ts";

describe("classifyFishNetRecoveryStyle", () => {
  const semanticMap = loadBundledFishNetSemanticMap();

  test.each([
    ["0000ac0200000000", "standard"],
    ["00010000000000", "passive-regeneration"],
    ["0001ab020000403f", "drain"],
  ] as const)("classifies current-build settings %s", (hex, expected) => {
    expect(classifyFishNetRecoveryStyle({
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      undecodedPayload: Buffer.from(hex, "hex"),
    }, semanticMap)).toBe(expected);
  });

  test("keeps unknown settings and unavailable metadata conservative", () => {
    const packet = {
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      undecodedPayload: Buffer.from("0001ff", "hex"),
    };
    expect(classifyFishNetRecoveryStyle(packet, semanticMap)).toBe("unknown");
    expect(classifyFishNetRecoveryStyle(packet, undefined)).toBe("unknown");
    expect(classifyFishNetRecoveryStyle({}, semanticMap)).toBe("unknown");
  });

  test("scopes signatures to the defining RPC and behaviour", () => {
    const undecodedPayload = Buffer.from("00010000000000", "hex");
    expect(classifyFishNetRecoveryStyle({
      networkBehaviourType: "SkillsComponent",
      rpcName: "Recover_C",
      undecodedPayload,
    }, semanticMap)).toBe("unknown");
    expect(classifyFishNetRecoveryStyle({
      networkBehaviourType: "HealthComponent",
      rpcName: "SyntheticRecover_C",
      undecodedPayload,
    }, semanticMap)).toBe("unknown");
  });
});
