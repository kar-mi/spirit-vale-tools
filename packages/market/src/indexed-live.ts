import { readCurrentLogStream } from "@kar-mi/spirit-vale-tools-logging";
import type { LiveLogStatus } from "@kar-mi/spirit-vale-tools-logging";
import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { indexMarketStream } from "./history/importer.ts";
import { MarketHistoryStore } from "./history/store.ts";

export interface MarketLogUpdate {
  revision: number; listingCount: number; changed: boolean; reset: boolean; missing: boolean;
  invalidLines: number; status: LiveLogStatus; observedAt?: string; path?: string; sessionId?: string;
}

export class IndexedMarketLogFollower {
  private readonly store: MarketHistoryStore;
  private previousRevision?: number;
  private previousStatus?: LiveLogStatus;
  constructor(private readonly model: ReadModel, private readonly sessionId: string, private readonly path: string) { this.store = new MarketHistoryStore(model); }
  async poll(): Promise<MarketLogUpdate> {
    const result = await indexMarketStream(this.model, { sessionId: this.sessionId, sourcePath: this.path });
    const state = this.store.getState(this.sessionId);
    const status = result.missing ? "waiting" : state.status;
    const changed = this.previousRevision !== state.revision || this.previousStatus !== status || result.rebuilt;
    this.previousRevision = state.revision; this.previousStatus = status;
    return { revision: state.revision, listingCount: state.listingCount, changed, reset: result.rebuilt, missing: result.missing, invalidLines: result.invalidLines, status, ...(state.observedAt ? { observedAt: state.observedAt } : {}), path: this.path, sessionId: this.sessionId };
  }
}

export class IndexedMarketSessionLogFollower {
  private sessionId?: string;
  private follower?: IndexedMarketLogFollower;
  constructor(private readonly model: ReadModel, private readonly logDirectory?: string) {}
  async poll(): Promise<MarketLogUpdate> {
    const current = await readCurrentLogStream("market", this.logDirectory);
    if (!current) {
      const reset = this.follower !== undefined; this.follower = undefined; this.sessionId = undefined;
      return { revision: 0, listingCount: 0, changed: reset, reset, missing: true, invalidLines: 0, status: "waiting" };
    }
    const changedSession = current.sessionId !== this.sessionId;
    if (changedSession) { this.sessionId = current.sessionId; this.follower = new IndexedMarketLogFollower(this.model, current.sessionId, current.path); }
    const update = await this.follower!.poll();
    return { ...update, reset: update.reset || changedSession, changed: update.changed || changedSession };
  }
}
