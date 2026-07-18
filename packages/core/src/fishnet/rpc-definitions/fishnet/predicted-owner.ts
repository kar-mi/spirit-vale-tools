import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class PredictedOwnerRpcDefinition {
  private constructor() {}

  static readonly typeName = "FishNet.Component.Ownership.PredictedOwner";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "serverRpc",
      "methodName": "ServerTakeOwnership",
      "parameters": [
        {
          "name": "includeNested",
          "typeName": "System.Boolean"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
