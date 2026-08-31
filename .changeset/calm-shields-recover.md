---
"@kar-mi/spirit-vale-tools-capture": major
"@kar-mi/spirit-vale-tools-combat": major
"@kar-mi/spirit-vale-tools-logging": minor
"@kar-mi/spirit-vale-tools-character": minor
---

Fully decode recovery and bond settings from the generated FishNet map, derive healing and barrier semantics from current game metadata, correlate AutoCast and Guardian Bond sources, emit attributed shield lifecycle events without crediting unknown healers as self-heals, and expose the local player's current shield amount.

Separate FishNet generated data, exact mapping, decoding, schema, inference, and tracking code. Remove the empty semantic-map API and the unused `semanticMap` combat tracker option, and move recovery-style classification and its public type from capture to combat.
