---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add `XpAggregateTracker` for cross-session Character XP tracking: an in-memory, per-second-bucketed running total, rolling 60s/60min rates, and a trailing timeline for graphing, independent of the per-session `MobRewardSession` reset. `RewardLogFollower`/`RewardSessionLogFollower` gain an optional `onExperience` callback so consumers can feed a tracker without it being cleared on session resets. Adds `restoreTotal`/`currentTotal` so consumers can checkpoint the running total to disk and resume it across app restarts.

