import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, test } from "bun:test";

import { createLogSession } from "./logger.ts";
import { LiveLogSessionFollower } from "./session-follower.ts";

interface FakeBatch {
  value: string;
  reset: boolean;
}

class FakeFollower {
  constructor(private readonly path: string) {}
  poll(): Promise<FakeBatch> {
    return Promise.resolve({ value: this.path, reset: false });
  }
}

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("LiveLogSessionFollower", () => {
  test("reports no-stream batch when there is no active session", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-session-follower-"));
    temporaryDirectories.push(directory);
    const follower = new LiveLogSessionFollower<FakeFollower, FakeBatch>({
      stream: "combat",
      logDirectory: directory,
      createFollower: (filePath) => new FakeFollower(filePath),
      mergeSessionChange: (batch, changedSession) => ({ ...batch, reset: batch.reset || changedSession }),
      noStreamBatch: (reset) => ({ value: "", reset }),
    });
    expect(await follower.poll()).toMatchObject({ value: "", reset: false });
  });

  test("creates a new inner follower and marks reset when the active session changes", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-session-follower-"));
    temporaryDirectories.push(directory);
    const follower = new LiveLogSessionFollower<FakeFollower, FakeBatch>({
      stream: "combat",
      logDirectory: directory,
      createFollower: (filePath) => new FakeFollower(filePath),
      mergeSessionChange: (batch, changedSession) => ({ ...batch, reset: batch.reset || changedSession }),
      noStreamBatch: (reset) => ({ value: "", reset }),
    });

    const first = await createLogSession({ producer: "session-follower-test", streams: ["combat"], logDirectory: directory });
    await first.close();
    const firstBatch = await follower.poll();
    expect(firstBatch.reset).toBe(true);
    expect(firstBatch.sessionId).toBe(first.id);

    const secondPoll = await follower.poll();
    expect(secondPoll.reset).toBe(false);
    expect(secondPoll.sessionId).toBe(first.id);

    const second = await createLogSession({ producer: "session-follower-test", streams: ["combat"], logDirectory: directory });
    await second.close();
    const thirdPoll = await follower.poll();
    expect(thirdPoll.reset).toBe(true);
    expect(thirdPoll.sessionId).toBe(second.id);
  });
});
