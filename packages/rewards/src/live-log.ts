import { open, readFile, stat } from "node:fs/promises";

import { defaultLogDirectory, parseLogRecord, readCurrentLogStream } from "@spiritvale/logging";
import type { FishNetMobRewardEvent } from "./reward-tracker.ts";
import { MobRewardSession } from "./session.ts";
import type { MobRewardSessionSnapshot } from "./session.ts";

export type RewardLogStatus = "waiting" | "watching" | "ready" | "stopped" | "error";

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
  private offset = 0;
  private pending = "";
  private decoder = new TextDecoder();
  private readonly session = new MobRewardSession();
  private status: RewardLogStatus = "watching";

  constructor(private readonly path: string) {}

  async poll(): Promise<RewardLogBatch> {
    let size: number;
    try {
      size = (await stat(this.path)).size;
    } catch (error) {
      if (isMissing(error)) return this.batch({ missing: true, reset: false, changed: false, invalidLines: 0 });
      throw error;
    }
    const reset = size < this.offset;
    if (reset) this.reset();
    if (size === this.offset) return this.batch({ missing: false, reset, changed: false, invalidLines: 0 });
    const bytes = Buffer.allocUnsafe(size - this.offset);
    const file = await open(this.path, "r");
    try {
      const { bytesRead } = await file.read(bytes, 0, bytes.length, this.offset);
      this.offset += bytesRead;
      const consumed = this.consume(bytes.subarray(0, bytesRead));
      return this.batch({ missing: false, reset, ...consumed });
    } finally {
      await file.close();
    }
  }

  private consume(bytes: Uint8Array): Pick<RewardLogBatch, "changed" | "invalidLines"> {
    this.pending += this.decoder.decode(bytes, { stream: true });
    const lines = this.pending.split(/\r?\n/);
    this.pending = lines.pop() ?? "";
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

  private reset(): void {
    this.offset = 0;
    this.pending = "";
    this.decoder = new TextDecoder();
    this.session.reset();
    this.status = "watching";
  }

  private batch(detail: Pick<RewardLogBatch, "missing" | "reset" | "changed" | "invalidLines">): RewardLogBatch {
    return { ...detail, snapshot: this.session.snapshot(), status: detail.missing ? "waiting" : this.status };
  }
}

export class RewardSessionLogFollower {
  private sessionId?: string;
  private follower?: RewardLogFollower;

  constructor(private readonly logDirectory = defaultLogDirectory()) {}

  async poll(): Promise<RewardLogBatch> {
    const current = await readCurrentLogStream("rewards", this.logDirectory);
    if (!current) {
      const reset = this.follower !== undefined;
      this.follower = undefined;
      this.sessionId = undefined;
      return { snapshot: emptySnapshot(), invalidLines: 0, missing: true, reset, changed: reset, status: "waiting" };
    }
    const changedSession = current.sessionId !== this.sessionId;
    if (changedSession) {
      this.sessionId = current.sessionId;
      this.follower = new RewardLogFollower(current.path);
    }
    const batch = await this.follower!.poll();
    return { ...batch, reset: batch.reset || changedSession, changed: batch.changed || changedSession, path: current.path, sessionId: current.sessionId };
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

function emptySnapshot(): MobRewardSessionSnapshot {
  return {
    kills: [], mobs: [], totalExperience: 0, totalJobExperience: 0, totalCoins: 0n, unmatched: 0, unmatchedDrops: [],
    unmatchedByReason: { ambiguous: 0, expired: 0, unidentified: 0 },
  };
}

function decimal(value: unknown): value is string { return typeof value === "string" && /^-?\d+$/.test(value); }
function record(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isMissing(error: unknown): boolean { return record(error) && error["code"] === "ENOENT"; }
