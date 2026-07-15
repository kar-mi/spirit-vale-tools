export interface CaptureConfig {
  /** WinDivert filter syntax. Defaults to `tcp`. */
  filter?: string;
  /** Override the bundled helper path, primarily for development and tests. */
  helperPath?: string;
}

export interface CapturedTcpPacket {
  /** WinDivert's QueryPerformanceCounter timestamp, preserved without precision loss. */
  timestampTicks: bigint;
  /** Wall-clock time observed by the Bun parent. */
  capturedAt: Date;
  interfaceIndex: number;
  subinterfaceIndex: number;
  direction: "inbound" | "outbound";
  loopback: boolean;
  ipVersion: 4 | 6;
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  sequenceNumber: number;
  acknowledgementNumber: number;
  tcpFlags: number;
  truncated: boolean;
  payload: Buffer;
}

export type CaptureState = "stopped" | "starting" | "running" | "stopping";
