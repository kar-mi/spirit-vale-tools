import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class MoveComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "MoveComponent";
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
      "methodName": "SetSitting_C",
      "parameters": [
        {
          "name": "isSitting",
          "typeName": "System.Boolean"
        }
      ]
    },
    {
      "wireHash": 2,
      "packetKind": "observersRpc",
      "methodName": "CancelSitInstant_C"
    },
    {
      "wireHash": 3,
      "packetKind": "observersRpc",
      "methodName": "ApplyKnockback_C",
      "parameters": [
        {
          "name": "destination",
          "typeName": "UnityEngine.Vector3"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "observersRpc",
      "methodName": "Dodge_O"
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
