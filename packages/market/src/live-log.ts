import {
  DEFAULT_STREAM_BATCH_BYTES,
  JsonlTailReader,
  LogRecordLineDecoder,
  LiveLogSessionFollower,
} from "@kar-mi/spirit-vale-tools-logging";
import type { JsonlTailReadResult, LiveLogSessionFollowerOptions, LiveLogStatus } from "@kar-mi/spirit-vale-tools-logging";
import { parseMarketEventLogData } from "./event-log.ts";
import { FishNetMarketTracker } from "./market.ts";
import type { FishNetMarketSnapshot } from "./market.ts";

export type MarketLogStatus = LiveLogStatus;
export interface MarketLogBatch {
  snapshot: FishNetMarketSnapshot;
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  changed: boolean;
  status: MarketLogStatus;
  observedAt?: string;
  path?: string;
  sessionId?: string;
}

export class MarketLogFollower {
  private readonly reader: JsonlTailReader;
  private readonly records = new LogRecordLineDecoder();
  private readonly tracker = new FishNetMarketTracker();
  private status: MarketLogStatus = "watching";
  private observedAt?: string;

  constructor(path: string) {
    this.reader = new JsonlTailReader(path, { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES });
  }

  async poll(): Promise<MarketLogBatch> { return this.consumeRead(await this.reader.read()); }

  consumeRead({ missing, reset, lines }: JsonlTailReadResult): MarketLogBatch {
    if (missing) return this.batch({ missing: true, reset: false, changed: false, invalidLines: 0 });
    if (reset) this.resetState();
    let invalidLines = 0;
    let changed = false;
    for (const line of lines) {
      const decoded = this.records.decode(line);
      if (decoded.kind === "empty" || decoded.kind === "header") continue;
      if (decoded.kind === "invalid") { invalidLines += 1; continue; }
      const record = decoded.record;
      if (record.type === "market.lifecycle") {
        const state = record.data["state"];
        if (state === "started") this.status = this.tracker.snapshot().listings.length ? "ready" : "watching";
        else if (state === "stopped") this.status = "stopped";
        else { invalidLines += 1; continue; }
        changed = true;
      } else if (record.type === "market.error") {
        this.status = "error";
        changed = true;
      } else if (record.type === "market.event") {
        const event = parseMarketEventLogData(record.data);
        if (!event) { invalidLines += 1; continue; }
        this.tracker.apply(event);
        this.status = "ready";
        this.observedAt = record.recordedAt;
        changed = true;
      }
    }
    return this.batch({ missing: false, reset, changed, invalidLines });
  }

  private resetState(): void {
    this.records.reset();
    this.tracker.reset();
    this.status = "watching";
    this.observedAt = undefined;
  }

  private batch(detail: Pick<MarketLogBatch, "missing" | "reset" | "changed" | "invalidLines">): MarketLogBatch {
    return { ...detail, snapshot: this.tracker.snapshot(), status: detail.missing ? "waiting" : this.status,
      ...(this.observedAt ? { observedAt: this.observedAt } : {}) };
  }
}

export type MarketSessionLogFollowerOptions =
  Pick<LiveLogSessionFollowerOptions<MarketLogFollower, MarketLogBatch>, "fallbackPollMs" | "debounceMs" | "persistent">;

export class MarketSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<MarketLogFollower, MarketLogBatch>;
  constructor(logDirectory?: string, options: MarketSessionLogFollowerOptions = {}) {
    this.inner = new LiveLogSessionFollower({ stream: "market", ...(logDirectory === undefined ? {} : { logDirectory }), ...options,
      readerOptions: { maxReadBytes: DEFAULT_STREAM_BATCH_BYTES }, createFollower: (path) => new MarketLogFollower(path),
      mergeSessionChange: (batch, changedSession) => ({ ...batch, reset: batch.reset || changedSession, changed: batch.changed || changedSession }),
      noStreamBatch: (reset) => ({ snapshot: { listings: [], stalls: [] }, invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" }) });
  }
  static watch(logDirectory?: string, options: MarketSessionLogFollowerOptions = {}): MarketSessionLogFollower {
    return new MarketSessionLogFollower(logDirectory, options);
  }
  poll(): Promise<MarketLogBatch> { return this.inner.poll(); }
  next(): Promise<MarketLogBatch> { return this.inner.next(); }
  [Symbol.asyncIterator](): AsyncIterator<MarketLogBatch> { return this.inner[Symbol.asyncIterator](); }
  close(): void { this.inner.close(); }
}
