import { expect, test } from "bun:test";
import path from "node:path";

import { resolveDesktopStoragePaths } from "./portable-paths.ts";

test("portable storage remains beneath the extracted application root", () => {
  const root = path.resolve("fictional-portable-app");
  const paths = resolveDesktopStoragePaths({
    portableRoot: `  ${root}  `,
    fallbackUserData: path.resolve("fictional-user-data"),
    fallbackLogDirectory: path.resolve("fictional-workspace-logs"),
  });

  expect(paths).toEqual({
    portable: true,
    root,
    logDirectory: path.join(root, "data", "logs"),
    launcherSettingsPath: path.join(root, "data", "settings", "launcher.json"),
    dpsSettingsPath: path.join(root, "data", "settings", "dps.json"),
    overlaySettingsPath: path.join(root, "data", "settings", "overlay.json"),
    rewardsSettingsPath: path.join(root, "data", "settings", "rewards.json"),
    windowPlacementsPath: path.join(root, "data", "settings", "windows.json"),
    characterStatePath: path.join(root, "data", "character.json"),
  });
});

test("development storage retains the existing user-data and workspace locations", () => {
  const userData = path.resolve("fictional-user-data");
  const logs = path.resolve("fictional-workspace-logs");
  const paths = resolveDesktopStoragePaths({
    fallbackUserData: userData,
    fallbackLogDirectory: logs,
  });

  expect(paths.portable).toBe(false);
  expect(paths.root).toBeUndefined();
  expect(paths.logDirectory).toBe(logs);
  expect(paths.launcherSettingsPath).toBe(path.join(userData, "spirit-vale-tools", "settings.json"));
  expect(paths.dpsSettingsPath).toBe(path.join(userData, "spirit-vale-dps", "settings.json"));
  expect(paths.overlaySettingsPath).toBe(path.join(userData, "spirit-vale-overlay", "settings.json"));
  expect(paths.rewardsSettingsPath).toBe(path.join(userData, "rewards-settings.json"));
  expect(paths.windowPlacementsPath).toBe(path.join(userData, "spirit-vale-tools", "windows.json"));
  expect(paths.characterStatePath).toBe(path.join(userData, "spirit-vale-tools", "character.json"));
});
