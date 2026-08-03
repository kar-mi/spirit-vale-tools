import { describe, expect, test } from "bun:test";

import { decodeEffectDisplays } from "./effect-display.ts";

// Captured from logs/abtest_players.jsonl: one apply, no removes.
const VITALITY = "0210566974616c6974790000803f02000100";
const ANGELIC = "021e416e67656c6963426c657373696e670000a04002000100";

function packed(value: number): Buffer {
  let encoded = BigInt(value) << 1n;
  const bytes: number[] = [];
  while (encoded >= 0x80n) { bytes.push(Number((encoded & 0x7fn) | 0x80n)); encoded >>= 7n; }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}

function entry(statusId: string, remaining: number, stacks: number, maxStacks: number, flag = 0): Buffer {
  const seconds = Buffer.alloc(4);
  seconds.writeFloatLE(remaining);
  return Buffer.concat([
    packed(Buffer.byteLength(statusId)), Buffer.from(statusId),
    seconds, packed(stacks), packed(maxStacks), Buffer.from([flag]),
  ]);
}

function payload(applies: Buffer[], removes: string[] = []): Buffer {
  return Buffer.concat([
    packed(applies.length), ...applies,
    packed(removes.length),
    ...removes.map((id) => Buffer.concat([packed(Buffer.byteLength(id)), Buffer.from(id)])),
  ]);
}

describe("decodeEffectDisplays", () => {
  test("decodes a captured single-status payload", () => {
    expect(decodeEffectDisplays(Buffer.from(VITALITY, "hex"))).toEqual({
      applies: [{ statusId: "Vitality", remainingSeconds: 1, stacks: 1, maxStacks: 0 }],
      removes: [],
    });
    expect(decodeEffectDisplays(Buffer.from(ANGELIC, "hex"))).toEqual({
      applies: [{ statusId: "AngelicBlessing", remainingSeconds: 5, stacks: 1, maxStacks: 0 }],
      removes: [],
    });
  });

  test("decodes several applies alongside removes", () => {
    const decoded = decodeEffectDisplays(payload(
      [entry("Might", 5, 11, 25), entry("Poison", 10, 72, 0)],
      ["ComboReady", "Blind"],
    ));
    expect(decoded.applies).toEqual([
      { statusId: "Might", remainingSeconds: 5, stacks: 11, maxStacks: 25 },
      { statusId: "Poison", remainingSeconds: 10, stacks: 72, maxStacks: 0 },
    ]);
    expect(decoded.removes).toEqual(["ComboReady", "Blind"]);
  });

  test("treats a negative remaining time as no expiry rather than a past one", () => {
    const [display] = decodeEffectDisplays(payload([entry("FlowState", -1, 1, 0)])).applies;
    expect(display).toEqual({ statusId: "FlowState", stacks: 1, maxStacks: 0 });
    expect(display).not.toHaveProperty("remainingSeconds");
  });

  test("accepts an empty batch", () => {
    expect(decodeEffectDisplays(payload([]))).toEqual({ applies: [], removes: [] });
  });

  test("rejects payloads it cannot account for exactly", () => {
    const base = payload([entry("Might", 5, 1, 25)]);
    // Trailing bytes mean the layout is not what we think it is; a lenient read would invent data.
    expect(() => decodeEffectDisplays(Buffer.concat([base, Buffer.from([0x00])]))).toThrow(/undecoded bytes/);
    expect(() => decodeEffectDisplays(base.subarray(0, base.length - 1))).toThrow();
    // The trailing flag is only ever 0 or 1; anything else means we are misreading the entry.
    const corrupted = Buffer.from(base);
    corrupted[corrupted.length - 2] = 0x7f;
    expect(() => decodeEffectDisplays(corrupted)).toThrow();
  });

  test("decodes a captured batch mixing a permanent status with timed ones", () => {
    // FlowState carries float -1 (000080bf) - the no-expiry sentinel - beside two timed buffs.
    const decoded = decodeEffectDisplays(Buffer.from(
      "0612466c6f775374617465000080bf0200010a48617374650f40924302000118536c6f77496d6d756e697479ffff1f4002000100",
      "hex",
    ));
    expect(decoded.applies).toEqual([
      { statusId: "FlowState", stacks: 1, maxStacks: 0 },
      { statusId: "Haste", remainingSeconds: 292.5004577636719, stacks: 1, maxStacks: 0 },
      { statusId: "SlowImmunity", remainingSeconds: 2.499999761581421, stacks: 1, maxStacks: 0 },
    ]);
    expect(decoded.removes).toEqual([]);
  });

  test("decodes a captured removal-only batch", () => {
    expect(decodeEffectDisplays(Buffer.from("00040c4672656e7a790846757279", "hex"))).toEqual({
      applies: [],
      removes: ["Frenzy", "Fury"],
    });
  });

  test("decodes captured stack counts against the server's declared ceiling", () => {
    // Might stacking 22 of a maximum 25 - the pair that pins these two fields apart.
    expect(decodeEffectDisplays(Buffer.from("020a4d696768740000a0402c320000", "hex")).applies).toEqual([
      { statusId: "Might", remainingSeconds: 5, stacks: 22, maxStacks: 25 },
    ]);
  });
});
