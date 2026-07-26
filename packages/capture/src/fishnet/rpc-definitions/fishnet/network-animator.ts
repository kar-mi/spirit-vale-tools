import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class NetworkAnimatorRpcDefinition {
  private constructor() {}

  static readonly typeName = "FishNet.Component.Animating.NetworkAnimator";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "targetRpc",
      "methodName": "TargetAnimatorUpdated",
      "parameters": [
        {
          "name": "data",
          "typeName": "System.ArraySegment`1[[System.Byte, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "serverRpc",
      "methodName": "ServerAnimatorUpdated",
      "parameters": [
        {
          "name": "data",
          "typeName": "System.ArraySegment`1[[System.Byte, System.Private.CoreLib, Version=9.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
