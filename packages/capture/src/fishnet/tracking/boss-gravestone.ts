/** Reads the marker the server spawns where a world boss died. */

import type { DecodedFishNetPacket, FishNetDecodedField } from "../types.ts";

const GRAVESTONE_BEHAVIOUR = "BossGraveStone";

/** Fields the marker reports, resolved from its `BossKillInfo` SyncType. */
export interface BossGravestone {
  /** Catalog id of the boss, e.g. `Sunflora Pixie`. The same id the timers are keyed on. */
  mobId: string;
  /** Display name of the boss, e.g. `Lady Fey`. */
  bossName: string;
  /** Player the marker credits with the kill. */
  killedBy: string;
  /** When the server says the boss died, rather than when we happened to see the marker. */
  diedAtMs: number;
}

/** Reads `packet` as a gravestone, or returns undefined when it is anything else. */
export function decodeBossGravestone(packet: DecodedFishNetPacket): BossGravestone | undefined {
  const fields = killInfoFields(packet);
  if (!fields) return undefined;

  const killTime = fields.find((field) => field.name === "KillTime")?.value;
  const killerName = fields.find((field) => field.name === "KillerName")?.value;
  const bossName = fields.find((field) => field.name === "BossName")?.value;
  const bossId = fields.find((field) => field.name === "BossId")?.value;
  if (typeof killTime !== "number" || typeof killerName !== "string" || typeof bossName !== "string"
    || typeof bossId !== "string") {
    return undefined;
  }

  // Seconds as a float64, which is how the server sends it.
  return { mobId: bossId, bossName, killedBy: killerName, diedAtMs: killTime * 1_000 };
}

/**
 * The marker's fields, from whichever packet carried them: a fresh marker sends them in a SyncType
 * just after its own spawn, while one already standing carries them in the spawn itself.
 */
function killInfoFields(packet: DecodedFishNetPacket): readonly FishNetDecodedField[] | undefined {
  const spawned = packet.spawnSyncEntries?.find((entry) => entry.networkBehaviourType === GRAVESTONE_BEHAVIOUR);
  if (spawned) return spawned.fields;
  if (packet.networkBehaviourType !== GRAVESTONE_BEHAVIOUR) return undefined;
  return packet.syncEntries?.flatMap((entry) => entry.fields) ?? packet.decodedFields;
}
