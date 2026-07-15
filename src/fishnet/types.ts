import type { CapturedLiteNetLibPacket } from "../litenetlib/types.ts";

export type FishNetPacketName =
  | "unset"
  | "authenticated"
  | "split"
  | "objectSpawn"
  | "objectDespawn"
  | "predictedSpawnResult"
  | "syncType"
  | "serverRpc"
  | "observersRpc"
  | "targetRpc"
  | "ownershipChange"
  | "broadcast"
  | "bulkSpawnOrDespawn"
  | "pingPong"
  | "replicate"
  | "reconcile"
  | "disconnect"
  | "timingUpdate"
  | "unused2"
  | "stateUpdate"
  | "version"
  | "unknown";

export interface FishNetRpcSymbol {
  /** Stable suffix from an IL2CPP-generated RPC method name; not assumed to be the wire hash. */
  methodHash: number;
  methodName: string;
  forms: Array<"writer" | "reader" | "logic">;
  /** Present only when a wire hash has been verified independently. */
  wireHash?: number;
  packetKinds?: Array<"serverRpc" | "observersRpc" | "targetRpc">;
}

export interface FishNetRpcMap {
  schemaVersion: 1;
  buildFingerprint: string;
  metadataVersion: number;
  symbols: FishNetRpcSymbol[];
}

export interface DecodedFishNetPacket {
  tick: number;
  packetId: number;
  packetName: FishNetPacketName;
  raw: Buffer;
  payload: Buffer;
  objectId?: number;
  networkBehaviourIndex?: number;
  rpcPayloadLength?: number;
  rpcHash?: number;
  rpcHash16Candidate?: number;
  rpcName?: string;
}

export interface CapturedFishNetPacket extends DecodedFishNetPacket {
  liteNetPacket: CapturedLiteNetLibPacket;
}
