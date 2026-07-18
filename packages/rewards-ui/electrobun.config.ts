import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "Spirit Vale Mob Rewards",
    identifier: "dev.spiritvale.rewards",
    version: "0.1.0",
    description: "A build-matched mob reward catalog and passive live reward tracker for Spirit Vale.",
  },
  build: {
    bun: { entrypoint: "src/bun/index.ts" },
    views: { rewardsview: { entrypoint: "src/rewardsview/index.ts" } },
    copy: {
      "src/rewardsview/index.html": "views/rewardsview/index.html",
      "src/rewardsview/index.css": "views/rewardsview/index.css",
      "../ui-theme/theme.css": "views/rewardsview/theme.css",
    },
    buildFolder: "dist/electrobun",
    artifactFolder: "dist/artifacts",
    targets: "win-x64",
    watch: ["src", "../ui-theme"],
    win: { bundleCEF: false, defaultRenderer: "native" },
  },
  runtime: { exitOnLastWindowClosed: true },
} satisfies ElectrobunConfig;
