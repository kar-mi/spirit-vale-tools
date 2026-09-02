import type { DecodedFishNetPacket, FishNetDecodedValue } from "@kar-mi/spirit-vale-tools-capture";

export interface FishNetDamageObservation {
  kind: "damage" | "death";
  tick: number;
  actorId: number;
  targetId: number;
  value: number;
  team: number;
}

/** Decodes only the authoritative hit identity needed by consumers that do not need attribution. */
export function observeFishNetDamagePacket(packet: DecodedFishNetPacket): FishNetDamageObservation | undefined {
  if (packet.objectId === undefined || (packet.rpcName !== "ApplyDamage_C" && packet.rpcName !== "Death_C")) return undefined;
  if (packet.networkBehaviourType !== undefined && packet.networkBehaviourType !== "HealthComponent") return undefined;
  const requireVectors = packet.rpcName === "ApplyDamage_C";
  const numeric = [
    "dmg.Team", "dmg.Value", "dmg.Type", "dmg.Hit", "dmg.Hits",
    "dmg.AttackerId", "dmg.Element", "dmg.WeaponType", "dmg.Range",
  ];
  if (!numeric.every((name) => numberField(packet, name) !== undefined)
    || nullableStringField(packet, "dmg.DamageSourceId") === undefined
    || typeof field(packet, "dmg.IsClone") !== "boolean"
    || typeof field(packet, "dmg.IsSummon") !== "boolean"
    || (requireVectors && (!Array.isArray(field(packet, "position")) || !Array.isArray(field(packet, "origin"))))) {
    return undefined;
  }
  return {
    kind: packet.rpcName === "Death_C" ? "death" : "damage",
    tick: packet.tick,
    actorId: numberField(packet, "dmg.AttackerId")!,
    targetId: packet.objectId,
    value: numberField(packet, "dmg.Value")!,
    team: numberField(packet, "dmg.Team")!,
  };
}

function field(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
}

function numberField(packet: DecodedFishNetPacket, name: string): number | undefined {
  const value = field(packet, name);
  return typeof value === "number" ? value : undefined;
}

function nullableStringField(packet: DecodedFishNetPacket, name: string): string | null | undefined {
  const value = field(packet, name);
  return value === null || typeof value === "string" ? value : undefined;
}
