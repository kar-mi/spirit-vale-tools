import { describe, expect, test } from "bun:test";
import { decodeCharacterRpcPayload, rescaleSubstats } from "./decoder.ts";
import { syntheticCharacter } from "./synthetic-character.test-helper.ts";

describe("decodeCharacterRpcPayload", () => {
  test("decodes a synthetic local character without retaining identifiers", () => {
    const payload = syntheticCharacter(true);
    const decoded = decodeCharacterRpcPayload(payload, true, new Date("2026-01-01T00:00:00.000Z"));
    expect(decoded.updateType).toBe(4);
    expect(decoded.currentWeight).toBe(71);
    expect(decoded.snapshot).toMatchObject({
      name: "Example Hero",
      title: "Trailblazer",
      archetypes: ["Warrior", "Berserker"],
      level: 42,
      experience: 12345,
      jobLevel: 18,
      jobExperience: 678,
      attributes: { STR: 60, VIT: 30, AGI: 10, DEX: 20, INT: 5, LUK: 15 },
      equipment: [{ slot: "Main hand", itemId: "Example Sword", refine: 5, cards: ["Example Card"] }],
      artifacts: [{ slot: "Rune", itemId: "Example Rune", refine: 3, gems: [{ id: "Example Gem", refine: 1 }] }],
      skills: [{ id: "Example Skill", displayName: "Example Skill", level: 3, effects: [] }],
      playtimeSeconds: 3600,
      monsterKills: 25,
      bossKills: 3,
      deaths: 2,
      source: "live",
    });
    expect(JSON.stringify(decoded.snapshot)).not.toContain("example-account");
    expect(JSON.stringify(decoded.snapshot)).not.toContain("example-character-id");
  });

  test("rejects truncated data", () => {
    expect(() => decodeCharacterRpcPayload(syntheticCharacter(false).subarray(0, 12), false)).toThrow();
  });

  test("does not substitute equipped weight when a callback omits inventory history", () => {
    const decoded = decodeCharacterRpcPayload(syntheticCharacter(true, false), true);

    expect(decoded.currentWeight).toBeUndefined();
    expect(decoded.snapshot.equipment).toHaveLength(1);
    expect(decoded.snapshot.artifacts).toHaveLength(1);
  });
});

describe("positional and chaos character fields", () => {
  const wornWeapon = (options: Parameters<typeof syntheticCharacter>[3]) =>
    decodeCharacterRpcPayload(syntheticCharacter(true, true, "Example Hero", options), true).snapshot.equipment[0]!;

  test("defaults report no chaos substat", () => {
    expect(wornWeapon({}).chaosType).toBe(-1);
  });

  test("surfaces the EquipType the chaos roll was drawn from", () => {
    // 4 = EquipType.Axe: the chaos substat came from the axe pool.
    expect(wornWeapon({ chaosType: 4 }).chaosType).toBe(4);
  });

  test("keeps substat wire positions when the game sends a hole", () => {
    const item = wornWeapon({ substats: [{ type: 0, roll: 100 }, null, { type: 1, roll: 50 }] });

    // The array is still densified for compatibility, so the index is the only way to tell that the second roll sits in slot 2 rather than slot 1.
    expect(item.substats).toHaveLength(2);
    expect(item.substats.map((stat) => stat.index)).toEqual([0, 2]);
  });

  test("carries StatData.ValueStr through as the substat qualifier", () => {
    const item = wornWeapon({ substats: [{ type: 0, roll: 100, valueStr: "Fireball" }] });

    expect(item.substats[0]!.qualifier).toBe("Fireball");
  });

  test("omits the qualifier when the stat is unscoped", () => {
    expect(wornWeapon({}).substats[0]!.qualifier).toBeUndefined();
  });

  test("records which card socket is empty without changing the dense card list", () => {
    const item = wornWeapon({ cards: [null, "Example Card", null] });

    expect(item.cards).toEqual(["Example Card"]);
    expect(item.cardsBySlot).toEqual([null, "Example Card", null]);
  });

  test("surfaces the stored weapon loadouts", () => {
    const decoded = decodeCharacterRpcPayload(syntheticCharacter(true, true, "Example Hero", {
      loadouts: [[], [{ slot: 0, itemId: "Thundercoil" }], [{ slot: 0, itemId: "Launcher" }]],
    }), true);

    expect(decoded.snapshot.loadouts?.map((set) => set.map((item) => item.itemId))).toEqual([
      [], ["Thundercoil"], ["Launcher"],
    ]);
    // The active index is 0 and that loadout is empty, so worn gear still wins.
    expect(decoded.snapshot.equipment.map((item) => item.itemId)).toEqual(["Example Sword"]);
  });

  test("omits loadouts entirely when the character has stored none", () => {
    expect(decodeCharacterRpcPayload(syntheticCharacter(true), true).snapshot.loadouts).toBeUndefined();
  });

  test("labels grimoires by slot so an empty first slot cannot promote the second book", () => {
    const decoded = decodeCharacterRpcPayload(syntheticCharacter(true, true, "Example Hero", {
      grimoires: [null, "Book Of Fire"],
    }), true);

    expect(decoded.snapshot.grimoires).toHaveLength(1);
    expect(decoded.snapshot.grimoires![0]).toMatchObject({ slot: "Grimoire 2", itemId: "Book Of Fire" });
  });

  test("rescaleSubstats preserves position and qualifier while recomputing the value", () => {
    const snapshot = decodeCharacterRpcPayload(syntheticCharacter(true, true, "Example Hero", {
      substats: [null, { type: 0, roll: 100, valueStr: "Fireball" }],
    }), true).snapshot;
    const before = snapshot.equipment[0]!.substats[0]!;

    const after = rescaleSubstats(snapshot).equipment[0]!.substats[0]!;

    expect(after.value).toBe(before.value);
    expect(after.index).toBe(1);
    expect(after.qualifier).toBe("Fireball");
  });

  test("keeps the action bar out of the skill-tree allocation", () => {
    const decoded = decodeCharacterRpcPayload(syntheticCharacter(true, true, "Example Hero", {
      skills: [{ id: "PanicBurst", level: 5 }, { id: "AerialShot", level: 1 }],
      assigned: [{ id: "PanicBurst", level: 10 }, { id: "SniperShot", level: 10 }],
    }), true);

    expect(decoded.snapshot.skills.map((skill) => [skill.id, skill.level])).toEqual([
      ["AerialShot", 1], ["PanicBurst", 5],
    ]);
    expect(decoded.snapshot.assignedSkills?.map((skill) => [skill.id, skill.level])).toEqual([
      ["PanicBurst", 10], ["SniperShot", 10],
    ]);
  });

  test("omits the action bar when the character has assigned nothing", () => {
    expect(decodeCharacterRpcPayload(syntheticCharacter(true), true).snapshot.assignedSkills).toBeUndefined();
  });
});
