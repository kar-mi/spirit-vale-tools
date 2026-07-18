import { describe, expect, test } from "bun:test";

import type { CapturedLiteNetLibPacket, CapturedFishNetPacket, CapturedUdpPacket } from "@spiritvale/core";
import {
  domainEventData,
  fishNetPacketData,
  liteNetLibPacketData,
  transportPacketData,
} from "./format-packet.ts";

function udpPacket(direction: "inbound" | "outbound"): CapturedUdpPacket {
  const outbound = direction === "outbound";
  return {
    protocol: "udp",
    timestampTicks: 0n,
    capturedAt: new Date(0),
    interfaceIndex: 1,
    subinterfaceIndex: 0,
    direction,
    loopback: false,
    ipVersion: 4,
    sourceIP: outbound ? "192.0.2.10" : "198.51.100.20",
    destinationIP: outbound ? "198.51.100.20" : "192.0.2.10",
    sourcePort: outbound ? 50000 : 7007,
    destinationPort: outbound ? 7007 : 50000,
    truncated: false,
    payload: Buffer.from(outbound ? "032000" : "042000e68b47f982e2de08", "hex"),
  };
}

describe("transportPacketData", () => {
  test("serializes transport metadata and payloads for JSON logs", () => {
    expect(transportPacketData(udpPacket("outbound"))).toMatchObject({
      protocol: "udp",
      timestampTicks: "0",
      capturedAt: "1970-01-01T00:00:00.000Z",
      sourceIP: "192.0.2.10",
      destinationIP: "198.51.100.20",
      payloadHex: "032000",
    });
  });
});

describe("fishNetPacketData", () => {
  test("serializes resolved RPC Links with their decoded fields", () => {
    const udp = udpPacket("inbound");
    const liteNetPacket: CapturedLiteNetLibPacket = {
      udpPacket: udp,
      mergePath: [],
      packet: {
        propertyId: 1,
        property: "channeled",
        connectionNumber: 0,
        fragmented: false,
        sequence: 1,
        channel: 0,
        raw: Buffer.alloc(0),
        payload: Buffer.alloc(0),
      },
    };
    const packet: CapturedFishNetPacket = {
      liteNetPacket,
      connectionId: "10.0.0.1:7770<->10.0.0.2:5000#0",
      tick: 50,
      bundleIndex: 1,
      packetId: 900,
      packetName: "rpcLink",
      linkId: 900,
      linkResolved: true,
      linkedPacketName: "observersRpc",
      objectId: 12,
      networkBehaviourIndex: 3,
      networkBehaviourType: "SyntheticMover",
      rpcHash: 77,
      rpcName: "RpcSyntheticNotice",
      rpcResolution: "verified",
      decodedFields: [
        { name: "active", typeName: "System.Boolean", codec: "boolean", value: true },
        { name: "input.move", typeName: "SyntheticVector3Int", codec: "vector3IntPacked", value: [2, 0, -3] },
        { name: "input.hotkeys", typeName: "System.UInt64", codec: "packedUInt64", value: "0x800" },
      ],
      raw: Buffer.alloc(0),
      payload: Buffer.from([1]),
    };
    const data = fishNetPacketData(packet);
    expect(data).toMatchObject({ tick: 50, packetName: "rpcLink", payloadHex: "01" });
    expect(JSON.stringify(data["decodedFields"])).toBe(JSON.stringify(packet.decodedFields));
  });
});

describe("liteNetLibPacketData", () => {
  test("serializes a merged channeled leaf", () => {
    const udp = udpPacket("inbound");
    const decoded: CapturedLiteNetLibPacket = {
      udpPacket: udp,
      mergePath: [1, 0],
      packet: {
        propertyId: 1,
        property: "channeled",
        connectionNumber: 0,
        fragmented: true,
        raw: Buffer.from("81341207020104030605aabb", "hex"),
        sequence: 0x1234,
        channel: 7,
        fragment: { id: 0x0102, part: 0x0304, total: 0x0506 },
        payload: Buffer.from("aabb", "hex"),
      },
    };
    expect(liteNetLibPacketData(decoded)).toMatchObject({
      mergePath: [1, 0],
      property: "channeled",
      payloadHex: "aabb",
      fragment: { id: 258, part: 772, total: 1286 },
    });
  });
});

describe("domainEventData", () => {
  test("serializes structured combat events for JSON logs", () => {
    const data = domainEventData({
      kind: "death",
      rpc: "Death_C",
      tick: 71,
      payloadBytes: 25,
      fields: { "dmg.Value": 125, "dmg.DamageSourceId": "SyntheticStrike" },
      actorId: 10,
      targetId: 20,
      sourceId: "SyntheticStrike",
      sourceLabel: "Synthetic Strike",
      value: 125,
      hitResult: "normal",
      wireHits: 1,
      damageType: 0,
      team: 0,
      element: 0,
      weaponType: 4,
      range: 2,
      isClone: false,
      isSummon: false,
      attribution: "exact",
      activationId: "activation-1",
      duplicatesDamageEvent: false,
    });
    expect(data).toMatchObject({
      kind: "death",
      rpc: "Death_C",
      payloadBytes: 25,
      fields: { "dmg.Value": 125, "dmg.DamageSourceId": "SyntheticStrike" },
      duplicatesDamageEvent: false,
    });
  });

  test("serializes actor identity lifecycle events for JSON logs", () => {
    expect(domainEventData({
      kind: "actorIdentity",
      operation: "upsert",
      tick: 72,
      actorId: 10,
      displayName: "Aster Vale",
      archetype: 2,
    })).toEqual({
      kind: "actorIdentity",
      operation: "upsert",
      tick: 72,
      actorId: 10,
      displayName: "Aster Vale",
      archetype: 2,
    });
  });
});
