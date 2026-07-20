import { readFile } from "node:fs/promises";

import {
  decimal,
  isRecord as record,
  JsonlTailReader,
  LiveLogSessionFollower,
  parseLogRecord,
} from "@spiritvale/logging";
import type { LiveLogStatus } from "@spiritvale/logging";
import type { FishNetMobRewardEvent } from "./reward-tracker.ts";
import { MobRewardSession } from "./session.ts";
import type { MobRewardSessionSnapshot } from "./session.ts";

export type RewardLogStatus = LiveLogStatus;

export interface RewardLogBatch {
  snapshot: MobRewardSessionSnapshot;
  invalidLines: number;
  missing: boolean;
  reset: boolean;
  changed: boolean;
  status: RewardLogStatus;
  path?: string;
  sessionId?: string;
}

export class RewardLogFollower {
  private readonly reader: JsonlTailReader;
  private readonly session = new MobRewardSession();
  private status: RewardLogStatus = "watching";

  constructor(path: string) {
    this.reader = new JsonlTailReader(path);
  }

  async poll(): Promise<RewardLogBatch> {
    const { missing, reset, lines } = await this.reader.read();
    if (missing) return this.batch({ missing: true, reset: false, changed: false, invalidLines: 0 });
    if (reset) this.resetState();
    const consumed = this.consume(lines);
    return this.batch({ missing: false, reset, ...consumed });
  }

  private consume(lines: string[]): Pick<RewardLogBatch, "changed" | "invalidLines"> {
    let invalidLines = 0;
    let changed = false;
    for (const line of lines) {
      if (!line.trim()) continue;
      let candidate: unknown;
      try { candidate = JSON.parse(line); } catch { invalidLines += 1; continue; }
      const record = parseLogRecord(candidate);
      if (!record) { invalidLines += 1; continue; }
      if (record.type === "rewards.lifecycle") {
        const state = record.data["state"];
        if (state === "started") this.status = this.session.snapshot().kills.length > 0 ? "ready" : "watching";
        else if (state === "stopped") this.status = "stopped";
        else invalidLines += 1;
        changed = true;
        continue;
      }
      if (record.type === "rewards.error") { this.status = "error"; changed = true; continue; }
      if (record.type !== "rewards.kill" && record.type !== "rewards.unmatched") continue;
      const event = parseRewardEvent(record.data);
      if (!event) { invalidLines += 1; continue; }
      this.session.consume(event, { recordedAt: record.recordedAt });
      this.status = "ready";
      changed = true;
    }
    return { changed, invalidLines };
  }

  private resetState(): void {
    this.session.reset();
    this.status = "watching";
  }

  private batch(detail: Pick<RewardLogBatch, "missing" | "reset" | "changed" | "invalidLines">): RewardLogBatch {
    return { ...detail, snapshot: this.session.snapshot(), status: detail.missing ? "waiting" : this.status };
  }
}

export class RewardSessionLogFollower {
  private readonly inner: LiveLogSessionFollower<RewardLogFollower, RewardLogBatch>;

  constructor(logDirectory?: string) {
    this.inner = new LiveLogSessionFollower({
      stream: "rewards",
      logDirectory,
      createFollower: (path) => new RewardLogFollower(path),
      mergeSessionChange: (batch, changedSession) => ({
        ...batch,
        reset: batch.reset || changedSession,
        changed: batch.changed || changedSession,
      }),
      noStreamBatch: (reset) => ({ snapshot: emptySnapshot(), invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" }),
    });
  }

  poll(): Promise<RewardLogBatch> {
    return this.inner.poll();
  }
}

export async function loadRewardReplay(path: string): Promise<{ snapshot: MobRewardSessionSnapshot; invalidLines: number }> {
  const content = await readFile(path, "utf8");
  const session = new MobRewardSession();
  let invalidLines = 0;
  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let value: unknown;
    try { value = JSON.parse(line); } catch { invalidLines += 1; continue; }
    const record = parseLogRecord(value);
    if (!record || (record.type !== "rewards.kill" && record.type !== "rewards.unmatched")) continue;
    const event = parseRewardEvent(record.data);
    if (!event) invalidLines += 1;
    else session.consume(event, { recordedAt: record.recordedAt });
  }
  return { snapshot: session.snapshot(), invalidLines };
}

function parseRewardEvent(value: unknown): FishNetMobRewardEvent | undefined {
  if (!record(value) || typeof value["tick"] !== "number" || !Number.isSafeInteger(value["tick"])) return undefined;
  if (value["kind"] === "unmatched") {
    const reason = value["reason"];
    const reward = value["reward"];
    if ((reason !== "ambiguous" && reason !== "expired" && reason !== "unidentified") || (reward !== "experience" && reward !== "pickup")) return undefined;
    const rawDrops = value["drops"];
    if (rawDrops !== undefined && !Array.isArray(rawDrops)) return undefined;
    const drops = (rawDrops ?? []).map((drop: unknown) => parseDrop(drop));
    if (drops.some((drop: ReturnType<typeof parseDrop>) => drop === undefined)) return undefined;
    return { kind: "unmatched", tick: value["tick"], reason, reward, drops: drops as NonNullable<(typeof drops)[number]>[] };
  }
  if (value["kind"] !== "kill" || typeof value["id"] !== "string" || !record(value["mob"])
    || typeof value["experience"] !== "number" || typeof value["jobExperience"] !== "number"
    || !decimal(value["coins"]) || !Array.isArray(value["drops"])) return undefined;
  const mob = value["mob"];
  if (!Number.isSafeInteger(mob["objectId"]) || typeof mob["mobId"] !== "string" || typeof mob["displayName"] !== "string"
    || !Number.isSafeInteger(mob["level"]) || typeof mob["boss"] !== "boolean") return undefined;
  const drops = value["drops"].map((drop) => parseDrop(drop));
  if (drops.some((drop) => drop === undefined)) return undefined;
  return {
    kind: "kill",
    id: value["id"],
    tick: value["tick"],
    mob: {
      objectId: mob["objectId"] as number,
      mobId: mob["mobId"],
      displayName: mob["displayName"],
      level: mob["level"] as number,
      boss: mob["boss"],
      ...(Number.isSafeInteger(mob["rank"]) ? { rank: mob["rank"] as number } : {}),
    },
    experience: value["experience"],
    jobExperience: value["jobExperience"],
    coins: BigInt(value["coins"]),
    drops: drops as NonNullable<(typeof drops)[number]>[],
  };
}

function parseDrop(value: unknown): { category: import("./reward-decoder.ts").RewardItemCategory; itemId: string; count: number } | undefined {
  if (!record(value) || typeof value["category"] !== "string" || typeof value["itemId"] !== "string" || !Number.isSafeInteger(value["count"])) return undefined;
  const categories = new Set(["equipment", "artifact", "card", "gem", "material", "consumable", "cosmetic", "currency"]);
  if (!categories.has(value["category"])) return undefined;
  return { category: value["category"] as import("./reward-decoder.ts").RewardItemCategory, itemId: value["itemId"], count: value["count"] as number };
}

export function emptySnapshot(): MobRewardSessionSnapshot {
  return {
    kills: [], mobs: [], totalExperience: 0, totalJobExperience: 0, totalCoins: 0n, unmatched: 0, unmatchedDrops: [],
    unmatchedByReason: { ambiguous: 0, expired: 0, unidentified: 0 },
  };
}

