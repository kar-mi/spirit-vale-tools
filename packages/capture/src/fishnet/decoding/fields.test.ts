import { describe, expect, test } from "bun:test";

import { decodeFieldRun, tryDecodeFields } from "./fields.ts";
import type { FishNetRpcParameter } from "../types.ts";

function packed(value: number): Buffer {
  let unsigned = BigInt(value >= 0 ? value * 2 : (-value * 2) - 1);
  const bytes: number[] = [];
  do {
    let byte = Number(unsigned & 0x7fn);
    unsigned >>= 7n;
    if (unsigned !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (unsigned !== 0n);
  return Buffer.from(bytes);
}

function utf8String(value: string): Buffer {
  const body = Buffer.from(value, "utf8");
  return Buffer.concat([packed(body.length), body]);
}

/** FishNet's nullable-reference flag: 0 = present, 1 = null. */
function present(): Buffer {
  return Buffer.from([0]);
}

describe("field-decoder repeated/dictionary fields", () => {
  test("decodes an array of scalar strings", () => {
    const parameters: FishNetRpcParameter[] = [
      { name: "names", typeName: "System.String", codec: "stringUtf8Packed", repeated: true },
    ];
    const payload = Buffer.concat([packed(2), utf8String("a"), utf8String("bb")]);
    const run = decodeFieldRun(payload, parameters);
    expect(run.complete).toBe(true);
    expect(run.consumed).toBe(payload.length);
    expect(run.fields).toEqual([
      { name: "names.length", typeName: "System.Int32", codec: "packedInt32", value: 2 },
      { name: "names[0]", typeName: "System.String", codec: "stringUtf8Packed", value: "a" },
      { name: "names[1]", typeName: "System.String", codec: "stringUtf8Packed", value: "bb" },
    ]);
  });

  test("decodes an empty array as a -1 count", () => {
    const parameters: FishNetRpcParameter[] = [
      { name: "names", typeName: "System.String", codec: "stringUtf8Packed", repeated: true },
    ];
    const payload = packed(-1);
    const run = decodeFieldRun(payload, parameters);
    expect(run.complete).toBe(true);
    expect(run.fields).toEqual([
      { name: "names.length", typeName: "System.Int32", codec: "packedInt32", value: 0 },
    ]);
  });

  test("decodes an array of nullable-flag-prefixed structs", () => {
    const parameters: FishNetRpcParameter[] = [
      {
        name: "items",
        nullable: true,
        repeated: true,
        fields: [
          { name: "id", typeName: "System.Int32", codec: "packedInt32" },
          { name: "label", typeName: "System.String", codec: "stringUtf8Packed" },
        ],
      },
    ];
    const payload = Buffer.concat([
      packed(2),
      present(), packed(1), utf8String("one"),
      present(), packed(2), utf8String("two"),
    ]);
    const run = decodeFieldRun(payload, parameters);
    expect(run.complete).toBe(true);
    expect(run.consumed).toBe(payload.length);
    expect(run.fields).toEqual([
      { name: "items.length", typeName: "System.Int32", codec: "packedInt32", value: 2 },
      { name: "items[0].id", typeName: "System.Int32", codec: "packedInt32", value: 1 },
      { name: "items[0].label", typeName: "System.String", codec: "stringUtf8Packed", value: "one" },
      { name: "items[1].id", typeName: "System.Int32", codec: "packedInt32", value: 2 },
      { name: "items[1].label", typeName: "System.String", codec: "stringUtf8Packed", value: "two" },
    ]);
  });

  test("decodes a dictionary of structs, keyed by string", () => {
    const parameters: FishNetRpcParameter[] = [
      {
        name: "byId",
        dictionaryKey: "stringUtf8Packed",
        fields: [{ name: "count", typeName: "System.Int32", codec: "packedInt32" }],
      },
    ];
    const payload = Buffer.concat([
      packed(1),
      utf8String("sword"), packed(3),
    ]);
    const run = decodeFieldRun(payload, parameters);
    expect(run.complete).toBe(true);
    expect(run.fields).toEqual([
      { name: "byId.length", typeName: "System.Int32", codec: "packedInt32", value: 1 },
      { name: "byId[0].$key", typeName: "System.String", codec: "stringUtf8Packed", value: "sword" },
      { name: "byId[0].count", typeName: "System.Int32", codec: "packedInt32", value: 3 },
    ]);
  });

  test("marks an array truncated mid-element as incomplete", () => {
    const parameters: FishNetRpcParameter[] = [
      { name: "names", typeName: "System.String", codec: "stringUtf8Packed", repeated: true },
    ];
    const payload = Buffer.concat([packed(2), utf8String("a")]);
    const run = decodeFieldRun(payload, parameters);
    expect(run.complete).toBe(false);
    expect(run.fields).toEqual([
      { name: "names.length", typeName: "System.Int32", codec: "packedInt32", value: 2 },
      { name: "names[0]", typeName: "System.String", codec: "stringUtf8Packed", value: "a" },
    ]);
  });

  test("treats a repeated field with a decodable element shape as decodable", () => {
    const parameters: FishNetRpcParameter[] = [
      { name: "names", typeName: "System.String", codec: "stringUtf8Packed", repeated: true },
    ];
    const fit = tryDecodeFields(Buffer.concat([packed(1), utf8String("a")]), parameters);
    expect(fit.undecodable).toBe(false);
    expect(fit.complete).toBe(true);
  });

  test("treats a repeated field with an opaque element struct as undecodable", () => {
    const parameters: FishNetRpcParameter[] = [
      { name: "items", typeName: "Opaque", repeated: true },
    ];
    const fit = tryDecodeFields(Buffer.from([0]), parameters);
    expect(fit.undecodable).toBe(true);
  });
});
