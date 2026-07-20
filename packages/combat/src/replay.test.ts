import { describe, expect, test } from "bun:test";

import { loadDpsReplay } from "./replay.ts";

describe("loadDpsReplay", () => {
  test("loads sanitized JSON Lines, splits encounters, and counts invalid records", async () => {
    const basePath = `${import.meta.dir}/../../../.local/replay-test-${crypto.randomUUID()}`;
    const file = Bun.file(`${basePath}.jsonl`);
    const utf16File = Bun.file(`${basePath}-utf16.log`);
    const records = [
      logRecord(1, "combat.actorIdentity", { kind: "actorIdentity", operation: "upsert", tick: 300, actorId: 101, displayName: "Aster Vale" }),
      logRecord(2, "combat.event", combatDamage(300, 101, 120)),
      "not-json",
      logRecord(3, "combat.event", { kind: "unknown", tick: 301 }),
      logRecord(4, "combat.event", combatDamage(1_200, 101, 30), "2026-07-16T12:00:34.000Z"),
    ];
    const text = records.map((record) => typeof record === "string" ? record : JSON.stringify(record)).join("\n");
    await Bun.write(file, text);
    await Bun.write(utf16File, Buffer.from(`\ufeff${text}`, "utf16le"));
    try {
      const result = await loadDpsReplay(file.name!, "Aster Vale");
      expect(result.invalidLines).toBe(2);
      expect(result.meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([120, 30]);
      expect(result.meter.getSnapshots().at(-1)?.personalMatch).toBe("matched");
      const utf16Result = await loadDpsReplay(utf16File.name!, "Aster Vale");
      expect(utf16Result.invalidLines).toBe(2);
      expect(utf16Result.meter.getSnapshots().map(({ totalDamage }) => totalDamage)).toEqual([120, 30]);
    } finally {
      await file.delete();
      await utf16File.delete();
    }
  });
});

function combatDamage(tick: number, actorId: number, value: number): Record<string, unknown> {
  return {
    kind: "damage",
    rpc: "ApplyDamage_C",
    tick,
    actorId,
    targetId: 900,
    sourceId: "SyntheticArc",
    sourceLabel: "Synthetic Arc",
    value,
    hitResult: "normal",
    team: 0,
  };
}

function logRecord(
  sequence: number,
  type: string,
  data: Record<string, unknown>,
  recordedAt = `2026-07-16T12:00:0${sequence}.000Z`,
): Record<string, unknown> {
  return {
    schemaVersion: 1,
    sessionId: "synthetic-session",
    sequence,
    recordedAt,
    source: "synthetic-test",
    type,
    data,
  };
}
