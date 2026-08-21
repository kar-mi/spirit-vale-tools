import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveCosmeticsProgressionRpcs = [
  {
    "wireHash": 98,
    "packetKind": "serverRpc",
    "methodName": "ConvertCosmetic_Rpc",
    "parameters": [
      {
        "name": "equip",
        "typeName": "EquipData",
        "fields": [
          {
            "name": "Substats",
            "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Type",
                "typeName": "StatType",
                "codec": "packedInt32"
              },
              {
                "name": "Value",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "ValueStr",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              }
            ]
          },
          {
            "name": "Cards",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "StartingPotential",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "SpentPotential",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "ChaosType",
            "typeName": "EquipType",
            "codec": "packedInt32"
          },
          {
            "name": "UID",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Refine",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Id",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Favorite",
            "typeName": "System.Boolean",
            "codec": "boolean"
          }
        ]
      },
      {
        "name": "usePremium",
        "typeName": "System.Boolean",
        "codec": "boolean"
      }
    ]
  },
  {
    "wireHash": 99,
    "packetKind": "serverRpc",
    "methodName": "RemoveCosmetic_S",
    "parameters": [
      {
        "name": "slot",
        "typeName": "CosmeticSlot"
      }
    ]
  },
  {
    "wireHash": 100,
    "packetKind": "serverRpc",
    "methodName": "ApplyCosmetic_S",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "targetSlot",
        "typeName": "CosmeticSlot"
      }
    ]
  },
  {
    "wireHash": 101,
    "packetKind": "serverRpc",
    "methodName": "PurchaseCosmetics_Rpc",
    "parameters": [
      {
        "name": "ids",
        "typeName": "System.String[]"
      }
    ]
  },
  {
    "wireHash": 102,
    "packetKind": "serverRpc",
    "methodName": "AddWardrobe_Rpc",
    "parameters": [
      {
        "name": "data",
        "typeName": "CosmeticData",
        "fields": [
          {
            "name": "Rarity",
            "typeName": "ItemRarity",
            "codec": "packedInt32"
          },
          {
            "name": "Shiny",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "UID",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Refine",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Id",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Favorite",
            "typeName": "System.Boolean",
            "codec": "boolean"
          }
        ]
      }
    ]
  },
  {
    "wireHash": 103,
    "packetKind": "targetRpc",
    "methodName": "ShowMessage_GotoWardrobe_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "list",
        "typeName": "CosmeticData[]"
      }
    ]
  },
  {
    "wireHash": 104,
    "packetKind": "serverRpc",
    "methodName": "RemoveWardrobe_Rpc",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 105,
    "packetKind": "serverRpc",
    "methodName": "SelectTitle",
    "parameters": [
      {
        "name": "title",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 106,
    "packetKind": "serverRpc",
    "methodName": "SelectBadge",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 107,
    "packetKind": "serverRpc",
    "methodName": "SelectChatBubble",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 108,
    "packetKind": "serverRpc",
    "methodName": "UpgradeStorageSpace_Rpc"
  },
  {
    "wireHash": 109,
    "packetKind": "serverRpc",
    "methodName": "ExpandCharacterSlots_Rpc"
  },
  {
    "wireHash": 110,
    "packetKind": "serverRpc",
    "methodName": "RequestLeaderboard_Rpc",
    "parameters": [
      {
        "name": "type",
        "typeName": "LeaderboardType"
      }
    ]
  },
  {
    "wireHash": 111,
    "packetKind": "targetRpc",
    "methodName": "RequestLeaderboard_T",
    "parameters": [
      {
        "name": "list",
        "typeName": "System.Collections.Generic.List`1[[LeaderboardEntry, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      },
      {
        "name": "me",
        "typeName": "LeaderboardEntry"
      }
    ]
  },
  {
    "wireHash": 112,
    "packetKind": "targetRpc",
    "methodName": "ShowMessage_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
