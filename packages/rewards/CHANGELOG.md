# @kar-mi/spirit-vale-tools-rewards

## 1.3.2

### Patch Changes

- Updated dependencies [705ebd8]
  - @kar-mi/spirit-vale-tools-capture@3.0.0
  - @kar-mi/spirit-vale-tools-combat@4.0.0
  - @kar-mi/spirit-vale-tools-logging@0.10.0
  - @kar-mi/spirit-vale-tools-items@0.1.10
  - @kar-mi/spirit-vale-tools-sqlite@0.2.2

## 1.3.1

### Patch Changes

- Updated dependencies [813bce6]
  - @kar-mi/spirit-vale-tools-capture@2.3.0
  - @kar-mi/spirit-vale-tools-logging@0.9.0
  - @kar-mi/spirit-vale-tools-combat@3.3.5
  - @kar-mi/spirit-vale-tools-sqlite@0.2.1

## 1.3.0

### Minor Changes

- 545f9f9: Retain directly decoded player identities across object lifecycle gaps, clear them on direct monster identity syncs, and expose the complete datamine-backed monster identity catalog separately from reward eligibility.

  Ordered raw capture splits can also be replayed through one decoder and actor lifetime by supplying multiple inputs.

### Patch Changes

- Updated dependencies [545f9f9]
  - @kar-mi/spirit-vale-tools-combat@3.3.4

## 1.2.2

### Patch Changes

- Updated dependencies [04bf95c]
  - @kar-mi/spirit-vale-tools-capture@2.1.0
  - @kar-mi/spirit-vale-tools-sqlite@0.2.0
  - @kar-mi/spirit-vale-tools-combat@3.3.3

## 1.2.1

### Patch Changes

- Updated dependencies [6258350]
  - @kar-mi/spirit-vale-tools-capture@2.0.0
  - @kar-mi/spirit-vale-tools-combat@3.3.2
  - @kar-mi/spirit-vale-tools-items@0.1.8

## 1.2.0

### Minor Changes

- 74908b7: Add `FishNetLootDropTracker`, which tracks items on the ground from the spawn that places them to
  the despawn that removes them: world position from the spawn transform, and name, sprite, rarity,
  type and party lock from the `LootDrop` SyncVars.

  Drops whose SyncVars arrive inside their spawn packet are named at spawn time; a follow-up SyncType
  packet is not guaranteed and some drops never send one.

  A despawn carries only an object id, so a removed drop is reported as gone rather than as picked up
  by anyone.

### Patch Changes

- 74908b7: Clear tracked positions and open loot drops on `authenticated` and `disconnect`.

  Object ids are scoped to one connection, so state carried across a session boundary would place
  objects using another connection's ids. This matches the reset the other trackers already perform.

- Updated dependencies [74908b7]
- Updated dependencies [74908b7]
- Updated dependencies [74908b7]
- Updated dependencies [74908b7]
  - @kar-mi/spirit-vale-tools-capture@1.6.0
  - @kar-mi/spirit-vale-tools-combat@3.2.0

## 1.1.3

### Patch Changes

- Updated dependencies [eb8aa93]
  - @kar-mi/spirit-vale-tools-combat@3.0.0

## 1.1.2

### Patch Changes

- Updated dependencies [1ce4722]
  - @kar-mi/spirit-vale-tools-logging@0.8.0
  - @kar-mi/spirit-vale-tools-combat@2.2.3
  - @kar-mi/spirit-vale-tools-sqlite@0.1.5

## 1.1.1

### Patch Changes

- Updated dependencies [5f876dd]
  - @kar-mi/spirit-vale-tools-logging@0.7.0
  - @kar-mi/spirit-vale-tools-combat@2.2.2
  - @kar-mi/spirit-vale-tools-sqlite@0.1.4

## 1.1.0

### Minor Changes

- f2b7ae9: Follow live logs by watching them instead of polling them.

  `subscribeToLogStream` is a new shared ingestion source: one `fs.watch` on the current-stream
  pointer, one on the active session file, one tail reader and one fallback poll per stream, however
  many consumers are attached. Previously every consumer re-read and re-parsed the pointer and
  re-stat'd the same file on its own interval, so idle cost grew with the number of overlays.

  Every session follower (`DpsSessionLogFollower`, `MarketSessionLogFollower`,
  `RewardSessionLogFollower`, `LiveRewardSessionLogFollower`) is built on it and gains `watch()`,
  `next()`, async iteration and `close()` beside the existing `poll()`, which is unchanged. A
  follower is only subscribed once it is first used, and `close()` releases it.

  Live followers now read at most 1 MiB per drain (`DEFAULT_STREAM_BATCH_BYTES`), so a backlog is
  handed over in pieces rather than parsed in one turn of the main thread. `JsonlTailReader` gained
  `bytePosition` and an optional per-read byte limit to support this.

  `DpsLogBatch` gained `changed` and `revision`. `LiveCombatService` and `FishNetStatusTracker` no
  longer move their revision for a re-stated identity or status, or for an `advance()` on which
  nothing lapsed, so consumers can skip projecting and publishing on those. `FishNetStatusTracker`
  also gained `revision` and `nextExpiryAtMs()`, which lets a consumer sleep until a status is due to
  disappear instead of ticking to find out.

### Patch Changes

- Updated dependencies [f2b7ae9]
  - @kar-mi/spirit-vale-tools-logging@0.6.0
  - @kar-mi/spirit-vale-tools-combat@2.2.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.3

## 1.0.1

### Patch Changes

- ed6a563: Shrink log records by 36% by writing only what varies per record.

  Every v1 line repeated the full envelope. Measured over 130 real combat logs, `sessionId`, `source`
  and `schemaVersion` were 28.2% of the bytes on disk while being byte-identical on every line — and
  all three were already recorded in `session.json`. `recordedAt` spent a 24-byte ISO string on a
  value every reader immediately parsed back to a number.

  v2 writes `{"seq":3,"at":1754526750719,"type":"combat.event","data":{…}}`, preceded once per stream
  file by a header line carrying the session id, producer and start time. Re-encoding the 1,088,293
  records currently on disk measured **330.3MB → 211.9MB (35.8% smaller, 318 → 204 bytes/record)**.

  - `type` is kept. It is _not_ recoverable from `data`: 743,106 of those records carry no `data.kind`
    at all, so deriving it would be guesswork exactly where it matters.
  - `recordedAt` is stored as absolute epoch milliseconds rather than an offset from the header, so a
    reader that starts partway through a file — an incremental indexing pass resuming from a byte
    offset, which never sees line 1 — decodes records without needing the header.
  - Reading is backward compatible. `parseLogRecord` accepts both encodings, so the logs already on
    disk keep working untouched, and it now takes an optional header to populate `sessionId`/`source`
    for callers reading a file from the start.
  - New exports: `encodeLogRecord`, `encodeLogStreamHeader`, `isLogStreamHeader`,
    `parseLogStreamHeader`, and the `LogStreamHeader` type. Readers should skip header lines rather
    than counting them as malformed.

  Also fixes a live-vs-replay difference: `phase` was emitted by the capture tracker and is what
  `FishNetStatusTracker.consumeActivation` checks before refreshing a status, but it was missing from
  the combat sanitizer's allowlist and so never reached the log. A replayed interrupt or cancel
  therefore looked like a successful cast and extended the buff, which live capture never did.

- Updated dependencies [ed6a563]
- Updated dependencies [ed6a563]
  - @kar-mi/spirit-vale-tools-combat@2.1.0
  - @kar-mi/spirit-vale-tools-logging@0.5.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.2

## 1.0.0

### Major Changes

- 48eb00f: Generalize rate tracking into a shared `@kar-mi/spirit-vale-tools-metrics` package, and move combat's current DPS onto the same estimator.

  `RateTracker` replaces `XpAggregateTracker` with metric-neutral naming, so one instance per metric — experience, coins, anything countable — reports through the same snapshot shape instead of consumers renaming XP-flavoured fields. `EwmaRate` is the underlying O(1) estimator, `BucketTimeline` the trailing bucket history, and `ewmaSeries` reconstructs a tracker's `perSecond` over time from a snapshot's timeline so a chart and the number beside it share one time constant.

  **Breaking (`rewards`):** `XpAggregateTracker`, `XpAggregateSnapshot`, `XpAggregateBucket` and `XpAggregateCheckpoint` are removed. Use `RateTracker` from `@kar-mi/spirit-vale-tools-metrics`; the snapshot fields `totalExperience`/`xpPerSecond`/`xpPerHour` are now `total`/`perSecond`/`perHour`, and timeline buckets carry `value` rather than `experience`. Behaviour, defaults and the watermark/checkpoint dedup semantics are unchanged.

  **Breaking (`combat`):** `currentDps` and `partyCurrentDps` are now an exponentially-weighted rate rather than a flat five-second window. They rise the instant a hit lands and then fade, so they no longer step discontinuously as a hit ages out and no longer read exactly zero after one. `FishNetDpsMeterOptions.currentWindowMs`, `LiveCombatOptions.currentWindowMs`, `DamageReducerOptions.currentWindowMs`, `MeterReducerOptions.currentWindowMs` and `IndexCombatStreamOptions.currentWindowMs` are replaced by `currentTauSeconds`, defaulting to 2.5 — a window of width `W` and an EWMA of time constant `tau` have equal estimator variance when `W = 2 * tau` and equal mean lag, so the default reproduces the smoothing and responsiveness of the window it replaces. Overall encounter `dps` is unchanged.

  The combat history schema drops `combat_actors.window_json` for `ewma_rate`/`ewma_at_ms`/`ewma_tau_seconds`, and `COMBAT_DOMAIN_VERSION` is bumped to 6 so existing indexes rebuild. The decay constant is stored alongside the rate because the two are only meaningful together.

  **Breaking (`combat`): the legacy `FishNetDpsMeter` is removed.** It was a second implementation of what `DamageReducer` + `renderEncounter` already produce, which meant every behavioural change had to be written twice. `FishNetDpsMeter` and `FishNetDpsMeterOptions` are gone; its options are already available split across `DamageReducerOptions` (`idleGapMs`, `currentTauSeconds`) and `RenderOptions` (`personalName`, `personalActorId`, `minimumDurationMs`, `anonymousIdentityGraceMs`). Use `LiveCombatService` for live state, or drive `DamageReducer` and render finished encounters with `renderEncounter`. The snapshot types (`FishNetDpsEncounterSnapshot` and friends) now live in their own module and are exported unchanged. `DpsReplayResult` becomes `{ snapshots, invalidLines }` — `loadDpsReplay(path, personalName)` itself is unchanged, and now renders each encounter as of its own last damage.

  **Fixed (`combat`):** a hit landing exactly on a timeline bucket boundary was dropped from `timeline` while still counting toward `damage` and `dps`. Because an encounter's duration is `lastDamageAtMs - startedAtMs`, this hit the closing hit of any encounter whose duration was a whole number of 5-second buckets. `DamageReducer` and `MeterReducer` now also reject a non-positive `currentTauSeconds` at construction rather than when the first hit arrives.

### Patch Changes

- Updated dependencies [48eb00f]
  - @kar-mi/spirit-vale-tools-combat@2.0.0

## 0.5.0

### Minor Changes

- 32c4896: Report mob kills that no reward could be pinned to, instead of discarding them.

  A kill was only emitted when it had both an identified mob and a correlated reward. Everything else
  was dropped silently: an ambiguous kill returned early, and a kill with no gain and no drops fell
  through to nothing. Experience arrives as a coalesced `ExpCoinsChanged_T` state update, so a kill is
  only attributable when exactly one death sits inside the correlation window — which farming almost
  never satisfies. Measured on a real session, 233 mobs died and produced 2 `rewards.kill` records;
  the other kills existed nowhere, even though every one of them was identified. Experience totals
  looked correct the whole time because they come from the state delta rather than from attribution.

  An identified mob death is now reported whenever our side damaged it or a reward landed on it.
  Experience cannot decide this on its own — at max level a real kill pays nothing — so the tracker
  remembers which targets took our outgoing damage and clears each on death. A mob that died nearby
  without us touching it, and paid nothing, is someone else's kill and is still ignored: on a measured
  session that excluded 26 of 224 identified deaths, leaving 198.

  `FishNetConfirmedMobKill` gains `attributed`, false when no reward could be pinned to it, in which
  case its experience, coins and drops are zero and the reward continues to be reported on its own
  unmatched event — counted once, not split or duplicated. Kills whose mob was never identified still
  produce an `unmatched` event rather than a kill, since there is nothing to show.

  `MobRewardMobSummary` gains `attributedKills` alongside `kills`, so a consumer can show a true kill
  count without implying every kill's rewards are known. The read model stores both
  (`reward_kills.attributed`, `reward_mob_totals.attributed_kills`) and `REWARDS_DOMAIN_VERSION` moves
  to 3 so the cache rebuilds. Kill records logged before this change parse as `attributed: true`, which
  is what they were.

  Kills are correlated while capturing, so this only affects newly captured sessions; existing reward
  logs contain only the kills that were attributable at the time.

### Patch Changes

- 32c4896: Name enemies from their spawn packets, so the DPS enemy breakdown stops labelling them `Enemy <id>`.

  **The gap.** A monster's name was only ever learned from an activation record carrying
  `MOB_IDENTITY_PREFIX` — that is, from the monster _doing_ something. The death log labels the
  attacker, which by definition acted, so it showed names. The enemy breakdown labels the _target_,
  and `FishNetCombatDamageEvent` carries the attacker's identity but nothing about the target, so a
  monster killed before it cast anything was never named at all. Whole encounters of farmed mobs came
  out as `Enemy 90`, `Enemy 91`.

  The name was in the stream the whole time: the reward tracker resolves it from `objectSpawn` and
  `MonsterController` sync packets against the bundled mob catalog, keyed by the same object id that
  combat calls `targetId`.

  **Sharing the identification.** `FishNetMonsterDirectory` moves into the capture package, which both
  sides already depend on, along with `decodeMonsterSpawn` and `decodeMonsterSync`. It resolves a
  `mobId` and nothing else; naming stays with whoever owns a catalog. `FishNetMobDirectory` is now a
  thin naming layer over it and behaves as before.

  **Combat.** `FishNetCombatTracker` accepts an optional `monsterCatalog`, and when given one it
  tracks spawns and emits flat `monsterIdentity` lifecycle events. The catalog is injected rather than
  imported because rewards already depends on combat; `mobDefinitionsById()` from the rewards package
  is the intended argument. Emitting identity once per object avoids repeating the same catalog data
  on every damage and death record. Without the option the tracker behaves exactly as before.

  **Persisting it.** `EncounterAggregate` gains `enemyNames`, captured when the hit lands rather than
  looked up when the encounter is written. This matters twice over: the combat log carries identity
  events rather than raw spawn packets; and an open encounter's
  enemy rows are deleted and rewritten on every indexing pass, which previously let an eviction from
  the capped `mobIdentities` map replace an already-stored name with null. Resuming an open encounter
  now restores the stored names for the same reason.

  Enemies that are absent from the bundled catalog, or that spawned before capture started, still fall
  back to the activation-derived name and then to `Enemy <id>`. Because the name has to be recorded at
  capture time, existing logs and read models are unaffected — only newly captured sessions carry it.

- Updated dependencies [32c4896]
  - @kar-mi/spirit-vale-tools-capture@1.1.0
  - @kar-mi/spirit-vale-tools-combat@1.3.0

## 0.4.1

### Patch Changes

- 8e8eb1b: Drop the `node:readline` dependency from `loadRewardReplay`, which broke browser bundles.

  The package's bundle is a single entry point, so a Node builtin anywhere in it reaches every
  consumer. A browser build that imports this package only for its pure trend helpers
  (`buildCumulativeTrend`, `buildRateTrend`, `trendExtent`, `bigintRatio`) failed outright with
  "Browser build cannot import Node.js builtin: readline". `loadRewardReplay` now splits the stream
  with a `TextDecoder`, the same way the combat package's replay loader does, so nothing in the graph
  pulls a builtin. Behaviour, including CRLF handling, is unchanged.

## 0.4.0

### Minor Changes

- a4327d3: Add bounded live reward aggregation and SQLite-backed reward history APIs.

### Patch Changes

- Updated dependencies [a4327d3]
  - @kar-mi/spirit-vale-tools-sqlite@0.1.1

## 0.3.2

### Patch Changes

- Updated dependencies [029c050]
  - @kar-mi/spirit-vale-tools-logging@0.4.0
  - @kar-mi/spirit-vale-tools-combat@1.1.2

## 0.3.1

### Patch Changes

- Updated dependencies [94f4d2e]
  - @kar-mi/spirit-vale-tools-logging@0.3.0
  - @kar-mi/spirit-vale-tools-combat@1.1.1

## 0.3.0

### Minor Changes

- 9c98e1d: Track party-shared and other standalone XP gains independently of mob-death attribution. Unmatched experience events now preserve their base XP, job XP, and coin deltas; session totals and live aggregate callbacks include their XP while per-mob and coin summaries remain confirmed-kill-only.

## 0.2.0

### Minor Changes

- 6251f96: Add `XpAggregateTracker` for cross-session Character XP tracking: an in-memory, per-second-bucketed running total, rolling 60s/60min rates, and a trailing timeline for graphing, independent of the per-session `MobRewardSession` reset. `RewardLogFollower`/`RewardSessionLogFollower` gain an optional `onExperience(experience, recordedAtMs)` callback, using the kill's real recorded time rather than wall-clock consume time, so consumers can feed a tracker without it being cleared on session resets.

  Adds `restoreCheckpoint`/`currentCheckpoint` (an `XpAggregateCheckpoint` of `{ total, watermarkMs, watermarkOccurrences }`) so consumers can persist the running total to disk and resume it across app restarts. The watermark prevents a fresh log tail (e.g. after closing and reopening a window, which re-tails the current session's log from the start) from double-counting kills already reflected in the checkpoint, while `watermarkOccurrences` correctly disambiguates several kills sharing the same recorded millisecond (e.g. an AoE clearing multiple mobs at once) from a duplicate replay of the same kill.

  `xpPerSecond` is now an exponentially-weighted rate (a "leaky bucket", 20s time constant) instead of a flat rolling-window average. Kills are sparse, discrete events, so any flat window either reads 0 between kills (short) or barely moves per kill (long), and always cliff-drops the instant a kill ages past the window edge. EWMA blends each kill in immediately and lets it fade smoothly instead.

## 0.1.5

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0
  - @kar-mi/spirit-vale-tools-combat@1.0.0
  - @kar-mi/spirit-vale-tools-logging@0.2.3
  - @kar-mi/spirit-vale-tools-items@0.1.5

## 0.1.4

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2
  - @kar-mi/spirit-vale-tools-logging@0.2.2
  - @kar-mi/spirit-vale-tools-items@0.1.4
  - @kar-mi/spirit-vale-tools-combat@0.2.2

## 0.1.3

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-logging@0.2.1
  - @kar-mi/spirit-vale-tools-combat@0.2.1
  - @kar-mi/spirit-vale-tools-capture@0.2.1
  - @kar-mi/spirit-vale-tools-items@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-logging@0.2.0
  - @kar-mi/spirit-vale-tools-combat@0.2.0
  - @kar-mi/spirit-vale-tools-capture@0.2.0
  - @kar-mi/spirit-vale-tools-items@0.1.2

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
  - @kar-mi/spirit-vale-tools-logging@0.1.1
  - @kar-mi/spirit-vale-tools-items@0.1.1
  - @kar-mi/spirit-vale-tools-combat@0.1.1
