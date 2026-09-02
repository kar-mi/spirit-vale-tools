import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { createRewardsDomain } from "./domain.ts";
import { indexRewardStream } from "./importer.ts";
import { RewardHistoryStore } from "./store.ts";

const SESSION = "synthetic-session";
let sequence = 0;
function line(atMs: number, data: Record<string, unknown>): string {
  const record: LogRecord = { schemaVersion: 1, sessionId: SESSION, sequence: ++sequence, recordedAt: new Date(Date.UTC(2026, 0, 1) + atMs).toISOString(), source: "synthetic-test", type: data["kind"] === "unmatched" ? "rewards.unmatched" : "rewards.kill", data: data as LogRecord["data"] };
  return `${JSON.stringify(record)}\n`;
}
function kill(id: string, atMs: number, coins: string, rank = 4): string { return line(atMs, { kind: "kill", id, tick: atMs + 7, mob: { objectId: 12, mobId: "mob.synthetic", displayName: "Synthetic Mob", level: 10, rank, boss: false }, experience: 100, jobExperience: 20, coins, drops: [{ category: "material", itemId: "item.synthetic", count: 2 }] }); }

describe("reward history", () => {
  test("indexes idempotently, pages with bigint bindings, preserves fields, and buckets in SQL", async () => {
    const root = path.join(tmpdir(), `rewards-${crypto.randomUUID()}`);
    const logPath = path.join(root, "rewards.jsonl"); await mkdir(root, { recursive: true }); sequence = 0;
    await writeFile(logPath, [kill("a", 0, "9007199254740993"), kill("b", 3_600_000, "2"), line(7_200_000, { kind: "unmatched", tick: 9, reason: "expired", reward: "experience", experience: 5, jobExperience: 1, coins: "999", drops: [] })].join(""));
    const model = await openReadModel({ path: path.join(root, "model.sqlite"), domains: [createRewardsDomain()] });
    try {
      const first = await indexRewardStream(model, { sessionId: SESSION, sourcePath: logPath, batchBytes: 512 });
      expect(first.recordsIndexed).toBe(3);
      const store = new RewardHistoryStore(model);
      const summary = store.getSummary(SESSION, { recentKillLimit: 1, chartPoints: 2 });
      expect(summary.killCount).toBe(2); expect(summary.recentKills).toHaveLength(1); expect(summary.recentKills[0]!.tick).toBe(3_600_007); expect(summary.recentKills[0]!.mob.rank).toBe(4);
      expect(summary.totalCoins).toBe(9007199254741994n); expect(summary.chart.length).toBeLessThanOrEqual(2); expect(summary.chart.reduce((sum, bucket) => sum + bucket.experience, 0)).toBe(205);
      const firstPage = store.listKills({ sessionId: SESSION, limit: 1 });
      expect(firstPage.nextCursor).toBeDefined();
      const secondPage = store.listKills({ sessionId: SESSION, limit: 1, cursor: firstPage.nextCursor });
      expect([...firstPage.items, ...secondPage.items].map((item) => item.id)).toEqual(["b", "a"]);
      expect(store.listKills({ sessionId: SESSION, mobId: "missing.mob" }).items).toEqual([]);
      const again = await indexRewardStream(model, { sessionId: SESSION, sourcePath: logPath }); expect(again.recordsIndexed).toBe(0); expect(store.getSummary(SESSION).totalCoins).toBe(9007199254741994n);
    } finally { model.close(); await rm(root, { recursive: true, force: true }); }
  });
});
