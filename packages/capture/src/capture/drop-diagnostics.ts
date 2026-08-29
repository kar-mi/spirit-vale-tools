import { decodeLiteNetLibDatagram } from "../litenetlib/decoder.ts";
import type { CapturedTransportPacket } from "../types.ts";

/** Flows tracked before new ones are ignored. */
export const DROP_FLOW_LIMIT = 64;

/** Flows named in a summary. */
export const DROP_FLOW_REPORT_COUNT = 5;

/** Sequenced packets a flow must show before its verdict is trusted. */
export const DROP_VERDICT_MIN_SAMPLES = 20;

/**
 * Fraction of consecutive sequence numbers above which a flow is called game traffic. A real stream
 * sits far above this and traffic that merely parses as LiteNetLib far below, so it is not delicate.
 */
export const DROP_VERDICT_THRESHOLD = 0.25;

interface FlowStats {
  packets: number;
  sequenced: number;
  consecutive: number;
  previous?: number;
}

export interface DroppedFlow {
  flow: string;
  packets: number;
  verdict: "game traffic" | "unrelated" | "unknown";
}

/**
 * Explains what unattributed capture is throwing away, without keeping any of it.
 *
 * A high give-up count reads as lost game traffic and usually is not. Per flow this keeps a count
 * and one statistic - how often a LiteNetLib sequence number follows its predecessor - which tells
 * a real stream from traffic that merely parses as one, since nothing else maintains a sequence.
 * No payload is retained, so a summary is safe to share.
 */
export class DropDiagnostics {
  private readonly flows = new Map<string, FlowStats>();

  /** Records a packet that could not be attributed and was given up on. */
  record(packet: CapturedTransportPacket): void {
    const flow = flowName(packet);
    let stats = this.flows.get(flow);
    if (!stats) {
      if (this.flows.size >= DROP_FLOW_LIMIT) return;
      stats = { packets: 0, sequenced: 0, consecutive: 0 };
      this.flows.set(flow, stats);
    }
    stats.packets += 1;
    this.countSequence(stats, packet);
  }

  /**
   * The busiest dropped flows, worst first, each with a verdict.
   *
   * Counts run for the whole session rather than since the last call, because a verdict needs
   * accumulated sequence samples to settle. Callers reporting a windowed count should say so.
   */
  topFlows(limit = DROP_FLOW_REPORT_COUNT): DroppedFlow[] {
    return [...this.flows]
      .sort(([, a], [, b]) => b.packets - a.packets)
      .slice(0, limit)
      .map(([flow, stats]) => ({ flow, packets: stats.packets, verdict: verdictFor(stats) }));
  }

  /** Whether any dropped flow looks like game traffic - the only case worth acting on. */
  get hasGameTraffic(): boolean {
    return [...this.flows.values()].some((stats) => verdictFor(stats) === "game traffic");
  }

  reset(): void {
    this.flows.clear();
  }

  private countSequence(stats: FlowStats, packet: CapturedTransportPacket): void {
    if (packet.protocol !== "udp" || packet.payload.length === 0) return;
    let decoded;
    try {
      decoded = decodeLiteNetLibDatagram(packet.payload);
    } catch {
      return;
    }
    for (const { packet: inner } of decoded) {
      // Control packets carry no sequence, so there is no ordering to check.
      const sequence = "sequence" in inner ? inner.sequence : undefined;
      if (sequence === undefined) continue;
      stats.sequenced += 1;
      // The sequence space is 15 bits and wraps.
      if (stats.previous !== undefined && sequence === (stats.previous + 1) % 32768) {
        stats.consecutive += 1;
      }
      stats.previous = sequence;
    }
  }
}

function verdictFor(stats: FlowStats): DroppedFlow["verdict"] {
  if (stats.sequenced < DROP_VERDICT_MIN_SAMPLES) return "unknown";
  return stats.consecutive / stats.sequenced >= DROP_VERDICT_THRESHOLD ? "game traffic" : "unrelated";
}

function flowName(packet: CapturedTransportPacket): string {
  return `${packet.protocol} ${packet.sourceIP}:${packet.sourcePort} -> ${packet.destinationIP}:${packet.destinationPort}`;
}
