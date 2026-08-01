import { describe, expect, test } from "bun:test";

import { FishNetDpsMeter } from "../dps-meter.ts";
import type { FishNetDpsEncounterSnapshot } from "../dps-meter.ts";
import type { FishNetActorIdentityEvent } from "../actor-directory.ts";
import type { FishNetCombatEvent } from "../combat-tracker.ts";
import { DamageReducer } from "./damage.ts";
import type { EncounterAggregate } from "./damage.ts";
import { renderEncounter } from "./rows.ts";

type Timed = { event: FishNetActorIdentityEvent | FishNetCombatEvent; atMs: number };

function identity(actorId: number, displayName: string, atMs: number, extra: Record<string, unknown> = {}): Timed {
  return {
    atMs,
    event: { kind: "actorIdentity", operation: "upsert", tick: atMs, actorId, displayName, ...extra } as unknown as FishNetActorIdentityEvent,
  };
}

function damage(actorId: number, targetId: number, value: number, atMs: number, options: {
  sourceId?: string;
  critical?: boolean;
} = {}): Timed {
  return {
    atMs,
    event: {
      kind: "damage",
      rpc: "ApplyDamage_C",
      tick: atMs,
      actorId,
      targetId,
      team: 0,
      value,
      sourceId: options.sourceId ?? "skill:strike",
      sourceLabel: options.sourceId ?? "Strike",
      hitResult: options.critical ? "critical" : "normal",
    } as unknown as FishNetCombatEvent,
  };
}

function kill(actorId: number, targetId: number, value: number, atMs: number): Timed {
  return {
    atMs,
    event: {
      kind: "death",
      rpc: "Death_C",
      tick: atMs,
      actorId,
      targetId,
      team: 0,
      value,
      sourceId: "skill:strike",
      sourceLabel: "Strike",
      hitResult: "normal",
      duplicatesDamageEvent: false,
    } as unknown as FishNetCombatEvent,
  };
}

interface RunOptions {
  personalName?: string;
  personalActorId?: number;
}

/** Drives the legacy meter and the extracted reducer over the same events. */
function run(events: readonly Timed[], options: RunOptions = {}): {
  legacy: FishNetDpsEncounterSnapshot[];
  rebuilt: FishNetDpsEncounterSnapshot[];
} {
  const meter = new FishNetDpsMeter({
    ...(options.personalName === undefined ? {} : { personalName: options.personalName }),
    ...(options.personalActorId === undefined ? {} : { personalActorId: options.personalActorId }),
  });
  const finished: EncounterAggregate[] = [];
  const reducer = new DamageReducer({ onEncounterFinished: (encounter) => finished.push(encounter) });

  let lastMs = 0;
  for (const { event, atMs } of events) {
    lastMs = atMs;
    if (event.kind === "actorIdentity") {
      meter.consumeIdentity(event, atMs);
      reducer.consumeIdentity(event, atMs);
    } else {
      meter.consumeCombat(event, atMs);
      reducer.consumeCombat(event, atMs);
    }
  }
  meter.reset(lastMs);
  reducer.reset(lastMs);

  const render = (encounter: EncounterAggregate): FishNetDpsEncounterSnapshot => renderEncounter(encounter, {
    nowMs: lastMs,
    ...(options.personalName === undefined ? {} : { personalName: options.personalName }),
    ...(options.personalActorId === undefined ? {} : { personalActorId: options.personalActorId }),
  });
  return { legacy: meter.getSnapshots(lastMs), rebuilt: finished.map(render) };
}

describe("reducer parity with the legacy meter", () => {
  test("reproduces a single encounter field for field", () => {
    const { legacy, rebuilt } = run([
      identity(1, "Aurora", 0),
      identity(2, "Bramble", 0),
      damage(1, 90, 100, 1_000),
      damage(2, 90, 50, 1_500, { sourceId: "skill:ember" }),
      damage(1, 90, 200, 7_000, { critical: true }),
      damage(1, 91, 25, 12_000),
      kill(2, 90, 40, 13_000),
    ]);
    expect(rebuilt).toHaveLength(1);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });

  test("splits encounters on the idle gap identically", () => {
    const { legacy, rebuilt } = run([
      identity(1, "Aurora", 0),
      damage(1, 90, 100, 1_000),
      damage(1, 90, 100, 4_000),
      // 30s idle gap closes the first encounter.
      damage(1, 91, 300, 60_000),
      damage(1, 91, 150, 62_000),
    ]);
    expect(rebuilt).toHaveLength(2);
    expect(legacy).toHaveLength(2);
    expect(rebuilt[0]).toEqual(legacy[0]!);
    expect(rebuilt[1]).toEqual(legacy[1]!);
  });

  test("matches timelines across a long encounter with sparse buckets", () => {
    const events: Timed[] = [identity(1, "Aurora", 0)];
    for (let index = 0; index < 40; index += 1) {
      events.push(damage(1, 90, 10 + index, index * 3_000));
    }
    const { legacy, rebuilt } = run(events);
    expect(rebuilt[0]!.actors[0]!.timeline).toEqual(legacy[0]!.actors[0]!.timeline);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });

  test("matches the personal row, whose timeline uses that actor's own origin", () => {
    const { legacy, rebuilt } = run([
      identity(1, "Aurora", 0),
      identity(2, "Bramble", 0),
      // Bramble starts late, so the personal timeline origin differs from the encounter origin.
      damage(1, 90, 100, 1_000),
      damage(1, 90, 100, 4_000),
      damage(2, 90, 400, 9_500, { sourceId: "skill:ember" }),
      damage(2, 90, 250, 16_200, { sourceId: "skill:ember", critical: true }),
      damage(1, 90, 60, 20_000),
    ], { personalName: "Bramble" });
    expect(rebuilt[0]!.personalMatch).toBe("matched");
    expect(rebuilt[0]!.personal).toEqual(legacy[0]!.personal!);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });

  test("matches when one player's damage spans several actor ids", () => {
    const { legacy, rebuilt } = run([
      identity(1, "Aurora", 0),
      damage(1, 90, 100, 1_000),
      { atMs: 2_000, event: { kind: "actorIdentity", operation: "remove", tick: 2_000, actorId: 1 } as unknown as FishNetActorIdentityEvent },
      identity(5, "Aurora", 3_000),
      damage(5, 90, 300, 4_000),
      damage(5, 91, 150, 9_000),
    ], { personalName: "Aurora" });
    expect(rebuilt[0]!.actors).toHaveLength(1);
    expect(rebuilt[0]!.actors[0]!.actorIds).toEqual(legacy[0]!.actors[0]!.actorIds);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });

  test("matches unidentified damage held behind the identity grace window", () => {
    const { legacy, rebuilt } = run([
      damage(7, 90, 100, 1_000),
      damage(7, 90, 100, 3_000),
      identity(8, "Aurora", 4_000),
      damage(8, 90, 500, 5_000),
    ]);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });

  test("matches an encounter with no identities at all", () => {
    const { legacy, rebuilt } = run([
      damage(7, 90, 100, 1_000),
      kill(7, 90, 20, 2_000),
    ]);
    expect(rebuilt[0]).toEqual(legacy[0]!);
  });
});
