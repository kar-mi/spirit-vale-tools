import { appendFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, test } from "bun:test";

import { createLogSession } from "@spiritvale/logging";
import type { JsonObject } from "@spiritvale/logging";
import { MarketLogFollower, MarketSessionLogFollower } from "./live-log.ts";
import { marketEventLogData } from "./event-log.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("market log follower", () => {
  test("restores full snapshots and lifecycle state incrementally", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-market-test-"));
    temporaryDirectories.push(directory);
    const logPath = path.join(directory, "market.jsonl");
    await writeFile(logPath, `${record(1, "market.lifecycle", { state: "started" })}\n`);
    const follower = new MarketLogFollower(logPath);

    expect(await follower.poll()).toMatchObject({ status: "watching", changed: true, listings: [] });

    await appendFile(logPath, `${record(2, "market.snapshot", { listings: [listing()] })}\n`);
    const snapshot = await follower.poll();
    expect(snapshot).toMatchObject({ status: "ready", changed: true, invalidLines: 0 });
    expect(snapshot.listings[0]).toMatchObject({
      id: "listing-example",
      displayName: "Example Sword",
      sellerName: "Merchant Example",
      price: 1250n,
      stats: [{ name: "Str", value: 3 }],
    });

    await appendFile(logPath, `${record(3, "market.lifecycle", { state: "stopped" })}\n`);
    expect(await follower.poll()).toMatchObject({ status: "stopped", changed: true });
  });

  test("rejects malformed snapshots and resets after truncation", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-market-test-"));
    temporaryDirectories.push(directory);
    const logPath = path.join(directory, "market.jsonl");
    await writeFile(logPath, `${record(1, "market.snapshot", { listings: "invalid" })}\n`);
    const follower = new MarketLogFollower(logPath);

    expect(await follower.poll()).toMatchObject({ invalidLines: 1, listings: [] });
    await writeFile(logPath, `${record(1, "market.lifecycle", { state: "started" })}\n`);
    expect(await follower.poll()).toMatchObject({ reset: true, status: "watching", listings: [] });
  });

  test("reconstructs listings from validated market events", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-market-test-"));
    temporaryDirectories.push(directory);
    const logPath = path.join(directory, "market.jsonl");
    const data = marketEventLogData({
      kind: "catalog",
      tick: 10,
      items: [{
        sellerId: "seller-example",
        searchText: "Example Sword",
        sellerName: "Merchant Example",
        listing: {
          id: "listing-event",
          sellerId: "seller-example",
          sellerName: "Merchant Example",
          itemId: "item-example",
          itemType: 2,
          count: 2,
          countTraded: 0,
          price: 1250n,
          json: null,
          expiresAt: 4102444800n,
        },
      }],
    });
    await writeFile(logPath, `${record(1, "market.event", data)}\n`);

    const batch = await new MarketLogFollower(logPath).poll();

    expect(batch).toMatchObject({ status: "ready", invalidLines: 0 });
    expect(batch.listings[0]).toMatchObject({ id: "listing-event", displayName: "Example Sword", price: 1250n });
  });

  test("switches to the newly current market session", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-market-test-"));
    temporaryDirectories.push(directory);
    const first = await createLogSession({ producer: "market-test", streams: ["market"], logDirectory: directory });
    first.logger("market").log("market.snapshot", { listings: [listing("listing-first")] });
    await first.close();
    const follower = new MarketSessionLogFollower(directory);
    expect(await follower.poll()).toMatchObject({ reset: true, listings: [{ id: "listing-first" }] });

    const second = await createLogSession({ producer: "market-test", streams: ["market"], logDirectory: directory });
    second.logger("market").log("market.snapshot", { listings: [listing("listing-second")] });
    await second.close();
    expect(await follower.poll()).toMatchObject({ reset: true, listings: [{ id: "listing-second" }] });
  });
});

function record(sequence: number, type: string, data: Record<string, unknown>): string {
  return JSON.stringify({
    schemaVersion: 1,
    sessionId: "session-example",
    sequence,
    recordedAt: "2030-01-01T00:00:00.000Z",
    source: "market-test",
    type,
    data,
  });
}

function listing(id = "listing-example"): JsonObject {
  return {
    id,
    sellerId: "seller-example",
    sellerName: "Merchant Example",
    itemId: "item-example",
    itemType: 2,
    count: 2,
    countTraded: 0,
    price: "1250",
    json: null,
    expiresAt: "4102444800",
    searchText: "Example Sword",
    shopName: "Example Shop",
    mapId: "map-example",
    stats: [{ type: 0, name: "Str", value: 3, roll: 50, percent: false, valueStr: null }],
  };
}
