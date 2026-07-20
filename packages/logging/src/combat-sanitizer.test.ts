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

  test("drops diagnostics and unknown records", () => {
    expect(sanitizeCombatData("combat.spawnIdentityMiss", { raw: "payload" })).toBeUndefined();
    expect(sanitizeCombatData("combat.warning", { message: "error" })).toBeUndefined();
  });
});
