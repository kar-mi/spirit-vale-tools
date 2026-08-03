import { describe, expect, test } from "bun:test";

import { decodeEffectDisplays } from "./effect-display.ts";

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
  test("decodes a single-status batch", () => {
    expect(decodeEffectDisplays(payload([entry("FictionalVigour", 1, 1, 0)]))).toEqual({
      applies: [{ statusId: "FictionalVigour", remainingSeconds: 1, stacks: 1, maxStacks: 0 }],
      removes: [],
    });
  });

  test("decodes several applies alongside removes", () => {
    const decoded = decodeEffectDisplays(payload(
      [entry("FictionalMight", 5, 11, 25), entry("FictionalVenom", 10, 72, 0)],
      ["FictionalReady", "FictionalBlind"],
    ));
    expect(decoded.applies).toEqual([
      { statusId: "FictionalMight", remainingSeconds: 5, stacks: 11, maxStacks: 25 },
      { statusId: "FictionalVenom", remainingSeconds: 10, stacks: 72, maxStacks: 0 },
    ]);
    expect(decoded.removes).toEqual(["FictionalReady", "FictionalBlind"]);
  });

  test("treats a negative remaining time as no expiry rather than a past one", () => {
    const [display] = decodeEffectDisplays(payload([entry("FictionalStance", -1, 1, 0)])).applies;
    expect(display).toEqual({ statusId: "FictionalStance", stacks: 1, maxStacks: 0 });
    expect(display).not.toHaveProperty("remainingSeconds");
  });

  test("accepts an empty batch", () => {
    expect(decodeEffectDisplays(payload([]))).toEqual({ applies: [], removes: [] });
  });

  test("rejects payloads it cannot account for exactly", () => {
    const base = payload([entry("FictionalMight", 5, 1, 25)]);
    // Trailing bytes mean the layout is not what we think it is; a lenient read would invent data.
    expect(() => decodeEffectDisplays(Buffer.concat([base, Buffer.from([0x00])]))).toThrow(/undecoded bytes/);
    expect(() => decodeEffectDisplays(base.subarray(0, base.length - 1))).toThrow();
    // The trailing flag is only ever 0 or 1; anything else means we are misreading the entry.
    const corrupted = Buffer.from(base);
    corrupted[corrupted.length - 2] = 0x7f;
    expect(() => decodeEffectDisplays(corrupted)).toThrow();
  });

  test("decodes a batch mixing a permanent status with timed ones", () => {
    const decoded = decodeEffectDisplays(payload([
      entry("FictionalStance", -1, 1, 0),
      entry("FictionalHaste", 292.5, 1, 0),
      entry("FictionalWard", 2.5, 1, 0),
    ]));
    expect(decoded.applies).toEqual([
      { statusId: "FictionalStance", stacks: 1, maxStacks: 0 },
      { statusId: "FictionalHaste", remainingSeconds: 292.5, stacks: 1, maxStacks: 0 },
      { statusId: "FictionalWard", remainingSeconds: 2.5, stacks: 1, maxStacks: 0 },
    ]);
    expect(decoded.removes).toEqual([]);
  });

  test("decodes a removal-only batch", () => {
    expect(decodeEffectDisplays(payload([], ["FictionalFrenzy", "FictionalFury"]))).toEqual({
      applies: [],
      removes: ["FictionalFrenzy", "FictionalFury"],
    });
  });

  test("decodes stack counts against the server's declared ceiling", () => {
    // Stacks and their ceiling are separate fields of the same width; a value below the cap is what
    // tells them apart.
    expect(decodeEffectDisplays(payload([entry("FictionalMight", 5, 22, 25)])).applies).toEqual([
      { statusId: "FictionalMight", remainingSeconds: 5, stacks: 22, maxStacks: 25 },
    ]);
  });
});
