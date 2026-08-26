import { describe, expect, test } from "bun:test";

import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import { DamageReducer } from "./damage.ts";

const PIKI = 15_004;
const BOSS = 16_147;

function identity(actorId: number, displayName: string, atMs: number): FishNetActorIdentityEvent {
  return { kind: "actorIdentity", operation: "upsert", tick: atMs, actorId, displayName } as FishNetActorIdentityEvent;
}

function spawnIdentity(actorId: number, displayName: string, atMs: number): FishNetCombatEvent {
  return { kind: "monsterIdentity", operation: "upsert", tick: atMs, actorId, mobId: "fictional_boss", displayName };
}

function damage(actorId: number, targetId: number, value: number, atMs: number, team = 0): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: atMs, payloadBytes: 0, fields: {},
    actorId, targetId, sourceId: "skill:smite", sourceLabel: "Smite", value,
    hitResult: "normal", team, attribution: "exact",
  } as FishNetCombatEvent;
}

function reflected(actorId: number, targetId: number, value: number, atMs: number): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: atMs, payloadBytes: 0, fields: {},
    actorId, targetId, sourceId: "reflect", sourceLabel: "Reflect Damage", value,
    hitResult: "normal", team: 0, damageType: 4, attribution: "exact",
  } as FishNetCombatEvent;
}

function death(actorId: number, targetId: number, value: number, atMs: number, team = 0): FishNetCombatEvent {
  return {
    kind: "death", rpc: "Death_C", tick: atMs, payloadBytes: 0, fields: {},
    actorId, targetId, sourceId: "skill:smite", sourceLabel: "Smite", value,
    hitResult: "normal", team, attribution: "exact", duplicatesDamageEvent: true,
  } as FishNetCombatEvent;
}

type Timed = { event: FishNetActorIdentityEvent | FishNetCombatEvent; atMs: number };

/** Runs the events and returns the open encounter. */
function encounterFor(events: readonly Timed[]) {
  const reducer = new DamageReducer();
  for (const { event, atMs } of events) {
    if (event.kind === "actorIdentity") reducer.consumeIdentity(event, atMs);
    else reducer.consumeCombat(event, atMs);
  }
  return reducer.current;
}

function deathsFor(events: readonly Timed[]) {
  return encounterFor(events)?.deaths ?? [];
}

describe("death log", () => {
  /** A boss spell reflect sends the caster's own hit back at them: team 0 (the reflect keeps the original caster's team) and self-attributed. */
  test("records a reflected self-inflicted death of a known player", () => {
    const deaths = deathsFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: spawnIdentity(BOSS, "Fictional Boss", 0), atMs: 0 },
      { event: damage(PIKI, BOSS, 19_876, 1_000), atMs: 1_000 },
      // The reflect: attacker == victim, team 0.
      { event: damage(PIKI, PIKI, 16_753, 2_000), atMs: 2_000 },
      { event: death(PIKI, PIKI, 16_753, 2_050), atMs: 2_050 },
    ]);

    expect(deaths).toHaveLength(1);
    expect(deaths[0]!.victimName).toBe("Piki");
    expect(deaths[0]!.targetId).toBe(PIKI);
    expect(deaths[0]!.totalDamage).toBe(16_753);
    expect(deaths[0]!.hits.map((hit) => [hit.sourceLabel, hit.damage, hit.attackerActorId]))
      .toEqual([["Smite", 16_753, PIKI]]);
  });

  test("still logs an ordinary incoming death, where the victim's team is not zero", () => {
    const deaths = deathsFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: spawnIdentity(BOSS, "Fictional Boss", 0), atMs: 0 },
      { event: damage(PIKI, BOSS, 100, 1_000), atMs: 1_000 },
      { event: damage(BOSS, PIKI, 4_000, 2_000, 1), atMs: 2_000 },
      { event: death(BOSS, PIKI, 4_000, 2_050, 1), atMs: 2_050 },
    ]);

    expect(deaths.map((entry) => entry.victimName)).toEqual(["Piki"]);
  });

  test("does not log a monster's death, which is also team zero", () => {
    const deaths = deathsFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: spawnIdentity(BOSS, "Fictional Boss", 0), atMs: 0 },
      { event: damage(PIKI, BOSS, 19_876, 1_000), atMs: 1_000 },
      { event: death(PIKI, BOSS, 19_876, 1_050), atMs: 1_050 },
    ]);

    expect(deaths).toEqual([]);
  });

  test("does not log a team-zero death whose victim was never identified", () => {
    const deaths = deathsFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: damage(PIKI, 900, 19_876, 1_000), atMs: 1_000 },
      { event: death(PIKI, 900, 19_876, 1_050), atMs: 1_050 },
    ]);

    expect(deaths).toEqual([]);
  });

  test("logs a reflected death even when no identity was ever resolved", () => {
    const deaths = deathsFor([
      { event: damage(PIKI, 900, 19_876, 1_000), atMs: 1_000 },
      { event: damage(PIKI, PIKI, 16_753, 2_000), atMs: 2_000 },
      { event: death(PIKI, PIKI, 16_753, 2_050), atMs: 2_050 },
    ]);

    expect(deaths).toHaveLength(1);
    expect(deaths[0]!.victimName).toBe("Unidentified player");
    expect(deaths[0]!.totalDamage).toBe(16_753);
  });
});

describe("player-side reflect damage", () => {
  test("credits a player's reflect to their own damage, and logs no death for the mob it kills", () => {
    const encounter = encounterFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: spawnIdentity(BOSS, "Fictional Boss", 0), atMs: 0 },
      { event: damage(PIKI, BOSS, 100, 1_000), atMs: 1_000 },
      { event: reflected(PIKI, BOSS, 1_411, 2_000), atMs: 2_000 },
      { event: reflected(PIKI, BOSS, 2_146, 3_000), atMs: 3_000 },
    ]);

    expect(encounter?.deaths).toEqual([]);
    expect(encounter?.activeActors.get(PIKI)?.skills.get("reflect"))
      .toMatchObject({ sourceLabel: "Reflect Damage", damage: 3_557, hits: 2 });
  });

  test("keeps a mob killed by a player's reflect out of the death log", () => {
    const deaths = deathsFor([
      { event: identity(PIKI, "Piki", 0), atMs: 0 },
      { event: damage(PIKI, 900, 100, 1_000), atMs: 1_000 },
      { event: reflected(PIKI, 900, 1_411, 2_000), atMs: 2_000 },
      {
        atMs: 2_050,
        event: {
          ...reflected(PIKI, 900, 1_411, 2_050), kind: "death", rpc: "Death_C", duplicatesDamageEvent: true,
        } as FishNetCombatEvent,
      },
    ]);

    expect(deaths).toEqual([]);
  });
});
