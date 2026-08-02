---
"@kar-mi/spirit-vale-tools-combat": patch
---

Keep identities, monster names and the death lookback across incremental indexing passes.

Reducer state that spans encounters — the actor identity map, the monster names seen so far, and the
death-log lookback buffer — was persisted on the open encounter's row and restored only by
`loadOpenEncounter`. A live consumer calls `indexCombatStream` repeatedly over a growing log with a
fresh reducer each time, and frequently has no encounter open at the boundary: between fights, and
always before the first one. Those passes started over with empty maps, so the death log showed
`Actor 12345` instead of the monster's name and `Unidentified player` instead of the victim, and the
tanked meter lost its row names. A single finalizing pass over a finished log was unaffected, which
is why comparing against the full-history replay never surfaced it.

That state now lives in a per-session `combat_stream_state` table, restored at the start of every
pass and written in the same transaction as the rows it accompanies. The three JSON columns it
replaces are gone from `combat_encounters`. `COMBAT_DOMAIN_VERSION` moves to 4, so an existing cache
drops and re-indexes the combat domain on open.
