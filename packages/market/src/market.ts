import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket, FishNetDecodedValue } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetItemDirectory } from "@kar-mi/spirit-vale-tools-items";
import { isRecord } from "@kar-mi/spirit-vale-tools-logging";
import { calculateFishNetMarketStatValues } from "./market-stat-values.ts";
import { fishNetMarketStatName, resolveFishNetMarketStat } from "./market-stats.ts";
import type { FishNetMarketStatName } from "./market-stats.ts";

const DEFAULT_ITEM_DIRECTORY = new FishNetItemDirectory();

export interface FishNetMarketItem {
  itemId: string | null; instanceId: string | null; itemType: number; quantity: number;
  payloadJson: string | null; payloadSchemaVersion: number | null; compatibilityFingerprint: string | null;
}
export interface FishNetMarketListing {
  listingId: string | null; sellerAccountId: string | null; sellerDisplayName: string | null;
  itemDisplayName: string | null; item: FishNetMarketItem; initialQuantity: number;
  availableQuantity: number; soldQuantity: number; unitPrice: bigint; status: number; version: bigint;
  createdAt: bigint; updatedAt: bigint; expiresAt: bigint;
}
export interface FishNetMarketCollectable { entryId: string | null; item: FishNetMarketItem }
export interface FishNetMarketSale {
  transactionId: string | null; listingId: string | null; itemDisplayName: string | null; quantity: number;
  sellerProceeds: bigint; buyerAccountId: string | null; buyerDisplayName: string | null; completedAt: bigint;
}
export interface FishNetMarketOverview {
  pendingCoins: bigint; mailboxItems: Array<FishNetMarketCollectable | null> | null; mailboxHasMore: boolean;
  transactions: Array<FishNetMarketSale | null> | null; transactionsHaveMore: boolean;
  ownListings: Array<FishNetMarketListing | null> | null; ownListingsHaveMore: boolean;
  code: number; reason: number; message: string | null;
}
export interface FishNetMarketStall {
  stallId: string | null; accountId: string | null; characterId: string | null; mapId: string | null;
  slotId: string | null; expiresAt: bigint; hiredAt: bigint; shopName: string | null;
  characterName: string | null; archetype: number | null; status: number; version: bigint; visualSnapshotJson: string | null;
}
export interface FishNetMarketStallStatus {
  hasActiveStall: boolean; characterId: string | null; expiresAt: bigint; occupiedCount: number; totalSpots: number;
}
export interface FishNetMarketSearchRequest { query: string | null; cursor: string | null; pageSize: number }
export interface FishNetMarketSearchPage {
  success: boolean; code: number; message: string | null; listings: FishNetMarketListing[];
  nextCursor: string | null; hasMore: boolean;
}
export type FishNetMarketEvent =
  | { kind: "searchRequest"; tick: number; request: FishNetMarketSearchRequest }
  | { kind: "searchPage"; tick: number; page: FishNetMarketSearchPage }
  | { kind: "overview"; tick: number; overview: FishNetMarketOverview }
  | { kind: "stallStatus"; tick: number; status: FishNetMarketStallStatus | null }
  | { kind: "stalls"; tick: number; stalls: Array<FishNetMarketStall | null> | null }
  | { kind: "stallUpsert"; tick: number; stall: FishNetMarketStall | null }
  | { kind: "stallRemove"; tick: number; accountId: string | null }
  | { kind: "stallListings"; tick: number; listings: Array<FishNetMarketListing | null> | null }
  | { kind: "collectResult"; tick: number; success: boolean; message: string | null };
export interface FishNetMarketSearchState extends FishNetMarketSearchRequest {
  nextCursor?: string | null; hasMore?: boolean; success?: boolean; code?: number; message?: string | null;
}
export interface FishNetMarketListingView extends FishNetMarketListing {
  displayName: string | null; shopName: string | null; mapId: string | null; stats?: FishNetMarketStat[];
}
export interface FishNetMarketStat {
  type: number; name?: FishNetMarketStatName; value?: number; roll: number; percent: boolean; valueStr: string | null;
}
export interface FishNetMarketStatFilter { stat: string | number; minValue?: number; maxValue?: number }
export interface FishNetMarketQuery {
  text?: string; itemType?: number; minPrice?: bigint; maxPrice?: bigint; stats?: readonly FishNetMarketStatFilter[];
  statMode?: "all" | "any"; sort?: "price-asc" | "price-desc"; offset?: number; limit?: number;
}
export interface FishNetMarketSnapshot {
  search?: FishNetMarketSearchState; listings: FishNetMarketListingView[]; stalls: FishNetMarketStall[];
  stallStatus?: FishNetMarketStallStatus; overview?: FishNetMarketOverview;
  lastBalanceDelta?: bigint; lastCollectedAmount?: bigint;
}
export interface FishNetMarketTrackerOptions { itemDirectory?: FishNetItemDirectory }

const PLAYER_RPCS = new Set([
  "RequestVendorItemList_S", "RequestVendorItemList_T", "RequestVendingOverview_T", "RequestVendingStallStatus_T",
  "LoadVendingStalls_T", "SpawnVendingStall_C", "SpawnVendingStall_T", "DespawnVendingStall_C",
  "DespawnVendingStall_T", "RequestVendingStallListings_T",
]);

export function decodeFishNetMarketPacket(packet: DecodedFishNetPacket): FishNetMarketEvent[] {
  if (packet.rpcResolution !== "verified" || packet.rpcName === undefined) return [];
  if (PLAYER_RPCS.has(packet.rpcName) && packet.networkBehaviourType !== "PlayerController") return [];
  if (packet.rpcName === "VendingCollectResult_T" && packet.networkBehaviourType !== "PlayerSave") return [];
  switch (packet.rpcName) {
    case "RequestVendorItemList_S": return [{ kind: "searchRequest", tick: packet.tick, request: {
      query: nullableDecodedString(packet, "dto.Query"), cursor: nullableDecodedString(packet, "dto.Cursor"),
      pageSize: decodedInteger(packet, "dto.PageSize"),
    } }];
    case "RequestVendorItemList_T": return [{ kind: "searchPage", tick: packet.tick, page: parseSearchPage(decodedJson(packet, "pageJson")) }];
    case "RequestVendingOverview_T": return [{ kind: "overview", tick: packet.tick, overview: parseOverview(decodedJson(packet, "responseJson")) }];
    case "RequestVendingStallStatus_T": return [{ kind: "stallStatus", tick: packet.tick, status: decodedStallStatus(packet) }];
    case "LoadVendingStalls_T": return [{ kind: "stalls", tick: packet.tick, stalls: parseJsonArray(decodedString(packet, "stallsJson"), parseStallDto) }];
    case "SpawnVendingStall_C": case "SpawnVendingStall_T":
      return [{ kind: "stallUpsert", tick: packet.tick, stall: parseStallDto(decodedJson(packet, "dataJson")) }];
    case "DespawnVendingStall_C": case "DespawnVendingStall_T":
      return [{ kind: "stallRemove", tick: packet.tick, accountId: decodedString(packet, "accountId") }];
    case "RequestVendingStallListings_T":
      return [{ kind: "stallListings", tick: packet.tick, listings: parseJsonArray(decodedString(packet, "listingsJson"), parseListingDto) }];
    case "VendingCollectResult_T":
      return [{ kind: "collectResult", tick: packet.tick, success: decodedBoolean(packet, "success"), message: nullableDecodedString(packet, "message") }];
    default: return [];
  }
}

function decodedValue(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((field) => field.name === name)?.value;
}
function decodedString(packet: DecodedFishNetPacket, name: string): string {
  const value = decodedValue(packet, name);
  if (typeof value !== "string") throw protocolFieldError(packet, name);
  return value;
}
function nullableDecodedString(packet: DecodedFishNetPacket, name: string): string | null {
  const value = decodedValue(packet, name);
  if (value === null || typeof value === "string") return value;
  throw protocolFieldError(packet, name);
}
function decodedInteger(packet: DecodedFishNetPacket, name: string): number {
  const value = decodedValue(packet, name);
  if (!Number.isSafeInteger(value)) throw protocolFieldError(packet, name);
  return value as number;
}
function decodedBigInt(packet: DecodedFishNetPacket, name: string): bigint {
  const value = decodedValue(packet, name);
  if (typeof value !== "string" || !/^-?\d+$/.test(value)) throw protocolFieldError(packet, name);
  return BigInt(value);
}
function decodedBoolean(packet: DecodedFishNetPacket, name: string): boolean {
  const value = decodedValue(packet, name);
  if (typeof value !== "boolean") throw protocolFieldError(packet, name);
  return value;
}
function protocolFieldError(packet: DecodedFishNetPacket, name: string): FishNetProtocolError {
  return new FishNetProtocolError(`${packet.rpcName ?? "market RPC"} has no decoded ${name}`);
}
function decodedJson(packet: DecodedFishNetPacket, name: string): unknown {
  try { return JSON.parse(decodedString(packet, name)) as unknown; }
  catch { throw new FishNetProtocolError(`${packet.rpcName ?? "market RPC"} contains invalid JSON`); }
}
function decodedStallStatus(packet: DecodedFishNetPacket): FishNetMarketStallStatus | null {
  if (decodedValue(packet, "dto") === null) return null;
  return { hasActiveStall: decodedBoolean(packet, "dto.HasActiveStall"), characterId: nullableDecodedString(packet, "dto.CharacterId"),
    expiresAt: decodedBigInt(packet, "dto.ExpiresAt"), occupiedCount: decodedInteger(packet, "dto.OccupiedCount"),
    totalSpots: decodedInteger(packet, "dto.TotalSpots") };
}

function parseSearchPage(value: unknown): FishNetMarketSearchPage {
  if (!isRecord(value) || !Array.isArray(value["Listings"])) throw new FishNetProtocolError("invalid vending search page JSON");
  return { success: jsonBoolean(value["Success"], "search success"), code: jsonInteger(value["Code"], "search result code"),
    message: nullableJsonString(value["Message"]), listings: value["Listings"].map(parseListingDto),
    nextCursor: nullableJsonString(value["NextCursor"]), hasMore: jsonBoolean(value["HasMore"], "search has-more flag") };
}
function parseListingDto(value: unknown): FishNetMarketListing {
  if (!isRecord(value) || !isRecord(value["Item"])) throw new FishNetProtocolError("invalid vending listing JSON");
  return { listingId: nullableJsonString(value["ListingId"]), sellerAccountId: nullableJsonString(value["SellerAccountId"]),
    sellerDisplayName: nullableJsonString(value["SellerDisplayName"]), itemDisplayName: nullableJsonString(value["ItemDisplayName"]),
    item: parseItemSnapshot(value["Item"]), initialQuantity: jsonInteger(value["InitialQuantity"], "initial quantity"),
    availableQuantity: jsonInteger(value["AvailableQuantity"], "available quantity"), soldQuantity: jsonInteger(value["SoldQuantity"], "sold quantity"),
    unitPrice: jsonBigInt(value["UnitPrice"], "unit price"), status: jsonInteger(value["Status"], "listing status"),
    version: jsonBigInt(value["Version"], "listing version"), createdAt: jsonTimestamp(value["CreatedAt"], "listing creation"),
    updatedAt: jsonTimestamp(value["UpdatedAt"], "listing update"), expiresAt: jsonTimestamp(value["ExpiresAt"], "listing expiry") };
}
function parseItemSnapshot(value: unknown): FishNetMarketItem {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending item snapshot JSON");
  return { itemId: nullableJsonString(value["ItemId"]), instanceId: nullableJsonString(value["InstanceId"]),
    itemType: jsonInteger(value["Type"], "item type"), quantity: jsonInteger(value["Quantity"], "item quantity"),
    payloadJson: nullableJsonString(value["PayloadJson"]), payloadSchemaVersion: nullableJsonInteger(value["PayloadSchemaVersion"], "payload schema version"),
    compatibilityFingerprint: nullableJsonString(value["CompatibilityFingerprint"]) };
}
function parseOverview(value: unknown): FishNetMarketOverview {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending overview JSON");
  return { pendingCoins: jsonBigInt(value["PendingCoins"], "pending coins"), mailboxItems: jsonArray(value["MailboxItems"], parseMailboxDto),
    mailboxHasMore: jsonBoolean(value["MailboxHasMore"], "mailbox has-more flag"), transactions: jsonArray(value["Transactions"], parseTransactionDto),
    transactionsHaveMore: jsonBoolean(value["TransactionsHaveMore"], "transactions has-more flag"), ownListings: jsonArray(value["OwnListings"], parseListingDto),
    ownListingsHaveMore: jsonBoolean(value["OwnListingsHaveMore"], "own-listings has-more flag"), code: jsonInteger(value["Code"], "overview result code"),
    reason: jsonInteger(value["Reason"], "overview reason"), message: nullableJsonString(value["Message"]) };
}
function parseMailboxDto(value: unknown): FishNetMarketCollectable {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending mailbox JSON");
  return { entryId: nullableJsonString(value["EntryId"]), item: parseItemSnapshot(value["Item"]) };
}
function parseTransactionDto(value: unknown): FishNetMarketSale {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending transaction JSON");
  return { transactionId: nullableJsonString(value["TransactionId"]), listingId: nullableJsonString(value["ListingId"]),
    itemDisplayName: nullableJsonString(value["ItemDisplayName"]), quantity: jsonInteger(value["Quantity"], "transaction quantity"),
    sellerProceeds: jsonBigInt(value["SellerProceeds"], "seller proceeds"), buyerAccountId: nullableJsonString(value["BuyerAccountId"]),
    buyerDisplayName: nullableJsonString(value["BuyerDisplayName"]), completedAt: jsonTimestamp(value["CompletedAt"], "transaction time") };
}
function parseStallDto(value: unknown): FishNetMarketStall {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending stall JSON");
  const visualSnapshotJson = nullableJsonString(value["VisualSnapshotJson"]);
  let archetype: number | null = null;
  if (visualSnapshotJson !== null) try { const visual: unknown = JSON.parse(visualSnapshotJson); if (isRecord(visual) && Number.isSafeInteger(visual["Archetype"])) archetype = visual["Archetype"] as number; } catch { /* Optional display metadata. */ }
  return { stallId: nullableJsonString(value["StallId"]), accountId: nullableJsonString(value["AccountId"]), characterId: nullableJsonString(value["CharacterId"]),
    mapId: nullableJsonString(value["MapId"]), slotId: nullableJsonString(value["SlotId"]), expiresAt: jsonTimestamp(value["ExpiresAt"], "stall expiry"),
    hiredAt: jsonTimestamp(value["HiredAt"], "stall hire time"), shopName: nullableJsonString(value["ShopName"]),
    characterName: nullableJsonString(value["CharacterDisplayName"]), archetype, status: jsonInteger(value["Status"], "stall status"),
    version: jsonBigInt(value["Version"], "stall version"), visualSnapshotJson };
}
function parseJsonArray<T>(json: string, parse: (value: unknown) => T): T[] {
  let value: unknown; try { value = JSON.parse(json); } catch { throw new FishNetProtocolError("market RPC contains invalid JSON"); }
  if (!Array.isArray(value)) throw new FishNetProtocolError("market JSON root is not an array");
  return value.map(parse);
}
function jsonArray<T>(value: unknown, parse: (entry: unknown) => T): Array<T | null> | null {
  if (value === null) return null;
  if (!Array.isArray(value)) throw new FishNetProtocolError("invalid vending JSON array");
  return value.map((entry) => entry === null ? null : parse(entry));
}
function nullableJsonString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new FishNetProtocolError("invalid vending JSON string");
  return value;
}
function nullableJsonInteger(value: unknown, label: string): number | null { return value === null || value === undefined ? null : jsonInteger(value, label); }
function jsonInteger(value: unknown, label: string): number { if (!Number.isSafeInteger(value)) throw new FishNetProtocolError(`invalid ${label}`); return value as number; }
function jsonBoolean(value: unknown, label: string): boolean { if (typeof value !== "boolean") throw new FishNetProtocolError(`invalid ${label}`); return value; }
function jsonBigInt(value: unknown, label: string): bigint {
  if ((typeof value !== "number" || !Number.isSafeInteger(value)) && (typeof value !== "string" || !/^-?\d+$/.test(value))) throw new FishNetProtocolError(`invalid ${label}`);
  return BigInt(value);
}
function jsonTimestamp(value: unknown, label: string): bigint {
  if (typeof value !== "string") throw new FishNetProtocolError(`invalid ${label}`);
  const milliseconds = Date.parse(value); if (!Number.isFinite(milliseconds)) throw new FishNetProtocolError(`invalid ${label}`);
  return BigInt(Math.trunc(milliseconds / 1000));
}

export class FishNetMarketTracker {
  private readonly itemDirectory: FishNetItemDirectory;
  private readonly listings = new Map<string, FishNetMarketListing>();
  private readonly stalls = new Map<string, FishNetMarketStall>();
  private readonly pendingSearches: FishNetMarketSearchRequest[] = [];
  private search?: FishNetMarketSearchState; private stallStatus?: FishNetMarketStallStatus;
  private overview?: FishNetMarketOverview; private lastBalanceDelta?: bigint; private lastCollectedAmount?: bigint;
  private awaitingCollectOverview = false;
  constructor(options: FishNetMarketTrackerOptions = {}) { this.itemDirectory = options.itemDirectory ?? DEFAULT_ITEM_DIRECTORY; }
  consume(packet: DecodedFishNetPacket): FishNetMarketEvent[] { return decodeFishNetMarketPacket(packet).map((event) => this.apply(event)); }
  apply(event: FishNetMarketEvent): FishNetMarketEvent {
    switch (event.kind) {
      case "searchRequest": this.pendingSearches.push(event.request); if (!event.request.cursor) this.listings.clear(); this.search = { ...event.request }; return event;
      case "searchPage": { const request = this.pendingSearches.shift(); if (!request) this.listings.clear();
        if (event.page.success) for (const listing of event.page.listings) this.upsert(listing);
        this.search = { ...(request ?? this.search ?? { query: null, cursor: null, pageSize: event.page.listings.length }),
          nextCursor: event.page.nextCursor, hasMore: event.page.hasMore, success: event.page.success,
          code: event.page.code, message: event.page.message }; return event; }
      case "overview": { const previous = this.overview?.pendingCoins; this.overview = event.overview;
        if (previous !== undefined) { this.lastBalanceDelta = event.overview.pendingCoins - previous;
          if (this.awaitingCollectOverview && this.lastBalanceDelta < 0n) this.lastCollectedAmount = -this.lastBalanceDelta; }
        this.awaitingCollectOverview = false; for (const listing of event.overview.ownListings ?? []) if (listing) this.upsert(listing); return event; }
      case "stallStatus": this.stallStatus = event.status ?? undefined; return event;
      case "stalls": this.stalls.clear(); for (const stall of event.stalls ?? []) if (stall) this.upsertStall(stall); return event;
      case "stallUpsert": if (event.stall) this.upsertStall(event.stall); return event;
      case "stallRemove": if (event.accountId !== null) this.stalls.delete(`account:${event.accountId}`); return event;
      case "stallListings": for (const listing of event.listings ?? []) if (listing) this.upsert(listing); return event;
      case "collectResult": this.awaitingCollectOverview = event.success; return event;
    }
  }
  snapshot(): FishNetMarketSnapshot { return { ...(this.search ? { search: { ...this.search } } : {}), listings: this.query(),
    stalls: [...this.stalls.values()], ...(this.stallStatus ? { stallStatus: { ...this.stallStatus } } : {}),
    ...(this.overview ? { overview: this.overview } : {}), ...(this.lastBalanceDelta === undefined ? {} : { lastBalanceDelta: this.lastBalanceDelta }),
    ...(this.lastCollectedAmount === undefined ? {} : { lastCollectedAmount: this.lastCollectedAmount }) }; }
  query(query: FishNetMarketQuery = {}): FishNetMarketListingView[] {
    const views = [...this.listings.values()].map((listing): FishNetMarketListingView => { const stall = listing.sellerAccountId === null ? undefined : this.stalls.get(`account:${listing.sellerAccountId}`);
      return { ...listing, displayName: resolveFishNetMarketListingDisplayName(listing, this.itemDirectory), shopName: stall?.shopName ?? null,
        mapId: stall?.mapId ?? null, stats: parseFishNetMarketStats(listing.item.payloadJson, catalogItemType(listing.item.itemType), listing.item.itemId) }; });
    return queryFishNetMarketListings(views, query);
  }
  reset(): void { this.listings.clear(); this.stalls.clear(); this.pendingSearches.length = 0; this.search = undefined; this.stallStatus = undefined;
    this.overview = undefined; this.lastBalanceDelta = undefined; this.lastCollectedAmount = undefined; this.awaitingCollectOverview = false; }
  private upsert(listing: FishNetMarketListing): void { this.listings.set(marketListingKey(listing), listing); }
  private upsertStall(stall: FishNetMarketStall): void {
    const key = stall.accountId !== null ? `account:${stall.accountId}` : stall.stallId !== null ? `stall:${stall.stallId}` : undefined;
    if (key !== undefined) this.stalls.set(key, stall);
  }
}

export function marketListingKey(listing: Pick<FishNetMarketListing, "listingId" | "sellerAccountId" | "unitPrice"> & { item: Pick<FishNetMarketItem, "itemId" | "instanceId"> }): string {
  return listing.listingId ?? `${listing.sellerAccountId ?? ""}|${listing.item.instanceId ?? listing.item.itemId ?? ""}|${listing.unitPrice}`;
}
export function queryFishNetMarketListings(listings: readonly FishNetMarketListingView[], query: FishNetMarketQuery = {}): FishNetMarketListingView[] {
  const needle = query.text?.trim().toLocaleLowerCase() ?? ""; const filters = normalizeStatFilters(query.stats ?? []); const mode = query.statMode ?? "all";
  if (mode !== "all" && mode !== "any") throw new Error(`unknown market stat mode ${JSON.stringify(mode)}`);
  const result = listings.filter((listing) => { if (query.itemType !== undefined && listing.item.itemType !== query.itemType) return false;
    if (query.minPrice !== undefined && listing.unitPrice < query.minPrice) return false; if (query.maxPrice !== undefined && listing.unitPrice > query.maxPrice) return false;
    if (filters.length) { const matches = filters.map((filter) => listing.stats?.some((stat) => stat.type === filter.type
      && (filter.minValue === undefined || (stat.value !== undefined && stat.value >= filter.minValue))
      && (filter.maxValue === undefined || (stat.value !== undefined && stat.value <= filter.maxValue))) ?? false);
      if (mode === "all" ? !matches.every(Boolean) : !matches.some(Boolean)) return false; }
    return !needle || [listing.displayName, listing.itemDisplayName, listing.item.itemId, listing.sellerDisplayName, listing.shopName, listing.mapId]
      .some((value) => value?.toLocaleLowerCase().includes(needle)); });
  const direction = query.sort === "price-desc" ? -1 : 1;
  result.sort((a, b) => a.unitPrice === b.unitPrice ? (a.listingId ?? "").localeCompare(b.listingId ?? "") : a.unitPrice < b.unitPrice ? -direction : direction);
  const offset = query.offset === undefined ? 0 : Math.max(0, Math.trunc(query.offset)); const limit = query.limit === undefined ? result.length : Math.max(0, Math.trunc(query.limit));
  return result.slice(offset, offset + limit);
}
export function resolveFishNetMarketListingDisplayName(listing: Pick<FishNetMarketListing, "itemDisplayName" | "item">, itemDirectory: FishNetItemDirectory = DEFAULT_ITEM_DIRECTORY): string | null {
  const itemType = catalogItemType(listing.item.itemType); const direct = itemDirectory.resolve(itemType, listing.item.itemId); if (direct) return direct.displayName;
  const serializedId = itemType === 2 || itemType === 3 ? serializedItemId(listing.item.payloadJson) : undefined;
  const serialized = itemDirectory.resolve(itemType, serializedId); if (serialized) return serialized.displayName;
  return listing.itemDisplayName?.trim() || listing.item.itemId;
}
export function catalogItemType(wireType: number): number { return wireType > 0 ? wireType - 1 : wireType; }
function serializedItemId(json: string | null): string | undefined { if (json === null) return undefined; try { const value: unknown = JSON.parse(json); return isRecord(value) && typeof value["Id"] === "string" ? value["Id"] : undefined; } catch { return undefined; } }
export function parseFishNetMarketStats(json: string | null, itemType = 2, itemId?: string | null): FishNetMarketStat[] | undefined {
  if (json === null) return undefined; let value: unknown; try { value = JSON.parse(json); } catch { return undefined; }
  if (!isRecord(value) || !Array.isArray(value["Substats"])) return undefined; const parsed: Array<Omit<FishNetMarketStat, "value" | "percent">> = [];
  for (const candidate of value["Substats"]) { if (!isRecord(candidate) || !Number.isSafeInteger(candidate["Type"])
    || typeof candidate["Value"] !== "number" || !Number.isFinite(candidate["Value"])
    || (candidate["ValueStr"] !== null && typeof candidate["ValueStr"] !== "string")) return undefined;
    const type = candidate["Type"] as number; parsed.push({ type, name: fishNetMarketStatName(type), roll: candidate["Value"], valueStr: candidate["ValueStr"] }); }
  const baseItemId = typeof value["Id"] === "string" ? value["Id"] : itemId ?? undefined;
  const values = calculateFishNetMarketStatValues(itemType, parsed, baseItemId); return parsed.map((stat, index) => ({ ...stat, ...values[index]! }));
}
function normalizeStatFilters(filters: readonly FishNetMarketStatFilter[]): Array<{ type: number; minValue?: number; maxValue?: number }> {
  const result = new Map<number, { minValue?: number; maxValue?: number }>();
  for (const filter of filters) { const stat = resolveFishNetMarketStat(filter.stat); if (!stat) throw new Error(`unknown market stat ${JSON.stringify(filter.stat)}`);
    if (filter.minValue !== undefined && !Number.isFinite(filter.minValue)) throw new Error("market stat minimum must be finite");
    if (filter.maxValue !== undefined && !Number.isFinite(filter.maxValue)) throw new Error("market stat maximum must be finite");
    const old = result.get(stat.type) ?? {}; const minValue = filter.minValue === undefined ? old.minValue : old.minValue === undefined ? filter.minValue : Math.max(old.minValue, filter.minValue);
    const maxValue = filter.maxValue === undefined ? old.maxValue : old.maxValue === undefined ? filter.maxValue : Math.min(old.maxValue, filter.maxValue);
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) throw new Error("market stat minimum exceeds maximum"); result.set(stat.type, { minValue, maxValue }); }
  return [...result].map(([type, bounds]) => ({ type, ...bounds }));
}
