import path from "node:path";

export interface DesktopStoragePaths {
  readonly portable: boolean;
  readonly root?: string;
  readonly logDirectory: string;
  readonly launcherSettingsPath: string;
  readonly dpsSettingsPath: string;
  readonly overlaySettingsPath: string;
  readonly rewardsSettingsPath: string;
  readonly characterStatePath: string;
}

export interface DesktopStoragePathOptions {
  readonly portableRoot?: string;
  readonly fallbackUserData: string;
  readonly fallbackLogDirectory: string;
}

export function resolveDesktopStoragePaths(options: DesktopStoragePathOptions): DesktopStoragePaths {
  const portableRoot = options.portableRoot?.trim();
  if (portableRoot) {
    const root = path.resolve(portableRoot);
    const dataDirectory = path.join(root, "data");
    const settingsDirectory = path.join(dataDirectory, "settings");
    return {
      portable: true,
      root,
      logDirectory: path.join(dataDirectory, "logs"),
      launcherSettingsPath: path.join(settingsDirectory, "launcher.json"),
      dpsSettingsPath: path.join(settingsDirectory, "dps.json"),
      overlaySettingsPath: path.join(settingsDirectory, "overlay.json"),
      rewardsSettingsPath: path.join(settingsDirectory, "rewards.json"),
      characterStatePath: path.join(dataDirectory, "character.json"),
    };
  }

  return {
    portable: false,
    logDirectory: path.resolve(options.fallbackLogDirectory),
    launcherSettingsPath: path.join(options.fallbackUserData, "spirit-vale-tools", "settings.json"),
    dpsSettingsPath: path.join(options.fallbackUserData, "spirit-vale-dps", "settings.json"),
    overlaySettingsPath: path.join(options.fallbackUserData, "spirit-vale-overlay", "settings.json"),
    rewardsSettingsPath: path.join(options.fallbackUserData, "rewards-settings.json"),
    characterStatePath: path.join(options.fallbackUserData, "spirit-vale-tools", "character.json"),
  };
}
