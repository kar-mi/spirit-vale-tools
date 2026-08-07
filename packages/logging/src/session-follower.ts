import type { JsonlTailReadResult } from "./jsonl-tail-reader.ts";
import { subscribeToLogStream } from "./stream-source.ts";
import type { LogStreamRead, LogStreamSourceOptions, LogStreamSubscription } from "./stream-source.ts";
import type { LogStream } from "./types.ts";

type WithSource<TBatch> = TBatch & { path?: string; sessionId?: string };

/** A domain follower: it can read its own file, and it can be handed lines read on its behalf. */
export interface LiveLogLineConsumer<TBatch> {
  poll(): Promise<TBatch>;
  /** Folds an already-performed read into the follower's state. */
  consumeRead(result: JsonlTailReadResult): TBatch;
}

export interface LiveLogSessionFollowerOptions<TFollower extends LiveLogLineConsumer<TBatch>, TBatch>
  extends Pick<LogStreamSourceOptions, "logDirectory" | "fallbackPollMs" | "debounceMs" | "persistent" | "readerOptions"> {
  stream: LogStream;
  createFollower: (path: string) => TFollower;
  /** Merges the "did the active session change" signal into a domain batch's own reset/changed fields. */
  mergeSessionChange: (batch: TBatch, changedSession: boolean) => TBatch;
  /** Builds the batch returned when there is no current session for this stream. */
  noStreamBatch: (reset: boolean) => TBatch;
}

/**
 * Follows whichever session the shared current-stream pointer names.
 *
 * The pointer and the session file are read once per stream by the shared source rather than once
 * per consumer, and {@link next} only settles when there is something to report — so an idle stream
 * costs a debounced watcher event and nothing else. {@link poll} remains for consumers that drive
 * their own clock.
 */
export class LiveLogSessionFollower<TFollower extends LiveLogLineConsumer<TBatch>, TBatch> {
  private sessionId?: string;
  private follower?: TFollower;
  private subscription?: LogStreamSubscription;
  private closed = false;

  constructor(private readonly options: LiveLogSessionFollowerOptions<TFollower, TBatch>) {}

  /** Drains whatever has arrived, returning an unchanged batch when nothing has. */
  async poll(): Promise<WithSource<TBatch>> {
    return this.apply(await this.source().poll());
  }

  /** Waits for the next batch that actually carries something, instead of polling for it. */
  async next(): Promise<WithSource<TBatch>> {
    return this.apply(await this.source().next());
  }

  /** Ends when {@link close} is called, so a follow loop unwinds instead of spinning on empty reads. */
  async *[Symbol.asyncIterator](): AsyncIterator<WithSource<TBatch>> {
    this.closed = false;
    while (!this.closed) {
      const read = await this.source().next();
      if (this.closed) return;
      yield this.apply(read);
    }
  }

  /** Releases this consumer's hold on the shared source, stopping it once no consumer is left. */
  close(): void {
    this.closed = true;
    this.subscription?.close();
    this.subscription = undefined;
  }

  private source(): LogStreamSubscription {
    // Subscribing lazily keeps merely constructing a follower free of watchers and timers.
    this.subscription ??= subscribeToLogStream({
      stream: this.options.stream,
      ...(this.options.logDirectory === undefined ? {} : { logDirectory: this.options.logDirectory }),
      ...(this.options.fallbackPollMs === undefined ? {} : { fallbackPollMs: this.options.fallbackPollMs }),
      ...(this.options.debounceMs === undefined ? {} : { debounceMs: this.options.debounceMs }),
      ...(this.options.persistent === undefined ? {} : { persistent: this.options.persistent }),
      ...(this.options.readerOptions === undefined ? {} : { readerOptions: this.options.readerOptions }),
    });
    return this.subscription;
  }

  private apply(read: LogStreamRead): WithSource<TBatch> {
    if (!read.current) {
      const reset = this.follower !== undefined;
      this.follower = undefined;
      this.sessionId = undefined;
      return this.options.noStreamBatch(reset) as WithSource<TBatch>;
    }
    const changedSession = read.current.sessionId !== this.sessionId;
    if (changedSession) {
      this.sessionId = read.current.sessionId;
      this.follower = this.options.createFollower(read.current.path);
    }
    const batch = this.follower!.consumeRead(read);
    const merged = this.options.mergeSessionChange(batch, changedSession);
    return { ...merged, path: read.current.path, sessionId: read.current.sessionId } as WithSource<TBatch>;
  }
}
