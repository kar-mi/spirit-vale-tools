import type { FishNetWireCodec } from "./codecs.ts";
import type { FishNetRpcPacketName } from "./protocol.ts";

export interface FishNetRpcParameter {
  readonly name: string;
  readonly typeName?: string;
  /** Generated reference-type writer prefixes the structured value with FishNet's null flag. */
  readonly nullable?: boolean;
  /** Present only when the generated writer call established the exact wire codec. */
  readonly codec?: FishNetWireCodec;
  /** Ordered fields for a generated structured writer. Leaf fields carry codecs. */
  readonly fields?: readonly FishNetRpcParameter[];
  /**
   * This field is a `List<T>`/array: a packed signed count, then that many elements, each
   * shaped by this same parameter's `codec`/`nullable`/`fields`. Mutually exclusive with
   * {@link dictionaryKey}.
   */
  readonly repeated?: boolean;
  /**
   * This field is a `Dictionary<string, T>`: a packed signed count, then that many
   * (stringUtf8Packed key, value) pairs, the value shaped by this same parameter's
   * `codec`/`nullable`/`fields`. Mutually exclusive with {@link repeated}.
   */
  readonly dictionaryKey?: "stringUtf8Packed";
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

export interface FishNetPrefabComponentDefinition {
  readonly index: number;
  readonly typeName: string;
}

/**
 * A verified NetworkBehaviour layout for one entry in a FishNet spawnable-prefab collection.
 * The enclosing RPC map supplies the game-build scope.
 */
export interface FishNetPrefabDefinition {
  readonly collectionId: number;
  readonly prefabId: number;
  /**
   * Serialized prefab name. `Player` and `PlayerClone` share an identical component layout, so the
   * name is the only thing that separates a real player spawn from a mirrored one.
   */
  readonly prefabName?: string;
  readonly components: readonly FishNetPrefabComponentDefinition[];
}

export interface FishNetRpcMap {
  readonly buildFingerprint: string;
  readonly metadataVersion: number;
  readonly behaviours: readonly FishNetBehaviourDefinition[];
  readonly broadcasts?: readonly FishNetBroadcastDefinition[];
  readonly prefabs?: readonly FishNetPrefabDefinition[];
}
