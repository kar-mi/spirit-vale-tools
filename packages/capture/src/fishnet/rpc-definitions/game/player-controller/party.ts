import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerControllerPartyRpcs = [
  {
    "wireHash": 40,
    "packetKind": "serverRpc",
    "methodName": "SendPartyInvite",
    "parameters": [
      {
        "name": "playerId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 41,
    "packetKind": "serverRpc",
    "methodName": "RequestJoinParty",
    "parameters": [
      {
        "name": "partyId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 42,
    "packetKind": "targetRpc",
    "methodName": "ShowPartyInvite_T",
    "parameters": [
      {
        "name": "inviterName",
        "typeName": "System.String"
      },
      {
        "name": "inviterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 43,
    "packetKind": "targetRpc",
    "methodName": "ShowJoinRequest_T",
    "parameters": [
      {
        "name": "requesterName",
        "typeName": "System.String"
      },
      {
        "name": "requesterId",
        "typeName": "System.String"
      },
      {
        "name": "partyId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 44,
    "packetKind": "serverRpc",
    "methodName": "AcceptPartyInvite",
    "parameters": [
      {
        "name": "inviterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 45,
    "packetKind": "serverRpc",
    "methodName": "AcceptPartyRequestJoin",
    "parameters": [
      {
        "name": "requesterId",
        "typeName": "System.String"
      },
      {
        "name": "partyId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 46,
    "packetKind": "serverRpc",
    "methodName": "DeclinePartyInvite",
    "parameters": [
      {
        "name": "inviterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 47,
    "packetKind": "serverRpc",
    "methodName": "DeclinePartyRequestJoin",
    "parameters": [
      {
        "name": "requesterId",
        "typeName": "System.String"
      },
      {
        "name": "partyId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 48,
    "packetKind": "serverRpc",
    "methodName": "CreateParty"
  },
  {
    "wireHash": 49,
    "packetKind": "serverRpc",
    "methodName": "LeaveParty_S"
  },
  {
    "wireHash": 50,
    "packetKind": "targetRpc",
    "methodName": "UpdateParty_T",
    "parameters": [
      {
        "name": "party",
        "typeName": "Party"
      }
    ]
  },
  {
    "wireHash": 51,
    "packetKind": "serverRpc",
    "methodName": "KickFromParty",
    "parameters": [
      {
        "name": "playerId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 52,
    "packetKind": "serverRpc",
    "methodName": "PromotePartyLeader",
    "parameters": [
      {
        "name": "playerId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 53,
    "packetKind": "serverRpc",
    "methodName": "SetPartyName",
    "parameters": [
      {
        "name": "value",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 54,
    "packetKind": "serverRpc",
    "methodName": "SetPartyExp",
    "parameters": [
      {
        "name": "value",
        "typeName": "PartyShareType"
      }
    ]
  },
  {
    "wireHash": 55,
    "packetKind": "serverRpc",
    "methodName": "SetPartyDrops",
    "parameters": [
      {
        "name": "value",
        "typeName": "PartyShareType"
      }
    ]
  },
  {
    "wireHash": 56,
    "packetKind": "serverRpc",
    "methodName": "SetPartyLevelRange",
    "parameters": [
      {
        "name": "min",
        "typeName": "System.Int32"
      },
      {
        "name": "max",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 57,
    "packetKind": "serverRpc",
    "methodName": "SetPartyPublic",
    "parameters": [
      {
        "name": "value",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 58,
    "packetKind": "serverRpc",
    "methodName": "RequestPartyList_S"
  },
  {
    "wireHash": 59,
    "packetKind": "targetRpc",
    "methodName": "RequestPartyList_T",
    "parameters": [
      {
        "name": "items",
        "typeName": "System.Collections.Generic.List`1[[Party, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
