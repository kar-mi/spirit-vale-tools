import { describe, expect, test } from "bun:test";
import { sanitizeCombatData } from "./combat-sanitizer.ts";

describe("combat log sanitizer", () => {
  test("keeps UID and owner while dropping sensitive/raw fields", () => {
    const value = sanitizeCombatData("combat.actorIdentity", {
      kind: "actorIdentity", operation: "upsert", tick: 1, actorId: 2,
      displayName: "Example", uid: "00000000-0000-4000-8000-000000000001", ownerConnectionId: 3,
      accountId: "account-example", raw: "deadbeef", coordinates: [1, 2],
    });
    expect(value).toEqual({ kind: "actorIdentity", operation: "upsert", tick: 1, actorId: 2, displayName: "Example", uid: "00000000-0000-4000-8000-000000000001", ownerConnectionId: 3 });
  });

  test("keeps status effect fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "status", tick: 1, actorId: 2, statusId: "Bleed", level: 3, action: "applied",
      fields: { statusId: "Bleed" }, payloadBytes: 4,
    });
    expect(value).toEqual({ kind: "status", tick: 1, actorId: 2, statusId: "Bleed", level: 3, action: "applied" });
  });

  test("keeps summon stack fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "summon", tick: 1, actorId: 2, skillId: "FictionalSummon", stacks: 3,
      fields: { private: "payload" }, payloadBytes: 12,
    });
    expect(value).toEqual({ kind: "summon", tick: 1, actorId: 2, skillId: "FictionalSummon", stacks: 3 });
  });

  test("keeps heal record fields while dropping raw payload/fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "heal", tick: 1, targetId: 20, actorId: 10, sourceId: "Heal", sourceLabel: "Heal", recoveryStyle: "standard", value: 150,
      attribution: "exact", fields: { amount: 150 }, payloadBytes: 4,
    });
    expect(value).toEqual({ kind: "heal", tick: 1, targetId: 20, actorId: 10, sourceId: "Heal", sourceLabel: "Heal", recoveryStyle: "standard", value: 150 });
  });

  test("keeps an unattributed heal record without a healer", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "heal", tick: 1, targetId: 20, value: 60, attribution: "unattributed",
      fields: { amount: 60 }, payloadBytes: 4,
    });
    expect(value).toEqual({ kind: "heal", tick: 1, targetId: 20, value: 60 });
  });

  test("drops diagnostics and unknown records", () => {
    expect(sanitizeCombatData("combat.spawnIdentityMiss", { raw: "payload" })).toBeUndefined();
    expect(sanitizeCombatData("combat.warning", { message: "error" })).toBeUndefined();
  });
});
