# @kar-mi/spirit-vale-tools-logging

## 0.10.0

### Minor Changes

- 705ebd8: Fully decode recovery and bond settings from the generated FishNet map, derive healing and barrier semantics from current game metadata, correlate AutoCast and Guardian Bond sources, emit attributed shield lifecycle events without crediting unknown healers as self-heals, and expose the local player's current shield amount.
  
  Fold shielding into the meters: an applied shield counts as healing done for the caster (HPS), and an absorbed shield is tracked as its own per-player quantity on the tanked meter — `absorbed` / `absorbedSkills` on the actor row, `totalAbsorbed` on the encounter — kept out of raw damage-taken totals and attributed to the incoming enemy skill it soaked. The tanked meter now also keeps a per-attacker breakdown of damage taken (`getEnemyBreakdown(…, "tanked")`). Combat history schema bumped to version 8 (`combat_actors.absorbed`, `meter` column on `combat_enemy_skills`).
  
  Separate FishNet generated data, exact mapping, decoding, schema, inference, and tracking code. Remove the empty semantic-map API and the unused `semanticMap` combat tracker option, and move recovery-style classification and its public type from capture to combat.

## 0.9.0

### Minor Changes

- 813bce6: Restore market search, stall tracking, event logs, live following, and capture
  replay with the current vending contracts. Add deterministic search-request and
  stall-status field layouts to the supported FishNet map, including explicit
  verified-prefix handling for late-attach search requests, and register the market
  log stream. The restored market API intentionally excludes the former SQLite
  history and indexed read-model interfaces. Market event logs omit seller account
  identifiers while retaining seller display names, and omit stall account and
  visual-snapshot and archetype data. Item compatibility fingerprints and payload
  schema versions are recorded once as market metadata instead of repeated on
  every listing.

## 0.8.0

### Minor Changes

- 1ce4722: Remove `"market"` from `LogStream`. The market package has been retired, and logging no longer accepts it as a stream value.

## 0.7.0

### Minor Changes

- 5f876dd: Restructure log storage from `sessions/<sessionId>/<stream>.jsonl` to `<stream>/<sessionId>.jsonl`, grouping logs by category instead of by session.

  - `session.json` is removed. Session metadata (`sessionId`, `producer`, `startedAt`, `schemaVersion`) now lives solely in the v2 header line each stream file already opens with.
  - `sessionDirectory`/`sessionStreamPath` are replaced by `streamCategoryDirectory`/`streamSessionPath`, with the stream argument now coming first.
  - `LogSessionMetadata` is removed. `LogSession` no longer has a `directory` field, since a session's files are no longer grouped under one directory.
  - `listLogSessions` now derives session metadata by reading each stream file's header directly, falling back to file mtime when a header is missing or unparseable.

  This is a breaking, clean-cut change with no migration path: logs written under the old layout are not discovered by the new code.

## 0.6.1

### Patch Changes

- de3c2b0: Recover live log followers when a current-stream pointer watcher misses a session rotation.

## 0.6.0

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

## 0.5.0

### Minor Changes

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

## 0.4.1

### Patch Changes

- f343310: Improve FishNet packet recovery across reauthentication and unresolved traffic, add observer status, summon, and full-heal combat handling, and make JSONL output paths reliable on Windows.

## 0.4.0

### Minor Changes

- 029c050: Let `JsonlTailReader` resume from a stored byte offset.

  New `startOffset` and `maxReadBytes` options, plus an `offset` getter and a
  `bytesRead` field on the read result. Together these let a caller persist its
  position, resume in a later process, and bound how much one read consumes.

  `offset` reports the position just past the last **complete** line, excluding any
  buffered partial line, so a persisted offset never lands mid-record. Resuming and
  `offset` both assume newline-delimited UTF-8, as written by this package's logger;
  byte-order-mark sniffing only applies to a reader starting at 0. Existing
  behaviour — truncation detection, partial-line buffering, decoder selection — is
  unchanged.

## 0.3.0

### Minor Changes

- 94f4d2e: Batch JSONL writes behind a bounded buffer.

  `JsonLinesLogger` now accumulates records into byte-bounded batches and appends them through one
  open file handle per stream instead of issuing an `appendFile` per record. New `batchBytes`,
  `flushIntervalMs`, and `maxBufferedBytes` options (on both `createLogSession` and the logger)
  control the buffering; `logger.flush()`, `session.flush()`, and `logger.stats()` are new.

  Ordering, sequence numbers, combat sanitization, `outputPaths` overrides, and pointer behaviour are
  unchanged. A write failure is still reported once and rethrown by `flush()`/`close()` while later
  batches keep being attempted. Records are dropped only when they would exceed `maxBufferedBytes`;
  each episode is reported once, counted in `stats().droppedRecords`, and the logger recovers once the
  queue drains. `activateLogSession` now flushes the session before switching pointers so followers
  see seeded records immediately.

## 0.2.4

### Patch Changes

- 977fd5f: Decode authoritative summon calibration snapshots into stack events and surface summon counts and skill-catalog sprites through active statuses, sanitized logs, and replay.

## 0.2.3

### Patch Changes

- 32cdaba: Classify build-specific health recovery as standard healing, passive regeneration, or drain healing. Attribute passive regeneration as self-healing and label drain recovery from visible local character traits while retaining a combined Siphon/Leech label for unknown or remote builds. Persist the optional recovery style in sanitized combat logs for replay compatibility.

## 0.2.2

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.

## 0.2.1

### Patch Changes

- 9ecf64b: add status effects

## 0.2.0

### Minor Changes

- d2d24da: add status effects

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
