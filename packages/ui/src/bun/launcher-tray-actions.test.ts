import { expect, test } from "bun:test";

import { isTrayDoubleClick, launcherCloseAction, trayAction } from "./launcher-tray-actions.ts";

test("launcher close hides only when close-to-tray is enabled", () => {
  expect(launcherCloseAction(false)).toBe("shutdown");
  expect(launcherCloseAction(true)).toBe("hide");
});

test("tray menu actions restore the launcher or perform a full exit", () => {
  expect(trayAction("")).toBeUndefined();
  expect(trayAction("show-launcher")).toBe("show-launcher");
  expect(trayAction("open-combat")).toBe("open-combat");
  expect(trayAction("open-overlay")).toBe("open-overlay");
  expect(trayAction("open-rewards")).toBe("open-rewards");
  expect(trayAction("open-market")).toBe("open-market");
  expect(trayAction("exit")).toBe("exit");
  expect(trayAction("unknown")).toBeUndefined();
});

test("two nearby tray-icon clicks are a double click", () => {
  expect(isTrayDoubleClick(0, 100)).toBe(false);
  expect(isTrayDoubleClick(1_000, 1_350)).toBe(true);
  expect(isTrayDoubleClick(1_000, 1_351)).toBe(false);
});
