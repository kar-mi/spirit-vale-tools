import type { RPCSchema } from "electrobun";
import type { FishNetDpsEncounterSnapshot } from "@spiritvale/combat";
import type { CharacterWeight } from "@spiritvale/character";
import type { WindowChromeRequests } from "@spiritvale/ui-theme/window-rpc";

export const OVERLAY_ELEMENT_IDS = ["dpsChart", "personalDps", "partyRanking", "weight"] as const;
export type OverlayElementId = (typeof OVERLAY_ELEMENT_IDS)[number];

export interface OverlayElementSettings {
  enabled: boolean;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OverlayStatus = "waiting" | "capturing" | "ready" | "error";

export interface OverlayState {
  locked: boolean;
  personalName: string;
  status: OverlayStatus;
  statusDetail: string;
  elements: Record<OverlayElementId, OverlayElementSettings>;
  snapshot?: FishNetDpsEncounterSnapshot;
  weight?: CharacterWeight;
}

type OverlaySharedRequests = {
  getState: { params: Record<string, never>; response: OverlayState };
  setLocked: { params: { locked: boolean }; response: OverlayState };
};

export type OverlayRpc = {
  bun: RPCSchema<{
    requests: OverlaySharedRequests & {
      setElementPosition: {
        params: { id: OverlayElementId; x: number; y: number };
        response: OverlayState;
      };
      setElementBounds: {
        params: { id: OverlayElementId; x: number; y: number; width: number; height: number };
        response: OverlayState;
      };
      setElementOpacity: {
        params: { id: OverlayElementId; opacity: number };
        response: OverlayState;
      };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: OverlayState } }>;
};

export type OverlaySettingsRpc = {
  bun: RPCSchema<{
    requests: OverlaySharedRequests & WindowChromeRequests & {
      setElementEnabled: {
        params: { id: OverlayElementId; enabled: boolean };
        response: OverlayState;
      };
      closeOverlay: { params: Record<string, never>; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: OverlayState } }>;
};
