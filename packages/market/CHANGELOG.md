# @kar-mi/spirit-vale-tools-market

## 1.1.1

### Patch Changes

- Updated dependencies [5f876dd]
  - @kar-mi/spirit-vale-tools-logging@0.7.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.4

## 1.1.0

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

## 1.0.1

### Patch Changes

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

- Updated dependencies [ed6a563]
  - @kar-mi/spirit-vale-tools-logging@0.5.0
  - @kar-mi/spirit-vale-tools-sqlite@0.1.2

## 1.0.0

### Major Changes

- e4a1451: Update capture decoding for the current Spirit Vale network protocol and build fingerprint. Bundle the complete regenerated RPC map, recover client-writer-only ServerRPC registrations, correct current prefab component layouts, add signed packed 64-bit decoding, and reject RPC matches whose known signatures do not consume the payload exactly.

  Migrate market decoding to the current JSON vending contracts and update persisted market stalls to use `stallId` and `slotId`. This removes the public `stallIndex` and `rotationY` fields, replaces the old binary vending DTO decoder, and bumps the market read-model schema.

### Patch Changes

- Updated dependencies [e4a1451]
  - @kar-mi/spirit-vale-tools-capture@1.3.0

## 0.2.0

### Minor Changes

- eca9381: Add revisioned SQLite market indexing, bounded metadata followers, and cursor-paged listing queries.

## 0.1.7

### Patch Changes

- Updated dependencies [029c050]
  - @kar-mi/spirit-vale-tools-logging@0.4.0

## 0.1.6

### Patch Changes

- Updated dependencies [94f4d2e]
  - @kar-mi/spirit-vale-tools-logging@0.3.0

## 0.1.5

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0
  - @kar-mi/spirit-vale-tools-logging@0.2.3
  - @kar-mi/spirit-vale-tools-items@0.1.5

## 0.1.4

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2
  - @kar-mi/spirit-vale-tools-logging@0.2.2
  - @kar-mi/spirit-vale-tools-items@0.1.4

## 0.1.3

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-logging@0.2.1
  - @kar-mi/spirit-vale-tools-capture@0.2.1
  - @kar-mi/spirit-vale-tools-items@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-logging@0.2.0
  - @kar-mi/spirit-vale-tools-capture@0.2.0
  - @kar-mi/spirit-vale-tools-items@0.1.2

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
  - @kar-mi/spirit-vale-tools-logging@0.1.1
  - @kar-mi/spirit-vale-tools-items@0.1.1
