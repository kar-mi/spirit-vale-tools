import { describe, expect, test } from "bun:test";

import { FishNetCombatTracker } from "./combat-tracker.ts";
import {
  field,
  objectDespawn,
  packet,
  summonCalibration,
  summonSkillSync,
  summonerSyncOnly,
} from "../testing/combat-packets.ts";

describe("FishNetSummonTracker (via FishNetCombatTracker)", () => {
  test("emits changed summon stack counts from authoritative calibration snapshots", () => {
    const tracker = new FishNetCombatTracker();

    expect(tracker.consume(summonCalibration(1, 10, ["FictionalClone"]))).toEqual([
      expect.objectContaining({ kind: "summon", actorId: 10, skillId: "FictionalClone", stacks: 1 }),
    ]);
    expect(tracker.consume(summonCalibration(2, 10, ["FictionalClone", "FictionalClone"]))).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 2 }),
    ]);
    expect(tracker.consume(summonCalibration(3, 10, ["FictionalClone", "FictionalClone"]))).toEqual([]);
    expect(tracker.consume(summonCalibration(4, 10, ["FictionalClone", "FictionalPet"]))).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 1 }),
      expect.objectContaining({ skillId: "FictionalPet", stacks: 1 }),
    ]);
    expect(tracker.consume(summonCalibration(5, 10, []))).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 0 }),
      expect.objectContaining({ skillId: "FictionalPet", stacks: 0 }),
    ]);
  });

  test("re-emits a summon snapshot after a connection reset", () => {
    const tracker = new FishNetCombatTracker();
    const twoClones = summonCalibration(1, 10, ["FictionalClone", "FictionalClone"]);
    expect(tracker.consume(twoClones)).toHaveLength(1);
    expect(tracker.consume({ ...packet(2, 0, "", ""), packetName: "authenticated", rpcName: undefined, objectId: undefined })).toEqual([]);
    expect(tracker.consume({ ...twoClones, tick: 3 })).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 2 }),
    ]);
  });

  test("ignores malformed summon snapshots without losing the last valid count", () => {
    const tracker = new FishNetCombatTracker();
    const twoClones = summonCalibration(1, 10, ["FictionalClone", "FictionalClone"]);
    tracker.consume(twoClones);
    const malformed = summonCalibration(2, 10, ["FictionalClone"]);
    malformed.payload = malformed.payload.subarray(0, malformed.payload.length - 1);
    malformed.decodedFields = malformed.decodedFields?.filter(({ name }) => name !== "data[0].Level");
    expect(tracker.consume(malformed)).toEqual([]);
    expect(tracker.consume({ ...twoClones, tick: 3 })).toEqual([]);
  });

  test("treats a null summon array as an empty authoritative snapshot", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(summonCalibration(1, 10, ["FictionalClone"]));
    const nullSnapshot = summonCalibration(2, 10, []);
    nullSnapshot.payload = Buffer.from([1]);
    expect(tracker.consume(nullSnapshot)).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 0 }),
    ]);
  });

  test("fails closed when generated summon fields are absent, partial, or leave trailing data", () => {
    const tracker = new FishNetCombatTracker();
    const absent = packet(1, 10, "SummoningComponent", "CalibrateSummons_T");
    absent.rpcResolution = "verified";
    absent.payload = Buffer.from([2, 1, 65]);
    expect(tracker.consume(absent)).toEqual([]);

    const partial = summonCalibration(2, 10, ["FictionalClone"]);
    partial.decodedFields = partial.decodedFields?.filter(({ name }) => name !== "data[0].Level");
    expect(tracker.consume(partial)).toEqual([]);

    const trailing = summonCalibration(3, 10, ["FictionalClone"]);
    trailing.undecodedPayload = Buffer.from([0xff]);
    expect(tracker.consume(trailing)).toEqual([]);
  });

  test("counts an anonymous stack summon (e.g. a shinobi clone) whose entries carry a null Id", () => {
    const tracker = new FishNetCombatTracker();
    const clones = packet(1, 10, "SummoningComponent", "CalibrateSummons_T", [
      field("data.length", 3),
      ...[0, 1, 2].flatMap((index) => [
        field(`data[${index}].SkillId`, "ShadowSeal"),
        field(`data[${index}].Id`, null),
        field(`data[${index}].Level`, 0),
      ]),
    ]);
    clones.rpcResolution = "verified";
    expect(tracker.consume(clones)).toEqual([
      expect.objectContaining({ kind: "summon", skillId: "ShadowSeal", stacks: 3 }),
    ]);
  });

  test("falls back to SummonSkillSync for a summon restored at login, before any CalibrateSummons_T arrives", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(summonSkillSync(1, 20, "FictionalClone", 10))).toEqual([
      expect.objectContaining({ kind: "summon", rpc: "SummonSkillSync", actorId: 10, skillId: "FictionalClone", stacks: 1 }),
    ]);
  });

  test("credits no one for a summon whose SummonerSync has never been seen", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(summonSkillSync(1, 20, "FictionalClone"))).toEqual([]);
  });

  test("counts the summon once SummonerSync arrives, even when SummonSkillSync was reported first", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(summonSkillSync(1, 20, "FictionalClone"))).toEqual([]);
    expect(tracker.consume(summonerSyncOnly(2, 20, 10))).toEqual([
      expect.objectContaining({ actorId: 10, skillId: "FictionalClone", stacks: 1 }),
    ]);
  });

  test("counts two summon objects reporting the same skill as two stacks, not one", () => {
    const tracker = new FishNetCombatTracker();
    expect(tracker.consume(summonSkillSync(1, 20, "SummonSkeleton", 10))).toEqual([
      expect.objectContaining({ actorId: 10, skillId: "SummonSkeleton", stacks: 1 }),
    ]);
    expect(tracker.consume(summonSkillSync(2, 21, "SummonSkeleton", 10))).toEqual([
      expect.objectContaining({ actorId: 10, skillId: "SummonSkeleton", stacks: 2 }),
    ]);
  });

  test("a second summon object still needs its own SummonerSync, even once another object's owner is known", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(summonSkillSync(1, 20, "SummonSkeleton", 10));
    expect(tracker.consume(summonSkillSync(2, 21, "SummonSkeleton"))).toEqual([]);
  });

  test("ignores a duplicate SummonSkillSync for the same object", () => {
    const tracker = new FishNetCombatTracker();
    const sync = summonSkillSync(1, 20, "FictionalClone", 10);
    tracker.consume(sync);
    expect(tracker.consume(sync)).toEqual([]);
  });

  test("corrects the stack count when a summon object despawns, and forgets its owner/skill", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(summonSkillSync(1, 20, "SummonSkeleton", 10));
    tracker.consume(summonSkillSync(2, 21, "SummonSkeleton", 10));
    expect(tracker.consume(objectDespawn(3, 20))).toEqual([
      expect.objectContaining({ actorId: 10, skillId: "SummonSkeleton", stacks: 1 }),
    ]);

    // The despawned id is reused by an unrelated summon for a different actor - no leftover attribution.
    expect(tracker.consume(summonSkillSync(4, 20, "SummonCactus"))).toEqual([]);
    expect(tracker.consume(summonerSyncOnly(5, 20, 99))).toEqual([
      expect.objectContaining({ actorId: 99, skillId: "SummonCactus", stacks: 1 }),
    ]);
  });

  test("lets a later CalibrateSummons_T snapshot supersede a SummonSkillSync fallback", () => {
    const tracker = new FishNetCombatTracker();
    const sync = summonSkillSync(1, 20, "FictionalClone", 10);
    tracker.consume(sync);
    // A duplicate sync for the same known object emits nothing more.
    expect(tracker.consume(sync)).toEqual([]);
    expect(tracker.consume(summonCalibration(2, 10, ["FictionalClone", "FictionalClone"]))).toEqual([
      expect.objectContaining({ skillId: "FictionalClone", stacks: 2 }),
    ]);
  });

  test("stops applying the SummonSkillSync fallback for an actor once a CalibrateSummons_T snapshot has been seen", () => {
    const tracker = new FishNetCombatTracker();
    tracker.consume(summonCalibration(1, 10, ["FictionalClone"]));
    // A summon object despawning after the batch RPC now owns this actor must not double-decrement.
    tracker.consume(summonSkillSync(2, 20, "FictionalClone", 10));
    expect(tracker.consume(objectDespawn(3, 20))).toEqual([]);
  });

  test("ignores a named summon calibration unless its component resolution is verified", () => {
    const tracker = new FishNetCombatTracker();
    const recovered = summonCalibration(1, 10, ["FictionalClone"]);
    recovered.rpcResolution = "recovered";
    expect(tracker.consume(recovered)).toEqual([]);

    const unbound = summonCalibration(2, 10, ["FictionalClone"]);
    unbound.networkBehaviourType = undefined;
    expect(tracker.consume(unbound)).toEqual([]);
  });
});
