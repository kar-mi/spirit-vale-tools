---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add `XpAggregateTracker` for cross-session Character XP tracking: an in-memory, per-second-bucketed running total, rolling 60s/60min rates, and a trailing timeline for graphing, independent of the per-session `MobRewardSession` reset. `RewardLogFollower`/`RewardSessionLogFollower` gain an optional `onExperience(experience, recordedAtMs)` callback, using the kill's real recorded time rather than wall-clock consume time, so consumers can feed a tracker without it being cleared on session resets. Adds `restoreCheckpoint`/`currentTotal`/`currentWatermarkMs` so consumers can checkpoint the running total (and a watermark) to disk and resume across app restarts — the watermark prevents re-tailing the current session's log from scratch (e.g. after closing and reopening a window) from double-counting kills already reflected in the checkpoint.

