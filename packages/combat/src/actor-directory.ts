import type { DecodedFishNetPacket, FishNetDecodedValue } from "@spiritvale/core";
import { checkedEnd, readSignedPackedWhole } from "@spiritvale/core/wire-reader";

export interface FishNetActorIdentity {
  readonly actorId: number;
  readonly displayName: string;
  readonly archetype?: number;
  /** Session-local FishNet owner used to group related player objects. */
  readonly ownerConnectionId?: number;
  readonly uid?: string;
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

export interface FishNetLocalIdentity {
  displayName: string;
  uid?: string;
  archetype?: number;
  /** @deprecated retained for backwards-compatible callers; never used for matching. */
  accountId?: string;
}

export interface FishNetActorDirectoryOptions {
  /**
   * Persisted local-player identity. Only the local player's objects emit serverRpc traffic, so
   * it names them even when the capture attaches mid-connection and never sees their spawn.
   */
  localIdentity?: FishNetLocalIdentity;
  /** Invoked whenever the local player's identity is decoded from CharacterData RPCs. */
  onLocalIdentity?: (identity: FishNetLocalIdentity) => void;
}

/** Tracks public display names by the FishNet object IDs used by combat events. */
export class FishNetActorDirectory {
  private readonly identities = new Map<number, FishNetActorIdentity>();
  private readonly objects = new Map<number, { ownerConnectionId?: number; identityEligible: boolean }>();
  private readonly ownerObjects = new Map<number, Set<number>>();
  private readonly identitySources = new Map<number, FishNetActorIdentity>();
  private readonly sourceRevisions = new Map<number, number>();
  /** Combat attacker IDs that should inherit the identity of another object with the same owner. */
  private readonly observedPlayerActors = new Set<number>();
  /** UID-keyed names survive map-change resets when delta respawns repeat the UID. */
  private readonly uidIdentities = new Map<string, { displayName: string; archetype?: number }>();
  private nextSourceRevision = 1;
  private localIdentity?: FishNetLocalIdentity;

  constructor(private readonly options: FishNetActorDirectoryOptions = {}) {
    this.localIdentity = options.localIdentity;
    this.seedLocalIdentity();
  }

  consume(packet: DecodedFishNetPacket): FishNetActorIdentityEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.clear();
      return [{ kind: "actorIdentity", operation: "reset", tick: packet.tick }];
    }

    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      const observedPlayerActor = this.observedPlayerActors.has(packet.objectId);
      const events = this.removeObject(packet.objectId, packet.tick);
      if (observedPlayerActor) this.observedPlayerActors.add(packet.objectId);
      const ownerConnectionId = validOwner(packet.ownerConnectionId);
      const identityEligible = packet.rpcLinkRegistrations?.some(({ networkBehaviourType }) => {
        return networkBehaviourType !== undefined && IDENTITY_BEHAVIOURS.has(networkBehaviourType);
      }) || observedPlayerActor;
      this.objects.set(packet.objectId, {
        ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
        identityEligible,
      });
      if (ownerConnectionId !== undefined) this.addOwnerObject(ownerConnectionId, packet.objectId);
      const embeddedIdentity = this.resolveSpawnIdentity(packet);
      if (embeddedIdentity) {
        const next: FishNetActorIdentity = {
          actorId: packet.objectId,
          displayName: embeddedIdentity.displayName,
          ...(embeddedIdentity.archetype === undefined ? {} : { archetype: embeddedIdentity.archetype }),
          ...(embeddedIdentity.uid === undefined ? {} : { uid: embeddedIdentity.uid }),
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

    if (packet.packetName === "serverRpc" && packet.objectId !== undefined
      && this.localIdentity !== undefined && !this.identitySources.has(packet.objectId)) {
      return this.applyIdentitySource(
        packet.objectId,
        {
          actorId: packet.objectId,
          displayName: this.localIdentity.displayName,
          ...(this.localIdentity.uid === undefined ? {} : { uid: this.localIdentity.uid }),
          ...(this.localIdentity.archetype === undefined ? {} : { archetype: this.localIdentity.archetype }),
        },
        packet.tick,
      );
    }

    if (packet.objectId !== undefined && packet.rpcName !== undefined && CHARACTER_RPC_NAMES.has(packet.rpcName)) {
      const character = decodeCharacterDataName(packet.payload);
      if (character === undefined) return [];
      const archetype = this.localIdentity?.displayName === character.displayName
        ? this.localIdentity.archetype
        : undefined;
      const identity = {
        ...character,
        ...(archetype === undefined ? {} : { archetype }),
      };
      this.learnUidIdentity(character.uid, identity);
      this.updateLocalIdentity(identity);
      return this.applyIdentitySource(
        packet.objectId,
        { actorId: packet.objectId, ...identity },
        packet.tick,
      );
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
    const current = this.identitySources.get(actorId);
    const identity = next.archetype === undefined
      && current?.displayName === next.displayName
      && current.archetype !== undefined
      ? { ...next, archetype: current.archetype }
      : next;
    this.identitySources.set(actorId, identity);
    this.sourceRevisions.set(actorId, this.nextSourceRevision++);
    const object = this.objects.get(actorId);
    if (object) object.identityEligible = true;
    if (object?.ownerConnectionId !== undefined) return this.refreshOwner(object.ownerConnectionId, tick);
    return this.reconcile(actorId, identity, tick);
  }

  get(actorId: number): FishNetActorIdentity | undefined {
    const identity = this.identities.get(actorId);
    return identity ? { ...identity } : undefined;
  }

  /** Resolves a combat attacker even when the hit came from a newly allocated player object. */
  getAttribution(actorId: number): FishNetActorIdentity | undefined {
    const direct = this.identities.get(actorId);
    if (direct) return { ...direct };
    const ownerConnectionId = this.objects.get(actorId)?.ownerConnectionId;
    if (ownerConnectionId === undefined) return undefined;
    const objectIds = this.ownerObjects.get(ownerConnectionId);
    if (!objectIds) return undefined;
    let best: FishNetActorIdentity | undefined;
    let bestRevision = -1;
    for (const objectId of objectIds) {
      const identity = this.identities.get(objectId) ?? this.identitySources.get(objectId);
      const revision = this.sourceRevisions.get(objectId) ?? -1;
      if (identity && revision >= bestRevision) {
        best = identity;
        bestRevision = revision;
      }
    }
    return best
      ? { ...best, ownerConnectionId }
      : undefined;
  }

  /** Snapshots every currently known identity, for seeding a freshly rotated log with resolved names. */
  snapshot(): FishNetActorIdentity[] {
    return [...this.identities.values()].map((identity) => ({ ...identity }));
  }

  /**
   * Marks an attacker ID from a player-team combat event as eligible for owner-based identity
   * propagation. Spawn RPC metadata is sometimes incomplete, while the combat event itself is
   * definitive evidence that this object participates in player damage.
   */
  observePlayerActor(actorId: number, tick: number): FishNetActorIdentityEvent[] {
    if (!Number.isInteger(actorId) || actorId < 0) return [];
    this.observedPlayerActors.add(actorId);
    const object = this.objects.get(actorId);
    if (!object) return [];
    object.identityEligible = true;
    if (object.ownerConnectionId !== undefined) return this.refreshOwner(object.ownerConnectionId, tick);
    return this.reconcile(actorId, this.identitySources.get(actorId), tick);
  }

  reset(): void {
    this.uidIdentities.clear();
    this.clear();
    this.seedLocalIdentity();
  }

  setLocalIdentity(identity: FishNetLocalIdentity): void {
    this.localIdentity = mergeLocalIdentity(this.localIdentity, identity);
    this.seedLocalIdentity();
  }

  private seedLocalIdentity(): void {
    if (!this.localIdentity) return;
    if (this.localIdentity.uid) {
      this.learnUidIdentity(this.localIdentity.uid, {
        displayName: this.localIdentity.displayName,
        ...(this.localIdentity.archetype === undefined ? {} : { archetype: this.localIdentity.archetype }),
      });
    }
  }

  private updateLocalIdentity(identity: FishNetLocalIdentity): void {
    const next = mergeLocalIdentity(this.localIdentity, identity);
    if (this.localIdentity?.displayName === next.displayName
      && this.localIdentity.uid === next.uid
      && this.localIdentity.archetype === next.archetype) return;
    this.localIdentity = next;
    this.options.onLocalIdentity?.(next);
  }

  /** Names a spawn from embedded VisualData, falling back to the UID cache for delta spawns. */
  private resolveSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype?: number; uid?: string } | undefined {
    const embedded = decodeSpawnIdentity(packet);
    const uid = packet.spawnSyncPayload && hasPlayerControllerRegistration(packet)
      ? scanSpawnUid(packet.spawnSyncPayload)
      : undefined;
    if (embedded) {
      if (uid !== undefined) this.learnUidIdentity(uid, embedded);
      return uid === undefined ? embedded : { ...embedded, uid };
    }
    const learned = uid === undefined ? undefined : this.uidIdentities.get(uid);
    return learned ? { ...learned, uid } : undefined;
  }

  private learnUidIdentity(uid: string, identity: { displayName: string; archetype?: number }): void {
    const current = this.uidIdentities.get(uid);
    const archetype = identity.archetype
      ?? (current?.displayName === identity.displayName ? current.archetype : undefined);
    this.uidIdentities.set(uid, {
      displayName: identity.displayName,
      ...(archetype === undefined ? {} : { archetype }),
    });
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
    this.observedPlayerActors.delete(actorId);
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
    if (source && source.archetype === undefined) {
      const sourceDisplayName = source.displayName;
      let classSource: FishNetActorIdentity | undefined;
      let classRevision = -1;
      for (const objectId of objectIds) {
        const candidate = this.identitySources.get(objectId);
        const candidateRevision = this.sourceRevisions.get(objectId) ?? -1;
        if (candidate?.displayName === sourceDisplayName
          && candidate.archetype !== undefined
          && candidateRevision > classRevision) {
          classSource = candidate;
          classRevision = candidateRevision;
        }
      }
      if (classSource?.archetype !== undefined) source = { ...source, archetype: classSource.archetype };
    }
    if (source?.archetype !== undefined) {
      for (const objectId of objectIds) {
        const candidate = this.identitySources.get(objectId);
        if (candidate?.displayName === source.displayName && candidate.archetype !== source.archetype) {
          this.identitySources.set(objectId, { ...candidate, archetype: source.archetype });
        }
      }
    }
    const events: FishNetActorIdentityEvent[] = [];
    for (const objectId of objectIds) {
      if (!this.objects.get(objectId)?.identityEligible) continue;
      const identity = source && {
        actorId: objectId,
        displayName: source.displayName,
        ...(source.archetype === undefined ? {} : { archetype: source.archetype }),
        ...(source.uid === undefined ? {} : { uid: source.uid }),
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
      && current.ownerConnectionId === next.ownerConnectionId
      && current.uid === next.uid) return [];
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
    this.observedPlayerActors.clear();
    this.nextSourceRevision = 1;
  }
}

const IDENTITY_BEHAVIOURS = new Set(["PlayerController", "SkillsComponent", "CombatComponent", "HealthComponent"]);

function validOwner(ownerConnectionId: number | undefined): number | undefined {
  return ownerConnectionId !== undefined && Number.isInteger(ownerConnectionId) && ownerConnectionId >= 0
    ? ownerConnectionId
    : undefined;
}

function mergeLocalIdentity(
  current: FishNetLocalIdentity | undefined,
  next: FishNetLocalIdentity,
): FishNetLocalIdentity {
  const sameCharacter = current?.displayName === next.displayName;
  const uid = next.uid ?? (sameCharacter ? current?.uid : undefined);
  const archetype = next.archetype ?? (sameCharacter ? current?.archetype : undefined);
  return {
    displayName: next.displayName,
    ...(uid === undefined ? {} : { uid }),
    ...(archetype === undefined ? {} : { archetype }),
  };
}

function decodedField(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((field) => field.name === name)?.value;
}

const VISUAL_DATA_SYNC_INDEX = 5;

function decodeSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype: number } | undefined {
  const payload = packet.spawnSyncPayload;
  if (!payload || payload.length < 4) return undefined;
  if (!hasPlayerControllerRegistration(packet)) return undefined;
  return scanSpawnIdentity(payload);
}

function hasPlayerControllerRegistration(packet: DecodedFishNetPacket): boolean {
  return packet.rpcLinkRegistrations
    ?.some(({ networkBehaviourType }) => networkBehaviourType === "PlayerController") ?? false;
}

/** Scan packed strings for a GUID UID in spawn state; accept only one unambiguous match. */
function scanSpawnUid(payload: Buffer): string | undefined {
  const matches = new Set<string>();
  for (let offset = 0; offset < payload.length - 1; offset += 1) {
    try {
      const length = readSignedPackedWhole(payload, offset);
      if (length.value < 8 || length.value > 80) continue;
      const end = checkedEnd(payload, length.nextOffset, length.value);
      const candidate = new TextDecoder("utf-8", { fatal: true }).decode(payload.subarray(length.nextOffset, end));
      if (GUID_PATTERN.test(candidate)) matches.add(candidate);
    } catch { /* not a packed string */ }
  }
  return matches.size === 1 ? matches.values().next().value : undefined;
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
 * Extracts the display name and UID from a CharacterData DTO.
 * [guild role or empty][display name]. CharacterCallback_T prefixes the DTO with a
 * packed update-type enum; LoadCharacter_T carries the DTO directly, so both offsets
 * are attempted and every field is validated before the name is trusted.
 */
function decodeCharacterDataName(payload: Buffer): { displayName: string; uid: string } | undefined {
  for (const skipEnum of [true, false]) {
    try {
      let offset = 0;
      if (skipEnum) offset = readSignedPackedWhole(payload, offset).nextOffset;
      const lead = readCharacterString(payload, offset, 64);
      const uid = readCharacterString(payload, lead.nextOffset, 40);
      if (!GUID_PATTERN.test(uid.value)) continue;
      const account = readCharacterString(payload, uid.nextOffset, 24);
      const counter = readSignedPackedWhole(payload, account.nextOffset);
      const guildId = readCharacterString(payload, counter.nextOffset, 40);
      if (guildId.value.length > 0 && !GUID_PATTERN.test(guildId.value)) continue;
      const role = readCharacterString(payload, guildId.nextOffset, 32);
      const name = readCharacterString(payload, role.nextOffset, 32);
      if (name.value.trim().length > 0) return { displayName: name.value, uid: uid.value };
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
