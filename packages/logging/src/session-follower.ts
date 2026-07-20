import { defaultLogDirectory } from "./paths.ts";
import { readCurrentLogStream } from "./logger.ts";
import type { LogStream } from "./types.ts";

type WithSource<TBatch> = TBatch & { path?: string; sessionId?: string };

export interface LiveLogSessionFollowerOptions<TFollower extends { poll(): Promise<TBatch> }, TBatch> {
  stream: LogStream;
  logDirectory?: string;
  createFollower: (path: string) => TFollower;
  /** Merges the "did the active session change" signal into a domain batch's own reset/changed fields. */
  mergeSessionChange: (batch: TBatch, changedSession: boolean) => TBatch;
  /** Builds the batch returned when there is no current session for this stream. */
  noStreamBatch: (reset: boolean) => TBatch;
}

/** Watches the shared current-stream pointer and recreates the inner follower whenever the active session changes. */
export class LiveLogSessionFollower<TFollower extends { poll(): Promise<TBatch> }, TBatch> {
  private sessionId?: string;
  private follower?: TFollower;
  private readonly logDirectory: string;

  constructor(private readonly options: LiveLogSessionFollowerOptions<TFollower, TBatch>) {
    this.logDirectory = options.logDirectory ?? defaultLogDirectory();
  }

  async poll(): Promise<WithSource<TBatch>> {
    const current = await readCurrentLogStream(this.options.stream, this.logDirectory);
    if (!current) {
      const reset = this.follower !== undefined;
      this.follower = undefined;
      this.sessionId = undefined;
      return this.options.noStreamBatch(reset) as WithSource<TBatch>;
    }
    const changedSession = current.sessionId !== this.sessionId;
    if (changedSession) {
      this.sessionId = current.sessionId;
      this.follower = this.options.createFollower(current.path);
    }
    const batch = await this.follower!.poll();
    const merged = this.options.mergeSessionChange(batch, changedSession);
    return { ...merged, path: current.path, sessionId: current.sessionId } as WithSource<TBatch>;
  }
}
