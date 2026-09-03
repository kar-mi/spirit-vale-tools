---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add an `onGain` callback to `LiveRewardLogFollower` / `LiveRewardSessionLogFollower`. It fires once
per confirmed kill and per unmatched-experience event with
`{ experience, jobExperience, coins, recordedAtMs }`, using the log's own recorded time, so a
consumer can drive an external rate tracker without re-reading the stream. New exported types:
`LiveRewardLogFollowerOptions`, `LiveRewardGain`.
