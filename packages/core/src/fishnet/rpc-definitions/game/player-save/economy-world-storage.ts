import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveEconomyWorldStorageRpcs = [
  {
    "wireHash": 40,
    "packetKind": "targetRpc",
    "methodName": "CoinsCallback_T",
    "parameters": [
      {
        "name": "coins",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 41,
    "packetKind": "targetRpc",
    "methodName": "ExpCoinsChanged_T",
    "parameters": [
      {
        "name": "exp",
        "typeName": "System.Int32"
      },
      {
        "name": "level",
        "typeName": "System.Int32"
      },
      {
        "name": "jobExp",
        "typeName": "System.Int32"
      },
      {
        "name": "jobLevel",
        "typeName": "System.Int32"
      },
      {
        "name": "coins",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 42,
    "packetKind": "serverRpc",
    "methodName": "RequestPremiumPurchase",
    "parameters": [
      {
        "name": "tierId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 43,
    "packetKind": "serverRpc",
    "methodName": "NotifyPremiumPurchaseAuthorized",
    "parameters": [
      {
        "name": "orderId",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 44,
    "packetKind": "targetRpc",
    "methodName": "PremiumChanged_T",
    "parameters": [
      {
        "name": "premiumTotal",
        "typeName": "System.Int64"
      },
      {
        "name": "premiumSpent",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 45,
    "packetKind": "serverRpc",
    "methodName": "ToggleEquipSlotHidden_S",
    "parameters": [
      {
        "name": "slot",
        "typeName": "EquipSlot"
      }
    ]
  },
  {
    "wireHash": 46,
    "packetKind": "serverRpc",
    "methodName": "ToggleFavorite_S",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      },
      {
        "name": "type",
        "typeName": "ItemType"
      }
    ]
  },
  {
    "wireHash": 47,
    "packetKind": "serverRpc",
    "methodName": "Dismantle_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      },
      {
        "name": "type",
        "typeName": "ItemType"
      }
    ]
  },
  {
    "wireHash": 48,
    "packetKind": "serverRpc",
    "methodName": "MerchantDismantle_S",
    "parameters": [
      {
        "name": "transaction",
        "typeName": "Transaction"
      }
    ]
  },
  {
    "wireHash": 49,
    "packetKind": "serverRpc",
    "methodName": "MerchantPurchase_S",
    "parameters": [
      {
        "name": "req",
        "typeName": "MerchantPurchaseRequest"
      }
    ]
  },
  {
    "wireHash": 50,
    "packetKind": "serverRpc",
    "methodName": "MerchantSell_S",
    "parameters": [
      {
        "name": "transaction",
        "typeName": "Transaction"
      }
    ]
  },
  {
    "wireHash": 51,
    "packetKind": "serverRpc",
    "methodName": "Craft_Rpc",
    "parameters": [
      {
        "name": "npcId",
        "typeName": "System.String"
      },
      {
        "name": "recipeId",
        "typeName": "System.String"
      },
      {
        "name": "selectedItems",
        "typeName": "System.Collections.Generic.List`1[[System.String, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
      }
    ]
  },
  {
    "wireHash": 52,
    "packetKind": "serverRpc",
    "methodName": "AttuneWaystone"
  },
  {
    "wireHash": 53,
    "packetKind": "serverRpc",
    "methodName": "UnlockWaypoint_S",
    "parameters": [
      {
        "name": "mapId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 54,
    "packetKind": "observersRpc",
    "methodName": "UnlockWaypoint_C",
    "parameters": [
      {
        "name": "mapId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 55,
    "packetKind": "serverRpc",
    "methodName": "WarpWaypoint_S",
    "parameters": [
      {
        "name": "mapId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 56,
    "packetKind": "serverRpc",
    "methodName": "SpeakToNPC_S",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 57,
    "packetKind": "targetRpc",
    "methodName": "CharacterCallback_T",
    "parameters": [
      {
        "name": "type",
        "typeName": "CharacterUpdateType"
      },
      {
        "name": "sync",
        "typeName": "CharacterData"
      }
    ]
  },
  {
    "wireHash": 58,
    "packetKind": "targetRpc",
    "methodName": "CharacterCallback_T"
  },
  {
    "wireHash": 59,
    "packetKind": "serverRpc",
    "methodName": "StorageTransaction_S",
    "parameters": [
      {
        "name": "transaction",
        "typeName": "Transaction"
      }
    ]
  },
  {
    "wireHash": 60,
    "packetKind": "targetRpc",
    "methodName": "StorageTransactionFailed",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 61,
    "packetKind": "targetRpc",
    "methodName": "PlayerCallback",
    "parameters": [
      {
        "name": "data",
        "typeName": "PlayerData"
      }
    ]
  },
  {
    "wireHash": 62,
    "packetKind": "targetRpc",
    "methodName": "PlayerCallback_Storage",
    "parameters": [
      {
        "name": "storage",
        "typeName": "InventoryData"
      }
    ]
  },
  {
    "wireHash": 63,
    "packetKind": "targetRpc",
    "methodName": "PlayerCallback_Wardrobe",
    "parameters": [
      {
        "name": "data",
        "typeName": "WardrobeData"
      }
    ]
  },
  {
    "wireHash": 64,
    "packetKind": "targetRpc",
    "methodName": "PlayerCallback_Unlocks",
    "parameters": [
      {
        "name": "data",
        "typeName": "PlayerUnlocks"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
