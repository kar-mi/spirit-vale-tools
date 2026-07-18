import type { FishNetBroadcastDefinition } from "../definitions/rpc-map.ts";

export class FishNetBroadcastDefinitions {
  private constructor() {}

  static readonly definitions = [
    {
      "wireHash": 40743,
      "typeName": "FishNet.Managing.Scened.ClientScenesLoadedBroadcast"
    },
    {
      "wireHash": 37660,
      "typeName": "FishNet.Managing.Scened.EmptyStartScenesBroadcast"
    },
    {
      "wireHash": 24702,
      "typeName": "FishNet.Managing.Scened.LoadScenesBroadcast"
    },
    {
      "wireHash": 22762,
      "typeName": "FishNet.Managing.Scened.UnloadScenesBroadcast"
    },
    {
      "wireHash": 50655,
      "typeName": "FishNet.Managing.Server.ClientConnectionChangeBroadcast"
    },
    {
      "wireHash": 50053,
      "typeName": "FishNet.Managing.Server.ConnectedClientsBroadcast"
    }
  ] as const satisfies readonly FishNetBroadcastDefinition[];
}
