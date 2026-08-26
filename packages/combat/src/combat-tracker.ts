import {
  classifyFishNetRecoveryStyle,
  CURRENT_GAME_BUILD_FINGERPRINT,
  FishNetMonsterDirectory,
  loadBundledFishNetSemanticMap,
} from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket, FishNetDecodedValue, FishNetMonsterDirectoryChange, FishNetRecoveryStyle, FishNetSemanticMap } from "@kar-mi/spirit-vale-tools-capture";
import { readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";
import { loadBundledSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import { decodeEffectDisplays } from "./effect-display.ts";
import { decodeSummonCalibration } from "./summon-calibration.ts";

export type FishNetCombatActionKind = "skill" | "basicAttack" | "inferred";
export type FishNetCombatActionPhase = "begin" | "complete" | "interrupt" | "cancel" | "inferred";
export type FishNetDamageAttribution = "exact" | "ambiguous" | "inferred";
export type FishNetHitResult = "normal" | "critical" | "miss" | "blocked" | "dodged" | number;

export interface FishNetCombatActorIdentity {
  readonly displayName: string;
  readonly archetype?: number;
  readonly ownerConnectionId?: number;
  readonly uid?: string;
}

/** Names a monster type. */
export interface FishNetMonsterCatalog {
  get(mobId: string): { readonly level: number; readonly displayName: string } | undefined;
}

/** Curated, build-scoped boss names keyed by a skill unique to that boss. */
export interface FishNetBossCatalog {
  get(skillId: string): { readonly displayName: string } | undefined;
}

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
  /** Resolves an attacker to a known player identity, including owner/UID continuity. */
  actorIdentityResolver?: (actorId: number) => FishNetCombatActorIdentity | undefined;
  /** Resolves healing mechanics for actors whose local character build is visible. */
  healingTraitsResolver?: (actorId: number) => FishNetHealingTraits | undefined;
  /** The local player's network object id, when known. */
  localActorIdResolver?: () => number | undefined;
  /** Names monsters seen spawning, emitting identity lifecycle events keyed by network object id. */
  monsterCatalog?: FishNetMonsterCatalog;
  /** Fallback names for otherwise-anonymous bosses; game-provided identities always win. */
  bossCatalog?: FishNetBossCatalog;
}

export type FishNetCombatMonsterIdentityEvent =
  | {
      kind: "monsterIdentity";
      operation: "upsert";
      tick: number;
      actorId: number;
      mobId: string;
      displayName: string;
      actorIdentity?: never;
    }
  | {
      kind: "monsterIdentity";
      operation: "remove";
      tick: number;
      actorId: number;
      actorIdentity?: never;
    }
  | {
      kind: "monsterIdentity";
      operation: "reset";
      tick: number;
      actorId?: never;
      actorIdentity?: never;
    };

export interface FishNetHealingTraits {
  readonly hasSiphonHealth: boolean;
  readonly hasHealthLeech: boolean;
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
  actorIdentity?: FishNetCombatActorIdentity;
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
  actorIdentity?: FishNetCombatActorIdentity;
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
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatStatusEvent {
  kind: "status";
  rpc: "ApplyEffect_T" | "RemoveEffect_T" | "ApplyEffectDisplays_O" | "ApplySkillDisplay_O" | "RemoveSkillDisplay_O";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  statusId: string;
  /** Absent on `ApplyEffectDisplays_O`, which carries no level; consumers keep the last known one. */
  level?: number;
  action: "applied" | "removed";
  /** Server-reported time left, from `ApplyEffectDisplays_O` only. */
  remainingSeconds?: number;
  stacks?: number;
  actorIdentity?: FishNetCombatActorIdentity;
}

export interface FishNetCombatSummonEvent {
  kind: "summon";
  rpc: "CalibrateSummons_T";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  actorId: number;
  skillId: string;
  stacks: number;
  /** True when the packet arrived unnamed and was recovered heuristically. See `recoverSummons`. */
  recovered?: boolean;
  actorIdentity?: FishNetCombatActorIdentity;
}

/** A `PlayerController.FullHeal_C`, which restores an actor outright. */
interface FishNetCombatFullHealEvent {
  kind: "fullHeal";
  rpc: "FullHeal_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  /** The restored actor: the RPC's own object. There is no healer on the wire. */
  targetId: number;
  /** No one performed this heal, so no actor may be credited for it. */
  actorId?: never;
  actorIdentity?: FishNetCombatActorIdentity;
}

export type FishNetHealAttribution = FishNetDamageAttribution | "unattributed";

export interface FishNetCombatHealEvent {
  kind: "heal";
  /** `ApplyDamage_C` is authoritative when its signed damage value is negative. */
  rpc: "ApplyDamage_C" | "Recover_C";
  tick: number;
  payloadBytes: number;
  fields: Record<string, FishNetDecodedValue>;
  /** The healed entity — always known (it's the RPC's objectId). */
  targetId: number;
  /** The inferred healer, when attribution succeeds. Absent when fully unattributed or ambiguous. */
  actorId?: number;
  sourceId?: string;
  sourceLabel?: string;
  value: number;
  /** Semantic style derived from the build-specific Recover_C FloaterSettings. */
  recoveryStyle?: FishNetRecoveryStyle;
  attribution: FishNetHealAttribution;
  activationId?: string;
  candidateActivationIds?: string[];
  actorIdentity?: FishNetCombatActorIdentity;
}

export type FishNetCombatEvent =
  | FishNetCombatMonsterIdentityEvent
  | FishNetCombatActivationEvent
  | FishNetCombatDamageEvent
  | FishNetCombatDeathEvent
  | FishNetCombatStatusEvent
  | FishNetCombatSummonEvent
  | FishNetCombatHealEvent
  | FishNetCombatFullHealEvent;

interface ActivationState {
  id: string;
  actorId: number;
  actionKind: FishNetCombatActionKind;
  sourceId?: string;
  sourceLabel?: string;
  /** The cast's declared target (from CastBegin_C's targetId field), when known. */
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
const CURRENT_HEALTH_COMPONENT_INDICES = new Set([2, 3]);
/** Upper bound on a payload `recoverSummons` will even attempt. */
const MAX_RECOVERED_SUMMON_BYTES = 256;
/** Known healing skill ids, from observed CastBegin_C/AutoCast_C activations. */
const HEALING_SKILL_IDS = new Set(["Heal", "HighHeal", "FieldHealing"]);
/** Skill ids that heal indirectly by granting the "Regeneration" status (per packages/statuses/src/definitions/statuses.ts) rather than an immediate Recover_C. */
const REGEN_SKILL_IDS = new Set(["HealAll", "Sanctuary", "GuardianBond", "SanctuaryField"]);
const REGEN_STATUS_ID = "Regeneration";

/** Converts decoded FishNet RPCs into actor-grouped combat events and summaries. */
export class FishNetCombatTracker {
  private readonly hitGraceTicks: number;
  private readonly activationMaxAgeTicks: number;
  private readonly skillLabels: Map<string, string>;
  private readonly actorIdentityResolver?: (actorId: number) => FishNetCombatActorIdentity | undefined;
  private readonly healingTraitsResolver?: (actorId: number) => FishNetHealingTraits | undefined;
  private readonly localActorIdResolver?: () => number | undefined;
  private readonly monsterCatalog?: FishNetMonsterCatalog;
  private readonly bossCatalog?: FishNetBossCatalog;
  private readonly monsters?: FishNetMonsterDirectory;
  private readonly semanticMap?: FishNetSemanticMap;
  private readonly activations = new Map<string, ActivationState>();
  /** Curated boss names are valid only for the lifetime of their network object id. */
  private readonly bossIdentities = new Map<number, string>();
  private readonly activeRegenSources = new Map<number, RegenSourceState>();
  private readonly summonStacks = new Map<number, Map<string, number>>();
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
    this.semanticMap = semanticMap;
    this.skillLabels = new Map(skillCatalog?.skills.map(({ id, displayName }) => [id, displayName]) ?? []);
    for (const { value, label } of semanticMap?.verifiedSkillLabels ?? []) this.skillLabels.set(value, label);
    this.actorIdentityResolver = options.actorIdentityResolver;
    this.healingTraitsResolver = options.healingTraitsResolver;
    this.localActorIdResolver = options.localActorIdResolver;
    this.monsterCatalog = options.monsterCatalog;
    if (options.monsterCatalog) this.monsters = new FishNetMonsterDirectory(options.monsterCatalog);
    this.bossCatalog = options.bossCatalog;
  }

  consume(packet: DecodedFishNetPacket): FishNetCombatEvent[] {
    // Spawn and sync packets carry no RPC, so this has to run before the early return below.
    const monsterIdentity = this.monsterIdentity(packet.tick, this.monsters?.consume(packet));
    const bossLifecycle = this.bossIdentityLifecycle(packet);
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
    }
    const events: FishNetCombatEvent[] = [
      ...(monsterIdentity ? [monsterIdentity] : []),
      ...(bossLifecycle ? [bossLifecycle] : []),
    ];
    if (packet.objectId === undefined || !packet.rpcName) {
      events.push(...this.recoverAmbiguousCombat(packet));
      events.push(...this.recoverSummons(packet));
      return events;
    }

    if (SKILL_RPC_NAMES.has(packet.rpcName) && matchesBehaviour(packet, "SkillsComponent")) {
      const skillEvent = this.consumeSkill(packet);
      if (skillEvent) {
        events.push(skillEvent);
        const bossIdentity = this.bossIdentity(skillEvent);
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
      if (!isCompleteDamagePacket(packet, !death)) return events;
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
    if (packet.rpcName === "CalibrateSummons_T" && matchesBehaviour(packet, "SummoningComponent")) {
      events.push(...this.consumeSummonCalibration(packet));
      return events;
    }
    return events;
  }

  reset(): void {
    this.activations.clear();
    this.bossIdentities.clear();
    this.activeRegenSources.clear();
    this.summonStacks.clear();
    this.recentDamageSignatures.clear();
    this.recentDamageTick = undefined;
    this.monsters?.reset();
  }

  private monsterIdentity(
    tick: number,
    change: FishNetMonsterDirectoryChange | undefined,
  ): FishNetCombatMonsterIdentityEvent | undefined {
    if (!change) return undefined;
    if (change.operation === "reset") return { kind: "monsterIdentity", operation: "reset", tick };
    if (change.operation === "remove") {
      return { kind: "monsterIdentity", operation: "remove", tick, actorId: change.objectId };
    }
    const definition = this.monsterCatalog?.get(change.spawn.mobId);
    return definition ? {
      kind: "monsterIdentity",
      operation: "upsert",
      tick,
      actorId: change.objectId,
      mobId: change.spawn.mobId,
      displayName: definition.displayName,
    } : undefined;
  }

  /** Uses the normal monster-identity path so all consumers receive the curated boss name. */
  private bossIdentity(event: FishNetCombatActivationEvent): FishNetCombatMonsterIdentityEvent | undefined {
    // Spawn-derived monster data and player identities are authoritative.
    if (!event.sourceId || event.actorIdentity || this.monsters?.get(event.actorId)) return undefined;
    const definition = this.bossCatalog?.get(event.sourceId);
    if (!definition) return undefined;
    if (this.bossIdentities.has(event.actorId)) return undefined;
    this.bossIdentities.set(event.actorId, definition.displayName);
    return {
      kind: "monsterIdentity",
      operation: "upsert",
      tick: event.tick,
      actorId: event.actorId,
      mobId: `boss:${event.sourceId}`,
      displayName: definition.displayName,
    };
  }

  /**
   * FishNet may reuse an object id in a later zone. Drop a curated boss name at every object
   * lifetime boundary so the next boss cannot inherit the old one's identity before it casts.
   */
  private bossIdentityLifecycle(packet: DecodedFishNetPacket): FishNetCombatMonsterIdentityEvent | undefined {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      if (this.bossIdentities.size === 0) return undefined;
      this.bossIdentities.clear();
      return { kind: "monsterIdentity", operation: "reset", tick: packet.tick };
    }
    if ((packet.packetName !== "objectSpawn" && packet.packetName !== "objectDespawn")
      || packet.objectId === undefined
      || !this.bossIdentities.delete(packet.objectId)) return undefined;
    return { kind: "monsterIdentity", operation: "remove", tick: packet.tick, actorId: packet.objectId };
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

    if (packet.rpcHash !== 1 || !CURRENT_HEALTH_COMPONENT_INDICES.has(packet.networkBehaviourIndex)) return [];
    let amount: ReturnType<typeof readSignedPackedWhole>;
    try {
      amount = readSignedPackedWhole(packet.payload, 0);
    } catch {
      return [];
    }
    if (amount.value < 0) return [];
    const settings = packet.payload.subarray(amount.nextOffset);
    const settingsHex = settings.toString("hex");
    const knownHealthRecovery = this.semanticMap?.recoveryStyles?.some((definition) =>
      definition.networkBehaviourType === "HealthComponent"
      && definition.rpcName === "Recover_C"
      && definition.undecodedPayloadHex === settingsHex
    ) ?? false;
    if (!knownHealthRecovery) return [];

    return [this.consumeRecover({
      ...packet,
      networkBehaviourType: "HealthComponent",
      rpcName: "Recover_C",
      decodedFields: [{ name: "amount", codec: "packedInt32", value: amount.value }],
      undecodedPayload: settings,
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
   * Last-resort recovery for a `CalibrateSummons_T` the capture layer could not name. Two paths lose
   * it. An rpcLink whose registration never arrived carries no object id, no hash and no name at all
   * - links are only ever learned from an `objectSpawn`, so if the player object's spawn is missed on
   * a connection, every link on that object is dead for the connection's whole life. A plain
   * targetRpc on an object with no bound components fares little better: wire hash 0 is shared by
   * several behaviours, and with nothing bound there is nothing to eliminate against. Either way the
   * summon tile stays blank until a map change respawns the player object and re-registers its links.
   *
   * This is a heuristic and deliberately narrow. `decodeSummonCalibration` must consume the payload
   * exactly, at least one entry must decode, every skill id must be one the catalog knows, and the
   * result is attributed to the local player because `CalibrateSummons_T` is a targetRpc no other
   * client receives. An empty calibration - the "all summons gone" snapshot - is *not* recovered: it
   * encodes as a single 0x01 byte, which carries no signature worth trusting.
   */
  private recoverSummons(packet: DecodedFishNetPacket): FishNetCombatSummonEvent[] {
    // `recovered` counts as named: the decoder already corroborated a quarantined registration, so
    // the normal path handles it and guessing again here would double count.
    if (packet.rpcName || packet.rpcResolution === "verified" || packet.rpcResolution === "recovered") return [];
    if (packet.payload.length < 2 || packet.payload.length > MAX_RECOVERED_SUMMON_BYTES) return [];
    if (this.skillLabels.size === 0) return [];
    const actorId = packet.objectId ?? this.localActorIdResolver?.();
    if (actorId === undefined) return [];

    let entries: ReturnType<typeof decodeSummonCalibration>;
    try {
      entries = decodeSummonCalibration(packet.payload);
    } catch {
      return [];
    }
    if (entries.length === 0) return [];
    if (!entries.every(({ skillId }) => this.skillLabels.has(skillId))) return [];

    return this.applySummonSnapshot(actorId, packet, entries).map((event) => ({ ...event, recovered: true }));
  }

  private consumeSummonCalibration(packet: DecodedFishNetPacket): FishNetCombatSummonEvent[] {
    let entries: ReturnType<typeof decodeSummonCalibration>;
    try {
      entries = decodeSummonCalibration(packet.payload);
    } catch {
      return [];
    }
    return this.applySummonSnapshot(packet.objectId!, packet, entries);
  }

  /** Diffs one summon snapshot against the actor's last known stacks and emits only the changes. */
  private applySummonSnapshot(
    actorId: number,
    packet: DecodedFishNetPacket,
    entries: ReturnType<typeof decodeSummonCalibration>,
  ): FishNetCombatSummonEvent[] {
    const previous = this.summonStacks.get(actorId) ?? new Map<string, number>();
    const current = new Map<string, number>();
    for (const { skillId } of entries) current.set(skillId, (current.get(skillId) ?? 0) + 1);

    const changedSkillIds = [
      ...current.keys(),
      ...[...previous.keys()].filter((skillId) => !current.has(skillId)),
    ].filter((skillId) => current.get(skillId) !== previous.get(skillId));

    if (current.size === 0) this.summonStacks.delete(actorId);
    else this.summonStacks.set(actorId, current);

    return changedSkillIds.map((skillId) => ({
      kind: "summon",
      rpc: "CalibrateSummons_T",
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: {},
      actorId,
      skillId,
      stacks: current.get(skillId) ?? 0,
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
      activation.targetId = numberField(packet, "targetId");
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
    const recoveryStyle = classifyFishNetRecoveryStyle(packet, this.semanticMap);
    if (recoveryStyle === "passive-regeneration") {
      return this.createSelfRecovery(packet, value, recoveryStyle, "passive-regeneration", "Passive regeneration");
    }
    if (recoveryStyle === "drain") {
      const source = drainRecoverySource(this.healingTraitsResolver?.(targetId));
      return this.createSelfRecovery(packet, value, recoveryStyle, source.sourceId, source.sourceLabel);
    }
    const candidates = this.eligibleHealActivations(packet.tick, targetId, HEALING_SKILL_IDS);

    let attribution: FishNetHealAttribution;
    let actorId: number | undefined;
    let sourceId: string | undefined;
    let sourceLabel: string | undefined;
    let activationId: string | undefined;
    let candidateActivationIds: string[] | undefined;
    if (candidates.length === 1) {
      const [candidate] = candidates;
      if (!candidate) throw new Error("missing combat activation candidate");
      attribution = candidate.inferred ? "inferred" : "exact";
      actorId = candidate.actorId;
      sourceId = candidate.sourceId;
      sourceLabel = candidate.sourceLabel;
      activationId = candidate.id;
    } else if (candidates.length > 1) {
      attribution = "ambiguous";
      candidateActivationIds = candidates.map(({ id }) => id);
    } else {
      const regenSource = this.activeRegenSources.get(targetId);
      if (regenSource?.candidateActivationIds) {
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
        const candidates = this.eligibleHealActivations(packet.tick, actorId, REGEN_SKILL_IDS);
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

function drainRecoverySource(traits: FishNetHealingTraits | undefined): { sourceId: string; sourceLabel: string } {
  if (traits?.hasSiphonHealth && !traits.hasHealthLeech) {
    return { sourceId: "siphon-health", sourceLabel: "Siphon Health" };
  }
  if (traits?.hasHealthLeech && !traits.hasSiphonHealth) {
    return { sourceId: "health-leech", sourceLabel: "Health Leech" };
  }
  return { sourceId: "siphon-health-leech", sourceLabel: "Siphon / Health Leech" };
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

function isCompleteRecoverPacket(packet: DecodedFishNetPacket): boolean {
  return numberField(packet, "amount") !== undefined;
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

interface DamageSource {
  sourceId: string;
  sourceLabel: string;
}

const DAMAGE_TYPE_SOURCES = new Map<number, DamageSource>([
  [4, { sourceId: "reflect", sourceLabel: "Reflect Damage" }],
]);

function resolveDamageSource(
  rawSourceId: string | null | undefined,
  damageType: number,
  skillLabels: ReadonlyMap<string, string>,
): DamageSource {
  if (typeof rawSourceId === "string") {
    return {
      sourceId: rawSourceId,
      sourceLabel: skillLabels.get(rawSourceId) ?? rawSourceId,
    };
  }
  return (rawSourceId === null ? DAMAGE_TYPE_SOURCES.get(damageType) : undefined) ?? {
    sourceId: "unknown",
    sourceLabel: "unknown",
  };
}

function uniqueMonsterIdentityEvents(events: FishNetCombatMonsterIdentityEvent[]): FishNetCombatMonsterIdentityEvent[] {
  return events.filter((event, index) => event.operation !== "reset" || events.findIndex((candidate) => candidate.operation === "reset") === index);
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
