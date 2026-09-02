import {
  CURRENT_GAME_BUILD_FINGERPRINT,
  loadBundledFishNetRpcMap,
} from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket, FishNetRpcMap } from "@kar-mi/spirit-vale-tools-capture";
import { readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";
import { loadBundledSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import { nullableStringField, numberField } from "../events/decoded-fields.ts";
import { decodeEffectDisplays } from "../events/effect-display.ts";
import { classifyFishNetRecoveryStyle } from "../events/inference/recovery-style.ts";
import { observeFishNetDamagePacket } from "../events/damage-observer.ts";
import type { FishNetRecoveryStyle } from "../events/inference/recovery-style.ts";
import {
  BARRIER_SKILL_IDS,
  BARRIER_STATUS_IDS,
  COMBAT_SEMANTICS_BUILD_FINGERPRINT,
  DIRECT_HEALING_SKILL_IDS,
  REGENERATION_SKILL_IDS,
} from "../events/generated/combat-semantics.ts";
import {
  barrierSyncValues,
  bondSyncEntries,
  damageSignature,
  decodeFloaterSettings,
  decodedFieldRecord,
  decodedLoginEffects,
  drainRecoverySource,
  healthComponentIndices,
  isCompleteRecoverPacket,
  matchesBehaviour,
  requiredBooleanField,
  requiredNumberField,
  requiredVectorField,
  resolveDamageSource,
  stringField,
  uniqueMonsterIdentityEvents,
} from "../events/combat-decoding.ts";
import { FishNetMonsterIdentityTracker } from "./monster-identity.ts";
import { FishNetSummonTracker } from "./summon-tracker.ts";
import type {
  FishNetCombatActionKind,
  FishNetCombatActionPhase,
  FishNetCombatActivationEvent,
  FishNetCombatActorIdentity,
  FishNetCombatEvent,
  FishNetCombatHealEvent,
  FishNetCombatShieldEvent,
  FishNetCombatStatusEvent,
  FishNetCombatTrackerOptions,
  FishNetDamageAttribution,
  FishNetHealAttribution,
  FishNetHealingTraits,
  FishNetHitResult,
  FishNetShieldAction,
} from "../events/combat-events.ts";

interface ActivationState {
  id: string;
  actorId: number;
  actionKind: FishNetCombatActionKind;
  sourceId?: string;
  sourceLabel?: string;
  /** Target from `CastBegin_C.targetId` or `AutoCast_C.obj`. */
  targetId?: number;
  startTick: number;
  endTick?: number;
  deadlineTick?: number;
  inferred: boolean;
}

interface RegenSourceState {
  actorId?: number;
  sourceId?: string;
  sourceLabel?: string;
  activationId?: string;
  candidateActivationIds?: string[];
  ambiguous?: boolean;
}

interface BarrierState extends RegenSourceState {
  value: number;
  statusActive: boolean;
}

const HIT_RESULTS: Readonly<Record<number, Exclude<FishNetHitResult, number>>> = {
  0: "normal",
  1: "critical",
  2: "miss",
  3: "blocked",
  4: "dodged",
};
const SKILL_RPC_NAMES = new Set(["CastBegin_C", "AutoCast_C", "ToggleBegin_C", "CastComplete_C", "CastInterrupt_C", "CastCancel_C"]);
const CURRENT_STATUS_COMPONENT_INDICES = new Set([5, 6]);
const REGEN_STATUS_ID = "Regeneration";

/** Converts decoded FishNet RPCs into actor-grouped combat events and summaries. */
export class FishNetCombatTracker {
  private readonly hitGraceTicks: number;
  private readonly activationMaxAgeTicks: number;
  private readonly skillLabels: Map<string, string>;
  private readonly actorIdentityResolver?: (actorId: number) => FishNetCombatActorIdentity | undefined;
  private readonly healingTraitsResolver?: (actorId: number) => FishNetHealingTraits | undefined;
  private readonly healthComponentIndices: ReadonlySet<number>;
  private readonly directHealingSkillIds: ReadonlySet<string>;
  private readonly regenerationSkillIds: ReadonlySet<string>;
  private readonly barrierSkillIds: ReadonlySet<string>;
  private readonly barrierStatusIds: ReadonlySet<string>;
  private readonly monsterIdentities: FishNetMonsterIdentityTracker;
  private readonly summons: FishNetSummonTracker;
  private readonly activations = new Map<string, ActivationState>();
  private readonly activeRegenSources = new Map<number, RegenSourceState>();
  /** Guardian Bond sources keyed by recipient actor. */
  private readonly bondRegenSources = new Map<number, RegenSourceState>();
  private readonly barriers = new Map<number, BarrierState>();
  /** The most recent positive incoming hit this tick, per target, so an absorb can name the skill that caused it. */
  private readonly recentDamageHits = new Map<number, { actorId: number; sourceId: string; sourceLabel: string }>();
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
      ?? CURRENT_GAME_BUILD_FINGERPRINT;
    assertMatchingBuild("skill catalog", options.skillCatalog?.buildFingerprint, buildFingerprint);
    const skillCatalog = options.skillCatalog ?? tryLoadBundledSkillCatalog(buildFingerprint);
    const rpcMap = tryLoadBundledRpcMap(buildFingerprint);
    this.healthComponentIndices = healthComponentIndices(rpcMap);
    const currentSemantics = buildFingerprint === COMBAT_SEMANTICS_BUILD_FINGERPRINT;
    this.directHealingSkillIds = currentSemantics ? DIRECT_HEALING_SKILL_IDS : new Set();
    this.regenerationSkillIds = currentSemantics ? REGENERATION_SKILL_IDS : new Set();
    this.barrierSkillIds = currentSemantics ? BARRIER_SKILL_IDS : new Set();
    this.barrierStatusIds = currentSemantics ? BARRIER_STATUS_IDS : new Set();
    this.skillLabels = new Map(skillCatalog?.skills.map(({ id, displayName }) => [id, displayName]) ?? []);
    this.actorIdentityResolver = options.actorIdentityResolver;
    this.healingTraitsResolver = options.healingTraitsResolver;
    this.monsterIdentities = new FishNetMonsterIdentityTracker({
      monsterCatalog: options.monsterCatalog,
      bossCatalog: options.bossCatalog,
    });
    this.summons = new FishNetSummonTracker(options.actorIdentityResolver);
  }

  consume(packet: DecodedFishNetPacket): FishNetCombatEvent[] {
    // Spawn and sync packets carry no RPC, so this has to run before the early return below.
    const monsterIdentity = this.monsterIdentities.consumeDirectory(packet);
    const bossLifecycle = this.monsterIdentities.consumeBossLifecycle(packet);
    const summonLifecycle = this.summons.consumeObjectLifecycle(packet);
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.reset();
      return uniqueMonsterIdentityEvents([
        ...(monsterIdentity ? [monsterIdentity] : []),
        ...(bossLifecycle ? [bossLifecycle] : []),
      ]);
    }
    this.pruneExpired(packet.tick);
    if (this.recentDamageTick !== packet.tick) {
      this.recentDamageTick = packet.tick;
      this.recentDamageSignatures.clear();
      this.recentDamageHits.clear();
    }
    const events: FishNetCombatEvent[] = [
      ...(monsterIdentity ? [monsterIdentity] : []),
      ...(bossLifecycle ? [bossLifecycle] : []),
      ...(summonLifecycle ? [summonLifecycle] : []),
    ];
    this.consumeBondSync(packet);
    events.push(...this.consumeBarrierSync(packet));
    if (packet.packetName === "syncType" && matchesBehaviour(packet, "SummoningComponent")) {
      events.push(...this.summons.consumeSkillSync(packet));
      return events;
    }
    if (packet.objectId === undefined || !packet.rpcName) {
      events.push(...this.recoverAmbiguousCombat(packet));
      return events;
    }

    if (SKILL_RPC_NAMES.has(packet.rpcName) && matchesBehaviour(packet, "SkillsComponent")) {
      const skillEvent = this.consumeSkill(packet);
      if (skillEvent) {
        events.push(skillEvent);
        const bossIdentity = this.monsterIdentities.observeActivation(skillEvent);
        if (bossIdentity) events.push(bossIdentity);
      }
      return events;
    }
    if (packet.rpcName === "Attack_C" && matchesBehaviour(packet, "CombatComponent")) {
      events.push(this.beginAttack(packet));
      return events;
    }
    if ((packet.rpcName === "ApplyDamage_C" || packet.rpcName === "Death_C")
      && matchesBehaviour(packet, "HealthComponent")) {
      const death = packet.rpcName === "Death_C";
      if (!observeFishNetDamagePacket(packet)) return events;
      events.push(...this.consumeDamage(packet, death));
      return events;
    }
    if (packet.rpcName === "Recover_C" && matchesBehaviour(packet, "HealthComponent")) {
      if (!isCompleteRecoverPacket(packet)) return events;
      events.push(this.consumeRecover(packet));
      return events;
    }
    if ((packet.rpcName === "ApplyEffect_T" || packet.rpcName === "RemoveEffect_T")
      && matchesBehaviour(packet, "StatusComponent")) {
      const statusEvent = this.consumeStatus(packet);
      if (statusEvent) events.push(statusEvent);
      return events;
    }
    if (packet.rpcName === "ApplyEffectDisplays_O" && matchesBehaviour(packet, "StatusComponent")) {
      events.push(...this.consumeEffectDisplays(packet));
      return events;
    }
    if ((packet.rpcName === "ApplySkillDisplay_O" || packet.rpcName === "RemoveSkillDisplay_O")
      && matchesBehaviour(packet, "StatusComponent")) {
      const skillDisplay = this.consumeSkillDisplay(packet);
      if (skillDisplay) events.push(skillDisplay);
      return events;
    }
    if (packet.rpcName === "FullHeal_C" && matchesBehaviour(packet, "PlayerController")) {
      if (packet.payload.length === 0) {
        events.push({
          kind: "fullHeal",
          rpc: "FullHeal_C",
          tick: packet.tick,
          payloadBytes: 0,
          fields: {},
          targetId: packet.objectId,
          actorIdentity: this.actorIdentityResolver?.(packet.objectId),
        });
      }
      return events;
    }
    if (packet.rpcName === "CalibrateSummons_T"
      && packet.rpcResolution === "verified"
      && packet.networkBehaviourType === "SummoningComponent") {
      events.push(...this.summons.consumeCalibration(packet));
      return events;
    }
    if (packet.rpcName === "LoadCharacter_T"
      && packet.rpcResolution === "verified"
      && packet.networkBehaviourType === "PlayerSave") {
      events.push(...this.consumeLoginEffects(packet));
      return events;
    }
    return events;
  }

  reset(): void {
    this.activations.clear();
    this.activeRegenSources.clear();
    this.bondRegenSources.clear();
    this.barriers.clear();
    this.recentDamageSignatures.clear();
    this.recentDamageHits.clear();
    this.recentDamageTick = undefined;
    this.monsterIdentities.reset();
    this.summons.reset();
  }

  /**
   * Turns the observers-facing status broadcast into the same status events as the owner-only
   * `ApplyEffect_T`/`RemoveEffect_T` pair.
   *
   * This feed reports every actor in range rather than just the local player, and it repeats
   * periodically instead of only on change, so it both widens coverage and self-heals after a
   * dropped packet. It reports real remaining time, which the owner-only path can only approximate
   * from the catalog. It carries no level, so the events omit one and consumers keep whatever the
   * owner-only feed last reported.
   */
  private consumeEffectDisplays(packet: DecodedFishNetPacket): FishNetCombatStatusEvent[] {
    let batch: ReturnType<typeof decodeEffectDisplays>;
    try {
      batch = decodeEffectDisplays(packet.payload);
    } catch {
      return [];
    }
    const actorId = packet.objectId!;
    const base = {
      kind: "status",
      rpc: "ApplyEffectDisplays_O",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: {},
      actorId,
      actorIdentity: this.actorIdentityResolver?.(actorId),
    } as const;
    for (const display of batch.applies) {
      if (this.barrierStatusIds.has(display.statusId)) this.observeBarrierStatus(actorId, true, packet.tick);
    }
    for (const statusId of batch.removes) {
      if (this.barrierStatusIds.has(statusId)) this.observeBarrierStatus(actorId, false, packet.tick);
    }
    return [
      ...batch.applies.map((display): FishNetCombatStatusEvent => ({
        ...base,
        statusId: display.statusId,
        action: "applied",
        ...(display.remainingSeconds === undefined ? {} : { remainingSeconds: display.remainingSeconds }),
        stacks: display.stacks,
      })),
      ...batch.removes.map((statusId): FishNetCombatStatusEvent => ({ ...base, statusId, action: "removed" })),
    ];
  }

  /** Recovers only current-build payloads whose domain codec and component position both agree. */
  private recoverAmbiguousCombat(packet: DecodedFishNetPacket): FishNetCombatEvent[] {
    if (packet.rpcResolution !== "ambiguous"
      || packet.packetName !== "observersRpc"
      || packet.objectId === undefined
      || packet.networkBehaviourIndex === undefined) return [];

    if (packet.rpcHash === 5 && CURRENT_STATUS_COMPONENT_INDICES.has(packet.networkBehaviourIndex)) {
      return this.consumeEffectDisplays({
        ...packet,
        networkBehaviourType: "StatusComponent",
        rpcName: "ApplyEffectDisplays_O",
      });
    }

    if (packet.rpcHash !== 1 || !this.healthComponentIndices.has(packet.networkBehaviourIndex)) return [];
    let amount: ReturnType<typeof readSignedPackedWhole>;
    try {
      amount = readSignedPackedWhole(packet.payload, 0);
    } catch {
      return [];
    }
    if (amount.value < 0) return [];
    const settings = decodeFloaterSettings(packet.payload, amount.nextOffset);
    if (!settings) return [];

    return [this.consumeRecover({
      ...packet,
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      decodedFields: [
        { name: "amount", codec: "packedInt32", value: amount.value },
        ...settings,
      ],
      undecodedPayload: undefined,
    })];
  }

  /**
   * Turns the skill-icon display feed into status events.
   *
   * `ApplySkillDisplay_O`/`RemoveSkillDisplay_O` announce a *skill* shown on an actor - stances and
   * auras such as `SilentEdge` that the effect feed does not report. Ids do overlap it in places
   * (`FlowState`, `AngelicBlessing` appear on both), and this feed carries no timing at all, so it
   * must never overwrite an expiry the effect feed established. `consumeStatus` enforces that by
   * keeping a known expiry when an event brings none.
   */
  private consumeSkillDisplay(packet: DecodedFishNetPacket): FishNetCombatStatusEvent | undefined {
    const statusId = stringField(packet, "id");
    if (!statusId) return undefined;
    const actorId = packet.objectId!;
    const level = numberField(packet, "lv");
    return {
      kind: "status",
      rpc: packet.rpcName as "ApplySkillDisplay_O" | "RemoveSkillDisplay_O",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      statusId,
      action: packet.rpcName === "ApplySkillDisplay_O" ? "applied" : "removed",
      ...(level === undefined ? {} : { level }),
      actorIdentity: this.actorIdentityResolver?.(actorId),
    };
  }

  /**
   * Login restores whichever effects were active at save time through `PlayerSave.LoadCharacter_T`'s
   * own `State.Effects` snapshot - no other packet reports them. Unlike `ApplyEffectDisplays_O`
   * (which repeats and self-heals), this fires once per login, so a status it lists that never gets
   * an explicit apply afterward would otherwise never appear at all.
   */
  private consumeLoginEffects(packet: DecodedFishNetPacket): FishNetCombatStatusEvent[] {
    const entries = decodedLoginEffects(packet);
    if (!entries) return [];
    const actorId = packet.objectId!;
    return entries.map((entry): FishNetCombatStatusEvent => ({
      kind: "status",
      rpc: "LoadCharacter_T",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: {
        Id: entry.statusId,
        Level: entry.level,
        Duration: entry.remainingSeconds ?? null,
        Stacks: entry.stacks,
      },
      actorId,
      statusId: entry.statusId,
      level: entry.level,
      action: "applied",
      ...(entry.remainingSeconds === undefined ? {} : { remainingSeconds: entry.remainingSeconds }),
      stacks: entry.stacks,
      actorIdentity: this.actorIdentityResolver?.(actorId),
    }));
  }

  private consumeSkill(packet: DecodedFishNetPacket): FishNetCombatActivationEvent | undefined {
    const actorId = packet.objectId!;
    const rpcName = packet.rpcName;
    if (!rpcName) return undefined;
    if (rpcName === "CastBegin_C" || rpcName === "AutoCast_C" || rpcName === "ToggleBegin_C") {
      // A toggle names its skill in a bare `id`; a cast carries the whole SkillStateDto.
      const sourceId = rpcName === "ToggleBegin_C" ? stringField(packet, "id") : stringField(packet, "dto.Id");
      if (!sourceId) return undefined;
      const activation = this.createActivation(actorId, "skill", packet.tick, sourceId, false);
      // Both fields decode to the target's object id.
      activation.targetId = rpcName === "AutoCast_C"
        ? numberField(packet, "obj")
        : numberField(packet, "targetId");
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
        targetId: activation.targetId,
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
    const damageType = requiredNumberField(packet, "dmg.Type");
    const rawSourceId = nullableStringField(packet, "dmg.DamageSourceId");
    const { sourceId, sourceLabel } = resolveDamageSource(rawSourceId, damageType, this.skillLabels);
    const value = requiredNumberField(packet, "dmg.Value");
    if (!death && value < 0) {
      return [{
        kind: "heal",
        rpc: "ApplyDamage_C",
        tick: packet.tick,
        payloadBytes: packet.payload.length,
        fields: decodedFieldRecord(packet),
        targetId: packet.objectId!,
        actorId,
        sourceId,
        sourceLabel,
        value: -value,
        attribution: "exact",
        actorIdentity: this.actorIdentityResolver?.(actorId),
      }];
    }
    // Any hit this tick, including a value of 0: a hit that a barrier fully soaks reports no HP
    // damage, so the 0-value packet is exactly what pairs with the barrier drop below.
    if (value >= 0) this.recentDamageHits.set(packet.objectId!, { actorId, sourceId, sourceLabel });
    const hitCode = requiredNumberField(packet, "dmg.Hit");
    const hitResult = HIT_RESULTS[hitCode] ?? hitCode;
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
      damageType,
      team: requiredNumberField(packet, "dmg.Team"),
      element: requiredNumberField(packet, "dmg.Element"),
      weaponType: requiredNumberField(packet, "dmg.WeaponType"),
      range: requiredNumberField(packet, "dmg.Range"),
      isClone: requiredBooleanField(packet, "dmg.IsClone"),
      isSummon: requiredBooleanField(packet, "dmg.IsSummon"),
      attribution,
      activationId,
      candidateActivationIds,
      actorIdentity: this.actorIdentityResolver?.(actorId),
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

  private consumeRecover(packet: DecodedFishNetPacket): FishNetCombatHealEvent {
    const targetId = packet.objectId!;
    const value = requiredNumberField(packet, "amount");
    const recoveryStyle = classifyFishNetRecoveryStyle(packet);
    if (recoveryStyle === "passive-regeneration") {
      return this.createSelfRecovery(packet, value, recoveryStyle, "passive-regeneration", "Passive regeneration");
    }
    if (recoveryStyle === "drain") {
      const source = drainRecoverySource(this.healingTraitsResolver?.(targetId));
      return this.createSelfRecovery(packet, value, recoveryStyle, source.sourceId, source.sourceLabel);
    }
    const candidates = this.eligibleHealActivations(packet.tick, targetId, this.directHealingSkillIds);

    let attribution: FishNetHealAttribution;
    let actorId: number | undefined;
    let sourceId: string | undefined;
    let sourceLabel: string | undefined;
    let activationId: string | undefined;
    let candidateActivationIds: string[] | undefined;
    if (candidates.length === 1) {
      const [candidate] = candidates;
      if (!candidate) throw new Error("missing combat activation candidate");
      // Recover_C has no source field, so a matching cast remains inferred.
      attribution = "inferred";
      actorId = candidate.actorId;
      sourceId = candidate.sourceId;
      sourceLabel = candidate.sourceLabel;
      activationId = candidate.id;
    } else if (candidates.length > 1) {
      attribution = "ambiguous";
      candidateActivationIds = candidates.map(({ id }) => id);
    } else {
      const regenSource = this.activeRegenSources.get(targetId) ?? this.bondRegenSources.get(targetId);
      if (regenSource?.candidateActivationIds || regenSource?.ambiguous) {
        attribution = "ambiguous";
        candidateActivationIds = regenSource.candidateActivationIds;
      } else if (regenSource?.actorId !== undefined) {
        attribution = "inferred";
        actorId = regenSource.actorId;
        sourceId = regenSource.sourceId;
        sourceLabel = regenSource.sourceLabel;
        activationId = regenSource.activationId;
      } else {
        attribution = "unattributed";
      }
    }

    return {
      kind: "heal",
      rpc: "Recover_C",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      targetId,
      actorId,
      sourceId,
      sourceLabel,
      value,
      recoveryStyle,
      attribution,
      activationId,
      candidateActivationIds,
      actorIdentity: actorId === undefined ? undefined : this.actorIdentityResolver?.(actorId),
    };
  }

  private consumeBarrierSync(packet: DecodedFishNetPacket): FishNetCombatShieldEvent[] {
    if (packet.objectId === undefined) return [];
    if (packet.packetName === "objectDespawn" || packet.packetName === "objectSpawn") {
      this.barriers.delete(packet.objectId);
      if (packet.packetName === "objectDespawn") return [];
    }
    const values = barrierSyncValues(packet);
    if (values.length === 0) return [];
    const targetId = packet.objectId;
    const events: FishNetCombatShieldEvent[] = [];
    for (const barrierAfter of values) {
      if (!Number.isInteger(barrierAfter) || barrierAfter < 0) continue;
      const previous = this.barriers.get(targetId);
      if (!previous || packet.packetName === "objectSpawn") {
        this.barriers.set(targetId, { value: barrierAfter, statusActive: previous?.statusActive ?? false });
        continue;
      }
      const barrierBefore = previous.value;
      if (barrierAfter === barrierBefore) continue;
      let source: RegenSourceState = previous;
      let action: FishNetShieldAction;
      if (barrierAfter > barrierBefore) {
        source = sourceFromCandidates(this.eligibleHealActivations(packet.tick, targetId, this.barrierSkillIds));
        action = "gained";
      } else if (this.recentDamageHits.has(targetId)) {
        // A barrier that shrinks on the same tick the target was hit soaked that hit — whether it
        // dropped part-way or to zero. Only checked before "cleared" so a full absorb is not lost
        // as an expiry (many barrier buffs carry no status this tracker recognises).
        action = "absorbed";
      } else if (barrierAfter === 0 && !previous.statusActive) {
        action = "cleared";
      } else {
        action = "reduced";
      }
      const incoming = action === "absorbed" ? this.recentDamageHits.get(targetId) : undefined;
      const attribution: FishNetHealAttribution = source.candidateActivationIds
        ? "ambiguous"
        : source.actorId === undefined ? "unattributed" : "inferred";
      events.push({
        kind: "shield",
        rpc: "barrierSync",
        tick: packet.tick,
        payloadBytes: packet.payload.length,
        fields: { barrierSync: barrierAfter },
        targetId,
        actorId: source.actorId,
        sourceId: source.sourceId,
        sourceLabel: source.sourceLabel,
        value: Math.abs(barrierAfter - barrierBefore),
        barrierBefore,
        barrierAfter,
        action,
        ...(incoming === undefined ? {} : {
          incomingActorId: incoming.actorId,
          incomingSourceId: incoming.sourceId,
          incomingSourceLabel: incoming.sourceLabel,
        }),
        attribution,
        activationId: source.activationId,
        candidateActivationIds: source.candidateActivationIds,
        actorIdentity: source.actorId === undefined ? undefined : this.actorIdentityResolver?.(source.actorId),
      });
      this.barriers.set(targetId, {
        ...source,
        value: barrierAfter,
        statusActive: barrierAfter === 0 ? false : previous.statusActive,
      });
    }
    return events;
  }

  /** Reads Guardian Bond sources from recipient-side BondSync entries. */
  private consumeBondSync(packet: DecodedFishNetPacket): void {
    if (packet.objectId === undefined) return;
    if (packet.packetName === "objectDespawn" || packet.packetName === "objectSpawn") {
      this.bondRegenSources.delete(packet.objectId);
      if (packet.packetName === "objectDespawn") return;
    }
    const entries = bondSyncEntries(packet);
    if (!entries) return;
    const sources = entries.filter((entry) => !entry.caster && this.regenerationSkillIds.has(entry.skillId));
    if (sources.length === 0) {
      this.bondRegenSources.delete(packet.objectId);
    } else if (sources.length === 1) {
      const source = sources[0]!;
      this.bondRegenSources.set(packet.objectId, {
        actorId: source.otherId,
        sourceId: source.skillId,
        sourceLabel: this.skillLabels.get(source.skillId) ?? source.skillId,
      });
    } else {
      this.bondRegenSources.set(packet.objectId, { ambiguous: true });
    }
  }

  private createSelfRecovery(
    packet: DecodedFishNetPacket,
    value: number,
    recoveryStyle: FishNetRecoveryStyle,
    sourceId: string,
    sourceLabel: string,
  ): FishNetCombatHealEvent {
    const actorId = packet.objectId!;
    return {
      kind: "heal",
      rpc: "Recover_C",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      targetId: actorId,
      actorId,
      sourceId,
      sourceLabel,
      value,
      recoveryStyle,
      attribution: "inferred",
      actorIdentity: this.actorIdentityResolver?.(actorId),
    };
  }

  private eligibleHealActivations(tick: number, recipientId: number, skillIds: ReadonlySet<string>): ActivationState[] {
    return [...this.activations.values()].filter((activation) =>
      activation.actionKind === "skill"
      && activation.sourceId !== undefined
      && skillIds.has(activation.sourceId)
      && activation.startTick <= tick
      && (activation.deadlineTick === undefined || tick <= activation.deadlineTick)
      && activation.targetId === recipientId);
  }

  private consumeStatus(packet: DecodedFishNetPacket): FishNetCombatStatusEvent | undefined {
    const statusId = stringField(packet, "statusId");
    const level = numberField(packet, "level");
    if (statusId === undefined || level === undefined) return undefined;
    const actorId = packet.objectId!;
    if (statusId === REGEN_STATUS_ID) {
      if (packet.rpcName === "ApplyEffect_T") {
        const candidates = this.eligibleHealActivations(packet.tick, actorId, this.regenerationSkillIds);
        if (candidates.length === 1) {
          const [candidate] = candidates;
          if (!candidate) throw new Error("missing combat activation candidate");
          this.activeRegenSources.set(actorId, {
            actorId: candidate.actorId,
            sourceId: candidate.sourceId,
            sourceLabel: candidate.sourceLabel,
            activationId: candidate.id,
          });
        } else if (candidates.length > 1) {
          this.activeRegenSources.set(actorId, { candidateActivationIds: candidates.map(({ id }) => id) });
        } else {
          this.activeRegenSources.delete(actorId);
        }
      } else {
        this.activeRegenSources.delete(actorId);
      }
    }
    if (this.barrierStatusIds.has(statusId)) {
      this.observeBarrierStatus(actorId, packet.rpcName === "ApplyEffect_T", packet.tick);
    }
    return {
      kind: "status",
      rpc: packet.rpcName as "ApplyEffect_T" | "RemoveEffect_T",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      statusId,
      level,
      action: packet.rpcName === "ApplyEffect_T" ? "applied" : "removed",
      actorIdentity: this.actorIdentityResolver?.(actorId),
    };
  }

  private observeBarrierStatus(actorId: number, applied: boolean, tick: number): void {
    const current = this.barriers.get(actorId) ?? { value: 0, statusActive: false };
    if (!applied) {
      this.barriers.set(actorId, { ...current, statusActive: false });
      return;
    }
    const source = sourceFromCandidates(this.eligibleHealActivations(tick, actorId, this.barrierSkillIds));
    this.barriers.set(actorId, { ...current, ...source, statusActive: true });
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

function sourceFromCandidates(candidates: ActivationState[]): RegenSourceState {
  if (candidates.length === 1) {
    const candidate = candidates[0]!;
    return {
      actorId: candidate.actorId,
      sourceId: candidate.sourceId,
      sourceLabel: candidate.sourceLabel,
      activationId: candidate.id,
    };
  }
  return candidates.length > 1
    ? { candidateActivationIds: candidates.map(({ id }) => id) }
    : {};
}

function tryLoadBundledSkillCatalog(buildFingerprint: string): FishNetSkillCatalog | undefined {
  try {
    return loadBundledSkillCatalog(buildFingerprint);
  } catch {
    return undefined;
  }
}

function tryLoadBundledRpcMap(buildFingerprint: string): FishNetRpcMap | undefined {
  try {
    return loadBundledFishNetRpcMap(buildFingerprint);
  } catch {
    return undefined;
  }
}

function assertMatchingBuild(label: string, candidate: string | undefined, expected: string): void {
  if (candidate !== undefined && candidate !== expected) {
    throw new Error(`${label} build ${JSON.stringify(candidate)} does not match ${JSON.stringify(expected)}`);
  }
}
