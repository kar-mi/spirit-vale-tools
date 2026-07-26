import type {
  DecodedFishNetPacket,
  FishNetPacketName,
  FishNetRpcPacketName,
} from "./types.ts";

const PACKET_NAMES = new Map<number, FishNetPacketName>([
  [0, "unset"], [1, "authenticated"], [2, "split"], [3, "objectSpawn"],
  [4, "objectDespawn"], [5, "predictedSpawnResult"], [7, "syncType"],
  [8, "serverRpc"], [9, "observersRpc"], [10, "targetRpc"],
  [11, "ownershipChange"], [12, "broadcast"], [13, "bulkSpawnOrDespawn"],
  [14, "pingPong"], [15, "replicate"], [16, "reconcile"], [17, "disconnect"],
  [18, "timingUpdate"], [19, "unused2"], [20, "stateUpdate"], [21, "version"],
]);

export const STARTING_RPC_LINK_ID = 22;
export const RPC_PACKET_NAMES = new Set<FishNetPacketName>(["serverRpc", "observersRpc", "targetRpc"]);
export const LINKED_PACKET_NAMES = new Map<number, FishNetRpcPacketName>([
  [9, "observersRpc"],
  [10, "targetRpc"],
  [16, "reconcile"],
]);

export interface RpcLinkRegistrationState {
  objectId: number;
  componentIndex: number;
  rpcHash: number;
  packetName: FishNetRpcPacketName;
  networkBehaviourType?: string;
}

export class FishNetProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FishNetProtocolError";
  }
}

export function classifyPacket(packetId: number): FishNetPacketName {
  return PACKET_NAMES.get(packetId) ?? (packetId >= STARTING_RPC_LINK_ID ? "rpcLink" : "unknown");
}

export function isPlausibleBoundary(buffer: Buffer, offset: number): boolean {
  if (offset === buffer.length) return true;
  if (buffer.length - offset < 2) return false;
  return classifyPacket(buffer.readUInt16LE(offset)) !== "unknown";
}

export function componentKey(objectId: number, componentIndex: number): string {
  return `${objectId}:${componentIndex}`;
}

export function basePacket(
  buffer: Buffer,
  start: number,
  end: number,
  tick: number,
  bundleIndex: number,
  packetId: number,
  packetName: FishNetPacketName,
): DecodedFishNetPacket {
  return {
    tick,
    packetId,
    packetName,
    bundleIndex,
    raw: buffer.subarray(start, end),
    payload: buffer.subarray(start + 2, end),
  };
}

export function opaquePacket(
  buffer: Buffer,
  start: number,
  tick: number,
  bundleIndex: number,
  packetName = classifyPacket(buffer.readUInt16LE(start)),
): DecodedFishNetPacket {
  return basePacket(buffer, start, buffer.length, tick, bundleIndex, buffer.readUInt16LE(start), packetName);
}

export function unresolvedLinkPacket(
  buffer: Buffer,
  start: number,
  tick: number,
  bundleIndex: number,
  packetId: number,
): DecodedFishNetPacket {
  const packet = opaquePacket(buffer, start, tick, bundleIndex, "rpcLink");
  packet.linkId = packetId;
  packet.linkResolved = false;
  return packet;
}
