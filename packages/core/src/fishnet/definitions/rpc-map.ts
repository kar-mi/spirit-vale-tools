import type { FishNetWireCodec } from "./codecs.ts";
import type { FishNetRpcPacketName } from "./protocol.ts";

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
  /** Ordered fields for a structured SyncType value. Leaf fields carry codecs. */
  fields?: FishNetRpcParameter[];
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
