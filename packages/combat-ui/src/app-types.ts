import type { RPCSchema } from "electrobun";

/** Typed renderer contracts for the combat UI windows. */

import type { FishNetDpsActorRow, FishNetDpsEncounterSnapshot } from "@spiritvale/combat";

export type DpsAppTab = "all" | "personal";
export type DpsAppStatus = "waiting" | "capturing" | "loading" | "ready" | "stopped" | "error";

export interface DpsEncounterOption {
  id: string;
  label: string;
}

export interface DpsAppState {
  tab: DpsAppTab;
  status: DpsAppStatus;
  statusDetail: string;
  storageWarning?: string;
  pinned: boolean;
  opacity: number;
  personalName: string;
  personalActorId?: number;
  snapshot?: FishNetDpsEncounterSnapshot;
}

export interface DpsSettingsState {
  opacity: number;
}

export type DpsAppRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: DpsAppState };
      openReplayPicker: { params: Record<string, never>; response: void };
      resetEncounter: { params: Record<string, never>; response: DpsAppState };
      setPersonalName: { params: { name: string }; response: DpsAppState };
      setPersonalActor: { params: { actorId: number | null }; response: DpsAppState };
      setPinned: { params: { pinned: boolean }; response: DpsAppState };
      openSettings: { params: Record<string, never>; response: void };
      setOpacity: { params: { opacity: number }; response: DpsAppState };
      setTab: { params: { tab: DpsAppTab }; response: DpsAppState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      stateChanged: DpsAppState;
    };
  }>;
};

export type DpsSettingsRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: DpsSettingsState };
      setOpacity: { params: { opacity: number }; response: DpsSettingsState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: DpsSettingsState } }>;
};

export interface CombatAnalysisState {
  status: "loading" | "ready" | "error";
  statusDetail: string;
  fileName?: string;
  invalidLines: number;
  encounters: DpsEncounterOption[];
  selectedEncounterId?: string;
  snapshot?: FishNetDpsEncounterSnapshot;
}

export interface CombatAnalysisDetailState {
  fileName: string;
  encounterLabel: string;
  encounterDurationMs: number;
  player: FishNetDpsActorRow;
}

export type CombatAnalysisRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: CombatAnalysisState };
      selectEncounter: { params: { id: string }; response: CombatAnalysisState };
      openPlayerDetails: { params: { actorId: number }; response: void };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: CombatAnalysisState } }>;
};

export type CombatAnalysisDetailRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: CombatAnalysisDetailState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: CombatAnalysisDetailState } }>;
};
