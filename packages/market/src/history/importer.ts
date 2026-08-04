import type { IndexStreamResult, ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";
import { parseMarketEventLogData } from "../event-log.ts";
import { parseMarketSnapshotListings } from "../live-log.ts";
import { marketListingKey, parseFishNetMarketStats, resolveFishNetMarketListingDisplayName } from "../market.ts";
import type { FishNetMarketAccount, FishNetMarketEvent, FishNetMarketListing, FishNetMarketListingView, FishNetMarketStall } from "../market.ts";
import { MARKET_DOMAIN_NAME, MARKET_TABLES } from "./domain.ts";

export interface IndexMarketStreamOptions { sessionId: string; sourcePath: string; batchBytes?: number }

export async function indexMarketStream(model: ReadModel, options: IndexMarketStreamOptions): Promise<IndexStreamResult> {
  return model.indexStream({
    sessionId: options.sessionId, stream: "market", domain: MARKET_DOMAIN_NAME, sourcePath: options.sourcePath,
    ...(options.batchBytes === undefined ? {} : { batchBytes: options.batchBytes }),
    apply(records) {
      ensureState(model, options.sessionId);
      let invalid = 0;
      for (const record of records) invalid += applyRecord(model, options.sessionId, record);
      refreshCount(model, options.sessionId);
      return invalid;
    },
    clear(scope) { for (const table of MARKET_TABLES) model.statement(`delete from ${table} where session_id = $sessionId`).run({ sessionId: scope.sessionId }); },
  });
}

function applyRecord(model: ReadModel, sessionId: string, record: LogRecord): number {
  if (record.type === "market.lifecycle") {
    const state = record.data["state"];
    if (state !== "started" && state !== "stopped") return 1;
    if (state === "started") model.statement("update market_session_state set status = case when listing_count > 0 then 'ready' else 'watching' end where session_id = $sessionId").run({ sessionId });
    else setStatus(model, sessionId, "stopped");
    return 0;
  }
  if (record.type === "market.error") { setStatus(model, sessionId, "error"); return 0; }
  if (record.type === "market.snapshot") {
    const listings = parseMarketSnapshotListings(record.data["listings"]);
    if (!listings) return 1;
    clearListings(model, sessionId);
    for (const listing of listings) writeListing(model, sessionId, listing, listing.searchText, listing.displayName);
    noteUpdate(model, sessionId, record.recordedAt);
    return 0;
  }
  if (record.type !== "market.event") return 0;
  const event = parseMarketEventLogData(record.data);
  if (!event) return 1;
  applyEvent(model, sessionId, event);
  if (event.kind !== "collectResult") noteUpdate(model, sessionId, record.recordedAt);
  return 0;
}

function applyEvent(model: ReadModel, sessionId: string, event: FishNetMarketEvent): void {
  switch (event.kind) {
    case "catalog":
      clearListings(model, sessionId);
      for (const item of event.items ?? []) writeListing(model, sessionId, item.listing, item.searchText);
      for (const listing of readAccount(model, sessionId)?.ownListings ?? []) writeListing(model, sessionId, listing, null);
      break;
    case "account":
      model.statement("update market_session_state set account_json = $json where session_id = $sessionId")
        .run({ sessionId, json: event.account === null ? null : stringify(event.account) });
      for (const listing of event.account?.ownListings ?? []) writeListing(model, sessionId, listing, null);
      break;
    case "stalls":
      model.statement("delete from market_stalls where session_id = $sessionId").run({ sessionId });
      for (const stall of event.stalls ?? []) if (stall) writeStall(model, sessionId, stall);
      break;
    case "stallUpsert": if (event.stall) writeStall(model, sessionId, event.stall); break;
    case "stallRemove": if (event.accountId !== null) model.statement("delete from market_stalls where session_id = $sessionId and account_id = $accountId").run({ sessionId, accountId: event.accountId }); break;
    case "listings": for (const listing of event.listings ?? []) writeListing(model, sessionId, listing, null); break;
    case "collectResult": break;
  }
}

function writeListing(model: ReadModel, sessionId: string, listing: FishNetMarketListing | FishNetMarketListingView | null, searchText: string | null, displayName?: string | null): void {
  if (!listing) return;
  const key = marketListingKey(listing);
  const previous = model.statement("select search_text from market_listings where session_id = $sessionId and listing_key = $key").get({ sessionId, key }) as { search_text: string | null } | null;
  const search = searchText ?? previous?.search_text ?? null;
  const display = displayName ?? resolveFishNetMarketListingDisplayName(listing, search);
  model.statement(`insert or replace into market_listings
    (session_id, listing_key, listing_id, seller_id, seller_name, item_id, item_type, count, count_traded, price, json, expires_at, search_text, display_name, normalized_text)
    values ($sessionId, $key, $id, $sellerId, $sellerName, $itemId, $itemType, $count, $countTraded, $price, $json, $expiresAt, $searchText, $displayName, $normalizedText)`)
    .run({ sessionId, key, id: listing.id, sellerId: listing.sellerId, sellerName: listing.sellerName, itemId: listing.itemId, itemType: listing.itemType, count: listing.count, countTraded: listing.countTraded, price: listing.price, json: listing.json, expiresAt: listing.expiresAt, searchText: search, displayName: display, normalizedText: normalize([display, search, listing.itemId, listing.sellerName]) });
  model.statement("delete from market_listing_stats where session_id = $sessionId and listing_key = $key").run({ sessionId, key });
  const stats = "stats" in listing && listing.stats !== undefined ? listing.stats : parseFishNetMarketStats(listing.json, listing.itemType);
  for (const stat of stats ?? []) model.statement(`insert into market_listing_stats
    (session_id, listing_key, stat_type, stat_name, roll, value, percent, value_str)
    values ($sessionId, $key, $type, $name, $roll, $value, $percent, $valueStr)`)
    .run({ sessionId, key, type: stat.type, name: stat.name ?? null, roll: stat.roll, value: stat.value ?? null, percent: stat.percent ? 1 : 0, valueStr: stat.valueStr });
}

function writeStall(model: ReadModel, sessionId: string, stall: FishNetMarketStall): void {
  if (stall.stallId === null) return;
  model.statement(`insert or replace into market_stalls
    (session_id, stall_id, account_id, character_id, map_id, slot_id, expires_at, hired_at, shop_name, character_name, archetype, status, version, visual_snapshot_json, normalized_text)
    values ($sessionId, $stallId, $accountId, $characterId, $mapId, $slotId, $expiresAt, $hiredAt, $shopName, $characterName, $archetype, $status, $version, $visualSnapshotJson, $normalizedText)`)
    .run({ sessionId, stallId: stall.stallId, accountId: stall.accountId, characterId: stall.characterId, mapId: stall.mapId, slotId: stall.slotId, expiresAt: stall.expiresAt, hiredAt: stall.hiredAt, shopName: stall.shopName, characterName: stall.characterName, archetype: stall.archetype, status: stall.status, version: stall.version, visualSnapshotJson: stall.visualSnapshotJson, normalizedText: normalize([stall.shopName, stall.characterName, stall.mapId, stall.slotId]) });
}

function ensureState(model: ReadModel, sessionId: string): void { model.statement("insert or ignore into market_session_state (session_id) values ($sessionId)").run({ sessionId }); }
function setStatus(model: ReadModel, sessionId: string, status: string): void { ensureState(model, sessionId); model.statement("update market_session_state set status = $status where session_id = $sessionId").run({ sessionId, status }); }
function noteUpdate(model: ReadModel, sessionId: string, observedAt: string): void { model.statement("update market_session_state set revision = revision + 1, status = 'ready', observed_at = $observedAt where session_id = $sessionId").run({ sessionId, observedAt }); }
function refreshCount(model: ReadModel, sessionId: string): void { model.statement("update market_session_state set listing_count = (select count(*) from market_listings where session_id = $sessionId) where session_id = $sessionId").run({ sessionId }); }
function clearListings(model: ReadModel, sessionId: string): void { model.statement("delete from market_listing_stats where session_id = $sessionId").run({ sessionId }); model.statement("delete from market_listings where session_id = $sessionId").run({ sessionId }); }
function stringify(value: unknown): string { return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? entry.toString() : entry); }
function normalize(values: Array<string | null | undefined>): string { return values.filter((value): value is string => Boolean(value)).join(" ").trim().toLocaleLowerCase(); }
function readAccount(model: ReadModel, sessionId: string): FishNetMarketAccount | undefined {
  const row = model.statement("select account_json from market_session_state where session_id = $sessionId").get({ sessionId }) as { account_json: string | null } | null;
  if (!row?.account_json) return undefined;
  try { return (parseMarketEventLogData({ kind: "account", tick: 0, account: JSON.parse(row.account_json) }) as Extract<FishNetMarketEvent, { kind: "account" }> | undefined)?.account ?? undefined; } catch { return undefined; }
}
