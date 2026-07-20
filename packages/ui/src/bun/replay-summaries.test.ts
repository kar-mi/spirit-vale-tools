import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { readRewardsReplaySummary } from "./replay-summaries.ts";

describe("replay picker summaries", () => {
  test("aggregates confirmed rewards by kills, mobs, XP, and coins", async () => {
    await withReplay([
      record(1, "rewards.kill", kill("kill-a", "mob-a", 10, "2")),
      record(2, "rewards.kill", kill("kill-b", "mob-a", 20, "4")),
      record(3, "rewards.kill", kill("kill-c", "mob-b", 30, "6")),
    ], async (file) => {
      expect(await readRewardsReplaySummary(file)).toEqual({ kills: 3, mobs: 2, experience: 60, coins: 12n, invalidLines: 0 });
    });
  });

  test("empty and malformed logs return stable summaries without crashing", async () => {
    await withText("", async (file) => {
      expect(await readRewardsReplaySummary(file)).toEqual({ kills: 0, mobs: 0, experience: 0, coins: 0n, invalidLines: 0 });
    });
    await withText("not-json\n", async (file) => {
      expect((await readRewardsReplaySummary(file)).invalidLines).toBe(1);
    });
  });
});

async function withReplay(records: unknown[], run: (file: string) => Promise<void>): Promise<void> {
  await withText(records.map((value) => JSON.stringify(value)).join("\n"), run);
}

async function withText(text: string, run: (file: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-summary-"));
  const file = path.join(directory, "synthetic.jsonl");
  try { await writeFile(file, text, "utf8"); await run(file); } finally { await rm(directory, { recursive: true, force: true }); }
}

function kill(id: string, mobId: string, experience: number, coins: string) {
  return { kind: "kill", id, tick: 100 + experience, mob: { objectId: 700 + experience, mobId, displayName: "Fictional Creature", level: 1, boss: false }, experience, jobExperience: 0, coins, drops: [] };
}

function record(
  sequence: number,
  type: string,
  data: Record<string, unknown>,
  recordedAt = `2026-01-01T00:00:0${sequence}.000Z`,
) {
  return { schemaVersion: 1, sessionId: "synthetic-session", sequence, recordedAt, source: "synthetic-test", type, data };
}
