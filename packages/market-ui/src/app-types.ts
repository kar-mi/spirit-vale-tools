import type { RPCSchema } from "electrobun";

export type MarketUiStatus = "waiting" | "watching" | "ready" | "stopped" | "error";

export interface MarketUiFilter {
  stat: number;
  minValue?: number;
  maxValue?: number;
}

export interface MarketUiStat {
  type: number;
  name: string;
  value?: number;
  roll: number;
  percent: boolean;
}

export interface MarketUiListing {
  key: string;
  name: string;
  itemId?: string;
  seller?: string;
  shopName?: string;
  mapId?: string;
  price: string;
  available: number;
  stats: MarketUiStat[];
}

export interface MarketUiState {
  status: MarketUiStatus;
  statusDetail: string;
  query: string;
  filters: MarketUiFilter[];
  statOptions: Array<{ type: number; name: string }>;
  capturedCount: number;
  matchCount: number;
  visibleLimit: number;
  hasMore: boolean;
  listings: MarketUiListing[];
}

export type MarketUiRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: MarketUiState };
      setQuery: { params: { query: string }; response: MarketUiState };
      setFilters: { params: { filters: MarketUiFilter[] }; response: MarketUiState };
      loadMore: { params: Record<string, never>; response: MarketUiState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      stateChanged: MarketUiState;
    };
  }>;
};
