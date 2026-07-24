export type LauncherCloseAction = "hide" | "shutdown";
export type TrayAction = "show-launcher" | "exit" | undefined;

export function launcherCloseAction(closeToTray: boolean): LauncherCloseAction {
  return closeToTray ? "hide" : "shutdown";
}

export function trayAction(action: string): TrayAction {
  if (action === "" || action === "show-launcher") return "show-launcher";
  if (action === "exit") return "exit";
  return undefined;
}
