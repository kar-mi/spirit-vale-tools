import { appendFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, test } from "bun:test";

import { createLogSession } from "./logger.ts";
import { subscribeToLogStream } from "./stream-source.ts";
import type { LogStreamSubscription } from "./stream-source.ts";

const temporaryDirectories: string[] = [];
const subscriptions: LogStreamSubscription[] = [];

afterEach(async () => {
  for (const subscription of subscriptions.splice(0)) subscription.close();
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-stream-source-"));
  temporaryDirectories.push(directory);
  return directory;
}

function subscribe(logDirectory: string, options: { debounceMs?: number; fallbackPollMs?: number } = {}): LogStreamSubscription {
  const subscription = subscribeToLogStream({ stream: "combat", logDirectory, debounceMs: 1, fallbackPollMs: 25, ...options });
  subscriptions.push(subscription);
  return subscription;
}

/** Counts only the payload lines, so the stream header a session writes first is ignored. */
function payloadLines(lines: readonly string[]): string[] {
  return lines.filter((line) => line.includes("\"seq\""));
}

describe("log stream source", () => {
  test("reports no session until the pointer names one, then switches with it", async () => {
    const directory = await temporaryDirectory();
    const subscription = subscribe(directory);

    const idle = await subscription.poll();
    expect(idle.missing).toBe(true);
    expect(idle.current).toBeUndefined();

    const first = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    first.logger("combat").log("combat.event", { kind: "damage", tick: 1, actorId: 7, targetId: 8, value: 10 });
    await first.close();

    const firstRead = await subscription.poll();
    expect(firstRead.changedSession).toBe(true);
    expect(firstRead.current?.sessionId).toBe(first.id);
    expect(payloadLines(firstRead.lines)).toHaveLength(1);

    const second = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    second.logger("combat").log("combat.event", { kind: "damage", tick: 2, actorId: 7, targetId: 8, value: 20 });
    await second.close();

    const secondRead = await subscription.poll();
    expect(secondRead.changedSession).toBe(true);
    expect(secondRead.current?.sessionId).toBe(second.id);
  });

  test("wakes on appended data without being polled", async () => {
    const directory = await temporaryDirectory();
    const session = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    const subscription = subscribe(directory);
    await subscription.poll();

    const waiting = subscription.next();
    session.logger("combat").log("combat.event", { kind: "damage", tick: 1, actorId: 7, targetId: 8, value: 10 });
    await session.close();

    const read = await waiting;
    expect(payloadLines(read.lines)).toHaveLength(1);
  });

  test("fallback polling discovers a session switch after the pointer watcher is lost", async () => {
    const directory = await temporaryDirectory();
    const first = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    await first.close();
    const subscription = subscribe(directory);
    expect((await subscription.poll()).current?.sessionId).toBe(first.id);

    // Removing the watched directory invalidates its watcher.
    await rm(path.join(directory, "current"), { recursive: true, force: true });
    const second = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    second.logger("combat").log("combat.event", { kind: "damage", tick: 2, actorId: 7, targetId: 8, value: 20 });
    await second.close();

    // Losing the directory can first publish the brief no-pointer state, and the pointer can be discovered before the session's data is flushed to it.
    let changedSession = false;
    let sessionId: string | undefined;
    let lines: string[] = [];
    while (sessionId !== second.id || lines.length === 0) {
      const read = await subscription.next();
      changedSession ||= read.changedSession;
      if (read.current) sessionId = read.current.sessionId;
      lines = lines.concat(payloadLines(read.lines));
    }
    expect(changedSession).toBe(true);
    expect(sessionId).toBe(second.id);
    expect(lines).toHaveLength(1);
  });

  test("coalesces a burst of appends into one batch", async () => {
    const directory = await temporaryDirectory();
    const session = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    await session.close();
    const streamPath = path.join(directory, "combat", `${session.id}.jsonl`);
    const subscription = subscribe(directory, { debounceMs: 30 });
    await subscription.poll();

    const waiting = subscription.next();
    for (let index = 0; index < 5; index += 1) await appendFile(streamPath, `${line(index)}\n`, "utf8");

    const read = await waiting;
    expect(payloadLines(read.lines)).toHaveLength(5);
  });

  test("hands a backlog over in bounded pieces", async () => {
    const directory = await temporaryDirectory();
    const session = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    await session.close();
    const streamPath = path.join(directory, "combat", `${session.id}.jsonl`);
    const backlog = Array.from({ length: 8 }, (_value, index) => line(index)).join("\n");
    await writeFile(streamPath, `${backlog}\n`, "utf8");

    const subscription = subscribeToLogStream({
      stream: "combat",
      logDirectory: directory,
      debounceMs: 1,
      fallbackPollMs: 25,
      readerOptions: { maxReadBytes: 100 },
    });
    subscriptions.push(subscription);

    const first = await subscription.poll();
    expect(first.capped).toBe(true);
    expect(first.bytesRead).toBeLessThanOrEqual(100);

    let seen = payloadLines(first.lines).length;
    while (seen < 8) seen += payloadLines((await subscription.next()).lines).length;
    expect(seen).toBe(8);
  });

  test("reads the file once for two subscribers, and replays the backlog to a late one", async () => {
    const directory = await temporaryDirectory();
    const session = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    session.logger("combat").log("combat.event", { kind: "damage", tick: 1, actorId: 7, targetId: 8, value: 10 });
    await session.close();

    const early = subscribe(directory);
    const firstRead = await early.poll();
    expect(payloadLines(firstRead.lines)).toHaveLength(1);

    // Joining after the shared reader has already consumed those bytes must not lose them.
    const late = subscribe(directory);
    const replayed = await late.poll();
    expect(payloadLines(replayed.lines)).toHaveLength(1);
    expect(replayed.changedSession).toBe(true);

    const streamPath = path.join(directory, "combat", `${session.id}.jsonl`);
    await appendFile(streamPath, `${line(2)}\n`, "utf8");
    expect(payloadLines((await early.next()).lines)).toHaveLength(1);
    expect(payloadLines((await late.next()).lines)).toHaveLength(1);
  });

  test("resets and re-reads from the start when the file is truncated", async () => {
    const directory = await temporaryDirectory();
    const session = await createLogSession({ producer: "stream-source-test", streams: ["combat"], logDirectory: directory });
    session.logger("combat").log("combat.event", { kind: "damage", tick: 1, actorId: 7, targetId: 8, value: 10 });
    await session.close();
    const subscription = subscribe(directory);
    await subscription.poll();

    const streamPath = path.join(directory, "combat", `${session.id}.jsonl`);
    await writeFile(streamPath, `${line(9)}\n`, "utf8");
    const read = await subscription.poll();
    expect(read.reset).toBe(true);
    expect(payloadLines(read.lines)).toHaveLength(1);
  });
});

function line(index: number): string {
  return JSON.stringify({ seq: index, at: 1_900_000_000_000 + index, type: "combat.test", data: { value: index } });
}
