import type { FishNetMobRewardEvent } from "../tracking/reward-tracker.ts";
import { RewardAccumulator } from "./reward-aggregate.ts";
import type { RewardAggregateCoreSnapshot } from "./reward-aggregate.ts";

export type { MobRewardMobSummary, RecordedMobRewardKill } from "./reward-aggregate.ts";

export interface MobRewardSessionSnapshot extends RewardAggregateCoreSnapshot {}

export interface MobRewardSessionConsumeContext {
  recordedAt?: string;
}

export class MobRewardSession {
  private readonly aggregate = new RewardAccumulator();

  consume(event: FishNetMobRewardEvent, context: MobRewardSessionConsumeContext = {}): void {
    this.aggregate.consume(event, context.recordedAt);
  }

  snapshot(): MobRewardSessionSnapshot {
    return this.aggregate.snapshot();
  }

  reset(): void {
    this.aggregate.reset();
  }
}

export function emptySnapshot(): MobRewardSessionSnapshot {
  return {
    kills: [], mobs: [], totalExperience: 0, totalJobExperience: 0, totalCoins: 0n, unmatched: 0, unmatchedDrops: [],
    unmatchedByReason: { ambiguous: 0, expired: 0, unidentified: 0 },
  };
}
