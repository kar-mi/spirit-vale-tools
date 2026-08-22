import type { CapturedFishNetPacket, FishNetDecodedValue } from "./types.ts";

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

/**
 * Reconstructs the local player's Eternal Tower floor from `PlayerController.DrawTitle` (a
 * targetRpc broadcasting a title banner) and `PlayerController.ClientInstancedMapReady` (confirms
 * which instanced map the client is bound to, discriminated by `bindingSlot === "et"`).
 *
 * The previous tracker consumed `ETUpdateRun`/`ETAdvanceFloor` (PlayerController wireHash 95/96).
 * Those RPCs are still present in the current build's generated rpc map (scraped from the live
 * assembly), but do not appear anywhere in three real Eternal Tower captures spanning entry, a
 * mid-tower session, and multiple floor transitions - not resolved, not unresolved, not even as
 * malformed traffic. The client-side ISIL for `EternalTowerManager`/`PlayerController` still
 * references floor state through `DrawTitle`'s "Floor {0}" format string (`PlayerController.txt`),
 * which is the mechanism this tracker follows instead.
 *
 * Deliberately does not reset on `authenticated`/`disconnect`, unlike the old tracker: a capture
 * spanning a mid-run crash and reload showed the client re-authenticate on the same floor at least
 * once with neither DrawTitle nor ClientInstancedMapReady repeating - the server does not
 * re-announce a floor the client is merely reattaching to. Treating a reconnect as "left the tower"
 * would make the overlay lose floor knowledge exactly when a crash recovery makes it most valuable.
 * Floor/tower state is instead only cleared by positive evidence of actually leaving: a
 * `ClientInstancedMapReady` whose `bindingSlot` is not `"et"`.
 *
 * Caveat: the title string was composed in a single fixed locale (English, "Floor N") in every
 * capture available. If the server localizes this banner per client, a non-English client's floor
 * would fail to parse - there is no numeric-only floor field on the wire to fall back to.
 */
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
