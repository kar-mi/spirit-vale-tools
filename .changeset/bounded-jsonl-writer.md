---
"@kar-mi/spirit-vale-tools-logging": minor
---

Batch JSONL writes behind a bounded buffer.

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
