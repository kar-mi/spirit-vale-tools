import type { Statement } from "bun:sqlite";
import type { IndexStreamRequest, IndexStreamResult, ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";

import { parseDpsLogRecord } from "../replay.ts";
import { DamageReducer, createActor } from "../reducers/damage.ts";
import type { ActorAggregate, CombatIdentity, DamageReducerOptions, DeathHitRecord, DeathRecord, EncounterAggregate } from "../reducers/damage.ts";
import { MeterReducer } from "../reducers/meter.ts";
import type { MeterKind } from "../reducers/meter.ts";
import { COMBAT_DOMAIN_NAME } from "./domain.ts";

/** Table discriminator for the three meters sharing the actor/skill/target/timeline tables. */
export type StoredMeter = "dps" | "tanked" | "healing";

const METER_KINDS: readonly { meter: StoredMeter; kind: MeterKind }[] = [
  { meter: "tanked", kind: "tanked" },
  { meter: "healing", kind: "healing" },
];

export interface IndexCombatStreamOptions extends Pick<DamageReducerOptions, "idleGapMs" | "currentWindowMs"> {
  sessionId: string;
  sourcePath: string;
  batchBytes?: number;
  /**
   * Closes the encounter still in progress at the end of the log. Set this only when the log will
   * not grow — a completed past session. While a session is live the trailing encounter must stay
   * open so the next pass continues it instead of starting a new one.
   */
  finalize?: boolean;
}

/**
 * Indexes one combat log into the read model.
 *
 * Encounter ids come from the log (`enc-<sequence of the first record>`) rather than a counter, so
 * the same log always produces the same ids and re-indexing is stable. An encounter still open at a
 * batch boundary is written with `ended_at_ms` null and resumed on the next pass.
 */
export async function indexCombatStream(model: ReadModel, options: IndexCombatStreamOptions): Promise<IndexStreamResult> {
  const { sessionId, sourcePath } = options;
  const finished: EncounterAggregate[] = [];
  let currentSequence = 0;
  let lastObservedAtMs = 0;

  // The tanked and healing meters follow the damage reducer's encounter boundaries; only outgoing
  // party damage defines an encounter. Their aggregates are captured per encounter id so a finished
  // encounter can be written after the reducer has already moved on.
  const meters = METER_KINDS.map(({ meter, kind }) => ({
    meter,
    reducer: new MeterReducer({
      kind,
      ...(options.currentWindowMs === undefined ? {} : { currentWindowMs: options.currentWindowMs }),
    }),
  }));
  const meterAggregates = new Map<string, Map<StoredMeter, EncounterAggregate>>();

  const captureMeters = (encounterId: string): void => {
    const byMeter = meterAggregates.get(encounterId) ?? new Map<StoredMeter, EncounterAggregate>();
    for (const entry of meters) {
      if (entry.reducer.current) byMeter.set(entry.meter, entry.reducer.current);
    }
    if (byMeter.size > 0) meterAggregates.set(encounterId, byMeter);
  };

  const reducer = new DamageReducer({
    ...(options.idleGapMs === undefined ? {} : { idleGapMs: options.idleGapMs }),
    ...(options.currentWindowMs === undefined ? {} : { currentWindowMs: options.currentWindowMs }),
    createEncounterId: () => `enc-${currentSequence}`,
    onEncounterFinished: (encounter) => {
      captureMeters(encounter.id);
      for (const entry of meters) entry.reducer.finish(encounter.endedAtMs ?? encounter.lastDamageAtMs);
      finished.push(encounter);
    },
  });

  // Session-scoped reducer state first: an incremental pass often has no encounter open at the
  // boundary, and identities, monster names and the death lookback all outlive any one encounter.
  loadStreamState(model, sessionId, reducer);
  const open = loadOpenEncounter(model, sessionId);
  if (open) {
    reducer.resume(open);
    // Restore the meters' open aggregates too, or a resumed pass would restart their totals at zero
    // while the damage totals continued.
    for (const entry of meters) {
      entry.reducer.resume(loadMeterAggregate(model, sessionId, open, entry.meter));
    }
  }

  const request: IndexStreamRequest = {
    sessionId,
    stream: "combat",
    domain: COMBAT_DOMAIN_NAME,
    sourcePath,
    ...(options.batchBytes === undefined ? {} : { batchBytes: options.batchBytes }),
    apply(records) {
      const previouslyOpen = reducer.current?.id;
      for (const record of records) {
        consume(reducer, meters, record, (sequence, observedAtMs) => {
          currentSequence = sequence;
          lastObservedAtMs = observedAtMs;
        });
      }
      for (const encounter of finished.splice(0)) {
        writeEncounter(model, sessionId, encounter, reducer, meterAggregates.get(encounter.id));
        meterAggregates.delete(encounter.id);
      }
      // The open encounter is rewritten each batch from the in-memory totals, so the stored row is
      // an absolute snapshot rather than an accumulation — re-applying a batch cannot double-count.
      if (reducer.current) {
        captureMeters(reducer.current.id);
        writeEncounter(model, sessionId, reducer.current, reducer, meterAggregates.get(reducer.current.id));
      } else if (previouslyOpen) clearEncounter(model, sessionId, previouslyOpen, { keepFinished: true });
      // Written in the same transaction as the rows above, so progress and reducer state commit
      // together. Pruned first so the persisted lookback is exactly the window that gets read back.
      reducer.pruneRecentHits(lastObservedAtMs);
      writeStreamState(model, sessionId, reducer);
    },
    clear(scope, database) {
      for (const table of TABLES) {
        database.query(`delete from ${table} where session_id = $sessionId`).run({ sessionId: scope.sessionId });
      }
      reducer.current = undefined;
      reducer.identities.clear();
      reducer.mobIdentities.clear();
      reducer.recentHits.clear();
      for (const entry of meters) entry.reducer.reset();
      meterAggregates.clear();
      finished.length = 0;
    },
  };

  const result = await model.indexStream(request);
  recordInvalidLines(model, sessionId, result.invalidLines, result.rebuilt);

  if (options.finalize && reducer.current) {
    // The byte offset is already committed; this only stamps ended_at_ms on the encounter row, so
    // re-running it is harmless.
    model.transaction(() => {
      reducer.reset(lastObservedAtMs);
      for (const encounter of finished.splice(0)) {
        writeEncounter(model, sessionId, encounter, reducer, meterAggregates.get(encounter.id));
        meterAggregates.delete(encounter.id);
      }
    });
  }
  return result;
}

const TABLES = [
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
] as const;

/** Adapts the model's managed statement cache to the `.query(sql)` shape the writers below use. */
function statements(model: ReadModel): { query: (sql: string) => Statement } {
  return { query: (sql: string) => model.statement(sql) };
}

function consume(
  reducer: DamageReducer,
  meters: readonly { meter: StoredMeter; reducer: MeterReducer }[],
  record: LogRecord,
  note: (sequence: number, observedAtMs: number) => void,
): void {
  const event = parseDpsLogRecord(record.type, record.data);
  if (!event) return;
  const observedAtMs = Date.parse(record.recordedAt);
  if (!Number.isFinite(observedAtMs)) return;
  note(record.sequence, observedAtMs);
  if (event.kind === "actorIdentity") {
    reducer.consumeIdentity(event, observedAtMs);
    for (const entry of meters) entry.reducer.consumeIdentity(event);
    return;
  }
  // The reducer owns encounter boundaries, so it runs first: it may close an encounter that has gone
  // idle, and an incoming hit or heal arriving after that cutoff belongs to no encounter at all.
  reducer.consumeCombat(event, observedAtMs);
  const encounter = reducer.current;
  if (!encounter) return;
  for (const entry of meters) {
    if (entry.reducer.current?.id !== encounter.id) entry.reducer.begin(encounter.id, encounter.startedAtMs);
    entry.reducer.consumeCombat(event, observedAtMs, reducer.identities);
  }
}

/**
 * Writes through `model.statement`, not `database.query`. Both hit the same connection, but only the
 * former is finalized by `close()`; statements left in Bun's own cache keep the database file open
 * on Windows, which blocks deleting the cache directory.
 */
function writeEncounter(
  model: ReadModel,
  sessionId: string,
  encounter: EncounterAggregate,
  reducer: DamageReducer,
  meterAggregates?: ReadonlyMap<StoredMeter, EncounterAggregate>,
): void {
  const database = statements(model);
  writeEnemiesAndDeaths(model, sessionId, encounter, reducer.mobIdentities);
  const totalDamage = encounter.actors.reduce((sum, actor) => sum + actor.damage, 0);
  database
    .query(`insert or replace into combat_encounters
      (session_id, encounter_id, started_at_ms, last_damage_at_ms, ended_at_ms, total_damage)
      values ($sessionId, $encounterId, $startedAtMs, $lastDamageAtMs, $endedAtMs, $totalDamage)`)
    .run({
      sessionId,
      encounterId: encounter.id,
      startedAtMs: encounter.startedAtMs,
      lastDamageAtMs: encounter.lastDamageAtMs,
      endedAtMs: encounter.endedAtMs ?? null,
      totalDamage,
    });

  writeActors(model, sessionId, encounter, "dps");
  for (const [meter, aggregate] of meterAggregates ?? []) writeActors(model, sessionId, aggregate, meter, encounter.id);
}

/** Writes one meter's per-actor aggregates. The three meters differ only by the `meter` column. */
function writeActors(
  model: ReadModel,
  sessionId: string,
  aggregate: EncounterAggregate,
  meter: StoredMeter,
  encounterId = aggregate.id,
): void {
  const database = statements(model);
  for (const [actorIndex, actor] of aggregate.actors.entries()) {
    database
      .query(`insert or replace into combat_actors
        (session_id, encounter_id, meter, actor_index, actor_id, active_slot, display_name, archetype, owner_connection_id, uid,
         active_identity, damage, first_damage_at_ms, last_damage_at_ms, hits, critical_hits, kills, window_json)
        values ($sessionId, $encounterId, $meter, $actorIndex, $actorId, $activeSlot, $displayName, $archetype, $ownerConnectionId, $uid,
                $activeIdentity, $damage, $firstDamageAtMs, $lastDamageAtMs, $hits, $criticalHits, $kills, $windowJson)`)
      .run({
        sessionId,
        encounterId,
        meter,
        actorIndex,
        actorId: actor.actorId,
        activeSlot: aggregate.activeActors.get(actor.actorId) === actor ? 1 : 0,
        displayName: actor.displayName ?? null,
        archetype: actor.archetype ?? null,
        ownerConnectionId: actor.ownerConnectionId ?? null,
        uid: actor.uid ?? null,
        activeIdentity: actor.activeIdentity ? 1 : 0,
        damage: actor.damage,
        firstDamageAtMs: actor.firstDamageAtMs ?? null,
        lastDamageAtMs: actor.lastDamageAtMs ?? null,
        hits: actor.hits,
        criticalHits: actor.criticalHits,
        kills: actor.kills,
        windowJson: JSON.stringify(actor.window),
      });

    for (const skill of actor.skills.values()) {
      database
        .query(`insert or replace into combat_skills
          (session_id, encounter_id, meter, actor_index, source_id, source_label, damage, hits, critical_hits)
          values ($sessionId, $encounterId, $meter, $actorIndex, $sourceId, $sourceLabel, $damage, $hits, $criticalHits)`)
        .run({
          sessionId,
          encounterId,
          meter,
          actorIndex,
          sourceId: skill.sourceId,
          sourceLabel: skill.sourceLabel,
          damage: skill.damage,
          hits: skill.hits,
          criticalHits: skill.criticalHits,
        });
    }

    for (const targetId of actor.targetIds) {
      database
        .query(`insert or replace into combat_targets
          (session_id, encounter_id, meter, actor_index, target_id, damage)
          values ($sessionId, $encounterId, $meter, $actorIndex, $targetId, $damage)`)
        .run({
          sessionId,
          encounterId,
          meter,
          actorIndex,
          targetId,
          damage: actor.targetDamage.get(targetId) ?? 0,
        });
    }

    for (const [origin, series] of [["encounter", actor.encounterSeries], ["actor", actor.actorSeries]] as const) {
      for (const [bucketIndex, damage] of series.buckets.entries()) {
        database
          .query(`insert or replace into combat_timeline_buckets
            (session_id, encounter_id, meter, actor_index, origin, origin_ms, width_ms, bucket_index, damage)
            values ($sessionId, $encounterId, $meter, $actorIndex, $origin, $originMs, $widthMs, $bucketIndex, $damage)`)
          .run({
            sessionId,
            encounterId,
            meter,
            actorIndex,
            origin,
            originMs: series.originMs,
            widthMs: series.widthMs,
            bucketIndex,
            damage,
          });
      }
    }
  }
}

function writeEnemiesAndDeaths(
  model: ReadModel,
  sessionId: string,
  encounter: EncounterAggregate,
  mobIdentities: ReadonlyMap<number, string>,
): void {
  const database = statements(model);
  const scope = { sessionId, encounterId: encounter.id };
  // Deaths and enemy rows are positional, so rewrite them wholesale rather than upserting: an open
  // encounter's list only ever grows, and replacing it keeps the stored rows an exact snapshot.
  for (const table of ["combat_death_hits", "combat_deaths", "combat_enemies", "combat_enemy_skills"]) {
    database.query(`delete from ${table} where session_id = $sessionId and encounter_id = $encounterId`).run(scope);
  }

  for (const [attackerActorId, byTarget] of encounter.enemies) {
    for (const [targetId, bySkill] of byTarget) {
      for (const [sourceId, stats] of bySkill) {
        database
          .query(`insert or replace into combat_enemy_skills
            (session_id, encounter_id, attacker_actor_id, target_id, source_id, source_label, damage, hits, critical_hits)
            values ($sessionId, $encounterId, $attackerActorId, $targetId, $sourceId, $sourceLabel, $damage, $hits, $criticalHits)`)
          .run({
            ...scope,
            attackerActorId,
            targetId,
            sourceId,
            sourceLabel: stats.sourceLabel,
            damage: stats.damage,
            hits: stats.hits,
            criticalHits: stats.criticalHits,
          });
      }
    }
  }

  for (const [targetId, firstSeenAtMs] of encounter.enemyFirstSeenAtMs) {
    database
      .query(`insert or replace into combat_enemies
        (session_id, encounter_id, target_id, display_name, first_seen_at_ms)
        values ($sessionId, $encounterId, $targetId, $displayName, $firstSeenAtMs)`)
      .run({ ...scope, targetId, displayName: mobIdentities.get(targetId) ?? null, firstSeenAtMs });
  }

  for (const [deathIndex, death] of encounter.deaths.entries()) {
    database
      .query(`insert or replace into combat_deaths
        (session_id, encounter_id, death_index, victim_name, target_id, died_at_ms, total_damage)
        values ($sessionId, $encounterId, $deathIndex, $victimName, $targetId, $diedAtMs, $totalDamage)`)
      .run({
        ...scope,
        deathIndex,
        victimName: death.victimName,
        targetId: death.targetId,
        diedAtMs: death.diedAtMs,
        totalDamage: death.totalDamage,
      });
    for (const [hitIndex, hit] of death.hits.entries()) {
      database
        .query(`insert or replace into combat_death_hits
          (session_id, encounter_id, death_index, hit_index, before_death_ms, attacker_actor_id,
           attacker_label, attacker_is_monster, source_label, damage, critical)
          values ($sessionId, $encounterId, $deathIndex, $hitIndex, $beforeDeathMs, $attackerActorId,
                  $attackerLabel, $attackerIsMonster, $sourceLabel, $damage, $critical)`)
        .run({
          ...scope,
          deathIndex,
          hitIndex,
          beforeDeathMs: hit.beforeDeathMs,
          attackerActorId: hit.attackerActorId,
          attackerLabel: hit.attackerLabel,
          attackerIsMonster: hit.attackerIsMonster ? 1 : 0,
          sourceLabel: hit.sourceLabel,
          damage: hit.damage,
          critical: hit.critical ? 1 : 0,
        });
    }
  }
}

function clearEncounter(
  model: ReadModel,
  sessionId: string,
  encounterId: string,
  options: { keepFinished?: boolean } = {},
): void {
  const database = statements(model);
  if (options.keepFinished) {
    const stored = database
      .query("select ended_at_ms from combat_encounters where session_id = $sessionId and encounter_id = $encounterId")
      .get({ sessionId, encounterId }) as { ended_at_ms: number | null } | null;
    if (stored && stored.ended_at_ms !== null) return;
  }
  for (const table of TABLES) {
    database
      .query(`delete from ${table} where session_id = $sessionId and encounter_id = $encounterId`)
      .run({ sessionId, encounterId });
  }
}

interface EncounterRow {
  encounter_id: string;
  started_at_ms: number;
  last_damage_at_ms: number;
  ended_at_ms: number | null;
}

interface StreamStateRow {
  identities_json: string;
  mob_identities_json: string;
  recent_hits_json: string;
}

/**
 * Accumulates the count of unparseable lines for the stream. A rebuild re-reads from byte zero, so
 * its count replaces the running total instead of adding to it.
 */
function recordInvalidLines(model: ReadModel, sessionId: string, invalidLines: number, rebuilt: boolean): void {
  if (invalidLines === 0 && !rebuilt) return;
  model.transaction(() => {
    statements(model)
      .query(`insert into combat_stream_state (session_id, invalid_lines) values ($sessionId, $invalidLines)
        on conflict(session_id) do update set
          invalid_lines = case when $rebuilt = 1 then $invalidLines else combat_stream_state.invalid_lines + $invalidLines end`)
      .run({ sessionId, invalidLines, rebuilt: rebuilt ? 1 : 0 });
  });
}

/** Restores the reducer state that spans encounters, so an incremental pass continues where it left off. */
function loadStreamState(model: ReadModel, sessionId: string, reducer: DamageReducer): void {
  const row = statements(model)
    .query("select identities_json, mob_identities_json, recent_hits_json from combat_stream_state where session_id = $sessionId")
    .get({ sessionId }) as StreamStateRow | null;
  if (!row) return;
  for (const [actorId, identity] of JSON.parse(row.identities_json) as [number, CombatIdentity][]) {
    reducer.identities.set(actorId, identity);
  }
  for (const [actorId, name] of JSON.parse(row.mob_identities_json) as [number, string][]) {
    reducer.mobIdentities.set(actorId, name);
  }
  for (const [targetId, hits] of JSON.parse(row.recent_hits_json) as [number, { atMs: number; hit: DeathHitRecord }[]][]) {
    reducer.recentHits.set(targetId, hits);
  }
}

function writeStreamState(model: ReadModel, sessionId: string, reducer: DamageReducer): void {
  // Upsert rather than replace: invalid_lines accumulates separately and must survive this write.
  statements(model)
    .query(`insert into combat_stream_state
      (session_id, identities_json, mob_identities_json, recent_hits_json)
      values ($sessionId, $identitiesJson, $mobIdentitiesJson, $recentHitsJson)
      on conflict(session_id) do update set
        identities_json = excluded.identities_json,
        mob_identities_json = excluded.mob_identities_json,
        recent_hits_json = excluded.recent_hits_json`)
    .run({
      sessionId,
      identitiesJson: JSON.stringify([...reducer.identities]),
      mobIdentitiesJson: JSON.stringify([...reducer.mobIdentities]),
      recentHitsJson: JSON.stringify([...reducer.recentHits]),
    });
}

function loadEnemies(
  database: { query: (sql: string) => Statement },
  sessionId: string,
  encounterId: string,
): EncounterAggregate["enemies"] {
  const enemies: EncounterAggregate["enemies"] = new Map();
  for (const row of database
    .query("select * from combat_enemy_skills where session_id = ? and encounter_id = ?")
    .all(sessionId, encounterId) as { attacker_actor_id: number; target_id: number; source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }[]) {
    const byTarget = enemies.get(row.attacker_actor_id) ?? new Map();
    enemies.set(row.attacker_actor_id, byTarget);
    const bySkill = byTarget.get(row.target_id) ?? new Map();
    byTarget.set(row.target_id, bySkill);
    bySkill.set(row.source_id, {
      sourceLabel: row.source_label,
      damage: row.damage,
      hits: row.hits,
      criticalHits: row.critical_hits,
    });
  }
  return enemies;
}

function loadDeaths(
  database: { query: (sql: string) => Statement },
  sessionId: string,
  encounterId: string,
): DeathRecord[] {
  return (database
    .query("select * from combat_deaths where session_id = ? and encounter_id = ? order by death_index")
    .all(sessionId, encounterId) as { death_index: number; victim_name: string; target_id: number; died_at_ms: number; total_damage: number }[])
    .map((row) => ({
      victimName: row.victim_name,
      targetId: row.target_id,
      diedAtMs: row.died_at_ms,
      totalDamage: row.total_damage,
      hits: (database
        .query("select * from combat_death_hits where session_id = ? and encounter_id = ? and death_index = ? order by hit_index")
        .all(sessionId, encounterId, row.death_index) as { before_death_ms: number; attacker_actor_id: number; attacker_label: string; attacker_is_monster: number; source_label: string; damage: number; critical: number }[])
        .map((hit) => ({
          beforeDeathMs: hit.before_death_ms,
          attackerActorId: hit.attacker_actor_id,
          attackerLabel: hit.attacker_label,
          attackerIsMonster: hit.attacker_is_monster === 1,
          sourceLabel: hit.source_label,
          damage: hit.damage,
          critical: hit.critical === 1,
        })),
    }));
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

/**
 * Rebuilds the encounter left open by an earlier pass so indexing continues rather than restarts.
 *
 * Reads go through the model's statement cache rather than `database.query`, so `close()` finalizes
 * them. A statement left in Bun's own cache keeps the database file open on Windows, which blocks
 * deleting the cache directory — and a long-lived model that re-indexes a live session resumes here
 * on every pass.
 */
function loadOpenEncounter(model: ReadModel, sessionId: string): EncounterAggregate | undefined {
  const database = statements(model);
  const row = database
    .query("select encounter_id, started_at_ms, last_damage_at_ms, ended_at_ms from combat_encounters where session_id = $sessionId and ended_at_ms is null")
    .get({ sessionId }) as EncounterRow | null;
  if (!row) return undefined;

  const encounter: EncounterAggregate = {
    id: row.encounter_id,
    startedAtMs: row.started_at_ms,
    lastDamageAtMs: row.last_damage_at_ms,
    actors: [],
    activeActors: new Map(),
    enemies: loadEnemies(database, sessionId, row.encounter_id),
    enemyFirstSeenAtMs: new Map((database
      .query("select target_id, first_seen_at_ms from combat_enemies where session_id = ? and encounter_id = ?")
      .all(sessionId, row.encounter_id) as { target_id: number; first_seen_at_ms: number }[])
      .map((enemy) => [enemy.target_id, enemy.first_seen_at_ms] as const)),
    deaths: loadDeaths(database, sessionId, row.encounter_id),
  };

  const actorRows = database
    .query("select * from combat_actors where session_id = $sessionId and encounter_id = $encounterId and meter = 'dps' order by actor_index")
    .all({ sessionId, encounterId: row.encounter_id }) as ActorRow[];

  for (const actorRow of actorRows) {
    const actor = createActor(actorRow.actor_id, encounter.startedAtMs);
    if (actorRow.display_name !== null) actor.displayName = actorRow.display_name;
    if (actorRow.archetype !== null) actor.archetype = actorRow.archetype;
    if (actorRow.owner_connection_id !== null) actor.ownerConnectionId = actorRow.owner_connection_id;
    if (actorRow.uid !== null) actor.uid = actorRow.uid;
    actor.activeIdentity = actorRow.active_identity === 1;
    actor.damage = actorRow.damage;
    if (actorRow.first_damage_at_ms !== null) actor.firstDamageAtMs = actorRow.first_damage_at_ms;
    if (actorRow.last_damage_at_ms !== null) actor.lastDamageAtMs = actorRow.last_damage_at_ms;
    actor.hits = actorRow.hits;
    actor.criticalHits = actorRow.critical_hits;
    actor.kills = actorRow.kills;
    actor.window = JSON.parse(actorRow.window_json) as ActorAggregate["window"];

    for (const skill of database
      .query("select source_id, source_label, damage, hits, critical_hits from combat_skills where session_id = ? and encounter_id = ? and meter = 'dps' and actor_index = ?")
      .all(sessionId, row.encounter_id, actorRow.actor_index) as { source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }[]) {
      actor.skills.set(skill.source_id, {
        sourceId: skill.source_id,
        sourceLabel: skill.source_label,
        damage: skill.damage,
        hits: skill.hits,
        criticalHits: skill.critical_hits,
      });
    }

    for (const target of database
      .query("select target_id, damage from combat_targets where session_id = ? and encounter_id = ? and meter = 'dps' and actor_index = ?")
      .all(sessionId, row.encounter_id, actorRow.actor_index) as { target_id: number; damage: number }[]) {
      actor.targetIds.add(target.target_id);
      actor.targetDamage.set(target.target_id, target.damage);
    }

    for (const bucket of database
      .query("select origin, origin_ms, width_ms, bucket_index, damage from combat_timeline_buckets where session_id = ? and encounter_id = ? and meter = 'dps' and actor_index = ? order by bucket_index")
      .all(sessionId, row.encounter_id, actorRow.actor_index) as { origin: string; origin_ms: number; width_ms: number; bucket_index: number; damage: number }[]) {
      const series = bucket.origin === "actor" ? actor.actorSeries : actor.encounterSeries;
      series.originMs = bucket.origin_ms;
      series.widthMs = bucket.width_ms;
      while (series.buckets.length <= bucket.bucket_index) series.buckets.push(0);
      series.buckets[bucket.bucket_index] = bucket.damage;
    }

    encounter.actors.push(actor);
    // active_slot, not activeIdentity: an unidentified actor is still the slot further damage
    // accumulates into, and restoring the wrong one would split an actor's totals in two.
    if (actorRow.active_slot === 1) encounter.activeActors.set(actor.actorId, actor);
  }
  return encounter;
}

/** Rebuilds one meter's aggregate for an encounter left open by an earlier pass. */
function loadMeterAggregate(
  model: ReadModel,
  sessionId: string,
  open: EncounterAggregate,
  meter: StoredMeter,
): EncounterAggregate {
  // Through the model's statement cache, not `database.query`: statements left in Bun's own cache
  // keep the database file open on Windows and block deleting the cache directory.
  const database = statements(model);
  const aggregate: EncounterAggregate = {
    id: open.id,
    startedAtMs: open.startedAtMs,
    lastDamageAtMs: open.lastDamageAtMs,
    actors: [],
    activeActors: new Map(),
    enemies: new Map(),
    enemyFirstSeenAtMs: new Map(),
    deaths: [],
  };
  for (const actorRow of database
    .query("select * from combat_actors where session_id = ? and encounter_id = ? and meter = ? order by actor_index")
    .all(sessionId, open.id, meter) as ActorRow[]) {
    const actor = createActor(actorRow.actor_id, aggregate.startedAtMs);
    if (actorRow.display_name !== null) actor.displayName = actorRow.display_name;
    if (actorRow.archetype !== null) actor.archetype = actorRow.archetype;
    actor.activeIdentity = actorRow.active_identity === 1;
    actor.damage = actorRow.damage;
    if (actorRow.first_damage_at_ms !== null) actor.firstDamageAtMs = actorRow.first_damage_at_ms;
    if (actorRow.last_damage_at_ms !== null) actor.lastDamageAtMs = actorRow.last_damage_at_ms;
    actor.hits = actorRow.hits;
    actor.criticalHits = actorRow.critical_hits;
    actor.window = JSON.parse(actorRow.window_json) as ActorAggregate["window"];

    for (const skill of database
      .query("select source_id, source_label, damage, hits, critical_hits from combat_skills where session_id = ? and encounter_id = ? and meter = ? and actor_index = ?")
      .all(sessionId, open.id, meter, actorRow.actor_index) as { source_id: string; source_label: string; damage: number; hits: number; critical_hits: number }[]) {
      actor.skills.set(skill.source_id, {
        sourceId: skill.source_id,
        sourceLabel: skill.source_label,
        damage: skill.damage,
        hits: skill.hits,
        criticalHits: skill.critical_hits,
      });
    }

    for (const target of database
      .query("select target_id, damage from combat_targets where session_id = ? and encounter_id = ? and meter = ? and actor_index = ?")
      .all(sessionId, open.id, meter, actorRow.actor_index) as { target_id: number; damage: number }[]) {
      actor.targetIds.add(target.target_id);
      actor.targetDamage.set(target.target_id, target.damage);
    }

    for (const bucket of database
      .query("select origin, origin_ms, width_ms, bucket_index, damage from combat_timeline_buckets where session_id = ? and encounter_id = ? and meter = ? and actor_index = ? order by bucket_index")
      .all(sessionId, open.id, meter, actorRow.actor_index) as { origin: string; origin_ms: number; width_ms: number; bucket_index: number; damage: number }[]) {
      const series = bucket.origin === "actor" ? actor.actorSeries : actor.encounterSeries;
      series.originMs = bucket.origin_ms;
      series.widthMs = bucket.width_ms;
      while (series.buckets.length <= bucket.bucket_index) series.buckets.push(0);
      series.buckets[bucket.bucket_index] = bucket.damage;
    }

    aggregate.actors.push(actor);
    if (actorRow.active_slot === 1) aggregate.activeActors.set(actor.actorId, actor);
  }
  return aggregate;
}
