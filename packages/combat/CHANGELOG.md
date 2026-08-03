# @kar-mi/spirit-vale-tools-combat

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
