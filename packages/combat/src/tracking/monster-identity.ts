import { FishNetMonsterDirectory } from "@kar-mi/spirit-vale-tools-capture";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import type {
  FishNetBossCatalog,
  FishNetCombatActivationEvent,
  FishNetCombatMonsterIdentityEvent,
  FishNetMonsterCatalog,
} from "../events/combat-events.ts";

export interface FishNetMonsterIdentityTrackerOptions {
  /** Names monsters seen spawning, emitting identity lifecycle events keyed by network object id. */
  monsterCatalog?: FishNetMonsterCatalog;
  /** Fallback names for otherwise-anonymous bosses; game-provided identities always win. */
  bossCatalog?: FishNetBossCatalog;
}

/**
 * Resolves monster and boss display names from spawn data and boss-unique skill casts, emitting the
 * identity lifecycle events. Composed by `FishNetCombatTracker`, which routes packets here and
 * forwards the events.
 */
export class FishNetMonsterIdentityTracker {
  private readonly monsterCatalog?: FishNetMonsterCatalog;
  private readonly bossCatalog?: FishNetBossCatalog;
  private readonly monsters?: FishNetMonsterDirectory;
  /** Curated boss names are valid only for the lifetime of their network object id. */
  private readonly bossIdentities = new Map<number, string>();

  constructor(options: FishNetMonsterIdentityTrackerOptions = {}) {
    this.monsterCatalog = options.monsterCatalog;
    if (options.monsterCatalog) this.monsters = new FishNetMonsterDirectory(options.monsterCatalog);
    this.bossCatalog = options.bossCatalog;
  }

  reset(): void {
    this.bossIdentities.clear();
    this.monsters?.reset();
  }

  /** Feeds spawn/despawn/sync packets to the monster directory and names any resulting change. */
  consumeDirectory(packet: DecodedFishNetPacket): FishNetCombatMonsterIdentityEvent | undefined {
    const change = this.monsters?.consume(packet);
    if (!change) return undefined;
    const tick = packet.tick;
    if (change.operation === "reset") return { kind: "monsterIdentity", operation: "reset", tick };
    if (change.operation === "remove") {
      return { kind: "monsterIdentity", operation: "remove", tick, actorId: change.objectId };
    }
    const definition = this.monsterCatalog?.get(change.spawn.mobId);
    return definition ? {
      kind: "monsterIdentity",
      operation: "upsert",
      tick,
      actorId: change.objectId,
      mobId: change.spawn.mobId,
      displayName: definition.displayName,
    } : undefined;
  }

  /** Uses the normal monster-identity path so all consumers receive the curated boss name. */
  observeActivation(event: FishNetCombatActivationEvent): FishNetCombatMonsterIdentityEvent | undefined {
    // Spawn-derived monster data and player identities are authoritative.
    if (!event.sourceId || event.actorIdentity || this.monsters?.get(event.actorId)) return undefined;
    const definition = this.bossCatalog?.get(event.sourceId);
    if (!definition) return undefined;
    if (this.bossIdentities.has(event.actorId)) return undefined;
    this.bossIdentities.set(event.actorId, definition.displayName);
    return {
      kind: "monsterIdentity",
      operation: "upsert",
      tick: event.tick,
      actorId: event.actorId,
      mobId: `boss:${event.sourceId}`,
      displayName: definition.displayName,
    };
  }

  /**
   * FishNet may reuse an object id in a later zone. Drop a curated boss name at every object
   * lifetime boundary so the next boss cannot inherit the old one's identity before it casts.
   */
  consumeBossLifecycle(packet: DecodedFishNetPacket): FishNetCombatMonsterIdentityEvent | undefined {
    if (packet.packetName === "authenticated" || packet.packetName === "disconnect") {
      if (this.bossIdentities.size === 0) return undefined;
      this.bossIdentities.clear();
      return { kind: "monsterIdentity", operation: "reset", tick: packet.tick };
    }
    if ((packet.packetName !== "objectSpawn" && packet.packetName !== "objectDespawn")
      || packet.objectId === undefined
      || !this.bossIdentities.delete(packet.objectId)) return undefined;
    return { kind: "monsterIdentity", operation: "remove", tick: packet.tick, actorId: packet.objectId };
  }
}
