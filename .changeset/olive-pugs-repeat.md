---
"@kar-mi/spirit-vale-tools-character": minor
---

Surface character fields the decoder already walked but discarded, and stop merging the action bar into the skill-tree allocation.

Additive optional properties: `CharacterSubstat.qualifier` (`StatData.ValueStr`) and `.index`, `CharacterEquipment.chaosType` (`EquipData.ChaosType`) and `.cardsBySlot`, plus `CharacterSnapshot.loadouts`, `.grimoires` and `.assignedSkills`. The dense `substats` and `cards` arrays are unchanged, so `rescaleSubstats` and every current consumer keep their present shape. The positional fields exist because a chaos roll is identified by being the last substat, and a densified array cannot express which card socket is empty.

**Behaviour change:** `CharacterSnapshot.skills` previously merged `SkillSystemData.Assigned` — the 40-slot action bar — into `SkillSystemData.Skills`, taking the higher level per id. Those are different things: the action bar restates learned skills at levels that do not match the allocation, and carries skills granted by grimoires rather than by spent points. On a recorded level-121 job-70 Gunslinger the merge reported 146 skill points against a legal budget of 120 (50 base + 70 job), inventing Force Shot, Piercing Shot and Sniper Shot at full level and doubling Panic Burst. `skills` is now the allocation alone (still folding in `SkillCopy`, which legitimately restates a learned skill) and the action bar is reported separately as `assignedSkills`.
