import { describe, expect, test } from "bun:test";

import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent } from "./combat-tracker.ts";
import { FishNetDpsMeter } from "./dps-meter.ts";

function identity(
  actorId: number,
  displayName: string,
  tick = 1,
  ownerConnectionId?: number,
): FishNetActorIdentityEvent {
  return {
    kind: "actorIdentity",
    operation: "upsert",
    tick,
    actorId,
    displayName,
    ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
  };
}

function damage(
  actorId: number,
  value: number,
  sourceId = "SyntheticArc",
  sourceLabel = "Synthetic Arc",
  team = 0,
  hitResult: FishNetCombatDamageEvent["hitResult"] = "normal",
): FishNetCombatDamageEvent {
  return {
    kind: "damage",
    rpc: "ApplyDamage_C",
    tick: 1,
    payloadBytes: 0,
    fields: {},
    actorId,
    targetId: 900,
    sourceId,
    sourceLabel,
    value,
    hitResult,
    wireHits: 1,
    damageType: 0,
    team,
    element: 0,
    weaponType: 0,
    range: 0,
    isClone: false,
    isSummon: false,
    position: [0, 0, 0],
    origin: [0, 0, 0],
    attribution: "exact",
  };
}

function death(actorId: number, value: number, duplicate: boolean): FishNetCombatDeathEvent {
  const hit = damage(actorId, value);
  const { position: _position, origin: _origin, ...common } = hit;
  return { ...common, kind: "death", rpc: "Death_C", duplicatesDamageEvent: duplicate };
}

describe("FishNetDpsMeter", () => {
  test("ranks identified players and groups personal skill DPS over the encounter duration", () => {
    const meter = new FishNetDpsMeter({ personalName: " aster vale " });
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeIdentity(identity(202, "Briar Stone"), 0);
    meter.consumeCombat(damage(101, 300, "SyntheticArc", "Synthetic Arc", 0, "critical"), 0);
    meter.consumeCombat(damage(101, 200, "SyntheticRain", "Synthetic Rain"), 2_000);
    meter.consumeCombat(damage(202, 250), 2_000);

    const snapshot = meter.getLatestSnapshot();
    expect(snapshot).toMatchObject({ totalDamage: 750, durationMs: 2_000, partyDps: 375, personalMatch: "matched" });
    expect(snapshot?.actors.map(({ displayName, dps }) => [displayName, dps])).toEqual([
      ["Aster Vale", 250],
      ["Briar Stone", 125],
    ]);
    expect(snapshot?.personal?.skills).toMatchObject([
      { sourceId: "SyntheticArc", damage: 300, dps: 150, criticalHits: 1 },
      { sourceId: "SyntheticRain", damage: 200, dps: 100 },
    ]);
  });

  test("retains damage received before identity and merges a reused actor identity", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale" });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 100);
    meter.consumeIdentity({ kind: "actorIdentity", operation: "remove", tick: 2, actorId: 101 }, 200);
    meter.consumeCombat(damage(101, 50), 500);
    meter.consumeIdentity(identity(101, "Aster Vale", 3), 600);

    expect(meter.getLatestSnapshot()?.personal).toMatchObject({ damage: 150, hits: 2 });
  });

  test("filters enemies and non-positive damage while counting each credited lethal record once", () => {
    const meter = new FishNetDpsMeter();
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(death(101, 100, true), 0);
    meter.consumeCombat(death(101, 25, false), 100);
    meter.consumeCombat(damage(101, 500, "EnemyStrike", "Enemy Strike", 1), 100);
    meter.consumeCombat(damage(101, 0), 100);

    expect(meter.getLatestSnapshot()).toMatchObject({ totalDamage: 125, partyDps: 125, actors: [{ kills: 2 }] });
  });

  test("splits idle encounters, supports resets, and converts replay ticks", () => {
    const meter = new FishNetDpsMeter({ idleGapMs: 10_000 });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 1);
    meter.consumeCombat(damage(101, 50), 10_000);
    meter.consumeIdentity(identity(101, "Aster Vale"), 10_001);
    meter.reset(11_000);

    expect(meter.getSnapshots()).toHaveLength(2);
    expect(meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([100, 50]);
    expect(meter.replayTimeMs(330, 300)).toBe(1_000);
  });

  test("preserves the current encounter across connection identity resets", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale" });
    meter.consumeIdentity(identity(101, "Aster Vale", 1, 7), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 2 }, 1_000);
    meter.consumeIdentity(identity(202, "Aster Vale", 3, 8), 1_100);
    meter.consumeCombat(damage(202, 50), 2_000);

    expect(meter.getSnapshots()).toHaveLength(1);
    expect(meter.getLatestSnapshot()).toMatchObject({
      durationMs: 2_000,
      totalDamage: 150,
      personalMatch: "matched",
    });
  });

  test("clears encounter history while retaining identity and personal selection", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale", personalActorId: 101 });
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.reset(1_000);
    meter.consumeCombat(damage(101, 50), 2_000);

    meter.clearEncounters();

    expect(meter.getSnapshots()).toEqual([]);
    expect(meter.getLatestSnapshot()).toBeUndefined();
    expect(meter.getPersonalName()).toBe("Aster Vale");
    expect(meter.getPersonalActorId()).toBe(101);

    meter.consumeCombat(damage(101, 25), 3_000);
    expect(meter.getLatestSnapshot()).toMatchObject({
      totalDamage: 25,
      personalMatch: "matched",
      actors: [{ displayName: "Aster Vale", damage: 25 }],
      personal: { displayName: "Aster Vale", damage: 25 },
    });
  });

  test("uses a 30 second encounter timeout by default", () => {
    const meter = new FishNetDpsMeter();
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(101, 50), 29_999);
    meter.consumeCombat(damage(101, 25), 60_000);

    expect(meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([150, 25]);
  });

  test("reports ambiguous simultaneous personal identities", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale" });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 1);
    meter.consumeIdentity(identity(202, "aster vale"), 1);
    expect(meter.getLatestSnapshot()?.personalMatch).toBe("ambiguous");
  });

  test("merges same-owner combat aliases without making personal matching ambiguous", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale" });
    meter.consumeIdentity(identity(101, "Aster Vale", 1, 7), 0);
    meter.consumeIdentity(identity(202, "Aster Vale", 1, 7), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(202, 150), 1_000);

    expect(meter.getLatestSnapshot()).toMatchObject({
      personalMatch: "matched",
      actors: [{ actorIds: [101, 202], displayName: "Aster Vale", damage: 250 }],
      personal: { actorIds: [101, 202], damage: 250 },
    });
  });

  test("merges credited kills across same-owner combat aliases", () => {
    const meter = new FishNetDpsMeter();
    meter.consumeIdentity(identity(101, "Aster Vale", 1, 7), 0);
    meter.consumeIdentity(identity(202, "Aster Vale", 1, 7), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(death(101, 100, true), 1);
    meter.consumeCombat(damage(202, 100), 2);
    meter.consumeCombat(death(202, 100, true), 3);

    expect(meter.getLatestSnapshot()?.actors).toMatchObject([
      { actorIds: [101, 202], damage: 200, kills: 2 },
    ]);
  });

  test("keeps identical display names separate when they belong to different owners", () => {
    const meter = new FishNetDpsMeter({ personalName: "Aster Vale" });
    meter.consumeIdentity(identity(101, "Aster Vale", 1, 7), 0);
    meter.consumeIdentity(identity(202, "Aster Vale", 1, 8), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(202, 150), 1_000);

    expect(meter.getLatestSnapshot()?.personalMatch).toBe("ambiguous");
    expect(meter.getLatestSnapshot()?.actors).toHaveLength(2);
  });

  test("shows team-zero damage before a display-name sync is observed", () => {
    const meter = new FishNetDpsMeter();
    meter.consumeCombat(damage(303, 240), 0);
    expect(meter.getLatestSnapshot()).toMatchObject({
      totalDamage: 240,
      partyDps: 240,
      actors: [{ displayName: "Player 303", damage: 240 }],
    });
  });

  test("supports an explicit personal actor when no display name is available", () => {
    const meter = new FishNetDpsMeter();
    meter.consumeCombat(damage(303, 240), 0);
    meter.setPersonalActorId(303);
    expect(meter.getLatestSnapshot()).toMatchObject({
      personalMatch: "matched",
      personal: { actorIds: [303], damage: 240 },
    });
  });
});
