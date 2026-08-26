import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodeCharacterRpcPayload, rescaleSubstats, resolveCharacterArchetypeId } from "./decoder.ts";
import { aggregateGearSubstats, calculateAdvancedGearStats, calculateCharacterStats, calculateWeightLimit, materializeGearStats, materializeSkillStats } from "./formulas.ts";
import { decodeCharacterRecordSync, decodeCharacterSpawnRecords } from "./record-decoder.ts";
import type { CharacterIdentity, CharacterRecordValues, CharacterSnapshot, CharacterStatBreakdown, CharacterViewState } from "./types.ts";

const CHARACTER_RPCS = new Set(["LoadCharacter_T", "CharacterCallback_T"]);
const MAX_PENDING_RECORD_OBJECTS = 4_096;
const REGEN_CADENCE_MAX_GAP_MS = 1_750;
const REGEN_SETTLE_QUIET_MS = 2_250;
/** Maps stat breakdown ids onto the server-synced record that verifies them. */
const RECORDED_STATS: ReadonlyArray<[string, readonly (keyof CharacterRecordValues)[]]> = [
  ["max-health", ["maxHealth", "normalizedMaxHp"]],
  ["max-mana", ["maxMana", "normalizedMaxMp"]],
  ["move-speed", ["moveSpeed"]],
];

interface CharacterTrackerTiming {
  now?: () => number;
  schedule?: (callback: () => void, delayMs: number) => unknown;
  cancel?: (handle: unknown) => void;
}

interface RegenSequence {
  lastValue: number;
  lastObservedAtMs: number;
  consecutiveIncreases: number;
  timer?: unknown;
}

export class FishNetCharacterTracker {
  private snapshot?: CharacterSnapshot;
  private identity?: CharacterIdentity;
  private unsupportedDetail?: string;
  private currentWeight?: number;
  private localObjectId?: number;
  /** Transport connection that owns {@link localObjectId}; object ids only mean anything within one. */
  private localConnectionId?: string;
  private records: CharacterRecordValues = {};
  private pendingRecords = new Map<string, CharacterRecordValues>();
  private listeners = new Set<(state: CharacterViewState) => void>();
  private healthRegen?: RegenSequence;
  private manaRegen?: RegenSequence;
  private readonly now: () => number;
  private readonly schedule: (callback: () => void, delayMs: number) => unknown;
  private readonly cancel: (handle: unknown) => void;

  constructor(initial?: CharacterSnapshot, timing: CharacterTrackerTiming = {}) {
    this.now = timing.now ?? Date.now;
    this.schedule = timing.schedule ?? ((callback, delayMs) => setTimeout(callback, delayMs));
    this.cancel = timing.cancel ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>));
    if (initial) this.snapshot = { ...initial, source: "cached" };
  }

  consume(packet: CapturedFishNetPacket): boolean {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      // The client holds several server connections at once, so a boundary on a neighbouring one must not release a pin held on the live connection.
      if (this.localConnectionId === undefined || packet.connectionId === this.localConnectionId) {
        this.releaseLocalObject();
      }
      return false;
    }
    if (packet.packetName === "objectDespawn" && packet.objectId !== undefined) {
      this.pendingRecords.delete(pendingKey(packet.connectionId, packet.objectId));
      if (this.isLocalObject(packet)) this.releaseLocalObject();
      return false;
    }
    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      const key = pendingKey(packet.connectionId, packet.objectId);
      this.pendingRecords.delete(key);
      const update = decodeCharacterSpawnRecords(packet.spawnSyncEntries);
      if (update) Object.assign(this.pendingRecordsFor(key), update, { updatedAt: new Date().toISOString() });
    }
    // Only the local player's client emits serverRpc packets, which pins their unit object.
    if (packet.packetName === "serverRpc" && packet.objectId !== undefined) {
      const objectChanged = this.localObjectId !== packet.objectId || this.localConnectionId !== packet.connectionId;
      this.localObjectId = packet.objectId;
      this.localConnectionId = packet.connectionId;
      const pending = this.pendingRecords.get(pendingKey(packet.connectionId, packet.objectId));
      if (pending) {
        this.resetRegenSequences();
        this.records = { ...pending };
        this.applyAuthoritativeMaxima();
      } else if (objectChanged) {
        this.resetRegenSequences();
        this.records = {};
      }
      this.pendingRecords.clear();
      if (objectChanged || pending) this.publish();
      return false;
    }
    if (packet.packetName === "syncType") {
      const identityChanged = this.consumeIdentitySync(packet);
      const recordChanged = this.consumeRecordSync(packet);
      return identityChanged || recordChanged;
    }
    if (packet.rpcName === undefined || !CHARACTER_RPCS.has(packet.rpcName)) return false;
    try {
      const decoded = decodeCharacterRpcPayload(packet.payload, packet.rpcName === "CharacterCallback_T");
      if (this.snapshot && this.snapshot.name !== decoded.snapshot.name) {
        this.currentWeight = undefined;
        this.records = {};
        this.resetRegenSequences();
      }
      this.snapshot = mergeSnapshot(this.snapshot, decoded.snapshot, decoded.updateType);
      if (decoded.currentWeight !== undefined) this.currentWeight = decoded.currentWeight;
      this.unsupportedDetail = undefined;
    } catch (error) {
      this.unsupportedDetail = `Character data isn't recognized: ${errorMessage(error)}. Change maps or channels to request a fresh update.`.slice(0, 240);
    }
    this.publish();
    return true;
  }

  /**
   * `StatusComponent`'s `Data`/`Level`/`JobLevel` SyncVars are the only live wire source for your
   * own name/level right now - the game never sends `LoadCharacter_T`/`CharacterCallback_T` in
   * practice, which is what a full {@link CharacterSnapshot} needs. This only ever updates
   * {@link identity}, deliberately never merged into `snapshot`.
   */
  private consumeIdentitySync(packet: CapturedFishNetPacket): boolean {
    if (packet.networkBehaviourType !== "StatusComponent" || !this.isLocalObject(packet) || !packet.decodedFields) return false;
    let name: string | undefined;
    let level: number | undefined;
    let jobLevel: number | undefined;
    for (const field of packet.decodedFields) {
      if (field.name === "DisplayName" && typeof field.value === "string") name = field.value;
      else if (field.name === "Level" && typeof field.value === "number") level = field.value;
      else if (field.name === "JobLevel" && typeof field.value === "number") jobLevel = field.value;
    }
    if (name === undefined && level === undefined && jobLevel === undefined) return false;
    this.identity = {
      name: name ?? this.identity?.name ?? "",
      level: level ?? this.identity?.level,
      jobLevel: jobLevel ?? this.identity?.jobLevel,
    };
    if (!this.identity.name) return false;
    this.publish();
    return true;
  }

  private consumeRecordSync(packet: CapturedFishNetPacket): boolean {
    if (packet.objectId === undefined) return false;
    const update = decodeCharacterRecordSync(packet);
    if (!update) return false;
    if (!this.isLocalObject(packet)) {
      const key = pendingKey(packet.connectionId, packet.objectId);
      Object.assign(this.pendingRecordsFor(key), update, { updatedAt: new Date().toISOString() });
      return false;
    }
    this.applyLocalRecordUpdate(update);
    this.publish();
    return true;
  }

  private pendingRecordsFor(key: string): CharacterRecordValues {
    let records = this.pendingRecords.get(key);
    if (!records) {
      if (this.pendingRecords.size >= MAX_PENDING_RECORD_OBJECTS) {
        const oldestKey = this.pendingRecords.keys().next().value;
        if (oldestKey !== undefined) this.pendingRecords.delete(oldestKey);
      }
      records = {};
      this.pendingRecords.set(key, records);
    }
    return records;
  }

  /** True only for the pinned unit object on the connection that pinned it. */
  private isLocalObject(packet: CapturedFishNetPacket): boolean {
    return this.localObjectId !== undefined
      && packet.objectId === this.localObjectId
      && packet.connectionId === this.localConnectionId;
  }

  /**
   * Drops the pinned object and every buffered candidate at a connection boundary. Carried weight is
   * character-scoped and the snapshot it belongs to survives these boundaries, so it is deliberately
   * kept: blanking it left the panel weightless until the next complete callback happened to arrive.
   * Records are kept only for the gap until the next pin, which replaces them.
   */
  private releaseLocalObject(): void {
    this.localObjectId = undefined;
    this.localConnectionId = undefined;
    this.pendingRecords.clear();
    this.resetRegenSequences();
    this.identity = undefined;
  }

  setCached(snapshot: CharacterSnapshot | undefined): void {
    this.snapshot = snapshot ? { ...snapshot, source: "cached" } : undefined;
    this.currentWeight = undefined;
    this.records = {};
    this.pendingRecords.clear();
    this.resetRegenSequences();
    this.unsupportedDetail = undefined;
    this.publish();
  }

  current(): CharacterSnapshot | undefined { return this.snapshot ? structuredClone(this.snapshot) : undefined; }

  currentObjectId(): number | undefined { return this.localObjectId; }

  /**
   * Moves a pre-pin candidate when a caller represents one physical object with a stable logical
   * object id. This changes no values and promotes nothing; the following serverRpc remains the
   * proof that pins the destination object.
   */
  rekeyPendingObject(connectionId: string, fromObjectId: number, toObjectId: number): void {
    if (fromObjectId === toObjectId) return;
    const fromKey = pendingKey(connectionId, fromObjectId);
    const candidate = this.pendingRecords.get(fromKey);
    if (!candidate) return;
    this.pendingRecords.delete(fromKey);
    Object.assign(this.pendingRecordsFor(pendingKey(connectionId, toObjectId)), candidate);
  }

  private applyLocalRecordUpdate(update: Partial<CharacterRecordValues>): void {
    const previousHealth = this.records.currentHealth;
    const previousMana = this.records.currentMana;
    Object.assign(this.records, update, { updatedAt: new Date().toISOString() });
    this.applyAuthoritativeMaxima();
    if (update.maxHealth === undefined && update.currentHealth !== undefined && this.records.maxHealth === undefined) {
      this.observeRegen("health", previousHealth, update.currentHealth);
    }
    if (update.maxMana === undefined && update.currentMana !== undefined && this.records.maxMana === undefined) {
      this.observeRegen("mana", previousMana, update.currentMana);
    }
  }

  private applyAuthoritativeMaxima(): void {
    if (this.records.maxHealth !== undefined) {
      this.records.normalizedMaxHp = this.records.maxHealth;
      this.clearRegen("health");
    }
    if (this.records.maxMana !== undefined) {
      this.records.normalizedMaxMp = this.records.maxMana;
      this.clearRegen("mana");
    }
  }

  private observeRegen(kind: "health" | "mana", previous: number | undefined, current: number): void {
    const normalizedKey = kind === "health" ? "normalizedMaxHp" : "normalizedMaxMp";
    const knownMaximum = this.records[normalizedKey];
    if (knownMaximum !== undefined && current <= knownMaximum) return;
    if (knownMaximum !== undefined) delete this.records[normalizedKey];
    if (previous === undefined || current < previous) {
      this.clearRegen(kind);
      return;
    }
    const now = this.now();
    let sequence = kind === "health" ? this.healthRegen : this.manaRegen;
    if (current > previous) {
      const continues = sequence !== undefined
        && now - sequence.lastObservedAtMs <= REGEN_CADENCE_MAX_GAP_MS;
      this.clearRegenTimer(sequence);
      sequence = {
        lastValue: current,
        lastObservedAtMs: now,
        consecutiveIncreases: continues ? sequence!.consecutiveIncreases + 1 : 1,
      };
      if (kind === "health") this.healthRegen = sequence;
      else this.manaRegen = sequence;
    } else if (sequence) {
      this.clearRegenTimer(sequence);
      sequence.lastObservedAtMs = now;
      sequence.lastValue = current;
    } else {
      return;
    }
    if (sequence.consecutiveIncreases < 2) return;
    sequence.timer = this.schedule(() => this.settleRegen(kind, sequence!), REGEN_SETTLE_QUIET_MS);
  }

  private settleRegen(kind: "health" | "mana", sequence: RegenSequence): void {
    if ((kind === "health" ? this.healthRegen : this.manaRegen) !== sequence) return;
    const currentKey = kind === "health" ? "currentHealth" : "currentMana";
    const maxKey = kind === "health" ? "maxHealth" : "maxMana";
    const normalizedKey = kind === "health" ? "normalizedMaxHp" : "normalizedMaxMp";
    if (this.records[maxKey] !== undefined || this.records[currentKey] !== sequence.lastValue) return;
    this.records[normalizedKey] = sequence.lastValue;
    this.records.updatedAt = new Date().toISOString();
    this.clearRegen(kind);
    this.publish();
  }

  private clearRegen(kind: "health" | "mana"): void {
    const sequence = kind === "health" ? this.healthRegen : this.manaRegen;
    this.clearRegenTimer(sequence);
    if (kind === "health") this.healthRegen = undefined;
    else this.manaRegen = undefined;
  }

  private clearRegenTimer(sequence: RegenSequence | undefined): void {
    if (sequence?.timer !== undefined) this.cancel(sequence.timer);
  }

  private resetRegenSequences(): void {
    this.clearRegen("health");
    this.clearRegen("mana");
  }

  currentArchetypeId(): number | undefined {
    const archetype = this.snapshot?.archetypes.at(-1);
    return archetype === undefined ? undefined : resolveCharacterArchetypeId(archetype);
  }

  state(): CharacterViewState {
    // Stored substat values were baked by whatever build decoded them; always re-derive
    // from the raw rolls so cap or name-table fixes reach cached snapshots immediately.
    const snapshot = this.snapshot ? rescaleSubstats(structuredClone(this.snapshot)) : undefined;
    const records = Object.keys(this.records).length > 0 ? { records: { ...this.records } } : {};
    const weight = snapshot && this.currentWeight !== undefined
      ? { weight: { current: this.currentWeight, maximum: calculateWeightLimit(snapshot) } }
      : {};
    const identity = this.identity ? { identity: { ...this.identity } } : {};
    if (this.unsupportedDetail) return {
      ...(snapshot ? { snapshot } : {}),
      ...identity,
      stats: snapshot ? this.applyRecords(calculateStats(snapshot)) : [],
      gearTotals: snapshot ? calculateGearTotals(snapshot) : [],
      ...records,
      ...weight,
      status: "unsupported",
      statusDetail: this.unsupportedDetail,
    };
    if (!snapshot) return {
      ...identity,
      status: "waiting",
      statusDetail: "Waiting for the game to send your character… Change maps or channels to request an update.",
      stats: [],
      gearTotals: [],
      ...records,
      ...weight,
    };
    return {
      snapshot,
      ...identity,
      stats: this.applyRecords(calculateStats(snapshot)),
      gearTotals: calculateGearTotals(snapshot),
      ...records,
      ...weight,
      status: snapshot.source,
      statusDetail: snapshot.source === "live"
        ? "Live character data"
        : "Last known character",
    };
  }

  private applyRecords(stats: CharacterStatBreakdown[]): CharacterStatBreakdown[] {
    for (const [statId, recordKeys] of RECORDED_STATS) {
      const value = recordKeys.map((key) => this.records[key]).find((candidate) => typeof candidate === "number");
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

/** Object ids are only unique within a transport connection, so buffered records key on both. */
function pendingKey(connectionId: string, objectId: number): string {
  return `${connectionId} ${objectId}`;
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
  if (!previous || previous.name !== next.name || updateType === 327417855) return next;
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
