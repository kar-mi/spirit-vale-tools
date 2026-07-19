import type { CapturedFishNetPacket } from "@spiritvale/core";
import { decodeCharacterRpcPayload } from "./decoder.ts";
import { calculateCharacterStats } from "./formulas.ts";
import type { CharacterSnapshot, CharacterViewState } from "./types.ts";

const CHARACTER_RPCS = new Set(["LoadCharacter_T", "CharacterCallback_T"]);

export class FishNetCharacterTracker {
  private snapshot?: CharacterSnapshot;
  private listeners = new Set<(state: CharacterViewState) => void>();

  constructor(initial?: CharacterSnapshot) {
    if (initial) this.snapshot = { ...initial, source: "cached" };
  }

  consume(packet: CapturedFishNetPacket): boolean {
    if (!CHARACTER_RPCS.has(packet.rpcName ?? "") || packet.networkBehaviourType !== "PlayerSave") return false;
    const decoded = decodeCharacterRpcPayload(packet.payload, packet.rpcName === "CharacterCallback_T");
    this.snapshot = mergeSnapshot(this.snapshot, decoded.snapshot, decoded.updateType);
    this.publish();
    return true;
  }

  setCached(snapshot: CharacterSnapshot | undefined): void {
    this.snapshot = snapshot ? { ...snapshot, source: "cached" } : undefined;
    this.publish();
  }

  current(): CharacterSnapshot | undefined { return this.snapshot ? structuredClone(this.snapshot) : undefined; }

  state(): CharacterViewState {
    if (!this.snapshot) return { status: "waiting", statusDetail: "Waiting for the game to send your character…", stats: [] };
    return {
      snapshot: structuredClone(this.snapshot),
      stats: calculateCharacterStats(
        this.snapshot.level,
        this.snapshot.attributes,
        [...this.snapshot.equipment, ...this.snapshot.artifacts].flatMap((item) => item.substats),
        this.snapshot.archetypes,
      ),
      status: this.snapshot.source,
      statusDetail: this.snapshot.source === "live"
        ? "Live character data"
        : `Last known character · updated ${new Date(this.snapshot.updatedAt).toLocaleString()}`,
    };
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
