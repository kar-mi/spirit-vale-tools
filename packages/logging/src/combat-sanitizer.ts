import type { JsonObject } from "./types.ts";

const IDENTITY_KEYS = new Set(["kind", "operation", "tick", "actorId", "displayName", "archetype", "ownerConnectionId", "uid"]);
// `rpc` and `remainingSeconds` are protocol values that a status event cannot be replayed without:
// the first says which feed produced it, and the second is the server's own countdown. Dropping them
// left a replayed status with no expiry and no way to tell an owner-only apply from an observer
// refresh.
const COMBAT_KEYS = new Set(["kind", "operation", "tick", "actorId", "mobId", "displayName", "value", "team", "sourceId", "sourceLabel", "recoveryStyle", "hitResult", "duplicatesDamageEvent", "critical", "targetId", "statusId", "level", "action", "skillId", "stacks", "rpc", "remainingSeconds"]);

/** Structural allowlist for shareable combat records. Returns undefined for diagnostics/unknown records. */
export function sanitizeCombatData(type: string, data: JsonObject): JsonObject | undefined {
  // capture.lifecycle is what the capture CLI emits; both carry only a start/stop marker, and
  // readers need them to see where a session began and ended.
  if (type === "combat.lifecycle" || type === "capture.lifecycle") return pick(data, new Set(["state"]));
  if (type === "combat.actorIdentity") return pick(data, IDENTITY_KEYS);
  if (type === "combat.event") return pick(data, COMBAT_KEYS);
  return undefined;
}

function pick(data: JsonObject, keys: Set<string>): JsonObject {
  const result: JsonObject = {};
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null)) result[key] = value;
  }
  return result;
}
