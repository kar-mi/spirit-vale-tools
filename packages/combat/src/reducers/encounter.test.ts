import { describe, expect, test } from "bun:test";

import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatDamageEvent, FishNetCombatDeathEvent } from "../combat-tracker.ts";
import { DamageReducer } from "./damage.ts";
import type { EncounterAggregate } from "./damage.ts";
import { renderEncounter } from "./rows.ts";
import type { FishNetDpsEncounterSnapshot } from "../snapshot.ts";

interface HarnessOptions {
  idleGapMs?: number;
  minimumDurationMs?: number;
  currentTauSeconds?: number;
  anonymousIdentityGraceMs?: number;
  personalName?: string;
  personalActorId?: number;
}

class MeterHarness {
  private readonly reducer: DamageReducer;
  private readonly finished: EncounterAggregate[] = [];
  private personalName: string;
  private personalActorId: number | undefined;
  private readonly minimumDurationMs: number | undefined;
  private readonly anonymousIdentityGraceMs: number | undefined;

  constructor(options: HarnessOptions = {}) {
    this.reducer = new DamageReducer({
      ...(options.idleGapMs === undefined ? {} : { idleGapMs: options.idleGapMs }),
      ...(options.currentTauSeconds === undefined ? {} : { currentTauSeconds: options.currentTauSeconds }),
      onEncounterFinished: (encounter) => this.finished.push(encounter),
    });
    this.personalName = options.personalName?.trim() ?? "";
    this.personalActorId = options.personalActorId;
    this.minimumDurationMs = options.minimumDurationMs;
    this.anonymousIdentityGraceMs = options.anonymousIdentityGraceMs;
  }

  consumeIdentity(event: FishNetActorIdentityEvent, observedAtMs: number): void {
    this.reducer.consumeIdentity(event, observedAtMs);
  }

  consumeCombat(event: FishNetCombatDamageEvent | FishNetCombatDeathEvent, observedAtMs: number): void {
    this.reducer.consumeCombat(event, observedAtMs);
  }

  advance(observedAtMs: number): void {
    this.reducer.advance(observedAtMs);
  }

  reset(observedAtMs: number): void {
    this.reducer.reset(observedAtMs);
  }

  clearEncounters(): void {
    this.finished.length = 0;
    this.reducer.current = undefined;
  }

  setPersonalName(name: string): void {
    this.personalName = name.trim();
  }

  getPersonalName(): string {
    return this.personalName;
  }

  setPersonalActorId(actorId: number | undefined): void {
    if (actorId !== undefined && (!Number.isInteger(actorId) || actorId < 0)) {
      throw new Error("personalActorId must be a non-negative integer");
    }
    this.personalActorId = actorId;
  }

  getPersonalActorId(): number | undefined {
    return this.personalActorId;
  }

  getSnapshots(nowMs?: number): FishNetDpsEncounterSnapshot[] {
    const encounters = this.reducer.current ? [...this.finished, this.reducer.current] : this.finished;
    return encounters.map((encounter) => this.render(encounter, nowMs));
  }

  getLatestSnapshot(nowMs?: number): FishNetDpsEncounterSnapshot | undefined {
    const encounter = this.reducer.current ?? this.finished.at(-1);
    return encounter ? this.render(encounter, nowMs) : undefined;
  }

  private render(encounter: EncounterAggregate, nowMs?: number): FishNetDpsEncounterSnapshot {
    return renderEncounter(encounter, {
      ...(nowMs === undefined ? {} : { nowMs }),
      ...(this.minimumDurationMs === undefined ? {} : { minimumDurationMs: this.minimumDurationMs }),
      ...(this.anonymousIdentityGraceMs === undefined ? {} : { anonymousIdentityGraceMs: this.anonymousIdentityGraceMs }),
      personalName: this.personalName,
      ...(this.personalActorId === undefined ? {} : { personalActorId: this.personalActorId }),
    });
  }
}

function identity(
  actorId: number,
  displayName: string,
  tick = 1,
  ownerConnectionId?: number,
): Extract<FishNetActorIdentityEvent, { operation: "upsert" }> {
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

describe("encounter aggregation and rendering", () => {
  test("ranks identified players and groups personal skill DPS over the encounter duration", () => {
    const meter = new MeterHarness({ personalName: " aster vale " });
    meter.consumeIdentity({ ...identity(101, "Aster Vale"), archetype: 12 }, 0);
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
    expect(snapshot?.actors[0]?.archetype).toBe(12);
    expect(snapshot?.personal?.skills).toMatchObject([
      { sourceId: "SyntheticArc", damage: 300, dps: 150, criticalHits: 1 },
      { sourceId: "SyntheticRain", damage: 200, dps: 100 },
    ]);
  });

  test("uses the personal first-to-last-hit span without changing the party ranking clock", () => {
    const meter = new MeterHarness({ personalActorId: 101 });
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeIdentity(identity(202, "Briar Stone"), 0);
    meter.consumeCombat(damage(202, 100), 0);
    meter.consumeCombat(damage(101, 300), 5_000);
    meter.consumeCombat(damage(101, 300), 10_000);
    meter.consumeCombat(damage(202, 100), 20_000);

    const snapshot = meter.getLatestSnapshot();
    expect(snapshot).toMatchObject({
      durationMs: 20_000,
      personalMatch: "matched",
      personal: { damage: 600, durationMs: 5_000, dps: 120 },
    });
    expect(snapshot?.actors.find((actor) => actor.actorIds.includes(101))).toMatchObject({
      damage: 600,
      durationMs: 20_000,
      dps: 30,
    });
  });

  test("floors a single-hit personal duration at the configured minimum", () => {
    const meter = new MeterHarness({ personalActorId: 101 });
    meter.consumeCombat(damage(202, 100), 0);
    meter.consumeCombat(damage(101, 300), 5_000);
    meter.consumeCombat(damage(202, 100), 10_000);

    expect(meter.getLatestSnapshot()?.personal).toMatchObject({
      damage: 300,
      durationMs: 1_000,
      dps: 300,
    });
  });

  test("counts distinct enemy targets as mobs hit without counting the player target", () => {
    const meter = new MeterHarness();
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat({ ...damage(101, 100), targetId: 900 }, 0);
    meter.consumeCombat({ ...damage(101, 100), targetId: 901 }, 1_000);
    meter.consumeCombat({ ...damage(101, 100), targetId: 900 }, 2_000);
    meter.consumeCombat({ ...damage(101, 100), targetId: 101 }, 3_000);

    expect(meter.getLatestSnapshot()?.actors).toMatchObject([
      { displayName: "Aster Vale", damage: 300, mobsHit: 2 },
    ]);
  });

  test("retains damage received before identity and merges a reused actor identity", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale" });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 100);
    meter.consumeIdentity({ kind: "actorIdentity", operation: "remove", tick: 2, actorId: 101 }, 200);
    meter.consumeCombat(damage(101, 50), 500);
    meter.consumeIdentity(identity(101, "Aster Vale", 3), 600);

    expect(meter.getLatestSnapshot()?.personal).toMatchObject({ damage: 150, hits: 2 });
  });

  test("retains a known class through empty updates and accepts a changed class", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale" });
    meter.consumeIdentity({ ...identity(101, "Aster Vale"), archetype: 12 }, 0);
    meter.consumeCombat(damage(101, 100), 0);

    meter.consumeIdentity(identity(101, "Aster Vale", 2), 100);
    expect(meter.getLatestSnapshot()?.personal?.archetype).toBe(12);

    meter.consumeIdentity({ ...identity(101, "Aster Vale", 3), archetype: 4 }, 200);
    expect(meter.getLatestSnapshot()?.personal?.archetype).toBe(4);
  });

  test("filters enemies and non-positive damage while counting each credited lethal record once", () => {
    const meter = new MeterHarness();
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(death(101, 100, true), 0);
    meter.consumeCombat(death(101, 25, false), 100);
    meter.consumeCombat(damage(101, 500, "EnemyStrike", "Enemy Strike", 1), 100);
    meter.consumeCombat(damage(101, 0), 100);

    expect(meter.getLatestSnapshot()).toMatchObject({ totalDamage: 125, partyDps: 125, actors: [{ kills: 2 }] });
  });

  test("excludes self-target damage and deaths from outgoing combat statistics", () => {
    const meter = new MeterHarness();
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat({ ...damage(101, 40, "SyntheticBleed", "Synthetic Bleed"), targetId: 101 }, 0);
    meter.consumeCombat({ ...death(101, 40, false), targetId: 101 }, 1);

    expect(meter.getLatestSnapshot()).toBeUndefined();

    meter.consumeCombat(damage(101, 100), 2);
    meter.consumeCombat({ ...damage(101, 25, "SyntheticBleed", "Synthetic Bleed"), targetId: 101 }, 20_000);
    meter.consumeCombat({ ...death(101, 25, false), targetId: 101 }, 20_001);

    expect(meter.getLatestSnapshot(20_001)).toMatchObject({
      totalDamage: 100,
      durationMs: 1_000,
      partyDps: 100,
      actors: [{
        damage: 100,
        hits: 1,
        kills: 0,
        skills: [{ sourceId: "SyntheticArc", damage: 100 }],
        timeline: [
          { elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 },
          { elapsedMs: 1_000, damage: 100, cumulativeDamage: 100, dps: 100 },
        ],
      }],
    });
    const partyCurrentDps = meter.getLatestSnapshot(20_001)?.partyCurrentDps ?? 0;
    expect(partyCurrentDps).toBeGreaterThan(0);
    expect(partyCurrentDps).toBeLessThan(1);
  });

  test("credits summon damage to the server-provided summoner actor", () => {
    const meter = new MeterHarness({ personalActorId: 101 });
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat({
      ...damage(101, 300, "SyntheticSummonStrike", "Synthetic Summon Strike"),
      isSummon: true,
    }, 0);
    meter.consumeCombat({
      ...damage(101, 200, "SyntheticSummonStrike", "Synthetic Summon Strike"),
      isSummon: true,
    }, 5_000);

    expect(meter.getLatestSnapshot(5_000)).toMatchObject({
      totalDamage: 500,
      partyDps: 100,
      personalMatch: "matched",
      actors: [{
        actorIds: [101],
        damage: 500,
        dps: 100,
        contribution: 1,
        skills: [{
          sourceId: "SyntheticSummonStrike",
          damage: 500,
          dps: 100,
          contribution: 1,
          hits: 2,
        }],
        timeline: [
          { elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 },
          { elapsedMs: 5_000, damage: 500, cumulativeDamage: 500, dps: 100 },
        ],
      }],
      personal: { actorIds: [101], damage: 500, dps: 100 },
    });
  });

  test("reports player critical rate and five-second cumulative and DPS timeline buckets", () => {
    const meter = new MeterHarness();
    meter.consumeIdentity(identity(101, "Aster Vale"), 0);
    meter.consumeCombat(damage(101, 100, "SyntheticArc", "Synthetic Arc", 0, "critical"), 0);
    meter.consumeCombat(damage(101, 50, "SyntheticArc", "Synthetic Arc"), 6_000);
    meter.reset(7_000);

    const actor = meter.getLatestSnapshot()?.actors[0];
    expect(actor).toMatchObject({ hits: 2, criticalHits: 1, critRate: 0.5, damage: 150 });
    expect(actor?.skills[0]).toMatchObject({ hits: 2, criticalHits: 1, critRate: 0.5 });
    expect(actor?.timeline).toEqual([
      { elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 },
      { elapsedMs: 5_000, damage: 100, cumulativeDamage: 100, dps: 20 },
      { elapsedMs: 6_000, damage: 50, cumulativeDamage: 150, dps: 50 },
    ]);
  });

  test("splits idle encounters and supports resets", () => {
    const meter = new MeterHarness({ idleGapMs: 10_000 });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 1);
    meter.consumeCombat(damage(101, 50), 10_000);
    meter.consumeIdentity(identity(101, "Aster Vale"), 10_001);
    meter.reset(11_000);

    expect(meter.getSnapshots()).toHaveLength(2);
    expect(meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([100, 50]);
  });

  test("preserves the current encounter across connection identity resets", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale" });
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

  test("merges player damage by trimmed, case-insensitive name across identity changes", () => {
    const meter = new MeterHarness({ personalName: " ember sage " });
    meter.consumeIdentity({
      ...identity(101, "Ember Sage", 1, 7),
      uid: "00000000-0000-0000-0000-000000000001",
    }, 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 2 }, 1_000);
    meter.consumeIdentity({
      ...identity(202, " ember sage ", 3, 8),
      uid: "00000000-0000-0000-0000-000000000002",
    }, 1_100);
    meter.consumeCombat(damage(202, 50), 2_000);

    expect(meter.getLatestSnapshot()).toMatchObject({
      totalDamage: 150,
      personalMatch: "matched",
      personal: {
        actorIds: [101, 202],
        displayName: "Ember Sage",
        damage: 150,
        hits: 2,
      },
      actors: [{
        actorIds: [101, 202],
        displayName: "Ember Sage",
        damage: 150,
        hits: 2,
      }],
    });
  });

  test("clears encounter history while retaining identity and personal selection", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale", personalActorId: 101 });
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
    const meter = new MeterHarness();
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(101, 50), 29_999);
    meter.consumeCombat(damage(101, 25), 60_000);

    expect(meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([150, 25]);
  });

  test("matches simultaneous identities with the same normalized player name", () => {
    const meter = new MeterHarness({ personalName: " aster vale " });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeIdentity(identity(101, "Aster Vale"), 1);
    meter.consumeIdentity(identity(202, "aster vale"), 1);
    expect(meter.getLatestSnapshot()).toMatchObject({
      personalMatch: "matched",
      actors: [{ actorIds: [101], displayName: "Aster Vale", damage: 100 }],
      personal: { actorIds: [101], displayName: "Aster Vale", damage: 100 },
    });
  });

  test("merges same-owner combat aliases without making personal matching ambiguous", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale" });
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
    const meter = new MeterHarness();
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

  test("merges identical display names when they belong to different owners", () => {
    const meter = new MeterHarness({ personalName: "Aster Vale" });
    meter.consumeIdentity(identity(101, "Aster Vale", 1, 7), 0);
    meter.consumeIdentity(identity(202, "Aster Vale", 1, 8), 0);
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(202, 150), 1_000);

    expect(meter.getLatestSnapshot()).toMatchObject({
      personalMatch: "matched",
      actors: [{ actorIds: [101, 202], displayName: "Aster Vale", damage: 250 }],
      personal: { actorIds: [101, 202], damage: 250 },
    });
  });

  test("retains team-zero damage while waiting for a display-name sync", () => {
    const meter = new MeterHarness();
    meter.consumeCombat(damage(303, 240), 0);
    expect(meter.getLatestSnapshot()).toMatchObject({
      totalDamage: 240,
      partyDps: 240,
      actors: [],
    });
    expect(meter.getLatestSnapshot(10_000)?.actors).toMatchObject([
      { displayName: "Unidentified (303)", damage: 240, isUnidentified: true },
    ]);
    expect(meter.getLatestSnapshot(10_000)?.unidentifiedActorIds).toEqual([303]);
  });

  test("supports an explicit personal actor when no display name is available", () => {
    const meter = new MeterHarness();
    meter.consumeCombat(damage(303, 240), 0);
    meter.setPersonalActorId(303);
    expect(meter.getLatestSnapshot()).toMatchObject({
      personalMatch: "matched",
      personal: { actorIds: [303], damage: 240 },
    });
  });

  test("gives each unidentified player its own row instead of one aggregate", () => {
    const meter = new MeterHarness({ personalActorId: 303 });
    meter.consumeCombat({ ...damage(303, 100), targetId: 900 }, 0);
    meter.consumeCombat({ ...damage(404, 300, "SyntheticRain", "Synthetic Rain"), targetId: 901 }, 0);

    const expectSeparatedPersonal = () => {
      expect(meter.getLatestSnapshot(10_000)).toMatchObject({
        // Two anonymous players, two rows, ordered by damage rather than folded together.
        actors: [
          { actorIds: [404], displayName: "Unidentified (404)", damage: 300, rowId: "actor:404" },
          { actorIds: [303], displayName: "Unidentified (303)", damage: 100, rowId: "actor:303" },
        ],
        unidentifiedActorIds: [303, 404],
        personalMatch: "matched",
        personal: {
          actorIds: [303],
          damage: 100,
          hits: 1,
          mobsHit: 1,
          skills: [{ sourceId: "SyntheticArc", damage: 100 }],
          timeline: [{ cumulativeDamage: 0 }, { cumulativeDamage: 100 }],
        },
      });
    };

    expectSeparatedPersonal();
    meter.reset(1_000);
    expectSeparatedPersonal();
  });

  describe("current DPS", () => {
    const TAU = 2.5;
    const ramped = (rate: number, elapsedMs: number): number =>
      rate / (1 - Math.exp(-Math.max(1_000, elapsedMs) / 1_000 / TAU));

    test("a landing hit lifts the rate immediately, by the hit's value over the time constant", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      meter.consumeCombat(damage(101, 300), 0);

      expect(meter.getLatestSnapshot(0)?.actors[0]?.currentDps).toBeCloseTo(ramped(300 / TAU, 0), 6);
    });

    test("ramps the divisor so a fresh encounter is not under-reported", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      meter.consumeCombat(damage(101, 300), 0);
      meter.consumeCombat(damage(101, 300), 3_000);

      // Without the ramp correction a stream this young reads well below its true rate.
      const uncorrected = (300 / TAU) * Math.exp(-3_000 / 1_000 / TAU) + 300 / TAU;
      const corrected = meter.getLatestSnapshot(3_000)?.actors[0]?.currentDps ?? 0;
      expect(corrected).toBeCloseTo(ramped(uncorrected, 3_000), 6);
      expect(corrected).toBeGreaterThan(uncorrected);
    });

    test("older damage still counts, weighted down rather than dropped at a window edge", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      meter.consumeCombat(damage(101, 100), 0);
      meter.consumeCombat(damage(101, 50), 9_000);

      const expected = (100 / TAU) * Math.exp(-9_000 / 1_000 / TAU) + 50 / TAU;
      expect(meter.getLatestSnapshot(9_000)?.actors[0]?.currentDps).toBeCloseTo(ramped(expected, 9_000), 6);
    });

    test("decays smoothly after the last hit instead of cliffing to zero", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      meter.consumeCombat(damage(101, 150), 0);
      meter.consumeCombat(damage(101, 150), 2_500);

      const atFive = meter.getLatestSnapshot(5_000)?.actors[0]?.currentDps ?? 0;
      const atSevenAndAHalf = meter.getLatestSnapshot(7_500)?.actors[0]?.currentDps ?? 0;
      // A five-second rolling window read exactly 0 here; the estimator only fades.
      expect(atSevenAndAHalf).toBeGreaterThan(0);
      expect(atSevenAndAHalf).toBeLessThan(atFive);
      // One time constant apart, the ratio is 1/e once both reads share the same ramp divisor.
      expect(atSevenAndAHalf / atFive).toBeCloseTo(
        Math.exp(-1) * (1 - Math.exp(-5_000 / 1_000 / TAU)) / (1 - Math.exp(-7_500 / 1_000 / TAU)),
        6,
      );
    });

    test("defaults the read time to the last damage timestamp", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      meter.consumeCombat(damage(101, 100), 0);
      meter.consumeCombat(damage(101, 200), 4_000);

      expect(meter.getLatestSnapshot()?.actors[0]?.currentDps)
        .toBe(meter.getLatestSnapshot(4_000)?.actors[0]?.currentDps);
    });

    test("supports a custom time constant and validates it", () => {
      const meter = new MeterHarness({ currentTauSeconds: 5, personalActorId: 101 });
      meter.consumeCombat(damage(101, 100), 0);

      expect(meter.getLatestSnapshot(0)?.actors[0]?.currentDps)
        .toBeCloseTo((100 / 5) / (1 - Math.exp(-1 / 5)), 6);
      expect(() => new MeterHarness({ currentTauSeconds: 0 })).toThrow(
        "currentTauSeconds must be a positive finite number",
      );
      expect(() => new MeterHarness({ currentTauSeconds: Number.NaN })).toThrow(
        "currentTauSeconds must be a positive finite number",
      );
    });

    test("converges on the same steady-state figure the five-second window it replaced reported", () => {
      const meter = new MeterHarness({ personalActorId: 101 });
      // 100 damage every 100ms is a true 1000 DPS, which is what a flat five-second window would have read once full: 5000 damage over five seconds.
      for (let atMs = 0; atMs <= 60_000; atMs += 100) meter.consumeCombat(damage(101, 100), atMs);

      const current = meter.getLatestSnapshot(60_000)?.actors[0]?.currentDps ?? 0;
      expect(current).toBeWithin(970, 1_030);
    });

    test("sums actor current DPS into the party value, including rows held back from display", () => {
      const meter = new MeterHarness();
      meter.consumeCombat(damage(101, 100), 0);
      meter.consumeCombat(damage(202, 300), 10_000);

      const snapshot = meter.getLatestSnapshot(10_000);
      const rows = snapshot?.actors ?? [];
      const party = snapshot?.partyCurrentDps ?? 0;
      // The late actor is still inside its identity grace period, so only one row is shown while both contribute to the party figure.
      expect(rows).toHaveLength(1);
      expect(party).toBeGreaterThan(rows[0]!.currentDps);
      // Both rows ramp from the encounter start, not from their own first hit.
      expect(party).toBeCloseTo(
        ramped((100 / TAU) * Math.exp(-10_000 / 1_000 / TAU) + 300 / TAU, 10_000),
        6,
      );
    });
    });
});

describe("timeline bucket boundaries", () => {
  test("keeps a closing hit that lands exactly on a bucket boundary", () => {
    const meter = new MeterHarness({ personalActorId: 101 });
    meter.consumeCombat(damage(101, 300), 0);
    meter.consumeCombat(damage(101, 200), 5_000);

    const actor = meter.getLatestSnapshot(5_000)?.actors[0];
    expect(actor?.damage).toBe(500);
    expect(actor?.timeline).toEqual([
      { elapsedMs: 0, damage: 0, cumulativeDamage: 0, dps: 0 },
      { elapsedMs: 5_000, damage: 500, cumulativeDamage: 500, dps: 100 },
    ]);
    // The timeline must always account for every point of damage on the row.
    expect(actor?.timeline.at(-1)?.cumulativeDamage).toBe(actor?.damage);
  });

  test("keeps a closing hit on a boundary several buckets into an encounter", () => {
    const meter = new MeterHarness({ personalActorId: 101 });
    meter.consumeCombat(damage(101, 100), 0);
    meter.consumeCombat(damage(101, 100), 7_000);
    meter.consumeCombat(damage(101, 400), 15_000);

    const actor = meter.getLatestSnapshot(15_000)?.actors[0];
    expect(actor?.damage).toBe(600);
    expect(actor?.timeline.at(-1)?.cumulativeDamage).toBe(600);
    expect(actor?.timeline.map(({ damage }) => damage)).toEqual([0, 100, 100, 400]);
  });
});
