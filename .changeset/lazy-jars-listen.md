---
"@kar-mi/spirit-vale-tools-logging": minor
"@kar-mi/spirit-vale-tools-combat": minor
"@kar-mi/spirit-vale-tools-market": minor
"@kar-mi/spirit-vale-tools-rewards": minor
---

Follow live logs by watching them instead of polling them.

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
