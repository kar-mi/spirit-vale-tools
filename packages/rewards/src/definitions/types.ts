import type { MobDropCategory, MobRewardDefinition } from "../catalog.ts";

export interface MobDropSourceDefinition {
  readonly category: MobDropCategory;
  readonly itemId: string;
  readonly count: number;
  readonly chance: number;
}

export type MobRewardSourceDefinition = Omit<MobRewardDefinition, "drops"> & {
  readonly drops: readonly MobDropSourceDefinition[];
};
