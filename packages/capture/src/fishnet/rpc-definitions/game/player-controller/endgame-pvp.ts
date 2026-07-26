import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerControllerEndgamePvpRpcs = [
  {
    "wireHash": 90,
    "packetKind": "serverRpc",
    "methodName": "ETEnter"
  },
  {
    "wireHash": 91,
    "packetKind": "serverRpc",
    "methodName": "ETLeave"
  },
  {
    "wireHash": 92,
    "packetKind": "targetRpc",
    "methodName": "ETUpdateRun",
    "parameters": [
      {
        "name": "match",
        "typeName": "EternalTowerRun"
      }
    ]
  },
  {
    "wireHash": 93,
    "packetKind": "targetRpc",
    "methodName": "ETAdvanceFloor",
    "parameters": [
      {
        "name": "floor",
        "typeName": "System.Int32"
      },
      {
        "name": "finished",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 94,
    "packetKind": "serverRpc",
    "methodName": "ETAdvanceFloor_S"
  },
  {
    "wireHash": 95,
    "packetKind": "serverRpc",
    "methodName": "PvpEnterQueue",
    "parameters": [
      {
        "name": "mode",
        "typeName": "GameMode"
      }
    ]
  },
  {
    "wireHash": 96,
    "packetKind": "serverRpc",
    "methodName": "PvpLeaveQueue"
  },
  {
    "wireHash": 97,
    "packetKind": "serverRpc",
    "methodName": "PvpForfeit"
  },
  {
    "wireHash": 98,
    "packetKind": "serverRpc",
    "methodName": "PvpEnterSkirmish"
  },
  {
    "wireHash": 99,
    "packetKind": "serverRpc",
    "methodName": "RequestPvpQueueTransfer"
  },
  {
    "wireHash": 100,
    "packetKind": "targetRpc",
    "methodName": "PvpUpdateMatch",
    "parameters": [
      {
        "name": "match",
        "typeName": "PvpMatch"
      }
    ]
  },
  {
    "wireHash": 101,
    "packetKind": "serverRpc",
    "methodName": "AcceptSession"
  },
  {
    "wireHash": 102,
    "packetKind": "serverRpc",
    "methodName": "DeclineSession"
  },
  {
    "wireHash": 103,
    "packetKind": "targetRpc",
    "methodName": "UpdateSession",
    "parameters": [
      {
        "name": "next",
        "typeName": "GameSession"
      }
    ]
  },
  {
    "wireHash": 104,
    "packetKind": "targetRpc",
    "methodName": "DrawTitle",
    "parameters": [
      {
        "name": "title",
        "typeName": "System.String"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
