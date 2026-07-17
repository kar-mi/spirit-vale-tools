import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";

import { describe, expect, test } from "bun:test";

import { createLogSession } from "@spiritvale/logging";
import type { JsonObject } from "@spiritvale/logging";
import { DpsLogFollower, DpsSessionLogFollower } from "./live-log.ts";

describe("DpsLogFollower", () => {
  test("reads appended complete lines and resets after truncation", async () => {
    const directory = `${import.meta.dir}/../../../.local/live-log-test-${crypto.randomUUID()}`;
    const path = `${directory}/combat.jsonl`;
    await mkdir(directory, { recursive: true });
    try {
      const identity = JSON.stringify({
        schemaVersion: 1, sessionId: "synthetic-session", sequence: 1,
        recordedAt: "2026-07-16T12:00:00.000Z", source: "synthetic-test", type: "combat.actorIdentity",
        data: { kind: "actorIdentity", operation: "upsert", tick: 300, actorId: 7, displayName: "Aster Vale" },
      });
      const damage = JSON.stringify({
        schemaVersion: 1, sessionId: "synthetic-session", sequence: 2,
        recordedAt: "2026-07-16T12:00:01.000Z", source: "synthetic-test", type: "combat.event",
        data: {
          kind: "damage", tick: 330, actorId: 7, targetId: 99, team: 0,
          sourceId: "skill:training-strike", sourceLabel: "Training Strike", value: 120, hitResult: "normal",
        },
      });
      await writeFile(path, `${identity}\n${damage.slice(0, 20)}`, "utf8");
      const follower = new DpsLogFollower(path);

      const first = await follower.poll();
      expect(first.events).toHaveLength(1);
      expect(first.events[0]?.observedAtMs).toBe(0);

      await appendFile(path, `${damage.slice(20)}\n`, "utf8");
      const second = await follower.poll();
      expect(second.events).toHaveLength(1);
      expect(second.events[0]?.observedAtMs).toBe(1_000);

      await writeFile(path, "", "utf8");
      const truncated = await follower.poll();
      expect(truncated.reset).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("switches to a newly current combat session", async () => {
    const root = `${import.meta.dir}/../../../.local/live-session-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const first = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      first.logger("combat").log("combat.event", combatRecord(300, 50));
      await first.close();
      const follower = new DpsSessionLogFollower(root);
      const firstBatch = await follower.poll();
      expect(firstBatch).toMatchObject({ reset: true, missing: false, sessionId: first.id });
      expect(firstBatch.events).toHaveLength(1);

      const second = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      second.logger("combat").log("combat.event", combatRecord(600, 75));
      await second.close();
      const secondBatch = await follower.poll();
      expect(secondBatch).toMatchObject({ reset: true, missing: false, sessionId: second.id });
      expect(secondBatch.events[0]?.observedAtMs).toBe(0);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

function combatRecord(tick: number, value: number): JsonObject {
  return {
    kind: "damage", tick, actorId: 7, targetId: 99, team: 0,
    sourceId: "skill:training-strike", sourceLabel: "Training Strike", value, hitResult: "normal",
  };
}
