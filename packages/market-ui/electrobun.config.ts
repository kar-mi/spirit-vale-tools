import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "Spirit Vale Market",
    identifier: "dev.spiritvale.market",
    version: "0.1.0",
    description: "A passive local browser for the current Spirit Vale market session.",
  },
  build: {
    bun: { entrypoint: "src/bun/index.ts" },
    views: {
      marketview: { entrypoint: "src/marketview/index.ts" },
    },
    copy: {
      "src/marketview/index.html": "views/marketview/index.html",
      "src/marketview/index.css": "views/marketview/index.css",
      "../ui-theme/theme.css": "views/marketview/theme.css",
    },
    buildFolder: "dist/electrobun",
    artifactFolder: "dist/artifacts",
    targets: "win-x64",
    watch: ["src", "../ui-theme"],
    win: {
      bundleCEF: false,
      defaultRenderer: "native",
    },
  },
  runtime: {
    exitOnLastWindowClosed: true,
  },
} satisfies ElectrobunConfig;
