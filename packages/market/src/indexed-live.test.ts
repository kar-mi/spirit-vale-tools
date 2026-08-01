import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "bun:test";
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { createMarketDomain } from "./history/domain.ts";
import { IndexedMarketSessionLogFollower } from "./indexed-live.ts";
import { marketEventLogData } from "./event-log.ts";

test("indexed market session follower returns bounded revision metadata", async () => {
  const root = path.join(tmpdir(), `market-indexed-follow-${crypto.randomUUID()}`);
  const session = await createLogSession({ producer: "synthetic-test", streams: ["market"], logDirectory: root });
  session.logger("market").log("market.event", marketEventLogData({ kind: "catalog", tick: 1, items: [{ sellerId: "seller-example", sellerName: "Merchant Example", searchText: "Example Item", listing: { id: "listing-example", sellerId: "seller-example", sellerName: "Merchant Example", itemId: "item-example", itemType: 2, count: 1, countTraded: 0, price: 10n, json: null, expiresAt: 4_102_444_800n } }] }));
  await session.close();
  const model = await openReadModel({ logDirectory: root, domains: [createMarketDomain()] });
  try {
    const update = await new IndexedMarketSessionLogFollower(model, root).poll();
    expect(update).toMatchObject({ sessionId: session.id, revision: 1, listingCount: 1, reset: true, changed: true, status: "ready" });
    expect("listings" in update).toBe(false);
  } finally { model.close(); await rm(root, { recursive: true, force: true }); }
});
