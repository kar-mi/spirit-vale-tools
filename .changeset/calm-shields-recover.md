---
"@kar-mi/spirit-vale-tools-capture": major
"@kar-mi/spirit-vale-tools-combat": major
"@kar-mi/spirit-vale-tools-logging": minor
"@kar-mi/spirit-vale-tools-character": minor
---

Fully decode recovery and bond settings from the generated FishNet map, derive healing and barrier semantics from current game metadata, correlate AutoCast and Guardian Bond sources, emit attributed shield lifecycle events without crediting unknown healers as self-heals, and expose the local player's current shield amount.

Fold shielding into the meters: an applied shield counts as healing done for the caster (HPS), and an absorbed shield is tracked as its own per-player quantity on the tanked meter — `absorbed` / `absorbedSkills` on the actor row, `totalAbsorbed` on the encounter — kept out of raw damage-taken totals and attributed to the incoming enemy skill it soaked. The tanked meter now also keeps a per-attacker breakdown of damage taken (`getEnemyBreakdown(…, "tanked")`). Combat history schema bumped to version 8 (`combat_actors.absorbed`, `meter` column on `combat_enemy_skills`).

Separate FishNet generated data, exact mapping, decoding, schema, inference, and tracking code. Remove the empty semantic-map API and the unused `semanticMap` combat tracker option, and move recovery-style classification and its public type from capture to combat.
