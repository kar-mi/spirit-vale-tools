import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveSocialAccountRpcs = [
  {
    "wireHash": 85,
    "packetKind": "serverRpc",
    "methodName": "SendFriendRequest",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 86,
    "packetKind": "targetRpc",
    "methodName": "FriendRequest_T",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "displayName",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 87,
    "packetKind": "serverRpc",
    "methodName": "FriendRequestReject",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 88,
    "packetKind": "serverRpc",
    "methodName": "FriendRequestAccept",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "requesterName",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 89,
    "packetKind": "serverRpc",
    "methodName": "FriendRemove",
    "parameters": [
      {
        "name": "id",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 90,
    "packetKind": "serverRpc",
    "methodName": "BlockPlayer",
    "parameters": [
      {
        "name": "targetId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 91,
    "packetKind": "serverRpc",
    "methodName": "UnblockPlayer",
    "parameters": [
      {
        "name": "targetId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 92,
    "packetKind": "targetRpc",
    "methodName": "FriendRequestFailed_T"
  },
  {
    "wireHash": 93,
    "packetKind": "targetRpc",
    "methodName": "FriendRequestSent_T"
  },
  {
    "wireHash": 94,
    "packetKind": "targetRpc",
    "methodName": "FriendChanged_T",
    "parameters": [
      {
        "name": "friends",
        "typeName": "FriendSystemData"
      },
      {
        "name": "statuses",
        "typeName": "System.Collections.Generic.List`1[[PlayerStatus, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 95,
    "packetKind": "targetRpc",
    "methodName": "FriendStatusChanged_T",
    "parameters": [
      {
        "name": "status",
        "typeName": "PlayerStatus"
      }
    ]
  },
  {
    "wireHash": 96,
    "packetKind": "targetRpc",
    "methodName": "CompleteAccountCallback",
    "parameters": [
      {
        "name": "data",
        "typeName": "AccountData"
      }
    ]
  },
  {
    "wireHash": 97,
    "packetKind": "serverRpc",
    "methodName": "UpdateAccountDisplayName",
    "parameters": [
      {
        "name": "displayName",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
