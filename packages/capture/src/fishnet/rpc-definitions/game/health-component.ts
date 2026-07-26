import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class HealthComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "HealthComponent";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "observersRpc",
      "methodName": "ApplyDamage_C",
      "parameters": [
        {
          "name": "dmg",
          "typeName": "Damage",
          "fields": [
            {
              "name": "Team",
              "typeName": "CombatTeam",
              "codec": "packedInt32"
            },
            {
              "name": "Value",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "Type",
              "typeName": "DamageType",
              "codec": "packedInt32"
            },
            {
              "name": "Hit",
              "typeName": "HitResult",
              "codec": "packedInt32"
            },
            {
              "name": "Hits",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "DamageSourceId",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "AttackerId",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "IsClone",
              "typeName": "System.Boolean",
              "codec": "boolean"
            },
            {
              "name": "IsSummon",
              "typeName": "System.Boolean",
              "codec": "boolean"
            },
            {
              "name": "Element",
              "typeName": "Element",
              "codec": "packedInt32"
            },
            {
              "name": "WeaponType",
              "typeName": "EquipType",
              "codec": "packedInt32"
            },
            {
              "name": "Range",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            }
          ]
        },
        {
          "name": "position",
          "typeName": "UnityEngine.Vector3",
          "codec": "vector3"
        },
        {
          "name": "origin",
          "typeName": "UnityEngine.Vector3",
          "codec": "vector3"
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
      "packetKind": "observersRpc",
      "methodName": "Death_C",
      "parameters": [
        {
          "name": "dmg",
          "typeName": "Damage",
          "fields": [
            {
              "name": "Team",
              "typeName": "CombatTeam",
              "codec": "packedInt32"
            },
            {
              "name": "Value",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "Type",
              "typeName": "DamageType",
              "codec": "packedInt32"
            },
            {
              "name": "Hit",
              "typeName": "HitResult",
              "codec": "packedInt32"
            },
            {
              "name": "Hits",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "DamageSourceId",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "AttackerId",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            },
            {
              "name": "IsClone",
              "typeName": "System.Boolean",
              "codec": "boolean"
            },
            {
              "name": "IsSummon",
              "typeName": "System.Boolean",
              "codec": "boolean"
            },
            {
              "name": "Element",
              "typeName": "Element",
              "codec": "packedInt32"
            },
            {
              "name": "WeaponType",
              "typeName": "EquipType",
              "codec": "packedInt32"
            },
            {
              "name": "Range",
              "typeName": "System.Int32",
              "codec": "packedInt32"
            }
          ]
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
