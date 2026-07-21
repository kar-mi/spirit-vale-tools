import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { currentStreamPointerPath, defaultLogDirectory, sessionDirectory, sessionStreamPath } from "./paths.ts";
import { isMissing, isRecord } from "./predicates.ts";
import type {
  CurrentLogStream,
  JsonObject,
  LogRecord,
  LogSession,
  LogSessionMetadata,
  LogStream,
} from "./types.ts";
import { sanitizeCombatData } from "./combat-sanitizer.ts";

export interface CreateLogSessionOptions {
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

interface JsonLinesLoggerOptions {
  stream: LogStream;
  onWriteError?: (failure: LogWriteFailure) => void;
  append?: typeof appendFile;
}

export class JsonLinesLogger {
  private sequence = 0;
  private pending: Promise<void> = Promise.resolve();
  private firstFailure?: Error;
  private readonly append: typeof appendFile;

  constructor(
    readonly path: string,
    private readonly sessionId: string,
    private readonly source: string,
    private readonly options: JsonLinesLoggerOptions = { stream: "other" },
  ) {
    this.append = options.append ?? appendFile;
  }

  log(type: string, data: JsonObject): void {
    const safeData = this.options.stream === "combat" ? sanitizeCombatData(type, data) : data;
    if (!safeData) return;
    const record: LogRecord = {
      schemaVersion: 1,
      sessionId: this.sessionId,
      sequence: ++this.sequence,
      recordedAt: new Date().toISOString(),
      source: this.source,
      type,
      data: safeData,
    };
    const line = `${JSON.stringify(record)}\n`;
    this.pending = this.pending
      .then(() => this.append(this.path, line, "utf8"))
      .catch((error: unknown) => {
        const failure = toError(error);
        this.firstFailure ??= failure;
        try {
          this.options.onWriteError?.({ stream: this.options.stream, path: this.path, error: failure });
        } catch {
          // A reporting callback must not poison the append queue.
        }
      });
  }

  async close(): Promise<void> {
    await this.pending;
    if (this.firstFailure) throw this.firstFailure;
  }
}

export async function createLogSession(options: CreateLogSessionOptions): Promise<LogSession> {
  const logDirectory = options.logDirectory ?? defaultLogDirectory();
  const id = createSessionId();
  const directory = sessionDirectory(id, logDirectory);
  const createdAt = new Date().toISOString();
  const streams = [...new Set(options.streams)];
  if (streams.length === 0) throw new Error("a log session requires at least one stream");
  await mkdir(directory, { recursive: true });
  const metadata: LogSessionMetadata = { schemaVersion: 1, sessionId: id, producer: options.producer, createdAt, streams };
  await writeFile(path.join(directory, "session.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");

  const activate = options.activate ?? true;
  const loggers = new Map<LogStream, JsonLinesLogger>();
  for (const stream of streams) {
    const override = options.outputPaths?.[stream];
    const streamPath = override ?? sessionStreamPath(id, stream, logDirectory);
    await mkdir(path.dirname(streamPath), { recursive: true });
    await writeFile(streamPath, "", override ? undefined : { flag: "wx" });
    loggers.set(stream, new JsonLinesLogger(streamPath, id, options.producer, {
      stream,
      onWriteError: options.onWriteError,
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
    directory,
    logger(stream) {
      const logger = loggers.get(stream);
      if (!logger) throw new Error(`stream ${stream} is not part of session ${id}`);
      return logger;
    },
    async close() {
      await Promise.all([...loggers.values()].map((logger) => logger.close()));
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
 * several streams to change over as one logical moment should await this once. Streams are
 * switched one at a time (there is no cross-file transaction), so a caller that must not leave
 * streams split across sessions should capture each stream's prior pointer first and roll back
 * to it if this throws partway through.
 */
export async function activateLogSession(
  session: Pick<LogSession, "id">,
  streams: readonly LogStream[],
  logDirectory = defaultLogDirectory(),
): Promise<void> {
  const startedAt = new Date().toISOString();
  for (const stream of streams) {
    const streamPath = sessionStreamPath(session.id, stream, logDirectory);
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

export function parseLogRecord(value: unknown): LogRecord | undefined {
  if (!isRecord(value) || value["schemaVersion"] !== 1) return undefined;
  if (!isNonEmptyString(value["sessionId"]) || !Number.isSafeInteger(value["sequence"]) || (value["sequence"] as number) < 1) return undefined;
  if (!isIsoDate(value["recordedAt"]) || !isNonEmptyString(value["source"]) || !isNonEmptyString(value["type"])) return undefined;
  if (!isRecord(value["data"])) return undefined;
  return value as unknown as LogRecord;
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

function createSessionId(): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "").replace("Z", "Z");
  return `${timestamp}-${crypto.randomUUID().slice(0, 8)}`;
}

async function writeAtomicJson(target: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
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
