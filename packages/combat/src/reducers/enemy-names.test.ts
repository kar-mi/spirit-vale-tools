import { describe, expect, test } from "bun:test";

import type { FishNetCombatEvent } from "../combat-tracker.ts";
import { DamageReducer, MOB_IDENTITY_PREFIX } from "./damage.ts";

function damage(
  actorId: number,
  targetId: number,
  atMs: number,
  targetIdentity?: { mobId: string; displayName: string },
): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: atMs, payloadBytes: 0, fields: {},
    actorId, targetId, sourceId: "skill:strike", sourceLabel: "Strike", value: 10,
    hitResult: "normal", wireHits: 1, damageType: 0, team: 0, element: 0, weaponType: 0,
    range: 0, isClone: false, isSummon: false, position: [], origin: [], attribution: "exact",
    ...(targetIdentity ? { targetIdentity } : {}),
  } as FishNetCombatEvent;
}

function mobIdentity(actorId: number, displayName: string, atMs: number): FishNetCombatEvent {
  return {
    kind: "activation", tick: atMs, actorId,
    sourceId: `${MOB_IDENTITY_PREFIX}mob-${actorId}`, sourceLabel: displayName, level: 10,
  } as unknown as FishNetCombatEvent;
}

describe("enemy names", () => {
  /**
   * The case the spawn-derived identity exists for: a monster killed without ever acting produces
   * no mob-identity activation, so nothing else in the stream can name it.
   */
  test("names a target that never acted, from the identity on the hit", () => {
    const reducer = new DamageReducer();

    reducer.consumeCombat(damage(90, 500, 0, { mobId: "fictional_mob", displayName: "Fictional Mob" }), 0);

    expect(reducer.current?.enemyNames.get(500)).toBe("Fictional Mob");
  });

  test("leaves a target unnamed when nothing in the stream identified it", () => {
    const reducer = new DamageReducer();

    reducer.consumeCombat(damage(90, 500, 0), 0);

    expect(reducer.current?.enemyNames.has(500)).toBe(false);
  });

  test("falls back to a name learned from the monster's own activation", () => {
    const reducer = new DamageReducer();

    reducer.consumeCombat(mobIdentity(500, "Acting Mob", 0), 0);
    reducer.consumeCombat(damage(90, 500, 100), 100);

    expect(reducer.current?.enemyNames.get(500)).toBe("Acting Mob");
  });

  /**
   * Names are captured per hit rather than looked up when the encounter is written, so eviction
   * from the capped identity map cannot erase one that was already known.
   */
  test("keeps a captured name after the identity map evicts it", () => {
    const reducer = new DamageReducer();

    reducer.consumeCombat(damage(90, 500, 0, { mobId: "fictional_mob", displayName: "Fictional Mob" }), 0);
    reducer.mobIdentities.clear();

    expect(reducer.current?.enemyNames.get(500)).toBe("Fictional Mob");
  });
});
