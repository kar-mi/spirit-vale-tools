import type { RPCSchema } from "electrobun";

export type RewardsAppMode = "live" | "replay";
export type RewardsAppView = "summary" | "recent";
export type RewardsAppStatus = "waiting" | "watching" | "ready" | "stopped" | "error";

export interface RewardsUiDrop { category: string; itemId: string; itemName: string; count: number; chance?: number }
export interface RewardsUiMob {
  id: string;
  displayName: string;
  level: number;
  boss: boolean;
  baseExperience: number;
  baseCoins: number;
  drops: RewardsUiDrop[];
}
export interface RewardsUiKill {
  id: string;
  tick: number;
  mobId: string;
  displayName: string;
  level: number;
  experience: number;
  jobExperience: number;
  coins: string;
  drops: RewardsUiDrop[];
}
export interface RewardsUiSummary {
  mobId: string;
  displayName: string;
  level: number;
  kills: number;
  experience: number;
  jobExperience: number;
  coins: string;
  drops: RewardsUiDrop[];
}

export interface RewardsAppState {
  mode: RewardsAppMode;
  view: RewardsAppView;
  status: RewardsAppStatus;
  statusDetail: string;
  pinned: boolean;
  query: string;
  catalog: RewardsUiMob[];
  catalogCount: number;
  replayFileName?: string;
  replayWarnings: number;
  kills: RewardsUiKill[];
  summaries: RewardsUiSummary[];
  totalExperience: number;
  totalJobExperience: number;
  totalCoins: string;
  unmatched: number;
  unidentified: number;
}

export type RewardsAppRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: RewardsAppState };
      setMode: { params: { mode: RewardsAppMode }; response: RewardsAppState };
      setView: { params: { view: RewardsAppView }; response: RewardsAppState };
      setQuery: { params: { query: string }; response: RewardsAppState };
      chooseReplay: { params: Record<string, never>; response: RewardsAppState };
      setPinned: { params: { pinned: boolean }; response: RewardsAppState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: RewardsAppState } }>;
};
