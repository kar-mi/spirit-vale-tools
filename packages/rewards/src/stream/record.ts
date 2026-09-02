import {
  decimal,
  isRecord as record,
  LogRecordLineDecoder,
} from "@kar-mi/spirit-vale-tools-logging";
import type { FishNetMobRewardEvent } from "../tracking/reward-tracker.ts";
import type { RewardItemCategory } from "../tracking/reward-decoder.ts";

export type RewardStreamEntry =
  | { kind: "lifecycle"; state: "started" | "stopped" | undefined }
  | { kind: "error" }
  | { kind: "reward"; event: FishNetMobRewardEvent; recordedAt: string };

export interface DecodedRewardLines {
  entries: RewardStreamEntry[];
  invalidLines: number;
}

/** Decodes complete JSONL lines into the domain records used by live reward projections. */
export function decodeRewardLines(decoder: LogRecordLineDecoder, lines: readonly string[]): DecodedRewardLines {
  const entries: RewardStreamEntry[] = [];
  let invalidLines = 0;

  for (const line of lines) {
    const decoded = decoder.decode(line);
    if (decoded.kind === "empty" || decoded.kind === "header") continue;
    if (decoded.kind === "invalid") {
      invalidLines += 1;
      continue;
    }

    const record = decoded.record;
    if (record.type === "rewards.lifecycle") {
      const value = record.data["state"];
      const state = value === "started" || value === "stopped" ? value : undefined;
      if (state === undefined) invalidLines += 1;
      entries.push({ kind: "lifecycle", state });
      continue;
    }
    if (record.type === "rewards.error") {
      entries.push({ kind: "error" });
      continue;
    }
    if (record.type !== "rewards.kill" && record.type !== "rewards.unmatched") continue;

    const event = parseRewardLogRecord(record.type, record.data);
    if (!event) {
      invalidLines += 1;
      continue;
    }
    entries.push({ kind: "reward", event, recordedAt: record.recordedAt });
  }

  return { entries, invalidLines };
}

/** Validates and decodes the reward payload shared by replay, live followers, and history. */
export function parseRewardLogRecord(type: string, value: unknown): FishNetMobRewardEvent | undefined {
  if (type !== "rewards.kill" && type !== "rewards.unmatched") return undefined;
  if (!record(value) || typeof value["tick"] !== "number" || !Number.isSafeInteger(value["tick"])) return undefined;
  if (value["kind"] === "unmatched") {
    const reason = value["reason"];
    const reward = value["reward"];
    if ((reason !== "ambiguous" && reason !== "expired" && reason !== "unidentified") || (reward !== "experience" && reward !== "pickup")) return undefined;
    const rawDrops = value["drops"];
    if (rawDrops !== undefined && !Array.isArray(rawDrops)) return undefined;
    const drops = (rawDrops ?? []).map((drop: unknown) => parseDrop(drop));
    if (drops.some((drop: ReturnType<typeof parseDrop>) => drop === undefined)) return undefined;
    const parsedDrops = drops as NonNullable<(typeof drops)[number]>[];
    if (reward === "pickup") return { kind: "unmatched", tick: value["tick"], reason, reward, drops: parsedDrops };
    const experience: unknown = value["experience"] ?? 0;
    const jobExperience: unknown = value["jobExperience"] ?? 0;
    const coins = value["coins"] ?? "0";
    if (typeof experience !== "number" || !Number.isSafeInteger(experience) || experience < 0
      || typeof jobExperience !== "number" || !Number.isSafeInteger(jobExperience) || jobExperience < 0
      || !decimal(coins)) return undefined;
    return {
      kind: "unmatched",
      tick: value["tick"],
      reason,
      reward,
      experience,
      jobExperience,
      coins: BigInt(coins),
      drops: parsedDrops,
    };
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
    // Records written before kills were reported without a reward always had one attached.
    attributed: typeof value["attributed"] === "boolean" ? value["attributed"] : true,
  };
}

function parseDrop(value: unknown): { category: RewardItemCategory; itemId: string; count: number } | undefined {
  if (!record(value) || typeof value["category"] !== "string" || typeof value["itemId"] !== "string" || !Number.isSafeInteger(value["count"])) return undefined;
  const categories = new Set(["equipment", "artifact", "card", "gem", "material", "consumable", "cosmetic", "currency"]);
  if (!categories.has(value["category"])) return undefined;
  return { category: value["category"] as RewardItemCategory, itemId: value["itemId"], count: value["count"] as number };
}
