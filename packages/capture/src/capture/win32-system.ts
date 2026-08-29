import { dlopen, FFIType } from "bun:ffi";
import type { Pointer } from "bun:ffi";

import type { CaptureProtocol } from "../types.ts";
import { formatIpv6 } from "./ip-address.ts";

export interface WindowsOwnedEndpoint {
  protocol: CaptureProtocol;
  address: string;
  port: number;
  processId: number;
}

const ERROR_SUCCESS = 0;
const ERROR_INSUFFICIENT_BUFFER = 122;
const TH32CS_SNAPPROCESS = 0x0000_0002;
const AF_INET = 2;
const AF_INET6 = 23;
const TCP_TABLE_OWNER_PID_ALL = 5;
const UDP_TABLE_OWNER_PID = 1;

/**
 * Byte layout of one row in the table returned by GetExtendedTcpTable or
 * GetExtendedUdpTable. Every offset is relative to the start of the row and
 * mirrors the matching MIB_*_OWNER_PID struct.
 */
interface EndpointLayout {
  protocol: CaptureProtocol;
  family: typeof AF_INET | typeof AF_INET6;
  rowSize: number;
  addressOffset: number;
  /** Local port. Windows stores it in network byte order in the low word. */
  portOffset: number;
  processIdOffset: number;
}

const ENDPOINT_LAYOUTS: readonly EndpointLayout[] = [
  // MIB_TCPROW_OWNER_PID: state, addr, port, remoteAddr, remotePort, pid
  { protocol: "tcp", family: AF_INET, rowSize: 24, addressOffset: 4, portOffset: 8, processIdOffset: 20 },
  // MIB_TCP6ROW_OWNER_PID: addr[16], scopeId, port, remoteAddr[16], remoteScopeId, remotePort, state, pid
  { protocol: "tcp", family: AF_INET6, rowSize: 56, addressOffset: 0, portOffset: 20, processIdOffset: 52 },
  // MIB_UDPROW_OWNER_PID: addr, port, pid
  { protocol: "udp", family: AF_INET, rowSize: 12, addressOffset: 0, portOffset: 4, processIdOffset: 8 },
  // MIB_UDP6ROW_OWNER_PID: addr[16], scopeId, port, pid
  { protocol: "udp", family: AF_INET6, rowSize: 28, addressOffset: 0, portOffset: 20, processIdOffset: 24 },
];

// MIB_IPFORWARDROW: destination, mask, policy and next hop precede the interface index.
const ROUTE_SIZE = 56;
const ROUTE_INTERFACE_INDEX_OFFSET = 16;
// MIB_IPADDRROW: address, then interface index.
const ADDRESS_ROW_SIZE = 24;
const ADDRESS_ROW_INTERFACE_INDEX_OFFSET = 4;

// PROCESSENTRY32W. Its trailing szExeFile[MAX_PATH] makes the size architecture dependent.
const PROCESS_ENTRY_SIZE = process.arch === "ia32" ? 556 : 568;
const PROCESS_ENTRY_ID_OFFSET = 8;
const PROCESS_ENTRY_NAME_OFFSET = process.arch === "ia32" ? 36 : 44;

let kernel32: Kernel32Symbols | undefined;
let ipHelper: IpHelperSymbols | undefined;

export function findProcessIdsByName(processName: string): number[] {
  requireWindows();
  const api = loadKernel32();
  const snapshot = api.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
  if (snapshot === null || snapshot === -1) throw new Error("Windows could not create a process snapshot");
  const entry = new Uint8Array(PROCESS_ENTRY_SIZE);
  const view = new DataView(entry.buffer);
  view.setUint32(0, PROCESS_ENTRY_SIZE, true); // dwSize; the snapshot walk rejects an unset size.
  const expected = processName.toLowerCase();
  const processIds: number[] = [];
  try {
    let hasEntry = api.Process32FirstW(snapshot, entry) !== 0;
    while (hasEntry) {
      if (decodeWideString(entry, PROCESS_ENTRY_NAME_OFFSET).toLowerCase() === expected) {
        processIds.push(view.getUint32(PROCESS_ENTRY_ID_OFFSET, true));
      }
      hasEntry = api.Process32NextW(snapshot, entry) !== 0;
    }
  } finally {
    api.CloseHandle(snapshot);
  }
  return processIds.sort((left, right) => left - right);
}

export function listOwnedEndpoints(protocols: readonly CaptureProtocol[]): WindowsOwnedEndpoint[] {
  requireWindows();
  const selected = new Set(protocols);
  return ENDPOINT_LAYOUTS.filter((layout) => selected.has(layout.protocol)).flatMap(readEndpoints);
}

export function defaultRouteIpv4Address(): string | undefined {
  requireWindows();
  const api = loadIpHelper();
  const route = new Uint8Array(ROUTE_SIZE);
  if (api.GetBestRoute(0, 0, route) !== ERROR_SUCCESS) return undefined;
  const interfaceIndex = new DataView(route.buffer).getUint32(ROUTE_INTERFACE_INDEX_OFFSET, true);
  const table = readVariableTable((buffer, size) => api.GetIpAddrTable(buffer, size, 0));
  const view = tableView(table, ADDRESS_ROW_SIZE);
  for (let index = 0; index < view.count; index += 1) {
    const offset = 4 + index * ADDRESS_ROW_SIZE;
    if (view.data.getUint32(offset + ADDRESS_ROW_INTERFACE_INDEX_OFFSET, true) === interfaceIndex) {
      return formatIpv4(table, offset);
    }
  }
  return undefined;
}

function readEndpoints(layout: EndpointLayout): WindowsOwnedEndpoint[] {
  const api = loadIpHelper();
  const table = readVariableTable((buffer, size) => (layout.protocol === "tcp"
    ? api.GetExtendedTcpTable(buffer, size, 0, layout.family, TCP_TABLE_OWNER_PID_ALL, 0)
    : api.GetExtendedUdpTable(buffer, size, 0, layout.family, UDP_TABLE_OWNER_PID, 0)));
  const view = tableView(table, layout.rowSize);
  const endpoints: WindowsOwnedEndpoint[] = [];
  for (let index = 0; index < view.count; index += 1) {
    const offset = 4 + index * layout.rowSize;
    endpoints.push({
      protocol: layout.protocol,
      address: readAddress(table, offset + layout.addressOffset, layout.family),
      port: view.data.getUint16(offset + layout.portOffset, false),
      processId: view.data.getUint32(offset + layout.processIdOffset, true),
    });
  }
  return endpoints;
}

/**
 * Runs the two-call Windows table pattern: a null buffer makes the API report the
 * required size through ERROR_INSUFFICIENT_BUFFER, then a buffer of that size is
 * filled. The retry loop covers a table that grew between the two calls.
 */
function readVariableTable(call: (buffer: Uint8Array | null, size: Uint32Array) => number): Uint8Array {
  const size = new Uint32Array(1);
  const initialResult = call(null, size);
  if (initialResult !== ERROR_INSUFFICIENT_BUFFER || !size[0]) {
    throw new Error(`Windows table size query failed with error ${initialResult}`);
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const capacity: number = size[0] ?? 0;
    const buffer: Uint8Array = new Uint8Array(capacity);
    size[0] = buffer.byteLength;
    const result = call(buffer, size);
    if (result === ERROR_SUCCESS) return buffer.subarray(0, size[0]);
    if (result !== ERROR_INSUFFICIENT_BUFFER || size[0] === 0) {
      throw new Error(`Windows table query failed with error ${result}`);
    }
  }
  throw new Error("Windows table changed too frequently to read consistently");
}

/** Reads the leading row count and checks that the promised rows fit the buffer. */
function tableView(table: Uint8Array, rowSize: number): { count: number; data: DataView } {
  if (table.byteLength < 4) throw new Error("Windows returned a truncated table");
  const data = new DataView(table.buffer, table.byteOffset, table.byteLength);
  const count = data.getUint32(0, true);
  if (4 + count * rowSize > table.byteLength) throw new Error("Windows returned an invalid table size");
  return { count, data };
}

function readAddress(buffer: Uint8Array, offset: number, family: number): string {
  return family === AF_INET
    ? formatIpv4(buffer, offset)
    : formatIpv6(Buffer.from(buffer.subarray(offset, offset + 16)));
}

function formatIpv4(buffer: Uint8Array, offset: number): string {
  return `${buffer[offset]}.${buffer[offset + 1]}.${buffer[offset + 2]}.${buffer[offset + 3]}`;
}

function decodeWideString(buffer: Uint8Array, offset: number): string {
  let end = offset;
  while (end + 1 < buffer.byteLength && (buffer[end] !== 0 || buffer[end + 1] !== 0)) end += 2;
  return new TextDecoder("utf-16le").decode(buffer.subarray(offset, end));
}

function requireWindows(): void {
  if (process.platform !== "win32") throw new Error("Windows system APIs are unavailable on this platform");
}

function loadKernel32(): Kernel32Symbols {
  if (kernel32) return kernel32;
  kernel32 = dlopen("kernel32.dll", {
    CreateToolhelp32Snapshot: { args: [FFIType.u32, FFIType.u32], returns: FFIType.ptr },
    Process32FirstW: { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.i32 },
    Process32NextW: { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.i32 },
    CloseHandle: { args: [FFIType.ptr], returns: FFIType.i32 },
  }).symbols as unknown as Kernel32Symbols;
  return kernel32;
}

function loadIpHelper(): IpHelperSymbols {
  if (ipHelper) return ipHelper;
  ipHelper = dlopen("iphlpapi.dll", {
    GetBestRoute: { args: [FFIType.u32, FFIType.u32, FFIType.ptr], returns: FFIType.u32 },
    GetIpAddrTable: { args: [FFIType.ptr, FFIType.ptr, FFIType.i32], returns: FFIType.u32 },
    GetExtendedTcpTable: {
      args: [FFIType.ptr, FFIType.ptr, FFIType.i32, FFIType.u32, FFIType.u32, FFIType.u32],
      returns: FFIType.u32,
    },
    GetExtendedUdpTable: {
      args: [FFIType.ptr, FFIType.ptr, FFIType.i32, FFIType.u32, FFIType.u32, FFIType.u32],
      returns: FFIType.u32,
    },
  }).symbols as unknown as IpHelperSymbols;
  return ipHelper;
}

interface Kernel32Symbols {
  CreateToolhelp32Snapshot(flags: number, processId: number): Pointer | null;
  Process32FirstW(snapshot: Pointer, entry: Uint8Array): number;
  Process32NextW(snapshot: Pointer, entry: Uint8Array): number;
  CloseHandle(handle: Pointer): number;
}

interface IpHelperSymbols {
  GetBestRoute(destination: number, source: number, route: Uint8Array): number;
  GetIpAddrTable(table: Uint8Array | null, size: Uint32Array, ordered: number): number;
  GetExtendedTcpTable(table: Uint8Array | null, size: Uint32Array, ordered: number, family: number, tableClass: number, reserved: number): number;
  GetExtendedUdpTable(table: Uint8Array | null, size: Uint32Array, ordered: number, family: number, tableClass: number, reserved: number): number;
}
