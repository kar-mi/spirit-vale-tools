import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { readCombatReplaySummary } from "./replay-summary.ts";

test("combat replay summaries remain owned by combat UI", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-combat-summary-"));
  const file = path.join(directory, "synthetic.jsonl");
  const records = [
    record(1, 300, 100, "2026-01-01T00:00:00.000Z"),
    record(2, 360, 50, "2026-01-01T00:00:02.000Z"),
    record(3, 1_500, 25, "2026-01-01T00:00:33.000Z"),
    record(4, 1_530, 75, "2026-01-01T00:00:34.000Z"),
  ];
  try {
    await writeFile(file, records.map((record) => JSON.stringify(record)).join("\n"), "utf8");
    expect(await readCombatReplaySummary(file)).toEqual({ encounters: 2, totalDamage: 250, durationMs: 3_000, invalidLines: 0 });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

function record(sequence: number, tick: number, value: number, recordedAt: string) {
  return {
    schemaVersion: 1,
    sessionId: "synthetic-session",
    sequence,
    recordedAt,
    source: "synthetic-test",
    type: "combat.event",
    data: { kind: "damage", rpc: "ApplyDamage_C", tick, actorId: 101, targetId: 900, sourceId: "SyntheticArc", sourceLabel: "Synthetic Arc", value, hitResult: "normal", team: 0 },
  };
}
