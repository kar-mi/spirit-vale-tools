import { describe, expect, test } from "bun:test";

import type { FishNetCombatEvent } from "../events/combat-events.ts";
import { DamageReducer, MOB_IDENTITY_PREFIX } from "./damage.ts";

const LOOKBACK_MS = 10_000;

function damage(actorId: number, targetId: number, atMs: number, team = 1): FishNetCombatEvent {
  return {
    kind: "damage", rpc: "ApplyDamage_C", tick: atMs, payloadBytes: 0, fields: {},
    actorId, targetId, sourceId: "skill:bite", sourceLabel: "Bite", value: 10,
    hitResult: "normal", wireHits: 1, damageType: 0, team, element: 0, weaponType: 0,
    range: 0, isClone: false, isSummon: false, position: [], origin: [], attribution: "exact",
  } as FishNetCombatEvent;
}

function mobIdentity(actorId: number, displayName: string, atMs: number): FishNetCombatEvent {
  return {
    kind: "activation", tick: atMs, actorId,
    sourceId: `${MOB_IDENTITY_PREFIX}mob-${actorId}`, sourceLabel: displayName, level: 10,
  } as unknown as FishNetCombatEvent;
}

describe("reducer retention", () => {
  /**
   * The lookback is the death log's source, so it has to cover the last ten seconds — but no more.
   * An incremental indexing pass serialises this map on every batch, so retaining every target the
   * session ever hit costs repeated writes, not just memory.
   */
  test("retains only targets hit within the lookback, not every target seen", () => {
    const reducer = new DamageReducer();
    // One hit each on 5,000 distinct targets, spread far enough apart to age out repeatedly.
    for (let index = 0; index < 5_000; index += 1) {
      reducer.consumeCombat(damage(90, 1_000 + index, index * 100), index * 100);
    }

    // The sweep runs once per lookback window, so at any moment the map holds the window being
    // accumulated plus at most the one before it — bounded by recent activity, not by the 5,000
    // targets the run went through.
    const perWindow = LOOKBACK_MS / 100;
    expect(reducer.recentHits.size).toBeLessThanOrEqual(perWindow * 2 + 2);
    expect(reducer.recentHits.size).toBeGreaterThan(0);
  });

  test("still gives a death its full lookback of hits", () => {
    const reducer = new DamageReducer();
    // Hits on one victim across the window, interleaved with unrelated targets that must be swept.
    for (let index = 0; index < 100; index += 1) {
      reducer.consumeCombat(damage(90, 7, index * 100), index * 100);
      reducer.consumeCombat(damage(90, 5_000 + index, index * 100), index * 100);
    }
    const hits = reducer.recentHits.get(7) ?? [];
    const newestAtMs = 99 * 100;
    expect(hits.length).toBeGreaterThan(0);
    for (const entry of hits) expect(entry.atMs).toBeGreaterThanOrEqual(newestAtMs - LOOKBACK_MS);
    // The whole run fits inside one lookback window, so nothing should have been dropped.
    expect(hits).toHaveLength(100);
  });

  test("caps retained monster names while keeping the most recently seen", () => {
    const reducer = new DamageReducer();
    for (let index = 0; index < 6_000; index += 1) {
      reducer.consumeCombat(mobIdentity(index, `Mob ${index}`, index), index);
    }

    expect(reducer.mobIdentities.size).toBeLessThanOrEqual(4_096);
    // The newest survive; the oldest are evicted.
    expect(reducer.mobIdentities.get(5_999)).toBe("Mob 5999");
    expect(reducer.mobIdentities.has(0)).toBe(false);
  });

  test("caps retained player identities while keeping the most recently seen", () => {
    // Same reasoning as the monster names: this map is serialised to the read model on every batch,
    // so a crowded hub would otherwise make each pass rewrite every player the session ever saw.
    const reducer = new DamageReducer();
    for (let index = 0; index < 6_000; index += 1) {
      reducer.consumeIdentity(
        { kind: "actorIdentity", operation: "upsert", tick: index, actorId: index, displayName: `Player ${index}` } as never,
        index,
      );
    }

    expect(reducer.identities.size).toBeLessThanOrEqual(4_096);
    expect(reducer.identities.get(5_999)?.displayName).toBe("Player 5999");
    expect(reducer.identities.has(0)).toBe(false);
  });

  test("keeps a player identity alive when the actor is seen again", () => {
    const reducer = new DamageReducer();
    const upsert = (actorId: number, displayName: string, tick: number): void => {
      reducer.consumeIdentity(
        { kind: "actorIdentity", operation: "upsert", tick, actorId, displayName } as never,
        tick,
      );
    };
    upsert(1, "Aurora", 0);
    for (let index = 0; index < 4_090; index += 1) upsert(1_000 + index, `Player ${index}`, index + 1);
    upsert(1, "Aurora", 5_000);
    for (let index = 0; index < 100; index += 1) upsert(9_000 + index, `Late ${index}`, 5_001 + index);

    expect(reducer.identities.get(1)?.displayName).toBe("Aurora");
  });

  test("keeps a name alive when the monster is seen again", () => {
    const reducer = new DamageReducer();
    reducer.consumeCombat(mobIdentity(1, "Shark Buccaneer", 0), 0);
    for (let index = 0; index < 4_090; index += 1) {
      reducer.consumeCombat(mobIdentity(1_000 + index, `Mob ${index}`, index + 1), index + 1);
    }
    // Re-seeing it makes it most recent, so the next wave of names evicts something else.
    reducer.consumeCombat(mobIdentity(1, "Shark Buccaneer", 5_000), 5_000);
    for (let index = 0; index < 100; index += 1) {
      reducer.consumeCombat(mobIdentity(9_000 + index, `Late ${index}`, 5_001 + index), 5_001 + index);
    }

    expect(reducer.mobIdentities.get(1)).toBe("Shark Buccaneer");
  });
});
