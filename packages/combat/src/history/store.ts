import type { Database } from "bun:sqlite";
import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";

import type { FishNetDpsEncounterSnapshot } from "../dps-meter.ts";
import { createActor } from "../reducers/damage.ts";
import type { ActorAggregate, EncounterAggregate } from "../reducers/damage.ts";
import { renderEncounter } from "../reducers/rows.ts";
import type { RenderOptions } from "../reducers/rows.ts";

export interface Page<T> {
  items: T[];
  nextCursor?: string;
}

export interface CombatEncounterSummary {
  sessionId: string;
  encounterId: string;
  startedAtMs: number;
  lastDamageAtMs: number;
  endedAtMs?: number;
  durationMs: number;
  totalDamage: number;
}

export interface ListEncountersQuery {
  sessionId: string;
  cursor?: string;
  limit?: number;
}

const DEFAULT_LIMIT = 50;

/**
 * Paged reads over the indexed combat history.
 *
 * Encounters are loaded one at a time; nothing here materialises a whole session.
 */
export class CombatHistoryStore {
  constructor(private readonly model: ReadModel) {}

  listEncounters(query: ListEncountersQuery): Page<CombatEncounterSummary> {
    const limit = Math.max(1, query.limit ?? DEFAULT_LIMIT);
    const cursor = decodeCursor(query.cursor);
    // Keyset pagination on (started_at_ms, encounter_id): a live session appending encounters
    // cannot shift rows between pages the way an offset would.
    const rows = cursor
      ? this.model.database
        .query<EncounterRow, [string, number, number, string, number]>(
          `select * from combat_encounters
           where session_id = ? and (started_at_ms > ? or (started_at_ms = ? and encounter_id > ?))
           order by started_at_ms, encounter_id limit ?`,
        )
        .all(query.sessionId, cursor.startedAtMs, cursor.startedAtMs, cursor.encounterId, limit + 1)
      : this.model.database
        .query<EncounterRow, [string, number]>(
          "select * from combat_encounters where session_id = ? order by started_at_ms, encounter_id limit ?",
        )
        .all(query.sessionId, limit + 1);

    const page = rows.slice(0, limit);
    const last = page.at(-1);
    return {
      items: page.map((row) => summary(query.sessionId, row)),
      ...(rows.length > limit && last
        ? { nextCursor: encodeCursor({ startedAtMs: last.started_at_ms, encounterId: last.encounter_id }) }
        : {}),
    };
  }

  /** Renders one encounter in the same shape the legacy meter produces. */
  getEncounter(
    sessionId: string,
    encounterId: string,
    options: RenderOptions = {},
  ): FishNetDpsEncounterSnapshot | undefined {
    const encounter = this.loadEncounter(sessionId, encounterId);
    if (!encounter) return undefined;
    return renderEncounter(encounter, { nowMs: encounter.lastDamageAtMs, ...options });
  }

  private loadEncounter(sessionId: string, encounterId: string): EncounterAggregate | undefined {
    const database = this.model.database;
    const row = database
      .query<EncounterRow, [string, string]>(
        "select * from combat_encounters where session_id = ? and encounter_id = ?",
      )
      .get(sessionId, encounterId);
    if (!row) return undefined;

    const encounter: EncounterAggregate = {
      id: row.encounter_id,
      startedAtMs: row.started_at_ms,
      lastDamageAtMs: row.last_damage_at_ms,
      ...(row.ended_at_ms === null ? {} : { endedAtMs: row.ended_at_ms }),
      actors: [],
      activeActors: new Map(),
    };

    for (const actorRow of database
      .query<ActorRow, [string, string]>(
        "select * from combat_actors where session_id = ? and encounter_id = ? order by actor_index",
      )
      .all(sessionId, encounterId)) {
      encounter.actors.push(hydrateActor(database, sessionId, encounterId, actorRow, encounter.startedAtMs));
    }
    return encounter;
  }
}

interface EncounterRow {
  session_id: string;
  encounter_id: string;
  started_at_ms: number;
  last_damage_at_ms: number;
  ended_at_ms: number | null;
  total_damage: number;
}

interface ActorRow {
  actor_index: number;
  actor_id: number;
  active_slot: number;
  display_name: string | null;
  archetype: number | null;
  owner_connection_id: number | null;
  uid: string | null;
  active_identity: number;
  damage: number;
  first_damage_at_ms: number | null;
  last_damage_at_ms: number | null;
  hits: number;
  critical_hits: number;
  kills: number;
  window_json: string;
}

function hydrateActor(
  database: Database,
  sessionId: string,
  encounterId: string,
  row: ActorRow,
  encounterStartedAtMs: number,
): ActorAggregate {
  const actor = createActor(row.actor_id, encounterStartedAtMs);
  if (row.display_name !== null) actor.displayName = row.display_name;
  if (row.archetype !== null) actor.archetype = row.archetype;
  if (row.owner_connection_id !== null) actor.ownerConnectionId = row.owner_connection_id;
  if (row.uid !== null) actor.uid = row.uid;
  actor.activeIdentity = row.active_identity === 1;
  actor.damage = row.damage;
  if (row.first_damage_at_ms !== null) actor.firstDamageAtMs = row.first_damage_at_ms;
  if (row.last_damage_at_ms !== null) actor.lastDamageAtMs = row.last_damage_at_ms;
  actor.hits = row.hits;
  actor.criticalHits = row.critical_hits;
  actor.kills = row.kills;
  actor.window = JSON.parse(row.window_json) as ActorAggregate["window"];

  for (const skill of database
    .query<{ source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }, [string, string, number]>(
      "select source_id, source_label, damage, hits, critical_hits from combat_skills where session_id = ? and encounter_id = ? and actor_index = ?",
    )
    .all(sessionId, encounterId, row.actor_index)) {
    actor.skills.set(skill.source_id, {
      sourceId: skill.source_id,
      sourceLabel: skill.source_label,
      damage: skill.damage,
      hits: skill.hits,
      criticalHits: skill.critical_hits,
    });
  }

  for (const target of database
    .query<{ target_id: number; damage: number }, [string, string, number]>(
      "select target_id, damage from combat_targets where session_id = ? and encounter_id = ? and actor_index = ?",
    )
    .all(sessionId, encounterId, row.actor_index)) {
    actor.targetIds.add(target.target_id);
    actor.targetDamage.set(target.target_id, target.damage);
  }

  for (const bucket of database
    .query<{ origin: string; origin_ms: number; width_ms: number; bucket_index: number; damage: number }, [string, string, number]>(
      "select origin, origin_ms, width_ms, bucket_index, damage from combat_timeline_buckets where session_id = ? and encounter_id = ? and actor_index = ? order by bucket_index",
    )
    .all(sessionId, encounterId, row.actor_index)) {
    const series = bucket.origin === "actor" ? actor.actorSeries : actor.encounterSeries;
    series.originMs = bucket.origin_ms;
    series.widthMs = bucket.width_ms;
    while (series.buckets.length <= bucket.bucket_index) series.buckets.push(0);
    series.buckets[bucket.bucket_index] = bucket.damage;
  }
  return actor;
}

function summary(sessionId: string, row: EncounterRow): CombatEncounterSummary {
  return {
    sessionId,
    encounterId: row.encounter_id,
    startedAtMs: row.started_at_ms,
    lastDamageAtMs: row.last_damage_at_ms,
    ...(row.ended_at_ms === null ? {} : { endedAtMs: row.ended_at_ms }),
    durationMs: Math.max(1_000, row.last_damage_at_ms - row.started_at_ms),
    totalDamage: row.total_damage,
  };
}

function encodeCursor(cursor: { startedAtMs: number; encounterId: string }): string {
  return Buffer.from(`${cursor.startedAtMs}:${cursor.encounterId}`, "utf8").toString("base64url");
}

function decodeCursor(cursor: string | undefined): { startedAtMs: number; encounterId: string } | undefined {
  if (!cursor) return undefined;
  const text = Buffer.from(cursor, "base64url").toString("utf8");
  const separator = text.indexOf(":");
  if (separator < 0) return undefined;
  const startedAtMs = Number(text.slice(0, separator));
  if (!Number.isFinite(startedAtMs)) return undefined;
  return { startedAtMs, encounterId: text.slice(separator + 1) };
}
