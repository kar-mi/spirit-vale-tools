import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { marketEventLogData } from "../event-log.ts";
import type { FishNetMarketEvent, FishNetMarketListing } from "../market.ts";
import { createMarketDomain } from "./domain.ts";
import { indexMarketStream } from "./importer.ts";
import { MarketHistoryStore } from "./store.ts";

const SESSION = "synthetic-market-session";
let sequence = 0;
function record(type: string, data: LogRecord["data"]): string {
  const value: LogRecord = { schemaVersion: 1, sessionId: SESSION, sequence: ++sequence, recordedAt: new Date(Date.UTC(2030, 0, 1) + sequence * 1_000).toISOString(), source: "synthetic-test", type, data };
  return `${JSON.stringify(value)}\n`;
}
function event(value: FishNetMarketEvent): string { return record("market.event", marketEventLogData(value)); }
function listing(id: string, price: bigint, sellerId = "seller-a", itemType = 2): FishNetMarketListing {
  return { id, sellerId, sellerName: `Merchant ${sellerId}`, itemId: `item-${id}`, itemType, count: 2, countTraded: 0, price, json: JSON.stringify({ Id: "Synthetic Sword", Substats: [{ Type: 0, Value: 50, ValueStr: null }] }), expiresAt: 4_102_444_800n };
}

describe("market read model", () => {
  test("indexes events and serves revision-stable filtered cursor pages", async () => {
    const root = path.join(tmpdir(), `market-history-${crypto.randomUUID()}`); await mkdir(root, { recursive: true });
    const logPath = path.join(root, "market.jsonl"); sequence = 0;
    const initial = [listing("a", 10n), listing("b", 10n), listing("c", 9_007_199_254_740_993n, "seller-b", 3)];
    await writeFile(logPath, [
      record("market.lifecycle", { state: "started" }),
      event({ kind: "stalls", tick: 1, stalls: [{ stallId: "stall-a", accountId: "seller-a", characterId: "character-a", mapId: "map-example", slotId: "slot-a", expiresAt: 4_102_444_800n, hiredAt: 4_102_441_200n, shopName: "Example Shop", characterName: "Merchant A", archetype: 1, status: 1, version: 1n, visualSnapshotJson: "{\"Archetype\":1}" }] }),
      event({ kind: "catalog", tick: 2, items: initial.map((value) => ({ sellerId: value.sellerId, sellerName: value.sellerName, searchText: `Search ${value.id}`, listing: value })) }),
    ].join(""));
    const model = await openReadModel({ path: path.join(root, "model.sqlite"), domains: [createMarketDomain()] });
    try {
      const indexed = await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath, batchBytes: 64 });
      expect(indexed.invalidLines).toBe(0);
      const store = new MarketHistoryStore(model);
      const first = store.listListings({ sessionId: SESSION, limit: 2, sort: "price-asc" });
      expect(first).toMatchObject({ ok: true, total: 3, items: [{ id: "a" }, { id: "b" }] });
      if (!first.ok) throw new Error("expected page");
      const second = store.listListings({ sessionId: SESSION, limit: 2, sort: "price-asc", cursor: first.nextCursor, expectedRevision: first.revision });
      expect(second).toMatchObject({ ok: true, total: 3, items: [{ id: "c", price: 9_007_199_254_740_993n }] });
      expect(store.listListings({ sessionId: SESSION, text: "example shop" })).toMatchObject({ ok: true, total: 2 });
      expect(store.listListings({ sessionId: SESSION, itemType: 3, stats: [{ stat: "Str" }] })).toMatchObject({ ok: true, total: 1 });
      expect(store.listListings({ sessionId: SESSION, stats: [{ stat: "Str", minValue: 0, maxValue: 10_000 }] })).toMatchObject({ ok: true, total: 3 });

      await appendFile(logPath, event({ kind: "listings", tick: 3, listings: [listing("d", 5n)] }));
      await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath });
      expect(store.listListings({ sessionId: SESSION, expectedRevision: first.revision })).toEqual({ ok: false, reason: "revision-mismatch", expectedRevision: first.revision, revision: first.revision + 1 });
      expect((await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath })).recordsIndexed).toBe(0);
    } finally { model.close(); await rm(root, { recursive: true, force: true }); }
  });

  test("replaces listings from a legacy snapshot", async () => {
    const root = path.join(tmpdir(), `market-snapshot-${crypto.randomUUID()}`); await mkdir(root, { recursive: true });
    const logPath = path.join(root, "market.jsonl"); sequence = 0;
    const value = listing("snapshot", 25n);
    await writeFile(logPath, record("market.snapshot", { listings: [{ ...JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item)), displayName: "Snapshot Item", searchText: "Snapshot Search", shopName: null, mapId: null }] }));
    const model = await openReadModel({ path: path.join(root, "model.sqlite"), domains: [createMarketDomain()] });
    try { await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath }); expect(new MarketHistoryStore(model).listListings({ sessionId: SESSION })).toMatchObject({ ok: true, total: 1, items: [{ id: "snapshot", displayName: "Snapshot Search" }] }); }
    finally { model.close(); await rm(root, { recursive: true, force: true }); }
  });

  test("restores account listings after catalog resets and clears domain rows on truncation", async () => {
    const root = path.join(tmpdir(), `market-rebuild-${crypto.randomUUID()}`); await mkdir(root, { recursive: true });
    const logPath = path.join(root, "market.jsonl"); sequence = 0;
    const own = listing("own", 30n); const catalog = listing("catalog", 20n);
    await writeFile(logPath, [
      event({ kind: "account", tick: 1, account: { balance: 100n, collectables: [], saleHistory: [], ownListings: [own] } }),
      event({ kind: "catalog", tick: 2, items: [{ sellerId: catalog.sellerId, sellerName: catalog.sellerName, searchText: "Catalog Item", listing: catalog }] }),
    ].join(""));
    const model = await openReadModel({ path: path.join(root, "model.sqlite"), domains: [createMarketDomain()] });
    try {
      await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath });
      const store = new MarketHistoryStore(model);
      expect(store.listListings({ sessionId: SESSION })).toMatchObject({ ok: true, total: 2 });
      sequence = 0;
      const replacement = listing("replacement", 5n);
      await writeFile(logPath, event({ kind: "catalog", tick: 1, items: [{ sellerId: replacement.sellerId, sellerName: replacement.sellerName, searchText: "Replacement", listing: replacement }] }));
      const rebuilt = await indexMarketStream(model, { sessionId: SESSION, sourcePath: logPath });
      expect(rebuilt.rebuilt).toBe(true);
      expect(store.listListings({ sessionId: SESSION })).toMatchObject({ ok: true, total: 1, items: [{ id: "replacement" }] });
    } finally { model.close(); await rm(root, { recursive: true, force: true }); }
  });
});
