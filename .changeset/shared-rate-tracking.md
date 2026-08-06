---
"@kar-mi/spirit-vale-tools-metrics": minor
"@kar-mi/spirit-vale-tools-rewards": major
"@kar-mi/spirit-vale-tools-combat": major
---

Generalize rate tracking into a shared `@kar-mi/spirit-vale-tools-metrics` package, and move combat's current DPS onto the same estimator.

`RateTracker` replaces `XpAggregateTracker` with metric-neutral naming, so one instance per metric — experience, coins, anything countable — reports through the same snapshot shape instead of consumers renaming XP-flavoured fields. `EwmaRate` is the underlying O(1) estimator, `BucketTimeline` the trailing bucket history, and `ewmaSeries` reconstructs a tracker's `perSecond` over time from a snapshot's timeline so a chart and the number beside it share one time constant.

**Breaking (`rewards`):** `XpAggregateTracker`, `XpAggregateSnapshot`, `XpAggregateBucket` and `XpAggregateCheckpoint` are removed. Use `RateTracker` from `@kar-mi/spirit-vale-tools-metrics`; the snapshot fields `totalExperience`/`xpPerSecond`/`xpPerHour` are now `total`/`perSecond`/`perHour`, and timeline buckets carry `value` rather than `experience`. Behaviour, defaults and the watermark/checkpoint dedup semantics are unchanged.

**Breaking (`combat`):** `currentDps` and `partyCurrentDps` are now an exponentially-weighted rate rather than a flat five-second window. They rise the instant a hit lands and then fade, so they no longer step discontinuously as a hit ages out and no longer read exactly zero after one. `FishNetDpsMeterOptions.currentWindowMs`, `LiveCombatOptions.currentWindowMs`, `DamageReducerOptions.currentWindowMs`, `MeterReducerOptions.currentWindowMs` and `IndexCombatStreamOptions.currentWindowMs` are replaced by `currentTauSeconds`, defaulting to 2.5 — a window of width `W` and an EWMA of time constant `tau` have equal estimator variance when `W = 2 * tau` and equal mean lag, so the default reproduces the smoothing and responsiveness of the window it replaces. Overall encounter `dps` is unchanged.

The combat history schema drops `combat_actors.window_json` for `ewma_rate`/`ewma_at_ms`, and `COMBAT_DOMAIN_VERSION` is bumped to 6 so existing indexes rebuild.
