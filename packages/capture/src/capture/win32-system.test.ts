import path from "node:path";

import { expect, test } from "bun:test";

import { findProcessIdsByName, listOwnedEndpoints } from "./win32-system.ts";

const windowsTest = process.platform === "win32" ? test : test.skip;

windowsTest("finds the current process without launching a command", () => {
  const executableName = path.win32.basename(process.execPath);
  expect(findProcessIdsByName(executableName)).toContain(process.pid);
});

windowsTest("reads PID-owned TCP and UDP endpoints", async () => {
  const tcp = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response() });
  const udp = await Bun.udpSocket({});
  try {
    const endpoints = listOwnedEndpoints(["tcp", "udp"]);
    expect(endpoints).toContainEqual(expect.objectContaining({
      protocol: "tcp",
      address: "127.0.0.1",
      port: tcp.port,
      processId: process.pid,
    }));
    expect(endpoints).toContainEqual(expect.objectContaining({
      protocol: "udp",
      port: udp.port,
      processId: process.pid,
    }));
  } finally {
    tcp.stop(true);
    udp.close();
  }
});
