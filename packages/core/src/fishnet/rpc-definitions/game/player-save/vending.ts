import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveVendingRpcs = [
  {
    "wireHash": 65,
    "packetKind": "serverRpc",
    "methodName": "VendingListItems_S",
    "parameters": [
      {
        "name": "listings",
        "typeName": "System.Collections.Generic.List`1[[VendingListing, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 66,
    "packetKind": "targetRpc",
    "methodName": "VendingListResult_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      },
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 67,
    "packetKind": "serverRpc",
    "methodName": "VendingCancelListing_S",
    "parameters": [
      {
        "name": "listingId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 68,
    "packetKind": "targetRpc",
    "methodName": "VendingCancelResult_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 69,
    "packetKind": "serverRpc",
    "methodName": "VendingCollect_S"
  },
  {
    "wireHash": 70,
    "packetKind": "targetRpc",
    "methodName": "VendingCollectResult_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 71,
    "packetKind": "serverRpc",
    "methodName": "VendingPurchase_S",
    "parameters": [
      {
        "name": "listingId",
        "typeName": "System.String"
      },
      {
        "name": "count",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 72,
    "packetKind": "targetRpc",
    "methodName": "VendingPurchaseResult_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      },
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 73,
    "packetKind": "serverRpc",
    "methodName": "HireVendingStall_S",
    "parameters": [
      {
        "name": "shopName",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 74,
    "packetKind": "targetRpc",
    "methodName": "HireVendingStallResult_T",
    "parameters": [
      {
        "name": "success",
        "typeName": "System.Boolean"
      },
      {
        "name": "error",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 75,
    "packetKind": "serverRpc",
    "methodName": "ReleaseVendingStall_S"
  },
  {
    "wireHash": 76,
    "packetKind": "targetRpc",
    "methodName": "ReleaseVendingStallResult_T"
  }
] as const satisfies readonly FishNetRpcDefinition[];
