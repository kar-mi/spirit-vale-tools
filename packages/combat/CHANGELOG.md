# @kar-mi/spirit-vale-tools-combat

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
