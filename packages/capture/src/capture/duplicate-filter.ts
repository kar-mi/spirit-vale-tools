import type { CaptureProtocol, CapturedTransportPacket } from "../types.ts";

/** How long a payload stays remembered. Relayed copies arrive within about a millisecond. */
export const DUPLICATE_WINDOW_MS = 5;

/** Entries retained before the oldest are evicted, mirroring the pending-packet ceiling. */
export const DUPLICATE_ENTRY_LIMIT = 16_384;

export interface DuplicateFilterOptions {
  windowMs?: number;
  entryLimit?: number;
}

/**
 * Suppresses the redundant copies a redirecting VPN puts on the wire.
 *
 * Relays such as ExitLag rewrite addresses and ports rather than encapsulating, and send a datagram
 * over several routes at once, so one datagram is captured more than once. The key is the payload
 * with the direction and local port, which a relay preserves, never the peer's endpoint, which it
 * rewrites. Direction keeps a peer's echo of an identical control payload distinct; the local port
 * keeps two sockets distinct when they send the same bytes at once, as two connections opening
 * together do.
 */
export class DuplicateFilter {
  private readonly windowMs: number;
  private readonly entryLimit: number;
  private readonly seen = new Map<string, number>();
  private suppressed = 0;

  constructor(options: DuplicateFilterOptions = {}) {
    this.windowMs = options.windowMs ?? DUPLICATE_WINDOW_MS;
    this.entryLimit = options.entryLimit ?? DUPLICATE_ENTRY_LIMIT;
  }

  /** Total copies suppressed since the last {@link takeSuppressedCount}. */
  get suppressedCount(): number {
    return this.suppressed;
  }

  /**
   * Reports whether a packet is the first sighting of its payload and should be decoded.
   *
   * Payload-free packets are always admitted; they carry nothing to tell copies apart.
   */
  admit(packet: CapturedTransportPacket, nowMs: number = Date.now()): boolean {
    if (packet.payload.length === 0) return true;
    const key = digest(packet.protocol, packet.direction, localPortOf(packet), packet.payload);
    const previous = this.seen.get(key);
    if (previous !== undefined && nowMs - previous < this.windowMs) {
      this.suppressed += 1;
      return false;
    }
    // Re-inserting moves the key to the end, so eviction always sheds the least recently seen.
    this.seen.delete(key);
    this.seen.set(key, nowMs);
    this.evict(nowMs);
    return true;
  }

  /** Returns the suppressed count and resets it, for periodic reporting. */
  takeSuppressedCount(): number {
    const total = this.suppressed;
    this.suppressed = 0;
    return total;
  }

  reset(): void {
    this.seen.clear();
    this.suppressed = 0;
  }

  private evict(nowMs: number): void {
    const cutoff = nowMs - this.windowMs;
    for (const [key, observedAt] of this.seen) {
      // Insertion order is observation order, so the first entry still inside the window ends the sweep.
      if (observedAt >= cutoff && this.seen.size <= this.entryLimit) break;
      this.seen.delete(key);
    }
  }
}

/**
 * Keys a payload by its exact bytes. A hash cheap enough to be worth it would collide often enough
 * to discard genuine packets, and payloads are MTU-bounded over a window this short.
 */
function digest(protocol: CaptureProtocol, direction: string, localPort: number, payload: Buffer): string {
  return `${protocol}:${direction}:${localPort}:${payload.toString("latin1")}`;
}

/** The port on this host, which a relay leaves alone while rewriting the peer's. */
function localPortOf(packet: CapturedTransportPacket): number {
  return packet.direction === "outbound" ? packet.sourcePort : packet.destinationPort;
}
