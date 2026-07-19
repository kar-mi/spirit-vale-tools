import {
  CURRENT_GAME_BUILD_FINGERPRINT,
  loadBundledFishNetSemanticMap,
} from "@spiritvale/core";
import type { DecodedFishNetPacket, FishNetDecodedValue, FishNetSemanticMap } from "@spiritvale/core";
import { loadBundledSkillCatalog } from "@spiritvale/skills";
import type { FishNetSkillCatalog } from "@spiritvale/skills";

export type FishNetCombatActionKind = "skill" | "basicAttack" | "inferred";
export type FishNetCombatActionPhase = "begin" | "complete" | "interrupt" | "cancel" | "inferred";
export type FishNetDamageAttribution = "exact" | "ambiguous" | "inferred";
export type FishNetHitResult = "normal" | "critical" | "miss" | "blocked" | "dodged" | number;

export interface FishNetCombatTrackerOptions {
  /** Ticks to retain a completed activation for trailing hits. Defaults to 30. */
  hitGraceTicks?: number;
  /** Maximum age of an activation that never completes. Defaults to 900 ticks. */
  activationMaxAgeTicks?: number;
  /** Semantic labels for skill wire identifiers. Defaults to the current bundled build. */
  semanticMap?: FishNetSemanticMap;
  /** Extracted public skill metadata. Defaults to the current bundled build when available. */
  skillCatalog?: FishNetSkillCatalog;
  buildFingerprint?: string;
}

export interface FishNetCombatActivationEvent {
  kind: "activation";
  rpc: string;
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  activationId?: string;
  actionKind: FishNetCombatActionKind;
  phase: FishNetCombatActionPhase;
  sourceId?: string;
  sourceLabel?: string;
  targetId?: number;
  level?: number;
  attackIndex?: number;
  inferred?: boolean;
}

export interface FishNetCombatDamageEvent {
  kind: "damage";
  rpc: "ApplyDamage_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  targetId: number;
  sourceId: string;
  sourceLabel: string;
  value: number;
  hitResult: FishNetHitResult;
  wireHits: number;
  damageType: number;
  team: number;
  element: number;
  weaponType: number;
  range: number;
  isClone: boolean;
  isSummon: boolean;
  position: number[];
  origin: number[];
  attribution: FishNetDamageAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
}

export interface FishNetCombatDeathEvent {
  kind: "death";
  rpc: "Death_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  targetId: number;
  sourceId: string;
  sourceLabel: string;
  value: number;
  hitResult: FishNetHitResult;
  wireHits: number;
  damageType: number;
  team: number;
  element: number;
  weaponType: number;
  range: number;
  isClone: boolean;
  isSummon: boolean;
  attribution: FishNetDamageAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  /** True when an identical ApplyDamage_C was already emitted at this tick. */
  duplicatesDamageEvent: boolean;
}

export type FishNetCombatEvent =
  | FishNetCombatActivationEvent
  | FishNetCombatDamageEvent
  | FishNetCombatDeathEvent;

interface ActivationState {
  id: string;
  actorId: number;
  actionKind: FishNetCombatActionKind;
  sourceId?: string;
  sourceLabel?: string;
  startTick: number;
  endTick?: number;
  deadlineTick?: number;
  inferred: boolean;
}

const HIT_RESULTS: Readonly<Record<number, Exclude<FishNetHitResult, number>>> = {
  0: "normal",
  1: "critical",
  2: "miss",
  3: "blocked",
  4: "dodged",
};
const SKILL_RPC_NAMES = new Set(["CastBegin_C", "AutoCast_C", "CastComplete_C", "CastInterrupt_C", "CastCancel_C"]);

/** Converts decoded FishNet RPCs into actor-grouped combat events and summaries. */
export class FishNetCombatTracker {
  private readonly hitGraceTicks: number;
  private readonly activationMaxAgeTicks: number;
  private readonly skillLabels: Map<string, string>;
  private readonly activations = new Map<string, ActivationState>();
  private readonly recentDamageSignatures = new Set<string>();
  private recentDamageTick: number | undefined;
  private nextActivation = 1;

  constructor(options: FishNetCombatTrackerOptions = {}) {
    const grace = options.hitGraceTicks ?? 30;
    if (!Number.isInteger(grace) || grace < 0) throw new Error("hitGraceTicks must be a non-negative integer");
    this.hitGraceTicks = grace;
    const maxAge = options.activationMaxAgeTicks ?? 900;
    if (!Number.isInteger(maxAge) || maxAge < 1) throw new Error("activationMaxAgeTicks must be a positive integer");
    this.activationMaxAgeTicks = maxAge;
    const buildFingerprint = options.buildFingerprint
      ?? options.skillCatalog?.buildFingerprint
      ?? options.semanticMap?.buildFingerprint
      ?? CURRENT_GAME_BUILD_FINGERPRINT;
    assertMatchingBuild("skill catalog", options.skillCatalog?.buildFingerprint, buildFingerprint);
    assertMatchingBuild("semantic map", options.semanticMap?.buildFingerprint, buildFingerprint);
    const skillCatalog = options.skillCatalog ?? tryLoadBundledSkillCatalog(buildFingerprint);
    const semanticMap = options.semanticMap ?? (skillCatalog
      ? tryLoadBundledSemanticMap(buildFingerprint)
      : loadBundledFishNetSemanticMap(buildFingerprint));
    this.skillLabels = new Map(skillCatalog?.skills.map(({ id, displayName }) => [id, displayName]) ?? []);
    for (const { value, label } of semanticMap?.verifiedSkillLabels ?? []) this.skillLabels.set(value, label);
  }

  consume(packet: DecodedFishNetPacket): FishNetCombatEvent[] {
    this.pruneExpired(packet.tick);
    if (this.recentDamageTick !== packet.tick) {
      this.recentDamageTick = packet.tick;
      this.recentDamageSignatures.clear();
    }
    const events: FishNetCombatEvent[] = [];
    if (packet.objectId === undefined || !packet.rpcName) return events;

    if (SKILL_RPC_NAMES.has(packet.rpcName) && matchesBehaviour(packet, "SkillsComponent")) {
      const skillEvent = this.consumeSkill(packet);
      if (skillEvent) events.push(skillEvent);
      return events;
    }
    if (packet.rpcName === "Attack_C" && matchesBehaviour(packet, "CombatComponent")) {
      events.push(this.beginAttack(packet));
      return events;
    }
    if ((packet.rpcName === "ApplyDamage_C" || packet.rpcName === "Death_C")
      && matchesBehaviour(packet, "HealthComponent")) {
      const death = packet.rpcName === "Death_C";
      if (!isCompleteDamagePacket(packet, !death)) return events;
      events.push(...this.consumeDamage(packet, death));
    }
    return events;
  }

  reset(): void {
    this.activations.clear();
    this.recentDamageSignatures.clear();
    this.recentDamageTick = undefined;
  }

  private consumeSkill(packet: DecodedFishNetPacket): FishNetCombatActivationEvent | undefined {
    const actorId = packet.objectId!;
    const rpcName = packet.rpcName;
    if (!rpcName) return undefined;
    if (rpcName === "CastBegin_C" || rpcName === "AutoCast_C") {
      const sourceId = stringField(packet, "dto.Id");
      if (!sourceId) return undefined;
      const activation = this.createActivation(actorId, "skill", packet.tick, sourceId, false);
      return {
        kind: "activation",
        rpc: rpcName,
        tick: packet.tick,
        payloadBytes: packet.payload.length,
        fields: decodedFieldRecord(packet),
        actorId,
        activationId: activation.id,
        actionKind: "skill",
        phase: "begin",
        sourceId,
        sourceLabel: activation.sourceLabel,
        targetId: numberField(packet, "targetId"),
        level: numberField(packet, "dto.Level"),
      };
    }

    const phases: Partial<Record<string, FishNetCombatActionPhase>> = {
      CastComplete_C: "complete",
      CastInterrupt_C: "interrupt",
      CastCancel_C: "cancel",
    };
    const phase = phases[rpcName];
    if (!phase) return undefined;
    const activation = this.findLifecycleActivation(actorId);
    if (activation) {
      activation.endTick = packet.tick;
      activation.deadlineTick = packet.tick + this.hitGraceTicks;
    }
    return {
      kind: "activation",
      rpc: rpcName,
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      activationId: activation?.id,
      actionKind: activation?.actionKind ?? "skill",
      phase,
      sourceId: activation?.sourceId,
      sourceLabel: activation?.sourceLabel,
    };
  }

  private beginAttack(packet: DecodedFishNetPacket): FishNetCombatActivationEvent {
    const actorId = packet.objectId!;
    const attackIndex = numberField(packet, "attackIndex");
    const activation = this.createActivation(actorId, "basicAttack", packet.tick, undefined, false);
    activation.endTick = packet.tick;
    activation.deadlineTick = packet.tick + this.hitGraceTicks;
    return {
      kind: "activation",
      rpc: "Attack_C",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      activationId: activation.id,
      actionKind: "basicAttack",
      phase: "begin",
      attackIndex,
    };
  }

  private consumeDamage(packet: DecodedFishNetPacket, death: boolean): FishNetCombatEvent[] {
    const actorId = requiredNumberField(packet, "dmg.AttackerId");
    const sourceId = nullableStringField(packet, "dmg.DamageSourceId") ?? "unknown";
    const value = requiredNumberField(packet, "dmg.Value");
    const hitCode = requiredNumberField(packet, "dmg.Hit");
    const hitResult = HIT_RESULTS[hitCode] ?? hitCode;
    const sourceLabel = this.skillLabels.get(sourceId) ?? sourceId;
    const targetId = packet.objectId!;
    const exactCandidates = this.eligibleActivations(packet.tick, actorId)
      .filter((activation) => activation.sourceId === sourceId);
    let candidates = exactCandidates;

    if (candidates.length === 0) {
      const unboundAttacks = this.eligibleActivations(packet.tick, actorId)
        .filter((activation) => activation.actionKind === "basicAttack" && activation.sourceId === undefined);
      if (unboundAttacks.length === 1) {
        const [attack] = unboundAttacks;
        if (attack) {
          attack.sourceId = sourceId;
          attack.sourceLabel = sourceLabel;
          candidates = [attack];
        }
      } else if (unboundAttacks.length > 1) {
        candidates = unboundAttacks;
      }
    }

    const events: FishNetCombatEvent[] = [];
    let attribution: FishNetDamageAttribution;
    let activationId: string | undefined;
    let candidateActivationIds: string[] | undefined;
    if (candidates.length === 0) {
      const inferred = this.createActivation(actorId, "inferred", packet.tick, sourceId, true);
      inferred.endTick = packet.tick;
      inferred.deadlineTick = packet.tick + this.hitGraceTicks;
      candidates = [inferred];
      attribution = "inferred";
      activationId = inferred.id;
      events.push({
        kind: "activation",
        rpc: "inferred",
        tick: packet.tick,
        payloadBytes: 0,
        fields: {},
        actorId,
        activationId: inferred.id,
        actionKind: "inferred",
        phase: "inferred",
        sourceId,
        sourceLabel,
        inferred: true,
      });
    } else if (candidates.length === 1) {
      const [candidate] = candidates;
      if (!candidate) throw new Error("missing combat activation candidate");
      attribution = candidate.inferred ? "inferred" : "exact";
      activationId = candidate.id;
    } else {
      attribution = "ambiguous";
      candidateActivationIds = candidates.map(({ id }) => id);
    }

    const common = {
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      targetId,
      sourceId,
      sourceLabel,
      value,
      hitResult,
      wireHits: requiredNumberField(packet, "dmg.Hits"),
      damageType: requiredNumberField(packet, "dmg.Type"),
      team: requiredNumberField(packet, "dmg.Team"),
      element: requiredNumberField(packet, "dmg.Element"),
      weaponType: requiredNumberField(packet, "dmg.WeaponType"),
      range: requiredNumberField(packet, "dmg.Range"),
      isClone: requiredBooleanField(packet, "dmg.IsClone"),
      isSummon: requiredBooleanField(packet, "dmg.IsSummon"),
      attribution,
      activationId,
      candidateActivationIds,
    };
    const signature = damageSignature(packet.tick, targetId, actorId, sourceId, value, hitCode);
    if (death) {
      events.push({
        kind: "death",
        rpc: "Death_C",
        ...common,
        duplicatesDamageEvent: this.recentDamageSignatures.has(signature),
      });
    } else {
      this.recentDamageSignatures.add(signature);
      events.push({
        kind: "damage",
        rpc: "ApplyDamage_C",
        ...common,
        position: requiredVectorField(packet, "position"),
        origin: requiredVectorField(packet, "origin"),
      });
    }
    return events;
  }

  private createActivation(
    actorId: number,
    actionKind: FishNetCombatActionKind,
    tick: number,
    sourceId: string | undefined,
    inferred: boolean,
  ): ActivationState {
    const activation: ActivationState = {
      id: `activation-${this.nextActivation++}`,
      actorId,
      actionKind,
      sourceId,
      sourceLabel: sourceId === undefined ? undefined : this.skillLabels.get(sourceId) ?? sourceId,
      startTick: tick,
      inferred,
    };
    this.activations.set(activation.id, activation);
    return activation;
  }

  private findLifecycleActivation(actorId: number): ActivationState | undefined {
    return [...this.activations.values()]
      .filter((activation) => activation.actorId === actorId
        && activation.actionKind === "skill"
        && activation.endTick === undefined)
      .sort((left, right) => left.startTick - right.startTick)[0];
  }

  private eligibleActivations(tick: number, actorId: number): ActivationState[] {
    return [...this.activations.values()].filter((activation) => {
      return activation.actorId === actorId
        && activation.startTick <= tick
        && (activation.deadlineTick === undefined || tick <= activation.deadlineTick);
    });
  }

  private pruneExpired(tick: number): void {
    const expired = [...this.activations.values()]
      .filter((activation) => activation.deadlineTick !== undefined
        ? activation.deadlineTick < tick
        : tick - activation.startTick > this.activationMaxAgeTicks)
      .map(({ id }) => id);
    for (const id of expired) this.activations.delete(id);
  }
}

function field(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
}

function decodedFieldRecord(packet: DecodedFishNetPacket): Record<string, FishNetDecodedValue> {
  return Object.fromEntries(packet.decodedFields?.map(({ name, value }) => [name, value]) ?? []);
}

function matchesBehaviour(packet: DecodedFishNetPacket, expected: string): boolean {
  return packet.networkBehaviourType === undefined || packet.networkBehaviourType === expected;
}

function numberField(packet: DecodedFishNetPacket, name: string): number | undefined {
  const value = field(packet, name);
  return typeof value === "number" ? value : undefined;
}

function stringField(packet: DecodedFishNetPacket, name: string): string | undefined {
  const value = field(packet, name);
  return typeof value === "string" ? value : undefined;
}

function requiredNumberField(packet: DecodedFishNetPacket, name: string): number {
  const value = numberField(packet, name);
  if (value === undefined) throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing numeric field ${name}`);
  return value;
}

function requiredBooleanField(packet: DecodedFishNetPacket, name: string): boolean {
  const value = field(packet, name);
  if (typeof value !== "boolean") throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing boolean field ${name}`);
  return value;
}

function requiredVectorField(packet: DecodedFishNetPacket, name: string): number[] {
  const value = field(packet, name);
  if (!Array.isArray(value)) throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing vector field ${name}`);
  return value;
}

function isCompleteDamagePacket(packet: DecodedFishNetPacket, requireVectors: boolean): boolean {
  const numeric = [
    "dmg.Team",
    "dmg.Value",
    "dmg.Type",
    "dmg.Hit",
    "dmg.Hits",
    "dmg.AttackerId",
    "dmg.Element",
    "dmg.WeaponType",
    "dmg.Range",
  ];
  return numeric.every((name) => numberField(packet, name) !== undefined)
    && nullableStringField(packet, "dmg.DamageSourceId") !== undefined
    && typeof field(packet, "dmg.IsClone") === "boolean"
    && typeof field(packet, "dmg.IsSummon") === "boolean"
    && (!requireVectors || (Array.isArray(field(packet, "position")) && Array.isArray(field(packet, "origin"))));
}

function nullableStringField(packet: DecodedFishNetPacket, name: string): string | null | undefined {
  const value = field(packet, name);
  return typeof value === "string" || value === null ? value : undefined;
}

function damageSignature(
  tick: number,
  targetId: number,
  actorId: number,
  sourceId: string,
  value: number,
  hitCode: number,
): string {
  return `${tick}\u0000${targetId}\u0000${actorId}\u0000${sourceId}\u0000${value}\u0000${hitCode}`;
}

function tryLoadBundledSkillCatalog(buildFingerprint: string): FishNetSkillCatalog | undefined {
  try {
    return loadBundledSkillCatalog(buildFingerprint);
  } catch {
    return undefined;
  }
}

function tryLoadBundledSemanticMap(buildFingerprint: string): FishNetSemanticMap | undefined {
  try {
    return loadBundledFishNetSemanticMap(buildFingerprint);
  } catch {
    return undefined;
  }
}

function assertMatchingBuild(label: string, candidate: string | undefined, expected: string): void {
  if (candidate !== undefined && candidate !== expected) {
    throw new Error(`${label} build ${JSON.stringify(candidate)} does not match ${JSON.stringify(expected)}`);
  }
}
