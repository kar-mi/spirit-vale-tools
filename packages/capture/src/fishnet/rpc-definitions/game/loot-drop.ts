import type { FishNetBehaviourDefinition, FishNetSyncTypeDefinition } from "../../definitions/rpc-map.ts";

/** Build-derived SyncVar layout for the spawnable LootDrop prefab. */
export class LootDropRpcDefinition {
  private constructor() {}

  static readonly typeName = "LootDrop";
  static readonly syncTypes = [
    {
      index: 0,
      name: "Dto",
      typeName: "LootDropDto",
      fields: [
        { name: "DisplayName", typeName: "System.String", codec: "stringUtf8Packed" },
        { name: "SpriteId", typeName: "System.String", codec: "stringUtf8Packed" },
        { name: "Rarity", typeName: "ItemRarity", codec: "packedInt32" },
        { name: "Scale", typeName: "System.Single", codec: "float32" },
        { name: "LootChance", typeName: "System.Single", codec: "float32" },
        { name: "LootType", typeName: "ItemType", codec: "packedInt32" },
      ],
    },
    {
      index: 1,
      name: "Lock",
      typeName: "LockDto",
      fields: [
        // FishNet writes DateTime.ToBinary() as a signed packed whole. `packedInt64`
        // deliberately exposes the lossless decimal string rather than an unsafe JS number.
        { name: "ExpireAt", typeName: "System.DateTime", codec: "packedInt64" },
        { name: "PartyId", typeName: "System.Int32", codec: "packedInt32" },
        { name: "PlayerId", typeName: "System.String", codec: "stringUtf8Packed" },
      ],
    },
  ] as const satisfies readonly FishNetSyncTypeDefinition[];

  static readonly definition = {
    typeName: this.typeName,
    rpcs: [],
    syncTypes: this.syncTypes,
  } as const satisfies FishNetBehaviourDefinition;
}
