import { describe, expect, test } from "bun:test";

import { FishNetCombatTracker } from "./combat-tracker.ts";
import type { DecodedFishNetPacket, FishNetDecodedField, FishNetSemanticMap } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";

function packet(
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

function field(name: string, value: boolean | number | string | number[] | null): FishNetDecodedField {
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

function cast(tick: number, actorId: number, sourceId: string): DecodedFishNetPacket {
  return packet(tick, actorId, "SkillsComponent", "CastBegin_C", [
    field("dto.Id", sourceId),
    field("dto.Level", 2),
    field("targetId", 0),
  ]);
}

function damage(
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

function death(
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

function castTargeting(tick: number, actorId: number, sourceId: string, targetId: number): DecodedFishNetPacket {
  return packet(tick, actorId, "SkillsComponent", "CastBegin_C", [
    field("dto.Id", sourceId),
    field("dto.Level", 2),
    field("targetId", targetId),
  ]);
}

function recover(tick: number, targetId: number, amount: number, settingsHex?: string): DecodedFishNetPacket {
  const result = packet(tick, targetId, "HealthComponent", "Recover_C", [
    field("amount", amount),
  ]);
  if (settingsHex) result.undecodedPayload = Buffer.from(settingsHex, "hex");
  return result;
}

function statusEffect(
  tick: number,
  actorId: number,
  rpcName: "ApplyEffect_T" | "RemoveEffect_T",
  fields: FishNetDecodedField[],
): DecodedFishNetPacket {
  return packet(tick, actorId, "StatusComponent", rpcName, fields);
}

describe("FishNetCombatTracker", () => {
  test("attributes overlapping different skills by attacker and source", () => {
    const tracker = new FishNetCombatTracker();
    const first = tracker.consume(cast(1, 10, "AxeArc"))[0];
    const second = tracker.consume(cast(2, 10, "AxeVortex"))[0];
    const [hit] = tracker.consume(damage(3, 20, 10, "AxeArc", 12));

    expect(first).toMatchObject({ kind: "activation", sourceLabel: "Twin Cleave" });
    expect(second).toMatchObject({ kind: "activation", sourceLabel: "Vortex Slash" });
    expect(hit).toMatchObject({
      kind: "damage",
      sourceLabel: "Twin Cleave",
      attribution: "exact",
      activationId: first && "activationId" in first ? first.activationId : undefined,
    });
  });

  test("accepts a uniquely named skill RPC when its behaviour binding is unresolved", () => {
    const tracker = new FishNetCombatTracker();
    const unresolved = cast(1, 10, "AxeArc");
    unresolved.networkBehaviourType = undefined;
    expect(tracker.consume(unresolved)[0]).toMatchObject({
      kind: "activation",
      actionKind: "skill",
      sourceId: "AxeArc",
      sourceLabel: "Twin Cleave",
    });

    const conflicting = cast(2, 10, "AxeVortex");
    conflicting.networkBehaviourType = "UnrelatedComponent";
    expect(tracker.consume(conflicting)).toEqual([]);
  });

  test("marks overlapping same-source activations as ambiguous", () => {
    const tracker = new FishNetCombatTracker();
    const first = tracker.consume(cast(1, 10, "Whirlwind"))[0];
    const second = tracker.consume(cast(2, 10, "Whirlwind"))[0];
    const [hit] = tracker.consume(damage(3, 20, 10, "Whirlwind", 17, 1));

    expect(hit).toMatchObject({
      kind: "damage",
      attribution: "ambiguous",
      value: 17,
      candidateActivationIds: [
        first && "activationId" in first ? first.activationId : undefined,
        second && "activationId" in second ? second.activationId : undefined,
      ],
    });
  });

  test("creates one inferred activation for an unobserved multi-hit action", () => {
    const tracker = new FishNetCombatTracker({ hitGraceTicks: 5 });
    const firstEvents = tracker.consume(damage(10, 20, 30, "SyntheticStorm", 9));
    const secondEvents = tracker.consume(damage(12, 21, 30, "SyntheticStorm", 11, 1));

    expect(firstEvents).toHaveLength(2);
    expect(firstEvents[0]).toMatchObject({ kind: "activation", phase: "inferred", inferred: true });
    expect(firstEvents[1]).toMatchObject({ kind: "damage", attribution: "inferred" });
    expect(secondEvents[0]).toMatchObject({ kind: "damage", attribution: "inferred" });
    expect(tracker.consume(packet(16, 99, "Other", "Noop"))).toEqual([]);
    const afterExpiry = tracker.consume(damage(17, 22, 30, "SyntheticStorm", 5));
    expect(afterExpiry[0]).toMatchObject({ kind: "activation", phase: "inferred" });
    expect(afterExpiry[1]).toMatchObject({ kind: "damage", attribution: "inferred", value: 5 });
  });

  test("keeps actors separated when their skills interleave", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(cast(1, 10, "AxeArc"));
    tracker.consume(cast(1, 11, "AxeArc"));
    const actorEleven = tracker.consume(damage(2, 20, 11, "AxeArc", 13));
    const actorTen = tracker.consume(damage(3, 21, 10, "AxeArc", 7));

    expect(actorEleven[0]).toMatchObject({ kind: "damage", actorId: 11, value: 13 });
    expect(actorTen[0]).toMatchObject({ kind: "damage", actorId: 10, value: 7 });
  });

  test("expires a skill activation when its lifecycle completion is lost", () => {
    const tracker = new FishNetCombatTracker({ activationMaxAgeTicks: 5 });
    tracker.consume(cast(1, 10, "AxeArc"));

    const events = tracker.consume(damage(7, 20, 10, "AxeArc", 12));

    expect(events[0]).toMatchObject({ kind: "activation", phase: "inferred" });
    expect(events[1]).toMatchObject({ kind: "damage", attribution: "inferred" });
  });

  test("clears activations at authentication and disconnect boundaries", () => {
    for (const packetName of ["authenticated", "disconnect"] as const) {
      const tracker = new FishNetCombatTracker();
      tracker.consume(cast(1_000, 10, "AxeArc"));
      tracker.consume({ tick: 50, packetId: 0, packetName, raw: Buffer.alloc(0), payload: Buffer.alloc(0) });

      const events = tracker.consume(damage(1_001, 20, 10, "AxeArc", 12));

      expect(events[0]).toMatchObject({ kind: "activation", phase: "inferred" });
      expect(events[1]).toMatchObject({ kind: "damage", attribution: "inferred" });
    }
  });

  test("prefers a compatible semantic override over an extracted catalog label", () => {
    const skillCatalog: FishNetSkillCatalog = {
      buildFingerprint: "synthetic-build",
      skills: [{ id: "SyntheticArc", displayName: "Catalog Arc", kinds: ["active"] }],
    };
    const semanticMap: FishNetSemanticMap = {
      buildFingerprint: "synthetic-build",
      verifiedSkillLabels: [{
        networkBehaviourType: "SkillsComponent",
        rpcName: "CastBegin_C",
        field: "dto.Id",
        value: "SyntheticArc",
        label: "Override Arc",
        confidence: "synthetic",
        repetitions: 2,
      }],
      recoveryStyles: [],
    };
    const tracker = new FishNetCombatTracker({ skillCatalog, semanticMap });
    expect(tracker.consume(cast(1, 10, "SyntheticArc"))[0]).toMatchObject({ sourceLabel: "Override Arc" });
  });

  test("rejects mismatched metadata builds", () => {
    const skillCatalog: FishNetSkillCatalog = {
      buildFingerprint: "synthetic-build",
      skills: [{ id: "SyntheticArc", displayName: "Catalog Arc", kinds: ["active"] }],
    };
    expect(() => new FishNetCombatTracker({ buildFingerprint: "other-build", skillCatalog }))
      .toThrow("skill catalog build");
  });

  test("emits lethal damage as a death event and identifies a paired damage event", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(cast(1, 10, "AxeArc"));
    const [hit] = tracker.consume(damage(2, 20, 10, "AxeArc", 25));
    const [pairedDeath] = tracker.consume(death(2, 20, 10, "AxeArc", 25));
    const [unpairedDeath] = tracker.consume(death(3, 21, 10, "AxeArc", 26));

    expect(hit).toMatchObject({
      kind: "damage",
      rpc: "ApplyDamage_C",
      value: 25,
      fields: { "dmg.Value": 25, "dmg.DamageSourceId": "AxeArc", position: [1, 2, 3] },
    });
    expect(pairedDeath).toMatchObject({
      kind: "death",
      rpc: "Death_C",
      value: 25,
      fields: { "dmg.Value": 25, "dmg.DamageSourceId": "AxeArc" },
      duplicatesDamageEvent: true,
    });
    expect(unpairedDeath).toMatchObject({ kind: "death", value: 26, duplicatesDamageEvent: false });
  });

  test("labels null-source type-four damage as reflected damage", () => {
    const tracker = new FishNetCombatTracker();
    const [activation, hit] = tracker.consume(damage(1, 20, 10, null, 75, 0, 4));

    expect(activation).toMatchObject({
      kind: "activation",
      actorId: 10,
      sourceId: "reflect",
      sourceLabel: "Reflect Damage",
    });
    expect(hit).toMatchObject({
      kind: "damage",
      actorId: 10,
      targetId: 20,
      damageType: 4,
      sourceId: "reflect",
      sourceLabel: "Reflect Damage",
    });

    const [pairedDeath] = tracker.consume(death(1, 20, 10, null, 75, 0, 4));
    expect(pairedDeath).toMatchObject({
      kind: "death",
      sourceId: "reflect",
      sourceLabel: "Reflect Damage",
      duplicatesDamageEvent: true,
    });
  });

  test("retains unknown for other null-source damage", () => {
    const tracker = new FishNetCombatTracker();
    const [activation, hit] = tracker.consume(damage(1, 20, 10, null, 75));

    expect(activation).toMatchObject({ sourceId: "unknown", sourceLabel: "unknown" });
    expect(hit).toMatchObject({
      kind: "damage",
      damageType: 0,
      sourceId: "unknown",
      sourceLabel: "unknown",
    });
  });

  test("prefers an explicit source over a damage-type fallback", () => {
    const tracker = new FishNetCombatTracker();
    const [, hit] = tracker.consume(damage(1, 20, 10, "AxeArc", 75, 0, 4));

    expect(hit).toMatchObject({
      kind: "damage",
      damageType: 4,
      sourceId: "AxeArc",
      sourceLabel: "Twin Cleave",
    });
  });

  test("emits a status event when a status effect is applied", () => {
    const tracker = new FishNetCombatTracker();
    const [event] = tracker.consume(statusEffect(5, 10, "ApplyEffect_T", [
      field("statusId", "Bleed"),
      field("level", 2),
    ]));

    expect(event).toMatchObject({
      kind: "status",
      rpc: "ApplyEffect_T",
      tick: 5,
      actorId: 10,
      statusId: "Bleed",
      level: 2,
      action: "applied",
    });
  });

  test("emits a status event when a status effect is removed", () => {
    const tracker = new FishNetCombatTracker();
    const [event] = tracker.consume(statusEffect(6, 10, "RemoveEffect_T", [
      field("statusId", "Bleed"),
      field("level", 2),
    ]));

    expect(event).toMatchObject({
      kind: "status",
      rpc: "RemoveEffect_T",
      tick: 6,
      actorId: 10,
      statusId: "Bleed",
      level: 2,
      action: "removed",
    });
  });

  test("skips status packets missing statusId or level", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(statusEffect(1, 10, "ApplyEffect_T", [field("statusId", "Bleed")]))).toEqual([]);
    expect(tracker.consume(statusEffect(1, 10, "ApplyEffect_T", [field("level", 2)]))).toEqual([]);
  });

  test("attributes a heal to the caster when a single matching healing activation targets the recipient", () => {
    const tracker = new FishNetCombatTracker();
    const [cast] = tracker.consume(castTargeting(1, 10, "Heal", 20));
    const [heal] = tracker.consume(recover(2, 20, 150));

    expect(cast).toMatchObject({ kind: "activation", sourceId: "Heal", targetId: 20 });
    expect(heal).toMatchObject({
      kind: "heal",
      rpc: "Recover_C",
      targetId: 20,
      actorId: 10,
      sourceId: "Heal",
      value: 150,
      attribution: "exact",
      activationId: cast && "activationId" in cast ? cast.activationId : undefined,
    });
  });

  test("marks overlapping healing activations targeting the same recipient as ambiguous", () => {
    const tracker = new FishNetCombatTracker();
    const [first] = tracker.consume(castTargeting(1, 10, "Heal", 20));
    const [second] = tracker.consume(castTargeting(2, 11, "HighHeal", 20));
    const [heal] = tracker.consume(recover(3, 20, 80));

    expect(heal).toMatchObject({
      kind: "heal",
      attribution: "ambiguous",
      value: 80,
      actorId: undefined,
      sourceId: undefined,
      candidateActivationIds: [
        first && "activationId" in first ? first.activationId : undefined,
        second && "activationId" in second ? second.activationId : undefined,
      ],
    });
  });

  test("leaves a heal unattributed when no matching healing activation targets the recipient", () => {
    const tracker = new FishNetCombatTracker();
    const [heal] = tracker.consume(recover(1, 20, 60));

    expect(heal).toMatchObject({
      kind: "heal",
      targetId: 20,
      value: 60,
      attribution: "unattributed",
      actorId: undefined,
      sourceId: undefined,
    });
  });

  test("identifies passive regeneration independently for every actor", () => {
    const tracker = new FishNetCombatTracker();
    const [heal] = tracker.consume(recover(1, 20, 25, "00010000000000"));

    expect(heal).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 20,
      sourceId: "passive-regeneration",
      sourceLabel: "Passive regeneration",
      recoveryStyle: "passive-regeneration",
      attribution: "inferred",
      value: 25,
    });
  });

  test.each([
    [{ hasSiphonHealth: true, hasHealthLeech: false }, "siphon-health", "Siphon Health"],
    [{ hasSiphonHealth: false, hasHealthLeech: true }, "health-leech", "Health Leech"],
    [{ hasSiphonHealth: true, hasHealthLeech: true }, "siphon-health-leech", "Siphon / Health Leech"],
    [undefined, "siphon-health-leech", "Siphon / Health Leech"],
  ] as const)("labels drain recovery from visible traits %#", (traits, sourceId, sourceLabel) => {
    const tracker = new FishNetCombatTracker({
      healingTraitsResolver: (actorId) => actorId === 20 ? traits : undefined,
    });
    const [heal] = tracker.consume(recover(1, 20, 500, "0001ab020000403f"));

    expect(heal).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 20,
      sourceId,
      sourceLabel,
      recoveryStyle: "drain",
      attribution: "inferred",
      value: 500,
    });
  });

  test("does not split or relabel another actor's combined drain recovery", () => {
    const tracker = new FishNetCombatTracker({
      healingTraitsResolver: (actorId) => actorId === 10
        ? { hasSiphonHealth: true, hasHealthLeech: false }
        : undefined,
    });
    const events = tracker.consume(recover(1, 20, 600, "0001ab020000403f"));

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      actorId: 20,
      sourceId: "siphon-health-leech",
      sourceLabel: "Siphon / Health Leech",
      value: 600,
    });
  });

  test("does not attribute a heal to an unrelated non-healing skill cast on the same recipient", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(castTargeting(1, 10, "AxeArc", 20));
    const [heal] = tracker.consume(recover(2, 20, 40));

    expect(heal).toMatchObject({ kind: "heal", attribution: "unattributed", actorId: undefined });
  });

  test("ignores SkillsComponent.Recover_C packets (resource recovery, not a heal)", () => {
    const tracker = new FishNetCombatTracker();
    const resourceRecover = packet(1, 10, "SkillsComponent", "Recover_C", [field("amount", 25)]);

    expect(tracker.consume(resourceRecover)).toEqual([]);
  });

  test("attributes Recover_C ticks under an active Regeneration status to the skill that granted it", () => {
    const tracker = new FishNetCombatTracker();
    const [cast] = tracker.consume(castTargeting(1, 10, "Sanctuary", 20));
    tracker.consume(statusEffect(2, 20, "ApplyEffect_T", [field("statusId", "Regeneration"), field("level", 1)]));
    const [firstTick] = tracker.consume(recover(32, 20, 50));
    const [secondTick] = tracker.consume(recover(62, 20, 50));

    const activationId = cast && "activationId" in cast ? cast.activationId : undefined;
    expect(firstTick).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 10,
      sourceId: "Sanctuary",
      attribution: "inferred",
      activationId,
    });
    expect(secondTick).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 10,
      sourceId: "Sanctuary",
      attribution: "inferred",
      activationId,
    });
  });

  test("stops attributing Recover_C ticks once RemoveEffect_T clears the Regeneration status", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(castTargeting(1, 10, "GuardianBond", 20));
    tracker.consume(statusEffect(2, 20, "ApplyEffect_T", [field("statusId", "Regeneration"), field("level", 1)]));
    tracker.consume(statusEffect(32, 20, "RemoveEffect_T", [field("statusId", "Regeneration"), field("level", 1)]));
    const [heal] = tracker.consume(recover(62, 20, 50));

    expect(heal).toMatchObject({ kind: "heal", attribution: "unattributed", actorId: undefined });
  });

  test("marks Recover_C ticks under an ambiguous Regeneration status as ambiguous", () => {
    const tracker = new FishNetCombatTracker();
    const [first] = tracker.consume(castTargeting(1, 10, "Sanctuary", 20));
    const [second] = tracker.consume(castTargeting(2, 11, "SanctuaryField", 20));
    tracker.consume(statusEffect(3, 20, "ApplyEffect_T", [field("statusId", "Regeneration"), field("level", 1)]));
    const [heal] = tracker.consume(recover(32, 20, 50));

    expect(heal).toMatchObject({
      kind: "heal",
      attribution: "ambiguous",
      actorId: undefined,
      candidateActivationIds: [
        first && "activationId" in first ? first.activationId : undefined,
        second && "activationId" in second ? second.activationId : undefined,
      ],
    });
  });
});
