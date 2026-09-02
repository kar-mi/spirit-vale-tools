import { expect, test } from "bun:test";
import { MobRewardSession } from "./session.ts";

test("mob reward session preserves optional log timestamps on confirmed kills", () => {
  const session = new MobRewardSession();
  session.consume({
    kind: "kill",
    id: "kill-1",
    tick: 10,
    mob: { objectId: 20, mobId: "training-sprite", displayName: "Training Sprite", level: 3, boss: false },
    experience: 12,
    jobExperience: 4,
    coins: 7n,
    drops: [],
    attributed: true,
  }, { recordedAt: "2026-01-01T00:00:05.000Z" });

  expect(session.snapshot().kills[0]?.recordedAt).toBe("2026-01-01T00:00:05.000Z");
});

test("mob reward session separates identity misses from other unmatched rewards", () => {
  const session = new MobRewardSession();
  session.consume({
    kind: "unmatched",
    tick: 10,
    reason: "unidentified",
    reward: "experience",
    experience: 12,
    jobExperience: 4,
    coins: 7n,
    drops: [],
  });
  session.consume({ kind: "unmatched", tick: 11, reason: "expired", reward: "pickup", drops: [{ category: "material", itemId: "training-material", count: 2 }] });
  session.consume({
    kind: "unmatched",
    tick: 12,
    reason: "ambiguous",
    reward: "experience",
    experience: 8,
    jobExperience: 3,
    coins: 2n,
    drops: [{ category: "material", itemId: "training-material", count: 3 }],
  });

  expect(session.snapshot()).toMatchObject({
    totalExperience: 20,
    totalJobExperience: 7,
    totalCoins: 9n,
    unmatched: 3,
    unmatchedDrops: [{ category: "material", itemId: "training-material", count: 5 }],
    unmatchedByReason: { unidentified: 1, expired: 1, ambiguous: 1 },
  });

  session.reset();
  expect(session.snapshot()).toMatchObject({
    totalExperience: 0,
    totalJobExperience: 0,
    unmatched: 0,
    unmatchedDrops: [],
    unmatchedByReason: { unidentified: 0, expired: 0, ambiguous: 0 },
  });
});
