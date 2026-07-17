import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
import { FishNetDpsMeter } from "./dps-meter.ts";
import { parseLogRecord } from "@spiritvale/logging";

export interface DpsReplayResult {
  meter: FishNetDpsMeter;
  invalidLines: number;
}

/** Loads combat JSON Lines without retaining raw records or file contents. */
export async function loadDpsReplay(path: string, personalName = ""): Promise<DpsReplayResult> {
  const meter = new FishNetDpsMeter({ personalName });
  let invalidLines = 0;
  let originTick: number | undefined;
  let lastTime = 0;

  for await (const line of readLines(Bun.file(path).stream())) {
    if (!line.trim()) continue;
    let candidate: unknown;
    try {
      candidate = JSON.parse(line);
    } catch {
      invalidLines += 1;
      continue;
    }
    const record = parseLogRecord(candidate);
    if (!record) {
      invalidLines += 1;
      continue;
    }
    const event = parseDpsLogRecord(record.type, record.data);
    if (event === null) continue;
    if (!event) {
      invalidLines += 1;
      continue;
    }
    originTick ??= event.tick;
    lastTime = meter.replayTimeMs(event.tick, originTick);
    if (event.kind === "actorIdentity") meter.consumeIdentity(event, lastTime);
    else meter.consumeCombat(event, lastTime);
  }
  meter.reset(lastTime);
  return { meter, invalidLines };
}

async function* readLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  let decoder: TextDecoder | undefined;
  let pending = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!decoder) decoder = decoderFor(value);
      pending += decoder.decode(value, { stream: true });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";
      yield* lines;
    }
    pending += decoder?.decode() ?? "";
    if (pending) yield pending;
  } finally {
    reader.releaseLock();
  }
}

function decoderFor(firstChunk: Uint8Array): TextDecoder {
  if (firstChunk[0] === 0xff && firstChunk[1] === 0xfe) return new TextDecoder("utf-16le");
  if (firstChunk[0] === 0xfe && firstChunk[1] === 0xff) return new TextDecoder("utf-16be");
  return new TextDecoder("utf-8");
}

export function parseDpsLogEvent(value: unknown): FishNetActorIdentityEvent | FishNetCombatEvent | undefined {
  if (!isRecord(value) || !isFiniteNumber(value["tick"]) || typeof value["kind"] !== "string") return undefined;
  if (value["kind"] === "actorIdentity") {
    if (value["operation"] === "reset") return value as unknown as FishNetActorIdentityEvent;
    if (!isFiniteNumber(value["actorId"])) return undefined;
    if (value["operation"] === "remove") return value as unknown as FishNetActorIdentityEvent;
    if (value["operation"] === "upsert" && typeof value["displayName"] === "string" && value["displayName"].length > 0) {
      return value as unknown as FishNetActorIdentityEvent;
    }
    return undefined;
  }
  if (value["kind"] === "activation") return value as unknown as FishNetCombatEvent;
  if ((value["kind"] !== "damage" && value["kind"] !== "death")
    || !isFiniteNumber(value["actorId"])
    || !isFiniteNumber(value["value"])
    || !isFiniteNumber(value["team"])
    || typeof value["sourceId"] !== "string"
    || typeof value["sourceLabel"] !== "string") return undefined;
  if (value["kind"] === "death" && typeof value["duplicatesDamageEvent"] !== "boolean") return undefined;
  return value as unknown as FishNetCombatEvent;
}

export function parseDpsLogRecord(
  type: string,
  data: Record<string, unknown>,
): FishNetActorIdentityEvent | FishNetCombatEvent | undefined | null {
  if (type !== "combat.actorIdentity" && type !== "combat.event") return null;
  const event = parseDpsLogEvent(data);
  if (!event) return undefined;
  if (type === "combat.actorIdentity" && event.kind !== "actorIdentity") return undefined;
  if (type === "combat.event" && event.kind === "actorIdentity") return undefined;
  return event;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
