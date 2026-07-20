import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import path from "node:path";

import config from "../../electrobun.config.ts";

test("Electrobun Bun entrypoint emits the index.js filename required by the Windows launcher", () => {
  expect(path.basename(config.build.bun.entrypoint)).toBe("index.ts");
});

test("Electrobun does not copy runtime definition JSON", () => {
  const destinations = Object.values(config.build.copy);
  expect(destinations.some((destination) => destination.startsWith("bun/maps/"))).toBe(false);
});

test("Electrobun builds and copies the DPS settings view", () => {
  expect(config.build.views.mainview).toEqual({ entrypoint: "../combat-ui/src/mainview/index.tsx" });
  expect(config.build.views.dpssettingsview).toEqual({ entrypoint: "../combat-ui/src/dpssettingsview/index.tsx" });
  expect(config.build.copy["../combat-ui/src/dpssettingsview/index.html"]).toBe("views/dpssettingsview/index.html");
  expect(config.build.copy["../combat-ui/src/dpssettingsview/index.css"]).toBe("views/dpssettingsview/index.css");
});

test("Electrobun builds and copies the combat analysis views", () => {
  expect(config.build.views.analysisview).toEqual({ entrypoint: "../combat-ui/src/analysisview/index.tsx" });
  expect(config.build.views.analysisdetailview).toEqual({ entrypoint: "../combat-ui/src/analysisdetailview/index.tsx" });
  expect(config.build.copy["../combat-ui/src/analysisview/index.html"]).toBe("views/analysisview/index.html");
  expect(config.build.copy["../combat-ui/src/analysisdetailview/index.html"]).toBe("views/analysisdetailview/index.html");
});

test("every configured static asset source exists", () => {
  for (const source of Object.keys(config.build.copy)) {
    expect(existsSync(path.resolve(import.meta.dir, "../..", source))).toBe(true);
  }
});

test("Electrobun uses the bundled eggplant artwork for the Windows application icon", () => {
  const icon = config.build.win.icon;
  expect(icon).toBe("../../static/icon/eggplant_icon_320px.png");
  expect(existsSync(path.resolve(import.meta.dir, "../..", icon))).toBe(true);
  expect(config.build.copy["../../static/icon/eggplant_icon_320px.png"]).toBe("views/assets/app-icon.png");
  expect(config.scripts?.postBuild).toBe("../../scripts/embed-electrobun-windows-icon.ts");
  expect(config.scripts?.postPackage).toBe("../../scripts/embed-electrobun-windows-installer-icon.ts");
});
