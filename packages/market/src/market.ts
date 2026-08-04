import { FishNetProtocolError } from "@kar-mi/spirit-vale-tools-capture";
import { isRecord } from "@kar-mi/spirit-vale-tools-logging";
import { fishNetMarketStatName, resolveFishNetMarketStat } from "./market-stats.ts";
import type { FishNetMarketStatName } from "./market-stats.ts";
import { calculateFishNetMarketStatValues } from "./market-stat-values.ts";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetItemDirectory } from "@kar-mi/spirit-vale-tools-items";

const DEFAULT_ITEM_DIRECTORY = new FishNetItemDirectory();

export interface FishNetMarketListing {
  id: string | null;
  sellerId: string | null;
  sellerName: string | null;
  itemId: string | null;
  itemType: number;
  count: number;
  countTraded: number;
  price: bigint;
  json: string | null;
  expiresAt: bigint;
}

export interface FishNetMarketCatalogItem {
  sellerId: string | null;
  searchText: string | null;
  sellerName: string | null;
  listing: FishNetMarketListing | null;
}

export interface FishNetMarketCollectable {
  id: string | null;
  itemType: number;
  count: number;
  json: string | null;
}

export interface FishNetMarketSale {
  itemDisplayName: string | null;
  itemName: string | null;
  count: number;
  price: bigint;
  buyerName: string | null;
  at: bigint;
}

export interface FishNetMarketAccount {
  balance: bigint;
  collectables: Array<FishNetMarketCollectable | null> | null;
  saleHistory: Array<FishNetMarketSale | null> | null;
  ownListings: Array<FishNetMarketListing | null> | null;
}

export interface FishNetMarketStall {
  stallId: string | null;
  accountId: string | null;
  characterId: string | null;
  mapId: string | null;
  slotId: string | null;
  expiresAt: bigint;
  hiredAt: bigint;
  shopName: string | null;
  characterName: string | null;
  archetype: number;
  status: number;
  version: bigint;
  visualSnapshotJson: string | null;
}

export type FishNetMarketEvent =
  | { kind: "catalog"; tick: number; items: FishNetMarketCatalogItem[] | null }
  | {
    kind: "account";
    tick: number;
    account: FishNetMarketAccount | null;
    balanceDelta?: bigint;
    collectedAmount?: bigint;
  }
  | { kind: "stalls"; tick: number; stalls: Array<FishNetMarketStall | null> | null }
  | { kind: "stallUpsert"; tick: number; stall: FishNetMarketStall | null }
  | { kind: "stallRemove"; tick: number; accountId: string | null }
  | { kind: "listings"; tick: number; listings: Array<FishNetMarketListing | null> | null }
  | { kind: "collectResult"; tick: number; success: boolean };

export interface FishNetMarketListingView extends FishNetMarketListing {
  displayName: string | null;
  searchText: string | null;
  shopName: string | null;
  mapId: string | null;
  stats?: FishNetMarketStat[];
}

export interface FishNetMarketStat {
  type: number;
  name?: FishNetMarketStatName;
  /** Converted in-game value. Undefined only when the equipment slot cannot be inferred safely. */
  value?: number;
  /** Encoded 0-100 substat roll carried by the market payload. */
  roll: number;
  percent: boolean;
  valueStr: string | null;
}

export interface FishNetMarketStatFilter {
  stat: string | number;
  minValue?: number;
  maxValue?: number;
}

export interface FishNetMarketQuery {
  text?: string;
  itemType?: number;
  minPrice?: bigint;
  maxPrice?: bigint;
  stats?: readonly FishNetMarketStatFilter[];
  statMode?: "all" | "any";
  sort?: "price-asc" | "price-desc";
  offset?: number;
  limit?: number;
}

export interface FishNetMarketSnapshot {
  catalog: FishNetMarketCatalogItem[];
  stalls: FishNetMarketStall[];
  account?: FishNetMarketAccount;
  lastBalanceDelta?: bigint;
  lastCollectedAmount?: bigint;
}

export interface FishNetMarketTrackerOptions {
  itemDirectory?: FishNetItemDirectory;
}

export function decodeFishNetMarketPacket(packet: DecodedFishNetPacket): FishNetMarketEvent[] {
  switch (packet.rpcName) {
    case "RequestVendorItemList_T": {
      const listings = parseJsonArray(decodedString(packet, "listingsJson"), parseListingDto);
      return [{ kind: "catalog", tick: packet.tick, items: listings.map((listing) => ({
        sellerId: listing.sellerId,
        searchText: listing.searchText,
        sellerName: listing.sellerName,
        listing,
      })) }];
    }
    case "RequestVendingOverview_T":
      return [{ kind: "account", tick: packet.tick, account: parseOverview(decodedJson(packet, "responseJson")) }];
    case "LoadVendingStalls_T":
      return [{ kind: "stalls", tick: packet.tick, stalls: parseJsonArray(decodedString(packet, "stallsJson"), parseStallDto) }];
    case "SpawnVendingStall_C":
    case "SpawnVendingStall_T":
      return [{ kind: "stallUpsert", tick: packet.tick, stall: parseStallDto(decodedJson(packet, "dataJson")) }];
    case "DespawnVendingStall_C":
    case "DespawnVendingStall_T":
      return [{ kind: "stallRemove", tick: packet.tick, accountId: decodedString(packet, "accountId") }];
    case "RequestVendingStallListings_T":
      return [{ kind: "listings", tick: packet.tick, listings: parseJsonArray(decodedString(packet, "listingsJson"), parseListingDto) }];
    default:
      return [];
  }
}
function decodedString(packet: DecodedFishNetPacket, name: string): string {
  const value = packet.decodedFields?.find((field) => field.name === name)?.value;
  if (typeof value !== "string") throw new FishNetProtocolError(`${packet.rpcName ?? "market RPC"} has no decoded ${name}`);
  return value;
}

function decodedJson(packet: DecodedFishNetPacket, name: string): unknown {
  try { return JSON.parse(decodedString(packet, name)) as unknown; }
  catch { throw new FishNetProtocolError(`${packet.rpcName ?? "market RPC"} contains invalid JSON`); }
}

function parseJsonArray<T>(json: string, parse: (value: unknown) => T): T[] {
  let value: unknown;
  try { value = JSON.parse(json) as unknown; }
  catch { throw new FishNetProtocolError("market RPC contains invalid JSON"); }
  if (!Array.isArray(value)) throw new FishNetProtocolError("market JSON root is not an array");
  return value.map(parse);
}

function parseListingDto(value: unknown): FishNetMarketListing & { searchText: string | null } {
  if (!isRecord(value) || !isRecord(value["Item"])) throw new FishNetProtocolError("invalid vending listing JSON");
  const item = value["Item"];
  return {
    id: nullableJsonString(value["ListingId"]),
    sellerId: nullableJsonString(value["SellerAccountId"]),
    sellerName: nullableJsonString(value["SellerDisplayName"]),
    itemId: nullableJsonString(item["ItemId"]),
    itemType: jsonInteger(item["Type"], "listing item type"),
    count: jsonInteger(value["AvailableQuantity"], "available quantity"),
    countTraded: jsonInteger(value["SoldQuantity"], "sold quantity"),
    price: jsonBigInt(value["UnitPrice"], "unit price"),
    json: nullableJsonString(item["PayloadJson"]),
    expiresAt: jsonTimestamp(value["ExpiresAt"], "listing expiry"),
    searchText: nullableJsonString(value["ItemDisplayName"]),
  };
}

function parseOverview(value: unknown): FishNetMarketAccount {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending overview JSON");
  return {
    balance: jsonBigInt(value["PendingCoins"], "pending coins"),
    collectables: jsonArray(value["MailboxItems"], parseMailboxDto),
    saleHistory: jsonArray(value["Transactions"], parseTransactionDto),
    ownListings: jsonArray(value["OwnListings"], parseListingDto),
  };
}

function parseMailboxDto(value: unknown): FishNetMarketCollectable {
  if (!isRecord(value) || !isRecord(value["Item"])) throw new FishNetProtocolError("invalid vending mailbox JSON");
  const item = value["Item"];
  return { id: nullableJsonString(value["EntryId"]), itemType: jsonInteger(item["Type"], "mailbox item type"), count: jsonInteger(item["Quantity"], "mailbox quantity"), json: nullableJsonString(item["PayloadJson"]) };
}

function parseTransactionDto(value: unknown): FishNetMarketSale {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending transaction JSON");
  const itemDisplayName = nullableJsonString(value["ItemDisplayName"]);
  return { itemDisplayName, itemName: itemDisplayName, count: jsonInteger(value["Quantity"], "transaction quantity"), price: jsonBigInt(value["SellerProceeds"], "seller proceeds"), buyerName: nullableJsonString(value["BuyerDisplayName"]), at: jsonTimestamp(value["CompletedAt"], "transaction time") };
}

function parseStallDto(value: unknown): FishNetMarketStall {
  if (!isRecord(value)) throw new FishNetProtocolError("invalid vending stall JSON");
  const visualSnapshotJson = nullableJsonString(value["VisualSnapshotJson"]);
  let archetype = 0;
  if (visualSnapshotJson !== null) {
    try { const visual: unknown = JSON.parse(visualSnapshotJson); if (isRecord(visual) && Number.isSafeInteger(visual["Archetype"])) archetype = visual["Archetype"] as number; } catch { /* Snapshot is retained even when its optional display metadata is malformed. */ }
  }
  return {
    stallId: nullableJsonString(value["StallId"]), accountId: nullableJsonString(value["AccountId"]),
    characterId: nullableJsonString(value["CharacterId"]), mapId: nullableJsonString(value["MapId"]),
    slotId: nullableJsonString(value["SlotId"]), expiresAt: jsonTimestamp(value["ExpiresAt"], "stall expiry"),
    hiredAt: jsonTimestamp(value["HiredAt"], "stall hire time"), shopName: nullableJsonString(value["ShopName"]),
    characterName: nullableJsonString(value["CharacterDisplayName"]), archetype,
    status: jsonInteger(value["Status"], "stall status"), version: jsonBigInt(value["Version"], "stall version"),
    visualSnapshotJson,
  };
}

function jsonArray<T>(value: unknown, parse: (entry: unknown) => T): T[] | null {
  if (value === null) return null;
  if (!Array.isArray(value)) throw new FishNetProtocolError("invalid vending JSON array");
  return value.map(parse);
}

function nullableJsonString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new FishNetProtocolError("invalid vending JSON string");
  return value;
}

function jsonInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value)) throw new FishNetProtocolError(`invalid ${label}`);
  return value as number;
}

function jsonBigInt(value: unknown, label: string): bigint {
  if ((typeof value !== "number" || !Number.isSafeInteger(value)) && (typeof value !== "string" || !/^-?\d+$/.test(value))) throw new FishNetProtocolError(`invalid ${label}`);
  return BigInt(value);
}

function jsonTimestamp(value: unknown, label: string): bigint {
  if (typeof value !== "string") throw new FishNetProtocolError(`invalid ${label}`);
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) throw new FishNetProtocolError(`invalid ${label}`);
  return BigInt(Math.trunc(milliseconds / 1000));
}

export class FishNetMarketTracker {
  private readonly itemDirectory: FishNetItemDirectory;
  private catalog: FishNetMarketCatalogItem[] = [];
  private readonly listings = new Map<string, {
    listing: FishNetMarketListing;
    searchText: string | null;
    stats?: FishNetMarketStat[];
  }>();
  private readonly stalls = new Map<string, FishNetMarketStall>();
  private account?: FishNetMarketAccount;
  private lastBalanceDelta?: bigint;
  private lastCollectedAmount?: bigint;
  private awaitingCollectAccount = false;

  constructor(options: FishNetMarketTrackerOptions = {}) {
    this.itemDirectory = options.itemDirectory ?? DEFAULT_ITEM_DIRECTORY;
  }

  consume(packet: DecodedFishNetPacket): FishNetMarketEvent[] {
    const events = decodeFishNetMarketPacket(packet);
    return events.map((event) => this.apply(event));
  }

  snapshot(): FishNetMarketSnapshot {
    return {
      catalog: this.catalog.slice(),
      stalls: [...this.stalls.values()],
      account: this.account,
      lastBalanceDelta: this.lastBalanceDelta,
      lastCollectedAmount: this.lastCollectedAmount,
    };
  }

  query(query: FishNetMarketQuery = {}): FishNetMarketListingView[] {
    const listings: FishNetMarketListingView[] = [];
    for (const { listing, searchText, stats } of this.listings.values()) {
      const stall = listing.sellerId === null ? undefined : this.stalls.get(listing.sellerId);
      listings.push({
        ...listing,
        displayName: resolveFishNetMarketListingDisplayName(listing, searchText, this.itemDirectory),
        searchText,
        shopName: stall?.shopName ?? null,
        mapId: stall?.mapId ?? null,
        stats,
      });
    }
    return queryFishNetMarketListings(listings, query);
  }

  reset(): void {
    this.catalog = [];
    this.listings.clear();
    this.stalls.clear();
    this.account = undefined;
    this.lastBalanceDelta = undefined;
    this.lastCollectedAmount = undefined;
    this.awaitingCollectAccount = false;
  }

  /** Applies an event restored from an event-sourced market log. */
  apply(event: FishNetMarketEvent): FishNetMarketEvent {
    switch (event.kind) {
      case "catalog":
        this.catalog = event.items?.slice() ?? [];
        this.listings.clear();
        for (const item of this.catalog) this.upsert(item.listing, item.searchText);
        if (this.account?.ownListings) for (const listing of this.account.ownListings) this.upsert(listing, null);
        return event;
      case "account": {
        const previous = this.account?.balance;
        this.account = event.account ?? undefined;
        if (previous !== undefined && event.account) {
          this.lastBalanceDelta = event.account.balance - previous;
          const collectedAmount = this.awaitingCollectAccount && this.lastBalanceDelta < 0n
            ? -this.lastBalanceDelta
            : undefined;
          if (collectedAmount !== undefined) this.lastCollectedAmount = collectedAmount;
          event = { ...event, balanceDelta: this.lastBalanceDelta, collectedAmount };
        }
        this.awaitingCollectAccount = false;
        if (event.account?.ownListings) for (const listing of event.account.ownListings) this.upsert(listing, null);
        return event;
      }
      case "stalls":
        this.stalls.clear();
        for (const stall of event.stalls ?? []) if (stall) this.upsertStall(stall);
        return event;
      case "stallUpsert":
        if (event.stall) this.upsertStall(event.stall);
        return event;
      case "stallRemove":
        if (event.accountId !== null) this.stalls.delete(event.accountId);
        return event;
      case "listings":
        for (const listing of event.listings ?? []) this.upsert(listing, null);
        return event;
      case "collectResult":
        this.awaitingCollectAccount = event.success;
        return event;
    }
  }

  private upsert(listing: FishNetMarketListing | null, searchText: string | null): void {
    if (!listing) return;
    const key = marketListingKey(listing);
    const previous = this.listings.get(key);
    this.listings.set(key, {
      listing,
      searchText: searchText ?? previous?.searchText ?? null,
      stats: parseFishNetMarketStats(listing.json, listing.itemType),
    });
  }

  private upsertStall(stall: FishNetMarketStall): void {
    if (stall.accountId !== null) this.stalls.set(stall.accountId, stall);
  }
}

/** Stable identity shared by the in-memory tracker and SQLite read model. */
export function marketListingKey(listing: Pick<FishNetMarketListing, "id" | "sellerId" | "itemId" | "price">): string {
  return listing.id ?? `${listing.sellerId ?? ""}|${listing.itemId ?? ""}|${listing.price}`;
}

export function queryFishNetMarketListings(
  listings: readonly FishNetMarketListingView[],
  query: FishNetMarketQuery = {},
): FishNetMarketListingView[] {
  const needle = query.text?.trim().toLocaleLowerCase() ?? "";
  const statFilters = normalizeStatFilters(query.stats ?? []);
  const statMode = query.statMode ?? "all";
  if (statMode !== "all" && statMode !== "any") throw new Error(`unknown market stat mode ${JSON.stringify(statMode)}`);
  const result: FishNetMarketListingView[] = [];
  for (const listing of listings) {
    const { displayName, searchText, stats } = listing;
    if (query.itemType !== undefined && listing.itemType !== query.itemType) continue;
    if (query.minPrice !== undefined && listing.price < query.minPrice) continue;
    if (query.maxPrice !== undefined && listing.price > query.maxPrice) continue;
    if (statFilters.length > 0) {
      const matches = statFilters.map((filter) => stats?.some((stat) => {
        if (stat.type !== filter.type) return false;
        if (filter.minValue === undefined && filter.maxValue === undefined) return true;
        return stat.value !== undefined
          && (filter.minValue === undefined || stat.value >= filter.minValue)
          && (filter.maxValue === undefined || stat.value <= filter.maxValue);
      }) ?? false);
      if (statMode === "all" ? !matches.every(Boolean) : !matches.some(Boolean)) continue;
    }
    if (needle && ![
      displayName,
      searchText,
      listing.itemId,
      listing.sellerName,
      listing.shopName,
      listing.mapId,
    ].some((value) => value?.toLocaleLowerCase().includes(needle))) continue;
    result.push(listing);
  }
  const direction = query.sort === "price-desc" ? -1 : 1;
  result.sort((left, right) => {
    if (left.price !== right.price) return left.price < right.price ? -direction : direction;
    return (left.id ?? "").localeCompare(right.id ?? "");
  });
  const offset = query.offset === undefined ? 0 : Math.max(0, Math.trunc(query.offset));
  const limit = query.limit === undefined ? result.length : Math.max(0, Math.trunc(query.limit));
  return result.slice(offset, offset + limit);
}

export function resolveFishNetMarketListingDisplayName(
  listing: Pick<FishNetMarketListing, "itemId" | "itemType" | "json">,
  searchText: string | null,
  itemDirectory: FishNetItemDirectory = DEFAULT_ITEM_DIRECTORY,
): string | null {
  const direct = itemDirectory.resolve(listing.itemType, listing.itemId);
  if (direct) return direct.displayName;
  const serializedId = listing.itemType === 2 || listing.itemType === 3
    ? serializedItemId(listing.json)
    : undefined;
  const serialized = itemDirectory.resolve(listing.itemType, serializedId);
  if (serialized) return serialized.displayName;
  const liveName = searchText?.trim();
  if (liveName) return liveName;
  return listing.itemId;
}

function serializedItemId(json: string | null): string | undefined {
  if (json === null) return undefined;
  try {
    const value: unknown = JSON.parse(json);
    return isRecord(value) && typeof value["Id"] === "string" ? value["Id"] : undefined;
  } catch {
    return undefined;
  }
}

export function parseFishNetMarketStats(json: string | null, itemType = 2): FishNetMarketStat[] | undefined {
  if (json === null) return undefined;
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return undefined;
  }
  if (!isRecord(value) || !Array.isArray(value["Substats"])) return undefined;
  const parsed: Array<Omit<FishNetMarketStat, "value" | "percent">> = [];
  for (const candidate of value["Substats"]) {
    if (!isRecord(candidate)
      || !Number.isSafeInteger(candidate["Type"])
      || typeof candidate["Value"] !== "number"
      || !Number.isFinite(candidate["Value"])
      || (candidate["ValueStr"] !== null && typeof candidate["ValueStr"] !== "string")) return undefined;
    const type = candidate["Type"] as number;
    parsed.push({
      type,
      name: fishNetMarketStatName(type),
      roll: candidate["Value"],
      valueStr: candidate["ValueStr"],
    });
  }
  const baseItemId = typeof value["Id"] === "string" ? value["Id"] : undefined;
  const values = calculateFishNetMarketStatValues(itemType, parsed, baseItemId);
  return parsed.map((stat, index) => ({ ...stat, ...values[index]! }));
}

function normalizeStatFilters(
  filters: readonly FishNetMarketStatFilter[],
): Array<{ type: number; minValue?: number; maxValue?: number }> {
  const byType = new Map<number, { minValue?: number; maxValue?: number }>();
  for (const filter of filters) {
    const resolved = resolveFishNetMarketStat(filter.stat);
    if (!resolved) throw new Error(`unknown market stat ${JSON.stringify(filter.stat)}`);
    if (filter.minValue !== undefined && !Number.isFinite(filter.minValue)) {
      throw new Error(`market stat minimum must be finite for ${JSON.stringify(filter.stat)}`);
    }
    if (filter.maxValue !== undefined && !Number.isFinite(filter.maxValue)) {
      throw new Error(`market stat maximum must be finite for ${JSON.stringify(filter.stat)}`);
    }
    const previous = byType.get(resolved.type) ?? {};
    const minValue = filter.minValue === undefined
      ? previous.minValue
      : previous.minValue === undefined ? filter.minValue : Math.max(previous.minValue, filter.minValue);
    const maxValue = filter.maxValue === undefined
      ? previous.maxValue
      : previous.maxValue === undefined ? filter.maxValue : Math.min(previous.maxValue, filter.maxValue);
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      throw new Error(`market stat minimum exceeds maximum for ${JSON.stringify(filter.stat)}`);
    }
    byType.set(resolved.type, { minValue, maxValue });
  }
  return [...byType].map(([type, bounds]) => ({ type, ...bounds }));
}
