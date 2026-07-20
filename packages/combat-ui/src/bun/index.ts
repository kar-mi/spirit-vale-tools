import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow } from "electrobun/bun";
import { applyRoundedCorners } from "@spiritvale/ui-theme/win32";

import {
  FishNetDpsMeter,
  DpsLogFollower,
  DpsSessionLogFollower,
  formatCombatReplaySummary,
} from "@spiritvale/combat";
import { loadDpsAppSettings, normalizeDpsOpacity, saveDpsAppSettings } from "../settings.ts";
import type { DpsAppRpc, DpsAppState, DpsAppStatus, DpsSettingsRpc, DpsSettingsState } from "../app-types.ts";
import { SafeSaveQueue } from "@spiritvale/ui-theme/safe-save";
import { createSessionPicker } from "@spiritvale/ui-theme/session-picker";
import { Utils } from "electrobun/bun";
import { createCombatAnalysisWindow } from "./combat-analysis-window.ts";
import { registerUiScaleWindow, scaledSize, unscaledSize } from "@spiritvale/ui-theme/ui-scale";

const MINIMUM_WIDTH = 320;
const MINIMUM_HEIGHT = 360;
const DPS_SETTINGS_WIDTH = 560;
const DPS_SETTINGS_HEIGHT = 360;
const LIVE_LOG_POLL_MS = 2_500;
export interface DpsWindowOptions {
  logDirectory: string;
  settingsPath?: string;
  onClosed?: () => void;
}

export async function createDpsWindow(options: DpsWindowOptions) {
const liveLogOverride = process.env.SPIRIT_VALE_COMBAT_LOG;
const settings = await loadDpsAppSettings(options.settingsPath);

let window: BrowserWindow;
let settingsWindow: BrowserWindow | undefined;
let status: DpsAppStatus = "waiting";
let statusDetail = liveLogOverride ? `Looking for ${path.basename(liveLogOverride)}…` : "Looking for a combat session…";
let liveMeter = new FishNetDpsMeter({ personalName: settings.personalName });
let manualPersonalActorId: number | undefined;
const liveLog = liveLogOverride ? new DpsLogFollower(liveLogOverride) : new DpsSessionLogFollower(options.logDirectory);
let liveLogPolling = false;
let publishing = false;
let shuttingDown = false;
let storageWarning: string | undefined;

const settingsPersistence = new SafeSaveQueue<typeof settings>({
  label: "DPS settings",
  save: (value) => saveDpsAppSettings(value, options.settingsPath),
  onWarning: (warning) => { storageWarning = warning; publish(); },
});

const analysisWindow = createCombatAnalysisWindow();

const replayPicker = createSessionPicker({
  logDirectory: options.logDirectory,
  stream: "combat",
  title: "Combat log analysis",
  summarize: formatCombatReplaySummary,
  loadReplay: (selectedPath) => analysisWindow.open(selectedPath),
  openLogFolder: () => { void Utils.openPath(options.logDirectory); },
});

const rpc = BrowserView.defineRPC<DpsAppRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => appState(),
      openReplayPicker: () => { replayPicker.open(); },
      resetEncounter: () => {
        liveMeter.clearEncounters();
        publish();
        return appState();
      },
      setPersonalName: ({ name }) => {
        settings.personalName = name.trim();
        liveMeter.setPersonalName(settings.personalName);
        scheduleSettingsSave();
        publish();
        return appState();
      },
      setPersonalActor: ({ actorId }) => {
        manualPersonalActorId = actorId ?? undefined;
        liveMeter.setPersonalActorId(manualPersonalActorId);
        publish();
        return appState();
      },
      setPinned: ({ pinned }) => {
        settings.pinned = pinned;
        window.setAlwaysOnTop(pinned);
        scheduleSettingsSave();
        publish();
        return appState();
      },
      openSettings: () => { openDpsSettings(); },
      setOpacity: ({ opacity }) => {
        updateOpacity(opacity);
        return appState();
      },
      setTab: ({ tab }) => {
        settings.tab = tab;
        scheduleSettingsSave();
        publish();
        return appState();
      },
      windowAction: async ({ action }) => {
        if (action === "minimize") {
          window.minimize();
          return;
        }
        await shutdown();
        window.close();
      },
      getWindowFrame: () => window.getFrame(),
      setWindowFrame: ({ x, y, width, height }) => { window.setFrame(x, y, width, height); },
    },
    messages: {},
  },
});

const settingsRpc = BrowserView.defineRPC<DpsSettingsRpc>({
  handlers: {
    requests: {
      getState: () => settingsState(),
      setOpacity: ({ opacity }) => {
        updateOpacity(opacity);
        return settingsState();
      },
      windowAction: ({ action }) => {
        const target = settingsWindow;
        if (!target) return;
        if (action === "minimize") target.minimize();
        else target.close();
      },
      getWindowFrame: () => settingsWindow?.getFrame() ?? { x: 0, y: 0, width: DPS_SETTINGS_WIDTH, height: DPS_SETTINGS_HEIGHT },
      setWindowFrame: ({ x, y, width, height }) => settingsWindow?.setFrame(x, y, width, height),
    },
    messages: {},
  },
});

window = new BrowserWindow({
  title: "Spirit Vale DPS",
  url: "views://mainview/index.html",
  frame: scaleFrame(settings.frame),
  titleBarStyle: "hidden",
  transparent: true,
  rpc,
});
window.setAlwaysOnTop(settings.pinned);
applyRoundedCorners(window.ptr);
registerUiScaleWindow(window, { scaleInitialFrame: false });

Electrobun.events.on(`move-${window.id}`, (event: { data: typeof settings.frame }) => {
  settings.frame = unscaleFrame(clampPhysicalFrame(event.data));
  scheduleSettingsSave();
});
Electrobun.events.on(`resize-${window.id}`, (event: { data: typeof settings.frame }) => {
  const frame = clampPhysicalFrame(event.data);
  settings.frame = unscaleFrame(frame);
  if (event.data.width < scaledSize(MINIMUM_WIDTH) || event.data.height < scaledSize(MINIMUM_HEIGHT)) {
    window.setSize(frame.width, frame.height);
  }
  scheduleSettingsSave();
});
window.on("close", () => {
  void shutdown();
  options.onClosed?.();
});

const liveLogTimer = setInterval(() => void pollLiveLog(), LIVE_LOG_POLL_MS);
void pollLiveLog();
return {
  show: () => window.show(),
  activate: () => window.activate(),
  close: async () => { await shutdown(); window.close(); },
};

function appState(): DpsAppState {
  const snapshot = liveMeter.getLatestSnapshot();
  return {
    tab: settings.tab,
    status,
    statusDetail,
    ...(storageWarning ? { storageWarning } : {}),
    pinned: settings.pinned,
    opacity: settings.opacity,
    personalName: settings.personalName,
    ...(liveMeter.getPersonalActorId() === undefined ? {} : { personalActorId: liveMeter.getPersonalActorId() }),
    ...(snapshot ? { snapshot } : {}),
  };
}

function settingsState(): DpsSettingsState {
  return { opacity: settings.opacity };
}

function openDpsSettings(): void {
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.activate();
    return;
  }
  const frame = window.getFrame();
  const nextWindow = new BrowserWindow({
    title: "Spirit Vale DPS Settings",
    url: "views://dpssettingsview/index.html",
    frame: { x: frame.x + 24, y: frame.y + 24, width: DPS_SETTINGS_WIDTH, height: DPS_SETTINGS_HEIGHT },
    titleBarStyle: "hidden",
    transparent: false,
    rpc: settingsRpc,
  });
  settingsWindow = nextWindow;
  nextWindow.setAlwaysOnTop(true);
  nextWindow.show();
  nextWindow.activate();
  applyRoundedCorners(nextWindow.ptr);
  registerUiScaleWindow(nextWindow);
  Electrobun.events.on(`resize-${nextWindow.id}`, (event: { data: { width: number; height: number } }) => {
    const width = Math.max(scaledSize(DPS_SETTINGS_WIDTH), event.data.width);
    const height = Math.max(scaledSize(DPS_SETTINGS_HEIGHT), event.data.height);
    if (width !== event.data.width || height !== event.data.height) nextWindow.setSize(width, height);
  });
  nextWindow.on("close", () => { if (settingsWindow === nextWindow) settingsWindow = undefined; });
}

function updateOpacity(opacity: number): void {
  settings.opacity = normalizeDpsOpacity(opacity);
  scheduleSettingsSave();
  publish();
}

function publish(): void {
  if (publishing || !window) return;
  publishing = true;
  try {
    rpc.send.stateChanged(appState());
  } catch {
    // The webview may not have completed its RPC handshake yet.
  } finally {
    publishing = false;
  }
  try {
    settingsRpc.send.stateChanged(settingsState());
  } catch {
    // The settings webview may not have completed its RPC handshake yet.
  }
}

async function pollLiveLog(): Promise<void> {
  if (liveLogPolling || shuttingDown) return;
  liveLogPolling = true;
  try {
    const batch = await liveLog.poll();
    if (batch.reset) {
      liveMeter = new FishNetDpsMeter({
        personalName: settings.personalName,
        ...(manualPersonalActorId === undefined ? {} : { personalActorId: manualPersonalActorId }),
      });
    }
    for (const { event, observedAtMs } of batch.events) {
      if (event.kind === "actorIdentity") liveMeter.consumeIdentity(event, observedAtMs);
      else liveMeter.consumeCombat(event, observedAtMs);
    }
    const fileName = path.basename(batch.path ?? liveLogOverride ?? "combat.jsonl");
    if (batch.missing) updateLiveStatus("waiting", `Waiting for ${fileName}`);
    else if (batch.invalidLines > 0) updateLiveStatus("ready", `Reading ${fileName} with skipped lines`);
    else if (batch.events.length > 0) updateLiveStatus("capturing", `Reading ${fileName}`);
    else updateLiveStatus(liveMeter.getLatestSnapshot() ? "ready" : "waiting", `Watching ${fileName}`);
  } catch {
    updateLiveStatus("error", `Could not read ${path.basename(liveLogOverride ?? "combat.jsonl")}`);
  } finally {
    liveLogPolling = false;
  }
}

function updateLiveStatus(nextStatus: DpsAppStatus, detail: string): void {
  status = nextStatus;
  statusDetail = detail;
  publish();
}

function clampFrame(frame: DpsAppSettingsFrame): DpsAppSettingsFrame {
  return {
    x: frame.x,
    y: frame.y,
    width: Math.max(MINIMUM_WIDTH, frame.width),
    height: Math.max(MINIMUM_HEIGHT, frame.height),
  };
}

function scaleFrame(frame: DpsAppSettingsFrame): DpsAppSettingsFrame {
  return { x: frame.x, y: frame.y, width: scaledSize(frame.width), height: scaledSize(frame.height) };
}

function unscaleFrame(frame: DpsAppSettingsFrame): DpsAppSettingsFrame {
  return clampFrame({ x: frame.x, y: frame.y, width: unscaledSize(frame.width), height: unscaledSize(frame.height) });
}

function clampPhysicalFrame(frame: DpsAppSettingsFrame): DpsAppSettingsFrame {
  return { x: frame.x, y: frame.y, width: Math.max(scaledSize(MINIMUM_WIDTH), frame.width), height: Math.max(scaledSize(MINIMUM_HEIGHT), frame.height) };
}

type DpsAppSettingsFrame = typeof settings.frame;

function scheduleSettingsSave(): void {
  settingsPersistence.schedule(settings);
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  replayPicker.close();
  analysisWindow.close();
  settingsWindow?.close();
  settingsWindow = undefined;
  settings.frame = unscaleFrame(window.getFrame());
  clearInterval(liveLogTimer);
  await settingsPersistence.flush(settings);
}
}
