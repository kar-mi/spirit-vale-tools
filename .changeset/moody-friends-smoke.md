---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add `XpAggregateTracker` for cross-session Character XP tracking: an in-memory, per-second-bucketed running total, rolling 60s/60min rates, and a trailing timeline for graphing, independent of the per-session `MobRewardSession` reset. `RewardLogFollower`/`RewardSessionLogFollower` gain an optional `onExperience(experience, recordedAtMs)` callback, using the kill's real recorded time rather than wall-clock consume time, so consumers can feed a tracker without it being cleared on session resets.

Adds `restoreCheckpoint`/`currentCheckpoint` (an `XpAggregateCheckpoint` of `{ total, watermarkMs, watermarkOccurrences }`) so consumers can persist the running total to disk and resume it across app restarts. The watermark prevents a fresh log tail (e.g. after closing and reopening a window, which re-tails the current session's log from the start) from double-counting kills already reflected in the checkpoint, while `watermarkOccurrences` correctly disambiguates several kills sharing the same recorded millisecond (e.g. an AoE clearing multiple mobs at once) from a duplicate replay of the same kill.

`xpPerSecond` is now an exponentially-weighted rate (a "leaky bucket", 20s time constant) instead of a flat rolling-window average. Kills are sparse, discrete events, so any flat window either reads 0 between kills (short) or barely moves per kill (long), and always cliff-drops the instant a kill ages past the window edge. EWMA blends each kill in immediately and lets it fade smoothly instead.

