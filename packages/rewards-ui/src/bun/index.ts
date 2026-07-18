import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";
import { applyRoundedCorners } from "@spiritvale/ui-theme/win32";
import {
  loadBundledMobRewardCatalog,
  loadRewardReplay,
  queryMobRewardCatalog,
  RewardSessionLogFollower,
} from "@spiritvale/rewards";
import type { MobRewardSessionSnapshot, RewardLogStatus } from "@spiritvale/rewards";
import type {
  RewardsAppMode,
  RewardsAppRpc,
  RewardsAppState,
  RewardsAppStatus,
  RewardsCatalogRpc,
  RewardsCatalogState,
} from "../app-types.ts";
import { loadRewardsSettings, saveRewardsSettings } from "../settings.ts";

const POLL_MS = 1_000;
const catalog = loadBundledMobRewardCatalog();

export interface RewardsWindowOptions {
  logDirectory: string;
  onClosed?: () => void;
}

export async function createRewardsWindow(options: RewardsWindowOptions) {
const settings = await loadRewardsSettings();
const follower = new RewardSessionLogFollower(options.logDirectory);

let window: BrowserWindow;
let catalogWindow: BrowserWindow | undefined;
let mode: RewardsAppMode = "live";
let status: RewardsAppStatus = "waiting";
let statusDetail = "Start a passive rewards session to observe kills.";
let catalogQuery = "";
let liveSnapshot = emptySnapshot();
let replaySnapshot = emptySnapshot();
let replayFileName: string | undefined;
let replayWarnings = 0;
let polling = false;
let shuttingDown = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

const rpc = BrowserView.defineRPC<RewardsAppRpc>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getState: () => appState(),
      setMode: ({ mode: nextMode }) => { mode = nextMode; publish(); return appState(); },
      setView: ({ view }) => { settings.view = view; scheduleSave(); publish(); return appState(); },
      openCatalog: () => { openCatalog(); },
      chooseReplay: async () => { await chooseReplay(); return appState(); },
      setPinned: ({ pinned }) => {
        settings.pinned = pinned;
        window.setAlwaysOnTop(pinned);
        catalogWindow?.setAlwaysOnTop(pinned);
        scheduleSave();
        publish();
        return appState();
      },
      windowAction: async ({ action }) => {
        if (action === "minimize") window.minimize();
        else {
          await shutdown();
          window.close();
        }
      },
      getWindowFrame: () => window.getFrame(),
      setWindowFrame: ({ x, y, width, height }) => { window.setFrame(x, y, width, height); },
      toggleMaximize: () => {
        if (window.isMaximized()) window.unmaximize();
        else window.maximize();
        return { maximized: window.isMaximized() };
      },
    },
    messages: {},
  },
});

const catalogRpc = BrowserView.defineRPC<RewardsCatalogRpc>({
  handlers: {
    requests: {
      getState: () => catalogState(),
      setQuery: ({ query }) => {
        catalogQuery = query.trim().slice(0, 200);
        publishCatalog();
        return catalogState();
      },
      windowAction: ({ action }) => {
        if (action === "minimize") catalogWindow?.minimize();
        else if (catalogWindow) {
          settings.catalogFrame = clampCatalogFrame(catalogWindow.getFrame());
          scheduleSave();
          catalogWindow.close();
        }
      },
      getWindowFrame: () => catalogWindow?.getFrame() ?? settings.catalogFrame,
      setWindowFrame: ({ x, y, width, height }) => { catalogWindow?.setFrame(x, y, width, height); },
      toggleMaximize: () => {
        if (!catalogWindow) return { maximized: false };
        if (catalogWindow.isMaximized()) catalogWindow.unmaximize();
        else catalogWindow.maximize();
        return { maximized: catalogWindow.isMaximized() };
      },
    },
    messages: {},
  },
});

window = new BrowserWindow({
  title: "Spirit Vale Mob Rewards",
  url: "views://rewardsview/index.html",
  frame: settings.frame,
  titleBarStyle: "hidden",
  transparent: false,
  rpc,
});
window.setAlwaysOnTop(settings.pinned);
applyRoundedCorners(window.ptr);

Electrobun.events.on(`move-${window.id}`, (event: { data: typeof settings.frame }) => { settings.frame = clampFrame(event.data); scheduleSave(); });
Electrobun.events.on(`resize-${window.id}`, (event: { data: typeof settings.frame }) => {
  const frame = clampFrame(event.data);
  settings.frame = frame;
  if (frame.width !== event.data.width || frame.height !== event.data.height) window.setSize(frame.width, frame.height);
  scheduleSave();
});
window.on("close", () => {
  void shutdown();
  options.onClosed?.();
});

const timer = setInterval(() => void poll(), POLL_MS);
void poll();
return {
  show: () => window.show(),
  activate: () => window.activate(),
  close: async () => { await shutdown(); window.close(); },
};

function appState(): RewardsAppState {
  const snapshot = mode === "live" ? liveSnapshot : replaySnapshot;
  return {
    mode,
    view: settings.view,
    status: mode === "replay" ? (replayFileName ? "ready" : "stopped") : status,
    statusDetail: mode === "replay" ? (replayFileName ? `Replay: ${replayFileName}` : "Choose a rewards log") : statusDetail,
    pinned: settings.pinned,
    ...(replayFileName ? { replayFileName } : {}),
    replayWarnings,
    kills: snapshot.kills.slice(0, 100).map((kill) => ({
      id: kill.id,
      tick: kill.tick,
      mobId: kill.mob.mobId,
      displayName: kill.mob.displayName,
      level: kill.mob.level,
      experience: kill.experience,
      jobExperience: kill.jobExperience,
      coins: kill.coins.toString(),
      drops: kill.drops.map((drop) => ({ ...drop, itemName: itemName(drop.itemId) })),
    })),
    summaries: snapshot.mobs.map((mob) => ({
      ...mob,
      coins: mob.coins.toString(),
      drops: mob.drops.map((drop) => ({ ...drop, itemName: itemName(drop.itemId) })),
    })),
    totalExperience: snapshot.totalExperience,
    totalJobExperience: snapshot.totalJobExperience,
    totalCoins: snapshot.totalCoins.toString(),
    unmatched: snapshot.unmatched,
    unidentified: snapshot.unmatchedByReason.unidentified,
  };
}

function catalogState(): RewardsCatalogState {
  const mobs = queryMobRewardCatalog(catalog, { text: catalogQuery });
  return {
    query: catalogQuery,
    catalogCount: catalog.mobs.length,
    catalog: mobs.map((mob) => ({ ...mob, drops: mob.drops.map((drop) => ({ ...drop })) })),
  };
}

function openCatalog(): void {
  if (catalogWindow) {
    catalogWindow.show();
    catalogWindow.activate();
    return;
  }

  const nextWindow = new BrowserWindow({
    title: "Spirit Vale Mob Catalog",
    url: "views://rewardscatalogview/index.html",
    frame: settings.catalogFrame,
    titleBarStyle: "hidden",
    transparent: false,
    rpc: catalogRpc,
  });
  catalogWindow = nextWindow;
  nextWindow.setAlwaysOnTop(settings.pinned);
  applyRoundedCorners(nextWindow.ptr);

  Electrobun.events.on(`move-${nextWindow.id}`, (event: { data: typeof settings.catalogFrame }) => {
    settings.catalogFrame = clampCatalogFrame(event.data);
    scheduleSave();
  });
  Electrobun.events.on(`resize-${nextWindow.id}`, (event: { data: typeof settings.catalogFrame }) => {
    const frame = clampCatalogFrame(event.data);
    settings.catalogFrame = frame;
    if (frame.width !== event.data.width || frame.height !== event.data.height) nextWindow.setSize(frame.width, frame.height);
    scheduleSave();
  });
  nextWindow.on("close", () => {
    catalogWindow = undefined;
    scheduleSave();
  });
}

async function poll(): Promise<void> {
  if (polling || shuttingDown) return;
  polling = true;
  try {
    const batch = await follower.poll();
    if (batch.changed || batch.reset || batch.status !== status) {
      liveSnapshot = batch.snapshot;
      status = batch.status;
      statusDetail = detail(batch.status, batch.invalidLines, batch.snapshot.unmatchedByReason.unidentified);
      if (mode === "live") publish();
    }
  } catch {
    status = "error";
    statusDetail = "The current rewards log could not be read.";
    publish();
  } finally { polling = false; }
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
  try {
    const replay = await loadRewardReplay(selectedPath);
    replaySnapshot = replay.snapshot;
    replayWarnings = replay.invalidLines;
    replayFileName = path.basename(selectedPath);
    mode = "replay";
  } catch {
    replaySnapshot = emptySnapshot();
    replayWarnings = 0;
    replayFileName = undefined;
  }
  publish();
}

function itemName(itemId: string): string {
  for (const mob of catalog.mobs) {
    const drop = mob.drops.find((candidate) => candidate.itemId === itemId);
    if (drop) return drop.itemName;
  }
  return itemId.replace(/^currency:/, "Currency ");
}

function detail(next: RewardLogStatus, invalidLines: number, unidentified: number): string {
  const skipped = invalidLines > 0 ? ` · ${invalidLines} malformed records skipped` : "";
  const warmup = unidentified > 0 ? ` · ${unidentified} rewards missed mob identity from before capture` : "";
  switch (next) {
    case "waiting": return "Start a passive rewards session to observe kills.";
    case "watching": return `Rewards session found; waiting for a confirmed kill.${warmup}${skipped}`;
    case "ready": return `Tracking confirmed mob rewards.${warmup}${skipped}`;
    case "stopped": return `Rewards session stopped; showing its final state.${warmup}${skipped}`;
    case "error": return "The rewards session reported an error.";
  }
}

function publish(): void {
  try { rpc.send.stateChanged(appState()); } catch { /* webview handshake is not complete yet */ }
}

function publishCatalog(): void {
  try { catalogRpc.send.stateChanged(catalogState()); } catch { /* webview handshake is not complete yet */ }
}

function clampFrame(frame: typeof settings.frame): typeof settings.frame {
  return { x: frame.x, y: frame.y, width: Math.max(620, frame.width), height: Math.max(520, frame.height) };
}

function clampCatalogFrame(frame: typeof settings.catalogFrame): typeof settings.catalogFrame {
  return { x: frame.x, y: frame.y, width: Math.max(520, frame.width), height: Math.max(420, frame.height) };
}

function scheduleSave(): void {
  if (shuttingDown) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void saveRewardsSettings(settings), 250);
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(timer);
  if (saveTimer) clearTimeout(saveTimer);
  catalogWindow?.close();
  settings.frame = clampFrame(window.getFrame());
  await saveRewardsSettings(settings);
}

function emptySnapshot(): MobRewardSessionSnapshot {
  return {
    kills: [], mobs: [], totalExperience: 0, totalJobExperience: 0, totalCoins: 0n, unmatched: 0,
    unmatchedByReason: { ambiguous: 0, expired: 0, unidentified: 0 },
  };
}
}
