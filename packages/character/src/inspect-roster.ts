import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { decodeCharacterRpcPayload } from "./decoder.ts";
import type { CharacterSnapshot } from "./types.ts";

/** `PlayerController.Inspect_T(conn, CharacterData)` — the reply to inspecting another player. */
const INSPECT_RPC = "Inspect_T";

/** Roster cap. */
const DEFAULT_LIMIT = 24;

export interface InspectedCharacter {
  snapshot: CharacterSnapshot;
  /** When this inspect arrived. Later inspects of the same player replace the earlier one. */
  inspectedAt: string;
}

/** Characters seen by inspecting other players, most recent per player. */
export class FishNetInspectRoster {
  private readonly characters = new Map<string, InspectedCharacter>();
  private readonly listeners = new Set<(roster: InspectedCharacter[]) => void>();
  private localName?: string;

  constructor(private readonly limit: number = DEFAULT_LIMIT) {}

  /** The local player's name. */
  setLocalName(name: string | undefined): void {
    this.localName = name;
  }

  /** Returns true when the packet was an inspect reply this roster consumed. */
  consume(packet: CapturedFishNetPacket, now = new Date()): boolean {
    // Matched by name alone.
    if (packet.rpcName !== INSPECT_RPC) return false;

    let snapshot: CharacterSnapshot;
    try {
      // No leading CharacterUpdateType on this RPC, unlike CharacterCallback_T.
      ({ snapshot } = decodeCharacterRpcPayload(packet.payload, false, now));
    } catch {
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
