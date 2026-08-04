import type { FishNetSyncTypeDefinition } from "../../../definitions/rpc-map.ts";

export class PlayerControllerRpcDefinition {
  private constructor() {}

  static readonly typeName = "PlayerController";
  static readonly syncTypes = [
    {
      "index": 5,
      "name": "VisualData",
      "typeName": "CharacterVisualDto",
      "fields": [
        {
          "name": "Appearance",
          "typeName": "CharacterAppearanceDto",
          "fields": [
            {
              "name": "DisplayName",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "Archetype",
              "typeName": "Archetype",
              "codec": "packedInt32"
            }
          ]
        }
      ]
    }
  ] as const satisfies readonly FishNetSyncTypeDefinition[];
}
