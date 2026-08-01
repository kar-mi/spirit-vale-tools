import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { resolveFishNetMarketStat } from "../market-stats.ts";
import type { FishNetMarketListingView, FishNetMarketStat, FishNetMarketStatFilter } from "../market.ts";

export type MarketSort = "price-asc" | "price-desc";
export interface MarketListingQuery {
  sessionId: string; text?: string; itemType?: number; minPrice?: bigint; maxPrice?: bigint;
  stats?: readonly FishNetMarketStatFilter[]; statMode?: "all" | "any"; sort?: MarketSort;
  cursor?: string; limit?: number; expectedRevision?: number;
}
export interface MarketListingPage { ok: true; revision: number; total: number; items: FishNetMarketListingView[]; nextCursor?: string }
export interface MarketRevisionMismatch { ok: false; reason: "revision-mismatch"; expectedRevision: number; revision: number }
export type MarketListingResult = MarketListingPage | MarketRevisionMismatch;
export interface MarketSessionState { revision: number; listingCount: number; status: "watching" | "ready" | "stopped" | "error"; observedAt?: string }

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;

export class MarketHistoryStore {
  constructor(private readonly model: ReadModel) {}

  getState(sessionId: string): MarketSessionState {
    const row = this.model.statement("select revision, listing_count, status, observed_at from market_session_state where session_id = $sessionId").get({ sessionId }) as StateRow | null;
    return row ? { revision: row.revision, listingCount: row.listing_count, status: row.status, ...(row.observed_at ? { observedAt: row.observed_at } : {}) } : { revision: 0, listingCount: 0, status: "watching" };
  }

  listListings(query: MarketListingQuery): MarketListingResult {
    return this.model.transaction(() => {
      const state = this.getState(query.sessionId);
      if (query.expectedRevision !== undefined && (!Number.isSafeInteger(query.expectedRevision) || query.expectedRevision < 0)) throw new RangeError("expectedRevision must be a non-negative integer");
      if (query.expectedRevision !== undefined && query.expectedRevision !== state.revision) {
        return { ok: false, reason: "revision-mismatch", expectedRevision: query.expectedRevision, revision: state.revision };
      }
      const built = buildQuery(query);
      const totalRow = this.model.statement(`select count(*) as total ${built.from} ${built.countWhere}`).get(built.countParams) as { total: number };
      const rows = this.model.bigintStatement(`select l.*, s.shop_name, s.map_id ${built.from} ${built.pageWhere} order by l.price ${built.direction}, l.listing_key ${built.direction} limit $limit`)
        .all({ ...built.pageParams, limit: BigInt(built.limit + 1) }) as ListingRow[];
      const page = rows.slice(0, built.limit);
      const items = page.map((row) => this.hydrate(query.sessionId, row));
      const last = page.at(-1);
      return { ok: true, revision: state.revision, total: totalRow.total, items, ...(rows.length > built.limit && last ? { nextCursor: encodeCursor({ sort: built.sort, price: last.price, key: last.listing_key }) } : {}) };
    });
  }

  private hydrate(sessionId: string, row: ListingRow): FishNetMarketListingView {
    const stats = this.model.bigintStatement("select * from market_listing_stats where session_id = $sessionId and listing_key = $key order by stat_type")
      .all({ sessionId, key: row.listing_key }) as StatRow[];
    return {
      id: row.listing_id, sellerId: row.seller_id, sellerName: row.seller_name, itemId: row.item_id,
      itemType: num(row.item_type), count: num(row.count), countTraded: num(row.count_traded), price: row.price,
      json: row.json, expiresAt: row.expires_at, searchText: row.search_text, displayName: row.display_name,
      shopName: row.shop_name, mapId: row.map_id,
      ...(stats.length === 0 ? {} : { stats: stats.map((stat): FishNetMarketStat => ({ type: num(stat.stat_type), ...(stat.stat_name === null ? {} : { name: stat.stat_name as FishNetMarketStat["name"] }), roll: stat.roll, ...(stat.value === null ? {} : { value: stat.value }), percent: num(stat.percent) === 1, valueStr: stat.value_str })) }),
    };
  }
}

function buildQuery(query: MarketListingQuery): { from: string; countWhere: string; pageWhere: string; countParams: Record<string, string | number | bigint>; pageParams: Record<string, string | number | bigint>; direction: "asc" | "desc"; sort: MarketSort; limit: number } {
  const sort = query.sort ?? "price-asc";
  if (sort !== "price-asc" && sort !== "price-desc") throw new Error(`unknown market sort ${JSON.stringify(sort)}`);
  const statMode = query.statMode ?? "all";
  if (statMode !== "all" && statMode !== "any") throw new Error(`unknown market stat mode ${JSON.stringify(statMode)}`);
  const limit = positiveLimit(query.limit ?? DEFAULT_LIMIT);
  const clauses = ["l.session_id = $sessionId"];
  const params: Record<string, string | number | bigint> = { sessionId: query.sessionId };
  if (query.itemType !== undefined) { if (!Number.isSafeInteger(query.itemType)) throw new Error("market item type must be a safe integer"); clauses.push("l.item_type = $itemType"); params["itemType"] = BigInt(query.itemType); }
  if (query.minPrice !== undefined) { clauses.push("l.price >= $minPrice"); params["minPrice"] = query.minPrice; }
  if (query.maxPrice !== undefined) { clauses.push("l.price <= $maxPrice"); params["maxPrice"] = query.maxPrice; }
  const needle = query.text?.trim().toLocaleLowerCase();
  if (needle) { clauses.push("(l.normalized_text like $text escape '\\' or coalesce(s.normalized_text, '') like $text escape '\\')"); params["text"] = `%${escapeLike(needle)}%`; }
  const filters = normalizeFilters(query.stats ?? []);
  if (filters.length > 0) {
    const statClauses = filters.map((filter, index) => {
      const parts = [`ms${index}.session_id = l.session_id`, `ms${index}.listing_key = l.listing_key`, `ms${index}.stat_type = $statType${index}`];
      params[`statType${index}`] = BigInt(filter.type);
      if (filter.minValue !== undefined) { parts.push(`ms${index}.value >= CAST($statMin${index} AS REAL)`); params[`statMin${index}`] = filter.minValue.toString(); }
      if (filter.maxValue !== undefined) { parts.push(`ms${index}.value <= CAST($statMax${index} AS REAL)`); params[`statMax${index}`] = filter.maxValue.toString(); }
      return `exists (select 1 from market_listing_stats ms${index} where ${parts.join(" and ")})`;
    });
    if (statMode === "all") clauses.push(...statClauses);
    else clauses.push(`(${statClauses.join(" or ")})`);
  }
  const countWhere = `where ${clauses.join(" and ")}`;
  const cursor = decodeCursor(query.cursor);
  if (cursor && cursor.sort !== sort) throw new Error("market cursor sort does not match query sort");
  const direction = sort === "price-desc" ? "desc" : "asc";
  const countParams = { ...params };
  if (cursor) {
    const operator = direction === "asc" ? ">" : "<";
    clauses.push(`(l.price ${operator} $cursorPrice or (l.price = $cursorPrice and l.listing_key ${operator} $cursorKey))`);
    params["cursorPrice"] = cursor.price; params["cursorKey"] = cursor.key;
  }
  return { from: "from market_listings l left join market_stalls s on s.session_id = l.session_id and s.account_id = l.seller_id", countWhere, pageWhere: `where ${clauses.join(" and ")}`, countParams, pageParams: params, direction, sort, limit };
}

function normalizeFilters(filters: readonly FishNetMarketStatFilter[]): Array<{ type: number; minValue?: number; maxValue?: number }> {
  const values = new Map<number, { minValue?: number; maxValue?: number }>();
  for (const filter of filters) {
    const stat = resolveFishNetMarketStat(filter.stat); if (!stat) throw new Error(`unknown market stat ${JSON.stringify(filter.stat)}`);
    if (filter.minValue !== undefined && !Number.isFinite(filter.minValue)) throw new Error(`market stat minimum must be finite for ${JSON.stringify(filter.stat)}`);
    if (filter.maxValue !== undefined && !Number.isFinite(filter.maxValue)) throw new Error(`market stat maximum must be finite for ${JSON.stringify(filter.stat)}`);
    const previous = values.get(stat.type) ?? {};
    const minValue = filter.minValue === undefined ? previous.minValue : previous.minValue === undefined ? filter.minValue : Math.max(previous.minValue, filter.minValue);
    const maxValue = filter.maxValue === undefined ? previous.maxValue : previous.maxValue === undefined ? filter.maxValue : Math.min(previous.maxValue, filter.maxValue);
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) throw new Error(`market stat minimum exceeds maximum for ${JSON.stringify(filter.stat)}`);
    values.set(stat.type, { minValue, maxValue });
  }
  return [...values].map(([type, bounds]) => ({ type, ...bounds }));
}

interface StateRow { revision: number; listing_count: number; status: MarketSessionState["status"]; observed_at: string | null }
interface ListingRow { listing_key: string; listing_id: string | null; seller_id: string | null; seller_name: string | null; item_id: string | null; item_type: bigint; count: bigint; count_traded: bigint; price: bigint; json: string | null; expires_at: bigint; search_text: string | null; display_name: string | null; shop_name: string | null; map_id: string | null }
interface StatRow { stat_type: bigint; stat_name: string | null; roll: number; value: number | null; percent: bigint; value_str: string | null }
function num(value: number | bigint): number { return typeof value === "bigint" ? Number(value) : value; }
function positiveLimit(value: number): number { if (!Number.isSafeInteger(value) || value < 1) throw new RangeError("limit must be a positive integer"); return Math.min(value, MAX_LIMIT); }
function escapeLike(value: string): string { return value.replace(/[\\%_]/g, (match) => `\\${match}`); }
function encodeCursor(value: { sort: MarketSort; price: bigint; key: string }): string { return Buffer.from(JSON.stringify({ ...value, price: value.price.toString() })).toString("base64url"); }
function decodeCursor(value: string | undefined): { sort: MarketSort; price: bigint; key: string } | undefined {
  if (!value) return undefined;
  try { const parsed = JSON.parse(Buffer.from(value, "base64url").toString()) as Record<string, unknown>; if ((parsed["sort"] !== "price-asc" && parsed["sort"] !== "price-desc") || typeof parsed["price"] !== "string" || typeof parsed["key"] !== "string") throw new Error(); return { sort: parsed["sort"], price: BigInt(parsed["price"]), key: parsed["key"] }; } catch { throw new Error("invalid market cursor"); }
}
