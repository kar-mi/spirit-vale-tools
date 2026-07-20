import { describe, expect, test } from "bun:test";

import type { RewardsUiKill, RewardsUiMob, RewardsUiSummary } from "./app-types.ts";
import { sortRewardCatalog, sortRewardKills, sortRewardSummaries } from "./table-sort.ts";

describe("rewards table sorting", () => {
  test("sorts summaries by kills and large coin totals", () => {
    const low = summary("mob-a", "Fictional Moth", 2, "12");
    const high = summary("mob-b", "Synthetic Golem", 8, "9007199254740993");
    expect(sortRewardSummaries([low, high], { key: "kills", direction: "descending" }).map((row) => row.mobId)).toEqual(["mob-b", "mob-a"]);
    expect(sortRewardSummaries([high, low], { key: "coins", direction: "ascending" }).map((row) => row.mobId)).toEqual(["mob-a", "mob-b"]);
  });

  test("sorts recent kills by tick and catalog rows by stable level/name order", () => {
    const early = kill("kill-a", "Fictional Moth", 10);
    const late = kill("kill-b", "Synthetic Golem", 20);
    expect(sortRewardKills([early, late], { key: "tick", direction: "descending" }).map((row) => row.id)).toEqual(["kill-b", "kill-a"]);

    const catalog: RewardsUiMob[] = [mob("mob-b", "Synthetic Golem", 4), mob("mob-a", "Fictional Moth", 4), mob("mob-c", "Placeholder Wisp", 2)];
    expect(sortRewardCatalog(catalog, { key: "level", direction: "ascending" }).map((row) => row.id)).toEqual(["mob-c", "mob-a", "mob-b"]);
  });
});

function summary(mobId: string, displayName: string, kills: number, coins: string): RewardsUiSummary {
  return { mobId, displayName, level: 1, kills, experience: 10, jobExperience: 5, coins, drops: [] };
}

function kill(id: string, displayName: string, tick: number): RewardsUiKill {
  return { id, tick, mobId: `mob-${id}`, displayName, level: 1, experience: 10, jobExperience: 5, coins: "2", drops: [] };
}

function mob(id: string, displayName: string, level: number): RewardsUiMob {
  return { id, displayName, level, boss: false, baseExperience: 10, baseCoins: 2, drops: [] };
}
