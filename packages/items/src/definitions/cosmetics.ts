import type { FishNetItemDefinition } from "../catalog.ts";

export class CosmeticItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 6,
      "id": "3D Glasses",
      "displayName": "3DGlasses"
    },
    {
      "itemType": 6,
      "id": "Abyss Shard",
      "displayName": "Abyss Shard"
    },
    {
      "itemType": 6,
      "id": "Acolyte_1",
      "displayName": "Scripture of Mercy"
    },
    {
      "itemType": 6,
      "id": "Acolyte_2",
      "displayName": "Radiant Strikes"
    },
    {
      "itemType": 6,
      "id": "Acolyte_3",
      "displayName": "Radiant Judgment"
    },
    {
      "itemType": 6,
      "id": "Acolyte_4",
      "displayName": "Gospel of Grace"
    },
    {
      "itemType": 6,
      "id": "Acolyte_5",
      "displayName": "Lightweaver"
    },
    {
      "itemType": 6,
      "id": "Acolyte_6",
      "displayName": "Sacred Rhythm"
    },
    {
      "itemType": 6,
      "id": "Adventurer's Kit",
      "displayName": "Adventurer's Kit"
    },
    {
      "itemType": 6,
      "id": "Adventurer's Pack",
      "displayName": "Adventurer's Pack"
    },
    {
      "itemType": 6,
      "id": "Alien Cyclops",
      "displayName": "Voidspawn Pet"
    },
    {
      "itemType": 6,
      "id": "Alien Sporella",
      "displayName": "Chompcap Pet"
    },
    {
      "itemType": 6,
      "id": "Alien Star",
      "displayName": "Little Star Pet"
    },
    {
      "itemType": 6,
      "id": "Alien Wheel",
      "displayName": "Cinderwheel Pet"
    },
    {
      "itemType": 6,
      "id": "Amber Bow",
      "displayName": "Amber Bow"
    },
    {
      "itemType": 6,
      "id": "Amber Loop",
      "displayName": "Amber Loop"
    },
    {
      "itemType": 6,
      "id": "Arcane Sigil",
      "displayName": "Arcane Sigil"
    },
    {
      "itemType": 6,
      "id": "ArcaneChest",
      "displayName": "Arcane Chest"
    },
    {
      "itemType": 6,
      "id": "ArcaneFeet",
      "displayName": "Arcane Boots"
    },
    {
      "itemType": 6,
      "id": "ArcaneGloves",
      "displayName": "Arcane Gloves"
    },
    {
      "itemType": 6,
      "id": "ArcaneLegs",
      "displayName": "Arcane Legs"
    },
    {
      "itemType": 6,
      "id": "Archangel",
      "displayName": "Archangel Pet"
    },
    {
      "itemType": 6,
      "id": "Archer's Beads",
      "displayName": "Archer's Beads"
    },
    {
      "itemType": 6,
      "id": "Armor_Agi",
      "displayName": "Speed Plate"
    },
    {
      "itemType": 6,
      "id": "Armor_Dex",
      "displayName": "Precision Plate"
    },
    {
      "itemType": 6,
      "id": "Armor_Int",
      "displayName": "Mind Plate"
    },
    {
      "itemType": 6,
      "id": "Armor_Luk",
      "displayName": "Fate Plate"
    },
    {
      "itemType": 6,
      "id": "Armor_Str",
      "displayName": "Power Plate"
    },
    {
      "itemType": 6,
      "id": "Armor_Vit",
      "displayName": "Endurance Plate"
    },
    {
      "itemType": 6,
      "id": "Arrow Quiver",
      "displayName": "Arrow Quiver"
    },
    {
      "itemType": 6,
      "id": "Arrowcatch Wall",
      "displayName": "Arrowcatch Wall"
    },
    {
      "itemType": 6,
      "id": "Artemis",
      "displayName": "Artemis"
    },
    {
      "itemType": 6,
      "id": "Aura_Angel",
      "displayName": "Angelic Aura"
    },
    {
      "itemType": 6,
      "id": "Aura_Demon",
      "displayName": "Demonic Aura"
    },
    {
      "itemType": 6,
      "id": "Axe",
      "displayName": "Axe"
    },
    {
      "itemType": 6,
      "id": "Axe of Oblivion",
      "displayName": "Axe of Oblivion"
    },
    {
      "itemType": 6,
      "id": "Axe_GladysAxe",
      "displayName": "Gladys Axe"
    },
    {
      "itemType": 6,
      "id": "Axe_Umbra",
      "displayName": "Umbra Axe"
    },
    {
      "itemType": 6,
      "id": "Axe2H_Umbra",
      "displayName": "Umbra Axe2H"
    },
    {
      "itemType": 6,
      "id": "Azure Antlers",
      "displayName": "Azure Antlers"
    },
    {
      "itemType": 6,
      "id": "Azure Crown",
      "displayName": "Azure Crown"
    },
    {
      "itemType": 6,
      "id": "Azure Cutlass",
      "displayName": "Azure Cutlass"
    },
    {
      "itemType": 6,
      "id": "Azure Prism",
      "displayName": "Azure Prism"
    },
    {
      "itemType": 6,
      "id": "Azure Tag",
      "displayName": "Azure Tag"
    },
    {
      "itemType": 6,
      "id": "Back_Academy",
      "displayName": "Academy Backpack"
    },
    {
      "itemType": 6,
      "id": "Back_Angel",
      "displayName": "Angel Back"
    },
    {
      "itemType": 6,
      "id": "Back_BabyChicken",
      "displayName": "Baby Chicken"
    },
    {
      "itemType": 6,
      "id": "Back_Balloon",
      "displayName": "Balloon"
    },
    {
      "itemType": 6,
      "id": "Back_BucketofShrooms",
      "displayName": "Bucket of Shrooms"
    },
    {
      "itemType": 6,
      "id": "Back_Cape_100m",
      "displayName": "100m Cape"
    },
    {
      "itemType": 6,
      "id": "Back_Cape_Gladys",
      "displayName": "Gladys Cape"
    },
    {
      "itemType": 6,
      "id": "Back_CatBoltTail",
      "displayName": "Cat Bolt Tail"
    },
    {
      "itemType": 6,
      "id": "Back_CrystalWings",
      "displayName": "Crystal Wings"
    },
    {
      "itemType": 6,
      "id": "Back_Cuervo",
      "displayName": "Cuervo Back"
    },
    {
      "itemType": 6,
      "id": "Back_CyberRogue",
      "displayName": "Cyber Rogue Back"
    },
    {
      "itemType": 6,
      "id": "Back_Demonic",
      "displayName": "Demonic Back"
    },
    {
      "itemType": 6,
      "id": "Back_DragonWings",
      "displayName": "Dragon Wings"
    },
    {
      "itemType": 6,
      "id": "Back_DualAxes",
      "displayName": "Dual Axes"
    },
    {
      "itemType": 6,
      "id": "Back_FairyWings",
      "displayName": "Fairy Wings"
    },
    {
      "itemType": 6,
      "id": "Back_FlowerPot",
      "displayName": "Flower Pot"
    },
    {
      "itemType": 6,
      "id": "Back_ForgeWings",
      "displayName": "Forge Wings"
    },
    {
      "itemType": 6,
      "id": "Back_HolyCape",
      "displayName": "Holy Cape"
    },
    {
      "itemType": 6,
      "id": "Back_HourGlass",
      "displayName": "Hour Glass"
    },
    {
      "itemType": 6,
      "id": "Back_MinersPouch",
      "displayName": "Miners Pouch"
    },
    {
      "itemType": 6,
      "id": "Back_RaggedCape",
      "displayName": "Ragged Cape"
    },
    {
      "itemType": 6,
      "id": "Back_Supporterstar",
      "displayName": "Support Star"
    },
    {
      "itemType": 6,
      "id": "Back_TeddyBear",
      "displayName": "Teddy Bear"
    },
    {
      "itemType": 6,
      "id": "Back_UmbrasGrace",
      "displayName": "Umbra's Grace"
    },
    {
      "itemType": 6,
      "id": "Back_VitaeGift",
      "displayName": "Vitae's Gift"
    },
    {
      "itemType": 6,
      "id": "Back_WolfPack",
      "displayName": "Wolf Backpack"
    },
    {
      "itemType": 6,
      "id": "Backpack",
      "displayName": "Backpack"
    },
    {
      "itemType": 6,
      "id": "Badge_Demonic",
      "displayName": "Demonic"
    },
    {
      "itemType": 6,
      "id": "Badge_Designer",
      "displayName": "Designer"
    },
    {
      "itemType": 6,
      "id": "Bandit Wrap",
      "displayName": "Bandit Wrap"
    },
    {
      "itemType": 6,
      "id": "Banner Helm",
      "displayName": "Banner Helm"
    },
    {
      "itemType": 6,
      "id": "Bat",
      "displayName": "Bat Pet"
    },
    {
      "itemType": 6,
      "id": "Batling Familiar",
      "displayName": "Batling Familiar"
    },
    {
      "itemType": 6,
      "id": "Battle Bonnet",
      "displayName": "Battle Bonnet"
    },
    {
      "itemType": 6,
      "id": "Bear Backpack",
      "displayName": "Bear Backpack"
    },
    {
      "itemType": 6,
      "id": "Bear Hug Hood",
      "displayName": "Bear Hug Hood"
    },
    {
      "itemType": 6,
      "id": "Beast Helm",
      "displayName": "Beast Helm"
    },
    {
      "itemType": 6,
      "id": "Beast Hood",
      "displayName": "Beast Hood"
    },
    {
      "itemType": 6,
      "id": "Beast Pelt Hood",
      "displayName": "Beast Pelt Hood"
    },
    {
      "itemType": 6,
      "id": "Bee",
      "displayName": "Bee Pet"
    },
    {
      "itemType": 6,
      "id": "BerserkChest",
      "displayName": "Direwolf Chest"
    },
    {
      "itemType": 6,
      "id": "Berserker_1",
      "displayName": "War Cry"
    },
    {
      "itemType": 6,
      "id": "Berserker_2",
      "displayName": "Crimson Frenzy"
    },
    {
      "itemType": 6,
      "id": "Berserker_3",
      "displayName": "Slaughter Instinct"
    },
    {
      "itemType": 6,
      "id": "Berserker_4",
      "displayName": "Executioner"
    },
    {
      "itemType": 6,
      "id": "BerserkFeet",
      "displayName": "Direwolf Shoes"
    },
    {
      "itemType": 6,
      "id": "BerserkLegs",
      "displayName": "Direwolf Legs"
    },
    {
      "itemType": 6,
      "id": "Binding Spirits Staff",
      "displayName": "Binding Spirits Staff"
    },
    {
      "itemType": 6,
      "id": "Bishop's Hood",
      "displayName": "Bishop's Hood"
    },
    {
      "itemType": 6,
      "id": "Blacksteel Blade",
      "displayName": "Blacksteel Blade"
    },
    {
      "itemType": 6,
      "id": "Blade of Eclipse",
      "displayName": "Blade of Eclipse"
    },
    {
      "itemType": 6,
      "id": "Blade Standard",
      "displayName": "Blade Standard"
    },
    {
      "itemType": 6,
      "id": "Blindfold",
      "displayName": "Blindfold"
    },
    {
      "itemType": 6,
      "id": "Blood Clip",
      "displayName": "Blood Clip"
    },
    {
      "itemType": 6,
      "id": "Blood Pendant",
      "displayName": "Blood Pendant"
    },
    {
      "itemType": 6,
      "id": "Bloodbound",
      "displayName": "Bloodbound"
    },
    {
      "itemType": 6,
      "id": "Bloom of Midnight",
      "displayName": "Bloom of Midnight"
    },
    {
      "itemType": 6,
      "id": "Bloom Pendant",
      "displayName": "Bloom Pendant"
    },
    {
      "itemType": 6,
      "id": "Bloom Ring",
      "displayName": "Bloom Ring"
    },
    {
      "itemType": 6,
      "id": "Blue Shell",
      "displayName": "Blue Shell"
    },
    {
      "itemType": 6,
      "id": "Blunderbuss",
      "displayName": "Blunderbuss"
    },
    {
      "itemType": 6,
      "id": "Bomb",
      "displayName": "Bomb Pet"
    },
    {
      "itemType": 6,
      "id": "Bomb Bud",
      "displayName": "Bomb Bud"
    },
    {
      "itemType": 6,
      "id": "Bone Channeler",
      "displayName": "Bone Channeler"
    },
    {
      "itemType": 6,
      "id": "Bone Helm",
      "displayName": "Bone Helm"
    },
    {
      "itemType": 6,
      "id": "Bone Pick",
      "displayName": "Bone Pick"
    },
    {
      "itemType": 6,
      "id": "Bonefang",
      "displayName": "Bonefang"
    },
    {
      "itemType": 6,
      "id": "Bow_Umbra",
      "displayName": "Umbra Bow"
    },
    {
      "itemType": 6,
      "id": "Boxy Robot",
      "displayName": "Boxy Robot Pet"
    },
    {
      "itemType": 6,
      "id": "BreezeguardChest",
      "displayName": "Breezeguard Chest"
    },
    {
      "itemType": 6,
      "id": "BreezeguardFeet",
      "displayName": "Breezeguard Shoes"
    },
    {
      "itemType": 6,
      "id": "BreezeguardLegs",
      "displayName": "Breezeguard Legs"
    },
    {
      "itemType": 6,
      "id": "Brimblade",
      "displayName": "Brimblade"
    },
    {
      "itemType": 6,
      "id": "Broad Sword",
      "displayName": "Broad Sword"
    },
    {
      "itemType": 6,
      "id": "Bronze Crescent",
      "displayName": "Bronze Crescent"
    },
    {
      "itemType": 6,
      "id": "Bronze Plugs",
      "displayName": "Bronze Plugs"
    },
    {
      "itemType": 6,
      "id": "Bronze Visage",
      "displayName": "Bronze Visage"
    },
    {
      "itemType": 6,
      "id": "Bubblebeast Hood",
      "displayName": "Bubblebeast Hood"
    },
    {
      "itemType": 6,
      "id": "Buckler",
      "displayName": "Buckler"
    },
    {
      "itemType": 6,
      "id": "Bud",
      "displayName": "Venom Bud Pet"
    },
    {
      "itemType": 6,
      "id": "Bullcrest Helm",
      "displayName": "Bullcrest Helm"
    },
    {
      "itemType": 6,
      "id": "Bunny Backpack",
      "displayName": "Bunny Backpack"
    },
    {
      "itemType": 6,
      "id": "Bunny Cap",
      "displayName": "Bunny Cap"
    },
    {
      "itemType": 6,
      "id": "Burrow",
      "displayName": "Digger Pet"
    },
    {
      "itemType": 6,
      "id": "Butterfly Fairy",
      "displayName": "Fairy Pet"
    },
    {
      "itemType": 6,
      "id": "Cactus",
      "displayName": "Cactus Pet"
    },
    {
      "itemType": 6,
      "id": "Caged Spirit",
      "displayName": "Caged Spirit"
    },
    {
      "itemType": 6,
      "id": "Cardboard Chick",
      "displayName": "Cardboard Chick"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_1",
      "displayName": "Brown Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_10",
      "displayName": "Travel Backpack"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_16",
      "displayName": "Red Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_2",
      "displayName": "School Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_3",
      "displayName": "Hipster Backpack"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_4",
      "displayName": "Brown Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_5",
      "displayName": "White Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_6",
      "displayName": "Blue Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_7",
      "displayName": "Leather Backpack"
    },
    {
      "itemType": 6,
      "id": "Casual_Back_8",
      "displayName": "Stylish Bag"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_1",
      "displayName": "Duck Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_10",
      "displayName": "Yellow Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_11",
      "displayName": "Blue Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_12",
      "displayName": "Red Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_14",
      "displayName": "Purple Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_15",
      "displayName": "Pink Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_16",
      "displayName": "Grey Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_17",
      "displayName": "Monster Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_18",
      "displayName": "Green Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_19",
      "displayName": "Brown Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_20",
      "displayName": "Black Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_21",
      "displayName": "Cute Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_22",
      "displayName": "Purple Sweater"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_23",
      "displayName": "Yellow Hoodie"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_24",
      "displayName": "Orange Hoodie"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_25",
      "displayName": "Blue Hoodie"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_26",
      "displayName": "Navy Hoodie"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_27",
      "displayName": "White Bomber Jacket"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_28",
      "displayName": "Black Bomber Jacket"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_29",
      "displayName": "Blue Bomber Jacket"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_3",
      "displayName": "White T"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_30",
      "displayName": "Stylish Bomber Jacket"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_31",
      "displayName": "Brown Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_32",
      "displayName": "Blue Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_33",
      "displayName": "White Jersey"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_35",
      "displayName": "Formal Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_36",
      "displayName": "Blue Formal Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_37",
      "displayName": "Smart Casual Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_38",
      "displayName": "Yellow School Wear"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_39",
      "displayName": "Pink School Wear"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_40",
      "displayName": "Black School Wear"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_41",
      "displayName": "Blue School Wear"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_42",
      "displayName": "Captain Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_43",
      "displayName": "Sailor Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_44",
      "displayName": "White Dress Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_45",
      "displayName": "Yellow Dress Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_46",
      "displayName": "Purple Dress Shirt"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_49",
      "displayName": "Business Graduation Gown"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_5",
      "displayName": "Black T"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_50",
      "displayName": "Science Graduation Gown"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_51",
      "displayName": "Fireman Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_53",
      "displayName": "Bandit Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_54",
      "displayName": "Royal Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_55",
      "displayName": "Hexweaver Robe"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_56",
      "displayName": "Witches Robe"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_57",
      "displayName": "Bunny Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_58",
      "displayName": "Dino Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_59",
      "displayName": "Bear Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_6",
      "displayName": "Yellow T"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_60",
      "displayName": "Neko Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_61",
      "displayName": "Festive Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_62",
      "displayName": "Red Boxing Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_63",
      "displayName": "Shark Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_64",
      "displayName": "Football Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_7",
      "displayName": "Blue T"
    },
    {
      "itemType": 6,
      "id": "Casual_Chest_70",
      "displayName": "Tuxedo Top"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_10",
      "displayName": "Diva Shades"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_13",
      "displayName": "Snow Goggles"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_14",
      "displayName": "Diver Goggles"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_15",
      "displayName": "Aviator Goggles"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_17",
      "displayName": "Red Bandit Mask"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_3",
      "displayName": "Hipster Specs"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_4",
      "displayName": "Stylish Specs"
    },
    {
      "itemType": 6,
      "id": "Casual_Eyewear_8",
      "displayName": "Star Glasses"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_1",
      "displayName": "Blue Dress Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_10",
      "displayName": "School Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_11",
      "displayName": "School Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_12",
      "displayName": "Dress Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_13",
      "displayName": "Dress Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_14",
      "displayName": "Dress Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_15",
      "displayName": "Dress Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_16",
      "displayName": "Tuxedo Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_17",
      "displayName": "Violet Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_18",
      "displayName": "Black Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_19",
      "displayName": "Black Sneakers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_2",
      "displayName": "Green Sneakers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_20",
      "displayName": "Fireman Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_21",
      "displayName": "Grey Hightops"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_22",
      "displayName": "Hiking Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_23",
      "displayName": "Forest Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_24",
      "displayName": "Heavy Duty Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_25",
      "displayName": "Royal Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_27",
      "displayName": "Bandit Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_28",
      "displayName": "Dress Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_29",
      "displayName": "Pointed Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_3",
      "displayName": "Yellow Sneakers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_30",
      "displayName": "Pointed Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_32",
      "displayName": "Witch Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_33",
      "displayName": "Witch Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_34",
      "displayName": "Elf Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_35",
      "displayName": "Bunny Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_36",
      "displayName": "Dino Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_37",
      "displayName": "Bear Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_38",
      "displayName": "Neko Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_39",
      "displayName": "Festive Slippers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_4",
      "displayName": "Orange Sneakers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_40",
      "displayName": "Diver Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_41",
      "displayName": "Red Runners"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_42",
      "displayName": "Blue Sneakers"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_43",
      "displayName": "Football Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_48",
      "displayName": "Strapped Boots"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_5",
      "displayName": "White Runners"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_50",
      "displayName": "Monster Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_51",
      "displayName": "Shark Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_52",
      "displayName": "Duck Shoes"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_6",
      "displayName": "Red Runners"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_7",
      "displayName": "Black Runners"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_8",
      "displayName": "Blue Runners"
    },
    {
      "itemType": 6,
      "id": "Casual_Feet_9",
      "displayName": "Hipster Hightops"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_10",
      "displayName": "Neko Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_11",
      "displayName": "Bear Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_12",
      "displayName": "Festive Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_13",
      "displayName": "Red Boxing Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_14",
      "displayName": "Blue Boxing Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_15",
      "displayName": "Football Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_21",
      "displayName": "Monster Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_22",
      "displayName": "Duck Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_3",
      "displayName": "Hiking Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_4",
      "displayName": "Leather Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_5",
      "displayName": "Elf Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_8",
      "displayName": "Bunny Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Hands_9",
      "displayName": "Dino Gloves"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_1",
      "displayName": "Baseball Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_10",
      "displayName": "Blue Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_13",
      "displayName": "Straw Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_14",
      "displayName": "Cowboy Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_16",
      "displayName": "Spring Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_17",
      "displayName": "Ribbon Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_2",
      "displayName": "Black Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_20",
      "displayName": "Chicky Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_21",
      "displayName": "Scout Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_23",
      "displayName": "Banana Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_28",
      "displayName": "Captain Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_29",
      "displayName": "Sailor Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_30",
      "displayName": "Science Graduation Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_31",
      "displayName": "Business Graduation Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_39",
      "displayName": "Fireman Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_4",
      "displayName": "Hipster Cap"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_41",
      "displayName": "Red Bandit Bandana"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_42",
      "displayName": "Blue Bandit Bandana"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_46",
      "displayName": "Royal Crown"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_5",
      "displayName": "Black Beanie"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_6",
      "displayName": "Blue Beanie"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_7",
      "displayName": "Snow Beanie"
    },
    {
      "itemType": 6,
      "id": "Casual_Head_8",
      "displayName": "Artist Hat"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_1",
      "displayName": "Duck Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_10",
      "displayName": "Monster Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_13",
      "displayName": "Orange Shorts"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_15",
      "displayName": "Tuxedo Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_18",
      "displayName": "Brown Cargos"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_19",
      "displayName": "Grey Cargos"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_2",
      "displayName": "Black Boxers"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_20",
      "displayName": "Black Cargos"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_21",
      "displayName": "Green Cargos"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_22",
      "displayName": "Blue Cargos"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_23",
      "displayName": "White Jeans"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_24",
      "displayName": "Light Jeans"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_25",
      "displayName": "Navy Jeans"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_3",
      "displayName": "Blue Boxers"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_32",
      "displayName": "Red Dress"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_33",
      "displayName": "Black Dress"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_34",
      "displayName": "Fireman Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_36",
      "displayName": "Bandit Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_37",
      "displayName": "Royal Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_38",
      "displayName": "Blue Shorts"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_40",
      "displayName": "Bunny Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_41",
      "displayName": "Dino Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_42",
      "displayName": "Bear Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_43",
      "displayName": "Neko Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_44",
      "displayName": "Festive Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_45",
      "displayName": "Diver Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_47",
      "displayName": "Shark Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_48",
      "displayName": "Football Pants"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_54",
      "displayName": "Red Dress"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_7",
      "displayName": "Yellow Boxers"
    },
    {
      "itemType": 6,
      "id": "Casual_Legs_8",
      "displayName": "White Shorts"
    },
    {
      "itemType": 6,
      "id": "Cat Meow",
      "displayName": "Sparkit Pet"
    },
    {
      "itemType": 6,
      "id": "Centurion Helm",
      "displayName": "Centurion Helm"
    },
    {
      "itemType": 6,
      "id": "Ceremonial Mask",
      "displayName": "Ceremonial Mask"
    },
    {
      "itemType": 6,
      "id": "Cerulean Scepter",
      "displayName": "Cerulean Scepter"
    },
    {
      "itemType": 6,
      "id": "Chainfrost Staff",
      "displayName": "Chainfrost Staff"
    },
    {
      "itemType": 6,
      "id": "Chains of Binding",
      "displayName": "Chains of Binding"
    },
    {
      "itemType": 6,
      "id": "Champion Blade",
      "displayName": "Divine Blade"
    },
    {
      "itemType": 6,
      "id": "Chaos Reaver",
      "displayName": "Chaos Reaver"
    },
    {
      "itemType": 6,
      "id": "ChatBubble_Angelic",
      "displayName": "Angelic"
    },
    {
      "itemType": 6,
      "id": "ChatBubble_Demonic",
      "displayName": "Demonic"
    },
    {
      "itemType": 6,
      "id": "Chest_AcademyF",
      "displayName": "Academy Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_AcademyM",
      "displayName": "Academy Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Angel_F",
      "displayName": "Angel Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Angel_M",
      "displayName": "Angel Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Cuervo_F",
      "displayName": "Cuervo Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Cuervo_M",
      "displayName": "Cuervo Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_CyberRogue",
      "displayName": "Cyber Rogue Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Demonic_F",
      "displayName": "Demonic Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Demonic_M",
      "displayName": "Demonic Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Easter_F",
      "displayName": "Easter Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Easter_M",
      "displayName": "Easter Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_FireFox",
      "displayName": "Fire Fox Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Gladys",
      "displayName": "Gladys Top"
    },
    {
      "itemType": 6,
      "id": "Chest_GS",
      "displayName": "Gunslinger Top"
    },
    {
      "itemType": 6,
      "id": "Chest_IceFox",
      "displayName": "Ice Fox Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Priest_F",
      "displayName": "Priest Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Priest_M",
      "displayName": "Priest Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Shinobi",
      "displayName": "Shinobi Top"
    },
    {
      "itemType": 6,
      "id": "Chest_SpiritValer",
      "displayName": "Spirit Valer Top"
    },
    {
      "itemType": 6,
      "id": "Chest_SukebanF",
      "displayName": "Sukeban Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_SukebanM",
      "displayName": "Sukeban Male Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Sunken",
      "displayName": "Sunken Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Transparent",
      "displayName": "Transparent Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Urban",
      "displayName": "Urban Top"
    },
    {
      "itemType": 6,
      "id": "Chest_WhiteCatHoodie",
      "displayName": "White Cat Hoodie"
    },
    {
      "itemType": 6,
      "id": "Chest_Wizard_F",
      "displayName": "Wizard Female Top"
    },
    {
      "itemType": 6,
      "id": "Chest_Wizard_M",
      "displayName": "Wizard Male Top"
    },
    {
      "itemType": 6,
      "id": "Chick",
      "displayName": "Chick Pet"
    },
    {
      "itemType": 6,
      "id": "Chicky Hood",
      "displayName": "Chicky Hood"
    },
    {
      "itemType": 6,
      "id": "Chirpy Hat",
      "displayName": "Chirpy Hat"
    },
    {
      "itemType": 6,
      "id": "Chompy Hood",
      "displayName": "Chompy Hood"
    },
    {
      "itemType": 6,
      "id": "Chronomancer's Codex",
      "displayName": "Chronomancer's Codex"
    },
    {
      "itemType": 6,
      "id": "ClericChest",
      "displayName": "Cleric Chest"
    },
    {
      "itemType": 6,
      "id": "ClericFeet",
      "displayName": "Cleric Shoes"
    },
    {
      "itemType": 6,
      "id": "ClericLegs",
      "displayName": "Cleric Legs"
    },
    {
      "itemType": 6,
      "id": "Cloud Loop",
      "displayName": "Cloud Loop"
    },
    {
      "itemType": 6,
      "id": "Cloud Mount",
      "displayName": "Flying Nimbus"
    },
    {
      "itemType": 6,
      "id": "Codex",
      "displayName": "Tome"
    },
    {
      "itemType": 6,
      "id": "Codex Binding Light",
      "displayName": "Grimoire of Binding Light"
    },
    {
      "itemType": 6,
      "id": "Codex First Hymn",
      "displayName": "Tome of the First Hymn"
    },
    {
      "itemType": 6,
      "id": "Codex of Revelation",
      "displayName": "Codex of Revelation"
    },
    {
      "itemType": 6,
      "id": "Codex Umbra",
      "displayName": "Codex Umbra"
    },
    {
      "itemType": 6,
      "id": "Codex Vitae",
      "displayName": "Codex Vitae"
    },
    {
      "itemType": 6,
      "id": "Combat Knife",
      "displayName": "Combat Knife"
    },
    {
      "itemType": 6,
      "id": "Cotton Mask",
      "displayName": "Cotton Mask"
    },
    {
      "itemType": 6,
      "id": "Crimson Crest",
      "displayName": "Crimson Crest"
    },
    {
      "itemType": 6,
      "id": "Crimson Plume",
      "displayName": "Crimson Plume"
    },
    {
      "itemType": 6,
      "id": "Crown of Spikes",
      "displayName": "Crown of Spikes"
    },
    {
      "itemType": 6,
      "id": "Crusader Staff",
      "displayName": "Radiant Scepter"
    },
    {
      "itemType": 6,
      "id": "Crusader Sword",
      "displayName": "Oathbreaker"
    },
    {
      "itemType": 6,
      "id": "Crystal Cache",
      "displayName": "Crystal Cache"
    },
    {
      "itemType": 6,
      "id": "Crystal Slammer",
      "displayName": "Crystal Slammer"
    },
    {
      "itemType": 6,
      "id": "Crystal Wings",
      "displayName": "Crystal Wings"
    },
    {
      "itemType": 6,
      "id": "Curse Tag",
      "displayName": "Curse Tag"
    },
    {
      "itemType": 6,
      "id": "Cursed Grimoire",
      "displayName": "Cursed Grimoire"
    },
    {
      "itemType": 6,
      "id": "Cyclops Minion",
      "displayName": "Cyclopling Pet"
    },
    {
      "itemType": 6,
      "id": "Dagger_Umbra",
      "displayName": "Umbra Dagger"
    },
    {
      "itemType": 6,
      "id": "Daggers",
      "displayName": "Daggers"
    },
    {
      "itemType": 6,
      "id": "Darkfeather Wings",
      "displayName": "Darkfeather Wings"
    },
    {
      "itemType": 6,
      "id": "Darkhide Gloves",
      "displayName": "Darkhide Gloves"
    },
    {
      "itemType": 6,
      "id": "Dawn Prayer",
      "displayName": "Dawn Prayer"
    },
    {
      "itemType": 6,
      "id": "Dawnstar",
      "displayName": "Dawnstar"
    },
    {
      "itemType": 6,
      "id": "Death",
      "displayName": "Wight Pet"
    },
    {
      "itemType": 6,
      "id": "Death's Grin",
      "displayName": "Death's Grin"
    },
    {
      "itemType": 6,
      "id": "Demon Cat",
      "displayName": "Cheshire Cat"
    },
    {
      "itemType": 6,
      "id": "Demon Hood",
      "displayName": "Demon Hood"
    },
    {
      "itemType": 6,
      "id": "Destruction Staff",
      "displayName": "Destruction Staff"
    },
    {
      "itemType": 6,
      "id": "Digger's Flask",
      "displayName": "Digger's Flask"
    },
    {
      "itemType": 6,
      "id": "Dino Cub Backpack",
      "displayName": "Dino Cub Backpack"
    },
    {
      "itemType": 6,
      "id": "DiscipleArmlets",
      "displayName": "Disciple's Bracers"
    },
    {
      "itemType": 6,
      "id": "DiscipleChest",
      "displayName": "Disciple's Manteau"
    },
    {
      "itemType": 6,
      "id": "DiscipleFeet",
      "displayName": "Disciple's Shoes"
    },
    {
      "itemType": 6,
      "id": "DiscipleHelm",
      "displayName": "Disciple's Visage"
    },
    {
      "itemType": 6,
      "id": "DiscipleLegs",
      "displayName": "Disciple's Wraps"
    },
    {
      "itemType": 6,
      "id": "Discipline Band",
      "displayName": "Discipline Band"
    },
    {
      "itemType": 6,
      "id": "Dog Pup",
      "displayName": "Pup Pet"
    },
    {
      "itemType": 6,
      "id": "Doom Crescent",
      "displayName": "Doom Crescent"
    },
    {
      "itemType": 6,
      "id": "Doom Crown",
      "displayName": "Doom Crown"
    },
    {
      "itemType": 6,
      "id": "Doom Keg",
      "displayName": "Doom Keg"
    },
    {
      "itemType": 6,
      "id": "Dragon Blizzard",
      "displayName": "Frost Wyvern Mount"
    },
    {
      "itemType": 6,
      "id": "Dragon Darkness",
      "displayName": "Shadow Wyvern Mount"
    },
    {
      "itemType": 6,
      "id": "Dragon Dusk",
      "displayName": "Dusk Drake Pet"
    },
    {
      "itemType": 6,
      "id": "Dragon Hood",
      "displayName": "Dragon Hood"
    },
    {
      "itemType": 6,
      "id": "Dragon Inferno",
      "displayName": "Inferno Wyvern Mount"
    },
    {
      "itemType": 6,
      "id": "Dragon Spark",
      "displayName": "Spark Drake Pet"
    },
    {
      "itemType": 6,
      "id": "Dragon Water",
      "displayName": "Aqua Drake Pet"
    },
    {
      "itemType": 6,
      "id": "Dragonfly Darner",
      "displayName": "Skimmer Pet"
    },
    {
      "itemType": 6,
      "id": "Dragonic Spear",
      "displayName": "Dragonic Spear"
    },
    {
      "itemType": 6,
      "id": "Dragonspire Helm",
      "displayName": "Dragonspire Helm"
    },
    {
      "itemType": 6,
      "id": "Drooping Angel",
      "displayName": "Drooping Angel"
    },
    {
      "itemType": 6,
      "id": "Drooping Bat",
      "displayName": "Drooping Bat"
    },
    {
      "itemType": 6,
      "id": "Drooping Burrow",
      "displayName": "Drooping Burrow"
    },
    {
      "itemType": 6,
      "id": "Drooping Cat",
      "displayName": "Drooping Cat"
    },
    {
      "itemType": 6,
      "id": "Drooping Dragon",
      "displayName": "Drooping Dragon"
    },
    {
      "itemType": 6,
      "id": "Drooping Flora",
      "displayName": "Drooping Flora"
    },
    {
      "itemType": 6,
      "id": "Drooping Pup",
      "displayName": "Drooping Pup"
    },
    {
      "itemType": 6,
      "id": "Drooping Skeleton",
      "displayName": "Drooping Skeleton"
    },
    {
      "itemType": 6,
      "id": "Drooping Wraith",
      "displayName": "Drooping Wraith"
    },
    {
      "itemType": 6,
      "id": "Dualblade Sheath",
      "displayName": "Dualblade Sheath"
    },
    {
      "itemType": 6,
      "id": "Duskfang",
      "displayName": "Duskfang"
    },
    {
      "itemType": 6,
      "id": "Dustweaver Hat",
      "displayName": "Dustweaver Hat"
    },
    {
      "itemType": 6,
      "id": "Earring_AquaBeads",
      "displayName": "Aqua Beads"
    },
    {
      "itemType": 6,
      "id": "Earring_CrystalEarring",
      "displayName": "Crystal Earrings"
    },
    {
      "itemType": 6,
      "id": "Earring_Demonic",
      "displayName": "Demonic Earring"
    },
    {
      "itemType": 6,
      "id": "Earring_Earbuds",
      "displayName": "Earbuds"
    },
    {
      "itemType": 6,
      "id": "Earring_FeatherBeads",
      "displayName": "Feather Beads"
    },
    {
      "itemType": 6,
      "id": "Earring_MoonlitCrystal",
      "displayName": "Moonlit Crystal"
    },
    {
      "itemType": 6,
      "id": "Earring_ObsidianHeart",
      "displayName": "Obsidian Heart"
    },
    {
      "itemType": 6,
      "id": "Earring_PearlHeart",
      "displayName": "Pearl Heart"
    },
    {
      "itemType": 6,
      "id": "Earring_Puddles",
      "displayName": "Puddles"
    },
    {
      "itemType": 6,
      "id": "Earring_SeasilkPearl",
      "displayName": "Seasilk Pearl"
    },
    {
      "itemType": 6,
      "id": "Earring_SunSigial",
      "displayName": "Sun Sigial"
    },
    {
      "itemType": 6,
      "id": "Earring_SylvanSprout",
      "displayName": "Sylvan Sprout"
    },
    {
      "itemType": 6,
      "id": "Earth Shaker",
      "displayName": "Earth Shaker"
    },
    {
      "itemType": 6,
      "id": "Earth Shield",
      "displayName": "Obsidian Bulwark"
    },
    {
      "itemType": 6,
      "id": "Eclipse Kunai",
      "displayName": "Eclipse Kunai"
    },
    {
      "itemType": 6,
      "id": "Edge of Twilight",
      "displayName": "Edge of Twilight"
    },
    {
      "itemType": 6,
      "id": "Elixir Gourd",
      "displayName": "Elixir Gourd"
    },
    {
      "itemType": 6,
      "id": "Emberhide Helm",
      "displayName": "Emberhide Helm"
    },
    {
      "itemType": 6,
      "id": "Embershard",
      "displayName": "Embershard"
    },
    {
      "itemType": 6,
      "id": "Emerald Crown",
      "displayName": "Emerald Crown"
    },
    {
      "itemType": 6,
      "id": "Emote_Crown",
      "displayName": "Crown Emote"
    },
    {
      "itemType": 6,
      "id": "Emote_Flair",
      "displayName": "Flair Emote"
    },
    {
      "itemType": 6,
      "id": "Emote_Salsa",
      "displayName": "Salsa Emote"
    },
    {
      "itemType": 6,
      "id": "Emote_Samba",
      "displayName": "Samba Emote"
    },
    {
      "itemType": 6,
      "id": "Emote_Twerk",
      "displayName": "Twerk Emote"
    },
    {
      "itemType": 6,
      "id": "Energy Sword Blue",
      "displayName": "Prism Blade"
    },
    {
      "itemType": 6,
      "id": "Energy Sword Purple",
      "displayName": "Umbral Blade"
    },
    {
      "itemType": 6,
      "id": "Energy Sword Yellow",
      "displayName": "Chromatic Blade"
    },
    {
      "itemType": 6,
      "id": "Everfrost Staff",
      "displayName": "Everfrost Staff"
    },
    {
      "itemType": 6,
      "id": "Executioner Axe",
      "displayName": "Executioner Axe"
    },
    {
      "itemType": 6,
      "id": "Exorcist Bible",
      "displayName": "Exorcist Bible"
    },
    {
      "itemType": 6,
      "id": "Exorcist Staff",
      "displayName": "Exorcist Staff"
    },
    {
      "itemType": 6,
      "id": "Explorer's Pack",
      "displayName": "Explorer's Pack"
    },
    {
      "itemType": 6,
      "id": "Eye of Vigil",
      "displayName": "Eye of Vigil"
    },
    {
      "itemType": 6,
      "id": "Eye_Demonic_F",
      "displayName": "Demonic Female Eye"
    },
    {
      "itemType": 6,
      "id": "Eye_Demonic_M",
      "displayName": "Demonic Male Eye"
    },
    {
      "itemType": 6,
      "id": "Eyeball Bat Red",
      "displayName": "Ruby Gazer Pet"
    },
    {
      "itemType": 6,
      "id": "Eyepatch",
      "displayName": "Eyepatch"
    },
    {
      "itemType": 6,
      "id": "Eyewear_Cuervo_F",
      "displayName": "Cuervo Female Eyewear"
    },
    {
      "itemType": 6,
      "id": "Eyewear_Cuervo_M",
      "displayName": "Cuervo Male Eyewear"
    },
    {
      "itemType": 6,
      "id": "Eyewear_CyberRogue",
      "displayName": "Cyber Rogue Eyewear"
    },
    {
      "itemType": 6,
      "id": "Face_CrystalEars",
      "displayName": "Crystal Ears"
    },
    {
      "itemType": 6,
      "id": "Face_DeathMage",
      "displayName": "Death Mage Mask"
    },
    {
      "itemType": 6,
      "id": "Face_Goggles",
      "displayName": "Goggles"
    },
    {
      "itemType": 6,
      "id": "Face_KamenRed",
      "displayName": "Kamen Red"
    },
    {
      "itemType": 6,
      "id": "Face_KitsuneMask",
      "displayName": "Kitsune Mask"
    },
    {
      "itemType": 6,
      "id": "Face_NecroSkull",
      "displayName": "Necro Skull"
    },
    {
      "itemType": 6,
      "id": "Face_OniMask",
      "displayName": "Oni Mask"
    },
    {
      "itemType": 6,
      "id": "Falcon Band",
      "displayName": "Falcon Band"
    },
    {
      "itemType": 6,
      "id": "Falcon Hood",
      "displayName": "Falcon Hood"
    },
    {
      "itemType": 6,
      "id": "Fang Clip",
      "displayName": "Fang Clip"
    },
    {
      "itemType": 6,
      "id": "Fang of the Moon",
      "displayName": "Fang of the Moon"
    },
    {
      "itemType": 6,
      "id": "Feathered Crown",
      "displayName": "Feathered Crown"
    },
    {
      "itemType": 6,
      "id": "Feathered Scout Hat",
      "displayName": "Feathered Scout Hat"
    },
    {
      "itemType": 6,
      "id": "Feet_Academy",
      "displayName": "Academy Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Agi",
      "displayName": "Speed Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Angel",
      "displayName": "Angel Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Cuervo",
      "displayName": "Cuervo Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_CyberRogue",
      "displayName": "Cyber Rogue Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Demonic_F",
      "displayName": "Demonic Female Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Demonic_M",
      "displayName": "Demonic Male Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Dex",
      "displayName": "Precision Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Easter_F",
      "displayName": "Easter Female Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Easter_M",
      "displayName": "Easter Male Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_FireFox",
      "displayName": "Fire Fox Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Gladys",
      "displayName": "Gladys Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_GS",
      "displayName": "Gunslinger Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_IceFox",
      "displayName": "Ice Fox Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Int",
      "displayName": "Mind Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Luk",
      "displayName": "Fate Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Priest_F",
      "displayName": "Priest Female Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Priest_M",
      "displayName": "Priest Male Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Shinobi",
      "displayName": "Shinobi Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_SpiritValer",
      "displayName": "Spirit Valer Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Str",
      "displayName": "Power Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_SukebanF",
      "displayName": "Sukeban Female Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_SukebanM",
      "displayName": "Sukeban Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Sunken",
      "displayName": "Sunken Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Transparent",
      "displayName": "Transparent Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Urban",
      "displayName": "Urban Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Vit",
      "displayName": "Endurance Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_WhiteCatHoodie",
      "displayName": "White Cat Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Wizard_F",
      "displayName": "Wizard Female Shoes"
    },
    {
      "itemType": 6,
      "id": "Feet_Wizard_M",
      "displayName": "Wizard Male Shoes"
    },
    {
      "itemType": 6,
      "id": "Ferncloak",
      "displayName": "Ferncloak"
    },
    {
      "itemType": 6,
      "id": "Festival Cap",
      "displayName": "Festival Cap"
    },
    {
      "itemType": 6,
      "id": "Festival Rockets",
      "displayName": "Festival Rockets"
    },
    {
      "itemType": 6,
      "id": "Festival Turtle Cap",
      "displayName": "Festival Turtle Cap"
    },
    {
      "itemType": 6,
      "id": "Festive Gift Box",
      "displayName": "Festive Gift Box"
    },
    {
      "itemType": 6,
      "id": "Fire Shield",
      "displayName": "Molten Core Heater"
    },
    {
      "itemType": 6,
      "id": "Fish Man Pink",
      "displayName": "Roseate Merling Pet"
    },
    {
      "itemType": 6,
      "id": "Flame",
      "displayName": "Blaze Pet"
    },
    {
      "itemType": 6,
      "id": "Flame Spirit",
      "displayName": "Flame Spirit"
    },
    {
      "itemType": 6,
      "id": "Flame Tongue Kunai",
      "displayName": "Flame Tongue Kunai"
    },
    {
      "itemType": 6,
      "id": "Flameburst Kunai",
      "displayName": "Flameburst Kunai"
    },
    {
      "itemType": 6,
      "id": "Fleetrunner",
      "displayName": "Fleetrunner"
    },
    {
      "itemType": 6,
      "id": "Flintlock Pistol",
      "displayName": "Flintlock Pistol"
    },
    {
      "itemType": 6,
      "id": "Flora",
      "displayName": "Flora Pet"
    },
    {
      "itemType": 6,
      "id": "Focus Band",
      "displayName": "Focus Band"
    },
    {
      "itemType": 6,
      "id": "Forest Friend Hat",
      "displayName": "Forest Friend Hat"
    },
    {
      "itemType": 6,
      "id": "ForestChest",
      "displayName": "Forest Chest"
    },
    {
      "itemType": 6,
      "id": "ForestFeet",
      "displayName": "Forest Shoes"
    },
    {
      "itemType": 6,
      "id": "ForestLegs",
      "displayName": "Forest Legs"
    },
    {
      "itemType": 6,
      "id": "Fortified Guardwall",
      "displayName": "Fortified Guardwall"
    },
    {
      "itemType": 6,
      "id": "Frost Mark",
      "displayName": "Frost Mark"
    },
    {
      "itemType": 6,
      "id": "Frostfang",
      "displayName": "Frostfang"
    },
    {
      "itemType": 6,
      "id": "Frostscale Helm",
      "displayName": "Frostscale Helm"
    },
    {
      "itemType": 6,
      "id": "Frostshard",
      "displayName": "Frostshard"
    },
    {
      "itemType": 6,
      "id": "Frostspire Kunai",
      "displayName": "Frostspire Kunai"
    },
    {
      "itemType": 6,
      "id": "Fruit Bowl",
      "displayName": "Fruit Bowl"
    },
    {
      "itemType": 6,
      "id": "Funny Glasses",
      "displayName": "Funny Glasses"
    },
    {
      "itemType": 6,
      "id": "Fur Hood",
      "displayName": "Fur Hood"
    },
    {
      "itemType": 6,
      "id": "Gatling Gun",
      "displayName": "Gatling Gun"
    },
    {
      "itemType": 6,
      "id": "GatlingGun_Bonedragon",
      "displayName": "Bonedragon GatlingGun"
    },
    {
      "itemType": 6,
      "id": "Gentleman's Hat",
      "displayName": "Gentleman's Hat"
    },
    {
      "itemType": 6,
      "id": "Ghost",
      "displayName": "Ghost Pet"
    },
    {
      "itemType": 6,
      "id": "Ghostly Hat",
      "displayName": "Ghostly Hat"
    },
    {
      "itemType": 6,
      "id": "Glimmerthorn",
      "displayName": "Glimmerthorn"
    },
    {
      "itemType": 6,
      "id": "Gloom",
      "displayName": "Spectre Pet"
    },
    {
      "itemType": 6,
      "id": "Glove_Agi",
      "displayName": "Speed Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Glove_Dex",
      "displayName": "Precision Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Glove_Int",
      "displayName": "Mind Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Glove_Luk",
      "displayName": "Fate Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Glove_Str",
      "displayName": "Power Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Glove_Vit",
      "displayName": "Endurance Gauntlets"
    },
    {
      "itemType": 6,
      "id": "Goblin Minion",
      "displayName": "Goblin Pet"
    },
    {
      "itemType": 6,
      "id": "Golden Aegis",
      "displayName": "Golden Aegis"
    },
    {
      "itemType": 6,
      "id": "Golden Axe",
      "displayName": "Golden Axe"
    },
    {
      "itemType": 6,
      "id": "Golden Crest",
      "displayName": "Golden Crest"
    },
    {
      "itemType": 6,
      "id": "Golden Crown",
      "displayName": "Golden Crown"
    },
    {
      "itemType": 6,
      "id": "Golden Hammer",
      "displayName": "Golden Hammer"
    },
    {
      "itemType": 6,
      "id": "Golden Hoop",
      "displayName": "Golden Hoop"
    },
    {
      "itemType": 6,
      "id": "Grasping Eye Urn",
      "displayName": "Grasping Eye Urn"
    },
    {
      "itemType": 6,
      "id": "Grave Helm",
      "displayName": "Grave Helm"
    },
    {
      "itemType": 6,
      "id": "GravemarrowChest",
      "displayName": "Gravemarrow Chest"
    },
    {
      "itemType": 6,
      "id": "GravemarrowFeet",
      "displayName": "Gravemarrow Shoes"
    },
    {
      "itemType": 6,
      "id": "GravemarrowLegs",
      "displayName": "Gravemarrow Legs"
    },
    {
      "itemType": 6,
      "id": "Gravestone Breaker",
      "displayName": "Gravestone Breaker"
    },
    {
      "itemType": 6,
      "id": "Green Shell",
      "displayName": "Green Shell"
    },
    {
      "itemType": 6,
      "id": "Grim Reaper Scythe",
      "displayName": "Life Drinker"
    },
    {
      "itemType": 6,
      "id": "Guardblade",
      "displayName": "Guardblade"
    },
    {
      "itemType": 6,
      "id": "Hands_Angel_F",
      "displayName": "Angel Female Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Angel_M",
      "displayName": "Angel Male Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Cuervo_F",
      "displayName": "Cuervo Female Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Cuervo_M",
      "displayName": "Cuervo Male Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_CyberRogue",
      "displayName": "Cyber Rogue Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Demonic_F",
      "displayName": "Demonic Female Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Demonic_M",
      "displayName": "Demonic Male Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Gladys",
      "displayName": "Gladys Gloves"
    },
    {
      "itemType": 6,
      "id": "Hands_Transparent",
      "displayName": "Transparent Gloves"
    },
    {
      "itemType": 6,
      "id": "Happy Chipper Hat",
      "displayName": "Happy Chipper Hat"
    },
    {
      "itemType": 6,
      "id": "Harlequin's Hood",
      "displayName": "Harlequin's Hood"
    },
    {
      "itemType": 6,
      "id": "Harvester of Souls",
      "displayName": "Harvester of Souls"
    },
    {
      "itemType": 6,
      "id": "Haunt",
      "displayName": "Banshee Pet"
    },
    {
      "itemType": 6,
      "id": "Hawkeye Crossbow",
      "displayName": "Hawkeye Crossbow"
    },
    {
      "itemType": 6,
      "id": "Head_Angel",
      "displayName": "Angel Hat"
    },
    {
      "itemType": 6,
      "id": "Head_AngelBand",
      "displayName": "Angel Band"
    },
    {
      "itemType": 6,
      "id": "Head_AoA",
      "displayName": "Scout's Apple"
    },
    {
      "itemType": 6,
      "id": "Head_Aviator",
      "displayName": "Aviator Hat"
    },
    {
      "itemType": 6,
      "id": "Head_BatLord",
      "displayName": "Bat Lord"
    },
    {
      "itemType": 6,
      "id": "Head_BunnyEars",
      "displayName": "Bunny Ears"
    },
    {
      "itemType": 6,
      "id": "Head_CactusKing",
      "displayName": "Cactus King"
    },
    {
      "itemType": 6,
      "id": "Head_CatBolt",
      "displayName": "Cat Bolt Hood"
    },
    {
      "itemType": 6,
      "id": "Head_CatEars",
      "displayName": "Cat Ears"
    },
    {
      "itemType": 6,
      "id": "Head_CosmicBand",
      "displayName": "Cosmic Band"
    },
    {
      "itemType": 6,
      "id": "Head_CupidHalo",
      "displayName": "Halo"
    },
    {
      "itemType": 6,
      "id": "Head_Demonic",
      "displayName": "Demonic Headgear"
    },
    {
      "itemType": 6,
      "id": "Head_Easter_F",
      "displayName": "Easter Female Hat"
    },
    {
      "itemType": 6,
      "id": "Head_Easter_M",
      "displayName": "Easter Male Hat"
    },
    {
      "itemType": 6,
      "id": "Head_FeatheredCrown_Brown",
      "displayName": "Feathered Crown Brown"
    },
    {
      "itemType": 6,
      "id": "Head_FeatheredCrown_Rainbow",
      "displayName": "Feathered Crown Rainbow"
    },
    {
      "itemType": 6,
      "id": "Head_FireFox",
      "displayName": "Fire Fox Hat"
    },
    {
      "itemType": 6,
      "id": "Head_FlowerHat",
      "displayName": "Sunflora Hat"
    },
    {
      "itemType": 6,
      "id": "Head_FoxEars",
      "displayName": "Fox Ears"
    },
    {
      "itemType": 6,
      "id": "Head_Froggie",
      "displayName": "Froggie Headband"
    },
    {
      "itemType": 6,
      "id": "Head_Gladys",
      "displayName": "Gladys Hat"
    },
    {
      "itemType": 6,
      "id": "Head_HareHorns",
      "displayName": "Hare Horns"
    },
    {
      "itemType": 6,
      "id": "Head_HermitKing",
      "displayName": "Hermit Crown"
    },
    {
      "itemType": 6,
      "id": "Head_IceCrown",
      "displayName": "Ice Mage Crown"
    },
    {
      "itemType": 6,
      "id": "Head_IceFox",
      "displayName": "Ice Fox Hat"
    },
    {
      "itemType": 6,
      "id": "Head_IceGolem",
      "displayName": "Mega Ice Crown"
    },
    {
      "itemType": 6,
      "id": "Head_ImpDevil",
      "displayName": "Imp Devil Headress"
    },
    {
      "itemType": 6,
      "id": "Head_MajesticHorn",
      "displayName": "Majestic Horns"
    },
    {
      "itemType": 6,
      "id": "Head_Priest",
      "displayName": "Priest Hat"
    },
    {
      "itemType": 6,
      "id": "Head_QueenWorm",
      "displayName": "Parasitic Worm"
    },
    {
      "itemType": 6,
      "id": "Head_Ribbon_Red",
      "displayName": "Red Ribbon"
    },
    {
      "itemType": 6,
      "id": "Head_Ribbon_Yellow",
      "displayName": "Yellow Ribbon"
    },
    {
      "itemType": 6,
      "id": "Head_Sakkat",
      "displayName": "Sakkat"
    },
    {
      "itemType": 6,
      "id": "Head_ScorpionKing",
      "displayName": "Scorpion Crown"
    },
    {
      "itemType": 6,
      "id": "Head_Shinobi",
      "displayName": "Shinobi Hat"
    },
    {
      "itemType": 6,
      "id": "Head_SnakeNaga",
      "displayName": "Snake Charmer Hat"
    },
    {
      "itemType": 6,
      "id": "Head_SpiderQueenRobot",
      "displayName": "Drooping Spider Queen"
    },
    {
      "itemType": 6,
      "id": "Head_Sprout",
      "displayName": "Sprout"
    },
    {
      "itemType": 6,
      "id": "Head_Sting",
      "displayName": "Bumble Bee Beanie"
    },
    {
      "itemType": 6,
      "id": "Head_Sunken",
      "displayName": "Sunken Hat"
    },
    {
      "itemType": 6,
      "id": "Head_Transparent",
      "displayName": "Transparent Hat"
    },
    {
      "itemType": 6,
      "id": "Head_TurtleChampion",
      "displayName": "Turtle Champion Visor"
    },
    {
      "itemType": 6,
      "id": "Head_Urban",
      "displayName": "Urban Hat"
    },
    {
      "itemType": 6,
      "id": "Head_Werewolf",
      "displayName": "Werewolf Hood"
    },
    {
      "itemType": 6,
      "id": "Head_Wizard",
      "displayName": "Wizard Hat"
    },
    {
      "itemType": 6,
      "id": "Head_WormCreep",
      "displayName": "Whispering Worm"
    },
    {
      "itemType": 6,
      "id": "Head_Wraith",
      "displayName": "Wraith Hat"
    },
    {
      "itemType": 6,
      "id": "Head_Xmas_M_Blue",
      "displayName": "Blue Christmas Hat"
    },
    {
      "itemType": 6,
      "id": "Head_Xmas_M_Red",
      "displayName": "Red Christmas Hat"
    },
    {
      "itemType": 6,
      "id": "Heart Vessel",
      "displayName": "Heart Vessel"
    },
    {
      "itemType": 6,
      "id": "Heartgaze Shades",
      "displayName": "Heartgaze Shades"
    },
    {
      "itemType": 6,
      "id": "Heartloop Earring",
      "displayName": "Heartloop Earring"
    },
    {
      "itemType": 6,
      "id": "Heaven's Orbit",
      "displayName": "Heaven's Orbit"
    },
    {
      "itemType": 6,
      "id": "Hellfire Staff",
      "displayName": "Hellfire Staff"
    },
    {
      "itemType": 6,
      "id": "Hellhorn Hood",
      "displayName": "Hellhorn Hood"
    },
    {
      "itemType": 6,
      "id": "Hermit Hood",
      "displayName": "Hermit Hood"
    },
    {
      "itemType": 6,
      "id": "Hexweaver Hat",
      "displayName": "Hexweaver Hat"
    },
    {
      "itemType": 6,
      "id": "Holy Shield",
      "displayName": "Holy Crest"
    },
    {
      "itemType": 6,
      "id": "Holy Staff",
      "displayName": "Holy Staff"
    },
    {
      "itemType": 6,
      "id": "Hornbrand",
      "displayName": "Hornbrand"
    },
    {
      "itemType": 6,
      "id": "Horned Crusader Helm",
      "displayName": "Horned Crusader Helm"
    },
    {
      "itemType": 6,
      "id": "Horned Vanguard",
      "displayName": "Horned Vanguard"
    },
    {
      "itemType": 6,
      "id": "Housefly Nom",
      "displayName": "Blowfly Pet"
    },
    {
      "itemType": 6,
      "id": "Hunter's Hood",
      "displayName": "Hunter's Hood"
    },
    {
      "itemType": 6,
      "id": "Hunter's Roll",
      "displayName": "Hunter's Roll"
    },
    {
      "itemType": 6,
      "id": "Hunting Knife",
      "displayName": "Hunting Knife"
    },
    {
      "itemType": 6,
      "id": "Hunting Pike",
      "displayName": "Hunting Pike"
    },
    {
      "itemType": 6,
      "id": "Icicle",
      "displayName": "Icicle Pet"
    },
    {
      "itemType": 6,
      "id": "Imp Mischief",
      "displayName": "Gremlin Pet"
    },
    {
      "itemType": 6,
      "id": "Insect Carapace",
      "displayName": "Insect Carapace"
    },
    {
      "itemType": 6,
      "id": "Iron Ankh",
      "displayName": "Iron Ankh"
    },
    {
      "itemType": 6,
      "id": "Iron Bulwark",
      "displayName": "Iron Bulwark"
    },
    {
      "itemType": 6,
      "id": "Iron Fortitude",
      "displayName": "Iron Fortitude"
    },
    {
      "itemType": 6,
      "id": "Iron Guard Helm",
      "displayName": "Iron Guard Helm"
    },
    {
      "itemType": 6,
      "id": "Iron Halo",
      "displayName": "Iron Halo"
    },
    {
      "itemType": 6,
      "id": "Iron Morningstar",
      "displayName": "Iron Morningstar"
    },
    {
      "itemType": 6,
      "id": "Iron Reaver",
      "displayName": "Iron Reaver"
    },
    {
      "itemType": 6,
      "id": "Iron Spear",
      "displayName": "Iron Spear"
    },
    {
      "itemType": 6,
      "id": "Iron Spire",
      "displayName": "Iron Spire"
    },
    {
      "itemType": 6,
      "id": "Ironhorn Cap",
      "displayName": "Ironhorn Cap"
    },
    {
      "itemType": 6,
      "id": "Ironshade Helm",
      "displayName": "Ironshade Helm"
    },
    {
      "itemType": 6,
      "id": "IslandChest",
      "displayName": "Island Spirit Chest"
    },
    {
      "itemType": 6,
      "id": "IslandFeet",
      "displayName": "Island Spirit Shoes"
    },
    {
      "itemType": 6,
      "id": "IslandLegs",
      "displayName": "Island Spirit Legs"
    },
    {
      "itemType": 6,
      "id": "Jagtooth",
      "displayName": "Jagtooth"
    },
    {
      "itemType": 6,
      "id": "Jellyfish Robot",
      "displayName": "Stormjelly Pet"
    },
    {
      "itemType": 6,
      "id": "Jester Hat",
      "displayName": "Jester Hat"
    },
    {
      "itemType": 6,
      "id": "Knife",
      "displayName": "Knife"
    },
    {
      "itemType": 6,
      "id": "Knight_1",
      "displayName": "Breaking Advance"
    },
    {
      "itemType": 6,
      "id": "Knight_2",
      "displayName": "Sweeping Order"
    },
    {
      "itemType": 6,
      "id": "Knight_3",
      "displayName": "Lightning Stance"
    },
    {
      "itemType": 6,
      "id": "Knight_4",
      "displayName": "Rescuing Throw"
    },
    {
      "itemType": 6,
      "id": "Knight_5",
      "displayName": "Iron Response"
    },
    {
      "itemType": 6,
      "id": "Knight_6",
      "displayName": "Vanguard Doctrine"
    },
    {
      "itemType": 6,
      "id": "Knight's Glory",
      "displayName": "Royal Blade"
    },
    {
      "itemType": 6,
      "id": "KnightChest",
      "displayName": "Skystrider Chest"
    },
    {
      "itemType": 6,
      "id": "KnightFeet",
      "displayName": "Skystrider Shoes"
    },
    {
      "itemType": 6,
      "id": "KnightLegs",
      "displayName": "Skystrider Legs"
    },
    {
      "itemType": 6,
      "id": "Knuckleband",
      "displayName": "Knuckleband"
    },
    {
      "itemType": 6,
      "id": "Kunai",
      "displayName": "Kunai"
    },
    {
      "itemType": 6,
      "id": "Launcher",
      "displayName": "Launcher"
    },
    {
      "itemType": 6,
      "id": "Launcher_Bonedragon",
      "displayName": "Bonedragon Launcher"
    },
    {
      "itemType": 6,
      "id": "Leaf Mask",
      "displayName": "Leaf Mask"
    },
    {
      "itemType": 6,
      "id": "Leg_Agi",
      "displayName": "Speed Greaves"
    },
    {
      "itemType": 6,
      "id": "Leg_Dex",
      "displayName": "Precision Greaves"
    },
    {
      "itemType": 6,
      "id": "Leg_Int",
      "displayName": "Mind Greaves"
    },
    {
      "itemType": 6,
      "id": "Leg_Luk",
      "displayName": "Fate Greaves"
    },
    {
      "itemType": 6,
      "id": "Leg_Str",
      "displayName": "Power Greaves"
    },
    {
      "itemType": 6,
      "id": "Leg_Vit",
      "displayName": "Endurance Greaves"
    },
    {
      "itemType": 6,
      "id": "Legionnaire Helm",
      "displayName": "Legionnaire Helm"
    },
    {
      "itemType": 6,
      "id": "Legs_AcademyF",
      "displayName": "Academy Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_AcademyM",
      "displayName": "Academy Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Angel_F",
      "displayName": "Angel Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Angel_M",
      "displayName": "Angel Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Cuervo_F",
      "displayName": "Cuervo Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Cuervo_M",
      "displayName": "Cuervo Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_CyberRogue",
      "displayName": "Cyber Rogue Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Demonic_F",
      "displayName": "Demonic Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Demonic_M",
      "displayName": "Demonic Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Easter_F",
      "displayName": "Easter Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Easter_M",
      "displayName": "Easter Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_FireFox",
      "displayName": "Fire Fox Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Gladys",
      "displayName": "Gladys Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_GS",
      "displayName": "Gunslinger Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_IceFox",
      "displayName": "Ice Fox Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Priest_F",
      "displayName": "Priest Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Priest_M",
      "displayName": "Priest Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Shinobi",
      "displayName": "Shinobi Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_SpiritValer",
      "displayName": "Spirit Valer Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_SukebanF",
      "displayName": "Sukeban Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_SukebanM",
      "displayName": "Sukeban Male Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Sunken",
      "displayName": "Sunken Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Transparent",
      "displayName": "Transparent Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Urban",
      "displayName": "Urban Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Wizard_F",
      "displayName": "Wizard Female Pants"
    },
    {
      "itemType": 6,
      "id": "Legs_Wizard_M",
      "displayName": "Wizard Male Pants"
    },
    {
      "itemType": 6,
      "id": "Life Staff",
      "displayName": "Life Staff"
    },
    {
      "itemType": 6,
      "id": "Lifebloom Shoes",
      "displayName": "Lifebloom Shoes"
    },
    {
      "itemType": 6,
      "id": "Longbow",
      "displayName": "Longbow"
    },
    {
      "itemType": 6,
      "id": "Lucky Drops",
      "displayName": "Lucky Drops"
    },
    {
      "itemType": 6,
      "id": "Lurker",
      "displayName": "Lurker Pet"
    },
    {
      "itemType": 6,
      "id": "Luxbane",
      "displayName": "Luxbane"
    },
    {
      "itemType": 6,
      "id": "Luxspire",
      "displayName": "Luxspire"
    },
    {
      "itemType": 6,
      "id": "Mace",
      "displayName": "Mace"
    },
    {
      "itemType": 6,
      "id": "Mace_GladysMace",
      "displayName": "Gladys Mace"
    },
    {
      "itemType": 6,
      "id": "Mace_Umbra",
      "displayName": "Umbra Mace"
    },
    {
      "itemType": 6,
      "id": "Mage Guard",
      "displayName": "Mage Guard"
    },
    {
      "itemType": 6,
      "id": "Mage Plate",
      "displayName": "Mage Plate"
    },
    {
      "itemType": 6,
      "id": "Mage_1",
      "displayName": "Elementalist"
    },
    {
      "itemType": 6,
      "id": "Mage_2",
      "displayName": "Spellshot"
    },
    {
      "itemType": 6,
      "id": "Mage_3",
      "displayName": "Blink Step"
    },
    {
      "itemType": 6,
      "id": "Mage_4",
      "displayName": "Ley Pulse"
    },
    {
      "itemType": 6,
      "id": "Mage_5",
      "displayName": "Frostglass"
    },
    {
      "itemType": 6,
      "id": "Mage_6",
      "displayName": "Combustion"
    },
    {
      "itemType": 6,
      "id": "MageChest",
      "displayName": "Spellthread Chest"
    },
    {
      "itemType": 6,
      "id": "MageFeet",
      "displayName": "Spellthread Shoes"
    },
    {
      "itemType": 6,
      "id": "MageLegs",
      "displayName": "Spellthread Legs"
    },
    {
      "itemType": 6,
      "id": "Mana Cask",
      "displayName": "Mana Cask"
    },
    {
      "itemType": 6,
      "id": "Mana Potion",
      "displayName": "Mana Potion"
    },
    {
      "itemType": 6,
      "id": "Master Axe",
      "displayName": "Master Axe"
    },
    {
      "itemType": 6,
      "id": "Master Codex",
      "displayName": "Master Codex"
    },
    {
      "itemType": 6,
      "id": "Master Dagger",
      "displayName": "Master Dagger"
    },
    {
      "itemType": 6,
      "id": "Master Hammer",
      "displayName": "Master Hammer"
    },
    {
      "itemType": 6,
      "id": "Master Katar",
      "displayName": "Master Katar"
    },
    {
      "itemType": 6,
      "id": "Master Revolver",
      "displayName": "Master Pistol"
    },
    {
      "itemType": 6,
      "id": "Master Scythe",
      "displayName": "Master Scythe"
    },
    {
      "itemType": 6,
      "id": "Master Slingshot",
      "displayName": "Master Bow"
    },
    {
      "itemType": 6,
      "id": "Master Spear",
      "displayName": "Master Spear"
    },
    {
      "itemType": 6,
      "id": "Master Sword",
      "displayName": "Master Sword"
    },
    {
      "itemType": 6,
      "id": "Master Wand",
      "displayName": "Master Wand"
    },
    {
      "itemType": 6,
      "id": "Mechanical Core",
      "displayName": "Mechanical Core"
    },
    {
      "itemType": 6,
      "id": "Meteoric Staff",
      "displayName": "Meteoric Staff"
    },
    {
      "itemType": 6,
      "id": "Mimic Barrel",
      "displayName": "Barrel Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mimic Book",
      "displayName": "Book Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mimic Candle",
      "displayName": "Candle Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mimic Living Trap",
      "displayName": "Trap Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mimic Sword",
      "displayName": "Sword Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mimic Treasure Chest",
      "displayName": "Chest Mimic Pet"
    },
    {
      "itemType": 6,
      "id": "Mindweave",
      "displayName": "Mindweave"
    },
    {
      "itemType": 6,
      "id": "Mirage Cloak",
      "displayName": "Mirage Cloak"
    },
    {
      "itemType": 6,
      "id": "Mischief Gift Box",
      "displayName": "Mischief Gift Box"
    },
    {
      "itemType": 6,
      "id": "Mitre of Sanctity",
      "displayName": "Mitre of Sanctity"
    },
    {
      "itemType": 6,
      "id": "Molten Core",
      "displayName": "Molten Core"
    },
    {
      "itemType": 6,
      "id": "Monster Bat",
      "displayName": "Nightwing Pet"
    },
    {
      "itemType": 6,
      "id": "Moonfrost",
      "displayName": "Moonfrost"
    },
    {
      "itemType": 6,
      "id": "Moonshadow Hat",
      "displayName": "Moonshadow Hat"
    },
    {
      "itemType": 6,
      "id": "Moonweave Gloves",
      "displayName": "Moon Band"
    },
    {
      "itemType": 6,
      "id": "Mosquito Pester",
      "displayName": "Mosquito Pet"
    },
    {
      "itemType": 6,
      "id": "Moth Moon",
      "displayName": "Moon Moth Pet"
    },
    {
      "itemType": 6,
      "id": "Mount_AngelLion",
      "displayName": "Angel Lion"
    },
    {
      "itemType": 6,
      "id": "Mount_BananaDuck",
      "displayName": "Banana Duck"
    },
    {
      "itemType": 6,
      "id": "Mount_DemonDragon",
      "displayName": "Demon Dragon"
    },
    {
      "itemType": 6,
      "id": "Mount_FireFox",
      "displayName": "Pyronyx"
    },
    {
      "itemType": 6,
      "id": "Mount_FloraWhale",
      "displayName": "Flora Whale"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinBlack",
      "displayName": "Black Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinBrown",
      "displayName": "Wild Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinEagle",
      "displayName": "Sky Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinEmber",
      "displayName": "Ember Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinMountain",
      "displayName": "Mountain Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinPaladin",
      "displayName": "Flying Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_GriffinSnow",
      "displayName": "Snow Griffin"
    },
    {
      "itemType": 6,
      "id": "Mount_HorseBlack",
      "displayName": "Black Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_HorseChineseNewYear",
      "displayName": "Lunar Flame Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_HorsePalomino",
      "displayName": "Palomino Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_HorseRoan",
      "displayName": "Roan Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_HorseTobiano",
      "displayName": "Tobiano Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_HorseWhite",
      "displayName": "White Horse"
    },
    {
      "itemType": 6,
      "id": "Mount_IceFox",
      "displayName": "Polarian"
    },
    {
      "itemType": 6,
      "id": "Mouth_Demonic_F",
      "displayName": "Demonic Female Mouth"
    },
    {
      "itemType": 6,
      "id": "Mouth_Demonic_M",
      "displayName": "Demonic Male Mouth"
    },
    {
      "itemType": 6,
      "id": "Mushroom",
      "displayName": "Shroom Pet"
    },
    {
      "itemType": 6,
      "id": "Mystic Hat",
      "displayName": "Mystic Hat"
    },
    {
      "itemType": 6,
      "id": "Mystic Hood",
      "displayName": "Mystic Hood"
    },
    {
      "itemType": 6,
      "id": "Necronomicon",
      "displayName": "Necronomicon"
    },
    {
      "itemType": 6,
      "id": "Neko Hood",
      "displayName": "Neko Hood"
    },
    {
      "itemType": 6,
      "id": "Night Chest",
      "displayName": "Night Armor"
    },
    {
      "itemType": 6,
      "id": "Night Feet",
      "displayName": "Night Boots"
    },
    {
      "itemType": 6,
      "id": "Night Helm",
      "displayName": "Night Helm"
    },
    {
      "itemType": 6,
      "id": "Night Legs",
      "displayName": "Night Greaves"
    },
    {
      "itemType": 6,
      "id": "Night Shield",
      "displayName": "Compass of Dawn"
    },
    {
      "itemType": 6,
      "id": "Nightfang Stud",
      "displayName": "Nightfang Stud"
    },
    {
      "itemType": 6,
      "id": "Ninja Hood",
      "displayName": "Ninja Hood"
    },
    {
      "itemType": 6,
      "id": "Nomad Hood",
      "displayName": "Nomad Hood"
    },
    {
      "itemType": 6,
      "id": "NoviceChest",
      "displayName": "Novice Chest"
    },
    {
      "itemType": 6,
      "id": "NoviceFeet",
      "displayName": "Novice Shoes"
    },
    {
      "itemType": 6,
      "id": "NoviceLegs",
      "displayName": "Novice Legs"
    },
    {
      "itemType": 6,
      "id": "Nozzle Robot",
      "displayName": "Nozzle Robot Pet"
    },
    {
      "itemType": 6,
      "id": "Oak Bow",
      "displayName": "Oak Bow"
    },
    {
      "itemType": 6,
      "id": "Oathbound Helm",
      "displayName": "Oathbound Helm"
    },
    {
      "itemType": 6,
      "id": "Obsidian Band",
      "displayName": "Obsidian Band"
    },
    {
      "itemType": 6,
      "id": "Obsidian Edge",
      "displayName": "Obsidian Edge"
    },
    {
      "itemType": 6,
      "id": "Obsidian Loop",
      "displayName": "Obsidian Loop"
    },
    {
      "itemType": 6,
      "id": "Obsidian Pillar",
      "displayName": "Obsidian Pillar"
    },
    {
      "itemType": 6,
      "id": "Ocular Grimoire",
      "displayName": "Ocular Grimoire"
    },
    {
      "itemType": 6,
      "id": "Onyx Bolt",
      "displayName": "Onyx Bolt"
    },
    {
      "itemType": 6,
      "id": "Ornamented Staff",
      "displayName": "Ornamented Staff"
    },
    {
      "itemType": 6,
      "id": "Oxygen Tank",
      "displayName": "Oxygen Tank"
    },
    {
      "itemType": 6,
      "id": "Paladin Crest",
      "displayName": "Paladin Crest"
    },
    {
      "itemType": 6,
      "id": "Paladin_1",
      "displayName": "Resolute Pose"
    },
    {
      "itemType": 6,
      "id": "Paladin_2",
      "displayName": "Crushing Advance"
    },
    {
      "itemType": 6,
      "id": "Paladin_3",
      "displayName": "Sacred Bastion"
    },
    {
      "itemType": 6,
      "id": "Paladin_4",
      "displayName": "Divine Retribution"
    },
    {
      "itemType": 6,
      "id": "Parrying Knife",
      "displayName": "Parrying Knife"
    },
    {
      "itemType": 6,
      "id": "Pet_Angeling",
      "displayName": "Angeling"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinBlack",
      "displayName": "Black Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinBlue",
      "displayName": "Blue Jay Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinBrown",
      "displayName": "Brown Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinEagle",
      "displayName": "Eagle Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinMallard",
      "displayName": "Mallard Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_BabyGriffinWhite",
      "displayName": "White Griffin"
    },
    {
      "itemType": 6,
      "id": "Pet_CatBlackWhite",
      "displayName": "Persian Cat"
    },
    {
      "itemType": 6,
      "id": "Pet_CatGinger",
      "displayName": "Ginger Cat"
    },
    {
      "itemType": 6,
      "id": "Pet_CatGrey",
      "displayName": "Grey Munchkin Cat"
    },
    {
      "itemType": 6,
      "id": "Pet_CatWhiteGrey",
      "displayName": "Ragdoll Cat"
    },
    {
      "itemType": 6,
      "id": "Pet_CatWhiteHeart",
      "displayName": "British Shorthair Cat"
    },
    {
      "itemType": 6,
      "id": "Pet_DemonicImp",
      "displayName": "Demonic Imp"
    },
    {
      "itemType": 6,
      "id": "Pet_DogBoxer",
      "displayName": "Boxer Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogBullmastif",
      "displayName": "Bullmastif Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogCorso",
      "displayName": "Cane Corso Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogLabBlack",
      "displayName": "Black Labrador Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogLabBrown",
      "displayName": "Brown Labrador Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogLabWhite",
      "displayName": "White Labrador Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_DogRottie",
      "displayName": "Rottweiler Dog"
    },
    {
      "itemType": 6,
      "id": "Pet_Earth",
      "displayName": "Leafling"
    },
    {
      "itemType": 6,
      "id": "Pet_EasterBunny",
      "displayName": "Easter Bunny"
    },
    {
      "itemType": 6,
      "id": "Pet_Fire",
      "displayName": "Dawnling"
    },
    {
      "itemType": 6,
      "id": "Pet_HybridBunny",
      "displayName": "Hybrid Bunny"
    },
    {
      "itemType": 6,
      "id": "Pet_Water",
      "displayName": "Aqualing"
    },
    {
      "itemType": 6,
      "id": "Pet_Wind",
      "displayName": "Wildling"
    },
    {
      "itemType": 6,
      "id": "Phantom Kunai",
      "displayName": "Phantom Kunai"
    },
    {
      "itemType": 6,
      "id": "Phantom Mask",
      "displayName": "Phantom Mask"
    },
    {
      "itemType": 6,
      "id": "Piercer",
      "displayName": "Piercer"
    },
    {
      "itemType": 6,
      "id": "Pirate Hat",
      "displayName": "Pirate Hat"
    },
    {
      "itemType": 6,
      "id": "PirateChest",
      "displayName": "Pirate Coat"
    },
    {
      "itemType": 6,
      "id": "PirateFeet",
      "displayName": "Pirate Shoes"
    },
    {
      "itemType": 6,
      "id": "PirateGloves",
      "displayName": "Pirate Hook"
    },
    {
      "itemType": 6,
      "id": "PirateLegs",
      "displayName": "Pirate Legs"
    },
    {
      "itemType": 6,
      "id": "Pistol",
      "displayName": "Pistol"
    },
    {
      "itemType": 6,
      "id": "Plant Shooter",
      "displayName": "Spitter Pet"
    },
    {
      "itemType": 6,
      "id": "Plasma Helmet",
      "displayName": "Plasma Helmet"
    },
    {
      "itemType": 6,
      "id": "Plasma Shell",
      "displayName": "Plasma Shell"
    },
    {
      "itemType": 6,
      "id": "Plasma Sword Blue",
      "displayName": "Azure Flow"
    },
    {
      "itemType": 6,
      "id": "Plasma Sword Purple",
      "displayName": "Violet Arc"
    },
    {
      "itemType": 6,
      "id": "Plasma Sword Yellow",
      "displayName": "Solar Pulse"
    },
    {
      "itemType": 6,
      "id": "PlasmaChest",
      "displayName": "Plasma Suit"
    },
    {
      "itemType": 6,
      "id": "PlasmaFeet",
      "displayName": "Plasma Boots"
    },
    {
      "itemType": 6,
      "id": "PlasmaLegs",
      "displayName": "Plasma Greaves"
    },
    {
      "itemType": 6,
      "id": "Plum Talisman",
      "displayName": "Plum Talisman"
    },
    {
      "itemType": 6,
      "id": "Pollen",
      "displayName": "Pollen Pet"
    },
    {
      "itemType": 6,
      "id": "Potion Bowl",
      "displayName": "Potion Bowl"
    },
    {
      "itemType": 6,
      "id": "Potion Gourd",
      "displayName": "Potion Gourd"
    },
    {
      "itemType": 6,
      "id": "Potions",
      "displayName": "Potions"
    },
    {
      "itemType": 6,
      "id": "Priest_1",
      "displayName": "Veil of the Exorcist"
    },
    {
      "itemType": 6,
      "id": "Priest_2",
      "displayName": "Martyr's Oath"
    },
    {
      "itemType": 6,
      "id": "Priest_3",
      "displayName": "Exorcist's Brand"
    },
    {
      "itemType": 6,
      "id": "Priest_4",
      "displayName": "Eclipsing Aegis"
    },
    {
      "itemType": 6,
      "id": "Priest_5",
      "displayName": "Overflowing Grace"
    },
    {
      "itemType": 6,
      "id": "Priest_6",
      "displayName": "Resurrection Pact"
    },
    {
      "itemType": 6,
      "id": "Priest_7",
      "displayName": "Purity"
    },
    {
      "itemType": 6,
      "id": "Priest_8",
      "displayName": "Sanctuary Doctrine"
    },
    {
      "itemType": 6,
      "id": "Pumpkin Head",
      "displayName": "Jack-o'-lantern"
    },
    {
      "itemType": 6,
      "id": "Quillcap",
      "displayName": "Quillcap"
    },
    {
      "itemType": 6,
      "id": "Quiver",
      "displayName": "Quiver"
    },
    {
      "itemType": 6,
      "id": "Quiver of Thorns",
      "displayName": "Quiver of Thorns"
    },
    {
      "itemType": 6,
      "id": "Rabbit",
      "displayName": "Rabbit Pet"
    },
    {
      "itemType": 6,
      "id": "Radiant Dagger",
      "displayName": "Radiant Dagger"
    },
    {
      "itemType": 6,
      "id": "Radiant Wand",
      "displayName": "Radiant Wand"
    },
    {
      "itemType": 6,
      "id": "Ragebound Fury",
      "displayName": "Ragebound Fury"
    },
    {
      "itemType": 6,
      "id": "Raider Helm",
      "displayName": "Raider Helm"
    },
    {
      "itemType": 6,
      "id": "Ram Skull Mask",
      "displayName": "Ram Skull Mask"
    },
    {
      "itemType": 6,
      "id": "Ransack",
      "displayName": "Ransack"
    },
    {
      "itemType": 6,
      "id": "Rat Grey",
      "displayName": "Plague Rat Pet"
    },
    {
      "itemType": 6,
      "id": "Razor Edge",
      "displayName": "Razor's Edge"
    },
    {
      "itemType": 6,
      "id": "Razor Kunai",
      "displayName": "Razor Kunai"
    },
    {
      "itemType": 6,
      "id": "Razor Robot",
      "displayName": "Razor Robot Pet"
    },
    {
      "itemType": 6,
      "id": "Reaper Scythe",
      "displayName": "Grim Scythe"
    },
    {
      "itemType": 6,
      "id": "Recurve Bow",
      "displayName": "Recurve Bow"
    },
    {
      "itemType": 6,
      "id": "Red Maw",
      "displayName": "Red Maw"
    },
    {
      "itemType": 6,
      "id": "Red Shell",
      "displayName": "Red Shell"
    },
    {
      "itemType": 6,
      "id": "Regal Tricorne",
      "displayName": "Regal Tricorne"
    },
    {
      "itemType": 6,
      "id": "Reindeer Headband",
      "displayName": "Reindeer Headband"
    },
    {
      "itemType": 6,
      "id": "Reindeer Hood",
      "displayName": "Reindeer Hood"
    },
    {
      "itemType": 6,
      "id": "ReindeerChest",
      "displayName": "Reindeer Chest"
    },
    {
      "itemType": 6,
      "id": "ReindeerFeet",
      "displayName": "Reindeer Shoes"
    },
    {
      "itemType": 6,
      "id": "ReindeerGloves",
      "displayName": "Reindeer Gloves"
    },
    {
      "itemType": 6,
      "id": "ReindeerLegs",
      "displayName": "Reindeer Legs"
    },
    {
      "itemType": 6,
      "id": "Relic Trident",
      "displayName": "Relic Trident"
    },
    {
      "itemType": 6,
      "id": "Repeater Crossbow",
      "displayName": "Repeater Crossbow"
    },
    {
      "itemType": 6,
      "id": "Resonant Headphones",
      "displayName": "Resonant Headphones"
    },
    {
      "itemType": 6,
      "id": "Rifle",
      "displayName": "Rifle"
    },
    {
      "itemType": 6,
      "id": "Riftbreaker",
      "displayName": "Riftbreaker"
    },
    {
      "itemType": 6,
      "id": "Rod",
      "displayName": "Rod"
    },
    {
      "itemType": 6,
      "id": "Rogue_1",
      "displayName": "Silent Circle"
    },
    {
      "itemType": 6,
      "id": "Rogue_2",
      "displayName": "Shadow Trail"
    },
    {
      "itemType": 6,
      "id": "Rogue_3",
      "displayName": "Venom Bloom"
    },
    {
      "itemType": 6,
      "id": "Rogue_4",
      "displayName": "Shadow Dance"
    },
    {
      "itemType": 6,
      "id": "Rogue_5",
      "displayName": "Hidden Strikes"
    },
    {
      "itemType": 6,
      "id": "Round Glasses",
      "displayName": "Round Glasses"
    },
    {
      "itemType": 6,
      "id": "Royal Crest",
      "displayName": "Royal Crest"
    },
    {
      "itemType": 6,
      "id": "Royal Dagger",
      "displayName": "Royal Dagger"
    },
    {
      "itemType": 6,
      "id": "Royal Fang",
      "displayName": "Royal Fang"
    },
    {
      "itemType": 6,
      "id": "Runeborn Visor",
      "displayName": "Runeborn Visor"
    },
    {
      "itemType": 6,
      "id": "Runecall",
      "displayName": "Runecall"
    },
    {
      "itemType": 6,
      "id": "Runesmasher",
      "displayName": "Runesmasher"
    },
    {
      "itemType": 6,
      "id": "Rusted Binocs",
      "displayName": "Rusted Binocs"
    },
    {
      "itemType": 6,
      "id": "Safety Helmet",
      "displayName": "Safety Helmet"
    },
    {
      "itemType": 6,
      "id": "SafetyChest",
      "displayName": "Safety Chest"
    },
    {
      "itemType": 6,
      "id": "SafetyFeet",
      "displayName": "Safety Shoes"
    },
    {
      "itemType": 6,
      "id": "SafetyGloves",
      "displayName": "Safety Gloves"
    },
    {
      "itemType": 6,
      "id": "SafetyLegs",
      "displayName": "Safety Legs"
    },
    {
      "itemType": 6,
      "id": "Sailor Cap",
      "displayName": "Sailor Cap"
    },
    {
      "itemType": 6,
      "id": "SanctifiedChest",
      "displayName": "Sanctified Chest"
    },
    {
      "itemType": 6,
      "id": "SanctifiedFeet",
      "displayName": "Sanctified Shoes"
    },
    {
      "itemType": 6,
      "id": "SanctifiedLegs",
      "displayName": "Sanctified Legs"
    },
    {
      "itemType": 6,
      "id": "Sanctum Gloves",
      "displayName": "Sanctum Gloves"
    },
    {
      "itemType": 6,
      "id": "Sanctum Guard",
      "displayName": "Sanctum Guard"
    },
    {
      "itemType": 6,
      "id": "SantaChest",
      "displayName": "Santa Chest"
    },
    {
      "itemType": 6,
      "id": "SantaFeet",
      "displayName": "Santa Shoes"
    },
    {
      "itemType": 6,
      "id": "SantaGloves",
      "displayName": "Santa Gloves"
    },
    {
      "itemType": 6,
      "id": "SantaHat",
      "displayName": "Santa Hat"
    },
    {
      "itemType": 6,
      "id": "SantaLegs",
      "displayName": "Santa Legs"
    },
    {
      "itemType": 6,
      "id": "Sapphire Crown",
      "displayName": "Sapphire Crown"
    },
    {
      "itemType": 6,
      "id": "Sapphire Guard",
      "displayName": "Stormplate Helm"
    },
    {
      "itemType": 6,
      "id": "Satchel of Embers",
      "displayName": "Satchel of Embers"
    },
    {
      "itemType": 6,
      "id": "Scalpel",
      "displayName": "Scalpel"
    },
    {
      "itemType": 6,
      "id": "Scholar Glasses",
      "displayName": "Scholar Glasses"
    },
    {
      "itemType": 6,
      "id": "Scholar's Cap",
      "displayName": "Scholar's Cap"
    },
    {
      "itemType": 6,
      "id": "Scorpling",
      "displayName": "Scorpling Pet"
    },
    {
      "itemType": 6,
      "id": "Scout_1",
      "displayName": "Chain Reaction"
    },
    {
      "itemType": 6,
      "id": "Scout_2",
      "displayName": "Hunting Ground"
    },
    {
      "itemType": 6,
      "id": "Scout_3",
      "displayName": "Skirmisher's Flow"
    },
    {
      "itemType": 6,
      "id": "Scout_4",
      "displayName": "Suppressing Shot"
    },
    {
      "itemType": 6,
      "id": "Scout_5",
      "displayName": "Eagle Eye"
    },
    {
      "itemType": 6,
      "id": "Scrapfang",
      "displayName": "Scrapfang"
    },
    {
      "itemType": 6,
      "id": "Scroll Case",
      "displayName": "Scroll Case"
    },
    {
      "itemType": 6,
      "id": "Scroll Charm",
      "displayName": "Scroll Charm"
    },
    {
      "itemType": 6,
      "id": "Scythe",
      "displayName": "Scythe"
    },
    {
      "itemType": 6,
      "id": "Scythe_Umbra",
      "displayName": "Umbra Scythe"
    },
    {
      "itemType": 6,
      "id": "Seedling Satchel",
      "displayName": "Seedling Satchel"
    },
    {
      "itemType": 6,
      "id": "Seer's Hood",
      "displayName": "Seer's Hood"
    },
    {
      "itemType": 6,
      "id": "Serpent Ring",
      "displayName": "Serpent Ring"
    },
    {
      "itemType": 6,
      "id": "Shade",
      "displayName": "Shade Pet"
    },
    {
      "itemType": 6,
      "id": "Shadow Dancers",
      "displayName": "Shadow Dancers"
    },
    {
      "itemType": 6,
      "id": "Shadow Shield",
      "displayName": "Shadowsteel Guard"
    },
    {
      "itemType": 6,
      "id": "Shady Specs",
      "displayName": "Shady Specs"
    },
    {
      "itemType": 6,
      "id": "Sharkbite Hood",
      "displayName": "Sharkbite Hood"
    },
    {
      "itemType": 6,
      "id": "Sharpened Visor",
      "displayName": "Sharpened Visor"
    },
    {
      "itemType": 6,
      "id": "Shell",
      "displayName": "Conch Pet"
    },
    {
      "itemType": 6,
      "id": "Shield_GladysShield",
      "displayName": "Gladys Shield"
    },
    {
      "itemType": 6,
      "id": "Shield_Umbra",
      "displayName": "Umbra Shield"
    },
    {
      "itemType": 6,
      "id": "Shinobi_1",
      "displayName": "Silent Execution"
    },
    {
      "itemType": 6,
      "id": "Shinobi_2",
      "displayName": "Sealed Fate"
    },
    {
      "itemType": 6,
      "id": "Shinobi_3",
      "displayName": "Honed Technique"
    },
    {
      "itemType": 6,
      "id": "Shinobi_4",
      "displayName": "Phantom Manuscript"
    },
    {
      "itemType": 6,
      "id": "Shotgun",
      "displayName": "Shotgun"
    },
    {
      "itemType": 6,
      "id": "Shuriken",
      "displayName": "Fuma Shuriken"
    },
    {
      "itemType": 6,
      "id": "Silence of Night",
      "displayName": "Silence of Night"
    },
    {
      "itemType": 6,
      "id": "Skull Emblem",
      "displayName": "Skull Emblem"
    },
    {
      "itemType": 6,
      "id": "Skull Lord Totem",
      "displayName": "Skull Lord Totem"
    },
    {
      "itemType": 6,
      "id": "Skull Pendant",
      "displayName": "Skull Pendant"
    },
    {
      "itemType": 6,
      "id": "Skullhacker",
      "displayName": "Skullhacker"
    },
    {
      "itemType": 6,
      "id": "Sky Raider Hat",
      "displayName": "Sky Raider Hat"
    },
    {
      "itemType": 6,
      "id": "Skybreaker Staff",
      "displayName": "Skybreaker Staff"
    },
    {
      "itemType": 6,
      "id": "Skywing Mask",
      "displayName": "Skywing Mask"
    },
    {
      "itemType": 6,
      "id": "Slime",
      "displayName": "Slime Pet"
    },
    {
      "itemType": 6,
      "id": "Slingshot",
      "displayName": "Slingshot"
    },
    {
      "itemType": 6,
      "id": "Smith's Tools",
      "displayName": "Smith's Tools"
    },
    {
      "itemType": 6,
      "id": "Snake",
      "displayName": "Viper Pet"
    },
    {
      "itemType": 6,
      "id": "Sniper Rifle",
      "displayName": "Sniper Rifle"
    },
    {
      "itemType": 6,
      "id": "Snowbun Earmuffs",
      "displayName": "Snowbun Earmuffs"
    },
    {
      "itemType": 6,
      "id": "Snowman Head",
      "displayName": "Snowman Head"
    },
    {
      "itemType": 6,
      "id": "Solar Relic",
      "displayName": "Solar Relic"
    },
    {
      "itemType": 6,
      "id": "Solar Spear",
      "displayName": "Solar Spear"
    },
    {
      "itemType": 6,
      "id": "Solaris Blade",
      "displayName": "Solaris Blade"
    },
    {
      "itemType": 6,
      "id": "Sonic Shoes",
      "displayName": "Sonic Shoes"
    },
    {
      "itemType": 6,
      "id": "Soul Reaper Scythe",
      "displayName": "Blight Reaver"
    },
    {
      "itemType": 6,
      "id": "SoulbinderChest",
      "displayName": "Soulbinder Chest"
    },
    {
      "itemType": 6,
      "id": "SoulbinderFeet",
      "displayName": "Soulbinder Shoes"
    },
    {
      "itemType": 6,
      "id": "SoulbinderLegs",
      "displayName": "Soulbinder Legs"
    },
    {
      "itemType": 6,
      "id": "Spear_GladysSpear",
      "displayName": "Gladys Spear"
    },
    {
      "itemType": 6,
      "id": "Spider Toxin",
      "displayName": "Widow Pet"
    },
    {
      "itemType": 6,
      "id": "Spiderling Robot",
      "displayName": "Spiderling Robot Pet"
    },
    {
      "itemType": 6,
      "id": "Spiked Club",
      "displayName": "Spiked Club"
    },
    {
      "itemType": 6,
      "id": "Spiked Familiar",
      "displayName": "Spiked Familiar"
    },
    {
      "itemType": 6,
      "id": "Spiked Helm",
      "displayName": "Spiked Helm"
    },
    {
      "itemType": 6,
      "id": "Spikesteel Helm",
      "displayName": "Spikesteel Helm"
    },
    {
      "itemType": 6,
      "id": "Spined Aegis",
      "displayName": "Spined Aegis"
    },
    {
      "itemType": 6,
      "id": "Spineshard",
      "displayName": "Spineshard"
    },
    {
      "itemType": 6,
      "id": "Spirit Familiar",
      "displayName": "Spirit Familiar"
    },
    {
      "itemType": 6,
      "id": "Spirit Ward",
      "displayName": "Spirit Ward"
    },
    {
      "itemType": 6,
      "id": "Spooky Spell Hat",
      "displayName": "Spooky Spell Hat"
    },
    {
      "itemType": 6,
      "id": "Spore",
      "displayName": "Spore Pet"
    },
    {
      "itemType": 6,
      "id": "Springram Horns",
      "displayName": "Springram Horns"
    },
    {
      "itemType": 6,
      "id": "Sprout",
      "displayName": "Sprout Pet"
    },
    {
      "itemType": 6,
      "id": "Squid Baby",
      "displayName": "Squidling Pet"
    },
    {
      "itemType": 6,
      "id": "Staff of Eternis",
      "displayName": "Staff of Eternis"
    },
    {
      "itemType": 6,
      "id": "Stall_Oriental",
      "displayName": "Oriental Vending Stall"
    },
    {
      "itemType": 6,
      "id": "Stall_SpiritValer",
      "displayName": "Spirit Valer Vending Stall"
    },
    {
      "itemType": 6,
      "id": "Star",
      "displayName": "Star"
    },
    {
      "itemType": 6,
      "id": "Starbound Hat",
      "displayName": "Starbound Hat"
    },
    {
      "itemType": 6,
      "id": "Starshine Glasses",
      "displayName": "Starshine Glasses"
    },
    {
      "itemType": 6,
      "id": "Stiletto",
      "displayName": "Stiletto"
    },
    {
      "itemType": 6,
      "id": "Stonebound Boots",
      "displayName": "Stonebound Boots"
    },
    {
      "itemType": 6,
      "id": "Stoneguard",
      "displayName": "Stoneguard"
    },
    {
      "itemType": 6,
      "id": "Stonepoint Spear",
      "displayName": "Stonepoint Spear"
    },
    {
      "itemType": 6,
      "id": "Stormburst Crossbow",
      "displayName": "Stormburst Crossbow"
    },
    {
      "itemType": 6,
      "id": "Stormcall Kunai",
      "displayName": "Stormcall Kunai"
    },
    {
      "itemType": 6,
      "id": "Stormcaller Totem",
      "displayName": "Stormcaller Totem"
    },
    {
      "itemType": 6,
      "id": "Stormfeather Kunai",
      "displayName": "Stormfeather Kunai"
    },
    {
      "itemType": 6,
      "id": "Stormpiercer",
      "displayName": "Stormpiercer"
    },
    {
      "itemType": 6,
      "id": "StormplateChest",
      "displayName": "Stormplate Chest"
    },
    {
      "itemType": 6,
      "id": "StormplateFeet",
      "displayName": "Stormplate Shoes"
    },
    {
      "itemType": 6,
      "id": "StormplateLegs",
      "displayName": "Stormplate Legs"
    },
    {
      "itemType": 6,
      "id": "Straw Hat",
      "displayName": "Straw Hat"
    },
    {
      "itemType": 6,
      "id": "Stylish Shades",
      "displayName": "Stylish Shades"
    },
    {
      "itemType": 6,
      "id": "Summoner_1",
      "displayName": "Alpha Surge"
    },
    {
      "itemType": 6,
      "id": "Summoner_2",
      "displayName": "Hexwell Current"
    },
    {
      "itemType": 6,
      "id": "Summoner_3",
      "displayName": "Banishment Well"
    },
    {
      "itemType": 6,
      "id": "Summoner_4",
      "displayName": "Resonant Wind"
    },
    {
      "itemType": 6,
      "id": "Summoner_5",
      "displayName": "Blessed Resonance"
    },
    {
      "itemType": 6,
      "id": "Summoner_6",
      "displayName": "Soul Chains"
    },
    {
      "itemType": 6,
      "id": "Sun Disc",
      "displayName": "Sun Disc"
    },
    {
      "itemType": 6,
      "id": "Sun Emblem",
      "displayName": "Sun Emblem"
    },
    {
      "itemType": 6,
      "id": "Sun Emblem Helm",
      "displayName": "Sun Emblem Helm"
    },
    {
      "itemType": 6,
      "id": "Sun Lion Crest",
      "displayName": "Sun Lion Crest"
    },
    {
      "itemType": 6,
      "id": "Sunbound Mitts",
      "displayName": "Sunbound Mitts"
    },
    {
      "itemType": 6,
      "id": "Suncrest Mace",
      "displayName": "Suncrest Mace"
    },
    {
      "itemType": 6,
      "id": "Sunflare",
      "displayName": "Sunflare"
    },
    {
      "itemType": 6,
      "id": "Sunflower Clip",
      "displayName": "Sunflower Clip"
    },
    {
      "itemType": 6,
      "id": "Sunflower Fairy",
      "displayName": "Sylvie Pet"
    },
    {
      "itemType": 6,
      "id": "Sunglasses",
      "displayName": "Sunglasses"
    },
    {
      "itemType": 6,
      "id": "Sunset Shutters",
      "displayName": "Sunset Shutters"
    },
    {
      "itemType": 6,
      "id": "Swampy Hat",
      "displayName": "Swampy Hat"
    },
    {
      "itemType": 6,
      "id": "Swift Fang",
      "displayName": "Serpent Fang"
    },
    {
      "itemType": 6,
      "id": "Sword",
      "displayName": "Sword"
    },
    {
      "itemType": 6,
      "id": "Sword_GladysSword",
      "displayName": "Gladys Sword"
    },
    {
      "itemType": 6,
      "id": "Sword_Umbra",
      "displayName": "Umbra Sword"
    },
    {
      "itemType": 6,
      "id": "Sword2H_GladysSword2H",
      "displayName": "Gladys Sword2H"
    },
    {
      "itemType": 6,
      "id": "Sword2H_Umbra",
      "displayName": "Umbra Sword2H"
    },
    {
      "itemType": 6,
      "id": "Teapot Spirit",
      "displayName": "Teapot Spirit"
    },
    {
      "itemType": 6,
      "id": "Tempest Robes",
      "displayName": "Tempest Robes"
    },
    {
      "itemType": 6,
      "id": "Tempest Staff",
      "displayName": "Tempest Staff"
    },
    {
      "itemType": 6,
      "id": "Thief Mask",
      "displayName": "Thief Mask"
    },
    {
      "itemType": 6,
      "id": "ThiefChest",
      "displayName": "Ashwalker Chest"
    },
    {
      "itemType": 6,
      "id": "ThiefFeet",
      "displayName": "Ashwalker Shoes"
    },
    {
      "itemType": 6,
      "id": "ThiefLegs",
      "displayName": "Ashwalker Legs"
    },
    {
      "itemType": 6,
      "id": "Thundercoil",
      "displayName": "Thundercoil"
    },
    {
      "itemType": 6,
      "id": "Tiger Hat",
      "displayName": "Tiger Hat"
    },
    {
      "itemType": 6,
      "id": "Tinker Goggles",
      "displayName": "Tinker Goggles"
    },
    {
      "itemType": 6,
      "id": "Tinker Mask",
      "displayName": "Tinker Mask"
    },
    {
      "itemType": 6,
      "id": "Tinkerer's Tools",
      "displayName": "Tinkerer's Tools"
    },
    {
      "itemType": 6,
      "id": "Title_Backer",
      "displayName": "Backer"
    },
    {
      "itemType": 6,
      "id": "Title_Duo",
      "displayName": "Duo"
    },
    {
      "itemType": 6,
      "id": "Title_EarlyBird",
      "displayName": "Early Bird"
    },
    {
      "itemType": 6,
      "id": "Title_Founder",
      "displayName": "Founder"
    },
    {
      "itemType": 6,
      "id": "Title_MountDesigner",
      "displayName": "Mount Designer"
    },
    {
      "itemType": 6,
      "id": "Title_NPCDesigner",
      "displayName": "NPC Designer"
    },
    {
      "itemType": 6,
      "id": "Title_PetDesigner",
      "displayName": "Pet Designer"
    },
    {
      "itemType": 6,
      "id": "Title_SpiritValer",
      "displayName": "SpiritValer"
    },
    {
      "itemType": 6,
      "id": "Title_UltimateFounder",
      "displayName": "Ultimate Founder"
    },
    {
      "itemType": 6,
      "id": "Title_WeaponDesigner",
      "displayName": "Weapon Designer"
    },
    {
      "itemType": 6,
      "id": "Tomahawk",
      "displayName": "Tomahawk"
    },
    {
      "itemType": 6,
      "id": "Tome of Ages",
      "displayName": "Tome of Ages"
    },
    {
      "itemType": 6,
      "id": "Top Hat",
      "displayName": "Top Hat"
    },
    {
      "itemType": 6,
      "id": "Totem Banner",
      "displayName": "Totem Banner"
    },
    {
      "itemType": 6,
      "id": "Totem Mask",
      "displayName": "Totem Mask"
    },
    {
      "itemType": 6,
      "id": "Totem Skull Headdress",
      "displayName": "Totem Skull Headdress"
    },
    {
      "itemType": 6,
      "id": "Trail_Angel",
      "displayName": "Angelic Trail"
    },
    {
      "itemType": 6,
      "id": "Trail_Demon",
      "displayName": "Demonic Trail"
    },
    {
      "itemType": 6,
      "id": "Traveler's Trunk",
      "displayName": "Traveler's Trunk"
    },
    {
      "itemType": 6,
      "id": "Treant Minion Evergreen",
      "displayName": "Pine Sapling Pet"
    },
    {
      "itemType": 6,
      "id": "Treasure Box",
      "displayName": "Treasure Box"
    },
    {
      "itemType": 6,
      "id": "Treasure Chest",
      "displayName": "Treasure Chest"
    },
    {
      "itemType": 6,
      "id": "Tribal Mask",
      "displayName": "Tribal Mask"
    },
    {
      "itemType": 6,
      "id": "Trickster Horns",
      "displayName": "Trickster Horns"
    },
    {
      "itemType": 6,
      "id": "Trident of Tides",
      "displayName": "Trident of Tides"
    },
    {
      "itemType": 6,
      "id": "Triple Barrel Revolver",
      "displayName": "Triple Barrel Revolver"
    },
    {
      "itemType": 6,
      "id": "Turtle",
      "displayName": "Turtle Baby Pet"
    },
    {
      "itemType": 6,
      "id": "TurtleShell",
      "displayName": "Turtle Shell"
    },
    {
      "itemType": 6,
      "id": "Twinblade",
      "displayName": "Twinblade"
    },
    {
      "itemType": 6,
      "id": "Valiant Crown",
      "displayName": "Valiant Crown"
    },
    {
      "itemType": 6,
      "id": "Valor Helm",
      "displayName": "Valor Helm"
    },
    {
      "itemType": 6,
      "id": "Ventilator Mask",
      "displayName": "Ventilator Mask"
    },
    {
      "itemType": 6,
      "id": "Verdant Antlers",
      "displayName": "Verdant Antlers"
    },
    {
      "itemType": 6,
      "id": "Verdant Core",
      "displayName": "Verdant Core"
    },
    {
      "itemType": 6,
      "id": "Verdant Striders",
      "displayName": "Verdant Striders"
    },
    {
      "itemType": 6,
      "id": "Violet Heart Charm",
      "displayName": "Violet Heart Charm"
    },
    {
      "itemType": 6,
      "id": "Void Urn",
      "displayName": "Void Urn"
    },
    {
      "itemType": 6,
      "id": "Voidspike Helm",
      "displayName": "Voidspike Helm"
    },
    {
      "itemType": 6,
      "id": "Voidthreads",
      "displayName": "Voidthreads"
    },
    {
      "itemType": 6,
      "id": "War Axe",
      "displayName": "War Axe"
    },
    {
      "itemType": 6,
      "id": "War Banner",
      "displayName": "War Banner"
    },
    {
      "itemType": 6,
      "id": "Warborn Aegis",
      "displayName": "Warborn Aegis"
    },
    {
      "itemType": 6,
      "id": "Warlord Emblem Shield",
      "displayName": "Warlord Emblem Shield"
    },
    {
      "itemType": 6,
      "id": "Warrior_1",
      "displayName": "Bloodtrail"
    },
    {
      "itemType": 6,
      "id": "Warrior_2",
      "displayName": "Breakjaw"
    },
    {
      "itemType": 6,
      "id": "Warrior_3",
      "displayName": "Warmaw"
    },
    {
      "itemType": 6,
      "id": "Warrior_4",
      "displayName": "Bloodprice"
    },
    {
      "itemType": 6,
      "id": "Warrior_5",
      "displayName": "Warpath"
    },
    {
      "itemType": 6,
      "id": "Wasteland Cleaver",
      "displayName": "Wasteland Cleaver"
    },
    {
      "itemType": 6,
      "id": "Watch_1",
      "displayName": "Digital Watch"
    },
    {
      "itemType": 6,
      "id": "Watch_2",
      "displayName": "Hipster Watch"
    },
    {
      "itemType": 6,
      "id": "Watch_3",
      "displayName": "Wrist Compass"
    },
    {
      "itemType": 6,
      "id": "Watch_4",
      "displayName": "Wrist Hour Glass"
    },
    {
      "itemType": 6,
      "id": "Watch_5",
      "displayName": "Wrist Receiver"
    },
    {
      "itemType": 6,
      "id": "Water Shield",
      "displayName": "Frostspire Guard"
    },
    {
      "itemType": 6,
      "id": "Weaver_1",
      "displayName": "Weave of Counter"
    },
    {
      "itemType": 6,
      "id": "Weaver_2",
      "displayName": "Weave of Guardian"
    },
    {
      "itemType": 6,
      "id": "Weaver_3",
      "displayName": "Weave of Arcana"
    },
    {
      "itemType": 6,
      "id": "Weaver_4",
      "displayName": "Weave of Fury"
    },
    {
      "itemType": 6,
      "id": "Weaver_5",
      "displayName": "Weave of Marksman"
    },
    {
      "itemType": 6,
      "id": "WeaverChest",
      "displayName": "Weaver Chest"
    },
    {
      "itemType": 6,
      "id": "WeaverFeet",
      "displayName": "Weaver Shoes"
    },
    {
      "itemType": 6,
      "id": "WeaverLegs",
      "displayName": "Weaver Legs"
    },
    {
      "itemType": 6,
      "id": "Whale Backpack",
      "displayName": "Whale Backpack"
    },
    {
      "itemType": 6,
      "id": "Whirlwind",
      "displayName": "Breeze Pet"
    },
    {
      "itemType": 6,
      "id": "Whisper of Thorns",
      "displayName": "Whisper of Thorns"
    },
    {
      "itemType": 6,
      "id": "White Bishop's Hood",
      "displayName": "White Bishop's Hood"
    },
    {
      "itemType": 6,
      "id": "Wilderness Pack",
      "displayName": "Wilderness Pack"
    },
    {
      "itemType": 6,
      "id": "Wildroot Veil",
      "displayName": "Wildroot Veil"
    },
    {
      "itemType": 6,
      "id": "Willow Staff",
      "displayName": "Willow Staff"
    },
    {
      "itemType": 6,
      "id": "Wind Shield",
      "displayName": "Zephyr Cross"
    },
    {
      "itemType": 6,
      "id": "Windcarver",
      "displayName": "Windcarver"
    },
    {
      "itemType": 6,
      "id": "Windroot",
      "displayName": "Windroot"
    },
    {
      "itemType": 6,
      "id": "WindstriderChest",
      "displayName": "Windstrider Chest"
    },
    {
      "itemType": 6,
      "id": "WindstriderFeet",
      "displayName": "Windstrider Shoes"
    },
    {
      "itemType": 6,
      "id": "WindstriderLegs",
      "displayName": "Windstrider Legs"
    },
    {
      "itemType": 6,
      "id": "Winged Helm",
      "displayName": "Winged Helm"
    },
    {
      "itemType": 6,
      "id": "Wings of Valor",
      "displayName": "Wings of Valor"
    },
    {
      "itemType": 6,
      "id": "Wisp Red",
      "displayName": "Fire Wisp Pet"
    },
    {
      "itemType": 6,
      "id": "Witch's Whisk",
      "displayName": "Witch's Whisk"
    },
    {
      "itemType": 6,
      "id": "Witchsteps",
      "displayName": "Witchsteps"
    },
    {
      "itemType": 6,
      "id": "Wizard_1",
      "displayName": "Jupiter's Wrath"
    },
    {
      "itemType": 6,
      "id": "Wizard_2",
      "displayName": "Voltaic Overdraw"
    },
    {
      "itemType": 6,
      "id": "Wizard_3",
      "displayName": "Eye of the Storm"
    },
    {
      "itemType": 6,
      "id": "Wizard_4",
      "displayName": "Stonewake"
    },
    {
      "itemType": 6,
      "id": "Wizard_5",
      "displayName": "Focused Amplification"
    },
    {
      "itemType": 6,
      "id": "Wizard_6",
      "displayName": "Mana Surge"
    },
    {
      "itemType": 6,
      "id": "Wizard_7",
      "displayName": "Arcane Barrier"
    },
    {
      "itemType": 6,
      "id": "Wizardry Hat",
      "displayName": "Wizardry Hat"
    },
    {
      "itemType": 6,
      "id": "Wolf Pup",
      "displayName": "Wolf Cub Pet"
    },
    {
      "itemType": 6,
      "id": "Wolfcrest Shield",
      "displayName": "Wolfcrest Shield"
    },
    {
      "itemType": 6,
      "id": "Wooden Guard",
      "displayName": "Wooden Guard"
    },
    {
      "itemType": 6,
      "id": "Worker's Cap",
      "displayName": "Worker's Cap"
    },
    {
      "itemType": 6,
      "id": "Worm",
      "displayName": "Worm Pet"
    },
    {
      "itemType": 6,
      "id": "Wraith of Dawn",
      "displayName": "Wraith of Dawn"
    },
    {
      "itemType": 6,
      "id": "Wraithlight",
      "displayName": "Wraithlight"
    },
    {
      "itemType": 6,
      "id": "Zephyrlight",
      "displayName": "Zephyrlight"
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
