import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class SkillsComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "SkillsComponent";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "targetRpc",
      "methodName": "ApplyAnimationDelay_T",
      "parameters": [
        {
          "name": "delay",
          "typeName": "System.Single"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "observersRpc",
      "methodName": "Recover_C",
      "parameters": [
        {
          "name": "amount",
          "typeName": "System.Int32"
        },
        {
          "name": "settings",
          "typeName": "FloaterSettings"
        }
      ]
    },
    {
      "wireHash": 2,
      "packetKind": "targetRpc",
      "methodName": "ReduceCooldown_T",
      "parameters": [
        {
          "name": "skillId",
          "typeName": "System.String",
          "codec": "stringUtf8Packed"
        },
        {
          "name": "value",
          "typeName": "System.Single",
          "codec": "float32"
        }
      ]
    },
    {
      "wireHash": 3,
      "packetKind": "observersRpc",
      "methodName": "AutoCast_C",
      "parameters": [
        {
          "name": "dto",
          "typeName": "SkillStateDto",
          "fields": [
            {
              "name": "Id",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "Level",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "CurrentCooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Cooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Duration",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "CooldownRecoveryRate",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "MinCooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Cost",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "Charges",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "CastTime",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Delay",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Area",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Range",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "LeapType",
              "typeName": "LeapType",
              "codec": "packedInt32"
            }
          ]
        },
        {
          "name": "obj",
          "typeName": "FishNet.Object.NetworkObject"
        },
        {
          "name": "position",
          "typeName": "UnityEngine.Vector3"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "observersRpc",
      "methodName": "CastInterrupt_C",
      "parameters": [
        {
          "name": "castTime",
          "typeName": "System.Single"
        }
      ]
    },
    {
      "wireHash": 5,
      "packetKind": "observersRpc",
      "methodName": "CastCancel_C"
    },
    {
      "wireHash": 6,
      "packetKind": "observersRpc",
      "methodName": "CastBegin_C",
      "parameters": [
        {
          "name": "dto",
          "typeName": "SkillStateDto",
          "fields": [
            {
              "name": "Id",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "Level",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "CurrentCooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Cooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Duration",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "CooldownRecoveryRate",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "MinCooldown",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Cost",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "Charges",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "CastTime",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Delay",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Area",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "Range",
              "typeName": "System.Single",
              "codec": "float32"
            },
            {
              "name": "LeapType",
              "typeName": "LeapType",
              "codec": "packedInt32"
            }
          ]
        },
        {
          "name": "targetId",
          "typeName": "System.Int32",
          "codec": "packedInt32"
        },
        {
          "name": "position",
          "typeName": "UnityEngine.Vector3",
          "codec": "vector3"
        },
        {
          "name": "castTime",
          "typeName": "System.Single",
          "codec": "float32"
        },
        {
          "name": "animTime",
          "typeName": "System.Single",
          "codec": "float32"
        }
      ]
    },
    {
      "wireHash": 7,
      "packetKind": "observersRpc",
      "methodName": "CastComplete_C"
    },
    {
      "wireHash": 8,
      "packetKind": "observersRpc",
      "methodName": "ToggleBegin_C",
      "parameters": [
        {
          "name": "id",
          "typeName": "System.String"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
