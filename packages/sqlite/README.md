# @kar-mi/spirit-vale-tools-sqlite

Disposable SQLite read-model infrastructure for Spirit Vale session logs.

> **Internal package.** This package is published only because the domain
> packages depend on it at runtime; it is installed automatically alongside them
> and is not a supported public API.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-sqlite
```

## What it is

JSON Lines session logs stay the canonical record. This package maintains a
**cache** derived from them, by default at `<logDirectory>/cache/read-model.sqlite`.
The cache is never migrated: anything unusable is deleted and rebuilt from the
logs. Nothing here writes to, renames, or deletes a log file.

## Usage

A domain package owns its own tables and importer; this package owns the
database, its metadata, and how far each log has been indexed.

```ts
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";

const model = await openReadModel({
  logDirectory,
  domains: [{
    name: "example",
    version: 1,
    createSchema: (db) => db.exec("create table if not exists example_rows (sequence integer primary key)"),
    dropSchema: (db) => db.exec("drop table if exists example_rows"),
  }],
  onRebuild: (event) => console.error(`read model rebuilt: ${event.reason}`),
});

await model.indexStream({
  sessionId,
  stream: "combat",
  domain: "example",
  sourcePath,
  apply(records, db) {
    for (const record of records) {
      db.query("insert or replace into example_rows (sequence) values ($sequence)").run({ sequence: record.sequence });
    }
  },
  clear(scope, db) {
    db.query("delete from example_rows").run();
  },
});

model.close();
```

`indexStream` reads only what the log has gained since the recorded byte offset,
so it is cheap to call repeatedly and resumes across process restarts.

## Guarantees

- Rows and indexing progress commit in the same transaction, so an interrupted
  pass resumes exactly rather than double-counting.
- Each transaction covers at most `batchBytes` of source (1 MiB by default) and
  always ends on a record boundary.
- A truncated, replaced, or rewound log rebuilds that stream; a corrupt database
  or a changed infrastructure schema rebuilds the whole file; a changed domain
  `version` rebuilds only that domain.
- Use `model.bigintStatement(...)` for 64-bit values such as market prices and
  reward coins. A plain read rounds anything past `Number.MAX_SAFE_INTEGER`.
- Prefer `model.statement(...)` / `model.bigintStatement(...)` for your own reads.
  They are cached for the model's lifetime and finalized by `close()`. Statements
  prepared directly with `database.query()` or `database.prepare()` are not, and
  on Windows an outstanding one keeps the database file open after `close()`,
  which blocks deleting the cache directory.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
