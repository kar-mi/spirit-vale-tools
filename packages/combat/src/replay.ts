import type { FishNetActorIdentityEvent } from "./actor-directory.ts";
import type { FishNetCombatEvent } from "./combat-tracker.ts";
import { DamageReducer } from "./reducers/damage.ts";
import type { EncounterAggregate } from "./reducers/damage.ts";
import { renderEncounter } from "./reducers/rows.ts";
import type { FishNetDpsEncounterSnapshot } from "./snapshot.ts";
import { isRecord, isLogStreamHeader, parseLogRecord } from "@kar-mi/spirit-vale-tools-logging";

export interface DpsReplayResult {
  snapshots: FishNetDpsEncounterSnapshot[];
  invalidLines: number;
}

/**
 * Loads combat JSON Lines without retaining raw records or file contents.
 *
 * The reducer leaves `maxTimelineBuckets` unbounded by default, which is what a whole-log replay
 * wants: full timeline resolution, where the live service caps it to keep memory bounded.
 */
export async function loadDpsReplay(path: string, personalName = ""): Promise<DpsReplayResult> {
  const finished: EncounterAggregate[] = [];
  const reducer = new DamageReducer({ onEncounterFinished: (encounter) => finished.push(encounter) });
  let invalidLines = 0;
  let recordedAtOriginMs: number | undefined;
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
    if (isLogStreamHeader(candidate)) continue;
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
    // `parseLogRecord` already rejects a record whose `recordedAt` will not parse, so every record
    // reaching here has a usable wall clock; there is no tick-derived fallback to fall back to.
    const recordedAtMs = Date.parse(record.recordedAt);
    recordedAtOriginMs ??= recordedAtMs;
    lastTime = Math.max(lastTime, recordedAtMs - recordedAtOriginMs);
    if (event.kind === "actorIdentity") reducer.consumeIdentity(event, lastTime);
    else reducer.consumeCombat(event, lastTime);
  }
  // Closes the trailing encounter, so every encounter in the log reaches `finished`.
  reducer.reset(lastTime);
  // No `nowMs`: each encounter renders as of its own last damage, not as of the end of the file.
  // Rendering a finished log at one shared "now" would decay every encounter but the last to a
  // current rate of nearly zero.
  const snapshots = finished.map((encounter) => renderEncounter(encounter, { personalName }));
  return { snapshots, invalidLines };
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

function parseDpsLogEvent(value: unknown): FishNetActorIdentityEvent | FishNetCombatEvent | undefined {
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
  if (value["kind"] === "monsterIdentity") {
    if (value["operation"] === "reset") return value as unknown as FishNetCombatEvent;
    if (!isFiniteNumber(value["actorId"])) return undefined;
    if (value["operation"] === "remove") return value as unknown as FishNetCombatEvent;
    if (value["operation"] === "upsert"
      && typeof value["mobId"] === "string" && value["mobId"].length > 0
      && typeof value["displayName"] === "string" && value["displayName"].length > 0) {
      return value as unknown as FishNetCombatEvent;
    }
    return undefined;
  }
  if (value["kind"] === "activation") return value as unknown as FishNetCombatEvent;
  if (value["kind"] === "status") {
    // Level is optional: the observer-facing display feed carries none, so demanding one discarded
    // every status it produced - which is the overwhelming majority of them.
    if (!isFiniteNumber(value["actorId"])
      || typeof value["statusId"] !== "string"
      || (value["level"] !== undefined && !isFiniteNumber(value["level"]))
      || (value["remainingSeconds"] !== undefined && !isFiniteNumber(value["remainingSeconds"]))
      || (value["action"] !== "applied" && value["action"] !== "removed")) return undefined;
    return value as unknown as FishNetCombatEvent;
  }
  if (value["kind"] === "summon") {
    if (!isFiniteNumber(value["actorId"])
      || typeof value["skillId"] !== "string"
      || value["skillId"].length === 0
      || !isFiniteNumber(value["stacks"])
      || !Number.isInteger(value["stacks"])
      || value["stacks"] < 0) return undefined;
    return value as unknown as FishNetCombatEvent;
  }
  if (value["kind"] === "heal") {
    if (!isFiniteNumber(value["targetId"]) || !isFiniteNumber(value["value"])) return undefined;
    if (value["recoveryStyle"] !== undefined
      && value["recoveryStyle"] !== "standard"
      && value["recoveryStyle"] !== "passive-regeneration"
      && value["recoveryStyle"] !== "drain"
      && value["recoveryStyle"] !== "unknown") return undefined;
    return value as unknown as FishNetCombatEvent;
  }
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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
