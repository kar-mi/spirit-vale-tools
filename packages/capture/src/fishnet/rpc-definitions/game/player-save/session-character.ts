import type { FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";

export const playerSaveSessionCharacterRpcs = [
  {
    "wireHash": 0,
    "packetKind": "serverRpc",
    "methodName": "Login",
    "parameters": [
      {
        "name": "ticket",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "version",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "deviceUID",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "branch",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "instancedMapTicketId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "instancedMapFlowId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "instancedMapId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "instancedMapCharacterId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 1,
    "packetKind": "targetRpc",
    "methodName": "SetIsDemo_T",
    "parameters": [
      {
        "name": "isDemo",
        "typeName": "System.Boolean",
        "codec": "boolean"
      }
    ]
  },
  {
    "wireHash": 2,
    "packetKind": "targetRpc",
    "methodName": "ShowPremiumCurrencyChanged_T",
    "parameters": [
      {
        "name": "total",
        "typeName": "System.Int64",
        "codec": "packedInt64"
      }
    ]
  },
  {
    "wireHash": 3,
    "packetKind": "targetRpc",
    "methodName": "SetDisconnectedReason",
    "parameters": [
      {
        "name": "reason",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 4,
    "packetKind": "serverRpc",
    "methodName": "LoadCharacter_S",
    "parameters": [
      {
        "name": "characterId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 5,
    "packetKind": "targetRpc",
    "methodName": "LoadCharacter_T",
    "parameters": [
      {
        "name": "data",
        "typeName": "CharacterData",
        "fields": [
          {
            "name": "UID",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "AppliedWriteIds",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "AccountId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Version",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "GuildId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "GuildRankId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Name",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Appearance",
            "typeName": "CharacterAppearanceData",
            "nullable": true,
            "fields": [
              {
                "name": "BodyColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Hair",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "HairColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Brow",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Beard",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Mouth",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Eye",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "EyeColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Ears",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Iris",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              }
            ]
          },
          {
            "name": "EquipAppearance",
            "typeName": "EquipAppearanceData",
            "nullable": true,
            "fields": [
              {
                "name": "EquipSlotsHidden",
                "typeName": "System.Boolean[]",
                "repeated": true,
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Cosmetics",
            "typeName": "System.Collections.Generic.List`1[[CosmeticSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "CosmeticSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Rarity",
                "typeName": "ItemRarity",
                "codec": "packedInt32"
              },
              {
                "name": "Shiny",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Title",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "ChatBubble",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Badge",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Archetypes",
            "typeName": "System.Collections.Generic.List`1[[Archetype, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "codec": "packedInt32"
          },
          {
            "name": "Level",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Exp",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "JobLevel",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "JobExp",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "State",
            "typeName": "CharacterStateData",
            "nullable": true,
            "fields": [
              {
                "name": "HealthNormlised",
                "typeName": "System.Single",
                "codec": "float32"
              },
              {
                "name": "ManaNormlised",
                "typeName": "System.Single",
                "codec": "float32"
              },
              {
                "name": "MapId",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Position",
                "typeName": "VectorData",
                "nullable": true,
                "fields": [
                  {
                    "name": "x",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "y",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "z",
                    "typeName": "System.Single",
                    "codec": "float32"
                  }
                ]
              },
              {
                "name": "Summons",
                "typeName": "System.Collections.Generic.List`1[[SummonSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "SkillId",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Exclusive",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  },
                  {
                    "name": "Reanimation",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "CloneCount",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Toggles",
                "typeName": "System.Collections.Generic.List`1[[ToggleSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "SkillId",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Effects",
                "typeName": "System.Collections.Generic.List`1[[EffectSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Duration",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "Stacks",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              }
            ]
          },
          {
            "name": "Attributes",
            "typeName": "System.Int32[]",
            "repeated": true,
            "codec": "packedInt32"
          },
          {
            "name": "Equips",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "ActiveLoadout",
            "typeName": "WeaponLoadout",
            "codec": "packedInt32"
          },
          {
            "name": "LoadoutNormal",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LoadoutSecondary",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LoadoutHeavy",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "Artifacts",
            "typeName": "System.Collections.Generic.List`1[[ArtifactData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Substats",
                "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Type",
                    "typeName": "StatType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Value",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ValueStr",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  }
                ]
              },
              {
                "name": "Slot",
                "typeName": "ArtifactSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Gems",
                "typeName": "System.Collections.Generic.List`1[[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "UID",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Refine",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Favorite",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Skills",
            "typeName": "SkillSystemData",
            "nullable": true,
            "fields": [
              {
                "name": "Skills",
                "typeName": "System.Collections.Generic.List`1[[SkillData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Assigned",
                "typeName": "System.Collections.Generic.List`1[[SkillData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "SkillCopy",
                "typeName": "SkillData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Reanimations",
                "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                "repeated": true,
                "codec": "stringUtf8Packed"
              }
            ]
          },
          {
            "name": "Grimoires",
            "typeName": "System.Collections.Generic.List`1[[EquipData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Substats",
                "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Type",
                    "typeName": "StatType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Value",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ValueStr",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  }
                ]
              },
              {
                "name": "Cards",
                "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                "repeated": true,
                "codec": "stringUtf8Packed"
              },
              {
                "name": "StartingPotential",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "SpentPotential",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "ChaosType",
                "typeName": "EquipType",
                "codec": "packedInt32"
              },
              {
                "name": "UID",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Refine",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Favorite",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Inventory",
            "typeName": "InventoryData",
            "nullable": true,
            "fields": [
              {
                "name": "Equips",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[EquipData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Artifacts",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[ArtifactData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Slot",
                    "typeName": "ArtifactSlot",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Gems",
                    "typeName": "System.Collections.Generic.List`1[[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "UID",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      },
                      {
                        "name": "Refine",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Id",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      },
                      {
                        "name": "Favorite",
                        "typeName": "System.Boolean",
                        "codec": "boolean"
                      }
                    ]
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Cards",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[CardData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Gems",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Junks",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[JunkData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Consumables",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[ConsumableData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Cosmetics",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[CosmeticData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Rarity",
                    "typeName": "ItemRarity",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Shiny",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LastLogin",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "Playtime",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "MonsterKills",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "BossKills",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Deaths",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "WaypointsUnlocked",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "NpcsSpokenTo",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "WaystoneMapId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Created",
            "typeName": "System.DateTime",
            "codec": "packedInt64"
          },
          {
            "name": "Updated",
            "typeName": "System.DateTime",
            "codec": "packedInt64"
          }
        ]
      }
    ]
  },
  {
    "wireHash": 6,
    "packetKind": "serverRpc",
    "methodName": "LoadCharacterComplete"
  },
  {
    "wireHash": 7,
    "packetKind": "serverRpc",
    "methodName": "QuitCharacter_Rpc"
  },
  {
    "wireHash": 8,
    "packetKind": "targetRpc",
    "methodName": "CharacterListCallback_T",
    "parameters": [
      {
        "name": "characters",
        "typeName": "System.Collections.Generic.List`1[[CharacterData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
        "fields": [
          {
            "name": "UID",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "AppliedWriteIds",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "AccountId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Version",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "GuildId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "GuildRankId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Name",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Appearance",
            "typeName": "CharacterAppearanceData",
            "nullable": true,
            "fields": [
              {
                "name": "BodyColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Hair",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "HairColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Brow",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Beard",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Mouth",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Eye",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "EyeColor",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Ears",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Iris",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              }
            ]
          },
          {
            "name": "EquipAppearance",
            "typeName": "EquipAppearanceData",
            "nullable": true,
            "fields": [
              {
                "name": "EquipSlotsHidden",
                "typeName": "System.Boolean[]",
                "repeated": true,
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Cosmetics",
            "typeName": "System.Collections.Generic.List`1[[CosmeticSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "CosmeticSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Rarity",
                "typeName": "ItemRarity",
                "codec": "packedInt32"
              },
              {
                "name": "Shiny",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Title",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "ChatBubble",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Badge",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Archetypes",
            "typeName": "System.Collections.Generic.List`1[[Archetype, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "codec": "packedInt32"
          },
          {
            "name": "Level",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Exp",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "JobLevel",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "JobExp",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "State",
            "typeName": "CharacterStateData",
            "nullable": true,
            "fields": [
              {
                "name": "HealthNormlised",
                "typeName": "System.Single",
                "codec": "float32"
              },
              {
                "name": "ManaNormlised",
                "typeName": "System.Single",
                "codec": "float32"
              },
              {
                "name": "MapId",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Position",
                "typeName": "VectorData",
                "nullable": true,
                "fields": [
                  {
                    "name": "x",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "y",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "z",
                    "typeName": "System.Single",
                    "codec": "float32"
                  }
                ]
              },
              {
                "name": "Summons",
                "typeName": "System.Collections.Generic.List`1[[SummonSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "SkillId",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Exclusive",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  },
                  {
                    "name": "Reanimation",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "CloneCount",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Toggles",
                "typeName": "System.Collections.Generic.List`1[[ToggleSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "SkillId",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Effects",
                "typeName": "System.Collections.Generic.List`1[[EffectSaveData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Duration",
                    "typeName": "System.Single",
                    "codec": "float32"
                  },
                  {
                    "name": "Stacks",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              }
            ]
          },
          {
            "name": "Attributes",
            "typeName": "System.Int32[]",
            "repeated": true,
            "codec": "packedInt32"
          },
          {
            "name": "Equips",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "ActiveLoadout",
            "typeName": "WeaponLoadout",
            "codec": "packedInt32"
          },
          {
            "name": "LoadoutNormal",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LoadoutSecondary",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LoadoutHeavy",
            "typeName": "System.Collections.Generic.List`1[[EquipSlotData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Slot",
                "typeName": "EquipSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Equip",
                "typeName": "EquipData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "Artifacts",
            "typeName": "System.Collections.Generic.List`1[[ArtifactData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Substats",
                "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Type",
                    "typeName": "StatType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Value",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ValueStr",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  }
                ]
              },
              {
                "name": "Slot",
                "typeName": "ArtifactSlot",
                "codec": "packedInt32"
              },
              {
                "name": "Gems",
                "typeName": "System.Collections.Generic.List`1[[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "UID",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Refine",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Favorite",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Skills",
            "typeName": "SkillSystemData",
            "nullable": true,
            "fields": [
              {
                "name": "Skills",
                "typeName": "System.Collections.Generic.List`1[[SkillData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Assigned",
                "typeName": "System.Collections.Generic.List`1[[SkillData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "SkillCopy",
                "typeName": "SkillData",
                "nullable": true,
                "fields": [
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Level",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  }
                ]
              },
              {
                "name": "Reanimations",
                "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                "repeated": true,
                "codec": "stringUtf8Packed"
              }
            ]
          },
          {
            "name": "Grimoires",
            "typeName": "System.Collections.Generic.List`1[[EquipData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
            "repeated": true,
            "nullable": true,
            "fields": [
              {
                "name": "Substats",
                "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "repeated": true,
                "nullable": true,
                "fields": [
                  {
                    "name": "Type",
                    "typeName": "StatType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Value",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ValueStr",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  }
                ]
              },
              {
                "name": "Cards",
                "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                "repeated": true,
                "codec": "stringUtf8Packed"
              },
              {
                "name": "StartingPotential",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "SpentPotential",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "ChaosType",
                "typeName": "EquipType",
                "codec": "packedInt32"
              },
              {
                "name": "UID",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Refine",
                "typeName": "System.Int32",
                "codec": "packedInt32"
              },
              {
                "name": "Id",
                "typeName": "System.String",
                "codec": "stringUtf8Packed"
              },
              {
                "name": "Favorite",
                "typeName": "System.Boolean",
                "codec": "boolean"
              }
            ]
          },
          {
            "name": "Inventory",
            "typeName": "InventoryData",
            "nullable": true,
            "fields": [
              {
                "name": "Equips",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[EquipData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Cards",
                    "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
                    "repeated": true,
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "StartingPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "SpentPotential",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "ChaosType",
                    "typeName": "EquipType",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Artifacts",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[ArtifactData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Substats",
                    "typeName": "System.Collections.Generic.List`1[[StatData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "Type",
                        "typeName": "StatType",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Value",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "ValueStr",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      }
                    ]
                  },
                  {
                    "name": "Slot",
                    "typeName": "ArtifactSlot",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Gems",
                    "typeName": "System.Collections.Generic.List`1[[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                    "repeated": true,
                    "nullable": true,
                    "fields": [
                      {
                        "name": "UID",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      },
                      {
                        "name": "Refine",
                        "typeName": "System.Int32",
                        "codec": "packedInt32"
                      },
                      {
                        "name": "Id",
                        "typeName": "System.String",
                        "codec": "stringUtf8Packed"
                      },
                      {
                        "name": "Favorite",
                        "typeName": "System.Boolean",
                        "codec": "boolean"
                      }
                    ]
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Cards",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[CardData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Gems",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[GemData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Junks",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[JunkData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Consumables",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[ConsumableData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Count",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              },
              {
                "name": "Cosmetics",
                "typeName": "System.Collections.Generic.Dictionary`2[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089],[CosmeticData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]]",
                "dictionaryKey": "stringUtf8Packed",
                "nullable": true,
                "fields": [
                  {
                    "name": "Rarity",
                    "typeName": "ItemRarity",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Shiny",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  },
                  {
                    "name": "UID",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Refine",
                    "typeName": "System.Int32",
                    "codec": "packedInt32"
                  },
                  {
                    "name": "Id",
                    "typeName": "System.String",
                    "codec": "stringUtf8Packed"
                  },
                  {
                    "name": "Favorite",
                    "typeName": "System.Boolean",
                    "codec": "boolean"
                  }
                ]
              }
            ]
          },
          {
            "name": "LastLogin",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "Playtime",
            "typeName": "System.Int64",
            "codec": "packedInt32"
          },
          {
            "name": "MonsterKills",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "BossKills",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "Deaths",
            "typeName": "System.Int32",
            "codec": "packedInt32"
          },
          {
            "name": "WaypointsUnlocked",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "NpcsSpokenTo",
            "typeName": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]",
            "repeated": true,
            "codec": "stringUtf8Packed"
          },
          {
            "name": "WaystoneMapId",
            "typeName": "System.String",
            "codec": "stringUtf8Packed"
          },
          {
            "name": "Created",
            "typeName": "System.DateTime",
            "codec": "packedInt64"
          },
          {
            "name": "Updated",
            "typeName": "System.DateTime",
            "codec": "packedInt64"
          }
        ],
        "repeated": true
      }
    ]
  },
  {
    "wireHash": 113,
    "packetKind": "targetRpc",
    "methodName": "RestartInstancedMapResolution_T",
    "parameters": [
      {
        "name": "reconnect",
        "typeName": "_App.Scripts.InstancedMaps.ClientInstancedMapReconnectContext"
      }
    ]
  },
  {
    "wireHash": 114,
    "packetKind": "targetRpc",
    "methodName": "RedirectToInstancedMap_T",
    "parameters": [
      {
        "name": "reconnect",
        "typeName": "_App.Scripts.InstancedMaps.ClientInstancedMapReconnectContext"
      }
    ]
  },
  {
    "wireHash": 115,
    "packetKind": "targetRpc",
    "methodName": "SupersedeInstancedMapArrivalTicket_T",
    "parameters": [
      {
        "name": "expectedFlowId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedTicketId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedInstancedMapId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 116,
    "packetKind": "targetRpc",
    "methodName": "ClearInstancedMapReconnect_T",
    "parameters": [
      {
        "name": "expectedFlowId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedTicketId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedInstancedMapId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedAdmissionId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  },
  {
    "wireHash": 117,
    "packetKind": "targetRpc",
    "methodName": "InstancedMapAdmissionComplete_T",
    "parameters": [
      {
        "name": "admissionId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedFlowId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedTicketId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      },
      {
        "name": "expectedInstancedMapId",
        "typeName": "System.String",
        "codec": "stringUtf8Packed"
      }
    ]
  }
] as const satisfies readonly FishNetRpcDefinition[];
