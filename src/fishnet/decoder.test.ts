import { describe, expect, test } from "bun:test";

import {
  decodeFishNetBundle,
  FishNetSessionDecoder,
} from "./decoder.ts";
import type { FishNetRpcMap } from "./types.ts";

function tick(value: number, messages: Uint8Array): Buffer {
  const header = Buffer.alloc(4);
  header.writeUInt32LE(value);
  return Buffer.concat([header, messages]);
}

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

function unsignedPacked(value: bigint): Buffer {
  const bytes: number[] = [];
  do {
    let byte = Number(value & 0x7fn);
    value >>= 7n;
    if (value !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (value !== 0n);
  return Buffer.from(bytes);
}

function u16(value: number): Buffer {
  const result = Buffer.alloc(2);
  result.writeUInt16LE(value);
  return result;
}

function u32(value: number): Buffer {
  const result = Buffer.alloc(4);
  result.writeUInt32LE(value);
  return result;
}

function f32(value: number): Buffer {
  const result = Buffer.alloc(4);
  result.writeFloatLE(value);
  return result;
}

function message(id: number, payload: Uint8Array = Buffer.alloc(0)): Buffer {
  return Buffer.concat([u16(id), payload]);
}

function linked(id: number, payload: Buffer): Buffer {
  return message(id, Buffer.concat([packed(payload.length), payload]));
}

function fixedServerRpc(objectId: number, componentIndex: number, hash: number, payload = Buffer.alloc(0)): Buffer {
  const wireHash = hash > 0xff ? u16(hash) : Buffer.from([hash]);
  return message(8, Buffer.concat([
    packed(objectId),
    Buffer.from([1, componentIndex]),
    packed(wireHash.length + payload.length),
    wireHash,
    payload,
  ]));
}

function spawnWithLink(
  objectId: number,
  componentIndex: number,
  linkId: number,
  rpcHash: number,
  kind = 9,
  ownerConnectionId = -1,
): Buffer {
  const records = Buffer.concat([
    Buffer.from([componentIndex]),
    u16(1),
    u16(linkId),
    u16(rpcHash),
    u16(kind),
  ]);
  return message(3, Buffer.concat([
    Buffer.from([4]), // instantiated spawn
    packed(objectId),
    u16(1), // spawnable collection
    packed(0), // initialization order
    packed(ownerConnectionId),
    Buffer.from([0]), // no changed transform fields
    packed(3), // prefab id
    u32(0), // payload
    u16(records.length),
    records,
    u32(0), // initial SyncTypes
  ]));
}

function semanticMap(): FishNetRpcMap {
  return {
    schemaVersion: 2,
    buildFingerprint: "synthetic-build-v2",
    metadataVersion: 31,
    behaviours: [{
      typeName: "SyntheticMover",
      rpcs: [{
        wireHash: 5,
        packetKind: "serverRpc",
        methodName: "RequestSyntheticMove",
        parameters: [{ name: "distance", typeName: "System.UInt16", codec: "uint16" }],
      }, {
        wireHash: 0x1234,
        packetKind: "observersRpc",
        methodName: "ApplySyntheticMove",
        parameters: [
          { name: "active", typeName: "System.Boolean", codec: "boolean" },
          { name: "distance", typeName: "System.UInt16", codec: "uint16" },
        ],
      }],
      syncTypes: [{ index: 0, name: "SyntheticPosition", typeName: "UnityEngine.Vector3", codec: "vector3" }],
    }],
    broadcasts: [{
      wireHash: 77,
      typeName: "SyntheticNotice",
      fields: [{ name: "code", typeName: "System.Byte", codec: "uint8" }],
    }],
  };
}

describe("FishNet bundles and sessions", () => {
  test("classifies runtime packet ids as RPC Links", () => {
    const [result] = decodeFishNetBundle(tick(3, linked(900, Buffer.from([0xaa]))), { reliable: true });
    expect(result).toMatchObject({ packetId: 900, packetName: "rpcLink", linkId: 900, linkResolved: false });
    expect(result?.payload).toEqual(Buffer.from([0xaa]));
  });

  test("registers spawn links and resolves verified metadata and names", () => {
    const map: FishNetRpcMap = {
      schemaVersion: 1,
      buildFingerprint: "synthetic-build",
      metadataVersion: 31,
      symbols: [{
        methodHash: 1,
        methodName: "RpcSyntheticNotice",
        forms: ["reader", "writer"],
        wireHash: 0x1234,
        packetKinds: ["observersRpc"],
      }],
    };
    const decoder = new FishNetSessionDecoder(map);
    const results = decoder.decode(tick(4, Buffer.concat([
      spawnWithLink(7, 2, 900, 0x1234, 9, 12),
      linked(900, Buffer.from("aabb", "hex")),
    ])), { reliable: true, connectionId: "synthetic" });

    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      packetName: "objectSpawn",
      bundleIndex: 0,
      objectId: 7,
      ownerConnectionId: 12,
    });
    expect(results[1]).toMatchObject({
      packetName: "rpcLink",
      bundleIndex: 1,
      linkId: 900,
      linkResolved: true,
      linkedPacketName: "observersRpc",
      registeredObjectId: 7,
      registeredComponentIndex: 2,
      registeredRpcHash: 0x1234,
      rpcName: "RpcSyntheticNotice",
    });
    expect(results[1]?.payload).toEqual(Buffer.from("aabb", "hex"));
  });

  test("decodes ownership changes using the same session-local owner identifier", () => {
    const [result] = new FishNetSessionDecoder().decode(tick(5, message(11, Buffer.concat([
      packed(44),
      Buffer.from([1]),
      packed(9),
    ]))), { reliable: true, connectionId: "ownership" });

    expect(result).toMatchObject({
      packetName: "ownershipChange",
      objectId: 44,
      ownerConnectionId: 9,
    });
  });

  test("binds schema-v2 behaviours and decodes verified common fields", () => {
    const decoder = new FishNetSessionDecoder(semanticMap());
    const fixedRpc = message(8, Buffer.concat([
      packed(7),
      Buffer.from([1, 2]),
      packed(3),
      Buffer.from([5]),
      u16(42),
    ]));
    const syncType = message(7, Buffer.concat([
      packed(7),
      Buffer.from([1, 2]),
      u32(2),
      Buffer.from("00bb", "hex"),
    ]));
    const broadcast = message(12, Buffer.concat([u16(77), packed(1), Buffer.from([9])]));
    const results = decoder.decode(tick(20, Buffer.concat([
      spawnWithLink(7, 2, 900, 0x1234),
      linked(900, Buffer.from("013412", "hex")),
      fixedRpc,
      syncType,
      broadcast,
    ])), { reliable: true, connectionId: "semantic" });

    expect(results).toHaveLength(5);
    expect(results[0]).toMatchObject({
      packetName: "objectSpawn",
      objectId: 7,
      spawnType: "instantiated",
      spawnCollectionId: 1,
      spawnPrefabId: 3,
      spawnNested: false,
      rpcLinkRegistrations: [{ networkBehaviourType: "SyntheticMover" }],
    });
    expect(results[1]).toMatchObject({
      packetName: "rpcLink",
      networkBehaviourType: "SyntheticMover",
      rpcName: "ApplySyntheticMove",
      rpcResolution: "verified",
      decodedFields: [
        { name: "active", value: true },
        { name: "distance", value: 0x1234 },
      ],
    });
    expect(results[2]).toMatchObject({
      packetName: "serverRpc",
      networkBehaviourType: "SyntheticMover",
      rpcName: "RequestSyntheticMove",
      decodedFields: [{ name: "distance", value: 42 }],
    });
    expect(results[3]).toMatchObject({
      packetName: "syncType",
      objectId: 7,
      networkBehaviourIndex: 2,
      networkBehaviourType: "SyntheticMover",
      syncIndex: 0,
      syncName: "SyntheticPosition",
    });
    expect(results[3]?.syncPayload).toEqual(Buffer.from("00bb", "hex"));
    expect(results[4]).toMatchObject({
      packetName: "broadcast",
      broadcastHash: 77,
      broadcastName: "SyntheticNotice",
      decodedFields: [{ name: "code", value: 9 }],
    });
  });

  test("decodes structured SyncType fields after the index and preserves trailing bytes", () => {
    const map = semanticMap();
    const behaviour = map.schemaVersion === 2 ? map.behaviours[0] : undefined;
    if (!behaviour) throw new Error("synthetic behaviour missing");
    behaviour.syncTypes = [{
      index: 5,
      name: "VisualData",
      typeName: "SyntheticVisualData",
      fields: [{
        name: "Appearance",
        fields: [
          { name: "DisplayName", codec: "stringUtf8Packed" },
          { name: "Archetype", codec: "packedInt32" },
        ],
      }],
    }];
    const name = Buffer.from("Aster Vale", "utf8");
    const body = Buffer.concat([Buffer.from([5]), packed(name.length), name, packed(3), Buffer.from("aabb", "hex")]);
    const syncType = message(7, Buffer.concat([
      packed(7),
      Buffer.from([1, 2]),
      u32(body.length),
      body,
    ]));
    const decoder = new FishNetSessionDecoder(map);
    const results = decoder.decode(tick(21, Buffer.concat([
      spawnWithLink(7, 2, 900, 0x1234),
      syncType,
    ])), { reliable: true, connectionId: "structured-sync" });

    expect(results[1]).toMatchObject({
      packetName: "syncType",
      syncIndex: 5,
      syncName: "VisualData",
      decodedFields: [
        { name: "Appearance.DisplayName", value: "Aster Vale" },
        { name: "Appearance.Archetype", value: 3 },
      ],
    });
    expect(results[1]?.undecodedPayload).toEqual(Buffer.from("aabb", "hex"));
  });

  test("infers a unique behaviour and uses it to resolve later ambiguous hashes", () => {
    const map: FishNetRpcMap = {
      schemaVersion: 2,
      buildFingerprint: "synthetic-inference",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticController",
        rpcs: [
          { wireHash: 21, packetKind: "serverRpc", methodName: "SendSyntheticInput" },
          { wireHash: 70, packetKind: "serverRpc", methodName: "OpenSyntheticStore" },
        ],
      }, {
        typeName: "SyntheticSave",
        rpcs: [
          { wireHash: 21, packetKind: "serverRpc", methodName: "RefineSyntheticArtifact" },
          { wireHash: 88, packetKind: "observersRpc", methodName: "ApplySyntheticSave" },
        ],
      }],
    };
    const decoder = new FishNetSessionDecoder(map);
    const context = { reliable: true, connectionId: "inference" };
    const results = decoder.decode(tick(30, Buffer.concat([
      fixedServerRpc(40, 0, 21),
      fixedServerRpc(40, 0, 70),
      fixedServerRpc(40, 0, 21),
    ])), context);

    expect(results[0]).toMatchObject({ rpcResolution: "ambiguous" });
    expect(results[0]?.networkBehaviourType).toBeUndefined();
    expect(results[1]).toMatchObject({
      networkBehaviourType: "SyntheticController",
      rpcName: "OpenSyntheticStore",
      rpcResolution: "verified",
    });
    expect(results[2]).toMatchObject({
      networkBehaviourType: "SyntheticController",
      rpcName: "SendSyntheticInput",
      rpcResolution: "verified",
    });

    const reused = decoder.decode(tick(31, Buffer.concat([
      spawnWithLink(40, 0, 950, 88),
      fixedServerRpc(40, 0, 21),
    ])), context);
    expect(reused[0]).toMatchObject({
      packetName: "objectSpawn",
      rpcLinkRegistrations: [{ networkBehaviourType: "SyntheticSave" }],
    });
    expect(reused[1]).toMatchObject({
      networkBehaviourType: "SyntheticSave",
      rpcName: "RefineSyntheticArtifact",
    });
  });

  test("decodes ordered nested parameters and preserves a truncated remainder", () => {
    const fields = [{
      name: "Inputs",
      typeName: "SyntheticInputDto",
      fields: [
        { name: "Move", typeName: "SyntheticVector3Int", codec: "vector3IntPacked" as const },
        { name: "Click", typeName: "System.Boolean", codec: "boolean" as const },
        { name: "ClickSkillIndex", typeName: "System.Int32", codec: "packedInt32" as const },
        { name: "Hotkeys", typeName: "System.UInt64", codec: "packedUInt64" as const },
      ],
    }];
    const map: FishNetRpcMap = {
      schemaVersion: 2,
      buildFingerprint: "synthetic-structured",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticController",
        rpcs: [{ wireHash: 70, packetKind: "serverRpc", methodName: "SendSyntheticInput", parameters: fields }],
      }],
    };
    const completePayload = Buffer.concat([
      packed(2),
      packed(-3),
      packed(4),
      Buffer.from([1]),
      packed(6),
      unsignedPacked(1n << 43n),
    ]);
    const complete = new FishNetSessionDecoder(map).decode(
      tick(32, fixedServerRpc(41, 0, 70, completePayload)),
      { reliable: true, connectionId: "structured-complete" },
    )[0];
    expect(complete).toMatchObject({
      rpcName: "SendSyntheticInput",
      decodedFields: [
        { name: "Inputs.Move", value: [2, -3, 4] },
        { name: "Inputs.Click", value: true },
        { name: "Inputs.ClickSkillIndex", value: 6 },
        { name: "Inputs.Hotkeys", value: "0x80000000000" },
      ],
    });
    expect(complete?.undecodedPayload).toBeUndefined();

    const truncatedPayload = completePayload.subarray(0, completePayload.length - 1);
    const truncated = new FishNetSessionDecoder(map).decode(
      tick(33, fixedServerRpc(42, 0, 70, truncatedPayload)),
      { reliable: true, connectionId: "structured-truncated" },
    )[0];
    expect(truncated?.decodedFields?.map(({ name }) => name)).toEqual([
      "Inputs.Move",
      "Inputs.Click",
      "Inputs.ClickSkillIndex",
    ]);
    expect(truncated?.undecodedPayload).toEqual(Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80]));
  });

  test("decodes a synthetic structured skill state and its trailing parameters", () => {
    const map: FishNetRpcMap = {
      schemaVersion: 2,
      buildFingerprint: "synthetic-skill-state",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticSkills",
        rpcs: [{
          wireHash: 71,
          packetKind: "serverRpc",
          methodName: "BeginSyntheticCast",
          parameters: [{
            name: "state",
            typeName: "SyntheticSkillState",
            fields: [
              { name: "Id", typeName: "System.String", codec: "stringUtf8Packed" },
              { name: "Level", typeName: "System.Int32", codec: "packedInt32" },
              { name: "Cooldown", typeName: "System.Single", codec: "float32" },
              { name: "LeapType", typeName: "SyntheticLeapType", codec: "packedInt32" },
            ],
          }, {
            name: "targetId",
            typeName: "System.Int32",
            codec: "packedInt32",
          }, {
            name: "position",
            typeName: "SyntheticVector3",
            codec: "vector3",
          }, {
            name: "castTime",
            typeName: "System.Single",
            codec: "float32",
          }],
        }],
      }],
    };
    const id = Buffer.from("SyntheticArc", "utf8");
    const payload = Buffer.concat([
      packed(id.length),
      id,
      packed(3),
      f32(4.5),
      packed(2),
      packed(17),
      f32(1.25),
      f32(0),
      f32(-2.5),
      f32(0.75),
    ]);
    const result = new FishNetSessionDecoder(map).decode(
      tick(34, fixedServerRpc(43, 1, 71, payload)),
      { reliable: true, connectionId: "synthetic-skill" },
    )[0];

    expect(result).toMatchObject({
      networkBehaviourType: "SyntheticSkills",
      rpcName: "BeginSyntheticCast",
      decodedFields: [
        { name: "state.Id", value: "SyntheticArc" },
        { name: "state.Level", value: 3 },
        { name: "state.Cooldown", value: 4.5 },
        { name: "state.LeapType", value: 2 },
        { name: "targetId", value: 17 },
        { name: "position", value: [1.25, 0, -2.5] },
        { name: "castTime", value: 0.75 },
      ],
    });
    expect(result?.undecodedPayload).toBeUndefined();
  });

  test("emits multiple fixed messages from one reliable bundle in order", () => {
    const results = decodeFishNetBundle(tick(5, Buffer.concat([
      message(14, u32(20)),
      message(21, Buffer.from([0])),
    ])), { reliable: true });
    expect(results.map(({ packetName, bundleIndex }) => [packetName, bundleIndex])).toEqual([
      ["pingPong", 0],
      ["version", 1],
    ]);
  });

  test("reassembles split messages once and ignores duplicate transport sequences", () => {
    const decoder = new FishNetSessionDecoder();
    const complete = Buffer.concat([spawnWithLink(9, 1, 901, 44), linked(901, Buffer.from([5, 6]))]);
    const midpoint = Math.floor(complete.length / 2);
    const first = tick(6, message(2, Buffer.concat([packed(2), complete.subarray(0, midpoint)])));
    const second = tick(6, message(2, Buffer.concat([packed(2), complete.subarray(midpoint)])));
    const context = { reliable: true, connectionId: "split", direction: "inbound" as const, channel: 0 };

    expect(decoder.decode(first, { ...context, sequence: 10 })).toEqual([]);
    expect(decoder.decode(first, { ...context, sequence: 10 })).toEqual([]);
    const results = decoder.decode(second, { ...context, sequence: 11 });
    expect(results.map(({ packetName }) => packetName)).toEqual(["objectSpawn", "rpcLink"]);
    expect(results[1]).toMatchObject({ linkResolved: true, registeredObjectId: 9 });

    const incomplete = new FishNetSessionDecoder();
    expect(incomplete.decode(first, { ...context, sequence: 20 })).toEqual([]);
  });

  test("despawn and authentication remove stale registrations", () => {
    const decoder = new FishNetSessionDecoder();
    const context = { reliable: true, connectionId: "lifecycle" };
    decoder.decode(tick(7, spawnWithLink(11, 3, 902, 55)), context);

    const afterDespawn = decoder.decode(tick(8, Buffer.concat([
      message(4, Buffer.concat([packed(11), Buffer.from([0])])),
      linked(902, Buffer.from([1])),
    ])), context);
    expect(afterDespawn[1]).toMatchObject({ packetName: "rpcLink", linkResolved: false });

    decoder.decode(tick(9, spawnWithLink(12, 4, 903, 66)), context);
    const afterReconnect = decoder.decode(tick(10, Buffer.concat([
      message(1, packed(2)),
      linked(903, Buffer.from([2])),
    ])), context);
    expect(afterReconnect[1]).toMatchObject({ packetName: "rpcLink", linkResolved: false });

    decoder.decode(tick(11, spawnWithLink(14, 5, 906, 88)), context);
    decoder.decode(tick(12, message(17)), context);
    const afterDisconnect = decoder.decode(tick(13, linked(906, Buffer.from([3]))), context);
    expect(afterDisconnect[0]).toMatchObject({ packetName: "rpcLink", linkResolved: false });
  });

  test("keeps malformed and ambiguous traffic recoverable and unnamed", () => {
    const ambiguousMap: FishNetRpcMap = {
      schemaVersion: 1,
      buildFingerprint: "synthetic-ambiguous",
      metadataVersion: 31,
      symbols: ["RpcSyntheticOne", "RpcSyntheticTwo"].map((methodName, index) => ({
        methodHash: index,
        methodName,
        forms: ["reader"],
        wireHash: 77,
        packetKinds: ["observersRpc"],
      })),
    };
    const decoder = new FishNetSessionDecoder(ambiguousMap);
    const context = { reliable: true, connectionId: "recovery" };
    const registered = decoder.decode(tick(11, Buffer.concat([
      spawnWithLink(13, 1, 904, 77),
      linked(904, Buffer.from([3])),
    ])), context);
    expect(registered[1]).toMatchObject({ linkResolved: true });
    expect(registered[1]?.rpcName).toBeUndefined();

    const truncated = decoder.decode(tick(12, message(905, Buffer.concat([packed(20), Buffer.from([1])]))), context);
    expect(truncated[0]).toMatchObject({ packetName: "rpcLink", linkResolved: false });

    const unsupportedSpawn = decoder.decode(tick(13, message(3, Buffer.from([0xff, 1, 2, 3]))), context);
    expect(unsupportedSpawn).toHaveLength(1);
    expect(unsupportedSpawn[0]).toMatchObject({ packetName: "objectSpawn", bundleIndex: 0 });
  });
});
