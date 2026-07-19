import { describe, expect, test } from "bun:test";

import { chooseDeviceByRouteOutput } from "./adapter-selection.ts";
import { DATA_LINK, extractIpPacket } from "./link-layer.ts";
import { parseTransportPacket } from "./packet-parser.ts";
import { WindowsTargetTracker, parseNetstat, parseTaskList } from "./target-tracker.ts";
import type { NpcapDevice } from "./npcap.ts";

const devices: NpcapDevice[] = [
  { name: "device-a", description: "Fictional Ethernet A", addresses: ["192.0.2.10"], loopback: false },
  { name: "device-b", description: "Fictional Ethernet B", addresses: ["198.51.100.10"], loopback: false },
];

describe("Npcap capture behavior", () => {
  test("selects the lowest-metric default route by adapter address", () => {
    const output = [
      "0.0.0.0  0.0.0.0  192.0.2.1  192.0.2.10  25",
      "0.0.0.0  0.0.0.0  198.51.100.1  198.51.100.10  5",
    ].join("\r\n");
    expect(chooseDeviceByRouteOutput(devices, output)?.name).toBe("device-b");
  });

  test("strips Ethernet VLAN and loopback headers", () => {
    const ip = Buffer.from([0x45, 0, 0, 20, ...new Array(16).fill(0)]);
    const ethernet = Buffer.concat([Buffer.alloc(12), Buffer.from([0x81, 0x00, 0, 1, 0x08, 0x00]), ip]);
    expect(extractIpPacket(ethernet, DATA_LINK.ETHERNET)).toEqual(ip);
    const loopback = Buffer.concat([Buffer.from([2, 0, 0, 0]), ip]);
    expect(extractIpPacket(loopback, DATA_LINK.NULL)).toEqual(ip);
  });

  test("parses normalized TCP and UDP payloads", () => {
    const udp = ipv4(17, 8, Buffer.from([1, 2]));
    udp.writeUInt16BE(10, 24);
    const parsedUdp = parseTransportPacket(udp, context());
    expect(parsedUdp).toMatchObject({ protocol: "udp", sourceIP: "192.0.2.10", destinationIP: "198.51.100.20" });
    expect(parsedUdp?.payload).toEqual(Buffer.from([1, 2]));

    const tcp = ipv4(6, 20, Buffer.from([3]));
    tcp[32] = 0x50;
    tcp[33] = 0x18;
    const parsedTcp = parseTransportPacket(tcp, context());
    expect(parsedTcp).toMatchObject({ protocol: "tcp", tcpFlags: 0x18 });
    expect(parsedTcp?.payload).toEqual(Buffer.from([3]));
  });

  test("parses fictional process and endpoint command output", () => {
    expect(parseTaskList('"FictionalGame.exe","4242","Console","1","10,000 K"\r\n')).toEqual([4242]);
    const endpoints = parseNetstat("UDP    0.0.0.0:50000    *:*    4242\r\n", "udp");
    expect(endpoints).toEqual([{ protocol: "udp", address: "0.0.0.0", port: 50_000, processId: 4242 }]);
  });

  test("recovers after a target snapshot failure without losing the refresh loop", async () => {
    let calls = 0;
    const warnings: string[] = [];
    const statuses: string[] = [];
    const tracker = new WindowsTargetTracker(
      "SyntheticGame.exe",
      ["udp"],
      ({ state }) => statuses.push(state),
      {
        snapshot: async () => {
          calls += 1;
          if (calls === 1) throw new Error("synthetic snapshot failure");
          return {
            processIds: [4242],
            endpoints: [{ protocol: "udp", address: "192.0.2.10", port: 7777, processId: 4242 }],
          };
        },
      },
      (message) => warnings.push(message),
      1,
    );

    await tracker.start();
    await Bun.sleep(10);
    tracker.stop();

    expect(warnings).toEqual(["target refresh failed: synthetic snapshot failure"]);
    expect(statuses).toContain("active");
    expect(tracker.classify({
      protocol: "udp",
      sourceIP: "192.0.2.10",
      sourcePort: 7777,
      destinationIP: "198.51.100.20",
      destinationPort: 8888,
    } as never)).toBe("outbound");
  });
});

function context() {
  return {
    capturedAt: new Date(0),
    timestampTicks: 1n,
    interfaceIndex: 0,
    direction: "outbound" as const,
    loopback: false,
  };
}

function ipv4(protocol: number, transportLength: number, payload: Buffer): Buffer {
  const total = 20 + transportLength + payload.length;
  const data = Buffer.alloc(total);
  data[0] = 0x45;
  data.writeUInt16BE(total, 2);
  data[9] = protocol;
  data.set([192, 0, 2, 10], 12);
  data.set([198, 51, 100, 20], 16);
  data.writeUInt16BE(50_000, 20);
  data.writeUInt16BE(7_004, 22);
  payload.copy(data, 20 + transportLength);
  return data;
}
