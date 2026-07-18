import { describe, expect, test } from "bun:test";

import { decodeFishNetPayload, FishNetProtocolError } from "./decoder.ts";
import type { FishNetRpcMap } from "./types.ts";

describe("decodeFishNetPayload", () => {
  test("decodes a reliable RPC header and a verified wire name", () => {
    const map: FishNetRpcMap = {
      buildFingerprint: "fixture",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticBehaviour",
        rpcs: [{
          methodName: "RpcSyntheticAction",
          wireHash: 5,
          packetKind: "serverRpc",
        }],
      }],
    };
    const result = decodeFishNetPayload(
      Buffer.from("2a00000008000e01020605aabb", "hex"),
      { reliable: true, rpcMap: map },
    );
    expect(result).toMatchObject({
      tick: 42,
      packetId: 8,
      packetName: "serverRpc",
      objectId: 7,
      networkBehaviourIndex: 2,
      rpcPayloadLength: 3,
      rpcHash: 5,
      rpcName: "RpcSyntheticAction",
    });
    expect(result.payload).toEqual(Buffer.from("aabb", "hex"));
  });

  test("preserves both compact hash interpretations when no map verifies one", () => {
    const result = decodeFishNetPayload(Buffer.from("0100000009000201033412aa", "hex"), { reliable: false });
    expect(result.rpcHash).toBe(0x34);
    expect(result.rpcHash16Candidate).toBe(0x1234);
    expect(result.rpcName).toBeUndefined();
    expect(result.payload).toEqual(Buffer.from("12aa", "hex"));
  });

  test("decodes non-RPC packet ids without interpreting their payload", () => {
    const result = decodeFishNetPayload(Buffer.from("070000000e00aabb", "hex"));
    expect(result).toMatchObject({ tick: 7, packetId: 14, packetName: "pingPong" });
    expect(result.payload).toEqual(Buffer.from("aabb", "hex"));
  });

  test("rejects truncated and invalid RPC headers", () => {
    expect(() => decodeFishNetPayload(Buffer.alloc(5))).toThrow(FishNetProtocolError);
    expect(() => decodeFishNetPayload(Buffer.from("01000000080000", "hex"))).toThrow("network behaviour header");
  });
});
