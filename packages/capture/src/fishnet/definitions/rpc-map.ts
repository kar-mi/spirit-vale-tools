import type { FishNetWireCodec } from "./codecs.ts";
import type { FishNetRpcPacketName } from "./protocol.ts";

export interface FishNetRpcParameter {
  readonly name: string;
  readonly typeName?: string;
  /** Present only when the generated writer call established the exact wire codec. */
  readonly codec?: FishNetWireCodec;
  /** Ordered fields for a generated structured writer. Leaf fields carry codecs. */
  readonly fields?: readonly FishNetRpcParameter[];
}

export interface FishNetRpcDefinition {
  readonly wireHash: number;
  readonly packetKind: FishNetRpcPacketName;
  readonly methodName: string;
  readonly parameters?: readonly FishNetRpcParameter[];
}

export interface FishNetSyncTypeDefinition {
  readonly index: number;
  readonly name: string;
  readonly typeName?: string;
  readonly codec?: FishNetWireCodec;
  /** Ordered fields for a structured SyncType value. Leaf fields carry codecs. */
  readonly fields?: readonly FishNetRpcParameter[];
}

export interface FishNetBehaviourDefinition {
  readonly typeName: string;
  readonly rpcs: readonly FishNetRpcDefinition[];
  readonly syncTypes?: readonly FishNetSyncTypeDefinition[];
}

export interface FishNetBroadcastDefinition {
  readonly wireHash: number;
  readonly typeName: string;
  readonly fields?: readonly FishNetRpcParameter[];
}

export interface FishNetRpcMap {
  readonly buildFingerprint: string;
  readonly metadataVersion: number;
  readonly behaviours: readonly FishNetBehaviourDefinition[];
  readonly broadcasts?: readonly FishNetBroadcastDefinition[];
}
