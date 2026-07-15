import type { DecodedFishNetPacket, FishNetDecodedValue } from "./types.ts";

export interface FishNetActorIdentity {
  readonly actorId: number;
  readonly displayName: string;
  readonly archetype?: number;
}

export interface FishNetActorIdentityUpsertEvent extends FishNetActorIdentity {
  kind: "actorIdentity";
  operation: "upsert";
  tick: number;
}

export interface FishNetActorIdentityRemoveEvent {
  kind: "actorIdentity";
  operation: "remove";
  tick: number;
  actorId: number;
}

export interface FishNetActorIdentityResetEvent {
  kind: "actorIdentity";
  operation: "reset";
  tick: number;
}

export type FishNetActorIdentityEvent =
  | FishNetActorIdentityUpsertEvent
  | FishNetActorIdentityRemoveEvent
  | FishNetActorIdentityResetEvent;

/** Tracks public display names by the FishNet object IDs used by combat events. */
export class FishNetActorDirectory {
  private readonly identities = new Map<number, FishNetActorIdentity>();

  consume(packet: DecodedFishNetPacket): FishNetActorIdentityEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.identities.clear();
      return [{ kind: "actorIdentity", operation: "reset", tick: packet.tick }];
    }

    if (packet.objectId !== undefined
      && (packet.packetName === "objectSpawn" || packet.packetName === "objectDespawn")) {
      return this.remove(packet.objectId, packet.tick);
    }

    if (packet.packetName !== "syncType"
      || packet.objectId === undefined
      || packet.networkBehaviourType !== "PlayerController"
      || (packet.syncName !== "VisualData" && packet.syncIndex !== 5)) {
      return [];
    }

    const displayName = decodedField(packet, "Appearance.DisplayName");
    if (typeof displayName !== "string" || displayName.length === 0) return [];
    const decodedArchetype = decodedField(packet, "Appearance.Archetype");
    const archetype = typeof decodedArchetype === "number" && Number.isInteger(decodedArchetype)
      ? decodedArchetype
      : undefined;
    const next: FishNetActorIdentity = {
      actorId: packet.objectId,
      displayName,
      ...(archetype === undefined ? {} : { archetype }),
    };
    const current = this.identities.get(packet.objectId);
    if (current?.displayName === next.displayName && current.archetype === next.archetype) return [];
    this.identities.set(packet.objectId, next);
    return [{ kind: "actorIdentity", operation: "upsert", tick: packet.tick, ...next }];
  }

  get(actorId: number): FishNetActorIdentity | undefined {
    const identity = this.identities.get(actorId);
    return identity ? { ...identity } : undefined;
  }

  reset(): void {
    this.identities.clear();
  }

  private remove(actorId: number, tick: number): FishNetActorIdentityEvent[] {
    if (!this.identities.delete(actorId)) return [];
    return [{ kind: "actorIdentity", operation: "remove", tick, actorId }];
  }
}

function decodedField(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((field) => field.name === name)?.value;
}
