import type { FishNetItemDefinition } from "../catalog.ts";

export class ArtifactItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 3,
      "id": "Acolyte",
      "displayName": "Holy Vow",
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "HolyLight"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Heal"
            }
          }
        ],
        "Scroll": [],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "HolyLight"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Heal"
            }
          }
        ],
        "Scroll": [
          {
            "type": 67,
            "value": 1
          }
        ],
        "Relic": [
          {
            "type": 90,
            "value": -2
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 32,
            "value": 1
          }
        ],
        "Jewel": [
          {
            "type": 35,
            "value": 1
          }
        ],
        "Scroll": [
          {
            "type": 34,
            "value": 1
          }
        ],
        "Relic": [
          {
            "type": 36,
            "value": 1
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Execute"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Cyclone"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "AxeThrow"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "DarkClaw"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Execute"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Cyclone"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "AxeThrow"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "DarkClaw"
            }
          }
        ]
      },
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
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Poison"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Undead"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Shadow"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Holy"
            }
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
            "target": {
              "kind": "element",
              "id": "Poison"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Undead"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Shadow"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Holy"
            }
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "PanicBurst"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "PointBlankShot"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "SniperShot"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ExplosiveGrenade"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "PanicBurst"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "PointBlankShot"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "SniperShot"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ExplosiveGrenade"
            }
          }
        ]
      },
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
      "refineEffects": [
        {
          "type": 26,
          "value": 2.5,
          "target": {
            "kind": "status",
            "id": "Stun"
          }
        }
      ],
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 26,
            "value": 50,
            "target": {
              "kind": "status",
              "id": "Blind"
            }
          }
        ],
        "Jewel": [
          {
            "type": 26,
            "value": 50,
            "target": {
              "kind": "status",
              "id": "Silence"
            }
          }
        ],
        "Scroll": [
          {
            "type": 26,
            "value": 50,
            "target": {
              "kind": "status",
              "id": "Poison"
            }
          }
        ],
        "Relic": [
          {
            "type": 26,
            "value": 50,
            "target": {
              "kind": "status",
              "id": "Bleeding"
            }
          }
        ]
      },
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
            "target": {
              "kind": "status",
              "id": "Slow"
            }
          }
        ]
      }
    },
    {
      "itemType": 3,
      "id": "Knight",
      "displayName": "Honored Oath",
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "SpearThrust"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "SpearStab"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "SpearSlice"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "WeaponThrow"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "SpearThrust"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "SpearStab"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "SpearSlice"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "WeaponThrow"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Fireball"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "IceShard"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "EarthSpikes"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ThunderStorm"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Fireball"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "IceShard"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "EarthSpikes"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ThunderStorm"
            }
          }
        ]
      },
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
            "target": {
              "kind": "skill",
              "id": "EnergyShield"
            }
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "BoneSpikes"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "DeathSpiral"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "DeathNova"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "CorpseExplosionEnemy"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "BoneSpikes"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "DeathSpiral"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "DeathNova"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "CorpseExplosionEnemy"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "GrandCross"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "JudgementBlade"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ShieldThrow"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Consecration"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "GrandCross"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "JudgementBlade"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ShieldThrow"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Consecration"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Exorcism"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "HolyWrath"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "TurnUndead"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Smite"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Exorcism"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "HolyWrath"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "TurnUndead"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Smite"
            }
          }
        ]
      },
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 46,
          "value": 0.125,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ],
      "artifactSet": {
        "requiredPieces": 4,
        "perPieceBase": [],
        "perPiece": [
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Fire"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Water"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Wind"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Earth"
            }
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
            "target": {
              "kind": "element",
              "id": "Fire"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Water"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Wind"
            }
          },
          {
            "type": 46,
            "value": 3,
            "target": {
              "kind": "element",
              "id": "Earth"
            }
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "VenomStrike"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ShadowStep"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "BladeDance"
            }
          }
        ],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "VenomStrike"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ShadowStep"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "BladeDance"
            }
          }
        ],
        "Relic": [
          {
            "type": 142,
            "value": 2
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "StrafingVolley"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ForceShot"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "VolatileBolt"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ArrowShower"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "StrafingVolley"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ForceShot"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "VolatileBolt"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ArrowShower"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FlameOrb"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FrostBlade"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "LightningStrike"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ShadowRelease"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FlameOrb"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FrostBlade"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "LightningStrike"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ShadowRelease"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "SoulStrike"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FieldCurse"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FieldHealing"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FieldDamage"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "SoulStrike"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FieldCurse"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FieldHealing"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FieldDamage"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Bash"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "AxeArc"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "AxeVortex"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Stomp"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Bash"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "AxeArc"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "AxeVortex"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Stomp"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Firebolt"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Icebolt"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Thunderbolt"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Earthbolt"
            }
          }
        ]
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Firebolt"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Icebolt"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Thunderbolt"
            }
          }
        ],
        "Relic": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Earthbolt"
            }
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Tempest"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ChainLightning"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "ThunderStorm"
            }
          }
        ],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Tempest"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ChainLightning"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "ThunderStorm"
            }
          }
        ],
        "Relic": [
          {
            "type": 64,
            "value": 1
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FreezingField"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "IceShard"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FrozenGround"
            }
          }
        ],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FreezingField"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "IceShard"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FrozenGround"
            }
          }
        ],
        "Relic": [
          {
            "type": 76,
            "value": 2
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Meteor"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "FirePillar"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 5,
            "target": {
              "kind": "skill",
              "id": "Combustion"
            }
          }
        ],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Meteor"
            }
          }
        ],
        "Jewel": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "FirePillar"
            }
          }
        ],
        "Scroll": [
          {
            "type": 49,
            "value": 2,
            "target": {
              "kind": "skill",
              "id": "Combustion"
            }
          }
        ],
        "Relic": [
          {
            "type": 70,
            "value": 1
          }
        ]
      },
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
      "artifactSlotEffects": {
        "Rune": [
          {
            "type": 34,
            "value": 1
          }
        ],
        "Jewel": [],
        "Scroll": [],
        "Relic": []
      },
      "artifactSlotRefineEffects": {
        "Rune": [],
        "Jewel": [
          {
            "type": 42,
            "value": 0.5,
            "target": {
              "kind": "skill",
              "id": "FreeCast"
            }
          }
        ],
        "Scroll": [
          {
            "type": 64,
            "value": 1
          }
        ],
        "Relic": [
          {
            "type": 76,
            "value": 2
          }
        ]
      },
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
