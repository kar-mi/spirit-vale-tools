import type { FishNetItemDefinition } from "../catalog.ts";

export class CardItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 4,
      "id": "Abomination",
      "displayName": "Abomination Card",
      "effects": [
        {
          "type": 9,
          "value": 1
        },
        {
          "type": 73,
          "value": -1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Big Blink",
      "displayName": "Cosmic Entity Card",
      "effects": [
        {
          "type": 70,
          "value": 10
        },
        {
          "type": 69,
          "value": 10
        },
        {
          "type": 71,
          "value": -25
        },
        {
          "type": 72,
          "value": -25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Biteroot",
      "displayName": "Chomproot Card",
      "effects": [
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
    {
      "itemType": 4,
      "id": "Alien Cyclops",
      "displayName": "Voidspawn Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "TrueSight"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Galaxia",
      "displayName": "Galaxian Brute Card"
    },
    {
      "itemType": 4,
      "id": "Alien One Eye",
      "displayName": "Voidgazer Card",
      "effects": [
        {
          "type": 34,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Pew Pew",
      "displayName": "Galaxian Blaster Card"
    },
    {
      "itemType": 4,
      "id": "Alien Plant",
      "displayName": "Chompbloom Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Slow"
          }
        },
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
    {
      "itemType": 4,
      "id": "Alien Skye",
      "displayName": "Galaxian Skimmer Card"
    },
    {
      "itemType": 4,
      "id": "Alien Spike",
      "displayName": "Cinderspike Card",
      "effects": [
        {
          "type": 86,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Sporella",
      "displayName": "Chompcap Card"
    },
    {
      "itemType": 4,
      "id": "Alien Star",
      "displayName": "Little Star Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Starry",
      "displayName": "Starry Card"
    },
    {
      "itemType": 4,
      "id": "Alien Twinkle",
      "displayName": "Twinkle Card",
      "effects": [
        {
          "type": 67,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Wheel",
      "displayName": "Cinderwheel Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Stun"
          }
        },
        {
          "type": 72,
          "value": -25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Alien Wreck",
      "displayName": "Cindermaw Card",
      "effects": [
        {
          "type": 32,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Angel",
      "displayName": "Angel Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Angel Mage",
      "displayName": "Seraphim Arbiter Card",
      "effects": [
        {
          "type": 19,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Archangel",
      "displayName": "Archangel Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ball Robot Blue",
      "displayName": "Ward Robot Card"
    },
    {
      "itemType": 4,
      "id": "Ball Robot Red",
      "displayName": "Strike Robot Card"
    },
    {
      "itemType": 4,
      "id": "Bat",
      "displayName": "Bat Card",
      "effects": [
        {
          "type": 23,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bat Lord",
      "displayName": "Night Baron Card",
      "effects": [
        {
          "type": 177,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bee",
      "displayName": "Bee Card",
      "effects": [
        {
          "type": 76,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bird",
      "displayName": "Rooster Card",
      "effects": [
        {
          "type": 78,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Blast Robot Blue",
      "displayName": "Guard Robot Card"
    },
    {
      "itemType": 4,
      "id": "Blast Robot Red",
      "displayName": "Blast Robot Card"
    },
    {
      "itemType": 4,
      "id": "Blind",
      "displayName": "Nightshade Card"
    },
    {
      "itemType": 4,
      "id": "Bloom",
      "displayName": "Nightbloom Card",
      "effects": [
        {
          "type": 142,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Blossom",
      "displayName": "Deathblossom Card",
      "effects": [
        {
          "type": 142,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bomb",
      "displayName": "Bomb Card",
      "effects": [
        {
          "type": 63,
          "value": 25
        },
        {
          "type": 30,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bot Robot",
      "displayName": "Repair Robot Card"
    },
    {
      "itemType": 4,
      "id": "Boxy Robot",
      "displayName": "Boxy Robot Card",
      "effects": [
        {
          "type": 53,
          "value": 20,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bud",
      "displayName": "Venom Bud Card",
      "effects": [
        {
          "type": 65,
          "value": 10
        },
        {
          "type": 71,
          "value": -5
        },
        {
          "type": 72,
          "value": -5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bumble",
      "displayName": "Bumblebee Card",
      "effects": [
        {
          "type": 76,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Bunny",
      "displayName": "Bunny Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Burrow",
      "displayName": "Digger Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Stomp"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Butterfly Fairy",
      "displayName": "Fairy Card",
      "effects": [
        {
          "type": 34,
          "value": 1
        },
        {
          "type": 72,
          "value": -10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Butterfly Hue",
      "displayName": "Sprite Card",
      "effects": [
        {
          "type": 67,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Butterfly Pixie",
      "displayName": "Pixie Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cacti",
      "displayName": "Cacti Card",
      "effects": [
        {
          "type": 86,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cactus",
      "displayName": "Cactus Card",
      "effects": [
        {
          "type": 86,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cactus Boss",
      "displayName": "Cactus King Card",
      "effects": [
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Endure"
          }
        },
        {
          "type": 71,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cat Bolt",
      "displayName": "Raiju Card",
      "effects": [
        {
          "type": 19,
          "value": 6
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cat Lightning",
      "displayName": "Voltpaw Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cat Meow",
      "displayName": "Sparkit Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Thunderbolt"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Chick",
      "displayName": "Chick Card",
      "effects": [
        {
          "type": 9,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cobra Venom",
      "displayName": "Cobra Card"
    },
    {
      "itemType": 4,
      "id": "Creeper",
      "displayName": "Crawler Card",
      "effects": [
        {
          "type": 52,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Crystal Guardian Amethyst",
      "displayName": "Amethyst Guardian Card"
    },
    {
      "itemType": 4,
      "id": "Crystal Guardian Aqua",
      "displayName": "Aquamarine Guardian Card"
    },
    {
      "itemType": 4,
      "id": "Crystal Guardian Emerald",
      "displayName": "Emerald Guardian Card"
    },
    {
      "itemType": 4,
      "id": "Cyclops",
      "displayName": "Cyclops Card",
      "effects": [
        {
          "type": 74,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cyclops Bat",
      "displayName": "Eyeclops Bat Card",
      "effects": [
        {
          "type": 48,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cyclops Bat Mage",
      "displayName": "Eyeclops Mage Card",
      "effects": [
        {
          "type": 48,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cyclops Bat Wizard",
      "displayName": "Eyeclops Arcanist Card",
      "effects": [
        {
          "type": 64,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cyclops Giant",
      "displayName": "Cyclops Titan Card",
      "effects": [
        {
          "type": 74,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Cyclops Minion",
      "displayName": "Cyclopling Card",
      "effects": [
        {
          "type": 74,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dark Wizard Black",
      "displayName": "Onyx Warlock Card"
    },
    {
      "itemType": 4,
      "id": "Dark Wizard Purple",
      "displayName": "Violet Warlock Card"
    },
    {
      "itemType": 4,
      "id": "Dark Wizard Red",
      "displayName": "Scarlet Warlock Card"
    },
    {
      "itemType": 4,
      "id": "Death",
      "displayName": "Wight Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Ghost"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Death Mage",
      "displayName": "Abyss Archon Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Cloaking"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Delivery Robot",
      "displayName": "Delivery Robot Card",
      "effects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Devil Bat",
      "displayName": "Fire Bat Card"
    },
    {
      "itemType": 4,
      "id": "Devil Hades",
      "displayName": "Inferno Bat Card"
    },
    {
      "itemType": 4,
      "id": "Devil Hell",
      "displayName": "Hell Bat Card"
    },
    {
      "itemType": 4,
      "id": "Direwolf",
      "displayName": "Direwolf Card",
      "effects": [
        {
          "type": 79,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dog Bark",
      "displayName": "Hound Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "Fireball"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dog Bowwow",
      "displayName": "Hellhound Card",
      "effects": [
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
      ]
    },
    {
      "itemType": 4,
      "id": "Dog Pup",
      "displayName": "Pup Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Firebolt"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Blizzard",
      "displayName": "Frost Wyvern Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Bot",
      "displayName": "Dragon Bot Card"
    },
    {
      "itemType": 4,
      "id": "Dragon Darkness",
      "displayName": "Shadow Wyvern Card",
      "effects": [
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
          "value": -50
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Dusk",
      "displayName": "Dusk Drake Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Curse"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Fire",
      "displayName": "Flame Drake Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Ice",
      "displayName": "Rime Drake Card",
      "effects": [
        {
          "type": 123,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Inferno",
      "displayName": "Inferno Wyvern Card",
      "effects": [
        {
          "type": 69,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon King Blue",
      "displayName": "Frost Wyrm Card"
    },
    {
      "itemType": 4,
      "id": "Dragon King Green",
      "displayName": "Fire Wyrm Card"
    },
    {
      "itemType": 4,
      "id": "Dragon King Orange",
      "displayName": "Earth Wyrm Card"
    },
    {
      "itemType": 4,
      "id": "Dragon King Purple",
      "displayName": "Lightning Wyrm Card"
    },
    {
      "itemType": 4,
      "id": "Dragon Nightfall",
      "displayName": "Night Drake Card",
      "effects": [
        {
          "type": 52,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Predator Robot",
      "displayName": "Robot Dragon Card"
    },
    {
      "itemType": 4,
      "id": "Dragon Robot",
      "displayName": "Dragon Robot Card"
    },
    {
      "itemType": 4,
      "id": "Dragon Spark",
      "displayName": "Spark Drake Card",
      "effects": [
        {
          "type": 69,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragon Water",
      "displayName": "Aqua Drake Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragonfly Arrow",
      "displayName": "Darter Card",
      "effects": [
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 2,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragonfly Darner",
      "displayName": "Skimmer Card",
      "effects": [
        {
          "type": 14,
          "value": 20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Dragonfly Swift",
      "displayName": "Hawker Card",
      "effects": [
        {
          "type": 14,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Earthworm",
      "displayName": "Grave Worm Card"
    },
    {
      "itemType": 4,
      "id": "Egg",
      "displayName": "Egg Card",
      "effects": [
        {
          "type": 7,
          "value": 100
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Egglet",
      "displayName": "Egglet Card",
      "effects": [
        {
          "type": 63,
          "value": 10
        },
        {
          "type": 2,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Elder Wisp Blue",
      "displayName": "Elder Frost Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Elder Wisp Purple",
      "displayName": "Elder Lightning Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Elder Wisp Yellow",
      "displayName": "Elder Fire Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Bat Blue",
      "displayName": "Azure Gazer Card",
      "effects": [
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "HolyLight"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Bat Green",
      "displayName": "Jade Gazer Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Bat Red",
      "displayName": "Ruby Gazer Card",
      "effects": [
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "LifeDrainEnemy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Creep Blue",
      "displayName": "Azure Eyestalk Card",
      "effects": [
        {
          "type": 72,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Creep Green",
      "displayName": "Jade Eyestalk Card",
      "effects": [
        {
          "type": 72,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Creep Red",
      "displayName": "Ruby Eyestalk Card",
      "effects": [
        {
          "type": 72,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Mage",
      "displayName": "Beholder Card"
    },
    {
      "itemType": 4,
      "id": "Eyeball Mage Blue",
      "displayName": "Azure Beholder Card",
      "effects": [
        {
          "type": 10,
          "value": 1
        },
        {
          "type": 74,
          "value": -1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Mage Green",
      "displayName": "Jade Beholder Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Mage Red",
      "displayName": "Ruby Beholder Card",
      "effects": [
        {
          "type": 98,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Eyeball Monster",
      "displayName": "Kraken Card",
      "effects": [
        {
          "type": 200,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fire",
      "displayName": "Ember Card",
      "effects": [
        {
          "type": 75,
          "value": 25
        },
        {
          "type": 76,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fire Mage",
      "displayName": "Fire Mage Card",
      "effects": [
        {
          "type": 70,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "FIsh Blue",
      "displayName": "Bluefin Card",
      "effects": [
        {
          "type": 192,
          "value": -25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Man Blue",
      "displayName": "Aqua Merling Card",
      "effects": [
        {
          "type": 10,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Man Pink",
      "displayName": "Roseate Merling Card",
      "effects": [
        {
          "type": 9,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Man Yellow",
      "displayName": "Canary Merling Card",
      "effects": [
        {
          "type": 15,
          "value": 5
        },
        {
          "type": 52,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Merman Blue",
      "displayName": "Sapphire Merman Card",
      "effects": [
        {
          "type": 124,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ShieldThrow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Merman Pink",
      "displayName": "Coral Merman Card",
      "effects": [
        {
          "type": 52,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Merman Yellow",
      "displayName": "Topaz Merman Card"
    },
    {
      "itemType": 4,
      "id": "Fish Pink",
      "displayName": "Rosetail Card",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 10,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fish Yellow",
      "displayName": "Goldtail Card",
      "effects": [
        {
          "type": 121,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Flame",
      "displayName": "Blaze Card",
      "effects": [
        {
          "type": 211,
          "value": 15,
          "target": {
            "kind": "status",
            "id": "Burning"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fledgling",
      "displayName": "Fledgling Card",
      "effects": [
        {
          "type": 13,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Flora",
      "displayName": "Flora Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Flower Pot Monster",
      "displayName": "Mandrake Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "EarthSpikes"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Fungi",
      "displayName": "Fungi Card",
      "effects": [
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Heal"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Galaxy Robot",
      "displayName": "Galaxy Robot Card"
    },
    {
      "itemType": 4,
      "id": "Ghost",
      "displayName": "Ghost Card",
      "effects": [
        {
          "type": 122,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Gloom",
      "displayName": "Spectre Card",
      "effects": [
        {
          "type": 6,
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
      ]
    },
    {
      "itemType": 4,
      "id": "Glow Wisp Blue",
      "displayName": "Frost Glimmer Card",
      "effects": [
        {
          "type": 46,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Glow Wisp Purple",
      "displayName": "Lightning Glimmer Card",
      "effects": [
        {
          "type": 46,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Glow Wisp Yellow",
      "displayName": "Fire Glimmer Card",
      "effects": [
        {
          "type": 46,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Giant",
      "displayName": "Orc Card",
      "effects": [
        {
          "type": 71,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Giant Devil",
      "displayName": "Orc Soldier Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Giant Gold",
      "displayName": "Orc King Card",
      "effects": [
        {
          "type": 19,
          "value": 7
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Giant Mage",
      "displayName": "Orc Mage Card",
      "effects": [
        {
          "type": 46,
          "value": 1,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        },
        {
          "type": 70,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Minion",
      "displayName": "Goblin Card",
      "effects": [
        {
          "type": 106,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Bash"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Trooper",
      "displayName": "Goblin Grunt Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Trooper Assassin",
      "displayName": "Goblin Assassin Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Trooper Mage",
      "displayName": "Goblin Mage Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "FreeCast"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Trooper Soldier",
      "displayName": "Goblin Soldier Card",
      "effects": [
        {
          "type": 7,
          "value": 50
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Warblade",
      "displayName": "Orc Reaver Card",
      "effects": [
        {
          "type": 86,
          "value": 30
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Warchief",
      "displayName": "Orc Warchief Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Warcrusher",
      "displayName": "Orc Crusher Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Goblin Warlock",
      "displayName": "Orc Warlock Card",
      "effects": [
        {
          "type": 70,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Golem Earth",
      "displayName": "Stone Golem Card",
      "effects": [
        {
          "type": 73,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Golem Fire",
      "displayName": "Magma Golem Card",
      "effects": [
        {
          "type": 73,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Golem Ice",
      "displayName": "Rime Golem Card",
      "effects": [
        {
          "type": 73,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Grid Robot",
      "displayName": "Grid Robot Card"
    },
    {
      "itemType": 4,
      "id": "Grim Reaper",
      "displayName": "Reaper Card",
      "effects": [
        {
          "type": 47,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Gripper Robot",
      "displayName": "Gripper Robot Card",
      "effects": [
        {
          "type": 53,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        },
        {
          "type": 71,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Hare",
      "displayName": "Vorpal Hare Card",
      "effects": [
        {
          "type": 65,
          "value": 20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Haunt",
      "displayName": "Banshee Card",
      "effects": [
        {
          "type": 122,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Hermit King",
      "displayName": "Hermit King Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "HydroVortex"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Hermit Robot Blue",
      "displayName": "Scout Robot Card"
    },
    {
      "itemType": 4,
      "id": "Hermit Robot Red",
      "displayName": "Sentry Robot Card"
    },
    {
      "itemType": 4,
      "id": "Horror",
      "displayName": "Horror Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Housefly Icky",
      "displayName": "Gadfly Card",
      "effects": [
        {
          "type": 15,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Housefly Junk",
      "displayName": "Bluebottle Card",
      "effects": [
        {
          "type": 63,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Housefly Nom",
      "displayName": "Blowfly Card",
      "effects": [
        {
          "type": 15,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice",
      "displayName": "Ice Card",
      "effects": [
        {
          "type": 36,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Bear A",
      "displayName": "Ice Bear Card",
      "effects": [
        {
          "type": 7,
          "value": 800
        },
        {
          "type": 72,
          "value": -15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Bear B",
      "displayName": "Festive Bear Card",
      "effects": [
        {
          "type": 73,
          "value": 5
        },
        {
          "type": 74,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Cube A",
      "displayName": "Ice Golem Card"
    },
    {
      "itemType": 4,
      "id": "Ice Cube B",
      "displayName": "Shadow Golem Card"
    },
    {
      "itemType": 4,
      "id": "Ice Mage",
      "displayName": "Ice Mage Card",
      "effects": [
        {
          "type": 19,
          "value": 5
        },
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Starflake A",
      "displayName": "Starflake Card",
      "effects": [
        {
          "type": 90,
          "value": -15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Starflake B",
      "displayName": "Vanilla Ice Card",
      "effects": [
        {
          "type": 76,
          "value": 25
        },
        {
          "type": 90,
          "value": -10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Ice Starflake C",
      "displayName": "Shadow Ice Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Icicle",
      "displayName": "Icicle Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Slow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Imp Demon",
      "displayName": "Imp Card",
      "effects": [
        {
          "type": 65,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Imp Devil",
      "displayName": "Demon Lord Card",
      "effects": [
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Meteor"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Imp Mischief",
      "displayName": "Gremlin Card",
      "effects": [
        {
          "type": 94,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Jellyfish Robot",
      "displayName": "Stormjelly Card",
      "effects": [
        {
          "type": 76,
          "value": 50
        },
        {
          "type": 75,
          "value": -50
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Love Heart",
      "displayName": "Cupid Card"
    },
    {
      "itemType": 4,
      "id": "Lurker",
      "displayName": "Lurker Card",
      "effects": [
        {
          "type": 52,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mega Ice Golem",
      "displayName": "Ice Titan Card",
      "effects": [
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "IceShard"
          }
        },
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FreezingEdge"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Metal Robot",
      "displayName": "Metal Robot Card"
    },
    {
      "itemType": 4,
      "id": "Mimic Barrel",
      "displayName": "Barrel Mimic Card",
      "effects": [
        {
          "type": 1,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mimic Book",
      "displayName": "Book Mimic Card",
      "effects": [
        {
          "type": 4,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mimic Candle",
      "displayName": "Candle Mimic Card",
      "effects": [
        {
          "type": 3,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mimic Living Trap",
      "displayName": "Trap Mimic Card",
      "effects": [
        {
          "type": 2,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mimic Sword",
      "displayName": "Sword Mimic Card",
      "effects": [
        {
          "type": 0,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mimic Treasure Chest",
      "displayName": "Chest Mimic Card",
      "effects": [
        {
          "type": 5,
          "value": 3
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mini Ice Bear A",
      "displayName": "Ice Baby Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mini Ice Bear B",
      "displayName": "Festive Baby Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mini Ice Cube A",
      "displayName": "Ice Cube Card"
    },
    {
      "itemType": 4,
      "id": "Mini Ice Cube B",
      "displayName": "Shadow Cube Card"
    },
    {
      "itemType": 4,
      "id": "Mole Rat",
      "displayName": "Mole Card",
      "effects": [
        {
          "type": 71,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mole Rat King",
      "displayName": "Dire Mole Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Monster Bat",
      "displayName": "Nightwing Card",
      "effects": [
        {
          "type": 72,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Monster Bat King",
      "displayName": "Nightlord Card",
      "effects": [
        {
          "type": 177,
          "value": 3
        },
        {
          "type": 72,
          "value": -50
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mosquito Bug",
      "displayName": "Gnat Card",
      "effects": [
        {
          "type": 98,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mosquito Pester",
      "displayName": "Mosquito Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mosquito Stinger",
      "displayName": "Bloodsucker Card",
      "effects": [
        {
          "type": 42,
          "value": 5,
          "target": {
            "kind": "skill",
            "id": "Haste"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Moth Celestial",
      "displayName": "Celestial Moth Card",
      "effects": [
        {
          "type": 64,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Moth Luna",
      "displayName": "Luna Moth Card",
      "effects": [
        {
          "type": 64,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Moth Moon",
      "displayName": "Moon Moth Card",
      "effects": [
        {
          "type": 122,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Mushroom",
      "displayName": "Shroom Card",
      "effects": [
        {
          "type": 10,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Nexus Robot",
      "displayName": "Nexus Robot Card"
    },
    {
      "itemType": 4,
      "id": "Nightmare",
      "displayName": "Apparition Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Ghost"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareAcolyte",
      "displayName": "Umbral Acolyte Card",
      "effects": [
        {
          "type": 211,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareBerserker",
      "displayName": "Umbral Berserker Card",
      "effects": [
        {
          "type": 193,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareBerserkerBoss",
      "displayName": "Echo Berserker Card"
    },
    {
      "itemType": 4,
      "id": "NightmareGunslinger",
      "displayName": "Umbral Gunslinger Card",
      "effects": [
        {
          "type": 195,
          "value": 3
        },
        {
          "type": 102,
          "value": 1
        },
        {
          "type": 25,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareGunslingerBoss",
      "displayName": "Echo Gunslinger Card"
    },
    {
      "itemType": 4,
      "id": "NightmareKnight",
      "displayName": "Umbral Knight Card",
      "effects": [
        {
          "type": 192,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareMage",
      "displayName": "Umbral Mage Card",
      "effects": [
        {
          "type": 10,
          "value": 5
        },
        {
          "type": 194,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareNecromancer",
      "displayName": "Umbral Necromancer Card",
      "effects": [
        {
          "type": 194,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareNecromancerBoss",
      "displayName": "Echo Necromancer Card"
    },
    {
      "itemType": 4,
      "id": "NightmarePaladin",
      "displayName": "Umbral Paladin Card",
      "effects": [
        {
          "type": 139,
          "value": 1
        },
        {
          "type": 72,
          "value": -2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmarePaladinBoss",
      "displayName": "Echo Paladin Card"
    },
    {
      "itemType": 4,
      "id": "NightmarePriest",
      "displayName": "Umbral Priest Card",
      "effects": [
        {
          "type": 67,
          "value": 2
        },
        {
          "type": 90,
          "value": -2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmarePriestBoss",
      "displayName": "Echo Priest Card"
    },
    {
      "itemType": 4,
      "id": "NightmareRogue",
      "displayName": "Umbral Rogue Card",
      "effects": [
        {
          "type": 63,
          "value": 5
        },
        {
          "type": 77,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareScout",
      "displayName": "Umbral Scout Card",
      "effects": [
        {
          "type": 9,
          "value": 5
        },
        {
          "type": 78,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareShadow",
      "displayName": "Curse Manifestation Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Ghost"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareShinobi",
      "displayName": "Umbral Shinobi Card",
      "effects": [
        {
          "type": 182,
          "value": 1
        },
        {
          "type": 90,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareShinobiBoss",
      "displayName": "Echo Shinobi Card"
    },
    {
      "itemType": 4,
      "id": "NightmareSummoner",
      "displayName": "Umbral Summoner Card",
      "effects": [
        {
          "type": 135,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareWarrior",
      "displayName": "Umbral Warrior Card",
      "effects": [
        {
          "type": 52,
          "value": 5
        },
        {
          "type": 193,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareWizard",
      "displayName": "Umbral Wizard Card",
      "effects": [
        {
          "type": 48,
          "value": 1
        },
        {
          "type": 189,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "NightmareWizardBoss",
      "displayName": "Echo Wizard Card"
    },
    {
      "itemType": 4,
      "id": "Nose Robot",
      "displayName": "Nose Robot Card",
      "effects": [
        {
          "type": 39,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FirePillar"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Nozzle Robot",
      "displayName": "Nozzle Robot Card",
      "effects": [
        {
          "type": 101,
          "value": 100
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus Baby Blue",
      "displayName": "Azure Squid Card",
      "effects": [
        {
          "type": 77,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus Baby Orange",
      "displayName": "Amber Squid Card",
      "effects": [
        {
          "type": 77,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus Baby Purple",
      "displayName": "Plum Squid Card",
      "effects": [
        {
          "type": 77,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus King Blue",
      "displayName": "Azure Octopus Card",
      "effects": [
        {
          "type": 102,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus King Orange",
      "displayName": "Amber Octopus Card",
      "effects": [
        {
          "type": 25,
          "value": 1
        },
        {
          "type": 63,
          "value": -20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus King Purple",
      "displayName": "Violet Octopus Card",
      "effects": [
        {
          "type": 102,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Octopus Orange",
      "displayName": "Amber Cuttlefish Card"
    },
    {
      "itemType": 4,
      "id": "Octopus Purple",
      "displayName": "Violet Cuttlefish Card"
    },
    {
      "itemType": 4,
      "id": "Octopus White",
      "displayName": "Pearl Cuttlefish Card"
    },
    {
      "itemType": 4,
      "id": "Petal",
      "displayName": "Nautilus Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Phantom",
      "displayName": "Phantom Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Ghost"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Plant Chewer",
      "displayName": "Man-Eater Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Plant Monster",
      "displayName": "Snapvine Card",
      "effects": [
        {
          "type": 142,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Plant Shooter",
      "displayName": "Spitter Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Plant Worm",
      "displayName": "Vinecrawler Card",
      "effects": [
        {
          "type": 142,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Poison Bomb",
      "displayName": "Miasma Card",
      "effects": [
        {
          "type": 211,
          "value": 15,
          "target": {
            "kind": "status",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Pollen",
      "displayName": "Pollen Card",
      "effects": [
        {
          "type": 14,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Posy",
      "displayName": "Sea Blossom Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Icebolt"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Queen Worm",
      "displayName": "Broodmother Card",
      "effects": [
        {
          "type": 42,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "VenomCoating"
          }
        },
        {
          "type": 40,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Rabbit",
      "displayName": "Rabbit Card",
      "effects": [
        {
          "type": 65,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Rat Dark",
      "displayName": "Sewer Rat Card",
      "effects": [
        {
          "type": 14,
          "value": 10
        },
        {
          "type": 2,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Rat Grey",
      "displayName": "Plague Rat Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Poison"
          }
        },
        {
          "type": 1,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Rat White",
      "displayName": "Albino Rat Card",
      "effects": [
        {
          "type": 13,
          "value": 10
        },
        {
          "type": 3,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Razor Robot",
      "displayName": "Razor Robot Card",
      "effects": [
        {
          "type": 63,
          "value": 5
        },
        {
          "type": 65,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Scorpion",
      "displayName": "Scorpion Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Scorpion King",
      "displayName": "Scorpion King Card",
      "effects": [
        {
          "type": 19,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Scorpling",
      "displayName": "Scorpling Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Seed",
      "displayName": "Seedling Card",
      "effects": [
        {
          "type": 7,
          "value": 100
        },
        {
          "type": 1,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Shade",
      "displayName": "Shade Card",
      "effects": [
        {
          "type": 6,
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
      ]
    },
    {
      "itemType": 4,
      "id": "Shadow",
      "displayName": "Nightfiend Card",
      "effects": [
        {
          "type": 6,
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
      ]
    },
    {
      "itemType": 4,
      "id": "Shark",
      "displayName": "Bull Shark Card",
      "effects": [
        {
          "type": 192,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Shark Baby",
      "displayName": "Sharkling Card",
      "effects": [
        {
          "type": 192,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Shark Humanoid",
      "displayName": "Shark Buccaneer Card",
      "effects": [
        {
          "type": 192,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Shell",
      "displayName": "Conch Card",
      "effects": [
        {
          "type": 53,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Neutral"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Shell Robot",
      "displayName": "Shell Robot Card",
      "effects": [
        {
          "type": 63,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Skeleton",
      "displayName": "Skeleton Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Skeleton Giant",
      "displayName": "Skeleton Giant Card",
      "effects": [
        {
          "type": 47,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Skeleton Mage",
      "displayName": "Skeleton Mage Card",
      "effects": [
        {
          "type": 70,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Slime",
      "displayName": "Slime Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Slime Jelly",
      "displayName": "Jellooze Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Slime Monster",
      "displayName": "Oozelord Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Snake",
      "displayName": "Viper Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "VenomStrike"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Snake Naga",
      "displayName": "Naga Card",
      "effects": [
        {
          "type": 80,
          "value": 30
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Snakelet",
      "displayName": "Adder Card",
      "effects": [
        {
          "type": 80,
          "value": 20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Snout Robot",
      "displayName": "Snout Robot Card",
      "effects": [
        {
          "type": 212,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FirePillar"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Snow Bomb",
      "displayName": "Snowball Card",
      "effects": [
        {
          "type": 211,
          "value": 15,
          "target": {
            "kind": "status",
            "id": "Frozen"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Soldier Robot",
      "displayName": "Soldier Robot Card"
    },
    {
      "itemType": 4,
      "id": "Soul",
      "displayName": "Soul Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Ghost"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Soul Mage",
      "displayName": "Soul Mage Card",
      "effects": [
        {
          "type": 64,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spider",
      "displayName": "Spider Card",
      "effects": [
        {
          "type": 199,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "ShadowStep"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spider King",
      "displayName": "Arachne Card",
      "effects": [
        {
          "type": 9,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spider Queen Robot",
      "displayName": "Suphara Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Holy"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        },
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spider Robot",
      "displayName": "Spider Robot Card",
      "effects": [
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "JumpShot"
          }
        },
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "ShrapnelShot"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spider Toxin",
      "displayName": "Widow Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spiderling Robot",
      "displayName": "Spiderling Robot Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spike",
      "displayName": "Hermit Card",
      "effects": [
        {
          "type": 72,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spike Robot",
      "displayName": "Spike Robot Card",
      "effects": [
        {
          "type": 63,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spook",
      "displayName": "Spook Card",
      "effects": [
        {
          "type": 34,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Spore",
      "displayName": "Spore Card",
      "effects": [
        {
          "type": 71,
          "value": 1
        },
        {
          "type": 1,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Sprout",
      "displayName": "Sprout Card",
      "effects": [
        {
          "type": 42,
          "value": 3,
          "target": {
            "kind": "skill",
            "id": "Earthbolt"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Squid Baby",
      "displayName": "Squidling Card",
      "effects": [
        {
          "type": 8,
          "value": 10
        },
        {
          "type": 72,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Sting",
      "displayName": "Vespa Card",
      "effects": [
        {
          "type": 185,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Stinger Robot",
      "displayName": "Stormstinger Card",
      "effects": [
        {
          "type": 76,
          "value": 100
        },
        {
          "type": 72,
          "value": -50
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Sun Blossom",
      "displayName": "Nymph Card",
      "effects": [
        {
          "type": 67,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Sunflora Pixie",
      "displayName": "Lady Fey Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Silence"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Sunflower Fairy",
      "displayName": "Sylvie Card",
      "effects": [
        {
          "type": 67,
          "value": 15
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Tanker Robot",
      "displayName": "Tanker Robot Card"
    },
    {
      "itemType": 4,
      "id": "Tech Robot",
      "displayName": "Tech Robot Card"
    },
    {
      "itemType": 4,
      "id": "Tentacles Robot",
      "displayName": "Stormcoil Card",
      "effects": [
        {
          "type": 65,
          "value": 20
        },
        {
          "type": 72,
          "value": -20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Titan Turtle Sci Blue",
      "displayName": "Hydro Turtle Card",
      "effects": [
        {
          "type": 109,
          "value": 1,
          "target": {
            "kind": "skill",
            "id": "FreezingField"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Titan Turtle Sci Green",
      "displayName": "Solar Turtle Card",
      "effects": [
        {
          "type": 69,
          "value": 4
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Titan Turtle Sci Pink",
      "displayName": "Storm Turtle Card",
      "effects": [
        {
          "type": 124,
          "value": 2,
          "target": {
            "kind": "skill",
            "id": "ChainLightning"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Toadstool",
      "displayName": "Toadstool Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Forest Autumn",
      "displayName": "Maple Ancient Card",
      "effects": [
        {
          "type": 62,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Forest Evergreen",
      "displayName": "Pine Ancient Card",
      "effects": [
        {
          "type": 75,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Minion Autumn",
      "displayName": "Maple Sapling Card",
      "effects": [
        {
          "type": 8,
          "value": 20
        },
        {
          "type": 76,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Minion Evergreen",
      "displayName": "Pine Sapling Card",
      "effects": [
        {
          "type": 7,
          "value": 100
        },
        {
          "type": 75,
          "value": 25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Tree Autumn",
      "displayName": "Maple Treant Card",
      "effects": [
        {
          "type": 72,
          "value": 20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Treant Tree Evergreen",
      "displayName": "Pine Treant Card",
      "effects": [
        {
          "type": 71,
          "value": 20
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Trooper Robot",
      "displayName": "Trooper Robot Card"
    },
    {
      "itemType": 4,
      "id": "Turtle",
      "displayName": "Turtle Baby Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Stun"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Turtle King",
      "displayName": "Turtle Champion Card",
      "effects": [
        {
          "type": 49,
          "value": 17,
          "target": {
            "kind": "skill",
            "id": "TetraVortex"
          }
        },
        {
          "type": 108,
          "value": 100,
          "target": {
            "kind": "skill",
            "id": "TetraVortex"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Turtle Monster Blue",
      "displayName": "Azure Terrapin Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Blind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Turtle Monster Green",
      "displayName": "Verdant Terrapin Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Decay"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Turtle Monster Red",
      "displayName": "Crimson Terrapin Card",
      "effects": [
        {
          "type": 26,
          "value": 50,
          "target": {
            "kind": "status",
            "id": "Burning"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Vampire Bat",
      "displayName": "Nosferatu Card",
      "effects": [
        {
          "type": 176,
          "value": 10
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Werewolf",
      "displayName": "Lycanthrope Card",
      "effects": [
        {
          "type": 19,
          "value": 2
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Whirlwind",
      "displayName": "Breeze Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wind",
      "displayName": "Gale Card",
      "effects": [
        {
          "type": 8,
          "value": 10
        },
        {
          "type": 72,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wind Mage",
      "displayName": "Wind Mage Card"
    },
    {
      "itemType": 4,
      "id": "Wisp Blue",
      "displayName": "Frost Wisp Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Water"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wisp Purple",
      "displayName": "Lightning Wisp Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Wind"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wisp Red",
      "displayName": "Fire Wisp Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Fire"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wisp Yellow",
      "displayName": "Earth Wisp Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Earth"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wolf",
      "displayName": "Wolf Card",
      "effects": [
        {
          "type": 53,
          "value": 25,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Wolf Pup",
      "displayName": "Wolf Cub Card",
      "effects": [
        {
          "type": 46,
          "value": 6,
          "target": {
            "kind": "element",
            "id": "Shadow"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Worm",
      "displayName": "Worm Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Worm Creep",
      "displayName": "Devourer Card",
      "effects": [
        {
          "type": 19,
          "value": 1
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Worm Rot",
      "displayName": "Maggot Card",
      "effects": [
        {
          "type": 53,
          "value": 15,
          "target": {
            "kind": "element",
            "id": "Poison"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Worm Stink",
      "displayName": "Grub Card"
    },
    {
      "itemType": 4,
      "id": "Wraith",
      "displayName": "Wraith King Card",
      "effects": [
        {
          "type": 185,
          "value": 2
        },
        {
          "type": 71,
          "value": -25
        },
        {
          "type": 72,
          "value": -25
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Zombie Goblin Giant",
      "displayName": "Zombie Orc Card",
      "effects": [
        {
          "type": 10,
          "value": 5
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Zombie Goblin King",
      "displayName": "Zombie Orc Lord Card",
      "effects": [
        {
          "type": 19,
          "value": 8
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Zombie Goblin Minion",
      "displayName": "Zombie Goblin Card",
      "effects": [
        {
          "type": 44,
          "value": 10,
          "target": {
            "kind": "element",
            "id": "Undead"
          }
        }
      ]
    },
    {
      "itemType": 4,
      "id": "Zombie Goblin Soldier",
      "displayName": "Zombie Grunt Card",
      "effects": [
        {
          "type": 71,
          "value": 25
        },
        {
          "type": 68,
          "value": -50
        }
      ]
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
