import path from "node:path";

import { DpsLogFollower, DpsSessionLogFollower } from "@spiritvale/combat";
import type { CharacterViewState } from "@spiritvale/character";
import { SafeSaveQueue } from "@spiritvale/ui-theme/safe-save";
import { applyRoundedCorners, setWindowClickThrough } from "@spiritvale/ui-theme/win32";
import { registerUiScaleWindow, scaledSize } from "@spiritvale/ui-theme/ui-scale";
import type { WindowPlacementStore } from "@spiritvale/ui-theme/window-placement";
import { BrowserView, BrowserWindow, GlobalShortcut, Screen } from "electrobun/bun";

import type { OverlayRpc, OverlaySettingsRpc, OverlayState, OverlayStatus } from "../app-types.ts";
import { createPersonalDpsMeter, detectedPersonalName, syncPersonalCharacter } from "../personal-character.ts";
import { personalResources } from "../personal-resources.ts";
import {
  loadOverlaySettings,
  normalizeOverlaySettings,
  saveOverlaySettings,
  type OverlayElementId,
} from "../settings.ts";

const LIVE_LOG_POLL_MS = 1_000;
const SETTINGS_WIDTH = 798;
const SETTINGS_HEIGHT = 680;
const MINIMUM_SETTINGS_WIDTH = 560;
const MINIMUM_SETTINGS_HEIGHT = 420;
const LOCK_SHORTCUT = "F11";

export interface OverlayWindowOptions {
  logDirectory: string;
  getCharacterState: () => CharacterViewState;
  subscribeCharacter: (listener: (state: CharacterViewState) => void) => () => void;
  settingsPath?: string;
  placements?: WindowPlacementStore;
  showSettingsOnCreate?: boolean;
  lockOnCreate?: boolean;
  onClosed?: () => void;
}

export async function createOverlayWindow(options: OverlayWindowOptions) {
  const bounds = Screen.getPrimaryDisplay().bounds;
  let settings = await loadOverlaySettings(options.settingsPath, bounds);
  if (options.lockOnCreate) settings.locked = true;
  let characterState = options.getCharacterState();
  let meter = createPersonalDpsMeter(characterState);
  const liveLogOverride = process.env.SPIRIT_VALE_COMBAT_LOG;
  const liveLog = liveLogOverride
    ? new DpsLogFollower(liveLogOverride)
    : new DpsSessionLogFollower(options.logDirectory);
  let status: OverlayStatus = "waiting";
  let statusDetail = liveLogOverride
    ? `Looking for ${path.basename(liveLogOverride)}…`
    : "Looking for a combat session…";
  let overlayWindow: BrowserWindow;
  let settingsWindow: BrowserWindow | undefined;
  let polling = false;
  let publishing = false;
  let shuttingDown = false;
  let closedCallbackSent = false;
  let lastEventObservedAtMs: number | undefined;
  let lastEventWallMs: number | undefined;
  let unsubscribeCharacter = () => {};

  const persistence = new SafeSaveQueue<typeof settings>({
    label: "overlay settings",
    save: (value) => saveOverlaySettings(value, options.settingsPath),
    onWarning: (warning) => {
      status = "error";
      statusDetail = warning ?? "Could not save overlay settings";
      publish();
    },
  });

  const overlayRpc = BrowserView.defineRPC<OverlayRpc>({
    maxRequestTime: 30_000,
    handlers: {
      requests: {
        getState: () => appState(),
        setLocked: ({ locked }) => {
          // An unlock request may already be in flight when the settings
          // window closes. Never allow that stale request to strand the
          // full-screen overlay in edit mode.
          updateLocked(locked || !settingsWindow);
          return appState();
        },
        setElementPosition: ({ id, x, y }) => {
          const element = settings.elements[id];
          settings = normalizeOverlaySettings({
            ...settings,
            elements: { ...settings.elements, [id]: { ...element, x, y } },
          }, bounds);
          persist();
          publish();
          return appState();
        },
        setElementBounds: ({ id, x, y, width, height }) => {
          const element = settings.elements[id];
          settings = normalizeOverlaySettings({
            ...settings,
            elements: { ...settings.elements, [id]: { ...element, x, y, width, height } },
          }, bounds);
          persist();
          publish();
          return appState();
        },
        setElementOpacity: ({ id, opacity }) => {
          const element = settings.elements[id];
          settings = normalizeOverlaySettings({
            ...settings,
            elements: { ...settings.elements, [id]: { ...element, opacity } },
          }, bounds);
          persist();
          publish();
          return appState();
        },
      },
      messages: {},
    },
  });

  const settingsRpc = BrowserView.defineRPC<OverlaySettingsRpc>({
    maxRequestTime: 30_000,
    handlers: {
      requests: {
        getState: () => appState(),
        setLocked: ({ locked }) => {
          updateLocked(locked);
          return appState();
        },
        setElementEnabled: ({ id, enabled }) => {
          settings.elements[id].enabled = enabled;
          persist();
          publish();
          return appState();
        },
        closeOverlay: async () => {
          await shutdown();
          overlayWindow.close();
        },
        windowAction: ({ action }) => {
          if (action === "minimize") settingsWindow?.minimize();
          else settingsWindow?.close();
        },
        getWindowFrame: () => settingsWindow?.getFrame()
          ?? options.placements?.frame(
            "overlay-settings",
            { x: bounds.x + 80, y: bounds.y + 80, width: SETTINGS_WIDTH, height: SETTINGS_HEIGHT },
            { width: MINIMUM_SETTINGS_WIDTH, height: MINIMUM_SETTINGS_HEIGHT },
          )
          ?? { x: bounds.x + 80, y: bounds.y + 80, width: SETTINGS_WIDTH, height: SETTINGS_HEIGHT },
        setWindowFrame: ({ x, y, width, height }) => {
          settingsWindow?.setFrame(
            x,
            y,
            Math.max(scaledSize(MINIMUM_SETTINGS_WIDTH), width),
            Math.max(scaledSize(MINIMUM_SETTINGS_HEIGHT), height),
          );
        },
      },
      messages: {},
    },
  });

  overlayWindow = new BrowserWindow({
    title: "Spirit Vale Overlay",
    url: "views://overlayview/index.html",
    frame: bounds,
    titleBarStyle: "hidden",
    transparent: true,
    hidden: true,
    rpc: overlayRpc,
  });
  overlayWindow.setAlwaysOnTop(true);
  setWindowClickThrough(overlayWindow.ptr, settings.locked);
  overlayWindow.showInactive();
  overlayWindow.on("close", () => {
    void shutdown();
    notifyClosed();
  });
  const shortcutRegistered = GlobalShortcut.register(LOCK_SHORTCUT, () => {
    if (!shuttingDown) updateLocked(!settings.locked);
  });
  if (!shortcutRegistered) {
    console.warn(`[overlay] could not register ${LOCK_SHORTCUT}; it may already be in use`);
  }

  const pollTimer = setInterval(() => void pollLiveLog(), LIVE_LOG_POLL_MS);
  unsubscribeCharacter = options.subscribeCharacter((next) => {
    characterState = next;
    syncPersonalCharacter(meter, characterState);
    publish();
  });

  if (options.lockOnCreate) persistence.schedule(settings);
  if (options.showSettingsOnCreate !== false) openSettings();
  void pollLiveLog();

  return {
    show: () => openSettings(),
    activate: () => {
      openSettings();
      settingsWindow?.activate();
    },
    close: async () => {
      await shutdown();
      overlayWindow.close();
      notifyClosed();
    },
  };

  function appState(): OverlayState {
    const snapshot = meter.getLatestSnapshot(relativeNowMs());
    const resources = personalResources(characterState.records);
    return {
      locked: settings.locked,
      personalName: detectedPersonalName(characterState),
      status,
      statusDetail,
      elements: settings.elements,
      ...(snapshot ? { snapshot } : {}),
      ...resources,
      ...(characterState.weight ? { weight: characterState.weight } : {}),
    };
  }

  function updateLocked(locked: boolean): void {
    settings.locked = locked;
    setWindowClickThrough(overlayWindow.ptr, locked);
    persist();
    publish();
  }

  function persist(): void {
    persistence.schedule(settings);
  }

  function publish(): void {
    if (publishing || shuttingDown) return;
    publishing = true;
    try {
      const state = appState();
      try { overlayRpc.send.stateChanged(state); } catch { /* View may still be connecting. */ }
      try { settingsRpc.send.stateChanged(state); } catch { /* Settings may be closed. */ }
    } finally {
      publishing = false;
    }
  }

  async function pollLiveLog(): Promise<void> {
    if (polling || shuttingDown) return;
    polling = true;
    try {
      const batch = await liveLog.poll();
      if (batch.reset) {
        meter = createPersonalDpsMeter(characterState);
        lastEventObservedAtMs = undefined;
        lastEventWallMs = undefined;
      }
      let batchLastObservedAtMs: number | undefined;
      for (const { event, observedAtMs } of batch.events) {
        if (event.kind === "actorIdentity") meter.consumeIdentity(event, observedAtMs);
        else meter.consumeCombat(event, observedAtMs);
        batchLastObservedAtMs = Math.max(batchLastObservedAtMs ?? observedAtMs, observedAtMs);
      }
      if (batchLastObservedAtMs !== undefined) {
        lastEventObservedAtMs = batchLastObservedAtMs;
        lastEventWallMs = Date.now();
      }
      const nowMs = relativeNowMs();
      if (nowMs !== undefined) meter.advance(nowMs);
      const fileName = path.basename(batch.path ?? liveLogOverride ?? "combat.jsonl");
      if (batch.missing) {
        status = "waiting";
        statusDetail = `Waiting for ${fileName}`;
      } else if (batch.events.length > 0) {
        status = "capturing";
        statusDetail = batch.invalidLines > 0 ? `Reading ${fileName} with skipped lines` : `Reading ${fileName}`;
      } else {
        status = meter.getLatestSnapshot() ? "ready" : "waiting";
        statusDetail = `Watching ${fileName}`;
      }
      publish();
    } catch {
      status = "error";
      statusDetail = `Could not read ${path.basename(liveLogOverride ?? "combat.jsonl")}`;
      publish();
    } finally {
      polling = false;
    }
  }

  function relativeNowMs(): number | undefined {
    if (lastEventObservedAtMs === undefined || lastEventWallMs === undefined) return undefined;
    return lastEventObservedAtMs + (Date.now() - lastEventWallMs);
  }

  function openSettings(): void {
    if (settingsWindow) {
      settingsWindow.setAlwaysOnTop(true);
      settingsWindow.show();
      settingsWindow.activate();
      return;
    }
    const nextWindow = new BrowserWindow({
      title: "Spirit Vale Overlay Settings",
      url: "views://overlaysettingsview/index.html",
      frame: options.placements?.frame("overlay-settings", {
        x: bounds.x + 80,
        y: bounds.y + 80,
        width: SETTINGS_WIDTH,
        height: SETTINGS_HEIGHT,
      }, { width: MINIMUM_SETTINGS_WIDTH, height: MINIMUM_SETTINGS_HEIGHT }) ?? {
        x: bounds.x + 80,
        y: bounds.y + 80,
        width: SETTINGS_WIDTH,
        height: SETTINGS_HEIGHT,
      },
      titleBarStyle: "hidden",
      transparent: false,
      rpc: settingsRpc,
    });
    settingsWindow = nextWindow;
    nextWindow.setAlwaysOnTop(true);
    applyRoundedCorners(nextWindow.ptr);
    registerUiScaleWindow(nextWindow, { scaleInitialFrame: !options.placements });
    options.placements?.track("overlay-settings", nextWindow);
    nextWindow.show();
    nextWindow.activate();
    nextWindow.on("close", () => {
      if (settingsWindow !== nextWindow) return;
      settingsWindow = undefined;
      if (!shuttingDown) updateLocked(true);
    });
  }

  async function shutdown(): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    clearInterval(pollTimer);
    unsubscribeCharacter();
    unsubscribeCharacter = () => {};
    if (shortcutRegistered) GlobalShortcut.unregister(LOCK_SHORTCUT);
    settingsWindow?.close();
    settingsWindow = undefined;
    await persistence.flush(settings);
  }

  function notifyClosed(): void {
    if (closedCallbackSent) return;
    closedCallbackSent = true;
    options.onClosed?.();
  }
}

export type { OverlayElementId };
