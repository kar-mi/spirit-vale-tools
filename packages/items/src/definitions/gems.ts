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
          "target": {
            "kind": "skill",
            "id": "AerialShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "ArrowShower"
          }
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
          "target": {
            "kind": "skill",
            "id": "AxeArc"
          }
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
          "target": {
            "kind": "skill",
            "id": "AxeThrow"
          }
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
          "target": {
            "kind": "skill",
            "id": "AxeVortex"
          }
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
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
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
          "target": {
            "kind": "skill",
            "id": "BladeDance"
          }
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
          "target": {
            "kind": "skill",
            "id": "BoneSpear"
          }
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
          "target": {
            "kind": "skill",
            "id": "BoneSpikes"
          }
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
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
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
          "target": {
            "kind": "skill",
            "id": "Consecration"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ConsecratedGround"
          }
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
          "target": {
            "kind": "skill",
            "id": "CorpseExplosionEnemy"
          }
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
          "target": {
            "kind": "skill",
            "id": "CounterSlash"
          }
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
          "target": {
            "kind": "skill",
            "id": "Cyclone"
          }
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
          "target": {
            "kind": "skill",
            "id": "Damnation"
          }
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
          "target": {
            "kind": "skill",
            "id": "DarkClaw"
          }
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
          "target": {
            "kind": "skill",
            "id": "DeathSpiral"
          }
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
          "target": {
            "kind": "skill",
            "id": "TrueSight"
          }
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
          "target": {
            "kind": "skill",
            "id": "DivinePunishment"
          }
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
          "target": {
            "kind": "element",
            "id": "Earth"
          }
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
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
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
          "target": {
            "kind": "skill",
            "id": "Earthquake"
          }
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
          "target": {
            "kind": "skill",
            "id": "EarthSpikes"
          }
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
          "target": {
            "kind": "skill",
            "id": "Execute"
          }
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
          "target": {
            "kind": "skill",
            "id": "Exorcism"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "Dark Exorcism"
          }
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
          "target": {
            "kind": "skill",
            "id": "ExplosiveGrenade"
          }
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
          "target": {
            "kind": "skill",
            "id": "FanFire"
          }
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
          "target": {
            "kind": "skill",
            "id": "FanOfKnives"
          }
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
          "target": {
            "kind": "skill",
            "id": "FieldCurse"
          }
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
          "target": {
            "kind": "skill",
            "id": "FieldDamage"
          }
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
          "target": {
            "kind": "skill",
            "id": "FieldHealing"
          }
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
          "target": {
            "kind": "skill",
            "id": "FieldSilence"
          }
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
          "target": {
            "kind": "element",
            "id": "Fire"
          }
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
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
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
          "target": {
            "kind": "skill",
            "id": "FirePillar"
          }
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
          "target": {
            "kind": "skill",
            "id": "FireRelease"
          }
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
          "target": {
            "kind": "skill",
            "id": "FlameOrb"
          }
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
          "target": {
            "kind": "skill",
            "id": "FlashGrenade"
          }
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
          "target": {
            "kind": "skill",
            "id": "ForceShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "FreezeGrenade"
          }
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
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
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
          "target": {
            "kind": "skill",
            "id": "FrostBlade"
          }
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
          "target": {
            "kind": "skill",
            "id": "GrandCross"
          }
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
          "target": {
            "kind": "skill",
            "id": "GroundSlam"
          }
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
          "target": {
            "kind": "skill",
            "id": "NPC_Poison"
          }
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
          "target": {
            "kind": "skill",
            "id": "Harvest"
          }
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
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
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
          "target": {
            "kind": "skill",
            "id": "HighHeal"
          }
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
          "target": {
            "kind": "element",
            "id": "Holy"
          }
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
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
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
          "target": {
            "kind": "skill",
            "id": "HolyWrath"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "HolyWrathField"
          }
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
          "target": {
            "kind": "skill",
            "id": "HydroVortex"
          }
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
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
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
          "target": {
            "kind": "skill",
            "id": "IceRelease"
          }
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
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
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
          "target": {
            "kind": "skill",
            "id": "JudgementBlade"
          }
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
          "target": {
            "kind": "skill",
            "id": "JumpShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "LifeDrainEnemy"
          }
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
          "target": {
            "kind": "skill",
            "id": "LightningRelease"
          }
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
          "target": {
            "kind": "skill",
            "id": "LightningStrike"
          }
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
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
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
          "target": {
            "kind": "skill",
            "id": "PanicBurst"
          }
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
          "target": {
            "kind": "skill",
            "id": "PiercingShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "PointBlankShot"
          }
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
          "target": {
            "kind": "element",
            "id": "Poison"
          }
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
          "target": {
            "kind": "skill",
            "id": "PoisonGrenade"
          }
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
          "target": {
            "kind": "skill",
            "id": "Reap"
          }
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
          "target": {
            "kind": "skill",
            "id": "Sanctuary"
          }
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
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShadowRelease"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShieldBash"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShoutStun"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShrapnelShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "ShurikenFan"
          }
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
          "target": {
            "kind": "skill",
            "id": "Smite"
          }
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
          "target": {
            "kind": "skill",
            "id": "SniperShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "SoulStrike"
          }
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
          "target": {
            "kind": "skill",
            "id": "SpearSlice"
          }
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
          "target": {
            "kind": "skill",
            "id": "SpearStab"
          }
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
          "target": {
            "kind": "skill",
            "id": "SpearThrust"
          }
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
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        },
        {
          "type": 26,
          "value": 1,
          "target": {
            "kind": "status",
            "id": "Stun"
          }
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
          "target": {
            "kind": "skill",
            "id": "Stomp"
          }
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
          "target": {
            "kind": "skill",
            "id": "StrafingVolley"
          }
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
          "target": {
            "kind": "skill",
            "id": "SuppressiveShot"
          }
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
          "target": {
            "kind": "skill",
            "id": "Tempest"
          }
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
          "target": {
            "kind": "skill",
            "id": "TetraVortex"
          }
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
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
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
          "target": {
            "kind": "skill",
            "id": "ThunderStorm"
          }
        },
        {
          "type": 49,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ThunderField"
          }
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
          "target": {
            "kind": "skill",
            "id": "TurnUndead"
          }
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
          "target": {
            "kind": "skill",
            "id": "TwistOfFate"
          }
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
          "target": {
            "kind": "element",
            "id": "Undead"
          }
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
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
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
          "target": {
            "kind": "skill",
            "id": "VolatileBolt"
          }
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
          "target": {
            "kind": "element",
            "id": "Water"
          }
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
          "target": {
            "kind": "skill",
            "id": "WeaponThrow"
          }
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
          "target": {
            "kind": "skill",
            "id": "Whirlwind"
          }
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
          "target": {
            "kind": "skill",
            "id": "WildCharge"
          }
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
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
