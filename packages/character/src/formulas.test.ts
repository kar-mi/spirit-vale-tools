import { describe, expect, test } from "bun:test";
import { calculateCharacterStats } from "./formulas.ts";

describe("calculateCharacterStats", () => {
  test("uses the corrected current-build hit, flee, and critical formulas", () => {
    const stats = calculateCharacterStats(50, { STR: 20, VIT: 30, AGI: 40, DEX: 25, INT: 10, LUK: 30 });
    const value = (id: string) => stats.find((stat) => stat.id === id)?.value;
    expect(value("hit")).toBe(135);
    expect(value("flee")).toBe(128);
    expect(value("crit-damage")).toBe(126);
    expect(value("perfect-dodge")).toBe(3);
  });

  test("uses the corrected base health and magic scaling", () => {
    const stats = calculateCharacterStats(10, { STR: 1, VIT: 20, AGI: 1, DEX: 10, INT: 20, LUK: 10 });
    const value = (id: string) => stats.find((stat) => stat.id === id)?.value;
    expect(value("max-health")).toBe(360);
    expect(value("max-mana")).toBe(114);
    expect(value("magic-attack")).toBe(35);
  });
});
