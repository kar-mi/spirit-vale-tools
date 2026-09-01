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

  test("keeps the feed name and server timer an observer status needs to replay", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "status", rpc: "ApplyEffectDisplays_O", tick: 1, actorId: 2, statusId: "Bleed",
      action: "applied", remainingSeconds: 12.5, stacks: 3,
      fields: { statusId: "Bleed" }, payloadBytes: 4,
    });
    // Both are protocol values, not user data.
    expect(value).toEqual({
      kind: "status", rpc: "ApplyEffectDisplays_O", tick: 1, actorId: 2, statusId: "Bleed",
      action: "applied", remainingSeconds: 12.5, stacks: 3,
    });
  });

  test("keeps an activation's phase, which decides whether a status is refreshed", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "activation", tick: 1, actorId: 2, sourceId: "FlowState", sourceLabel: "Flow State",
      phase: "interrupt", rpc: "ToggleEnd_C", payloadBytes: 8, fields: { private: "payload" },
    });
    // `consumeActivation` returns early on an interrupt or a cancel.
    expect(value).toMatchObject({ kind: "activation", phase: "interrupt" });
  });

  test("keeps summon stack fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "summon", tick: 1, actorId: 2, skillId: "FictionalSummon", stacks: 3,
      fields: { private: "payload" }, payloadBytes: 12,
    });
    expect(value).toEqual({ kind: "summon", tick: 1, actorId: 2, skillId: "FictionalSummon", stacks: 3 });
  });

  test("keeps monster identity fields as a flat lifecycle record", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "monsterIdentity", operation: "upsert", tick: 1, actorId: 52,
      mobId: "fictional_mob", displayName: "Fictional Mob", fields: { private: "payload" },
    });
    expect(value).toEqual({
      kind: "monsterIdentity", operation: "upsert", tick: 1, actorId: 52,
      mobId: "fictional_mob", displayName: "Fictional Mob",
    });
  });

  test("keeps heal record fields while dropping raw payload/fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "heal", tick: 1, targetId: 20, actorId: 10, sourceId: "Heal", sourceLabel: "Heal", recoveryStyle: "standard", value: 150,
      attribution: "exact", fields: { amount: 150 }, payloadBytes: 4,
    });
    expect(value).toEqual({ kind: "heal", tick: 1, targetId: 20, actorId: 10, sourceId: "Heal", sourceLabel: "Heal", recoveryStyle: "standard", value: 150, attribution: "exact" });
  });

  test("keeps an unattributed heal record without a healer", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "heal", tick: 1, targetId: 20, value: 60, attribution: "unattributed",
      fields: { amount: 60 }, payloadBytes: 4,
    });
    expect(value).toEqual({ kind: "heal", tick: 1, targetId: 20, value: 60, attribution: "unattributed" });
  });

  test("keeps shield lifecycle and attribution fields", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "shield", tick: 2, targetId: 20, actorId: 10, sourceId: "Barrier",
      sourceLabel: "Sacred Aegis", value: 400, barrierBefore: 0, barrierAfter: 400,
      action: "gained", attribution: "inferred", fields: { barrierSync: 400 }, payloadBytes: 3,
    });
    expect(value).toEqual({
      kind: "shield", tick: 2, targetId: 20, actorId: 10, sourceId: "Barrier",
      sourceLabel: "Sacred Aegis", value: 400, barrierBefore: 0, barrierAfter: 400,
      action: "gained", attribution: "inferred",
    });
  });

  test("keeps the correlated incoming hit on an absorbed shield event", () => {
    const value = sanitizeCombatData("combat.event", {
      kind: "shield", tick: 3, targetId: 20, value: 300, barrierBefore: 300, barrierAfter: 0,
      action: "absorbed", attribution: "inferred",
      incomingActorId: 90, incomingSourceId: "SyntheticStrike", incomingSourceLabel: "Synthetic Strike",
      fields: { barrierSync: 0 }, payloadBytes: 3,
    });
    expect(value).toMatchObject({
      action: "absorbed", incomingActorId: 90, incomingSourceId: "SyntheticStrike", incomingSourceLabel: "Synthetic Strike",
    });
  });

  test("keeps the start/stop marker from either lifecycle record type", () => {
    expect(sanitizeCombatData("combat.lifecycle", { state: "started" })).toEqual({ state: "started" });
    expect(sanitizeCombatData("capture.lifecycle", { state: "stopped" })).toEqual({ state: "stopped" });
  });

  test("keeps nothing but the state from a lifecycle record", () => {
    expect(sanitizeCombatData("capture.lifecycle", {
      state: "started", processName: "SpiritVale.exe", processIds: [4321], adapter: "\\Device\\NPF_{GUID}",
    })).toEqual({ state: "started" });
  });

  test("drops diagnostics and unknown records", () => {
    expect(sanitizeCombatData("combat.spawnIdentityMiss", { raw: "payload" })).toBeUndefined();
    expect(sanitizeCombatData("combat.warning", { message: "error" })).toBeUndefined();
    // Free-text and host details stay out of a shareable combat log.
    expect(sanitizeCombatData("capture.warning", { message: "adapter busy" })).toBeUndefined();
    expect(sanitizeCombatData("capture.error", { message: "permission denied" })).toBeUndefined();
    expect(sanitizeCombatData("capture.targetStatus", { processName: "SpiritVale.exe", processIds: [4321] })).toBeUndefined();
  });
});
