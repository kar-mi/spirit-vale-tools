import { expect, test } from "bun:test";
import { MobRewardSession } from "./session.ts";

test("mob reward session separates identity misses from other unmatched rewards", () => {
  const session = new MobRewardSession();
  session.consume({ kind: "unmatched", tick: 10, reason: "unidentified", reward: "experience" });
  session.consume({ kind: "unmatched", tick: 11, reason: "expired", reward: "pickup" });
  session.consume({ kind: "unmatched", tick: 12, reason: "ambiguous", reward: "experience" });

  expect(session.snapshot()).toMatchObject({
    unmatched: 3,
    unmatchedByReason: { unidentified: 1, expired: 1, ambiguous: 1 },
  });

  session.reset();
  expect(session.snapshot()).toMatchObject({
    unmatched: 0,
    unmatchedByReason: { unidentified: 0, expired: 0, ambiguous: 0 },
  });
});
