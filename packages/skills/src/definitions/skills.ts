import type { FishNetSkillDefinition } from "../catalog.ts";

export class SkillDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "id": "Acolyte_1",
      "displayName": "Scripture of Mercy",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "37-book",
      "effects": [
        {
          "type": 198,
          "value": 20,
          "label": "SkillDamageLowHp 20"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnCast Heal"
        }
      ]
    },
    {
      "id": "Acolyte_2",
      "displayName": "Radiant Strikes",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "16-Mace",
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnAutoAttack  5"
        },
        {
          "type": -1,
          "value": 10,
          "label": "OnMaxStacks Radiance 10"
        }
      ]
    },
    {
      "id": "Acolyte_3",
      "displayName": "Radiant Judgment",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "20-Staff",
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnCast HolyLight 5"
        }
      ]
    },
    {
      "id": "Acolyte_4",
      "displayName": "Gospel of Grace",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 72,
          "value": 20,
          "label": "MpMult"
        },
        {
          "type": -1,
          "value": 10,
          "label": "OnCast Heal 10"
        }
      ]
    },
    {
      "id": "Acolyte_5",
      "displayName": "Lightweaver",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 124,
          "value": 1,
          "label": "SkillChains 1"
        },
        {
          "type": 204,
          "value": -20,
          "label": "SkillCastTimeMult -20"
        },
        {
          "type": 109,
          "value": 1,
          "label": "SkillRemoveKnockback 1"
        }
      ]
    },
    {
      "id": "Acolyte_6",
      "displayName": "Sacred Rhythm",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 10,
          "label": "OnHeal  10"
        },
        {
          "type": 64,
          "value": 10,
          "label": "CastSpd"
        }
      ]
    },
    {
      "id": "Aegis",
      "displayName": "Aegis of Light",
      "kinds": [
        "active"
      ],
      "spriteId": "3-Aegis"
    },
    {
      "id": "AerialShot",
      "displayName": "Aerial Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_347"
    },
    {
      "id": "Agility",
      "displayName": "Inner Focus",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_81"
    },
    {
      "id": "AngelicBlessing",
      "displayName": "Angelic Blessing",
      "kinds": [
        "active"
      ],
      "spriteId": "47-EnchantArmorHoly"
    },
    {
      "id": "ArcaneSigil",
      "displayName": "Arcane Sigil",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_55"
    },
    {
      "id": "Armored",
      "displayName": "Armored",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_247"
    },
    {
      "id": "ArrowShower",
      "displayName": "Arrow Shower",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_72"
    },
    {
      "id": "AutoAttack",
      "displayName": "Auto Attack",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "AutoattackMastery",
      "displayName": "Deadly Strikes",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Shadow_36",
      "effects": [
        {
          "type": 146,
          "value": 0,
          "valuePerLevel": 5,
          "label": "AutoattackDamage"
        }
      ]
    },
    {
      "id": "AutoStrafe",
      "displayName": "Auto Strafe",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Unholy_46",
      "effects": [
        {
          "type": 40,
          "value": 0,
          "valuePerLevel": 5,
          "label": "AutocastAttack 5"
        }
      ]
    },
    {
      "id": "AxeArc",
      "displayName": "Twin Cleave",
      "kinds": [
        "active"
      ],
      "spriteId": "Barbarian18"
    },
    {
      "id": "AxeMastery",
      "displayName": "Axe Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Barbarian11",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 15,
          "value": 0,
          "valuePerLevel": 1,
          "label": "Crit"
        }
      ]
    },
    {
      "id": "AxeThrow",
      "displayName": "Axe Throw",
      "kinds": [
        "active"
      ],
      "spriteId": "AxeThrow-38"
    },
    {
      "id": "AxeVortex",
      "displayName": "Vortex Slash",
      "kinds": [
        "active"
      ],
      "spriteId": "Barbarian13"
    },
    {
      "id": "Barrier",
      "displayName": "Sacred Aegis",
      "kinds": [
        "active"
      ],
      "spriteId": "16-barrier"
    },
    {
      "id": "Bash",
      "displayName": "Bash",
      "kinds": [
        "active"
      ],
      "spriteId": "Barbarian20"
    },
    {
      "id": "Berserk",
      "displayName": "Berserk",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker11"
    },
    {
      "id": "Berserker_1",
      "displayName": "War Cry",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast ShoutMight"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast ShoutFury"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast ShoutBlood"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast ShoutStun"
        }
      ]
    },
    {
      "id": "Berserker_2",
      "displayName": "Crimson Frenzy",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnCrit "
        }
      ]
    },
    {
      "id": "Berserker_3",
      "displayName": "Slaughter Instinct",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": -1,
          "label": "OnKill  -1"
        },
        {
          "type": -1,
          "value": -1,
          "label": "OnKill  -1"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnKill  5"
        }
      ]
    },
    {
      "id": "Berserker_4",
      "displayName": "Executioner",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 198,
          "value": 25,
          "label": "SkillDamageLowHp 25"
        },
        {
          "type": -1,
          "value": -1,
          "label": "OnKill Execute -1"
        }
      ]
    },
    {
      "id": "BladeDance",
      "displayName": "Blade Dance",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_516"
    },
    {
      "id": "BladeMastery",
      "displayName": "Blade Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_306",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 63,
          "value": 0,
          "valuePerLevel": 1,
          "label": "AtkSpd"
        }
      ]
    },
    {
      "id": "BleedCoating",
      "displayName": "Red Maw",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_339"
    },
    {
      "id": "Blessing",
      "displayName": "Benediction",
      "kinds": [
        "active"
      ],
      "spriteId": "49-blessing"
    },
    {
      "id": "Blink",
      "displayName": "Blink",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_14"
    },
    {
      "id": "BloodCrash",
      "displayName": "Blood Crash",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_31"
    },
    {
      "id": "BloodFrenzy",
      "displayName": "Blood Frenzy",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker16"
    },
    {
      "id": "BloodLust",
      "displayName": "Blood Lust",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_39"
    },
    {
      "id": "BoneSpear",
      "displayName": "Bone Spear",
      "kinds": [
        "active"
      ],
      "spriteId": "BoneSpear"
    },
    {
      "id": "BoneSpikes",
      "displayName": "Bone Spikes",
      "kinds": [
        "active"
      ],
      "spriteId": "BoneSpikes"
    },
    {
      "id": "Bonk",
      "displayName": "Bonk!",
      "kinds": [
        "active"
      ],
      "spriteId": "Paladin1"
    },
    {
      "id": "BossProtocol",
      "displayName": "Boss Protocol",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 200,
          "value": 5,
          "label": "SkillInstances 5"
        },
        {
          "type": 200,
          "value": 5,
          "label": "SkillInstances 5"
        },
        {
          "type": 200,
          "value": 2,
          "label": "SkillInstances 2"
        },
        {
          "type": 199,
          "value": 10,
          "label": "SkillRange 10"
        },
        {
          "type": 199,
          "value": 5,
          "label": "SkillRange 5"
        },
        {
          "type": 199,
          "value": 5,
          "label": "SkillRange 5"
        }
      ]
    },
    {
      "id": "BotHunter",
      "displayName": "Bot Hunter",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 65,
          "value": 200,
          "label": "MoveSpd"
        },
        {
          "type": 139,
          "value": 100,
          "label": "FinalDamageReduction"
        },
        {
          "type": 42,
          "value": 1,
          "label": "GrantSkill 1"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 112,
          "value": 1,
          "label": "Detector"
        },
        {
          "type": 30,
          "value": 1,
          "label": "NoAttack"
        },
        {
          "type": 31,
          "value": 1,
          "label": "NoCast"
        }
      ]
    },
    {
      "id": "ChainLightning",
      "displayName": "Chain Lightning",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_372"
    },
    {
      "id": "Cloaking",
      "displayName": "Cloaking",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_510"
    },
    {
      "id": "CodexMastery",
      "displayName": "Codex Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "38-codex",
      "effects": [
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 67,
          "value": 0,
          "valuePerLevel": 1,
          "label": "Healing"
        }
      ]
    },
    {
      "id": "Combustion",
      "displayName": "Combustion",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_28"
    },
    {
      "id": "Conjurer",
      "displayName": "Conjurer",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_21"
    },
    {
      "id": "ConsecratedGround",
      "displayName": "Consecrated Ground",
      "kinds": [
        "active"
      ],
      "spriteId": "32-Consecration"
    },
    {
      "id": "Consecration",
      "displayName": "Consecration",
      "kinds": [
        "active"
      ],
      "spriteId": "32-Consecration"
    },
    {
      "id": "Conviction",
      "displayName": "Conviction Aura",
      "kinds": [
        "active"
      ],
      "spriteId": "41-Conviction"
    },
    {
      "id": "CorpseBarrier",
      "displayName": "Corpse Barrier",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer15"
    },
    {
      "id": "CorpseExplosion",
      "displayName": "Corpse Explosion",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer14"
    },
    {
      "id": "CorpseExplosionEnemy",
      "displayName": "Corpse Explosion",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CorpseExplosionSummon",
      "displayName": "Corpse Explosion",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Counter",
      "displayName": "Counter Stance",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_331"
    },
    {
      "id": "CounterSlash",
      "displayName": "Counter Slash",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CrimsonFrenzy",
      "displayName": "Crimson Frenzy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CritMastery",
      "displayName": "Honed Blade",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_BloodCombat_91",
      "effects": [
        {
          "type": 52,
          "value": 0,
          "valuePerLevel": 3,
          "label": "CritDamage"
        }
      ]
    },
    {
      "id": "CrushingAdvance",
      "displayName": "Crushing Advance",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Cure",
      "displayName": "Cure",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_552"
    },
    {
      "id": "CureAll",
      "displayName": "Mass Cure",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_36"
    },
    {
      "id": "Cyclone",
      "displayName": "Cyclone",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker5"
    },
    {
      "id": "Damnation",
      "displayName": "Damnation",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_95"
    },
    {
      "id": "Dark Exorcism",
      "displayName": "Dark Exorcism",
      "kinds": [
        "active"
      ],
      "spriteId": "14-exorcism"
    },
    {
      "id": "DarkClaw",
      "displayName": "Dark Claw",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_58"
    },
    {
      "id": "DeathBond",
      "displayName": "Death Bond",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_88"
    },
    {
      "id": "DeathBramble",
      "displayName": "Necrotic Presence",
      "kinds": [
        "active"
      ],
      "spriteId": "48-DeathBramble"
    },
    {
      "id": "DeathBrambleEnemy",
      "displayName": "Necrotic Presence Enemy",
      "kinds": [
        "active"
      ],
      "spriteId": "48-DeathBramble"
    },
    {
      "id": "DeathCoil",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_182"
    },
    {
      "id": "DeathCoilEnemy",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_182"
    },
    {
      "id": "DeathCoilSummon",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_182"
    },
    {
      "id": "DeathNova",
      "displayName": "Death Nova",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_138"
    },
    {
      "id": "DeathNovaField",
      "displayName": "Death Nova Field",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_138"
    },
    {
      "id": "DeathSpiral",
      "displayName": "Death Spiral",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_170"
    },
    {
      "id": "DecayAura",
      "displayName": "Decay Aura",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer2"
    },
    {
      "id": "Defiance",
      "displayName": "Defiance Aura",
      "kinds": [
        "active"
      ],
      "spriteId": "40-Defiance"
    },
    {
      "id": "Deflect",
      "displayName": "Deflect",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_08"
    },
    {
      "id": "Dispell",
      "displayName": "Absolution",
      "kinds": [
        "active"
      ],
      "spriteId": "47-absolution"
    },
    {
      "id": "DivinePunishment",
      "displayName": "Divine Punishment",
      "kinds": [
        "active"
      ],
      "spriteId": "36-DivinePunishment"
    },
    {
      "id": "Divinity",
      "displayName": "Divinity",
      "kinds": [
        "active"
      ],
      "spriteId": "25-Divinity"
    },
    {
      "id": "DoubleAttack",
      "displayName": "Double Attack",
      "kinds": [
        "passive"
      ],
      "effects": [
        {
          "type": 80,
          "value": 0,
          "valuePerLevel": 10,
          "label": "DoubleAttack"
        }
      ]
    },
    {
      "id": "DualWieldMastery",
      "displayName": "Dual Wield Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_334",
      "effects": [
        {
          "type": 87,
          "value": 50,
          "valuePerLevel": 10,
          "label": "DualWield 50"
        }
      ]
    },
    {
      "id": "EarthBarrier",
      "displayName": "Avatar of Stone",
      "kinds": [
        "active"
      ],
      "spriteId": "Geomancer5"
    },
    {
      "id": "Earthbolt",
      "displayName": "Earthbolt",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_157"
    },
    {
      "id": "Earthquake",
      "displayName": "Earthquake",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_76"
    },
    {
      "id": "EarthSpikes",
      "displayName": "Earth Spikes",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_152"
    },
    {
      "id": "EarthWall",
      "displayName": "Earth Wall",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_75"
    },
    {
      "id": "EclipsingAegis",
      "displayName": "Eclipsing Aegis",
      "kinds": [
        "active"
      ],
      "spriteId": "42-barrier"
    },
    {
      "id": "EnchantArmorHoly",
      "displayName": "Sanctify",
      "kinds": [
        "active"
      ],
      "spriteId": "47-EnchantArmorHoly"
    },
    {
      "id": "EnchantEarth",
      "displayName": "Enchant Earth",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_584"
    },
    {
      "id": "EnchantFire",
      "displayName": "Enchant Fire",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_80"
    },
    {
      "id": "EnchantHoly",
      "displayName": "Enchant Holy",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_110"
    },
    {
      "id": "EnchantPoison",
      "displayName": "Enchant Poison",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_497"
    },
    {
      "id": "EnchantShadow",
      "displayName": "Enchant Shadow",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_514"
    },
    {
      "id": "EnchantUndead",
      "displayName": "Enchant Undead",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_77"
    },
    {
      "id": "EnchantWater",
      "displayName": "Enchant Water",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_43"
    },
    {
      "id": "EnchantWind",
      "displayName": "Enchant Wind",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_379"
    },
    {
      "id": "EndowHoly",
      "displayName": "Endow Holy",
      "kinds": [
        "active"
      ],
      "spriteId": "22-endowholy"
    },
    {
      "id": "Endure",
      "displayName": "Endure",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_72"
    },
    {
      "id": "EnergyShield",
      "displayName": "Energy Shield",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_362"
    },
    {
      "id": "Execute",
      "displayName": "Execute",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker15"
    },
    {
      "id": "Exorcism",
      "displayName": "Exorcism",
      "kinds": [
        "active"
      ],
      "spriteId": "14-exorcism"
    },
    {
      "id": "ExplosiveGrenade",
      "displayName": "Explosive Grenade",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_095"
    },
    {
      "id": "Faith",
      "displayName": "Faith",
      "kinds": [
        "passive"
      ],
      "spriteId": "27-Faith",
      "effects": [
        {
          "type": 44,
          "value": 0,
          "valuePerLevel": 5,
          "label": "DamageToElement 5"
        },
        {
          "type": 44,
          "value": 0,
          "valuePerLevel": 5,
          "label": "DamageToElement 5"
        },
        {
          "type": 56,
          "value": 0,
          "valuePerLevel": 5,
          "label": "DamageFromElement 5"
        },
        {
          "type": 56,
          "value": 0,
          "valuePerLevel": 5,
          "label": "DamageFromElement 5"
        }
      ]
    },
    {
      "id": "Fanaticism",
      "displayName": "Fanaticism",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_104"
    },
    {
      "id": "FanFire",
      "displayName": "Fan Fire",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_04"
    },
    {
      "id": "FanOfKnives",
      "displayName": "Fan Of Knives",
      "kinds": [
        "active"
      ],
      "spriteId": "Rogue10"
    },
    {
      "id": "Ferocity",
      "displayName": "Ferocity",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_89"
    },
    {
      "id": "FieldCurse",
      "displayName": "Banishment Field",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_64"
    },
    {
      "id": "FieldDamage",
      "displayName": "Dissonance Well",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Elements_61"
    },
    {
      "id": "FieldHealing",
      "displayName": "Resonance Well",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_19"
    },
    {
      "id": "FieldSilence",
      "displayName": "Suppression Field",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_57"
    },
    {
      "id": "Fireball",
      "displayName": "Fireball",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_096"
    },
    {
      "id": "FireBarrier",
      "displayName": "Avatar of Fire",
      "kinds": [
        "active"
      ],
      "spriteId": "Pyromancer16"
    },
    {
      "id": "Firebolt",
      "displayName": "Firebolt",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_075"
    },
    {
      "id": "FireField",
      "displayName": "Flame Ground",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_095"
    },
    {
      "id": "FirePillar",
      "displayName": "Fire Pillar",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_36"
    },
    {
      "id": "FireRelease",
      "displayName": "Fire Release",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_052"
    },
    {
      "id": "Firewall",
      "displayName": "Firewall",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_060"
    },
    {
      "id": "FlameOrb",
      "displayName": "Flame Orb",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_84"
    },
    {
      "id": "FlameOrbExplosion",
      "displayName": "Flame Explosion",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_84"
    },
    {
      "id": "FlashBang",
      "displayName": "Flash Bang",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_57"
    },
    {
      "id": "FlashGrenade",
      "displayName": "Flash Grenade",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_57"
    },
    {
      "id": "FlowState",
      "displayName": "Flow State",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_570"
    },
    {
      "id": "ForceShot",
      "displayName": "Force Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_048"
    },
    {
      "id": "Fortify",
      "displayName": "Fortify",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Fire_61",
      "effects": [
        {
          "type": 71,
          "value": 0,
          "valuePerLevel": 4,
          "label": "HpMult"
        },
        {
          "type": 68,
          "value": 0,
          "valuePerLevel": 4,
          "label": "HealingReceived"
        },
        {
          "type": 1,
          "value": 0,
          "valuePerLevel": 2,
          "label": "Vit"
        }
      ]
    },
    {
      "id": "FreeCast",
      "displayName": "Free Cast",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_282",
      "effects": [
        {
          "type": 82,
          "value": 15,
          "valuePerLevel": 10,
          "label": "FreeCastMove 15"
        },
        {
          "type": 83,
          "value": 50,
          "valuePerLevel": 10,
          "label": "FreeCastAtk 50"
        }
      ]
    },
    {
      "id": "FreezeGrenade",
      "displayName": "Freeze Grenade",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_072"
    },
    {
      "id": "FreezingEdge",
      "displayName": "Frost Rounds",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_085"
    },
    {
      "id": "FreezingField",
      "displayName": "Blizzard",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_110"
    },
    {
      "id": "FrostBlade",
      "displayName": "Binding Spiral",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_573"
    },
    {
      "id": "FrostBladeExplosion",
      "displayName": "Spiral Collapse",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_573"
    },
    {
      "id": "Frostglass",
      "displayName": "Frostglass",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Frost_63"
    },
    {
      "id": "FrozenGround",
      "displayName": "Frozen Ground",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FuryBond",
      "displayName": "Fury Bond",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Fire_132"
    },
    {
      "id": "GainRage",
      "displayName": "Gain Rage",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker18"
    },
    {
      "id": "GameMaster",
      "displayName": "Game Master",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 6,
          "value": 150,
          "label": "AllStats"
        },
        {
          "type": 65,
          "value": 400,
          "label": "MoveSpd"
        },
        {
          "type": 139,
          "value": 100,
          "label": "FinalDamageReduction"
        },
        {
          "type": 112,
          "value": 1,
          "label": "Detector"
        },
        {
          "type": 42,
          "value": 1,
          "label": "GrantSkill 1"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "GameMasterCloaking",
      "displayName": "Game Master Cloaking",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_510"
    },
    {
      "id": "Grace",
      "displayName": "Divine Grace",
      "kinds": [
        "active"
      ],
      "spriteId": "34-grace"
    },
    {
      "id": "GrandCross",
      "displayName": "Grand Cross",
      "kinds": [
        "active"
      ],
      "spriteId": "12-GrandCross"
    },
    {
      "id": "GraveChill",
      "displayName": "Grave Chill",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer3"
    },
    {
      "id": "GraveChillEnemy",
      "displayName": "Grave Chill Enemy",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer3"
    },
    {
      "id": "GroundSlam",
      "displayName": "Earth Splitter",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker9"
    },
    {
      "id": "GuardianBond",
      "displayName": "Guardian Bond",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_04"
    },
    {
      "id": "GuardianSpirit",
      "displayName": "Guardian Spirit",
      "kinds": [
        "active"
      ],
      "spriteId": "12-GuardianSpirit"
    },
    {
      "id": "GunMastery",
      "displayName": "Gun Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "sf_s_043",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 5,
          "label": "AtkWeapon 5"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 5,
          "label": "AtkWeapon 5"
        },
        {
          "type": 63,
          "value": 0,
          "valuePerLevel": 1,
          "label": "AtkSpd"
        }
      ]
    },
    {
      "id": "Harvest",
      "displayName": "Harvest",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_11"
    },
    {
      "id": "Haste",
      "displayName": "Haste",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_264"
    },
    {
      "id": "HasteAll",
      "displayName": "Mass Haste",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_285"
    },
    {
      "id": "Heal",
      "displayName": "Heal",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Frost_89_green"
    },
    {
      "id": "HealAll",
      "displayName": "Mass Heal",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_215"
    },
    {
      "id": "HeavySwap",
      "displayName": "Heavy Loadout",
      "kinds": [
        "active"
      ],
      "spriteId": "200"
    },
    {
      "id": "HighGuard",
      "displayName": "High Guard",
      "kinds": [
        "active"
      ],
      "spriteId": "29-HighGuard"
    },
    {
      "id": "HighHeal",
      "displayName": "High Heal",
      "kinds": [
        "active"
      ],
      "spriteId": "10-highheal 1"
    },
    {
      "id": "HolyLight",
      "displayName": "Holy Light",
      "kinds": [
        "active"
      ],
      "spriteId": "49-HolyLight"
    },
    {
      "id": "HolyShield",
      "displayName": "Holy Shield",
      "kinds": [
        "active"
      ],
      "spriteId": "33-HolyShield"
    },
    {
      "id": "HolyWrath",
      "displayName": "Holy Wrath",
      "kinds": [
        "active"
      ],
      "spriteId": "31-HolyWrath"
    },
    {
      "id": "HolyWrathField",
      "displayName": "Litany of Wrath",
      "kinds": [
        "active"
      ],
      "spriteId": "Electromancer8"
    },
    {
      "id": "HydroVortex",
      "displayName": "Hydro Vortex",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_143"
    },
    {
      "id": "Icebolt",
      "displayName": "Icebolt",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_555"
    },
    {
      "id": "IceRelease",
      "displayName": "Ice Release",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_137"
    },
    {
      "id": "IceShard",
      "displayName": "Ice Shard",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_574"
    },
    {
      "id": "IncreasedFlee",
      "displayName": "Increased Flee",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_269",
      "effects": [
        {
          "type": 14,
          "value": 0,
          "valuePerLevel": 8,
          "label": "Flee"
        }
      ]
    },
    {
      "id": "IncreasedHealth",
      "displayName": "Increased Health",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_082",
      "effects": [
        {
          "type": 7,
          "value": 0,
          "valuePerLevel": 100,
          "label": "Hp"
        }
      ]
    },
    {
      "id": "IncreasedHealthRegen",
      "displayName": "Increased Regeneration",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_BloodCombat_78",
      "effects": [
        {
          "type": 59,
          "value": 0,
          "valuePerLevel": 5,
          "label": "HpRegen"
        },
        {
          "type": 60,
          "value": 0,
          "valuePerLevel": 0.2,
          "label": "HpRegenMax"
        }
      ]
    },
    {
      "id": "IncreasedMana",
      "displayName": "Increased Mana",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_150",
      "effects": [
        {
          "type": 8,
          "value": 0,
          "valuePerLevel": 40,
          "label": "Mp"
        }
      ]
    },
    {
      "id": "IncreasedManaRegen",
      "displayName": "Increased Recovery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_132",
      "effects": [
        {
          "type": 61,
          "value": 0,
          "valuePerLevel": 2,
          "label": "MpRegen"
        },
        {
          "type": 62,
          "value": 0,
          "valuePerLevel": 0.2,
          "label": "MpRegenMax"
        }
      ]
    },
    {
      "id": "Invoker",
      "displayName": "Invoker",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_26"
    },
    {
      "id": "JudgementBlade",
      "displayName": "Judgement Blade",
      "kinds": [
        "active"
      ],
      "spriteId": "37-JudgementBlade"
    },
    {
      "id": "JumpShot",
      "displayName": "Jump Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_039"
    },
    {
      "id": "Knight_1",
      "displayName": "Breaking Advance",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 202,
          "value": 2,
          "label": "SkillLeap 2"
        },
        {
          "type": 199,
          "value": 10,
          "label": "SkillRange 10"
        },
        {
          "type": 203,
          "value": 2,
          "label": "SkillThreat 2"
        }
      ]
    },
    {
      "id": "Knight_2",
      "displayName": "Sweeping Order",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 197,
          "value": 4,
          "label": "SkillPull 4"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 SpearSlice"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 CounterSlash"
        }
      ]
    },
    {
      "id": "Knight_3",
      "displayName": "Lightning Stance",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 15,
          "value": 20,
          "label": "Crit"
        },
        {
          "type": 14,
          "value": 30,
          "label": "Flee"
        },
        {
          "type": 107,
          "value": 1,
          "label": "SkillHits 1"
        },
        {
          "type": 107,
          "value": 1,
          "label": "SkillHits 1"
        },
        {
          "type": 107,
          "value": 1,
          "label": "SkillHits 1"
        }
      ]
    },
    {
      "id": "Knight_4",
      "displayName": "Rescuing Throw",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 197,
          "value": 4,
          "label": "SkillPull 4"
        },
        {
          "type": 109,
          "value": 1,
          "label": "SkillRemoveKnockback 1"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 WeaponThrow"
        }
      ]
    },
    {
      "id": "Knight_5",
      "displayName": "Iron Response",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 3,
          "label": "OnBlock  3"
        }
      ]
    },
    {
      "id": "Knight_6",
      "displayName": "Vanguard Doctrine",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 Taunt"
        }
      ]
    },
    {
      "id": "LifeBond",
      "displayName": "Life Bond",
      "kinds": [
        "active"
      ],
      "spriteId": "38-LifeBond"
    },
    {
      "id": "LifeDrain",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_50"
    },
    {
      "id": "LifeDrainEnemy",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_50"
    },
    {
      "id": "LifeDrainSummon",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_50"
    },
    {
      "id": "LightningCoat",
      "displayName": "Lightning Coat",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_366"
    },
    {
      "id": "LightningReflexes",
      "displayName": "Lightning Reflexes",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_397"
    },
    {
      "id": "LightningRelease",
      "displayName": "Lightning Release",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_355"
    },
    {
      "id": "LightningStrike",
      "displayName": "Flash Step",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_353"
    },
    {
      "id": "LimitBreak",
      "displayName": "Limit Break",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_44"
    },
    {
      "id": "Lockdown",
      "displayName": "Lockdown",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_06"
    },
    {
      "id": "MaceMastery",
      "displayName": "Mace Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "16-mace-mastery",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 63,
          "value": 0,
          "valuePerLevel": 1,
          "label": "AtkSpd"
        }
      ]
    },
    {
      "id": "Mage_1",
      "displayName": "Elementalist",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "Enchanter20",
      "effects": [
        {
          "type": 210,
          "value": 0,
          "label": "StatusReplace FireAttunement"
        },
        {
          "type": 210,
          "value": 0,
          "label": "StatusReplace WaterAttunement"
        },
        {
          "type": 210,
          "value": 0,
          "label": "StatusReplace WindAttunement"
        },
        {
          "type": 210,
          "value": 0,
          "label": "StatusReplace EarthAttunement"
        }
      ]
    },
    {
      "id": "Mage_2",
      "displayName": "Spellshot",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "39-spellshot",
      "effects": [
        {
          "type": 186,
          "value": 100,
          "label": "AutoattackMatk"
        },
        {
          "type": 96,
          "value": 10,
          "label": "RangeWand"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnAutoAttack  5"
        }
      ]
    },
    {
      "id": "Mage_3",
      "displayName": "Blink Step",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "46-leystep",
      "effects": [
        {
          "type": 199,
          "value": 5,
          "label": "SkillRange 5"
        },
        {
          "type": -1,
          "value": 2,
          "label": "OnCast Blink 2"
        }
      ]
    },
    {
      "id": "Mage_4",
      "displayName": "Ley Pulse",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 72,
          "value": 20,
          "label": "MpMult"
        },
        {
          "type": -1,
          "value": 10,
          "label": "OnKill "
        }
      ]
    },
    {
      "id": "Mage_5",
      "displayName": "Frostglass",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit "
        }
      ]
    },
    {
      "id": "Mage_6",
      "displayName": "Combustion",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit "
        }
      ]
    },
    {
      "id": "Marked",
      "displayName": "Mark Target",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_11"
    },
    {
      "id": "Meteor",
      "displayName": "Meteor",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_054"
    },
    {
      "id": "MeteorStorm",
      "displayName": "Meteor Storm",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "MimicSeal",
      "displayName": "Mimic Seal",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_54"
    },
    {
      "id": "Mount",
      "displayName": "Mount",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_64"
    },
    {
      "id": "MountMastery",
      "displayName": "Gryphon Riding",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_70"
    },
    {
      "id": "Multistrike",
      "displayName": "Multistrike",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_307",
      "effects": [
        {
          "type": 80,
          "value": 0,
          "valuePerLevel": 10,
          "label": "DoubleAttack"
        }
      ]
    },
    {
      "id": "NinjutsuMastery",
      "displayName": "Ninjutsu Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_556",
      "effects": [
        {
          "type": 25,
          "value": 0,
          "valuePerLevel": 1,
          "label": "Range"
        },
        {
          "type": 70,
          "value": 0,
          "valuePerLevel": 2,
          "label": "MatkMult"
        },
        {
          "type": 76,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MpRegenMult"
        },
        {
          "type": 72,
          "value": 0,
          "valuePerLevel": 4,
          "label": "MpMult"
        }
      ]
    },
    {
      "id": "NPC_Berserk",
      "displayName": "Berserk",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_BleedAttack",
      "displayName": "Bleed Attack",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Blind",
      "displayName": "Blind",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Burn",
      "displayName": "Burn",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Enrage",
      "displayName": "Enrage",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Enrage_2",
      "displayName": "Last Stand",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Freeze",
      "displayName": "Freeze",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Knockback",
      "displayName": "Stun",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_LightningReflexes",
      "displayName": "Lightning Reflexes",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_ManaLeech",
      "displayName": "Mana Drain",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Poison",
      "displayName": "Gunk Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_115"
    },
    {
      "id": "NPC_Pull",
      "displayName": "Pull",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_ShadowStep",
      "displayName": "Shadow Step",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Sharpen",
      "displayName": "Sharpen",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Silence",
      "displayName": "Silence",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_SpellGuard",
      "displayName": "Spell Shield",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_SpikedShell",
      "displayName": "Thorns",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_SteelGuard",
      "displayName": "Reinforce",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Stun",
      "displayName": "Stun Attack",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_Venom",
      "displayName": "Venom",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_02"
    },
    {
      "id": "NPC_WideBleed",
      "displayName": "Wide Bleed",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WideBlind",
      "displayName": "Wide Blind",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WideCurse",
      "displayName": "Wide Curse",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WideFreeze",
      "displayName": "Wide Freeze",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WidePoison",
      "displayName": "Wide Poison",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WideSilence",
      "displayName": "Wide Silence",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "NPC_WideStun",
      "displayName": "Wide Stun",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Paladin_1",
      "displayName": "Resolute Pose",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": -1,
          "label": "OnBlock  -1"
        },
        {
          "type": 199,
          "value": 5,
          "label": "SkillRange 5"
        }
      ]
    },
    {
      "id": "Paladin_2",
      "displayName": "Crushing Advance",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnCharge "
        }
      ]
    },
    {
      "id": "Paladin_3",
      "displayName": "Sacred Bastion",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 196,
          "value": 20,
          "label": "HealingToBarrier"
        }
      ]
    },
    {
      "id": "Paladin_4",
      "displayName": "Divine Retribution",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnBlock  5"
        }
      ]
    },
    {
      "id": "PanicBurst",
      "displayName": "Panic Burst",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_106"
    },
    {
      "id": "PiercingShot",
      "displayName": "Piercing Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_03"
    },
    {
      "id": "PointBlankShot",
      "displayName": "Point Blank",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Frost_03"
    },
    {
      "id": "PoisonField",
      "displayName": "Poison Ground",
      "kinds": [
        "active"
      ],
      "spriteId": "151"
    },
    {
      "id": "PoisonGrenade",
      "displayName": "Poison Grenade",
      "kinds": [
        "active"
      ],
      "spriteId": "151"
    },
    {
      "id": "PreciseAim",
      "displayName": "Precise Aim",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_BloodCombat_02",
      "effects": [
        {
          "type": 25,
          "value": 0,
          "valuePerLevel": 1,
          "label": "Range"
        },
        {
          "type": 13,
          "value": 0,
          "valuePerLevel": 2,
          "label": "Hit"
        }
      ]
    },
    {
      "id": "Priest_1",
      "displayName": "Veil of the Exorcist",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 10,
          "label": "OnCast HolyWrath 10"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 HolyWrathField"
        }
      ]
    },
    {
      "id": "Priest_2",
      "displayName": "Martyr's Oath",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnTakePhysicalHit  5"
        }
      ]
    },
    {
      "id": "Priest_3",
      "displayName": "Exorcist's Brand",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 1,
          "label": "SkillApplyStatus 1 Exorcism"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 Exorcism"
        }
      ]
    },
    {
      "id": "Priest_4",
      "displayName": "Eclipsing Aegis",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 209,
          "value": 0,
          "label": "SkillReplace Barrier"
        }
      ]
    },
    {
      "id": "Priest_5",
      "displayName": "Overflowing Grace",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 196,
          "value": 20,
          "label": "HealingToBarrier"
        }
      ]
    },
    {
      "id": "Priest_6",
      "displayName": "Resurrection Pact",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 3,
          "label": "OnRevive  3"
        },
        {
          "type": 145,
          "value": -2,
          "label": "SkillCastTime -2"
        }
      ]
    },
    {
      "id": "Priest_7",
      "displayName": "Purity",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnRemoveStatus  5"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnHeal  5"
        }
      ]
    },
    {
      "id": "Priest_8",
      "displayName": "Sanctuary Doctrine",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 1,
          "label": "OnApplyStatus Sanctuary 1"
        }
      ]
    },
    {
      "id": "RageMastery",
      "displayName": "Brutality",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_BloodCombat_79",
      "effects": [
        {
          "type": 183,
          "value": 0,
          "valuePerLevel": 25,
          "label": "StatusMaxStacks 25"
        }
      ]
    },
    {
      "id": "Reanimation",
      "displayName": "Reanimation",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer5"
    },
    {
      "id": "Reap",
      "displayName": "Reap",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_58"
    },
    {
      "id": "ReapSummon",
      "displayName": "Reap",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ReflectShield",
      "displayName": "Reflect Shield",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_179",
      "effects": [
        {
          "type": 86,
          "value": 0,
          "valuePerLevel": 10,
          "label": "ReflectDamage"
        }
      ]
    },
    {
      "id": "ResistanceMastery",
      "displayName": "Natural Resistance",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Gold_83",
      "effects": [
        {
          "type": 141,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AllResist"
        }
      ]
    },
    {
      "id": "Revive",
      "displayName": "Resurrection",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_181"
    },
    {
      "id": "ReviveAll",
      "displayName": "Salvation",
      "kinds": [
        "active"
      ],
      "spriteId": "25-ReviveAll"
    },
    {
      "id": "Rogue_1",
      "displayName": "Silent Circle",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 2,
          "label": "SkillApplyStatus 2 BladeDance"
        },
        {
          "type": 214,
          "value": 2,
          "label": "SkillApplyStatus 2 ShadowStep"
        }
      ]
    },
    {
      "id": "Rogue_2",
      "displayName": "Shadow Trail",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnCast ShadowStep"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnCast ShadowStep"
        }
      ]
    },
    {
      "id": "Rogue_3",
      "displayName": "Venom Bloom",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnCast VenomStrike"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnKill "
        }
      ]
    },
    {
      "id": "Rogue_4",
      "displayName": "Shadow Dance",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 124,
          "value": 2,
          "label": "SkillChains 2"
        }
      ]
    },
    {
      "id": "Rogue_5",
      "displayName": "Hidden Strikes",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnApplyStatus Cloaking 5"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnKill  5"
        }
      ]
    },
    {
      "id": "Sacrament",
      "displayName": "Sacrament",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_93"
    },
    {
      "id": "SacredBlast",
      "displayName": "Sacred Blast",
      "kinds": [
        "active"
      ],
      "spriteId": "42-barrier"
    },
    {
      "id": "SacredGround",
      "displayName": "Sacred Ground",
      "kinds": [
        "active"
      ],
      "spriteId": "Priest12"
    },
    {
      "id": "Sacrifice",
      "displayName": "Sacrifice",
      "kinds": [
        "active"
      ],
      "spriteId": "48-Sacrifice"
    },
    {
      "id": "Sanctuary",
      "displayName": "Sanctuary",
      "kinds": [
        "active"
      ],
      "spriteId": "24-sanctuary"
    },
    {
      "id": "SanctuaryField",
      "displayName": "Litany of Sanctuary",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Scout_1",
      "displayName": "Chain Reaction",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "T_Icon_Arcane_63",
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnApplyHit  5"
        }
      ]
    },
    {
      "id": "Scout_2",
      "displayName": "Hunting Ground",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "Hunter15",
      "effects": [
        {
          "type": 197,
          "value": 1.5,
          "label": "SkillPull 1.5"
        }
      ]
    },
    {
      "id": "Scout_3",
      "displayName": "Skirmisher's Flow",
      "kinds": [
        "passive",
        "mastery"
      ],
      "spriteId": "22-scout-flow",
      "effects": [
        {
          "type": 190,
          "value": 25,
          "label": "DodgeRecovery"
        },
        {
          "type": -1,
          "value": 2,
          "label": "OnDodge  2"
        }
      ]
    },
    {
      "id": "Scout_4",
      "displayName": "Suppressing Shot",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 ForceShot"
        }
      ]
    },
    {
      "id": "Scout_5",
      "displayName": "Eagle Eye",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 106,
          "value": 3,
          "label": "SkillArea 3"
        },
        {
          "type": 25,
          "value": 1,
          "label": "Range"
        }
      ]
    },
    {
      "id": "ScytheMastery",
      "displayName": "Scythe Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Unholy_171",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 176,
          "value": 0,
          "valuePerLevel": 1,
          "label": "SiphonHp"
        }
      ]
    },
    {
      "id": "ShadowFeint",
      "displayName": "Elusive Feint",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_63"
    },
    {
      "id": "ShadowMastery",
      "displayName": "Shadow Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Shadow_83",
      "effects": [
        {
          "type": 121,
          "value": 0,
          "valuePerLevel": 2,
          "label": "PerfectDodge"
        },
        {
          "type": 65,
          "value": 0,
          "valuePerLevel": 4,
          "label": "MoveSpd"
        },
        {
          "type": 127,
          "value": 0,
          "valuePerLevel": 6,
          "label": "SpellDodge"
        }
      ]
    },
    {
      "id": "ShadowRelease",
      "displayName": "Black Blade",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_322"
    },
    {
      "id": "ShadowSeal",
      "displayName": "Shadow Seal",
      "kinds": [
        "active"
      ],
      "spriteId": "Rogue18"
    },
    {
      "id": "ShadowStep",
      "displayName": "Shadow Step",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_03"
    },
    {
      "id": "ShadowStrike",
      "displayName": "Shadow Strike",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_44"
    },
    {
      "id": "ShadowTrail",
      "displayName": "Shadow Trail",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_519"
    },
    {
      "id": "ShieldBash",
      "displayName": "Shield Bash",
      "kinds": [
        "active"
      ],
      "spriteId": "Paladin13"
    },
    {
      "id": "ShieldMastery",
      "displayName": "Shield Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_535",
      "effects": [
        {
          "type": 95,
          "value": 0,
          "valuePerLevel": 1,
          "label": "BlockShield"
        },
        {
          "type": 73,
          "value": 0,
          "valuePerLevel": 1,
          "label": "DefMult"
        },
        {
          "type": 74,
          "value": 0,
          "valuePerLevel": 1,
          "label": "MdefMult"
        }
      ]
    },
    {
      "id": "ShieldThrow",
      "displayName": "Shield Throw",
      "kinds": [
        "active"
      ],
      "spriteId": "24-ShieldThrow"
    },
    {
      "id": "Shinobi_1",
      "displayName": "Silent Execution",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 198,
          "value": 25,
          "label": "SkillDamageLowHp"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast ShadowStep"
        }
      ]
    },
    {
      "id": "Shinobi_2",
      "displayName": "Sealed Fate",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 0,
          "label": "SkillApplyStatus FireRelease"
        },
        {
          "type": 214,
          "value": 0,
          "label": "SkillApplyStatus IceRelease"
        },
        {
          "type": 214,
          "value": 0,
          "label": "SkillApplyStatus LightningRelease"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit FlameOrb"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit FrostBlade"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit LightningStrike"
        }
      ]
    },
    {
      "id": "Shinobi_3",
      "displayName": "Honed Technique",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 4,
          "label": "OnTeleport  4"
        },
        {
          "type": -1,
          "value": 4,
          "label": "OnApplyStatus Cloaking 4"
        }
      ]
    },
    {
      "id": "Shinobi_4",
      "displayName": "Phantom Manuscript",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 2,
          "label": "OnEndStatus Cloaking 2"
        },
        {
          "type": -1,
          "value": 2,
          "label": "OnEndStatus Cloaking 2"
        }
      ]
    },
    {
      "id": "ShockAbsorber",
      "displayName": "Shock Absorber",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_074"
    },
    {
      "id": "ShoutBlood",
      "displayName": "Blood Howl",
      "kinds": [
        "active"
      ],
      "spriteId": "ShoutBlood-48"
    },
    {
      "id": "ShoutFury",
      "displayName": "Furious Shout",
      "kinds": [
        "active"
      ],
      "spriteId": "ShoutFury-47"
    },
    {
      "id": "ShoutMight",
      "displayName": "Mighty Roar",
      "kinds": [
        "active"
      ],
      "spriteId": "ShoutMight-32"
    },
    {
      "id": "ShoutMightLong",
      "displayName": "War Cry",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShoutStun",
      "displayName": "Fearsome Cry",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_302"
    },
    {
      "id": "ShrapnelShot",
      "displayName": "Shrapnel",
      "kinds": [
        "active"
      ],
      "spriteId": "sf_s_090"
    },
    {
      "id": "ShurikenFan",
      "displayName": "Shuriken Fan",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_30"
    },
    {
      "id": "SilentEdge",
      "displayName": "Silent Edge",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_37"
    },
    {
      "id": "SkeletonMastery",
      "displayName": "Skeleton Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Unholy_150",
      "effects": [
        {
          "type": 132,
          "value": 0,
          "valuePerLevel": 1,
          "label": "SummonAtkMult"
        },
        {
          "type": 133,
          "value": 0,
          "valuePerLevel": 1,
          "label": "SummonMatkMult"
        },
        {
          "type": 175,
          "value": 0,
          "valuePerLevel": 1,
          "label": "SummonResist"
        }
      ]
    },
    {
      "id": "SlowTrap",
      "displayName": "Slow Trap",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_74"
    },
    {
      "id": "Smite",
      "displayName": "Smite",
      "kinds": [
        "active"
      ],
      "spriteId": "50-smite"
    },
    {
      "id": "SmokeScreen",
      "displayName": "Smoke Screen",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_515"
    },
    {
      "id": "SmokeScreenAlly",
      "displayName": "Smoke Screen",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_515"
    },
    {
      "id": "SniperNest",
      "displayName": "Sniper's Nest",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Nature_132"
    },
    {
      "id": "SniperShot",
      "displayName": "Sniper Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_89"
    },
    {
      "id": "SoulDrain",
      "displayName": "Soul Drain",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_151"
    },
    {
      "id": "SoulDrainEnemy",
      "displayName": "Soul Drain Enemy",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_151"
    },
    {
      "id": "SoulStrike",
      "displayName": "Soul Strike",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_027"
    },
    {
      "id": "SpearMastery",
      "displayName": "Spear Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_317",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 7,
          "value": 0,
          "valuePerLevel": 35,
          "label": "Hp"
        }
      ]
    },
    {
      "id": "SpearQuicken",
      "displayName": "Spear Quicken",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_534"
    },
    {
      "id": "SpearSlice",
      "displayName": "Air Cutter",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_337"
    },
    {
      "id": "SpearStab",
      "displayName": "Impale",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_301"
    },
    {
      "id": "SpearThrust",
      "displayName": "Piercing Flurry",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_303"
    },
    {
      "id": "SpellShield",
      "displayName": "Arcanum Ward",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Energy_35"
    },
    {
      "id": "StatusRecovery",
      "displayName": "Status Recovery",
      "kinds": [
        "active"
      ],
      "spriteId": "29-StatusRecovery"
    },
    {
      "id": "SteadyHands",
      "displayName": "Steady Hands",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_268",
      "effects": [
        {
          "type": 54,
          "value": 0,
          "valuePerLevel": 3,
          "label": "AtkWeapon 3"
        },
        {
          "type": 3,
          "value": 0,
          "valuePerLevel": 1,
          "label": "Dex"
        }
      ]
    },
    {
      "id": "Stomp",
      "displayName": "Stomp",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_593"
    },
    {
      "id": "StrafingVolley",
      "displayName": "Strafing Volley",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_005"
    },
    {
      "id": "SummonAbomination",
      "displayName": "Summon Abomination",
      "kinds": [
        "active"
      ],
      "spriteId": "SummonAbomination"
    },
    {
      "id": "SummonAngel",
      "displayName": "Summon Angel",
      "kinds": [
        "active"
      ],
      "spriteId": "Light03"
    },
    {
      "id": "SummonAttack",
      "displayName": "Summon Command",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Tech_07"
    },
    {
      "id": "SummonCactus",
      "displayName": "Summon Cactus",
      "kinds": [
        "active"
      ],
      "spriteId": "Cactus03"
    },
    {
      "id": "SummonCat",
      "displayName": "Summon Cat",
      "kinds": [
        "active"
      ],
      "spriteId": "Cat03"
    },
    {
      "id": "SummonDeathMage",
      "displayName": "Summon Death Mage",
      "kinds": [
        "active"
      ],
      "spriteId": "Dark03"
    },
    {
      "id": "Summoner_1",
      "displayName": "Alpha Surge",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 5,
          "label": "OnAutoAttack  5"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 AxeVortex"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 ShadowRelease"
        }
      ]
    },
    {
      "id": "Summoner_2",
      "displayName": "Hexwell Current",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 FieldDamage"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 Thunderbolt"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 ThunderStorm"
        }
      ]
    },
    {
      "id": "Summoner_3",
      "displayName": "Banishment Well",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 197,
          "value": 4,
          "label": "SkillPull 4"
        },
        {
          "type": 109,
          "value": 1,
          "label": "SkillRemoveKnockback 1"
        },
        {
          "type": 104,
          "value": 2,
          "label": "SkillCooldown 2"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast FieldCurse"
        }
      ]
    },
    {
      "id": "Summoner_4",
      "displayName": "Resonant Wind",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 FieldHealing"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 Smite"
        }
      ]
    },
    {
      "id": "Summoner_5",
      "displayName": "Blessed Resonance",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 FieldHealing"
        }
      ]
    },
    {
      "id": "Summoner_6",
      "displayName": "Soul Chains",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 124,
          "value": 2,
          "label": "SkillChains 2"
        },
        {
          "type": 145,
          "value": 2,
          "label": "SkillCastTime 2"
        }
      ]
    },
    {
      "id": "SummonMastery",
      "displayName": "Summon Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Arcane_53",
      "effects": [
        {
          "type": 92,
          "value": 0,
          "valuePerLevel": 10,
          "label": "SummonStatShare"
        }
      ]
    },
    {
      "id": "SummonMount",
      "displayName": "Summon Mount",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_40"
    },
    {
      "id": "SummonReanimation",
      "displayName": "Summon Reanimation",
      "kinds": [
        "active"
      ],
      "spriteId": "Necromancer12"
    },
    {
      "id": "SummonRecall",
      "displayName": "Summon Recall",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Shadow_95"
    },
    {
      "id": "SummonSkeleton",
      "displayName": "Summon Skeleton",
      "kinds": [
        "active"
      ],
      "spriteId": "Skeleton01"
    },
    {
      "id": "SummonSkeletonMage",
      "displayName": "Summon Skeleton Mage",
      "kinds": [
        "active"
      ],
      "spriteId": "Skeleton02"
    },
    {
      "id": "SummonSwap",
      "displayName": "Summon Swap",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_27"
    },
    {
      "id": "SummonWolf",
      "displayName": "Summon Wolf",
      "kinds": [
        "active"
      ],
      "spriteId": "Wolf03"
    },
    {
      "id": "SummonWraith",
      "displayName": "Summon Wraith",
      "kinds": [
        "active"
      ],
      "spriteId": "Reaper03"
    },
    {
      "id": "SuppressiveShot",
      "displayName": "Suppressive Shot",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_103"
    },
    {
      "id": "Taunt",
      "displayName": "Taunt",
      "kinds": [
        "active"
      ],
      "spriteId": "13-taunt"
    },
    {
      "id": "Tempest",
      "displayName": "Tempest",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_369"
    },
    {
      "id": "TetraVortex",
      "displayName": "Elemental Overload",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_86"
    },
    {
      "id": "TetraVortexEarth",
      "displayName": "Overload Earth",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_86"
    },
    {
      "id": "TetraVortexFire",
      "displayName": "Overload Fire",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_86"
    },
    {
      "id": "TetraVortexWater",
      "displayName": "Overload Ice",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_86"
    },
    {
      "id": "TetraVortexWind",
      "displayName": "Overload Wind",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_86"
    },
    {
      "id": "Thunderbolt",
      "displayName": "Thunderbolt",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_360"
    },
    {
      "id": "ThunderField",
      "displayName": "Static Field",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_359"
    },
    {
      "id": "ThunderStorm",
      "displayName": "Thunder Storm",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_354"
    },
    {
      "id": "TriggerHappy",
      "displayName": "Trigger Happy",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_BloodCombat_10"
    },
    {
      "id": "TrueSight",
      "displayName": "True Sight",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_179"
    },
    {
      "id": "TurnUndead",
      "displayName": "Turn Undead",
      "kinds": [
        "active"
      ],
      "spriteId": "Priest13"
    },
    {
      "id": "TwistOfFate",
      "displayName": "Twist Of Fate",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_136"
    },
    {
      "id": "TwohandParry",
      "displayName": "Twohand Parry",
      "kinds": [
        "passive"
      ],
      "spriteId": "Paladin10",
      "effects": [
        {
          "type": 85,
          "value": 0,
          "valuePerLevel": 6,
          "label": "Block"
        }
      ]
    },
    {
      "id": "TwohandQuicken",
      "displayName": "Axe Quicken",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_380"
    },
    {
      "id": "UmbralExplosion",
      "displayName": "Umbral Rupture",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "UmbralField",
      "displayName": "Umbral Decay",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Elements_61"
    },
    {
      "id": "UmbralWide",
      "displayName": "Umbral Collapse",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "UnholyAura",
      "displayName": "Unholy Aura",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_148"
    },
    {
      "id": "Unyielding",
      "displayName": "Unyielding",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker8"
    },
    {
      "id": "VenomBloom",
      "displayName": "Venom Bloom",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_499"
    },
    {
      "id": "VenomCoating",
      "displayName": "Venom Coating",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Unholy_02"
    },
    {
      "id": "VenomStrike",
      "displayName": "Venom Strike",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_499"
    },
    {
      "id": "Vitality",
      "displayName": "Vitality Aura",
      "kinds": [
        "active"
      ],
      "spriteId": "39-Vitality"
    },
    {
      "id": "VolatileBolt",
      "displayName": "Volatile Bolt",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_009"
    },
    {
      "id": "VolatileExplosion",
      "displayName": "Volatile Explosion",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Arcane_63"
    },
    {
      "id": "WandMastery",
      "displayName": "Wand Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "Skills_525",
      "effects": [
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 55,
          "value": 0,
          "valuePerLevel": 3,
          "label": "MatkWeapon 3"
        },
        {
          "type": 64,
          "value": 0,
          "valuePerLevel": 1,
          "label": "CastSpd"
        }
      ]
    },
    {
      "id": "Warrior_1",
      "displayName": "Bloodtrail",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 208,
          "value": 15,
          "label": "SkillDamageVsStatus 15 AxeArc"
        },
        {
          "type": 208,
          "value": 15,
          "label": "SkillDamageVsStatus 15 AxeVortex"
        },
        {
          "type": 218,
          "value": 15,
          "label": "DamageVsStatus 15"
        }
      ]
    },
    {
      "id": "Warrior_2",
      "displayName": "Breakjaw",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 203,
          "value": 2,
          "label": "SkillThreat 2"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnCharge  5"
        },
        {
          "type": 192,
          "value": 150,
          "label": "ThreatMult"
        }
      ]
    },
    {
      "id": "Warrior_3",
      "displayName": "Warmaw",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 197,
          "value": 4,
          "label": "SkillPull 4"
        },
        {
          "type": -1,
          "value": 5,
          "label": "OnCast AxeArc 5"
        }
      ]
    },
    {
      "id": "Warrior_4",
      "displayName": "Bloodprice",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 10,
          "label": "OnHealthLow  10"
        }
      ]
    },
    {
      "id": "Warrior_5",
      "displayName": "Warpath",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 1,
          "label": "SkillApplyStatus 1 Whirlwind"
        },
        {
          "type": -1,
          "value": 3,
          "label": "OnApplyStatus Spinning 3"
        }
      ]
    },
    {
      "id": "WaterBarrier",
      "displayName": "Avatar of Frost",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_117"
    },
    {
      "id": "WeaponSwap",
      "displayName": "Dual Loadout",
      "kinds": [
        "active"
      ],
      "spriteId": "107"
    },
    {
      "id": "WeaponThrow",
      "displayName": "Weapon Throw",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_308"
    },
    {
      "id": "Weaver_1",
      "displayName": "Weave of Counter",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 141,
          "value": 10,
          "label": "AllResist"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "Weaver_2",
      "displayName": "Weave of Guardian",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 67,
          "value": 10,
          "label": "Healing"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "Weaver_3",
      "displayName": "Weave of Arcana",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 48,
          "value": 10,
          "label": "DamageMagic"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "Weaver_4",
      "displayName": "Weave of Fury",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 47,
          "value": 10,
          "label": "DamageMelee"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "Weaver_5",
      "displayName": "Weave of Marksman",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 102,
          "value": 10,
          "label": "DamageRanged"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        },
        {
          "type": 42,
          "value": 5,
          "label": "GrantSkill 5"
        }
      ]
    },
    {
      "id": "WeaverMastery",
      "displayName": "Weaver Mastery",
      "kinds": [
        "passive"
      ],
      "spriteId": "T_Icon_Gold_98",
      "effects": [
        {
          "type": 9,
          "value": 0,
          "valuePerLevel": 3,
          "label": "Atk"
        },
        {
          "type": 10,
          "value": 0,
          "valuePerLevel": 3,
          "label": "Matk"
        },
        {
          "type": 6,
          "value": 0,
          "valuePerLevel": 1,
          "label": "AllStats"
        },
        {
          "type": 148,
          "value": 3,
          "label": "SkillSplash"
        }
      ]
    },
    {
      "id": "Whirlwind",
      "displayName": "Whirlwind",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_565"
    },
    {
      "id": "WildCharge",
      "displayName": "Wild Charge",
      "kinds": [
        "active"
      ],
      "spriteId": "Berserker1"
    },
    {
      "id": "WindBarrier",
      "displayName": "Avatar of Storm",
      "kinds": [
        "active"
      ],
      "spriteId": "Skills_356"
    },
    {
      "id": "Wizard_1",
      "displayName": "Jupiter's Wrath",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 205,
          "value": 100,
          "label": "SkillHitsMult 100"
        },
        {
          "type": 204,
          "value": 20,
          "label": "SkillCastTimeMult 20"
        },
        {
          "type": 124,
          "value": -10,
          "label": "SkillChains -10"
        }
      ]
    },
    {
      "id": "Wizard_2",
      "displayName": "Voltaic Overdraw",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit ChainLightning"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit Tempest"
        }
      ]
    },
    {
      "id": "Wizard_3",
      "displayName": "Eye of the Storm",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 124,
          "value": 2,
          "label": "SkillChains 2"
        },
        {
          "type": 214,
          "value": 5,
          "label": "SkillApplyStatus 5 ChainLightning"
        }
      ]
    },
    {
      "id": "Wizard_4",
      "displayName": "Stonewake",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 206,
          "value": 100,
          "label": "SkillDurationMult 100"
        },
        {
          "type": 214,
          "value": 1,
          "label": "SkillApplyStatus 1 EarthWall"
        }
      ]
    },
    {
      "id": "Wizard_5",
      "displayName": "Focused Amplification",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 138,
          "value": 20,
          "label": "FinalDamage"
        },
        {
          "type": 188,
          "value": -10,
          "label": "CastTimeReductionLimit"
        }
      ]
    },
    {
      "id": "Wizard_6",
      "displayName": "Mana Surge",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 10,
          "label": "OnCast  10"
        }
      ]
    },
    {
      "id": "Wizard_7",
      "displayName": "Arcane Barrier",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 1,
          "label": "OnApplyStatus FireBarrier 1"
        },
        {
          "type": -1,
          "value": 1,
          "label": "OnApplyStatus WaterBarrier 1"
        },
        {
          "type": -1,
          "value": 1,
          "label": "OnApplyStatus WindBarrier 1"
        },
        {
          "type": -1,
          "value": 1,
          "label": "OnApplyStatus EarthBarrier 1"
        }
      ]
    },
    {
      "id": "Wizard_Artifact_1",
      "displayName": "Tempest Engine",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 214,
          "value": 10,
          "label": "SkillApplyStatus 10 Tempest"
        },
        {
          "type": 214,
          "value": 10,
          "label": "SkillApplyStatus 10 ChainLightning"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit ChainLightning"
        }
      ]
    },
    {
      "id": "Wizard_Artifact_2",
      "displayName": "Frozen Dominion",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": 211,
          "value": 30,
          "label": "StatusDuration 30"
        },
        {
          "type": 109,
          "value": 1,
          "label": "SkillRemoveKnockback 1"
        },
        {
          "type": 213,
          "value": 0,
          "label": "SkillAutocast FreezingField"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyHit IceShard"
        }
      ]
    },
    {
      "id": "Wizard_Artifact_3",
      "displayName": "Meteoric Cataclysm",
      "kinds": [
        "passive",
        "mastery"
      ],
      "effects": [
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyStatus Burning"
        },
        {
          "type": -1,
          "value": 0,
          "label": "OnApplyStatus Stun"
        },
        {
          "type": 212,
          "value": 2,
          "label": "SkillMaxInstances 2"
        },
        {
          "type": 209,
          "value": 0,
          "label": "SkillReplace Meteor"
        }
      ]
    },
    {
      "id": "Zeal",
      "displayName": "Zeal",
      "kinds": [
        "active"
      ],
      "spriteId": "T_Icon_Gold_92"
    }
  ] as const satisfies readonly FishNetSkillDefinition[];
}
