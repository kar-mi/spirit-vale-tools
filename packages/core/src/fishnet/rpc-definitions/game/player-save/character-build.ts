import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveCharacterBuildRpcs = [
  {
    "wireHash": 9,
    "packetKind": "serverRpc",
    "methodName": "WeaponSwap_S"
  },
  {
    "wireHash": 10,
    "packetKind": "serverRpc",
    "methodName": "HeavySwap_S"
  },
  {
    "wireHash": 11,
    "packetKind": "serverRpc",
    "methodName": "ApplyHeavyEquip_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 12,
    "packetKind": "serverRpc",
    "methodName": "RemoveHeavyEquip_S"
  },
  {
    "wireHash": 13,
    "packetKind": "serverRpc",
    "methodName": "RenameCharacter_S",
    "parameters": [
      {
        "name": "name",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 14,
    "packetKind": "serverRpc",
    "methodName": "ApplyAppearance_S",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterAppearanceDto"
      }
    ]
  },
  {
    "wireHash": 15,
    "packetKind": "serverRpc",
    "methodName": "CreateCharacter_S",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterAppearanceDto"
      }
    ]
  },
  {
    "wireHash": 16,
    "packetKind": "serverRpc",
    "methodName": "DeleteCharacter_S",
    "parameters": [
      {
        "name": "characterId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 17,
    "packetKind": "serverRpc",
    "methodName": "ResetAttributes_S"
  },
  {
    "wireHash": 18,
    "packetKind": "serverRpc",
    "methodName": "ApplyAttributes_S",
    "parameters": [
      {
        "name": "change",
        "typeName": "System.Int32[]"
      }
    ]
  },
  {
    "wireHash": 19,
    "packetKind": "serverRpc",
    "methodName": "UseEssence_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      },
      {
        "name": "type",
        "typeName": "EssenceType"
      },
      {
        "name": "substatIndex",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 20,
    "packetKind": "serverRpc",
    "methodName": "RefineEquip_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      },
      {
        "name": "safe",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 21,
    "packetKind": "serverRpc",
    "methodName": "RefineArtifact_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      },
      {
        "name": "safe",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 22,
    "packetKind": "serverRpc",
    "methodName": "RefineGem_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      },
      {
        "name": "safe",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 23,
    "packetKind": "targetRpc",
    "methodName": "Refine_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterData"
      },
      {
        "name": "success",
        "typeName": "System.Boolean"
      }
    ]
  },
  {
    "wireHash": 24,
    "packetKind": "observersRpc",
    "methodName": "ShowRefineResult",
    "parameters": [
      {
        "name": "position",
        "typeName": "UnityEngine.Vector3"
      },
      {
        "name": "success",
        "typeName": "System.Boolean"
      },
      {
        "name": "refine",
        "typeName": "System.Int32"
      }
    ]
  },
  {
    "wireHash": 25,
    "packetKind": "serverRpc",
    "methodName": "ApplyEquip_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 26,
    "packetKind": "serverRpc",
    "methodName": "RemoveEquip_S",
    "parameters": [
      {
        "name": "slot",
        "typeName": "EquipSlot"
      }
    ]
  },
  {
    "wireHash": 27,
    "packetKind": "serverRpc",
    "methodName": "ApplyCard_S",
    "parameters": [
      {
        "name": "equipUid",
        "typeName": "System.String"
      },
      {
        "name": "cardId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 28,
    "packetKind": "serverRpc",
    "methodName": "RemoveCards_S",
    "parameters": [
      {
        "name": "equipUid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 29,
    "packetKind": "serverRpc",
    "methodName": "ApplyGem_S",
    "parameters": [
      {
        "name": "artifactUid",
        "typeName": "System.String"
      },
      {
        "name": "gemUid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 30,
    "packetKind": "serverRpc",
    "methodName": "RemoveGems_S",
    "parameters": [
      {
        "name": "artifactUid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 31,
    "packetKind": "serverRpc",
    "methodName": "ApplyGrimoire_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 32,
    "packetKind": "serverRpc",
    "methodName": "RemoveGrimoire_S",
    "parameters": [
      {
        "name": "uid",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 33,
    "packetKind": "serverRpc",
    "methodName": "ApplyArtifact_S",
    "parameters": [
      {
        "name": "artifact",
        "typeName": "ArtifactData"
      }
    ]
  },
  {
    "wireHash": 34,
    "packetKind": "serverRpc",
    "methodName": "RemoveArtifact_S",
    "parameters": [
      {
        "name": "slot",
        "typeName": "ArtifactSlot"
      }
    ]
  },
  {
    "wireHash": 35,
    "packetKind": "serverRpc",
    "methodName": "UseConsumable_S",
    "parameters": [
      {
        "name": "consumableId",
        "typeName": "System.String"
      }
    ]
  },
  {
    "wireHash": 36,
    "packetKind": "serverRpc",
    "methodName": "AdvanceToClass",
    "parameters": [
      {
        "name": "type",
        "typeName": "Archetype"
      }
    ]
  },
  {
    "wireHash": 37,
    "packetKind": "serverRpc",
    "methodName": "ResetSkills_S"
  },
  {
    "wireHash": 38,
    "packetKind": "serverRpc",
    "methodName": "ApplySkills_S",
    "parameters": [
      {
        "name": "skills",
        "typeName": "System.Collections.Generic.List`1[[SkillData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]"
      }
    ]
  },
  {
    "wireHash": 39,
    "packetKind": "serverRpc",
    "methodName": "AssignSkill_S",
    "parameters": [
      {
        "name": "index",
        "typeName": "System.Int32"
      },
      {
        "name": "id",
        "typeName": "System.String"
      },
      {
        "name": "level",
        "typeName": "System.Int32"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
