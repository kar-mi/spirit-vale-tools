import { watch } from "node:fs";
import type { FSWatcher } from "node:fs";
import path from "node:path";

import { JsonlTailReader } from "./jsonl-tail-reader.ts";
import type { JsonlTailReadResult, JsonlTailReaderOptions } from "./jsonl-tail-reader.ts";
import { readCurrentLogStream } from "./logger.ts";
import { currentStreamPointerPath, defaultLogDirectory } from "./paths.ts";
import { isMissing } from "./predicates.ts";
import type { LogStream } from "./types.ts";

/** Quiet period a burst of watcher events is collapsed into before the file is drained. */
export const DEFAULT_STREAM_DEBOUNCE_MS = 20;
/** Longest the source goes without a stat even when no watcher event arrives. */
export const DEFAULT_STREAM_FALLBACK_POLL_MS = 1_000;
/** Most bytes a live follower takes from disk in one drain, matching the read model's indexing batch. */
export const DEFAULT_STREAM_BATCH_BYTES = 1024 * 1024;

export interface LogStreamSourceOptions {
  stream: LogStream;
  logDirectory?: string;
  fallbackPollMs?: number;
  debounceMs?: number;
  /** Whether the watchers and fallback timer hold the process open even while nothing is waiting on them. */
  persistent?: boolean;
  /** Applied to the shared reader. Only the first subscriber of a stream gets to set these. */
  readerOptions?: Pick<JsonlTailReaderOptions, "createDecoder" | "maxReadBytes">;
}

export interface LogStreamRead extends JsonlTailReadResult {
  /** The session named by the current-stream pointer, or undefined while no session is active. */
  current?: { path: string; sessionId: string };
  /** Whether {@link current} differs from the one this subscriber last saw. */
  changedSession: boolean;
  /** Whether the read stopped at its byte cap with more bytes already on disk. */
  capped: boolean;
}

export interface LogStreamSubscription extends AsyncIterable<LogStreamRead> {
  /** Drains now and returns whatever has accumulated, empty batch included. */
  poll(): Promise<LogStreamRead>;
  /** Resolves only once there is something to report, so an idle stream costs nothing. */
  next(): Promise<LogStreamRead>;
  close(): void;
}

/** The single tail of one log stream, shared by every consumer of it. */
class LogStreamSource {
  private readonly stream: LogStream;
  private readonly logDirectory: string;
  private readonly pointerPath: string;
  private readonly fallbackPollMs: number;
  private readonly debounceMs: number;
  private readonly persistent: boolean;
  private readonly readerOptions: Pick<JsonlTailReaderOptions, "createDecoder" | "maxReadBytes">;

  private readonly subscribers = new Set<Subscriber>();
  private current?: { path: string; sessionId: string };
  private reader?: JsonlTailReader;
  private pointerLoaded = false;
  private pointerDirty = true;

  private pointerWatcher?: FSWatcher;
  private fileWatcher?: FSWatcher;
  private debounceTimer?: ReturnType<typeof setTimeout>;
  private fallbackTimer?: ReturnType<typeof setInterval>;
  private draining?: Promise<void>;
  private waiting = 0;
  private closed = false;

  constructor(options: LogStreamSourceOptions) {
    this.stream = options.stream;
    this.logDirectory = options.logDirectory ?? defaultLogDirectory();
    this.pointerPath = currentStreamPointerPath(this.stream, this.logDirectory);
    this.fallbackPollMs = options.fallbackPollMs ?? DEFAULT_STREAM_FALLBACK_POLL_MS;
    this.debounceMs = options.debounceMs ?? DEFAULT_STREAM_DEBOUNCE_MS;
    this.persistent = options.persistent ?? false;
    this.readerOptions = options.readerOptions ?? {};
  }

  subscribe(): LogStreamSubscription {
    const subscriber = new Subscriber(this);
    // A subscriber that joins an already-running source is behind the shared reader, so it replays the bytes already consumed before it starts taking live ones.
    subscriber.catchUpFrom = this.reader === undefined ? undefined : this.reader.bytePosition;
    this.subscribers.add(subscriber);
    this.start();
    return subscriber;
  }

  release(subscriber: Subscriber): void {
    if (!this.subscribers.delete(subscriber)) return;
    if (this.subscribers.size === 0) this.dispose();
  }

  /** Runs a drain, joining one already in flight rather than starting a second. */
  async drain(): Promise<void> {
    this.draining ??= this.runDrain().finally(() => {
      this.draining = undefined;
    });
    await this.draining;
  }

  /** Drains with a guaranteed fresh pointer read. */
  async forceDrain(): Promise<void> {
    this.pointerDirty = true;
    await this.drain();
    if (this.pointerDirty) await this.drain();
  }

  private start(): void {
    if (this.closed || this.fallbackTimer) return;
    this.ensurePointerWatcher();
    // fs.watch is advisory and can miss the atomic rename used to replace a stream pointer, especially on Windows.
    this.fallbackTimer = this.hold(setInterval(() => void this.forceDrain(), this.fallbackPollMs));
  }

  private hold<T extends { unref?: () => void }>(timer: T): T {
    if (!this.persistent && this.waiting === 0) timer.unref?.();
    return timer;
  }

  /** Keeps the event loop alive while a subscriber is parked in `next()`. */
  awaitingChanged(delta: number): void {
    this.waiting += delta;
    if (this.persistent || !this.fallbackTimer) return;
    if (this.waiting > 0) this.fallbackTimer.ref?.();
    else if (this.waiting === 0) this.fallbackTimer.unref?.();
  }

  private dispose(): void {
    this.closed = true;
    releaseSource(this);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.fallbackTimer = undefined;
    this.debounceTimer = undefined;
    this.pointerWatcher?.close();
    this.fileWatcher?.close();
    this.pointerWatcher = undefined;
    this.fileWatcher = undefined;
  }

  private schedule(): void {
    if (this.closed || this.debounceTimer) return;
    this.debounceTimer = this.hold(setTimeout(() => {
      this.debounceTimer = undefined;
      void this.drain();
    }, this.debounceMs));
  }

  private async runDrain(): Promise<void> {
    if (this.closed) return;
    const changedSession = await this.syncPointer();
    if (!this.reader) {
      if (changedSession) {
        this.publish({ missing: true, reset: false, lines: [], size: 0, bytesRead: 0, changedSession, capped: false });
      }
      return;
    }
    const result = await this.reader.read();
    const capped = result.bytesRead > 0 && this.reader.bytePosition < result.size;
    if (!changedSession && !result.reset && !result.missing && result.lines.length === 0) return;
    this.publish({ ...result, changedSession, capped, ...(this.current ? { current: this.current } : {}) });
    // A read that stopped at its cap leaves a backlog on disk; keep draining rather than waiting for the next append, which for a finished session would never come.
    if (capped) this.schedule();
  }

  private async syncPointer(): Promise<boolean> {
    if (this.pointerLoaded && !this.pointerDirty) return false;
    this.pointerDirty = false;
    this.pointerLoaded = true;
    const pointer = await readCurrentLogStream(this.stream, this.logDirectory);
    if (!pointer) {
      if (!this.current) return false;
      this.current = undefined;
      this.reader = undefined;
      this.fileWatcher?.close();
      this.fileWatcher = undefined;
      return true;
    }
    if (pointer.sessionId === this.current?.sessionId) return false;
    this.current = { path: pointer.path, sessionId: pointer.sessionId };
    this.reader = new JsonlTailReader(pointer.path, this.readerOptions);
    for (const subscriber of this.subscribers) subscriber.catchUpFrom = undefined;
    this.watchActiveFile(pointer.path);
    return true;
  }

  private publish(read: LogStreamRead): void {
    for (const subscriber of this.subscribers) subscriber.push(read);
  }

  private ensurePointerWatcher(): void {
    if (this.pointerWatcher || this.closed) return;
    // The pointer file is rewritten by rename, which destroys any watch held on the file itself, so the watch goes on its directory instead.
    const directory = path.dirname(this.pointerPath);
    const name = path.basename(this.pointerPath);
    this.pointerWatcher = this.tryWatch(directory, (filename) => {
      if (filename === null || filename === name) {
        this.pointerDirty = true;
        this.schedule();
      }
    });
  }

  private watchActiveFile(activePath: string): void {
    this.fileWatcher?.close();
    this.fileWatcher = this.tryWatch(activePath, () => this.schedule());
  }

  private tryWatch(target: string, onEvent: (filename: string | null) => void): FSWatcher | undefined {
    let watcher: FSWatcher;
    try {
      watcher = watch(target, { persistent: this.persistent }, (_event, filename) => {
        onEvent(typeof filename === "string" ? filename : null);
      });
    } catch (error) {
      if (isMissing(error)) return undefined;
      throw error;
    }
    watcher.on("error", () => watcher.close());
    return watcher;
  }

  /** Replays the bytes a late subscriber missed, stopping exactly at the shared reader's position so the two are byte-identical before it starts taking live reads. */
  async catchUp(subscriber: Subscriber): Promise<LogStreamRead[]> {
    const target = subscriber.catchUpFrom;
    if (target === undefined || !this.current) return [];
    const reader = new JsonlTailReader(this.current.path, this.readerOptions);
    const reads: LogStreamRead[] = [];
    while (reader.bytePosition < target) {
      const result = await reader.read(target - reader.bytePosition);
      if (result.missing || result.bytesRead === 0) break;
      reads.push({ ...result, changedSession: false, capped: false, current: this.current });
    }
    subscriber.catchUpFrom = undefined;
    if (reads.length > 0) reads[0]!.changedSession = true;
    return reads;
  }

  /** The current state with no lines attached, for a caller that asked and found nothing waiting. */
  emptyRead(): LogStreamRead {
    return {
      missing: this.current === undefined,
      reset: false,
      lines: [],
      size: this.reader?.offset ?? 0,
      bytesRead: 0,
      changedSession: false,
      capped: false,
      ...(this.current ? { current: this.current } : {}),
    };
  }

  /** True once the pointer has been read at least once; until then even `next()` owes a first drain. */
  get loaded(): boolean {
    return this.pointerLoaded;
  }
}

class Subscriber implements LogStreamSubscription {
  /** Shared-reader position this subscriber still has to replay, or undefined once it is level. */
  catchUpFrom?: number;
  private replayQueue: LogStreamRead[] = [];
  private pending?: LogStreamRead;
  private waiter?: (read: LogStreamRead) => void;
  private closed = false;

  constructor(private readonly source: LogStreamSource) {}

  push(read: LogStreamRead): void {
    if (this.closed) return;
    this.pending = this.pending ? mergeReads(this.pending, read) : read;
    const waiter = this.waiter;
    if (!waiter) return;
    this.waiter = undefined;
    waiter(this.take()!);
  }

  async poll(): Promise<LogStreamRead> {
    if (this.closed) return this.source.emptyRead();
    const replayed = await this.replay();
    if (replayed) return replayed;
    await this.source.forceDrain();
    return this.take() ?? this.source.emptyRead();
  }

  async next(): Promise<LogStreamRead> {
    if (this.closed) return this.source.emptyRead();
    const replayed = await this.replay();
    if (replayed) return replayed;
    if (!this.source.loaded) await this.source.drain();
    const taken = this.take();
    if (taken) return taken;
    this.source.awaitingChanged(1);
    try {
      return await new Promise<LogStreamRead>((resolve) => {
        this.waiter = resolve;
      });
    } finally {
      this.source.awaitingChanged(-1);
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<LogStreamRead> {
    while (!this.closed) yield await this.next();
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.waiter?.(this.source.emptyRead());
    this.waiter = undefined;
    this.source.release(this);
  }

  /** Drains the queued catch-up reads one at a time, so a large backlog stays bounded per call. */
  private async replay(): Promise<LogStreamRead | undefined> {
    if (this.catchUpFrom === undefined) return undefined;
    if (this.replayQueue.length === 0) this.replayQueue = await this.source.catchUp(this);
    return this.replayQueue.shift();
  }

  private take(): LogStreamRead | undefined {
    const pending = this.pending;
    this.pending = undefined;
    return pending;
  }
}

/** Folds a read into one a subscriber has not taken yet. */
function mergeReads(previous: LogStreamRead, next: LogStreamRead): LogStreamRead {
  const changedSession = previous.changedSession || next.changedSession;
  if (next.reset) return { ...next, changedSession };
  return {
    ...next,
    lines: previous.lines.concat(next.lines),
    reset: previous.reset,
    changedSession,
    bytesRead: previous.bytesRead + next.bytesRead,
  };
}

const sources = new Map<string, LogStreamSource>();
const keys = new WeakMap<LogStreamSource, string>();

/** Subscribes to the shared tail of a stream, creating it on first use. */
export function subscribeToLogStream(options: LogStreamSourceOptions): LogStreamSubscription {
  const key = `${options.logDirectory ?? defaultLogDirectory()} ${options.stream}`;
  let source = sources.get(key);
  if (!source) {
    source = new LogStreamSource(options);
    sources.set(key, source);
    keys.set(source, key);
  }
  return source.subscribe();
}

function releaseSource(source: LogStreamSource): void {
  const key = keys.get(source);
  if (key !== undefined && sources.get(key) === source) sources.delete(key);
}
