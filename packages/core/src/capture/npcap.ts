import { existsSync } from "node:fs";
import path from "node:path";
import { CString, dlopen, FFIType, read, toArrayBuffer } from "bun:ffi";
import type { Pointer } from "bun:ffi";

export type NpcapAvailability = "ready" | "missing" | "admin-only" | "error";

export interface NpcapStatus {
  availability: NpcapAvailability;
  detail: string;
  version?: string;
}

export interface NpcapDevice {
  name: string;
  description: string;
  addresses: string[];
  loopback: boolean;
}

export interface NpcapPacket {
  capturedAt: Date;
  timestampTicks: bigint;
  data: Buffer;
  originalLength: number;
}

export interface NpcapSession {
  readonly device: NpcapDevice;
  readonly dataLink: number;
  nextPacket(): NpcapPacket | undefined;
  close(): void;
}

export interface NpcapRuntime {
  status(): Promise<NpcapStatus>;
  listDevices(): Promise<NpcapDevice[]>;
  open(device: NpcapDevice, filter: string): Promise<NpcapSession>;
}

const ERROR_BUFFER_SIZE = 512;

export class SystemNpcapRuntime implements NpcapRuntime {
  private api?: LoadedNpcap;

  async status(): Promise<NpcapStatus> {
    if (process.platform !== "win32") {
      return { availability: "error", detail: "Npcap capture is supported only on Windows" };
    }
    const dllPath = npcapDllPath();
    if (!existsSync(dllPath)) {
      return { availability: "missing", detail: "Npcap is not installed" };
    }
    if (await isAdminOnlyInstall()) {
      return {
        availability: "admin-only",
        detail: "Npcap is installed for administrators only; reinstall it with that restriction unchecked",
      };
    }
    try {
      const api = this.load();
      const version = String(api.symbols.pcap_lib_version());
      if (!version.toLowerCase().includes("npcap")) {
        return { availability: "error", detail: "The loaded packet capture library is not Npcap" };
      }
      return { availability: "ready", detail: "Npcap is ready", version };
    } catch (error) {
      return { availability: "error", detail: errorMessage(error) };
    }
  }

  async listDevices(): Promise<NpcapDevice[]> {
    const status = await this.status();
    if (status.availability !== "ready") throw new Error(status.detail);
    const api = this.load();
    const resultPointer = new Uint8Array(8);
    const errorBuffer = new Uint8Array(ERROR_BUFFER_SIZE);
    const result = api.symbols.pcap_findalldevs(resultPointer, errorBuffer);
    if (result !== 0) throw new Error(readCStringBuffer(errorBuffer) || "Npcap could not enumerate network adapters");
    const head = pointerFromBuffer(resultPointer);
    if (!head) return [];
    const devices: NpcapDevice[] = [];
    try {
      let current: Pointer | null = head;
      while (current) {
        const namePointer = nullablePointer(read.ptr(current, 8));
        const descriptionPointer = nullablePointer(read.ptr(current, 16));
        const addressHead = nullablePointer(read.ptr(current, 24));
        const flags = read.u32(current, 32);
        if (namePointer) {
          const name = new CString(namePointer).toString();
          devices.push({
            name,
            description: descriptionPointer ? new CString(descriptionPointer).toString() : name,
            addresses: readAddresses(addressHead),
            loopback: (flags & 1) !== 0 || name.toLowerCase().includes("loopback"),
          });
        }
        current = nullablePointer(read.ptr(current, 0));
      }
    } finally {
      api.symbols.pcap_freealldevs(head);
    }
    return devices;
  }

  async open(device: NpcapDevice, filter: string): Promise<NpcapSession> {
    const status = await this.status();
    if (status.availability !== "ready") throw new Error(status.detail);
    const api = this.load();
    const errorBuffer = new Uint8Array(ERROR_BUFFER_SIZE);
    const name = cString(device.name);
    const handle = nullablePointer(api.symbols.pcap_create(name, errorBuffer));
    if (!handle) throw new Error(readCStringBuffer(errorBuffer) || `Npcap could not open ${device.description}`);
    try {
      check(api.symbols.pcap_set_snaplen(handle, 65_535), handle, api, "set snapshot length");
      check(api.symbols.pcap_set_promisc(handle, 0), handle, api, "disable promiscuous mode");
      check(api.symbols.pcap_set_timeout(handle, 1), handle, api, "set capture timeout");
      check(api.symbols.pcap_set_buffer_size(handle, 10 * 1024 * 1024), handle, api, "set capture buffer size");
      check(api.symbols.pcap_set_immediate_mode(handle, 1), handle, api, "enable immediate mode");
      const activated = api.symbols.pcap_activate(handle);
      if (activated < 0) throw new Error(`Npcap could not activate ${device.description}: ${pcapError(api, handle)}`);
      const dataLink = api.symbols.pcap_datalink(handle);
      const program = new Uint8Array(16);
      if (api.symbols.pcap_compile(handle, program, cString(filter), 1, 0xffff_ffff) !== 0) {
        throw new Error(`Npcap rejected BPF filter "${filter}": ${pcapError(api, handle)}`);
      }
      try {
        check(api.symbols.pcap_setfilter(handle, program), handle, api, "apply BPF filter");
      } finally {
        api.symbols.pcap_freecode(program);
      }
      errorBuffer.fill(0);
      check(api.symbols.pcap_setnonblock(handle, 1, errorBuffer), handle, api, "enable nonblocking capture");
      return new LiveNpcapSession(api, handle, device, dataLink);
    } catch (error) {
      api.symbols.pcap_close(handle);
      throw error;
    }
  }

  private load(): LoadedNpcap {
    if (this.api) return this.api;
    const library = dlopen(npcapDllPath(), {
      pcap_lib_version: { args: [], returns: FFIType.cstring },
      pcap_findalldevs: { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.i32 },
      pcap_freealldevs: { args: [FFIType.ptr], returns: FFIType.void },
      pcap_create: { args: [FFIType.cstring, FFIType.ptr], returns: FFIType.ptr },
      pcap_set_snaplen: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },
      pcap_set_promisc: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },
      pcap_set_timeout: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },
      pcap_set_buffer_size: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },
      pcap_set_immediate_mode: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },
      pcap_activate: { args: [FFIType.ptr], returns: FFIType.i32 },
      pcap_datalink: { args: [FFIType.ptr], returns: FFIType.i32 },
      pcap_compile: { args: [FFIType.ptr, FFIType.ptr, FFIType.cstring, FFIType.i32, FFIType.u32], returns: FFIType.i32 },
      pcap_setfilter: { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.i32 },
      pcap_freecode: { args: [FFIType.ptr], returns: FFIType.void },
      pcap_setnonblock: { args: [FFIType.ptr, FFIType.i32, FFIType.ptr], returns: FFIType.i32 },
      pcap_next_ex: { args: [FFIType.ptr, FFIType.ptr, FFIType.ptr], returns: FFIType.i32 },
      pcap_geterr: { args: [FFIType.ptr], returns: FFIType.cstring },
      pcap_close: { args: [FFIType.ptr], returns: FFIType.void },
    });
    this.api = library as unknown as LoadedNpcap;
    return this.api;
  }
}

class LiveNpcapSession implements NpcapSession {
  private closed = false;

  constructor(
    private readonly api: LoadedNpcap,
    private readonly handle: Pointer,
    readonly device: NpcapDevice,
    readonly dataLink: number,
  ) {}

  nextPacket(): NpcapPacket | undefined {
    if (this.closed) return undefined;
    const headerPointer = new Uint8Array(8);
    const dataPointer = new Uint8Array(8);
    const result = this.api.symbols.pcap_next_ex(this.handle, headerPointer, dataPointer);
    if (result === 0) return undefined;
    if (result < 0) throw new Error(`Npcap capture failed: ${pcapError(this.api, this.handle)}`);
    const header = pointerFromBuffer(headerPointer);
    const data = pointerFromBuffer(dataPointer);
    if (!header || !data) throw new Error("Npcap returned an invalid packet pointer");
    const seconds = read.i32(header, 0);
    const microseconds = read.i32(header, 4);
    const capturedLength = read.u32(header, 8);
    const originalLength = read.u32(header, 12);
    const capturedAt = new Date(seconds * 1_000 + Math.floor(microseconds / 1_000));
    return {
      capturedAt,
      timestampTicks: BigInt(seconds) * 10_000_000n + BigInt(microseconds) * 10n,
      data: Buffer.from(new Uint8Array(toArrayBuffer(data, 0, capturedLength), 0, capturedLength)),
      originalLength,
    };
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.api.symbols.pcap_close(this.handle);
  }
}

interface NpcapSymbols {
  pcap_lib_version(): CString;
  pcap_findalldevs(result: Uint8Array, error: Uint8Array): number;
  pcap_freealldevs(devices: Pointer): void;
  pcap_create(name: Uint8Array, error: Uint8Array): Pointer | null;
  pcap_set_snaplen(handle: Pointer, value: number): number;
  pcap_set_promisc(handle: Pointer, value: number): number;
  pcap_set_timeout(handle: Pointer, value: number): number;
  pcap_set_buffer_size(handle: Pointer, value: number): number;
  pcap_set_immediate_mode(handle: Pointer, value: number): number;
  pcap_activate(handle: Pointer): number;
  pcap_datalink(handle: Pointer): number;
  pcap_compile(handle: Pointer, program: Uint8Array, filter: Uint8Array, optimize: number, netmask: number): number;
  pcap_setfilter(handle: Pointer, program: Uint8Array): number;
  pcap_freecode(program: Uint8Array): void;
  pcap_setnonblock(handle: Pointer, enabled: number, error: Uint8Array): number;
  pcap_next_ex(handle: Pointer, header: Uint8Array, data: Uint8Array): number;
  pcap_geterr(handle: Pointer): CString;
  pcap_close(handle: Pointer): void;
}

interface LoadedNpcap {
  symbols: NpcapSymbols;
}

function readAddresses(head: Pointer | null): string[] {
  const addresses: string[] = [];
  let current = head;
  while (current) {
    const socketAddress = nullablePointer(read.ptr(current, 8));
    const family = socketAddress ? read.u16(socketAddress, 0) : 0;
    if (socketAddress && family === 2) {
      addresses.push(`${read.u8(socketAddress, 4)}.${read.u8(socketAddress, 5)}.${read.u8(socketAddress, 6)}.${read.u8(socketAddress, 7)}`);
    } else if (socketAddress && family === 23) {
      const bytes = Buffer.from(Array.from({ length: 16 }, (_, index) => read.u8(socketAddress, 8 + index)));
      addresses.push(formatIpv6(bytes));
    }
    current = nullablePointer(read.ptr(current, 0));
  }
  return addresses;
}

function formatIpv6(data: Buffer): string {
  const words = Array.from({ length: 8 }, (_, index) => data.readUInt16BE(index * 2));
  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < words.length;) {
    if (words[start] !== 0) { start += 1; continue; }
    let end = start;
    while (end < words.length && words[end] === 0) end += 1;
    if (end - start > bestLength && end - start > 1) { bestStart = start; bestLength = end - start; }
    start = end;
  }
  if (bestStart < 0) return words.map((word) => word.toString(16)).join(":");
  const before = words.slice(0, bestStart).map((word) => word.toString(16)).join(":");
  const after = words.slice(bestStart + bestLength).map((word) => word.toString(16)).join(":");
  return `${before}::${after}`;
}

function pcapError(api: LoadedNpcap, handle: Pointer): string {
  return String(api.symbols.pcap_geterr(handle)) || "unknown Npcap error";
}

function check(result: number, handle: Pointer, api: LoadedNpcap, operation: string): void {
  if (result !== 0) throw new Error(`Npcap could not ${operation}: ${pcapError(api, handle)}`);
}

function cString(value: string): Uint8Array {
  return Buffer.from(`${value}\0`, "utf8");
}

function pointerFromBuffer(buffer: Uint8Array): Pointer | null {
  const value = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getBigUint64(0, true);
  return value === 0n ? null : Number(value) as Pointer;
}

function nullablePointer(value: Pointer | number | bigint | null): Pointer | null {
  if (value === null || value === 0 || value === 0n) return null;
  return Number(value) as Pointer;
}

function readCStringBuffer(buffer: Uint8Array): string {
  const end = buffer.indexOf(0);
  return new TextDecoder().decode(buffer.subarray(0, end < 0 ? buffer.length : end));
}

function npcapDllPath(): string {
  return path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "Npcap", "wpcap.dll");
}

async function isAdminOnlyInstall(): Promise<boolean> {
  try {
    const child = Bun.spawn({
      cmd: ["reg.exe", "query", "HKLM\\SYSTEM\\CurrentControlSet\\Services\\npcap\\Parameters", "/v", "AdminOnly"],
      stdout: "pipe",
      stderr: "ignore",
      windowsHide: true,
    });
    const output = await new Response(child.stdout).text();
    return await child.exited === 0 && /AdminOnly\s+REG_DWORD\s+0x1\b/i.test(output);
  } catch {
    return false;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
