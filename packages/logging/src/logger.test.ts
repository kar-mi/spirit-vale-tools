import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { JsonLinesLogger, activateLogSession, createLogSession, defaultLogDirectory, parseLogRecord, readCurrentLogStream } from "./index.ts";

describe("shared JSON logger", () => {
  test("defaults to a logs folder under the working directory", () => {
    const root = path.resolve("synthetic-run");
    expect(defaultLogDirectory(root)).toBe(path.join(root, "logs"));
  });

  test("creates an isolated session and current stream pointer", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const session = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      session.logger("combat").log("combat.event", { actorId: 7, sourceLabel: "Training Strike" });
      await session.close();
      const current = await readCurrentLogStream("combat", root);
      expect(current?.sessionId).toBe(session.id);
      const record = parseLogRecord(JSON.parse(await Bun.file(current!.path).text()));
      expect(record).toMatchObject({ schemaVersion: 1, sequence: 1, type: "combat.event" });
      expect(session.id).toMatch(/^\d{8}T\d{9}Z-[0-9a-f]{8}$/);

      const nextSession = await createLogSession({ producer: "synthetic-test", streams: ["combat"], logDirectory: root });
      await nextSession.close();
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(nextSession.id);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("can create a session without activating it, then activate several streams together later", async () => {
    const root = `${import.meta.dir}/../../../.local/logger-test-${crypto.randomUUID()}`;
    await mkdir(root, { recursive: true });
    try {
      const firstSession = await createLogSession({ producer: "synthetic-test", streams: ["combat", "rewards"], logDirectory: root });

      const secondSession = await createLogSession({
        producer: "synthetic-test",
        streams: ["combat", "rewards"],
        logDirectory: root,
        activate: false,
      });
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(firstSession.id);
      expect((await readCurrentLogStream("rewards", root))?.sessionId).toBe(firstSession.id);

      await activateLogSession(secondSession, ["combat", "rewards"], root);
      expect((await readCurrentLogStream("combat", root))?.sessionId).toBe(secondSession.id);
      expect((await readCurrentLogStream("rewards", root))?.sessionId).toBe(secondSession.id);

      await firstSession.close();
      await secondSession.close();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  test("rejects records outside the versioned envelope", () => {
    expect(parseLogRecord({ kind: "damage", tick: 1 })).toBeUndefined();
  });

  test("continues queued writes after reporting an append failure", async () => {
    const appended: string[] = [];
    const failures: string[] = [];
    let attempts = 0;
    const logger = new JsonLinesLogger("synthetic.jsonl", "session-example", "synthetic-test", {
      stream: "combat",
      append: async (_path, data) => {
        attempts += 1;
        if (attempts === 1) throw new Error("synthetic write failure");
        appended.push(String(data));
      },
      onWriteError: ({ stream, error }) => failures.push(`${stream}:${error.message}`),
    });

    logger.log("combat.event", { value: 1 });
    logger.log("combat.event", { value: 2 });
    await expect(logger.close()).rejects.toThrow("synthetic write failure");

    expect(failures).toEqual(["combat:synthetic write failure"]);
    expect(appended).toHaveLength(1);
    expect(JSON.parse(appended[0]!)).toMatchObject({ sequence: 2, data: { value: 2 } });
  });
});
