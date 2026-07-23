import type { FishNetEquipmentItemDefinition } from "../catalog.ts";

export class EquipmentItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 2,
      "id": "3D Glasses",
      "displayName": "3DGlasses",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Acolyte_1",
      "displayName": "Scripture of Mercy",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Acolyte_2",
      "displayName": "Radiant Strikes",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Acolyte_3",
      "displayName": "Radiant Judgment",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Acolyte_4",
      "displayName": "Gospel of Grace",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Acolyte_5",
      "displayName": "Lightweaver",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Acolyte_6",
      "displayName": "Sacred Rhythm",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Adventurer's Kit",
      "displayName": "Adventurer's Kit",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "FreeCast"
          }
        }
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        },
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 30,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Azure Prism",
      "displayName": "Azure Prism",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Beast Hood",
      "displayName": "Beast Hood",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "displayName": "War Cry",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Berserker_2",
      "displayName": "Crimson Frenzy",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Berserker_3",
      "displayName": "Slaughter Instinct",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Berserker_4",
      "displayName": "Executioner",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "BerserkFeet",
      "displayName": "Direwolf Shoes",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "DeathNova"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "DeathNovaField"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "DeathNova"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "DeathNova"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "DeathCoilSummon"
          }
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
          "target": {
            "kind": "skill",
            "id": "DeathNova"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "DeathNovaField"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "DeathCoilSummon"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bishop's Hood",
      "displayName": "Bishop's Hood",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Blacksteel Blade",
      "displayName": "Blacksteel Blade",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Berserk"
          }
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Cure"
          }
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Revive"
          }
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "PointBlankShot"
          }
        },
        {
          "type": 162,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "PointBlankShot"
          }
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bone Helm",
      "displayName": "Bone Helm",
      "weight": 20,
      "effects": [
        {
          "type": 11,
          "value": 15
        },
        {
          "type": 53,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        }
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
      "weight": 30,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
        },
        {
          "type": 124,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Bonk"
          }
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
      "weight": 10,
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "BotHunter"
          }
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
      "weight": 30,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        },
        {
          "type": 106,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chainfrost Staff",
      "displayName": "Chainfrost Staff",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 124,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
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
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 124,
          "value": 0.5,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chains of Binding",
      "displayName": "Chains of Binding",
      "weight": 50,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chaos Reaver",
      "displayName": "Chaos Reaver",
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "DarkClaw"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "Cyclone"
          }
        },
        {
          "type": 105,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "Cyclone"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "Cyclone"
          }
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
          "target": {
            "kind": "skill",
            "id": "Cyclone"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chicky Hood",
      "displayName": "Chicky Hood",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "ShadowStrike"
          }
        },
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Conviction"
          }
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "NPC_WideCurse"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Vitae",
      "displayName": "Codex Vitae",
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        },
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Vitality"
          }
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Combat Knife",
      "displayName": "Combat Knife",
      "weight": 30,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "DivinePunishment"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "DivinePunishment"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "DivinePunishment"
          }
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
          "target": {
            "kind": "skill",
            "id": "DivinePunishment"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Crusader Sword",
      "displayName": "Oathbreaker",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "JudgementBlade"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "GrandCross"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "GrandCross"
          }
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
          "target": {
            "kind": "skill",
            "id": "JudgementBlade"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "GrandCross"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Crystal Cache",
      "displayName": "Crystal Cache",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "FieldDamage"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "FieldDamage"
          }
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
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 12,
          "value": 2
        },
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Curse"
          }
        }
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "BloodCrash"
          }
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Daybreak",
      "displayName": "Daybreak",
      "weight": 30,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "ShadowStrike"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "ShadowStrike"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Demon Hood",
      "displayName": "Demon Hood",
      "weight": 20,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "displayName": "Disciple's Bracers",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "DiscipleChest",
      "displayName": "Disciple's Manteau",
      "weight": 50
    },
    {
      "itemType": 2,
      "id": "DiscipleFeet",
      "displayName": "Disciple's Shoes",
      "weight": 20
    },
    {
      "itemType": 2,
      "id": "DiscipleHelm",
      "displayName": "Disciple's Visage",
      "weight": 20
    },
    {
      "itemType": 2,
      "id": "DiscipleLegs",
      "displayName": "Disciple's Wraps",
      "weight": 20
    },
    {
      "itemType": 2,
      "id": "Discipline Band",
      "displayName": "Discipline Band",
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Bat",
      "displayName": "Drooping Bat",
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Cat",
      "displayName": "Drooping Cat",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Dragon",
      "displayName": "Drooping Dragon",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Flora",
      "displayName": "Drooping Flora",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Pup",
      "displayName": "Drooping Pup",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Skeleton",
      "displayName": "Drooping Skeleton",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Drooping Wraith",
      "displayName": "Drooping Wraith",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "SoulStrike"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "SoulStrike"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Dualblade Sheath",
      "displayName": "Dualblade Sheath",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dustweaver Hat",
      "displayName": "Dustweaver Hat",
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "WildCharge"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "WildCharge"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "WildCharge"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "GroundSlam"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "GroundSlam"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "GroundSlam"
          }
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
          "target": {
            "kind": "skill",
            "id": "WildCharge"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "GroundSlam"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Earth Shield",
      "displayName": "Obsidian Bulwark",
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Eclipse Kunai",
      "displayName": "Eclipse Kunai",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ShadowRelease"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "TwistOfFate"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "TwistOfFate"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShadowRelease"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "TwistOfFate"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Edge of Twilight",
      "displayName": "Edge of Twilight",
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Embershard",
      "displayName": "Embershard",
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Emerald Crown",
      "displayName": "Emerald Crown",
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        },
        {
          "type": 40,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
        },
        {
          "type": 40,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
        },
        {
          "type": 40,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "EnchantPoison"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantHoly"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantShadow"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantUndead"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "EnchantFire"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantWater"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantWind"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EnchantEarth"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "HydroVortex"
          }
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
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "HydroVortex"
          }
        },
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "NPC_Freeze"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Executioner Axe",
      "displayName": "Executioner Axe",
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Execute"
          }
        },
        {
          "type": 162,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Execute"
          }
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
          "target": {
            "kind": "skill",
            "id": "Execute"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Exorcist Bible",
      "displayName": "Exorcist Bible",
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "Faith"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "TurnUndead"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Damnation"
          }
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
          "target": {
            "kind": "skill",
            "id": "TurnUndead"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Exorcist Staff",
      "displayName": "Exorcist Staff",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Exorcism"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "TurnUndead"
          }
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
          "target": {
            "kind": "skill",
            "id": "Exorcism"
          }
        },
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "TurnUndead"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Explorer's Pack",
      "displayName": "Explorer's Pack",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "SoulStrike"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "TrueSight"
          }
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Barrier"
          }
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Barrier"
          }
        }
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
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Flame Spirit",
      "displayName": "Flame Spirit",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "FireRelease"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Flameburst Kunai",
      "displayName": "Flameburst Kunai",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "FireRelease"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "FlameOrb"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "FlameOrb"
          }
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
          "target": {
            "kind": "skill",
            "id": "FireRelease"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "FlameOrb"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fleetrunner",
      "displayName": "Fleetrunner",
      "weight": 20,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "FanFire"
          }
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
          "target": {
            "kind": "skill",
            "id": "FanFire"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Focus Band",
      "displayName": "Focus Band",
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "TrueSight"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "ShieldBash"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "ShieldBash"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "ShieldBash"
          }
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "FreezingEdge"
          }
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 124,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 110,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
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
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Frostscale Helm",
      "displayName": "Frostscale Helm",
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Frostshard",
      "displayName": "Frostshard",
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Frostspire Kunai",
      "displayName": "Frostspire Kunai",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "IceRelease"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "FrostBlade"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "FrostBlade"
          }
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
          "target": {
            "kind": "skill",
            "id": "IceRelease"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "FrostBlade"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fruit Bowl",
      "displayName": "Fruit Bowl",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "GameMaster"
          }
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Golden Crest",
      "displayName": "Golden Crest",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "SoulStrike"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Golden Hoop",
      "displayName": "Golden Hoop",
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "TrueSight"
          }
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
      "weight": 20,
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
      "weight": 50,
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
          "target": {
            "kind": "status",
            "id": "Bleeding"
          }
        }
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
      "weight": 20,
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
          "target": {
            "kind": "status",
            "id": "Poison"
          }
        }
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
      "weight": 20,
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
          "target": {
            "kind": "status",
            "id": "Curse"
          }
        }
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Green Shell",
      "displayName": "Green Shell",
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "LifeDrainEnemy"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "LifeDrain"
          }
        },
        {
          "type": 43,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "SoulDrain"
          }
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
          "target": {
            "kind": "skill",
            "id": "LifeDrainEnemy"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Guardblade",
      "displayName": "Guardblade",
      "weight": 30,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ForceShot"
          }
        },
        {
          "type": 106,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "ForceShot"
          }
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
        },
        {
          "type": 108,
          "value": -20,
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
        },
        {
          "type": 124,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Hellfire Staff",
      "displayName": "Hellfire Staff",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Fireball"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "Firewall"
          }
        },
        {
          "type": 123,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Fireball"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Fireball"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Firewall"
          }
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
          "target": {
            "kind": "skill",
            "id": "Fireball"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Firewall"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Hellhorn Hood",
      "displayName": "Hellhorn Hood",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Holy Shield",
      "displayName": "Holy Crest",
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Holy Staff",
      "displayName": "Holy Staff",
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Exorcism"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "Exorcism"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "NPC_WideCurse"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Horned Crusader Helm",
      "displayName": "Horned Crusader Helm",
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "SpearSlice"
          }
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "AxeArc"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "AxeArc"
          }
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
      "weight": 50,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "status",
            "id": "Bleeding"
          }
        }
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 30,
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
      "displayName": "Breaking Advance",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight_2",
      "displayName": "Sweeping Order",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight_3",
      "displayName": "Lightning Stance",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight_4",
      "displayName": "Rescuing Throw",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight_5",
      "displayName": "Iron Response",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight_6",
      "displayName": "Vanguard Doctrine",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Knight's Glory",
      "displayName": "Royal Blade",
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        },
        {
          "type": 108,
          "value": 20,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Sanctuary"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "HighHeal"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "HighHeal"
          }
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Smite"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "Smite"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Smite"
          }
        },
        {
          "type": 145,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Smite"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "HolyWrath"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "HolyWrath"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "HolyWrathField"
          }
        },
        {
          "type": 145,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "HolyWrath"
          }
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
      "weight": 30,
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
      "weight": 50,
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
      "weight": 50,
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
      "displayName": "Elementalist",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Mage_2",
      "displayName": "Spellshot",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Mage_3",
      "displayName": "Blink Step",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Mage_4",
      "displayName": "Ley Pulse",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Mage_5",
      "displayName": "Frostglass",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Mage_6",
      "displayName": "Combustion",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "MageChest",
      "displayName": "Spellthread Chest",
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 50,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 50,
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
      "weight": 30,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "FirePillar"
          }
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
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "FirePillar"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mindweave",
      "displayName": "Mindweave",
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "SpellShield"
          }
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "SpellShield"
          }
        }
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Moonshadow Hat",
      "displayName": "Moonshadow Hat",
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "HighHeal"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "HighHeal"
          }
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 56,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "SummonSkeleton"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "SummonSkeletonMage"
          }
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Neko Hood",
      "displayName": "Neko Hood",
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "StrafingVolley"
          }
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Obsidian Loop",
      "displayName": "Obsidian Loop",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
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
      "weight": 20,
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
      "displayName": "Resolute Pose",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Paladin_2",
      "displayName": "Crushing Advance",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Paladin_3",
      "displayName": "Sacred Bastion",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Paladin_4",
      "displayName": "Divine Retribution",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Parrying Knife",
      "displayName": "Parrying Knife",
      "weight": 30,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ShadowSeal"
          }
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
        }
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
      "weight": 30,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "HydroVortex"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ShadowRelease"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "displayName": "Veil of the Exorcist",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_2",
      "displayName": "Martyr's Oath",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_3",
      "displayName": "Exorcist's Brand",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_4",
      "displayName": "Eclipsing Aegis",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_5",
      "displayName": "Overflowing Grace",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_6",
      "displayName": "Resurrection Pact",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_7",
      "displayName": "Purity",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Priest_8",
      "displayName": "Sanctuary Doctrine",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Pumpkin Head",
      "displayName": "Jack-o'-lantern",
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "DeathCoilEnemy"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Quillcap",
      "displayName": "Quillcap",
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 46,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 46,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 46,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
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
      "weight": 50,
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
          "target": {
            "kind": "status",
            "id": "Rage"
          }
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "LimitBreak"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ShurikenFan"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "ShurikenFan"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "FanOfKnives"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "FanOfKnives"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShurikenFan"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "FanOfKnives"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Reaper Scythe",
      "displayName": "Grim Scythe",
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "DeathSpiral"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "DeathSpiral"
          }
        },
        {
          "type": 49,
          "value": 25,
          "target": {
            "kind": "skill",
            "id": "Harvest"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "Harvest"
          }
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "BleedCoating"
          }
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
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
      "weight": 20,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Cure"
          }
        }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
        }
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Damnation"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Endure"
          }
        }
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "SpearThrust"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "SpearThrust"
          }
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 30,
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
      "displayName": "Silent Circle",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Rogue_2",
      "displayName": "Shadow Trail",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Rogue_3",
      "displayName": "Venom Bloom",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Rogue_4",
      "displayName": "Shadow Dance",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Rogue_5",
      "displayName": "Hidden Strikes",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Round Glasses",
      "displayName": "Round Glasses",
      "weight": 10,
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
      "weight": 50,
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "SpearStab"
          }
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
          "target": {
            "kind": "skill",
            "id": "SpearStab"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Runeborn Visor",
      "displayName": "Runeborn Visor",
      "weight": 10,
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
      "weight": 50,
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
      "weight": 30,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "FieldCurse"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "FieldSilence"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "FieldCurse"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "FieldSilence"
          }
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "status",
            "id": "Silence"
          }
        }
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "Sanctuary"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "Sanctuary"
          }
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Consecration"
          }
        }
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Cure"
          }
        }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
        }
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Damnation"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "StatusRecovery"
          }
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "StatusRecovery"
          }
        }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Endure"
          }
        }
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
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
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Scholar Glasses",
      "displayName": "Scholar Glasses",
      "weight": 10,
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
      "weight": 20,
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
      "displayName": "Chain Reaction",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Scout_2",
      "displayName": "Hunting Ground",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Scout_3",
      "displayName": "Skirmisher's Flow",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Scout_4",
      "displayName": "Suppressing Shot",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Scout_5",
      "displayName": "Eagle Eye",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Scrapfang",
      "displayName": "Scrapfang",
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
      "effects": [
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "BladeDance"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "BladeDance"
          }
        }
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
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Shady Specs",
      "displayName": "Shady Specs",
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "displayName": "Silent Execution",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Shinobi_2",
      "displayName": "Sealed Fate",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Shinobi_3",
      "displayName": "Honed Technique",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Shinobi_4",
      "displayName": "Phantom Manuscript",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Shotgun",
      "displayName": "Shotgun",
      "weight": 10,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Whirlwind"
          }
        },
        {
          "type": 105,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "Whirlwind"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "Whirlwind"
          }
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
          "target": {
            "kind": "skill",
            "id": "Whirlwind"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sky Raider Hat",
      "displayName": "Sky Raider Hat",
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ThunderStorm"
          }
        },
        {
          "type": 145,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "ThunderStorm"
          }
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
          "target": {
            "kind": "skill",
            "id": "ThunderStorm"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Skywing Mask",
      "displayName": "Skywing Mask",
      "weight": 20,
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "SniperShot"
          }
        },
        {
          "type": 145,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "SniperShot"
          }
        },
        {
          "type": 162,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "SniperShot"
          }
        },
        {
          "type": 104,
          "value": -6,
          "target": {
            "kind": "skill",
            "id": "SniperShot"
          }
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        },
        {
          "type": 39,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        }
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 30,
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
      "weight": 20,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "CorpseExplosionEnemy"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "CorpseExplosion"
          }
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
          "target": {
            "kind": "skill",
            "id": "CorpseExplosionEnemy"
          }
        },
        {
          "type": 107,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "CorpseExplosionEnemy"
          }
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "NPC_Stun"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Spiked Familiar",
      "displayName": "Spiked Familiar",
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "CorpseBarrier"
          }
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
      "weight": 50,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "BladeDance"
          }
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Counter"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ArrowShower"
          }
        },
        {
          "type": 104,
          "value": -2,
          "target": {
            "kind": "skill",
            "id": "ArrowShower"
          }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Stormcaller Totem",
      "displayName": "Stormcaller Totem",
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "LightningRelease"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "LightningStrike"
          }
        },
        {
          "type": 104,
          "value": -1,
          "target": {
            "kind": "skill",
            "id": "LightningStrike"
          }
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
          "target": {
            "kind": "skill",
            "id": "LightningRelease"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "LightningStrike"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stormpiercer",
      "displayName": "Stormpiercer",
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "WeaponThrow"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "WeaponThrow"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "WeaponThrow"
          }
        },
        {
          "type": 110,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "WeaponThrow"
          }
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "displayName": "Alpha Surge",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Summoner_2",
      "displayName": "Hexwell Current",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Summoner_3",
      "displayName": "Banishment Well",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Summoner_4",
      "displayName": "Resonant Wind",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Summoner_5",
      "displayName": "Blessed Resonance",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Summoner_6",
      "displayName": "Soul Chains",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Sun Disc",
      "displayName": "Sun Disc",
      "weight": 10,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Sun Emblem Helm",
      "displayName": "Sun Emblem Helm",
      "weight": 20,
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
      "weight": 50,
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
      "weight": 10,
      "effects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Barrier"
          }
        },
        {
          "type": 106,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Barrier"
          }
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
      "weight": 30,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        },
        {
          "type": 56,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sunflower Clip",
      "displayName": "Sunflower Clip",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "NPC_Poison"
          }
        }
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
          "target": {
            "kind": "skill",
            "id": "NPC_Poison"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Swift Fang",
      "displayName": "Serpent Fang",
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "VenomCoating"
          }
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
      "weight": 30,
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
      "weight": 10,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        },
        {
          "type": 49,
          "value": 10,
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
        },
        {
          "type": 49,
          "value": 10,
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
        },
        {
          "type": 49,
          "value": 10,
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
        }
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
      "weight": 30,
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
          "target": {
            "kind": "skill",
            "id": "Tempest"
          }
        },
        {
          "type": 104,
          "value": -3,
          "target": {
            "kind": "skill",
            "id": "Tempest"
          }
        },
        {
          "type": 49,
          "value": 15,
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
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
          "target": {
            "kind": "skill",
            "id": "Tempest"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Thief Mask",
      "displayName": "Thief Mask",
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "SuppressiveShot"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Tiger Hat",
      "displayName": "Tiger Hat",
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
          "target": {
            "kind": "status",
            "id": "Blind"
          }
        },
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Burning"
          }
        }
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
      "weight": 10,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "AxeThrow"
          }
        },
        {
          "type": 40,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "AxeThrow"
          }
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
          "target": {
            "kind": "skill",
            "id": "AxeThrow"
          }
        }
      ],
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Tome of Ages",
      "displayName": "Tome of Ages",
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ShoutMight"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ShoutFury"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ShoutBlood"
          }
        },
        {
          "type": 43,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ShoutStun"
          }
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 50,
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "PanicBurst"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "PanicBurst"
          }
        },
        {
          "type": 108,
          "value": 20,
          "target": {
            "kind": "skill",
            "id": "PanicBurst"
          }
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
          "target": {
            "kind": "skill",
            "id": "PanicBurst"
          }
        }
      ],
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "TurtleShell",
      "displayName": "Turtle Shell",
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Valor Helm",
      "displayName": "Valor Helm",
      "weight": 20,
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
      "weight": 10,
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
          "target": {
            "kind": "status",
            "id": "Poison"
          }
        },
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Silence"
          }
        }
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
      "weight": 10,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
        }
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
        },
        {
          "type": 106,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
        },
        {
          "type": 108,
          "value": -20,
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
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
      "weight": 10,
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
      "weight": 10,
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
      "weight": 50,
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
      "displayName": "Bloodtrail",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Warrior_2",
      "displayName": "Breakjaw",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Warrior_3",
      "displayName": "Warmaw",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Warrior_4",
      "displayName": "Bloodprice",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Warrior_5",
      "displayName": "Warpath",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wasteland Cleaver",
      "displayName": "Wasteland Cleaver",
      "weight": 50,
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
          "target": {
            "kind": "skill",
            "id": "AxeVortex"
          }
        },
        {
          "type": 104,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "AxeVortex"
          }
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
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Weaver Gauntlets",
      "displayName": "Weaver Gauntlets",
      "weight": 10,
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
      "displayName": "Weave of Counter",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Weaver_2",
      "displayName": "Weave of Guardian",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Weaver_3",
      "displayName": "Weave of Arcana",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Weaver_4",
      "displayName": "Weave of Fury",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Weaver_5",
      "displayName": "Weave of Marksman",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "WeaverChest",
      "displayName": "Weaver Chest",
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
      "effects": [
        {
          "type": 46,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 53,
          "value": 5,
          "target": {
            "kind": "element",
            "id": "Water"
          }
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
      "weight": 10,
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
          "target": {
            "kind": "skill",
            "id": "VenomCoating"
          }
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
      "weight": 20,
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Wilderness Pack",
      "displayName": "Wilderness Pack",
      "weight": 10,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 50,
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 2,
      "id": "Windcarver",
      "displayName": "Windcarver",
      "weight": 30,
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
      "weight": 30,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 20,
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
      "weight": 10,
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
      "weight": 30,
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
      "weight": 20,
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
      "displayName": "Jupiter's Wrath",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_2",
      "displayName": "Voltaic Overdraw",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_3",
      "displayName": "Eye of the Storm",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_4",
      "displayName": "Stonewake",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_5",
      "displayName": "Focused Amplification",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_6",
      "displayName": "Mana Surge",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizard_7",
      "displayName": "Arcane Barrier",
      "weight": 10
    },
    {
      "itemType": 2,
      "id": "Wizardry Hat",
      "displayName": "Wizardry Hat",
      "weight": 20,
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
      "weight": 10,
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
      "weight": 50,
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
      "weight": 20,
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
      "weight": 30,
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
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ],
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Zephyrlight",
      "displayName": "Zephyrlight",
      "weight": 30,
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ],
      "substatGroup": "Magic"
    }
  ] as const satisfies readonly FishNetEquipmentItemDefinition[];
}
