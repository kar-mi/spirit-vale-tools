import type { DecodedFishNetPacket, FishNetDecodedValue, FishNetRpcParameter } from "@kar-mi/spirit-vale-tools-capture";
import { characterDataParameter, decodeFieldRun, loadBundledFishNetRpcMap } from "@kar-mi/spirit-vale-tools-capture";
import { readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";

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
  accountId?: string;
}

/** A durable, uid-keyed identity learned in a prior session, used to seed a fresh directory. */
export interface FishNetKnownIdentity {
  readonly uid: string;
  readonly displayName: string;
  readonly archetype?: number;
}

export interface FishNetActorDirectoryOptions {
  /** Persisted local-player identity. */
  localIdentity?: FishNetLocalIdentity;
  /** Invoked whenever the local player's identity is decoded from CharacterData RPCs. */
  onLocalIdentity?: (identity: FishNetLocalIdentity) => void;
  knownIdentities?: readonly FishNetKnownIdentity[];
  /** Invoked whenever a uid's cached displayName/archetype is newly learned or changed. */
  onIdentityLearned?: (identity: FishNetKnownIdentity) => void;
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
    for (const known of options.knownIdentities ?? []) {
      this.uidIdentities.set(known.uid, {
        displayName: known.displayName,
        ...(known.archetype === undefined ? {} : { archetype: known.archetype }),
      });
    }
    this.seedLocalIdentity();
  }

  consume(packet: DecodedFishNetPacket): FishNetActorIdentityEvent[] {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.clear();
      return [{ kind: "actorIdentity", operation: "reset", tick: packet.tick }];
    }

    if (packet.packetName === "objectSpawn" && packet.objectId !== undefined) {
      const observedPlayerActor = this.observedPlayerActors.has(packet.objectId);
      const events = this.removeObject(packet.objectId, packet.tick, true);
      if (observedPlayerActor) this.observedPlayerActors.add(packet.objectId);
      const ownerConnectionId = validOwner(packet.ownerConnectionId);
      const identityEligible = hasIdentityBehaviourEvidence(packet) || observedPlayerActor;
      this.objects.set(packet.objectId, {
        ...(ownerConnectionId === undefined ? {} : { ownerConnectionId }),
        identityEligible,
      });
      if (ownerConnectionId !== undefined) this.addOwnerObject(ownerConnectionId, packet.objectId);
      if (hasMonsterIdentityEvidence(packet)) {
        events.push(...this.clearPlayerIdentity(packet.objectId, packet.tick));
        events.push(...this.refreshOwner(ownerConnectionId, packet.tick, true));
        return events;
      }
      const embeddedIdentity = this.resolveSpawnIdentity(packet);
      if (embeddedIdentity) {
        const next: FishNetActorIdentity = {
          actorId: packet.objectId,
          displayName: embeddedIdentity.displayName,
          ...(embeddedIdentity.archetype === undefined ? {} : { archetype: embeddedIdentity.archetype }),
        };
        this.identitySources.set(packet.objectId, next);
        this.sourceRevisions.set(packet.objectId, this.nextSourceRevision++);
        const object = this.objects.get(packet.objectId);
        if (object) object.identityEligible = true;
        if (ownerConnectionId === undefined) events.push(...this.reconcile(packet.objectId, next, packet.tick));
      }
      events.push(...this.refreshOwner(ownerConnectionId, packet.tick, true));
      return events;
    }

    if (packet.packetName === "objectDespawn" && packet.objectId !== undefined) {
      return this.removeObject(packet.objectId, packet.tick, true);
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

    if (packet.objectId !== undefined && hasMonsterIdentityEvidence(packet)) {
      return this.clearPlayerIdentity(packet.objectId, packet.tick);
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

  /** Marks an attacker ID from a player-team combat event as eligible for owner-based identity propagation. */
  observePlayerActor(actorId: number, tick: number): FishNetActorIdentityEvent[] {
    if (!Number.isInteger(actorId) || actorId < 0) return [];
    this.observedPlayerActors.add(actorId);
    const object = this.objects.get(actorId);
    if (!object) return [];
    object.identityEligible = true;
    if (object.ownerConnectionId !== undefined) return this.refreshOwner(object.ownerConnectionId, tick);
    return this.reconcile(actorId, this.identitySources.get(actorId), tick);
  }

  /** Clears per-connection state (spawned objects, owner mappings, in-session identity sources). */
  reset(): void {
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

  private resolveSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype?: number } | undefined {
    return decodeSpawnIdentity(packet);
  }

  private learnUidIdentity(uid: string, identity: { displayName: string; archetype?: number }): void {
    const current = this.uidIdentities.get(uid);
    const archetype = identity.archetype
      ?? (current?.displayName === identity.displayName ? current.archetype : undefined);
    const next = {
      displayName: identity.displayName,
      ...(archetype === undefined ? {} : { archetype }),
    };
    if (current?.displayName === next.displayName && current.archetype === next.archetype) return;
    this.uidIdentities.set(uid, next);
    this.options.onIdentityLearned?.({ uid, ...next });
  }

  private changeOwner(actorId: number, ownerConnectionId: number | undefined, tick: number): FishNetActorIdentityEvent[] {
    const current = this.objects.get(actorId) ?? { identityEligible: false };
    const previousOwner = current.ownerConnectionId;
    if (previousOwner === ownerConnectionId) return [];
    if (previousOwner !== undefined) this.removeOwnerObject(previousOwner, actorId);
    current.ownerConnectionId = ownerConnectionId;
    this.objects.set(actorId, current);
    if (ownerConnectionId !== undefined) this.addOwnerObject(ownerConnectionId, actorId);
    const events = this.refreshOwner(previousOwner, tick, true);
    if (ownerConnectionId === undefined) {
      events.push(...this.reconcile(actorId, this.identitySources.get(actorId), tick));
    } else {
      events.push(...this.refreshOwner(ownerConnectionId, tick, true));
    }
    return events;
  }

  private removeObject(actorId: number, tick: number, retainIdentity = false): FishNetActorIdentityEvent[] {
    const object = this.objects.get(actorId);
    const ownerConnectionId = object?.ownerConnectionId;
    if (ownerConnectionId !== undefined) this.removeOwnerObject(ownerConnectionId, actorId);
    this.objects.delete(actorId);
    this.observedPlayerActors.delete(actorId);
    this.identitySources.delete(actorId);
    this.sourceRevisions.delete(actorId);
    const events = retainIdentity ? [] : this.reconcile(actorId, undefined, tick);
    events.push(...this.refreshOwner(ownerConnectionId, tick, retainIdentity));
    return events;
  }

  private clearPlayerIdentity(actorId: number, tick: number): FishNetActorIdentityEvent[] {
    this.observedPlayerActors.delete(actorId);
    this.identitySources.delete(actorId);
    this.sourceRevisions.delete(actorId);
    const object = this.objects.get(actorId);
    if (object) object.identityEligible = false;
    const events = this.reconcile(actorId, undefined, tick);
    events.push(...this.refreshOwner(object?.ownerConnectionId, tick, true));
    return events;
  }

  private refreshOwner(
    ownerConnectionId: number | undefined,
    tick: number,
    retainExistingWhenSourceMissing = false,
  ): FishNetActorIdentityEvent[] {
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
    if (!source && retainExistingWhenSourceMissing) return [];
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

/** True only for a structurally decoded MonsterController.Data identity from the RPC map. */
function hasMonsterIdentityEvidence(packet: DecodedFishNetPacket): boolean {
  if (packet.packetName === "objectSpawn") {
    const entry = packet.spawnSyncEntries?.find(
      (candidate) => candidate.networkBehaviourType === "MonsterController" && candidate.name === "Data",
    );
    const mobId = entry?.fields.find((field) => field.name === "Id")?.value;
    return typeof mobId === "string" && mobId.length > 0;
  }
  if (packet.packetName !== "syncType"
    || packet.networkBehaviourType !== "MonsterController"
    || (packet.syncName !== "Data" && packet.syncIndex !== 0)) return false;
  const mobId = decodedField(packet, "Data.Id")
    ?? decodedField(packet, "Monster.Id")
    ?? decodedField(packet, "Id");
  return typeof mobId === "string" && mobId.length > 0;
}

const VISUAL_DATA_SYNC_INDEX = 5;

const PLAYER_PREFAB_KEYS: ReadonlySet<string> = new Set(
  (loadBundledFishNetRpcMap().prefabs ?? [])
    .filter(({ components }) => components.some(({ typeName }) => typeName === "PlayerController"))
    .map(({ collectionId, prefabId }) => `${collectionId}:${prefabId}`),
);

function decodeSpawnIdentity(packet: DecodedFishNetPacket): { displayName: string; archetype: number } | undefined {
  if (!hasPlayerControllerEvidence(packet)) return undefined;
  const entry = packet.spawnSyncEntries?.find(
    (candidate) => candidate.networkBehaviourType === "PlayerController" && candidate.index === VISUAL_DATA_SYNC_INDEX,
  );
  if (!entry) return undefined;
  const displayName = entry.fields.find((field) => field.name === "Appearance.DisplayName")?.value;
  const archetype = entry.fields.find((field) => field.name === "Appearance.Archetype")?.value;
  if (typeof displayName !== "string" || displayName.length === 0 || !Number.isInteger(archetype)) return undefined;
  return { displayName, archetype: archetype as number };
}

function hasIdentityBehaviourEvidence(packet: DecodedFishNetPacket): boolean {
  return isCurrentPlayerPrefab(packet) || (packet.rpcLinkRegistrations
    ?.some(({ networkBehaviourType }) => networkBehaviourType !== undefined
      && IDENTITY_BEHAVIOURS.has(networkBehaviourType)) ?? false);
}

function hasPlayerControllerEvidence(packet: DecodedFishNetPacket): boolean {
  return isCurrentPlayerPrefab(packet) || (packet.rpcLinkRegistrations
    ?.some(({ networkBehaviourType }) => networkBehaviourType === "PlayerController") ?? false);
}

/** The current build omits RPC-link registrations from spawns, so its verified prefab is evidence. */
function isCurrentPlayerPrefab(packet: DecodedFishNetPacket): boolean {
  if (packet.spawnCollectionId === undefined || packet.spawnPrefabId === undefined) return false;
  return PLAYER_PREFAB_KEYS.has(`${packet.spawnCollectionId}:${packet.spawnPrefabId}`);
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
 * `CharacterData.uid`/`.name`, decoded through the same shared, verified field schema the
 * `character` package's full decoder uses (`CHARACTER_DATA_FIELDS`) - trimmed to a schema PREFIX
 * ending right after `name`, since everything this needs is positioned before the expensive
 * equipment/artifact/skill sections. One shared schema source means a future DTO field change
 * (like the `AppliedWriteIds` insertion that broke this function's old hand-rolled, two-offset
 * byte reader) is fixed here for free, rather than needing a second, independently-drifting fix.
 * CharacterCallback_T prefixes the DTO with a packed update-type enum; LoadCharacter_T carries
 * the DTO directly, so both offsets are attempted and every field is validated before the name
 * is trusted.
 */
function decodeCharacterDataName(payload: Buffer): { displayName: string; uid: string } | undefined {
  for (const skipEnum of [true, false]) {
    try {
      let offset = 0;
      if (skipEnum) offset = readSignedPackedWhole(payload, offset).nextOffset;
      const run = decodeFieldRun(payload, [characterNameParameter()], offset);
      const values = new Map(run.fields.map((field) => [field.name, field.value]));
      const uid = values.get("data.UID");
      if (typeof uid !== "string" || !GUID_PATTERN.test(uid)) continue;
      const name = values.get("data.Name");
      if (typeof name !== "string" || !name.trim() || hasControlCharacters(name)) continue;
      return { displayName: name, uid };
    } catch {
      // Fall through to the next candidate offset.
    }
  }
  return undefined;
}

let cachedCharacterNameParameter: FishNetRpcParameter | undefined;

/**
 * The bundled `CharacterData` schema sliced to a wire-positional PREFIX ending right after
 * `Name` - the fields between `Name` and the end (equipment, artifacts, skills, inventory, ...)
 * are intentionally left undescribed, so `decodeFieldRun` naturally stops decoding once it runs
 * out of parameters, without spending time on data this lookup never needs.
 */
function characterNameParameter(): FishNetRpcParameter {
  if (cachedCharacterNameParameter) return cachedCharacterNameParameter;
  const full = characterDataParameter();
  const fields = full.fields ?? [];
  const nameIndex = fields.findIndex((field) => field.name === "Name");
  cachedCharacterNameParameter = { ...full, fields: fields.slice(0, nameIndex + 1) };
  return cachedCharacterNameParameter;
}
