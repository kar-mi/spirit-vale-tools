import type { FishNetMobRewardEvent } from "./reward-tracker.ts";
import type { RewardItem } from "./reward-decoder.ts";
import type { MobRewardMobSummary, RecordedMobRewardKill } from "./session.ts";

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

type MobAggregate = MobRewardMobSummary;

export class LiveRewardService {
  private readonly recentKillLimit: number;
  private readonly chartPoints: number;
  private readonly recent: RecordedMobRewardKill[] = [];
  private readonly mobsById = new Map<string, MobAggregate>();
  private readonly buckets: RewardChartBucket[] = [];
  private chartOriginMs?: number;
  private chartWidthMs = 1;
  private revisionValue = 0;
  private killCountValue = 0;
  private totalExperienceValue = 0;
  private totalJobExperienceValue = 0;
  private totalCoinsValue = 0n;
  private unmatchedValue = 0;
  private unmatchedDropsValue: RewardItem[] = [];
  private readonly reasons = { ambiguous: 0, expired: 0, unidentified: 0 };

  constructor(options: LiveRewardOptions = {}) {
    this.recentKillLimit = positive(options.recentKillLimit ?? 100, "recentKillLimit");
    this.chartPoints = positive(options.chartPoints ?? 720, "chartPoints");
  }

  consume(event: FishNetMobRewardEvent, context: LiveRewardConsumeContext = {}): void {
    const timestamp = timestampOf(context.recordedAt, event.tick);
    if (event.kind === "kill") {
      this.killCountValue += 1;
      this.totalExperienceValue += event.experience;
      this.totalJobExperienceValue += event.jobExperience;
      this.totalCoinsValue += event.coins;
      const kill = { ...event, ...(context.recordedAt === undefined ? {} : { recordedAt: new Date(timestamp).toISOString() }), mob: { ...event.mob }, drops: event.drops.map((drop) => ({ ...drop })) };
      this.recent.unshift(kill);
      this.recent.length = Math.min(this.recent.length, this.recentKillLimit);
      const mob = this.mobsById.get(event.mob.mobId) ?? { ...event.mob, kills: 0, attributedKills: 0, experience: 0, jobExperience: 0, coins: 0n, drops: [] };
      mob.kills += 1; if (event.attributed) mob.attributedKills += 1; mob.experience += event.experience; mob.jobExperience += event.jobExperience; mob.coins += event.coins;
      mob.drops = mergeItems(mob.drops, event.drops); this.mobsById.set(event.mob.mobId, mob);
      this.addChart(timestamp, event.experience, event.jobExperience, event.coins);
    } else {
      this.unmatchedValue += 1; this.reasons[event.reason] += 1;
      this.unmatchedDropsValue = mergeItems(this.unmatchedDropsValue, event.drops);
      if (event.reward === "experience") {
        this.totalExperienceValue += event.experience; this.totalJobExperienceValue += event.jobExperience;
        this.addChart(timestamp, event.experience, event.jobExperience, 0n);
      }
    }
    this.revisionValue += 1;
  }

  reset(): void {
    this.recent.length = 0; this.mobsById.clear(); this.buckets.length = 0;
    this.chartOriginMs = undefined; this.chartWidthMs = 1;
    this.revisionValue += 1; this.killCountValue = 0; this.totalExperienceValue = 0; this.totalJobExperienceValue = 0; this.totalCoinsValue = 0n;
    this.unmatchedValue = 0; this.unmatchedDropsValue = []; this.reasons.ambiguous = 0; this.reasons.expired = 0; this.reasons.unidentified = 0;
  }

  snapshot(): RewardAggregateSnapshot {
    return {
      revision: this.revisionValue, killCount: this.killCountValue,
      recentKills: this.recent.map(cloneKill),
      mobs: [...this.mobsById.values()].sort((a, b) => b.kills - a.kills || a.displayName.localeCompare(b.displayName)).map(cloneMob),
      chart: this.buckets.map((bucket) => ({ ...bucket })), totalExperience: this.totalExperienceValue,
      totalJobExperience: this.totalJobExperienceValue, totalCoins: this.totalCoinsValue,
      unmatched: this.unmatchedValue, unmatchedDrops: this.unmatchedDropsValue.map((drop) => ({ ...drop })), unmatchedByReason: { ...this.reasons },
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
function mergeItems(left: readonly RewardItem[], right: readonly RewardItem[]): RewardItem[] { const map = new Map<string, RewardItem>(); for (const item of [...left, ...right]) { const key = `${item.category}|${item.itemId}`; const old = map.get(key); if (old) old.count += item.count; else map.set(key, { ...item }); } return [...map.values()]; }
function cloneKill(kill: RecordedMobRewardKill): RecordedMobRewardKill { return { ...kill, mob: { ...kill.mob }, drops: kill.drops.map((drop) => ({ ...drop })) }; }
function cloneMob(mob: MobAggregate): MobAggregate { return { ...mob, drops: mob.drops.map((drop) => ({ ...drop })) }; }
