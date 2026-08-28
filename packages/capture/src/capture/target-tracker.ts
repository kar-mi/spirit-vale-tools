import type { CaptureProtocol, CapturedTransportPacket, CaptureTargetStatus } from "../types.ts";
import { findProcessIdsByName, listOwnedEndpoints } from "./win32-system.ts";
import type { WindowsOwnedEndpoint } from "./win32-system.ts";

type OwnedEndpoint = WindowsOwnedEndpoint;

const TARGET_REFRESH_INTERVAL_MS = 1_000;

export interface TargetSnapshotProvider {
  snapshot(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
    processIds: number[];
    endpoints: OwnedEndpoint[];
  }>;
}

export class WindowsTargetTracker {
  private processIds: number[] = [];
  private endpointKeys = new Set<string>();
  private timer?: ReturnType<typeof setInterval>;
  private refreshing = false;
  private published = false;
  private lastRefreshError?: string;

  constructor(
    readonly processName: string,
    private readonly protocols: readonly CaptureProtocol[],
    private readonly onStatus: (status: CaptureTargetStatus) => void,
    private readonly provider: TargetSnapshotProvider = new WindowsTargetSnapshotProvider(),
    private readonly onWarning: (message: string) => void = () => {},
    private readonly refreshIntervalMs = TARGET_REFRESH_INTERVAL_MS,
  ) {}

  async start(): Promise<void> {
    await this.refresh();
    this.timer = setInterval(() => void this.refresh(), this.refreshIntervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  classify(packet: CapturedTransportPacket): "inbound" | "outbound" | undefined {
    const source = this.matches(packet.protocol, packet.sourceIP, packet.sourcePort);
    const destination = this.matches(packet.protocol, packet.destinationIP, packet.destinationPort);
    if (source && !destination) return "outbound";
    if (destination && !source) return "inbound";
    return source ? "outbound" : undefined;
  }

  private matches(protocol: CaptureProtocol, address: string, port: number): boolean {
    return this.endpointKeys.has(endpointKey(protocol, address, port))
      || this.endpointKeys.has(endpointKey(protocol, "0.0.0.0", port))
      || this.endpointKeys.has(endpointKey(protocol, "::", port));
  }

  private async refresh(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const next = await this.provider.snapshot(this.processName, this.protocols);
      this.lastRefreshError = undefined;
      const changed = !this.published || next.processIds.length !== this.processIds.length
        || next.processIds.some((processId, index) => processId !== this.processIds[index]);
      this.processIds = next.processIds;
      this.endpointKeys = new Set(next.endpoints.map((endpoint) => endpointKey(
        endpoint.protocol,
        endpoint.address,
        endpoint.port,
      )));
      if (changed) {
        this.published = true;
        this.onStatus({
          processName: this.processName,
          state: this.processIds.length > 0 ? "active" : "waiting",
          processIds: [...this.processIds],
        });
      }
    } catch (error) {
      const message = `target refresh failed: ${errorMessage(error)}`;
      if (message !== this.lastRefreshError) {
        this.lastRefreshError = message;
        try { this.onWarning(message); } catch { /* Warning handlers must not reject the refresh loop. */ }
      }
    } finally {
      this.refreshing = false;
    }
  }
}

class WindowsTargetSnapshotProvider implements TargetSnapshotProvider {
  async snapshot(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
    processIds: number[];
    endpoints: OwnedEndpoint[];
  }> {
    const processIds = findProcessIdsByName(processName);
    if (processIds.length === 0) return { processIds, endpoints: [] };
    const selected = new Set(processIds);
    return {
      processIds,
      endpoints: listOwnedEndpoints(protocols).filter((endpoint) => selected.has(endpoint.processId)),
    };
  }
}

function endpointKey(protocol: CaptureProtocol, address: string, port: number): string {
  return `${protocol}|${address}|${port}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
