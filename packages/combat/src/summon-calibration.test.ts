import { describe, expect, test } from "bun:test";

import { decodeSummonCalibration } from "./summon-calibration.ts";

describe("decodeSummonCalibration", () => {
  test("decodes the current summon skill, actor and level shape", () => {
    expect(decodeSummonCalibration(snapshot([
      { skillId: "FictionalCompanion", summonId: "Fictional Creature", level: 3 },
      { skillId: "FictionalCompanion", summonId: "Fictional Creature", level: 3 },
    ]))).toEqual([
      { skillId: "FictionalCompanion", summonId: "Fictional Creature", level: 3 },
      { skillId: "FictionalCompanion", summonId: "Fictional Creature", level: 3 },
    ]);
  });

  test("accepts empty and null authoritative snapshots", () => {
    expect(decodeSummonCalibration(packed(0))).toEqual([]);
    expect(decodeSummonCalibration(packed(-1))).toEqual([]);
  });

  test("rejects negative levels and trailing bytes", () => {
    expect(() => decodeSummonCalibration(snapshot([
      { skillId: "FictionalCompanion", summonId: "Fictional Creature", level: -1 },
    ]))).toThrow("summon level must not be negative");
    expect(() => decodeSummonCalibration(Buffer.concat([snapshot([]), Buffer.from([0])]))).toThrow("undecoded bytes");
  });

  test("rejects truncated and null strings", () => {
    expect(() => decodeSummonCalibration(Buffer.concat([
      packed(1),
      packed(Buffer.byteLength("FictionalCompanion")),
      Buffer.from("Fictional"),
    ]))).toThrow();
    expect(() => decodeSummonCalibration(Buffer.concat([packed(1), packed(-1)])))
      .toThrow("summon calibration string must not be null");
  });
});

interface SyntheticSummon {
  skillId: string;
  summonId: string;
  level: number;
}

function snapshot(entries: readonly SyntheticSummon[]): Buffer {
  return Buffer.concat([
    packed(entries.length),
    ...entries.map(({ skillId, summonId, level }) => Buffer.concat([
      string(skillId),
      string(summonId),
      packed(level),
    ])),
  ]);
}

function string(value: string): Buffer {
  return Buffer.concat([packed(Buffer.byteLength(value)), Buffer.from(value)]);
}

function packed(value: number): Buffer {
  let encoded = BigInt(value) << 1n;
  if (encoded < 0) encoded = ~encoded;
  const bytes: number[] = [];
  while (encoded >= 0x80n) {
    bytes.push(Number((encoded & 0x7fn) | 0x80n));
    encoded >>= 7n;
  }
  bytes.push(Number(encoded));
  return Buffer.from(bytes);
}
