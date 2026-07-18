import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveSessionCharacterRpcs = [
  {
    "wireHash": 0,
    "packetKind": "serverRpc",
    "methodName": "Login",
    "parameters": [
      {
        "name": "ticket",
        "typeName": "System.String"
      },
      {
        "name": "version",
        "typeName": "System.String"
      },
      {
        "name": "deviceUID",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 1,
    "packetKind": "targetRpc",
    "methodName": "SetIsDemo_T",
    "parameters": [
      {
        "name": "isDemo",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 2,
    "packetKind": "targetRpc",
    "methodName": "ShowPremiumCurrencyChanged_T",
    "parameters": [
      {
        "name": "total",
        "typeName": "System.Int64"
      }
    ]
  },
  {
    "wireHash": 3,
    "packetKind": "targetRpc",
    "methodName": "SetDisconnectedReason",
    "parameters": [
      {
        "name": "reason",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 4,
    "packetKind": "serverRpc",
    "methodName": "LoadCharacter_S",
    "parameters": [
      {
        "name": "characterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 5,
    "packetKind": "targetRpc",
    "methodName": "LoadCharacter_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterData"
      }
    ]
  },
  {
    "wireHash": 6,
    "packetKind": "serverRpc",
    "methodName": "LoadCharacterComplete"
  },
  {
    "wireHash": 7,
    "packetKind": "serverRpc",
    "methodName": "QuitCharacter_Rpc"
  },
  {
    "wireHash": 8,
    "packetKind": "targetRpc",
    "methodName": "CharacterListCallback_T",
    "parameters": [
      {
        "name": "characters",
        "typeName": "System.Collections.Generic.List`1[[CharacterData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
