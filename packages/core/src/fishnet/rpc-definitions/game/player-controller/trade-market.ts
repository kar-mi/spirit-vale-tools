import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerControllerTradeMarketRpcs = [
  {
    "wireHash": 60,
    "packetKind": "serverRpc",
    "methodName": "SendTradeRequest",
    "parameters": [
      {
        "name": "playerId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 61,
    "packetKind": "targetRpc",
    "methodName": "SendTradeRequest_T",
    "parameters": [
      {
        "name": "sender",
        "typeName": "FishNet.Object.NetworkObject"
      }
    ]
  },
  {
    "wireHash": 62,
    "packetKind": "serverRpc",
    "methodName": "AcceptTradeRequest",
    "parameters": [
      {
        "name": "sender",
        "typeName": "FishNet.Object.NetworkObject"
      }
    ]
  },
  {
    "wireHash": 63,
    "packetKind": "serverRpc",
    "methodName": "CancelTrade_S"
  },
  {
    "wireHash": 64,
    "packetKind": "targetRpc",
    "methodName": "CancelTrade_T"
  },
  {
    "wireHash": 65,
    "packetKind": "targetRpc",
    "methodName": "BeginTrade_T",
    "parameters": [
      {
        "name": "mine",
        "typeName": "TradeData"
      },
      {
        "name": "theirs",
        "typeName": "TradeData"
      }
    ]
  },
  {
    "wireHash": 66,
    "packetKind": "serverRpc",
    "methodName": "UpdateTrade_S",
    "parameters": [
      {
        "name": "data",
        "typeName": "TradeData"
      },
      {
        "name": "isDirty",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 67,
    "packetKind": "targetRpc",
    "methodName": "UpdateTrade_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "TradeData"
      },
      {
        "name": "mine",
        "typeName": "TradeData"
      }
    ]
  },
  {
    "wireHash": 68,
    "packetKind": "targetRpc",
    "methodName": "CompleteTradeBegin_T"
  },
  {
    "wireHash": 69,
    "packetKind": "targetRpc",
    "methodName": "CompleteTrade_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 70,
    "packetKind": "serverRpc",
    "methodName": "RequestVendorItemList_S",
    "parameters": [
      {
        "name": "filter",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 71,
    "packetKind": "targetRpc",
    "methodName": "RequestVendorItemList_T",
    "parameters": [
      {
        "name": "items",
        "typeName": "System.Collections.Generic.List`1[[VendingManager+ItemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 72,
    "packetKind": "serverRpc",
    "methodName": "RequestAHAccount_S"
  },
  {
    "wireHash": 73,
    "packetKind": "targetRpc",
    "methodName": "RequestAHAccount_T",
    "parameters": [
      {
        "name": "view",
        "typeName": "VendingAccountView"
      }
    ]
  },
  {
    "wireHash": 74,
    "packetKind": "serverRpc",
    "methodName": "RequestVendingStallStatus_S"
  },
  {
    "wireHash": 75,
    "packetKind": "targetRpc",
    "methodName": "RequestVendingStallStatus_T",
    "parameters": [
      {
        "name": "dto",
        "typeName": "VendingStallStatusDto"
      }
    ]
  },
  {
    "wireHash": 76,
    "packetKind": "serverRpc",
    "methodName": "RequestInstanceStatus_S"
  },
  {
    "wireHash": 77,
    "packetKind": "targetRpc",
    "methodName": "RequestInstanceStatus_T",
    "parameters": [
      {
        "name": "dto",
        "typeName": "InstanceStatusDto"
      }
    ]
  },
  {
    "wireHash": 78,
    "packetKind": "serverRpc",
    "methodName": "RequestVendingStallListings_S",
    "parameters": [
      {
        "name": "accountId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 79,
    "packetKind": "targetRpc",
    "methodName": "RequestVendingStallListings_T",
    "parameters": [
      {
        "name": "listings",
        "typeName": "System.Collections.Generic.List`1[[VendingListing, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 80,
    "packetKind": "observersRpc",
    "methodName": "SpawnVendingStall_C",
    "parameters": [
      {
        "name": "data",
        "typeName": "VendingDataDto"
      }
    ]
  },
  {
    "wireHash": 81,
    "packetKind": "observersRpc",
    "methodName": "DespawnVendingStall_C",
    "parameters": [
      {
        "name": "accountId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 82,
    "packetKind": "targetRpc",
    "methodName": "LoadVendingStalls_T",
    "parameters": [
      {
        "name": "stalls",
        "typeName": "System.Collections.Generic.List`1[[VendingDataDto, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 83,
    "packetKind": "serverRpc",
    "methodName": "SendEmoji",
    "parameters": [
      {
        "name": "type",
        "typeName": "UIGame+EmojiType"
      }
    ]
  },
  {
    "wireHash": 84,
    "packetKind": "observersRpc",
    "methodName": "SendEmoji_C",
    "parameters": [
      {
        "name": "type",
        "typeName": "UIGame+EmojiType"
      }
    ]
  },
  {
    "wireHash": 85,
    "packetKind": "targetRpc",
    "methodName": "SendLimitReached"
  },
  {
    "wireHash": 86,
    "packetKind": "serverRpc",
    "methodName": "SendChat",
    "parameters": [
      {
        "name": "channel",
        "typeName": "ChatChannel"
      },
      {
        "name": "msg",
        "typeName": "System.String"
      },
      {
        "name": "receiverId",
        "typeName": "System.String"
      },
      {
        "name": "items",
        "typeName": "PickUpList"
      }
    ]
  },
  {
    "wireHash": 87,
    "packetKind": "observersRpc",
    "methodName": "BroadcastChat",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 88,
    "packetKind": "targetRpc",
    "methodName": "ReceiveChat",
    "parameters": [
      {
        "name": "msg",
        "typeName": "ChatMessage"
      }
    ]
  },
  {
    "wireHash": 89,
    "packetKind": "targetRpc",
    "methodName": "ReceiveAnnouncement",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
