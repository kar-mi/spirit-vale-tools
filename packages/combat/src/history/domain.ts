import type { Database } from "bun:sqlite";
import type { ReadModelDomain } from "@kar-mi/spirit-vale-tools-sqlite";

/** Bump whenever the tables below change; only combat is dropped and re-indexed. */
export const COMBAT_DOMAIN_VERSION = 6;
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

-- Reducer state scoped to the whole stream, not to one encounter: the actor identity map, the
-- monster names seen so far, and the death-log lookback buffer. All bounded. This is kept per
-- session because an incremental pass creates a fresh reducer each time and there is frequently no
-- encounter open at the boundary — between fights, and always before the first one.
create table if not exists combat_stream_state (
  session_id text not null primary key,
  identities_json text not null default '[]',
  mob_identities_json text not null default '[]',
  recent_hits_json text not null default '[]',
  -- Lines that were not a valid log record, accumulated across passes so the figure covers the whole
  -- stream rather than whichever slice the last incremental pass happened to read.
  invalid_lines integer not null default 0
);
create index if not exists combat_encounters_open on combat_encounters (session_id) where ended_at_ms is null;

-- One row set per meter: "dps" is outgoing party damage, "tanked" is incoming damage grouped by the
-- party member taking it, and "healing" is restored health grouped by the healer. All three share
-- these tables because they accumulate identically and render through the same code.
create table if not exists combat_actors (
  session_id text not null,
  encounter_id text not null,
  meter text not null default 'dps',
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
  -- The current-DPS rate estimator: its accumulated rate and the time that rate was last advanced
  -- to. Needed so a pass that resumes mid-encounter reports the same currentDps as one that never
  -- stopped. Two numbers, where a trailing window of recent hits used to be serialised here.
  ewma_rate real not null default 0,
  ewma_at_ms integer not null default 0,
  -- The decay constant the rate was accumulated with. Stored rather than assumed because the rate
  -- only means anything paired with it, so a reader rebuilds the estimator that produced the value.
  ewma_tau_seconds real not null default 2.5,
  primary key (session_id, encounter_id, meter, actor_index)
);

create table if not exists combat_skills (
  session_id text not null,
  encounter_id text not null,
  meter text not null default 'dps',
  actor_index integer not null,
  source_id text not null,
  source_label text not null,
  damage integer not null default 0,
  hits integer not null default 0,
  critical_hits integer not null default 0,
  primary key (session_id, encounter_id, meter, actor_index, source_id)
);

create table if not exists combat_targets (
  session_id text not null,
  encounter_id text not null,
  meter text not null default 'dps',
  actor_index integer not null,
  target_id integer not null,
  damage integer not null default 0,
  primary key (session_id, encounter_id, meter, actor_index, target_id)
);

create table if not exists combat_timeline_buckets (
  session_id text not null,
  encounter_id text not null,
  meter text not null default 'dps',
  actor_index integer not null,
  -- "encounter" buckets start at the encounter; "actor" buckets start at that actor's first damage,
  -- which is the alignment the personal row uses.
  origin text not null,
  origin_ms integer not null,
  width_ms integer not null,
  bucket_index integer not null,
  damage integer not null default 0,
  primary key (session_id, encounter_id, meter, actor_index, origin, bucket_index)
);

-- Per attacker, per enemy, per skill. Counts every positive hit, so it includes incoming damage the
-- DPS tables exclude.
create table if not exists combat_enemy_skills (
  session_id text not null,
  encounter_id text not null,
  attacker_actor_id integer not null,
  target_id integer not null,
  source_id text not null,
  source_label text not null,
  damage integer not null default 0,
  hits integer not null default 0,
  critical_hits integer not null default 0,
  primary key (session_id, encounter_id, attacker_actor_id, target_id, source_id)
);

create table if not exists combat_enemies (
  session_id text not null,
  encounter_id text not null,
  target_id integer not null,
  display_name text,
  first_seen_at_ms integer not null,
  primary key (session_id, encounter_id, target_id)
);

create table if not exists combat_deaths (
  session_id text not null,
  encounter_id text not null,
  death_index integer not null,
  victim_name text not null,
  target_id integer not null,
  died_at_ms integer not null,
  total_damage integer not null default 0,
  primary key (session_id, encounter_id, death_index)
);
create index if not exists combat_deaths_by_time on combat_deaths (session_id, died_at_ms, death_index);

create table if not exists combat_death_hits (
  session_id text not null,
  encounter_id text not null,
  death_index integer not null,
  hit_index integer not null,
  before_death_ms integer not null,
  attacker_actor_id integer not null,
  attacker_label text not null,
  attacker_is_monster integer not null default 0,
  source_label text not null,
  damage integer not null default 0,
  critical integer not null default 0,
  primary key (session_id, encounter_id, death_index, hit_index)
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
        "combat_stream_state",
        "combat_death_hits",
        "combat_deaths",
        "combat_enemies",
        "combat_enemy_skills",
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
