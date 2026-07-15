import { describe, expect, test } from "bun:test";

import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";
import type { CapturedFishNetPacket } from "../fishnet/types.ts";
import type { CapturedUdpPacket } from "../types.ts";
import {
  formatCombatEvent,
  formatCombatEventJson,
  formatFishNetPacket,
  formatLiteNetLibPacket,
  formatTransportPacket,
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

describe("formatTransportPacket", () => {
  test("renders outbound UDP from source to destination", () => {
    expect(formatTransportPacket(udpPacket("outbound"))).toBe(
      "UDP 192.0.2.10:50000 -> 198.51.100.20:7007 payload=032000",
    );
  });

  test("renders inbound UDP from its remote source to its local destination", () => {
    expect(formatTransportPacket(udpPacket("inbound"))).toBe(
      "UDP 198.51.100.20:7007 -> 192.0.2.10:50000 payload=042000e68b47f982e2de08",
    );
  });
});

describe("formatFishNetPacket", () => {
  test("formats verified headers without inventing a name", () => {
    const udp = udpPacket("outbound");
    const liteNetPacket: CapturedLiteNetLibPacket = {
      udpPacket: udp,
      mergePath: [],
      packet: {
        propertyId: 0,
        property: "unreliable",
        connectionNumber: 0,
        fragmented: false,
        raw: Buffer.alloc(0),
        payload: Buffer.alloc(0),
      },
    };
    const packet: CapturedFishNetPacket = {
      liteNetPacket,
      tick: 42,
      packetId: 8,
      packetName: "serverRpc",
      objectId: 7,
      networkBehaviourIndex: 2,
      rpcHash: 5,
      rpcHash16Candidate: 261,
      raw: Buffer.alloc(0),
      payload: Buffer.from("aabb", "hex"),
    };
    expect(formatFishNetPacket(packet)).toBe(
      "    FISHNET tick=42 id=8 kind=serverRpc object=7:2 rpc=5 rpc16?=261 bytes=2 payload=aabb",
    );
  });

  test("formats resolved RPC Links with their registered kind", () => {
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
    expect(formatFishNetPacket(packet)).toBe(
      "    FISHNET tick=50 bundle=1 id=900 kind=rpcLink link=900:observersRpc object=12:3 behaviour=SyntheticMover" +
        " rpc=77:RpcSyntheticNotice fields=active:true,input.move:%5B2%3B0%3B-3%5D,input.hotkeys:%220x800%22" +
        " bytes=1 payload=01",
    );
  });
});

describe("formatLiteNetLibPacket", () => {
  test("formats a merged channeled leaf", () => {
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
    expect(formatLiteNetLibPacket(decoded)).toBe(
      "  LNL path=1.0 kind=channeled seq=4660 channel=7 fragment=258:772/1286 bytes=2 payload=aabb",
    );
  });
});

describe("formatCombatEvent", () => {
  test("makes ambiguous overlapping activations explicit", () => {
    expect(formatCombatEvent({
      kind: "damage",
      rpc: "ApplyDamage_C",
      tick: 70,
      payloadBytes: 42,
      fields: {},
      actorId: 10,
      targetId: 20,
      sourceId: "SyntheticStorm",
      sourceLabel: "Synthetic Storm",
      value: 17,
      hitResult: "critical",
      wireHits: 1,
      damageType: 0,
      team: 0,
      element: 0,
      weaponType: 4,
      range: 2,
      isClone: false,
      isSummon: false,
      position: [1, 2, 3],
      origin: [4, 5, 6],
      attribution: "ambiguous",
      candidateActivationIds: ["activation-1", "activation-2"],
    })).toBe(
      "COMBAT tick=70 actor=10 action=damage sourceId=SyntheticStorm source=Synthetic%20Storm target=20 value=17" +
        " hit=critical attribution=ambiguous candidates=activation-1,activation-2",
    );
  });

  test("formats structured combat events as JSON Lines", () => {
    const line = formatCombatEventJson({
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
    expect(JSON.parse(line)).toMatchObject({
      kind: "death",
      rpc: "Death_C",
      payloadBytes: 25,
      fields: { "dmg.Value": 125, "dmg.DamageSourceId": "SyntheticStrike" },
      duplicatesDamageEvent: false,
    });
  });
});
