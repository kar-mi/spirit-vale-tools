import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { createLogSession, defaultLogDirectory, parseLogRecord, readCurrentLogStream } from "./index.ts";

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

  test("rejects records outside the versioned envelope", () => {
    expect(parseLogRecord({ kind: "damage", tick: 1 })).toBeUndefined();
  });
});
