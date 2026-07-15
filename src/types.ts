import type { FishNetRpcMap } from "./fishnet/types.ts";

export type CaptureProtocol = "tcp" | "udp";

export interface CaptureConfig {
  /** WinDivert filter syntax. Defaults to the selected protocols. */
  filter?: string;
  /** Transport protocols to parse. Defaults to both TCP and UDP. */
  protocols?: readonly CaptureProtocol[];
  /** Executable name to follow across starts and reconnects. Omit to capture every matching process. */
  targetProcessName?: string;
  /** Override the bundled helper path, primarily for development and tests. */
  helperPath?: string;
  /** Decode captured UDP payloads as LiteNetLib 1.x packets. Defaults to false. */
  decodeLiteNetLib?: boolean;
  /** Decode verified FishNet headers inside LiteNetLib data packets. Implies decodeLiteNetLib. */
  decodeFishNet?: boolean;
  /** Bundled build-specific RPC map to use. Defaults to the current verified build. */
  fishNetBuildFingerprint?: string;
  /** Optional local symbol map. Only entries with verified wire hashes are used for live names. */
  fishNetRpcMap?: FishNetRpcMap;
}

export interface CapturedPacketBase {
  timestampTicks: bigint;
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
  truncated: boolean;
  payload: Buffer;
}

export interface CapturedTcpPacket extends CapturedPacketBase {
  protocol: "tcp";
  sequenceNumber: number;
  acknowledgementNumber: number;
  tcpFlags: number;
}

export interface CapturedUdpPacket extends CapturedPacketBase {
  protocol: "udp";
}

export type CapturedTransportPacket = CapturedTcpPacket | CapturedUdpPacket;

export interface CaptureTargetStatus {
  processName: string;
  state: "waiting" | "active";
  processIds: number[];
}

export type CaptureState = "stopped" | "starting" | "running" | "stopping";
