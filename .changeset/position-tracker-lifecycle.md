---
"@kar-mi/spirit-vale-tools-combat": patch
"@kar-mi/spirit-vale-tools-rewards": patch
---

Clear tracked positions and open loot drops on `authenticated` and `disconnect`.

Object ids are scoped to one connection, so state carried across a session boundary would place
objects using another connection's ids. This matches the reset the other trackers already perform.
