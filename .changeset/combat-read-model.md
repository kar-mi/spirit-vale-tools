---
"@kar-mi/spirit-vale-tools-combat": minor
---

Add the combat read model: incremental reducers and a queryable history store.

`FishNetDpsMeter`'s aggregation is extracted into reusable reducers that accumulate
into fixed-width timeline buckets instead of retaining every hit. `DamageReducer`
windows events into encounters and `renderEncounter` produces the same snapshot
shape the meter does, so both can be diffed field for field.

`createCombatDomain` registers combat's tables with
`@kar-mi/spirit-vale-tools-sqlite`, `indexCombatStream` indexes a combat log in one
streaming pass that resumes from the stored byte offset, and `CombatHistoryStore`
reads encounters back with keyset pagination — no path materialises a whole session.

Timestamps are absolute epoch milliseconds, unlike `loadDpsReplay`, which rebases
onto the first record it consumes. Pass `finalize: true` when indexing a log that
will not grow; while a session is live the trailing encounter stays open so the
next pass continues it.

The same pass also builds the enemy breakdown (per attacker, per enemy, per skill)
and the player death log with its ten-second hit lookback, replacing two of the
separate full-file replays those views needed. Both count every positive hit,
including incoming damage the DPS tables exclude, and `getEnemyBreakdown` /
`getDeathLog` read them back.

`FishNetDpsMeter`, `loadDpsReplay` and the replay-summary helpers are unchanged.
