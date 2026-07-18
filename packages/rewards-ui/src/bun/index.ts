import { existsSync } from "node:fs";
import path from "node:path";

import Electrobun, { BrowserView, BrowserWindow, Utils } from "electrobun/bun";
import {
  loadBundledMobRewardCatalog,
  loadRewardReplay,
  queryMobRewardCatalog,
  RewardSessionLogFollower,
} from "@spiritvale/rewards";
import type { MobRewardSessionSnapshot, RewardLogStatus } from "@spiritvale/rewards";
import type { RewardsAppMode, RewardsAppRpc, RewardsAppState, RewardsAppStatus } from "../app-types.ts";
import { loadRewardsSettings, saveRewardsSettings } from "../settings.ts";

const POLL_MS = 1_000;
const catalog = loadBundledMobRewardCatalog();
const settings = await loadRewardsSettings();
const follower = new RewardSessionLogFollower(resolveLogDirectory());

let window: BrowserWindow;
let mode: RewardsAppMode = "live";
let status: RewardsAppStatus = "waiting";
let statusDetail = "Start a passive rewards session to observe kills.";
let query = "";
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
      setQuery: ({ query: nextQuery }) => { query = nextQuery.trim().slice(0, 200); publish(); return appState(); },
      chooseReplay: async () => { await chooseReplay(); return appState(); },
      setPinned: ({ pinned }) => {
        settings.pinned = pinned;
        window.setAlwaysOnTop(pinned);
        scheduleSave();
        publish();
        return appState();
      },
      windowAction: async ({ action }) => {
        if (action === "minimize") window.minimize();
        else await shutdown();
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

Electrobun.events.on(`move-${window.id}`, (event: { data: typeof settings.frame }) => { settings.frame = clampFrame(event.data); scheduleSave(); });
Electrobun.events.on(`resize-${window.id}`, (event: { data: typeof settings.frame }) => {
  const frame = clampFrame(event.data);
  settings.frame = frame;
  if (frame.width !== event.data.width || frame.height !== event.data.height) window.setSize(frame.width, frame.height);
  scheduleSave();
});

const timer = setInterval(() => void poll(), POLL_MS);
void poll();
process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

function appState(): RewardsAppState {
  const snapshot = mode === "live" ? liveSnapshot : replaySnapshot;
  const mobs = queryMobRewardCatalog(catalog, { text: query });
  return {
    mode,
    view: settings.view,
    status: mode === "replay" ? (replayFileName ? "ready" : "stopped") : status,
    statusDetail: mode === "replay" ? (replayFileName ? `Replay: ${replayFileName}` : "Choose a rewards log") : statusDetail,
    pinned: settings.pinned,
    query,
    catalogCount: catalog.mobs.length,
    catalog: mobs.map((mob) => ({ ...mob, drops: mob.drops.map((drop) => ({ ...drop })) })),
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

function clampFrame(frame: typeof settings.frame): typeof settings.frame {
  return { x: frame.x, y: frame.y, width: Math.max(620, frame.width), height: Math.max(520, frame.height) };
}

function scheduleSave(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void saveRewardsSettings(settings), 250);
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(timer);
  if (saveTimer) clearTimeout(saveTimer);
  settings.frame = clampFrame(window.getFrame());
  await saveRewardsSettings(settings);
  Utils.quit();
}

function resolveLogDirectory(): string {
  const override = process.env.SPIRIT_VALE_LOG_DIRECTORY?.trim();
  if (override) return path.resolve(override);
  let current = process.cwd();
  while (true) {
    if (existsSync(path.join(current, "bun.lock")) && existsSync(path.join(current, "packages"))) return path.join(current, "logs");
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(process.cwd(), "logs");
    current = parent;
  }
}

function emptySnapshot(): MobRewardSessionSnapshot {
  return {
    kills: [], mobs: [], totalExperience: 0, totalJobExperience: 0, totalCoins: 0n, unmatched: 0,
    unmatchedByReason: { ambiguous: 0, expired: 0, unidentified: 0 },
  };
}
