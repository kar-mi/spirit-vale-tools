import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class CombatComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "CombatComponent";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "observersRpc",
      "methodName": "Attack_C",
      "parameters": [
        {
          "name": "position",
          "typeName": "UnityEngine.Vector3",
          "codec": "vector3"
        },
        {
          "name": "attackTime",
          "typeName": "System.Single",
          "codec": "float32"
        },
        {
          "name": "attackIndex",
          "typeName": "System.Int32",
          "codec": "packedInt32"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
