import { describe, expect, test } from "bun:test";
import { aggregateGearSubstats, calculateAdvancedGearStats, calculateCharacterStats, materializeGearStats } from "./formulas.ts";
import type { CharacterArtifact, CharacterEquipment, CharacterSubstat } from "./types.ts";

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

  test("separates known substats into base, gear, and total values", () => {
    const stats = calculateCharacterStats(20, { STR: 20, VIT: 20, AGI: 20, DEX: 20, INT: 20, LUK: 20 }, [substat(9, "ATK", 5)]);
    const melee = stats.find((stat) => stat.id === "melee-attack")!;
    const mana = stats.find((stat) => stat.id === "max-mana")!;
    expect(melee.gear).toBe(melee.value - melee.base);
    expect(melee.gear).toBeGreaterThan(0);
    expect(mana.gear).toBe(0);
  });

  test("attributes from gear shift derived attack and resistance", () => {
    const stats = calculateCharacterStats(20, { STR: 20, VIT: 20, AGI: 20, DEX: 20, INT: 20, LUK: 20 }, [substat(0, "STR", 3)]);
    expect(stats.find((stat) => stat.id === "melee-attack")!.gear).toBeGreaterThan(0);
    expect(stats.find((stat) => stat.id === "resist-str")!.gear).toBeGreaterThan(0);
  });

  test("aggregates duplicate equipment and artifact substats including unresolved rolls", () => {
    const equipment: CharacterEquipment[] = [{ slot: "Head", itemId: "Helmet", refine: 0, cards: [], substats: [substat(63, "Attack speed", 3, true), unresolved(63, "Attack speed")] }];
    const artifacts: CharacterArtifact[] = [{ slot: "Rune", itemId: "Rune", refine: 0, gems: [], substats: [substat(63, "Attack speed", 2, true)] }];
    expect(aggregateGearSubstats(equipment, artifacts)).toEqual([{ type: 63, name: "Attack speed", total: 5, percent: true, unresolvedRolls: 1 }]);
  });

  test("creates advanced rows only for gear substats without basic formulas", () => {
    const totals = aggregateGearSubstats([{ slot: "Feet", itemId: "Boots", refine: 0, cards: [], substats: [substat(9, "ATK", 2), substat(63, "Attack speed", 4, true)] }], []);
    const advanced = calculateAdvancedGearStats(totals);
    expect(advanced).toHaveLength(1);
    expect(advanced[0]).toMatchObject({ id: "gear-stat-63", tab: "advanced", base: 0, gear: 4, value: 4 });
  });

  test("scales move speed from the verified 7.5 base", () => {
    const noGear = calculateCharacterStats(88, { STR: 99, VIT: 50, AGI: 1, DEX: 1, INT: 1, LUK: 71 });
    expect(noGear.find((stat) => stat.id === "move-speed")).toMatchObject({ base: 7.5, value: 7.5, tab: "basic" });
    // The user's live build: +10% boots base effect and +9% rolled substat → the synced 8.925.
    const geared = calculateCharacterStats(88, { STR: 99, VIT: 50, AGI: 1, DEX: 1, INT: 1, LUK: 71 }, [substat(65, "Move speed", 10, true), substat(65, "Move speed", 9, true)]);
    expect(geared.find((stat) => stat.id === "move-speed")?.value).toBeCloseTo(8.925, 3);
  });

  test("applies artifact per-piece, refine, and full-set effects", () => {
    const artifact = (refine: number): CharacterArtifact => ({ slot: "Rune", itemId: "Vampiric", refine, gems: [], substats: [] });
    const leech = (artifacts: CharacterArtifact[]) => materializeGearStats([], artifacts).filter((stat) => stat.type === 98).reduce((total, stat) => total + (stat.value ?? 0), 0);
    expect(leech([artifact(0)])).toBe(3);
    expect(leech([artifact(4)])).toBe(3.5);
    expect(leech([artifact(0), artifact(0), artifact(0), artifact(0)])).toBe(15);
  });
});

function substat(type: number, name: string, value: number, percent = false): CharacterSubstat { return { type, name, roll: 0, value, percent }; }
function unresolved(type: number, name: string): CharacterSubstat { return { type, name, roll: 10, percent: false }; }
