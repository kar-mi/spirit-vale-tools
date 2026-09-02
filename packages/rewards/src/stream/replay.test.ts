import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRewardReplay } from "./replay.ts";

test("reward replay keeps the log timestamp for graphing", async () => {
  const recordedAt = "2026-01-01T00:00:05.000Z";
  await withReplay([record(1, "rewards.kill", kill("kill-1", 12, 4, "7"), recordedAt)], async (replayPath) => {
    const replay = await loadRewardReplay(replayPath);
    expect(replay.snapshot.kills[0]?.recordedAt).toBe(recordedAt);
  });
});

test("reward replay aggregates unmatched drops and accepts legacy unmatched records", async () => {
  const records = [
    record(1, "rewards.unmatched", { kind: "unmatched", tick: 10, reason: "expired", reward: "pickup" }),
    record(2, "rewards.unmatched", {
      kind: "unmatched", tick: 11, reason: "expired", reward: "pickup",
      drops: [{ category: "material", itemId: "training-material", count: 3 }],
    }),
    record(3, "rewards.unmatched", { kind: "unmatched", tick: 12, reason: "expired", reward: "experience", drops: [] }),
    record(4, "rewards.unmatched", {
      kind: "unmatched", tick: 13, reason: "expired", reward: "experience",
      experience: 15, jobExperience: 6, coins: "0", drops: [],
    }),
  ];
  await withReplay(records, async (replayPath) => {
    const replay = await loadRewardReplay(replayPath);
    expect(replay.invalidLines).toBe(0);
    expect(replay.snapshot).toMatchObject({
      totalExperience: 15,
      totalJobExperience: 6,
      unmatched: 4,
      unmatchedDrops: [{ category: "material", itemId: "training-material", count: 3 }],
    });
  });
});

async function withReplay(records: unknown[], run: (path: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), "rewards-replay-"));
  const replayPath = path.join(directory, "synthetic.jsonl");
  try {
    await writeFile(replayPath, `${records.map((value) => JSON.stringify(value)).join("\n")}\n`, "utf8");
    await run(replayPath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function record(sequence: number, type: string, data: Record<string, unknown>, recordedAt = "2026-01-01T00:00:05.000Z") {
  return { schemaVersion: 1, sessionId: "synthetic-session", sequence, recordedAt, source: "synthetic-test", type, data };
}

function kill(id: string, experience: number, jobExperience: number, coins: string) {
  return {
    kind: "kill", id, tick: 10,
    mob: { objectId: 20, mobId: "training-sprite", displayName: "Training Sprite", level: 3, boss: false },
    experience, jobExperience, coins, drops: [],
  };
}
