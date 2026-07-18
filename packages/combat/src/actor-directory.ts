import type { DecodedFishNetPacket, FishNetDecodedValue } from "@spiritvale/core";
import { checkedEnd, readSignedPackedWhole } from "@spiritvale/core/wire-reader";

export interface FishNetActorIdentity {
  readonly actorId: number;
  readonly displayName: string;
  readonly archetype?: number;
  /** Session-local FishNet owner used to group related player objects. */
  readonly ownerConnectionId?: number;
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
  private readonly objects = new Map<number, { ownerConnectionId?: number; identityEligible: boolean }>();
  private readonly ownerObjects = new Map<number, Set<number>>();
  private readonly identitySources = new Map<number, FishNetActorIdentity>();
  private readonly sourceRevisions = new Map<number, number>();
  private nextSourceRevision = 1;

  consume(packet: DecodedFishNetPacket): FishNetActorIdentityEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.clear();
      return [{ kind: "actorIdentity", operation: "reset", tick: packet.tick }];
    }

    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      const events = this.removeObject(packet.objectId, packet.tick);
      const ownerConnectionId = validOwner(packet.ownerConnectionId);
      const identityEligible = packet.rpcLinkRegistrations?.some(({ networkBehaviourType }) => {
        return networkBehaviourType !== undefined && IDENTITY_BEHAVIOURS.has(networkBehaviourType);
      }) ?? false;
      this.objects.set(packet.objectId, {
        ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
        identityEligible,
      });
      if (ownerConnectionId !== undefined) this.addOwnerObject(ownerConnectionId, packet.objectId);
      const embeddedIdentity = decodeSpawnIdentity(packet);
      if (embeddedIdentity) {
        const next: FishNetActorIdentity = {
          actorId: packet.objectId,
          displayName: embeddedIdentity.displayName,
          archetype: embeddedIdentity.archetype,
        };
        this.identitySources.set(packet.objectId, next);
        this.sourceRevisions.set(packet.objectId, this.nextSourceRevision++);
        const object = this.objects.get(packet.objectId);
        if (object) object.identityEligible = true;
        if (ownerConnectionId === undefined) events.push(...this.reconcile(packet.objectId, next, packet.tick));
      }
      events.push(...this.refreshOwner(ownerConnectionId, packet.tick));
      return events;
    }

    if (packet.packetName === "objectDespawn" && packet.objectId !== undefined) {
      return this.removeObject(packet.objectId, packet.tick);
    }

    if (packet.packetName === "ownershipChange" && packet.objectId !== undefined) {
      return this.changeOwner(packet.objectId, validOwner(packet.ownerConnectionId), packet.tick);
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
    this.identitySources.set(packet.objectId, next);
    this.sourceRevisions.set(packet.objectId, this.nextSourceRevision++);
    const object = this.objects.get(packet.objectId);
    if (object) object.identityEligible = true;
    if (object?.ownerConnectionId !== undefined) return this.refreshOwner(object.ownerConnectionId, packet.tick);
    return this.reconcile(packet.objectId, next, packet.tick);
  }

  get(actorId: number): FishNetActorIdentity | undefined {
    const identity = this.identities.get(actorId);
    return identity ? { ...identity } : undefined;
  }

  reset(): void {
    this.clear();
  }

  private changeOwner(actorId: number, ownerConnectionId: number | undefined, tick: number): FishNetActorIdentityEvent[] {
    const current = this.objects.get(actorId) ?? { identityEligible: false };
    const previousOwner = current.ownerConnectionId;
    if (previousOwner === ownerConnectionId) return [];
    if (previousOwner !== undefined) this.removeOwnerObject(previousOwner, actorId);
    current.ownerConnectionId = ownerConnectionId;
    this.objects.set(actorId, current);
    if (ownerConnectionId !== undefined) this.addOwnerObject(ownerConnectionId, actorId);
    const events = this.refreshOwner(previousOwner, tick);
    if (ownerConnectionId === undefined) {
      events.push(...this.reconcile(actorId, this.identitySources.get(actorId), tick));
    } else {
      events.push(...this.refreshOwner(ownerConnectionId, tick));
    }
    return events;
  }

  private removeObject(actorId: number, tick: number): FishNetActorIdentityEvent[] {
    const object = this.objects.get(actorId);
    const ownerConnectionId = object?.ownerConnectionId;
    if (ownerConnectionId !== undefined) this.removeOwnerObject(ownerConnectionId, actorId);
    this.objects.delete(actorId);
    this.identitySources.delete(actorId);
    this.sourceRevisions.delete(actorId);
    const events = this.reconcile(actorId, undefined, tick);
    events.push(...this.refreshOwner(ownerConnectionId, tick));
    return events;
  }

  private refreshOwner(ownerConnectionId: number | undefined, tick: number): FishNetActorIdentityEvent[] {
    if (ownerConnectionId === undefined) return [];
    const objectIds = this.ownerObjects.get(ownerConnectionId);
    if (!objectIds) return [];
    let source: FishNetActorIdentity | undefined;
    let revision = -1;
    for (const objectId of objectIds) {
      const candidate = this.identitySources.get(objectId);
      const candidateRevision = this.sourceRevisions.get(objectId) ?? -1;
      if (candidate && candidateRevision > revision) {
        source = candidate;
        revision = candidateRevision;
      }
    }
    const events: FishNetActorIdentityEvent[] = [];
    for (const objectId of objectIds) {
      if (!this.objects.get(objectId)?.identityEligible) continue;
      const identity = source && {
        actorId: objectId,
        displayName: source.displayName,
        ...(source.archetype === undefined ? {} : { archetype: source.archetype }),
        ownerConnectionId,
      };
      events.push(...this.reconcile(objectId, identity, tick));
    }
    return events;
  }

  private reconcile(
    actorId: number,
    next: FishNetActorIdentity | undefined,
    tick: number,
  ): FishNetActorIdentityEvent[] {
    const current = this.identities.get(actorId);
    if (!next) {
      if (!this.identities.delete(actorId)) return [];
      return [{ kind: "actorIdentity", operation: "remove", tick, actorId }];
    }
    if (current?.displayName === next.displayName
      && current.archetype === next.archetype
      && current.ownerConnectionId === next.ownerConnectionId) return [];
    this.identities.set(actorId, next);
    return [{ kind: "actorIdentity", operation: "upsert", tick, ...next }];
  }

  private addOwnerObject(ownerConnectionId: number, actorId: number): void {
    const objects = this.ownerObjects.get(ownerConnectionId) ?? new Set<number>();
    objects.add(actorId);
    this.ownerObjects.set(ownerConnectionId, objects);
  }

  private removeOwnerObject(ownerConnectionId: number, actorId: number): void {
    const objects = this.ownerObjects.get(ownerConnectionId);
    if (!objects) return;
    objects.delete(actorId);
    if (objects.size === 0) this.ownerObjects.delete(ownerConnectionId);
  }

  private clear(): void {
    this.identities.clear();
    this.objects.clear();
    this.ownerObjects.clear();
    this.identitySources.clear();
    this.sourceRevisions.clear();
    this.nextSourceRevision = 1;
  }
}

const IDENTITY_BEHAVIOURS = new Set(["PlayerController", "SkillsComponent", "CombatComponent", "HealthComponent"]);

function validOwner(ownerConnectionId: number | undefined): number | undefined {
  return ownerConnectionId !== undefined && Number.isInteger(ownerConnectionId) && ownerConnectionId >= 0
    ? ownerConnectionId
    : undefined;
}

function decodedField(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((field) => field.name === name)?.value;
}

function decodeSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype: number } | undefined {
  const payload = packet.spawnSyncPayload;
  if (!payload || payload.length < 4) return undefined;
  const playerComponents = new Set(packet.rpcLinkRegistrations
    ?.filter(({ networkBehaviourType }) => networkBehaviourType === "PlayerController")
    .map(({ componentIndex }) => componentIndex) ?? []);
  if (playerComponents.size === 0) return undefined;

  const identities = new Map<string, { displayName: string; archetype: number }>();
  for (let offset = 0; offset <= payload.length - 4; offset += 1) {
    const componentIndex = payload[offset];
    const writtenCount = payload[offset + 1];
    const syncIndex = payload[offset + 2];
    if (componentIndex === undefined || !playerComponents.has(componentIndex)
      || writtenCount === undefined || writtenCount < 1 || writtenCount > 64 || syncIndex !== 5) continue;
    try {
      const length = readSignedPackedWhole(payload, offset + 3);
      if (length.value < 1 || length.value > 128) continue;
      const nameEnd = checkedEnd(payload, length.nextOffset, length.value);
      const displayName = new TextDecoder("utf-8", { fatal: true }).decode(payload.subarray(length.nextOffset, nameEnd));
      if (!displayName.trim() || /[\u0000-\u001f\u007f]/.test(displayName)) continue;
      const archetype = readSignedPackedWhole(payload, nameEnd);
      if (archetype.value < 0 || archetype.value > 1_000) continue;
      identities.set(`${displayName}\u0000${archetype.value}`, { displayName, archetype: archetype.value });
    } catch {
      // Other spawn state may contain the same byte values without being VisualData.
    }
  }
  return identities.size === 1 ? identities.values().next().value : undefined;
}
