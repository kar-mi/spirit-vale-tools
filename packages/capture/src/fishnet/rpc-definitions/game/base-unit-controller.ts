import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../definitions/rpc-map.ts";

export class BaseUnitControllerRpcDefinition {
  private constructor() {}

  static readonly typeName = "BaseUnitController";
  static readonly rpcs = [
    {
      "wireHash": 0,
      "packetKind": "serverRpc",
      "methodName": "TraverseShipCaptain",
      "parameters": [
        {
          "name": "npcId",
          "typeName": "System.String"
        }
      ]
    },
    {
      "wireHash": 1,
      "packetKind": "targetRpc",
      "methodName": "ClientPrepareTransfer"
    },
    {
      "wireHash": 2,
      "packetKind": "targetRpc",
      "methodName": "ClientSwitchServer",
      "parameters": [
        {
          "name": "host",
          "typeName": "System.String"
        },
        {
          "name": "port",
          "typeName": "System.UInt16"
        }
      ]
    },
    {
      "wireHash": 3,
      "packetKind": "observersRpc",
      "methodName": "TraverseObservers",
      "parameters": [
        {
          "name": "mapId",
          "typeName": "System.Int32"
        },
        {
          "name": "dto",
          "typeName": "BaseUnitController+TraverseDto"
        }
      ]
    },
    {
      "wireHash": 4,
      "packetKind": "targetRpc",
      "methodName": "TraverseActive",
      "parameters": [
        {
          "name": "mapId",
          "typeName": "System.Int32"
        },
        {
          "name": "dto",
          "typeName": "BaseUnitController+TraverseDto"
        }
      ]
    },
    {
      "wireHash": 5,
      "packetKind": "observersRpc",
      "methodName": "SyncInstanceState",
      "parameters": [
        {
          "name": "mapId",
          "typeName": "System.Int32"
        },
        {
          "name": "instanceId",
          "typeName": "System.Int32"
        }
      ]
    }
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
