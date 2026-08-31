import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket, FishNetDecodedField } from "../types.ts";
import { FishNetEternalTowerTracker } from "./eternal-tower.ts";

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

const stringField = (name: string, value: string): FishNetDecodedField => ({
  name,
  typeName: "System.String",
  codec: "stringUtf8Packed",
  value,
});

const intField = (name: string, value: number): FishNetDecodedField => ({
  name,
  typeName: "System.Int32",
  codec: "packedInt32",
  value,
});

describe("FishNetEternalTowerTracker", () => {
  test("reads the floor from a DrawTitle banner", () => {
    const tracker = new FishNetEternalTowerTracker();

    expect(tracker.consume(packet("DrawTitle", [
      stringField("title", "The Echoing Spire\nFloor 12"),
    ], 10))).toBe(true);
    expect(tracker.current()).toEqual({
      known: true,
      inTower: true,
      floor: 12,
      towerName: "The Echoing Spire",
      source: "DrawTitle",
      updatedTick: 10,
    });
  });

  test("advances the floor on a later DrawTitle without needing a reset in between", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 1")], 1));

    expect(tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 2")], 2)))
      .toBe(true);
    expect(tracker.current()).toMatchObject({ floor: 2 });
  });

  test("ignores a title that does not match the floor banner shape", () => {
    const tracker = new FishNetEternalTowerTracker();
    expect(tracker.consume(packet("DrawTitle", [stringField("title", "Welcome back!")]))).toBe(false);
    expect(tracker.current()).toEqual({ known: false, inTower: false });
  });

  test("confirms tower entry and captures the instance id from ClientInstancedMapReady", () => {
    const tracker = new FishNetEternalTowerTracker();

    expect(tracker.consume(packet("ClientInstancedMapReady", [
      intField("mapId", 50),
      intField("localMapInstanceId", 1000000001),
      stringField("instancedMapFlowId", "flow-1"),
      stringField("instancedMapId", "map-1"),
      stringField("admissionId", "admission-1"),
      stringField("bindingSlot", "et"),
      stringField("bindingToken", "token-1"),
    ], 5))).toBe(true);
    expect(tracker.current()).toMatchObject({
      known: true,
      inTower: true,
      instanceId: 1000000001,
      instancedMapId: "map-1",
      source: "ClientInstancedMapReady",
    });
  });

  test("merges DrawTitle and ClientInstancedMapReady into one snapshot regardless of order", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("ClientInstancedMapReady", [
      intField("localMapInstanceId", 7),
      stringField("instancedMapId", "map-7"),
      stringField("bindingSlot", "et"),
    ], 1));
    tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 4")], 2));

    expect(tracker.current()).toMatchObject({
      floor: 4,
      towerName: "The Echoing Spire",
      instanceId: 7,
      instancedMapId: "map-7",
    });
  });

  test("clears tower state once bound to a non-tower instanced map", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 4")], 1));

    expect(tracker.consume(packet("ClientInstancedMapReady", [
      intField("localMapInstanceId", 99),
      stringField("bindingSlot", "farm"),
    ], 2))).toBe(true);
    expect(tracker.current()).toEqual({ known: false, inTower: false });
  });

  test("does not reset on authenticated or disconnect - floor survives a same-instance reconnect", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 25")], 1));

    const reconnect = packet("", []);
    reconnect.packetName = "authenticated";
    expect(tracker.consume(reconnect)).toBe(false);
    expect(tracker.current()).toMatchObject({ known: true, floor: 25 });

    const disconnect = packet("", []);
    disconnect.packetName = "disconnect";
    expect(tracker.consume(disconnect)).toBe(false);
    expect(tracker.current()).toMatchObject({ known: true, floor: 25 });
  });

  test("ignores traffic from an unrelated behaviour", () => {
    const tracker = new FishNetEternalTowerTracker();
    const other = packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 4")]);
    other.networkBehaviourType = "MonsterController";

    expect(tracker.consume(other)).toBe(false);
    expect(tracker.current()).toEqual({ known: false, inTower: false });
  });

  test("reset() clears an explicitly-tracked floor", () => {
    const tracker = new FishNetEternalTowerTracker();
    tracker.consume(packet("DrawTitle", [stringField("title", "The Echoing Spire\nFloor 4")]));

    expect(tracker.reset()).toBe(true);
    expect(tracker.current()).toEqual({ known: false, inTower: false });
    expect(tracker.reset()).toBe(false);
  });
});
