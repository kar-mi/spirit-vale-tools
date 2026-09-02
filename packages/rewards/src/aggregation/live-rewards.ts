import type { FishNetMobRewardEvent } from "../tracking/reward-tracker.ts";
import type { RewardItem } from "../tracking/reward-decoder.ts";
import type { MobRewardMobSummary, RecordedMobRewardKill } from "./session.ts";
import { RewardAccumulator } from "./reward-aggregate.ts";

export interface RewardChartBucket {
  startMs: number;
  endMs: number;
  experience: number;
  jobExperience: number;
  coins: bigint;
}

export interface RewardAggregateSnapshot {
  revision: number;
  killCount: number;
  recentKills: RecordedMobRewardKill[];
  mobs: MobRewardMobSummary[];
  chart: RewardChartBucket[];
  totalExperience: number;
  totalJobExperience: number;
  totalCoins: bigint;
  unmatched: number;
  unmatchedDrops: RewardItem[];
  unmatchedByReason: { ambiguous: number; expired: number; unidentified: number };
}

export interface LiveRewardOptions {
  recentKillLimit?: number;
  chartPoints?: number;
}

export interface LiveRewardConsumeContext { recordedAt?: string | number }

export class LiveRewardService {
  private readonly recentKillLimit: number;
  private readonly chartPoints: number;
  private readonly aggregate = new RewardAccumulator();
  private readonly buckets: RewardChartBucket[] = [];
  private chartOriginMs?: number;
  private chartWidthMs = 1;
  private revisionValue = 0;

  constructor(options: LiveRewardOptions = {}) {
    this.recentKillLimit = positive(options.recentKillLimit ?? 100, "recentKillLimit");
    this.chartPoints = positive(options.chartPoints ?? 720, "chartPoints");
  }

  consume(event: FishNetMobRewardEvent, context: LiveRewardConsumeContext = {}): void {
    const timestamp = timestampOf(context.recordedAt, event.tick);
    const recordedAt = context.recordedAt === undefined ? undefined : new Date(timestamp).toISOString();
    if (!this.aggregate.consume(event, recordedAt)) return;
    if (event.kind === "kill") {
      this.addChart(timestamp, event.experience, event.jobExperience, event.coins);
    } else if (event.reward === "experience") {
      this.addChart(timestamp, event.experience, event.jobExperience, event.coins);
    }
    this.revisionValue += 1;
  }

  reset(): void {
    this.aggregate.reset(); this.buckets.length = 0;
    this.chartOriginMs = undefined; this.chartWidthMs = 1;
    this.revisionValue += 1;
  }

  snapshot(): RewardAggregateSnapshot {
    const core = this.aggregate.snapshot(this.recentKillLimit);
    return {
      revision: this.revisionValue, killCount: this.aggregate.killCount,
      recentKills: core.kills, mobs: core.mobs,
      chart: this.buckets.map((bucket) => ({ ...bucket })), totalExperience: core.totalExperience,
      totalJobExperience: core.totalJobExperience, totalCoins: core.totalCoins,
      unmatched: core.unmatched, unmatchedDrops: core.unmatchedDrops, unmatchedByReason: core.unmatchedByReason,
    };
  }

  private addChart(atMs: number, experience: number, jobExperience: number, coins: bigint): void {
    this.chartOriginMs ??= atMs;
    let index = Math.max(0, Math.floor((atMs - this.chartOriginMs) / this.chartWidthMs));
    while (index >= this.chartPoints) {
      this.collapseChart();
      index = Math.max(0, Math.floor((atMs - this.chartOriginMs) / this.chartWidthMs));
    }
    while (this.buckets.length <= index) {
      const startMs = this.chartOriginMs + this.buckets.length * this.chartWidthMs;
      this.buckets.push({ startMs, endMs: startMs + this.chartWidthMs, experience: 0, jobExperience: 0, coins: 0n });
    }
    const bucket = this.buckets[index]!;
    bucket.experience += experience; bucket.jobExperience += jobExperience; bucket.coins += coins;
  }

  private collapseChart(): void {
    const compacted: RewardChartBucket[] = [];
    const widthMs = this.chartWidthMs * 2;
    for (let index = 0; index < this.buckets.length; index += 2) {
      const left = this.buckets[index]!; const right = this.buckets[index + 1];
      const startMs = this.chartOriginMs! + compacted.length * widthMs;
      compacted.push({ startMs, endMs: startMs + widthMs, experience: left.experience + (right?.experience ?? 0), jobExperience: left.jobExperience + (right?.jobExperience ?? 0), coins: left.coins + (right?.coins ?? 0n) });
    }
    this.buckets.splice(0, this.buckets.length, ...compacted);
    this.chartWidthMs = widthMs;
  }
}

function positive(value: number, name: string): number { if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive integer`); return value; }
function timestampOf(value: string | number | undefined, fallback: number): number { const result = typeof value === "number" ? value : value === undefined ? fallback : Date.parse(value); return Number.isFinite(result) ? result : fallback; }
