import { describe, expect, test } from "bun:test";
import { appendFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";
import { LiveRewardLogFollower, RewardLogFollower, RewardSessionLogFollower } from "./live-followers.ts";

test("live reward following reports unmatched XP gains at their recorded time", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rewards-follow-"));
  const replayPath = path.join(directory, "synthetic.jsonl");
  const recordedAt = "2026-01-01T00:00:05.000Z";
  const record = {
    schemaVersion: 1,
    sessionId: "synthetic-session",
    sequence: 1,
    recordedAt,
    source: "synthetic-test",
    type: "rewards.unmatched",
    data: {
      kind: "unmatched",
      tick: 10,
      reason: "expired",
      reward: "experience",
      experience: 15,
      jobExperience: 6,
      coins: "0",
      drops: [],
    },
  };
  const observed: Array<{ experience: number; recordedAtMs: number }> = [];
  try {
    await writeFile(replayPath, `${JSON.stringify(record)}\n`, "utf8");
    const follower = new RewardLogFollower(replayPath, {
      onExperience: (experience, recordedAtMs) => observed.push({ experience, recordedAtMs }),
    });
    await follower.poll();
    expect(observed).toEqual([{ experience: 15, recordedAtMs: Date.parse(recordedAt) }]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

describe("reward live projections", () => {
  test("full-history and bounded followers agree on aggregate totals", () => {
    const line = JSON.stringify(rewardRecord("rewards.kill", {
      kind: "kill", id: "kill-1", tick: 10,
      mob: { objectId: 20, mobId: "training-sprite", displayName: "Training Sprite", level: 3, boss: false },
      experience: 12, jobExperience: 4, coins: "7", drops: [],
    }));
    const read = { missing: false, reset: false, lines: [line], size: line.length + 1, bytesRead: line.length + 1 };

    const full = new RewardLogFollower("synthetic.jsonl").consumeRead(read);
    const bounded = new LiveRewardLogFollower("synthetic.jsonl").consumeRead(read);

    expect(bounded.snapshot).toMatchObject({
      killCount: full.snapshot.kills.length,
      totalExperience: full.snapshot.totalExperience,
      totalJobExperience: full.snapshot.totalJobExperience,
      totalCoins: full.snapshot.totalCoins,
    });
  });

  test("preserves lifecycle status and malformed-record semantics", () => {
    const follower = new RewardLogFollower("synthetic.jsonl");
    const malformedLifecycle = JSON.stringify(rewardRecord("rewards.lifecycle", { state: "unknown" }));
    const lifecycle = follower.consumeRead({
      missing: false, reset: false, lines: [malformedLifecycle], size: malformedLifecycle.length, bytesRead: malformedLifecycle.length,
    });
    expect(lifecycle).toMatchObject({ status: "watching", changed: true, invalidLines: 1 });

    const error = JSON.stringify(rewardRecord("rewards.error", { message: "synthetic failure" }));
    expect(follower.consumeRead({
      missing: false, reset: false, lines: [error], size: error.length, bytesRead: error.length,
    })).toMatchObject({ status: "error", changed: true, invalidLines: 0 });
  });

  test("reports a missing source without changing accumulated state", () => {
    const follower = new RewardLogFollower("synthetic.jsonl");
    expect(follower.consumeRead({ missing: true, reset: false, lines: [], size: 0, bytesRead: 0 })).toMatchObject({
      missing: true, reset: false, changed: false, status: "waiting", invalidLines: 0,
    });
  });

  test("buffers partial lines and resets after truncation", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "rewards-follow-"));
    const replayPath = path.join(directory, "synthetic.jsonl");
    const line = JSON.stringify(rewardRecord("rewards.kill", killData("kill-partial", 12)));
    const boundary = Math.floor(line.length / 2);
    try {
      await writeFile(replayPath, line.slice(0, boundary), "utf8");
      const follower = new RewardLogFollower(replayPath);
      expect(await follower.poll()).toMatchObject({ changed: false, reset: false });

      await appendFile(replayPath, `${line.slice(boundary)}\n`, "utf8");
      expect(await follower.poll()).toMatchObject({ changed: true, reset: false, snapshot: { totalExperience: 12 } });

      await writeFile(replayPath, "", "utf8");
      expect(await follower.poll()).toMatchObject({ changed: false, reset: true, snapshot: { totalExperience: 0 } });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("switches to the newly current reward session", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "rewards-session-"));
    const follower = new RewardSessionLogFollower(directory);
    try {
      const first = await createLogSession({ producer: "synthetic-test", streams: ["rewards"], logDirectory: directory });
      first.logger("rewards").log("rewards.kill", killData("kill-first", 12));
      await first.close();
      expect(await follower.poll()).toMatchObject({
        missing: false, reset: true, sessionId: first.id, snapshot: { totalExperience: 12 },
      });

      const second = await createLogSession({ producer: "synthetic-test", streams: ["rewards"], logDirectory: directory });
      second.logger("rewards").log("rewards.kill", killData("kill-second", 30));
      await second.close();
      expect(await follower.poll()).toMatchObject({
        missing: false, reset: true, sessionId: second.id, snapshot: { totalExperience: 30 },
      });
    } finally {
      follower.close();
      await rm(directory, { recursive: true, force: true });
    }
  });
});

function rewardRecord(type: string, data: Record<string, unknown>) {
  return {
    schemaVersion: 1, sessionId: "synthetic-session", sequence: 1,
    recordedAt: "2026-01-01T00:00:05.000Z", source: "synthetic-test", type, data,
  };
}

function killData(id: string, experience: number) {
  return {
    kind: "kill", id, tick: experience,
    mob: { objectId: 20, mobId: "training-sprite", displayName: "Training Sprite", level: 3, boss: false },
    experience, jobExperience: 0, coins: "0", drops: [],
  };
}
