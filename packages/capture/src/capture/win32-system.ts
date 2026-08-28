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

let kernel32: Kernel32Symbols | undefined;
let ipHelper: IpHelperSymbols | undefined;

export function findProcessIdsByName(processName: string): number[] {
  requireWindows();
  const api = loadKernel32();
  const snapshot = api.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
  if (snapshot === null || snapshot === -1) throw new Error("Windows could not create a process snapshot");
  const pointerSize = process.arch === "ia32" ? 4 : 8;
  const entrySize = pointerSize === 8 ? 568 : 556;
  const executableOffset = pointerSize === 8 ? 44 : 36;
  const entry = new Uint8Array(entrySize);
  const view = new DataView(entry.buffer);
  view.setUint32(0, entrySize, true);
  const expected = processName.toLowerCase();
  const processIds: number[] = [];
  try {
    let hasEntry = api.Process32FirstW(snapshot, entry) !== 0;
    while (hasEntry) {
      if (decodeWideString(entry, executableOffset).toLowerCase() === expected) {
        processIds.push(view.getUint32(8, true));
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
  const endpoints: WindowsOwnedEndpoint[] = [];
  if (selected.has("tcp")) endpoints.push(...readTcpTable(AF_INET), ...readTcpTable(AF_INET6));
  if (selected.has("udp")) endpoints.push(...readUdpTable(AF_INET), ...readUdpTable(AF_INET6));
  return endpoints;
}

export function defaultRouteIpv4Address(): string | undefined {
  requireWindows();
  const api = loadIpHelper();
  const route = new Uint8Array(56);
  if (api.GetBestRoute(0, 0, route) !== ERROR_SUCCESS) return undefined;
  const interfaceIndex = new DataView(route.buffer).getUint32(16, true);
  const table = readVariableTable((buffer, size) => api.GetIpAddrTable(buffer, size, 0));
  const view = tableView(table, 24);
  for (let index = 0; index < view.count; index += 1) {
    const offset = 4 + index * view.rowSize;
    if (view.data.getUint32(offset + 4, true) === interfaceIndex) return formatIpv4(table, offset);
  }
  return undefined;
}

function readTcpTable(family: number): WindowsOwnedEndpoint[] {
  const api = loadIpHelper();
  const table = readVariableTable((buffer, size) => api.GetExtendedTcpTable(
    buffer, size, 0, family, TCP_TABLE_OWNER_PID_ALL, 0,
  ));
  const rowSize = family === AF_INET ? 24 : 56;
  const view = tableView(table, rowSize);
  const endpoints: WindowsOwnedEndpoint[] = [];
  for (let index = 0; index < view.count; index += 1) {
    const offset = 4 + index * rowSize;
    endpoints.push(family === AF_INET
      ? {
          protocol: "tcp",
          address: formatIpv4(table, offset + 4),
          port: view.data.getUint16(offset + 8, false),
          processId: view.data.getUint32(offset + 20, true),
        }
      : {
          protocol: "tcp",
          address: formatIpv6(Buffer.from(table.subarray(offset, offset + 16))),
          port: view.data.getUint16(offset + 20, false),
          processId: view.data.getUint32(offset + 52, true),
        });
  }
  return endpoints;
}

function readUdpTable(family: number): WindowsOwnedEndpoint[] {
  const api = loadIpHelper();
  const table = readVariableTable((buffer, size) => api.GetExtendedUdpTable(
    buffer, size, 0, family, UDP_TABLE_OWNER_PID, 0,
  ));
  const rowSize = family === AF_INET ? 12 : 28;
  const view = tableView(table, rowSize);
  const endpoints: WindowsOwnedEndpoint[] = [];
  for (let index = 0; index < view.count; index += 1) {
    const offset = 4 + index * rowSize;
    endpoints.push(family === AF_INET
      ? {
          protocol: "udp",
          address: formatIpv4(table, offset),
          port: view.data.getUint16(offset + 4, false),
          processId: view.data.getUint32(offset + 8, true),
        }
      : {
          protocol: "udp",
          address: formatIpv6(Buffer.from(table.subarray(offset, offset + 16))),
          port: view.data.getUint16(offset + 20, false),
          processId: view.data.getUint32(offset + 24, true),
        });
  }
  return endpoints;
}

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

function tableView(table: Uint8Array, rowSize: number): { count: number; rowSize: number; data: DataView } {
  if (table.byteLength < 4) throw new Error("Windows returned a truncated table");
  const data = new DataView(table.buffer, table.byteOffset, table.byteLength);
  const count = data.getUint32(0, true);
  if (4 + count * rowSize > table.byteLength) throw new Error("Windows returned an invalid table size");
  return { count, rowSize, data };
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
