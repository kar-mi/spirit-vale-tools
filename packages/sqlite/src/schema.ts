import type { Database } from "bun:sqlite";

/**
 * Version of the infrastructure's own tables. Bump only when the tables below change; a mismatch
 * discards the entire cache, including every domain's tables.
 */
export const READ_MODEL_SCHEMA_VERSION = 1;

const METADATA_SCHEMA = `
create table if not exists read_model_metadata (
  id integer primary key check (id = 1),
  schema_version integer not null,
  created_at text not null,
  last_rebuild_at text
);

create table if not exists read_model_domains (
  domain text primary key,
  version integer not null
);

create table if not exists indexed_streams (
  session_id text not null,
  stream text not null,
  domain text not null,
  source_path text not null,
  source_fingerprint text not null,
  byte_offset integer not null,
  last_sequence integer not null,
  source_size integer not null,
  source_modified_at text not null,
  indexed_at text not null,
  primary key (session_id, stream, domain)
);

create index if not exists indexed_streams_by_domain on indexed_streams (domain);
`;

export function createMetadataSchema(database: Database): void {
  database.exec(METADATA_SCHEMA);
}

export interface ReadModelMetadataRow {
  schema_version: number;
  created_at: string;
  last_rebuild_at: string | null;
}

export function readMetadata(database: Database): ReadModelMetadataRow | undefined {
  return database
    .query<ReadModelMetadataRow, []>("select schema_version, created_at, last_rebuild_at from read_model_metadata where id = 1")
    .get() ?? undefined;
}

export function writeMetadata(database: Database, createdAt: string): void {
  database
    .query("insert or replace into read_model_metadata (id, schema_version, created_at, last_rebuild_at) values (1, $version, $createdAt, null)")
    .run({ version: READ_MODEL_SCHEMA_VERSION, createdAt });
}

export function markRebuilt(database: Database, at: string): void {
  database.query("update read_model_metadata set last_rebuild_at = $at where id = 1").run({ at });
}

export interface IndexedStreamRow {
  session_id: string;
  stream: string;
  domain: string;
  source_path: string;
  source_fingerprint: string;
  byte_offset: number;
  last_sequence: number;
  source_size: number;
  source_modified_at: string;
  indexed_at: string;
}
