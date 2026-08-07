import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { listLogSessions, pruneLogSessions } from "./index.ts";
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

describe("managed log session pruning", () => {
  test("keeps the newest sessions and removes the rest", async () => {
    await withLogs(async (root) => {
      for (let index = 0; index < 8; index += 1) {
        await addSession(root, `session-${index}`, `2026-05-0${index + 1}T00:00:00.000Z`, ["combat"]);
      }
      const result = await pruneLogSessions({ logDirectory: root, keep: 3 });
      expect(result.removed.sort()).toEqual(["session-0", "session-1", "session-2", "session-3", "session-4"]);
      expect(result.failed).toEqual([]);
      expect((await listLogSessions("combat", root)).map((session) => session.id))
        .toEqual(["session-7", "session-6", "session-5"]);
    });
  });

  test("never removes a session a stream pointer still refers to", async () => {
    await withLogs(async (root) => {
      for (let index = 0; index < 5; index += 1) {
        await addSession(root, `session-${index}`, `2026-05-0${index + 1}T00:00:00.000Z`, ["combat"]);
      }
      // The oldest session is the live one, so the count cap must not reach it.
      await writeJson(path.join(root, "current", "combat.json"), {
        schemaVersion: 1, stream: "combat", sessionId: "session-0",
        startedAt: "2026-05-01T00:00:00.000Z", relativePath: "sessions/session-0/combat.jsonl",
      });

      const result = await pruneLogSessions({ logDirectory: root, keep: 2 });
      expect(result.keptActive).toEqual(["session-0"]);
      expect(result.removed.sort()).toEqual(["session-1", "session-2"]);
      expect((await listLogSessions("combat", root)).map((session) => session.id))
        .toEqual(["session-4", "session-3", "session-0"]);
    });
  });

  test("checks every stream's pointer, not just one", async () => {
    await withLogs(async (root) => {
      await addSession(root, "session-old", "2026-05-01T00:00:00.000Z", ["rewards"]);
      await addSession(root, "session-new", "2026-05-09T00:00:00.000Z", ["combat"]);
      await writeJson(path.join(root, "current", "rewards.json"), {
        schemaVersion: 1, stream: "rewards", sessionId: "session-old",
        startedAt: "2026-05-01T00:00:00.000Z", relativePath: "sessions/session-old/rewards.jsonl",
      });

      const result = await pruneLogSessions({ logDirectory: root, keep: 1 });
      expect(result.keptActive).toEqual(["session-old"]);
      expect(result.removed).toEqual([]);
    });
  });

  test("removes sessions past the age limit even when few enough to keep", async () => {
    await withLogs(async (root) => {
      await addSession(root, "session-ancient", "2026-01-01T00:00:00.000Z", ["combat"]);
      await addSession(root, "session-recent", "2026-05-09T00:00:00.000Z", ["combat"]);
      const result = await pruneLogSessions({
        logDirectory: root,
        keep: 100,
        maxAgeMs: 7 * 24 * 60 * 60 * 1_000,
        now: () => Date.parse("2026-05-10T00:00:00.000Z"),
      });
      expect(result.removed).toEqual(["session-ancient"]);
      expect((await listLogSessions("combat", root)).map((session) => session.id)).toEqual(["session-recent"]);
    });
  });

  test("leaves directories that are not managed sessions alone", async () => {
    await withLogs(async (root) => {
      await addSession(root, "session-keep", "2026-05-09T00:00:00.000Z", ["combat"]);
      // No metadata at all, metadata that disagrees with the directory name, and unparseable
      // metadata: none of these is ours to delete.
      await writeFile(path.join(await ensureDirectory(root, "not-a-session"), "notes.txt"), "keep me", "utf8");
      await addSession(root, "mismatched", "2026-01-01T00:00:00.000Z", ["combat"], "different-id");
      await writeJson(path.join(root, "sessions", "malformed", "session.json"), { schemaVersion: 7 });

      const result = await pruneLogSessions({ logDirectory: root, keep: 0, maxAgeMs: 0 });
      expect(result.removed).toEqual(["session-keep"]);
      for (const name of ["not-a-session", "mismatched", "malformed"]) {
        expect(await Bun.file(path.join(root, "sessions", name, name === "not-a-session" ? "notes.txt" : "session.json")).exists())
          .toBe(true);
      }
    });
  });

  test("does nothing when there is no session directory", async () => {
    const root = path.join(tmpdir(), `spiritvale-missing-${crypto.randomUUID()}`);
    expect(await pruneLogSessions({ logDirectory: root, keep: 1 }))
      .toEqual({ removed: [], keptActive: [], failed: [] });
  });

  test("rejects a negative retention rather than deleting everything", async () => {
    await withLogs(async (root) => {
      expect(pruneLogSessions({ logDirectory: root, keep: -1 })).rejects.toThrow(RangeError);
    });
  });
});

async function ensureDirectory(root: string, name: string): Promise<string> {
  const directory = path.join(root, "sessions", name);
  await mkdir(directory, { recursive: true });
  return directory;
}

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
