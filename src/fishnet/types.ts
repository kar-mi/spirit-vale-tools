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
  | "rpcLink"
  | "unknown";

export type FishNetRpcPacketName = "serverRpc" | "observersRpc" | "targetRpc" | "reconcile";

export type FishNetRpcResolution = "verified" | "ambiguous" | "unresolved";

export type FishNetWireCodec =
  | "boolean"
  | "uint8"
  | "int8"
  | "uint16"
  | "int16"
  | "uint32"
  | "int32"
  | "float32"
  | "float64"
  | "packedInt32"
  | "packedUInt64"
  | "stringUtf8Packed"
  | "vector3IntPacked"
  | "vector2"
  | "vector3"
  | "quaternion";

export type FishNetDecodedValue = boolean | number | string | number[];

export interface FishNetDecodedField {
  name: string;
  typeName?: string;
  codec: FishNetWireCodec;
  value: FishNetDecodedValue;
}

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

export interface FishNetRpcSymbol {
  /** Stable suffix from an IL2CPP-generated RPC method name; not assumed to be the wire hash. */
  methodHash: number;
  methodName: string;
  forms: Array<"writer" | "reader" | "logic">;
  /** Present only when a wire hash has been verified independently. */
  wireHash?: number;
  packetKinds?: Array<"serverRpc" | "observersRpc" | "targetRpc">;
}

export interface FishNetRpcMapV1 {
  schemaVersion: 1;
  buildFingerprint: string;
  metadataVersion: number;
  symbols: FishNetRpcSymbol[];
}

export interface FishNetRpcParameter {
  name: string;
  typeName?: string;
  /** Present only when the generated writer call established the exact wire codec. */
  codec?: FishNetWireCodec;
  /** Ordered fields for a generated structured writer. Leaf fields carry codecs. */
  fields?: FishNetRpcParameter[];
}

export interface FishNetRpcDefinition {
  wireHash: number;
  packetKind: FishNetRpcPacketName;
  methodName: string;
  parameters?: FishNetRpcParameter[];
}

export interface FishNetSyncTypeDefinition {
  index: number;
  name: string;
  typeName?: string;
  codec?: FishNetWireCodec;
}

export interface FishNetBehaviourDefinition {
  typeName: string;
  rpcs: FishNetRpcDefinition[];
  syncTypes?: FishNetSyncTypeDefinition[];
}

export interface FishNetBroadcastDefinition {
  wireHash: number;
  typeName: string;
  fields?: FishNetRpcParameter[];
}

export interface FishNetRpcMapV2 {
  schemaVersion: 2;
  buildFingerprint: string;
  metadataVersion: number;
  behaviours: FishNetBehaviourDefinition[];
  broadcasts?: FishNetBroadcastDefinition[];
}

export type FishNetRpcMap = FishNetRpcMapV1 | FishNetRpcMapV2;

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
