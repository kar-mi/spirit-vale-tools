import type { RPCSchema } from "electrobun";

export type CaptureStatus = "starting" | "capturing" | "unavailable" | "stopped";
export type ToolWindow = "combat" | "rewards" | "market";

export interface LauncherState {
  captureStatus: CaptureStatus;
  statusDetail: string;
}

export type LauncherRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: LauncherState };
      openTool: { params: { tool: ToolWindow }; response: LauncherState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: LauncherState } }>;
};
