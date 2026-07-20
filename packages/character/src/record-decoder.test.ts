import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket } from "@spiritvale/core";
import { decodeCharacterRecordSync } from "./record-decoder.ts";

function syncPacket(networkBehaviourType: string | undefined, payloadHex: string): CapturedFishNetPacket {
  return {
    tick: 1,
    packetId: 7,
    packetName: "syncType",
    objectId: 47472,
    ...(networkBehaviourType === undefined ? {} : { networkBehaviourType }),
    raw: Buffer.alloc(0),
    payload: Buffer.from(payloadHex, "hex"),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

describe("decodeCharacterRecordSync", () => {
  test("decodes current and maximum HP from a captured HealthComponent sync", () => {
    // Real payload from the local player at full health: both syncvars read 13,236.
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "01e8ce0100e8ce01")))
      .toEqual({ currentHealth: 13_236, maxHealth: 13_236 });
  });

  test("decodes a current-HP-only sync during combat", () => {
    // Real payload from a fighting unit: only syncvar 0 (current HP) present.
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "00dcad01")))
      .toEqual({ currentHealth: 11_118 });
  });

  test("decodes mana from a SkillsComponent sync", () => {
    expect(decodeCharacterRecordSync(syncPacket("SkillsComponent", "018205008205")))
      .toEqual({ currentMana: 321, maxMana: 321 });
  });

  test("decodes the move-speed float from a MoveComponent sync", () => {
    // Real payload: syncvar 1 float 8.925 (base 7.5 with +19% gear).
    const update = decodeCharacterRecordSync(syncPacket("MoveComponent", "01cdcc0e41"));
    expect(update?.moveSpeed).toBeCloseTo(8.925, 3);
  });

  test("skips the MoveComponent state byte before the speed float", () => {
    const update = decodeCharacterRecordSync(syncPacket("MoveComponent", "000801cdcc0e41"));
    expect(update?.moveSpeed).toBeCloseTo(8.925, 3);
  });

  test("ignores unsupported components, truncated payloads, and implausible values", () => {
    expect(decodeCharacterRecordSync(syncPacket("StatusComponent", "025a01b001000672616b1800"))).toBeUndefined();
    expect(decodeCharacterRecordSync(syncPacket(undefined, "00dcad01"))).toBeUndefined();
    expect(decodeCharacterRecordSync(syncPacket("HealthComponent", "00ff"))).toBeUndefined();
    expect(decodeCharacterRecordSync(syncPacket("MoveComponent", "01cdcc0ec1"))).toBeUndefined();
  });
});
