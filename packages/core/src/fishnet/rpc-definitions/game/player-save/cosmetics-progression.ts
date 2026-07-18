import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveCosmeticsProgressionRpcs = [
  {
    "wireHash": 97,
    "packetKind": "serverRpc",
    "methodName": "ConvertCosmetic_Rpc",
    "parameters": [
      {
        "name": "equip",
        "typeName": "EquipData"
      },
      {
        "name": "usePremium",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 98,
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
    "wireHash": 99,
    "packetKind": "serverRpc",
    "methodName": "ApplyCosmetic_S",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      },
      {
        "name": "targetSlot",
        "typeName": "CosmeticSlot"
      }
    ]
  },
  {
    "wireHash": 100,
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
    "wireHash": 101,
    "packetKind": "serverRpc",
    "methodName": "AddWardrobe_Rpc",
    "parameters": [
      {
        "name": "data",
        "typeName": "CosmeticData"
      }
    ]
  },
  {
    "wireHash": 102,
    "packetKind": "targetRpc",
    "methodName": "ShowMessage_GotoWardrobe_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      },
      {
        "name": "list",
        "typeName": "CosmeticData[]"
      }
    ]
  },
  {
    "wireHash": 103,
    "packetKind": "serverRpc",
    "methodName": "RemoveWardrobe_Rpc",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 104,
    "packetKind": "serverRpc",
    "methodName": "SelectTitle",
    "parameters": [
      {
        "name": "title",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 105,
    "packetKind": "serverRpc",
    "methodName": "SelectBadge",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 106,
    "packetKind": "serverRpc",
    "methodName": "SelectChatBubble",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 107,
    "packetKind": "serverRpc",
    "methodName": "UpgradeStorageSpace_Rpc"
  },
  {
    "wireHash": 108,
    "packetKind": "serverRpc",
    "methodName": "ExpandCharacterSlots_Rpc"
  },
  {
    "wireHash": 109,
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
    "wireHash": 110,
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
    "wireHash": 111,
    "packetKind": "targetRpc",
    "methodName": "ShowMessage_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
