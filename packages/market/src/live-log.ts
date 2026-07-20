import {
  decimal,
  isRecord,
  JsonlTailReader,
  LiveLogSessionFollower,
  nullableString,
  parseLogRecord,
} from "@spiritvale/logging";
import type { LiveLogStatus } from "@spiritvale/logging";
import { parseMarketEventLogData } from "./event-log.ts";
import { FishNetMarketTracker, resolveFishNetMarketListingDisplayName } from "./market.ts";
import type { FishNetMarketListingView, FishNetMarketStat } from "./market.ts";

export type MarketLogStatus = LiveLogStatus;

export interface MarketLogBatch {
  listings: FishNetMarketListingView[];
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  changed: boolean;
  status: MarketLogStatus;
  observedAt?: string;
  path?: string;
  sessionId?: string;
}

/** Incrementally follows event records and legacy snapshots written by passive capture. */
export class MarketLogFollower {
  private readonly reader: JsonlTailReader;
  private listings: FishNetMarketListingView[] = [];
  private readonly tracker = new FishNetMarketTracker();
  private status: MarketLogStatus = "watching";
  private observedAt?: string;

  constructor(path: string) {
    this.reader = new JsonlTailReader(path);
  }

  async poll(): Promise<MarketLogBatch> {
    const { missing, reset, lines } = await this.reader.read();
    if (missing) return this.batch({ missing: true, reset: false, changed: false, invalidLines: 0 });
    if (reset) this.resetState();
    const consumed = this.consume(lines);
    return this.batch({ missing: false, reset, ...consumed });
  }

  private consume(lines: string[]): Pick<MarketLogBatch, "changed" | "invalidLines"> {
    let invalidLines = 0;
    let changed = false;
    for (const line of lines) {
      if (!line.trim()) continue;
      let candidate: unknown;
      try {
        candidate = JSON.parse(line);
      } catch {
        invalidLines += 1;
        continue;
      }
      const record = parseLogRecord(candidate);
      if (!record) {
        invalidLines += 1;
        continue;
      }
      if (record.type === "market.lifecycle") {
        const lifecycle = record.data["state"];
        if (lifecycle === "started") this.status = this.listings.length > 0 ? "ready" : "watching";
        else if (lifecycle === "stopped") this.status = "stopped";
        else {
          invalidLines += 1;
          continue;
        }
        changed = true;
        continue;
      }
      if (record.type === "market.error") {
        this.status = "error";
        changed = true;
        continue;
      }
      if (record.type === "market.event") {
        const event = parseMarketEventLogData(record.data);
        if (!event) {
          invalidLines += 1;
          continue;
        }
        this.tracker.apply(event);
        this.listings = this.tracker.query();
        this.status = "ready";
        this.observedAt = record.recordedAt;
        changed = true;
        continue;
      }
      if (record.type !== "market.snapshot") continue;
      const listings = parseListings(record.data["listings"]);
      if (!listings) {
        invalidLines += 1;
        continue;
      }
      this.listings = listings;
      this.status = "ready";
      this.observedAt = record.recordedAt;
      changed = true;
    }
    return { invalidLines, changed };
  }

  private resetState(): void {
    this.listings = [];
    this.tracker.reset();
    this.status = "watching";
    this.observedAt = undefined;
  }

  private batch(detail: Pick<MarketLogBatch, "missing" | "reset" | "changed" | "invalidLines">): MarketLogBatch {
    return {
      ...detail,
      listings: this.listings.slice(),
      status: detail.missing ? "waiting" : this.status,
      ...(this.observedAt ? { observedAt: this.observedAt } : {}),
    };
  }
}

/** Follows whichever market session is named by the shared current-stream pointer. */
export class MarketSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<MarketLogFollower, MarketLogBatch>;

  constructor(logDirectory?: string) {
    this.inner = new LiveLogSessionFollower({
      stream: "market",
      logDirectory,
      createFollower: (path) => new MarketLogFollower(path),
      mergeSessionChange: (batch, changedSession) => ({
        ...batch,
        reset: batch.reset || changedSession,
        changed: batch.changed || changedSession,
      }),
      noStreamBatch: (reset) => ({ listings: [], invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" }),
    });
  }

  poll(): Promise<MarketLogBatch> {
    return this.inner.poll();
  }
}

function parseListings(value: unknown): FishNetMarketListingView[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const listings: FishNetMarketListingView[] = [];
  for (const candidate of value) {
    const listing = parseListing(candidate);
    if (!listing) return undefined;
    listings.push(listing);
  }
  return listings;
}

function parseListing(value: unknown): FishNetMarketListingView | undefined {
  if (!isRecord(value)
    || !nullableString(value["id"])
    || !nullableString(value["sellerId"])
    || !nullableString(value["sellerName"])
    || !nullableString(value["itemId"])
    || !Number.isSafeInteger(value["itemType"])
    || !Number.isSafeInteger(value["count"])
    || !Number.isSafeInteger(value["countTraded"])
    || !decimal(value["price"])
    || !nullableString(value["json"])
    || !decimal(value["expiresAt"])
    || !nullableString(value["searchText"])
    || !nullableString(value["shopName"])
    || !nullableString(value["mapId"])) return undefined;
  const stats = value["stats"] === undefined ? undefined : parseStats(value["stats"]);
  if (value["stats"] !== undefined && !stats) return undefined;
  const listing = {
    id: value["id"],
    sellerId: value["sellerId"],
    sellerName: value["sellerName"],
    itemId: value["itemId"],
    itemType: value["itemType"] as number,
    count: value["count"] as number,
    countTraded: value["countTraded"] as number,
    price: BigInt(value["price"]),
    json: value["json"],
    expiresAt: BigInt(value["expiresAt"]),
    searchText: value["searchText"],
    shopName: value["shopName"],
    mapId: value["mapId"],
    ...(stats ? { stats } : {}),
  };
  return {
    ...listing,
    displayName: resolveFishNetMarketListingDisplayName(listing, value["searchText"]),
  };
}

function parseStats(value: unknown): FishNetMarketStat[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const stats: FishNetMarketStat[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)
      || !Number.isSafeInteger(candidate["type"])
      || typeof candidate["roll"] !== "number"
      || !Number.isFinite(candidate["roll"])
      || typeof candidate["percent"] !== "boolean"
      || !nullableString(candidate["valueStr"])
      || (candidate["name"] !== undefined && typeof candidate["name"] !== "string")
      || (candidate["value"] !== undefined
        && (typeof candidate["value"] !== "number" || !Number.isFinite(candidate["value"])))) return undefined;
    stats.push({
      type: candidate["type"] as number,
      roll: candidate["roll"],
      percent: candidate["percent"],
      valueStr: candidate["valueStr"],
      ...(candidate["name"] === undefined ? {} : { name: candidate["name"] as FishNetMarketStat["name"] }),
      ...(candidate["value"] === undefined ? {} : { value: candidate["value"] }),
    });
  }
  return stats;
}
