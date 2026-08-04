import type { ReadModelDomain } from "@kar-mi/spirit-vale-tools-sqlite";

export const MARKET_DOMAIN_NAME = "market";
export const MARKET_DOMAIN_VERSION = 2;

const SCHEMA = `
create table if not exists market_listings (
  session_id text not null, listing_key text not null, listing_id text, seller_id text, seller_name text,
  item_id text, item_type integer not null, count integer not null, count_traded integer not null,
  price integer not null, json text, expires_at integer not null, search_text text, display_name text,
  normalized_text text not null, primary key (session_id, listing_key)
);
create index if not exists market_listings_price on market_listings (session_id, price, listing_key);
create index if not exists market_listings_item on market_listings (session_id, item_type, item_id);
create index if not exists market_listings_seller on market_listings (session_id, seller_id);
create index if not exists market_listings_text on market_listings (session_id, normalized_text);

create table if not exists market_listing_stats (
  session_id text not null, listing_key text not null, stat_type integer not null, stat_name text,
  roll real not null, value real, percent integer not null, value_str text,
  primary key (session_id, listing_key, stat_type)
);
create index if not exists market_stats_filter on market_listing_stats (session_id, stat_type, value, listing_key);

create table if not exists market_stalls (
  session_id text not null, stall_id text not null, account_id text, character_id text, map_id text, slot_id text,
  expires_at integer not null, hired_at integer not null, shop_name text, character_name text, archetype integer not null,
  status integer not null, version integer not null, visual_snapshot_json text,
  normalized_text text not null, primary key (session_id, stall_id)
);
create index if not exists market_stalls_account on market_stalls (session_id, account_id);
create index if not exists market_stalls_text on market_stalls (session_id, normalized_text);

create table if not exists market_session_state (
  session_id text primary key, revision integer not null default 0, listing_count integer not null default 0,
  status text not null default 'watching', observed_at text, account_json text
);
`;

export const MARKET_TABLES = ["market_listing_stats", "market_listings", "market_stalls", "market_session_state"] as const;

export function createMarketDomain(): ReadModelDomain {
  return {
    name: MARKET_DOMAIN_NAME,
    version: MARKET_DOMAIN_VERSION,
    createSchema(database) { database.exec(SCHEMA); },
    dropSchema(database) { for (const table of MARKET_TABLES) database.exec(`drop table if exists ${table}`); },
  };
}
