import { describe, expect, test } from "bun:test";
import { decodeCharacterRpcPayload } from "./decoder.ts";

describe("decodeCharacterRpcPayload", () => {
  test("decodes a synthetic local character without retaining identifiers", () => {
    const payload = syntheticCharacter(true);
    const decoded = decodeCharacterRpcPayload(payload, true, new Date("2026-01-01T00:00:00.000Z"));
    expect(decoded.updateType).toBe(4);
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
      artifacts: [{ slot: "Rune", itemId: "Example Rune", refine: 3, gems: ["Example Gem"] }],
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

function syntheticCharacter(update: boolean): Buffer {
  const out: number[] = [];
  if (update) packed(out, 4);
  bool(out, false);
  string(out, "example-character-id");
  string(out, "example-account");
  packed(out, 7);
  string(out, ""); string(out, ""); string(out, "Example Hero");
  bool(out, false);
  for (let index = 0; index < 10; index += 1) packed(out, index);
  bool(out, false); list(out, [], () => undefined);
  list(out, [], () => undefined);
  string(out, "Trailblazer"); string(out, ""); string(out, "");
  list(out, [0, 12], (value) => packed(out, value));
  packed(out, 42); packed(out, 12345); packed(out, 18); packed(out, 678);
  bool(out, false);
  float(out, 1); float(out, 1); string(out, "Example Town");
  bool(out, false); float(out, 0); float(out, 0); float(out, 0);
  list(out, [], () => undefined); packed(out, 0); list(out, [], () => undefined); list(out, [], () => undefined);
  list(out, [60, 30, 10, 20, 5, 15], (value) => packed(out, value));
  list(out, [0], () => {
    bool(out, false); packed(out, 0); bool(out, false);
    list(out, [0], () => { bool(out, false); packed(out, 0); packed(out, 100); string(out, ""); });
    list(out, ["Example Card"], (value) => string(out, value));
    packed(out, 0); packed(out, 0); packed(out, -1); string(out, "example-equip-instance"); packed(out, 5); string(out, "Example Sword"); bool(out, false);
  });
  packed(out, 0);
  list(out, [], () => undefined); list(out, [], () => undefined); list(out, [], () => undefined);
  list(out, [0], () => {
    bool(out, false);
    list(out, [0], () => { bool(out, false); packed(out, 71); packed(out, 100); string(out, ""); });
    packed(out, 0);
    list(out, [0], () => { bool(out, false); string(out, "example-gem-instance"); packed(out, 1); string(out, "Example Gem"); bool(out, false); });
    string(out, "example-artifact-instance"); packed(out, 3); string(out, "Example Rune"); bool(out, false);
  });
  bool(out, false); list(out, [], () => undefined); list(out, [], () => undefined); bool(out, true); list(out, [], () => undefined);
  list(out, [], () => undefined);
  bool(out, false);
  for (let index = 0; index < 7; index += 1) list(out, [], () => undefined);
  packed(out, 0); packed(out, 3600); packed(out, 25); packed(out, 3); packed(out, 2);
  return Buffer.from(out);
}

function bool(out: number[], value: boolean): void { out.push(value ? 1 : 0); }
function string(out: number[], value: string): void { const bytes = Buffer.from(value); packed(out, bytes.length); out.push(...bytes); }
function float(out: number[], value: number): void { const bytes = Buffer.alloc(4); bytes.writeFloatLE(value); out.push(...bytes); }
function list<T>(out: number[], values: T[], write: (value: T) => void): void { packed(out, values.length); for (const value of values) write(value); }
function packed(out: number[], value: number): void {
  let remaining = (BigInt(value) << 1n) ^ (BigInt(value) >> 63n);
  while (remaining >= 0x80n) { out.push(Number((remaining & 0x7fn) | 0x80n)); remaining >>= 7n; }
  out.push(Number(remaining));
}
