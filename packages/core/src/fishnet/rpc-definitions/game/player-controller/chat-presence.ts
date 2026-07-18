import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerControllerChatPresenceRpcs = [
  {
    "wireHash": 6,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Create_S",
    "parameters": [
      {
        "name": "title",
        "typeName": "System.String"
      },
      {
        "name": "password",
        "typeName": "System.String"
      },
      {
        "name": "maxMembers",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 7,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Join_S",
    "parameters": [
      {
        "name": "ownerObjectId",
        "typeName": "System.Int32"
      },
      {
        "name": "password",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 8,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Send_S",
    "parameters": [
      {
        "name": "text",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 9,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Leave_S"
  },
  {
    "wireHash": 10,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Kick_S",
    "parameters": [
      {
        "name": "targetId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 11,
    "packetKind": "serverRpc",
    "methodName": "ChatRoom_Close_S"
  },
  {
    "wireHash": 12,
    "packetKind": "targetRpc",
    "methodName": "ChatRoomJoined_T",
    "parameters": [
      {
        "name": "info",
        "typeName": "ChatRoomInfo"
      },
      {
        "name": "members",
        "typeName": "ChatRoomMemberInfo[]"
      }
    ]
  },
  {
    "wireHash": 13,
    "packetKind": "targetRpc",
    "methodName": "ChatRoomRoster_T",
    "parameters": [
      {
        "name": "members",
        "typeName": "ChatRoomMemberInfo[]"
      }
    ]
  },
  {
    "wireHash": 14,
    "packetKind": "targetRpc",
    "methodName": "ChatRoomMessage_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "RoomChatMessage"
      }
    ]
  },
  {
    "wireHash": 15,
    "packetKind": "targetRpc",
    "methodName": "ChatRoomClosed_T",
    "parameters": [
      {
        "name": "reason",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 16,
    "packetKind": "serverRpc",
    "methodName": "SendIdle_S",
    "parameters": [
      {
        "name": "idle",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 17,
    "packetKind": "serverRpc",
    "methodName": "RequestChannelSwitch",
    "parameters": [
      {
        "name": "channelIndex",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 18,
    "packetKind": "targetRpc",
    "methodName": "ChannelSwitchRejected_T",
    "parameters": [
      {
        "name": "reason",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 19,
    "packetKind": "targetRpc",
    "methodName": "ReceiveRestartPrompt",
    "parameters": [
      {
        "name": "timeText",
        "typeName": "System.String"
      },
      {
        "name": "canSwitch",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 20,
    "packetKind": "serverRpc",
    "methodName": "RequestAutoChannelSwitch"
  },
  {
    "wireHash": 21,
    "packetKind": "serverRpc",
    "methodName": "SendInputsToServer",
    "parameters": [
      {
        "name": "Inputs",
        "typeName": "PlayerInputDto",
        "fields": [
          {
            "name": "Move",
            "typeName": "UnityEngine.Vector3Int",
            "codec": "vector3IntPacked"
          },
          {
            "name": "ClickPosition",
            "typeName": "UnityEngine.Vector3Int",
            "codec": "vector3IntPacked"
          },
          {
            "name": "FastCastPosition",
            "typeName": "UnityEngine.Vector3Int",
            "codec": "vector3IntPacked"
          },
          {
            "name": "DodgeStartPosition",
            "typeName": "UnityEngine.Vector3Int",
            "codec": "vector3IntPacked"
          },
          {
            "name": "DodgeDirection",
            "typeName": "UnityEngine.Vector3Int",
            "codec": "vector3IntPacked"
          },
          {
            "name": "Click",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "AltClick",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "LootId",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "ReviveId",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "UnitId",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "InteractableId",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "InteractableName",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "InteractableNetworked",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "FastCast",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "AreaLoot",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "SkillHold",
            "typeName": "System.Boolean",
            "codec": "boolean"
          },
          {
            "name": "ClickSkillIndex",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Hotkeys",
            "typeName": "System.UInt64",
            "codec": "packedUInt64"
          },
          {
            "name": "HotkeysHeld",
            "typeName": "System.UInt64",
            "codec": "packedUInt64"
          }
        ]
      }
    ]
  },
  {
    "wireHash": 22,
    "packetKind": "serverRpc",
    "methodName": "InspectMonster",
    "parameters": [
      {
        "name": "obj",
        "typeName": "FishNet.Object.NetworkObject"
      }
    ]
  },
  {
    "wireHash": 23,
    "packetKind": "targetRpc",
    "methodName": "InspectMonster_T",
    "parameters": [
      {
        "name": "obj",
        "typeName": "FishNet.Object.NetworkObject"
      },
      {
        "name": "stats",
        "typeName": "System.Int32[]"
      }
    ]
  },
  {
    "wireHash": 24,
    "packetKind": "serverRpc",
    "methodName": "Inspect",
    "parameters": [
      {
        "name": "objectId",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 25,
    "packetKind": "targetRpc",
    "methodName": "Inspect_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterData"
      }
    ]
  },
  {
    "wireHash": 26,
    "packetKind": "targetRpc",
    "methodName": "DrawMessage",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 27,
    "packetKind": "serverRpc",
    "methodName": "ReviveSelf",
    "parameters": [
      {
        "name": "healthAndMana",
        "typeName": "System.Single"
      }
    ]
  },
  {
    "wireHash": 28,
    "packetKind": "observersRpc",
    "methodName": "Revive_C"
  },
  {
    "wireHash": 29,
    "packetKind": "serverRpc",
    "methodName": "FullHealByHealer"
  },
  {
    "wireHash": 30,
    "packetKind": "observersRpc",
    "methodName": "FullHeal_C"
  },
  {
    "wireHash": 31,
    "packetKind": "targetRpc",
    "methodName": "ChannelList_T",
    "parameters": [
      {
        "name": "playerCounts",
        "typeName": "System.Int32[]"
      },
      {
        "name": "currentIndex",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 32,
    "packetKind": "observersRpc",
    "methodName": "LevelUp_C"
  },
  {
    "wireHash": 33,
    "packetKind": "serverRpc",
    "methodName": "UpdateLootFilter_S",
    "parameters": [
      {
        "name": "dto",
        "typeName": "PlayerController+LootFilterDto"
      }
    ]
  },
  {
    "wireHash": 34,
    "packetKind": "observersRpc",
    "methodName": "Pickup_C"
  },
  {
    "wireHash": 35,
    "packetKind": "observersRpc",
    "methodName": "TriggerEmote_C",
    "parameters": [
      {
        "name": "emoteId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 36,
    "packetKind": "observersRpc",
    "methodName": "StopEmote_C"
  },
  {
    "wireHash": 37,
    "packetKind": "serverRpc",
    "methodName": "WarpHome_Rpc"
  },
  {
    "wireHash": 38,
    "packetKind": "targetRpc",
    "methodName": "WarpFailed_T",
    "parameters": [
      {
        "name": "message",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 39,
    "packetKind": "targetRpc",
    "methodName": "DrawText_T",
    "parameters": [
      {
        "name": "text",
        "typeName": "System.String"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
