import type { RPCSchema } from "electrobun";

import type { FishNetDpsEncounterSnapshot } from "@spiritvale/combat";

export type DpsAppMode = "live" | "replay";
export type DpsAppTab = "all" | "personal";
export type DpsAppStatus = "waiting" | "capturing" | "loading" | "ready" | "stopped" | "error";

export interface DpsEncounterOption {
  id: string;
  label: string;
}

export interface DpsAppState {
  mode: DpsAppMode;
  tab: DpsAppTab;
  status: DpsAppStatus;
  statusDetail: string;
  storageWarning?: string;
  pinned: boolean;
  opacity: number;
  personalName: string;
  personalActorId?: number;
  replayFileName?: string;
  replayWarnings: number;
  encounters: DpsEncounterOption[];
  selectedEncounterId?: string;
  snapshot?: FishNetDpsEncounterSnapshot;
}

export type DpsAppRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: DpsAppState };
      setMode: { params: { mode: DpsAppMode }; response: DpsAppState };
      openReplayPicker: { params: Record<string, never>; response: void };
      selectEncounter: { params: { id: string }; response: DpsAppState };
      resetEncounter: { params: Record<string, never>; response: DpsAppState };
      setPersonalName: { params: { name: string }; response: DpsAppState };
      setPersonalActor: { params: { actorId: number | null }; response: DpsAppState };
      setPinned: { params: { pinned: boolean }; response: DpsAppState };
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
