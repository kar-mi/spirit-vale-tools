import { expect, test } from "bun:test";
import path from "node:path";

import config from "../../electrobun.config.ts";

test("Electrobun Bun entrypoint emits the index.js filename required by the Windows launcher", () => {
  expect(path.basename(config.build.bun.entrypoint)).toBe("index.ts");
});

test("Electrobun copies only the runtime-loaded FishNet semantic map", () => {
  const destinations = Object.values(config.build.copy);
  expect(destinations.some((destination) => destination.endsWith(".rpc.json"))).toBe(false);
  expect(destinations).toContain("bun/maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.semantics.json");
});
