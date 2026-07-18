import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRewardReplay } from "./live-log.ts";

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
