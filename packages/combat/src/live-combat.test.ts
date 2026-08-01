import { describe, expect, test } from "bun:test";
import { LiveCombatService } from "./live-combat.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";

function identity(actorId: number, displayName: string, atMs: number): FishNetCombatEvent {
  return { kind: "actorIdentity", operation: "upsert", tick: atMs, actorId, displayName } as unknown as FishNetCombatEvent;
}

function damage(actorId: number, targetId: number, value: number, atMs: number, team: number): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: atMs, payloadBytes: 0, fields: {}, actorId, targetId,
    sourceId: "skill:hit", sourceLabel: "Hit", value, hitResult: "normal", wireHits: 1, damageType: 0,
    team, element: 0, weaponType: 0, range: 0, isClone: false, isSummon: false, position: [], origin: [],
    attribution: "exact",
  } as FishNetCombatEvent;
}

function heal(actorId: number, targetId: number, value: number, atMs: number): FishNetCombatEvent {
  return {
    kind: "heal", rpc: "Recover_C", tick: atMs, payloadBytes: 0, fields: {}, actorId, targetId,
    value, attribution: "exact",
  } as FishNetCombatEvent;
}

describe("LiveCombatService", () => {
  test("aggregates TPS and HPS beside bounded DPS state", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeIdentity(identity(2, "Bramble", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 1_000, 0), 1_000);
    service.consumeCombat(damage(90, 1, 40, 2_000, 1), 2_000);
    service.consumeCombat(heal(2, 1, 25, 3_000), 3_000);

    const state = service.getState(4_000);
    expect(state.current?.dps.totalDamage).toBe(100);
    expect(state.current?.tps).toMatchObject({ total: 40, rate: 40 / 3 });
    expect(state.current?.tps.rows).toEqual([
      expect.objectContaining({ displayName: "Aurora", actorIds: [1], amount: 40, hits: 1 }),
    ]);
    expect(state.current?.hps.rows).toEqual([
      expect.objectContaining({ displayName: "Bramble", actorIds: [2], amount: 25, hits: 1 }),
    ]);
  });

  test("retains only the latest finished encounter and increments revisions", () => {
    const finished: unknown[] = [];
    const service = new LiveCombatService({
      idleGapMs: 1_000,
      onEncounterFinished: (record) => { finished.push(record); },
    });
    service.consumeCombat(damage(1, 90, 10, 0, 0), 0);
    service.advance(1_000);
    expect(service.getState().current).toBeUndefined();
    expect(service.getState().latestFinished?.dps.totalDamage).toBe(10);
    expect(finished).toHaveLength(1);
    expect(service.getState().revision).toBeGreaterThan(0);
  });
});
