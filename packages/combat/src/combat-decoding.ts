import type {
  DecodedFishNetPacket,
  FishNetDecodedValue,
  FishNetRpcMap,
  FishNetSyncEntry,
} from "@kar-mi/spirit-vale-tools-capture";
import { readSignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";
import { field, numberField } from "./decoded-fields.ts";
import type { FishNetCombatMonsterIdentityEvent, FishNetHealingTraits } from "./combat-events.ts";

export interface SummonCalibrationEntry {
  skillId: string;
  level: number;
}

export interface LoginEffectEntry {
  statusId: string;
  level: number;
  remainingSeconds?: number;
  stacks: number;
}

export interface BondSyncEntry {
  otherId: number;
  skillId: string;
  caster: boolean;
}

export interface DamageSource {
  sourceId: string;
  sourceLabel: string;
}

const DAMAGE_TYPE_SOURCES = new Map<number, DamageSource>([
  [4, { sourceId: "reflect", sourceLabel: "Reflect Damage" }],
]);

export function matchesBehaviour(packet: DecodedFishNetPacket, expected: string): boolean {
  return packet.networkBehaviourType === undefined || packet.networkBehaviourType === expected;
}

export function stringField(packet: DecodedFishNetPacket, name: string): string | undefined {
  const value = field(packet, name);
  return typeof value === "string" ? value : undefined;
}

export function requiredNumberField(packet: DecodedFishNetPacket, name: string): number {
  const value = numberField(packet, name);
  if (value === undefined) throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing numeric field ${name}`);
  return value;
}

export function requiredBooleanField(packet: DecodedFishNetPacket, name: string): boolean {
  const value = field(packet, name);
  if (typeof value !== "boolean") throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing boolean field ${name}`);
  return value;
}

export function requiredVectorField(packet: DecodedFishNetPacket, name: string): number[] {
  const value = field(packet, name);
  if (!Array.isArray(value)) throw new Error(`${packet.networkBehaviourType}.${packet.rpcName} is missing vector field ${name}`);
  return value;
}

export function decodedFieldRecord(packet: DecodedFishNetPacket): Record<string, FishNetDecodedValue> {
  return Object.fromEntries(packet.decodedFields?.map(({ name, value }) => [name, value]) ?? []);
}

export function healthComponentIndices(map: FishNetRpcMap | undefined): ReadonlySet<number> {
  return new Set(map?.prefabs?.flatMap(({ components }) =>
    components.filter(({ typeName }) => typeName === "HealthComponent").map(({ index }) => index)
  ) ?? []);
}

export function isCompleteRecoverPacket(packet: DecodedFishNetPacket): boolean {
  return numberField(packet, "amount") !== undefined
    && typeof field(packet, "settings.DisableFloater") === "boolean"
    && typeof field(packet, "settings.DisableSfx") === "boolean"
    && numberField(packet, "settings.Offset") !== undefined
    && numberField(packet, "settings.Scale") !== undefined
    && (!packet.undecodedPayload || packet.undecodedPayload.length === 0);
}

export function damageSignature(
  tick: number,
  targetId: number,
  actorId: number,
  sourceId: string,
  value: number,
  hitCode: number,
): string {
  return `${tick}\u0000${targetId}\u0000${actorId}\u0000${sourceId}\u0000${value}\u0000${hitCode}`;
}

export function drainRecoverySource(traits: FishNetHealingTraits | undefined): DamageSource {
  if (traits?.hasSiphonHealth && !traits.hasHealthLeech) {
    return { sourceId: "siphon-health", sourceLabel: "Siphon Health" };
  }
  if (traits?.hasHealthLeech && !traits.hasSiphonHealth) {
    return { sourceId: "health-leech", sourceLabel: "Health Leech" };
  }
  return { sourceId: "siphon-health-leech", sourceLabel: "Siphon / Health Leech" };
}

export function resolveDamageSource(
  rawSourceId: string | null | undefined,
  damageType: number,
  skillLabels: ReadonlyMap<string, string>,
): DamageSource {
  if (typeof rawSourceId === "string") {
    return {
      sourceId: rawSourceId,
      sourceLabel: skillLabels.get(rawSourceId) ?? rawSourceId,
    };
  }
  return (rawSourceId === null ? DAMAGE_TYPE_SOURCES.get(damageType) : undefined) ?? {
    sourceId: "unknown",
    sourceLabel: "unknown",
  };
}

export function uniqueMonsterIdentityEvents(events: FishNetCombatMonsterIdentityEvent[]): FishNetCombatMonsterIdentityEvent[] {
  return events.filter((event, index) => event.operation !== "reset" || events.findIndex((candidate) => candidate.operation === "reset") === index);
}

export function barrierSyncValues(packet: DecodedFishNetPacket): number[] {
  const values: number[] = [];
  const read = (entry: FishNetSyncEntry, behaviourType?: string) => {
    if (behaviourType !== undefined && behaviourType !== "HealthComponent") return;
    if (entry.index !== 2 && entry.name !== "barrierSync") return;
    const value = entry.fields.find(({ name }) => name === "barrierSync")?.value;
    if (typeof value === "number") values.push(value);
  };
  for (const entry of packet.spawnSyncEntries ?? []) read(entry, entry.networkBehaviourType);
  if (packet.packetName === "syncType" && matchesBehaviour(packet, "HealthComponent")) {
    for (const entry of packet.syncEntries ?? []) read(entry, packet.networkBehaviourType);
    if (!packet.syncEntries) {
      const value = numberField(packet, "barrierSync");
      if ((packet.syncIndex === 2 || packet.syncName === "barrierSync") && value !== undefined) values.push(value);
    }
  }
  return values;
}

export function bondSyncEntries(packet: DecodedFishNetPacket): BondSyncEntry[] | undefined {
  const decode = (entry: FishNetSyncEntry, behaviourType?: string): BondSyncEntry[] | undefined => {
    if (behaviourType !== undefined && behaviourType !== "SkillsComponent") return undefined;
    if (entry.index !== 2 && entry.name !== "BondSync") return undefined;
    const length = entry.fields.find(({ name }) => name === "Entries.length")?.value;
    if (typeof length !== "number" || !Number.isInteger(length) || length < 0) return undefined;
    const result: BondSyncEntry[] = [];
    for (let index = 0; index < length; index += 1) {
      const prefix = `Entries[${index}]`;
      const otherId = entry.fields.find(({ name }) => name === `${prefix}.Other`)?.value;
      const skillId = entry.fields.find(({ name }) => name === `${prefix}.SkillId`)?.value;
      const caster = entry.fields.find(({ name }) => name === `${prefix}.Caster`)?.value;
      if (typeof otherId !== "number" || typeof skillId !== "string" || typeof caster !== "boolean") return undefined;
      result.push({ otherId, skillId, caster });
    }
    return result;
  };

  for (const entry of packet.spawnSyncEntries ?? []) {
    const result = decode(entry, entry.networkBehaviourType);
    if (result) return result;
  }
  if (packet.packetName === "syncType" && matchesBehaviour(packet, "SkillsComponent")) {
    for (const entry of packet.syncEntries ?? []) {
      const result = decode(entry, packet.networkBehaviourType);
      if (result) return result;
    }
  }
  return undefined;
}

export function decodeFloaterSettings(payload: Buffer, start: number): NonNullable<DecodedFishNetPacket["decodedFields"]> | undefined {
  if (payload.length - start < 2) return undefined;
  const disableFloater = payload[start];
  const disableSfx = payload[start + 1];
  if ((disableFloater !== 0 && disableFloater !== 1) || (disableSfx !== 0 && disableSfx !== 1)) return undefined;
  let offset;
  try {
    offset = readSignedPackedWhole(payload, start + 2);
  } catch {
    return undefined;
  }
  if (payload.length - offset.nextOffset !== 4) return undefined;
  return [
    { name: "settings.DisableFloater", codec: "boolean", value: disableFloater === 1 },
    { name: "settings.DisableSfx", codec: "boolean", value: disableSfx === 1 },
    { name: "settings.Offset", codec: "packedInt32", value: offset.value },
    { name: "settings.Scale", codec: "float32", value: payload.readFloatLE(offset.nextOffset) },
  ];
}

/** Reads only the generated nested-field shape; missing, partial, or trailing data fails closed. */
export function decodedSummonCalibration(packet: DecodedFishNetPacket): SummonCalibrationEntry[] | undefined {
  if (packet.undecodedPayload && packet.undecodedPayload.length > 0) return undefined;
  const length = numberField(packet, "data.length");
  if (length === undefined || !Number.isInteger(length) || length < 0) return undefined;

  const entries: SummonCalibrationEntry[] = [];
  for (let index = 0; index < length; index += 1) {
    const skillId = stringField(packet, `data[${index}].SkillId`);
    const level = numberField(packet, `data[${index}].Level`);
    // `Id` is deliberately not read or required here: it's null for an anonymous stack summon (e.g.
    // a shinobi clone), unlike a named one (e.g. "Cactus Boss"), and nothing downstream needs it.
    if (skillId === undefined || level === undefined || !Number.isInteger(level) || level < 0) return undefined;
    entries.push({ skillId, level });
  }
  return entries;
}

/** Reads only the generated `State.Effects` nested-field shape; missing, partial, or trailing data fails closed. */
export function decodedLoginEffects(packet: DecodedFishNetPacket): LoginEffectEntry[] | undefined {
  if (packet.undecodedPayload && packet.undecodedPayload.length > 0) return undefined;
  const length = numberField(packet, "data.State.Effects.length");
  if (length === undefined || !Number.isInteger(length) || length < 0) return undefined;

  const entries: LoginEffectEntry[] = [];
  for (let index = 0; index < length; index += 1) {
    const statusId = stringField(packet, `data.State.Effects[${index}].Id`);
    const level = numberField(packet, `data.State.Effects[${index}].Level`);
    const duration = numberField(packet, `data.State.Effects[${index}].Duration`);
    const stacks = numberField(packet, `data.State.Effects[${index}].Stacks`);
    if (statusId === undefined
      || level === undefined || !Number.isInteger(level) || level < 0
      || duration === undefined
      || stacks === undefined || !Number.isInteger(stacks) || stacks < 0) return undefined;
    entries.push({
      statusId,
      level,
      ...(duration < 0 || !Number.isFinite(duration) ? {} : { remainingSeconds: duration }),
      stacks,
    });
  }
  return entries;
}
