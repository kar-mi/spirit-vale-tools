import { FishNetCombatTracker } from "@kar-mi/spirit-vale-tools-combat";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetMonsterDirectory } from "@kar-mi/spirit-vale-tools-capture";
import type { ExperienceCoinsState, RewardItem } from "./reward-decoder.ts";
import { decodeFishNetRewardPacket } from "./reward-decoder.ts";
import { loadBundledMobRewardCatalog } from "./catalog.ts";
import type { MobRewardCatalog, MobRewardDefinition } from "./catalog.ts";

export interface FishNetMobIdentity {
  objectId: number;
  mobId: string;
  displayName: string;
  level: number;
  rank?: number;
  boss: boolean;
}

export interface FishNetConfirmedMobKill {
  kind: "kill";
  id: string;
  tick: number;
  mob: FishNetMobIdentity;
  experience: number;
  jobExperience: number;
  coins: bigint;
  drops: RewardItem[];
}

interface FishNetUnmatchedRewardEventBase {
  kind: "unmatched";
  tick: number;
  reason: "ambiguous" | "expired" | "unidentified";
  drops: RewardItem[];
}

export interface FishNetUnmatchedExperienceEvent extends FishNetUnmatchedRewardEventBase {
  reward: "experience";
  experience: number;
  jobExperience: number;
  coins: bigint;
}

export interface FishNetUnmatchedPickupEvent extends FishNetUnmatchedRewardEventBase {
  reward: "pickup";
}

export type FishNetUnmatchedRewardEvent = FishNetUnmatchedExperienceEvent | FishNetUnmatchedPickupEvent;

export type FishNetMobRewardEvent = FishNetConfirmedMobKill | FishNetUnmatchedRewardEvent;

export interface FishNetMobRewardTrackerOptions {
  catalog?: MobRewardCatalog;
  correlationWindowTicks?: number;
}

interface PendingKill {
  id: string;
  tick: number;
  mob?: FishNetMobIdentity;
  gain?: { experience: number; jobExperience: number; coins: bigint };
  drops: RewardItem[];
  ambiguous: boolean;
}

/** Names the monsters {@link FishNetMonsterDirectory} identifies, using the bundled reward catalog. */
export class FishNetMobDirectory {
  private readonly definitions: Map<string, MobRewardDefinition>;
  private readonly monsters: FishNetMonsterDirectory;

  constructor(catalog: MobRewardCatalog = loadBundledMobRewardCatalog()) {
    this.definitions = new Map(catalog.mobs.map((mob) => [mob.id, mob]));
    this.monsters = new FishNetMonsterDirectory(this.definitions);
  }

  consume(packet: DecodedFishNetPacket): void {
    this.monsters.consume(packet);
  }

  get(objectId: number): FishNetMobIdentity | undefined {
    const spawn = this.monsters.get(objectId);
    const definition = spawn && this.definitions.get(spawn.mobId);
    if (!spawn || !definition) return undefined;
    return {
      objectId,
      mobId: spawn.mobId,
      displayName: definition.displayName,
      level: spawn.level,
      ...(spawn.rank === undefined ? {} : { rank: spawn.rank }),
      boss: definition.boss,
    };
  }

  reset(): void { this.monsters.reset(); }
}

export class FishNetMobRewardTracker {
  private readonly catalog: MobRewardCatalog;
  private readonly correlationWindowTicks: number;
  private readonly combat: FishNetCombatTracker;
  private readonly mobs: FishNetMobDirectory;
  private readonly pending: PendingKill[] = [];
  private readonly queuedEvents: FishNetUnmatchedRewardEvent[] = [];
  private baseline?: ExperienceCoinsState;
  private nextKill = 1;

  constructor(options: FishNetMobRewardTrackerOptions = {}) {
    this.catalog = options.catalog ?? loadBundledMobRewardCatalog();
    const window = options.correlationWindowTicks ?? 30;
    if (!Number.isInteger(window) || window < 0) throw new Error("correlationWindowTicks must be a non-negative integer");
    this.correlationWindowTicks = window;
    this.combat = new FishNetCombatTracker({ buildFingerprint: this.catalog.buildFingerprint });
    this.mobs = new FishNetMobDirectory(this.catalog);
  }

  consume(packet: DecodedFishNetPacket): FishNetMobRewardEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      const events = this.flush();
      this.reset();
      return events;
    }
    const events = this.finalizeBefore(packet.tick - this.correlationWindowTicks);
    this.mobs.consume(packet);
    for (const event of this.combat.consume(packet)) {
      if (event.kind !== "death") continue;
      this.pending.push({
        id: `kill-${this.nextKill++}`,
        tick: event.tick,
        mob: this.mobs.get(event.targetId),
        drops: [],
        ambiguous: false,
      });
    }
    const reward = decodeFishNetRewardPacket(packet);
    if (reward?.kind === "experienceState") this.consumeExperience(reward.tick, reward.state);
    if (reward?.kind === "pickup" && reward.items.length > 0) this.attach(reward.tick, "pickup", reward.items);
    events.push(...this.queuedEvents.splice(0));
    return events;
  }

  flush(): FishNetMobRewardEvent[] {
    return this.finalizeBefore(Number.POSITIVE_INFINITY);
  }

  /**
   * Finalizes pending kills across a session-rotation boundary without discarding the
   * experience/coins baseline or known mob identities, so rewards immediately after the
   * boundary are still correctly attributed.
   */
  flushSessionBoundary(): FishNetMobRewardEvent[] {
    const events = [...this.flush(), ...this.queuedEvents.splice(0)];
    this.combat.reset();
    return events.sort((left, right) => left.tick - right.tick);
  }

  reset(): void {
    this.pending.length = 0;
    this.queuedEvents.length = 0;
    this.baseline = undefined;
    this.combat.reset();
    this.mobs.reset();
  }

  private consumeExperience(tick: number, next: ExperienceCoinsState): void {
    const previous = this.baseline;
    this.baseline = next;
    if (!previous) return;
    const experience = progressGain(previous.level, previous.experience, next.level, next.experience, this.catalog.experienceRequirements);
    const jobExperience = progressGain(previous.jobLevel, previous.jobExperience, next.jobLevel, next.jobExperience, this.catalog.experienceRequirements);
    const coins = next.coins > previous.coins ? next.coins - previous.coins : 0n;
    if (experience <= 0 && jobExperience <= 0 && coins === 0n) return;
    this.attach(tick, "experience", { experience, jobExperience, coins });
  }

  private attach(
    tick: number,
    reward: "experience" | "pickup",
    value: RewardItem[] | { experience: number; jobExperience: number; coins: bigint },
  ): void {
    const candidates = this.pending.filter((kill) => tick >= kill.tick && tick - kill.tick <= this.correlationWindowTicks);
    if (candidates.length !== 1) {
      for (const candidate of candidates) candidate.ambiguous = true;
      const reason = candidates.length === 0 ? "expired" : "ambiguous";
      if (reward === "experience") {
        this.queuedEvents.push({
          kind: "unmatched",
          tick,
          reason,
          reward,
          ...(value as { experience: number; jobExperience: number; coins: bigint }),
          drops: [],
        });
      } else {
        this.queuedEvents.push({
          kind: "unmatched",
          tick,
          reason,
          reward,
          drops: (value as RewardItem[]).map((item) => ({ ...item })),
        });
      }
      return;
    }
    const [candidate] = candidates;
    if (!candidate) return;
    if (reward === "experience") candidate.gain = value as { experience: number; jobExperience: number; coins: bigint };
    else candidate.drops = mergeItems(candidate.drops, value as RewardItem[]);
  }

  private finalizeBefore(maximumTick: number): FishNetMobRewardEvent[] {
    const events: FishNetMobRewardEvent[] = [];
    for (let index = this.pending.length - 1; index >= 0; index -= 1) {
      const kill = this.pending[index];
      if (!kill || kill.tick > maximumTick) continue;
      this.pending.splice(index, 1);
      if (kill.ambiguous) {
        continue;
      } else if (!kill.mob) {
        if (kill.gain || kill.drops.length > 0) events.push({
          kind: "unmatched",
          tick: kill.tick,
          reason: "unidentified",
          ...(kill.gain
            ? { reward: "experience" as const, ...kill.gain }
            : { reward: "pickup" as const }),
          drops: kill.drops.map((item) => ({ ...item })),
        });
      } else if (!kill.gain) {
        if (kill.drops.length > 0) events.push({
          kind: "unmatched",
          tick: kill.tick,
          reason: "expired",
          reward: "pickup",
          drops: kill.drops.map((item) => ({ ...item })),
        });
      } else {
        events.push({ kind: "kill", id: kill.id, tick: kill.tick, mob: kill.mob, ...kill.gain, drops: kill.drops });
      }
    }
    return events.sort((left, right) => left.tick - right.tick);
  }
}

function progressGain(
  previousLevel: number,
  previousProgress: number,
  nextLevel: number,
  nextProgress: number,
  requirements: readonly number[],
): number {
  if (nextLevel < previousLevel || previousProgress < 0 || nextProgress < 0) return 0;
  if (nextLevel === previousLevel) return Math.max(0, nextProgress - previousProgress);
  if (requirements.length === 0) return Math.max(0, nextProgress);
  let gain = Math.max(0, (requirements[previousLevel - 1] ?? previousProgress) - previousProgress);
  for (let level = previousLevel + 1; level < nextLevel; level += 1) gain += Math.max(0, requirements[level - 1] ?? 0);
  return gain + nextProgress;
}

function mergeItems(left: readonly RewardItem[], right: readonly RewardItem[]): RewardItem[] {
  const merged = new Map<string, RewardItem>();
  for (const item of [...left, ...right]) {
    const key = `${item.category}|${item.itemId}`;
    const existing = merged.get(key);
    if (existing) existing.count += item.count;
    else merged.set(key, { ...item });
  }
  return [...merged.values()];
}

export function catalogMob(catalog: MobRewardCatalog, id: string): MobRewardDefinition | undefined {
  const mob = catalog.mobs.find((candidate) => candidate.id === id);
  return mob ? { ...mob, drops: mob.drops.map((drop) => ({ ...drop })) } : undefined;
}
