import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerControllerGuildRpcs = [
  {
    "wireHash": 105,
    "packetKind": "serverRpc",
    "methodName": "Guild_Create_S",
    "parameters": [
      {
        "name": "name",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 106,
    "packetKind": "serverRpc",
    "methodName": "Guild_Rename_S",
    "parameters": [
      {
        "name": "name",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 107,
    "packetKind": "serverRpc",
    "methodName": "Guild_Disband_S",
    "parameters": [
      {
        "name": "confirmName",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 108,
    "packetKind": "serverRpc",
    "methodName": "Guild_Invite_S",
    "parameters": [
      {
        "name": "characterName",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 109,
    "packetKind": "serverRpc",
    "methodName": "Guild_InviteById_S",
    "parameters": [
      {
        "name": "accountId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 110,
    "packetKind": "serverRpc",
    "methodName": "Guild_AcceptInvite_S",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 111,
    "packetKind": "serverRpc",
    "methodName": "Guild_DeclineInvite_S",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 112,
    "packetKind": "serverRpc",
    "methodName": "Guild_Kick_S",
    "parameters": [
      {
        "name": "characterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 113,
    "packetKind": "serverRpc",
    "methodName": "Guild_Leave_S"
  },
  {
    "wireHash": 114,
    "packetKind": "serverRpc",
    "methodName": "Guild_LeaveAndPass_S",
    "parameters": [
      {
        "name": "newMasterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 115,
    "packetKind": "serverRpc",
    "methodName": "Guild_Transfer_S",
    "parameters": [
      {
        "name": "newMasterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 116,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetMemberRank_S",
    "parameters": [
      {
        "name": "charId",
        "typeName": "System.String"
      },
      {
        "name": "rankId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 117,
    "packetKind": "serverRpc",
    "methodName": "Guild_EditRank_S",
    "parameters": [
      {
        "name": "rankId",
        "typeName": "System.String"
      },
      {
        "name": "displayName",
        "typeName": "System.String"
      },
      {
        "name": "taxPercent",
        "typeName": "System.Single"
      },
      {
        "name": "permissions",
        "typeName": "System.Int32"
      },
      {
        "name": "storageAccess",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 118,
    "packetKind": "serverRpc",
    "methodName": "Guild_AddRank_S"
  },
  {
    "wireHash": 119,
    "packetKind": "serverRpc",
    "methodName": "Guild_RemoveRank_S",
    "parameters": [
      {
        "name": "rankId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 120,
    "packetKind": "serverRpc",
    "methodName": "Guild_MoveRank_S",
    "parameters": [
      {
        "name": "rankId",
        "typeName": "System.String"
      },
      {
        "name": "direction",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 121,
    "packetKind": "serverRpc",
    "methodName": "Guild_SpendSkill_S",
    "parameters": [
      {
        "name": "nodeId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 122,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetNotice_S",
    "parameters": [
      {
        "name": "shortMsg",
        "typeName": "System.String"
      },
      {
        "name": "longMsg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 123,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetDiscord_S",
    "parameters": [
      {
        "name": "url",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 124,
    "packetKind": "serverRpc",
    "methodName": "Guild_StorageTransaction_S",
    "parameters": [
      {
        "name": "transaction",
        "typeName": "Transaction"
      }
    ]
  },
  {
    "wireHash": 125,
    "packetKind": "serverRpc",
    "methodName": "Guild_OpenStorage_S"
  },
  {
    "wireHash": 126,
    "packetKind": "serverRpc",
    "methodName": "Guild_CloseStorage_S"
  },
  {
    "wireHash": 127,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetEmblem_S",
    "parameters": [
      {
        "name": "index",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 128,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetCustomEmblem_S",
    "parameters": [
      {
        "name": "png",
        "typeName": "System.Byte[]"
      }
    ]
  },
  {
    "wireHash": 129,
    "packetKind": "serverRpc",
    "methodName": "Guild_RequestEmblem_S",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 130,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetNameColor_S",
    "parameters": [
      {
        "name": "hex",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 131,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetMuted_S",
    "parameters": [
      {
        "name": "muted",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 132,
    "packetKind": "serverRpc",
    "methodName": "Guild_SetRecruitment_S",
    "parameters": [
      {
        "name": "mode",
        "typeName": "System.Int32"
      },
      {
        "name": "message",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 133,
    "packetKind": "serverRpc",
    "methodName": "Guild_Apply_S",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      },
      {
        "name": "message",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 134,
    "packetKind": "serverRpc",
    "methodName": "Guild_CancelApplication_S",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 135,
    "packetKind": "serverRpc",
    "methodName": "Guild_AcceptApplication_S",
    "parameters": [
      {
        "name": "applicantCharId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 136,
    "packetKind": "serverRpc",
    "methodName": "Guild_RejectApplication_S",
    "parameters": [
      {
        "name": "applicantCharId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 137,
    "packetKind": "serverRpc",
    "methodName": "Guild_Browse_S",
    "parameters": [
      {
        "name": "query",
        "typeName": "System.String"
      },
      {
        "name": "page",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 138,
    "packetKind": "serverRpc",
    "methodName": "Guild_RequestPending_S"
  },
  {
    "wireHash": 139,
    "packetKind": "serverRpc",
    "methodName": "Guild_RequestAuditLog_S",
    "parameters": [
      {
        "name": "page",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 140,
    "packetKind": "serverRpc",
    "methodName": "Guild_RequestPresence_S"
  },
  {
    "wireHash": 141,
    "packetKind": "targetRpc",
    "methodName": "GuildStorageLockResult_T",
    "parameters": [
      {
        "name": "acquired",
        "typeName": "System.Boolean"
      },
      {
        "name": "holderName",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 142,
    "packetKind": "targetRpc",
    "methodName": "GuildStorageLockExpired_T"
  },
  {
    "wireHash": 143,
    "packetKind": "targetRpc",
    "methodName": "GuildStorageTransactionFailed_T",
    "parameters": [
      {
        "name": "msg",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 144,
    "packetKind": "targetRpc",
    "methodName": "UpdateGuild_T",
    "parameters": [
      {
        "name": "guild",
        "typeName": "GuildData"
      }
    ]
  },
  {
    "wireHash": 145,
    "packetKind": "targetRpc",
    "methodName": "GuildEmblemResult_T",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      },
      {
        "name": "stamp",
        "typeName": "System.String"
      },
      {
        "name": "png",
        "typeName": "System.Byte[]"
      }
    ]
  },
  {
    "wireHash": 146,
    "packetKind": "targetRpc",
    "methodName": "GuildInvite_T",
    "parameters": [
      {
        "name": "guildId",
        "typeName": "System.String"
      },
      {
        "name": "guildName",
        "typeName": "System.String"
      },
      {
        "name": "inviterName",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 147,
    "packetKind": "targetRpc",
    "methodName": "GuildBrowseResults_T",
    "parameters": [
      {
        "name": "entries",
        "typeName": "GuildBrowseEntry[]"
      },
      {
        "name": "page",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 148,
    "packetKind": "targetRpc",
    "methodName": "GuildPendingResults_T",
    "parameters": [
      {
        "name": "entries",
        "typeName": "GuildBrowseEntry[]"
      }
    ]
  },
  {
    "wireHash": 149,
    "packetKind": "targetRpc",
    "methodName": "GuildAuditResults_T",
    "parameters": [
      {
        "name": "entries",
        "typeName": "GuildAuditEntry[]"
      },
      {
        "name": "page",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 150,
    "packetKind": "targetRpc",
    "methodName": "GuildPresenceResults_T",
    "parameters": [
      {
        "name": "presence",
        "typeName": "GuildMemberPresence[]"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
