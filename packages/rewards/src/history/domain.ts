import type { Database } from "bun:sqlite";
import type { ReadModelDomain } from "@kar-mi/spirit-vale-tools-sqlite";

export const REWARDS_DOMAIN_NAME = "rewards";
export const REWARDS_DOMAIN_VERSION = 4;

const SCHEMA = `
create table if not exists reward_kills (session_id text not null, kill_id text not null, sequence integer not null, recorded_at_ms integer not null, tick integer not null, mob_id text not null, display_name text not null, mob_level integer not null, mob_rank integer, boss integer not null, object_id integer not null, experience integer not null, job_experience integer not null, coins integer not null, attributed integer not null default 1, primary key(session_id, kill_id));
create index if not exists reward_kills_recent on reward_kills(session_id, sequence desc, kill_id desc);
create table if not exists reward_drops (session_id text not null, kill_id text not null, category text not null, item_id text not null, count integer not null, primary key(session_id, kill_id, category, item_id));
create table if not exists reward_mob_totals (session_id text not null, mob_id text not null, display_name text not null, mob_level integer not null, boss integer not null, kills integer not null, attributed_kills integer not null default 0, experience integer not null, job_experience integer not null, coins integer not null, primary key(session_id, mob_id));
create table if not exists reward_mob_drops (session_id text not null, mob_id text not null, category text not null, item_id text not null, count integer not null, primary key(session_id, mob_id, category, item_id));
create table if not exists reward_unmatched_events (session_id text not null, sequence integer not null, recorded_at_ms integer not null, reason text not null, reward text not null, experience integer not null, job_experience integer not null, coins integer not null, primary key(session_id, sequence));
create table if not exists reward_unmatched_drops (session_id text not null, sequence integer not null, category text not null, item_id text not null, count integer not null, primary key(session_id, sequence, category, item_id));
create table if not exists reward_unmatched_totals (session_id text primary key, unmatched integer not null, experience integer not null, job_experience integer not null, coins integer not null, ambiguous integer not null, expired integer not null, unidentified integer not null);
`;
export const REWARD_TABLES = ["reward_drops", "reward_mob_drops", "reward_kills", "reward_mob_totals", "reward_unmatched_drops", "reward_unmatched_events", "reward_unmatched_totals"] as const;

export function createRewardsDomain(): ReadModelDomain {
  return { name: REWARDS_DOMAIN_NAME, version: REWARDS_DOMAIN_VERSION, createSchema(database: Database) { database.exec(SCHEMA); }, dropSchema(database: Database) { for (const table of REWARD_TABLES) database.exec(`drop table if exists ${table}`); } };
}
