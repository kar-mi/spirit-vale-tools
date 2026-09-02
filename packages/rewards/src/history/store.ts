import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { RewardItem } from "../tracking/reward-decoder.ts";
import type { MobRewardMobSummary, RecordedMobRewardKill } from "../aggregation/session.ts";
import type { RewardAggregateSnapshot, RewardChartBucket } from "../aggregation/live-rewards.ts";
import { REWARD_SQL } from "./sql.ts";

export interface Page<T> { items: T[]; nextCursor?: string }
export interface ListRewardKillsQuery { sessionId: string; cursor?: string; limit?: number; mobId?: string }
export interface RewardChartPoint { startMs: number; endMs: number; value: number | bigint }
export type RewardChartMetric = "experience" | "jobExperience" | "coins";
export interface RewardSummaryOptions { recentKillLimit?: number; chartPoints?: number }
export interface RewardAggregateSummary extends Omit<RewardAggregateSnapshot, "recentKills" | "chart"> { recentKills: RecordedMobRewardKill[]; chart: RewardChartBucket[] }

const DEFAULT_LIMIT = 50;
const DEFAULT_RECENT_KILLS = 100;
const MAX_LIMIT = 500;

export class RewardHistoryStore {
  constructor(private readonly model: ReadModel) {}

  getSummary(sessionId: string, options: RewardSummaryOptions = {}): RewardAggregateSummary {
    const limit = clamp(options.recentKillLimit ?? DEFAULT_RECENT_KILLS);
    const total = this.model.bigintStatement(REWARD_SQL.summaryKills).get({ sessionId }) as { experience: number; job_experience: number; coins: bigint; kills: number };
    const unmatched = this.model.bigintStatement(REWARD_SQL.summaryUnmatched).get({ sessionId }) as { unmatched: number; experience: number; job_experience: number; coins: bigint; ambiguous: number; expired: number; unidentified: number } | null;
    const revision = this.model.health().streams.find((stream) => stream.sessionId === sessionId && stream.domain === "rewards")?.lastSequence ?? 0;
    return { revision, killCount: num(total.kills), recentKills: this.listKills({ sessionId, limit }).items, mobs: this.listMobs(sessionId), chart: this.getChartBuckets(sessionId, options.chartPoints ?? 720), totalExperience: num(total.experience) + num(unmatched?.experience ?? 0), totalJobExperience: num(total.job_experience) + num(unmatched?.job_experience ?? 0), totalCoins: total.coins + (unmatched?.coins ?? 0n), unmatched: num(unmatched?.unmatched ?? 0), unmatchedDrops: this.listUnmatchedDrops(sessionId), unmatchedByReason: { ambiguous: num(unmatched?.ambiguous ?? 0), expired: num(unmatched?.expired ?? 0), unidentified: num(unmatched?.unidentified ?? 0) } };
  }

  listKills(query: ListRewardKillsQuery): Page<RecordedMobRewardKill> {
    const limit = clamp(query.limit ?? DEFAULT_LIMIT); const cursor = query.cursor ? decode(query.cursor) : undefined;
    const where = query.mobId ? " and mob_id = $mobId" : "";
    const after = cursor ? " and (sequence < $sequence or (sequence = $sequence and kill_id < $killId))" : "";
    const rows = this.model.bigintStatement(`${REWARD_SQL.listKills}${where}${after} order by sequence desc, kill_id desc limit $limit`).all({ sessionId: query.sessionId, ...(query.mobId ? { mobId: query.mobId } : {}), ...(cursor ? { sequence: BigInt(cursor.sequence), killId: cursor.killId } : {}), limit: BigInt(limit + 1) }) as KillRow[];
    const page = rows.slice(0, limit); const last = page.at(-1);
    return { items: page.map((row) => ({ kind: "kill" as const, id: row.kill_id, tick: num(row.tick), mob: { objectId: num(row.object_id), mobId: row.mob_id, displayName: row.display_name, level: num(row.mob_level), ...(row.mob_rank === null ? {} : { rank: num(row.mob_rank) }), boss: num(row.boss) === 1 }, experience: num(row.experience), jobExperience: num(row.job_experience), coins: row.coins, drops: this.drops(query.sessionId, row.kill_id), attributed: num(row.attributed) === 1, recordedAt: new Date(num(row.recorded_at_ms)).toISOString() })), ...(rows.length > limit && last ? { nextCursor: encode({ sequence: num(last.sequence), killId: last.kill_id }) } : {}) };
  }

  getChart(query: { sessionId: string; metric: RewardChartMetric; maxPoints?: number }): RewardChartPoint[] { return this.getChartBuckets(query.sessionId, query.maxPoints ?? 720).map((bucket) => ({ startMs: bucket.startMs, endMs: bucket.endMs, value: bucket[query.metric] })); }

  private getChartBuckets(sessionId: string, maxPoints: number): RewardChartBucket[] {
    if (!Number.isSafeInteger(maxPoints) || maxPoints < 1) throw new RangeError("maxPoints must be a positive integer");
    const rows = this.model.bigintStatement(REWARD_SQL.chart).all({ sessionId, maxPoints: BigInt(maxPoints) }) as ChartRow[];
    return rows.map((row) => ({ startMs: num(row.start_ms), endMs: num(row.end_ms), experience: num(row.experience), jobExperience: num(row.job_experience), coins: row.coins }));
  }
  private listMobs(sessionId: string): MobRewardMobSummary[] { return (this.model.bigintStatement(REWARD_SQL.listMobs).all({ sessionId }) as MobRow[]).map((row) => { const drops = this.model.statement(REWARD_SQL.listMobDrops).all({ sessionId, mobId: row.mob_id }) as DropRow[]; return { mobId: row.mob_id, displayName: row.display_name, level: num(row.mob_level), boss: num(row.boss) === 1, kills: num(row.kills), attributedKills: num(row.attributed_kills), experience: num(row.experience), jobExperience: num(row.job_experience), coins: row.coins, drops: drops.map(dropItem) }; }); }
  private drops(sessionId: string, killId: string): RewardItem[] { return (this.model.statement(REWARD_SQL.listDrops).all({ sessionId, killId }) as DropRow[]).map(dropItem); }
  private listUnmatchedDrops(sessionId: string): RewardItem[] { return (this.model.statement(REWARD_SQL.listUnmatchedDrops).all({ sessionId }) as DropRow[]).map(dropItem); }
}

interface KillRow { kill_id: string; sequence: number; recorded_at_ms: number; tick: number; mob_id: string; display_name: string; mob_level: number; mob_rank: number | null; boss: number; object_id: number; experience: number; job_experience: number; coins: bigint; attributed: number }
interface MobRow { mob_id: string; display_name: string; mob_level: number; boss: number; kills: number; attributed_kills: number; experience: number; job_experience: number; coins: bigint }
interface ChartRow { start_ms: number; end_ms: number; experience: number; job_experience: number; coins: bigint }
interface DropRow { category: string; item_id: string; count: number }
function dropItem(drop: DropRow): RewardItem { return { category: drop.category as RewardItem["category"], itemId: drop.item_id, count: drop.count }; }
function num(value: number | bigint): number { return typeof value === "bigint" ? Number(value) : value; }
function clamp(value: number): number { if (!Number.isSafeInteger(value) || value < 1) throw new RangeError("limit must be a positive integer"); return Math.min(MAX_LIMIT, value); }
function encode(value: { sequence: number; killId: string }): string { return Buffer.from(JSON.stringify(value)).toString("base64url"); }
function decode(value: string): { sequence: number; killId: string } { try { const parsed = JSON.parse(Buffer.from(value, "base64url").toString()) as { sequence: number; killId: string }; if (!Number.isSafeInteger(parsed.sequence) || typeof parsed.killId !== "string") throw new Error(); return parsed; } catch { throw new Error("invalid reward cursor"); } }
