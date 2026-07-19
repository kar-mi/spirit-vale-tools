import type { CaptureProtocol, CapturedTransportPacket, CaptureTargetStatus } from "../types.ts";

interface OwnedEndpoint {
  protocol: CaptureProtocol;
  address: string;
  port: number;
  processId: number;
}

export interface TargetSnapshotProvider {
  snapshot(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
    processIds: number[];
    endpoints: OwnedEndpoint[];
  }>;
}

export class WindowsTargetTracker {
  private processIds: number[] = [];
  private endpoints: OwnedEndpoint[] = [];
  private timer?: ReturnType<typeof setInterval>;
  private refreshing = false;
  private published = false;

  constructor(
    readonly processName: string,
    private readonly protocols: readonly CaptureProtocol[],
    private readonly onStatus: (status: CaptureTargetStatus) => void,
    private readonly provider: TargetSnapshotProvider = new CommandTargetSnapshotProvider(),
  ) {}

  async start(): Promise<void> {
    await this.refresh();
    this.timer = setInterval(() => void this.refresh(), 250);
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
    return this.endpoints.some((endpoint) => endpoint.protocol === protocol
      && endpoint.port === port
      && (endpoint.address === address || endpoint.address === "0.0.0.0" || endpoint.address === "::"));
  }

  private async refresh(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const next = await this.provider.snapshot(this.processName, this.protocols);
      const changed = !this.published || next.processIds.length !== this.processIds.length
        || next.processIds.some((processId, index) => processId !== this.processIds[index]);
      this.processIds = next.processIds;
      this.endpoints = next.endpoints;
      if (changed) {
        this.published = true;
        this.onStatus({
          processName: this.processName,
          state: this.processIds.length > 0 ? "active" : "waiting",
          processIds: [...this.processIds],
        });
      }
    } finally {
      this.refreshing = false;
    }
  }
}

export class CommandTargetSnapshotProvider implements TargetSnapshotProvider {
  async snapshot(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
    processIds: number[];
    endpoints: OwnedEndpoint[];
  }> {
    const process = Bun.spawn({
      cmd: ["tasklist.exe", "/FI", `IMAGENAME eq ${processName}`, "/FO", "CSV", "/NH"],
      stdout: "pipe",
      stderr: "ignore",
      windowsHide: true,
    });
    const processOutput = await new Response(process.stdout).text();
    const processIds = await process.exited === 0 ? parseTaskList(processOutput) : [];
    if (processIds.length === 0) return { processIds, endpoints: [] };
    const outputs = await Promise.all(protocols.map(async (protocol) => {
      const child = Bun.spawn({
        cmd: ["netstat.exe", "-ano", "-p", protocol.toUpperCase()],
        stdout: "pipe",
        stderr: "ignore",
        windowsHide: true,
      });
      const output = await new Response(child.stdout).text();
      return await child.exited === 0 ? parseNetstat(output, protocol) : [];
    }));
    const selected = new Set(processIds);
    return { processIds, endpoints: outputs.flat().filter((endpoint) => selected.has(endpoint.processId)) };
  }
}

export function parseTaskList(output: string): number[] {
  return output.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^"(?:[^"]|"")*","(\d+)"/);
    return match ? [Number(match[1])] : [];
  }).sort((left, right) => left - right);
}

export function parseNetstat(output: string, protocol: CaptureProtocol): OwnedEndpoint[] {
  return output.split(/\r?\n/).flatMap((line) => {
    const columns = line.trim().split(/\s+/);
    if (columns[0]?.toLowerCase() !== protocol || columns.length < (protocol === "tcp" ? 5 : 4)) return [];
    const local = parseEndpoint(columns[1]!);
    const processId = Number(columns[protocol === "tcp" ? 4 : 3]);
    return local && Number.isInteger(processId) ? [{ protocol, ...local, processId }] : [];
  });
}

function parseEndpoint(value: string): { address: string; port: number } | undefined {
  const bracketed = value.match(/^\[(.*)]:(\d+)$/);
  if (bracketed) return { address: bracketed[1]!, port: Number(bracketed[2]) };
  const split = value.lastIndexOf(":");
  if (split < 0) return undefined;
  const port = Number(value.slice(split + 1));
  return Number.isInteger(port) ? { address: value.slice(0, split), port } : undefined;
}
