# @kar-mi/spirit-vale-tools-logging

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
