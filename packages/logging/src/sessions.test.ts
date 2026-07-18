import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { listLogSessions } from "./index.ts";
import type { LogStream } from "./types.ts";

describe("managed log session discovery", () => {
  test("filters, sorts, limits, and marks the validated current stream", async () => {
    await withLogs(async (root) => {
      await addSession(root, "session-alpha", "2026-01-01T00:00:00.000Z", ["combat"]);
      await addSession(root, "session-bravo", "2026-01-02T00:00:00.000Z", ["rewards"]);
      for (let index = 0; index < 30; index += 1) {
        await addSession(root, `session-combat-${String(index).padStart(2, "0")}`, `2026-02-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`, ["combat"]);
      }
      await writeJson(path.join(root, "current", "combat.json"), {
        schemaVersion: 1, stream: "combat", sessionId: "session-combat-29",
        startedAt: "2026-03-02T00:00:00.000Z", relativePath: "sessions/session-combat-29/combat.jsonl",
      });
      const sessions = await listLogSessions("combat", root, 25);
      expect(sessions).toHaveLength(25);
      expect(sessions[0]?.id).toBe("session-combat-29");
      expect(sessions[0]?.active).toBe(true);
      expect(sessions.some((session) => session.id === "session-bravo")).toBe(false);
    });
  });

  test("ignores malformed, mismatched, incomplete, and redirected sessions", async () => {
    await withLogs(async (root) => {
      await addSession(root, "valid-session", "2026-04-01T00:00:00.000Z", ["combat"]);
      await addSession(root, "mismatched-directory", "2026-04-02T00:00:00.000Z", ["combat"], "different-session");
      await writeJson(path.join(root, "sessions", "malformed", "session.json"), { schemaVersion: 7 });
      await addSession(root, "missing-stream", "2026-04-03T00:00:00.000Z", ["combat"], undefined, false);
      const outside = path.join(root, "outside.jsonl");
      await writeFile(outside, "", "utf8");
      const redirected = path.join(root, "sessions", "redirected");
      await mkdir(redirected, { recursive: true });
      await writeJson(path.join(redirected, "session.json"), metadata("redirected", "2026-04-04T00:00:00.000Z", ["combat"]));
      let linked = false;
      try { await symlink(outside, path.join(redirected, "combat.jsonl"), "file"); linked = true; } catch { /* Symlinks may require Windows developer mode. */ }
      await writeJson(path.join(root, "current", "combat.json"), {
        schemaVersion: 1, stream: "combat", sessionId: "valid-session",
        startedAt: "2026-04-05T00:00:00.000Z", relativePath: "../outside.jsonl",
      });
      const sessions = await listLogSessions("combat", root);
      expect(sessions.map((session) => session.id)).toEqual(["valid-session"]);
      expect(sessions[0]?.active).toBe(false);
      if (linked) expect(sessions.some((session) => session.id === "redirected")).toBe(false);
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

async function addSession(root: string, id: string, createdAt: string, streams: LogStream[], metadataId = id, includeStream = true): Promise<void> {
  const directory = path.join(root, "sessions", id);
  await writeJson(path.join(directory, "session.json"), metadata(metadataId, createdAt, streams));
  if (includeStream) for (const stream of streams) await writeFile(path.join(directory, `${stream}.jsonl`), "", "utf8");
}

function metadata(sessionId: string, createdAt: string, streams: LogStream[]) {
  return { schemaVersion: 1, sessionId, producer: "synthetic-test", createdAt, streams };
}

async function writeJson(target: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value)}\n`, "utf8");
}
