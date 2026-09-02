import type { FishNetActorIdentityEvent } from "../tracking/actor-directory.ts";
import type { FishNetCombatEvent } from "../events/combat-events.ts";
import { DamageReducer } from "../reducers/damage.ts";
import type { EncounterAggregate } from "../reducers/damage.ts";
import { renderEncounter } from "../reducers/rows.ts";
import type { CombatEncounterSnapshot } from "../reducers/snapshot.ts";
import { isRecord, LogRecordLineDecoder, readTextLines } from "@kar-mi/spirit-vale-tools-logging";

export interface DpsReplayResult {
  snapshots: CombatEncounterSnapshot[];
  invalidLines: number;
}

/** Loads combat JSON Lines without retaining raw records or file contents. */
export async function loadDpsReplay(path: string, personalName = ""): Promise<DpsReplayResult> {
  const finished: EncounterAggregate[] = [];
  const reducer = new DamageReducer({ onEncounterFinished: (encounter) => finished.push(encounter) });
  let invalidLines = 0;
  let recordedAtOriginMs: number | undefined;
  let lastTime = 0;
  const records = new LogRecordLineDecoder();

  for await (const line of readTextLines(Bun.file(path).stream())) {
    const decoded = records.decode(line);
    if (decoded.kind === "empty" || decoded.kind === "header") continue;
    if (decoded.kind === "invalid") {
      invalidLines += 1;
      continue;
    }
    const record = decoded.record;
    const event = parseDpsLogRecord(record.type, record.data);
    if (event === null) continue;
    if (!event) {
      invalidLines += 1;
      continue;
    }
    const recordedAtMs = Date.parse(record.recordedAt);
    recordedAtOriginMs ??= recordedAtMs;
    lastTime = Math.max(lastTime, recordedAtMs - recordedAtOriginMs);
    if (event.kind === "actorIdentity") reducer.consumeIdentity(event, lastTime);
    else reducer.consumeCombat(event, lastTime);
  }
  // Closes the trailing encounter, so every encounter in the log reaches `finished`.
  reducer.reset(lastTime);
  // No `nowMs`: each encounter renders as of its own last damage, not as of the end of the file.
  const snapshots = finished.map((encounter) => renderEncounter(encounter, { personalName }));
  return { snapshots, invalidLines };
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
    if (value["attribution"] !== undefined
      && value["attribution"] !== "exact"
      && value["attribution"] !== "inferred"
      && value["attribution"] !== "ambiguous"
      && value["attribution"] !== "unattributed") return undefined;
    if (value["recoveryStyle"] !== undefined
      && value["recoveryStyle"] !== "standard"
      && value["recoveryStyle"] !== "passive-regeneration"
      && value["recoveryStyle"] !== "drain"
      && value["recoveryStyle"] !== "unknown") return undefined;
    return value as unknown as FishNetCombatEvent;
  }
  if (value["kind"] === "shield") {
    if (!isFiniteNumber(value["targetId"])
      || !isFiniteNumber(value["value"])
      || !isFiniteNumber(value["barrierBefore"])
      || !isFiniteNumber(value["barrierAfter"])
      || (value["action"] !== "gained" && value["action"] !== "absorbed"
        && value["action"] !== "cleared" && value["action"] !== "reduced")
      || (value["attribution"] !== "exact" && value["attribution"] !== "inferred"
        && value["attribution"] !== "ambiguous" && value["attribution"] !== "unattributed")) return undefined;
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
