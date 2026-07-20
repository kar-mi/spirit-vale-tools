import { readFileSync } from "node:fs";
import type { ElectrobunConfig } from "electrobun";

interface PackageJson {
  version?: string;
}

const packageJson = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as PackageJson;
if (!packageJson.version) throw new Error("package.json must define a version before building Electrobun.");

/**
 * Electrobun's `copy` config is a plain `{ [sourcePath]: destPath }` map, so copying the
 * same `theme.css` into every view's own folder needs a textually distinct source key per
 * view even though every one resolves to the same file — otherwise the object literal would
 * silently collapse duplicate keys and most views would end up without a theme.css.
 */
function themeCssSource(variant: number): string {
  return `../ui-theme/${"./".repeat(variant)}theme.css`;
}

export default {
  app: {
    name: "Spirit Vale",
    identifier: "dev.spiritvale.desktop",
    version: packageJson.version,
    description: "Centralized capture and desktop tools for Spirit Vale.",
  },
  build: {
    bun: { entrypoint: "src/desktop/index.ts" },
    views: {
      launcherview: { entrypoint: "src/launcherview/index.ts" },
      settingsview: { entrypoint: "src/settingsview/index.ts" },
      mainview: { entrypoint: "../combat-ui/src/mainview/index.ts" },
      dpssettingsview: { entrypoint: "../combat-ui/src/dpssettingsview/index.ts" },
      characterview: { entrypoint: "src/characterview/index.ts" },
      marketview: { entrypoint: "../market-ui/src/marketview/index.ts" },
      marketfiltersview: { entrypoint: "../market-ui/src/marketfiltersview/index.ts" },
      rewardsview: { entrypoint: "../rewards-ui/src/rewardsview/index.ts" },
      rewardscatalogview: { entrypoint: "../rewards-ui/src/catalogview/index.ts" },
      sessionpickerview: { entrypoint: "src/sessionpickerview/index.ts" },
      analysisview: { entrypoint: "../combat-ui/src/analysisview/index.ts" },
      analysisdetailview: { entrypoint: "../combat-ui/src/analysisdetailview/index.ts" },
    },
    copy: {
      "../../static/icon/eggplant_icon_320px.png": "views/assets/app-icon.png",
      "src/launcherview/index.html": "views/launcherview/index.html",
      "src/launcherview/index.css": "views/launcherview/index.css",
      [themeCssSource(0)]: "views/launcherview/theme.css",
      "src/settingsview/index.html": "views/settingsview/index.html",
      "src/settingsview/index.css": "views/settingsview/index.css",
      [themeCssSource(1)]: "views/settingsview/theme.css",
      "../combat-ui/src/mainview/index.html": "views/mainview/index.html",
      "../combat-ui/src/mainview/index.css": "views/mainview/index.css",
      [themeCssSource(2)]: "views/mainview/theme.css",
      "../combat-ui/src/dpssettingsview/index.html": "views/dpssettingsview/index.html",
      "../combat-ui/src/dpssettingsview/index.css": "views/dpssettingsview/index.css",
      [themeCssSource(3)]: "views/dpssettingsview/theme.css",
      "src/characterview/index.html": "views/characterview/index.html",
      "src/characterview/index.css": "views/characterview/index.css",
      [themeCssSource(4)]: "views/characterview/theme.css",
      "../market-ui/src/marketview/index.html": "views/marketview/index.html",
      "../market-ui/src/marketview/index.css": "views/marketview/index.css",
      [themeCssSource(5)]: "views/marketview/theme.css",
      "../market-ui/src/marketfiltersview/index.html": "views/marketfiltersview/index.html",
      "../market-ui/src/marketfiltersview/index.css": "views/marketfiltersview/index.css",
      [themeCssSource(6)]: "views/marketfiltersview/theme.css",
      "../rewards-ui/src/rewardsview/index.html": "views/rewardsview/index.html",
      "../rewards-ui/src/rewardsview/index.css": "views/rewardsview/index.css",
      [themeCssSource(7)]: "views/rewardsview/theme.css",
      "../rewards-ui/src/catalogview/index.html": "views/rewardscatalogview/index.html",
      "../rewards-ui/src/catalogview/index.css": "views/rewardscatalogview/index.css",
      [themeCssSource(8)]: "views/rewardscatalogview/theme.css",
      "src/sessionpickerview/index.html": "views/sessionpickerview/index.html",
      "src/sessionpickerview/index.css": "views/sessionpickerview/index.css",
      [themeCssSource(9)]: "views/sessionpickerview/theme.css",
      "../combat-ui/src/analysisview/index.html": "views/analysisview/index.html",
      "../combat-ui/src/analysisview/index.css": "views/analysisview/index.css",
      [themeCssSource(10)]: "views/analysisview/theme.css",
      "../combat-ui/src/analysisdetailview/index.html": "views/analysisdetailview/index.html",
      "../combat-ui/src/analysisdetailview/index.css": "views/analysisdetailview/index.css",
      [themeCssSource(11)]: "views/analysisdetailview/theme.css",
    },
    buildFolder: "dist/electrobun",
    artifactFolder: "dist/artifacts",
    targets: "win-x64",
    watch: ["src", "../character/src", "../combat-ui/src", "../core/src/fishnet", "../items/src", "../market-ui/src", "../rewards-ui/src", "../ui-theme"],
    win: {
      bundleCEF: false,
      defaultRenderer: "native",
      icon: "../../static/icon/eggplant_icon_320px.png",
    },
  },
  runtime: {
    exitOnLastWindowClosed: true,
  },
  scripts: {
    postBuild: "../../scripts/embed-electrobun-windows-icon.ts",
    postPackage: "../../scripts/embed-electrobun-windows-installer-icon.ts",
  },
} satisfies ElectrobunConfig;
