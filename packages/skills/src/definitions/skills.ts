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
      ]
    },
    {
      "id": "AerialShot",
      "displayName": "Aerial Shot",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Agility",
      "displayName": "Inner Focus",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "AngelicBlessing",
      "displayName": "Angelic Blessing",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ArcaneSigil",
      "displayName": "Arcane Sigil",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Armored",
      "displayName": "Armored",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ArrowShower",
      "displayName": "Arrow Shower",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "AxeMastery",
      "displayName": "Axe Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "AxeVortex",
      "displayName": "Vortex Slash",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Barrier",
      "displayName": "Sacred Aegis",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Bash",
      "displayName": "Bash",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Berserk",
      "displayName": "Berserk",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "BladeMastery",
      "displayName": "Blade Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Blessing",
      "displayName": "Benediction",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Blink",
      "displayName": "Blink",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "BloodCrash",
      "displayName": "Blood Crash",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "BloodFrenzy",
      "displayName": "Blood Frenzy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "BloodLust",
      "displayName": "Blood Lust",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "BoneSpear",
      "displayName": "Bone Spear",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "BoneSpikes",
      "displayName": "Bone Spikes",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Bonk",
      "displayName": "Bonk!",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "Cloaking",
      "displayName": "Cloaking",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CodexMastery",
      "displayName": "Codex Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Conjurer",
      "displayName": "Conjurer",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ConsecratedGround",
      "displayName": "Consecrated Ground",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Consecration",
      "displayName": "Consecration",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Conviction",
      "displayName": "Conviction Aura",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CorpseBarrier",
      "displayName": "Corpse Barrier",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "CorpseExplosion",
      "displayName": "Corpse Explosion",
      "kinds": [
        "active"
      ]
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
      ]
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
      ]
    },
    {
      "id": "CureAll",
      "displayName": "Mass Cure",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Cyclone",
      "displayName": "Cyclone",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Damnation",
      "displayName": "Damnation",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Dark Exorcism",
      "displayName": "Dark Exorcism",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DarkClaw",
      "displayName": "Dark Claw",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathBond",
      "displayName": "Death Bond",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathBramble",
      "displayName": "Necrotic Presence",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathBrambleEnemy",
      "displayName": "Necrotic Presence Enemy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathCoil",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathCoilEnemy",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathCoilSummon",
      "displayName": "Death Coil",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathNova",
      "displayName": "Death Nova",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathNovaField",
      "displayName": "Death Nova Field",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DeathSpiral",
      "displayName": "Death Spiral",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DecayAura",
      "displayName": "Decay Aura",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Defiance",
      "displayName": "Defiance Aura",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Deflect",
      "displayName": "Deflect",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Dispell",
      "displayName": "Absolution",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "DivinePunishment",
      "displayName": "Divine Punishment",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Divinity",
      "displayName": "Divinity",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "Earthbolt",
      "displayName": "Earthbolt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Earthquake",
      "displayName": "Earthquake",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EarthSpikes",
      "displayName": "Earth Spikes",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EarthWall",
      "displayName": "Earth Wall",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EclipsingAegis",
      "displayName": "Eclipsing Aegis",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantArmorHoly",
      "displayName": "Sanctify",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantEarth",
      "displayName": "Enchant Earth",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantFire",
      "displayName": "Enchant Fire",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantHoly",
      "displayName": "Enchant Holy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantPoison",
      "displayName": "Enchant Poison",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantShadow",
      "displayName": "Enchant Shadow",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantUndead",
      "displayName": "Enchant Undead",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantWater",
      "displayName": "Enchant Water",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnchantWind",
      "displayName": "Enchant Wind",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EndowHoly",
      "displayName": "Endow Holy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Endure",
      "displayName": "Endure",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "EnergyShield",
      "displayName": "Energy Shield",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Execute",
      "displayName": "Execute",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Exorcism",
      "displayName": "Exorcism",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ExplosiveGrenade",
      "displayName": "Explosive Grenade",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Faith",
      "displayName": "Faith",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "FanFire",
      "displayName": "Fan Fire",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FanOfKnives",
      "displayName": "Fan Of Knives",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Ferocity",
      "displayName": "Ferocity",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FieldCurse",
      "displayName": "Banishment Field",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FieldDamage",
      "displayName": "Dissonance Well",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FieldHealing",
      "displayName": "Resonance Well",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FieldSilence",
      "displayName": "Suppression Field",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Fireball",
      "displayName": "Fireball",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FireBarrier",
      "displayName": "Avatar of Fire",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Firebolt",
      "displayName": "Firebolt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FireField",
      "displayName": "Flame Ground",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FirePillar",
      "displayName": "Fire Pillar",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FireRelease",
      "displayName": "Fire Release",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Firewall",
      "displayName": "Firewall",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FlameOrb",
      "displayName": "Flame Orb",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FlameOrbExplosion",
      "displayName": "Flame Explosion",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FlashBang",
      "displayName": "Flash Bang",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FlashGrenade",
      "displayName": "Flash Grenade",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FlowState",
      "displayName": "Flow State",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ForceShot",
      "displayName": "Force Shot",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Fortify",
      "displayName": "Fortify",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "FreezingEdge",
      "displayName": "Frost Rounds",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FreezingField",
      "displayName": "Blizzard",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FrostBlade",
      "displayName": "Binding Spiral",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "FrostBladeExplosion",
      "displayName": "Spiral Collapse",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Frostglass",
      "displayName": "Frostglass",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "GainRage",
      "displayName": "Gain Rage",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "Grace",
      "displayName": "Divine Grace",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GrandCross",
      "displayName": "Grand Cross",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GraveChill",
      "displayName": "Grave Chill",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GraveChillEnemy",
      "displayName": "Grave Chill Enemy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GroundSlam",
      "displayName": "Earth Splitter",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GuardianBond",
      "displayName": "Guardian Bond",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GuardianSpirit",
      "displayName": "Guardian Spirit",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "GunMastery",
      "displayName": "Gun Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Haste",
      "displayName": "Haste",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HasteAll",
      "displayName": "Mass Haste",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Heal",
      "displayName": "Heal",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HealAll",
      "displayName": "Mass Heal",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HeavySwap",
      "displayName": "Heavy Loadout",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HighGuard",
      "displayName": "High Guard",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HighHeal",
      "displayName": "High Heal",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HolyLight",
      "displayName": "Holy Light",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HolyShield",
      "displayName": "Holy Shield",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HolyWrath",
      "displayName": "Holy Wrath",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HolyWrathField",
      "displayName": "Litany of Wrath",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "HydroVortex",
      "displayName": "Hydro Vortex",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Icebolt",
      "displayName": "Icebolt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "IceRelease",
      "displayName": "Ice Release",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "IceShard",
      "displayName": "Ice Shard",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "IncreasedFlee",
      "displayName": "Increased Flee",
      "kinds": [
        "passive"
      ],
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
          "valuePerLevel": 0.20000000298023224,
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
          "valuePerLevel": 0.20000000298023224,
          "label": "MpRegenMax"
        }
      ]
    },
    {
      "id": "Invoker",
      "displayName": "Invoker",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "JudgementBlade",
      "displayName": "Judgement Blade",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "JumpShot",
      "displayName": "Jump Shot",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "LifeDrain",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LifeDrainEnemy",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LifeDrainSummon",
      "displayName": "Life Drain",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LightningCoat",
      "displayName": "Lightning Coat",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LightningReflexes",
      "displayName": "Lightning Reflexes",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LightningRelease",
      "displayName": "Lightning Release",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LightningStrike",
      "displayName": "Flash Step",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "LimitBreak",
      "displayName": "Limit Break",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Lockdown",
      "displayName": "Lockdown",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "MaceMastery",
      "displayName": "Mace Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Meteor",
      "displayName": "Meteor",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "Mount",
      "displayName": "Mount",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "MountMastery",
      "displayName": "Gryphon Riding",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Multistrike",
      "displayName": "Multistrike",
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
      "id": "NinjutsuMastery",
      "displayName": "Ninjutsu Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
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
      ]
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
      ]
    },
    {
      "id": "PiercingShot",
      "displayName": "Piercing Shot",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "PointBlankShot",
      "displayName": "Point Blank",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "PoisonField",
      "displayName": "Poison Ground",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "PoisonGrenade",
      "displayName": "Poison Grenade",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "PreciseAim",
      "displayName": "Precise Aim",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Reap",
      "displayName": "Reap",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "ReviveAll",
      "displayName": "Salvation",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "SacredBlast",
      "displayName": "Sacred Blast",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SacredGround",
      "displayName": "Sacred Ground",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Sacrifice",
      "displayName": "Sacrifice",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Sanctuary",
      "displayName": "Sanctuary",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "ShadowMastery",
      "displayName": "Shadow Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "ShadowSeal",
      "displayName": "Shadow Seal",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShadowStep",
      "displayName": "Shadow Step",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShadowStrike",
      "displayName": "Shadow Strike",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShadowTrail",
      "displayName": "Shadow Trail",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShieldBash",
      "displayName": "Shield Bash",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShieldMastery",
      "displayName": "Shield Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
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
      ]
    },
    {
      "id": "ShoutBlood",
      "displayName": "Blood Howl",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShoutFury",
      "displayName": "Furious Shout",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShoutMight",
      "displayName": "Mighty Roar",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "ShrapnelShot",
      "displayName": "Shrapnel",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ShurikenFan",
      "displayName": "Shuriken Fan",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SilentEdge",
      "displayName": "Silent Edge",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SkeletonMastery",
      "displayName": "Skeleton Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "Smite",
      "displayName": "Smite",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SmokeScreen",
      "displayName": "Smoke Screen",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SmokeScreenAlly",
      "displayName": "Smoke Screen",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SniperNest",
      "displayName": "Sniper's Nest",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SniperShot",
      "displayName": "Sniper Shot",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SoulDrain",
      "displayName": "Soul Drain",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SoulDrainEnemy",
      "displayName": "Soul Drain Enemy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SoulStrike",
      "displayName": "Soul Strike",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SpearMastery",
      "displayName": "Spear Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "SpearSlice",
      "displayName": "Air Cutter",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SpearStab",
      "displayName": "Impale",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SpearThrust",
      "displayName": "Piercing Flurry",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SpellShield",
      "displayName": "Arcanum Ward",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "StatusRecovery",
      "displayName": "Status Recovery",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SteadyHands",
      "displayName": "Steady Hands",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "StrafingVolley",
      "displayName": "Strafing Volley",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonAbomination",
      "displayName": "Summon Abomination",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonAngel",
      "displayName": "Summon Angel",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonAttack",
      "displayName": "Summon Command",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonCactus",
      "displayName": "Summon Cactus",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonCat",
      "displayName": "Summon Cat",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonDeathMage",
      "displayName": "Summon Death Mage",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "SummonReanimation",
      "displayName": "Summon Reanimation",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonRecall",
      "displayName": "Summon Recall",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonSkeleton",
      "displayName": "Summon Skeleton",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonSkeletonMage",
      "displayName": "Summon Skeleton Mage",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonSwap",
      "displayName": "Summon Swap",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonWolf",
      "displayName": "Summon Wolf",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SummonWraith",
      "displayName": "Summon Wraith",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "SuppressiveShot",
      "displayName": "Suppressive Shot",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Taunt",
      "displayName": "Taunt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Tempest",
      "displayName": "Tempest",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TetraVortex",
      "displayName": "Elemental Overload",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TetraVortexEarth",
      "displayName": "Overload Earth",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TetraVortexFire",
      "displayName": "Overload Fire",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TetraVortexWater",
      "displayName": "Overload Ice",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TetraVortexWind",
      "displayName": "Overload Wind",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Thunderbolt",
      "displayName": "Thunderbolt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ThunderField",
      "displayName": "Static Field",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "ThunderStorm",
      "displayName": "Thunder Storm",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TriggerHappy",
      "displayName": "Trigger Happy",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TrueSight",
      "displayName": "True Sight",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TurnUndead",
      "displayName": "Turn Undead",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TwistOfFate",
      "displayName": "Twist Of Fate",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "TwohandParry",
      "displayName": "Twohand Parry",
      "kinds": [
        "passive"
      ],
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
      ]
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
      ]
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
      ]
    },
    {
      "id": "Unyielding",
      "displayName": "Unyielding",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "VenomBloom",
      "displayName": "Venom Bloom",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "VenomCoating",
      "displayName": "Venom Coating",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "VenomStrike",
      "displayName": "Venom Strike",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "Vitality",
      "displayName": "Vitality Aura",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "VolatileBolt",
      "displayName": "Volatile Bolt",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "VolatileExplosion",
      "displayName": "Volatile Explosion",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "WandMastery",
      "displayName": "Wand Mastery",
      "kinds": [
        "passive"
      ],
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
      ]
    },
    {
      "id": "WeaponSwap",
      "displayName": "Dual Loadout",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "WeaponThrow",
      "displayName": "Weapon Throw",
      "kinds": [
        "active"
      ]
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
      ]
    },
    {
      "id": "WildCharge",
      "displayName": "Wild Charge",
      "kinds": [
        "active"
      ]
    },
    {
      "id": "WindBarrier",
      "displayName": "Avatar of Storm",
      "kinds": [
        "active"
      ]
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
      ]
    }
  ] as const satisfies readonly FishNetSkillDefinition[];
}
