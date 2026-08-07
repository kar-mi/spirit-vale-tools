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

  test("gives TPS and HPS the same detail the DPS snapshot carries", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeIdentity(identity(2, "Bramble", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 1_000, 0), 1_000);
    service.consumeCombat(damage(90, 1, 40, 2_000, 1), 2_000);
    service.consumeCombat(damage(90, 1, 60, 2_500, 1), 2_500);
    service.consumeCombat(heal(2, 1, 25, 3_000), 3_000);

    const state = service.getState(4_000);
    const tanked = state.current?.tps.detail;
    expect(tanked?.totalDamage).toBe(100);
    // Grouped by the party member taking the hit, not the attacker.
    expect(tanked?.actors.map((actor) => actor.displayName)).toEqual(["Aurora"]);
    const victim = tanked?.actors[0];
    expect(victim?.hits).toBe(2);
    expect(victim?.contribution).toBe(1);
    expect(victim?.skills.map((skill) => skill.sourceLabel)).toEqual(["Hit"]);
    expect(victim?.skills[0]?.damage).toBe(100);
    expect(victim?.timeline.length).toBeGreaterThan(0);
    // One distinct attacker.
    expect(victim?.mobsHit).toBe(1);

    const healing = state.current?.hps.detail;
    expect(healing?.actors.map((actor) => actor.displayName)).toEqual(["Bramble"]);
    expect(healing?.actors[0]?.skills[0]?.damage).toBe(25);
    expect(healing?.actors[0]?.timeline.length).toBeGreaterThan(0);

    // The flat rows stay a projection of that same detail.
    expect(state.current?.tps.rows[0]).toMatchObject({ displayName: "Aurora", amount: 100, hits: 2 });
    expect(state.current?.tps.total).toBe(tanked?.totalDamage);
  });

  test("resolves the personal row on the tanked and healing meters", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000, personalName: "Aurora" });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 1_000, 0), 1_000);
    service.consumeCombat(damage(90, 1, 40, 2_000, 1), 2_000);
    service.consumeCombat(heal(1, 1, 25, 2_500), 2_500);

    const state = service.getState(3_000);
    expect(state.current?.dps.personalMatch).toBe("matched");
    expect(state.current?.tps.detail.personalMatch).toBe("matched");
    expect(state.current?.tps.detail.personal?.damage).toBe(40);
    expect(state.current?.hps.detail.personalMatch).toBe("matched");
    expect(state.current?.hps.detail.personal?.damage).toBe(25);
  });

  test("excludes healing whose credited actor has no known identity", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 1_000, 0), 1_000);
    // A monster healing itself: no identity for actor 90.
    service.consumeCombat(heal(90, 90, 500, 1_500), 1_500);

    expect(service.getState(2_000).current?.hps.total).toBe(0);
  });

  test("re-renders the retained finished encounter when the personal actor changes", () => {
    const service = new LiveCombatService({ idleGapMs: 1_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 10, 0, 0), 0);
    service.consumeCombat(damage(90, 1, 5, 100, 1), 100);
    service.advance(2_000);

    expect(service.getState().latestFinished?.dps.personalMatch).toBe("unconfigured");

    service.setPersonalName("Aurora");
    const named = service.getState().latestFinished;
    expect(named?.dps.personalMatch).toBe("matched");
    expect(named?.tps.detail.personal?.damage).toBe(5);
  });

  test("does not credit an expired encounter with incoming damage that arrives after its idle cutoff", () => {
    const service = new LiveCombatService({ idleGapMs: 1_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 0, 0), 0);
    // The encounter goes idle at 1_000ms; this lands well after that.
    service.consumeCombat(damage(90, 1, 40, 2_000, 1), 2_000);

    const state = service.getState(2_000);
    // Incoming damage cannot open an encounter, so there is nothing current...
    expect(state.current).toBeUndefined();
    // ...and it must not have been folded into the one that already ended.
    expect(state.latestFinished?.dps.totalDamage).toBe(100);
    expect(state.latestFinished?.tps.total).toBe(0);
  });

  test("credits incoming damage to an encounter that is still active", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    service.consumeCombat(damage(1, 90, 100, 0, 0), 0);
    service.consumeCombat(damage(90, 1, 40, 2_000, 1), 2_000);

    expect(service.getState(2_000).current?.tps.total).toBe(40);
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

  test("holds the revision still on re-stated identities and idle advances", () => {
    const service = new LiveCombatService({ idleGapMs: 10_000 });
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 0);
    const named = service.getState().revision;
    expect(named).toBeGreaterThan(0);

    // The observer feed re-sends identities it has already sent; nothing rendered changes.
    service.consumeIdentity(identity(1, "Aurora", 0) as never, 100);
    expect(service.getState().revision).toBe(named);

    // Advancing an idle clock closes nothing here, so consumers have nothing to re-project.
    service.advance(500);
    expect(service.getState().revision).toBe(named);

    service.consumeIdentity(identity(1, "Aurora Prime", 0) as never, 200);
    expect(service.getState().revision).toBeGreaterThan(named);
  });
});
