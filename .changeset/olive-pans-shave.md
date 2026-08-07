---
"@kar-mi/spirit-vale-tools-logging": minor
"@kar-mi/spirit-vale-tools-combat": minor
"@kar-mi/spirit-vale-tools-market": patch
"@kar-mi/spirit-vale-tools-rewards": patch
"@kar-mi/spirit-vale-tools-sqlite": patch
---

Shrink log records by 36% by writing only what varies per record.

Every v1 line repeated the full envelope. Measured over 130 real combat logs, `sessionId`, `source`
and `schemaVersion` were 28.2% of the bytes on disk while being byte-identical on every line — and
all three were already recorded in `session.json`. `recordedAt` spent a 24-byte ISO string on a
value every reader immediately parsed back to a number.

v2 writes `{"seq":3,"at":1754526750719,"type":"combat.event","data":{…}}`, preceded once per stream
file by a header line carrying the session id, producer and start time. Re-encoding the 1,088,293
records currently on disk measured **330.3MB → 211.9MB (35.8% smaller, 318 → 204 bytes/record)**.

- `type` is kept. It is *not* recoverable from `data`: 743,106 of those records carry no `data.kind`
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
