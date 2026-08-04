---
"@kar-mi/spirit-vale-tools-character": minor
---

Surface character fields the decoder already walked but discarded, as additive optional properties: `CharacterSubstat.qualifier` (`StatData.ValueStr`) and `.index`, `CharacterEquipment.chaosType` (`EquipData.ChaosType`) and `.cardsBySlot`, plus `CharacterSnapshot.loadouts` and `.grimoires`. Existing dense `substats` and `cards` arrays are unchanged, so `rescaleSubstats` and every current consumer keep their present shape; the positional fields exist because a chaos roll is identified by being the last substat and a densified array cannot express which socket is empty.
