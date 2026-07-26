import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveDebugRpcs = [
  {
    "wireHash": 77,
    "packetKind": "serverRpc",
    "methodName": "Debug_PickupItems",
    "parameters": [
      {
        "name": "pickupList",
        "typeName": "PickUpList"
      }
    ]
  },
  {
    "wireHash": 78,
    "packetKind": "serverRpc",
    "methodName": "Debug_MaxLv"
  },
  {
    "wireHash": 79,
    "packetKind": "serverRpc",
    "methodName": "Debug_SetClass",
    "parameters": [
      {
        "name": "type",
        "typeName": "Archetype"
      }
    ]
  },
  {
    "wireHash": 80,
    "packetKind": "serverRpc",
    "methodName": "Debug_GrantCoinsAdmin",
    "parameters": [
      {
        "name": "coins",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 81,
    "packetKind": "serverRpc",
    "methodName": "Debug_UnlockAllCosmetics"
  },
  {
    "wireHash": 82,
    "packetKind": "serverRpc",
    "methodName": "Debug_UnlockAllWaypoints"
  },
  {
    "wireHash": 83,
    "packetKind": "targetRpc",
    "methodName": "PickupItems_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "PickUpList"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
