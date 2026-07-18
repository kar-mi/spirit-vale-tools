import { expect, test } from "bun:test";
import path from "node:path";

import config from "../../electrobun.config.ts";

test("Electrobun Bun entrypoint emits the index.js filename required by the Windows launcher", () => {
  expect(path.basename(config.build.bun.entrypoint)).toBe("index.ts");
});

test("Electrobun copies runtime-loaded FishNet maps beside the bundled Bun entrypoint", () => {
  const destinations = Object.values(config.build.copy);
  expect(destinations).toContain("bun/maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.rpc.json");
  expect(destinations).toContain("bun/maps/9c7d0e597410eaabb7ae478aeba201152e556586acd1fd3dde14566c1c7acec4.semantics.json");
});
