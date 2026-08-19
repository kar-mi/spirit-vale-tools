import type { CapturedLiteNetLibPacket } from "../../litenetlib/types.ts";
import type { FishNetDecodedField } from "./codecs.ts";
import type { FishNetRpcMap } from "./rpc-map.ts";
import type { DecodedNetworkTransform } from "../network-transform-decoder.ts";

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
/**
 * `recovered` is as actionable as `verified` — the method and behaviour are known — but the
 * registration came from a quarantined pre-re-authentication table and was corroborated rather than
 * read from a fresh spawn. It is distinguished so the promotion rate stays measurable.
 */
export type FishNetRpcResolution = "verified" | "recovered" | "ambiguous" | "unresolved";

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

/** One SyncType written into a length-delimited body, identified by its per-behaviour index. */
export interface FishNetSyncEntry {
  index: number;
  name: string;
  fields: FishNetDecodedField[];
}

/** A SyncType carried inside an ObjectSpawn, which names the component it belongs to. */
export interface FishNetSpawnSyncEntry extends FishNetSyncEntry {
  componentIndex: number;
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
  /** Game-defined WritePayload bytes embedded in an ObjectSpawn packet. */
  spawnCustomPayload?: Buffer;
  /** Initial per-behaviour SyncType bytes embedded in an ObjectSpawn packet. */
  spawnSyncPayload?: Buffer;
  /** SyncTypes decoded from {@link spawnSyncPayload}, in wire order. */
  spawnSyncEntries?: FishNetSpawnSyncEntry[];
  /** World position the object spawned at, when the spawn carries the position flag. */
  spawnLocalPosition?: readonly [number, number, number];
  /**
   * Spawn rotation as `[x, y, z, w]`, only for the uncompressed 16-byte quaternion form. The 4- and
   * 8-byte packings stay absent rather than guessed.
   */
  spawnLocalRotation?: readonly [number, number, number, number];
  /** Spawn scale, when the spawn carries the scale flag. */
  spawnLocalScale?: readonly [number, number, number];
  rpcLinkRegistrations?: FishNetRpcLinkRegistration[];
  syncPayload?: Buffer;
  /** First SyncType index in the length-delimited body. */
  syncIndex?: number;
  syncName?: string;
  /** Every SyncType entry decoded from the body, in wire order. */
  syncEntries?: FishNetSyncEntry[];
  broadcastHash?: number;
  broadcastName?: string;
  /** Movement decoded from a NetworkTransform update RPC. */
  networkTransform?: DecodedNetworkTransform;
  /** Set when split reassembly was abandoned and the accumulated bundle was dropped. */
  splitDropReason?: "header" | "chunk-count" | "size-cap";
}

export interface CapturedFishNetPacket extends DecodedFishNetPacket {
  liteNetPacket: CapturedLiteNetLibPacket;
  /** Transport connection this packet was decoded from (endpoints + LiteNetLib connection number). */
  connectionId: string;
}
