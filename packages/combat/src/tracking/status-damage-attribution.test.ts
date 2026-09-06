import { describe, expect, test } from "bun:test";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import { StatusDamageAttributionTracker } from "./status-damage-attribution.ts";
import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatActivationEvent, FishNetCombatDamageEvent, FishNetCombatStatusEvent } from "../events/combat-events.ts";

const CATALOG: FishNetStatusCatalog = {
  buildFingerprint: "synthetic-build",
  statuses: [
    {
      id: "Burn",
      displayName: "Burn",
      isDebuff: true,
      maxLevel: 0,
      fixedDuration: false,
      effects: [
        { id: "Fireball", duration: 8, durationPerLevel: 0, chance: 0, chancePerLevel: 0, stacks: 2, stacksPerLevel: 0 },
        { id: "FireCoating", duration: 3, durationPerLevel: 1, chance: 0, chancePerLevel: 0, stacks: 1, stacksPerLevel: 0 },
      ],
      damage: 1,
      damagePerc: 3,
      element: 4,
      appliedBy: ["Fireball", "FireCoating"],
    },
    {
      id: "FireCoating",
      displayName: "Fire Coating",
      isDebuff: false,
      maxLevel: 0,
      fixedDuration: false,
      effects: [{ id: "FireCoating", duration: 0, durationPerLevel: 60, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 }],
    },
    {
      id: "Stun",
      displayName: "Stun",
      isDebuff: false,
      maxLevel: 0,
      fixedDuration: true,
      effects: [{ id: "Stun", duration: 2, durationPerLevel: 0, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 }],
    },
  ],
};

const ENEMY = 900;

function tracker(): StatusDamageAttributionTracker {
  const instance = new StatusDamageAttributionTracker({ statusCatalog: CATALOG });
  for (const actorId of [1, 2, 3]) instance.consumeIdentity(identity(actorId));
  return instance;
}

function identity(actorId: number): FishNetActorIdentityEvent {
  return { kind: "actorIdentity", operation: "upsert", tick: 0, actorId, displayName: `Player ${actorId}` };
}

function hit(actorId: number, overrides: Partial<FishNetCombatDamageEvent> = {}): FishNetCombatDamageEvent {
  return {
    kind: "damage",
    rpc: "ApplyDamage_C",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId,
    targetId: ENEMY,
    sourceId: "Fireball",
    sourceLabel: "Fireball",
    value: 100,
    hitResult: "normal",
    wireHits: 1,
    damageType: 0,
    team: 0,
    element: 4,
    weaponType: 0,
    range: 0,
    isClone: false,
    isSummon: false,
    position: [],
    origin: [],
    attribution: "exact",
    ...overrides,
  };
}

function snapshot(stacks: number, overrides: Partial<FishNetCombatStatusEvent> = {}): FishNetCombatStatusEvent {
  return {
    kind: "status",
    rpc: "ApplyEffectDisplays_O",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId: ENEMY,
    statusId: "Burn",
    action: "applied",
    stacks,
    ...overrides,
  };
}

function buff(actorId: number, statusId: string): FishNetCombatStatusEvent {
  return {
    kind: "status",
    rpc: "ApplyEffect_T",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId,
    statusId,
    level: 1,
    action: "applied",
  };
}

describe("StatusDamageAttributionTracker", () => {
  test("expires each application at its hit time without refreshing earlier stacks", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000);
    t.consumeCombat(snapshot(2), 1_500);
    t.consumeCombat(hit(2), 4_000);
    t.consumeCombat(snapshot(4, { remainingSeconds: 8 }), 4_500);
    t.consumeCombat(snapshot(4, { remainingSeconds: 8 }), 8_000);
    t.advance(9_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[2, 2]]), unattributed: 0 });
    t.advance(12_000);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
  });

  test("replaces ownership when expiry and a new application leave the total unchanged", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000);
    t.consumeCombat(snapshot(2), 1_100);
    t.consumeCombat(hit(2), 8_900);
    t.consumeCombat(snapshot(2), 9_100);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[2, 2]]), unattributed: 0 });
  });

  test("uses different expiry times for a direct skill and a level-dependent coating on the same hit", () => {
    const t = tracker();
    t.consumeCombat(buff(1, "FireCoating"), 0);
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000); // Two eight-second skill stacks, one four-second coating stack.
    t.consumeCombat(snapshot(3), 1_100);
    expect(t.shares(ENEMY, "Burn")?.totalStacks).toBe(3);
    t.advance(5_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[1, 2]]), unattributed: 0 });
    t.advance(9_000);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
  });

  test("separates corroborated applications from multiple actors in one snapshot", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000);
    t.consumeCombat(hit(2), 1_200);
    t.consumeCombat(snapshot(4), 1_500);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 4, byActor: new Map([[1, 2], [2, 2]]), unattributed: 0 });
    t.advance(9_000);
    expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[2, 2]]));
  });

  test("does not treat status ticks, other periodic damage, or missed hits as coating applications", () => {
    for (const overrides of [
      { sourceId: "Burn", damageType: 0 },
      { sourceId: "UnknownPeriodic", damageType: 3 },
      { hitResult: "miss" as const },
      { hitResult: "dodged" as const },
      { value: 0 },
      { value: -10 },
    ]) {
      const t = tracker();
      t.consumeCombat(buff(1, "FireCoating"), 0);
      t.consumeCombat(snapshot(0), 0);
      t.consumeCombat(hit(1, overrides), 1_000);
      t.consumeCombat(hit(2), 1_100);
      t.consumeCombat(snapshot(2), 1_200);
      expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[2, 2]]));
    }
  });

  test("does not reuse applications from a removed or unchanged snapshot interval", () => {
    for (const action of ["applied", "removed"] as const) {
      const t = tracker();
      t.consumeCombat(snapshot(0), 0);
      t.consumeCombat(hit(1), 100);
      t.consumeCombat(snapshot(0, { action }), 200);
      t.consumeCombat(hit(2), 300);
      t.consumeCombat(snapshot(2), 400);
      expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[2, 2]]));
    }
  });

  test("does not guess the level of a coating seen only through observer displays", () => {
    const t = tracker();
    const coating: FishNetCombatStatusEvent = { ...buff(1, "FireCoating"), rpc: "ApplyEffectDisplays_O", level: undefined, remainingSeconds: 60 };
    t.consumeCombat(coating, 0);
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1, { sourceId: "Slash" }), 100);
    t.consumeCombat(snapshot(1), 200);
    expect(t.shares(ENEMY, "Burn")?.unattributed).toBe(1);
  });

  test("does not pin ownership at an explicit saturated ceiling", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 100);
    t.consumeCombat(snapshot(2, { maxStacks: 2 }), 200);
    t.consumeCombat(hit(2), 300);
    t.consumeCombat(snapshot(2, { maxStacks: 2 }), 400);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map(), unattributed: 2 });
  });

  test("expires batches during DoT ticks even without observer updates", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 100);
    t.consumeCombat(snapshot(2), 200);
    t.consumeCombat(hit(1, { sourceId: "Burn", damageType: 3 }), 8_100);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
  });

  test("uses an observed skill level for source-specific stack counts and duration", () => {
    const scaled: FishNetStatusCatalog = { ...CATALOG, statuses: CATALOG.statuses.map((status) => status.id !== "Burn" ? status : {
      ...status, effects: [{ id: "Fireball", duration: 2, durationPerLevel: 1, stacks: 1, stacksPerLevel: 1, chance: 0, chancePerLevel: 0 }],
    }) };
    const t = new StatusDamageAttributionTracker({ statusCatalog: scaled });
    t.consumeIdentity(identity(1));
    t.consumeCombat(snapshot(0), 0);
    const activation: FishNetCombatActivationEvent = {
      kind: "activation", rpc: "CastBegin_C", tick: 0, payloadBytes: 0, fields: {},
      actorId: 1, sourceId: "Fireball", level: 3, actionKind: "skill", phase: "begin",
    };
    t.consumeCombat(activation, 100);
    t.consumeCombat(hit(1), 200);
    t.consumeCombat(snapshot(4), 300);
    expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[1, 4]]));
    t.advance(5_199);
    expect(t.shares(ENEMY, "Burn")?.totalStacks).toBe(4);
    t.advance(5_200);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
  });

  test("does not invent a one-stack snapshot from a count-free status event", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 100);
    t.consumeCombat(snapshot(2), 200);
    t.consumeCombat(snapshot(0, { stacks: undefined, rpc: "ApplyEffect_T" }), 300);
    expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[1, 2]]));
  });

  test("keeps independent application queues for different targets", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(snapshot(0, { actorId: 901 }), 0);
    t.consumeCombat(hit(1), 100);
    t.consumeCombat(hit(2, { targetId: 901 }), 200);
    t.consumeCombat(snapshot(2, { actorId: 901 }), 300);
    t.consumeCombat(snapshot(2), 400);
    expect(t.shares(ENEMY, "Burn")?.byActor).toEqual(new Map([[1, 2]]));
    expect(t.shares(901, "Burn")?.byActor).toEqual(new Map([[2, 2]]));
  });

  test("rejects invalid correlation windows and leaves late evidence unattributed", () => {
    for (const correlationWindowMs of [-1, Infinity, NaN]) {
      expect(() => new StatusDamageAttributionTracker({ statusCatalog: CATALOG, correlationWindowMs })).toThrow();
    }
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 100);
    t.consumeCombat(snapshot(2), 1_101);
    expect(t.shares(ENEMY, "Burn")?.unattributed).toBe(2);
  });

  test("drops attribution when a monster despawns or its object is reused", () => {
    for (const operation of ["remove", "upsert"] as const) {
      const t = tracker();
      t.consumeCombat(snapshot(0), 0);
      t.consumeCombat(hit(1), 100);
      t.consumeCombat(snapshot(2), 200);
      t.consumeCombat({ kind: "monsterIdentity", operation, tick: 1, actorId: ENEMY, mobId: "SyntheticMob", displayName: "Synthetic Mob" }, 300);
      expect(t.shares(ENEMY, "Burn")).toBeUndefined();
      t.consumeCombat(snapshot(2), 400);
      expect(t.shares(ENEMY, "Burn")?.unattributed).toBe(2);
    }
  });

  test("credits a clean single-applier increase from a known zero baseline", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000);
    t.consumeCombat(snapshot(2), 1_500);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[1, 2]]), unattributed: 0 });
  });

  test("marks a competing increase unattributed", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 1_000);
    t.consumeCombat(hit(2), 1_100);
    t.consumeCombat(snapshot(2), 1_500);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map(), unattributed: 2 });
  });

  test("treats stacks first seen without a zero baseline as unattributed", () => {
    const t = tracker();
    t.consumeCombat(hit(1), 900);
    t.consumeCombat(snapshot(3), 1_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 3, byActor: new Map(), unattributed: 3 });
  });

  test("accumulates successive increases per actor", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 500);
    t.consumeCombat(snapshot(2), 1_000);
    t.consumeCombat(hit(1), 1_500);
    t.consumeCombat(hit(1), 1_600);
    t.consumeCombat(snapshot(6), 2_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 6, byActor: new Map([[1, 6]]), unattributed: 0 });
  });

  test("marks unexplained losses unattributed instead of proportionally shrinking ownership", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 500);
    t.consumeCombat(snapshot(2), 1_000);
    t.consumeCombat(hit(2), 1_200);
    t.consumeCombat(hit(3), 1_250);
    t.consumeCombat(snapshot(6), 1_500);
    t.consumeCombat(snapshot(2), 2_000);
    const shares = t.shares(ENEMY, "Burn")!;
    expect(shares.totalStacks).toBe(2);
    expect(shares.byActor.size).toBe(0);
    expect(shares.unattributed).toBe(2);
  });

  test("attributes via an active coating even when the hit skill is not a direct applier", () => {
    const t = tracker();
    t.consumeCombat(buff(1, "FireCoating"), 0);
    t.consumeCombat(snapshot(0), 100);
    t.consumeCombat(hit(1, { sourceId: "Slash", sourceLabel: "Slash" }), 1_000);
    t.consumeCombat(snapshot(1), 1_500);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 1, byActor: new Map([[1, 1]]), unattributed: 0 });
  });

  test("stops crediting a coating once it has expired", () => {
    const t = tracker();
    t.consumeCombat(buff(1, "FireCoating"), 0); // 60s duration
    t.consumeCombat(snapshot(0), 0);
    t.advance(120_000);
    t.consumeCombat(hit(1, { sourceId: "Slash", sourceLabel: "Slash" }), 120_500);
    t.consumeCombat(snapshot(1), 121_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 1, byActor: new Map(), unattributed: 1 });
  });

  test("clears the ledger on removal and starts the next episode fresh", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 500);
    t.consumeCombat(snapshot(2), 1_000);
    t.consumeCombat(snapshot(2, { action: "removed" }), 2_000);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
    t.consumeCombat(hit(2), 3_000);
    t.consumeCombat(snapshot(2), 3_500);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[2, 2]]), unattributed: 0 });
  });

  test("drops every episode for a target that dies", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 500);
    t.consumeCombat(snapshot(2), 1_000);
    t.consumeCombat({ ...hit(99), kind: "death", rpc: "Death_C", targetId: ENEMY, duplicatesDamageEvent: false } as never, 1_500);
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
  });

  test("ignores party-on-party hits and non-damaging statuses", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1, { targetId: 2 }), 500); // friendly target
    t.consumeCombat(snapshot(1), 1_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 1, byActor: new Map(), unattributed: 1 });

    t.consumeCombat({ ...snapshot(1), statusId: "Stun" }, 1_500);
    expect(t.shares(ENEMY, "Stun")).toBeUndefined();
  });

  test("endEncounter discards episodes but keeps party membership", () => {
    const t = tracker();
    t.consumeCombat(snapshot(0), 0);
    t.consumeCombat(hit(1), 500);
    t.consumeCombat(snapshot(2), 1_000);
    t.endEncounter();
    expect(t.shares(ENEMY, "Burn")).toBeUndefined();
    t.consumeCombat(snapshot(0), 5_000);
    t.consumeCombat(hit(1), 5_500);
    t.consumeCombat(snapshot(2), 6_000);
    expect(t.shares(ENEMY, "Burn")).toEqual({ totalStacks: 2, byActor: new Map([[1, 2]]), unattributed: 0 });
  });
});
