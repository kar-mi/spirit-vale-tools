import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodeCharacterRpcPayload } from "./decoder.ts";
import type { CharacterSnapshot } from "./types.ts";

/**
 * `PlayerController.Inspect_T(conn, CharacterData)` — the reply to inspecting another player. It
 * carries the SAME `CharacterData` as `CharacterCallback_T`, minus the leading `CharacterUpdateType`.
 */
const INSPECT_RPC = "Inspect_T";

/**
 * Roster cap. Inspecting is cheap and a busy town would otherwise grow this without bound; the
 * oldest entry is evicted, so the most recently inspected players are the ones kept.
 */
const DEFAULT_LIMIT = 24;

export interface InspectedCharacter {
  snapshot: CharacterSnapshot;
  /** When this inspect arrived. Later inspects of the same player replace the earlier one. */
  inspectedAt: string;
}

/**
 * Characters seen by inspecting other players, most recent per player.
 *
 * Deliberately NOT part of {@link FishNetCharacterTracker}: that class merges each payload into a
 * single `snapshot` field representing the LOCAL player, so feeding it an inspected character would
 * overwrite your own. The two streams share a decoder and nothing else.
 */
export class FishNetInspectRoster {
  private readonly characters = new Map<string, InspectedCharacter>();
  private readonly listeners = new Set<(roster: InspectedCharacter[]) => void>();
  private localName?: string;

  constructor(private readonly limit: number = DEFAULT_LIMIT) {}

  /**
   * The local player's name. `Inspect_T` also carries YOUR character when you inspect yourself, and
   * that copy belongs to the local stream, not to the stranger roster.
   */
  setLocalName(name: string | undefined): void {
    this.localName = name;
  }

  /** Returns true when the packet was an inspect reply this roster consumed. */
  consume(packet: CapturedFishNetPacket, now = new Date()): boolean {
    // Matched by name alone. The bundled prefab layout binds PlayerController from the spawn's
    // prefab id, so the reply is named even on a capture that joined mid-session and saw no RPC
    // Link registrations — and the local character arrives on PlayerSave (`CharacterCallback_T`,
    // `LoadCharacter_T`), a different behaviour, so the two streams cannot be confused.
    if (packet.rpcName !== INSPECT_RPC) return false;

    let snapshot: CharacterSnapshot;
    try {
      // No leading CharacterUpdateType on this RPC, unlike CharacterCallback_T.
      ({ snapshot } = decodeCharacterRpcPayload(packet.payload, false, now));
    } catch {
      // A partial or unrecognised inspect is dropped rather than surfaced: unlike the local
      // character there is no status line for it, and a half-decoded stranger is not worth showing.
      return false;
    }
    if (!snapshot.name) return false;
    if (snapshot.name === this.localName) return false;

    // Re-inserting moves the entry to the end, so eviction stays least-recently-inspected.
    this.characters.delete(snapshot.name);
    this.characters.set(snapshot.name, { snapshot, inspectedAt: now.toISOString() });
    while (this.characters.size > this.limit) {
      const oldest = this.characters.keys().next();
      if (oldest.done) break;
      this.characters.delete(oldest.value);
    }
    this.publish();
    return true;
  }

  /** Most recently inspected first. */
  list(): InspectedCharacter[] {
    return [...this.characters.values()]
      .sort((left, right) => right.inspectedAt.localeCompare(left.inspectedAt))
      .map((entry) => structuredClone(entry));
  }

  get(name: string): CharacterSnapshot | undefined {
    const entry = this.characters.get(name);
    return entry ? structuredClone(entry.snapshot) : undefined;
  }

  clear(): void {
    if (!this.characters.size) return;
    this.characters.clear();
    this.publish();
  }

  subscribe(listener: (roster: InspectedCharacter[]) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private publish(): void {
    const roster = this.list();
    for (const listener of this.listeners) listener(roster);
  }
}
