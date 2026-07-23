import { expect, test } from "bun:test";

import type { FishNetDpsActorRow } from "@spiritvale/combat";
import { visiblePartyActors } from "./party-ranking.ts";

test("party ranking excludes zero DPS actors before sorting and limiting", () => {
  const actors = [
    actor(1, 0),
    actor(2, 20),
    actor(3, 80),
    actor(4, 40),
  ];

  expect(visiblePartyActors(actors).map((row) => [row.actorIds[0], row.currentDps])).toEqual([
    [3, 80],
    [4, 40],
    [2, 20],
  ]);
  expect(actors.map((row) => row.actorIds[0])).toEqual([1, 2, 3, 4]);

  const crowdedParty = [actor(100, 0), ...Array.from({ length: 14 }, (_, index) => actor(index + 1, index + 1))];
  expect(visiblePartyActors(crowdedParty).map((row) => row.actorIds[0])).toEqual([
    14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3,
  ]);
});

function actor(actorId: number, currentDps: number): FishNetDpsActorRow {
  return {
    actorIds: [actorId],
    displayName: `Fictional Player ${actorId}`,
    damage: currentDps,
    dps: currentDps,
    currentDps,
    contribution: 0,
    hits: 0,
    criticalHits: 0,
    kills: 0,
    skills: [],
    timeline: [],
  };
}
