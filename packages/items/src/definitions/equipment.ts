import type { FishNetEquipmentItemDefinition } from "../catalog.ts";

export class EquipmentItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 2,
      "id": "3D Glasses",
      "displayName": "3DGlasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Abyss Shard",
      "displayName": "Abyss Shard",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ShadowStep"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "ShadowStep"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowStep"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Acolyte_1",
      "displayName": "Scripture of Mercy"
    },
    {
      "itemType": 2,
      "id": "Acolyte_2",
      "displayName": "Radiant Strikes"
    },
    {
      "itemType": 2,
      "id": "Acolyte_3",
      "displayName": "Radiant Judgment"
    },
    {
      "itemType": 2,
      "id": "Acolyte_4",
      "displayName": "Gospel of Grace"
    },
    {
      "itemType": 2,
      "id": "Acolyte_5",
      "displayName": "Lightweaver"
    },
    {
      "itemType": 2,
      "id": "Acolyte_6",
      "displayName": "Sacred Rhythm"
    },
    {
      "itemType": 2,
      "id": "Adventurer's Kit",
      "displayName": "Adventurer's Kit",
      "effects": [
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Adventurer's Pack",
      "displayName": "Adventurer's Pack",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Amber Bow",
      "displayName": "Amber Bow",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Amber Loop",
      "displayName": "Amber Loop",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Heal"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Arcane Sigil",
      "displayName": "Arcane Sigil",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ArcaneChest",
      "displayName": "Arcane Chest",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 76,
          "value": 100
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ArcaneFeet",
      "displayName": "Arcane Boots",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 34,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "FreeCast"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ArcaneGloves",
      "displayName": "Arcane Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Heal"
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Haste"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ArcaneLegs",
      "displayName": "Arcane Legs",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 70,
          "value": 3
        },
        {
          "type": 69,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Archer's Beads",
      "displayName": "Archer's Beads",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 102,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Agi",
      "displayName": "Speed Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 2,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Dex",
      "displayName": "Precision Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 3,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Int",
      "displayName": "Mind Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Luk",
      "displayName": "Fate Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 5,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Str",
      "displayName": "Power Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Armor_Vit",
      "displayName": "Endurance Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Arrow Quiver",
      "displayName": "Arrow Quiver",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Arrowcatch Wall",
      "displayName": "Arrowcatch Wall",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 57,
          "value": -10
        },
        {
          "type": 103,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Artemis",
      "displayName": "Artemis",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 25,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 193,
          "value": 10
        },
        {
          "type": 195,
          "value": 10
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Axe",
      "displayName": "Axe",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 0,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Axe of Oblivion",
      "displayName": "Axe of Oblivion",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 47,
          "value": 1
        },
        {
          "type": 52,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Azure Antlers",
      "displayName": "Azure Antlers",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 76,
          "value": 25
        },
        {
          "type": 8,
          "value": 20
        },
        {
          "type": 61,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Azure Crown",
      "displayName": "Azure Crown",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        },
        {
          "type": 74,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Azure Cutlass",
      "displayName": "Azure Cutlass",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Water"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Water"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Azure Prism",
      "displayName": "Azure Prism",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 48,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Azure Tag",
      "displayName": "Azure Tag",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 8,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Backpack",
      "displayName": "Backpack",
      "effects": [
        {
          "type": 71,
          "value": -10
        },
        {
          "type": 101,
          "value": 1000
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bandit Wrap",
      "displayName": "Bandit Wrap",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Banner Helm",
      "displayName": "Banner Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Batling Familiar",
      "displayName": "Batling Familiar",
      "effects": [
        {
          "type": 177,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Battle Bonnet",
      "displayName": "Battle Bonnet",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 63,
          "value": 2
        },
        {
          "type": 2,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bear Backpack",
      "displayName": "Bear Backpack",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Earth"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Earth"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bear Hug Hood",
      "displayName": "Bear Hug Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 14,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Beast Helm",
      "displayName": "Beast Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Earth"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Earth"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Beast Hood",
      "displayName": "Beast Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Beast Pelt Hood",
      "displayName": "Beast Pelt Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "BerserkChest",
      "displayName": "Direwolf Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 71,
          "value": 15
        },
        {
          "type": 72,
          "value": 5
        },
        {
          "type": 9,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Berserker_1",
      "displayName": "War Cry"
    },
    {
      "itemType": 2,
      "id": "Berserker_2",
      "displayName": "Crimson Frenzy"
    },
    {
      "itemType": 2,
      "id": "Berserker_3",
      "displayName": "Slaughter Instinct"
    },
    {
      "itemType": 2,
      "id": "Berserker_4",
      "displayName": "Executioner"
    },
    {
      "itemType": 2,
      "id": "BerserkFeet",
      "displayName": "Direwolf Shoes",
      "effects": [
        {
          "type": 11,
          "value": 8
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 9,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "BerserkLegs",
      "displayName": "Direwolf Legs",
      "effects": [
        {
          "type": 11,
          "value": 8
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 75,
          "value": 15
        },
        {
          "type": 76,
          "value": 5
        },
        {
          "type": 9,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Binding Spirits Staff",
      "displayName": "Binding Spirits Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DeathNovaField"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "DeathNova"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DeathCoilEnemy"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DeathCoilSummon"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathNovaField"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathCoilEnemy"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathCoilSummon"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bishop's Hood",
      "displayName": "Bishop's Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "HolyLight"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "HolyLight"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blacksteel Blade",
      "displayName": "Blacksteel Blade",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Berserk"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 15,
          "value": 2
        },
        {
          "type": 72,
          "value": -5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Blade of Eclipse",
      "displayName": "Blade of Eclipse",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 60,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Blade Standard",
      "displayName": "Blade Standard",
      "effects": [
        {
          "type": 69,
          "value": 5
        },
        {
          "type": 0,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blindfold",
      "displayName": "Blindfold",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 72,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blood Clip",
      "displayName": "Blood Clip",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 22,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blood Pendant",
      "displayName": "Blood Pendant",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bloodbound",
      "displayName": "Bloodbound",
      "effects": [
        {
          "type": 11,
          "value": 8
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 75,
          "value": 15
        },
        {
          "type": 76,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 98,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bloom of Midnight",
      "displayName": "Bloom of Midnight",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Holy"
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bloom Pendant",
      "displayName": "Bloom Pendant",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "Cure"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bloom Ring",
      "displayName": "Bloom Ring",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "Revive"
        },
        {
          "type": 90,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blue Shell",
      "displayName": "Blue Shell",
      "effects": [
        {
          "type": 64,
          "value": 10
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blunderbuss",
      "displayName": "Blunderbuss",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 24,
          "value": 2
        },
        {
          "type": 164,
          "value": 50
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "PointBlankShot"
        },
        {
          "type": 162,
          "value": 1,
          "skillId": "PointBlankShot"
        },
        {
          "type": 78,
          "value": -20
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Bomb Bud",
      "displayName": "Bomb Bud",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bone Channeler",
      "displayName": "Bone Channeler",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 34,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Holy"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bone Helm",
      "displayName": "Bone Helm",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 53,
          "value": 10,
          "skillId": "Neutral"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bone Pick",
      "displayName": "Bone Pick",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 15,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bonefang",
      "displayName": "Bonefang",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 107,
          "value": 1,
          "skillId": "VenomStrike"
        },
        {
          "type": 124,
          "value": 1,
          "skillId": "VenomStrike"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "BonkStick",
      "displayName": "Bonk Stick",
      "effects": [
        {
          "type": 9,
          "value": 100
        },
        {
          "type": 10,
          "value": 100
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "Bonk"
        },
        {
          "type": 195,
          "value": 100
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 10
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bot Hunter Utility",
      "displayName": "Bot Hunter Utility",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "skillId": "BotHunter"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Breakerhead",
      "displayName": "Breakerhead",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "BreezeguardChest",
      "displayName": "Breezeguard Chest",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 14,
          "value": 20
        },
        {
          "type": 77,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "BreezeguardFeet",
      "displayName": "Breezeguard Shoes",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 77,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "BreezeguardLegs",
      "displayName": "Breezeguard Legs",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 77,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Brimblade",
      "displayName": "Brimblade",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 176,
          "value": 3
        },
        {
          "type": 86,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Broad Sword",
      "displayName": "Broad Sword",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 7,
          "value": 100
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 63,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bronze Crescent",
      "displayName": "Bronze Crescent",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 7,
          "value": 500
        },
        {
          "type": 75,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bronze Plugs",
      "displayName": "Bronze Plugs",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 6,
          "value": 1
        },
        {
          "type": 71,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bronze Visage",
      "displayName": "Bronze Visage",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bubblebeast Hood",
      "displayName": "Bubblebeast Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 10,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Buckler",
      "displayName": "Buckler",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 14,
          "value": 15
        },
        {
          "type": 185,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bullcrest Helm",
      "displayName": "Bullcrest Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bunny Backpack",
      "displayName": "Bunny Backpack",
      "effects": [
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Bunny Cap",
      "displayName": "Bunny Cap",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Caged Spirit",
      "displayName": "Caged Spirit",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Cardboard Chick",
      "displayName": "Cardboard Chick",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Centurion Helm",
      "displayName": "Centurion Helm",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 71,
          "value": 30
        },
        {
          "type": 72,
          "value": -30
        },
        {
          "type": 9,
          "value": -20
        },
        {
          "type": 10,
          "value": -20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ceremonial Mask",
      "displayName": "Ceremonial Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Cerulean Scepter",
      "displayName": "Cerulean Scepter",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 49,
          "value": -50,
          "skillId": "Heal"
        },
        {
          "type": 106,
          "value": 5,
          "skillId": "Heal"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Heal"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chainfrost Staff",
      "displayName": "Chainfrost Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "IceShard"
        },
        {
          "type": 124,
          "value": 1,
          "skillId": "IceShard"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "IceShard"
        },
        {
          "type": 124,
          "value": 0.5,
          "skillId": "IceShard"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chains of Binding",
      "displayName": "Chains of Binding",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 142,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Champion Blade",
      "displayName": "Divine Blade",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Shadow"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Shadow"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chaos Reaver",
      "displayName": "Chaos Reaver",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DarkClaw"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Cyclone"
        },
        {
          "type": 105,
          "value": -1,
          "skillId": "Cyclone"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "Cyclone"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Cyclone"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chicky Hood",
      "displayName": "Chicky Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 9,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Chirpy Hat",
      "displayName": "Chirpy Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Chompy Hood",
      "displayName": "Chompy Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 176,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Chronomancer's Codex",
      "displayName": "Chronomancer's Codex",
      "effects": [
        {
          "type": 66,
          "value": -20
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ClericChest",
      "displayName": "Cleric Chest",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 67,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ClericFeet",
      "displayName": "Cleric Shoes",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 4,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ClericLegs",
      "displayName": "Cleric Legs",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Cloud Loop",
      "displayName": "Cloud Loop",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 64,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Codex",
      "displayName": "Tome",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Binding Light",
      "displayName": "Grimoire of Binding Light",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "HolyLight"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "HolyLight"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex First Hymn",
      "displayName": "Tome of the First Hymn",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 67,
          "value": 10
        },
        {
          "type": 64,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 67,
          "value": 1
        },
        {
          "type": 64,
          "value": 1
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex of Revelation",
      "displayName": "Codex of Revelation",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 40
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 4
        },
        {
          "type": 67,
          "value": 2
        },
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Holy"
        },
        {
          "type": 64,
          "value": 3
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Umbra",
      "displayName": "Codex Umbra",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "ShadowStrike"
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Conviction"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 67,
          "value": 2
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Shadow"
        },
        {
          "type": 39,
          "value": 1,
          "skillId": "NPC_WideCurse"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Vitae",
      "displayName": "Codex Vitae",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Heal"
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Vitality"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 67,
          "value": 2
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Holy"
        },
        {
          "type": 39,
          "value": 1,
          "skillId": "Heal"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Combat Knife",
      "displayName": "Combat Knife",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 176,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 72,
          "value": -5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Cotton Mask",
      "displayName": "Cotton Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Crimson Crest",
      "displayName": "Crimson Crest",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 15,
          "value": 2
        },
        {
          "type": 52,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Crimson Plume",
      "displayName": "Crimson Plume",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Crown of Spikes",
      "displayName": "Crown of Spikes",
      "effects": [
        {
          "type": 86,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Crusader Staff",
      "displayName": "Radiant Scepter",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "DivinePunishment"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "DivinePunishment"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "DivinePunishment"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DivinePunishment"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Crusader Sword",
      "displayName": "Oathbreaker",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "JudgementBlade"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "GrandCross"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "GrandCross"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "JudgementBlade"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "GrandCross"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Crystal Cache",
      "displayName": "Crystal Cache",
      "effects": [
        {
          "type": 48,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Crystal Slammer",
      "displayName": "Crystal Slammer",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "FieldDamage"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "FieldDamage"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Crystal Wings",
      "displayName": "Crystal Wings",
      "effects": [
        {
          "type": 70,
          "value": 5
        },
        {
          "type": 4,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Curse Tag",
      "displayName": "Curse Tag",
      "effects": [
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Curse"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Cursed Grimoire",
      "displayName": "Cursed Grimoire",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Daggers",
      "displayName": "Daggers",
      "effects": [
        {
          "type": 52,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Darkfeather Wings",
      "displayName": "Darkfeather Wings",
      "effects": [
        {
          "type": 63,
          "value": 5
        },
        {
          "type": 2,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Darkhide Gloves",
      "displayName": "Darkhide Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "BloodCrash"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dawn Prayer",
      "displayName": "Dawn Prayer",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 68,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dawnstar",
      "displayName": "Dawnstar",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "HolyLight"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Daybreak",
      "displayName": "Daybreak",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Death's Grin",
      "displayName": "Death's Grin",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Demon Cat",
      "displayName": "Cheshire Cat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "ShadowStrike"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "ShadowStrike"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Demon Hood",
      "displayName": "Demon Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Destruction Staff",
      "displayName": "Destruction Staff",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 40
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 4
        },
        {
          "type": 194,
          "value": 5
        },
        {
          "type": 71,
          "value": -5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Digger's Flask",
      "displayName": "Digger's Flask",
      "effects": [
        {
          "type": 78,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dino Cub Backpack",
      "displayName": "Dino Cub Backpack",
      "effects": [
        {
          "type": 176,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "DiscipleArmlets",
      "displayName": "Disciple's Bracers"
    },
    {
      "itemType": 2,
      "id": "DiscipleChest",
      "displayName": "Disciple's Manteau"
    },
    {
      "itemType": 2,
      "id": "DiscipleFeet",
      "displayName": "Disciple's Shoes"
    },
    {
      "itemType": 2,
      "id": "DiscipleHelm",
      "displayName": "Disciple's Visage"
    },
    {
      "itemType": 2,
      "id": "DiscipleLegs",
      "displayName": "Disciple's Wraps"
    },
    {
      "itemType": 2,
      "id": "Discipline Band",
      "displayName": "Discipline Band",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 17,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 17,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Doom Crescent",
      "displayName": "Doom Crescent",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Doom Crown",
      "displayName": "Doom Crown",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Doom Keg",
      "displayName": "Doom Keg",
      "effects": [
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Double Ravenbeak",
      "displayName": "Double Ravenbeak",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dragon Hood",
      "displayName": "Dragon Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dragonic Spear",
      "displayName": "Dragonic Spear",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 193,
          "value": 5
        },
        {
          "type": 72,
          "value": -5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dragonspire Helm",
      "displayName": "Dragonspire Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Angel",
      "displayName": "Drooping Angel",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "HolyLight"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "HolyLight"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Bat",
      "displayName": "Drooping Bat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 177,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Burrow",
      "displayName": "Drooping Burrow",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Earthbolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Earthbolt"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Cat",
      "displayName": "Drooping Cat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Thunderbolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Thunderbolt"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Dragon",
      "displayName": "Drooping Dragon",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Firebolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Firebolt"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Flora",
      "displayName": "Drooping Flora",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Icebolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Icebolt"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Pup",
      "displayName": "Drooping Pup",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Firebolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "Firebolt"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Skeleton",
      "displayName": "Drooping Skeleton",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "DeathCoilEnemy"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "DeathCoilEnemy"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Wraith",
      "displayName": "Drooping Wraith",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "SoulStrike"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "SoulStrike"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dualblade Sheath",
      "displayName": "Dualblade Sheath",
      "effects": [
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Duskfang",
      "displayName": "Duskfang",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Holy"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Holy"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dustweaver Hat",
      "displayName": "Dustweaver Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Fire"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Water"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Wind"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Earth"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Earth Shaker",
      "displayName": "Earth Shaker",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "WildCharge"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "WildCharge"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "WildCharge"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "GroundSlam"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "GroundSlam"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "GroundSlam"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "WildCharge"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "GroundSlam"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Earth Shield",
      "displayName": "Obsidian Bulwark",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Earth"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Eclipse Kunai",
      "displayName": "Eclipse Kunai",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ShadowRelease"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "TwistOfFate"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "TwistOfFate"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowRelease"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "TwistOfFate"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Edge of Twilight",
      "displayName": "Edge of Twilight",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 79,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 15,
          "value": 2
        },
        {
          "type": 14,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Elixir Gourd",
      "displayName": "Elixir Gourd",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 68,
          "value": 100
        },
        {
          "type": 67,
          "value": -50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Emberhide Helm",
      "displayName": "Emberhide Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Fire"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Fire"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Embershard",
      "displayName": "Embershard",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Fire"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Emerald Crown",
      "displayName": "Emerald Crown",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Energy Sword Blue",
      "displayName": "Prism Blade",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "Firebolt"
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "Icebolt"
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "Thunderbolt"
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "Earthbolt"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Energy Sword Purple",
      "displayName": "Umbral Blade",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantPoison"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantHoly"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantShadow"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantUndead"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Energy Sword Yellow",
      "displayName": "Chromatic Blade",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantFire"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantWater"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantWind"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "EnchantEarth"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Everfrost Staff",
      "displayName": "Everfrost Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FreezingField"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "FreezingField"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "FreezingField"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "HydroVortex"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FreezingField"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "HydroVortex"
        },
        {
          "type": 39,
          "value": 1,
          "skillId": "NPC_Freeze"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Executioner Axe",
      "displayName": "Executioner Axe",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Execute"
        },
        {
          "type": 162,
          "value": 1,
          "skillId": "Execute"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 49,
          "value": 1,
          "skillId": "Execute"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Exorcist Bible",
      "displayName": "Exorcist Bible",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "Faith"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "TurnUndead"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "Damnation"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "TurnUndead"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Exorcist Staff",
      "displayName": "Exorcist Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 105,
          "value": -10,
          "skillId": "Exorcism"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "TurnUndead"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 49,
          "value": 120,
          "skillId": "Exorcism"
        },
        {
          "type": 39,
          "value": 1,
          "skillId": "TurnUndead"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Explorer's Pack",
      "displayName": "Explorer's Pack",
      "effects": [
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 101,
          "value": 1000
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Eye of Vigil",
      "displayName": "Eye of Vigil",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "SoulStrike"
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "TrueSight"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Eyepatch",
      "displayName": "Eyepatch",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Falcon Band",
      "displayName": "Falcon Band",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 78,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Falcon Hood",
      "displayName": "Falcon Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Fang Clip",
      "displayName": "Fang Clip",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 23,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Fang of the Moon",
      "displayName": "Fang of the Moon",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 177,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Feathered Crown",
      "displayName": "Feathered Crown",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feathered Scout Hat",
      "displayName": "Feathered Scout Hat",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 102,
          "value": 10
        },
        {
          "type": 25,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Agi",
      "displayName": "Speed Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 2,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Dex",
      "displayName": "Precision Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 3,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Int",
      "displayName": "Mind Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 4,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Luk",
      "displayName": "Fate Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 5,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Str",
      "displayName": "Power Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 0,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Feet_Vit",
      "displayName": "Endurance Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 1,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ferncloak",
      "displayName": "Ferncloak",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 3,
          "value": 5
        },
        {
          "type": 102,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Festival Cap",
      "displayName": "Festival Cap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Festival Rockets",
      "displayName": "Festival Rockets",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Fire"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Fire"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Festival Turtle Cap",
      "displayName": "Festival Turtle Cap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Festive Gift Box",
      "displayName": "Festive Gift Box",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Barrier"
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Barrier"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Fire Shield",
      "displayName": "Molten Core Heater",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Fire"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Flame Spirit",
      "displayName": "Flame Spirit",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Flame Tongue Kunai",
      "displayName": "Flame Tongue Kunai",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 40,
          "value": 1,
          "skillId": "FireRelease"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Flameburst Kunai",
      "displayName": "Flameburst Kunai",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FireRelease"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FlameOrb"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "FlameOrb"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FireRelease"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FlameOrb"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fleetrunner",
      "displayName": "Fleetrunner",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Flintlock Pistol",
      "displayName": "Flintlock Pistol",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FanFire"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FanFire"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Focus Band",
      "displayName": "Focus Band",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 13,
          "value": 20
        },
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "TrueSight"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Forest Friend Hat",
      "displayName": "Forest Friend Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Fire"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Water"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Wind"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Earth"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ForestChest",
      "displayName": "Forest Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 67,
          "value": 10
        },
        {
          "type": 68,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ForestFeet",
      "displayName": "Forest Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 64,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ForestLegs",
      "displayName": "Forest Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 75,
          "value": 25
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Fortified Guardwall",
      "displayName": "Fortified Guardwall",
      "effects": [
        {
          "type": 11,
          "value": 30
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ShieldBash"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "ShieldBash"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "ShieldBash"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Frost Mark",
      "displayName": "Frost Mark",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 25,
          "value": 12
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 165,
          "value": 25
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "FreezingEdge"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Frostfang",
      "displayName": "Frostfang",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "IceShard"
        },
        {
          "type": 124,
          "value": 3,
          "skillId": "IceShard"
        },
        {
          "type": 110,
          "value": 1,
          "skillId": "IceShard"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 40,
          "value": 1,
          "skillId": "IceShard"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Frostscale Helm",
      "displayName": "Frostscale Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Water"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Water"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Frostshard",
      "displayName": "Frostshard",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Water"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Frostspire Kunai",
      "displayName": "Frostspire Kunai",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "IceRelease"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FrostBlade"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "FrostBlade"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "IceRelease"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FrostBlade"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fruit Bowl",
      "displayName": "Fruit Bowl",
      "effects": [
        {
          "type": 67,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Funny Glasses",
      "displayName": "Funny Glasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Fur Hood",
      "displayName": "Fur Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Game Master Utility",
      "displayName": "Game Master Utility",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "skillId": "GameMaster"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Gatling Gun",
      "displayName": "Gatling Gun",
      "effects": [
        {
          "type": 9,
          "value": 100
        },
        {
          "type": 25,
          "value": 9
        },
        {
          "type": 80,
          "value": 150
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 10
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Gentleman's Hat",
      "displayName": "Gentleman's Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ghostly Hat",
      "displayName": "Ghostly Hat",
      "effects": [
        {
          "type": 141,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 2,
          "value": 1
        },
        {
          "type": 14,
          "value": 1
        },
        {
          "type": 121,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glimmerthorn",
      "displayName": "Glimmerthorn",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 76,
          "value": 5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Glove_Agi",
      "displayName": "Speed Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 2,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glove_Dex",
      "displayName": "Precision Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 102,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 3,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glove_Int",
      "displayName": "Mind Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 48,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glove_Luk",
      "displayName": "Fate Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 52,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 5,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glove_Str",
      "displayName": "Power Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 47,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Glove_Vit",
      "displayName": "Endurance Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 73,
          "value": 5
        },
        {
          "type": 74,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Golden Aegis",
      "displayName": "Golden Aegis",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 94,
          "value": 3
        },
        {
          "type": 86,
          "value": 3
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Golden Axe",
      "displayName": "Golden Axe",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 40,
          "value": 2,
          "skillId": "Bash"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Golden Crest",
      "displayName": "Golden Crest",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Golden Crown",
      "displayName": "Golden Crown",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 69,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Golden Hammer",
      "displayName": "Golden Hammer",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "SoulStrike"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Golden Hoop",
      "displayName": "Golden Hoop",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Grasping Eye Urn",
      "displayName": "Grasping Eye Urn",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "skillId": "TrueSight"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Grave Helm",
      "displayName": "Grave Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 176,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "GravemarrowChest",
      "displayName": "Gravemarrow Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 20
        },
        {
          "type": 142,
          "value": 15
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Bleeding"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "GravemarrowFeet",
      "displayName": "Gravemarrow Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 142,
          "value": 10
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Poison"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "GravemarrowLegs",
      "displayName": "Gravemarrow Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 20
        },
        {
          "type": 142,
          "value": 10
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Curse"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Gravestone Breaker",
      "displayName": "Gravestone Breaker",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Undead"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Undead"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Undead"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Undead"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Green Shell",
      "displayName": "Green Shell",
      "effects": [
        {
          "type": 73,
          "value": 5
        },
        {
          "type": 74,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Grim Reaper Scythe",
      "displayName": "Life Drinker",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 98,
          "value": 5
        },
        {
          "type": 177,
          "value": 3
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "LifeDrainEnemy"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "LifeDrain"
        },
        {
          "type": 43,
          "value": 5,
          "skillId": "SoulDrain"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "LifeDrainEnemy"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Guardblade",
      "displayName": "Guardblade",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 85,
          "value": 1
        },
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Happy Chipper Hat",
      "displayName": "Happy Chipper Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 7,
          "value": 100
        },
        {
          "type": 8,
          "value": 20
        },
        {
          "type": 59,
          "value": 5
        },
        {
          "type": 61,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Harlequin's Hood",
      "displayName": "Harlequin's Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 64,
          "value": 1
        },
        {
          "type": 65,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Harvester of Souls",
      "displayName": "Harvester of Souls",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Undead"
        },
        {
          "type": 15,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Hawkeye Crossbow",
      "displayName": "Hawkeye Crossbow",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 49,
          "value": 150,
          "skillId": "ForceShot"
        },
        {
          "type": 106,
          "value": -3,
          "skillId": "ForceShot"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 3,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Heart Vessel",
      "displayName": "Heart Vessel",
      "effects": [
        {
          "type": 7,
          "value": 500
        },
        {
          "type": 75,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Heartgaze Shades",
      "displayName": "Heartgaze Shades",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Heartloop Earring",
      "displayName": "Heartloop Earring",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 7,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Heaven's Orbit",
      "displayName": "Heaven's Orbit",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ShieldThrow"
        },
        {
          "type": 108,
          "value": -20,
          "skillId": "ShieldThrow"
        },
        {
          "type": 124,
          "value": 3,
          "skillId": "ShieldThrow"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShieldThrow"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hellfire Staff",
      "displayName": "Hellfire Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Fireball"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Firewall"
        },
        {
          "type": 123,
          "value": 1,
          "skillId": "Fireball"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "Fireball"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "Firewall"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Fireball"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Firewall"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Hellhorn Hood",
      "displayName": "Hellhorn Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 98,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hermit Hood",
      "displayName": "Hermit Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hexweaver Hat",
      "displayName": "Hexweaver Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Shadow"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Shadow"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Holy Shield",
      "displayName": "Holy Crest",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Holy"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Holy Staff",
      "displayName": "Holy Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Exorcism"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "Exorcism"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Hornbrand",
      "displayName": "Hornbrand",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Undead"
        },
        {
          "type": 39,
          "value": 1,
          "skillId": "NPC_WideCurse"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Horned Crusader Helm",
      "displayName": "Horned Crusader Helm",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 141,
          "value": 5
        },
        {
          "type": 71,
          "value": -25
        },
        {
          "type": 72,
          "value": -25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 141,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Horned Vanguard",
      "displayName": "Horned Vanguard",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hunter's Hood",
      "displayName": "Hunter's Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hunter's Roll",
      "displayName": "Hunter's Roll",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hunting Knife",
      "displayName": "Hunting Knife",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 13,
          "value": 5
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 9,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Hunting Pike",
      "displayName": "Hunting Pike",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 107,
          "value": 1,
          "skillId": "SpearSlice"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Insect Carapace",
      "displayName": "Insect Carapace",
      "effects": [
        {
          "type": 73,
          "value": 5
        },
        {
          "type": 86,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Ankh",
      "displayName": "Iron Ankh",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 8,
          "value": 100
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Bulwark",
      "displayName": "Iron Bulwark",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 16,
          "value": 10
        },
        {
          "type": 7,
          "value": 100
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Fortitude",
      "displayName": "Iron Fortitude",
      "effects": [
        {
          "type": 11,
          "value": 30
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 120,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Guard Helm",
      "displayName": "Iron Guard Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Halo",
      "displayName": "Iron Halo",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Holy"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Holy"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Iron Morningstar",
      "displayName": "Iron Morningstar",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Reaver",
      "displayName": "Iron Reaver",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "AxeArc"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "AxeArc"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Spear",
      "displayName": "Iron Spear",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 13,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Spire",
      "displayName": "Iron Spire",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ironhorn Cap",
      "displayName": "Ironhorn Cap",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 47,
          "value": 10
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Bleeding"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ironshade Helm",
      "displayName": "Ironshade Helm",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 16,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 16,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "IslandChest",
      "displayName": "Island Spirit Chest",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "IslandFeet",
      "displayName": "Island Spirit Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 65,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "IslandLegs",
      "displayName": "Island Spirit Legs",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 63,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Jagtooth",
      "displayName": "Jagtooth",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 98,
          "value": 5
        },
        {
          "type": 177,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Jester Hat",
      "displayName": "Jester Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Jewelcrest Mace",
      "displayName": "Jewelcrest Mace",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Knife",
      "displayName": "Knife",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 14,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Knight_1",
      "displayName": "Breaking Advance"
    },
    {
      "itemType": 2,
      "id": "Knight_2",
      "displayName": "Sweeping Order"
    },
    {
      "itemType": 2,
      "id": "Knight_3",
      "displayName": "Lightning Stance"
    },
    {
      "itemType": 2,
      "id": "Knight_4",
      "displayName": "Rescuing Throw"
    },
    {
      "itemType": 2,
      "id": "Knight_5",
      "displayName": "Iron Response"
    },
    {
      "itemType": 2,
      "id": "Knight_6",
      "displayName": "Vanguard Doctrine"
    },
    {
      "itemType": 2,
      "id": "Knight's Glory",
      "displayName": "Royal Blade",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "KnightChest",
      "displayName": "Skystrider Chest",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 71,
          "value": 20
        },
        {
          "type": 53,
          "value": 10,
          "skillId": "Neutral"
        },
        {
          "type": 11,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "KnightFeet",
      "displayName": "Skystrider Shoes",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Neutral"
        },
        {
          "type": 11,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "KnightLegs",
      "displayName": "Skystrider Legs",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 75,
          "value": 20
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Neutral"
        },
        {
          "type": 11,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Knuckleband",
      "displayName": "Knuckleband",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 47,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Kunai",
      "displayName": "Kunai",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Launcher",
      "displayName": "Launcher",
      "effects": [
        {
          "type": 9,
          "value": 100
        },
        {
          "type": 25,
          "value": 9
        },
        {
          "type": 142,
          "value": 100
        },
        {
          "type": 24,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 10
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Leaf Mask",
      "displayName": "Leaf Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Heal"
        },
        {
          "type": 108,
          "value": 20,
          "skillId": "Heal"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Agi",
      "displayName": "Speed Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 2,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Dex",
      "displayName": "Precision Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 3,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Int",
      "displayName": "Mind Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 4,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Luk",
      "displayName": "Fate Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 5,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Str",
      "displayName": "Power Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 0,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Leg_Vit",
      "displayName": "Endurance Greaves",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 1,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Legionnaire Helm",
      "displayName": "Legionnaire Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Life Staff",
      "displayName": "Life Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Sanctuary"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "HighHeal"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "HighHeal"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 67,
          "value": 1
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Lifebloom Shoes",
      "displayName": "Lifebloom Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 68,
          "value": 25
        },
        {
          "type": 59,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Longbow",
      "displayName": "Longbow",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 25,
          "value": 0.5
        },
        {
          "type": 13,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Lucky Drops",
      "displayName": "Lucky Drops",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 78,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Lute",
      "displayName": "Lute",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Luxbane",
      "displayName": "Luxbane",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 63,
          "value": -50
        },
        {
          "type": 49,
          "value": 50,
          "skillId": "Smite"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "Smite"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "Smite"
        },
        {
          "type": 145,
          "value": 1,
          "skillId": "Smite"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Luxspire",
      "displayName": "Luxspire",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 40
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "HolyWrath"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "HolyWrath"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "HolyWrathField"
        },
        {
          "type": 145,
          "value": 2,
          "skillId": "HolyWrath"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 4
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mace",
      "displayName": "Mace",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Mage Guard",
      "displayName": "Mage Guard",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 64,
          "value": 2
        },
        {
          "type": 74,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mage Plate",
      "displayName": "Mage Plate",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 34,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 64,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mage_1",
      "displayName": "Elementalist"
    },
    {
      "itemType": 2,
      "id": "Mage_2",
      "displayName": "Spellshot"
    },
    {
      "itemType": 2,
      "id": "Mage_3",
      "displayName": "Blink Step"
    },
    {
      "itemType": 2,
      "id": "Mage_4",
      "displayName": "Ley Pulse"
    },
    {
      "itemType": 2,
      "id": "Mage_5",
      "displayName": "Frostglass"
    },
    {
      "itemType": 2,
      "id": "Mage_6",
      "displayName": "Combustion"
    },
    {
      "itemType": 2,
      "id": "MageChest",
      "displayName": "Spellthread Chest",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "MageFeet",
      "displayName": "Spellthread Shoes",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 10,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "MageLegs",
      "displayName": "Spellthread Legs",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 10,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mana Cask",
      "displayName": "Mana Cask",
      "effects": [
        {
          "type": 8,
          "value": 250
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mana Potion",
      "displayName": "Mana Potion",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 72,
          "value": 25
        },
        {
          "type": 76,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Master Axe",
      "displayName": "Master Axe",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 0,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Codex",
      "displayName": "Master Codex",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 67,
          "value": 10
        },
        {
          "type": 4,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Master Dagger",
      "displayName": "Master Dagger",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 2,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Hammer",
      "displayName": "Master Hammer",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 0,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Master Katar",
      "displayName": "Master Katar",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 79,
          "value": 25
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 15,
          "value": 10
        },
        {
          "type": 5,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Revolver",
      "displayName": "Master Pistol",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 3,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Master Scythe",
      "displayName": "Master Scythe",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 98,
          "value": 5
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 15,
          "value": 10
        },
        {
          "type": 0,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Slingshot",
      "displayName": "Master Bow",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 3,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Master Spear",
      "displayName": "Master Spear",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 1,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Sword",
      "displayName": "Master Sword",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 73,
          "value": 10
        },
        {
          "type": 1,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Wand",
      "displayName": "Master Wand",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 64,
          "value": 10
        },
        {
          "type": 4,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mechanical Core",
      "displayName": "Mechanical Core",
      "effects": [
        {
          "type": 64,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Meteoric Staff",
      "displayName": "Meteoric Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Meteor"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "Meteor"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FirePillar"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Meteor"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FirePillar"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mindweave",
      "displayName": "Mindweave",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 76,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 64,
          "value": 3
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mirage Cloak",
      "displayName": "Mirage Cloak",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 122,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 121,
          "value": 1
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mischief Gift Box",
      "displayName": "Mischief Gift Box",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "SpellShield"
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "SpellShield"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mitre of Sanctity",
      "displayName": "Mitre of Sanctity",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        },
        {
          "type": 67,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Molten Core",
      "displayName": "Molten Core",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Moonfrost",
      "displayName": "Moonfrost",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Fire"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Fire"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Moonshadow Hat",
      "displayName": "Moonshadow Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 3,
          "value": 1
        },
        {
          "type": 64,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Moonweave Gloves",
      "displayName": "Moon Band",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "HighHeal"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "HighHeal"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mystic Hat",
      "displayName": "Mystic Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Mystic Hood",
      "displayName": "Mystic Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Holy"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Shadow"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Undead"
        },
        {
          "type": 56,
          "value": 10,
          "skillId": "Poison"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Necronomicon",
      "displayName": "Necronomicon",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 119,
          "value": 25
        },
        {
          "type": 148,
          "value": 3
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "SummonSkeleton"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "SummonSkeletonMage"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 175,
          "value": 1
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Undead"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Neko Hood",
      "displayName": "Neko Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 3,
          "value": 1
        },
        {
          "type": 2,
          "value": 1
        },
        {
          "type": 14,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Night Chest",
      "displayName": "Night Armor",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 71,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 32,
          "value": 1
        },
        {
          "type": 71,
          "value": 30
        },
        {
          "type": 72,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Night Feet",
      "displayName": "Night Boots",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 65,
          "value": 20
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 64,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Night Helm",
      "displayName": "Night Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 72,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 6,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Night Legs",
      "displayName": "Night Greaves",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 75,
          "value": 20
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 14,
          "value": 20
        },
        {
          "type": 141,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Night Shield",
      "displayName": "Compass of Dawn",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 35,
          "value": 1
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 58,
          "value": -10
        },
        {
          "type": 57,
          "value": -10
        },
        {
          "type": 103,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Nightfang Stud",
      "displayName": "Nightfang Stud",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ninja Hood",
      "displayName": "Ninja Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 2,
          "value": 1
        },
        {
          "type": 121,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Nomad Hood",
      "displayName": "Nomad Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "NoviceChest",
      "displayName": "Novice Chest",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 7,
          "value": 100
        },
        {
          "type": 59,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "NoviceFeet",
      "displayName": "Novice Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 8,
          "value": 20
        },
        {
          "type": 61,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "NoviceLegs",
      "displayName": "Novice Legs",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Oak Bow",
      "displayName": "Oak Bow",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "StrafingVolley"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Oathbound Helm",
      "displayName": "Oathbound Helm",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 32,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Obsidian Band",
      "displayName": "Obsidian Band",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 86,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Obsidian Edge",
      "displayName": "Obsidian Edge",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Wind"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Wind"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Obsidian Loop",
      "displayName": "Obsidian Loop",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 36,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Obsidian Pillar",
      "displayName": "Obsidian Pillar",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ocular Grimoire",
      "displayName": "Ocular Grimoire",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Onyx Bolt",
      "displayName": "Onyx Bolt",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 52,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ornamented Staff",
      "displayName": "Ornamented Staff",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Oxygen Tank",
      "displayName": "Oxygen Tank",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Poison"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Poison"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Paladin Crest",
      "displayName": "Paladin Crest",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        },
        {
          "type": 73,
          "value": 1
        },
        {
          "type": 74,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Paladin_1",
      "displayName": "Resolute Pose"
    },
    {
      "itemType": 2,
      "id": "Paladin_2",
      "displayName": "Crushing Advance"
    },
    {
      "itemType": 2,
      "id": "Paladin_3",
      "displayName": "Sacred Bastion"
    },
    {
      "itemType": 2,
      "id": "Paladin_4",
      "displayName": "Divine Retribution"
    },
    {
      "itemType": 2,
      "id": "Parrying Knife",
      "displayName": "Parrying Knife",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 121,
          "value": 15
        },
        {
          "type": 14,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Phantom Kunai",
      "displayName": "Phantom Kunai",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 162,
          "value": 1,
          "skillId": "ShadowSeal"
        },
        {
          "type": 177,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Phantom Mask",
      "displayName": "Phantom Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Haste"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Piercer",
      "displayName": "Piercer",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 193,
          "value": 10
        },
        {
          "type": 52,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 193,
          "value": 1
        },
        {
          "type": 52,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Pirate Hat",
      "displayName": "Pirate Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 5,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PirateChest",
      "displayName": "Pirate Coat",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 5,
          "value": 7
        },
        {
          "type": 52,
          "value": 7
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PirateFeet",
      "displayName": "Pirate Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 9,
          "value": 7
        },
        {
          "type": 13,
          "value": 7
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PirateGloves",
      "displayName": "Pirate Hook",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 15,
          "value": 7
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PirateLegs",
      "displayName": "Pirate Legs",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 121,
          "value": 7
        },
        {
          "type": 14,
          "value": 7
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Pistol",
      "displayName": "Pistol",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 3,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Plasma Helmet",
      "displayName": "Plasma Helmet",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 6,
          "value": 5
        },
        {
          "type": 75,
          "value": 25
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Plasma Shell",
      "displayName": "Plasma Shell",
      "effects": [
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Blue",
      "displayName": "Azure Flow",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 72,
          "value": -75
        },
        {
          "type": 90,
          "value": 50
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "HydroVortex"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 70,
          "value": 3
        },
        {
          "type": 64,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Purple",
      "displayName": "Violet Arc",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 71,
          "value": -75
        },
        {
          "type": 85,
          "value": -50
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "ShadowRelease"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 69,
          "value": 3
        },
        {
          "type": 52,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Yellow",
      "displayName": "Solar Pulse",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 98,
          "value": -75
        },
        {
          "type": 68,
          "value": -50
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "Meteor"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 2,
          "value": 1
        },
        {
          "type": 63,
          "value": 5
        },
        {
          "type": 65,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "PlasmaChest",
      "displayName": "Plasma Suit",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 71,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 141,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PlasmaFeet",
      "displayName": "Plasma Boots",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 35,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        },
        {
          "type": 72,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "PlasmaLegs",
      "displayName": "Plasma Greaves",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 75,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Plum Talisman",
      "displayName": "Plum Talisman",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 67,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Potion Bowl",
      "displayName": "Potion Bowl",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Potion Gourd",
      "displayName": "Potion Gourd",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Potions",
      "displayName": "Potions",
      "effects": [
        {
          "type": 8,
          "value": 20
        },
        {
          "type": 61,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Priest_1",
      "displayName": "Veil of the Exorcist"
    },
    {
      "itemType": 2,
      "id": "Priest_2",
      "displayName": "Martyr's Oath"
    },
    {
      "itemType": 2,
      "id": "Priest_3",
      "displayName": "Exorcist's Brand"
    },
    {
      "itemType": 2,
      "id": "Priest_4",
      "displayName": "Eclipsing Aegis"
    },
    {
      "itemType": 2,
      "id": "Priest_5",
      "displayName": "Overflowing Grace"
    },
    {
      "itemType": 2,
      "id": "Priest_6",
      "displayName": "Resurrection Pact"
    },
    {
      "itemType": 2,
      "id": "Priest_7",
      "displayName": "Purity"
    },
    {
      "itemType": 2,
      "id": "Priest_8",
      "displayName": "Sanctuary Doctrine"
    },
    {
      "itemType": 2,
      "id": "Pumpkin Head",
      "displayName": "Jack-o'-lantern",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "DeathCoilEnemy"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "DeathCoilEnemy"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Quillcap",
      "displayName": "Quillcap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Quiver",
      "displayName": "Quiver",
      "effects": [
        {
          "type": 102,
          "value": 5
        },
        {
          "type": 25,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Quiver of Thorns",
      "displayName": "Quiver of Thorns",
      "effects": [
        {
          "type": 102,
          "value": 5
        },
        {
          "type": 3,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Radiant Dagger",
      "displayName": "Radiant Dagger",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 4,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Radiant Lyra",
      "displayName": "Radiant Lyra",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Radiant Wand",
      "displayName": "Radiant Wand",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Fire"
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Water"
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Wind"
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Earth"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Ragebound Fury",
      "displayName": "Ragebound Fury",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 183,
          "value": 5,
          "skillId": "Rage"
        },
        {
          "type": 75,
          "value": 5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Raider Helm",
      "displayName": "Raider Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ram Skull Mask",
      "displayName": "Ram Skull Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 90,
          "value": -20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ransack",
      "displayName": "Ransack",
      "effects": [
        {
          "type": 7,
          "value": 50
        },
        {
          "type": 59,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Razor Edge",
      "displayName": "Razor's Edge",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 79,
          "value": 25
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "LimitBreak"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Razor Kunai",
      "displayName": "Razor Kunai",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ShurikenFan"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "ShurikenFan"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FanOfKnives"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "FanOfKnives"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShurikenFan"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FanOfKnives"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Reaper Scythe",
      "displayName": "Grim Scythe",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 98,
          "value": 5
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "DeathSpiral"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "DeathSpiral"
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "Harvest"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "Harvest"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 15,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Recurve Bow",
      "displayName": "Recurve Bow",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 25,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Red Maw",
      "displayName": "Red Maw",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "BleedCoating"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 80,
          "value": 5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Red Shell",
      "displayName": "Red Shell",
      "effects": [
        {
          "type": 69,
          "value": 5
        },
        {
          "type": 70,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Regal Tricorne",
      "displayName": "Regal Tricorne",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Reindeer Headband",
      "displayName": "Reindeer Headband",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "skillId": "Heal"
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Heal"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Reindeer Hood",
      "displayName": "Reindeer Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 68,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ReindeerChest",
      "displayName": "Reindeer Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Cure"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ReindeerFeet",
      "displayName": "Reindeer Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Haste"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ReindeerGloves",
      "displayName": "Reindeer Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Damnation"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ReindeerLegs",
      "displayName": "Reindeer Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Endure"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Relic Trident",
      "displayName": "Relic Trident",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 49,
          "value": 50,
          "skillId": "SpearThrust"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "SpearThrust"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 13,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Repeater Crossbow",
      "displayName": "Repeater Crossbow",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 185,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 80,
          "value": 10
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Resonant Headphones",
      "displayName": "Resonant Headphones",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 64,
          "value": 10
        },
        {
          "type": 90,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Rifle",
      "displayName": "Rifle",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 25,
          "value": 12
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 165,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Riftbreaker",
      "displayName": "Riftbreaker",
      "effects": [
        {
          "type": 9,
          "value": 45
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 63,
          "value": -20
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4.5
        },
        {
          "type": 69,
          "value": 2
        },
        {
          "type": 0,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Rod",
      "displayName": "Rod",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 4,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 1.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Rogue_1",
      "displayName": "Silent Circle"
    },
    {
      "itemType": 2,
      "id": "Rogue_2",
      "displayName": "Shadow Trail"
    },
    {
      "itemType": 2,
      "id": "Rogue_3",
      "displayName": "Venom Bloom"
    },
    {
      "itemType": 2,
      "id": "Rogue_4",
      "displayName": "Shadow Dance"
    },
    {
      "itemType": 2,
      "id": "Rogue_5",
      "displayName": "Hidden Strikes"
    },
    {
      "itemType": 2,
      "id": "Round Glasses",
      "displayName": "Round Glasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Royal Crest",
      "displayName": "Royal Crest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 6,
          "value": 3
        },
        {
          "type": 67,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 67,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Royal Dagger",
      "displayName": "Royal Dagger",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 15,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Royal Fang",
      "displayName": "Royal Fang",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "SpearStab"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "SpearStab"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Runeborn Visor",
      "displayName": "Runeborn Visor",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 69,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Runecall",
      "displayName": "Runecall",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 4,
          "value": 5
        },
        {
          "type": 48,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Runed Staff",
      "displayName": "Runed Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Runesmasher",
      "displayName": "Runesmasher",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FieldCurse"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "FieldSilence"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "FieldCurse"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "FieldSilence"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 2
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Runesteel",
      "displayName": "Runesteel",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Rusted Binocs",
      "displayName": "Rusted Binocs",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 102,
          "value": 3
        },
        {
          "type": 25,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Safety Helmet",
      "displayName": "Safety Helmet",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Silence"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SafetyChest",
      "displayName": "Safety Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 141,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SafetyFeet",
      "displayName": "Safety Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 35,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SafetyGloves",
      "displayName": "Safety Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 73,
          "value": 5
        },
        {
          "type": 74,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SafetyLegs",
      "displayName": "Safety Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 32,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sailor Cap",
      "displayName": "Sailor Cap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SanctifiedChest",
      "displayName": "Sanctified Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 20
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 68,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SanctifiedFeet",
      "displayName": "Sanctified Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 68,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SanctifiedLegs",
      "displayName": "Sanctified Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 20
        },
        {
          "type": 71,
          "value": 5
        },
        {
          "type": 68,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sanctum Gloves",
      "displayName": "Sanctum Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Sanctuary"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "Sanctuary"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sanctum Guard",
      "displayName": "Sanctum Guard",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 68,
          "value": 5
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "Consecration"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 68,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SantaChest",
      "displayName": "Santa Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Cure"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SantaFeet",
      "displayName": "Santa Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Haste"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SantaGloves",
      "displayName": "Santa Gloves",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Damnation"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SantaHat",
      "displayName": "Santa Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "StatusRecovery"
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "StatusRecovery"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SantaLegs",
      "displayName": "Santa Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "Endure"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sapphire Crown",
      "displayName": "Sapphire Crown",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 4,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sapphire Guard",
      "displayName": "Stormplate Helm",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 57,
          "value": -5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 72,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Satchel of Embers",
      "displayName": "Satchel of Embers",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Scalpel",
      "displayName": "Scalpel",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "VenomStrike"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 142,
          "value": 1
        },
        {
          "type": 40,
          "value": 1,
          "skillId": "VenomStrike"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Scholar Glasses",
      "displayName": "Scholar Glasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 10,
          "value": 5
        },
        {
          "type": 70,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Scholar's Cap",
      "displayName": "Scholar's Cap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Scout_1",
      "displayName": "Chain Reaction"
    },
    {
      "itemType": 2,
      "id": "Scout_2",
      "displayName": "Hunting Ground"
    },
    {
      "itemType": 2,
      "id": "Scout_3",
      "displayName": "Skirmisher's Flow"
    },
    {
      "itemType": 2,
      "id": "Scout_4",
      "displayName": "Suppressing Shot"
    },
    {
      "itemType": 2,
      "id": "Scout_5",
      "displayName": "Eagle Eye"
    },
    {
      "itemType": 2,
      "id": "Scrapfang",
      "displayName": "Scrapfang",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 185,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 80,
          "value": 5
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Scroll Case",
      "displayName": "Scroll Case",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Scroll Charm",
      "displayName": "Scroll Charm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 34,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Scythe",
      "displayName": "Scythe",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 98,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 176,
          "value": 5
        },
        {
          "type": 63,
          "value": 1
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 9,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Seedling Satchel",
      "displayName": "Seedling Satchel",
      "effects": [
        {
          "type": 49,
          "value": 15,
          "skillId": "Heal"
        },
        {
          "type": 90,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Seer's Hood",
      "displayName": "Seer's Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Serpent Ring",
      "displayName": "Serpent Ring",
      "effects": [
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 5,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Shadow Dancers",
      "displayName": "Shadow Dancers",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "BladeDance"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "BladeDance"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        },
        {
          "type": 65,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Shadow Shield",
      "displayName": "Shadowsteel Guard",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Shadow"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Shady Specs",
      "displayName": "Shady Specs",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 14,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sharkbite Hood",
      "displayName": "Sharkbite Hood",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 9,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sharpened Visor",
      "displayName": "Sharpened Visor",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Shinobi_1",
      "displayName": "Silent Execution"
    },
    {
      "itemType": 2,
      "id": "Shinobi_2",
      "displayName": "Sealed Fate"
    },
    {
      "itemType": 2,
      "id": "Shinobi_3",
      "displayName": "Honed Technique"
    },
    {
      "itemType": 2,
      "id": "Shinobi_4",
      "displayName": "Phantom Manuscript"
    },
    {
      "itemType": 2,
      "id": "Shotgun",
      "displayName": "Shotgun",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 24,
          "value": 2
        },
        {
          "type": 164,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Shuriken",
      "displayName": "Fuma Shuriken",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 15,
          "value": 5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Silence of Night",
      "displayName": "Silence of Night",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 25,
          "value": 12
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 165,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 102,
          "value": 1
        },
        {
          "type": 15,
          "value": 2
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Skull Emblem",
      "displayName": "Skull Emblem",
      "effects": [
        {
          "type": 79,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Skull Lord Totem",
      "displayName": "Skull Lord Totem",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Skull Pendant",
      "displayName": "Skull Pendant",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Skullhacker",
      "displayName": "Skullhacker",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Whirlwind"
        },
        {
          "type": 105,
          "value": -1,
          "skillId": "Whirlwind"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "Whirlwind"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Whirlwind"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sky Raider Hat",
      "displayName": "Sky Raider Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Skybreaker Staff",
      "displayName": "Skybreaker Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ThunderStorm"
        },
        {
          "type": 145,
          "value": -1,
          "skillId": "ThunderStorm"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ThunderStorm"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Skywing Mask",
      "displayName": "Skywing Mask",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Slingshot",
      "displayName": "Slingshot",
      "effects": [
        {
          "type": 9,
          "value": 10
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 3,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Smith's Tools",
      "displayName": "Smith's Tools",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sniper Rifle",
      "displayName": "Sniper Rifle",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 25,
          "value": 12
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 165,
          "value": 25
        },
        {
          "type": 49,
          "value": -50,
          "skillId": "SniperShot"
        },
        {
          "type": 145,
          "value": 2,
          "skillId": "SniperShot"
        },
        {
          "type": 162,
          "value": -2,
          "skillId": "SniperShot"
        },
        {
          "type": 104,
          "value": -6,
          "skillId": "SniperShot"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Snowbun Earmuffs",
      "displayName": "Snowbun Earmuffs",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 71,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Snowman Head",
      "displayName": "Snowman Head",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Frozen"
        },
        {
          "type": 39,
          "value": 5,
          "skillId": "IceShard"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Solar Relic",
      "displayName": "Solar Relic",
      "effects": [
        {
          "type": 67,
          "value": 10
        },
        {
          "type": 4,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Solar Spear",
      "displayName": "Solar Spear",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 7,
          "value": 100
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 75,
          "value": 5
        },
        {
          "type": 1,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Solaris Blade",
      "displayName": "Solaris Blade",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 195,
          "value": 10
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sonic Shoes",
      "displayName": "Sonic Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 63,
          "value": 20
        },
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Soul Reaper Scythe",
      "displayName": "Blight Reaver",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 98,
          "value": 5
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "CorpseExplosionEnemy"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "CorpseExplosion"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "CorpseExplosionEnemy"
        },
        {
          "type": 107,
          "value": 1,
          "skillId": "CorpseExplosionEnemy"
        },
        {
          "type": 142,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "SoulbinderChest",
      "displayName": "Soulbinder Chest",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 134,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SoulbinderFeet",
      "displayName": "Soulbinder Shoes",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 131,
          "value": 10
        },
        {
          "type": 136,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "SoulbinderLegs",
      "displayName": "Soulbinder Legs",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 132,
          "value": 10
        },
        {
          "type": 133,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spiked Club",
      "displayName": "Spiked Club",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 10
        },
        {
          "type": 151,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "NPC_Stun"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Spiked Familiar",
      "displayName": "Spiked Familiar",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spiked Helm",
      "displayName": "Spiked Helm",
      "effects": [
        {
          "type": 11,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spikesteel Helm",
      "displayName": "Spikesteel Helm",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 86,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 86,
          "value": 2
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spined Aegis",
      "displayName": "Spined Aegis",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spineshard",
      "displayName": "Spineshard",
      "effects": [
        {
          "type": 9,
          "value": 45
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 80,
          "value": 100
        },
        {
          "type": 130,
          "value": 6
        },
        {
          "type": 63,
          "value": -30
        },
        {
          "type": 72,
          "value": -90
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Spirit Familiar",
      "displayName": "Spirit Familiar",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "CorpseBarrier"
        },
        {
          "type": 76,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spirit Ward",
      "displayName": "Spirit Ward",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 6,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        },
        {
          "type": 72,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Spooky Spell Hat",
      "displayName": "Spooky Spell Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Holy"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Shadow"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Undead"
        },
        {
          "type": 44,
          "value": 10,
          "skillId": "Poison"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Springram Horns",
      "displayName": "Springram Horns",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 67,
          "value": 10
        },
        {
          "type": 68,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Staff of Eternis",
      "displayName": "Staff of Eternis",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 40
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 62,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 4
        },
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 48,
          "value": 1
        },
        {
          "type": 64,
          "value": 1
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Star",
      "displayName": "Star",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Wind"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Wind"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Starbound Hat",
      "displayName": "Starbound Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 48,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Starshine Glasses",
      "displayName": "Starshine Glasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Stiletto",
      "displayName": "Stiletto",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "BladeDance"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 65,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stonebound Boots",
      "displayName": "Stonebound Boots",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 32,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Stoneguard",
      "displayName": "Stoneguard",
      "effects": [
        {
          "type": 11,
          "value": 25
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 71,
          "value": 15
        },
        {
          "type": 72,
          "value": 5
        },
        {
          "type": 1,
          "value": 5
        },
        {
          "type": 47,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Stonepoint Spear",
      "displayName": "Stonepoint Spear",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 42,
          "value": 5,
          "skillId": "Counter"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 85,
          "value": 1
        },
        {
          "type": 73,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stormburst Crossbow",
      "displayName": "Stormburst Crossbow",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "ArrowShower"
        },
        {
          "type": 104,
          "value": -2,
          "skillId": "ArrowShower"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Stormcall Kunai",
      "displayName": "Stormcall Kunai",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 40,
          "value": 1,
          "skillId": "ChainLightning"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Stormcaller Totem",
      "displayName": "Stormcaller Totem",
      "effects": [
        {
          "type": 64,
          "value": 10
        },
        {
          "type": 3,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Stormfeather Kunai",
      "displayName": "Stormfeather Kunai",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "LightningRelease"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "LightningStrike"
        },
        {
          "type": 104,
          "value": -1,
          "skillId": "LightningStrike"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "LightningRelease"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "LightningStrike"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stormpiercer",
      "displayName": "Stormpiercer",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "WeaponThrow"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "WeaponThrow"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "WeaponThrow"
        },
        {
          "type": 110,
          "value": 1,
          "skillId": "WeaponThrow"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 2.5
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "StormplateChest",
      "displayName": "Stormplate Chest",
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 12,
          "value": 15
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 57,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 8,
          "value": 10
        }
      ]
    },
    {
      "itemType": 2,
      "id": "StormplateFeet",
      "displayName": "Stormplate Shoes",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 57,
          "value": -5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 8,
          "value": 5
        }
      ]
    },
    {
      "itemType": 2,
      "id": "StormplateLegs",
      "displayName": "Stormplate Legs",
      "effects": [
        {
          "type": 11,
          "value": 7
        },
        {
          "type": 12,
          "value": 7
        },
        {
          "type": 76,
          "value": 20
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 57,
          "value": -5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 8,
          "value": 5
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Straw Hat",
      "displayName": "Straw Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Stylish Shades",
      "displayName": "Stylish Shades",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Summoner_1",
      "displayName": "Alpha Surge"
    },
    {
      "itemType": 2,
      "id": "Summoner_2",
      "displayName": "Hexwell Current"
    },
    {
      "itemType": 2,
      "id": "Summoner_3",
      "displayName": "Banishment Well"
    },
    {
      "itemType": 2,
      "id": "Summoner_4",
      "displayName": "Resonant Wind"
    },
    {
      "itemType": 2,
      "id": "Summoner_5",
      "displayName": "Blessed Resonance"
    },
    {
      "itemType": 2,
      "id": "Summoner_6",
      "displayName": "Soul Chains"
    },
    {
      "itemType": 2,
      "id": "Sun Disc",
      "displayName": "Sun Disc",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sun Emblem",
      "displayName": "Sun Emblem",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        },
        {
          "type": 39,
          "value": 3,
          "skillId": "Heal"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sun Emblem Helm",
      "displayName": "Sun Emblem Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sun Lion Crest",
      "displayName": "Sun Lion Crest",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 1,
          "value": 3
        },
        {
          "type": 75,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sunbound Mitts",
      "displayName": "Sunbound Mitts",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "Barrier"
        },
        {
          "type": 106,
          "value": 3,
          "skillId": "Barrier"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Suncrest Mace",
      "displayName": "Suncrest Mace",
      "effects": [
        {
          "type": 9,
          "value": 25
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 151,
          "value": 1
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 24,
          "value": 2
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 186,
          "value": 10
        },
        {
          "type": 195,
          "value": 10
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Sunflare",
      "displayName": "Sunflare",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 85,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 44,
          "value": 1,
          "skillId": "Earth"
        },
        {
          "type": 56,
          "value": 1,
          "skillId": "Earth"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sunflower Clip",
      "displayName": "Sunflower Clip",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 59,
          "value": 5
        },
        {
          "type": 75,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sunglasses",
      "displayName": "Sunglasses",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sunset Shutters",
      "displayName": "Sunset Shutters",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Swampy Hat",
      "displayName": "Swampy Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 42,
          "value": 2,
          "skillId": "NPC_Poison"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 40,
          "value": 3,
          "skillId": "NPC_Poison"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Swift Fang",
      "displayName": "Serpent Fang",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "VenomCoating"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 80,
          "value": 5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sword",
      "displayName": "Sword",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 85,
          "value": 10
        },
        {
          "type": 7,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Teapot Spirit",
      "displayName": "Teapot Spirit",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tempest Robes",
      "displayName": "Tempest Robes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 20
        },
        {
          "type": 72,
          "value": 20
        },
        {
          "type": 49,
          "value": 10,
          "skillId": "Firebolt"
        },
        {
          "type": 49,
          "value": 10,
          "skillId": "Icebolt"
        },
        {
          "type": 49,
          "value": 10,
          "skillId": "Thunderbolt"
        },
        {
          "type": 49,
          "value": 10,
          "skillId": "Earthbolt"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tempest Staff",
      "displayName": "Tempest Staff",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "Tempest"
        },
        {
          "type": 104,
          "value": -3,
          "skillId": "Tempest"
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "ChainLightning"
        },
        {
          "type": 109,
          "value": 1,
          "skillId": "ChainLightning"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Tempest"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ChainLightning"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Thief Mask",
      "displayName": "Thief Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ThiefChest",
      "displayName": "Ashwalker Chest",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 176,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ThiefFeet",
      "displayName": "Ashwalker Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "ThiefLegs",
      "displayName": "Ashwalker Legs",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 14,
          "value": 20
        },
        {
          "type": 15,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Thundercoil",
      "displayName": "Thundercoil",
      "effects": [
        {
          "type": 9,
          "value": 35
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 24,
          "value": 2
        },
        {
          "type": 164,
          "value": 50
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3.5
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 40,
          "value": 2,
          "skillId": "SuppressiveShot"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Tiger Hat",
      "displayName": "Tiger Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tinker Goggles",
      "displayName": "Tinker Goggles",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 13,
          "value": 20
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tinker Mask",
      "displayName": "Tinker Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Blind"
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Burning"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tinkerer's Tools",
      "displayName": "Tinkerer's Tools",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tomahawk",
      "displayName": "Tomahawk",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        },
        {
          "type": 42,
          "value": 2,
          "skillId": "AxeThrow"
        },
        {
          "type": 40,
          "value": 5,
          "skillId": "AxeThrow"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 40,
          "value": 1,
          "skillId": "AxeThrow"
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Tome of Ages",
      "displayName": "Tome of Ages",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Top Hat",
      "displayName": "Top Hat",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Totem Banner",
      "displayName": "Totem Banner",
      "effects": [
        {
          "type": 43,
          "value": 2,
          "skillId": "ShoutMight"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "ShoutFury"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "ShoutBlood"
        },
        {
          "type": 43,
          "value": 2,
          "skillId": "ShoutStun"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Totem Mask",
      "displayName": "Totem Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 80,
          "value": 3
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Totem Skull Headdress",
      "displayName": "Totem Skull Headdress",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Traveler's Trunk",
      "displayName": "Traveler's Trunk",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Treasure Box",
      "displayName": "Treasure Box",
      "effects": [
        {
          "type": 5,
          "value": 7
        },
        {
          "type": 15,
          "value": 7
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Treasure Chest",
      "displayName": "Treasure Chest",
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Tribal Mask",
      "displayName": "Tribal Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 135,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Trickster Horns",
      "displayName": "Trickster Horns",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Trident of Tides",
      "displayName": "Trident of Tides",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 193,
          "value": 15
        },
        {
          "type": 25,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 47,
          "value": 1
        },
        {
          "type": 182,
          "value": 5
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Triple Barrel Revolver",
      "displayName": "Triple Barrel Revolver",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 49,
          "value": 15,
          "skillId": "PanicBurst"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "PanicBurst"
        },
        {
          "type": 108,
          "value": 20,
          "skillId": "PanicBurst"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "PanicBurst"
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "TurtleShell",
      "displayName": "Turtle Shell",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Twinblade",
      "displayName": "Twinblade",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 79,
          "value": 25
        },
        {
          "type": 0,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Valiant Crown",
      "displayName": "Valiant Crown",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Wind"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Wind"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Valor Helm",
      "displayName": "Valor Helm",
      "effects": [
        {
          "type": 11,
          "value": 3
        },
        {
          "type": 12,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Ventilator Mask",
      "displayName": "Ventilator Mask",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Poison"
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Silence"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Verdant Antlers",
      "displayName": "Verdant Antlers",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 176,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Verdant Core",
      "displayName": "Verdant Core",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Earth"
        },
        {
          "type": 67,
          "value": 2
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Verdant Striders",
      "displayName": "Verdant Striders",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "Haste"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Violet Heart Charm",
      "displayName": "Violet Heart Charm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 8,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Void Urn",
      "displayName": "Void Urn",
      "effects": [
        {
          "type": 142,
          "value": 25
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Voidspike Helm",
      "displayName": "Voidspike Helm",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Voidthreads",
      "displayName": "Voidthreads",
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 1
        },
        {
          "type": 72,
          "value": 1
        },
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "War Axe",
      "displayName": "War Axe",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 25,
          "skillId": "Bash"
        },
        {
          "type": 106,
          "value": 2,
          "skillId": "Bash"
        },
        {
          "type": 108,
          "value": -20,
          "skillId": "Bash"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "War Banner",
      "displayName": "War Banner",
      "effects": [
        {
          "type": 47,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Warborn Aegis",
      "displayName": "Warborn Aegis",
      "effects": [
        {
          "type": 85,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Warlord Emblem Shield",
      "displayName": "Warlord Emblem Shield",
      "effects": [
        {
          "type": 11,
          "value": 20
        },
        {
          "type": 85,
          "value": 30
        },
        {
          "type": 32,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 11,
          "value": 5
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Warrior_1",
      "displayName": "Bloodtrail"
    },
    {
      "itemType": 2,
      "id": "Warrior_2",
      "displayName": "Breakjaw"
    },
    {
      "itemType": 2,
      "id": "Warrior_3",
      "displayName": "Warmaw"
    },
    {
      "itemType": 2,
      "id": "Warrior_4",
      "displayName": "Bloodprice"
    },
    {
      "itemType": 2,
      "id": "Warrior_5",
      "displayName": "Warpath"
    },
    {
      "itemType": 2,
      "id": "Wasteland Cleaver",
      "displayName": "Wasteland Cleaver",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 52,
          "value": 10
        },
        {
          "type": 49,
          "value": 100,
          "skillId": "AxeVortex"
        },
        {
          "type": 104,
          "value": 2,
          "skillId": "AxeVortex"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Water Shield",
      "displayName": "Frostspire Guard",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Water"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Weaver Gauntlets",
      "displayName": "Weaver Gauntlets",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 6,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Weaver_1",
      "displayName": "Weave of Counter"
    },
    {
      "itemType": 2,
      "id": "Weaver_2",
      "displayName": "Weave of Guardian"
    },
    {
      "itemType": 2,
      "id": "Weaver_3",
      "displayName": "Weave of Arcana"
    },
    {
      "itemType": 2,
      "id": "Weaver_4",
      "displayName": "Weave of Fury"
    },
    {
      "itemType": 2,
      "id": "Weaver_5",
      "displayName": "Weave of Marksman"
    },
    {
      "itemType": 2,
      "id": "WeaverChest",
      "displayName": "Weaver Chest",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "WeaverFeet",
      "displayName": "Weaver Shoes",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 65,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "WeaverLegs",
      "displayName": "Weaver Legs",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Whale Backpack",
      "displayName": "Whale Backpack",
      "effects": [
        {
          "type": 46,
          "value": 5,
          "skillId": "Water"
        },
        {
          "type": 53,
          "value": 5,
          "skillId": "Water"
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Whisper of Thorns",
      "displayName": "Whisper of Thorns",
      "effects": [
        {
          "type": 9,
          "value": 30
        },
        {
          "type": 10,
          "value": 30
        },
        {
          "type": 25,
          "value": 6
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 42,
          "value": 1,
          "skillId": "VenomCoating"
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 3
        },
        {
          "type": 10,
          "value": 3
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 102,
          "value": 1
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "White Bishop's Hood",
      "displayName": "White Bishop's Hood",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 46,
          "value": 10,
          "skillId": "Holy"
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 46,
          "value": 1,
          "skillId": "Holy"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wilderness Pack",
      "displayName": "Wilderness Pack",
      "effects": [
        {
          "type": 72,
          "value": -10
        },
        {
          "type": 101,
          "value": 1000
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wildroot Veil",
      "displayName": "Wildroot Veil",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 67,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Willow Staff",
      "displayName": "Willow Staff",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 4,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 63,
          "value": 3
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Wind Shield",
      "displayName": "Zephyr Cross",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 53,
          "value": 3,
          "skillId": "Wind"
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Windcarver",
      "displayName": "Windcarver",
      "effects": [
        {
          "type": 9,
          "value": 20
        },
        {
          "type": 80,
          "value": 50
        },
        {
          "type": 25,
          "value": 5
        },
        {
          "type": 130,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 2
        },
        {
          "type": 13,
          "value": 5
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 9,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Windroot",
      "displayName": "Windroot",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 64,
          "value": 3
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "WindstriderChest",
      "displayName": "Windstrider Chest",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 71,
          "value": 10
        },
        {
          "type": 72,
          "value": 10
        },
        {
          "type": 102,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "WindstriderFeet",
      "displayName": "Windstrider Shoes",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 3,
          "value": 3
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "WindstriderLegs",
      "displayName": "Windstrider Legs",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 14,
          "value": 5
        },
        {
          "type": 75,
          "value": 10
        },
        {
          "type": 76,
          "value": 10
        },
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Winged Helm",
      "displayName": "Winged Helm",
      "effects": [
        {
          "type": 11,
          "value": 5
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 0,
          "value": 1
        },
        {
          "type": 15,
          "value": 1
        },
        {
          "type": 65,
          "value": 1
        },
        {
          "type": 63,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wings of Valor",
      "displayName": "Wings of Valor",
      "effects": [
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 6,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Witch's Whisk",
      "displayName": "Witch's Whisk",
      "effects": [
        {
          "type": 9,
          "value": 15
        },
        {
          "type": 10,
          "value": 15
        },
        {
          "type": 64,
          "value": 15
        },
        {
          "type": 121,
          "value": 15
        },
        {
          "type": 65,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 1.5
        },
        {
          "type": 10,
          "value": 1.5
        },
        {
          "type": 4,
          "value": 1
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Witchsteps",
      "displayName": "Witchsteps",
      "effects": [
        {
          "type": 11,
          "value": 2
        },
        {
          "type": 12,
          "value": 10
        },
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wizard_1",
      "displayName": "Jupiter's Wrath"
    },
    {
      "itemType": 2,
      "id": "Wizard_2",
      "displayName": "Voltaic Overdraw"
    },
    {
      "itemType": 2,
      "id": "Wizard_3",
      "displayName": "Eye of the Storm"
    },
    {
      "itemType": 2,
      "id": "Wizard_4",
      "displayName": "Stonewake"
    },
    {
      "itemType": 2,
      "id": "Wizard_5",
      "displayName": "Focused Amplification"
    },
    {
      "itemType": 2,
      "id": "Wizard_6",
      "displayName": "Mana Surge"
    },
    {
      "itemType": 2,
      "id": "Wizard_7",
      "displayName": "Arcane Barrier"
    },
    {
      "itemType": 2,
      "id": "Wizardry Hat",
      "displayName": "Wizardry Hat",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 5
        },
        {
          "type": 64,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wolfcrest Shield",
      "displayName": "Wolfcrest Shield",
      "effects": [
        {
          "type": 85,
          "value": 5
        },
        {
          "type": 1,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wooden Guard",
      "displayName": "Wooden Guard",
      "effects": [
        {
          "type": 11,
          "value": 10
        },
        {
          "type": 85,
          "value": 30
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Worker's Cap",
      "displayName": "Worker's Cap",
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 12,
          "value": 1
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wraith of Dawn",
      "displayName": "Wraith of Dawn",
      "effects": [
        {
          "type": 9,
          "value": 40
        },
        {
          "type": 10,
          "value": 20
        },
        {
          "type": 25,
          "value": 10
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 4
        },
        {
          "type": 10,
          "value": 2
        },
        {
          "type": 69,
          "value": 1
        },
        {
          "type": 102,
          "value": 1
        },
        {
          "type": 63,
          "value": 3
        },
        {
          "type": 65,
          "value": 1
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Wraithlight",
      "displayName": "Wraithlight",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Shadow"
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Zephyrlight",
      "displayName": "Zephyrlight",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 25
        },
        {
          "type": 64,
          "value": 15
        }
      ],
      "refineEffects": [
        {
          "type": 9,
          "value": 0.5
        },
        {
          "type": 10,
          "value": 2.5
        },
        {
          "type": 46,
          "value": 2,
          "skillId": "Wind"
        }
      ],
      "substatGroup": "Magic"
    }
  ] as const satisfies readonly FishNetEquipmentItemDefinition[];
}
