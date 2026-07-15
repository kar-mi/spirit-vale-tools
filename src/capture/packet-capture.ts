import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";
import path from "node:path";

import { NativeProtocolDecoder, NativeRecordType } from "./protocol.ts";
import type {
  CaptureConfig,
  CaptureTargetStatus,
  CapturedTcpPacket,
  CapturedTransportPacket,
  CapturedUdpPacket,
  CaptureState,
} from "../types.ts";

export interface NativeProcess {
  readonly stdin: {
    write(data: Uint8Array): number;
    flush(): number | Promise<number>;
    end(): number | Promise<number>;
  };
  readonly stdout: ReadableStream<Uint8Array>;
  readonly stderr: ReadableStream<Uint8Array>;
  readonly exited: Promise<number>;
  kill(signal?: number | NodeJS.Signals): void;
}

export type NativeProcessFactory = (command: string[], cwd: string) => NativeProcess;

interface Deferred {
  promise: Promise<void>;
  resolve(): void;
  reject(error: Error): void;
}

const STOP_TIMEOUT_MS = 3000;

export class PacketCapture extends EventEmitter {
  private process: NativeProcess | null = null;
  private exitTask: Promise<void> | null = null;
  private startDeferred: Deferred | null = null;
  private sawStoppedRecord = false;
  private _state: CaptureState = "stopped";

  constructor(private readonly spawnProcess: NativeProcessFactory = defaultSpawnProcess) {
    super();
  }

  get state(): CaptureState {
    return this._state;
  }

  override on(event: "started", listener: () => void): this;
  override on(event: "packet", listener: (packet: CapturedTcpPacket) => void): this;
  override on(event: "udpPacket", listener: (packet: CapturedUdpPacket) => void): this;
  override on(event: "transportPacket", listener: (packet: CapturedTransportPacket) => void): this;
  override on(event: "targetStatus", listener: (status: CaptureTargetStatus) => void): this;
  override on(event: "warning", listener: (message: string) => void): this;
  override on(event: "error", listener: (error: Error) => void): this;
  override on(event: "stopped", listener: () => void): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  async start(config: CaptureConfig = {}): Promise<void> {
    if (this._state !== "stopped") {
      throw new Error(`cannot start capture while it is ${this._state}`);
    }
    if (process.platform !== "win32") {
      throw new Error("live packet capture is supported only on Windows");
    }

    const helperPath = resolveHelperPath(config.helperPath);
    validateRuntimeFiles(helperPath);
    const protocols = config.protocols ?? ["tcp", "udp"];
    if (protocols.length === 0 || protocols.some((protocol) => protocol !== "tcp" && protocol !== "udp")) {
      throw new Error("protocols must contain tcp, udp, or both");
    }
    const filter = config.filter ?? Array.from(new Set(protocols)).join(" or ");
    const command = [helperPath, "--filter", filter];
    if (config.targetProcessName !== undefined) {
      const processName = config.targetProcessName.trim();
      if (processName.length === 0) throw new Error("targetProcessName must not be empty");
      command.push("--process-name", processName);
    }
    const spawned = this.spawnProcess(command, path.dirname(helperPath));

    this._state = "starting";
    this.process = spawned;
    this.sawStoppedRecord = false;
    this.startDeferred = createDeferred();
    const startPromise = this.startDeferred.promise;
    const stdoutTask = this.consumeStdout(spawned).catch((error: unknown) => this.handleFailure(toError(error)));
    void this.consumeStderr(spawned);
    this.exitTask = this.observeExit(spawned, stdoutTask);
    return startPromise;
  }

  async stop(): Promise<void> {
    const child = this.process;
    const exitTask = this.exitTask;
    if (!child || this._state === "stopped") return;
    if (this._state !== "stopping") {
      this._state = "stopping";
      child.stdin.write(Uint8Array.of(1));
      await child.stdin.flush();
      await child.stdin.end();
    }

    const graceful = await Promise.race([
      child.exited.then(() => true),
      Bun.sleep(STOP_TIMEOUT_MS).then(() => false),
    ]);
    if (!graceful) {
      child.kill();
      await child.exited;
    }
    await exitTask;
  }

  private async consumeStdout(child: NativeProcess): Promise<void> {
    const decoder = new NativeProtocolDecoder();
    for await (const chunk of child.stdout) {
      for (const record of decoder.push(chunk)) {
        switch (record.type) {
          case NativeRecordType.Ready:
            if (this._state !== "starting") throw new Error("capture helper sent duplicate ready record");
            this._state = "running";
            this.startDeferred?.resolve();
            this.startDeferred = null;
            this.emit("started");
            break;
          case NativeRecordType.TcpPacket:
            if (this._state === "running") {
              this.emit("packet", record.packet);
              this.emit("transportPacket", record.packet);
            }
            break;
          case NativeRecordType.UdpPacket:
            if (this._state === "running") {
              this.emit("udpPacket", record.packet);
              this.emit("transportPacket", record.packet);
            }
            break;
          case NativeRecordType.TargetStatus:
            if (this._state === "running") this.emit("targetStatus", record.status);
            break;
          case NativeRecordType.Warning:
            this.emit("warning", record.message);
            break;
          case NativeRecordType.Error:
            this.handleFailure(new Error(record.message));
            break;
          case NativeRecordType.Stopped:
            this.sawStoppedRecord = true;
            this.markStopped();
            break;
        }
      }
    }
    decoder.finish();
  }

  private async consumeStderr(child: NativeProcess): Promise<void> {
    const decoder = new TextDecoder();
    for await (const chunk of child.stderr) {
      const message = decoder.decode(chunk, { stream: true }).trim();
      if (message) console.error(message);
    }
    const tail = decoder.decode().trim();
    if (tail) console.error(tail);
  }

  private async observeExit(child: NativeProcess, stdoutTask: Promise<void>): Promise<void> {
    const exitCode = await child.exited;
    await stdoutTask;
    if (this.process !== child) return;
    if (this._state === "starting" && this.startDeferred) {
      this.handleFailure(new Error(`capture helper exited before becoming ready (exit code ${exitCode})`));
    } else if (this._state === "running" && !this.sawStoppedRecord) {
      this.handleFailure(new Error(`capture helper exited unexpectedly (exit code ${exitCode})`));
    }
    this.markStopped();
  }

  private handleFailure(error: Error): void {
    this.startDeferred?.reject(error);
    this.startDeferred = null;
    if (this.listenerCount("error") > 0) this.emit("error", error);
    else if (this._state !== "starting") console.error("[spiritvale-capture]", error);
  }

  private markStopped(): void {
    const changed = this._state !== "stopped";
    this._state = "stopped";
    this.process = null;
    this.exitTask = null;
    this.startDeferred = null;
    if (changed) this.emit("stopped");
  }
}

function defaultSpawnProcess(command: string[], cwd: string): NativeProcess {
  return Bun.spawn({
    cmd: command,
    cwd,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
    windowsHide: true,
  }) as unknown as NativeProcess;
}

export function resolveHelperPath(override?: string): string {
  const root = path.resolve(import.meta.dir, "../..");
  const candidates = [
    override,
    process.env["SPIRITVALE_CAPTURE_HELPER"],
    path.join(root, "dist", "native", "win-x64", "spiritvale-capture.exe"),
    path.join(root, "native", "capture-helper", "target", "release", "spiritvale-capture.exe"),
    path.join(root, "native", "capture-helper", "target", "debug", "spiritvale-capture.exe"),
  ].filter((candidate): candidate is string => Boolean(candidate));
  const found = candidates.find((candidate) => existsSync(candidate));
  if (found) return path.resolve(found);
  throw new Error(`capture helper was not found; checked: ${candidates.join(", ")}`);
}

function validateRuntimeFiles(helperPath: string): void {
  const directory = path.dirname(helperPath);
  for (const file of ["WinDivert.dll", "WinDivert64.sys"]) {
    const runtimePath = path.join(directory, file);
    if (!existsSync(runtimePath)) throw new Error(`missing WinDivert runtime file: ${runtimePath}`);
  }
}

function createDeferred(): Deferred {
  let resolvePromise!: () => void;
  let rejectPromise!: (error: Error) => void;
  const promise = new Promise<void>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolve: resolvePromise, reject: rejectPromise };
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}
