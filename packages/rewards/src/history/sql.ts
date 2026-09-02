/** All rewards SQL lives here so schema, importer, and store changes are reviewable together. */
export const REWARD_SQL = {
  insertKill: `insert or ignore into reward_kills
    (session_id, kill_id, sequence, recorded_at_ms, tick, mob_id, display_name, mob_level, mob_rank, boss, object_id, experience, job_experience, coins, attributed)
    values ($sessionId, $killId, $sequence, $atMs, $tick, $mobId, $displayName, $level, $rank, $boss, $objectId, $experience, $jobExperience, $coins, $attributed)`,
  insertKillDrop: `insert or replace into reward_drops
    (session_id, kill_id, category, item_id, count) values ($sessionId, $killId, $category, $itemId, $count)`,
  upsertMob: `insert into reward_mob_totals
    (session_id, mob_id, display_name, mob_level, boss, kills, attributed_kills, experience, job_experience, coins)
    values ($sessionId, $mobId, $displayName, $level, $boss, 1, $attributed, $experience, $jobExperience, $coins)
    on conflict(session_id, mob_id) do update set
      kills = kills + 1, attributed_kills = attributed_kills + excluded.attributed_kills,
      experience = experience + excluded.experience,
      job_experience = job_experience + excluded.job_experience, coins = coins + excluded.coins`,
  upsertMobDrop: `insert into reward_mob_drops
    (session_id, mob_id, category, item_id, count) values ($sessionId, $mobId, $category, $itemId, $count)
    on conflict(session_id, mob_id, category, item_id) do update set count = count + excluded.count`,
  insertUnmatched: `insert or ignore into reward_unmatched_events
    (session_id, sequence, recorded_at_ms, reason, reward, experience, job_experience, coins)
    values ($sessionId, $sequence, $atMs, $reason, $reward, $experience, $jobExperience, $coins)`,
  insertUnmatchedDrop: `insert or replace into reward_unmatched_drops
    (session_id, sequence, category, item_id, count) values ($sessionId, $sequence, $category, $itemId, $count)`,
  upsertUnmatched: `insert into reward_unmatched_totals
    (session_id, unmatched, experience, job_experience, coins, ambiguous, expired, unidentified)
    values ($sessionId, 1, $experience, $jobExperience, $coins, $ambiguous, $expired, $unidentified)
    on conflict(session_id) do update set
      unmatched = unmatched + 1, experience = experience + excluded.experience,
      job_experience = job_experience + excluded.job_experience, coins = coins + excluded.coins,
      ambiguous = ambiguous + excluded.ambiguous, expired = expired + excluded.expired,
      unidentified = unidentified + excluded.unidentified`,
  summaryKills: "select coalesce(sum(experience), 0) as experience, coalesce(sum(job_experience), 0) as job_experience, coalesce(sum(coins), 0) as coins, count(*) as kills from reward_kills where session_id = $sessionId",
  summaryUnmatched: "select coalesce(unmatched, 0) as unmatched, coalesce(experience, 0) as experience, coalesce(job_experience, 0) as job_experience, coalesce(coins, 0) as coins, coalesce(ambiguous, 0) as ambiguous, coalesce(expired, 0) as expired, coalesce(unidentified, 0) as unidentified from reward_unmatched_totals where session_id = $sessionId",
  listKills: "select * from reward_kills where session_id = $sessionId",
  chartKills: "select recorded_at_ms, experience, job_experience, coins from reward_kills where session_id = $sessionId order by recorded_at_ms, sequence",
  chart: `with events as (
      select recorded_at_ms, experience, job_experience, coins from reward_kills where session_id = $sessionId
      union all
      select recorded_at_ms, experience, job_experience, coins from reward_unmatched_events where session_id = $sessionId
    ), bounds as (select min(recorded_at_ms) as first_ms, max(recorded_at_ms) as last_ms from events),
    params as (select first_ms, max(1, (last_ms - first_ms + $maxPoints) / $maxPoints) as width_ms from bounds)
    select first_ms + ((recorded_at_ms - first_ms) / width_ms) * width_ms as start_ms,
      first_ms + (((recorded_at_ms - first_ms) / width_ms) + 1) * width_ms as end_ms,
      sum(experience) as experience, sum(job_experience) as job_experience, sum(coins) as coins
    from events cross join params group by (recorded_at_ms - first_ms) / width_ms order by start_ms`,
  listMobs: "select * from reward_mob_totals where session_id = $sessionId order by kills desc, display_name",
  listMobDrops: "select category, item_id, count from reward_mob_drops where session_id = $sessionId and mob_id = $mobId order by category, item_id",
  listDrops: "select category, item_id, count from reward_drops where session_id = $sessionId and kill_id = $killId order by category, item_id",
  listUnmatchedDrops: "select category, item_id, sum(count) as count from reward_unmatched_drops where session_id = $sessionId group by category, item_id order by category, item_id",
} as const;
