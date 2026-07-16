import { describe, expect, test } from "bun:test";

import {
  FISHNET_MARKET_STAT_NAMES,
  fishNetMarketStatName,
  parseFishNetMarketStatExpression,
  resolveFishNetMarketStat,
} from "./market-stats.ts";

describe("market stat names", () => {
  test("matches the build enum and resolves readable variants", () => {
    expect(FISHNET_MARKET_STAT_NAMES).toHaveLength(220);
    expect(fishNetMarketStatName(0)).toBe("Str");
    expect(fishNetMarketStatName(69)).toBe("AtkMult");
    expect(fishNetMarketStatName(219)).toBe("SetAtkSpd");
    expect(resolveFishNetMarketStat("cooldown-recovery")).toEqual({ type: 182, name: "CooldownRecovery" });
    expect(resolveFishNetMarketStat("ATK mult")).toEqual({ type: 69, name: "AtkMult" });
    expect(resolveFishNetMarketStat(999)).toEqual({ type: 999, name: undefined });
  });

  test("parses presence and inclusive-minimum CLI expressions", () => {
    expect(parseFishNetMarketStatExpression("Str")).toEqual({ stat: 0 });
    expect(parseFishNetMarketStatExpression("AtkMult:50")).toEqual({ stat: 69, minValue: 50 });
    expect(parseFishNetMarketStatExpression("69:-2.5")).toEqual({ stat: 69, minValue: -2.5 });
    expect(() => parseFishNetMarketStatExpression("missing-stat")).toThrow("unknown market stat");
    expect(() => parseFishNetMarketStatExpression("Str:")).toThrow("minimum is missing");
    expect(() => parseFishNetMarketStatExpression("Str:NaN")).toThrow("must be finite");
  });
});
