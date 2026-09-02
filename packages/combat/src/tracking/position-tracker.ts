import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetActorDirectory } from "./actor-directory.ts";

export interface FishNetPosition {
  x: number;
  y: number;
  z: number;
  /** Yaw (radians, about the world up axis) the object was last known to be facing. */
  heading?: number;
}

export interface FishNetPositionEvent {
  kind: "position";
  tick: number;
  objectId: number;
  position: FishNetPosition;
  /** Display name of the object's owner, when the actor directory knows one. */
  displayName?: string;
  /** True when this object is the local player's, per the identity the caller supplied. */
  self: boolean;
}

export interface FishNetPositionTrackerOptions {
  /** Names positions. The directory is not driven from here — feed it the same packets. */
  directory?: FishNetActorDirectory;
}

/** Tracks where every observed object is. */
export class FishNetPositionTracker {
  private readonly positions = new Map<number, FishNetPosition>();
  private localObjectId?: number;

  constructor(private readonly options: FishNetPositionTrackerOptions = {}) {}

  /** Marks which object is the local player's, as decided by the caller's existing identity source. */
  setLocalObjectId(objectId: number | undefined): void {
    this.localObjectId = objectId;
  }

  /** Last known position of the local player's object, when one has been established. */
  self(): FishNetPosition | undefined {
    return this.localObjectId === undefined ? undefined : this.positions.get(this.localObjectId);
  }

  get(objectId: number): FishNetPosition | undefined {
    return this.positions.get(objectId);
  }

  snapshot(): Array<{ objectId: number; position: FishNetPosition }> {
    return [...this.positions].map(([objectId, position]) => ({ objectId, position: { ...position } }));
  }

  reset(): void {
    this.positions.clear();
    this.localObjectId = undefined;
  }

  consume(packet: DecodedFishNetPacket): FishNetPositionEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.reset();
      return [];
    }
    if (packet.objectId === undefined) return [];
    if (packet.packetName === "objectDespawn") {
      this.positions.delete(packet.objectId);
      return [];
    }
    if (packet.packetName === "objectSpawn") {
      const spawn = packet.spawnLocalPosition;
      if (!spawn) return [];
      const position: FishNetPosition = { x: spawn[0], y: spawn[1], z: spawn[2] };
      if (packet.spawnHeading !== undefined) position.heading = packet.spawnHeading;
      this.positions.set(packet.objectId, position);
      return [this.event(packet, packet.objectId, position)];
    }
    const update = packet.networkTransform;
    if (!update) return [];
    const previous = this.positions.get(packet.objectId);
    const next = {
      x: update.position.x ?? previous?.x,
      y: update.position.y ?? previous?.y,
      z: update.position.z ?? previous?.z,
    };
    // A partial update with no baseline is not a position yet; wait rather than report a hole as 0.
    if (next.x === undefined || next.y === undefined || next.z === undefined) return [];
    const position: FishNetPosition = { x: next.x, y: next.y, z: next.z };
    // Rotation resends the same way position axes do: an update without one means unchanged, so the last-known heading carries forward.
    const heading = update.heading ?? previous?.heading;
    if (heading !== undefined) position.heading = heading;
    this.positions.set(packet.objectId, position);
    return [this.event(packet, packet.objectId, position)];
  }

  private event(packet: DecodedFishNetPacket, objectId: number, position: FishNetPosition): FishNetPositionEvent {
    const displayName = this.options.directory?.getAttribution(objectId)?.displayName;
    return {
      kind: "position",
      tick: packet.tick,
      objectId,
      position: { ...position },
      ...(displayName === undefined ? {} : { displayName }),
      self: objectId === this.localObjectId,
    };
  }
}
