import { describe, expect, test } from "bun:test";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import { FishNetStatusTracker } from "./status-tracker.ts";
import type { FishNetCombatActivationEvent, FishNetCombatDeathEvent, FishNetCombatStatusEvent, FishNetCombatSummonEvent } from "./combat-tracker.ts";

const SYNTHETIC_CATALOG: FishNetStatusCatalog = {
  buildFingerprint: "synthetic-build",
  statuses: [
    {
      id: "Burn",
      displayName: "Burn",
      spriteId: "burn-sprite",
      isDebuff: true,
      maxLevel: 5,
      fixedDuration: false,
      effects: [{ id: "Ignite", duration: 3, durationPerLevel: 1, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 }],
    },
    {
      id: "Aura",
      displayName: "Permanent Aura",
      isDebuff: false,
      maxLevel: 0,
      fixedDuration: false,
      effects: [],
    },
    {
      id: "SelfBuff",
      displayName: "Self Buff",
      isDebuff: false,
      maxLevel: 0,
      fixedDuration: false,
      // Self-granting: the skill that casts it shares the same id, like Haste/TwohandQuicken.
      effects: [{ id: "SelfBuff", duration: 0, durationPerLevel: 60, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 }],
    },
    {
      id: "ComboReady",
      displayName: "Combo Ready",
      isDebuff: false,
      maxLevel: 0,
      fixedDuration: true,
      effects: [
        { id: "AerialShot", duration: 4, durationPerLevel: 0, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 },
        { id: "VenomStrike", duration: 4, durationPerLevel: 0, chance: 0, chancePerLevel: 0, stacks: 0, stacksPerLevel: 0 },
      ],
    },
  ],
};

const SYNTHETIC_SKILL_CATALOG: FishNetSkillCatalog = {
  buildFingerprint: "synthetic-build",
  skills: [
    { id: "FictionalClone", displayName: "Fictional Clone", spriteId: "fictional-clone-sprite", kinds: ["active"] },
    { id: "SelfBuff", displayName: "Self Buff Skill", spriteId: "fictional-self-buff-sprite", kinds: ["active"] },
  ],
};

function statusEvent(overrides: Partial<FishNetCombatStatusEvent> = {}): FishNetCombatStatusEvent {
  return {
    kind: "status",
    rpc: "ApplyEffect_T",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId: 1,
    statusId: "Burn",
    level: 1,
    action: "applied",
    ...overrides,
  };
}

function deathEvent(overrides: Partial<FishNetCombatDeathEvent> = {}): FishNetCombatDeathEvent {
  return {
    kind: "death",
    rpc: "Death_C",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId: 99,
    targetId: 1,
    sourceId: "",
    sourceLabel: "",
    value: 0,
    hitResult: "normal",
    wireHits: 1,
    damageType: 0,
    team: 0,
    element: 0,
    weaponType: 0,
    range: 0,
    isClone: false,
    isSummon: false,
    attribution: "exact",
    duplicatesDamageEvent: false,
    ...overrides,
  };
}

function activationEvent(overrides: Partial<FishNetCombatActivationEvent> = {}): FishNetCombatActivationEvent {
  return {
    kind: "activation",
    rpc: "CastComplete_C",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId: 1,
    actionKind: "skill",
    phase: "begin",
    sourceId: "SelfBuff",
    level: 5,
    ...overrides,
  };
}

function summonEvent(overrides: Partial<FishNetCombatSummonEvent> = {}): FishNetCombatSummonEvent {
  return {
    kind: "summon",
    rpc: "CalibrateSummons_T",
    tick: 0,
    payloadBytes: 0,
    fields: {},
    actorId: 1,
    skillId: "FictionalClone",
    stacks: 1,
    ...overrides,
  };
}

describe("FishNetStatusTracker with the observers-facing display feed", () => {
  function display(overrides: Partial<FishNetCombatStatusEvent> = {}): FishNetCombatStatusEvent {
    return {
      kind: "status",
      rpc: "ApplyEffectDisplays_O",
      tick: 0,
      payloadBytes: 0,
      fields: {},
      actorId: 1,
      statusId: "Burn",
      action: "applied",
      ...overrides,
    };
  }

  test("prefers the server's remaining time over the catalog's nominal duration", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    // Burn at level 1 nominally lasts 3s; the server says 9 are left, and it would know.
    tracker.consumeStatus(display({ remainingSeconds: 9 }), 1_000);
    const [status] = tracker.getActiveStatuses(1, 1_000);
    expect(status?.remainingMs).toBe(9_000);
  });

  test("leaves a status without an expiry when the feed reports none", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn" }), 1_000);
    const [status] = tracker.getActiveStatuses(1, 1_000);
    // No remainingSeconds on the event means no expiry, not "expire per the catalog".
    expect(status?.remainingMs).toBeUndefined();
    expect(tracker.getActiveStatuses(1, 100_000)).toHaveLength(1);
  });

  test("keeps the level the owner-only feed established", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(statusEvent({ statusId: "Burn", level: 4 }), 1_000);
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 2, stacks: 3 }), 1_500);
    const [status] = tracker.getActiveStatuses(1, 1_500);
    expect(status).toMatchObject({ level: 4, stacks: 3, remainingMs: 2_000 });
  });

  test("does not treat a periodic refresh as a fresh application", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ remainingSeconds: 10 }), 1_000);
    // The feed repeats while a status is merely still active; appliedAtMs must not creep forward.
    tracker.consumeStatus(display({ remainingSeconds: 8 }), 3_000);
    tracker.consumeStatus(display({ remainingSeconds: 6 }), 5_000);
    const [status] = tracker.getActiveStatuses(1, 5_000);
    expect(status).toMatchObject({ appliedAtMs: 1_000, remainingMs: 6_000 });
  });

  test("surfaces stack counts from the feed", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 10, stacks: 72 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]).toMatchObject({ statusId: "Burn", stacks: 72 });
  });

  test("holds the established expiry when a refresh only rounds it forward", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 30 }), 0);
    // A second later the server still says ~30s because it quantises what it reports. Taking that
    // at face value would walk the expiry forward on every refresh, so the timer never runs out and
    // the rendered seconds bounce.
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 29.6 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]?.remainingMs).toBe(29_000);
  });

  test("takes a refresh that reports less time left", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 30 }), 0);
    // Only a re-application can add time, so an earlier expiry is the countdown making progress.
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 28 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]?.remainingMs).toBe(28_000);
  });

  test("takes a refresh that adds enough time to be a re-application", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 2 }), 0);
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 30 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]?.remainingMs).toBe(30_000);
  });

  test("keeps a toggle alive between refreshes instead of blinking out", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    // "Aura" has no catalog duration, so its reported second is a keep-alive window that must keep
    // advancing. Holding it - as a countdown's rounding correctly is - pins the expiry in the past
    // between refreshes and the cell disappears and comes back.
    for (const at of [0, 500, 1_000, 1_500, 2_000, 2_500]) {
      tracker.consumeStatus(display({ statusId: "Aura", remainingSeconds: 1 }), at);
      expect(tracker.getActiveStatuses(1, at)).toHaveLength(1);
    }
  });

  test("refreshes a self-granting buff when its skill is recast", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    // SelfBuff is granted by a skill of the same id, and the game does not resend the status on a
    // recast - the activation is the only trace. The display feed reports stacks on everything, so
    // a refresh path that skipped anything carrying stacks silently stopped covering these.
    tracker.consumeStatus(display({ statusId: "SelfBuff", remainingSeconds: 60, stacks: 1 }), 0);
    expect(tracker.getActiveStatuses(1, 30_000)[0]?.remainingMs).toBe(30_000);
    tracker.consume(activationEvent({ sourceId: "SelfBuff", level: 1 }), 30_000);
    expect(tracker.getActiveStatuses(1, 30_000)[0]?.remainingMs).toBe(60_000);
  });

  test("leaves summon stacks alone when a skill of the same id activates", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consume(summonEvent({ skillId: "FictionalClone", stacks: 2 }), 1_000);
    tracker.consume(activationEvent({ sourceId: "FictionalClone" }), 5_000);
    // A summon has no timer to refresh; it must keep its stack count and original application time.
    expect(tracker.getActiveStatuses(1, 5_000)[0]).toMatchObject({ stacks: 2, appliedAtMs: 1_000 });
  });

  test("publishes no countdown for a status the catalog gives no duration", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    // "Aura" has no duration in the catalog, and the server re-sends it with a second left each
    // time. Publishing that would render a permanent toggle as forever expiring in one second.
    tracker.consumeStatus(display({ statusId: "Aura", remainingSeconds: 1 }), 1_000);
    const [status] = tracker.getActiveStatuses(1, 1_000);
    expect(status?.remainingMs).toBeUndefined();
    expect(status?.expiresAtMs).toBeUndefined();
  });

  test("still expires an unrefreshed toggle, using the timer it does not publish", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Aura", remainingSeconds: 1 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_500)).toHaveLength(1);
    // Once the refreshes stop the aura has lapsed, so it must not linger forever.
    expect(tracker.getActiveStatuses(1, 2_500)).toHaveLength(0);
  });

  test("keeps publishing a countdown for a status that genuinely has a duration", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 9 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]).toMatchObject({ remainingMs: 9_000 });
  });

  test("the skill-icon feed never erases a countdown the effect feed reported", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", remainingSeconds: 30 }), 1_000);
    // Both feeds report some ids (FlowState, AngelicBlessing in real captures). The icon feed knows
    // only that something is on, so answering "no expiry" here would silently make a timed buff
    // permanent.
    tracker.consumeStatus(display({ statusId: "Burn", rpc: "ApplySkillDisplay_O", level: 2 }), 2_000);
    const [status] = tracker.getActiveStatuses(1, 2_000);
    expect(status).toMatchObject({ level: 2, remainingMs: 29_000 });
  });

  test("a repeated skill-icon apply does not restart the timer", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ statusId: "Burn", rpc: "ApplySkillDisplay_O" }), 1_000);
    tracker.consumeStatus(display({ statusId: "Burn", rpc: "ApplySkillDisplay_O" }), 4_000);
    expect(tracker.getActiveStatuses(1, 4_000)[0]).toMatchObject({ appliedAtMs: 1_000 });
  });

  test("removes a status the feed lists as removed", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG, skillCatalog: SYNTHETIC_SKILL_CATALOG });
    tracker.consumeStatus(display({ remainingSeconds: 30 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(1);
    tracker.consumeStatus(display({ action: "removed" }), 2_000);
    expect(tracker.getActiveStatuses(1, 2_000)).toHaveLength(0);
  });
});

describe("FishNetStatusTracker", () => {
  test("surfaces summon stacks as an indefinite skill-labeled buff", () => {
    const tracker = new FishNetStatusTracker({
      statusCatalog: SYNTHETIC_CATALOG,
      skillCatalog: SYNTHETIC_SKILL_CATALOG,
    });
    tracker.consume(summonEvent({ stacks: 2 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)).toEqual([
      expect.objectContaining({
        statusId: "FictionalClone",
        displayName: "Fictional Clone",
        spriteId: "fictional-clone-sprite",
        isDebuff: false,
        level: 1,
        stacks: 2,
        appliedAtMs: 1_000,
      }),
    ]);
    expect(tracker.getActiveStatuses(1, 1_000)[0]?.expiresAtMs).toBeUndefined();
  });

  test("updates, clears, and reapplies summon stacks across lifecycle boundaries", () => {
    const tracker = new FishNetStatusTracker({
      statusCatalog: SYNTHETIC_CATALOG,
      skillCatalog: SYNTHETIC_SKILL_CATALOG,
    });
    tracker.consume(summonEvent({ stacks: 3 }), 0);
    tracker.consume(summonEvent({ stacks: 2 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]).toMatchObject({ stacks: 2, appliedAtMs: 1_000 });
    tracker.consume(summonEvent({ stacks: 0 }), 2_000);
    expect(tracker.getActiveStatuses(1, 2_000)).toEqual([]);

    tracker.consume(summonEvent({ stacks: 2 }), 3_000);
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 4 });
    expect(tracker.getActiveStatuses(1, 4_000)).toEqual([]);
    tracker.consume(summonEvent({ actorId: 2, stacks: 2 }), 5_000);
    expect(tracker.getActiveStatuses(2, 5_000)[0]).toMatchObject({ stacks: 2, appliedAtMs: 5_000 });
  });

  test("a clone death only clears statuses belonging to the clone actor", () => {
    const tracker = new FishNetStatusTracker({
      statusCatalog: SYNTHETIC_CATALOG,
      skillCatalog: SYNTHETIC_SKILL_CATALOG,
    });
    tracker.consume(summonEvent({ actorId: 1, stacks: 3 }), 0);
    tracker.consume(deathEvent({ actorId: 99, targetId: 50 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]).toMatchObject({ stacks: 3 });
    tracker.consume(summonEvent({ actorId: 1, stacks: 2 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)[0]).toMatchObject({ stacks: 2 });
  });

  test("computes an expiry from the catalog's duration-by-level and expires it", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ level: 3 }), 1_000);
    const [active] = tracker.getActiveStatuses(1, 1_000);
    expect(active).toMatchObject({
      statusId: "Burn",
      displayName: "Burn",
      spriteId: "burn-sprite",
      isDebuff: true,
      level: 3,
      appliedAtMs: 1_000,
      expiresAtMs: 7_000, // 3s base + 3*1s = 6s duration
      remainingMs: 6_000,
    });
    expect(tracker.getActiveStatuses(1, 7_500)).toHaveLength(0);
  });

  test("removes a status immediately on RemoveEffect_T", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent(), 1_000);
    tracker.consumeStatus(statusEvent({ action: "removed" }), 1_500);
    expect(tracker.getActiveStatuses(1, 1_500)).toHaveLength(0);
  });

  test("leaves no expiry for statuses without duration data", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ statusId: "Aura", level: 1 }), 0);
    const [active] = tracker.getActiveStatuses(1, 1_000_000);
    expect(active).toMatchObject({ statusId: "Aura", isDebuff: false });
    expect(active?.expiresAtMs).toBeUndefined();
  });

  test("falls back to the matching skill sprite when status metadata has none", () => {
    const tracker = new FishNetStatusTracker({
      statusCatalog: SYNTHETIC_CATALOG,
      skillCatalog: SYNTHETIC_SKILL_CATALOG,
    });
    tracker.consumeStatus(statusEvent({ statusId: "SelfBuff", level: 1 }), 0);
    expect(tracker.getActiveStatuses(1, 0)[0]).toMatchObject({
      statusId: "SelfBuff",
      displayName: "Self Buff",
      spriteId: "fictional-self-buff-sprite",
    });
  });

  test("advance() drops expired statuses even without an explicit remove", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ level: 1 }), 0);
    tracker.advance(4_000);
    expect(tracker.getActiveStatuses(1, 4_000)).toHaveLength(0);
  });

  test("falls back to the raw status id when the catalog has no definition", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ statusId: "Unknown" }), 0);
    const [active] = tracker.getActiveStatuses(1, 0);
    expect(active).toMatchObject({ statusId: "Unknown", displayName: "Unknown", isDebuff: false });
  });

  test("tracks statuses per actor independently", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1 }), 0);
    tracker.consumeStatus(statusEvent({ actorId: 2, statusId: "Aura" }), 0);
    expect(tracker.getActiveStatuses(1, 0)).toHaveLength(1);
    expect(tracker.getActiveStatuses(2, 0)).toHaveLength(1);
    expect(tracker.getActiveStatuses(1, 0)[0]?.statusId).toBe("Burn");
  });

  test("getActiveStatusesForActors merges and dedupes across actor IDs", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    tracker.consumeStatus(statusEvent({ actorId: 2, statusId: "Aura" }), 1_000);
    tracker.consumeStatus(statusEvent({ actorId: 2, statusId: "Burn" }), 0);
    const merged = tracker.getActiveStatusesForActors([1, 2], 0);
    expect(merged).toHaveLength(2);
    expect(merged.find((status) => status.statusId === "Aura")?.appliedAtMs).toBe(1_000);
  });

  test("consume() refreshes a self-granted status's expiry when its skill activates again", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consume(statusEvent({ statusId: "SelfBuff", level: 5, action: "applied" }), 0);
    const initial = tracker.getActiveStatuses(1, 0)[0];
    expect(initial?.expiresAtMs).toBe(300_000); // 0 + 5*60s

    tracker.consume(activationEvent(), 200_000); // recast with 100s left on the clock
    const refreshed = tracker.getActiveStatuses(1, 200_000)[0];
    expect(refreshed?.appliedAtMs).toBe(200_000);
    expect(refreshed?.expiresAtMs).toBe(500_000);
    expect(refreshed?.remainingMs).toBe(300_000);
  });

  test("consume() refreshes a differently-named ready status from any cataloged granting skill", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consume(statusEvent({ statusId: "ComboReady", level: 1 }), 0);

    tracker.consume(activationEvent({ sourceId: "VenomStrike", level: 5 }), 3_000);

    expect(tracker.getActiveStatuses(1, 3_000)[0]).toMatchObject({
      statusId: "ComboReady",
      appliedAtMs: 3_000,
      expiresAtMs: 7_000,
      remainingMs: 4_000,
    });
  });

  test("consume() ignores activations that neither match nor grant an active status", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consume(statusEvent({ statusId: "ComboReady", level: 1 }), 0);
    tracker.consume(activationEvent({ sourceId: "UnrelatedSkill" }), 2_000);
    expect(tracker.getActiveStatuses(1, 2_000)[0]).toMatchObject({
      statusId: "ComboReady",
      appliedAtMs: 0,
      expiresAtMs: 4_000,
      remainingMs: 2_000,
    });
  });

  test("consume() ignores interrupted/cancelled activations", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consume(statusEvent({ statusId: "SelfBuff", level: 5 }), 0);
    tracker.consume(activationEvent({ phase: "interrupt" }), 200_000);
    const active = tracker.getActiveStatuses(1, 200_000)[0];
    expect(active?.appliedAtMs).toBe(0);
  });

  test("reset() clears all tracked statuses", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ statusId: "Aura" }), 0);
    tracker.reset();
    expect(tracker.getActiveStatuses(1, 0)).toHaveLength(0);
  });
});

describe("FishNetStatusTracker identity resolution", () => {
  test("resolves statuses by name learned from an actorIdentity event, before any damage is dealt", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 0, actorId: 1, displayName: "Hero" });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    expect(tracker.getActiveStatusesForName("Hero", 0)).toHaveLength(1);
    expect(tracker.getActiveStatusesForName("hero", 0)).toHaveLength(1);
    expect(tracker.getActiveStatusesForName("Someone Else", 0)).toHaveLength(0);
  });

  test("resolves statuses by name learned from the status event's own embedded identity", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura", actorIdentity: { displayName: "Hero" } }), 0);
    expect(tracker.getActiveStatusesForName("Hero", 0)).toHaveLength(1);
  });

  test("actorIdentity remove/reset drop learned names", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 0, actorId: 1, displayName: "Hero" });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "remove", tick: 1, actorId: 1 });
    expect(tracker.getActiveStatusesForName("Hero", 0)).toHaveLength(0);

    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 2, actorId: 1, displayName: "Hero" });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 3 });
    expect(tracker.getActiveStatusesForName("Hero", 0)).toHaveLength(0);
  });

  test("a reset clears active statuses instead of carrying them to the re-upserted actorId", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 0, actorId: 1, displayName: "Hero", uid: "hero-uid" });
    tracker.consume(statusEvent({ actorId: 1, statusId: "SelfBuff", level: 5, action: "applied" }), 0);
    expect(tracker.getActiveStatusesForName("Hero", 0)).toHaveLength(1);

    // Zone transition: reset drops everything tracked so far - a stale status with no expiry
    // (e.g. one whose remove packet was dropped) doesn't get carried forward into the new zone.
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 1 });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 2, actorId: 2, displayName: "Hero", uid: "hero-uid" });
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(0);
    expect(tracker.getActiveStatuses(2, 1_000)).toHaveLength(0);

    // A status that's genuinely still active gets re-applied by the server after the zone loads.
    tracker.consume(statusEvent({ actorId: 2, statusId: "SelfBuff", level: 5, action: "applied" }), 1_000);
    expect(tracker.getActiveStatuses(2, 1_000)).toHaveLength(1);
  });

  test("a uid re-upsert without an intervening reset migrates still-active statuses to the new actorId", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 0, actorId: 1, displayName: "Hero", uid: "hero-uid" });
    tracker.consume(statusEvent({ actorId: 1, statusId: "SelfBuff", level: 5, action: "applied" }), 0);

    // Ownership handoff (or similar) reassigns the same uid to a new actorId with no reset in between.
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 1, actorId: 2, displayName: "Hero", uid: "hero-uid" });
    const [migrated] = tracker.getActiveStatuses(2, 1_000);
    expect(migrated).toMatchObject({ statusId: "SelfBuff", appliedAtMs: 0 });
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(0);
  });

  test("a reset+re-upsert without a uid does not migrate statuses (avoids misattributing a recycled actorId)", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 0, actorId: 1, displayName: "Hero" });
    tracker.consume(statusEvent({ actorId: 1, statusId: "SelfBuff", level: 5, action: "applied" }), 0);

    tracker.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 1 });
    tracker.consumeIdentity({ kind: "actorIdentity", operation: "upsert", tick: 2, actorId: 2, displayName: "Hero" });
    expect(tracker.getActiveStatusesForName("Hero", 1_000)).toHaveLength(0);
  });

  test("a zone reset clears a toggle status that has no expiry, even without a matching remove", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    expect(tracker.getActiveStatuses(1, 0)).toHaveLength(1);

    tracker.consumeIdentity({ kind: "actorIdentity", operation: "reset", tick: 1 });
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(0);
  });

  test("despawn clears a toggle status that has no expiry, even without a matching remove", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    expect(tracker.getActiveStatuses(1, 0)).toHaveLength(1);

    tracker.consumeIdentity({ kind: "actorIdentity", operation: "remove", tick: 1, actorId: 1 });
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(0);
  });

  test("death clears a toggle status on the actor that died, even without a matching remove", () => {
    const tracker = new FishNetStatusTracker({ statusCatalog: SYNTHETIC_CATALOG });
    tracker.consumeStatus(statusEvent({ actorId: 1, statusId: "Aura" }), 0);
    expect(tracker.getActiveStatuses(1, 0)).toHaveLength(1);

    tracker.consume(deathEvent({ actorId: 99, targetId: 1 }), 1_000);
    expect(tracker.getActiveStatuses(1, 1_000)).toHaveLength(0);
  });
});
