export const STAT_NAMES: Record<number, string> = {
  0: "STR", 1: "VIT", 2: "AGI", 3: "DEX", 4: "INT", 5: "LUK", 6: "All stats", 7: "HP", 8: "MP",
  9: "ATK", 10: "MATK", 11: "DEF", 12: "MDEF", 13: "Hit", 14: "Flee", 15: "Critical chance",
  16: "Flat DEF", 17: "Flat MDEF", 20: "Health on hit", 21: "Mana on hit", 22: "Kill leech", 23: "Kill MP leech",
  25: "Range", 26: "Status immunity", 39: "Autocast on hit", 40: "Autocast on attack", 41: "Autocast chance",
  52: "Critical damage", 59: "HP regeneration", 60: "Maximum HP regeneration", 61: "MP regeneration", 62: "Maximum MP regeneration",
  63: "Attack speed", 64: "Cast speed", 65: "Move speed", 66: "After-cast delay", 67: "Healing",
  69: "ATK multiplier", 70: "MATK multiplier", 71: "HP multiplier", 72: "MP multiplier", 73: "DEF multiplier", 74: "MDEF multiplier",
  75: "HP regeneration multiplier", 76: "MP regeneration multiplier", 77: "Flee multiplier", 78: "Hit multiplier", 79: "Critical multiplier",
  86: "Reflect damage", 97: "Leech chance", 98: "Leech", 99: "MP leech chance", 100: "MP leech",
  102: "Ranged damage", 104: "Skill cooldown", 113: "HP regeneration rate", 114: "MP regeneration rate",
  120: "Critical defence", 121: "Perfect dodge", 142: "Status damage", 151: "MATK per STR", 152: "ATK per STR",
  159: "Attack-speed multiplier", 160: "Cast-speed multiplier", 176: "HP siphon", 177: "MP siphon",
  184: "Two-handed stance bonus", 185: "Attack-speed limit", 187: "Cast-time reduction", 188: "Cast-time reduction limit",
};

export const PERCENT_STATS = new Set([47, 48, 52, 57, 58, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 79, 90, 98, 102, 104, 121, 159, 160, 184, 187]);
