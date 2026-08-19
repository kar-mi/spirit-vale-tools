import { findPrefab, loadBundledFishNetRpcMap } from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket, FishNetDecodedField, FishNetRpcMap } from "@kar-mi/spirit-vale-tools-capture";

/** Prefab name of the spawnable ground-loot object. Prefab IDs are wire values, so match on this. */
const LOOT_DROP_PREFAB = "LootDrop";
/** Behaviour that owns the loot SyncVars. */
const LOOT_DROP_BEHAVIOUR = "LootDrop";

export interface FishNetLootDrop {
  /** Network object ID of the dropped item while it is on the ground. */
  objectId: number;
  tick: number;
  /** World position the item dropped at, when the spawn carried one. */
  position?: readonly [number, number, number];
  displayName?: string;
  spriteId?: string;
  rarity?: number;
  lootType?: number;
  scale?: number;
  lootChance?: number;
  /** `DateTime.ToBinary()` as a decimal string; kept lossless rather than narrowed to a JS number. */
  expireAt?: string;
  partyId?: number;
  /** Platform account the drop is locked to, when the server sent a lock. */
  playerId?: string;
}

export interface FishNetLootDropSpawnEvent {
  kind: "spawn";
  tick: number;
  drop: FishNetLootDrop;
}

/** Emitted when a drop's SyncVars arrive or change after its spawn. */
export interface FishNetLootDropUpdateEvent {
  kind: "update";
  tick: number;
  drop: FishNetLootDrop;
}

/**
 * Emitted when a drop leaves the ground. A despawn carries only an object ID — no reason and no
 * actor — so this reports that the drop is gone, never that a particular player picked it up.
 */
export interface FishNetLootDropRemovedEvent {
  kind: "removed";
  tick: number;
  drop: FishNetLootDrop;
}

export type FishNetLootDropEvent =
  | FishNetLootDropSpawnEvent
  | FishNetLootDropUpdateEvent
  | FishNetLootDropRemovedEvent;

export interface FishNetLootDropTrackerOptions {
  /** Overrides the bundled RPC map, which supplies the build's prefab layouts. */
  rpcMap?: FishNetRpcMap;
}

/**
 * Tracks items lying on the ground, from the spawn that places them to the despawn that removes
 * them.
 *
 * A drop's world position comes from its spawn packet's transform header; its identity comes from
 * the `LootDrop` behaviour's SyncVars, which arrive both inside the spawn and as follow-up
 * `syncType` packets. Because the two halves arrive separately, a spawn is reported immediately and
 * an `update` follows once the item is named.
 */
export class FishNetLootDropTracker {
  private readonly map: FishNetRpcMap;
  private readonly drops = new Map<number, FishNetLootDrop>();

  constructor(options: FishNetLootDropTrackerOptions = {}) {
    this.map = options.rpcMap ?? loadBundledFishNetRpcMap();
  }

  /** Drops currently believed to be on the ground, in spawn order. */
  active(): FishNetLootDrop[] {
    return [...this.drops.values()];
  }

  consume(packet: DecodedFishNetPacket): FishNetLootDropEvent[] {
    // Object ids are scoped to one connection, so a session boundary invalidates every open drop.
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      this.reset();
      return [];
    }
    if (packet.objectId === undefined) return [];
    if (packet.packetName === "objectSpawn") return this.consumeSpawn(packet, packet.objectId);
    if (packet.packetName === "objectDespawn") return this.consumeDespawn(packet, packet.objectId);
    if (packet.packetName === "syncType") return this.consumeSync(packet, packet.objectId);
    return [];
  }

  /** Drops are scoped to one connection's object IDs, so a session boundary clears them. */
  reset(): void {
    this.drops.clear();
  }

  private consumeSpawn(packet: DecodedFishNetPacket, objectId: number): FishNetLootDropEvent[] {
    if (packet.spawnCollectionId === undefined || packet.spawnPrefabId === undefined) return [];
    const prefab = findPrefab(this.map, packet.spawnCollectionId, packet.spawnPrefabId);
    if (prefab?.prefabName !== LOOT_DROP_PREFAB) return [];
    const drop: FishNetLootDrop = {
      objectId,
      tick: packet.tick,
      ...(packet.spawnLocalPosition ? { position: packet.spawnLocalPosition } : {}),
    };
    // A drop's SyncVars usually arrive inside its own spawn; a follow-up syncType is not guaranteed.
    for (const entry of packet.spawnSyncEntries ?? []) {
      if (entry.networkBehaviourType === LOOT_DROP_BEHAVIOUR) applyLootFields(drop, entry.fields);
    }
    this.drops.set(objectId, drop);
    return [{ kind: "spawn", tick: packet.tick, drop: { ...drop } }];
  }

  private consumeSync(packet: DecodedFishNetPacket, objectId: number): FishNetLootDropEvent[] {
    if (packet.networkBehaviourType !== LOOT_DROP_BEHAVIOUR) return [];
    const drop = this.drops.get(objectId);
    if (!drop) return [];
    if (!applyLootFields(drop, packet.decodedFields ?? [])) return [];
    drop.tick = packet.tick;
    return [{ kind: "update", tick: packet.tick, drop: { ...drop } }];
  }

  private consumeDespawn(packet: DecodedFishNetPacket, objectId: number): FishNetLootDropEvent[] {
    const drop = this.drops.get(objectId);
    if (!drop) return [];
    this.drops.delete(objectId);
    return [{ kind: "removed", tick: packet.tick, drop: { ...drop } }];
  }
}

/** Copies the decoded `LootDropDto` and `LockDto` fields onto a drop. Returns whether any changed. */
function applyLootFields(drop: FishNetLootDrop, decodedFields: readonly FishNetDecodedField[]): boolean {
  let changed = false;
  const assign = <K extends keyof FishNetLootDrop>(key: K, value: FishNetLootDrop[K]): void => {
    if (value === undefined || drop[key] === value) return;
    drop[key] = value;
    changed = true;
  };
  for (const field of decodedFields) {
    switch (field.name) {
      case "DisplayName": assign("displayName", stringValue(field.value)); break;
      case "SpriteId": assign("spriteId", stringValue(field.value)); break;
      case "Rarity": assign("rarity", numberValue(field.value)); break;
      case "LootType": assign("lootType", numberValue(field.value)); break;
      case "Scale": assign("scale", numberValue(field.value)); break;
      case "LootChance": assign("lootChance", numberValue(field.value)); break;
      case "ExpireAt": assign("expireAt", stringValue(field.value)); break;
      case "PartyId": assign("partyId", numberValue(field.value)); break;
      case "PlayerId": assign("playerId", stringValue(field.value)); break;
      default: break;
    }
  }
  return changed;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}
