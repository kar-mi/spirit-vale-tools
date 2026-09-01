import { describe, expect, test } from "bun:test";

import { MeterReducer } from "./meter.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import type { CombatIdentity } from "./damage.ts";

const IDENTITIES = new Map<number, CombatIdentity>([
  [1, { displayName: "Healer" } as CombatIdentity],
  [2, { displayName: "Tank" } as CombatIdentity],
]);

function shield(
  action: string,
  actorId: number | undefined,
  targetId: number,
  value: number,
  incoming?: { actorId: number; sourceId: string; sourceLabel: string },
): FishNetCombatEvent {
  return {
    kind: "shield", rpc: "barrierSync", tick: 0, payloadBytes: 0, fields: {},
    targetId, actorId, sourceId: "skill:aegis", sourceLabel: "Aegis", value,
    barrierBefore: action === "gained" ? 0 : value, barrierAfter: action === "gained" ? value : 0,
    action, attribution: actorId === undefined ? "unattributed" : "inferred",
    ...(incoming === undefined ? {} : {
      incomingActorId: incoming.actorId,
      incomingSourceId: incoming.sourceId,
      incomingSourceLabel: incoming.sourceLabel,
    }),
  } as FishNetCombatEvent;
}

function healingMeter(): MeterReducer {
  const reducer = new MeterReducer({ kind: "healing" });
  reducer.begin("encounter", 0);
  return reducer;
}

function healed(value: number): FishNetCombatEvent {
  return {
    kind: "heal",
    rpc: "Recover_C",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    targetId: 1,
    actorId: 1,
    value,
    attribution: "exact",
  } as FishNetCombatEvent;
}

function unattributedHeal(value: number): FishNetCombatEvent {
  return { ...healed(value), actorId: undefined, targetId: 1, attribution: "unattributed" } as FishNetCombatEvent;
}

function directHealed(value: number): FishNetCombatEvent {
  return {
    kind: "heal",
    rpc: "ApplyDamage_C",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    targetId: 2,
    actorId: 1,
    sourceId: "Heal",
    sourceLabel: "Heal",
    value,
    attribution: "exact",
  } as FishNetCombatEvent;
}

function fullHealed(): FishNetCombatEvent {
  return { kind: "fullHeal", rpc: "FullHeal_C", tick: 0, payloadBytes: 0, fields: {}, targetId: 1 } as FishNetCombatEvent;
}

function total(reducer: MeterReducer): number {
  return [...(reducer.current?.activeActors.values() ?? [])].reduce((sum, actor) => sum + actor.damage, 0);
}

function tankedMeter(): MeterReducer {
  const reducer = new MeterReducer({ kind: "tanked" });
  reducer.begin("encounter", 0);
  return reducer;
}

function hit(actorId: number, targetId: number, value: number, team: number): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: 0, payloadBytes: 0, fields: {},
    actorId, targetId, value, team, sourceId: "skill:smite", sourceLabel: "Smite",
    hitResult: "normal", attribution: "exact",
  } as FishNetCombatEvent;
}

describe("tanked meter", () => {
  test("counts incoming damage from another team", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(90, 1, 400, 1), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(400);
  });

  /** A boss spell reflect lands on the caster carrying their own team and their own id. */
  test("counts a reflected self-inflicted hit on a known party member", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(1, 1, 16_753, 0), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(16_753);
    expect(reducer.current?.activeActors.get(1)?.displayName).toBe("Healer");
  });

  test("counts a reflect even when the victim was never identified", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(7, 7, 16_753, 0), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(16_753);
  });

  test("ignores the party's outgoing damage, whose target is not a party member", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(1, 90, 500, 0), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });

  /** The player-side reflect (damage type 4) is outgoing party damage: the reflecting player is the attacker and the monster is the target. */
  test("ignores a player's own reflect damage against a monster", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(
      { ...hit(1, 90, 1_411, 0), sourceId: "reflect", sourceLabel: "Reflect Damage", damageType: 4 } as FishNetCombatEvent,
      1_000,
      IDENTITIES,
    );
    expect(total(reducer)).toBe(0);
  });

  test("ignores a monster damaging itself, which is nobody's damage taken", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(90, 90, 500, 1), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });

  test("keeps absorbed shield apart from damage taken", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(hit(90, 2, 400, 1), 1_000, IDENTITIES);
    reducer.consumeCombat(
      shield("absorbed", 1, 2, 150, { actorId: 90, sourceId: "skill:slam", sourceLabel: "Slam" }),
      1_100,
      IDENTITIES,
    );
    const tank = reducer.current?.activeActors.get(2);
    expect(tank?.damage).toBe(400);
    expect(tank?.absorbed).toBe(150);
    expect(tank?.absorbedSkills.get("skill:slam")?.damage).toBe(150);
    expect(tank?.absorbedByEnemy.get(90)).toBe(150);
  });

  test("attributes an unattributed absorb to a placeholder skill", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(shield("absorbed", 1, 2, 150), 1_100, IDENTITIES);
    expect(reducer.current?.activeActors.get(2)?.absorbedSkills.get("absorbed:unknown")?.damage).toBe(150);
  });

  test("keeps a per-attacker breakdown of damage taken", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat({ ...hit(90, 2, 400, 1), sourceId: "skill:slam", sourceLabel: "Slam" } as FishNetCombatEvent, 1_000, IDENTITIES);
    reducer.consumeCombat({ ...hit(91, 2, 100, 1), sourceId: "skill:cleave", sourceLabel: "Cleave" } as FishNetCombatEvent, 1_100, IDENTITIES);
    const tank = reducer.current?.activeActors.get(2);
    expect(tank?.targetDamage.get(90)).toBe(400);
    expect(tank?.enemySkills.get(91)?.get("skill:cleave")?.damage).toBe(100);
  });

  test("ignores shield grants and expiries in the tank meter", () => {
    const reducer = tankedMeter();
    reducer.consumeCombat(shield("gained", 1, 2, 300), 1_000, IDENTITIES);
    reducer.consumeCombat(shield("cleared", 1, 2, 300), 2_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });
});

describe("healing meter", () => {
  test("counts ordinary heals", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(healed(400), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(400);
  });

  test("counts directly attributed ApplyDamage_C heals", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(directHealed(150), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(150);
  });

  test("does not silently credit an unattributed target as its own healer", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(unattributedHeal(225), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });

  test("ignores a full heal", () => {
    // FullHeal_C is a town NPC service with no amount on the wire.
    const reducer = healingMeter();
    reducer.consumeCombat(healed(400), 1_000, IDENTITIES);
    reducer.consumeCombat(fullHealed(), 2_000, IDENTITIES);
    expect(total(reducer)).toBe(400);
  });

  test("credits the caster for an applied shield", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(shield("gained", 1, 2, 300), 1_000, IDENTITIES);
    expect(reducer.current?.activeActors.get(1)?.damage).toBe(300);
  });

  test("ignores absorbed and cleared shield in the healing meter", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(shield("absorbed", 1, 2, 150), 1_000, IDENTITIES);
    reducer.consumeCombat(shield("cleared", 1, 2, 150), 2_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });

  test("does not credit an unattributed shield grant", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(shield("gained", undefined, 2, 300), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(0);
  });
});
