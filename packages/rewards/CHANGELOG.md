# @kar-mi/spirit-vale-tools-rewards

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
