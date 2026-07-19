import type { RPCSchema } from "electrobun";

export type CaptureStatus = "starting" | "capturing" | "unavailable" | "stopped";
export type ToolWindow = "combat" | "rewards" | "market" | "character";
export type NpcapAvailability = "checking" | "ready" | "missing" | "admin-only" | "error";

export interface CaptureAdapterOption {
  id: string;
  label: string;
}

export interface LauncherState {
  captureStatus: CaptureStatus;
  statusDetail: string;
  npcapAvailability: NpcapAvailability;
  npcapDetail: string;
  npcapVersion?: string;
  selectedAdapter: "auto" | string;
  effectiveAdapter?: string;
  adapterFallback: boolean;
  adapters: CaptureAdapterOption[];
}

export type LauncherRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: LauncherState };
      openTool: { params: { tool: ToolWindow }; response: LauncherState };
      openSettings: { params: Record<string, never>; response: void };
      setCaptureAdapter: { params: { deviceName: string | null }; response: LauncherState };
      refreshCaptureDevices: { params: Record<string, never>; response: LauncherState };
      openNpcapDownload: { params: Record<string, never>; response: void };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: LauncherState } }>;
};

export type LauncherSettingsRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: LauncherState };
      setCaptureAdapter: { params: { deviceName: string | null }; response: LauncherState };
      refreshCaptureDevices: { params: Record<string, never>; response: LauncherState };
      openNpcapDownload: { params: Record<string, never>; response: void };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: LauncherState } }>;
};
