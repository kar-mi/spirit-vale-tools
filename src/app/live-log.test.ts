import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";

import { describe, expect, test } from "bun:test";

import { DpsLogFollower } from "./live-log.ts";

describe("DpsLogFollower", () => {
  test("reads appended complete lines and resets after truncation", async () => {
    const directory = `${import.meta.dir}/../../.local/live-log-test-${crypto.randomUUID()}`;
    const path = `${directory}/combat.jsonl`;
    await mkdir(directory, { recursive: true });
    try {
      const identity = JSON.stringify({
        kind: "actorIdentity",
        operation: "upsert",
        tick: 300,
        actorId: 7,
        displayName: "Aster Vale",
      });
      const damage = JSON.stringify({
        kind: "damage",
        tick: 330,
        actorId: 7,
        targetId: 99,
        team: 0,
        sourceId: "skill:training-strike",
        sourceLabel: "Training Strike",
        value: 120,
        hitResult: "normal",
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
});
