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

    if (packet.objectId !== undefined && packet.rpcName !== undefined && CHARACTER_RPC_NAMES.has(packet.rpcName)) {
      const displayName = decodeCharacterDataName(packet.payload);
      if (displayName === undefined) return [];
      return this.applyIdentitySource(packet.objectId, { actorId: packet.objectId, displayName }, packet.tick);
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
    return this.applyIdentitySource(packet.objectId, {
      actorId: packet.objectId,
      displayName,
      ...(archetype === undefined ? {} : { archetype }),
    }, packet.tick);
  }

  private applyIdentitySource(
    actorId: number,
    next: FishNetActorIdentity,
    tick: number,
  ): FishNetActorIdentityEvent[] {
    this.identitySources.set(actorId, next);
    this.sourceRevisions.set(actorId, this.nextSourceRevision++);
    const object = this.objects.get(actorId);
    if (object) object.identityEligible = true;
    if (object?.ownerConnectionId !== undefined) return this.refreshOwner(object.ownerConnectionId, tick);
    return this.reconcile(actorId, next, tick);
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

const VISUAL_DATA_SYNC_INDEX = 5;

function decodeSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype: number } | undefined {
  const payload = packet.spawnSyncPayload;
  if (!payload || payload.length < 4) return undefined;
  const playerComponents = new Set(packet.rpcLinkRegistrations
    ?.filter(({ networkBehaviourType }) => networkBehaviourType === "PlayerController")
    .map(({ componentIndex }) => componentIndex) ?? []);
  if (playerComponents.size === 0) return undefined;
  return scanSpawnIdentity(payload);
}

/**
 * The spawn SyncType area is written per behaviour as [componentIndex][writtenCount] followed by
 * writtenCount entries of [syncIndex][codec-encoded value]. Entry sizes depend on codecs the rpc
 * map does not describe, so the area cannot be walked structurally. Instead, anchor on the
 * VisualData sync index byte and validate that a well-formed display name and archetype follow;
 * the result is used only when every match agrees on a single identity.
 */
function scanSpawnIdentity(payload: Buffer): { displayName: string; archetype: number } | undefined {
  const identities = new Map<string, { displayName: string; archetype: number }>();
  for (let offset = 0; offset < payload.length - 2; offset += 1) {
    if (payload[offset] !== VISUAL_DATA_SYNC_INDEX) continue;
    const identity = readVisualDataAt(payload, offset + 1, payload.length);
    if (identity) identities.set(JSON.stringify([identity.displayName, identity.archetype]), identity);
  }
  return identities.size === 1 ? identities.values().next().value : undefined;
}

function readVisualDataAt(
  payload: Buffer,
  offset: number,
  end: number,
): { displayName: string; archetype: number } | undefined {
  try {
    const length = readSignedPackedWhole(payload, offset);
    if (length.value < 1 || length.value > 128) return undefined;
    const nameEnd = checkedEnd(payload, length.nextOffset, length.value);
    if (nameEnd > end) return undefined;
    const displayName = new TextDecoder("utf-8", { fatal: true }).decode(payload.subarray(length.nextOffset, nameEnd));
    if (!displayName.trim() || hasControlCharacters(displayName)) return undefined;
    const archetype = readSignedPackedWhole(payload, nameEnd);
    if (archetype.value < 0 || archetype.value > 1_000 || archetype.nextOffset > end) return undefined;
    return { displayName, archetype: archetype.value };
  } catch {
    // Other spawn state may contain the same byte values without being VisualData.
    return undefined;
  }
}

function hasControlCharacters(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/** The local player's spawn omits VisualData; their name arrives in these PlayerSave RPCs instead. */
const CHARACTER_RPC_NAMES = new Set(["LoadCharacter_T", "CharacterCallback_T"]);
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extracts the display name from a CharacterData DTO:
 * [empty string][character GUID][account digits][packed number][guild GUID or empty]
 * [guild role or empty][display name]. CharacterCallback_T prefixes the DTO with a
 * packed update-type enum; LoadCharacter_T carries the DTO directly, so both offsets
 * are attempted and every field is validated before the name is trusted.
 */
function decodeCharacterDataName(payload: Buffer): string | undefined {
  for (const skipEnum of [true, false]) {
    try {
      let offset = 0;
      if (skipEnum) offset = readSignedPackedWhole(payload, offset).nextOffset;
      const lead = readCharacterString(payload, offset, 64);
      const characterId = readCharacterString(payload, lead.nextOffset, 40);
      if (!GUID_PATTERN.test(characterId.value)) continue;
      const account = readCharacterString(payload, characterId.nextOffset, 24);
      if (!/^\d{5,20}$/.test(account.value)) continue;
      const counter = readSignedPackedWhole(payload, account.nextOffset);
      const guildId = readCharacterString(payload, counter.nextOffset, 40);
      if (guildId.value.length > 0 && !GUID_PATTERN.test(guildId.value)) continue;
      const role = readCharacterString(payload, guildId.nextOffset, 32);
      const name = readCharacterString(payload, role.nextOffset, 32);
      if (name.value.trim().length > 0) return name.value;
    } catch {
      // Fall through to the next candidate offset.
    }
  }
  return undefined;
}

function readCharacterString(
  payload: Buffer,
  offset: number,
  maximumLength: number,
): { value: string; nextOffset: number } {
  const length = readSignedPackedWhole(payload, offset);
  if (length.value < 0 || length.value > maximumLength) throw new Error("implausible CharacterData string");
  const nextOffset = checkedEnd(payload, length.nextOffset, length.value);
  const value = new TextDecoder("utf-8", { fatal: true }).decode(payload.subarray(length.nextOffset, nextOffset));
  if (hasControlCharacters(value)) throw new Error("CharacterData string contains control characters");
  return { value, nextOffset };
}
