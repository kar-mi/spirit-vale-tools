import { describe, expect, test } from "bun:test";

import { FishNetCombatTracker } from "./combat-tracker.ts";
import {
  barrierSync,
  castTargeting,
  damage,
  field,
  objectSpawn,
  statusEffect,
} from "../testing/combat-packets.ts";

describe("shield lifecycle", () => {
  test("attributes a barrier gain and carries its source through absorption and clearing", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(barrierSync(1, 20, 0))).toEqual([]);
    tracker.consume(castTargeting(2, 10, "Barrier", 20));
    tracker.consume(statusEffect(3, 20, "ApplyEffect_T", [field("statusId", "Barrier"), field("level", 2)]));

    expect(tracker.consume(barrierSync(4, 20, 400))).toEqual([
      expect.objectContaining({
        kind: "shield", action: "gained", actorId: 10, targetId: 20,
        sourceId: "Barrier", sourceLabel: "Sacred Aegis", value: 400,
        barrierBefore: 0, barrierAfter: 400, attribution: "inferred",
      }),
    ]);

    tracker.consume(damage(5, 20, 90, "SyntheticStrike", 100));
    expect(tracker.consume(barrierSync(5, 20, 300))).toEqual([
      expect.objectContaining({ kind: "shield", action: "absorbed", actorId: 10, targetId: 20, value: 100 }),
    ]);

    tracker.consume(statusEffect(6, 20, "RemoveEffect_T", [field("statusId", "Barrier"), field("level", 2)]));
    expect(tracker.consume(barrierSync(6, 20, 0))).toEqual([
      expect.objectContaining({ kind: "shield", action: "cleared", actorId: 10, targetId: 20, value: 300 }),
    ]);
  });

  test("reads a full absorb as absorbed, not an expiry, and names the incoming hit", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    tracker.consume(barrierSync(2, 20, 300));
    // No barrier status is tracked for this shield, and the hit takes it to exactly zero.
    tracker.consume(damage(3, 20, 90, "SyntheticStrike", 300));
    expect(tracker.consume(barrierSync(3, 20, 0))).toEqual([
      expect.objectContaining({
        kind: "shield", action: "absorbed", targetId: 20, value: 300,
        incomingActorId: 90, incomingSourceId: "SyntheticStrike",
      }),
    ]);
  });

  test("pairs a fully-soaked hit (zero HP damage) with the barrier drop", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    tracker.consume(barrierSync(2, 20, 500));
    // The barrier ate the whole hit, so the damage packet reports 0 to HP.
    tracker.consume(damage(3, 20, 90, "SyntheticStrike", 0));
    expect(tracker.consume(barrierSync(3, 20, 200))).toEqual([
      expect.objectContaining({
        kind: "shield", action: "absorbed", targetId: 20, value: 300,
        incomingActorId: 90, incomingSourceId: "SyntheticStrike",
      }),
    ]);
  });

  test("keeps an uncorrelated barrier gain unattributed", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    expect(tracker.consume(barrierSync(2, 20, 250))).toEqual([
      expect.objectContaining({ kind: "shield", action: "gained", targetId: 20, attribution: "unattributed" }),
    ]);
    expect(tracker.consume(barrierSync(3, 20, 200))).toEqual([
      expect.objectContaining({ kind: "shield", action: "reduced", targetId: 20, attribution: "unattributed" }),
    ]);
  });

  test("marks overlapping barrier casts ambiguous", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    tracker.consume(castTargeting(2, 10, "Barrier", 20));
    tracker.consume(castTargeting(2, 11, "Barrier", 20));
    expect(tracker.consume(barrierSync(3, 20, 300))).toEqual([
      expect.objectContaining({ kind: "shield", action: "gained", attribution: "ambiguous", targetId: 20 }),
    ]);
  });

  test("drops barrier state when an object id is reused without a barrier spawn sync", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    tracker.consume(castTargeting(2, 10, "Barrier", 20));
    tracker.consume(barrierSync(3, 20, 300));

    tracker.consume(objectSpawn(4, 20));

    expect(tracker.consume(barrierSync(5, 20, 0))).toEqual([]);
  });

  test("does not carry barrier status through a reused id's spawn sync", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(barrierSync(1, 20, 0));
    tracker.consume(statusEffect(2, 20, "ApplyEffect_T", [field("statusId", "Barrier"), field("level", 2)]));
    const spawnedBarrier = field("barrierSync", 300);

    tracker.consume(objectSpawn(3, 20, [{
      componentIndex: 0,
      index: 2,
      name: "barrierSync",
      networkBehaviourType: "HealthComponent",
      fields: [spawnedBarrier],
    }]));

    expect(tracker.consume(barrierSync(4, 20, 0))).toEqual([
      expect.objectContaining({ kind: "shield", action: "cleared", targetId: 20 }),
    ]);
  });
});
