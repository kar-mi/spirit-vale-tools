import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class SummoningComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "SummoningComponent";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "targetRpc",
      "methodName": "CalibrateSummons_T",
      "parameters": [
        {
          "name": "data",
          "typeName": "SummoningComponent+SummonSkillData[]"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "serverRpc",
      "methodName": "UnsummonOne_S",
      "parameters": [
        {
          "name": "skillId",
          "typeName": "System.String"
        }
      ]
    },
    {
      "wireHash": 2,
      "packetKind": "targetRpc",
      "methodName": "ApplyRecall_T",
      "parameters": [
        {
          "name": "obj",
          "typeName": "FishNet.Object.NetworkObject"
        }
      ]
    },
    {
      "wireHash": 3,
      "packetKind": "targetRpc",
      "methodName": "Swap_T",
      "parameters": [
        {
          "name": "obj",
          "typeName": "FishNet.Object.NetworkObject"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "observersRpc",
      "methodName": "CloneEffect_C"
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
