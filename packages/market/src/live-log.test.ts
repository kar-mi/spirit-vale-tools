import { afterEach, expect, test } from "bun:test";
import { appendFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { marketEventLogData } from "./event-log.ts";
import { MarketLogFollower } from "./live-log.ts";

const directories: string[] = [];
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });

test("market log follower reconstructs paginated state and lifecycle", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-market-test-")); directories.push(directory);
  const logPath = path.join(directory, "market.jsonl");
  await writeFile(logPath, `${record(1, "market.lifecycle", { state: "started" })}\n`);
  const follower = new MarketLogFollower(logPath);
  expect(await follower.poll()).toMatchObject({ status: "watching", changed: true, snapshot: { listings: [] } });
  await appendFile(logPath, `${record(2, "market.event", marketEventLogData({ kind: "searchRequest", tick: 1, request: { query: null, cursor: null, pageSize: 20 } }))}\n`);
  await appendFile(logPath, `${record(3, "market.event", marketEventLogData({ kind: "searchPage", tick: 2, page: { success: true, code: 0, message: "ok", listings: [], nextCursor: null, hasMore: false } }))}\n`);
  expect(await follower.poll()).toMatchObject({ status: "ready", invalidLines: 0, snapshot: { search: { pageSize: 20, hasMore: false } } });

  await appendFile(logPath, `${record(4, "market.event", marketEventLogData({ kind: "stallUpsert", tick: 3, stall: {
    stallId: "stall-example", accountId: "account-example", characterId: "character-example",
    mapId: "map-example", slotId: "slot-example", expiresAt: 12n, hiredAt: 10n,
    shopName: "Fictional Shop", characterName: "Fictional Merchant", archetype: 2,
    status: 1, version: 3n, visualSnapshotJson: "{\"Equips\":[]}",
  } }))}\n`);
  expect(await follower.poll()).toMatchObject({
    status: "ready",
    snapshot: { stalls: [{ stallId: "stall-example", accountId: null, visualSnapshotJson: null, archetype: null }] },
  });
});

function record(sequence: number, type: string, data: Record<string, unknown>): string {
  return JSON.stringify({ schemaVersion: 1, sessionId: "session-example", sequence, recordedAt: "2030-01-01T00:00:00.000Z", source: "market-test", type, data });
}
