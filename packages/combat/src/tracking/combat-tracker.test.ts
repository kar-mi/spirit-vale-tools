import { describe, expect, test } from "bun:test";

import { FishNetCombatTracker } from "./combat-tracker.ts";
import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetSkillCatalog } from "@kar-mi/spirit-vale-tools-skills";
import {
  packet,
  field,
  cast,
  damage,
  death,
  castTargeting,
  autoCastTargeting,
  recover,
  statusEffect,
  bondSync,
  objectSpawn,
  summonCalibration,
  packed,
  effectEntry,
  effectDisplayPayload,
  ambiguousObserver,
} from "../testing/combat-packets.ts";

describe("FishNetCombatTracker", () => {
  test("emits one flat monster identity event instead of repeating identity on hits", () => {
    const tracker = new FishNetCombatTracker({
      monsterCatalog: new Map([["fictional_mob", { level: 2, displayName: "Fictional Mob" }]]),
    });
    const sync = {
      tick: 1, packetId: 1, packetName: "syncType", objectId: 52,
      networkBehaviourType: "MonsterController", raw: Buffer.alloc(0), payload: Buffer.alloc(0),
      decodedFields: [field("Data.Id", "fictional_mob"), field("Data.Level", 2), field("Data.Rank", 0)],
    } satisfies DecodedFishNetPacket;

    expect(tracker.consume(sync)).toEqual([{
      kind: "monsterIdentity", operation: "upsert", tick: 1, actorId: 52,
      mobId: "fictional_mob", displayName: "Fictional Mob",
    }]);
    expect(tracker.consume({ ...sync, tick: 2 })).toEqual([]);

    const [hit] = tracker.consume(damage(3, 52, 10, "skill:strike", 100));
    expect(hit).not.toHaveProperty("targetIdentity");
  });

  test("names an anonymous boss from a curated distinctive skill", () => {
    const tracker = new FishNetCombatTracker({
      bossCatalog: new Map([["UmbralWide", { displayName: "Umbral Warden" }]]),
    });

    expect(tracker.consume(cast(1, 54777, "UmbralWide"))).toMatchObject([
      { kind: "activation", actorId: 54777, sourceId: "UmbralWide" },
      { kind: "monsterIdentity", operation: "upsert", actorId: 54777, mobId: "boss:UmbralWide", displayName: "Umbral Warden" },
    ]);
  });

  test("does not override a game-provided monster identity with a curated boss mapping", () => {
    const tracker = new FishNetCombatTracker({
      monsterCatalog: new Map([["authoritative_mob", { level: 2, displayName: "Authoritative Mob" }]]),
      bossCatalog: new Map([["UmbralWide", { displayName: "Curated Boss" }]]),
    });
    tracker.consume({
      tick: 1, packetId: 1, packetName: "syncType", objectId: 54777,
      networkBehaviourType: "MonsterController", raw: Buffer.alloc(0), payload: Buffer.alloc(0),
      decodedFields: [field("Data.Id", "authoritative_mob"), field("Data.Level", 2), field("Data.Rank", 0)],
    });

    expect(tracker.consume(cast(2, 54777, "UmbralWide"))).toEqual([
      expect.objectContaining({ kind: "activation", actorId: 54777, sourceId: "UmbralWide" }),
    ]);
  });

  test("drops a curated boss name when its object id is reused", () => {
    const tracker = new FishNetCombatTracker({
      bossCatalog: new Map([
        ["OldBossSkill", { displayName: "Old Boss" }],
        ["NewBossSkill", { displayName: "New Boss" }],
      ]),
    });
    tracker.consume(cast(1, 54777, "OldBossSkill"));

    expect(tracker.consume({
      tick: 2, packetId: 1, packetName: "objectSpawn", objectId: 54777,
      raw: Buffer.alloc(0), payload: Buffer.alloc(0),
    })).toEqual([{ kind: "monsterIdentity", operation: "remove", tick: 2, actorId: 54777 }]);
    expect(tracker.consume(cast(3, 54777, "NewBossSkill"))).toMatchObject([
      { kind: "activation", actorId: 54777, sourceId: "NewBossSkill" },
      { kind: "monsterIdentity", operation: "upsert", actorId: 54777, displayName: "New Boss" },
    ]);
  });
  describe("toggled skills", () => {
    test("emits an activation naming the toggled skill", () => {
      const tracker = new FishNetCombatTracker();
      // A toggle names its skill in a bare `id`, not in the SkillStateDto a cast carries.
      const events = tracker.consume(packet(1, 50, "SkillsComponent", "ToggleBegin_C", [field("id", "SilentEdge")]));
      expect(events).toEqual([
        expect.objectContaining({ kind: "activation", rpc: "ToggleBegin_C", actorId: 50, sourceId: "SilentEdge", phase: "begin" }),
      ]);
    });

    test("ignores a toggle whose skill id did not decode", () => {
      const tracker = new FishNetCombatTracker();
      expect(tracker.consume(packet(1, 50, "SkillsComponent", "ToggleBegin_C"))).toEqual([]);
    });
  });

  describe("skill display feed", () => {
    test("maps applies and removes onto status events", () => {
      const tracker = new FishNetCombatTracker();
      expect(tracker.consume(packet(1, 60, "StatusComponent", "ApplySkillDisplay_O", [
        field("id", "SilentEdge"),
        field("lv", 3),
      ]))).toEqual([
        expect.objectContaining({ kind: "status", rpc: "ApplySkillDisplay_O", actorId: 60, statusId: "SilentEdge", level: 3, action: "applied" }),
      ]);
      expect(tracker.consume(packet(2, 60, "StatusComponent", "RemoveSkillDisplay_O", [field("id", "SilentEdge")]))).toEqual([
        expect.objectContaining({ kind: "status", rpc: "RemoveSkillDisplay_O", statusId: "SilentEdge", action: "removed" }),
      ]);
    });

    test("carries no timing, so no remainingSeconds is invented", () => {
      const tracker = new FishNetCombatTracker();
      const [event] = tracker.consume(packet(1, 60, "StatusComponent", "ApplySkillDisplay_O", [field("id", "FlowState")]));
      expect(event).not.toHaveProperty("remainingSeconds");
    });

    test("skips an entry whose id did not decode", () => {
      const tracker = new FishNetCombatTracker();
      expect(tracker.consume(packet(1, 60, "StatusComponent", "ApplySkillDisplay_O"))).toEqual([]);
    });
  });

  describe("recovering ambiguous current-build combat payloads", () => {
    test("recovers an exact effect-display batch on current status component positions", () => {
      const tracker = new FishNetCombatTracker();
      const payload = effectDisplayPayload(
        [effectEntry("FictionalWard", 4.5, 2, 5)],
        ["FictionalHaste"],
      );

      expect(tracker.consume(ambiguousObserver(1, 70, 5, 5, payload))).toEqual([
        expect.objectContaining({
          kind: "status",
          rpc: "ApplyEffectDisplays_O",
          actorId: 70,
          statusId: "FictionalWard",
          action: "applied",
          remainingSeconds: 4.5,
          stacks: 2,
        }),
        expect.objectContaining({
          kind: "status",
          rpc: "ApplyEffectDisplays_O",
          actorId: 70,
          statusId: "FictionalHaste",
          action: "removed",
        }),
      ]);
      expect(tracker.consume(ambiguousObserver(2, 71, 4, 5, payload))).toEqual([]);
      expect(tracker.consume(ambiguousObserver(3, 71, 5, 5, Buffer.concat([payload, Buffer.from([0xff])])))).toEqual([]);
    });

    test("recovers Health Recover_C only from structurally valid settings on generated component positions", () => {
      const tracker = new FishNetCombatTracker();
      const standardSettings = Buffer.from("0000ac0200000000", "hex");
      const payload = Buffer.concat([packed(37), standardSettings]);

      expect(tracker.consume(ambiguousObserver(1, 72, 2, 1, payload))).toEqual([
        expect.objectContaining({
          kind: "heal",
          rpc: "Recover_C",
          targetId: 72,
          value: 37,
          recoveryStyle: "standard",
        }),
      ]);
      expect(tracker.consume(ambiguousObserver(2, 73, 4, 1, payload))).toEqual([]);
      expect(tracker.consume(ambiguousObserver(3, 73, 2, 1, Buffer.concat([packed(37), Buffer.alloc(8, 0xff)]))))
        .toEqual([]);
    });
  });

  describe("full heals", () => {
    test("emits a fullHeal for an empty FullHeal_C", () => {
      const tracker = new FishNetCombatTracker();
      expect(tracker.consume(packet(1, 8100, "PlayerController", "FullHeal_C"))).toEqual([
        expect.objectContaining({ kind: "fullHeal", rpc: "FullHeal_C", targetId: 8100 }),
      ]);
    });

    test("credits no actor, so no meter can attribute it", () => {
      const tracker = new FishNetCombatTracker();
      const [event] = tracker.consume(packet(1, 8100, "PlayerController", "FullHeal_C"));
      expect(event).not.toHaveProperty("actorId");
      expect(event).not.toHaveProperty("value");
    });

    test("ignores a FullHeal_C carrying a payload", () => {
      // FullHeal_C declares no arguments, so bytes on the wire mean the hash was misread: the low byte of a 16-bit hash can collide with it.
      const tracker = new FishNetCombatTracker();
      const misread = packet(1, 8101, "PlayerController", "FullHeal_C");
      misread.payload = Buffer.from([0x66]);
      expect(tracker.consume(misread)).toEqual([]);
    });
  });

  function loadCharacterEffects(
    tick: number,
    actorId: number,
    effects: readonly { statusId: string; level: number; duration: number; stacks: number }[],
  ): DecodedFishNetPacket {
    const result = packet(tick, actorId, "PlayerSave", "LoadCharacter_T", [
      field("data.State.Effects.length", effects.length),
      ...effects.flatMap((effect, index) => [
        field(`data.State.Effects[${index}].Id`, effect.statusId),
        field(`data.State.Effects[${index}].Level`, effect.level),
        field(`data.State.Effects[${index}].Duration`, effect.duration),
        field(`data.State.Effects[${index}].Stacks`, effect.stacks),
      ]),
    ]);
    result.rpcResolution = "verified";
    return result;
  }

  test("restores an effect still active at login from LoadCharacter_T, since no other packet reports it", () => {
    const tracker = new FishNetCombatTracker();
    const events = tracker.consume(loadCharacterEffects(1, 10, [
      { statusId: "WindAttunement", level: 3, duration: 21, stacks: 0 },
      { statusId: "Ruthless", level: 1, duration: 0.833, stacks: 0 },
    ]));
    expect(events).toEqual([
      expect.objectContaining({
        kind: "status", rpc: "LoadCharacter_T", actorId: 10,
        statusId: "WindAttunement", level: 3, action: "applied", remainingSeconds: 21,
      }),
      expect.objectContaining({
        kind: "status", rpc: "LoadCharacter_T", actorId: 10,
        statusId: "Ruthless", level: 1, action: "applied", remainingSeconds: 0.833,
      }),
    ]);
  });

  test("emits nothing for a LoadCharacter_T with no active effects", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(loadCharacterEffects(1, 10, []))).toEqual([]);
  });

  test("fails closed when generated login-effect fields are absent, partial, or leave trailing data", () => {
    const tracker = new FishNetCombatTracker();
    const absent = packet(1, 10, "PlayerSave", "LoadCharacter_T");
    absent.rpcResolution = "verified";
    expect(tracker.consume(absent)).toEqual([]);

    const partial = loadCharacterEffects(2, 10, [{ statusId: "WindAttunement", level: 3, duration: 21, stacks: 0 }]);
    partial.decodedFields = partial.decodedFields?.filter(({ name }) => name !== "data.State.Effects[0].Level");
    expect(tracker.consume(partial)).toEqual([]);

    const trailing = loadCharacterEffects(3, 10, [{ statusId: "WindAttunement", level: 3, duration: 21, stacks: 0 }]);
    trailing.undecodedPayload = Buffer.from([0xff]);
    expect(tracker.consume(trailing)).toEqual([]);
  });

  test("ignores a LoadCharacter_T unless its component resolution is verified", () => {
    const tracker = new FishNetCombatTracker();
    const recovered = loadCharacterEffects(1, 10, [{ statusId: "WindAttunement", level: 3, duration: 21, stacks: 0 }]);
    recovered.rpcResolution = "recovered";
    expect(tracker.consume(recovered)).toEqual([]);
  });

  test("tracks clone death, player death, and manual-despawn calibration sequence", () => {
    const tracker = new FishNetCombatTracker();
    const stacks = (tick: number, count: number) => tracker.consume(summonCalibration(
      tick,
      10,
      Array.from({ length: count }, () => "FictionalClone"),
    ));

    expect(stacks(1, 2)[0]).toMatchObject({ stacks: 2 });
    expect(stacks(2, 3)[0]).toMatchObject({ stacks: 3 });
    expect(stacks(3, 2)[0]).toMatchObject({ stacks: 2 });
    expect(stacks(4, 0)[0]).toMatchObject({ stacks: 0 });
    expect(stacks(5, 2)[0]).toMatchObject({ stacks: 2 });
    expect(stacks(6, 1)[0]).toMatchObject({ stacks: 1 });
    expect(stacks(7, 0)[0]).toMatchObject({ stacks: 0 });
  });

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
      attribution: "inferred",
      activationId: cast && "activationId" in cast ? cast.activationId : undefined,
    });
  });

  test("uses AutoCast_C's NetworkObject target to attribute a heal", () => {
    const tracker = new FishNetCombatTracker();
    const [cast] = tracker.consume(autoCastTargeting(1, 10, "Heal", 20));
    const [heal] = tracker.consume(recover(2, 20, 150));

    expect(cast).toMatchObject({ kind: "activation", rpc: "AutoCast_C", targetId: 20 });
    expect(heal).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 10,
      sourceId: "Heal",
      attribution: "inferred",
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

  test("attributes a negative ApplyDamage_C value directly to its healer", () => {
    const identity = { displayName: "Synthetic Healer" };
    const tracker = new FishNetCombatTracker({
      actorIdentityResolver: (actorId) => actorId === 10 ? identity : undefined,
    });

    const events = tracker.consume(damage(1, 20, 10, "Heal", -150));

    expect(events).toEqual([
      expect.objectContaining({
        kind: "heal",
        rpc: "ApplyDamage_C",
        targetId: 20,
        actorId: 10,
        sourceId: "Heal",
        sourceLabel: "Heal",
        value: 150,
        attribution: "exact",
        actorIdentity: identity,
      }),
    ]);
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

  test("uses BondSync to recover a Guardian Bond caster when the cast packet was missed", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(bondSync(1, 20, [{ otherId: 10, skillId: "GuardianBond", caster: false }]));
    const [heal] = tracker.consume(recover(2, 20, 50));

    expect(heal).toMatchObject({
      kind: "heal",
      targetId: 20,
      actorId: 10,
      sourceId: "GuardianBond",
      sourceLabel: "Guardian Bond",
      attribution: "inferred",
    });
  });

  test("drops Guardian Bond attribution when an object id is reused without BondSync", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(bondSync(1, 20, [{ otherId: 10, skillId: "GuardianBond", caster: false }]));

    tracker.consume(objectSpawn(2, 20));

    expect(tracker.consume(recover(3, 20, 50))).toEqual([
      expect.objectContaining({ kind: "heal", targetId: 20, attribution: "unattributed" }),
    ]);
  });

  test("does not treat the caster-side BondSync entry as another healer", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(bondSync(1, 10, [{ otherId: 20, skillId: "GuardianBond", caster: true }]));
    const [heal] = tracker.consume(recover(2, 10, 50));

    expect(heal).toMatchObject({ kind: "heal", targetId: 10, attribution: "unattributed" });
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
