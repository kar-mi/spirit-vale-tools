import type { CapturedFishNetPacket, FishNetDecodedValue } from "./types.ts";

export type FishNetEternalTowerPhase = "unknown" | "none" | "accept" | "inRun" | "ending" | "finished";

export interface FishNetEternalTowerSnapshot {
  /** False until an authoritative tower RPC has been observed on this session. */
  known: boolean;
  /** True while the player is in the running, ending, or completed tower instance. */
  inTower: boolean;
  /** True while the run can still progress; a finished run remains inTower until it is left. */
  active: boolean;
  phase: FishNetEternalTowerPhase;
  stateValue?: number;
  floor?: number;
  instanceId?: number;
  partyId?: number;
  finished?: boolean;
  source?: "ETUpdateRun" | "ETAdvanceFloor";
  updatedTick?: number;
}

const EMPTY: FishNetEternalTowerSnapshot = {
  known: false,
  inTower: false,
  active: false,
  phase: "unknown",
};

const PHASES: Readonly<Record<number, FishNetEternalTowerPhase>> = {
  0: "none",
  1: "accept",
  2: "inRun",
  3: "ending",
  4: "finished",
};

/** Reconstructs the local player's tower state from authoritative target RPCs. */
export class FishNetEternalTowerTracker {
  private snapshot: FishNetEternalTowerSnapshot = { ...EMPTY };
  private connectionId?: string;

  /** Returns true only when this packet changed the exposed tower state. */
  consume(packet: CapturedFishNetPacket): boolean {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      if (this.connectionId === undefined || packet.connectionId === this.connectionId) return this.reset();
      return false;
    }
    if (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "PlayerController") return false;
    if (packet.rpcName === "ETUpdateRun") return this.consumeRun(packet);
    if (packet.rpcName === "ETAdvanceFloor") return this.consumeAdvance(packet);
    // ETEnter and ETLeave are client requests, not proof that the server accepted the transition.
    return false;
  }

  current(): FishNetEternalTowerSnapshot {
    return { ...this.snapshot };
  }

  reset(): boolean {
    const changed = this.snapshot.known || this.snapshot.phase !== "unknown";
    this.snapshot = { ...EMPTY };
    this.connectionId = undefined;
    return changed;
  }

  private consumeRun(packet: CapturedFishNetPacket): boolean {
    const absent = field(packet, "match") === null;
    if (absent) return this.replace(packet, {
      known: true,
      inTower: false,
      active: false,
      phase: "none",
      finished: false,
      source: "ETUpdateRun",
      updatedTick: packet.tick,
    });

    const stateValue = integerField(packet, "match.State");
    const floor = integerField(packet, "match.Floor");
    if (stateValue === undefined || floor === undefined || PHASES[stateValue] === undefined) return false;
    const phase = PHASES[stateValue];
    return this.replace(packet, {
      known: true,
      inTower: stateValue >= 2 && stateValue <= 4,
      active: stateValue >= 1 && stateValue <= 3,
      phase,
      stateValue,
      floor,
      ...optionalInteger("instanceId", integerField(packet, "match.InstanceId")),
      ...optionalInteger("partyId", integerField(packet, "match.PartyId")),
      finished: stateValue === 4,
      source: "ETUpdateRun",
      updatedTick: packet.tick,
    });
  }

  private consumeAdvance(packet: CapturedFishNetPacket): boolean {
    const floor = integerField(packet, "floor");
    const finished = field(packet, "finished");
    if (floor === undefined || typeof finished !== "boolean") return false;
    return this.replace(packet, {
      ...this.snapshot,
      known: true,
      inTower: true,
      active: !finished,
      phase: finished ? "finished" : "inRun",
      stateValue: finished ? 4 : 2,
      floor,
      finished,
      source: "ETAdvanceFloor",
      updatedTick: packet.tick,
    });
  }

  private replace(packet: CapturedFishNetPacket, next: FishNetEternalTowerSnapshot): boolean {
    this.connectionId = packet.connectionId;
    if (sameSnapshot(this.snapshot, next)) return false;
    this.snapshot = next;
    return true;
  }
}

function field(packet: CapturedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
}

function integerField(packet: CapturedFishNetPacket, name: string): number | undefined {
  const value = field(packet, name);
  return typeof value === "number" && Number.isInteger(value) ? value : undefined;
}

function optionalInteger<Key extends "instanceId" | "partyId">(
  key: Key,
  value: number | undefined,
): Partial<Record<Key, number>> {
  return value === undefined ? {} : { [key]: value } as Record<Key, number>;
}

function sameSnapshot(left: FishNetEternalTowerSnapshot, right: FishNetEternalTowerSnapshot): boolean {
  return left.known === right.known
    && left.inTower === right.inTower
    && left.active === right.active
    && left.phase === right.phase
    && left.stateValue === right.stateValue
    && left.floor === right.floor
    && left.instanceId === right.instanceId
    && left.partyId === right.partyId
    && left.finished === right.finished
    && left.source === right.source;
}
