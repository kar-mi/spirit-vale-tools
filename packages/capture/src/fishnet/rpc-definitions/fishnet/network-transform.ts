import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class NetworkTransformRpcDefinition {
  private constructor() {}

  static readonly typeName = "FishNet.Component.Transforming.NetworkTransform";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "observersRpc",
      "methodName": "ObserversSetSendToOwner",
      "parameters": [
        {
          "name": "value",
          "typeName": "System.Boolean"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "serverRpc",
      "methodName": "ServerSetInterval",
      "parameters": [
        {
          "name": "value",
          "typeName": "System.Byte"
        }
      ]
    },
    {
      "wireHash": 2,
      "packetKind": "observersRpc",
      "methodName": "ObserversSetInterval",
      "parameters": [
        {
          "name": "value",
          "typeName": "System.Byte"
        }
      ]
    },
    {
      "wireHash": 3,
      "packetKind": "targetRpc",
      "methodName": "TargetUpdateTransform",
      "parameters": [
        {
          "name": "data",
          "typeName": "System.ArraySegment`1[[System.Byte, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "observersRpc",
      "methodName": "ObserversUpdateClientAuthoritativeTransform",
      "parameters": [
        {
          "name": "data",
          "typeName": "System.ArraySegment`1[[System.Byte, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    },
    {
      "wireHash": 5,
      "packetKind": "serverRpc",
      "methodName": "ServerUpdateTransform",
      "parameters": [
        {
          "name": "data",
          "typeName": "System.ArraySegment`1[[System.Byte, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    },
    {
      "wireHash": 6,
      "packetKind": "serverRpc",
      "methodName": "ServerSetSynchronizedProperties",
      "parameters": [
        {
          "name": "value",
          "typeName": "FishNet.Component.Transforming.SynchronizedProperty"
        }
      ]
    },
    {
      "wireHash": 7,
      "packetKind": "observersRpc",
      "methodName": "ObserversSetSynchronizedProperties",
      "parameters": [
        {
          "name": "value",
          "typeName": "FishNet.Component.Transforming.SynchronizedProperty"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
