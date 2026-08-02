---
"@kar-mi/spirit-vale-tools-combat": patch
---

Bound the reducer's session-scoped state and stop crediting expired encounters.

**Retention.** `recentHits` trimmed only the target it was touching and never removed an entry, so a
target hit once was retained for the rest of the session; `mobIdentities` grew with every distinct
monster seen. Both are serialised into `combat_stream_state` on every indexing batch, so an
incremental pass over a long session re-wrote and re-parsed a steadily growing payload — a
throughput problem well before a memory one. Measured on a real capture, 226 distinct targets
accumulated in six minutes with none evicted. A sweep now runs once per lookback window and drops
targets whose hits have aged out, and `mobIdentities` evicts least-recently-seen past a cap. Deaths
still get their full ten-second lookback.

**Encounter boundaries.** `consumeCombat` ran its idle-gap check only for counted damage and kills.
Incoming damage and healing cannot open an encounter, so nothing closed one that had gone idle
before they were attributed, and a hit or heal arriving long after a fight ended was still counted
against it — corrupting the tanked and healing meters, the enemy breakdown and the death log. The
same check now guards the meter-only path. Those events still never open an encounter.

`LiveCombatService` and `indexCombatStream` consequently drop the pre-recording step that ran meter
events ahead of the reducer. It was written to guard against the reducer closing an encounter
underneath such an event, which it never did — and with the idle check in place it would have
defeated the fix.

`CombatHistoryStore.invalidLines(sessionId)` reports lines that were not a valid log record,
accumulated across passes rather than per pass, so a consumer can show a figure that covers the
whole stream. `COMBAT_DOMAIN_VERSION` moves to 5; an existing cache drops and re-indexes the combat
domain on open.
