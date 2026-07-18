import type { CapturedLiteNetLibPacket } from "../../litenetlib/types.ts";
import type { FishNetDecodedField } from "./codecs.ts";
import type { FishNetRpcMap } from "./rpc-map.ts";

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
  | "rpcLink"
  | "unknown";

export type FishNetRpcPacketName = "serverRpc" | "observersRpc" | "targetRpc" | "reconcile";
export type FishNetRpcResolution = "verified" | "ambiguous" | "unresolved";

export interface FishNetDecodeOptions {
  reliable: boolean;
  rpcMap?: FishNetRpcMap;
  /** Stable identifier for one transport connection. Defaults to a single shared session. */
  connectionId?: string | number;
  /** Split reassembly is isolated by direction and channel. */
  direction?: "inbound" | "outbound" | string;
  channel?: number;
  /** Optional reliable transport sequence, used to ignore duplicate split fragments. */
  sequence?: number;
}

export interface FishNetRpcLinkRegistration {
  linkId: number;
  objectId: number;
  componentIndex: number;
  rpcHash: number;
  packetName: FishNetRpcPacketName;
  networkBehaviourType?: string;
}

export interface DecodedFishNetPacket {
  tick: number;
  packetId: number;
  packetName: FishNetPacketName;
  raw: Buffer;
  payload: Buffer;
  objectId?: number;
  /** FishNet session-local owner connection ID; -1 denotes no owner. */
  ownerConnectionId?: number;
  networkBehaviourIndex?: number;
  rpcPayloadLength?: number;
  rpcHash?: number;
  rpcHash16Candidate?: number;
  rpcName?: string;
  rpcResolution?: FishNetRpcResolution;
  networkBehaviourType?: string;
  decodedFields?: FishNetDecodedField[];
  undecodedPayload?: Buffer;
  bundleIndex?: number;
  linkId?: number;
  linkedPacketName?: FishNetRpcPacketName;
  linkResolved?: boolean;
  registeredObjectId?: number;
  registeredComponentIndex?: number;
  registeredRpcHash?: number;
  spawnType?: "scene" | "instantiated" | "predicted";
  spawnCollectionId?: number;
  spawnPrefabId?: number;
  spawnSceneId?: bigint;
  spawnNested?: boolean;
  /** Initial per-behaviour SyncType bytes embedded in an ObjectSpawn packet. */
  spawnSyncPayload?: Buffer;
  rpcLinkRegistrations?: FishNetRpcLinkRegistration[];
  syncPayload?: Buffer;
  /** First SyncType index in the length-delimited body. */
  syncIndex?: number;
  syncName?: string;
  broadcastHash?: number;
  broadcastName?: string;
}

export interface CapturedFishNetPacket extends DecodedFishNetPacket {
  liteNetPacket: CapturedLiteNetLibPacket;
}
