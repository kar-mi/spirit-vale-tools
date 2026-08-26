import type { CaptureProtocol, CapturedTransportPacket, CaptureTargetStatus } from "../types.ts";

interface OwnedEndpoint {
  protocol: CaptureProtocol;
  address: string;
  port: number;
  processId: number;
}

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
    private readonly provider: TargetSnapshotProvider = new CommandTargetSnapshotProvider(),
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

class CommandTargetSnapshotProvider implements TargetSnapshotProvider {

  async snapshot(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
    processIds: number[];
    endpoints: OwnedEndpoint[];
  }> {
    switch (process.platform) {
      case "win32": return this.snapshotWindows(processName, protocols);
      case "linux": return this.snapshotLinux(processName, protocols);
      default: throw new Error("Platform not implemented."); // return { processIds: [], endpoints: [] };
    }
  }

  async snapshotWindows(processName: string, protocols: readonly CaptureProtocol[]): Promise<{
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

  // ─── Linux / Proton ────────────────────────────────────────────
  private async snapshotLinux(
    processName: string,
    protocols: readonly CaptureProtocol[],
  ) {
    const processIds = await findLinuxPids(processName);
    if (processIds.length === 0) return { processIds, endpoints: [] };

    const outputs = await Promise.all(
      protocols.map((protocol) => listLinuxEndpoints(protocol)),
    );

    const selected = new Set(processIds);

    const returnValue = {
      processIds,
      endpoints: outputs.flat().filter((e) => selected.has(e.processId)),
    };

    return returnValue;
  }
}

/** Match SpiritVale.exe, wine-preloader, etc. Prefer cmdline match for Proton. */
async function findLinuxPids(processName: string): Promise<number[]> {
  const needle = processName.toLowerCase();

  // 1) Fast path: pgrep -af (full cmdline)
  const pgrep = Bun.spawn({
    cmd: ["pgrep", "-af", processName],
    stdout: "pipe",
    stderr: "ignore",
  });
  const text = await new Response(pgrep.stdout).text();
  if ((await pgrep.exited) === 0 && text.trim()) {
    const pids = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => Number(line.split(/\s+/)[0]))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (pids.length) return [...new Set(pids)];
  }

  // 2) Fallback: scan /proc (works even if pgrep isn't ideal)
  const pids: number[] = [];
  const proc = Bun.spawn({
    cmd: ["sh", "-c", "ls -1 /proc | grep -E '^[0-9]+$'"],
    stdout: "pipe",
    stderr: "ignore",
  });
  const procList = await new Response(proc.stdout).text();
  for (const id of procList.split("\n").map((s) => s.trim()).filter(Boolean)) {
    try {
      const cmdline = await Bun.file(`/proc/${id}/cmdline`).text();
      const joined = cmdline.replace(/\0/g, " ").toLowerCase();
      if (joined.includes(needle)) pids.push(Number(id));
    } catch {
      // process vanished
    }
  }
  return [...new Set(pids)];
}

/**
* ss examples:
*   UDP: ss -H -ulnp   or  ss -H -unap
*   TCP: ss -H -tlnp   or  ss -H -tnap
* Process field looks like: users:(("SpiritVale.exe",pid=1234,fd=42))
*/
async function listLinuxEndpoints(protocol: CaptureProtocol): Promise<OwnedEndpoint[]> {
  // -a = all, -n = numeric, -p = processes, -H = no header
  // -u / -t = udp / tcp
  const protoFlag = protocol === "udp" ? "-u" : "-t";
  const child = Bun.spawn({
    cmd: ["ss", "-H", "-anp", protoFlag],
    stdout: "pipe",
    stderr: "ignore",
  });
  const output = await new Response(child.stdout).text();
  if ((await child.exited) !== 0) return [];
  return parseSs(output, protocol);
}

function parseSs(output: string, protocol: CaptureProtocol): OwnedEndpoint[] {
  const endpoints: OwnedEndpoint[] = [];

  for (const line of output.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // users:(("name",pid=1234,fd=5))
    const pidMatch = trimmed.match(/pid=(\d+)/);
    if (!pidMatch) continue;
    const processId = Number(pidMatch[1]);

    // Columns vary slightly; local address is usually the 5th field for ss -anp
    // Netid State Recv-Q Send-Q Local Address:Port Peer Address:Port Process
    const parts = trimmed.split(/\s+/);
    // Find the first token that looks like addr:port (handles IPv4/IPv6)
    let local: string | undefined;
    for (const part of parts) {
      if (part.includes(":") && !part.startsWith("users:")) {
        local = part;
        break;
      }
    }
    if (!local) continue;

    const parsed = splitHostPort(local);
    if (!parsed) continue;

    endpoints.push({
      processId,
      protocol,
      address: parsed.host,
      port: parsed.port,
    });
  }
  return endpoints;
}

/** "0.0.0.0:7777" | "[::]:7777" | "*:7777" | "127.0.0.1:1234" */
function splitHostPort(value: string): { host: string; port: number } | null {
  if (value.startsWith("[")) {
    const m = value.match(/^\[([^\]]+)\]:(\d+)$/);
    if (!m) return null;
    return { host: m[1] ?? "", port: Number(m[2]) };
  }
  const idx = value.lastIndexOf(":");
  if (idx <= 0) return null;
  const host = value.slice(0, idx);
  const port = Number(value.slice(idx + 1));
  if (!Number.isFinite(port)) return null;
  return { host: host === "*" ? "0.0.0.0" : host, port };
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

function endpointKey(protocol: CaptureProtocol, address: string, port: number): string {
  return `${protocol}|${address}|${port}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
