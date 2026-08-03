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
