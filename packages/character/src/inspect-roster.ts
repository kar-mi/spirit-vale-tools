import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodeCharacterRpcPayload } from "./decoder.ts";
import type { CharacterSnapshot } from "./types.ts";

/**
 * `PlayerController.Inspect_T(conn, CharacterData)` — the reply to inspecting another player. It
 * carries the SAME `CharacterData` as `CharacterCallback_T`, minus the leading `CharacterUpdateType`.
 */
const INSPECT_RPC = "Inspect_T";

/**
 * A CharacterData for another player runs to several KB even without inventory, so a shorter
 * unnamed targetRpc is never worth attempting to decode.
 */
const MIN_SHAPE_MATCH_BYTES = 512;

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
   * The local player's name, so a shape-matched payload that is actually your own character is
   * never mistaken for an inspected stranger.
   */
  setLocalName(name: string | undefined): void {
    this.localName = name;
  }

  /** Returns true when the packet was an inspect reply this roster consumed. */
  consume(packet: CapturedFishNetPacket, now = new Date()): boolean {
    const named = packet.rpcName === INSPECT_RPC;
    // FishNet registers RPC-link ids per connection at spawn, so a capture that joined mid-session
    // cannot name PlayerController's RPCs at all. The inspect reply then arrives as an unnamed
    // targetRpc and has to be recognised by SHAPE — it is the only unnamed targetRpc that decodes
    // as a complete CharacterData.
    const unnamedCandidate = packet.rpcName === undefined
      && packet.packetName === "targetRpc"
      && packet.payload.length >= MIN_SHAPE_MATCH_BYTES;
    if (!named && !unnamedCandidate) return false;

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
    // Shape matching has to clear a higher bar than a named RPC: any unnamed targetRpc reaches it.
    if (!named && !plausibleCharacter(snapshot)) return false;
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

/**
 * Whether a shape-matched payload really looks like a player. `decodeCharacterRpcPayload` already
 * rejects nonsense attributes and impossible string lengths, so this only has to exclude the
 * degenerate decodes that a wrong-but-parseable byte run can still produce.
 */
function plausibleCharacter(snapshot: CharacterSnapshot): boolean {
  if (snapshot.level < 1 || snapshot.level > 500) return false;
  if (snapshot.jobLevel < 0 || snapshot.jobLevel > 200) return false;
  if (!snapshot.archetypes.length) return false;
  // A real inspected player is wearing or carrying something.
  return snapshot.equipment.length > 0 || snapshot.artifacts.length > 0 || snapshot.skills.length > 0;
}
