import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";
import { applyRoundedCorners, makeProcessDpiAware } from "@spiritvale/ui-theme/win32";
import { getNpcapStatus, listNpcapDevices, resolveCaptureDevice } from "@spiritvale/core";

import { createMarketWindow } from "../../../market-ui/src/bun/index.ts";
import { createRewardsWindow } from "../../../rewards-ui/src/bun/index.ts";
import type { LauncherRpc, LauncherState, ToolWindow } from "../launcher-types.ts";
import { loadLauncherSettings, saveLauncherSettings } from "../launcher-settings.ts";
import { loadCharacterSnapshot, saveCharacterSnapshot } from "../character-storage.ts";
import { CaptureCoordinator } from "./capture-coordinator.ts";
import { createCharacterWindow } from "./character-window.ts";
import { createDpsWindow } from "./index.ts";
import { resolveLogDirectory } from "./paths.ts";
import { WindowSlot } from "./window-slot.ts";
import { resolveDesktopStoragePaths } from "./portable-paths.ts";

makeProcessDpiAware();

const storagePaths = resolveDesktopStoragePaths({
  portableRoot: process.env.SPIRIT_VALE_PORTABLE_ROOT,
  fallbackUserData: Utils.paths.userData,
  fallbackLogDirectory: resolveLogDirectory(),
});
const logDirectory = storagePaths.logDirectory;
const settings = await loadLauncherSettings(storagePaths.launcherSettingsPath);
let launcherWindow: BrowserWindow;
let launcherState: LauncherState = {
  captureStatus: "starting",
  statusDetail: "Checking Npcap…",
  npcapAvailability: "checking",
  npcapDetail: "Checking Npcap…",
  selectedAdapter: settings.captureAdapter,
  adapterFallback: false,
  adapters: [],
};
let shuttingDown = false;

const combatWindow = new WindowSlot((onClosed) => createDpsWindow({
  logDirectory,
  settingsPath: storagePaths.dpsSettingsPath,
  onClosed,
}));
const rewardsWindow = new WindowSlot((onClosed) => createRewardsWindow({
  logDirectory,
  settingsPath: storagePaths.rewardsSettingsPath,
  onClosed,
}));
const marketWindow = new WindowSlot((onClosed) => createMarketWindow({ logDirectory, onClosed }));

const capture = new CaptureCoordinator({
  logDirectory,
  deviceName: settings.captureAdapter === "auto" ? undefined : settings.captureAdapter,
  onStatus: (state) => {
    launcherState = { ...launcherState, ...state };
    publish();
  },
});
capture.setCachedCharacter(await loadCharacterSnapshot(storagePaths.characterStatePath));
let characterSaveTimer: ReturnType<typeof setTimeout> | undefined;
const unsubscribeCharacterPersistence = capture.subscribeCharacter((state) => {
  if (!state.snapshot || state.snapshot.source !== "live") return;
  if (characterSaveTimer) clearTimeout(characterSaveTimer);
  characterSaveTimer = setTimeout(() => void saveCharacterSnapshot(state.snapshot!, storagePaths.characterStatePath), 250);
});
const characterWindow = new WindowSlot((onClosed) => createCharacterWindow({
  getState: () => capture.characterState(),
  subscribe: (listener) => capture.subscribeCharacter(listener),
  onClosed,
}));

const rpc = BrowserView.defineRPC<LauncherRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => launcherState,
      openTool: async ({ tool }) => {
        await openTool(tool);
        return launcherState;
      },
      setCaptureAdapter: async ({ deviceName }) => {
        const nextSelection = deviceName ?? "auto";
        await capture.reconfigure(deviceName ?? undefined);
        settings.captureAdapter = nextSelection;
        await saveLauncherSettings(settings, storagePaths.launcherSettingsPath);
        launcherState = { ...launcherState, selectedAdapter: nextSelection };
        await refreshCaptureDevices();
        return launcherState;
      },
      refreshCaptureDevices: async () => {
        await refreshCaptureDevices();
        if (launcherState.npcapAvailability === "ready" && capture.state().captureStatus !== "capturing") {
          await capture.start();
        }
        return launcherState;
      },
      openNpcapDownload: () => { Utils.openExternal("https://npcap.com/#download"); },
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
  frame: { x: 80, y: 80, width: 960, height: 430 },
  titleBarStyle: "hidden",
  transparent: false,
  rpc,
});
applyRoundedCorners(launcherWindow.ptr);

Electrobun.events.on(`resize-${launcherWindow.id}`, (event: { data: { width: number; height: number } }) => {
  const width = Math.max(900, event.data.width);
  const height = Math.max(430, event.data.height);
  if (width !== event.data.width || height !== event.data.height) launcherWindow.setSize(width, height);
});
launcherWindow.on("close", () => void shutdown());

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
void initializeCapture();

async function initializeCapture(): Promise<void> {
  await refreshCaptureDevices();
  if (launcherState.npcapAvailability !== "ready") {
    launcherState = { ...launcherState, captureStatus: "unavailable", statusDetail: launcherState.npcapDetail };
    publish();
    return;
  }
  await capture.start();
}

async function refreshCaptureDevices(): Promise<void> {
  const status = await getNpcapStatus();
  if (status.availability !== "ready") {
    launcherState = {
      ...launcherState,
      npcapAvailability: status.availability,
      npcapDetail: status.detail,
      ...(status.version ? { npcapVersion: status.version } : {}),
      adapters: [],
      effectiveAdapter: undefined,
      adapterFallback: false,
    };
    publish();
    return;
  }
  try {
    const devices = await listNpcapDevices();
    const requested = settings.captureAdapter === "auto" ? undefined : settings.captureAdapter;
    const resolved = await resolveCaptureDevice(devices, requested);
    launcherState = {
      ...launcherState,
      npcapAvailability: "ready",
      npcapDetail: status.detail,
      ...(status.version ? { npcapVersion: status.version } : {}),
      selectedAdapter: settings.captureAdapter,
      effectiveAdapter: resolved.device?.name,
      adapterFallback: resolved.usedFallback,
      adapters: devices.map((device) => ({ id: device.name, label: device.description })),
    };
  } catch (error) {
    launcherState = {
      ...launcherState,
      npcapAvailability: "error",
      npcapDetail: error instanceof Error ? error.message : String(error),
      adapters: [],
      effectiveAdapter: undefined,
      adapterFallback: false,
    };
  }
  publish();
}

async function openTool(tool: ToolWindow): Promise<void> {
  if (tool === "combat") await combatWindow.open();
  else if (tool === "rewards") await rewardsWindow.open();
  else if (tool === "market") await marketWindow.open();
  else await characterWindow.open();
}

function publish(): void {
  if (!launcherWindow) return;
  try { rpc.send.stateChanged(launcherState); } catch { /* The view may still be connecting. */ }
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  launcherWindow.hide();
  await Promise.all([combatWindow.close(), rewardsWindow.close(), marketWindow.close(), characterWindow.close()]);
  unsubscribeCharacterPersistence();
  if (characterSaveTimer) clearTimeout(characterSaveTimer);
  const character = capture.characterState().snapshot;
  if (character) await saveCharacterSnapshot(character, storagePaths.characterStatePath);
  await capture.stop();
  Utils.quit();
}
