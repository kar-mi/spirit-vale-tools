# @kar-mi/spirit-vale-tools-sqlite

## 0.1.0

### Minor Changes

- 029c050: Add the disposable SQLite read model.

  JSON Lines session logs remain canonical; this package maintains a cache derived
  from them at `<logDirectory>/cache/read-model.sqlite` and never writes to a log.

  `openReadModel` opens the database in WAL mode, owns the schema metadata, and
  repairs whatever is unusable: a corrupt file or a changed infrastructure schema
  recreates the database, and a changed domain `version` drops and re-indexes only
  that domain. Domain packages register their own `createSchema`/`dropSchema` and
  importers, so this package depends on no domain code.

  `indexStream` reads only what a log has gained since the recorded byte offset.
  Rows and progress commit in one transaction per batch, bounded by `batchBytes`
  and always ending on a record boundary, so an interrupted pass resumes exactly
  instead of double-counting. Truncation, replacement (detected by fingerprinting
  the log's first line), and sequence regression each rebuild that stream.

### Patch Changes

- Updated dependencies [029c050]
  - @kar-mi/spirit-vale-tools-logging@0.4.0
