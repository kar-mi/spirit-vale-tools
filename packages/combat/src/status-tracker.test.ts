import { describe, expect, test } from "bun:test";
import type { FishNetStatusCatalog } from "@kar-mi/spirit-vale-tools-statuses";
import { FishNetStatusTracker } from "./status-tracker.ts";
import type { FishNetCombatStatusEvent } from "./combat-tracker.ts";

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

describe("FishNetStatusTracker", () => {
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
      expiresAtMs: 6_000, // 3s base + (3-1)*1s = 5s duration
      remainingMs: 5_000,
    });
    expect(tracker.getActiveStatuses(1, 6_500)).toHaveLength(0);
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
});
