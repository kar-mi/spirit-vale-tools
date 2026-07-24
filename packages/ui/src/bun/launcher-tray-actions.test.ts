import { expect, test } from "bun:test";

import { launcherCloseAction, trayAction } from "./launcher-tray-actions.ts";

test("launcher close hides only when close-to-tray is enabled", () => {
  expect(launcherCloseAction(false)).toBe("shutdown");
  expect(launcherCloseAction(true)).toBe("hide");
});

test("tray actions restore the launcher or perform a full exit", () => {
  expect(trayAction("")).toBe("show-launcher");
  expect(trayAction("show-launcher")).toBe("show-launcher");
  expect(trayAction("exit")).toBe("exit");
  expect(trayAction("unknown")).toBeUndefined();
});
