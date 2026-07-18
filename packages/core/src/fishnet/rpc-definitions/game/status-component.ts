import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class StatusComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "StatusComponent";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "serverRpc",
      "methodName": "CancelEffect_S",
      "parameters": [
        {
          "name": "id",
          "typeName": "System.String"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "observersRpc",
      "methodName": "ApplySkillDisplay_O",
      "parameters": [
        {
          "name": "id",
          "typeName": "System.String",
          "codec": "stringUtf8Packed"
        },
        {
          "name": "lv",
          "typeName": "System.Int32",
          "codec": "packedInt32"
        }
      ]
    },
    {
      "wireHash": 2,
      "packetKind": "observersRpc",
      "methodName": "RemoveSkillDisplay_O",
      "parameters": [
        {
          "name": "id",
          "typeName": "System.String"
        }
      ]
    },
    {
      "wireHash": 3,
      "packetKind": "targetRpc",
      "methodName": "ApplyEffect_T",
      "parameters": [
        {
          "name": "statusId",
          "typeName": "System.String"
        },
        {
          "name": "level",
          "typeName": "System.Int32"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "targetRpc",
      "methodName": "RemoveEffect_T",
      "parameters": [
        {
          "name": "statusId",
          "typeName": "System.String"
        },
        {
          "name": "level",
          "typeName": "System.Int32"
        }
      ]
    },
    {
      "wireHash": 5,
      "packetKind": "observersRpc",
      "methodName": "ApplyEffectDisplays_O",
      "parameters": [
        {
          "name": "applies",
          "typeName": "StatusComponent+QueuedEffectDisplay[]"
        },
        {
          "name": "removes",
          "typeName": "System.Collections.Generic.List`1[[System.String, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
