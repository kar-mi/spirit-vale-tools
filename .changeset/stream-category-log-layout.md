---
"@kar-mi/spirit-vale-tools-logging": minor
---

Restructure log storage from `sessions/<sessionId>/<stream>.jsonl` to `<stream>/<sessionId>.jsonl`, grouping logs by category instead of by session.

- `session.json` is removed. Session metadata (`sessionId`, `producer`, `startedAt`, `schemaVersion`) now lives solely in the v2 header line each stream file already opens with.
- `sessionDirectory`/`sessionStreamPath` are replaced by `streamCategoryDirectory`/`streamSessionPath`, with the stream argument now coming first.
- `LogSessionMetadata` is removed. `LogSession` no longer has a `directory` field, since a session's files are no longer grouped under one directory.
- `listLogSessions` now derives session metadata by reading each stream file's header directly, falling back to file mtime when a header is missing or unparseable.

This is a breaking, clean-cut change with no migration path: logs written under the old layout are not discovered by the new code.
