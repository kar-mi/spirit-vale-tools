import type { CapturedFishNetPacket } from "@spiritvale/core";
import { decodeCharacterRpcPayload } from "./decoder.ts";
import { aggregateGearSubstats, calculateAdvancedGearStats, calculateCharacterStats, materializeGearStats, materializeSkillStats } from "./formulas.ts";
import { decodeCharacterRecordSync } from "./record-decoder.ts";
import type { CharacterRecordValues, CharacterSnapshot, CharacterStatBreakdown, CharacterViewState } from "./types.ts";

const CHARACTER_RPCS = new Set(["LoadCharacter_T", "CharacterCallback_T"]);
/** Maps stat breakdown ids onto the server-synced record that verifies them. */
const RECORDED_STATS: ReadonlyArray<[string, keyof CharacterRecordValues]> = [
  ["max-health", "maxHealth"],
  ["max-mana", "maxMana"],
  ["move-speed", "moveSpeed"],
];

export class FishNetCharacterTracker {
  private snapshot?: CharacterSnapshot;
  private unsupportedDetail?: string;
  private localObjectId?: number;
  private records: CharacterRecordValues = {};
  private listeners = new Set<(state: CharacterViewState) => void>();

  constructor(initial?: CharacterSnapshot) {
    if (initial) this.snapshot = { ...initial, source: "cached" };
  }

  consume(packet: CapturedFishNetPacket): boolean {
    // Only the local player's client emits serverRpc packets, which pins their unit object.
    if (packet.packetName === "serverRpc" && packet.objectId !== undefined) {
      this.localObjectId = packet.objectId;
      return false;
    }
    if (packet.packetName === "syncType") return this.consumeRecordSync(packet);
    if (packet.rpcName === undefined || !CHARACTER_RPCS.has(packet.rpcName)) return false;
    try {
      const decoded = decodeCharacterRpcPayload(packet.payload, packet.rpcName === "CharacterCallback_T");
      this.snapshot = mergeSnapshot(this.snapshot, decoded.snapshot, decoded.updateType);
      this.unsupportedDetail = undefined;
    } catch (error) {
      this.unsupportedDetail = `Character data isn't recognized: ${errorMessage(error)}. Change maps or channels to request a fresh update.`.slice(0, 240);
    }
    this.publish();
    return true;
  }

  private consumeRecordSync(packet: CapturedFishNetPacket): boolean {
    if (packet.objectId === undefined || packet.objectId !== this.localObjectId) return false;
    const update = decodeCharacterRecordSync(packet);
    if (!update) return false;
    Object.assign(this.records, update, { updatedAt: new Date().toISOString() });
    this.publish();
    return true;
  }

  setCached(snapshot: CharacterSnapshot | undefined): void {
    this.snapshot = snapshot ? { ...snapshot, source: "cached" } : undefined;
    this.unsupportedDetail = undefined;
    this.publish();
  }

  current(): CharacterSnapshot | undefined { return this.snapshot ? structuredClone(this.snapshot) : undefined; }

  state(): CharacterViewState {
    const records = Object.keys(this.records).length > 0 ? { records: { ...this.records } } : {};
    if (this.unsupportedDetail) return {
      ...(this.snapshot ? { snapshot: structuredClone(this.snapshot) } : {}),
      stats: this.snapshot ? this.applyRecords(calculateStats(this.snapshot)) : [],
      gearTotals: this.snapshot ? calculateGearTotals(this.snapshot) : [],
      ...records,
      status: "unsupported",
      statusDetail: this.unsupportedDetail,
    };
    if (!this.snapshot) return {
      status: "waiting",
      statusDetail: "Waiting for the game to send your character… Change maps or channels to request an update.",
      stats: [],
      gearTotals: [],
      ...records,
    };
    return {
      snapshot: structuredClone(this.snapshot),
      stats: this.applyRecords(calculateStats(this.snapshot)),
      gearTotals: calculateGearTotals(this.snapshot),
      ...records,
      status: this.snapshot.source,
      statusDetail: this.snapshot.source === "live"
        ? "Live character data"
        : `Last known character · updated ${new Date(this.snapshot.updatedAt).toLocaleString()}`,
    };
  }

  private applyRecords(stats: CharacterStatBreakdown[]): CharacterStatBreakdown[] {
    for (const [statId, recordKey] of RECORDED_STATS) {
      const value = this.records[recordKey];
      if (typeof value !== "number") continue;
      const stat = stats.find((entry) => entry.id === statId);
      if (stat) stat.record = value;
    }
    return stats;
  }

  subscribe(listener: (state: CharacterViewState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private publish(): void {
    const state = this.state();
    for (const listener of this.listeners) listener(state);
  }
}

function calculateStats(snapshot: CharacterSnapshot): CharacterViewState["stats"] {
  const gearTotals = calculateGearTotals(snapshot);
  return calculateCharacterStats(
    snapshot.level,
    snapshot.attributes,
    [...materializeGearStats(snapshot.equipment, snapshot.artifacts), ...materializeSkillStats(snapshot.skills)],
    snapshot.archetypes,
  ).concat(calculateAdvancedGearStats(gearTotals));
}

function calculateGearTotals(snapshot: CharacterSnapshot): CharacterViewState["gearTotals"] {
  return aggregateGearSubstats(snapshot.equipment, snapshot.artifacts);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function mergeSnapshot(previous: CharacterSnapshot | undefined, next: CharacterSnapshot, updateType: number): CharacterSnapshot {
  if (!previous || updateType === 327417855) return next;
  const merged = { ...previous, updatedAt: next.updatedAt, source: "live" as const };
  if (updateType & (1 | 2)) Object.assign(merged, { level: next.level, experience: next.experience, jobLevel: next.jobLevel, jobExperience: next.jobExperience });
  if (updateType & 4) merged.attributes = next.attributes;
  if (updateType & (32 | 64 | 4194304 | 33554528)) {
    merged.activeLoadout = next.activeLoadout;
    merged.equipment = next.equipment;
    merged.artifacts = next.artifacts;
  }
  if (updateType & 131072) merged.archetypes = next.archetypes;
  if (updateType & 8388608) merged.title = next.title;
  if (updateType & 16777216) merged.name = next.name;
  if (next.playtimeSeconds !== undefined) merged.playtimeSeconds = next.playtimeSeconds;
  if (next.monsterKills !== undefined) merged.monsterKills = next.monsterKills;
  if (next.bossKills !== undefined) merged.bossKills = next.bossKills;
  if (next.deaths !== undefined) merged.deaths = next.deaths;
  return merged;
}
