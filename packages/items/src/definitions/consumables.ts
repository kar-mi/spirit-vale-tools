import type { FishNetItemDefinition } from "../catalog.ts";

export class ConsumableItemDefinitions {
  private constructor() {}

  static readonly values = [
    {
      "itemType": 1,
      "id": "Artifact Box Advanced",
      "displayName": "Box of Mastery"
    },
    {
      "itemType": 1,
      "id": "Artifact Box Base",
      "displayName": "Box of Origins"
    },
    {
      "itemType": 1,
      "id": "Lure Alien Big Blink",
      "displayName": "Time Device"
    },
    {
      "itemType": 1,
      "id": "Lure Angel Mage",
      "displayName": "Heaven's Tear Earring"
    },
    {
      "itemType": 1,
      "id": "Lure Bat Lord",
      "displayName": "Overripe Grape Cluster"
    },
    {
      "itemType": 1,
      "id": "Lure Cactus Boss",
      "displayName": "Oozing Pulp Chunk"
    },
    {
      "itemType": 1,
      "id": "Lure Cat Bolt",
      "displayName": "Curved Fishbone"
    },
    {
      "itemType": 1,
      "id": "Lure Death Mage",
      "displayName": "Black Mirror Shard"
    },
    {
      "itemType": 1,
      "id": "Lure Eyeball Monster",
      "displayName": "Abyssal Idol"
    },
    {
      "itemType": 1,
      "id": "Lure Goblin Giant Gold",
      "displayName": "Glinting Goblin Fang"
    },
    {
      "itemType": 1,
      "id": "Lure Goblin Warchief",
      "displayName": "Tribal Heirloom"
    },
    {
      "itemType": 1,
      "id": "Lure Hare",
      "displayName": "Gnawed Acorn"
    },
    {
      "itemType": 1,
      "id": "Lure Hermit King",
      "displayName": "Calcified Shell Core"
    },
    {
      "itemType": 1,
      "id": "Lure Ice Mage",
      "displayName": "Frozen Heart Crystal"
    },
    {
      "itemType": 1,
      "id": "Lure Imp Devil",
      "displayName": "Blank Pact Scroll"
    },
    {
      "itemType": 1,
      "id": "Lure Mega Ice Golem",
      "displayName": "Frozen Core Shard"
    },
    {
      "itemType": 1,
      "id": "Lure Queen Worm",
      "displayName": "Royal Jelly Clot"
    },
    {
      "itemType": 1,
      "id": "Lure Scorpion King",
      "displayName": "Soldier Termite"
    },
    {
      "itemType": 1,
      "id": "Lure Snake Naga",
      "displayName": "Fresh Kill Slab"
    },
    {
      "itemType": 1,
      "id": "Lure Spider Queen Robot",
      "displayName": "Spider Web Coil"
    },
    {
      "itemType": 1,
      "id": "Lure Sting",
      "displayName": "Buzzing Hive Fragment"
    },
    {
      "itemType": 1,
      "id": "Lure Sunflora Pixie",
      "displayName": "Sunborn Petal Tuft"
    },
    {
      "itemType": 1,
      "id": "Lure Turtle King",
      "displayName": "Tactical Power Node"
    },
    {
      "itemType": 1,
      "id": "Lure Werewolf",
      "displayName": "Fragment of the Pale Moon"
    },
    {
      "itemType": 1,
      "id": "Lure Worm Creep",
      "displayName": "Worm-Eaten Sediment"
    },
    {
      "itemType": 1,
      "id": "Lure Zombie Goblin King",
      "displayName": "Lost Shoe"
    },
    {
      "itemType": 1,
      "id": "Material Box",
      "displayName": "Material Box"
    },
    {
      "itemType": 1,
      "id": "Mystery Mount Box",
      "displayName": "Mystery Mount Egg"
    },
    {
      "itemType": 1,
      "id": "Mystery Pet Box",
      "displayName": "Mystery Pet Egg"
    },
    {
      "itemType": 1,
      "id": "Refine Box",
      "displayName": "Refine Box"
    },
    {
      "itemType": 1,
      "id": "Waystone",
      "displayName": "Waystone"
    }
  ] as const satisfies readonly FishNetItemDefinition[];
}
