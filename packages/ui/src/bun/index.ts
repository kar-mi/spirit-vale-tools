import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow } from "electrobun/bun";
import { applyRoundedCorners } from "@spiritvale/ui-theme/win32";

import {
  FishNetDpsMeter,
  DpsLogFollower,
  DpsSessionLogFollower,
  loadDpsReplay,
} from "@spiritvale/combat";
import type { FishNetDpsEncounterSnapshot } from "@spiritvale/combat";
import { loadDpsAppSettings, saveDpsAppSettings } from "../settings.ts";
import type { DpsAppMode, DpsAppRpc, DpsAppState, DpsAppStatus } from "../app-types.ts";
import { formatCombatReplaySummary } from "./replay-summaries.ts";
import { createSessionPicker } from "./session-picker.ts";

const MINIMUM_WIDTH = 320;
const MINIMUM_HEIGHT = 360;
const LIVE_LOG_POLL_MS = 2_500;
export interface DpsWindowOptions {
  logDirectory: string;
  onClosed?: () => void;
}

export async function createDpsWindow(options: DpsWindowOptions) {
const liveLogOverride = process.env.SPIRIT_VALE_COMBAT_LOG;
const settings = await loadDpsAppSettings();

let window: BrowserWindow;
let mode: DpsAppMode = "live";
let status: DpsAppStatus = "waiting";
let statusDetail = liveLogOverride ? `Looking for ${path.basename(liveLogOverride)}…` : "Looking for a combat session…";
let liveStatus: DpsAppStatus = status;
let liveStatusDetail = statusDetail;
let replayMeter: FishNetDpsMeter | undefined;
let replayFileName: string | undefined;
let replayWarnings = 0;
let selectedReplayEncounterId: string | undefined;
let liveMeter = new FishNetDpsMeter({ personalName: settings.personalName });
let manualPersonalActorId: number | undefined;
const liveLog = liveLogOverride ? new DpsLogFollower(liveLogOverride) : new DpsSessionLogFollower(options.logDirectory);
let lastLiveObservedAtMs = 0;
let liveLogPolling = false;
let publishing = false;
let settingsSaveTimer: ReturnType<typeof setTimeout> | undefined;
let shuttingDown = false;

const replayPicker = createSessionPicker({
  logDirectory: options.logDirectory,
  stream: "combat",
  title: "Combat replays",
  summarize: formatCombatReplaySummary,
  loadReplay: loadReplayPath,
});

const rpc = BrowserView.defineRPC<DpsAppRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => appState(),
      setMode: async ({ mode: nextMode }) => {
        await switchMode(nextMode);
        return appState();
      },
      openReplayPicker: () => { replayPicker.open(); },
      selectEncounter: ({ id }) => {
        if (replayMeter?.getSnapshots().some((encounter) => encounter.id === id)) selectedReplayEncounterId = id;
        publish();
        return appState();
      },
      resetEncounter: () => {
        if (mode === "live") liveMeter.reset(lastLiveObservedAtMs);
        publish();
        return appState();
      },
      setPersonalName: ({ name }) => {
        settings.personalName = name.trim();
        liveMeter.setPersonalName(settings.personalName);
        replayMeter?.setPersonalName(settings.personalName);
        scheduleSettingsSave();
        publish();
        return appState();
      },
      setPersonalActor: ({ actorId }) => {
        manualPersonalActorId = actorId ?? undefined;
        activeMeter().setPersonalActorId(manualPersonalActorId);
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

window = new BrowserWindow({
  title: "Spirit Vale DPS",
  url: "views://mainview/index.html",
  frame: settings.frame,
  titleBarStyle: "hidden",
  transparent: false,
  rpc,
});
window.setAlwaysOnTop(settings.pinned);
applyRoundedCorners(window.ptr);

Electrobun.events.on(`move-${window.id}`, (event: { data: typeof settings.frame }) => {
  settings.frame = clampFrame(event.data);
  scheduleSettingsSave();
});
Electrobun.events.on(`resize-${window.id}`, (event: { data: typeof settings.frame }) => {
  const frame = clampFrame(event.data);
  settings.frame = frame;
  if (event.data.width < MINIMUM_WIDTH || event.data.height < MINIMUM_HEIGHT) {
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

async function switchMode(nextMode: DpsAppMode): Promise<void> {
  if (nextMode === mode) return;
  mode = nextMode;
  if (mode === "live") {
    status = liveStatus;
    statusDetail = liveStatusDetail;
    publish();
  } else {
    status = replayMeter ? "ready" : "stopped";
    statusDetail = replayMeter ? "Replay loaded" : "Choose a combat log";
    publish();
  }
}

async function loadReplayPath(selectedPath: string): Promise<void> {
  mode = "replay";
  status = "loading";
  statusDetail = "Loading replay…";
  publish();
  try {
    const replay = await loadDpsReplay(selectedPath, settings.personalName);
    replayMeter = replay.meter;
    replayWarnings = replay.invalidLines;
    replayFileName = path.basename(selectedPath);
    selectedReplayEncounterId = replayMeter.getSnapshots().at(-1)?.id;
    status = "ready";
    statusDetail = replayWarnings === 0 ? "Replay loaded" : `Replay loaded with ${replayWarnings} skipped lines`;
  } catch {
    replayMeter = undefined;
    replayWarnings = 0;
    replayFileName = undefined;
    selectedReplayEncounterId = undefined;
    status = "error";
    statusDetail = "The selected combat log could not be read";
    publish();
    throw new Error("combat replay could not be loaded");
  }
  publish();
}

function appState(): DpsAppState {
  const snapshots = mode === "live" ? latestOnly(liveMeter.getLatestSnapshot()) : replayMeter?.getSnapshots() ?? [];
  const selectedId = mode === "live" ? snapshots.at(-1)?.id : selectedReplayEncounterId;
  const snapshot = snapshots.find((encounter) => encounter.id === selectedId) ?? snapshots.at(-1);
  return {
    mode,
    tab: settings.tab,
    status,
    statusDetail,
    pinned: settings.pinned,
    personalName: settings.personalName,
    ...(activeMeter().getPersonalActorId() === undefined ? {} : { personalActorId: activeMeter().getPersonalActorId() }),
    ...(mode === "replay" && replayFileName ? { replayFileName } : {}),
    replayWarnings,
    encounters: snapshots.map((encounter, index) => ({
      id: encounter.id,
      label: `Encounter ${index + 1} · ${formatDuration(encounter.durationMs)}`,
    })),
    ...(selectedId ? { selectedEncounterId: selectedId } : {}),
    ...(snapshot ? { snapshot } : {}),
  };
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
      lastLiveObservedAtMs = 0;
    }
    for (const { event, observedAtMs } of batch.events) {
      lastLiveObservedAtMs = observedAtMs;
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
  liveStatus = nextStatus;
  liveStatusDetail = detail;
  if (mode !== "live") return;
  status = nextStatus;
  statusDetail = detail;
  publish();
}

function latestOnly(snapshot: FishNetDpsEncounterSnapshot | undefined): FishNetDpsEncounterSnapshot[] {
  return snapshot ? [snapshot] : [];
}

function activeMeter(): FishNetDpsMeter {
  return mode === "replay" && replayMeter ? replayMeter : liveMeter;
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function clampFrame(frame: DpsAppSettingsFrame): DpsAppSettingsFrame {
  return {
    x: frame.x,
    y: frame.y,
    width: Math.max(MINIMUM_WIDTH, frame.width),
    height: Math.max(MINIMUM_HEIGHT, frame.height),
  };
}

type DpsAppSettingsFrame = typeof settings.frame;

function scheduleSettingsSave(): void {
  if (settingsSaveTimer) clearTimeout(settingsSaveTimer);
  settingsSaveTimer = setTimeout(() => void saveDpsAppSettings(settings), 250);
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  replayPicker.close();
  settings.frame = clampFrame(window.getFrame());
  clearInterval(liveLogTimer);
  if (settingsSaveTimer) clearTimeout(settingsSaveTimer);
  await saveDpsAppSettings(settings);
}
}
