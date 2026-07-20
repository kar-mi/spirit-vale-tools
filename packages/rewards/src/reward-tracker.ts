import { FishNetCombatTracker } from "@spiritvale/combat";
import type { DecodedFishNetPacket, FishNetDecodedValue } from "@spiritvale/core";
import { checkedEnd, readSignedPackedWhole } from "@spiritvale/core/wire-reader";
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

export interface FishNetUnmatchedRewardEvent {
  kind: "unmatched";
  tick: number;
  reason: "ambiguous" | "expired" | "unidentified";
  reward: "experience" | "pickup";
  drops: RewardItem[];
}

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

export class FishNetMobDirectory {
  private readonly objects = new Map<number, FishNetMobIdentity>();
  private readonly definitions: Map<string, MobRewardDefinition>;

  constructor(catalog: MobRewardCatalog = loadBundledMobRewardCatalog()) {
    this.definitions = new Map(catalog.mobs.map((mob) => [mob.id, mob]));
  }

  consume(packet: DecodedFishNetPacket): void {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.objects.clear();
      return;
    }
    if (packet.packetName === "objectDespawn" && packet.objectId !== undefined) {
      this.objects.delete(packet.objectId);
      return;
    }
    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      this.objects.delete(packet.objectId);
      const spawned = packet.spawnSyncPayload ? decodeMonsterSpawn(packet.spawnSyncPayload, this.definitions) : undefined;
      if (spawned) this.set(packet.objectId, spawned);
      return;
    }
    if (packet.packetName !== "syncType" || packet.objectId === undefined
      || (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "MonsterController")) return;
    const raw = decodeMonsterSync(packet.payload);
    const mobId = stringField(packet, ["Data.Id", "Monster.Id", "Id"]) ?? raw?.mobId;
    const level = numberField(packet, ["Data.Level", "Monster.Level", "Level"]) ?? raw?.level;
    if (!mobId || level === undefined) return;
    const definition = this.definitions.get(mobId);
    if (!definition) return;
    const rank = numberField(packet, ["Data.Rank", "Monster.Rank", "Rank"]) ?? raw?.rank;
    this.set(packet.objectId, { mobId, level, ...(rank === undefined ? {} : { rank }) });
  }

  private set(objectId: number, value: { mobId: string; level: number; rank?: number }): void {
    const definition = this.definitions.get(value.mobId);
    if (!definition) return;
    this.objects.set(objectId, {
      objectId,
      mobId: value.mobId,
      displayName: definition.displayName,
      level: value.level,
      ...(value.rank === undefined ? {} : { rank: value.rank }),
      boss: definition.boss,
    });
  }

  get(objectId: number): FishNetMobIdentity | undefined {
    const value = this.objects.get(objectId);
    return value ? { ...value } : undefined;
  }

  reset(): void { this.objects.clear(); }
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
      this.queuedEvents.push({
        kind: "unmatched",
        tick,
        reason: candidates.length === 0 ? "expired" : "ambiguous",
        reward,
        drops: reward === "pickup" ? (value as RewardItem[]).map((item) => ({ ...item })) : [],
      });
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
          reward: kill.gain ? "experience" : "pickup",
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
    const key = `${item.category}\u0000${item.itemId}`;
    const existing = merged.get(key);
    if (existing) existing.count += item.count;
    else merged.set(key, { ...item });
  }
  return [...merged.values()];
}

function field(packet: DecodedFishNetPacket, names: readonly string[]): FishNetDecodedValue | undefined {
  for (const name of names) {
    const value = packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
    if (value !== undefined) return value;
  }
  return undefined;
}

function stringField(packet: DecodedFishNetPacket, names: readonly string[]): string | undefined {
  const value = field(packet, names);
  return typeof value === "string" ? value : undefined;
}

function numberField(packet: DecodedFishNetPacket, names: readonly string[]): number | undefined {
  const value = field(packet, names);
  return typeof value === "number" && Number.isInteger(value) ? value : undefined;
}

function decodeMonsterSync(payload: Buffer): { mobId: string; level: number; rank: number } | undefined {
  try {
    if (payload.length < 2) return undefined;
    let offset = 1; // SyncType index.
    const length = readSignedPackedWhole(payload, offset);
    if (length.value <= 0) return undefined;
    const end = checkedEnd(payload, length.nextOffset, length.value);
    const mobId = payload.toString("utf8", length.nextOffset, end);
    offset = end;
    const level = readSignedPackedWhole(payload, offset);
    const rank = readSignedPackedWhole(payload, level.nextOffset);
    const team = readSignedPackedWhole(payload, rank.nextOffset);
    if (level.value < 1 || level.value > 1_000 || rank.value < 0 || team.value < 0) return undefined;
    return { mobId, level: level.value, rank: rank.value };
  } catch {
    return undefined;
  }
}

function decodeMonsterSpawn(
  payload: Buffer,
  definitions: ReadonlyMap<string, MobRewardDefinition>,
): { mobId: string; level: number; rank: number } | undefined {
  const matches = new Map<string, { mobId: string; level: number; rank: number; exactLevel: boolean }>();
  for (let offset = 0; offset < payload.length; offset += 1) {
    try {
      const length = readSignedPackedWhole(payload, offset);
      if (length.value < 1 || length.value > 200) continue;
      const end = checkedEnd(payload, length.nextOffset, length.value);
      const mobId = payload.toString("utf8", length.nextOffset, end);
      const definition = definitions.get(mobId);
      if (!definition) continue;
      const level = readSignedPackedWhole(payload, end);
      const rank = readSignedPackedWhole(payload, level.nextOffset);
      const team = readSignedPackedWhole(payload, rank.nextOffset);
      if (level.value < 1 || level.value > 1_000 || rank.value < 0 || rank.value > 100 || team.value < 0 || team.value > 100) continue;
      matches.set(`${mobId}\u0000${level.value}\u0000${rank.value}`, {
        mobId,
        level: level.value,
        rank: rank.value,
        exactLevel: level.value === definition.level,
      });
    } catch {
      // Arbitrary offsets are expected not to begin a packed string.
    }
  }
  const values = [...matches.values()];
  const exact = values.filter((value) => value.exactLevel);
  const selected = exact.length === 1 ? exact[0] : values.length === 1 ? values[0] : undefined;
  return selected ? { mobId: selected.mobId, level: selected.level, rank: selected.rank } : undefined;
}

export function catalogMob(catalog: MobRewardCatalog, id: string): MobRewardDefinition | undefined {
  const mob = catalog.mobs.find((candidate) => candidate.id === id);
  return mob ? { ...mob, drops: mob.drops.map((drop) => ({ ...drop })) } : undefined;
}
