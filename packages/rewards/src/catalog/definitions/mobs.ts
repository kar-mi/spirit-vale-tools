import type { MobRewardSourceDefinition } from "./types.ts";

export class MobDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "id": "Abomination",
      "displayName": "Abomination",
      "level": 60,
      "boss": false,
      "baseExperience": 8700,
      "baseCoins": 180,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Scrapfang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Digger's Flask",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Royal Fang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Zombie Goblin King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShrapnelShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Monster Bat",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Abomination",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus Baby Orange",
      "displayName": "Amber Squid",
      "level": 102,
      "boss": false,
      "baseExperience": 23358,
      "baseCoins": 306,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FanOfKnives Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Octopus Baby Orange",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus Baby Blue",
      "displayName": "Azure Squid",
      "level": 102,
      "boss": false,
      "baseExperience": 23358,
      "baseCoins": 306,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Octopus Baby Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Nozzle Robot",
      "displayName": "Nozzle Robot",
      "level": 127,
      "boss": false,
      "baseExperience": 35433,
      "baseCoins": 381,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Meteor Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Nozzle Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Nozzle Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Nose Robot",
      "displayName": "Nose Robot",
      "level": 128,
      "boss": false,
      "baseExperience": 35968,
      "baseCoins": 384,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SniperShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Nozzle Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Nose Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareWizardBoss",
      "displayName": "Echo Wizard",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Destruction Staff",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmareWizard",
      "displayName": "Umbral Wizard",
      "level": 147,
      "boss": false,
      "baseExperience": 46893,
      "baseCoins": 441,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Destruction Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareWizard",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareWarrior",
      "displayName": "Umbral Warrior",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareWarrior",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus Baby Purple",
      "displayName": "Plum Squid",
      "level": 103,
      "boss": false,
      "baseExperience": 23793,
      "baseCoins": 309,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Octopus Baby Purple",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareSummoner",
      "displayName": "Umbral Summoner",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareSummoner",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareShinobi",
      "displayName": "Umbral Shinobi",
      "level": 149,
      "boss": false,
      "baseExperience": 48127,
      "baseCoins": 447,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Razor Edge",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Solaris Blade",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareShinobi",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareScout",
      "displayName": "Umbral Scout",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareScout",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareRogue",
      "displayName": "Umbral Rogue",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareRogue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmarePriestBoss",
      "displayName": "Echo Priest",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Exorcist Bible",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmarePriest",
      "displayName": "Umbral Priest",
      "level": 146,
      "boss": false,
      "baseExperience": 46282,
      "baseCoins": 438,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Exorcist Bible",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmarePriest",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmarePaladinBoss",
      "displayName": "Echo Paladin",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Dragonic Spear",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmareShinobiBoss",
      "displayName": "Echo Shinobi",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Razor Edge",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Solaris Blade",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Octopus King Blue",
      "displayName": "Azure Octopus",
      "level": 132,
      "boss": false,
      "baseExperience": 38148,
      "baseCoins": 396,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Yellow",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Blue Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Blue",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShurikenFan Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Octopus King Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus King Orange",
      "displayName": "Amber Octopus",
      "level": 133,
      "boss": false,
      "baseExperience": 38703,
      "baseCoins": 399,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Purple",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Green Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Blue",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "TetraVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Octopus King Orange",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus King Purple",
      "displayName": "Violet Octopus",
      "level": 133,
      "boss": false,
      "baseExperience": 38703,
      "baseCoins": 399,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Yellow",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Red Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Shuriken",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "JudgementBlade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Octopus King Purple",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Rat Grey",
      "displayName": "Plague Rat",
      "level": 18,
      "boss": false,
      "baseExperience": 1098,
      "baseCoins": 54,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Verdant Striders",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Buckler",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Bloom Pendant",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bonefang",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Pipe",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "EarthSpikes Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rat Grey",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Rat Grey",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Rat Dark",
      "displayName": "Sewer Rat",
      "level": 16,
      "boss": false,
      "baseExperience": 912,
      "baseCoins": 48,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Stoneguard",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Bonefang",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Adventurer's Kit",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Pistol",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Pipe",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Earthbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rat Grey",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Rat Dark",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Rabbit",
      "displayName": "Rabbit",
      "level": 25,
      "boss": false,
      "baseExperience": 1875,
      "baseCoins": 75,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bunny Cap",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sonic Shoes",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Oak Bow",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Bunny Backpack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Radiant Dagger",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Fur",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Hare",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Earthbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rabbit",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Movespeed",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Rabbit",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Queen Worm",
      "displayName": "Broodmother",
      "level": 75,
      "boss": true,
      "baseExperience": 13125,
      "baseCoins": 225,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Void Urn",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardLegs",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Bone Channeler",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardFeet",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 15
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "MpMult Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_QueenWorm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Queen Worm",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Posy",
      "displayName": "Sea Blossom",
      "level": 31,
      "boss": false,
      "baseExperience": 2697,
      "baseCoins": 93,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Flora",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Relic Trident",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Whale Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Glimmerthorn",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SpearThrust Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flora",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Posy",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Pollen",
      "displayName": "Pollen",
      "level": 1,
      "boss": false,
      "baseExperience": 27,
      "baseCoins": 3,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceChest",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Knife",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Potions",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Sword",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Pollen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 10
        },
        {
          "category": "card",
          "itemId": "Pollen",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Poison Bomb",
      "displayName": "Miasma",
      "level": 87,
      "boss": false,
      "baseExperience": 17313,
      "baseCoins": 261,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Elixir Gourd",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Nightfang Stud",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Shadow Shield",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "LightningStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bomb",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Poison Bomb",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Plant Worm",
      "displayName": "Vinecrawler",
      "level": 70,
      "boss": false,
      "baseExperience": 11550,
      "baseCoins": 210,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bone Channeler",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PanicBurst Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Plant Shooter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Plant Worm",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Plant Shooter",
      "displayName": "Spitter",
      "level": 38,
      "boss": false,
      "baseExperience": 3838,
      "baseCoins": 114,
      "drops": [
        {
          "category": "equipment",
          "itemId": "GravemarrowChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Scalpel",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Wind Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "VenomStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Plant Shooter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Plant Shooter",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Plant Monster",
      "displayName": "Snapvine",
      "level": 67,
      "boss": false,
      "baseExperience": 10653,
      "baseCoins": 201,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bone Channeler",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PanicBurst Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Plant Shooter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Plant Monster",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Plant Chewer",
      "displayName": "Man-Eater",
      "level": 34,
      "boss": false,
      "baseExperience": 3162,
      "baseCoins": 102,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Parrying Knife",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Crown of Spikes",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Combat Knife",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Tree Sap",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cactus Boss",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "CounterSlash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Pollen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Def",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Plant Chewer",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Phantom",
      "displayName": "Phantom",
      "level": 83,
      "boss": false,
      "baseExperience": 15853,
      "baseCoins": 249,
      "drops": [
        {
          "category": "equipment",
          "itemId": "KnightFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Sanctum Guard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Iron Halo",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Holy Staff",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Angel Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HolyWrath Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Ghost",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cost",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Phantom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Petal",
      "displayName": "Nautilus",
      "level": 35,
      "boss": false,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Flora",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Mana Potion",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Heartloop Earring",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Water Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SpearThrust Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flora",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Petal",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Octopus White",
      "displayName": "Pearl Cuttlefish",
      "level": 104,
      "boss": false,
      "baseExperience": 24232,
      "baseCoins": 312,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Octopus Purple",
      "displayName": "Violet Cuttlefish",
      "level": 104,
      "boss": false,
      "baseExperience": 24232,
      "baseCoins": 312,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FanOfKnives Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Octopus Orange",
      "displayName": "Amber Cuttlefish",
      "level": 104,
      "boss": false,
      "baseExperience": 24232,
      "baseCoins": 312,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "NightmarePaladin",
      "displayName": "Umbral Paladin",
      "level": 150,
      "boss": false,
      "baseExperience": 48750,
      "baseCoins": 450,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Dragonic Spear",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmarePaladin",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Rat White",
      "displayName": "Albino Rat",
      "level": 20,
      "boss": false,
      "baseExperience": 1300,
      "baseCoins": 60,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Stoneguard",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Pistol",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Adventurer's Kit",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Buckler",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Pipe",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Earthbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rat Grey",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Rat White",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareNecromancerBoss",
      "displayName": "Echo Necromancer",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Suncrest Mace",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmareMage",
      "displayName": "Umbral Mage",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareMage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mini Ice Bear B",
      "displayName": "Festive Baby",
      "level": 132,
      "boss": false,
      "baseExperience": 38148,
      "baseCoins": 396,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ReindeerChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "TwistOfFate Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Mini Ice Bear B",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mini Ice Bear A",
      "displayName": "Ice Baby",
      "level": 132,
      "boss": false,
      "baseExperience": 38148,
      "baseCoins": 396,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SantaLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SantaFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FrostBlade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Mini Ice Bear A",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mimic Treasure Chest",
      "displayName": "Chest Mimic",
      "level": 110,
      "boss": false,
      "baseExperience": 26950,
      "baseCoins": 330,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Necronomicon",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Holy Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "LifeDrain Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Treasure Chest",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Mimic Treasure Chest",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mimic Sword",
      "displayName": "Sword Mimic",
      "level": 114,
      "boss": false,
      "baseExperience": 28842,
      "baseCoins": 342,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Consecration Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Sword",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Mimic Sword",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mimic Living Trap",
      "displayName": "Trap Mimic",
      "level": 106,
      "boss": false,
      "baseExperience": 25122,
      "baseCoins": 318,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "LifeDrain Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Living Trap",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Mimic Living Trap",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mimic Candle",
      "displayName": "Candle Mimic",
      "level": 109,
      "boss": false,
      "baseExperience": 26487,
      "baseCoins": 327,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DivinePunishment Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Candle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Mimic Candle",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mimic Book",
      "displayName": "Book Mimic",
      "level": 121,
      "boss": false,
      "baseExperience": 32307,
      "baseCoins": 363,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "DeathCoil Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Book",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Mimic Book",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mini Ice Cube A",
      "displayName": "Ice Cube",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Mimic Barrel",
      "displayName": "Barrel Mimic",
      "level": 107,
      "boss": false,
      "baseExperience": 25573,
      "baseCoins": 321,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Necronomicon",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Holy Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Damnation Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mimic Barrel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Mimic Barrel",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mega Ice Golem",
      "displayName": "Ice Titan",
      "level": 140,
      "boss": true,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ArcaneFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Everfrost Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SantaGloves",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SantaChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SantaLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SantaFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ReindeerChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ReindeerLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ReindeerFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ArcaneChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ArcaneLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Crusader Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ReindeerGloves",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "ArcaneGloves",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Frostfang",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "CritDef Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "WeightLimit Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_IceGolem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Mega Ice Golem",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Lurker",
      "displayName": "Lurker",
      "level": 43,
      "boss": false,
      "baseExperience": 4773,
      "baseCoins": 129,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ThiefLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Swift Fang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dualblade Sheath",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "ThiefFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "GroundSlam Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Lurker",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Lurker",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Love Heart",
      "displayName": "Cupid",
      "level": 136,
      "boss": false,
      "baseExperience": 40392,
      "baseCoins": 408,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Jellyfish Robot",
      "displayName": "Stormjelly",
      "level": 91,
      "boss": false,
      "baseExperience": 18837,
      "baseCoins": 273,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bloodbound",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Binding Spirits Staff",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Moonweave Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Blunderbuss",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Reap Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Jellyfish Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Jellyfish Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Imp Mischief",
      "displayName": "Gremlin",
      "level": 96,
      "boss": false,
      "baseExperience": 20832,
      "baseCoins": 288,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Chaos Reaver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Onyx Bolt",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fire Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ExplosiveGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Imp Mischief",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Imp Mischief",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Imp Devil",
      "displayName": "Demon Lord",
      "level": 105,
      "boss": true,
      "baseExperience": 24675,
      "baseCoins": 315,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Sunflare",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Heart Vessel",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderLegs",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Chaos Reaver",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Onyx Bolt",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Fire Shield",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Sunbound Mitts",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderFeet",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Meteoric Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "CastSpd Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "NoCastCancel Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_ImpDevil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Imp Mischief",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Imp Devil",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Imp Demon",
      "displayName": "Imp",
      "level": 97,
      "boss": false,
      "baseExperience": 21243,
      "baseCoins": 291,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Fire Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Onyx Bolt",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sunbound Mitts",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ExplosiveGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Imp Mischief",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Imp Demon",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Metal Robot",
      "displayName": "Metal Robot",
      "level": 144,
      "boss": false,
      "baseExperience": 45072,
      "baseCoins": 432,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Mini Ice Cube B",
      "displayName": "Shadow Cube",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Mole Rat",
      "displayName": "Mole",
      "level": 32,
      "boss": false,
      "baseExperience": 2848,
      "baseCoins": 96,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Burrow",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Embershard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sun Lion Crest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Gold Ore",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Scorpion King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "StrafingVolley Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Burrow",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Mole Rat",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mole Rat King",
      "displayName": "Dire Mole",
      "level": 35,
      "boss": false,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Burrow",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Hellfire Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Festival Rockets",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Gold Ore",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Scorpion King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "StrafingVolley Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Burrow",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Mole Rat King",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareKnight",
      "displayName": "Umbral Knight",
      "level": 140,
      "boss": false,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareKnight",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareGunslingerBoss",
      "displayName": "Echo Gunslinger",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Artemis",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmareGunslinger",
      "displayName": "Umbral Gunslinger",
      "level": 147,
      "boss": false,
      "baseExperience": 46893,
      "baseCoins": 441,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Artemis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareGunslinger",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareBerserkerBoss",
      "displayName": "Echo Berserker",
      "level": 155,
      "boss": true,
      "baseExperience": 51925,
      "baseCoins": 465,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Blacksteel Blade",
          "count": 1,
          "chance": 30
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "NightmareBerserker",
      "displayName": "Umbral Berserker",
      "level": 148,
      "boss": false,
      "baseExperience": 47508,
      "baseCoins": 444,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Blacksteel Blade",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareBerserker",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareAcolyte",
      "displayName": "Umbral Acolyte",
      "level": 136,
      "boss": false,
      "baseExperience": 40392,
      "baseCoins": 408,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareAcolyte",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Nightmare",
      "displayName": "Apparition",
      "level": 122,
      "boss": false,
      "baseExperience": 32818,
      "baseCoins": 366,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Necronomicon",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Eclipse Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "DeathSpiral Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Death",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Nightmare",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Nexus Robot",
      "displayName": "Nexus Robot",
      "level": 142,
      "boss": false,
      "baseExperience": 43878,
      "baseCoins": 426,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Mushroom",
      "displayName": "Shroom",
      "level": 26,
      "boss": false,
      "baseExperience": 2002,
      "baseCoins": 78,
      "drops": [
        {
          "category": "equipment",
          "itemId": "IslandChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Windcarver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dino Cub Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Windroot",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SpearThrust Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Moth Moon",
      "displayName": "Moon Moth",
      "level": 34,
      "boss": false,
      "baseExperience": 3162,
      "baseCoins": 102,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Willow Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Cloud Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Verdant Core",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldHealing Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Moth Moon",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Moth Moon",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Moth Luna",
      "displayName": "Luna Moth",
      "level": 32,
      "boss": false,
      "baseExperience": 2848,
      "baseCoins": 96,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Verdant Core",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Cloud Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sun Emblem",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldSilence Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Moth Moon",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Moth Luna",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Moth Celestial",
      "displayName": "Celestial Moth",
      "level": 35,
      "boss": false,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Verdant Core",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sun Emblem",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldHealing Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Moth Moon",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Moth Celestial",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mosquito Stinger",
      "displayName": "Bloodsucker",
      "level": 69,
      "boss": false,
      "baseExperience": 11247,
      "baseCoins": 207,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "JumpShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mosquito Pester",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Mosquito Stinger",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mosquito Pester",
      "displayName": "Mosquito",
      "level": 40,
      "boss": false,
      "baseExperience": 4200,
      "baseCoins": 120,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Abyss Shard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Piercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShadowStep Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mosquito Pester",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Mosquito Pester",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Mosquito Bug",
      "displayName": "Gnat",
      "level": 37,
      "boss": false,
      "baseExperience": 3663,
      "baseCoins": 111,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Abyss Shard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Piercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "GunkShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mosquito Pester",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Mosquito Bug",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Monster Bat King",
      "displayName": "Nightlord",
      "level": 56,
      "boss": false,
      "baseExperience": 7672,
      "baseCoins": 168,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Scrapfang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Digger's Flask",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Royal Fang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Zombie Goblin King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldCurse Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Monster Bat",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Monster Bat King",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Monster Bat",
      "displayName": "Nightwing",
      "level": 51,
      "boss": false,
      "baseExperience": 6477,
      "baseCoins": 153,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Doom Crescent",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Digger's Flask",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Iron Morningstar",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "FieldCurse Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Monster Bat",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Monster Bat",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "NightmareNecromancer",
      "displayName": "Umbral Necromancer",
      "level": 149,
      "boss": false,
      "baseExperience": 48127,
      "baseCoins": 447,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Suncrest Mace",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "NightmareNecromancer",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Razor Robot",
      "displayName": "Razor Robot",
      "level": 126,
      "boss": false,
      "baseExperience": 34902,
      "baseCoins": 378,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Meteor Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Razor Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Razor Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Scorpion",
      "displayName": "Scorpion",
      "level": 33,
      "boss": false,
      "baseExperience": 3003,
      "baseCoins": 99,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Hellfire Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Festival Rockets",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Solar Spear",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Gold Ore",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Scorpion King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FireRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Scorpling",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Scorpion",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Scorpion King",
      "displayName": "Scorpion King",
      "level": 40,
      "boss": true,
      "baseExperience": 4200,
      "baseCoins": 120,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Solar Spear",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Loop",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Embershard",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Sun Lion Crest",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Hellfire Staff",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Festival Rockets",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fire Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "Hit Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_ScorpionKing",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Scorpling",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Scorpion King",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Turtle King",
      "displayName": "Turtle Champion",
      "level": 140,
      "boss": true,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Int",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Leg_Vit",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Leg_Agi",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Leg_Luk",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Leg_Dex",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Leg_Str",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Plasma Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Blue",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Red Shell",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Yellow",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Shuriken",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Purple",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Yellow",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Blue",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Blue Shell",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Green Shell",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "PlasmaLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "PlasmaFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Purple",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Matk Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "StatusResist Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_TurtleChampion",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Turtle King",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Turtle",
      "displayName": "Turtle Baby",
      "level": 61,
      "boss": false,
      "baseExperience": 8967,
      "baseCoins": 183,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Flintlock Pistol",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Quiver",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Hawkeye Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BladeDance Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Trooper Robot",
      "displayName": "Trooper Robot",
      "level": 145,
      "boss": false,
      "baseExperience": 45675,
      "baseCoins": 435,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Treant Tree Evergreen",
      "displayName": "Pine Treant",
      "level": 18,
      "boss": false,
      "baseExperience": 1098,
      "baseCoins": 54,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Witchsteps",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Leaf Mask",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Backpack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fireball Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Tree Evergreen",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Treant Tree Autumn",
      "displayName": "Maple Treant",
      "level": 17,
      "boss": false,
      "baseExperience": 1003,
      "baseCoins": 51,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Runecall",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex First Hymn",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Bloom Ring",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "War Axe",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Tree Autumn",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Treant Minion Evergreen",
      "displayName": "Pine Sapling",
      "level": 17,
      "boss": false,
      "baseExperience": 1003,
      "baseCoins": 51,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Witchsteps",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Backpack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Amber Bow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fireball Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Treant Minion Autumn",
      "displayName": "Maple Sapling",
      "level": 16,
      "boss": false,
      "baseExperience": 912,
      "baseCoins": 48,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Runecall",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex First Hymn",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Leaf Mask",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "War Axe",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Minion Autumn",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Turtle Monster Blue",
      "displayName": "Azure Terrapin",
      "level": 63,
      "boss": false,
      "baseExperience": 9513,
      "baseCoins": 189,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Flintlock Pistol",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "PirateGloves",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Hawkeye Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Turtle Monster Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Treant Forest Evergreen",
      "displayName": "Pine Ancient",
      "level": 19,
      "boss": false,
      "baseExperience": 1197,
      "baseCoins": 57,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Witchsteps",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "War Axe",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Leaf Mask",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fireball Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Forest Evergreen",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Toadstool",
      "displayName": "Toadstool",
      "level": 30,
      "boss": false,
      "baseExperience": 2550,
      "baseCoins": 90,
      "drops": [
        {
          "category": "equipment",
          "itemId": "IslandFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Windcarver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dino Cub Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Windroot",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AerialShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Toadstool",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Titan Turtle Sci Pink",
      "displayName": "Storm Turtle",
      "level": 135,
      "boss": false,
      "baseExperience": 39825,
      "baseCoins": 405,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Blue",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Green Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Plasma Sword Purple",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "TetraVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Titan Turtle Sci Pink",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Titan Turtle Sci Green",
      "displayName": "Solar Turtle",
      "level": 131,
      "boss": false,
      "baseExperience": 37597,
      "baseCoins": 393,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Shuriken",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Red Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Purple",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "JudgementBlade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Titan Turtle Sci Green",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Titan Turtle Sci Blue",
      "displayName": "Hydro Turtle",
      "level": 134,
      "boss": false,
      "baseExperience": 39262,
      "baseCoins": 402,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Leg_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Leg_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "PlasmaLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Purple",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Blue Shell",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Energy Sword Yellow",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Oceanite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Turtle King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShurikenFan Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Primordial",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Titan Turtle Sci Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Tentacles Robot",
      "displayName": "Stormcoil",
      "level": 127,
      "boss": false,
      "baseExperience": 35433,
      "baseCoins": 381,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Staff of Eternis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Edge of Twilight",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Silence of Night",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Chest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Legs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Feet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Moonstone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Alien Big Blink",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Tempest Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Jellyfish Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Eternis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Tentacles Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Tech Robot",
      "displayName": "Tech Robot",
      "level": 143,
      "boss": false,
      "baseExperience": 44473,
      "baseCoins": 429,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Treant Forest Autumn",
      "displayName": "Maple Ancient",
      "level": 19,
      "boss": false,
      "baseExperience": 1197,
      "baseCoins": 57,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Runecall",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex First Hymn",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Amber Bow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bloom Ring",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Treant Minion Evergreen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Treant Forest Autumn",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Turtle Monster Green",
      "displayName": "Verdant Terrapin",
      "level": 63,
      "boss": false,
      "baseExperience": 9513,
      "baseCoins": 189,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Tomahawk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Quiver",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BladeDance Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Turtle Monster Green",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Turtle Monster Red",
      "displayName": "Crimson Terrapin",
      "level": 64,
      "boss": false,
      "baseExperience": 9792,
      "baseCoins": 192,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Flintlock Pistol",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "TurtleShell",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "PirateGloves",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ArrowShower Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Turtle Monster Red",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Vampire Bat",
      "displayName": "Nosferatu",
      "level": 46,
      "boss": false,
      "baseExperience": 5382,
      "baseCoins": 138,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Bat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Mask",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Mirage Cloak",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Jagtooth",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Emblem",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Knight's Glory",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Bat Lord",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ForceShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bat",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Vampire Bat",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Zombie Goblin King",
      "displayName": "Zombie Orc Lord",
      "level": 65,
      "boss": true,
      "baseExperience": 10075,
      "baseCoins": 195,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Explorer's Pack",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Wraithlight",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Treasure Box",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Gatling Gun",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Scrapfang",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Royal Fang",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Digger's Flask",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DefMult Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Zombie Goblin King",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Zombie Goblin Giant",
      "displayName": "Zombie Orc",
      "level": 58,
      "boss": false,
      "baseExperience": 8178,
      "baseCoins": 174,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wraithlight",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Treasure Box",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Gatling Gun",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Zombie Goblin King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "VolatileBolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Zombie Goblin Giant",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wraith",
      "displayName": "Wraith King",
      "level": 125,
      "boss": true,
      "baseExperience": 34375,
      "baseCoins": 375,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Wraith",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Royal Crest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Undead Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_Wraith",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Wraith",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Worm Stink",
      "displayName": "Grub",
      "level": 87,
      "boss": false,
      "baseExperience": 17313,
      "baseCoins": 261,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Soul Reaper Scythe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Oxygen Tank",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Razor Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Harvest Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Worm Rot",
      "displayName": "Maggot",
      "level": 88,
      "boss": false,
      "baseExperience": 17688,
      "baseCoins": 264,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Elixir Gourd",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Nightfang Stud",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Shadow Shield",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PoisonGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Worm Rot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Worm Creep",
      "displayName": "Devourer",
      "level": 95,
      "boss": true,
      "baseExperience": 20425,
      "baseCoins": 285,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Duskfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grasping Eye Urn",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "StormplateChest",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Soul Reaper Scythe",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Nightfang Stud",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Razor Kunai",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Elixir Gourd",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Shadow Shield",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "StormplateLegs",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "StormplateFeet",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Oxygen Tank",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Poison Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_WormCreep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Worm Creep",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Worm",
      "displayName": "Worm",
      "level": 68,
      "boss": false,
      "baseExperience": 10948,
      "baseCoins": 204,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bone Channeler",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "JumpShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wolf Pup",
      "displayName": "Wolf Cub",
      "level": 26,
      "boss": false,
      "baseExperience": 2002,
      "baseCoins": 78,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Demon Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Eye of Vigil",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Wilderness Pack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Scythe",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Werewolf",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SoulStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wolf Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Wolf Pup",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wolf",
      "displayName": "Wolf",
      "level": 30,
      "boss": false,
      "baseExperience": 2550,
      "baseCoins": 90,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Demon Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Hornbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Blood Clip",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Bone Pick",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Werewolf",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HolyLight Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wolf Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Wolf",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wisp Yellow",
      "displayName": "Earth Wisp",
      "level": 15,
      "boss": false,
      "baseExperience": 825,
      "baseCoins": 45,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ForestChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Kunai",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Ransack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Spirit Ward",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "IceShard Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Wisp Yellow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wisp Red",
      "displayName": "Fire Wisp",
      "level": 14,
      "boss": false,
      "baseExperience": 742,
      "baseCoins": 42,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ForestFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Hunting Knife",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Amber Loop",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Rod",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Icebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wisp Purple",
      "displayName": "Lightning Wisp",
      "level": 12,
      "boss": false,
      "baseExperience": 588,
      "baseCoins": 36,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ForestLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Kunai",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Fang Clip",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Spirit Ward",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "IceShard Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Wisp Purple",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wisp Blue",
      "displayName": "Frost Wisp",
      "level": 11,
      "boss": false,
      "baseExperience": 517,
      "baseCoins": 33,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ForestChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Hunting Knife",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Ransack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Rod",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Icebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Wisp Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wind Mage",
      "displayName": "Wind Mage",
      "level": 30,
      "boss": false,
      "baseExperience": 2550,
      "baseCoins": 90,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Skybreaker Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Foxtail",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cat Bolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Whirlwind",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Wind Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Wind",
      "displayName": "Gale",
      "level": 28,
      "boss": false,
      "baseExperience": 2268,
      "baseCoins": 84,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Skybreaker Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Stormpiercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Foxtail",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cat Bolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Whirlwind",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Wind",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Whirlwind",
      "displayName": "Breeze",
      "level": 26,
      "boss": false,
      "baseExperience": 2002,
      "baseCoins": 78,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Tempest Robes",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Skybreaker Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Stormpiercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Foxtail",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cat Bolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Whirlwind",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Whirlwind",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Werewolf",
      "displayName": "Lycanthrope",
      "level": 35,
      "boss": true,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Demon Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Eye of Vigil",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Scroll Charm",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Scythe",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Hornbrand",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Bone Pick",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Wilderness Pack",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Blood Clip",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "ClericChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "ClericLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Leech Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_Werewolf",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wolf Pup",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Werewolf",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Tanker Robot",
      "displayName": "Tanker Robot",
      "level": 145,
      "boss": false,
      "baseExperience": 45675,
      "baseCoins": 435,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Sunflower Fairy",
      "displayName": "Sylvie",
      "level": 34,
      "boss": false,
      "baseExperience": 3162,
      "baseCoins": 102,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Seedling Satchel",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Sun Emblem",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Heal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Sunflower Fairy",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Sunflower Fairy",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Sunflora Pixie",
      "displayName": "Lady Fey",
      "level": 40,
      "boss": true,
      "baseExperience": 4200,
      "baseCoins": 120,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Seedling Satchel",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Longbow",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Cloud Loop",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Willow Staff",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Verdant Core",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Sun Emblem",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Healing Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_FlowerHat",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Sunflower Fairy",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Sunflora Pixie",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Snake Naga",
      "displayName": "Naga",
      "level": 50,
      "boss": true,
      "baseExperience": 6250,
      "baseCoins": 150,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Totem Mask",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Serpent Ring",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Shadow Dancers",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Swift Fang",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Archer's Beads",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "ThiefChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "ThiefLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "ThiefFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Royal Dagger",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Repeater Crossbow",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Dualblade Sheath",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DoubleAttack Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "Flee Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_SnakeNaga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Snake",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Snake Naga",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Snake",
      "displayName": "Viper",
      "level": 47,
      "boss": false,
      "baseExperience": 5593,
      "baseCoins": 141,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Totem Mask",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ThiefChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Rifle",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Archer's Beads",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Bat Lord",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PiercingShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Snake",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Snake",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Slime Monster",
      "displayName": "Oozelord",
      "level": 70,
      "boss": false,
      "baseExperience": 11550,
      "baseCoins": 210,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "CorpseExplosion Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Slime",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Slime Monster",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Slime Jelly",
      "displayName": "Jellooze",
      "level": 67,
      "boss": false,
      "baseExperience": 10653,
      "baseCoins": 201,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "CorpseExplosion Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Slime",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Slime Jelly",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Slime",
      "displayName": "Slime",
      "level": 38,
      "boss": false,
      "baseExperience": 3838,
      "baseCoins": 114,
      "drops": [
        {
          "category": "equipment",
          "itemId": "GravemarrowLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Abyss Shard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShadowStep Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Slime",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Slime",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Skeleton Mage",
      "displayName": "Skeleton Mage",
      "level": 113,
      "boss": false,
      "baseExperience": 28363,
      "baseCoins": 339,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Skeleton",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Royal Crest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShieldBash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Skeleton Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Skeleton Giant",
      "displayName": "Skeleton Giant",
      "level": 115,
      "boss": false,
      "baseExperience": 29325,
      "baseCoins": 345,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Skeleton",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DarkClaw Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Skeleton Giant",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Skeleton",
      "displayName": "Skeleton",
      "level": 25,
      "boss": false,
      "baseExperience": 1875,
      "baseCoins": 75,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Skeleton",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Witch's Whisk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wilderness Pack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dawnstar",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SoulStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Skeleton",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shell Robot",
      "displayName": "Shell Robot",
      "level": 126,
      "boss": false,
      "baseExperience": 34902,
      "baseCoins": 378,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grim Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PointBlankShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Razor Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Shell Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shell",
      "displayName": "Conch",
      "level": 36,
      "boss": false,
      "baseExperience": 3492,
      "baseCoins": 108,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Lifebloom Shoes",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Chainfrost Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Whale Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Runesmasher",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Hermit King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SpearThrust Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shell",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Shell",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shark Humanoid",
      "displayName": "Shark Buccaneer",
      "level": 65,
      "boss": false,
      "baseExperience": 10075,
      "baseCoins": 195,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Hawkeye Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Quiver",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Tomahawk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Shark Humanoid",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shark Baby",
      "displayName": "Sharkling",
      "level": 62,
      "boss": false,
      "baseExperience": 9238,
      "baseCoins": 186,
      "drops": [
        {
          "category": "equipment",
          "itemId": "PirateLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Tomahawk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "TurtleShell",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Coconut Oil",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ArrowShower Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Turtle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hit",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Shark Baby",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shark",
      "displayName": "Bull Shark",
      "level": 104,
      "boss": false,
      "baseExperience": 24232,
      "baseCoins": 312,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Shark",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shadow",
      "displayName": "Nightfiend",
      "level": 100,
      "boss": false,
      "baseExperience": 22500,
      "baseCoins": 300,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Fire Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sunbound Mitts",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Meteoric Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ExplosiveGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shade",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Shadow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Shade",
      "displayName": "Shade",
      "level": 98,
      "boss": false,
      "baseExperience": 21658,
      "baseCoins": 294,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Onyx Bolt",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Chaos Reaver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FirePillar Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shade",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Shade",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Seed",
      "displayName": "Seedling",
      "level": 5,
      "boss": false,
      "baseExperience": 175,
      "baseCoins": 15,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceChest",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Mace",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Potions",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wooden Guard",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fireball Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Pollen",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 10
        },
        {
          "category": "card",
          "itemId": "Seed",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Scorpling",
      "displayName": "Scorpling",
      "level": 31,
      "boss": false,
      "baseExperience": 2697,
      "baseCoins": 93,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Hellfire Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Festival Rockets",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Solar Spear",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Gold Ore",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Scorpion King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Bash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Scorpling",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Scorpling",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Snakelet",
      "displayName": "Adder",
      "level": 43,
      "boss": false,
      "baseExperience": 4773,
      "baseCoins": 129,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Shadow Dancers",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Royal Dagger",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Repeater Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Stomp Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Snake",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Snakelet",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Icicle",
      "displayName": "Icicle",
      "level": 73,
      "boss": false,
      "baseExperience": 12483,
      "baseCoins": 219,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WeaverChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frost Mark",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Prism",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldDamage Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Icicle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Icicle",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Snout Robot",
      "displayName": "Snout Robot",
      "level": 129,
      "boss": false,
      "baseExperience": 36507,
      "baseCoins": 387,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grim Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SniperShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Nozzle Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Snout Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Soldier Robot",
      "displayName": "Soldier Robot",
      "level": 145,
      "boss": false,
      "baseExperience": 45675,
      "baseCoins": 435,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Sun Blossom",
      "displayName": "Nymph",
      "level": 32,
      "boss": false,
      "baseExperience": 2848,
      "baseCoins": 96,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Longbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Willow Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldHealing Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Sunflower Fairy",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Sun Blossom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Stinger Robot",
      "displayName": "Stormstinger",
      "level": 94,
      "boss": false,
      "baseExperience": 20022,
      "baseCoins": 282,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Voidthreads",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Binding Spirits Staff",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Moonweave Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Mindweave",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Execute Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Jellyfish Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Stinger Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Sting",
      "displayName": "Vespa",
      "level": 15,
      "boss": true,
      "baseExperience": 825,
      "baseCoins": 45,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceFeet",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "Axe",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Potions",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Codex",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Slingshot",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Golden Hoop",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Sunflower Clip",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "NoviceChest",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "NoviceLegs",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "Broad Sword",
          "count": 1,
          "chance": 20
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AtkSpd Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bee",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Sting",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Squid Baby",
      "displayName": "Squidling",
      "level": 102,
      "boss": false,
      "baseExperience": 23358,
      "baseCoins": 306,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Squid Baby",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Squid Baby",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Sprout",
      "displayName": "Sprout",
      "level": 9,
      "boss": false,
      "baseExperience": 387,
      "baseCoins": 27,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Potions",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Slingshot",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ThunderStorm Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Sprout",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Sprout",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spore",
      "displayName": "Spore",
      "level": 32,
      "boss": false,
      "baseExperience": 2848,
      "baseCoins": 96,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Parrying Knife",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Focus Band",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Combat Knife",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Tree Sap",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cactus Boss",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "WeaponThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spore",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Def",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Spore",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spook",
      "displayName": "Spook",
      "level": 82,
      "boss": false,
      "baseExperience": 15498,
      "baseCoins": 246,
      "drops": [
        {
          "category": "equipment",
          "itemId": "KnightLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Sword",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sanctum Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Revolver",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Angel Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Exorcism Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Ghost",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cost",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Spook",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spike Robot",
      "displayName": "Spike Robot",
      "level": 127,
      "boss": false,
      "baseExperience": 35433,
      "baseCoins": 381,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flameburst Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SniperShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Razor Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Spike Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spike",
      "displayName": "Hermit",
      "level": 40,
      "boss": false,
      "baseExperience": 4200,
      "baseCoins": 120,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Azure Cutlass",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Stormburst Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Heartloop Earring",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Hermit King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SpearSlice Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shell",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Spike",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spiderling Robot",
      "displayName": "Spiderling Robot",
      "level": 128,
      "boss": false,
      "baseExperience": 35968,
      "baseCoins": 384,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grim Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flameburst Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PointBlankShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spiderling Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Spiderling Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spider Toxin",
      "displayName": "Widow",
      "level": 44,
      "boss": false,
      "baseExperience": 4972,
      "baseCoins": 132,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ThiefChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Swift Fang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Archer's Beads",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "ThiefLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SpearStab Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spider Toxin",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Spider Toxin",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spider Robot",
      "displayName": "Spider Robot",
      "level": 128,
      "boss": false,
      "baseExperience": 35968,
      "baseCoins": 384,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grim Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flameburst Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Meteor Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spiderling Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Spider Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spider Queen Robot",
      "displayName": "Suphara",
      "level": 135,
      "boss": true,
      "baseExperience": 39825,
      "baseCoins": 405,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Str",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Glove_Dex",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Glove_Int",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Glove_Vit",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Glove_Agi",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Glove_Luk",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Insect Carapace",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Grim Reaper Scythe",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Flameburst Kunai",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "CritDamage Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "NoKnockback Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_SpiderQueenRobot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spiderling Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Spider Queen Robot",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Spider King",
      "displayName": "Arachne",
      "level": 49,
      "boss": false,
      "baseExperience": 6027,
      "baseCoins": 147,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ThiefLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Jagtooth",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Emblem",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "ThiefFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Bat Lord",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SuppressiveShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spider Toxin",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Spider King",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Spider",
      "displayName": "Spider",
      "level": 42,
      "boss": false,
      "baseExperience": 4578,
      "baseCoins": 126,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ThiefChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Repeater Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Archer's Beads",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "SpearStab Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Spider Toxin",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Spider",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Soul Mage",
      "displayName": "Soul Mage",
      "level": 85,
      "boss": false,
      "baseExperience": 16575,
      "baseCoins": 255,
      "drops": [
        {
          "category": "equipment",
          "itemId": "KnightLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Hammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Iron Halo",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Sword",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Angel Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Exorcism Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Haunt",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cost",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Soul Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Soul",
      "displayName": "Soul",
      "level": 78,
      "boss": false,
      "baseExperience": 14118,
      "baseCoins": 234,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Ghostly Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Dagger",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Mechanical Core",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Spear",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "HighHeal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Haunt",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Soul",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Snow Bomb",
      "displayName": "Snowball",
      "level": 71,
      "boss": false,
      "baseExperience": 11857,
      "baseCoins": 213,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WeaverChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frost Mark",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Tag",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Azure Prism",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldDamage Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bomb",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Snow Bomb",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ice Starflake C",
      "displayName": "Shadow Ice",
      "level": 134,
      "boss": false,
      "baseExperience": 39262,
      "baseCoins": 402,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SantaChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SantaLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "TwistOfFate Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Ice Starflake C",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ice Starflake B",
      "displayName": "Vanilla Ice",
      "level": 133,
      "boss": false,
      "baseExperience": 38703,
      "baseCoins": 399,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ArcaneLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FrostBlade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Ice Starflake B",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ice Starflake A",
      "displayName": "Starflake",
      "level": 133,
      "boss": false,
      "baseExperience": 38703,
      "baseCoins": 399,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ReindeerFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Everfrost Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SantaGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezingField Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Ice Starflake A",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dark Wizard Black",
      "displayName": "Onyx Warlock",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Cyclops Minion",
      "displayName": "Cyclopling",
      "level": 72,
      "boss": false,
      "baseExperience": 12168,
      "baseCoins": 216,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mage Plate",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Crystal Slammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Tag",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostspire Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezeGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cyclops Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Cyclops Minion",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cyclops Giant",
      "displayName": "Cyclops Titan",
      "level": 75,
      "boss": false,
      "baseExperience": 13125,
      "baseCoins": 225,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mage Plate",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frost Mark",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Tag",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Azure Prism",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezeGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cyclops Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Cyclops Giant",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cyclops Bat Wizard",
      "displayName": "Eyeclops Arcanist",
      "level": 113,
      "boss": false,
      "baseExperience": 28363,
      "baseCoins": 339,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DarkClaw Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Cyclops Bat Wizard",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cyclops Bat Mage",
      "displayName": "Eyeclops Mage",
      "level": 123,
      "boss": false,
      "baseExperience": 33333,
      "baseCoins": 369,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Holy Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShadowRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Cyclops Bat Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cyclops Bat",
      "displayName": "Eyeclops Bat",
      "level": 111,
      "boss": false,
      "baseExperience": 27417,
      "baseCoins": 333,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShieldBash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Cyclops Bat",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cyclops",
      "displayName": "Cyclops",
      "level": 73,
      "boss": false,
      "baseExperience": 12483,
      "baseCoins": 219,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mage Plate",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostspire Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Tag",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frost Mark",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezeGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cyclops Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Cyclops",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dark Wizard Purple",
      "displayName": "Violet Warlock",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Crystal Guardian Emerald",
      "displayName": "Emerald Guardian",
      "level": 136,
      "boss": false,
      "baseExperience": 40392,
      "baseCoins": 408,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Crystal Guardian Amethyst",
      "displayName": "Amethyst Guardian",
      "level": 136,
      "boss": false,
      "baseExperience": 40392,
      "baseCoins": 408,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Creeper",
      "displayName": "Crawler",
      "level": 45,
      "boss": false,
      "baseExperience": 5175,
      "baseCoins": 135,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ThiefFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Royal Dagger",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dualblade Sheath",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Repeater Crossbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "GroundSlam Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Lurker",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Creeper",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cobra Venom",
      "displayName": "Cobra",
      "level": 140,
      "boss": false,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Chick",
      "displayName": "Chick",
      "level": 2,
      "boss": false,
      "baseExperience": 58,
      "baseCoins": 6,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceLegs",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Mace",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Golden Hoop",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wooden Guard",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Fireball Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Chick",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 10
        },
        {
          "category": "card",
          "itemId": "Chick",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cat Meow",
      "displayName": "Sparkit",
      "level": 16,
      "boss": false,
      "baseExperience": 912,
      "baseCoins": 48,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ForestChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Hunting Pike",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Ransack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Iron Spear",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Icebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cat Meow",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Cat Meow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cat Lightning",
      "displayName": "Voltpaw",
      "level": 29,
      "boss": false,
      "baseExperience": 2407,
      "baseCoins": 87,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Neko Hood",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Tempest Robes",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Zephyrlight",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Foxtail",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cat Bolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ThunderStorm Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cat Meow",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Cat Lightning",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cat Bolt",
      "displayName": "Raiju",
      "level": 35,
      "boss": true,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Neko Hood",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Tempest Robes",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Stormpiercer",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Zephyrlight",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Skybreaker Staff",
          "count": 1,
          "chance": 15
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Wind Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_CatBolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cat Meow",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Cat Bolt",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Crystal Guardian Aqua",
      "displayName": "Aquamarine Guardian",
      "level": 140,
      "boss": false,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Dark Wizard Red",
      "displayName": "Scarlet Warlock",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Death",
      "displayName": "Wight",
      "level": 112,
      "boss": false,
      "baseExperience": 27888,
      "baseCoins": 336,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Royal Crest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.2
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Consecration Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Death",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Death",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Death Mage",
      "displayName": "Abyss Archon",
      "level": 130,
      "boss": true,
      "baseExperience": 37050,
      "baseCoins": 390,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Darkfeather Wings",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Necronomicon",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Eclipse Kunai",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Holy Shield",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Shadow Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "PerfectCloak Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Face_DeathMage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Death",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Death Mage",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Dragon King Green",
      "displayName": "Fire Wyrm",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Dragon King Blue",
      "displayName": "Frost Wyrm",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Dragon Inferno",
      "displayName": "Inferno Wyvern",
      "level": 99,
      "boss": false,
      "baseExperience": 22077,
      "baseCoins": 297,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Sunflare",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Onyx Bolt",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Chaos Reaver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FirePillar Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Spark",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Dragon Inferno",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Ice",
      "displayName": "Rime Drake",
      "level": 73,
      "boss": false,
      "baseExperience": 12483,
      "baseCoins": 219,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "WeaverFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crystal Slammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "IceRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Water",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Ice",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Fire",
      "displayName": "Flame Drake",
      "level": 98,
      "boss": false,
      "baseExperience": 21658,
      "baseCoins": 294,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Meteoric Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FlameOrb Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Spark",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Dragon Fire",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Dusk",
      "displayName": "Dusk Drake",
      "level": 77,
      "boss": false,
      "baseExperience": 13783,
      "baseCoins": 231,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Katar",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Dawn Prayer",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Scythe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Smite Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Dusk",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Dusk",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Darkness",
      "displayName": "Shadow Wyvern",
      "level": 84,
      "boss": false,
      "baseExperience": 16212,
      "baseCoins": 252,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Wings of Valor",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Codex",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sanctum Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Wand",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Angel Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Sanctuary Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Dusk",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cost",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Darkness",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Bot",
      "displayName": "Dragon Bot",
      "level": 142,
      "boss": false,
      "baseExperience": 43878,
      "baseCoins": 426,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Dragon Blizzard",
      "displayName": "Frost Wyvern",
      "level": 74,
      "boss": false,
      "baseExperience": 12802,
      "baseCoins": 222,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Moonfrost",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Crystal Slammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostspire Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "IceRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Water",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Blizzard",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dog Pup",
      "displayName": "Pup",
      "level": 19,
      "boss": false,
      "baseExperience": 1197,
      "baseCoins": 57,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Pup",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ForestFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Hunting Pike",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Amber Loop",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Iron Spear",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Icebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dog Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Dog Pup",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dog Bowwow",
      "displayName": "Hellhound",
      "level": 34,
      "boss": false,
      "baseExperience": 3162,
      "baseCoins": 102,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Pup",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Embershard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sun Lion Crest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Gold Ore",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Scorpion King",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Bash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dog Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Dog Bowwow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dog Bark",
      "displayName": "Hound",
      "level": 20,
      "boss": false,
      "baseExperience": 1300,
      "baseCoins": 60,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Pup",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ForestChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Guardblade",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Ransack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Iron Bulwark",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "IceShard Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dog Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Dog Bark",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Direwolf",
      "displayName": "Direwolf",
      "level": 120,
      "boss": false,
      "baseExperience": 31800,
      "baseCoins": 360,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Demon Cat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DeathNova Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wolf Pup",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Direwolf",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Delivery Robot",
      "displayName": "Delivery Robot",
      "level": 129,
      "boss": false,
      "baseExperience": 36507,
      "baseCoins": 387,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PointBlankShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Boxy Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Delivery Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cactus Boss",
      "displayName": "Cactus King",
      "level": 40,
      "boss": true,
      "baseExperience": 4200,
      "baseCoins": 120,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Obsidian Edge",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Quiver of Thorns",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Brimblade",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Crown of Spikes",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Parrying Knife",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Combat Knife",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Focus Band",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Knuckleband",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Wasteland Cleaver",
          "count": 1,
          "chance": 15
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ReflectDamage Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_CactusKing",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cactus",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Cactus Boss",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Cactus",
      "displayName": "Cactus",
      "level": 33,
      "boss": false,
      "baseExperience": 3003,
      "baseCoins": 99,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Obsidian Edge",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WindstriderFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wasteland Cleaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Knuckleband",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Brimblade",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Tree Sap",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cactus Boss",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FlashGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cactus",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Def",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Cactus",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Cacti",
      "displayName": "Cacti",
      "level": 31,
      "boss": false,
      "baseExperience": 2697,
      "baseCoins": 93,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wasteland Cleaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Crown of Spikes",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Brimblade",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Tree Sap",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cactus Boss",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "CounterSlash Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Cactus",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Def",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Cacti",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Butterfly Pixie",
      "displayName": "Pixie",
      "level": 35,
      "boss": false,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Longbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Cloud Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Willow Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldSilence Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Butterfly Fairy",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Butterfly Pixie",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Angel Mage",
      "displayName": "Seraphim Arbiter",
      "level": 90,
      "boss": true,
      "baseExperience": 18450,
      "baseCoins": 270,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Angel",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Champion Blade",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Wings of Valor",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Solar Relic",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "KnightFeet",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Master Revolver",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Sanctum Gloves",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Sanctum Guard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Holy Staff",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Master Codex",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Master Wand",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Master Hammer",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Master Sword",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "KnightLegs",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Iron Halo",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Holy Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "MpCost Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Archangel",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Angel Mage",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Angel",
      "displayName": "Angel",
      "level": 76,
      "boss": false,
      "baseExperience": 13452,
      "baseCoins": 228,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Angel",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Dagger",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Mechanical Core",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Spear",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "HighHeal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Archangel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Angel",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Wreck",
      "displayName": "Cindermaw",
      "level": 130,
      "boss": false,
      "baseExperience": 37050,
      "baseCoins": 390,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Axe of Oblivion",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Trident of Tides",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Harvester of Souls",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Chest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Legs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Feet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Moonstone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Alien Big Blink",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ChainLightning Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Wheel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Eternis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Alien Wreck",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Wheel",
      "displayName": "Cinderwheel",
      "level": 95,
      "boss": false,
      "baseExperience": 20425,
      "baseCoins": 285,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Voidthreads",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Chains of Binding",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Moonweave Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Mindweave",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Reap Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Wheel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Alien Wheel",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Twinkle",
      "displayName": "Twinkle",
      "level": 135,
      "boss": false,
      "baseExperience": 39825,
      "baseCoins": 405,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ArcaneChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ArcaneLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "TwistOfFate Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Alien Twinkle",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Starry",
      "displayName": "Starry",
      "level": 137,
      "boss": false,
      "baseExperience": 40963,
      "baseCoins": 411,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Alien Star",
      "displayName": "Little Star",
      "level": 131,
      "boss": false,
      "baseExperience": 37597,
      "baseCoins": 393,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SantaChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SantaGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Everfrost Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezingField Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Sporella",
      "displayName": "Chompcap",
      "level": 92,
      "boss": false,
      "baseExperience": 19228,
      "baseCoins": 276,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mindweave",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Binding Spirits Staff",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Moonweave Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Blunderbuss",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "LightningRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Sporella",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Alien Spike",
      "displayName": "Cinderspike",
      "level": 92,
      "boss": false,
      "baseExperience": 19228,
      "baseCoins": 276,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Voidthreads",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Executioner Axe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Darkhide Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Chains of Binding",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Execute Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Wheel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Alien Spike",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Skye",
      "displayName": "Galaxian Skimmer",
      "level": 144,
      "boss": false,
      "baseExperience": 45072,
      "baseCoins": 432,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Alien Plant",
      "displayName": "Chompbloom",
      "level": 129,
      "boss": false,
      "baseExperience": 36507,
      "baseCoins": 387,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Wraith of Dawn",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bloom of Midnight",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Whisper of Thorns",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Chest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Legs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Feet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Moonstone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Alien Big Blink",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "GrandCross Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Sporella",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Eternis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Alien Plant",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Pew Pew",
      "displayName": "Galaxian Blaster",
      "level": 142,
      "boss": false,
      "baseExperience": 43878,
      "baseCoins": 426,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Cyclops",
          "count": 1,
          "chance": 0.01
        }
      ]
    },
    {
      "id": "Alien One Eye",
      "displayName": "Voidgazer",
      "level": 126,
      "boss": false,
      "baseExperience": 34902,
      "baseCoins": 378,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Fang of the Moon",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Blade of Eclipse",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex of Revelation",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Chest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Legs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Feet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Moonstone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Alien Big Blink",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ChainLightning Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Cyclops",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Eternis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Alien One Eye",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Galaxia",
      "displayName": "Galaxian Brute",
      "level": 144,
      "boss": false,
      "baseExperience": 45072,
      "baseCoins": 432,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Alien Cyclops",
      "displayName": "Voidspawn",
      "level": 93,
      "boss": false,
      "baseExperience": 19623,
      "baseCoins": 279,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bloodbound",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Executioner Axe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Darkhide Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Chains of Binding",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Reap Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Cyclops",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Alien Cyclops",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Biteroot",
      "displayName": "Chomproot",
      "level": 94,
      "boss": false,
      "baseExperience": 20022,
      "baseCoins": 282,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bloodbound",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Blunderbuss",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Darkhide Gloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Executioner Axe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Moonrock",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "LightningRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Sporella",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Alien Biteroot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Alien Big Blink",
      "displayName": "Cosmic Entity",
      "level": 135,
      "boss": true,
      "baseExperience": 39825,
      "baseCoins": 405,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Axe of Oblivion",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Codex of Revelation",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Wraith of Dawn",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Fang of the Moon",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Bloom of Midnight",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Staff of Eternis",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Trident of Tides",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Blade of Eclipse",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Edge of Twilight",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Harvester of Souls",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Crystal Wings",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Night Chest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Night Legs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Night Feet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Regen Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "Detector Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_CosmicBand",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Cyclops",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Alien Big Blink",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Archangel",
      "displayName": "Archangel",
      "level": 79,
      "boss": false,
      "baseExperience": 14457,
      "baseCoins": 237,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Angel",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Axe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Plum Talisman",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Slingshot",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "TurnUndead Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Archangel",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Archangel",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon King Orange",
      "displayName": "Earth Wyrm",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Ball Robot Blue",
      "displayName": "Ward Robot",
      "level": 141,
      "boss": false,
      "baseExperience": 43287,
      "baseCoins": 423,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Bat",
      "displayName": "Bat",
      "level": 41,
      "boss": false,
      "baseExperience": 4387,
      "baseCoins": 123,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Bat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Shadow Dancers",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Swift Fang",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dualblade Sheath",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Royal Dagger",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Snake Naga",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Stomp Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bat",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Bat",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Butterfly Hue",
      "displayName": "Sprite",
      "level": 31,
      "boss": false,
      "baseExperience": 2697,
      "baseCoins": 93,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Longbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Willow Staff",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Heal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Butterfly Fairy",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Butterfly Hue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Butterfly Fairy",
      "displayName": "Fairy",
      "level": 33,
      "boss": false,
      "baseExperience": 3003,
      "baseCoins": 99,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Verdant Core",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Cloud Loop",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Sun Emblem",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Heal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Butterfly Fairy",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Butterfly Fairy",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Burrow",
      "displayName": "Digger",
      "level": 17,
      "boss": false,
      "baseExperience": 1003,
      "baseCoins": 51,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Burrow",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ForestLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Guardblade",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Fang Clip",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Iron Bulwark",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Leaf",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "IceShard Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Burrow",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Magic",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Burrow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bunny",
      "displayName": "Bunny",
      "level": 21,
      "boss": false,
      "baseExperience": 1407,
      "baseCoins": 63,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bunny Cap",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sonic Shoes",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Oak Bow",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Bunny Backpack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Radiant Dagger",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Fur",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Hare",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Earthbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rabbit",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Movespeed",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Bunny",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bumble",
      "displayName": "Bumblebee",
      "level": 7,
      "boss": false,
      "baseExperience": 273,
      "baseCoins": 21,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Golden Hoop",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Slingshot",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ThunderStorm Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bee",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Bumble",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bud",
      "displayName": "Venom Bud",
      "level": 86,
      "boss": false,
      "baseExperience": 16942,
      "baseCoins": 258,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Soul Reaper Scythe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Oxygen Tank",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Razor Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PoisonGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bud",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Bud",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Boxy Robot",
      "displayName": "Boxy Robot",
      "level": 130,
      "boss": false,
      "baseExperience": 37050,
      "baseCoins": 390,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flameburst Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxspire",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Luxbane",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Meteor Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Boxy Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Boxy Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bot Robot",
      "displayName": "Repair Robot",
      "level": 141,
      "boss": false,
      "baseExperience": 43287,
      "baseCoins": 423,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Bomb",
      "displayName": "Bomb",
      "level": 81,
      "boss": false,
      "baseExperience": 15147,
      "baseCoins": 243,
      "drops": [
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Wand",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Iron Halo",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Hammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Angel Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Sanctuary Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bomb",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cost",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Bomb",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Blossom",
      "displayName": "Deathblossom",
      "level": 90,
      "boss": false,
      "baseExperience": 18450,
      "baseCoins": 270,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Duskfang",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "StormplateLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Shadow Shield",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Oxygen Tank",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "StormplateFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PoisonGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bud",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Blossom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bloom",
      "displayName": "Nightbloom",
      "level": 89,
      "boss": false,
      "baseExperience": 18067,
      "baseCoins": 267,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Soul Reaper Scythe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Oxygen Tank",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "StormplateFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "LightningStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bud",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Bloom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Blind",
      "displayName": "Nightshade",
      "level": 140,
      "boss": false,
      "baseExperience": 42700,
      "baseCoins": 420,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Blast Robot Red",
      "displayName": "Blast Robot",
      "level": 143,
      "boss": false,
      "baseExperience": 44473,
      "baseCoins": 429,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Blast Robot Blue",
      "displayName": "Guard Robot",
      "level": 143,
      "boss": false,
      "baseExperience": 44473,
      "baseCoins": 429,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Bird",
      "displayName": "Rooster",
      "level": 10,
      "boss": false,
      "baseExperience": 450,
      "baseCoins": 30,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Broad Sword",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Golden Hoop",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Sunflower Clip",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Chick",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Bird",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bee",
      "displayName": "Bee",
      "level": 6,
      "boss": false,
      "baseExperience": 222,
      "baseCoins": 18,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Broad Sword",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Potions",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Axe",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bee",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Bee",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Bat Lord",
      "displayName": "Night Baron",
      "level": 55,
      "boss": true,
      "baseExperience": 7425,
      "baseCoins": 165,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Bat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Mask",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Batling Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ThiefChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Jagtooth",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Archer's Beads",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "ThiefLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "ThiefFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Knight's Glory",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Rifle",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Mirage Cloak",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Skull Emblem",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "LeechMp Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_BatLord",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Bat",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Bat Lord",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Ball Robot Red",
      "displayName": "Strike Robot",
      "level": 141,
      "boss": false,
      "baseExperience": 43287,
      "baseCoins": 423,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Zombie Goblin Minion",
      "displayName": "Zombie Goblin",
      "level": 53,
      "boss": false,
      "baseExperience": 6943,
      "baseCoins": 159,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Shotgun",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Treasure Box",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Arrowcatch Wall",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "VolatileBolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Zombie Goblin Minion",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon King Purple",
      "displayName": "Lightning Wyrm",
      "level": 139,
      "boss": false,
      "baseExperience": 42117,
      "baseCoins": 417,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Dragon Predator Robot",
      "displayName": "Robot Dragon",
      "level": 150,
      "boss": true,
      "baseExperience": 48750,
      "baseCoins": 450,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Goblin Warlock",
      "displayName": "Orc Warlock",
      "level": 121,
      "boss": false,
      "baseExperience": 32307,
      "baseCoins": 363,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Riftbreaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Ragebound Fury",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Totem Banner",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sniper Rifle",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Tungsten",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Warchief",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "WildCharge Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Atk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Goblin Warlock",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Warcrusher",
      "displayName": "Orc Crusher",
      "level": 125,
      "boss": false,
      "baseExperience": 34375,
      "baseCoins": 375,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Riftbreaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Tempest Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Totem Banner",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Red Maw",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Tungsten",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Warchief",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Cyclone Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Atk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Goblin Warcrusher",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Warchief",
      "displayName": "Orc Warchief",
      "level": 130,
      "boss": true,
      "baseExperience": 37050,
      "baseCoins": 390,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Riftbreaker",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Str",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Dex",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Int",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Vit",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Agi",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Armor_Luk",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Blade Standard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Riftbreaker",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Totem Banner",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Ragebound Fury",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Sniper Rifle",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Stormfeather Kunai",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Warlord Emblem Shield",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Tempest Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Red Maw",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "HpMult Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "NoFlinch Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Goblin Warchief",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Goblin Warblade",
      "displayName": "Orc Reaver",
      "level": 123,
      "boss": false,
      "baseExperience": 33333,
      "baseCoins": 369,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Riftbreaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Agi",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Armor_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormfeather Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Totem Banner",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warlord Emblem Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Tungsten",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Warchief",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Earthquake Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Atk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Goblin Warblade",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Trooper Soldier",
      "displayName": "Goblin Soldier",
      "level": 45,
      "boss": false,
      "baseExperience": 5175,
      "baseCoins": 135,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Iron Reaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Ironhorn Cap",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Trooper Soldier",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Trooper Mage",
      "displayName": "Goblin Mage",
      "level": 42,
      "boss": false,
      "baseExperience": 4578,
      "baseCoins": 126,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Spiked Club",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Doom Keg",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Ironhorn Cap",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Trooper Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Trooper Assassin",
      "displayName": "Goblin Assassin",
      "level": 43,
      "boss": false,
      "baseExperience": 4773,
      "baseCoins": 129,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Iron Reaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "War Banner",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShoutStun Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Trooper Assassin",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Golem Earth",
      "displayName": "Stone Golem",
      "level": 35,
      "boss": false,
      "baseExperience": 3325,
      "baseCoins": 105,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Obsidian Edge",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wasteland Cleaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Focus Band",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Knuckleband",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Tree Sap",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cactus Boss",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "WeaponThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "artifact",
          "itemId": "Def",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Golem Earth",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Trooper",
      "displayName": "Goblin Grunt",
      "level": 44,
      "boss": false,
      "baseExperience": 4972,
      "baseCoins": 132,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Stonebound Boots",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Stonepoint Spear",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Doom Keg",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Spiked Club",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeArc Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Trooper",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Giant Mage",
      "displayName": "Orc Mage",
      "level": 46,
      "boss": false,
      "baseExperience": 5382,
      "baseCoins": 138,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Golden Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Skullhacker",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "War Banner",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Recurve Bow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Giant Gold",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "AxeArc Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Giant Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Giant Gold",
      "displayName": "Orc King",
      "level": 55,
      "boss": true,
      "baseExperience": 7425,
      "baseCoins": 165,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Golden Axe",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Golden Hammer",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Golden Crown",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Golden Aegis",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Wolfcrest Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BerserkChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Launcher",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "War Banner",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Heaven's Orbit",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Doom Keg",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Bronze Plugs",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Skullhacker",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Recurve Bow",
          "count": 1,
          "chance": 15
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Earth Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Goblin Giant Gold",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Goblin Giant Devil",
      "displayName": "Orc Soldier",
      "level": 50,
      "boss": false,
      "baseExperience": 6250,
      "baseCoins": 150,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Golden Hammer",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Skullhacker",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bronze Plugs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Recurve Bow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Giant Gold",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Whirlwind Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Giant Devil",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Giant",
      "displayName": "Orc",
      "level": 48,
      "boss": false,
      "baseExperience": 5808,
      "baseCoins": 144,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Golden Axe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BerserkLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Launcher",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Doom Keg",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Heaven's Orbit",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Goblin Giant Gold",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "AxeVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Giant",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Glow Wisp Yellow",
      "displayName": "Fire Glimmer",
      "level": 33,
      "boss": false,
      "baseExperience": 3003,
      "baseCoins": 99,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Longbow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bear Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Pouch Fairy Dust",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sunflora Pixie",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldSilence Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Cast",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Glow Wisp Yellow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Glow Wisp Purple",
      "displayName": "Lightning Glimmer",
      "level": 27,
      "boss": false,
      "baseExperience": 2133,
      "baseCoins": 81,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WindstriderChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Zephyrlight",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Star",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "WindstriderLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Foxtail",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Cat Bolt",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ThunderStorm Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Ranged",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Glow Wisp Purple",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Glow Wisp Blue",
      "displayName": "Frost Glimmer",
      "level": 32,
      "boss": false,
      "baseExperience": 2848,
      "baseCoins": 96,
      "drops": [
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Mana Potion",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Heartloop Earring",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Water Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SpearSlice Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Glow Wisp Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Goblin Minion",
      "displayName": "Goblin",
      "level": 41,
      "boss": false,
      "baseExperience": 4387,
      "baseCoins": 123,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Stonebound Boots",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Iron Reaver",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "War Banner",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Stonepoint Spear",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Ingot Iron",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AxeArc Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Golem Fire",
      "displayName": "Magma Golem",
      "level": 100,
      "boss": false,
      "baseExperience": 22500,
      "baseCoins": 300,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FlameOrb Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Golem Fire",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Golem Ice",
      "displayName": "Rime Golem",
      "level": 75,
      "boss": false,
      "baseExperience": 13125,
      "baseCoins": 225,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WeaverChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldDamage Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Golem Ice",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Grid Robot",
      "displayName": "Grid Robot",
      "level": 143,
      "boss": false,
      "baseExperience": 44473,
      "baseCoins": 429,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Ice Mage",
      "displayName": "Ice Mage",
      "level": 80,
      "boss": true,
      "baseExperience": 14800,
      "baseCoins": 240,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Moonfrost",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sapphire Crown",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Stormcaller Totem",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverFeet",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Crystal Slammer",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Azure Tag",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Frostspire Kunai",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Frost Mark",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Mage Plate",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Azure Prism",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "WeaverChest",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "WeaverLegs",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ReflectSpell Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "gem",
          "itemId": "MdefMult Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_IceCrown",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Icicle",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Ice Mage",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Ice Cube B",
      "displayName": "Shadow Golem",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Ice Cube A",
      "displayName": "Ice Golem",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Ice Bear B",
      "displayName": "Festive Bear",
      "level": 135,
      "boss": false,
      "baseExperience": 39825,
      "baseCoins": 405,
      "drops": [
        {
          "category": "equipment",
          "itemId": "ReindeerLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FrostBlade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Ice Bear B",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ice Bear A",
      "displayName": "Ice Bear",
      "level": 134,
      "boss": false,
      "baseExperience": 39262,
      "baseCoins": 402,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SantaFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Everfrost Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SantaGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "ReindeerChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Candy Cane",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Mega Ice Golem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezingField Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Alien Star",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Oathbound",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Ice Bear A",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ice",
      "displayName": "Ice",
      "level": 71,
      "boss": false,
      "baseExperience": 11857,
      "baseCoins": 213,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mage Plate",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Crystal Slammer",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Frostspire Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FreezeGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Icicle",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Ice",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Housefly Nom",
      "displayName": "Blowfly",
      "level": 39,
      "boss": false,
      "baseExperience": 4017,
      "baseCoins": 117,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wind Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "VenomStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Housefly Nom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Housefly Nom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Housefly Junk",
      "displayName": "Bluebottle",
      "level": 69,
      "boss": false,
      "baseExperience": 11247,
      "baseCoins": 207,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Bone Channeler",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "CorpseExplosion Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Housefly Nom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Housefly Junk",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Housefly Icky",
      "displayName": "Gadfly",
      "level": 37,
      "boss": false,
      "baseExperience": 3663,
      "baseCoins": 111,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Scalpel",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Wind Shield",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShadowStep Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Housefly Nom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Housefly Icky",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Horror",
      "displayName": "Horror",
      "level": 50,
      "boss": false,
      "baseExperience": 6250,
      "baseCoins": 150,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Mirage Cloak",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Knight's Glory",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Skull Pendant",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Rifle",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Spider Web",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Bat Lord",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ForceShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Lurker",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Auto",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Horror",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Hermit Robot Red",
      "displayName": "Sentry Robot",
      "level": 142,
      "boss": false,
      "baseExperience": 43878,
      "baseCoins": 426,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Hermit Robot Blue",
      "displayName": "Scout Robot",
      "level": 142,
      "boss": false,
      "baseExperience": 43878,
      "baseCoins": 426,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Hermit King",
      "displayName": "Hermit King",
      "level": 45,
      "boss": true,
      "baseExperience": 5175,
      "baseCoins": 135,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Azure Cutlass",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Mana Cask",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Chainfrost Staff",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Whale Backpack",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Runesmasher",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Stormburst Crossbow",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Lifebloom Shoes",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Heartloop Earring",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "MageChest",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "MageLegs",
          "count": 1,
          "chance": 20
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Water Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_HermitKing",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shell",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Hermit King",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Haunt",
      "displayName": "Banshee",
      "level": 80,
      "boss": false,
      "baseExperience": 14800,
      "baseCoins": 240,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Ghostly Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Dagger",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Mechanical Core",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Spear",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "HighHeal Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Haunt",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Haunt",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Hare",
      "displayName": "Vorpal Hare",
      "level": 30,
      "boss": true,
      "baseExperience": 2550,
      "baseCoins": 90,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Bunny Cap",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Bunny Backpack",
          "count": 1,
          "chance": 30
        },
        {
          "category": "equipment",
          "itemId": "Ferncloak",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "Radiant Wand",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Bunny Cap",
          "count": 1,
          "chance": 15
        },
        {
          "category": "equipment",
          "itemId": "Fleetrunner",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "Oak Bow",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Radiant Dagger",
          "count": 1,
          "chance": 20
        },
        {
          "category": "equipment",
          "itemId": "Sonic Shoes",
          "count": 1,
          "chance": 25
        },
        {
          "category": "equipment",
          "itemId": "Bunny Backpack",
          "count": 1,
          "chance": 15
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "MoveSpd Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "cosmetic",
          "itemId": "Head_HareHorns",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Rabbit",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "card",
          "itemId": "Hare",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Gripper Robot",
      "displayName": "Gripper Robot",
      "level": 130,
      "boss": false,
      "baseExperience": 37050,
      "baseCoins": 390,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Glove_Vit",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Glove_Dex",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Thundercoil",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Fortitude",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spineshard",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.4
        },
        {
          "category": "material",
          "itemId": "Obsidian",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Spider Queen Robot",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PointBlankShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Boxy Robot",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Corporeal",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Gripper Robot",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Grim Reaper",
      "displayName": "Reaper",
      "level": 119,
      "boss": false,
      "baseExperience": 31297,
      "baseCoins": 357,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Wraith",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BoneSpikes Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Gloom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Grim Reaper",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Gloom",
      "displayName": "Spectre",
      "level": 116,
      "boss": false,
      "baseExperience": 29812,
      "baseCoins": 348,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Wraith",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BoneSpear Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Gloom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Gloom",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Ghost",
      "displayName": "Ghost",
      "level": 77,
      "boss": false,
      "baseExperience": 13783,
      "baseCoins": 231,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Ghostly Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "KnightLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Axe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Plum Talisman",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Slingshot",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "TurnUndead Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Ghost",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Ghost",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Galaxy Robot",
      "displayName": "Galaxy Robot",
      "level": 144,
      "boss": false,
      "baseExperience": 45072,
      "baseCoins": 432,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Fungi",
      "displayName": "Fungi",
      "level": 28,
      "boss": false,
      "baseExperience": 2268,
      "baseCoins": 84,
      "drops": [
        {
          "category": "equipment",
          "itemId": "IslandLegs",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Stiletto",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Fruit Bowl",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Mage Guard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SpearSlice Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Fungi",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Creep Green",
      "displayName": "Jade Eyestalk",
      "level": 118,
      "boss": false,
      "baseExperience": 30798,
      "baseCoins": 354,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Exorcist Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Cerulean Scepter",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "DeathNova Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Creep Green",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Creep Blue",
      "displayName": "Azure Eyestalk",
      "level": 117,
      "boss": false,
      "baseExperience": 30303,
      "baseCoins": 351,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Royal Crest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BoneSpikes Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Creep Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Bat Red",
      "displayName": "Ruby Gazer",
      "level": 24,
      "boss": false,
      "baseExperience": 1752,
      "baseCoins": 72,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Pumpkin Head",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex Binding Light",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Scroll Charm",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Gravestone Breaker",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "FanFire Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Bat Green",
      "displayName": "Jade Gazer",
      "level": 22,
      "boss": false,
      "baseExperience": 1518,
      "baseCoins": 66,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Pumpkin Head",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericLegs",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Witch's Whisk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Blood Clip",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Dawnstar",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "HolyLight Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Eyeball Bat Green",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Bat Blue",
      "displayName": "Azure Gazer",
      "level": 21,
      "boss": false,
      "baseExperience": 1407,
      "baseCoins": 63,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Pumpkin Head",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "ClericChest",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex Binding Light",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Wilderness Pack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Gravestone Breaker",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Branch Dead",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "SoulStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Leech",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Eyeball Bat Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Elder Wisp Yellow",
      "displayName": "Elder Fire",
      "level": 99,
      "boss": false,
      "baseExperience": 22077,
      "baseCoins": 297,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Fire Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sunbound Mitts",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ExplosiveGrenade Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Elder Wisp Yellow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Elder Wisp Purple",
      "displayName": "Elder Lightning",
      "level": 89,
      "boss": false,
      "baseExperience": 18067,
      "baseCoins": 267,
      "drops": [
        {
          "category": "equipment",
          "itemId": "StormplateChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Razor Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Nightfang Stud",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Elixir Gourd",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Silica Sand",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Worm Creep",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Harvest Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Immune",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Elder Wisp Purple",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Elder Wisp Blue",
      "displayName": "Elder Frost",
      "level": 74,
      "boss": false,
      "baseExperience": 12802,
      "baseCoins": 222,
      "drops": [
        {
          "category": "equipment",
          "itemId": "WeaverChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Azure Prism",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FieldDamage Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Wisp Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Elder Wisp Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Egglet",
      "displayName": "Egglet",
      "level": 23,
      "boss": false,
      "baseExperience": 1633,
      "baseCoins": 69,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Ferncloak",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Radiant Wand",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Bunny Cap",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Fleetrunner",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Shard",
          "count": 1,
          "chance": 6
        },
        {
          "category": "material",
          "itemId": "Fur",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Hare",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "EarthSpikes Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shade",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Movespeed",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Egglet",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Egg",
      "displayName": "Egg",
      "level": 4,
      "boss": false,
      "baseExperience": 132,
      "baseCoins": 12,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceFeet",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Knife",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Sunflower Clip",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Sword",
          "count": 1,
          "chance": 5
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Shade",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 10
        },
        {
          "category": "card",
          "itemId": "Egg",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Earthworm",
      "displayName": "Grave Worm",
      "level": 66,
      "boss": false,
      "baseExperience": 10362,
      "baseCoins": 198,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "JumpShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Worm",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Dragonfly Swift",
      "displayName": "Hawker",
      "level": 68,
      "boss": false,
      "baseExperience": 10948,
      "baseCoins": 204,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "BreezeguardChest",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Phantom Kunai",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Daggers",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Twinblade",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Fishbone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Queen Worm",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "PanicBurst Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragonfly Darner",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Hexbrand",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragonfly Swift",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragonfly Darner",
      "displayName": "Skimmer",
      "level": 39,
      "boss": false,
      "baseExperience": 4017,
      "baseCoins": 117,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Piercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Scalpel",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "GunkShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragonfly Darner",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Dragonfly Darner",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragonfly Arrow",
      "displayName": "Darter",
      "level": 36,
      "boss": false,
      "baseExperience": 3492,
      "baseCoins": 108,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Swampy Hat",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "GravemarrowChest",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Abyss Shard",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Lucky Drops",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Piercer",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Larva",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "VenomStrike Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragonfly Darner",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Flee",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Dragonfly Arrow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Water",
      "displayName": "Aqua Drake",
      "level": 72,
      "boss": false,
      "baseExperience": 12168,
      "baseCoins": 216,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "WeaverLegs",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Frostshard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Crystal Cache",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "WeaverFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Azurite",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Ice Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "IceRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Water",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mdef",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Water",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Spark",
      "displayName": "Spark Drake",
      "level": 97,
      "boss": false,
      "baseExperience": 21243,
      "baseCoins": 291,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "SoulbinderFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Meteoric Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Sunbound Mitts",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FlameOrb Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Spark",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Dragon Spark",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Robot",
      "displayName": "Dragon Robot",
      "level": 144,
      "boss": false,
      "baseExperience": 45072,
      "baseCoins": 432,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Eyeball Creep Red",
      "displayName": "Ruby Eyestalk",
      "level": 118,
      "boss": false,
      "baseExperience": 30798,
      "baseCoins": 354,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Crusader Sword",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Bronze Crescent",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Royal Crest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "BoneSpear Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Creep Red",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Dragon Nightfall",
      "displayName": "Night Drake",
      "level": 79,
      "boss": false,
      "baseExperience": 14457,
      "baseCoins": 237,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Dragon",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "Champion Blade",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "KnightFeet",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Master Katar",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Dawn Prayer",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Master Scythe",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Chunk",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Antique Teacup",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Smite Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Dragon Dusk",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Healing",
          "count": 1,
          "chance": 3
        },
        {
          "category": "card",
          "itemId": "Dragon Nightfall",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Mage",
      "displayName": "Beholder",
      "level": 138,
      "boss": false,
      "baseExperience": 41538,
      "baseCoins": 414,
      "drops": [
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.5
        },
        {
          "category": "material",
          "itemId": "Ingot Gold",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        }
      ]
    },
    {
      "id": "Eyeball Mage Green",
      "displayName": "Jade Beholder",
      "level": 124,
      "boss": false,
      "baseExperience": 33852,
      "baseCoins": 372,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedLegs",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Eclipse Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Warborn Aegis",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Holy Shield",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "DeathSpiral Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Mage Green",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Flower Pot Monster",
      "displayName": "Mandrake",
      "level": 20,
      "boss": false,
      "baseExperience": 1300,
      "baseCoins": 60,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Runecall",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Codex First Hymn",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Backpack",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Amber Bow",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Tree Bark",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Firebolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Sprout",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Melee",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Flower Pot Monster",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Flora",
      "displayName": "Flora",
      "level": 34,
      "boss": false,
      "baseExperience": 3162,
      "baseCoins": 102,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Drooping Flora",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "equipment",
          "itemId": "MageFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Relic Trident",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Whale Backpack",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Glimmerthorn",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Shard",
          "count": 1,
          "chance": 8
        },
        {
          "category": "material",
          "itemId": "Mushroom",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "AerialShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flora",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Mp",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Flora",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fledgling",
      "displayName": "Fledgling",
      "level": 8,
      "boss": false,
      "baseExperience": 328,
      "baseCoins": 24,
      "drops": [
        {
          "category": "equipment",
          "itemId": "NoviceFeet",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Broad Sword",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Sunflower Clip",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Axe",
          "count": 1,
          "chance": 4
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Shard",
          "count": 1,
          "chance": 2
        },
        {
          "category": "material",
          "itemId": "Flax",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Sting",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "Thunderbolt Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Chick",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Novice",
          "count": 1,
          "chance": 5
        },
        {
          "category": "card",
          "itemId": "Fledgling",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Flame",
      "displayName": "Blaze",
      "level": 97,
      "boss": false,
      "baseExperience": 21243,
      "baseCoins": 291,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Chaos Reaver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FirePillar Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flame",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Flame",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Yellow",
      "displayName": "Goldtail",
      "level": 102,
      "boss": false,
      "baseExperience": 23358,
      "baseCoins": 306,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FanOfKnives Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Yellow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Pink",
      "displayName": "Rosetail",
      "level": 101,
      "boss": false,
      "baseExperience": 22927,
      "baseCoins": 303,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Pink",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Merman Yellow",
      "displayName": "Topaz Merman",
      "level": 105,
      "boss": false,
      "baseExperience": 24675,
      "baseCoins": 315,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        }
      ]
    },
    {
      "id": "Fish Merman Pink",
      "displayName": "Coral Merman",
      "level": 105,
      "boss": false,
      "baseExperience": 24675,
      "baseCoins": 315,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Merman Pink",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Merman Blue",
      "displayName": "Sapphire Merman",
      "level": 105,
      "boss": false,
      "baseExperience": 24675,
      "baseCoins": 315,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FanOfKnives Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Merman Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Man Yellow",
      "displayName": "Canary Merling",
      "level": 103,
      "boss": false,
      "baseExperience": 23793,
      "baseCoins": 309,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Luk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Man Yellow",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Man Pink",
      "displayName": "Roseate Merling",
      "level": 103,
      "boss": false,
      "baseExperience": 23793,
      "baseCoins": 309,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Str",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FanOfKnives Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fish Man Blue",
      "displayName": "Aqua Merling",
      "level": 103,
      "boss": false,
      "baseExperience": 23793,
      "baseCoins": 309,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShieldThrow Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fish Man Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "FIsh Blue",
      "displayName": "Bluefin",
      "level": 101,
      "boss": false,
      "baseExperience": 22927,
      "baseCoins": 303,
      "drops": [
        {
          "category": "equipment",
          "itemId": "Feet_Int",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Coral Stone",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Eyeball Monster",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "HydroVortex Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Fish Man Pink",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Bastion",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "FIsh Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fire Mage",
      "displayName": "Fire Mage",
      "level": 99,
      "boss": false,
      "baseExperience": 22077,
      "baseCoins": 297,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Meteoric Staff",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FlameOrb Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flame",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fire Mage",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Fire",
      "displayName": "Ember",
      "level": 96,
      "boss": false,
      "baseExperience": 20832,
      "baseCoins": 288,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SoulbinderChest",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Flame Tongue Kunai",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Obsidian Band",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Reaper Scythe",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Ash",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Imp Devil",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "FirePillar Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Flame",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Crit",
          "count": 1,
          "chance": 2
        },
        {
          "category": "card",
          "itemId": "Fire",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Monster",
      "displayName": "Kraken",
      "level": 110,
      "boss": true,
      "baseExperience": 26950,
      "baseCoins": 330,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SafetyFeet",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "Life Staff",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SafetyGloves",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Spirit Familiar",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Earth Shaker",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Stormcall Kunai",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Triple Barrel Revolver",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "Fortified Guardwall",
          "count": 1,
          "chance": 5
        },
        {
          "category": "equipment",
          "itemId": "SafetyChest",
          "count": 1,
          "chance": 10
        },
        {
          "category": "equipment",
          "itemId": "SafetyLegs",
          "count": 1,
          "chance": 10
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 100
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 50
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 10
        },
        {
          "category": "consumable",
          "itemId": "Mystery Mount Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Mystery Pet Box",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "Threat Gem",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "card",
          "itemId": "Eyeball Monster",
          "count": 1,
          "chance": 3
        }
      ]
    },
    {
      "id": "Eyeball Mage Red",
      "displayName": "Ruby Beholder",
      "level": 125,
      "boss": false,
      "baseExperience": 34375,
      "baseCoins": 375,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedFeet",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Umbra",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Lunaris Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "ShadowRelease Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Mage Red",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Eyeball Mage Blue",
      "displayName": "Azure Beholder",
      "level": 123,
      "boss": false,
      "baseExperience": 33333,
      "baseCoins": 369,
      "drops": [
        {
          "category": "equipment",
          "itemId": "SanctifiedChest",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Codex Vitae",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Iron Ankh",
          "count": 1,
          "chance": 1
        },
        {
          "category": "equipment",
          "itemId": "Necronomicon",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Resonance Core",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Guild Charter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Vulkanite Crystal",
          "count": 1,
          "chance": 0.3
        },
        {
          "category": "material",
          "itemId": "Marble",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "consumable",
          "itemId": "Lure Death Mage",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "gem",
          "itemId": "DeathCoil Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Eyeball Bat Red",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Matk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "card",
          "itemId": "Eyeball Mage Blue",
          "count": 1,
          "chance": 0.5
        }
      ]
    },
    {
      "id": "Zombie Goblin Soldier",
      "displayName": "Zombie Grunt",
      "level": 55,
      "boss": false,
      "baseExperience": 7425,
      "baseCoins": 165,
      "drops": [
        {
          "category": "equipment",
          "itemId": "BerserkFeet",
          "count": 1,
          "chance": 4
        },
        {
          "category": "equipment",
          "itemId": "Doom Crescent",
          "count": 1,
          "chance": 3
        },
        {
          "category": "equipment",
          "itemId": "Digger's Flask",
          "count": 1,
          "chance": 2
        },
        {
          "category": "equipment",
          "itemId": "Iron Morningstar",
          "count": 1,
          "chance": 3
        },
        {
          "category": "material",
          "itemId": "Cosmetic Converter",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "material",
          "itemId": "Gravion Chunk",
          "count": 1,
          "chance": 1
        },
        {
          "category": "material",
          "itemId": "Coal Hard",
          "count": 1,
          "chance": 100
        },
        {
          "category": "consumable",
          "itemId": "Artifact Box Base",
          "count": 1,
          "chance": 1
        },
        {
          "category": "gem",
          "itemId": "ShrapnelShot Gem",
          "count": 1,
          "chance": 0.1
        },
        {
          "category": "cosmetic",
          "itemId": "Goblin Minion",
          "count": 1,
          "chance": 0.01
        },
        {
          "category": "artifact",
          "itemId": "Vampiric",
          "count": 1,
          "chance": 4
        },
        {
          "category": "card",
          "itemId": "Zombie Goblin Soldier",
          "count": 1,
          "chance": 0.5
        }
      ]
    }
  ] as const satisfies readonly MobRewardSourceDefinition[];
}
