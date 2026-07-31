---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add `XpAggregateTracker` for cross-session Character XP tracking: an in-memory, per-second-bucketed running total, rolling 60s/60min rates, and a trailing timeline for graphing, independent of the per-session `MobRewardSession` reset. `RewardLogFollower`/`RewardSessionLogFollower` gain an optional `onExperience(experience, recordedAtMs)` callback, using the kill's real recorded time rather than wall-clock consume time, so consumers can feed a tracker without it being cleared on session resets.

Adds `restoreCheckpoint`/`currentCheckpoint` (an `XpAggregateCheckpoint` of `{ total, watermarkMs, watermarkOccurrences }`) so consumers can persist the running total to disk and resume it across app restarts. The watermark prevents a fresh log tail (e.g. after closing and reopening a window, which re-tails the current session's log from the start) from double-counting kills already reflected in the checkpoint, while `watermarkOccurrences` correctly disambiguates several kills sharing the same recorded millisecond (e.g. an AoE clearing multiple mobs at once) from a duplicate replay of the same kill.

The `xpPerSecond` rolling window is now 10s (was 60s) — kills are sparse, discrete events, so a full minute of averaging made a single kill barely move the number.

