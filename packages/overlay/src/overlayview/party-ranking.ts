import type { FishNetDpsActorRow } from "@spiritvale/combat";

const MAX_PARTY_ROWS = 12;

export function visiblePartyActors(actors: readonly FishNetDpsActorRow[]): FishNetDpsActorRow[] {
  return actors
    .filter((actor) => actor.currentDps > 0)
    .sort((left, right) => right.currentDps - left.currentDps)
    .slice(0, MAX_PARTY_ROWS);
}
