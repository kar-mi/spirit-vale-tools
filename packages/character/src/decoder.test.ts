import { describe, expect, test } from "bun:test";
import { decodeCharacterRpcPayload } from "./decoder.ts";
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
});
