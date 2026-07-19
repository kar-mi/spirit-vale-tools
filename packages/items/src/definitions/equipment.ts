import type { FishNetEquipmentItemDefinition } from "../catalog.ts";

export class EquipmentItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 2,
      "id": "3D Glasses",
      "displayName": "3DGlasses"
    },
    {
      "itemType": 2,
      "id": "Abyss Shard",
      "displayName": "Abyss Shard",
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
      "displayName": "Adventurer's Kit"
    },
    {
      "itemType": 2,
      "id": "Adventurer's Pack",
      "displayName": "Adventurer's Pack"
    },
    {
      "itemType": 2,
      "id": "Amber Bow",
      "displayName": "Amber Bow"
    },
    {
      "itemType": 2,
      "id": "Amber Loop",
      "displayName": "Amber Loop"
    },
    {
      "itemType": 2,
      "id": "Arcane Sigil",
      "displayName": "Arcane Sigil"
    },
    {
      "itemType": 2,
      "id": "ArcaneChest",
      "displayName": "Arcane Chest"
    },
    {
      "itemType": 2,
      "id": "ArcaneFeet",
      "displayName": "Arcane Boots"
    },
    {
      "itemType": 2,
      "id": "ArcaneGloves",
      "displayName": "Arcane Gloves"
    },
    {
      "itemType": 2,
      "id": "ArcaneLegs",
      "displayName": "Arcane Legs"
    },
    {
      "itemType": 2,
      "id": "Archer's Beads",
      "displayName": "Archer's Beads"
    },
    {
      "itemType": 2,
      "id": "Armor_Agi",
      "displayName": "Speed Plate"
    },
    {
      "itemType": 2,
      "id": "Armor_Dex",
      "displayName": "Precision Plate"
    },
    {
      "itemType": 2,
      "id": "Armor_Int",
      "displayName": "Mind Plate"
    },
    {
      "itemType": 2,
      "id": "Armor_Luk",
      "displayName": "Fate Plate"
    },
    {
      "itemType": 2,
      "id": "Armor_Str",
      "displayName": "Power Plate"
    },
    {
      "itemType": 2,
      "id": "Armor_Vit",
      "displayName": "Endurance Plate"
    },
    {
      "itemType": 2,
      "id": "Arrow Quiver",
      "displayName": "Arrow Quiver"
    },
    {
      "itemType": 2,
      "id": "Arrowcatch Wall",
      "displayName": "Arrowcatch Wall"
    },
    {
      "itemType": 2,
      "id": "Artemis",
      "displayName": "Artemis",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Axe",
      "displayName": "Axe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Axe of Oblivion",
      "displayName": "Axe of Oblivion",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Azure Antlers",
      "displayName": "Azure Antlers"
    },
    {
      "itemType": 2,
      "id": "Azure Crown",
      "displayName": "Azure Crown"
    },
    {
      "itemType": 2,
      "id": "Azure Cutlass",
      "displayName": "Azure Cutlass",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Azure Prism",
      "displayName": "Azure Prism"
    },
    {
      "itemType": 2,
      "id": "Azure Tag",
      "displayName": "Azure Tag"
    },
    {
      "itemType": 2,
      "id": "Backpack",
      "displayName": "Backpack"
    },
    {
      "itemType": 2,
      "id": "Bandit Wrap",
      "displayName": "Bandit Wrap"
    },
    {
      "itemType": 2,
      "id": "Banner Helm",
      "displayName": "Banner Helm"
    },
    {
      "itemType": 2,
      "id": "Batling Familiar",
      "displayName": "Batling Familiar"
    },
    {
      "itemType": 2,
      "id": "Battle Bonnet",
      "displayName": "Battle Bonnet"
    },
    {
      "itemType": 2,
      "id": "Bear Backpack",
      "displayName": "Bear Backpack"
    },
    {
      "itemType": 2,
      "id": "Bear Hug Hood",
      "displayName": "Bear Hug Hood"
    },
    {
      "itemType": 2,
      "id": "Beast Helm",
      "displayName": "Beast Helm"
    },
    {
      "itemType": 2,
      "id": "Beast Hood",
      "displayName": "Beast Hood"
    },
    {
      "itemType": 2,
      "id": "Beast Pelt Hood",
      "displayName": "Beast Pelt Hood"
    },
    {
      "itemType": 2,
      "id": "BerserkChest",
      "displayName": "Direwolf Chest"
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
      "displayName": "Direwolf Shoes"
    },
    {
      "itemType": 2,
      "id": "BerserkLegs",
      "displayName": "Direwolf Legs"
    },
    {
      "itemType": 2,
      "id": "Binding Spirits Staff",
      "displayName": "Binding Spirits Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bishop's Hood",
      "displayName": "Bishop's Hood"
    },
    {
      "itemType": 2,
      "id": "Blacksteel Blade",
      "displayName": "Blacksteel Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Blade of Eclipse",
      "displayName": "Blade of Eclipse",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Blade Standard",
      "displayName": "Blade Standard"
    },
    {
      "itemType": 2,
      "id": "Blindfold",
      "displayName": "Blindfold"
    },
    {
      "itemType": 2,
      "id": "Blood Clip",
      "displayName": "Blood Clip"
    },
    {
      "itemType": 2,
      "id": "Blood Pendant",
      "displayName": "Blood Pendant"
    },
    {
      "itemType": 2,
      "id": "Bloodbound",
      "displayName": "Bloodbound"
    },
    {
      "itemType": 2,
      "id": "Bloom of Midnight",
      "displayName": "Bloom of Midnight",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bloom Pendant",
      "displayName": "Bloom Pendant"
    },
    {
      "itemType": 2,
      "id": "Bloom Ring",
      "displayName": "Bloom Ring"
    },
    {
      "itemType": 2,
      "id": "Blue Shell",
      "displayName": "Blue Shell"
    },
    {
      "itemType": 2,
      "id": "Blunderbuss",
      "displayName": "Blunderbuss",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Bomb Bud",
      "displayName": "Bomb Bud"
    },
    {
      "itemType": 2,
      "id": "Bone Channeler",
      "displayName": "Bone Channeler",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Bone Helm",
      "displayName": "Bone Helm"
    },
    {
      "itemType": 2,
      "id": "Bone Pick",
      "displayName": "Bone Pick",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bonefang",
      "displayName": "Bonefang",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "BonkStick",
      "displayName": "Bonk Stick",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bot Hunter Utility",
      "displayName": "Bot Hunter Utility"
    },
    {
      "itemType": 2,
      "id": "Breakerhead",
      "displayName": "Breakerhead",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "BreezeguardChest",
      "displayName": "Breezeguard Chest"
    },
    {
      "itemType": 2,
      "id": "BreezeguardFeet",
      "displayName": "Breezeguard Shoes"
    },
    {
      "itemType": 2,
      "id": "BreezeguardLegs",
      "displayName": "Breezeguard Legs"
    },
    {
      "itemType": 2,
      "id": "Brimblade",
      "displayName": "Brimblade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Broad Sword",
      "displayName": "Broad Sword",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Bronze Crescent",
      "displayName": "Bronze Crescent"
    },
    {
      "itemType": 2,
      "id": "Bronze Plugs",
      "displayName": "Bronze Plugs"
    },
    {
      "itemType": 2,
      "id": "Bronze Visage",
      "displayName": "Bronze Visage"
    },
    {
      "itemType": 2,
      "id": "Bubblebeast Hood",
      "displayName": "Bubblebeast Hood"
    },
    {
      "itemType": 2,
      "id": "Buckler",
      "displayName": "Buckler"
    },
    {
      "itemType": 2,
      "id": "Bullcrest Helm",
      "displayName": "Bullcrest Helm"
    },
    {
      "itemType": 2,
      "id": "Bunny Backpack",
      "displayName": "Bunny Backpack"
    },
    {
      "itemType": 2,
      "id": "Bunny Cap",
      "displayName": "Bunny Cap"
    },
    {
      "itemType": 2,
      "id": "Caged Spirit",
      "displayName": "Caged Spirit"
    },
    {
      "itemType": 2,
      "id": "Cardboard Chick",
      "displayName": "Cardboard Chick"
    },
    {
      "itemType": 2,
      "id": "Centurion Helm",
      "displayName": "Centurion Helm"
    },
    {
      "itemType": 2,
      "id": "Ceremonial Mask",
      "displayName": "Ceremonial Mask"
    },
    {
      "itemType": 2,
      "id": "Cerulean Scepter",
      "displayName": "Cerulean Scepter",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chainfrost Staff",
      "displayName": "Chainfrost Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Chains of Binding",
      "displayName": "Chains of Binding"
    },
    {
      "itemType": 2,
      "id": "Champion Blade",
      "displayName": "Divine Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chaos Reaver",
      "displayName": "Chaos Reaver",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Chicky Hood",
      "displayName": "Chicky Hood"
    },
    {
      "itemType": 2,
      "id": "Chirpy Hat",
      "displayName": "Chirpy Hat"
    },
    {
      "itemType": 2,
      "id": "Chompy Hood",
      "displayName": "Chompy Hood"
    },
    {
      "itemType": 2,
      "id": "Chronomancer's Codex",
      "displayName": "Chronomancer's Codex"
    },
    {
      "itemType": 2,
      "id": "ClericChest",
      "displayName": "Cleric Chest"
    },
    {
      "itemType": 2,
      "id": "ClericFeet",
      "displayName": "Cleric Shoes"
    },
    {
      "itemType": 2,
      "id": "ClericLegs",
      "displayName": "Cleric Legs"
    },
    {
      "itemType": 2,
      "id": "Cloud Loop",
      "displayName": "Cloud Loop"
    },
    {
      "itemType": 2,
      "id": "Codex",
      "displayName": "Tome",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Binding Light",
      "displayName": "Grimoire of Binding Light",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex First Hymn",
      "displayName": "Tome of the First Hymn",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex of Revelation",
      "displayName": "Codex of Revelation",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Umbra",
      "displayName": "Codex Umbra",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Codex Vitae",
      "displayName": "Codex Vitae",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Combat Knife",
      "displayName": "Combat Knife",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Cotton Mask",
      "displayName": "Cotton Mask"
    },
    {
      "itemType": 2,
      "id": "Crimson Crest",
      "displayName": "Crimson Crest"
    },
    {
      "itemType": 2,
      "id": "Crimson Plume",
      "displayName": "Crimson Plume"
    },
    {
      "itemType": 2,
      "id": "Crown of Spikes",
      "displayName": "Crown of Spikes"
    },
    {
      "itemType": 2,
      "id": "Crusader Staff",
      "displayName": "Radiant Scepter",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Crusader Sword",
      "displayName": "Oathbreaker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Crystal Cache",
      "displayName": "Crystal Cache"
    },
    {
      "itemType": 2,
      "id": "Crystal Slammer",
      "displayName": "Crystal Slammer",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Crystal Wings",
      "displayName": "Crystal Wings"
    },
    {
      "itemType": 2,
      "id": "Curse Tag",
      "displayName": "Curse Tag"
    },
    {
      "itemType": 2,
      "id": "Cursed Grimoire",
      "displayName": "Cursed Grimoire"
    },
    {
      "itemType": 2,
      "id": "Daggers",
      "displayName": "Daggers"
    },
    {
      "itemType": 2,
      "id": "Darkfeather Wings",
      "displayName": "Darkfeather Wings"
    },
    {
      "itemType": 2,
      "id": "Darkhide Gloves",
      "displayName": "Darkhide Gloves"
    },
    {
      "itemType": 2,
      "id": "Dawn Prayer",
      "displayName": "Dawn Prayer"
    },
    {
      "itemType": 2,
      "id": "Dawnstar",
      "displayName": "Dawnstar",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Daybreak",
      "displayName": "Daybreak",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Death's Grin",
      "displayName": "Death's Grin"
    },
    {
      "itemType": 2,
      "id": "Demon Cat",
      "displayName": "Cheshire Cat"
    },
    {
      "itemType": 2,
      "id": "Demon Hood",
      "displayName": "Demon Hood"
    },
    {
      "itemType": 2,
      "id": "Destruction Staff",
      "displayName": "Destruction Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Digger's Flask",
      "displayName": "Digger's Flask"
    },
    {
      "itemType": 2,
      "id": "Dino Cub Backpack",
      "displayName": "Dino Cub Backpack"
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
      "displayName": "Discipline Band"
    },
    {
      "itemType": 2,
      "id": "Doom Crescent",
      "displayName": "Doom Crescent",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Doom Crown",
      "displayName": "Doom Crown"
    },
    {
      "itemType": 2,
      "id": "Doom Keg",
      "displayName": "Doom Keg"
    },
    {
      "itemType": 2,
      "id": "Double Ravenbeak",
      "displayName": "Double Ravenbeak",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dragon Hood",
      "displayName": "Dragon Hood"
    },
    {
      "itemType": 2,
      "id": "Dragonic Spear",
      "displayName": "Dragonic Spear",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dragonspire Helm",
      "displayName": "Dragonspire Helm"
    },
    {
      "itemType": 2,
      "id": "Drooping Angel",
      "displayName": "Drooping Angel"
    },
    {
      "itemType": 2,
      "id": "Drooping Bat",
      "displayName": "Drooping Bat"
    },
    {
      "itemType": 2,
      "id": "Drooping Burrow",
      "displayName": "Drooping Burrow"
    },
    {
      "itemType": 2,
      "id": "Drooping Cat",
      "displayName": "Drooping Cat"
    },
    {
      "itemType": 2,
      "id": "Drooping Dragon",
      "displayName": "Drooping Dragon"
    },
    {
      "itemType": 2,
      "id": "Drooping Flora",
      "displayName": "Drooping Flora"
    },
    {
      "itemType": 2,
      "id": "Drooping Pup",
      "displayName": "Drooping Pup"
    },
    {
      "itemType": 2,
      "id": "Drooping Skeleton",
      "displayName": "Drooping Skeleton"
    },
    {
      "itemType": 2,
      "id": "Drooping Wraith",
      "displayName": "Drooping Wraith"
    },
    {
      "itemType": 2,
      "id": "Dualblade Sheath",
      "displayName": "Dualblade Sheath"
    },
    {
      "itemType": 2,
      "id": "Duskfang",
      "displayName": "Duskfang",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Dustweaver Hat",
      "displayName": "Dustweaver Hat"
    },
    {
      "itemType": 2,
      "id": "Earth Shaker",
      "displayName": "Earth Shaker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Earth Shield",
      "displayName": "Obsidian Bulwark"
    },
    {
      "itemType": 2,
      "id": "Eclipse Kunai",
      "displayName": "Eclipse Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Edge of Twilight",
      "displayName": "Edge of Twilight",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Elixir Gourd",
      "displayName": "Elixir Gourd"
    },
    {
      "itemType": 2,
      "id": "Emberhide Helm",
      "displayName": "Emberhide Helm"
    },
    {
      "itemType": 2,
      "id": "Embershard",
      "displayName": "Embershard",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Emerald Crown",
      "displayName": "Emerald Crown"
    },
    {
      "itemType": 2,
      "id": "Energy Sword Blue",
      "displayName": "Prism Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Energy Sword Purple",
      "displayName": "Umbral Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Energy Sword Yellow",
      "displayName": "Chromatic Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Everfrost Staff",
      "displayName": "Everfrost Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Executioner Axe",
      "displayName": "Executioner Axe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Exorcist Bible",
      "displayName": "Exorcist Bible",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Exorcist Staff",
      "displayName": "Exorcist Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Explorer's Pack",
      "displayName": "Explorer's Pack"
    },
    {
      "itemType": 2,
      "id": "Eye of Vigil",
      "displayName": "Eye of Vigil",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Eyepatch",
      "displayName": "Eyepatch"
    },
    {
      "itemType": 2,
      "id": "Falcon Band",
      "displayName": "Falcon Band"
    },
    {
      "itemType": 2,
      "id": "Falcon Hood",
      "displayName": "Falcon Hood"
    },
    {
      "itemType": 2,
      "id": "Fang Clip",
      "displayName": "Fang Clip"
    },
    {
      "itemType": 2,
      "id": "Fang of the Moon",
      "displayName": "Fang of the Moon",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Feathered Crown",
      "displayName": "Feathered Crown"
    },
    {
      "itemType": 2,
      "id": "Feathered Scout Hat",
      "displayName": "Feathered Scout Hat"
    },
    {
      "itemType": 2,
      "id": "Feet_Agi",
      "displayName": "Speed Shoes"
    },
    {
      "itemType": 2,
      "id": "Feet_Dex",
      "displayName": "Precision Shoes"
    },
    {
      "itemType": 2,
      "id": "Feet_Int",
      "displayName": "Mind Shoes"
    },
    {
      "itemType": 2,
      "id": "Feet_Luk",
      "displayName": "Fate Shoes"
    },
    {
      "itemType": 2,
      "id": "Feet_Str",
      "displayName": "Power Shoes"
    },
    {
      "itemType": 2,
      "id": "Feet_Vit",
      "displayName": "Endurance Shoes"
    },
    {
      "itemType": 2,
      "id": "Ferncloak",
      "displayName": "Ferncloak"
    },
    {
      "itemType": 2,
      "id": "Festival Cap",
      "displayName": "Festival Cap"
    },
    {
      "itemType": 2,
      "id": "Festival Rockets",
      "displayName": "Festival Rockets"
    },
    {
      "itemType": 2,
      "id": "Festival Turtle Cap",
      "displayName": "Festival Turtle Cap"
    },
    {
      "itemType": 2,
      "id": "Festive Gift Box",
      "displayName": "Festive Gift Box"
    },
    {
      "itemType": 2,
      "id": "Fire Shield",
      "displayName": "Molten Core Heater"
    },
    {
      "itemType": 2,
      "id": "Flame Spirit",
      "displayName": "Flame Spirit"
    },
    {
      "itemType": 2,
      "id": "Flame Tongue Kunai",
      "displayName": "Flame Tongue Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Flameburst Kunai",
      "displayName": "Flameburst Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fleetrunner",
      "displayName": "Fleetrunner"
    },
    {
      "itemType": 2,
      "id": "Flintlock Pistol",
      "displayName": "Flintlock Pistol",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Focus Band",
      "displayName": "Focus Band"
    },
    {
      "itemType": 2,
      "id": "Forest Friend Hat",
      "displayName": "Forest Friend Hat"
    },
    {
      "itemType": 2,
      "id": "ForestChest",
      "displayName": "Forest Chest"
    },
    {
      "itemType": 2,
      "id": "ForestFeet",
      "displayName": "Forest Shoes"
    },
    {
      "itemType": 2,
      "id": "ForestLegs",
      "displayName": "Forest Legs"
    },
    {
      "itemType": 2,
      "id": "Fortified Guardwall",
      "displayName": "Fortified Guardwall"
    },
    {
      "itemType": 2,
      "id": "Frost Mark",
      "displayName": "Frost Mark",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Frostfang",
      "displayName": "Frostfang",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Frostscale Helm",
      "displayName": "Frostscale Helm"
    },
    {
      "itemType": 2,
      "id": "Frostshard",
      "displayName": "Frostshard",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Frostspire Kunai",
      "displayName": "Frostspire Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Fruit Bowl",
      "displayName": "Fruit Bowl"
    },
    {
      "itemType": 2,
      "id": "Funny Glasses",
      "displayName": "Funny Glasses"
    },
    {
      "itemType": 2,
      "id": "Fur Hood",
      "displayName": "Fur Hood"
    },
    {
      "itemType": 2,
      "id": "Game Master Utility",
      "displayName": "Game Master Utility"
    },
    {
      "itemType": 2,
      "id": "Gatling Gun",
      "displayName": "Gatling Gun",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Gentleman's Hat",
      "displayName": "Gentleman's Hat"
    },
    {
      "itemType": 2,
      "id": "Ghostly Hat",
      "displayName": "Ghostly Hat"
    },
    {
      "itemType": 2,
      "id": "Glimmerthorn",
      "displayName": "Glimmerthorn",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Glove_Agi",
      "displayName": "Speed Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Glove_Dex",
      "displayName": "Precision Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Glove_Int",
      "displayName": "Mind Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Glove_Luk",
      "displayName": "Fate Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Glove_Str",
      "displayName": "Power Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Glove_Vit",
      "displayName": "Endurance Gauntlets"
    },
    {
      "itemType": 2,
      "id": "Golden Aegis",
      "displayName": "Golden Aegis"
    },
    {
      "itemType": 2,
      "id": "Golden Axe",
      "displayName": "Golden Axe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Golden Crest",
      "displayName": "Golden Crest"
    },
    {
      "itemType": 2,
      "id": "Golden Crown",
      "displayName": "Golden Crown"
    },
    {
      "itemType": 2,
      "id": "Golden Hammer",
      "displayName": "Golden Hammer",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Golden Hoop",
      "displayName": "Golden Hoop"
    },
    {
      "itemType": 2,
      "id": "Grasping Eye Urn",
      "displayName": "Grasping Eye Urn"
    },
    {
      "itemType": 2,
      "id": "Grave Helm",
      "displayName": "Grave Helm"
    },
    {
      "itemType": 2,
      "id": "GravemarrowChest",
      "displayName": "Gravemarrow Chest"
    },
    {
      "itemType": 2,
      "id": "GravemarrowFeet",
      "displayName": "Gravemarrow Shoes"
    },
    {
      "itemType": 2,
      "id": "GravemarrowLegs",
      "displayName": "Gravemarrow Legs"
    },
    {
      "itemType": 2,
      "id": "Gravestone Breaker",
      "displayName": "Gravestone Breaker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Green Shell",
      "displayName": "Green Shell"
    },
    {
      "itemType": 2,
      "id": "Grim Reaper Scythe",
      "displayName": "Life Drinker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Guardblade",
      "displayName": "Guardblade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Happy Chipper Hat",
      "displayName": "Happy Chipper Hat"
    },
    {
      "itemType": 2,
      "id": "Harlequin's Hood",
      "displayName": "Harlequin's Hood"
    },
    {
      "itemType": 2,
      "id": "Harvester of Souls",
      "displayName": "Harvester of Souls",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Hawkeye Crossbow",
      "displayName": "Hawkeye Crossbow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Heart Vessel",
      "displayName": "Heart Vessel"
    },
    {
      "itemType": 2,
      "id": "Heartgaze Shades",
      "displayName": "Heartgaze Shades"
    },
    {
      "itemType": 2,
      "id": "Heartloop Earring",
      "displayName": "Heartloop Earring"
    },
    {
      "itemType": 2,
      "id": "Heaven's Orbit",
      "displayName": "Heaven's Orbit"
    },
    {
      "itemType": 2,
      "id": "Hellfire Staff",
      "displayName": "Hellfire Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Hellhorn Hood",
      "displayName": "Hellhorn Hood"
    },
    {
      "itemType": 2,
      "id": "Hermit Hood",
      "displayName": "Hermit Hood"
    },
    {
      "itemType": 2,
      "id": "Hexweaver Hat",
      "displayName": "Hexweaver Hat"
    },
    {
      "itemType": 2,
      "id": "Holy Shield",
      "displayName": "Holy Crest"
    },
    {
      "itemType": 2,
      "id": "Holy Staff",
      "displayName": "Holy Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Hornbrand",
      "displayName": "Hornbrand",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Horned Crusader Helm",
      "displayName": "Horned Crusader Helm"
    },
    {
      "itemType": 2,
      "id": "Horned Vanguard",
      "displayName": "Horned Vanguard"
    },
    {
      "itemType": 2,
      "id": "Hunter's Hood",
      "displayName": "Hunter's Hood"
    },
    {
      "itemType": 2,
      "id": "Hunter's Roll",
      "displayName": "Hunter's Roll"
    },
    {
      "itemType": 2,
      "id": "Hunting Knife",
      "displayName": "Hunting Knife",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Hunting Pike",
      "displayName": "Hunting Pike",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Insect Carapace",
      "displayName": "Insect Carapace"
    },
    {
      "itemType": 2,
      "id": "Iron Ankh",
      "displayName": "Iron Ankh"
    },
    {
      "itemType": 2,
      "id": "Iron Bulwark",
      "displayName": "Iron Bulwark"
    },
    {
      "itemType": 2,
      "id": "Iron Fortitude",
      "displayName": "Iron Fortitude"
    },
    {
      "itemType": 2,
      "id": "Iron Guard Helm",
      "displayName": "Iron Guard Helm"
    },
    {
      "itemType": 2,
      "id": "Iron Halo",
      "displayName": "Iron Halo"
    },
    {
      "itemType": 2,
      "id": "Iron Morningstar",
      "displayName": "Iron Morningstar",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Reaver",
      "displayName": "Iron Reaver",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Spear",
      "displayName": "Iron Spear",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Iron Spire",
      "displayName": "Iron Spire"
    },
    {
      "itemType": 2,
      "id": "Ironhorn Cap",
      "displayName": "Ironhorn Cap"
    },
    {
      "itemType": 2,
      "id": "Ironshade Helm",
      "displayName": "Ironshade Helm"
    },
    {
      "itemType": 2,
      "id": "IslandChest",
      "displayName": "Island Spirit Chest"
    },
    {
      "itemType": 2,
      "id": "IslandFeet",
      "displayName": "Island Spirit Shoes"
    },
    {
      "itemType": 2,
      "id": "IslandLegs",
      "displayName": "Island Spirit Legs"
    },
    {
      "itemType": 2,
      "id": "Jagtooth",
      "displayName": "Jagtooth",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Jester Hat",
      "displayName": "Jester Hat"
    },
    {
      "itemType": 2,
      "id": "Jewelcrest Mace",
      "displayName": "Jewelcrest Mace",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Knife",
      "displayName": "Knife",
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
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "KnightChest",
      "displayName": "Skystrider Chest"
    },
    {
      "itemType": 2,
      "id": "KnightFeet",
      "displayName": "Skystrider Shoes"
    },
    {
      "itemType": 2,
      "id": "KnightLegs",
      "displayName": "Skystrider Legs"
    },
    {
      "itemType": 2,
      "id": "Knuckleband",
      "displayName": "Knuckleband"
    },
    {
      "itemType": 2,
      "id": "Kunai",
      "displayName": "Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Launcher",
      "displayName": "Launcher",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Leaf Mask",
      "displayName": "Leaf Mask"
    },
    {
      "itemType": 2,
      "id": "Leg_Agi",
      "displayName": "Speed Greaves"
    },
    {
      "itemType": 2,
      "id": "Leg_Dex",
      "displayName": "Precision Greaves"
    },
    {
      "itemType": 2,
      "id": "Leg_Int",
      "displayName": "Mind Greaves"
    },
    {
      "itemType": 2,
      "id": "Leg_Luk",
      "displayName": "Fate Greaves"
    },
    {
      "itemType": 2,
      "id": "Leg_Str",
      "displayName": "Power Greaves"
    },
    {
      "itemType": 2,
      "id": "Leg_Vit",
      "displayName": "Endurance Greaves"
    },
    {
      "itemType": 2,
      "id": "Legionnaire Helm",
      "displayName": "Legionnaire Helm"
    },
    {
      "itemType": 2,
      "id": "Life Staff",
      "displayName": "Life Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Lifebloom Shoes",
      "displayName": "Lifebloom Shoes"
    },
    {
      "itemType": 2,
      "id": "Longbow",
      "displayName": "Longbow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Lucky Drops",
      "displayName": "Lucky Drops"
    },
    {
      "itemType": 2,
      "id": "Lute",
      "displayName": "Lute",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Luxbane",
      "displayName": "Luxbane",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Luxspire",
      "displayName": "Luxspire",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mace",
      "displayName": "Mace",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Mage Guard",
      "displayName": "Mage Guard"
    },
    {
      "itemType": 2,
      "id": "Mage Plate",
      "displayName": "Mage Plate"
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
      "displayName": "Spellthread Chest"
    },
    {
      "itemType": 2,
      "id": "MageFeet",
      "displayName": "Spellthread Shoes"
    },
    {
      "itemType": 2,
      "id": "MageLegs",
      "displayName": "Spellthread Legs"
    },
    {
      "itemType": 2,
      "id": "Mana Cask",
      "displayName": "Mana Cask"
    },
    {
      "itemType": 2,
      "id": "Mana Potion",
      "displayName": "Mana Potion"
    },
    {
      "itemType": 2,
      "id": "Master Axe",
      "displayName": "Master Axe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Codex",
      "displayName": "Master Codex",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Master Dagger",
      "displayName": "Master Dagger",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Hammer",
      "displayName": "Master Hammer",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Master Katar",
      "displayName": "Master Katar",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Revolver",
      "displayName": "Master Pistol",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Master Scythe",
      "displayName": "Master Scythe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Slingshot",
      "displayName": "Master Bow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Master Spear",
      "displayName": "Master Spear",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Sword",
      "displayName": "Master Sword",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Master Wand",
      "displayName": "Master Wand",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mechanical Core",
      "displayName": "Mechanical Core"
    },
    {
      "itemType": 2,
      "id": "Meteoric Staff",
      "displayName": "Meteoric Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Mindweave",
      "displayName": "Mindweave"
    },
    {
      "itemType": 2,
      "id": "Mirage Cloak",
      "displayName": "Mirage Cloak"
    },
    {
      "itemType": 2,
      "id": "Mischief Gift Box",
      "displayName": "Mischief Gift Box"
    },
    {
      "itemType": 2,
      "id": "Mitre of Sanctity",
      "displayName": "Mitre of Sanctity"
    },
    {
      "itemType": 2,
      "id": "Molten Core",
      "displayName": "Molten Core"
    },
    {
      "itemType": 2,
      "id": "Moonfrost",
      "displayName": "Moonfrost",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Moonshadow Hat",
      "displayName": "Moonshadow Hat"
    },
    {
      "itemType": 2,
      "id": "Moonweave Gloves",
      "displayName": "Moon Band"
    },
    {
      "itemType": 2,
      "id": "Mystic Hat",
      "displayName": "Mystic Hat"
    },
    {
      "itemType": 2,
      "id": "Mystic Hood",
      "displayName": "Mystic Hood"
    },
    {
      "itemType": 2,
      "id": "Necronomicon",
      "displayName": "Necronomicon",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Neko Hood",
      "displayName": "Neko Hood"
    },
    {
      "itemType": 2,
      "id": "Night Chest",
      "displayName": "Night Armor"
    },
    {
      "itemType": 2,
      "id": "Night Feet",
      "displayName": "Night Boots"
    },
    {
      "itemType": 2,
      "id": "Night Helm",
      "displayName": "Night Helm"
    },
    {
      "itemType": 2,
      "id": "Night Legs",
      "displayName": "Night Greaves"
    },
    {
      "itemType": 2,
      "id": "Night Shield",
      "displayName": "Compass of Dawn"
    },
    {
      "itemType": 2,
      "id": "Nightfang Stud",
      "displayName": "Nightfang Stud"
    },
    {
      "itemType": 2,
      "id": "Ninja Hood",
      "displayName": "Ninja Hood"
    },
    {
      "itemType": 2,
      "id": "Nomad Hood",
      "displayName": "Nomad Hood"
    },
    {
      "itemType": 2,
      "id": "NoviceChest",
      "displayName": "Novice Chest"
    },
    {
      "itemType": 2,
      "id": "NoviceFeet",
      "displayName": "Novice Shoes"
    },
    {
      "itemType": 2,
      "id": "NoviceLegs",
      "displayName": "Novice Legs"
    },
    {
      "itemType": 2,
      "id": "Oak Bow",
      "displayName": "Oak Bow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Oathbound Helm",
      "displayName": "Oathbound Helm"
    },
    {
      "itemType": 2,
      "id": "Obsidian Band",
      "displayName": "Obsidian Band"
    },
    {
      "itemType": 2,
      "id": "Obsidian Edge",
      "displayName": "Obsidian Edge",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Obsidian Loop",
      "displayName": "Obsidian Loop"
    },
    {
      "itemType": 2,
      "id": "Obsidian Pillar",
      "displayName": "Obsidian Pillar"
    },
    {
      "itemType": 2,
      "id": "Ocular Grimoire",
      "displayName": "Ocular Grimoire"
    },
    {
      "itemType": 2,
      "id": "Onyx Bolt",
      "displayName": "Onyx Bolt"
    },
    {
      "itemType": 2,
      "id": "Ornamented Staff",
      "displayName": "Ornamented Staff"
    },
    {
      "itemType": 2,
      "id": "Oxygen Tank",
      "displayName": "Oxygen Tank"
    },
    {
      "itemType": 2,
      "id": "Paladin Crest",
      "displayName": "Paladin Crest"
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
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Phantom Kunai",
      "displayName": "Phantom Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Phantom Mask",
      "displayName": "Phantom Mask"
    },
    {
      "itemType": 2,
      "id": "Piercer",
      "displayName": "Piercer",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Pirate Hat",
      "displayName": "Pirate Hat"
    },
    {
      "itemType": 2,
      "id": "PirateChest",
      "displayName": "Pirate Coat"
    },
    {
      "itemType": 2,
      "id": "PirateFeet",
      "displayName": "Pirate Shoes"
    },
    {
      "itemType": 2,
      "id": "PirateGloves",
      "displayName": "Pirate Hook"
    },
    {
      "itemType": 2,
      "id": "PirateLegs",
      "displayName": "Pirate Legs"
    },
    {
      "itemType": 2,
      "id": "Pistol",
      "displayName": "Pistol",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Plasma Helmet",
      "displayName": "Plasma Helmet"
    },
    {
      "itemType": 2,
      "id": "Plasma Shell",
      "displayName": "Plasma Shell"
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Blue",
      "displayName": "Azure Flow",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Purple",
      "displayName": "Violet Arc",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Plasma Sword Yellow",
      "displayName": "Solar Pulse",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "PlasmaChest",
      "displayName": "Plasma Suit"
    },
    {
      "itemType": 2,
      "id": "PlasmaFeet",
      "displayName": "Plasma Boots"
    },
    {
      "itemType": 2,
      "id": "PlasmaLegs",
      "displayName": "Plasma Greaves"
    },
    {
      "itemType": 2,
      "id": "Plum Talisman",
      "displayName": "Plum Talisman"
    },
    {
      "itemType": 2,
      "id": "Potion Bowl",
      "displayName": "Potion Bowl"
    },
    {
      "itemType": 2,
      "id": "Potion Gourd",
      "displayName": "Potion Gourd"
    },
    {
      "itemType": 2,
      "id": "Potions",
      "displayName": "Potions"
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
      "displayName": "Jack-o'-lantern"
    },
    {
      "itemType": 2,
      "id": "Quillcap",
      "displayName": "Quillcap"
    },
    {
      "itemType": 2,
      "id": "Quiver",
      "displayName": "Quiver"
    },
    {
      "itemType": 2,
      "id": "Quiver of Thorns",
      "displayName": "Quiver of Thorns"
    },
    {
      "itemType": 2,
      "id": "Radiant Dagger",
      "displayName": "Radiant Dagger",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Radiant Lyra",
      "displayName": "Radiant Lyra",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Radiant Wand",
      "displayName": "Radiant Wand",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Ragebound Fury",
      "displayName": "Ragebound Fury",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Raider Helm",
      "displayName": "Raider Helm"
    },
    {
      "itemType": 2,
      "id": "Ram Skull Mask",
      "displayName": "Ram Skull Mask"
    },
    {
      "itemType": 2,
      "id": "Ransack",
      "displayName": "Ransack"
    },
    {
      "itemType": 2,
      "id": "Razor Edge",
      "displayName": "Razor's Edge",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Razor Kunai",
      "displayName": "Razor Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Reaper Scythe",
      "displayName": "Grim Scythe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Recurve Bow",
      "displayName": "Recurve Bow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Red Maw",
      "displayName": "Red Maw",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Red Shell",
      "displayName": "Red Shell"
    },
    {
      "itemType": 2,
      "id": "Regal Tricorne",
      "displayName": "Regal Tricorne"
    },
    {
      "itemType": 2,
      "id": "Reindeer Headband",
      "displayName": "Reindeer Headband"
    },
    {
      "itemType": 2,
      "id": "Reindeer Hood",
      "displayName": "Reindeer Hood"
    },
    {
      "itemType": 2,
      "id": "ReindeerChest",
      "displayName": "Reindeer Chest"
    },
    {
      "itemType": 2,
      "id": "ReindeerFeet",
      "displayName": "Reindeer Shoes"
    },
    {
      "itemType": 2,
      "id": "ReindeerGloves",
      "displayName": "Reindeer Gloves"
    },
    {
      "itemType": 2,
      "id": "ReindeerLegs",
      "displayName": "Reindeer Legs"
    },
    {
      "itemType": 2,
      "id": "Relic Trident",
      "displayName": "Relic Trident",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Repeater Crossbow",
      "displayName": "Repeater Crossbow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Resonant Headphones",
      "displayName": "Resonant Headphones"
    },
    {
      "itemType": 2,
      "id": "Rifle",
      "displayName": "Rifle",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Riftbreaker",
      "displayName": "Riftbreaker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Rod",
      "displayName": "Rod",
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
      "displayName": "Round Glasses"
    },
    {
      "itemType": 2,
      "id": "Royal Crest",
      "displayName": "Royal Crest"
    },
    {
      "itemType": 2,
      "id": "Royal Dagger",
      "displayName": "Royal Dagger",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Royal Fang",
      "displayName": "Royal Fang",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Runeborn Visor",
      "displayName": "Runeborn Visor"
    },
    {
      "itemType": 2,
      "id": "Runecall",
      "displayName": "Runecall"
    },
    {
      "itemType": 2,
      "id": "Runed Staff",
      "displayName": "Runed Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Runesmasher",
      "displayName": "Runesmasher",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Runesteel",
      "displayName": "Runesteel",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Rusted Binocs",
      "displayName": "Rusted Binocs"
    },
    {
      "itemType": 2,
      "id": "Safety Helmet",
      "displayName": "Safety Helmet"
    },
    {
      "itemType": 2,
      "id": "SafetyChest",
      "displayName": "Safety Chest"
    },
    {
      "itemType": 2,
      "id": "SafetyFeet",
      "displayName": "Safety Shoes"
    },
    {
      "itemType": 2,
      "id": "SafetyGloves",
      "displayName": "Safety Gloves"
    },
    {
      "itemType": 2,
      "id": "SafetyLegs",
      "displayName": "Safety Legs"
    },
    {
      "itemType": 2,
      "id": "Sailor Cap",
      "displayName": "Sailor Cap"
    },
    {
      "itemType": 2,
      "id": "SanctifiedChest",
      "displayName": "Sanctified Chest"
    },
    {
      "itemType": 2,
      "id": "SanctifiedFeet",
      "displayName": "Sanctified Shoes"
    },
    {
      "itemType": 2,
      "id": "SanctifiedLegs",
      "displayName": "Sanctified Legs"
    },
    {
      "itemType": 2,
      "id": "Sanctum Gloves",
      "displayName": "Sanctum Gloves"
    },
    {
      "itemType": 2,
      "id": "Sanctum Guard",
      "displayName": "Sanctum Guard"
    },
    {
      "itemType": 2,
      "id": "SantaChest",
      "displayName": "Santa Chest"
    },
    {
      "itemType": 2,
      "id": "SantaFeet",
      "displayName": "Santa Shoes"
    },
    {
      "itemType": 2,
      "id": "SantaGloves",
      "displayName": "Santa Gloves"
    },
    {
      "itemType": 2,
      "id": "SantaHat",
      "displayName": "Santa Hat"
    },
    {
      "itemType": 2,
      "id": "SantaLegs",
      "displayName": "Santa Legs"
    },
    {
      "itemType": 2,
      "id": "Sapphire Crown",
      "displayName": "Sapphire Crown"
    },
    {
      "itemType": 2,
      "id": "Sapphire Guard",
      "displayName": "Stormplate Helm"
    },
    {
      "itemType": 2,
      "id": "Satchel of Embers",
      "displayName": "Satchel of Embers"
    },
    {
      "itemType": 2,
      "id": "Scalpel",
      "displayName": "Scalpel",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Scholar Glasses",
      "displayName": "Scholar Glasses"
    },
    {
      "itemType": 2,
      "id": "Scholar's Cap",
      "displayName": "Scholar's Cap"
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
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Scroll Case",
      "displayName": "Scroll Case"
    },
    {
      "itemType": 2,
      "id": "Scroll Charm",
      "displayName": "Scroll Charm"
    },
    {
      "itemType": 2,
      "id": "Scythe",
      "displayName": "Scythe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Seedling Satchel",
      "displayName": "Seedling Satchel"
    },
    {
      "itemType": 2,
      "id": "Seer's Hood",
      "displayName": "Seer's Hood"
    },
    {
      "itemType": 2,
      "id": "Serpent Ring",
      "displayName": "Serpent Ring"
    },
    {
      "itemType": 2,
      "id": "Shadow Dancers",
      "displayName": "Shadow Dancers"
    },
    {
      "itemType": 2,
      "id": "Shadow Shield",
      "displayName": "Shadowsteel Guard"
    },
    {
      "itemType": 2,
      "id": "Shady Specs",
      "displayName": "Shady Specs"
    },
    {
      "itemType": 2,
      "id": "Sharkbite Hood",
      "displayName": "Sharkbite Hood"
    },
    {
      "itemType": 2,
      "id": "Sharpened Visor",
      "displayName": "Sharpened Visor"
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
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Shuriken",
      "displayName": "Fuma Shuriken",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Silence of Night",
      "displayName": "Silence of Night",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Skull Emblem",
      "displayName": "Skull Emblem"
    },
    {
      "itemType": 2,
      "id": "Skull Lord Totem",
      "displayName": "Skull Lord Totem"
    },
    {
      "itemType": 2,
      "id": "Skull Pendant",
      "displayName": "Skull Pendant"
    },
    {
      "itemType": 2,
      "id": "Skullhacker",
      "displayName": "Skullhacker",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sky Raider Hat",
      "displayName": "Sky Raider Hat"
    },
    {
      "itemType": 2,
      "id": "Skybreaker Staff",
      "displayName": "Skybreaker Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Skywing Mask",
      "displayName": "Skywing Mask"
    },
    {
      "itemType": 2,
      "id": "Slingshot",
      "displayName": "Slingshot",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Smith's Tools",
      "displayName": "Smith's Tools"
    },
    {
      "itemType": 2,
      "id": "Sniper Rifle",
      "displayName": "Sniper Rifle",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Snowbun Earmuffs",
      "displayName": "Snowbun Earmuffs"
    },
    {
      "itemType": 2,
      "id": "Snowman Head",
      "displayName": "Snowman Head"
    },
    {
      "itemType": 2,
      "id": "Solar Relic",
      "displayName": "Solar Relic"
    },
    {
      "itemType": 2,
      "id": "Solar Spear",
      "displayName": "Solar Spear",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Solaris Blade",
      "displayName": "Solaris Blade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sonic Shoes",
      "displayName": "Sonic Shoes"
    },
    {
      "itemType": 2,
      "id": "Soul Reaper Scythe",
      "displayName": "Blight Reaver",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "SoulbinderChest",
      "displayName": "Soulbinder Chest"
    },
    {
      "itemType": 2,
      "id": "SoulbinderFeet",
      "displayName": "Soulbinder Shoes"
    },
    {
      "itemType": 2,
      "id": "SoulbinderLegs",
      "displayName": "Soulbinder Legs"
    },
    {
      "itemType": 2,
      "id": "Spiked Club",
      "displayName": "Spiked Club",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Spiked Familiar",
      "displayName": "Spiked Familiar"
    },
    {
      "itemType": 2,
      "id": "Spiked Helm",
      "displayName": "Spiked Helm"
    },
    {
      "itemType": 2,
      "id": "Spikesteel Helm",
      "displayName": "Spikesteel Helm"
    },
    {
      "itemType": 2,
      "id": "Spined Aegis",
      "displayName": "Spined Aegis"
    },
    {
      "itemType": 2,
      "id": "Spineshard",
      "displayName": "Spineshard",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Spirit Familiar",
      "displayName": "Spirit Familiar"
    },
    {
      "itemType": 2,
      "id": "Spirit Ward",
      "displayName": "Spirit Ward"
    },
    {
      "itemType": 2,
      "id": "Spooky Spell Hat",
      "displayName": "Spooky Spell Hat"
    },
    {
      "itemType": 2,
      "id": "Springram Horns",
      "displayName": "Springram Horns"
    },
    {
      "itemType": 2,
      "id": "Staff of Eternis",
      "displayName": "Staff of Eternis",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Star",
      "displayName": "Star"
    },
    {
      "itemType": 2,
      "id": "Starbound Hat",
      "displayName": "Starbound Hat"
    },
    {
      "itemType": 2,
      "id": "Starshine Glasses",
      "displayName": "Starshine Glasses"
    },
    {
      "itemType": 2,
      "id": "Stiletto",
      "displayName": "Stiletto",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stonebound Boots",
      "displayName": "Stonebound Boots"
    },
    {
      "itemType": 2,
      "id": "Stoneguard",
      "displayName": "Stoneguard"
    },
    {
      "itemType": 2,
      "id": "Stonepoint Spear",
      "displayName": "Stonepoint Spear",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stormburst Crossbow",
      "displayName": "Stormburst Crossbow",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Stormcall Kunai",
      "displayName": "Stormcall Kunai",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Stormcaller Totem",
      "displayName": "Stormcaller Totem"
    },
    {
      "itemType": 2,
      "id": "Stormfeather Kunai",
      "displayName": "Stormfeather Kunai",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Stormpiercer",
      "displayName": "Stormpiercer",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "StormplateChest",
      "displayName": "Stormplate Chest"
    },
    {
      "itemType": 2,
      "id": "StormplateFeet",
      "displayName": "Stormplate Shoes"
    },
    {
      "itemType": 2,
      "id": "StormplateLegs",
      "displayName": "Stormplate Legs"
    },
    {
      "itemType": 2,
      "id": "Straw Hat",
      "displayName": "Straw Hat"
    },
    {
      "itemType": 2,
      "id": "Stylish Shades",
      "displayName": "Stylish Shades"
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
      "displayName": "Sun Disc"
    },
    {
      "itemType": 2,
      "id": "Sun Emblem",
      "displayName": "Sun Emblem"
    },
    {
      "itemType": 2,
      "id": "Sun Emblem Helm",
      "displayName": "Sun Emblem Helm"
    },
    {
      "itemType": 2,
      "id": "Sun Lion Crest",
      "displayName": "Sun Lion Crest"
    },
    {
      "itemType": 2,
      "id": "Sunbound Mitts",
      "displayName": "Sunbound Mitts"
    },
    {
      "itemType": 2,
      "id": "Suncrest Mace",
      "displayName": "Suncrest Mace",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Sunflare",
      "displayName": "Sunflare",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sunflower Clip",
      "displayName": "Sunflower Clip"
    },
    {
      "itemType": 2,
      "id": "Sunglasses",
      "displayName": "Sunglasses"
    },
    {
      "itemType": 2,
      "id": "Sunset Shutters",
      "displayName": "Sunset Shutters"
    },
    {
      "itemType": 2,
      "id": "Swampy Hat",
      "displayName": "Swampy Hat"
    },
    {
      "itemType": 2,
      "id": "Swift Fang",
      "displayName": "Serpent Fang",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Sword",
      "displayName": "Sword",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Teapot Spirit",
      "displayName": "Teapot Spirit"
    },
    {
      "itemType": 2,
      "id": "Tempest Robes",
      "displayName": "Tempest Robes"
    },
    {
      "itemType": 2,
      "id": "Tempest Staff",
      "displayName": "Tempest Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Thief Mask",
      "displayName": "Thief Mask"
    },
    {
      "itemType": 2,
      "id": "ThiefChest",
      "displayName": "Ashwalker Chest"
    },
    {
      "itemType": 2,
      "id": "ThiefFeet",
      "displayName": "Ashwalker Shoes"
    },
    {
      "itemType": 2,
      "id": "ThiefLegs",
      "displayName": "Ashwalker Legs"
    },
    {
      "itemType": 2,
      "id": "Thundercoil",
      "displayName": "Thundercoil",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Tiger Hat",
      "displayName": "Tiger Hat"
    },
    {
      "itemType": 2,
      "id": "Tinker Goggles",
      "displayName": "Tinker Goggles"
    },
    {
      "itemType": 2,
      "id": "Tinker Mask",
      "displayName": "Tinker Mask"
    },
    {
      "itemType": 2,
      "id": "Tinkerer's Tools",
      "displayName": "Tinkerer's Tools"
    },
    {
      "itemType": 2,
      "id": "Tomahawk",
      "displayName": "Tomahawk",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Tome of Ages",
      "displayName": "Tome of Ages"
    },
    {
      "itemType": 2,
      "id": "Top Hat",
      "displayName": "Top Hat"
    },
    {
      "itemType": 2,
      "id": "Totem Banner",
      "displayName": "Totem Banner"
    },
    {
      "itemType": 2,
      "id": "Totem Mask",
      "displayName": "Totem Mask"
    },
    {
      "itemType": 2,
      "id": "Totem Skull Headdress",
      "displayName": "Totem Skull Headdress"
    },
    {
      "itemType": 2,
      "id": "Traveler's Trunk",
      "displayName": "Traveler's Trunk"
    },
    {
      "itemType": 2,
      "id": "Treasure Box",
      "displayName": "Treasure Box"
    },
    {
      "itemType": 2,
      "id": "Treasure Chest",
      "displayName": "Treasure Chest"
    },
    {
      "itemType": 2,
      "id": "Tribal Mask",
      "displayName": "Tribal Mask"
    },
    {
      "itemType": 2,
      "id": "Trickster Horns",
      "displayName": "Trickster Horns"
    },
    {
      "itemType": 2,
      "id": "Trident of Tides",
      "displayName": "Trident of Tides",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Triple Barrel Revolver",
      "displayName": "Triple Barrel Revolver",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "TurtleShell",
      "displayName": "Turtle Shell"
    },
    {
      "itemType": 2,
      "id": "Twinblade",
      "displayName": "Twinblade",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Valiant Crown",
      "displayName": "Valiant Crown"
    },
    {
      "itemType": 2,
      "id": "Valor Helm",
      "displayName": "Valor Helm"
    },
    {
      "itemType": 2,
      "id": "Ventilator Mask",
      "displayName": "Ventilator Mask"
    },
    {
      "itemType": 2,
      "id": "Verdant Antlers",
      "displayName": "Verdant Antlers"
    },
    {
      "itemType": 2,
      "id": "Verdant Core",
      "displayName": "Verdant Core",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Verdant Striders",
      "displayName": "Verdant Striders"
    },
    {
      "itemType": 2,
      "id": "Violet Heart Charm",
      "displayName": "Violet Heart Charm"
    },
    {
      "itemType": 2,
      "id": "Void Urn",
      "displayName": "Void Urn"
    },
    {
      "itemType": 2,
      "id": "Voidspike Helm",
      "displayName": "Voidspike Helm"
    },
    {
      "itemType": 2,
      "id": "Voidthreads",
      "displayName": "Voidthreads"
    },
    {
      "itemType": 2,
      "id": "War Axe",
      "displayName": "War Axe",
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "War Banner",
      "displayName": "War Banner"
    },
    {
      "itemType": 2,
      "id": "Warborn Aegis",
      "displayName": "Warborn Aegis"
    },
    {
      "itemType": 2,
      "id": "Warlord Emblem Shield",
      "displayName": "Warlord Emblem Shield"
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
      "substatGroup": "Melee"
    },
    {
      "itemType": 2,
      "id": "Water Shield",
      "displayName": "Frostspire Guard"
    },
    {
      "itemType": 2,
      "id": "Weaver Gauntlets",
      "displayName": "Weaver Gauntlets"
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
      "displayName": "Weaver Chest"
    },
    {
      "itemType": 2,
      "id": "WeaverFeet",
      "displayName": "Weaver Shoes"
    },
    {
      "itemType": 2,
      "id": "WeaverLegs",
      "displayName": "Weaver Legs"
    },
    {
      "itemType": 2,
      "id": "Whale Backpack",
      "displayName": "Whale Backpack"
    },
    {
      "itemType": 2,
      "id": "Whisper of Thorns",
      "displayName": "Whisper of Thorns",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "White Bishop's Hood",
      "displayName": "White Bishop's Hood"
    },
    {
      "itemType": 2,
      "id": "Wilderness Pack",
      "displayName": "Wilderness Pack"
    },
    {
      "itemType": 2,
      "id": "Wildroot Veil",
      "displayName": "Wildroot Veil"
    },
    {
      "itemType": 2,
      "id": "Willow Staff",
      "displayName": "Willow Staff",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Wind Shield",
      "displayName": "Zephyr Cross"
    },
    {
      "itemType": 2,
      "id": "Windcarver",
      "displayName": "Windcarver",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Windroot",
      "displayName": "Windroot",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "WindstriderChest",
      "displayName": "Windstrider Chest"
    },
    {
      "itemType": 2,
      "id": "WindstriderFeet",
      "displayName": "Windstrider Shoes"
    },
    {
      "itemType": 2,
      "id": "WindstriderLegs",
      "displayName": "Windstrider Legs"
    },
    {
      "itemType": 2,
      "id": "Winged Helm",
      "displayName": "Winged Helm"
    },
    {
      "itemType": 2,
      "id": "Wings of Valor",
      "displayName": "Wings of Valor"
    },
    {
      "itemType": 2,
      "id": "Witch's Whisk",
      "displayName": "Witch's Whisk",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Witchsteps",
      "displayName": "Witchsteps"
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
      "displayName": "Wizardry Hat"
    },
    {
      "itemType": 2,
      "id": "Wolfcrest Shield",
      "displayName": "Wolfcrest Shield"
    },
    {
      "itemType": 2,
      "id": "Wooden Guard",
      "displayName": "Wooden Guard"
    },
    {
      "itemType": 2,
      "id": "Worker's Cap",
      "displayName": "Worker's Cap"
    },
    {
      "itemType": 2,
      "id": "Wraith of Dawn",
      "displayName": "Wraith of Dawn",
      "substatGroup": "Ranged"
    },
    {
      "itemType": 2,
      "id": "Wraithlight",
      "displayName": "Wraithlight",
      "substatGroup": "Magic"
    },
    {
      "itemType": 2,
      "id": "Zephyrlight",
      "displayName": "Zephyrlight",
      "substatGroup": "Magic"
    }
  ] as const satisfies readonly FishNetEquipmentItemDefinition[];
}
