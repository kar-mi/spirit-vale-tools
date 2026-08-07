---
"@kar-mi/spirit-vale-tools-metrics": minor
"@kar-mi/spirit-vale-tools-rewards": major
"@kar-mi/spirit-vale-tools-combat": major
---

Generalize rate tracking into a shared `@kar-mi/spirit-vale-tools-metrics` package, and move combat's current DPS onto the same estimator.

`RateTracker` replaces `XpAggregateTracker` with metric-neutral naming, so one instance per metric — experience, coins, anything countable — reports through the same snapshot shape instead of consumers renaming XP-flavoured fields. `EwmaRate` is the underlying O(1) estimator, `BucketTimeline` the trailing bucket history, and `ewmaSeries` reconstructs a tracker's `perSecond` over time from a snapshot's timeline so a chart and the number beside it share one time constant.

**Breaking (`rewards`):** `XpAggregateTracker`, `XpAggregateSnapshot`, `XpAggregateBucket` and `XpAggregateCheckpoint` are removed. Use `RateTracker` from `@kar-mi/spirit-vale-tools-metrics`; the snapshot fields `totalExperience`/`xpPerSecond`/`xpPerHour` are now `total`/`perSecond`/`perHour`, and timeline buckets carry `value` rather than `experience`. Behaviour, defaults and the watermark/checkpoint dedup semantics are unchanged.

**Breaking (`combat`):** `currentDps` and `partyCurrentDps` are now an exponentially-weighted rate rather than a flat five-second window. They rise the instant a hit lands and then fade, so they no longer step discontinuously as a hit ages out and no longer read exactly zero after one. `FishNetDpsMeterOptions.currentWindowMs`, `LiveCombatOptions.currentWindowMs`, `DamageReducerOptions.currentWindowMs`, `MeterReducerOptions.currentWindowMs` and `IndexCombatStreamOptions.currentWindowMs` are replaced by `currentTauSeconds`, defaulting to 2.5 — a window of width `W` and an EWMA of time constant `tau` have equal estimator variance when `W = 2 * tau` and equal mean lag, so the default reproduces the smoothing and responsiveness of the window it replaces. Overall encounter `dps` is unchanged.

The combat history schema drops `combat_actors.window_json` for `ewma_rate`/`ewma_at_ms`/`ewma_tau_seconds`, and `COMBAT_DOMAIN_VERSION` is bumped to 6 so existing indexes rebuild. The decay constant is stored alongside the rate because the two are only meaningful together.

**Breaking (`combat`): the legacy `FishNetDpsMeter` is removed.** It was a second implementation of what `DamageReducer` + `renderEncounter` already produce, which meant every behavioural change had to be written twice. `FishNetDpsMeter` and `FishNetDpsMeterOptions` are gone; its options are already available split across `DamageReducerOptions` (`idleGapMs`, `currentTauSeconds`) and `RenderOptions` (`personalName`, `personalActorId`, `minimumDurationMs`, `anonymousIdentityGraceMs`). Use `LiveCombatService` for live state, or drive `DamageReducer` and render finished encounters with `renderEncounter`. The snapshot types (`FishNetDpsEncounterSnapshot` and friends) now live in their own module and are exported unchanged. `DpsReplayResult` becomes `{ snapshots, invalidLines }` — `loadDpsReplay(path, personalName)` itself is unchanged, and now renders each encounter as of its own last damage.

**Fixed (`combat`):** a hit landing exactly on a timeline bucket boundary was dropped from `timeline` while still counting toward `damage` and `dps`. Because an encounter's duration is `lastDamageAtMs - startedAtMs`, this hit the closing hit of any encounter whose duration was a whole number of 5-second buckets. `DamageReducer` and `MeterReducer` now also reject a non-positive `currentTauSeconds` at construction rather than when the first hit arrives.
