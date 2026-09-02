import type { Database } from "bun:sqlite";
import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";

import type { CombatEncounterSnapshot } from "../reducers/snapshot.ts";
import { createActor } from "../reducers/damage.ts";
import type { ActorAggregate, EncounterAggregate } from "../reducers/damage.ts";
import { displayActorAggregates, renderEncounter } from "../reducers/rows.ts";
import type { RenderOptions } from "../reducers/rows.ts";

export interface Page<T> {
  items: T[];
  nextCursor?: string;
}

/** Which meter to read an encounter as: outgoing party damage, incoming damage grouped by the party member taking it, or restored health grouped by the healer. */
export type StoredMeter = "dps" | "tanked" | "healing";

export interface GetEncounterOptions extends RenderOptions {
  /** Defaults to `"dps"`. */
  meter?: StoredMeter;
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

export interface DeathLogQuery {
  sessionId: string;
  cursor?: string;
  limit?: number;
}

export interface CombatEnemyOption {
  targetId: number;
  label: string;
}

export interface CombatEnemySkillRow {
  attackerRowId: string;
  targetId: number;
  sourceId: string;
  sourceLabel: string;
  damage: number;
  hits: number;
  criticalHits: number;
}

export interface CombatEnemyBreakdown {
  encounterId: string;
  enemies: CombatEnemyOption[];
  skills: CombatEnemySkillRow[];
}

export interface CombatDeathHit {
  /** Milliseconds before the death; zero is the lethal hit. */
  beforeDeathMs: number;
  attackerActorId: number;
  attackerLabel: string;
  attackerIsMonster: boolean;
  sourceLabel: string;
  damage: number;
  critical: boolean;
}

export interface CombatDeathRecord {
  encounterId: string;
  deathIndex: number;
  victimName: string;
  targetId: number;
  diedAtMs: number;
  totalDamage: number;
  hits: CombatDeathHit[];
}

interface DeathRow {
  encounter_id: string;
  death_index: number;
  victim_name: string;
  target_id: number;
  died_at_ms: number;
  total_damage: number;
}

interface DeathHitRow {
  before_death_ms: number;
  attacker_actor_id: number;
  attacker_label: string;
  attacker_is_monster: number;
  source_label: string;
  damage: number;
  critical: number;
}

const DEFAULT_LIMIT = 50;

/** Paged reads over the indexed combat history. */
export class CombatHistoryStore {
  constructor(private readonly model: ReadModel) {}

  /** Lines of this session's combat log that were not a valid record, across every indexing pass. */
  invalidLines(sessionId: string): number {
    const row = this.model
      .statement("select invalid_lines from combat_stream_state where session_id = $sessionId")
      .get({ sessionId }) as { invalid_lines: number } | null;
    return row?.invalid_lines ?? 0;
  }

  listEncounters(query: ListEncountersQuery): Page<CombatEncounterSummary> {
    const limit = Math.max(1, query.limit ?? DEFAULT_LIMIT);
    const cursor = decodeCursor(query.cursor);
    // Keyset pagination on (started_at_ms, encounter_id): a live session appending encounters cannot shift rows between pages the way an offset would.
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

  /**
   * Per-attacker, per-enemy, per-skill damage for one encounter, with the enemy picker ordered by
   * first sighting and duplicate monster names disambiguated. `meter` selects outgoing party damage
   * (`"dps"`, the default) or incoming damage taken (`"tanked"`).
   */
  getEnemyBreakdown(sessionId: string, encounterId: string, meter: "dps" | "tanked" = "dps"): CombatEnemyBreakdown {
    const enemyRows = this.model.database
      .query<{ target_id: number; display_name: string | null; first_seen_at_ms: number }, [string, string]>(
        "select target_id, display_name, first_seen_at_ms from combat_enemies where session_id = ? and encounter_id = ? order by first_seen_at_ms, target_id",
      )
      .all(sessionId, encounterId);
    const names = new Map<number, string | null>(enemyRows.map((enemy) => [enemy.target_id, enemy.display_name] as const));
    if (meter === "tanked") {
      // Pure attackers (never damaged by the party) are not in `combat_enemies`; their names live in
      // the session-wide mob identity map the indexer persists.
      const state = this.model.database
        .query<{ mob_identities_json: string }, [string]>(
          "select mob_identities_json from combat_stream_state where session_id = ?",
        )
        .get(sessionId);
      for (const [id, name] of JSON.parse(state?.mob_identities_json ?? "[]") as [number, string][]) {
        if (!names.get(id)) names.set(id, name);
      }
    }

    // Timelines are the bulk of an encounter load and nothing below reads one. `includeAllAnonymous`
    // keeps a row that is still inside the live meter's grace period: hiding it here would drop its
    // damage from the breakdown while the enemy picker, fed by the same hits, still lists its target.
    const encounter = this.loadEncounter(sessionId, encounterId, meter, { withTimeline: false });
    const skills: CombatEnemySkillRow[] = encounter
      ? displayActorAggregates(encounter, { includeAllAnonymous: true }).flatMap(({ rowId, actor }) => [...actor.enemySkills].flatMap(
        ([targetId, bySkill]) => [...bySkill].map(([sourceId, stats]) => ({
          attackerRowId: rowId,
          targetId,
          sourceId,
          sourceLabel: stats.sourceLabel,
          damage: stats.damage,
          hits: stats.hits,
          criticalHits: stats.criticalHits,
        })),
      )).sort((left, right) => right.damage - left.damage)
      : [];

    // Both pickers list only enemies with skill rows for this meter (damaged by the party, or
    // landed an incoming hit), ordered by `combat_enemies` first-sighting, then any extras by id.
    const pickerIds = orderedEnemyIds(skills, enemyRows);

    const counts = new Map<string, number>();
    for (const targetId of pickerIds) {
      const name = names.get(targetId) ?? `Enemy ${targetId}`;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const nextIndex = new Map<string, number>();
    const options = pickerIds.map((targetId) => {
      const name = names.get(targetId) ?? `Enemy ${targetId}`;
      if ((counts.get(name) ?? 0) <= 1) return { targetId, label: name };
      const index = (nextIndex.get(name) ?? 0) + 1;
      nextIndex.set(name, index);
      return { targetId, label: `${name} (${index})` };
    });

    return { encounterId, enemies: options, skills };
  }

  /** Player deaths, newest first, paged so a long session never loads at once. */
  getDeathLog(query: DeathLogQuery): Page<CombatDeathRecord> {
    const limit = Math.max(1, query.limit ?? DEFAULT_LIMIT);
    const cursor = decodeCursor(query.cursor);
    const rows = cursor
      ? this.model.database
        .query<DeathRow, [string, number, number, string, number]>(
          `select * from combat_deaths
           where session_id = ? and (died_at_ms < ? or (died_at_ms = ? and encounter_id || ':' || death_index < ?))
           order by died_at_ms desc, encounter_id desc, death_index desc limit ?`,
        )
        .all(query.sessionId, cursor.startedAtMs, cursor.startedAtMs, cursor.encounterId, limit + 1)
      : this.model.database
        .query<DeathRow, [string, number]>(
          "select * from combat_deaths where session_id = ? order by died_at_ms desc, encounter_id desc, death_index desc limit ?",
        )
        .all(query.sessionId, limit + 1);

    const page = rows.slice(0, limit);
    const last = page.at(-1);
    return {
      items: page.map((row) => ({
        encounterId: row.encounter_id,
        deathIndex: row.death_index,
        victimName: row.victim_name,
        targetId: row.target_id,
        diedAtMs: row.died_at_ms,
        totalDamage: row.total_damage,
        hits: this.model.database
          .query<DeathHitRow, [string, string, number]>(
            "select * from combat_death_hits where session_id = ? and encounter_id = ? and death_index = ? order by hit_index",
          )
          .all(query.sessionId, row.encounter_id, row.death_index)
          .map((hit) => ({
            beforeDeathMs: hit.before_death_ms,
            attackerActorId: hit.attacker_actor_id,
            attackerLabel: hit.attacker_label,
            attackerIsMonster: hit.attacker_is_monster === 1,
            sourceLabel: hit.source_label,
            damage: hit.damage,
            critical: hit.critical === 1,
          })),
      })),
      ...(rows.length > limit && last
        ? { nextCursor: encodeCursor({ startedAtMs: last.died_at_ms, encounterId: `${last.encounter_id}:${last.death_index}` }) }
        : {}),
    };
  }

  /**
   * Renders one encounter in the same shape the legacy meter produces.
   *
   * Tanked and healing rates divide by the encounter's own duration, taken from the encounter row,
   * so they stay comparable with the damage figure even when incoming hits span a shorter window.
   */
  getEncounter(
    sessionId: string,
    encounterId: string,
    options: GetEncounterOptions = {},
  ): CombatEncounterSnapshot | undefined {
    const { meter = "dps", ...renderOptions } = options;
    const encounter = this.loadEncounter(sessionId, encounterId, meter);
    if (!encounter) return undefined;
    return renderEncounter(encounter, { nowMs: encounter.lastDamageAtMs, ...renderOptions });
  }

  private loadEncounter(
    sessionId: string,
    encounterId: string,
    meter: StoredMeter,
    options: { withTimeline?: boolean } = {},
  ): EncounterAggregate | undefined {
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
      // The encounter's own span, not the meter's: a tanked or healing rate must divide by the
      // duration of the fight it belongs to.
      lastDamageAtMs: row.last_damage_at_ms,
      ...(row.ended_at_ms === null ? {} : { endedAtMs: row.ended_at_ms }),
      actors: [],
      activeActors: new Map(),
      enemyFirstSeenAtMs: new Map(),
      enemyNames: new Map(),
      deaths: [],
    };

    for (const actorRow of database
      .query<ActorRow, [string, string, string]>(
        "select * from combat_actors where session_id = ? and encounter_id = ? and meter = ? order by actor_index",
      )
      .all(sessionId, encounterId, meter)) {
      encounter.actors.push(hydrateActor(
        database,
        sessionId,
        encounterId,
        meter,
        actorRow,
        encounter.startedAtMs,
        options.withTimeline ?? true,
      ));
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
  absorbed: number;
  first_damage_at_ms: number | null;
  last_damage_at_ms: number | null;
  hits: number;
  critical_hits: number;
  kills: number;
  ewma_rate: number;
  ewma_at_ms: number;
  ewma_tau_seconds: number;
}

function hydrateActor(
  database: Database,
  sessionId: string,
  encounterId: string,
  meter: StoredMeter,
  row: ActorRow,
  encounterStartedAtMs: number,
  withTimeline: boolean,
): ActorAggregate {
  const actor = createActor(row.actor_id, encounterStartedAtMs, row.ewma_tau_seconds);
  if (row.display_name !== null) actor.displayName = row.display_name;
  if (row.archetype !== null) actor.archetype = row.archetype;
  if (row.owner_connection_id !== null) actor.ownerConnectionId = row.owner_connection_id;
  if (row.uid !== null) actor.uid = row.uid;
  actor.activeIdentity = row.active_identity === 1;
  actor.damage = row.damage;
  actor.absorbed = row.absorbed;
  if (row.first_damage_at_ms !== null) actor.firstDamageAtMs = row.first_damage_at_ms;
  if (row.last_damage_at_ms !== null) actor.lastDamageAtMs = row.last_damage_at_ms;
  actor.hits = row.hits;
  actor.criticalHits = row.critical_hits;
  actor.kills = row.kills;
  actor.currentRate.restore({ rate: row.ewma_rate, updatedAtMs: row.ewma_at_ms, tauSeconds: row.ewma_tau_seconds });

  for (const skill of database
    .query<{ source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }, [string, string, string, number]>(
      "select source_id, source_label, damage, hits, critical_hits from combat_skills where session_id = ? and encounter_id = ? and meter = ? and actor_index = ?",
    )
    .all(sessionId, encounterId, meter, row.actor_index)) {
    actor.skills.set(skill.source_id, {
      sourceId: skill.source_id,
      sourceLabel: skill.source_label,
      damage: skill.damage,
      hits: skill.hits,
      criticalHits: skill.critical_hits,
    });
  }

  for (const target of database
    .query<{ target_id: number; damage: number }, [string, string, string, number]>(
      "select target_id, damage from combat_targets where session_id = ? and encounter_id = ? and meter = ? and actor_index = ?",
    )
    .all(sessionId, encounterId, meter, row.actor_index)) {
    actor.targetIds.add(target.target_id);
    actor.targetDamage.set(target.target_id, target.damage);
  }

  if (meter === "dps" || meter === "tanked") {
    for (const enemySkill of database
      .query<{ target_id: number; source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }, [string, string, string, number]>(
        "select target_id, source_id, source_label, damage, hits, critical_hits from combat_enemy_skills where session_id = ? and encounter_id = ? and meter = ? and actor_index = ?",
      )
      .all(sessionId, encounterId, meter, row.actor_index)) {
      const bySkill = actor.enemySkills.get(enemySkill.target_id) ?? new Map();
      actor.enemySkills.set(enemySkill.target_id, bySkill);
      bySkill.set(enemySkill.source_id, {
        sourceLabel: enemySkill.source_label,
        damage: enemySkill.damage,
        hits: enemySkill.hits,
        criticalHits: enemySkill.critical_hits,
      });
    }
  }

  if (meter === "tanked") {
    for (const skill of database
      .query<{ source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }, [string, string, number]>(
        "select source_id, source_label, damage, hits, critical_hits from combat_skills where session_id = ? and encounter_id = ? and meter = 'absorbed' and actor_index = ?",
      )
      .all(sessionId, encounterId, row.actor_index)) {
      actor.absorbedSkills.set(skill.source_id, {
        sourceId: skill.source_id,
        sourceLabel: skill.source_label,
        damage: skill.damage,
        hits: skill.hits,
        criticalHits: skill.critical_hits,
      });
    }
    for (const target of database
      .query<{ target_id: number; damage: number }, [string, string, number]>(
        "select target_id, damage from combat_targets where session_id = ? and encounter_id = ? and meter = 'absorbed' and actor_index = ?",
      )
      .all(sessionId, encounterId, row.actor_index)) {
      actor.absorbedByEnemy.set(target.target_id, target.damage);
    }
  }

  if (withTimeline) {
    for (const bucket of database
      .query<{ origin: string; origin_ms: number; width_ms: number; bucket_index: number; damage: number }, [string, string, string, number]>(
        "select origin, origin_ms, width_ms, bucket_index, damage from combat_timeline_buckets where session_id = ? and encounter_id = ? and meter = ? and actor_index = ? order by bucket_index",
      )
      .all(sessionId, encounterId, meter, row.actor_index)) {
      const series = bucket.origin === "actor" ? actor.actorSeries : actor.encounterSeries;
      series.originMs = bucket.origin_ms;
      series.widthMs = bucket.width_ms;
      while (series.buckets.length <= bucket.bucket_index) series.buckets.push(0);
      series.buckets[bucket.bucket_index] = bucket.damage;
    }
  }
  return actor;
}

/** Enemy ids that have a skill row for this meter, `combat_enemies` first-seen order first, then the rest by id. */
function orderedEnemyIds(
  skills: CombatEnemySkillRow[],
  enemyRows: readonly { target_id: number }[],
): number[] {
  const withSkills = new Set(skills.map((skill) => skill.targetId));
  const ordered = enemyRows.map((enemy) => enemy.target_id).filter((id) => withSkills.has(id));
  const seen = new Set(ordered);
  const rest = [...withSkills].filter((id) => !seen.has(id)).sort((left, right) => left - right);
  return [...ordered, ...rest];
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
