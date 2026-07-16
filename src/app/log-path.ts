import os from "node:os";
import path from "node:path";

const APP_IDENTIFIER = "dev.spiritvale.dps";

export function defaultCombatLogPath(appDataRoot = systemAppDataRoot()): string {
  return path.join(appDataRoot, APP_IDENTIFIER, "combat.log");
}

function systemAppDataRoot(): string {
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  }
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Application Support");
  return process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
}
