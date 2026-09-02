import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodedFieldRecord, decodedSummonCalibration } from "../events/combat-decoding.ts";
import type { SummonCalibrationEntry } from "../events/combat-decoding.ts";
import type { FishNetCombatActorIdentity, FishNetCombatSummonEvent } from "../events/combat-events.ts";

/** One summoned object's accumulated `SummonSkillSync`/`SummonerSync` state, keyed by its own network object id. Order-independent: either field may arrive first. */
interface PendingSummonSkillState {
  ownerActorId?: number;
  skillId?: string;
  /** Set once this object has contributed +1 to its owner's stack count, so it isn't counted twice. */
  counted: boolean;
}

type ActorIdentityResolver = (actorId: number) => FishNetCombatActorIdentity | undefined;

/**
 * Tracks per-actor summon stack counts from the `SummoningComponent` feeds. Composed by
 * `FishNetCombatTracker`, which routes the relevant packets here and forwards the emitted events.
 */
export class FishNetSummonTracker {
  private readonly summonStacks = new Map<number, Map<string, number>>();
  /** Pending `SummonSkillSync`/`SummonerSync` state per summoned object's own network id, until both are known. */
  private readonly summonSkillSyncState = new Map<number, PendingSummonSkillState>();
  /** Actors for whom a `CalibrateSummons_T` snapshot has been seen; the `SummonSkillSync` fallback stops touching their stacks from then on, since the batch RPC now fully owns them. */
  private readonly authoritativeSummonActors = new Set<number>();

  constructor(private readonly actorIdentityResolver?: ActorIdentityResolver) {}

  reset(): void {
    this.summonStacks.clear();
    this.summonSkillSyncState.clear();
    this.authoritativeSummonActors.clear();
  }

  /**
   * Login restores an existing summon through `SummonSkillSync` (a `SummoningComponent` SyncType),
   * not `CalibrateSummons_T` - that RPC only fires on a later change, so without this the overlay
   * shows nothing for a summon that was already active when the client connected.
   *
   * `SummonSkillSync` lives on the summoned object's own `SummoningComponent`, not the owner's - the
   * packet's `objectId` names the summon (e.g. one skeleton), not the actor to credit. `SummonerSync`,
   * a sibling SyncType on that same component, is the owner reference. FishNet sends every dirty
   * SyncType on login together, so both usually arrive in the same packet, but not always in the same
   * order, and only a change re-sends a SyncType afterward - so `summonSkillSyncState` accumulates
   * whichever field arrives first, per summon object, until both are known. Each summon object
   * contributes its own +1 once (never more), so two objects reporting the same skill both count -
   * this is per-object state, not a "have I seen this skill" flag.
   */
  consumeSkillSync(packet: DecodedFishNetPacket): FishNetCombatSummonEvent[] {
    const summonObjectId = packet.objectId!;
    const summonerSync = packet.syncEntries
      ?.find((candidate) => candidate.name === "SummonerSync")
      ?.fields.find((entryField) => entryField.name === "SummonerSync")?.value;
    const skillId = packet.syncEntries
      ?.find((candidate) => candidate.name === "SummonSkillSync")
      ?.fields.find((entryField) => entryField.name === "SkillId")?.value;
    if (typeof summonerSync !== "number" && typeof skillId !== "string") return [];

    const state = this.summonSkillSyncState.get(summonObjectId) ?? { counted: false };
    if (typeof summonerSync === "number") state.ownerActorId = summonerSync;
    if (typeof skillId === "string") state.skillId = skillId;
    this.summonSkillSyncState.set(summonObjectId, state);

    if (state.counted || state.ownerActorId === undefined || state.skillId === undefined) return [];
    // Once a real snapshot has been seen for this actor, it fully owns their summon stacks.
    if (this.authoritativeSummonActors.has(state.ownerActorId)) return [];

    state.counted = true;
    return [this.applyDelta(state.ownerActorId, state.skillId, 1, packet, "SummonSkillSync")];
  }

  /**
   * Clears a summon object's `SummonSkillSync` bookkeeping on despawn (or a respawn reusing the same
   * network object id), so a later reused id starts fresh rather than inheriting a stale owner/skill.
   * Also corrects the stack count for an object this tracker itself counted in, unless a
   * `CalibrateSummons_T` snapshot has since taken over that actor's stacks (which will correct the
   * count on its own).
   */
  consumeObjectLifecycle(packet: DecodedFishNetPacket): FishNetCombatSummonEvent | undefined {
    if ((packet.packetName !== "objectDespawn" && packet.packetName !== "objectSpawn") || packet.objectId === undefined) {
      return undefined;
    }
    const state = this.summonSkillSyncState.get(packet.objectId);
    if (!state) return undefined;
    this.summonSkillSyncState.delete(packet.objectId);
    if (!state.counted || state.ownerActorId === undefined || state.skillId === undefined) return undefined;
    if (this.authoritativeSummonActors.has(state.ownerActorId)) return undefined;
    return this.applyDelta(state.ownerActorId, state.skillId, -1, packet, "SummonSkillSync");
  }

  consumeCalibration(packet: DecodedFishNetPacket): FishNetCombatSummonEvent[] {
    const entries = decodedSummonCalibration(packet);
    if (!entries) return [];
    this.authoritativeSummonActors.add(packet.objectId!);
    return this.applySnapshot(packet.objectId!, packet, entries);
  }

  /** Adjusts one actor's stack count for one skill by `delta` and reports the resulting total. */
  private applyDelta(
    actorId: number,
    skillId: string,
    delta: number,
    packet: DecodedFishNetPacket,
    rpc: FishNetCombatSummonEvent["rpc"],
  ): FishNetCombatSummonEvent {
    const stacks = new Map(this.summonStacks.get(actorId));
    const nextCount = Math.max(0, (stacks.get(skillId) ?? 0) + delta);
    if (nextCount === 0) stacks.delete(skillId); else stacks.set(skillId, nextCount);
    if (stacks.size === 0) this.summonStacks.delete(actorId); else this.summonStacks.set(actorId, stacks);
    return {
      kind: "summon",
      rpc,
      tick: packet.tick,
      payloadBytes: packet.payload.length,
      fields: decodedFieldRecord(packet),
      actorId,
      skillId,
      stacks: nextCount,
      actorIdentity: this.actorIdentityResolver?.(actorId),
    };
  }

  /** Diffs one summon snapshot against the actor's last known stacks and emits only the changes. */
  private applySnapshot(
    actorId: number,
    packet: DecodedFishNetPacket,
    entries: readonly SummonCalibrationEntry[],
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
      fields: decodedFieldRecord(packet),
      actorId,
      skillId,
      stacks: current.get(skillId) ?? 0,
      actorIdentity: this.actorIdentityResolver?.(actorId),
    }));
  }
}
