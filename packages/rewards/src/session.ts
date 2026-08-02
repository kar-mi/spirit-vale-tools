import type { FishNetConfirmedMobKill, FishNetMobRewardEvent } from "./reward-tracker.ts";
import type { RewardItem } from "./reward-decoder.ts";

export interface MobRewardMobSummary {
  mobId: string;
  displayName: string;
  level: number;
  boss: boolean;
  kills: number;
  /** Kills a reward could be pinned to. The rest still count, but contribute no experience or loot. */
  attributedKills: number;
  experience: number;
  jobExperience: number;
  coins: bigint;
  drops: RewardItem[];
}

export interface MobRewardSessionSnapshot {
  kills: RecordedMobRewardKill[];
  mobs: MobRewardMobSummary[];
  totalExperience: number;
  totalJobExperience: number;
  totalCoins: bigint;
  unmatched: number;
  unmatchedDrops: RewardItem[];
  unmatchedByReason: {
    ambiguous: number;
    expired: number;
    unidentified: number;
  };
}

export interface RecordedMobRewardKill extends FishNetConfirmedMobKill {
  recordedAt?: string;
}

export interface MobRewardSessionConsumeContext {
  recordedAt?: string;
}

export class MobRewardSession {
  private readonly kills = new Map<string, RecordedMobRewardKill>();
  private unmatched = 0;
  private unmatchedExperience = 0;
  private unmatchedJobExperience = 0;
  private unmatchedDrops: RewardItem[] = [];
  private readonly unmatchedByReason = { ambiguous: 0, expired: 0, unidentified: 0 };

  consume(event: FishNetMobRewardEvent, context: MobRewardSessionConsumeContext = {}): void {
    if (event.kind === "unmatched") {
      this.unmatched += 1;
      this.unmatchedByReason[event.reason] += 1;
      this.unmatchedDrops = mergeItems(this.unmatchedDrops, event.drops);
      if (event.reward === "experience") {
        this.unmatchedExperience += event.experience;
        this.unmatchedJobExperience += event.jobExperience;
      }
    }
    else this.kills.set(event.id, cloneKill({ ...event, ...context }));
  }

  snapshot(): MobRewardSessionSnapshot {
    const kills = [...this.kills.values()].sort((left, right) => right.tick - left.tick).map(cloneKill);
    const mobs = new Map<string, MobRewardMobSummary>();
    let totalExperience = this.unmatchedExperience;
    let totalJobExperience = this.unmatchedJobExperience;
    let totalCoins = 0n;
    for (const kill of kills) {
      totalExperience += kill.experience;
      totalJobExperience += kill.jobExperience;
      totalCoins += kill.coins;
      const current = mobs.get(kill.mob.mobId) ?? {
        mobId: kill.mob.mobId,
        displayName: kill.mob.displayName,
        level: kill.mob.level,
        boss: kill.mob.boss,
        kills: 0,
        attributedKills: 0,
        experience: 0,
        jobExperience: 0,
        coins: 0n,
        drops: [],
      };
      current.kills += 1;
      if (kill.attributed) current.attributedKills += 1;
      current.experience += kill.experience;
      current.jobExperience += kill.jobExperience;
      current.coins += kill.coins;
      current.drops = mergeItems(current.drops, kill.drops);
      mobs.set(kill.mob.mobId, current);
    }
    return {
      kills,
      mobs: [...mobs.values()].sort((left, right) => right.kills - left.kills || left.displayName.localeCompare(right.displayName)),
      totalExperience,
      totalJobExperience,
      totalCoins,
      unmatched: this.unmatched,
      unmatchedDrops: this.unmatchedDrops.map((item) => ({ ...item })),
      unmatchedByReason: { ...this.unmatchedByReason },
    };
  }

  reset(): void {
    this.kills.clear();
    this.unmatched = 0;
    this.unmatchedExperience = 0;
    this.unmatchedJobExperience = 0;
    this.unmatchedDrops = [];
    this.unmatchedByReason.ambiguous = 0;
    this.unmatchedByReason.expired = 0;
    this.unmatchedByReason.unidentified = 0;
  }
}

function cloneKill(kill: RecordedMobRewardKill): RecordedMobRewardKill {
  return { ...kill, mob: { ...kill.mob }, drops: kill.drops.map((item) => ({ ...item })) };
}

function mergeItems(left: readonly RewardItem[], right: readonly RewardItem[]): RewardItem[] {
  const values = new Map<string, RewardItem>();
  for (const item of [...left, ...right]) {
    const key = `${item.category}|${item.itemId}`;
    const previous = values.get(key);
    if (previous) previous.count += item.count;
    else values.set(key, { ...item });
  }
  return [...values.values()];
}
