import type { RPCSchema } from "electrobun";
import type { CharacterViewState } from "@spiritvale/character";

export type CharacterRpc = {
  bun: RPCSchema<{
    requests: {
      getState: { params: Record<string, never>; response: CharacterViewState };
      windowAction: { params: { action: "minimize" | "close" }; response: void };
      getWindowFrame: { params: Record<string, never>; response: { x: number; y: number; width: number; height: number } };
      setWindowFrame: { params: { x: number; y: number; width: number; height: number }; response: void };
    };
  }>;
  webview: RPCSchema<{ messages: { stateChanged: CharacterViewState } }>;
};
