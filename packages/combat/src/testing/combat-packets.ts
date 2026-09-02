import type { DecodedFishNetPacket, FishNetDecodedField } from "@kar-mi/spirit-vale-tools-capture";

export function packet(
  tick: number,
  objectId: number,
  networkBehaviourType: string,
  rpcName: string,
  decodedFields: FishNetDecodedField[] = [],
): DecodedFishNetPacket {
  return {
    tick,
    objectId,
    networkBehaviourType,
    rpcName,
    packetId: 900,
    packetName: "rpcLink",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    decodedFields,
  };
}

export function field(name: string, value: boolean | number | string | number[] | null): FishNetDecodedField {
  const codec = value === null
    ? "stringUtf8Packed"
    : typeof value === "boolean"
      ? "boolean"
      : typeof value === "string"
        ? "stringUtf8Packed"
        : Array.isArray(value)
          ? "vector3"
          : "packedInt32";
  return { name, codec, value };
}

export function cast(tick: number, actorId: number, sourceId: string): DecodedFishNetPacket {
  return packet(tick, actorId, "SkillsComponent", "CastBegin_C", [
    field("dto.Id", sourceId),
    field("dto.Level", 2),
    field("targetId", 0),
  ]);
}

export function damage(
  tick: number,
  targetId: number,
  actorId: number,
  sourceId: string | null,
  value: number,
  hit = 0,
  damageType = 0,
): DecodedFishNetPacket {
  return packet(tick, targetId, "HealthComponent", "ApplyDamage_C", [
    field("dmg.Team", 0),
    field("dmg.Value", value),
    field("dmg.Type", damageType),
    field("dmg.Hit", hit),
    field("dmg.Hits", 1),
    field("dmg.DamageSourceId", sourceId),
    field("dmg.AttackerId", actorId),
    field("dmg.IsClone", false),
    field("dmg.IsSummon", false),
    field("dmg.Element", 0),
    field("dmg.WeaponType", 4),
    field("dmg.Range", 2),
    field("position", [1, 2, 3]),
    field("origin", [4, 5, 6]),
  ]);
}

export function death(
  tick: number,
  targetId: number,
  actorId: number,
  sourceId: string | null,
  value: number,
  hit = 0,
  damageType = 0,
): DecodedFishNetPacket {
  const result = damage(tick, targetId, actorId, sourceId, value, hit, damageType);
  result.rpcName = "Death_C";
  result.decodedFields = result.decodedFields?.filter(({ name }) => name !== "position" && name !== "origin");
  return result;
}

export function castTargeting(tick: number, actorId: number, sourceId: string, targetId: number): DecodedFishNetPacket {
  return packet(tick, actorId, "SkillsComponent", "CastBegin_C", [
    field("dto.Id", sourceId),
    field("dto.Level", 2),
    field("targetId", targetId),
  ]);
}

export function autoCastTargeting(tick: number, actorId: number, sourceId: string, targetId: number): DecodedFishNetPacket {
  return packet(tick, actorId, "SkillsComponent", "AutoCast_C", [
    field("dto.Id", sourceId),
    field("dto.Level", 1),
    field("obj", targetId),
  ]);
}

export function recover(tick: number, targetId: number, amount: number, settingsHex?: string): DecodedFishNetPacket {
  const settings = settingsHex === "00010000000000"
    ? [false, true, 0, 0] as const
    : settingsHex === "0001ab020000403f"
      ? [false, true, -150, 0.75] as const
      : [false, false, 150, 0] as const;
  const result = packet(tick, targetId, "HealthComponent", "Recover_C", [
    field("amount", amount),
    field("settings.DisableFloater", settings[0]),
    field("settings.DisableSfx", settings[1]),
    field("settings.Offset", settings[2]),
    field("settings.Scale", settings[3]),
  ]);
  return result;
}

export function statusEffect(
  tick: number,
  actorId: number,
  rpcName: "ApplyEffect_T" | "RemoveEffect_T",
  fields: FishNetDecodedField[],
): DecodedFishNetPacket {
  return packet(tick, actorId, "StatusComponent", rpcName, fields);
}

export function barrierSync(tick: number, targetId: number, value: number): DecodedFishNetPacket {
  const barrierField = field("barrierSync", value);
  return {
    tick,
    objectId: targetId,
    networkBehaviourType: "HealthComponent",
    packetId: 901,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    syncIndex: 2,
    syncName: "barrierSync",
    decodedFields: [barrierField],
    syncEntries: [{ index: 2, name: "barrierSync", fields: [barrierField] }],
  };
}

export function bondSync(
  tick: number,
  targetId: number,
  entries: readonly { otherId: number; skillId: string; caster: boolean }[],
): DecodedFishNetPacket {
  const fields = [
    field("Entries.length", entries.length),
    ...entries.flatMap((entry, index) => [
      field(`Entries[${index}].Other`, entry.otherId),
      field(`Entries[${index}].SkillId`, entry.skillId),
      field(`Entries[${index}].Caster`, entry.caster),
    ]),
  ];
  return {
    tick,
    objectId: targetId,
    networkBehaviourType: "SkillsComponent",
    packetId: 902,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    syncIndex: 2,
    syncName: "BondSync",
    decodedFields: fields,
    syncEntries: [{ index: 2, name: "BondSync", fields }],
  };
}

export function objectSpawn(
  tick: number,
  objectId: number,
  spawnSyncEntries: DecodedFishNetPacket["spawnSyncEntries"] = [],
): DecodedFishNetPacket {
  return {
    tick,
    objectId,
    packetId: 903,
    packetName: "objectSpawn",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    spawnSyncEntries,
  };
}

export function summonCalibration(
  tick: number,
  actorId: number,
  skillIds: readonly string[],
): DecodedFishNetPacket {
  const result = packet(tick, actorId, "SummoningComponent", "CalibrateSummons_T", [
    field("data.length", skillIds.length),
    ...skillIds.flatMap((skillId, index) => [
      field(`data[${index}].SkillId`, skillId),
      field(`data[${index}].Id`, `${skillId} Actor`),
      field(`data[${index}].Level`, 1),
    ]),
  ]);
  result.rpcResolution = "verified";
  result.payload = Buffer.concat([
    packed(skillIds.length),
    ...skillIds.map((skillId) => {
      const summonId = `${skillId} Actor`;
      return Buffer.concat([
        packed(Buffer.byteLength(skillId)), Buffer.from(skillId),
        packed(Buffer.byteLength(summonId)), Buffer.from(summonId),
        packed(1),
      ]);
    }),
  ]);
  return result;
}

export function packed(value: number): Buffer {
  let encoded = BigInt(value) << 1n;
  const bytes: number[] = [];
  while (encoded >= 0x80n) {
    bytes.push(Number((encoded & 0x7fn) | 0x80n));
    encoded >>= 7n;
  }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}

export function effectEntry(statusId: string, remaining: number, stacks = 1, maxStacks = 0): Buffer {
  const seconds = Buffer.alloc(4);
  seconds.writeFloatLE(remaining);
  return Buffer.concat([
    packed(Buffer.byteLength(statusId)),
    Buffer.from(statusId),
    seconds,
    packed(stacks),
    packed(maxStacks),
    Buffer.from([0]),
  ]);
}

export function effectDisplayPayload(applies: readonly Buffer[], removes: readonly string[] = []): Buffer {
  return Buffer.concat([
    packed(applies.length),
    ...applies,
    packed(removes.length),
    ...removes.map((id) => Buffer.concat([packed(Buffer.byteLength(id)), Buffer.from(id)])),
  ]);
}

export function ambiguousObserver(
  tick: number,
  objectId: number,
  componentIndex: number,
  rpcHash: number,
  payload: Buffer,
): DecodedFishNetPacket {
  return {
    tick,
    objectId,
    networkBehaviourIndex: componentIndex,
    rpcHash,
    rpcResolution: "ambiguous",
    packetId: 8,
    packetName: "observersRpc",
    raw: Buffer.alloc(0),
    payload,
  };
}

/** `SummoningComponent` lives on the summon itself; `SummonerSync` is its only link back to the owning actor. */
export function summonSkillSync(
  tick: number,
  summonObjectId: number,
  skillId: string,
  ownerActorId?: number,
): DecodedFishNetPacket {
  return {
    tick,
    objectId: summonObjectId,
    networkBehaviourType: "SummoningComponent",
    packetId: 900,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    syncEntries: [
      ...(ownerActorId === undefined ? [] : [{ index: 0, name: "SummonerSync", fields: [field("SummonerSync", ownerActorId)] }]),
      { index: 2, name: "SummonSkillSync", fields: [
        field("SkillId", skillId),
        field("Id", `${skillId} Actor`),
        field("Level", 1),
      ] },
    ],
  };
}

/** Just the owner reference, as arrives when a summon's `SummonSkillSync` was reported separately (or earlier). */
export function summonerSyncOnly(tick: number, summonObjectId: number, ownerActorId: number): DecodedFishNetPacket {
  return {
    tick,
    objectId: summonObjectId,
    networkBehaviourType: "SummoningComponent",
    packetId: 900,
    packetName: "syncType",
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    syncEntries: [{ index: 0, name: "SummonerSync", fields: [field("SummonerSync", ownerActorId)] }],
  };
}

export function objectDespawn(tick: number, objectId: number): DecodedFishNetPacket {
  return {
    tick, objectId, packetId: 4, packetName: "objectDespawn",
    raw: Buffer.alloc(0), payload: Buffer.alloc(0),
  };
}
