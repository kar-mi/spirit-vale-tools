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
  expect(config.build.views.dpssettingsview).toEqual({ entrypoint: "src/dpssettingsview/index.ts" });
  expect(config.build.copy["src/dpssettingsview/index.html"]).toBe("views/dpssettingsview/index.html");
  expect(config.build.copy["src/dpssettingsview/index.css"]).toBe("views/dpssettingsview/index.css");
});

test("Electrobun uses the bundled eggplant artwork for the Windows application icon", () => {
  const icon = config.build.win.icon;
  expect(icon).toBe("../../static/icon/eggplant_icon_320px.png");
  expect(existsSync(path.resolve(import.meta.dir, "../..", icon))).toBe(true);
  expect(config.build.copy["../../static/icon/eggplant_icon_320px.png"]).toBe("views/assets/app-icon.png");
  expect(config.scripts?.postBuild).toBe("../../scripts/embed-electrobun-windows-icon.ts");
  expect(config.scripts?.postPackage).toBe("../../scripts/embed-electrobun-windows-installer-icon.ts");
});
