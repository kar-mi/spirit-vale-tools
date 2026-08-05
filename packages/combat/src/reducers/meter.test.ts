import { describe, expect, test } from "bun:test";

import { MeterReducer } from "./meter.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import type { CombatIdentity } from "./damage.ts";

const IDENTITIES = new Map<number, CombatIdentity>([[1, { displayName: "Healer" } as CombatIdentity]]);

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

  /**
   * A boss spell reflect lands on the caster carrying their own team and their own id. It is real
   * damage taken, so it belongs here even though every other team-zero hit is outgoing damage.
   */
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

  /**
   * The player-side reflect (damage type 4) is outgoing party damage: the reflecting player is the
   * attacker and the monster is the target. It belongs to the DPS meter, not to damage taken.
   */
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
});

describe("healing meter", () => {
  test("counts ordinary heals", () => {
    const reducer = healingMeter();
    reducer.consumeCombat(healed(400), 1_000, IDENTITIES);
    expect(total(reducer)).toBe(400);
  });

  test("ignores a full heal", () => {
    // FullHeal_C is a town NPC service with no amount on the wire. Counting it would spike HPS by a
    // whole health bar for something nobody healed, so it is deliberately not a `heal` event.
    const reducer = healingMeter();
    reducer.consumeCombat(healed(400), 1_000, IDENTITIES);
    reducer.consumeCombat(fullHealed(), 2_000, IDENTITIES);
    expect(total(reducer)).toBe(400);
  });
});
