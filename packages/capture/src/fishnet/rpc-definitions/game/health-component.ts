import type { FishNetBehaviourDefinition, FishNetRpcDefinition, FishNetSyncTypeDefinition } from "../../definitions/rpc-map.ts";

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
          "typeName": "System.Int32",
          "codec": "packedInt32"
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
  /**
   * Named from observation rather than from game metadata: index 0 reconciles against accumulated
   * damage and healing on ~91% of updates in a live capture, and index 1 is written alongside it to
   * the same value on spawn and on a full restore. `packages/character/src/record-decoder.ts` has
   * read both positionally for some time; declaring them here is what puts a name on the packet.
   */
  static readonly syncTypes = [
    { "index": 0, "name": "CurrentHealth", "typeName": "System.Int32", "codec": "packedInt32" },
    { "index": 1, "name": "MaxHealth", "typeName": "System.Int32", "codec": "packedInt32" },
  ] as const satisfies readonly FishNetSyncTypeDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
    syncTypes: this.syncTypes,
  } as const satisfies FishNetBehaviourDefinition;
}
