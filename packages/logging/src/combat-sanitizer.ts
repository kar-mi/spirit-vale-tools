import type { JsonObject } from "./types.ts";

const IDENTITY_KEYS = new Set(["kind", "operation", "tick", "actorId", "displayName", "archetype", "ownerConnectionId", "uid"]);
const COMBAT_KEYS = new Set(["kind", "tick", "actorId", "value", "team", "sourceId", "sourceLabel", "hitResult", "duplicatesDamageEvent", "critical", "targetId"]);

/** Structural allowlist for shareable combat records. Returns undefined for diagnostics/unknown records. */
export function sanitizeCombatData(type: string, data: JsonObject): JsonObject | undefined {
  if (type === "combat.lifecycle") return pick(data, new Set(["state"]));
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
