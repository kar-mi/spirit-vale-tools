import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";
import { applyRoundedCorners, makeProcessDpiAware } from "@spiritvale/ui-theme/win32";

import {
  FishNetDpsMeter,
  DpsLogFollower,
  DpsSessionLogFollower,
  loadDpsReplay,
} from "@spiritvale/combat";
import type { FishNetDpsEncounterSnapshot } from "@spiritvale/combat";
import { loadDpsAppSettings, saveDpsAppSettings } from "../settings.ts";
import type { DpsAppMode, DpsAppRpc, DpsAppState, DpsAppStatus } from "../app-types.ts";

makeProcessDpiAware();

const MINIMUM_WIDTH = 320;
const MINIMUM_HEIGHT = 360;
const LIVE_LOG_POLL_MS = 2_500;
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
const liveLog = liveLogOverride ? new DpsLogFollower(liveLogOverride) : new DpsSessionLogFollower();
let lastLiveObservedAtMs = 0;
let liveLogPolling = false;
let publishing = false;
let settingsSaveTimer: ReturnType<typeof setTimeout> | undefined;
let shuttingDown = false;

const rpc = BrowserView.defineRPC<DpsAppRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => appState(),
      setMode: async ({ mode: nextMode }) => {
        await switchMode(nextMode);
        return appState();
      },
      chooseReplay: async () => {
        await chooseReplay();
        return appState();
      },
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
        window.hide();
        void shutdown();
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

const liveLogTimer = setInterval(() => void pollLiveLog(), LIVE_LOG_POLL_MS);
void pollLiveLog();
process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

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

async function chooseReplay(): Promise<void> {
  const [selectedPath] = await Utils.openFileDialog({
    startingFolder: Utils.paths.documents,
    allowedFileTypes: "jsonl",
    canChooseFiles: true,
    canChooseDirectory: false,
    allowsMultipleSelection: false,
  });
  if (!selectedPath) return;
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
  try {
    settings.frame = clampFrame(window.getFrame());
    window.hide();
    clearInterval(liveLogTimer);
    if (settingsSaveTimer) clearTimeout(settingsSaveTimer);
    await saveDpsAppSettings(settings);
  } finally {
    Utils.quit();
  }
}
