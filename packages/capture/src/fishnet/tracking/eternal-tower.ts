import type { CapturedFishNetPacket, FishNetDecodedValue } from "../types.ts";

export interface FishNetEternalTowerSnapshot {
  /** False until a DrawTitle/ClientInstancedMapReady with the "et" binding slot has been observed. */
  known: boolean;
  inTower: boolean;
  floor?: number;
  /** The tower's own display name, e.g. "The Echoing Spire" - the prefix of the DrawTitle banner. */
  towerName?: string;
  instanceId?: number;
  instancedMapId?: string;
  source?: "DrawTitle" | "ClientInstancedMapReady";
  updatedTick?: number;
}

const EMPTY: FishNetEternalTowerSnapshot = { known: false, inTower: false };

/** Matches a DrawTitle banner like "The Echoing Spire\nFloor 12". */
const FLOOR_TITLE_PATTERN = /^(.*)\nFloor\s+(\d+)$/;

export class FishNetEternalTowerTracker {
  private snapshot: FishNetEternalTowerSnapshot = { ...EMPTY };

  /** Returns true only when this packet changed the exposed tower state. */
  consume(packet: CapturedFishNetPacket): boolean {
    if (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "PlayerController") return false;
    if (packet.rpcName === "DrawTitle") return this.consumeDrawTitle(packet);
    if (packet.rpcName === "ClientInstancedMapReady") return this.consumeMapReady(packet);
    return false;
  }

  current(): FishNetEternalTowerSnapshot {
    return { ...this.snapshot };
  }

  reset(): boolean {
    const changed = this.snapshot.known;
    this.snapshot = { ...EMPTY };
    return changed;
  }

  private consumeDrawTitle(packet: CapturedFishNetPacket): boolean {
    const title = field(packet, "title");
    if (typeof title !== "string") return false;
    const match = FLOOR_TITLE_PATTERN.exec(title);
    if (!match) return false;
    return this.replace({
      ...(this.snapshot.instanceId === undefined ? {} : { instanceId: this.snapshot.instanceId }),
      ...(this.snapshot.instancedMapId === undefined ? {} : { instancedMapId: this.snapshot.instancedMapId }),
      known: true,
      inTower: true,
      floor: Number(match[2]),
      towerName: match[1],
      source: "DrawTitle",
      updatedTick: packet.tick,
    });
  }

  private consumeMapReady(packet: CapturedFishNetPacket): boolean {
    const bindingSlot = field(packet, "bindingSlot");
    if (bindingSlot !== "et") return this.replace({ ...EMPTY });

    const instanceId = integerField(packet, "localMapInstanceId");
    const instancedMapId = field(packet, "instancedMapId");
    return this.replace({
      ...this.snapshot,
      known: true,
      inTower: true,
      ...(instanceId === undefined ? {} : { instanceId }),
      ...(typeof instancedMapId === "string" ? { instancedMapId } : {}),
      source: "ClientInstancedMapReady",
      updatedTick: packet.tick,
    });
  }

  private replace(next: FishNetEternalTowerSnapshot): boolean {
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

function sameSnapshot(left: FishNetEternalTowerSnapshot, right: FishNetEternalTowerSnapshot): boolean {
  return left.known === right.known
    && left.inTower === right.inTower
    && left.floor === right.floor
    && left.towerName === right.towerName
    && left.instanceId === right.instanceId
    && left.instancedMapId === right.instancedMapId
    && left.source === right.source;
}
