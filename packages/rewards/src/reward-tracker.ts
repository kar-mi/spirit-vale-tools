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
  /** Whether a reward was pinned to this kill. */
  attributed: boolean;
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
  /** Whether our side dealt damage to this target, which is what makes the death ours to report. */
  damaged: boolean;
}

/** Targets our side has damaged, retained only until they die. */
const MAX_DAMAGED_TARGETS = 4_096;

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
  private readonly damagedTargets = new Set<number>();
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
      // Team 0 is our side's outgoing damage.
      if (event.kind === "damage" && event.team === 0 && event.value > 0) {
        this.rememberDamagedTarget(event.targetId);
        continue;
      }
      if (event.kind !== "death") continue;
      // A mob killed outright may only ever produce the death event, so that counts as our damage.
      const damaged = this.damagedTargets.delete(event.targetId) || (event.team === 0 && event.value > 0);
      this.pending.push({
        id: `kill-${this.nextKill++}`,
        tick: event.tick,
        mob: this.mobs.get(event.targetId),
        drops: [],
        ambiguous: false,
        damaged,
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
    this.damagedTargets.clear();
  }

  /** Re-inserting moves the entry to the end, so iteration order is least-recently-damaged first. */
  private rememberDamagedTarget(targetId: number): void {
    this.damagedTargets.delete(targetId);
    this.damagedTargets.add(targetId);
    while (this.damagedTargets.size > MAX_DAMAGED_TARGETS) {
      const oldest = this.damagedTargets.values().next();
      if (oldest.done) break;
      this.damagedTargets.delete(oldest.value);
    }
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
      if (!kill.mob) {
        // Nothing to show without an identity, so anything attached is reported on its own.
        if (kill.gain || kill.drops.length > 0) events.push({
          kind: "unmatched",
          tick: kill.tick,
          reason: "unidentified",
          ...(kill.gain
            ? { reward: "experience" as const, ...kill.gain }
            : { reward: "pickup" as const }),
          drops: kill.drops.map((item) => ({ ...item })),
        });
        continue;
      }
      // A mob that died without us hitting it and without paying out is someone else's kill.
      // Experience alone cannot decide this: at max level a real kill pays nothing.
      if (!kill.damaged && !kill.gain && kill.drops.length === 0) continue;
      // Otherwise the kill is reported whether or not a reward could be pinned to it. An ambiguous
      // reward was already emitted as an unmatched event when it arrived, so leaving this kill's
      // totals at zero reports it once rather than twice.
      events.push({
        kind: "kill",
        id: kill.id,
        tick: kill.tick,
        mob: kill.mob,
        experience: kill.gain?.experience ?? 0,
        jobExperience: kill.gain?.jobExperience ?? 0,
        coins: kill.gain?.coins ?? 0n,
        drops: kill.drops.map((item) => ({ ...item })),
        attributed: kill.gain !== undefined || kill.drops.length > 0,
      });
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
