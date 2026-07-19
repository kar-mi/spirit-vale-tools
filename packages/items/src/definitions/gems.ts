import type { FishNetItemDefinition } from "../catalog.ts";

export class GemItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 5,
      "id": "AerialShot Gem",
      "displayName": "Aerial Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "AerialShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ArrowShower Gem",
      "displayName": "Arrow Shower Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ArrowShower"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "AtkSpd Gem",
      "displayName": "Tempo Gem",
      "effects": [
        {
          "type": 63,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 63,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "AxeArc Gem",
      "displayName": "Twin Cleave Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeArc"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "AxeThrow Gem",
      "displayName": "Axe Throw Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeThrow"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "AxeVortex Gem",
      "displayName": "Vortex Slash Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "AxeVortex"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Bash Gem",
      "displayName": "Bash Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Bash"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "BladeDance Gem",
      "displayName": "Blade Dance Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "BladeDance"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "BoneSpear Gem",
      "displayName": "Bone Spear Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "BoneSpear"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "BoneSpikes Gem",
      "displayName": "Bone Spikes Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "BoneSpikes"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "CastSpd Gem",
      "displayName": "Focus Gem",
      "refineEffects": [
        {
          "type": 64,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ChainLightning Gem",
      "displayName": "Chain Lightning Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ChainLightning"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Consecration Gem",
      "displayName": "Consecration Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Consecration"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ConsecratedGround"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "CorpseExplosion Gem",
      "displayName": "Corpse Explosion Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "CorpseExplosionEnemy"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "CounterSlash Gem",
      "displayName": "Counter Slash Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "CounterSlash"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "CritDamage Gem",
      "displayName": "Razor Gem",
      "effects": [
        {
          "type": 52,
          "value": 5
        }
      ],
      "refineEffects": [
        {
          "type": 52,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "CritDef Gem",
      "displayName": "Deflect Gem",
      "refineEffects": [
        {
          "type": 120,
          "value": 3
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Cyclone Gem",
      "displayName": "Cyclone Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Cyclone"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Damnation Gem",
      "displayName": "Damnation Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Damnation"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DarkClaw Gem",
      "displayName": "Dark Claw Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "DarkClaw"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DeathCoil Gem",
      "displayName": "Death Coil Gem",
      "refineEffects": [
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
      ]
    },
    {
      "itemType": 5,
      "id": "DeathNova Gem",
      "displayName": "Death Nova Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathNova"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathNovaField"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DeathSpiral Gem",
      "displayName": "Death Spiral Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "DeathSpiral"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DefMult Gem",
      "displayName": "Bastion Gem",
      "refineEffects": [
        {
          "type": 73,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Detector Gem",
      "displayName": "Seer Gem",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "skillId": "TrueSight"
        }
      ],
      "refineEffects": [
        {
          "type": 195,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DivinePunishment Gem",
      "displayName": "Divine Punishment Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "DivinePunishment"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "DoubleAttack Gem",
      "displayName": "Echo Gem",
      "refineEffects": [
        {
          "type": 80,
          "value": 3
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Earth Gem",
      "displayName": "Earth Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Earth"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Earthbolt Gem",
      "displayName": "Earthbolt Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Earthbolt"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Earthquake Gem",
      "displayName": "Earthquake Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Earthquake"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "EarthSpikes Gem",
      "displayName": "Earth Spikes Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "EarthSpikes"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Execute Gem",
      "displayName": "Execute Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Execute"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Exorcism Gem",
      "displayName": "Exorcism Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Exorcism"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "Dark Exorcism"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ExplosiveGrenade Gem",
      "displayName": "Explosive Grenade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ExplosiveGrenade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FanFire Gem",
      "displayName": "Fan Fire Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FanFire"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FanOfKnives Gem",
      "displayName": "Fan Of Knives Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FanOfKnives"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FieldCurse Gem",
      "displayName": "Banishment Field Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldCurse"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FieldDamage Gem",
      "displayName": "Dissonance Well Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldDamage"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FieldHealing Gem",
      "displayName": "Resonance Well Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldHealing"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FieldSilence Gem",
      "displayName": "Suppression Field Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FieldSilence"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Fire Gem",
      "displayName": "Fire Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Fire"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Fireball Gem",
      "displayName": "Fireball Gem",
      "refineEffects": [
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
      ]
    },
    {
      "itemType": 5,
      "id": "Firebolt Gem",
      "displayName": "Firebolt Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Firebolt"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FirePillar Gem",
      "displayName": "Fire Pillar Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FirePillar"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FireRelease Gem",
      "displayName": "Fire Release Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FireRelease"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FlameOrb Gem",
      "displayName": "Flame Orb Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FlameOrb"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FlashGrenade Gem",
      "displayName": "Flash Grenade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FlashGrenade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Flee Gem",
      "displayName": "Evasion Gem",
      "refineEffects": [
        {
          "type": 14,
          "value": 3
        },
        {
          "type": 121,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ForceShot Gem",
      "displayName": "Force Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ForceShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FreezeGrenade Gem",
      "displayName": "Freeze Grenade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FreezeGrenade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FreezingField Gem",
      "displayName": "Blizzard Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FreezingField"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "FrostBlade Gem",
      "displayName": "Binding Spiral Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "FrostBlade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "GrandCross Gem",
      "displayName": "Grand Cross Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "GrandCross"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "GroundSlam Gem",
      "displayName": "Earth Splitter Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "GroundSlam"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "GunkShot Gem",
      "displayName": "Gunk Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "NPC_Poison"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Harvest Gem",
      "displayName": "Harvest Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Harvest"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Heal Gem",
      "displayName": "Heal Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Heal"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Healing Gem",
      "displayName": "Grace Gem",
      "refineEffects": [
        {
          "type": 67,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "HighHeal Gem",
      "displayName": "High Heal Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "HighHeal"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Hit Gem",
      "displayName": "Precision Gem",
      "refineEffects": [
        {
          "type": 13,
          "value": 3
        },
        {
          "type": 15,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Holy Gem",
      "displayName": "Holy Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Holy"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "HolyLight Gem",
      "displayName": "Holy Light Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "HolyLight"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "HolyWrath Gem",
      "displayName": "Holy Wrath Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "HolyWrath"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "HolyWrathField"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "HpMult Gem",
      "displayName": "Heart Gem",
      "refineEffects": [
        {
          "type": 71,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "HydroVortex Gem",
      "displayName": "Hydro Vortex Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "HydroVortex"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Icebolt Gem",
      "displayName": "Icebolt Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Icebolt"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "IceRelease Gem",
      "displayName": "Ice Release Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "IceRelease"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "IceShard Gem",
      "displayName": "Ice Shard Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "IceShard"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "JudgementBlade Gem",
      "displayName": "Judgement Blade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "JudgementBlade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "JumpShot Gem",
      "displayName": "Jump Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "JumpShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Leech Gem",
      "displayName": "Bloodfang Gem",
      "refineEffects": [
        {
          "type": 98,
          "value": 0.5
        }
      ]
    },
    {
      "itemType": 5,
      "id": "LeechMp Gem",
      "displayName": "Soulfang Gem",
      "refineEffects": [
        {
          "type": 177,
          "value": 0.30000001192092896
        }
      ]
    },
    {
      "itemType": 5,
      "id": "LifeDrain Gem",
      "displayName": "Life Drain Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "LifeDrainEnemy"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "LightningRelease Gem",
      "displayName": "Lightning Release Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "LightningRelease"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "LightningStrike Gem",
      "displayName": "Flash Step Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "LightningStrike"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Matk Gem",
      "displayName": "Overcharge Gem",
      "refineEffects": [
        {
          "type": 70,
          "value": 1
        },
        {
          "type": 90,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "MdefMult Gem",
      "displayName": "Ward Gem",
      "refineEffects": [
        {
          "type": 74,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Meteor Gem",
      "displayName": "Meteor Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Meteor"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "MoveSpd Gem",
      "displayName": "Stride Gem",
      "refineEffects": [
        {
          "type": 65,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "MpCost Gem",
      "displayName": "Channel Gem",
      "refineEffects": [
        {
          "type": 90,
          "value": -2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "MpMult Gem",
      "displayName": "Mind Gem",
      "refineEffects": [
        {
          "type": 72,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "NoCastCancel Gem",
      "displayName": "Mantra Gem",
      "effects": [
        {
          "type": 34,
          "value": 1
        },
        {
          "type": 64,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 64,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "NoFlinch Gem",
      "displayName": "Steadfast Gem",
      "effects": [
        {
          "type": 35,
          "value": 1
        },
        {
          "type": 71,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 71,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "NoKnockback Gem",
      "displayName": "Anchor Gem",
      "effects": [
        {
          "type": 32,
          "value": 1
        },
        {
          "type": 65,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 65,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "PanicBurst Gem",
      "displayName": "Panic Burst Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "PanicBurst"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "PerfectCloak Gem",
      "displayName": "Veil Gem",
      "effects": [
        {
          "type": 122,
          "value": 1
        },
        {
          "type": 72,
          "value": -10
        }
      ],
      "refineEffects": [
        {
          "type": 72,
          "value": 1
        }
      ]
    },
    {
      "itemType": 5,
      "id": "PiercingShot Gem",
      "displayName": "Piercing Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "PiercingShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "PointBlankShot Gem",
      "displayName": "Point Blank Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "PointBlankShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Poison Gem",
      "displayName": "Poison Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Poison"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "PoisonGrenade Gem",
      "displayName": "Poison Grenade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "PoisonGrenade"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Reap Gem",
      "displayName": "Reap Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Reap"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ReflectDamage Gem",
      "displayName": "Spike Gem",
      "refineEffects": [
        {
          "type": 86,
          "value": 3
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ReflectSpell Gem",
      "displayName": "Mirror Gem",
      "refineEffects": [
        {
          "type": 94,
          "value": 2
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Regen Gem",
      "displayName": "Vitalis Gem",
      "refineEffects": [
        {
          "type": 75,
          "value": 3
        },
        {
          "type": 76,
          "value": 3
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Sanctuary Gem",
      "displayName": "Sanctuary Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Sanctuary"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Shadow Gem",
      "displayName": "Shadow Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Shadow"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShadowRelease Gem",
      "displayName": "Black Blade Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowRelease"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShadowStep Gem",
      "displayName": "Shadow Step Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShadowStep"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShieldBash Gem",
      "displayName": "Shield Bash Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShieldBash"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShieldThrow Gem",
      "displayName": "Shield Throw Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShieldThrow"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShoutStun Gem",
      "displayName": "Fearsome Cry Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShoutStun"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShrapnelShot Gem",
      "displayName": "Shrapnel Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShrapnelShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ShurikenFan Gem",
      "displayName": "Shuriken Fan Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ShurikenFan"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Smite Gem",
      "displayName": "Smite Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Smite"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SniperShot Gem",
      "displayName": "Sniper Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SniperShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SoulStrike Gem",
      "displayName": "Soul Strike Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SoulStrike"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SpearSlice Gem",
      "displayName": "Air Cutter Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearSlice"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SpearStab Gem",
      "displayName": "Impale Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearStab"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SpearThrust Gem",
      "displayName": "Piercing Flurry Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SpearThrust"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "StatusResist Gem",
      "displayName": "Tenacity Gem",
      "refineEffects": [
        {
          "type": 26,
          "value": 1,
          "skillId": "Frozen"
        },
        {
          "type": 26,
          "value": 1,
          "skillId": "Stun"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Stomp Gem",
      "displayName": "Stomp Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Stomp"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "StrafingVolley Gem",
      "displayName": "Strafing Volley Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "StrafingVolley"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "SuppressiveShot Gem",
      "displayName": "Suppressive Shot Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "SuppressiveShot"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Tempest Gem",
      "displayName": "Tempest Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Tempest"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "TetraVortex Gem",
      "displayName": "Elemental Overload Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "TetraVortex"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Threat Gem",
      "displayName": "Gaze Gem",
      "refineEffects": [
        {
          "type": 192,
          "value": 10
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Thunderbolt Gem",
      "displayName": "Thunderbolt Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Thunderbolt"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "ThunderStorm Gem",
      "displayName": "Thunder Storm Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "ThunderStorm"
        },
        {
          "type": 49,
          "value": 2,
          "skillId": "ThunderField"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "TurnUndead Gem",
      "displayName": "Turn Undead Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "TurnUndead"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "TwistOfFate Gem",
      "displayName": "Twist Of Fate Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "TwistOfFate"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Undead Gem",
      "displayName": "Undead Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Undead"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "VenomStrike Gem",
      "displayName": "Venom Strike Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "VenomStrike"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "VolatileBolt Gem",
      "displayName": "Volatile Bolt Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "VolatileBolt"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Water Gem",
      "displayName": "Water Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Water"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "WeaponThrow Gem",
      "displayName": "Weapon Throw Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "WeaponThrow"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "WeightLimit Gem",
      "displayName": "Carrier Gem",
      "refineEffects": [
        {
          "type": 101,
          "value": 200
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Whirlwind Gem",
      "displayName": "Whirlwind Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "Whirlwind"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "WildCharge Gem",
      "displayName": "Wild Charge Gem",
      "refineEffects": [
        {
          "type": 49,
          "value": 2,
          "skillId": "WildCharge"
        }
      ]
    },
    {
      "itemType": 5,
      "id": "Wind Gem",
      "displayName": "Wind Gem",
      "refineEffects": [
        {
          "type": 46,
          "value": 1,
          "skillId": "Wind"
        }
      ]
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
