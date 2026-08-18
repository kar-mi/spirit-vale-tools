# @kar-mi/spirit-vale-tools-combat

## 3.0.0

### Major Changes

- eb8aa93: Attribute per-enemy damage to stable rendered actor rows instead of reusable network actor IDs, and give every unidentified player its own row.

  Actor rows now carry a stable `rowId` (`name:` / `uid:` / `owner:` / `actor:`) and enemy breakdowns expose `attackerRowId`, so a reused actor ID can no longer assign one hit to two different players. The history schema stores outgoing enemy skills by actor lifetime rather than by actor ID.

  Unidentified players are no longer folded into a single aggregate "Unidentified" row. Each keeps its own row, labelled `Unidentified (<actorId>)` and keyed by its own `rowId`, so their damage stays separable until an identity arrives. `unidentifiedActorIds` still lists every actor ID across those rows.

  Also fixes the enemy breakdown silently dropping a still-anonymous attacker from an open encounter — the picker listed the mob while its skills table came back empty.

## 2.2.6

### Patch Changes

- a53c36a: Count `PlayerClone` as a player-owned prefab again. A clone is a second network object under its owner's connection and deals damage under its own `AttackerId`, so excluding it in 2.2.5 stranded that damage on an anonymous actor instead of crediting the owner. Including it does not split a player into two meter rows: the actor directory propagates one identity across every object of an owner, and the meter folds those aggregates back together by display name.

## 2.2.5

### Patch Changes

- 4484e48: Update the bundled game build to `ae23cb62`. RPC behaviours, broadcasts and SyncTypes are unchanged from the previous build; the spawnable-prefab table was reassigned, moving the player clone to prefab 1, `SkillInstance` to 2 and leaving the real player on 4. Prefab definitions now carry `prefabName`, which is the only thing separating the identically shaped `Player` and `PlayerClone` layouts. Combat's actor directory derives its player prefab from the bundled map instead of a hardcoded ID that had gone stale two builds ago, so spawns without RPC-link registrations name players again and mirrored clones are no longer counted as actors.
- Updated dependencies [4484e48]
  - @kar-mi/spirit-vale-tools-capture@1.5.0

## 2.2.4

### Patch Changes

- f33abc8: Attribute negative `ApplyDamage_C` values to their healer directly in the healing meter.

## 2.2.3

### Patch Changes

- Updated dependencies [1ce4722]
  - @kar-mi/spirit-vale-tools-logging@0.8.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.5

## 2.2.2

### Patch Changes

- Updated dependencies [5f876dd]
  - @kar-mi/spirit-vale-tools-logging@0.7.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.4

## 2.2.1

### Patch Changes

- b95c188: Add fallback-only curated boss identities, scoped to FishNet object lifetimes, and expose unresolved actor IDs in combat snapshots.

## 2.2.0

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
  - @kar-mi/spirit-vale-tools-sqlite@0.1.3

## 2.1.0

### Minor Changes

- ed6a563: Cut the CPU cost of keeping a live combat log indexed.

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

### Patch Changes

- Updated dependencies [ed6a563]
  - @kar-mi/spirit-vale-tools-logging@0.5.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.2

## 2.0.0

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
  - @kar-mi/spirit-vale-tools-metrics@0.2.0

## 1.5.1

### Patch Changes

- 9014a90: Stop toggles and auras blinking out between server refreshes. A status the catalog gives no duration
  is kept alive by the server re-stating it with one second left every ~0.2-0.7s, and that second was
  taken as the whole expiry budget. Consumers judge it against a clock that extrapolates between
  polls, so a late refresh plus the clock's lead overran the budget and the status lapsed and came
  back. The keep-alive window now carries a second of headroom; nothing publishes this value for such
  a status, so the only visible effect is that an aura that genuinely lapsed clears a second later.

## 1.5.0

### Minor Changes

- 9c65618: Catch reflected player deaths in the death log and the damage-taken meter. A boss spell reflect
  sends the caster's own hit back at them, so it arrives on the party's team and attributed to the
  victim themselves; both reducers read that as outgoing party damage and discarded it. Adds
  `replayCombatCapture` / `decodeCombatCaptureJsonLines`, which re-run a raw packet capture through
  the combat trackers offline.

## 1.4.2

### Patch Changes

- 3ad612f: Recognize player identities embedded in current-build spawns when FishNet omits RPC-link registrations, and recover exact ambiguous status-display and health-recovery payloads.

## 1.4.1

### Patch Changes

- 99df064: Stabilize status timers across observer-feed refreshes.

  Timed statuses now retain their established expiry when refreshed values differ only because of server rounding, while still accepting genuine countdown progress and reapplications. Untimed toggles and auras keep their internal expiry refreshed so they remain visible while active, but no longer publish a misleading countdown. Skill activations also refresh ordinary self-granted buffs without altering summon stacks.

## 1.4.0

### Minor Changes

- f343310: Improve FishNet packet recovery across reauthentication and unresolved traffic, add observer status, summon, and full-heal combat handling, and make JSONL output paths reliable on Windows.

### Patch Changes

- Updated dependencies [f343310]
  - @kar-mi/spirit-vale-tools-capture@1.2.0
  - @kar-mi/spirit-vale-tools-logging@0.4.1

## 1.3.0

### Minor Changes

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

### Patch Changes

- Updated dependencies [32c4896]
  - @kar-mi/spirit-vale-tools-capture@1.1.0

## 1.2.5

### Patch Changes

- 001b3b4: Bound the reducer's session-scoped state and stop crediting expired encounters.

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

## 1.2.4

### Patch Changes

- fce9751: Keep identities, monster names and the death lookback across incremental indexing passes.

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

## 1.2.3

### Patch Changes

- 3f2b303: Index the tanked and healing meters alongside damage, so past analysis reads all three from the read
  model instead of replaying the log once per meter.

  `combat_actors`, `combat_skills`, `combat_targets` and `combat_timeline_buckets` gain a `meter`
  column (`dps` | `tanked` | `healing`) and carry it in their primary keys; `indexCombatStream` drives
  two `MeterReducer`s from the same pass, following the damage reducer's encounter boundaries.
  `CombatHistoryStore.getEncounter` takes a `meter` option and renders any of the three in the same
  shape. `COMBAT_DOMAIN_VERSION` moves to 3, so an existing cache drops and re-indexes the combat
  domain on open — the JSON Lines logs stay canonical and untouched.

  Three fixes fall out of this. The player death log was empty on real logs: a death event carries no
  damage of its own — the lethal blow is a separate damage event — and `recordEncounterHit` returned
  early on any hit that was not a positive one, before reaching the death-log branch. The enemy
  breakdown still counts only positive hits; deaths are now recorded regardless.
  A resumed pass now restores the reducer's actor identity map, persisted
  on the open encounter row as `identities_json`: without it, healing attribution and mob-target
  detection silently degraded for events indexed after a resume, since both consult that map.
  `loadOpenEncounter` also reads through the model's statement cache rather than `database.query`, so
  `close()` finalizes those statements — a long-lived model that re-indexes a live session resumes on
  every pass, and statements left in Bun's own cache keep the database file open on Windows.

## 1.2.2

### Patch Changes

- 1a501a1: Index the tanked and healing meters alongside damage, so past analysis reads all three from the read
  model instead of replaying the log once per meter.

  `combat_actors`, `combat_skills`, `combat_targets` and `combat_timeline_buckets` gain a `meter`
  column (`dps` | `tanked` | `healing`) and carry it in their primary keys; `indexCombatStream` drives
  two `MeterReducer`s from the same pass, following the damage reducer's encounter boundaries.
  `CombatHistoryStore.getEncounter` takes a `meter` option and renders any of the three in the same
  shape. `COMBAT_DOMAIN_VERSION` moves to 3, so an existing cache drops and re-indexes the combat
  domain on open — the JSON Lines logs stay canonical and untouched.

  Two fixes fall out of this. A resumed pass now restores the reducer's actor identity map, persisted
  on the open encounter row as `identities_json`: without it, healing attribution and mob-target
  detection silently degraded for events indexed after a resume, since both consult that map.
  `loadOpenEncounter` also reads through the model's statement cache rather than `database.query`, so
  `close()` finalizes those statements — a long-lived model that re-indexes a live session resumes on
  every pass, and statements left in Bun's own cache keep the database file open on Windows.

## 1.2.1

### Patch Changes

- f95e0e3: Expand live combat tanked and healing meters with detailed encounter snapshots and personal-player resolution.

## 1.2.0

### Minor Changes

- 4a75d8f: Add the combat read model: incremental reducers and a queryable history store.

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

## 1.1.2

### Patch Changes

- Updated dependencies [029c050]
  - @kar-mi/spirit-vale-tools-logging@0.4.0

## 1.1.1

### Patch Changes

- Updated dependencies [94f4d2e]
  - @kar-mi/spirit-vale-tools-logging@0.3.0

## 1.1.0

### Minor Changes

- 977fd5f: Decode authoritative summon calibration snapshots into stack events and surface summon counts and skill-catalog sprites through active statuses, sanitized logs, and replay.

### Patch Changes

- Updated dependencies [977fd5f]
  - @kar-mi/spirit-vale-tools-logging@0.2.4
  - @kar-mi/spirit-vale-tools-skills@0.2.0

## 1.0.2

### Patch Changes

- 13ca9ae: Correct level-scaled status durations, treat Fury as a toggle, and refresh active ready-status timers when any cataloged granting skill activates again.
- Updated dependencies [13ca9ae]
  - @kar-mi/spirit-vale-tools-statuses@0.2.2

## 1.0.1

### Patch Changes

- ff00636: Group identified DPS actors by trimmed, case-insensitive player name before falling back to transport identity fields.

## 1.0.0

### Major Changes

- 32cdaba: Remove support for the legacy game build. The capture package no longer exports
  `LEGACY_GAME_BUILD_FINGERPRINT`, and bundled RPC and semantic-map loaders now
  accept only the current game build. The combat tracker likewise no longer loads
  legacy semantic labels when given the retired build fingerprint.

### Minor Changes

- 32cdaba: Classify build-specific health recovery as standard healing, passive regeneration, or drain healing. Attribute passive regeneration as self-healing and label drain recovery from visible local character traits while retaining a combined Siphon/Leech label for unknown or remote builds. Persist the optional recovery style in sanitized combat logs for replay compatibility.

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0
  - @kar-mi/spirit-vale-tools-logging@0.2.3
  - @kar-mi/spirit-vale-tools-skills@0.1.5
  - @kar-mi/spirit-vale-tools-statuses@0.2.1

## 0.2.7

### Patch Changes

- bee121d: Fix toggle-style statuses (e.g. `Vitality`, or any status with no duration data) getting stuck active forever when their `RemoveEffect_T` packet is dropped. `FishNetStatusTracker` now clears an actor's active statuses when the actor despawns (`actorIdentity` `remove`), dies (`Death_C`), or the connection resets (zone transition/relog) - instead of relying solely on an explicit remove event, or (for zone transitions) blindly carrying stale statuses forward to the new actorId. Zone transitions reliably re-send `ApplyEffect_T` for whatever's genuinely still active shortly after loading, so clearing on reset and trusting that resync is both safe and closes the gap where a status that had actually already ended kept surviving every subsequent map change.

## 0.2.6

### Patch Changes

- 86aefa5: Decode `HealthComponent.Recover_C` and expose it from `FishNetCombatTracker` as a new `FishNetCombatHealEvent` (`kind: "heal"`). Healer attribution is best-effort, since the RPC carries no healer id: single matching healing-skill cast targeting the recipient resolves to `attribution: "exact"`/`"inferred"`, overlapping candidates resolve to `"ambiguous"`, and no match resolves to `"unattributed"` (still reports the healed target and amount). `parseDpsLogRecord` now recognizes `kind: "heal"` records from persisted logs.

  Also attribute heals that land via the `Regeneration` status (`Sanctuary`, `GuardianBond`, `SanctuaryField`, `HealAll` — per `Regeneration`'s effect list in the statuses catalog) instead of an immediate `Recover_C`: the caster is resolved once when `StatusComponent.ApplyEffect_T` grants the status (correlated against a recent matching cast, same ambiguity rules as direct heals) and reused for every `Recover_C` tick on that target until `RemoveEffect_T` clears it.

- Updated dependencies [86aefa5]
  - @kar-mi/spirit-vale-tools-capture@0.2.3

## 0.2.5

### Patch Changes

- 4896919: Fix `FishNetStatusTracker` dropping still-active statuses (e.g. Haste) from `getActiveStatusesForName` after a zone transition or relog. An `actorIdentity` reset reassigns the local player a new `actorId` and clears the name lookup to avoid misattributing a recycled `actorId` to the wrong character, but previously the still-tracked buffs/debuffs under the old `actorId` were never reconciled, so they silently vanished from consumers like the overlay even though the buff was still running in-game. `consumeIdentity` now remembers the last known `actorId` per `uid` across resets and migrates that `actorId`'s active statuses onto the new one as soon as the same `uid` re-upserts, closing the gap. Other actors' identity events don't carry a `uid`, so this only applies to the local player and doesn't change recycled-`actorId` behavior for anyone else.

## 0.2.4

### Patch Changes

- Updated dependencies [7b7db55]
  - @kar-mi/spirit-vale-tools-statuses@0.2.0

## 0.2.3

### Patch Changes

- e7fb4ee: Shorten the default rolling "current DPS" window from 15 seconds to 5 seconds, making the displayed value more responsive to recent damage.

## 0.2.2

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2
  - @kar-mi/spirit-vale-tools-logging@0.2.2
  - @kar-mi/spirit-vale-tools-skills@0.1.4
  - @kar-mi/spirit-vale-tools-statuses@0.1.3

## 0.2.1

### Patch Changes

- 9ecf64b: add status effects
- Updated dependencies [9ecf64b]
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-logging@0.2.1
  - @kar-mi/spirit-vale-tools-capture@0.2.1
  - @kar-mi/spirit-vale-tools-statuses@0.1.2
  - @kar-mi/spirit-vale-tools-skills@0.1.3

## 0.2.0

### Minor Changes

- d2d24da: add status effects

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-logging@0.2.0
  - @kar-mi/spirit-vale-tools-capture@0.2.0
  - @kar-mi/spirit-vale-tools-skills@0.1.2
  - @kar-mi/spirit-vale-tools-statuses@0.1.1

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
  - @kar-mi/spirit-vale-tools-logging@0.1.1
  - @kar-mi/spirit-vale-tools-skills@0.1.1
