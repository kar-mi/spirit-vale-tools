import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";
import { applyRoundedCorners, makeProcessDpiAware } from "@spiritvale/ui-theme/win32";

import { createMarketWindow } from "../../../market-ui/src/bun/index.ts";
import { createRewardsWindow } from "../../../rewards-ui/src/bun/index.ts";
import type { LauncherRpc, LauncherState, ToolWindow } from "../launcher-types.ts";
import { CaptureCoordinator } from "./capture-coordinator.ts";
import { createDpsWindow } from "./index.ts";
import { resolveCaptureHelperPath, resolveLogDirectory } from "./paths.ts";
import { WindowSlot } from "./window-slot.ts";

makeProcessDpiAware();

const logDirectory = resolveLogDirectory();
let launcherWindow: BrowserWindow;
let launcherState: LauncherState = { captureStatus: "starting", statusDetail: "Starting centralized capture…" };
let shuttingDown = false;

const combatWindow = new WindowSlot((onClosed) => createDpsWindow({ logDirectory, onClosed }));
const rewardsWindow = new WindowSlot((onClosed) => createRewardsWindow({ logDirectory, onClosed }));
const marketWindow = new WindowSlot((onClosed) => createMarketWindow({ logDirectory, onClosed }));

const capture = new CaptureCoordinator({
  logDirectory,
  helperPath: resolveCaptureHelperPath(),
  onStatus: (state) => {
    launcherState = state;
    publish();
  },
});

const rpc = BrowserView.defineRPC<LauncherRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => launcherState,
      openTool: async ({ tool }) => {
        await openTool(tool);
        return launcherState;
      },
      windowAction: async ({ action }) => {
        if (action === "minimize") launcherWindow.minimize();
        else await shutdown();
      },
      getWindowFrame: () => launcherWindow.getFrame(),
      setWindowFrame: ({ x, y, width, height }) => launcherWindow.setFrame(x, y, width, height),
    },
    messages: {},
  },
});

launcherWindow = new BrowserWindow({
  title: "Spirit Vale",
  url: "views://launcherview/index.html",
  frame: { x: 80, y: 80, width: 520, height: 340 },
  titleBarStyle: "hidden",
  transparent: false,
  rpc,
});
applyRoundedCorners(launcherWindow.ptr);

Electrobun.events.on(`resize-${launcherWindow.id}`, (event: { data: { width: number; height: number } }) => {
  const width = Math.max(420, event.data.width);
  const height = Math.max(300, event.data.height);
  if (width !== event.data.width || height !== event.data.height) launcherWindow.setSize(width, height);
});
launcherWindow.on("close", () => void shutdown());

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
void capture.start();

async function openTool(tool: ToolWindow): Promise<void> {
  if (tool === "combat") await combatWindow.open();
  else if (tool === "rewards") await rewardsWindow.open();
  else await marketWindow.open();
}

function publish(): void {
  if (!launcherWindow) return;
  try { rpc.send.stateChanged(launcherState); } catch { /* The view may still be connecting. */ }
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  launcherWindow.hide();
  await Promise.all([combatWindow.close(), rewardsWindow.close(), marketWindow.close()]);
  await capture.stop();
  Utils.quit();
}
