import { appendFile, mkdir, open, readFile, rename, stat, writeFile } from "node:fs/promises";
import type { FileHandle } from "node:fs/promises";
import { Buffer } from "node:buffer";
import path from "node:path";

import { currentStreamPointerPath, defaultLogDirectory, streamSessionPath } from "./paths.ts";
import { isMissing, isRecord } from "./predicates.ts";
import { encodeLogRecord, encodeLogStreamHeader } from "./record-codec.ts";
import type {
  CurrentLogStream,
  JsonObject,
  LogSession,
  LogStream,
  LogStreamHeader,
} from "./types.ts";
import { sanitizeCombatData } from "./combat-sanitizer.ts";

const DEFAULT_BATCH_BYTES = 256 * 1024;
const DEFAULT_FLUSH_INTERVAL_MS = 50;
const DEFAULT_MAX_BUFFERED_BYTES = 8 * 1024 * 1024;

export interface LoggerTuning {
  /** Records accumulate until a batch reaches this many bytes. Defaults to 256 KiB. */
  batchBytes?: number;
  /** A partial batch is written after this long. Defaults to 50 ms. */
  flushIntervalMs?: number;
  /** Hard cap on bytes held in memory (buffered plus queued). Defaults to 8 MiB. */
  maxBufferedBytes?: number;
}

export interface CreateLogSessionOptions extends LoggerTuning {
  producer: string;
  streams: readonly LogStream[];
  logDirectory?: string;
  outputPaths?: Partial<Record<LogStream, string>>;
  onWriteError?: (failure: LogWriteFailure) => void;
  /**
   * When false, the session's stream files are created but the shared "current stream" pointers
   * are left untouched, so followers keep reading whatever session was previously active. Use
   * {@link activateLogSession} to switch the pointers once the caller is ready to cut over.
   * Defaults to true.
   */
  activate?: boolean;
}

export interface LogWriteFailure {
  stream: LogStream;
  path: string;
  error: Error;
}

export interface JsonLinesLoggerOptions extends LoggerTuning {
  stream: LogStream;
  onWriteError?: (failure: LogWriteFailure) => void;
  /** Sink override, mainly for tests. Defaults to a lazily opened append-mode file handle. */
  append?: typeof appendFile;
}

export interface JsonLinesLoggerStats {
  /** Bytes held in memory: the partial batch plus every batch still queued for the disk. */
  bufferedBytes: number;
  queuedBatches: number;
  /** True once a write has failed; the logger keeps accepting and attempting records. */
  failed: boolean;
  /** Records refused because the byte cap was reached, or logged after close(). */
  droppedRecords: number;
}

/**
 * Buffers records into byte-bounded batches and appends them through one file handle per stream.
 *
 * Records are never dropped for a write failure: the first error is reported once and rethrown by
 * {@link flush}/{@link close}, but later batches are still attempted. The only records dropped are
 * those that would push memory past `maxBufferedBytes`; each such episode is reported once and
 * counted in {@link stats}, and the logger resumes accepting records as soon as the queue drains.
 */
export class JsonLinesLogger {
  private sequence = 0;
  private lines: string[] = [];
  private currentBytes = 0;
  private bufferedBytes = 0;
  private queuedBatches = 0;
  private droppedRecords = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private tail: Promise<void> = Promise.resolve();
  private firstFailure?: Error;
  private reportedFailure = false;
  private overflowing = false;
  private closed = false;
  private headerWritten = false;
  private handle?: Promise<FileHandle>;
  private readonly batchBytes: number;
  private readonly flushIntervalMs: number;
  private readonly maxBufferedBytes: number;

  constructor(
    readonly path: string,
    private readonly sessionId: string,
    private readonly source: string,
    private readonly options: JsonLinesLoggerOptions = { stream: "other" },
  ) {
    this.batchBytes = options.batchBytes ?? DEFAULT_BATCH_BYTES;
    this.flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
    this.maxBufferedBytes = options.maxBufferedBytes ?? DEFAULT_MAX_BUFFERED_BYTES;
  }

  log(type: string, data: JsonObject): void {
    const safeData = this.options.stream === "combat" ? sanitizeCombatData(type, data) : data;
    if (!safeData) return;
    if (this.closed) {
      this.droppedRecords += 1;
      return;
    }
    this.ensureHeader();
    const line = `${encodeLogRecord(++this.sequence, Date.now(), type, safeData)}\n`;
    const bytes = Buffer.byteLength(line);
    if (this.bufferedBytes + bytes > this.maxBufferedBytes) {
      this.droppedRecords += 1;
      if (!this.overflowing) {
        this.overflowing = true;
        this.notify(new Error(`log buffer exceeded ${this.maxBufferedBytes} bytes; records are being dropped`));
      }
      return;
    }
    this.overflowing = false;
    this.lines.push(line);
    this.currentBytes += bytes;
    this.bufferedBytes += bytes;
    if (this.currentBytes >= this.batchBytes) this.enqueueCurrent();
    else this.scheduleFlush();
  }

  /** Resolves once every record logged before this call has reached the disk. */
  async flush(): Promise<void> {
    this.enqueueCurrent();
    await this.tail;
    if (this.firstFailure) throw this.firstFailure;
  }

  async close(): Promise<void> {
    if (this.closed) {
      await this.tail;
      if (this.firstFailure) throw this.firstFailure;
      return;
    }
    this.closed = true;
    this.enqueueCurrent();
    await this.tail;
    const handle = this.handle;
    this.handle = undefined;
    if (handle) await handle.then((open) => open.close(), () => undefined);
    if (this.firstFailure) throw this.firstFailure;
  }

  stats(): JsonLinesLoggerStats {
    return {
      bufferedBytes: this.bufferedBytes,
      queuedBatches: this.queuedBatches,
      failed: this.firstFailure !== undefined,
      droppedRecords: this.droppedRecords,
    };
  }

  /**
   * Emits the stream header ahead of the first record.
   *
   * Written here rather than by whoever created the file so that every stream file is
   * self-describing however it was produced — including a bare `--output name.jsonl` from the CLI.
   * Sessions have no metadata file of their own; v2 records carry no session id or producer either,
   * so without this line a stream read in isolation would have no provenance at all.
   */
  private ensureHeader(): void {
    if (this.headerWritten) return;
    this.headerWritten = true;
    const header: LogStreamHeader = {
      schemaVersion: 2,
      stream: this.options.stream,
      sessionId: this.sessionId,
      producer: this.source,
      startedAt: new Date().toISOString(),
    };
    const line = `${encodeLogStreamHeader(header)}\n`;
    const bytes = Buffer.byteLength(line);
    this.lines.push(line);
    this.currentBytes += bytes;
    this.bufferedBytes += bytes;
  }

  private scheduleFlush(): void {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.enqueueCurrent();
    }, this.flushIntervalMs);
  }

  private enqueueCurrent(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.lines.length === 0) return;
    const text = this.lines.join("");
    const bytes = this.currentBytes;
    this.lines = [];
    this.currentBytes = 0;
    this.queuedBatches += 1;
    // The catch keeps the chain resolved so ordering holds and later batches are still attempted.
    this.tail = this.tail
      .then(() => this.write(text))
      .catch((error: unknown) => {
        const failure = toError(error);
        this.firstFailure ??= failure;
        if (!this.reportedFailure) {
          this.reportedFailure = true;
          this.notify(failure);
        }
      })
      .finally(() => {
        this.bufferedBytes = Math.max(0, this.bufferedBytes - bytes);
        this.queuedBatches = Math.max(0, this.queuedBatches - 1);
      });
  }

  private async write(text: string): Promise<void> {
    if (this.options.append) {
      await this.options.append(this.path, text, "utf8");
      return;
    }
    this.handle ??= open(this.path, "a");
    let handle: FileHandle;
    try {
      handle = await this.handle;
    } catch (error) {
      this.handle = undefined; // Let the next batch retry rather than reusing a rejected promise.
      throw error;
    }
    await handle.appendFile(text, "utf8");
  }

  private notify(error: Error): void {
    try {
      this.options.onWriteError?.({ stream: this.options.stream, path: this.path, error });
    } catch {
      // A reporting callback must not poison the write queue.
    }
  }
}

/**
 * Creates a directory, tolerating one that is already there.
 *
 * `fs.mkdir` with `recursive: true` is specified not to fail on an existing directory, but Bun on
 * Windows breaks that for exactly the relative forms a bare `--output name.jsonl` produces: `"."`
 * raises EEXIST and `"./"` raises ENOENT. Probing first keeps those paths working; EEXIST is still
 * swallowed afterwards so a directory created concurrently is not treated as a failure.
 */
async function ensureDirectory(directory: string): Promise<void> {
  try {
    if ((await stat(directory)).isDirectory()) return;
  } catch {
    // Nothing there yet (or unreadable) - fall through and let mkdir report the real problem.
  }
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
}

export async function createLogSession(options: CreateLogSessionOptions): Promise<LogSession> {
  const logDirectory = options.logDirectory ?? defaultLogDirectory();
  const id = createSessionId();
  const createdAt = new Date().toISOString();
  const streams = [...new Set(options.streams)];
  if (streams.length === 0) throw new Error("a log session requires at least one stream");

  const activate = options.activate ?? true;
  const loggers = new Map<LogStream, JsonLinesLogger>();
  for (const stream of streams) {
    const override = options.outputPaths?.[stream];
    const streamPath = override ?? streamSessionPath(stream, id, logDirectory);
    await ensureDirectory(path.dirname(streamPath));
    // Created empty; the logger writes the stream header ahead of its first record.
    await writeFile(streamPath, "", override ? undefined : { flag: "wx" });
    loggers.set(stream, new JsonLinesLogger(streamPath, id, options.producer, {
      stream,
      onWriteError: options.onWriteError,
      ...tuning(options),
    }));
    if (!override && activate) {
      const pointer: CurrentLogStream = {
        schemaVersion: 1,
        stream,
        sessionId: id,
        startedAt: createdAt,
        relativePath: path.relative(logDirectory, streamPath),
      };
      await writeAtomicJson(currentStreamPointerPath(stream, logDirectory), pointer);
    }
  }

  return {
    id,
    logger(stream) {
      const logger = loggers.get(stream);
      if (!logger) throw new Error(`stream ${stream} is not part of session ${id}`);
      return logger;
    },
    async flush() {
      await settleAll([...loggers.values()].map((logger) => logger.flush()));
    },
    async close() {
      await settleAll([...loggers.values()].map((logger) => logger.close()));
    },
  };
}

/** Writes a single stream's "current" pointer verbatim, e.g. to roll a stream back to a known-good pointer. */
export async function writeCurrentLogStreamPointer(
  pointer: CurrentLogStream,
  logDirectory = defaultLogDirectory(),
): Promise<void> {
  await writeAtomicJson(currentStreamPointerPath(pointer.stream, logDirectory), pointer);
}

/**
 * Switches the shared "current stream" pointers for the given streams onto an already-created,
 * not-yet-activated session (see {@link CreateLogSessionOptions.activate}). Callers that need
 * several streams to change over as one logical moment should await this once. The session is
 * flushed first, so a follower that picks up a new pointer immediately sees the records already
 * written to that session. Streams are switched one at a time (there is no cross-file
 * transaction), so a caller that must not leave streams split across sessions should capture each
 * stream's prior pointer first and roll back to it if this throws partway through.
 */
export async function activateLogSession(
  session: Pick<LogSession, "id"> & Partial<Pick<LogSession, "flush">>,
  streams: readonly LogStream[],
  logDirectory = defaultLogDirectory(),
): Promise<void> {
  await session.flush?.();
  const startedAt = new Date().toISOString();
  for (const stream of streams) {
    const streamPath = streamSessionPath(stream, session.id, logDirectory);
    const pointer: CurrentLogStream = {
      schemaVersion: 1,
      stream,
      sessionId: session.id,
      startedAt,
      relativePath: path.relative(logDirectory, streamPath),
    };
    await writeCurrentLogStreamPointer(pointer, logDirectory);
  }
}

export async function readCurrentLogStream(
  stream: LogStream,
  logDirectory = defaultLogDirectory(),
): Promise<(CurrentLogStream & { path: string }) | undefined> {
  let value: unknown;
  try {
    value = JSON.parse(await readFile(currentStreamPointerPath(stream, logDirectory), "utf8"));
  } catch (error) {
    if (isMissing(error) || error instanceof SyntaxError) return undefined;
    throw error;
  }
  if (!isRecord(value) || value["schemaVersion"] !== 1 || value["stream"] !== stream
    || !isNonEmptyString(value["sessionId"]) || !isIsoDate(value["startedAt"])
    || !isNonEmptyString(value["relativePath"])) return undefined;
  const resolved = path.resolve(logDirectory, value["relativePath"]);
  const root = `${path.resolve(logDirectory)}${path.sep}`;
  if (!resolved.startsWith(root)) return undefined;
  return { ...(value as unknown as CurrentLogStream), path: resolved };
}

function tuning(options: LoggerTuning): LoggerTuning {
  return {
    ...(options.batchBytes === undefined ? {} : { batchBytes: options.batchBytes }),
    ...(options.flushIntervalMs === undefined ? {} : { flushIntervalMs: options.flushIntervalMs }),
    ...(options.maxBufferedBytes === undefined ? {} : { maxBufferedBytes: options.maxBufferedBytes }),
  };
}

/** Awaits every stream even when one rejects, then rethrows the first rejection. */
async function settleAll(operations: readonly Promise<void>[]): Promise<void> {
  const results = await Promise.allSettled(operations);
  const rejected = results.find((result): result is PromiseRejectedResult => result.status === "rejected");
  if (rejected) throw toError(rejected.reason);
}

function createSessionId(): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "").replace("Z", "Z");
  return `${timestamp}-${crypto.randomUUID().slice(0, 8)}`;
}

async function writeAtomicJson(target: string, value: unknown): Promise<void> {
  await ensureDirectory(path.dirname(target));
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isIsoDate(value: unknown): value is string {
  return isNonEmptyString(value) && Number.isFinite(Date.parse(value));
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
