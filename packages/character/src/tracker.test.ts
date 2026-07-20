import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket } from "@spiritvale/core";
import { FishNetCharacterTracker } from "./tracker.ts";
import { syntheticCharacter } from "./synthetic-character.test-helper.ts";

function characterPacket(rpcName?: string): CapturedFishNetPacket {
  return {
    tick: 1,
    packetId: 1,
    packetName: "targetRpc",
    ...(rpcName === undefined ? {} : { rpcName }),
    raw: Buffer.alloc(0),
    payload: syntheticCharacter(true),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

describe("FishNetCharacterTracker", () => {
  test("accepts a uniquely resolved character RPC without a behaviour type", () => {
    const tracker = new FishNetCharacterTracker();

    expect(tracker.consume(characterPacket("CharacterCallback_T"))).toBe(true);
    expect(tracker.state()).toMatchObject({ status: "live" });
    expect(tracker.state().stats).not.toHaveLength(0);
  });

  test("rejects packets without a character RPC name", () => {
    const tracker = new FishNetCharacterTracker();

    expect(tracker.consume(characterPacket())).toBe(false);
    expect(tracker.consume(characterPacket("UnrelatedRpc"))).toBe(false);
    expect(tracker.state()).toMatchObject({ status: "waiting", stats: [] });
  });

  test("reports unsupported status when a named character payload cannot be decoded", () => {
    const tracker = new FishNetCharacterTracker();
    const packet = characterPacket("LoadCharacter_T");
    packet.payload = Buffer.from([0xff]);

    expect(tracker.consume(packet)).toBe(true);
    expect(tracker.state()).toMatchObject({ status: "unsupported", stats: [] });
    expect(tracker.state().statusDetail).toStartWith("Character data isn't recognized:");
    expect(tracker.state().statusDetail).toContain("Change maps or channels");
  });

  test("records server-synced values for the local player and merges them onto stats", () => {
    const tracker = new FishNetCharacterTracker();
    tracker.consume(characterPacket("CharacterCallback_T"));

    // Ignored until a serverRpc pins the local player's object.
    expect(tracker.consume(syncPacket(47472, "HealthComponent", "01e8ce0100e8ce01"))).toBe(false);
    tracker.consume({ ...syncPacket(47472, "HealthComponent", ""), packetName: "serverRpc", payload: Buffer.alloc(0) });

    expect(tracker.consume(syncPacket(47472, "HealthComponent", "01e8ce0100e8ce01"))).toBe(true);
    expect(tracker.consume(syncPacket(47472, "MoveComponent", "01cdcc0e41"))).toBe(true);
    // Syncs for other objects never contribute records.
    expect(tracker.consume(syncPacket(99999, "HealthComponent", "00dcad01"))).toBe(false);

    const state = tracker.state();
    expect(state.records).toMatchObject({ currentHealth: 13_236, maxHealth: 13_236 });
    expect(state.records?.moveSpeed).toBeCloseTo(8.925, 3);
    expect(state.stats.find((stat) => stat.id === "max-health")?.record).toBe(13_236);
    expect(state.stats.find((stat) => stat.id === "move-speed")?.record).toBeCloseTo(8.925, 3);
  });
});

function syncPacket(objectId: number, networkBehaviourType: string, payloadHex: string): CapturedFishNetPacket {
  return {
    tick: 2,
    packetId: 7,
    packetName: "syncType",
    objectId,
    networkBehaviourType,
    raw: Buffer.alloc(0),
    payload: Buffer.from(payloadHex, "hex"),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}
