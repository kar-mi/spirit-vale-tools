import { existsSync } from "node:fs";
import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";

import {
  FISHNET_MARKET_STAT_NAMES,
  MarketSessionLogFollower,
  queryFishNetMarketListings,
} from "@spiritvale/market";
import type { FishNetMarketListingView, FishNetMarketStatFilter } from "@spiritvale/market";
import type {
  MarketUiFilter,
  MarketUiListing,
  MarketUiRpc,
  MarketUiState,
  MarketUiStatus,
} from "../app-types.ts";
import { validateMarketUiFilters } from "../filter-model.ts";

const POLL_MS = 1_000;
const PAGE_SIZE = 50;
const follower = new MarketSessionLogFollower(resolveLogDirectory());

let window: BrowserWindow;
let status: MarketUiStatus = "waiting";
let statusDetail = "Start a passive market session to populate listings.";
let listings: FishNetMarketListingView[] = [];
let query = "";
let filters: MarketUiFilter[] = [];
let visibleLimit = PAGE_SIZE;
let polling = false;
let shuttingDown = false;

const rpc = BrowserView.defineRPC<MarketUiRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => appState(),
      setQuery: ({ query: nextQuery }) => {
        query = nextQuery.trim().slice(0, 200);
        visibleLimit = PAGE_SIZE;
        return appState();
      },
      setFilters: ({ filters: nextFilters }) => {
        filters = validateMarketUiFilters(nextFilters, FISHNET_MARKET_STAT_NAMES.length);
        visibleLimit = PAGE_SIZE;
        return appState();
      },
      loadMore: () => {
        visibleLimit += PAGE_SIZE;
        return appState();
      },
      windowAction: async ({ action }) => {
        if (action === "minimize") {
          window.minimize();
          return;
        }
        stopPolling();
        window.close();
      },
    },
    messages: {},
  },
});

window = new BrowserWindow({
  title: "Spirit Vale Market",
  url: "views://marketview/index.html",
  frame: { x: 100, y: 80, width: 760, height: 720 },
  titleBarStyle: "hidden",
  transparent: false,
  rpc,
});

Electrobun.events.on(`resize-${window.id}`, (event: { data: { width: number; height: number } }) => {
  const width = Math.max(520, event.data.width);
  const height = Math.max(480, event.data.height);
  if (width !== event.data.width || height !== event.data.height) window.setSize(width, height);
});

const pollTimer = setInterval(() => void pollMarket(), POLL_MS);
void pollMarket();
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function appState(): MarketUiState {
  const marketFilters: FishNetMarketStatFilter[] = filters.map((filter) => ({ ...filter }));
  const matches = queryFishNetMarketListings(listings, {
    text: query,
    stats: marketFilters,
    statMode: "all",
    sort: "price-asc",
  });
  return {
    status,
    statusDetail,
    query,
    filters: filters.map((filter) => ({ ...filter })),
    statOptions: FISHNET_MARKET_STAT_NAMES.map((name, type) => ({ type, name })),
    capturedCount: listings.length,
    matchCount: matches.length,
    visibleLimit,
    hasMore: matches.length > visibleLimit,
    listings: matches.slice(0, visibleLimit).map(listingView),
  };
}

function listingView(listing: FishNetMarketListingView, index: number): MarketUiListing {
  return {
    key: listing.id ?? `${listing.sellerId ?? "seller"}-${listing.itemId ?? "item"}-${listing.price}-${index}`,
    name: listing.searchText ?? listing.itemId ?? "Unknown item",
    ...(listing.itemId ? { itemId: listing.itemId } : {}),
    ...(listing.sellerName ? { seller: listing.sellerName } : {}),
    ...(listing.shopName ? { shopName: listing.shopName } : {}),
    ...(listing.mapId ? { mapId: listing.mapId } : {}),
    price: listing.price.toString(),
    available: Math.max(0, listing.count - listing.countTraded),
    stats: (listing.stats ?? []).map((stat) => ({
      type: stat.type,
      name: stat.name ?? `Stat ${stat.type}`,
      ...(stat.value === undefined ? {} : { value: stat.value }),
      roll: stat.roll,
      percent: stat.percent,
    })),
  };
}

async function pollMarket(): Promise<void> {
  if (polling || shuttingDown) return;
  polling = true;
  try {
    const batch = await follower.poll();
    if (batch.changed || batch.reset || batch.status !== status) {
      listings = batch.listings;
      status = batch.status;
      statusDetail = detailFor(batch.status, listings.length, batch.invalidLines);
      publish();
    }
  } catch {
    status = "error";
    statusDetail = "The current market session log could not be read.";
    publish();
  } finally {
    polling = false;
  }
}

function detailFor(nextStatus: MarketUiStatus, count: number, invalidLines: number): string {
  const skipped = invalidLines > 0 ? ` · ${invalidLines} malformed ${invalidLines === 1 ? "record" : "records"} skipped` : "";
  switch (nextStatus) {
    case "waiting": return "Start a passive market session to populate listings.";
    case "watching": return `Market session found. Open the in-game market to receive listings.${skipped}`;
    case "ready": return `${count.toLocaleString()} listings captured in the current session${skipped}`;
    case "stopped": return `Market session stopped; showing its last snapshot${skipped}`;
    case "error": return "The market session reported an error.";
  }
}

function publish(): void {
  if (!window) return;
  try {
    rpc.send.stateChanged(appState());
  } catch {
    // The webview may still be completing its RPC handshake.
  }
}

function shutdown(): void {
  stopPolling();
  Utils.quit();
}

function stopPolling(): void {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(pollTimer);
}

function resolveLogDirectory(): string {
  const override = process.env.SPIRIT_VALE_LOG_DIRECTORY?.trim();
  if (override) return path.resolve(override);
  let current = process.cwd();
  while (true) {
    if (existsSync(path.join(current, "bun.lock")) && existsSync(path.join(current, "packages"))) {
      return path.join(current, "logs");
    }
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(process.cwd(), "logs");
    current = parent;
  }
}
