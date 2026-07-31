import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRewardReplay, RewardLogFollower } from "./live-log.ts";

test("reward replay keeps the log timestamp for graphing", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rewards-replay-"));
  const replayPath = path.join(directory, "synthetic.jsonl");
  const recordedAt = "2026-01-01T00:00:05.000Z";
  const record = {
    schemaVersion: 1,
    sessionId: "synthetic-session",
    sequence: 1,
    recordedAt,
    source: "synthetic-test",
    type: "rewards.kill",
    data: {
      kind: "kill",
      id: "kill-1",
      tick: 10,
      mob: { objectId: 20, mobId: "training-sprite", displayName: "Training Sprite", level: 3, boss: false },
      experience: 12,
      jobExperience: 4,
      coins: "7",
      drops: [],
    },
  };
  try {
    await writeFile(replayPath, `${JSON.stringify(record)}\n`, "utf8");
    const replay = await loadRewardReplay(replayPath);
    expect(replay.snapshot.kills[0]?.recordedAt).toBe(recordedAt);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("reward replay aggregates unmatched drops and accepts legacy unmatched records", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rewards-replay-"));
  const replayPath = path.join(directory, "synthetic.jsonl");
  const base = {
    schemaVersion: 1,
    sessionId: "synthetic-session",
    recordedAt: "2026-01-01T00:00:05.000Z",
    source: "synthetic-test",
    type: "rewards.unmatched",
  };
  const records = [
    {
      ...base,
      sequence: 1,
      data: { kind: "unmatched", tick: 10, reason: "expired", reward: "pickup" },
    },
    {
      ...base,
      sequence: 2,
      data: {
        kind: "unmatched",
        tick: 11,
        reason: "expired",
        reward: "pickup",
        drops: [{ category: "material", itemId: "training-material", count: 3 }],
      },
    },
    {
      ...base,
      sequence: 3,
      data: { kind: "unmatched", tick: 12, reason: "expired", reward: "experience", drops: [] },
    },
    {
      ...base,
      sequence: 4,
      data: {
        kind: "unmatched",
        tick: 13,
        reason: "expired",
        reward: "experience",
        experience: 15,
        jobExperience: 6,
        coins: "0",
        drops: [],
      },
    },
  ];
  try {
    await writeFile(replayPath, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
    const replay = await loadRewardReplay(replayPath);
    expect(replay.invalidLines).toBe(0);
    expect(replay.snapshot).toMatchObject({
      totalExperience: 15,
      totalJobExperience: 6,
      unmatched: 4,
      unmatchedDrops: [{ category: "material", itemId: "training-material", count: 3 }],
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

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
