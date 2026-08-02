import type { Database } from "bun:sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";
import type { IndexStreamResult, ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { parseRewardLogRecord } from "../live-log.ts";
import { REWARDS_DOMAIN_NAME, REWARD_TABLES } from "./domain.ts";
import { REWARD_SQL } from "./sql.ts";

export interface IndexRewardStreamOptions { sessionId: string; sourcePath: string; batchBytes?: number }

export async function indexRewardStream(model: ReadModel, options: IndexRewardStreamOptions): Promise<IndexStreamResult> {
  return model.indexStream({ sessionId: options.sessionId, stream: "rewards", domain: REWARDS_DOMAIN_NAME, sourcePath: options.sourcePath, ...(options.batchBytes === undefined ? {} : { batchBytes: options.batchBytes }),
    apply(records, database) { let invalid = 0; for (const record of records) invalid += writeRecord(model, database, options.sessionId, record); return invalid; },
    clear(scope) { for (const table of REWARD_TABLES) model.statement(`delete from ${table} where session_id = $sessionId`).run({ sessionId: scope.sessionId }); },
  });
}

function writeRecord(model: ReadModel, _database: Database, sessionId: string, record: LogRecord): number {
  const event = parseRewardLogRecord(record.type, record.data); if (!event) return record.type === "rewards.kill" || record.type === "rewards.unmatched" ? 1 : 0;
  const atMs = Date.parse(record.recordedAt); if (!Number.isFinite(atMs)) return 1;
  if (event.kind === "kill") {
    const inserted = model.statement(REWARD_SQL.insertKill).run({ sessionId, killId: event.id, sequence: record.sequence, atMs, tick: event.tick, mobId: event.mob.mobId, displayName: event.mob.displayName, level: event.mob.level, rank: event.mob.rank ?? null, boss: event.mob.boss ? 1 : 0, objectId: event.mob.objectId, experience: event.experience, jobExperience: event.jobExperience, coins: event.coins, attributed: event.attributed ? 1 : 0 });
    if (inserted.changes === 0) return 0;
    for (const drop of event.drops) model.statement(REWARD_SQL.insertKillDrop).run({ sessionId, killId: event.id, category: drop.category, itemId: drop.itemId, count: drop.count });
    model.statement(REWARD_SQL.upsertMob).run({ sessionId, mobId: event.mob.mobId, displayName: event.mob.displayName, level: event.mob.level, boss: event.mob.boss ? 1 : 0, attributed: event.attributed ? 1 : 0, experience: event.experience, jobExperience: event.jobExperience, coins: event.coins });
    for (const drop of event.drops) model.statement(REWARD_SQL.upsertMobDrop).run({ sessionId, mobId: event.mob.mobId, category: drop.category, itemId: drop.itemId, count: drop.count });
  } else {
    const inserted = model.statement(REWARD_SQL.insertUnmatched).run({ sessionId, sequence: record.sequence, atMs, reason: event.reason, reward: event.reward, experience: event.reward === "experience" ? event.experience : 0, jobExperience: event.reward === "experience" ? event.jobExperience : 0 });
    if (inserted.changes === 0) return 0;
    for (const drop of event.drops) model.statement(REWARD_SQL.insertUnmatchedDrop).run({ sessionId, sequence: record.sequence, category: drop.category, itemId: drop.itemId, count: drop.count });
    model.statement(REWARD_SQL.upsertUnmatched).run({ sessionId, experience: event.reward === "experience" ? event.experience : 0, jobExperience: event.reward === "experience" ? event.jobExperience : 0, ambiguous: event.reason === "ambiguous" ? 1 : 0, expired: event.reason === "expired" ? 1 : 0, unidentified: event.reason === "unidentified" ? 1 : 0 });
  }
  return 0;
}
