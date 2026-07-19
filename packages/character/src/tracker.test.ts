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
});
