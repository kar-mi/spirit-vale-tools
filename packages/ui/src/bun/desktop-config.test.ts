import { expect, test } from "bun:test";
import path from "node:path";

import config from "../../electrobun.config.ts";

test("Electrobun Bun entrypoint emits the index.js filename required by the Windows launcher", () => {
  expect(path.basename(config.build.bun.entrypoint)).toBe("index.ts");
});

test("Electrobun does not copy runtime definition JSON", () => {
  const destinations = Object.values(config.build.copy);
  expect(destinations.some((destination) => destination.startsWith("bun/maps/"))).toBe(false);
});
