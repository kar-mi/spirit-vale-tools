import type { CapturedTransportPacket, CapturedLiteNetLibPacket, CapturedFishNetPacket } from "@spiritvale/core";
import type { FishNetCombatEvent, FishNetActorIdentityEvent } from "@spiritvale/combat";
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

export function domainEventData(event: FishNetCombatEvent | FishNetActorIdentityEvent): JsonObject {
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

export function formatTransportPacket(packet: CapturedTransportPacket): string {
  const tcp = packet.protocol === "tcp"
    ? ` seq=${packet.sequenceNumber} ack=${packet.acknowledgementNumber} flags=0x${packet.tcpFlags.toString(16).padStart(2, "0")}`
    : "";
  return `${packet.protocol.toUpperCase()} ${packet.sourceIP}:${packet.sourcePort} -> ${packet.destinationIP}:${packet.destinationPort}` +
    `${tcp} payload=${packet.payload.toString("hex")}`;
}

export function formatFishNetPacket(packet: CapturedFishNetPacket): string {
  const bundle = packet.bundleIndex === undefined ? "" : ` bundle=${packet.bundleIndex}`;
  const object = packet.objectId === undefined
    ? ""
    : ` object=${packet.objectId}${packet.networkBehaviourIndex === undefined ? "" : `:${packet.networkBehaviourIndex}`}`;
  const behaviour = packet.networkBehaviourType ? ` behaviour=${packet.networkBehaviourType}` : "";
  const rpc = packet.rpcHash === undefined
    ? ""
    : ` rpc=${packet.rpcHash}${packet.rpcName ? `:${packet.rpcName}` : ""}`;
  const candidate = packet.rpcHash16Candidate === undefined || packet.rpcName
    ? ""
    : ` rpc16?=${packet.rpcHash16Candidate}`;
  const linked = packet.linkId === undefined
    ? ""
    : ` link=${packet.linkId}:${packet.linkResolved ? packet.linkedPacketName ?? "registered" : "unresolved"}`;
  const spawnIdentity = packet.spawnType === undefined
    ? ""
    : ` spawn=${packet.spawnType}:${packet.spawnCollectionId}:${packet.spawnPrefabId ?? packet.spawnSceneId ?? "unknown"}` +
      ` links=${packet.rpcLinkRegistrations?.length ?? 0}`;
  const broadcast = packet.broadcastHash === undefined
    ? ""
    : ` broadcast=${packet.broadcastHash}${packet.broadcastName ? `:${packet.broadcastName}` : ""}`;
  const sync = packet.syncIndex === undefined
    ? ""
    : ` sync=${packet.syncIndex}${packet.syncName ? `:${packet.syncName}` : ""}`;
  const resolution = packet.rpcResolution === undefined || packet.rpcResolution === "verified"
    ? ""
    : ` resolution=${packet.rpcResolution}`;
  const fields = packet.decodedFields?.length
    ? ` fields=${packet.decodedFields.map((field) => `${field.name}:${formatDecodedValue(field.value)}`).join(",")}`
    : "";
  return `    FISHNET tick=${packet.tick}${bundle} id=${packet.packetId} kind=${packet.packetName}${linked}${object}` +
    `${behaviour}${rpc}${candidate}${resolution}${spawnIdentity}${sync}${broadcast}${fields}` +
    ` bytes=${packet.payload.length} payload=${packet.payload.toString("hex")}`;
}

function formatDecodedValue(value: boolean | number | string | number[] | null): string {
  const text = Array.isArray(value) ? `[${value.join(";")}]` : JSON.stringify(value);
  return encodeURIComponent(text);
}

export function formatCombatEvent(event: FishNetCombatEvent): string {
  if (event.kind === "activation") {
    const activation = event.activationId ? ` activation=${event.activationId}` : " activation=unmatched";
    const source = event.sourceId
      ? ` sourceId=${encodeURIComponent(event.sourceId)} source=${encodeURIComponent(event.sourceLabel ?? event.sourceId)}`
      : "";
    const target = event.targetId === undefined ? "" : ` target=${event.targetId}`;
    const attack = event.attackIndex === undefined ? "" : ` attackIndex=${event.attackIndex}`;
    return `COMBAT tick=${event.tick} actor=${event.actorId}${activation} action=${event.actionKind}` +
      ` phase=${event.phase}${source}${target}${attack}`;
  }
  const activation = event.activationId ? ` activation=${event.activationId}` : "";
  const candidates = event.candidateActivationIds?.length
    ? ` candidates=${event.candidateActivationIds.join(",")}`
    : "";
  const duplicate = event.kind === "death" ? ` duplicatesDamage=${event.duplicatesDamageEvent}` : "";
  return `COMBAT tick=${event.tick} actor=${event.actorId}${activation} action=${event.kind}` +
    ` sourceId=${encodeURIComponent(event.sourceId)} source=${encodeURIComponent(event.sourceLabel)}` +
    ` target=${event.targetId} value=${event.value}` +
    ` hit=${event.hitResult} attribution=${event.attribution}${candidates}${duplicate}`;
}

export function formatCombatEventJson(event: FishNetCombatEvent): string {
  return JSON.stringify(event);
}

export function formatActorIdentityEventJson(event: FishNetActorIdentityEvent): string {
  return JSON.stringify(event);
}

export function formatLiteNetLibPacket(decoded: CapturedLiteNetLibPacket): string {
  const { packet } = decoded;
  const path = decoded.mergePath.length === 0 ? "root" : decoded.mergePath.join(".");
  const sequence = "sequence" in packet ? ` seq=${packet.sequence}` : "";
  const channel = "channel" in packet ? ` channel=${packet.channel}` : "";
  const timestamp = packet.property === "pong" ? ` timestamp=${packet.timestamp}` : "";
  const fragment = packet.property === "channeled" && packet.fragment
    ? ` fragment=${packet.fragment.id}:${packet.fragment.part}/${packet.fragment.total}`
    : "";
  return `  LNL path=${path} kind=${packet.property}${sequence}${channel}${timestamp}${fragment}` +
    ` bytes=${packet.payload.length} payload=${packet.payload.toString("hex")}`;
}
