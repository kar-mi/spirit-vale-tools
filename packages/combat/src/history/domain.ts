import type { Database } from "bun:sqlite";
import type { ReadModelDomain } from "@kar-mi/spirit-vale-tools-sqlite";

/** Bump whenever the tables below change; only combat is dropped and re-indexed. */
export const COMBAT_DOMAIN_VERSION = 1;
export const COMBAT_DOMAIN_NAME = "combat";

const SCHEMA = `
create table if not exists combat_encounters (
  session_id text not null,
  encounter_id text not null,
  started_at_ms integer not null,
  last_damage_at_ms integer not null,
  ended_at_ms integer,
  total_damage integer not null default 0,
  primary key (session_id, encounter_id)
);
create index if not exists combat_encounters_by_start on combat_encounters (session_id, started_at_ms, encounter_id);
create index if not exists combat_encounters_open on combat_encounters (session_id) where ended_at_ms is null;

create table if not exists combat_actors (
  session_id text not null,
  encounter_id text not null,
  -- Position within the encounter's actor list. An actor id can appear more than once when an
  -- identity is removed and the id is reused, and those aggregates must stay distinct.
  actor_index integer not null,
  actor_id integer not null,
  -- Whether this aggregate is the one further events for actor_id accumulate into.
  active_slot integer not null default 0,
  display_name text,
  archetype integer,
  owner_connection_id integer,
  uid text,
  active_identity integer not null default 0,
  damage integer not null default 0,
  first_damage_at_ms integer,
  last_damage_at_ms integer,
  hits integer not null default 0,
  critical_hits integer not null default 0,
  kills integer not null default 0,
  -- The trailing current-DPS window as JSON. Bounded by time (a few seconds of hits), and needed so
  -- a pass that resumes mid-encounter reports the same currentDps as one that never stopped.
  window_json text not null default '[]',
  primary key (session_id, encounter_id, actor_index)
);

create table if not exists combat_skills (
  session_id text not null,
  encounter_id text not null,
  actor_index integer not null,
  source_id text not null,
  source_label text not null,
  damage integer not null default 0,
  hits integer not null default 0,
  critical_hits integer not null default 0,
  primary key (session_id, encounter_id, actor_index, source_id)
);

create table if not exists combat_targets (
  session_id text not null,
  encounter_id text not null,
  actor_index integer not null,
  target_id integer not null,
  damage integer not null default 0,
  primary key (session_id, encounter_id, actor_index, target_id)
);

create table if not exists combat_timeline_buckets (
  session_id text not null,
  encounter_id text not null,
  actor_index integer not null,
  -- "encounter" buckets start at the encounter; "actor" buckets start at that actor's first damage,
  -- which is the alignment the personal row uses.
  origin text not null,
  origin_ms integer not null,
  width_ms integer not null,
  bucket_index integer not null,
  damage integer not null default 0,
  primary key (session_id, encounter_id, actor_index, origin, bucket_index)
);
`;

export function createCombatDomain(): ReadModelDomain {
  return {
    name: COMBAT_DOMAIN_NAME,
    version: COMBAT_DOMAIN_VERSION,
    createSchema(database: Database) {
      database.exec(SCHEMA);
    },
    dropSchema(database: Database) {
      for (const table of [
        "combat_timeline_buckets",
        "combat_targets",
        "combat_skills",
        "combat_actors",
        "combat_encounters",
      ]) {
        database.exec(`drop table if exists ${table}`);
      }
    },
  };
}
