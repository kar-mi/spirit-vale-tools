import { FishNetProtocolError } from "@spiritvale/core";
import { checkedEnd, readUnsignedPackedWhole, requireBytes } from "@spiritvale/core/wire-reader";
import { fishNetMarketStatName, resolveFishNetMarketStat } from "./market-stats.ts";
import type { FishNetMarketStatName } from "./market-stats.ts";
import { calculateFishNetMarketStatValues } from "./market-stat-values.ts";
import type { DecodedFishNetPacket } from "@spiritvale/core";

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
  accountId: string | null;
  characterId: string | null;
  mapId: string | null;
  stallIndex: number;
  expiresAt: bigint;
  shopName: string | null;
  characterName: string | null;
  archetype: number;
  rotationY: number;
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

export function decodeFishNetMarketPacket(packet: DecodedFishNetPacket): FishNetMarketEvent[] {
  const reader = new MarketReader(packet.payload);
  let event: FishNetMarketEvent | undefined;
  switch (packet.rpcName) {
    case "RequestVendorItemList_T":
      event = { kind: "catalog", tick: packet.tick, items: reader.list(() => reader.catalogItem()) };
      break;
    case "RequestAHAccount_T":
      event = { kind: "account", tick: packet.tick, account: reader.reference(() => reader.account()) };
      break;
    case "LoadVendingStalls_T":
      event = { kind: "stalls", tick: packet.tick, stalls: reader.list(() => reader.stall()) };
      break;
    case "SpawnVendingStall_C":
      event = { kind: "stallUpsert", tick: packet.tick, stall: reader.reference(() => reader.stallBody()) };
      break;
    case "DespawnVendingStall_C":
      event = { kind: "stallRemove", tick: packet.tick, accountId: reader.string() };
      break;
    case "RequestVendingStallListings_T":
      event = { kind: "listings", tick: packet.tick, listings: reader.list(() => reader.listing()) };
      break;
    case "VendingCollectResult_T":
      event = { kind: "collectResult", tick: packet.tick, success: reader.boolean() };
      break;
    default:
      return [];
  }
  reader.finish(packet.rpcName);
  return [event];
}

export class FishNetMarketTracker {
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
      listings.push({ ...listing, searchText, shopName: stall?.shopName ?? null, mapId: stall?.mapId ?? null, stats });
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

  private apply(event: FishNetMarketEvent): FishNetMarketEvent {
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
    const key = listing.id ?? `${listing.sellerId ?? ""}\u0000${listing.itemId ?? ""}\u0000${listing.price}`;
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
    const { searchText, stats } = listing;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class MarketReader {
  private offset = 0;

  constructor(private readonly buffer: Buffer) {}

  finish(name: string | undefined): void {
    if (this.offset !== this.buffer.length) {
      throw new FishNetProtocolError(
        `${name ?? "market RPC"} left ${this.buffer.length - this.offset} undecoded bytes at byte ${this.offset}`,
      );
    }
  }

  boolean(): boolean {
    requireBytes(this.buffer, this.offset, 1, "market boolean");
    const value = this.buffer[this.offset] ?? 0;
    this.offset += 1;
    if (value !== 0 && value !== 1) throw new FishNetProtocolError(`invalid market boolean ${value}`);
    return value === 1;
  }

  int32(): number {
    const value = this.signedPacked();
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < -0x8000_0000 || number > 0x7fff_ffff) {
      throw new FishNetProtocolError("market int32 exceeds its wire range");
    }
    return number;
  }

  int64(): bigint {
    return this.signedPacked();
  }

  float32(): number {
    requireBytes(this.buffer, this.offset, 4, "market float32");
    const value = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  string(): string | null {
    const length = this.int32();
    if (length === -1) return null;
    if (length < -1) throw new FishNetProtocolError(`invalid market string length ${length}`);
    const end = checkedEnd(this.buffer, this.offset, length);
    const value = this.buffer.toString("utf8", this.offset, end);
    this.offset = end;
    return value;
  }

  reference<T>(read: () => T): T | null {
    return this.boolean() ? null : read();
  }

  list<T>(read: () => T): T[] | null {
    const count = this.int64();
    if (count === -1n) return null;
    if (count < -1n || count > 1_000_000n) throw new FishNetProtocolError(`invalid market list count ${count}`);
    return Array.from({ length: Number(count) }, read);
  }

  listing(): FishNetMarketListing | null {
    return this.reference(() => this.listingBody());
  }

  listingBody(): FishNetMarketListing {
    return {
      id: this.string(),
      sellerId: this.string(),
      sellerName: this.string(),
      itemId: this.string(),
      itemType: this.int32(),
      count: this.int32(),
      countTraded: this.int32(),
      price: this.int64(),
      json: this.string(),
      expiresAt: this.int64(),
    };
  }

  catalogItem(): FishNetMarketCatalogItem {
    return {
      sellerId: this.string(),
      searchText: this.string(),
      sellerName: this.string(),
      listing: this.listing(),
    };
  }

  account(): FishNetMarketAccount {
    return {
      balance: this.int64(),
      collectables: this.list(() => this.collectable()),
      saleHistory: this.list(() => this.sale()),
      ownListings: this.list(() => this.listing()),
    };
  }

  collectable(): FishNetMarketCollectable | null {
    return this.reference(() => ({
      id: this.string(),
      itemType: this.int32(),
      count: this.int32(),
      json: this.string(),
    }));
  }

  sale(): FishNetMarketSale | null {
    return this.reference(() => ({
      itemDisplayName: this.string(),
      itemName: this.string(),
      count: this.int32(),
      price: this.int64(),
      buyerName: this.string(),
      at: this.int64(),
    }));
  }

  stall(): FishNetMarketStall | null {
    return this.reference(() => this.stallBody());
  }

  stallBody(): FishNetMarketStall {
    const stall: FishNetMarketStall = {
      accountId: this.string(),
      characterId: this.string(),
      mapId: this.string(),
      stallIndex: this.int32(),
      expiresAt: this.int64(),
      shopName: this.string(),
      characterName: this.string(),
      archetype: this.int32(),
      rotationY: 0,
    };
    this.characterAppearance();
    this.equipAppearance();
    this.list(() => this.cosmeticSlot());
    this.list(() => this.equipSlot());
    stall.rotationY = this.float32();
    return stall;
  }

  private characterAppearance(): void {
    this.reference(() => {
      for (let index = 0; index < 10; index += 1) this.int32();
    });
  }

  private equipAppearance(): void {
    this.reference(() => this.array(() => this.boolean()));
  }

  private cosmeticSlot(): void {
    this.reference(() => {
      this.int32();
      this.string();
      this.int32();
      this.boolean();
    });
  }

  private equipSlot(): void {
    this.reference(() => {
      this.int32();
      this.equipData();
    });
  }

  private equipData(): void {
    this.reference(() => {
      this.list(() => this.statData());
      this.list(() => this.string());
      this.int32();
      this.int32();
      this.int32();
      this.string();
      this.int32();
      this.string();
      this.boolean();
    });
  }

  private statData(): void {
    this.reference(() => {
      this.int32();
      this.int32();
      this.string();
    });
  }

  private array<T>(read: () => T): T[] | null {
    return this.list(read);
  }

  private signedPacked(): bigint {
    const decoded = readUnsignedPackedWhole(this.buffer, this.offset);
    this.offset = decoded.nextOffset;
    return (decoded.value >> 1n) ^ -(decoded.value & 1n);
  }
}
