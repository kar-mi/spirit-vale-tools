import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { listLogSessions } from "./index.ts";
import type { LogStream } from "./types.ts";

describe("managed log session discovery", () => {
  test("filters, sorts, limits, and marks the validated current stream", async () => {
    await withLogs(async (root) => {
      await addSession(root, "session-alpha", "2026-01-01T00:00:00.000Z", "combat");
      await addSession(root, "session-bravo", "2026-01-02T00:00:00.000Z", "rewards");
      for (let index = 0; index < 30; index += 1) {
        await addSession(root, `session-combat-${String(index).padStart(2, "0")}`, `2026-02-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`, "combat");
      }
      await writeJson(path.join(root, "current", "combat.json"), {
        schemaVersion: 1, stream: "combat", sessionId: "session-combat-29",
        startedAt: "2026-03-02T00:00:00.000Z", relativePath: "combat/session-combat-29.jsonl",
      });
      const sessions = await listLogSessions("combat", root, 25);
      expect(sessions).toHaveLength(25);
      expect(sessions[0]?.id).toBe("session-combat-29");
      expect(sessions[0]?.active).toBe(true);
      expect(sessions.some((session) => session.id === "session-bravo")).toBe(false);
    });
  });

  test("falls back to file mtime for a corrupt header, ignores mismatched and redirected sessions", async () => {
    await withLogs(async (root) => {
      await addSession(root, "valid-session", "2026-04-01T00:00:00.000Z", "combat");
      await addSession(root, "mismatched-session", "2026-04-02T00:00:00.000Z", "combat", "different-session");
      const combatDirectory = path.join(root, "combat");
      await mkdir(combatDirectory, { recursive: true });
      await writeFile(path.join(combatDirectory, "corrupt-header.jsonl"), "not json\n", "utf8");
      const outside = path.join(root, "outside.jsonl");
      await writeFile(outside, "", "utf8");
      let linked = false;
      try { await symlink(outside, path.join(combatDirectory, "redirected.jsonl"), "file"); linked = true; } catch { /* Symlinks may require Windows developer mode. */ }
      await writeJson(path.join(root, "current", "combat.json"), {
        schemaVersion: 1, stream: "combat", sessionId: "valid-session",
        startedAt: "2026-04-05T00:00:00.000Z", relativePath: "../outside.jsonl",
      });
      const sessions = await listLogSessions("combat", root);
      const ids = sessions.map((session) => session.id);
      expect(ids).toContain("valid-session");
      expect(ids).toContain("corrupt-header");
      expect(ids).not.toContain("mismatched-session");
      expect(ids).not.toContain("redirected");
      expect(sessions.find((session) => session.id === "valid-session")?.active).toBe(false);
      void linked;
    });
  });

  test("returns an empty list when the log directory is missing", async () => {
    const root = path.join(tmpdir(), `spiritvale-missing-${crypto.randomUUID()}`);
    expect(await listLogSessions("rewards", root)).toEqual([]);
  });
});

async function withLogs(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), "spiritvale-sessions-"));
  try { await run(root); } finally { await rm(root, { recursive: true, force: true }); }
}

async function addSession(root: string, id: string, createdAt: string, stream: LogStream, headerSessionId = id): Promise<void> {
  const directory = path.join(root, stream);
  await mkdir(directory, { recursive: true });
  const header = { schemaVersion: 2, stream, sessionId: headerSessionId, producer: "synthetic-test", startedAt: createdAt };
  await writeFile(path.join(directory, `${id}.jsonl`), `${JSON.stringify(header)}\n`, "utf8");
}

async function writeJson(target: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value)}\n`, "utf8");
}
