import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket, FishNetDecodedField } from "./types.ts";
import { FishNetEternalTowerTracker } from "./eternal-tower-tracker.ts";

function packet(rpcName: string, decodedFields: FishNetDecodedField[], tick = 1): CapturedFishNetPacket {
  return {
    tick,
    packetId: 3,
    packetName: "targetRpc",
    rpcName,
    networkBehaviourType: "PlayerController",
    decodedFields,
    raw: Buffer.alloc(0),
    payload: Buffer.alloc(0),
    connectionId: "synthetic-tower",
  } as CapturedFishNetPacket;
}

const packed = (name: string, value: number): FishNetDecodedField => ({
  name,
  typeName: "System.Int32",
  codec: "packedInt32",
  value,
});

describe("FishNetEternalTowerTracker", () => {
  test("initializes from a complete ETUpdateRun snapshot", () => {
    const tracker = new FishNetEternalTowerTracker();

    expect(tracker.consume(packet("ETUpdateRun", [
      packed("match.InstanceId", 17),
      packed("match.PartyId", 23),
      packed("match.State", 2),
      packed("match.Floor", 42),
    ], 10))).toBe(true);
    expect(tracker.current()).toEqual({
      known: true,
      inTower: true,
      active: true,
      phase: "inRun",
      stateValue: 2,
      floor: 42,
      instanceId: 17,
      partyId: 23,
      finished: false,
      source: "ETUpdateRun",
      updatedTick: 10,
    });
  });

  test("distinguishes acceptance, completion, and leaving the instance", () => {
    const tracker = new FishNetEternalTowerTracker();

    tracker.consume(packet("ETUpdateRun", [
      packed("match.State", 1),
      packed("match.Floor", 8),
    ]));
    expect(tracker.current()).toMatchObject({ active: true, inTower: false, phase: "accept", floor: 8 });

    tracker.consume(packet("ETAdvanceFloor", [
      packed("floor", 8),
      { name: "finished", typeName: "System.Boolean", codec: "boolean", value: true },
    ], 2));
    expect(tracker.current()).toMatchObject({ active: false, inTower: true, phase: "finished", floor: 8 });

    tracker.consume(packet("ETUpdateRun", [
      { name: "match", typeName: "EternalTowerRun", codec: "nullable", value: null },
    ], 3));
    expect(tracker.current()).toMatchObject({ known: true, active: false, inTower: false, phase: "none" });
    expect(tracker.current().floor).toBeUndefined();
  });

  test("can initialize after capture starts mid-run from an advance message", () => {
    const tracker = new FishNetEternalTowerTracker();

    expect(tracker.consume(packet("ETAdvanceFloor", [
      packed("floor", 19),
      { name: "finished", typeName: "System.Boolean", codec: "boolean", value: false },
    ]))).toBe(true);
    expect(tracker.current()).toMatchObject({ known: true, inTower: true, active: true, floor: 19 });
  });

  test("does not treat enter or leave requests as authoritative transitions", () => {
    const tracker = new FishNetEternalTowerTracker();
    const enter = packet("ETEnter", []);
    enter.packetName = "serverRpc";
    const leave = packet("ETLeave", []);
    leave.packetName = "serverRpc";

    expect(tracker.consume(enter)).toBe(false);
    expect(tracker.consume(leave)).toBe(false);
    expect(tracker.current()).toEqual({ known: false, inTower: false, active: false, phase: "unknown" });
  });

  test("resets when its authoritative transport disconnects", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("ETAdvanceFloor", [
      packed("floor", 3),
      { name: "finished", typeName: "System.Boolean", codec: "boolean", value: false },
    ]));
    const disconnect = packet("", []);
    disconnect.packetName = "disconnect";

    expect(tracker.consume(disconnect)).toBe(true);
    expect(tracker.current().known).toBe(false);
  });
});
