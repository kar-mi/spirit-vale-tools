import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { loadFishNetRpcMap } from "./rpc-map.ts";

const fixturePath = path.join(process.cwd(), `.synthetic-rpc-map-${process.pid}.json`);

afterEach(() => {
  if (existsSync(fixturePath)) rmSync(fixturePath);
});

describe("loadFishNetRpcMap", () => {
  test("loads schema v2 and enforces an expected build fingerprint", () => {
    writeFileSync(fixturePath, JSON.stringify({
      schemaVersion: 2,
      buildFingerprint: "synthetic-build",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticBehaviour",
        rpcs: [{
          wireHash: 0,
          packetKind: "serverRpc",
          methodName: "SyntheticAction",
          parameters: [{
            name: "input",
            typeName: "SyntheticInput",
            fields: [{ name: "hotkeys", typeName: "System.UInt64", codec: "packedUInt64" }],
          }],
        }],
      }],
    }));

    expect(loadFishNetRpcMap(fixturePath, { expectedBuildFingerprint: "synthetic-build" })).toMatchObject({
      schemaVersion: 2,
      buildFingerprint: "synthetic-build",
    });
    expect(() => loadFishNetRpcMap(fixturePath, { expectedBuildFingerprint: "different-build" }))
      .toThrow("FishNet RPC map build mismatch");
  });

  test("rejects malformed schema-v2 definitions", () => {
    writeFileSync(fixturePath, JSON.stringify({
      schemaVersion: 2,
      buildFingerprint: "synthetic-build",
      metadataVersion: 31,
      behaviours: [{ typeName: "SyntheticBehaviour", rpcs: [{ wireHash: "zero" }] }],
    }));
    expect(() => loadFishNetRpcMap(fixturePath)).toThrow("invalid FishNet RPC map");
  });

  test("rejects unknown nested field codecs", () => {
    writeFileSync(fixturePath, JSON.stringify({
      schemaVersion: 2,
      buildFingerprint: "synthetic-build",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticBehaviour",
        rpcs: [{
          wireHash: 1,
          packetKind: "serverRpc",
          methodName: "SyntheticAction",
          parameters: [{ name: "input", fields: [{ name: "value", codec: "invented" }] }],
        }],
      }],
    }));
    expect(() => loadFishNetRpcMap(fixturePath)).toThrow("invalid FishNet RPC map");
  });
});
