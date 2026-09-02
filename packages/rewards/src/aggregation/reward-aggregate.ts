import type { RewardItem } from "../tracking/reward-decoder.ts";
import type { FishNetConfirmedMobKill, FishNetMobRewardEvent } from "../tracking/reward-tracker.ts";

export interface MobRewardMobSummary {
  mobId: string;
  displayName: string;
  level: number;
  boss: boolean;
  kills: number;
  attributedKills: number;
  experience: number;
  jobExperience: number;
  coins: bigint;
  drops: RewardItem[];
}

export interface RecordedMobRewardKill extends FishNetConfirmedMobKill {
  recordedAt?: string;
}

export interface RewardAggregateCoreSnapshot {
  kills: RecordedMobRewardKill[];
  mobs: MobRewardMobSummary[];
  totalExperience: number;
  totalJobExperience: number;
  totalCoins: bigint;
  unmatched: number;
  unmatchedDrops: RewardItem[];
  unmatchedByReason: { ambiguous: number; expired: number; unidentified: number };
}

/** Canonical reward fold shared by full-history, bounded-live, and persisted projections. */
export class RewardAccumulator {
  private readonly kills = new Map<string, RecordedMobRewardKill>();
  private readonly mobs = new Map<string, MobRewardMobSummary>();
  private totalExperience = 0;
  private totalJobExperience = 0;
  private totalCoins = 0n;
  private unmatched = 0;
  private unmatchedDrops: RewardItem[] = [];
  private readonly unmatchedByReason = { ambiguous: 0, expired: 0, unidentified: 0 };

  /** Returns false when a duplicate kill id was already folded. */
  consume(event: FishNetMobRewardEvent, recordedAt?: string): boolean {
    if (event.kind === "unmatched") {
      this.unmatched += 1;
      this.unmatchedByReason[event.reason] += 1;
      this.unmatchedDrops = mergeRewardItems(this.unmatchedDrops, event.drops);
      if (event.reward === "experience") {
        this.totalExperience += event.experience;
        this.totalJobExperience += event.jobExperience;
        this.totalCoins += event.coins;
      }
      return true;
    }

    if (this.kills.has(event.id)) return false;
    const kill = cloneRewardKill({ ...event, ...(recordedAt === undefined ? {} : { recordedAt }) });
    this.kills.set(event.id, kill);
    this.totalExperience += event.experience;
    this.totalJobExperience += event.jobExperience;
    this.totalCoins += event.coins;

    const mob = this.mobs.get(event.mob.mobId) ?? {
      mobId: event.mob.mobId,
      displayName: event.mob.displayName,
      level: event.mob.level,
      boss: event.mob.boss,
      kills: 0,
      attributedKills: 0,
      experience: 0,
      jobExperience: 0,
      coins: 0n,
      drops: [],
    };
    mob.kills += 1;
    if (event.attributed) mob.attributedKills += 1;
    mob.experience += event.experience;
    mob.jobExperience += event.jobExperience;
    mob.coins += event.coins;
    mob.drops = mergeRewardItems(mob.drops, event.drops);
    this.mobs.set(event.mob.mobId, mob);
    return true;
  }

  snapshot(killLimit = Number.POSITIVE_INFINITY): RewardAggregateCoreSnapshot {
    const kills = [...this.kills.values()]
      .sort((left, right) => right.tick - left.tick)
      .slice(0, killLimit)
      .map(cloneRewardKill);
    return {
      kills,
      mobs: [...this.mobs.values()]
        .sort((left, right) => right.kills - left.kills || left.displayName.localeCompare(right.displayName))
        .map(cloneRewardMob),
      totalExperience: this.totalExperience,
      totalJobExperience: this.totalJobExperience,
      totalCoins: this.totalCoins,
      unmatched: this.unmatched,
      unmatchedDrops: this.unmatchedDrops.map((item) => ({ ...item })),
      unmatchedByReason: { ...this.unmatchedByReason },
    };
  }

  get killCount(): number {
    return this.kills.size;
  }

  reset(): void {
    this.kills.clear();
    this.mobs.clear();
    this.totalExperience = 0;
    this.totalJobExperience = 0;
    this.totalCoins = 0n;
    this.unmatched = 0;
    this.unmatchedDrops = [];
    this.unmatchedByReason.ambiguous = 0;
    this.unmatchedByReason.expired = 0;
    this.unmatchedByReason.unidentified = 0;
  }
}

export function mergeRewardItems(left: readonly RewardItem[], right: readonly RewardItem[]): RewardItem[] {
  const values = new Map<string, RewardItem>();
  for (const item of [...left, ...right]) {
    const key = `${item.category}|${item.itemId}`;
    const previous = values.get(key);
    if (previous) previous.count += item.count;
    else values.set(key, { ...item });
  }
  return [...values.values()];
}

export function cloneRewardKill(kill: RecordedMobRewardKill): RecordedMobRewardKill {
  return { ...kill, mob: { ...kill.mob }, drops: kill.drops.map((item) => ({ ...item })) };
}

function cloneRewardMob(mob: MobRewardMobSummary): MobRewardMobSummary {
  return { ...mob, drops: mob.drops.map((item) => ({ ...item })) };
}
