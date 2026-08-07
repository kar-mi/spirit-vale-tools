---
"@kar-mi/spirit-vale-tools-combat": minor
"@kar-mi/spirit-vale-tools-market": patch
---

Cut the CPU cost of keeping a live combat log indexed.

An open encounter was rewritten in full on every indexing pass, including every timeline bucket for
every actor across all three meters. Because the bucket count grows with the encounter's duration
and a live session indexes repeatedly, the work was quadratic in the length of a fight: a ten-minute
encounter cost roughly 1.8 million row upserts to store a few thousand rows' worth of information.

- `BucketSeries` now tracks the lowest bucket changed since the last write, so a pass persists only
  the buckets it touched. Per-pass cost stops growing with encounter duration (measured over a
  simulated ten-minute fight: the last second of the fight cost 1.50x the first before, 1.06x now).
- The enemy and death tables are no longer cleared and fully reinserted on every pass. Every row
  there is keyed by something stable and the sets only grow, so the upserts alone are already an
  exact snapshot.
- Prepared statements in the combat and market importers are resolved once per write rather than
  once per row.
- `DamageReducer.identities` is now capped and evicted least-recently-seen first, matching
  `mobIdentities`. It is serialised to the read model on every batch, so an uncapped map made each
  pass rewrite every player the session had ever seen.
