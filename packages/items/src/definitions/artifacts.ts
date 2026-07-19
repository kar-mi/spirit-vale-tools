import type { FishNetItemDefinition } from "../catalog.ts";

export class ArtifactItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 3,
      "id": "Acolyte",
      "displayName": "Holy Vow",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "HolyLight"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Heal"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "HolyLight"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Heal"
        },
        {
          "type": 67,
          "value": 1
        },
        {
          "type": 90,
          "value": -2
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Atk",
      "displayName": "Warglyph",
      "refineEffects": [
        {
          "type": 69,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 9,
            "value": 5
          },
          {
            "type": 71,
            "value": 5
          },
          {
            "type": 72,
            "value": -15
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 9,
            "value": 10
          },
          {
            "type": 71,
            "value": 5
          },
          {
            "type": 72,
            "value": -15
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Auto",
      "displayName": "Blitzcore",
      "refineEffects": [
        {
          "type": 63,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 63,
            "value": 3
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 130,
            "value": 2
          },
          {
            "type": 63,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Bastion",
      "displayName": "Bastion",
      "effects": [
        {
          "type": 32,
          "value": 1
        },
        {
          "type": 35,
          "value": 1
        },
        {
          "type": 34,
          "value": 1
        },
        {
          "type": 36,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 5
          },
          {
            "type": 71,
            "value": 10
          },
          {
            "type": 72,
            "value": 10
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Berserker_1",
      "displayName": "Bloodfury",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Execute"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Cyclone"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "AxeThrow"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "DarkClaw"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Execute"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Cyclone"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeThrow"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DarkClaw"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Cast",
      "displayName": "Spellweaver",
      "refineEffects": [
        {
          "type": 64,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 64,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Corporeal",
      "displayName": "Corporeal",
      "refineEffects": [
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Poison"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Undead"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Shadow"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Holy"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 46,
            "value": 3,
            "skillId": "Poison"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Undead"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Shadow"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Holy"
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Poison"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Undead"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Shadow"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Holy"
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Cost",
      "displayName": "Arcanum Verge",
      "refineEffects": [
        {
          "type": 90,
          "value": -0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 90,
            "value": -10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Crit",
      "displayName": "Furybrand",
      "refineEffects": [
        {
          "type": 52,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 15,
            "value": 5
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 52,
            "value": 5
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Def",
      "displayName": "Titanplate",
      "refineEffects": [
        {
          "type": 11,
          "value": 1
        },
        {
          "type": 86,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 11,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 73,
            "value": 5
          },
          {
            "type": 86,
            "value": 10
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Eternis",
      "displayName": "Eternis",
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 5
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
            "type": 69,
            "value": 5
          },
          {
            "type": 70,
            "value": 5
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Flee",
      "displayName": "Shadebound",
      "refineEffects": [
        {
          "type": 14,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 14,
            "value": 15
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 121,
            "value": 10
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Gunslinger_1",
      "displayName": "Deadeye",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "PanicBurst"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "PointBlankShot"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "SniperShot"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ExplosiveGrenade"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "PanicBurst"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "PointBlankShot"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "SniperShot"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ExplosiveGrenade"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Healing",
      "displayName": "Lifebloom",
      "refineEffects": [
        {
          "type": 67,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 67,
            "value": 5
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Hexbrand",
      "displayName": "Hexbrand",
      "refineEffects": [
        {
          "type": 142,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 142,
            "value": 5
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 142,
            "value": 5
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Hit",
      "displayName": "Hawkeye",
      "refineEffects": [
        {
          "type": 13,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 13,
            "value": 15
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 78,
            "value": 10
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Hp",
      "displayName": "Vitalis",
      "refineEffects": [
        {
          "type": 71,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 71,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Immune",
      "displayName": "Nullmark",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "skillId": "Blind"
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Silence"
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Poison"
        },
        {
          "type": 26,
          "value": 50,
          "skillId": "Bleeding"
        }
      ],
      "refineEffects": [
        {
          "type": 26,
          "value": 2.5,
          "skillId": "Stun"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 26,
            "value": 50,
            "skillId": "Slow"
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Knight",
      "displayName": "Honored Oath",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "SpearThrust"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "SpearStab"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "SpearSlice"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "WeaponThrow"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearThrust"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearStab"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearSlice"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "WeaponThrow"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Leech",
      "displayName": "Bloodbind",
      "refineEffects": [
        {
          "type": 22,
          "value": 5
        },
        {
          "type": 23,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 22,
            "value": 25
          },
          {
            "type": 23,
            "value": 5
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Mage",
      "displayName": "Arcane Origin",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Fireball"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "IceShard"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "EarthSpikes"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ThunderStorm"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Fireball"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "IceShard"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "EarthSpikes"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ThunderStorm"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Magic",
      "displayName": "Arcanum",
      "refineEffects": [
        {
          "type": 48,
          "value": 0.125
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 48,
            "value": 3
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 48,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Matk",
      "displayName": "Starfire",
      "refineEffects": [
        {
          "type": 70,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 10,
            "value": 5
          },
          {
            "type": 72,
            "value": 5
          },
          {
            "type": 71,
            "value": -10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 10,
            "value": 10
          },
          {
            "type": 72,
            "value": 5
          },
          {
            "type": 71,
            "value": -10
          },
          {
            "type": 43,
            "value": 2,
            "skillId": "EnergyShield"
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Mdef",
      "displayName": "Veilward",
      "refineEffects": [
        {
          "type": 12,
          "value": 1
        },
        {
          "type": 94,
          "value": 0.5
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 12,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 74,
            "value": 5
          },
          {
            "type": 94,
            "value": 5
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Melee",
      "displayName": "Steelheart",
      "refineEffects": [
        {
          "type": 47,
          "value": 0.125
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 47,
            "value": 3
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 47,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Movespeed",
      "displayName": "Windborne",
      "refineEffects": [
        {
          "type": 65,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 65,
            "value": 5
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Mp",
      "displayName": "Aethercore",
      "refineEffects": [
        {
          "type": 72,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 72,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Necromancer_1",
      "displayName": "Gravebound",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "BoneSpikes"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "DeathSpiral"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "CorpseExplosionEnemy"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "BoneSpikes"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathSpiral"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "CorpseExplosionEnemy"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Novice",
      "displayName": "Pioneer",
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 7,
            "value": 20
          },
          {
            "type": 8,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 59,
            "value": 5
          },
          {
            "type": 61,
            "value": 2
          },
          {
            "type": 9,
            "value": 3
          },
          {
            "type": 10,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Oathbound",
      "displayName": "Oathbound",
      "refineEffects": [
        {
          "type": 119,
          "value": 0.25
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 119,
            "value": 10
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Paladin_1",
      "displayName": "Aegis Light",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "GrandCross"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "JudgementBlade"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ShieldThrow"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Consecration"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "GrandCross"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "JudgementBlade"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShieldThrow"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Consecration"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Priest_1",
      "displayName": "Sanctum Grace",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Exorcism"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "HolyWrath"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "TurnUndead"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Smite"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Exorcism"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "HolyWrath"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "TurnUndead"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Smite"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Primordial",
      "displayName": "Primordial",
      "refineEffects": [
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Fire"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Water"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Wind"
        },
        {
          "type": 46,
          "value": 0.125,
          "skillId": "Earth"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 46,
            "value": 3,
            "skillId": "Fire"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Water"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Wind"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Earth"
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Fire"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Water"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Wind"
          },
          {
            "type": 46,
            "value": 3,
            "skillId": "Earth"
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Ranged",
      "displayName": "Stormquiver",
      "refineEffects": [
        {
          "type": 102,
          "value": 0.125
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 102,
            "value": 3
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 102,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Rogue",
      "displayName": "Silent Death",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "VenomStrike"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ShadowStep"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "BladeDance"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "VenomStrike"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowStep"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "BladeDance"
        },
        {
          "type": 142,
          "value": 2
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Scout",
      "displayName": "Far Sight",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "StrafingVolley"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ForceShot"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "VolatileBolt"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ArrowShower"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "StrafingVolley"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ForceShot"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "VolatileBolt"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ArrowShower"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Shinobi_1",
      "displayName": "Umbral Veil",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "FlameOrb"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FrostBlade"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "LightningStrike"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ShadowRelease"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FlameOrb"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FrostBlade"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "LightningStrike"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowRelease"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Summoner",
      "displayName": "Spirit Pact",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "SoulStrike"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FieldCurse"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FieldHealing"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FieldDamage"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SoulStrike"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldCurse"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldHealing"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldDamage"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Vampiric",
      "displayName": "Vampiric",
      "refineEffects": [
        {
          "type": 98,
          "value": 0.125
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 98,
            "value": 3
          }
        ],
        "fullSet": [
          {
            "type": 6,
            "value": 1
          },
          {
            "type": 98,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Warrior",
      "displayName": "Iron Wake",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Bash"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "AxeArc"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "AxeVortex"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Stomp"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Bash"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeArc"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeVortex"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Stomp"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Weaver_1",
      "displayName": "Fateweave",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Firebolt"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Icebolt"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Thunderbolt"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Earthbolt"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Firebolt"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Icebolt"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Thunderbolt"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Earthbolt"
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Wizard_1",
      "displayName": "Tempest Engine",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Tempest"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ChainLightning"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "ThunderStorm"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Tempest"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ChainLightning"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ThunderStorm"
        },
        {
          "type": 64,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Wizard_2",
      "displayName": "Frozen Dominion",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "FreezingField"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "IceShard"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FrozenGround"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FreezingField"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "IceShard"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FrozenGround"
        },
        {
          "type": 76,
          "value": 2
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Wizard_3",
      "displayName": "Meteoric Cataclysm",
      "effects": [
        {
          "type": 49,
          "value": 5,
          "skillId": "Meteor"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "FirePillar"
        },
        {
          "type": 49,
          "value": 5,
          "skillId": "Combustion"
        }
      ],
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Meteor"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "FirePillar"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Combustion"
        },
        {
          "type": 70,
          "value": 1
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Wizard_4",
      "displayName": "Arcane Elementalist",
      "effects": [
        {
          "type": 34,
          "value": 1
        }
      ],
      "refineEffects": [
        {
          "type": 42,
          "value": 0.5,
          "skillId": "FreeCast"
        },
        {
          "type": 64,
          "value": 1
        },
        {
          "type": 76,
          "value": 2
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [],
        "fullSet": [
          {
            "type": 6,
            "value": 3
          }
        ]
      }
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
