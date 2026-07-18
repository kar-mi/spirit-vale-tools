import type { CapturedTransportPacket, CapturedLiteNetLibPacket, CapturedFishNetPacket } from "@spiritvale/core";
import type { JsonData, JsonObject } from "@spiritvale/logging";

export function transportPacketData(packet: CapturedTransportPacket): JsonObject {
  return {
    protocol: packet.protocol,
    timestampTicks: packet.timestampTicks.toString(),
    capturedAt: packet.capturedAt.toISOString(),
    interfaceIndex: packet.interfaceIndex,
    subinterfaceIndex: packet.subinterfaceIndex,
    direction: packet.direction,
    loopback: packet.loopback,
    ipVersion: packet.ipVersion,
    sourceIP: packet.sourceIP,
    destinationIP: packet.destinationIP,
    sourcePort: packet.sourcePort,
    destinationPort: packet.destinationPort,
    truncated: packet.truncated,
    payloadHex: packet.payload.toString("hex"),
    ...(packet.protocol === "tcp" ? {
      sequenceNumber: packet.sequenceNumber,
      acknowledgementNumber: packet.acknowledgementNumber,
      tcpFlags: packet.tcpFlags,
    } : {}),
  };
}

export function liteNetLibPacketData(decoded: CapturedLiteNetLibPacket): JsonObject {
  const packet = decoded.packet;
  return {
    mergePath: decoded.mergePath,
    propertyId: packet.propertyId,
    property: packet.property,
    connectionNumber: packet.connectionNumber,
    fragmented: packet.fragmented,
    rawHex: packet.raw.toString("hex"),
    payloadHex: packet.payload.toString("hex"),
    ...(packet.property === "channeled" ? {
      sequence: packet.sequence,
      channel: packet.channel,
      ...(packet.fragment ? { fragment: jsonValue(packet.fragment) } : {}),
    } : {}),
    ...("sequence" in packet && packet.property !== "channeled" ? { sequence: packet.sequence } : {}),
    ...(packet.property === "ack" ? { channel: packet.channel } : {}),
    ...(packet.property === "pong" ? { timestamp: packet.timestamp.toString() } : {}),
  };
}

export function fishNetPacketData(packet: CapturedFishNetPacket): JsonObject {
  return {
    tick: packet.tick,
    packetId: packet.packetId,
    packetName: packet.packetName,
    rawHex: packet.raw.toString("hex"),
    payloadHex: packet.payload.toString("hex"),
    ...optionalJsonFields(packet, [
      "objectId", "ownerConnectionId", "networkBehaviourIndex", "rpcPayloadLength", "rpcHash",
      "rpcHash16Candidate", "rpcName", "rpcResolution", "networkBehaviourType", "decodedFields",
      "bundleIndex", "linkId", "linkedPacketName", "linkResolved", "registeredObjectId",
      "registeredComponentIndex", "registeredRpcHash", "spawnType", "spawnCollectionId", "spawnPrefabId",
      "spawnNested", "rpcLinkRegistrations", "syncIndex", "syncName", "broadcastHash", "broadcastName",
    ]),
    ...(packet.spawnSceneId === undefined ? {} : { spawnSceneId: packet.spawnSceneId.toString() }),
    ...(packet.undecodedPayload === undefined ? {} : { undecodedPayloadHex: packet.undecodedPayload.toString("hex") }),
    ...(packet.syncPayload === undefined ? {} : { syncPayloadHex: packet.syncPayload.toString("hex") }),
  };
}

export function domainEventData(event: object): JsonObject {
  return jsonValue(event) as JsonObject;
}

function optionalJsonFields(value: object, keys: readonly string[]): JsonObject {
  const record = value as Record<string, unknown>;
  return Object.fromEntries(keys.flatMap((key) => record[key] === undefined ? [] : [[key, jsonValue(record[key])]]));
}

function jsonValue(value: unknown): JsonData {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : String(value);
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return value.toString("hex");
  if (Array.isArray(value)) return value.map(jsonValue);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, entry]) => entry === undefined ? [] : [[key, jsonValue(entry)]]));
  }
  return String(value);
}
