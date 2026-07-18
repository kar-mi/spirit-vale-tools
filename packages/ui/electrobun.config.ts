import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "Spirit Vale",
    identifier: "dev.spiritvale.desktop",
    version: "0.1.0",
    description: "Centralized capture and desktop tools for Spirit Vale.",
  },
  build: {
    bun: { entrypoint: "src/desktop/index.ts" },
    views: {
      launcherview: { entrypoint: "src/launcherview/index.ts" },
      mainview: { entrypoint: "src/mainview/index.ts" },
      marketview: { entrypoint: "../market-ui/src/marketview/index.ts" },
      rewardsview: { entrypoint: "../rewards-ui/src/rewardsview/index.ts" },
      rewardscatalogview: { entrypoint: "../rewards-ui/src/catalogview/index.ts" },
      sessionpickerview: { entrypoint: "src/sessionpickerview/index.ts" },
    },
    copy: {
      "src/launcherview/index.html": "views/launcherview/index.html",
      "src/launcherview/index.css": "views/launcherview/index.css",
      "../ui-theme/theme.css": "views/launcherview/theme.css",
      "src/mainview/index.html": "views/mainview/index.html",
      "src/mainview/index.css": "views/mainview/index.css",
      "../ui-theme/./theme.css": "views/mainview/theme.css",
      "../market-ui/src/marketview/index.html": "views/marketview/index.html",
      "../market-ui/src/marketview/index.css": "views/marketview/index.css",
      "../ui-theme/../ui-theme/theme.css": "views/marketview/theme.css",
      "../rewards-ui/src/rewardsview/index.html": "views/rewardsview/index.html",
      "../rewards-ui/src/rewardsview/index.css": "views/rewardsview/index.css",
      "../ui-theme/../../packages/ui-theme/theme.css": "views/rewardsview/theme.css",
      "../rewards-ui/src/catalogview/index.html": "views/rewardscatalogview/index.html",
      "../rewards-ui/src/catalogview/index.css": "views/rewardscatalogview/index.css",
      "../ui-theme/././theme.css": "views/rewardscatalogview/theme.css",
      "src/sessionpickerview/index.html": "views/sessionpickerview/index.html",
      "src/sessionpickerview/index.css": "views/sessionpickerview/index.css",
      "../ui-theme/./../ui-theme/theme.css": "views/sessionpickerview/theme.css",
    },
    buildFolder: "dist/electrobun",
    artifactFolder: "dist/artifacts",
    targets: "win-x64",
    watch: ["src", "../core/src/fishnet", "../market-ui/src", "../rewards-ui/src", "../ui-theme"],
    win: {
      bundleCEF: false,
      defaultRenderer: "native",
    },
  },
  runtime: {
    exitOnLastWindowClosed: true,
  },
} satisfies ElectrobunConfig;
