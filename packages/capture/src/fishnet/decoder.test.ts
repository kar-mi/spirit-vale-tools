import { describe, expect, test } from "bun:test";

import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import {
  decodeFishNetBundle,
  FishNetSessionDecoder,
} from "./decoder.ts";
import type { FishNetBehaviourDefinition, FishNetRpcMap } from "./types.ts";

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

function fixedRpc(
  messageId: number,
  objectId: number,
  componentIndex: number,
  hash: number,
  payload: Uint8Array,
): Buffer {
  const wireHash = hash > 0xff ? u16(hash) : Buffer.from([hash]);
  return message(messageId, Buffer.concat([
    packed(objectId),
    Buffer.from([1, componentIndex]),
    packed(wireHash.length + payload.length),
    wireHash,
    payload,
  ]));
}

function fixedServerRpc(objectId: number, componentIndex: number, hash: number, payload: Uint8Array = Buffer.alloc(0)): Buffer {
  return fixedRpc(8, objectId, componentIndex, hash, payload);
}

function observersRpc(objectId: number, componentIndex: number, hash: number, payload: Uint8Array = Buffer.alloc(0)): Buffer {
  return fixedRpc(9, objectId, componentIndex, hash, payload);
}

function targetRpc(objectId: number, componentIndex: number, hash: number, payload: Uint8Array = Buffer.alloc(0)): Buffer {
  return fixedRpc(10, objectId, componentIndex, hash, payload);
}

function authenticated(): Buffer {
  return message(1, packed(1));
}

function objectDespawn(objectId: number): Buffer {
  return message(4, Buffer.concat([packed(objectId), Buffer.from([0])]));
}

function spawnWithLink(
  objectId: number,
  componentIndex: number,
  linkId: number,
  rpcHash: number,
  kind = 9,
  ownerConnectionId = -1,
  syncPayload = Buffer.alloc(0),
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
    u32(syncPayload.length),
    syncPayload,
  ]));
}

function semanticMap(): FishNetRpcMap {
  return {
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
      buildFingerprint: "synthetic-build",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticBehaviour",
        rpcs: [{
          methodName: "RpcSyntheticNotice",
          wireHash: 0x1234,
          packetKind: "observersRpc",
          // The generator records parameters even for types it cannot break down, so an entry with
          // none genuinely takes none — and a match claiming one is refused when bytes are present.
          parameters: [{ name: "value", typeName: "System.UInt16", codec: "uint16" as const }],
        }],
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

  test("binds behaviour definitions and decodes verified common fields", () => {
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

  test("preserves initial SyncType bytes embedded in an object spawn", () => {
    const initialSyncTypes = Buffer.from("020100036d6f62", "hex");
    const [spawn] = new FishNetSessionDecoder(semanticMap()).decode(
      tick(21, spawnWithLink(8, 2, 901, 0x1234, 9, -1, initialSyncTypes)),
      { reliable: true, connectionId: "spawn-sync" },
    );

    expect(spawn).toMatchObject({ packetName: "objectSpawn", objectId: 8 });
    expect(spawn?.spawnSyncPayload).toEqual(initialSyncTypes);
  });

  test("decodes structured SyncType fields after the index and preserves trailing bytes", () => {
    const baseMap = semanticMap();
    const baseBehaviour = baseMap.behaviours[0];
    if (!baseBehaviour) throw new Error("synthetic behaviour missing");
    const behaviour: FishNetBehaviourDefinition = { ...baseBehaviour, syncTypes: [{
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
    }] };
    const map: FishNetRpcMap = { ...baseMap, behaviours: [behaviour, ...baseMap.behaviours.slice(1)] };
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

  test("resolves a hash shared by two behaviours once the other one is bound on the same object", () => {
    const map: FishNetRpcMap = {
      buildFingerprint: "synthetic-elimination",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticHealth",
        rpcs: [
          { wireHash: 0, packetKind: "serverRpc", methodName: "SyntheticApplyDamage" },
          { wireHash: 1, packetKind: "serverRpc", methodName: "SyntheticRecover" },
          { wireHash: 2, packetKind: "serverRpc", methodName: "SyntheticDeath" },
        ],
      }, {
        typeName: "SyntheticSkills",
        rpcs: [
          { wireHash: 1, packetKind: "serverRpc", methodName: "SyntheticSkillRecover" },
          { wireHash: 9, packetKind: "serverRpc", methodName: "SyntheticCastBegin" },
        ],
      }],
    };
    const decoder = new FishNetSessionDecoder(map);
    const context = { reliable: true, connectionId: "elimination" };

    // Recover (hash 1) arrives for an object whose components are entirely unknown: ambiguous
    // between SyntheticHealth and SyntheticSkills, exactly like HealthComponent/SkillsComponent's
    // shared Recover_C hash before either component has been observed.
    const cold = decoder.decode(tick(40, fixedServerRpc(60, 3, 1)), context);
    expect(cold[0]).toMatchObject({ rpcResolution: "ambiguous", networkBehaviourType: undefined });

    // A skill cast (hash 9, unique to SyntheticSkills) on a *different* component index of the
    // same object establishes that index 5 is SyntheticSkills.
    const castBegin = decoder.decode(tick(41, fixedServerRpc(60, 5, 9)), context);
    expect(castBegin[0]).toMatchObject({ networkBehaviourType: "SyntheticSkills", rpcResolution: "verified" });

    // Recover on index 3 is ambiguous in isolation, but index 5 is already claimed by
    // SyntheticSkills on this same object, so index 3 must be SyntheticHealth.
    const warm = decoder.decode(tick(42, fixedServerRpc(60, 3, 1)), context);
    expect(warm[0]).toMatchObject({
      networkBehaviourType: "SyntheticHealth",
      rpcName: "SyntheticRecover",
      rpcResolution: "verified",
    });

    // A second Recover on the same object+component now resolves directly from the bound state,
    // without needing to re-run elimination.
    const bound = decoder.decode(tick(43, fixedServerRpc(60, 3, 1)), context);
    expect(bound[0]).toMatchObject({ networkBehaviourType: "SyntheticHealth", rpcName: "SyntheticRecover" });

    // A wholly unrelated object with no bound components stays ambiguous: elimination never
    // guesses when there is nothing to eliminate against.
    const unrelated = decoder.decode(tick(44, fixedServerRpc(61, 3, 1)), context);
    expect(unrelated[0]).toMatchObject({ rpcResolution: "ambiguous", networkBehaviourType: undefined });
  });

  describe("link table quarantine across re-authentication", () => {
    // One behaviour whose observersRpc hash 3 has a checkable signature, and one whose array
    // parameter cannot be evaluated - the CalibrateSummons_T shape.
    const map: FishNetRpcMap = {
      buildFingerprint: "synthetic-quarantine",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticHealth",
        rpcs: [{
          wireHash: 3,
          packetKind: "observersRpc",
          methodName: "SyntheticApplyDamage",
          parameters: [{ name: "source", typeName: "System.String", codec: "stringUtf8Packed" as const }],
        }],
      }, {
        typeName: "SyntheticSummoning",
        rpcs: [{ wireHash: 4, packetKind: "observersRpc", methodName: "SyntheticCalibrate", parameters: [{ name: "data", typeName: "SyntheticSummonData[]" }] }],
      }],
    };
    const source = Buffer.concat([packed(5), Buffer.from("Smite")]);

    function decoderWithLink(connectionId: string, rpcHash = 3) {
      const decoder = new FishNetSessionDecoder(map);
      const context = { reliable: true, connectionId };
      decoder.decode(tick(1, spawnWithLink(80, 2, 900, rpcHash)), context);
      return { decoder, context };
    }

    test("keeps resolving a link the server never re-registers after re-authentication", () => {
      const { decoder, context } = decoderWithLink("quarantine-basic");
      const before = decoder.decode(tick(2, linked(900, source)), context);
      expect(before[0]).toMatchObject({ rpcName: "SyntheticApplyDamage", rpcResolution: "verified" });

      // A channel switch on the same socket: the client re-authenticates but the server does not
      // re-spawn object 80, so no fresh registration for link 900 is ever sent again.
      decoder.decode(tick(3, authenticated()), context);
      const after = decoder.decode(tick(4, linked(900, source)), context);
      expect(after[0]).toMatchObject({
        linkResolved: true,
        objectId: 80,
        rpcName: "SyntheticApplyDamage",
        rpcResolution: "recovered",
      });

      // Promoted on first use, so it is a plain hit from here on.
      const later = decoder.decode(tick(5, linked(900, source)), context);
      expect(later[0]).toMatchObject({ rpcName: "SyntheticApplyDamage", rpcResolution: "verified" });
    });

    test("rejects a quarantined link whose payload does not fit the signature", () => {
      const { decoder, context } = decoderWithLink("quarantine-misfit");
      decoder.decode(tick(3, authenticated()), context);
      // Trailing byte the string parameter does not account for: consistent with the link id having
      // been reallocated to some other method, so the registration is not believed.
      const after = decoder.decode(tick(4, linked(900, Buffer.concat([source, Buffer.from([0xff])]))), context);
      expect(after[0]).toMatchObject({ linkResolved: false });
      expect(after[0]?.rpcName).toBeUndefined();
    });

    test("falls back to object liveness when the signature cannot be evaluated", () => {
      const { decoder, context } = decoderWithLink("quarantine-liveness", 4);
      decoder.decode(tick(3, authenticated()), context);
      // Nothing has re-established object 80 since the quarantine, so an unevaluable signature has
      // no corroboration at all.
      expect(decoder.decode(tick(4, linked(900, source)), context)[0]).toMatchObject({ linkResolved: false });

      // Ordinary traffic on object 80 rebinds a component, proving the object outlived the re-auth
      // and so was not replaced by whatever might have taken over link 900.
      decoder.decode(tick(5, observersRpc(80, 2, 4, source)), context);
      expect(decoder.decode(tick(6, linked(900, source)), context)[0]).toMatchObject({
        objectId: 80,
        rpcName: "SyntheticCalibrate",
        rpcResolution: "recovered",
      });
    });

    test("drops a quarantined link when its object respawns with a fresh link set", () => {
      const { decoder, context } = decoderWithLink("quarantine-respawn");
      decoder.decode(tick(3, authenticated()), context);
      // A respawn re-issues the object's links from scratch, so the pre-auth set is stale by
      // definition - link 900 must not survive on the strength of the old registration.
      decoder.decode(tick(4, spawnWithLink(80, 2, 901, 3)), context);
      expect(decoder.decode(tick(5, linked(900, source)), context)[0]).toMatchObject({ linkResolved: false });
      expect(decoder.decode(tick(6, linked(901, source)), context)[0]).toMatchObject({
        objectId: 80,
        rpcResolution: "verified",
      });
    });

    test("drops a quarantined link once its object despawns", () => {
      const { decoder, context } = decoderWithLink("quarantine-despawn");
      decoder.decode(tick(3, authenticated()), context);
      decoder.decode(tick(4, objectDespawn(80)), context);
      expect(decoder.decode(tick(5, linked(900, source)), context)[0]).toMatchObject({ linkResolved: false });
    });

    test("lets a fresh registration win over the quarantined one", () => {
      const { decoder, context } = decoderWithLink("quarantine-reregister");
      decoder.decode(tick(3, authenticated()), context);
      decoder.decode(tick(4, spawnWithLink(81, 6, 900, 3)), context);
      expect(decoder.decode(tick(5, linked(900, source)), context)[0]).toMatchObject({
        objectId: 81,
        networkBehaviourIndex: 6,
        rpcResolution: "verified",
      });
    });

    test("retains only one generation across successive re-authentications", () => {
      const { decoder, context } = decoderWithLink("quarantine-generations");
      decoder.decode(tick(3, authenticated()), context);
      decoder.decode(tick(4, authenticated()), context);
      // The first re-auth quarantined link 900; the second retired that empty generation over the
      // top of it, so the original suspects are gone rather than accumulating forever.
      expect(decoder.decode(tick(5, linked(900, source)), context)[0]).toMatchObject({ linkResolved: false });
    });

    test("keeps connections isolated - quarantine never leaks across sockets", () => {
      const { decoder } = decoderWithLink("quarantine-isolation");
      const other = decoder.decode(tick(2, linked(900, source)), { reliable: true, connectionId: "different-socket" });
      expect(other[0]).toMatchObject({ linkResolved: false });
    });
  });

  describe("decoding parameters the scraper left uncoded", () => {
    test("falls back to the codec implied by a BCL type name", () => {
      const map: FishNetRpcMap = {
        buildFingerprint: "synthetic-fallback",
        metadataVersion: 31,
        behaviours: [{
          typeName: "SyntheticToggles",
          rpcs: [{
            wireHash: 3,
            packetKind: "serverRpc",
            methodName: "SyntheticToggleBegin",
            // No codec, exactly as the scraper emits for 130 string parameters. Without the
            // fallback the decode stops here and every later field is lost with it.
            parameters: [
              { name: "id", typeName: "System.String" },
              { name: "level", typeName: "System.Int32" },
            ],
          }],
        }],
      };
      const decoder = new FishNetSessionDecoder(map);
      const payload = Buffer.concat([packed(6), Buffer.from("Stance"), packed(4)]);
      const [packet] = decoder.decode(
        tick(1, fixedServerRpc(70, 1, 3, payload)),
        { reliable: true, connectionId: "codec-fallback" },
      );
      expect(packet?.decodedFields).toEqual([
        { name: "id", typeName: "System.String", codec: "stringUtf8Packed", value: "Stance" },
        { name: "level", typeName: "System.Int32", codec: "packedInt32", value: 4 },
      ]);
    });

    test("leaves a game struct unresolved rather than guessing", () => {
      const map: FishNetRpcMap = {
        buildFingerprint: "synthetic-opaque",
        metadataVersion: 31,
        behaviours: [{
          typeName: "SyntheticOpaque",
          rpcs: [{ wireHash: 3, packetKind: "serverRpc", methodName: "SyntheticOpaqueCall", parameters: [{ name: "data", typeName: "SomeGameStruct" }] }],
        }],
      };
      const decoder = new FishNetSessionDecoder(map);
      const [packet] = decoder.decode(
        tick(1, fixedServerRpc(71, 1, 3, Buffer.from("aabb", "hex"))),
        { reliable: true, connectionId: "opaque" },
      );
      expect(packet?.decodedFields).toBeUndefined();
      expect(packet?.undecodedPayload).toEqual(Buffer.from("aabb", "hex"));
    });
  });

  describe("refusing a match the payload contradicts", () => {
    // PlayerController.FullHeal_C takes no arguments and sits at 8-bit hash 30. A behaviour with
    // many RPCs can use a 16-bit hash whose low byte is also 30 - here 0x661e - and the 8-bit
    // reading then claims a full heal that never happened.
    const COLLIDING_HASH_TAIL = Buffer.from([0x66]);

    test("does not claim a parameterless method for a packet carrying bytes", () => {
      const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
      const [packet] = decoder.decode(
        tick(1, observersRpc(4801, 1, 30, COLLIDING_HASH_TAIL)),
        { reliable: true, connectionId: "hash-collision" },
      );
      expect(packet).toMatchObject({ rpcHash16Candidate: 0x661e, rpcResolution: "unresolved" });
      expect(packet?.rpcName).toBeUndefined();
    });

    test("still accepts a parameterless method when the packet is empty", () => {
      // A genuine FullHeal_C carries nothing at all, which is exactly what distinguishes it.
      const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
      const [packet] = decoder.decode(
        tick(1, observersRpc(4801, 0, 30)),
        { reliable: true, connectionId: "hash-collision-genuine" },
      );
      expect(packet).toMatchObject({ rpcName: "FullHeal_C", rpcResolution: "verified" });
    });

    test("does not teach the connection a binding from a refused match", () => {
      const map: FishNetRpcMap = {
        buildFingerprint: "synthetic-refusal",
        metadataVersion: 31,
        behaviours: [
          { typeName: "SyntheticEmotes", rpcs: [{ wireHash: 9, packetKind: "serverRpc", methodName: "SyntheticStopEmote" }] },
          {
            typeName: "SyntheticHealth",
            rpcs: [{
              wireHash: 40,
              packetKind: "serverRpc",
              methodName: "SyntheticApplyDamage",
              parameters: [{ name: "value", typeName: "System.Int32", codec: "packedInt32" as const }],
            }],
          },
        ],
      };
      const decoder = new FishNetSessionDecoder(map);
      const context = { reliable: true, connectionId: "refusal-binding" };
      // Hash 9 matches the parameterless SyntheticStopEmote, but bytes are present, so the match is
      // refused - and index 4 must NOT be remembered as SyntheticEmotes.
      const [refused] = decoder.decode(tick(1, fixedServerRpc(90, 4, 9, Buffer.from("aabb", "hex"))), context);
      expect(refused?.rpcResolution).toBe("unresolved");
      expect(refused?.networkBehaviourType).toBeUndefined();

      // The same component later carries a hash only SyntheticHealth declares; a poisoned binding
      // would have prevented this from resolving.
      const [later] = decoder.decode(tick(2, fixedServerRpc(90, 4, 40, Buffer.from([14]))), context);
      expect(later).toMatchObject({ networkBehaviourType: "SyntheticHealth", rpcName: "SyntheticApplyDamage" });
    });
  });

  describe("payload-shape elimination", () => {
    // Two behaviours share serverRpc hash 0 with signatures of different lengths, plus a third whose
    // array parameter this decoder cannot evaluate at all.
    const map: FishNetRpcMap = {
      buildFingerprint: "synthetic-shape",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticHealth",
        rpcs: [{
          wireHash: 0,
          packetKind: "serverRpc",
          methodName: "SyntheticApplyDamage",
          parameters: [
            { name: "value", typeName: "System.Int32", codec: "packedInt32" as const },
            { name: "source", typeName: "System.String", codec: "stringUtf8Packed" as const },
          ],
        }],
      }, {
        typeName: "SyntheticCombat",
        rpcs: [{
          wireHash: 0,
          packetKind: "serverRpc",
          methodName: "SyntheticAttack",
          parameters: [{ name: "position", typeName: "UnityEngine.Vector3", codec: "vector3" as const }],
        }],
      }, {
        typeName: "SyntheticSummoning",
        rpcs: [{
          wireHash: 0,
          packetKind: "serverRpc",
          methodName: "SyntheticCalibrate",
          parameters: [{ name: "data", typeName: "SyntheticSummonData[]" }],
        }],
      }],
    };
    const damagePayload = Buffer.concat([packed(42), packed(5), Buffer.from("Smite")]);
    const vector3Payload = Buffer.concat([f32(1), f32(2), f32(3)]);

    test("picks the only candidate whose signature consumes the payload exactly", () => {
      const decoder = new FishNetSessionDecoder({ ...map, behaviours: map.behaviours.slice(0, 2) });
      const [packet] = decoder.decode(
        tick(50, fixedServerRpc(70, 3, 0, damagePayload)),
        { reliable: true, connectionId: "shape-fit" },
      );
      expect(packet).toMatchObject({
        networkBehaviourType: "SyntheticHealth",
        rpcName: "SyntheticApplyDamage",
        rpcResolution: "verified",
      });
    });

    test("binds the component so later packets resolve without re-running elimination", () => {
      const decoder = new FishNetSessionDecoder({ ...map, behaviours: map.behaviours.slice(0, 2) });
      const context = { reliable: true, connectionId: "shape-binding" };
      decoder.decode(tick(51, fixedServerRpc(70, 3, 0, damagePayload)), context);

      // This payload would fit SyntheticAttack on its own, but index 3 is bound now.
      const [packet] = decoder.decode(tick(52, fixedServerRpc(70, 3, 0, vector3Payload)), context);
      expect(packet).toMatchObject({ networkBehaviourType: "SyntheticHealth" });
    });

    test("refuses to guess when a candidate's signature cannot be evaluated", () => {
      const decoder = new FishNetSessionDecoder(map);
      const [packet] = decoder.decode(
        tick(53, fixedServerRpc(71, 3, 0, damagePayload)),
        { reliable: true, connectionId: "shape-undecodable" },
      );
      // SyntheticSummoning's array parameter might fit these bytes for all this decoder knows, so
      // dropping it to crown SyntheticHealth would be a guess dressed up as a deduction.
      expect(packet).toMatchObject({ rpcResolution: "ambiguous", networkBehaviourType: undefined });
    });

    test("refuses to guess when the payload fits more than one candidate", () => {
      const decoder = new FishNetSessionDecoder({
        ...map,
        behaviours: [map.behaviours[1]!, {
          typeName: "SyntheticMovement",
          rpcs: [{
            wireHash: 0,
            packetKind: "serverRpc",
            methodName: "SyntheticTeleport",
            parameters: [{ name: "destination", typeName: "UnityEngine.Vector3", codec: "vector3" as const }],
          }],
        }],
      });
      const [packet] = decoder.decode(
        tick(54, fixedServerRpc(72, 3, 0, vector3Payload)),
        { reliable: true, connectionId: "shape-tie" },
      );
      expect(packet).toMatchObject({ rpcResolution: "ambiguous", networkBehaviourType: undefined });
    });

    /** HealthComponent's `Damage` struct, which is what tells ApplyDamage_C apart from Attack_C. */
    function damageStruct(sourceId: string): Buffer {
      return Buffer.concat([
        packed(0), packed(1440), packed(0), packed(0), packed(1),      // Team, Value, Type, Hit, Hits
        packed(Buffer.byteLength(sourceId)), Buffer.from(sourceId),     // DamageSourceId
        packed(4802), Buffer.from([0, 0]),                              // AttackerId, IsClone, IsSummon
        packed(0), packed(0), packed(1),                                // Element, WeaponType, Range
      ]);
    }

    test("resolves damage and death on an unbound object against the bundled map", () => {
      // An ApplyDamage_C/Death_C pair on an object whose spawn was never seen. Both used to stay
      // ambiguous, and every domain tracker then dropped them.
      const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
      const context = { reliable: true, connectionId: "bundled-shape" };
      const struct = damageStruct("SyntheticBolt");
      const vector3 = Buffer.concat([f32(1), f32(2), f32(3)]);

      const [damage] = decoder.decode(
        tick(1, observersRpc(4803, 3, 0, Buffer.concat([struct, vector3, vector3]))),
        context,
      );
      expect(damage).toMatchObject({ networkBehaviourType: "HealthComponent", rpcName: "ApplyDamage_C" });

      const [death] = decoder.decode(tick(2, observersRpc(4803, 3, 2, struct)), context);
      expect(death).toMatchObject({ networkBehaviourType: "HealthComponent", rpcName: "Death_C" });
    });

    test("leaves CalibrateSummons_T ambiguous - its array parameter is unevaluable", () => {
      // Shape elimination cannot claim this one; FishNetCombatTracker recovers it instead.
      const decoder = new FishNetSessionDecoder(loadBundledFishNetRpcMap());
      const summons = Buffer.concat([
        packed(2),
        ...["SyntheticClone", "SyntheticClone"].map((id) =>
          Buffer.concat([packed(Buffer.byteLength(id)), Buffer.from(id), Buffer.from([1, 0])])),
      ]);
      const [packet] = decoder.decode(tick(3, targetRpc(4804, 6, 0, summons)), { reliable: true, connectionId: "bundled-summons" });
      expect(packet).toMatchObject({ rpcResolution: "ambiguous" });
      expect(packet?.rpcName).toBeUndefined();
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

  test("reassembles concurrent splits interleaved on one channel", () => {
    const decoder = new FishNetSessionDecoder();
    const context = { reliable: true, connectionId: "concurrent-splits", direction: "inbound" as const, channel: 2 };
    const firstPayload = message(14, u32(101));
    const secondPayload = message(21, Buffer.from([0]));
    const firstChunks = [firstPayload.subarray(0, 3), firstPayload.subarray(3)];
    const secondChunks = [secondPayload.subarray(0, 1), secondPayload.subarray(1, 2), secondPayload.subarray(2)];
    const splitPacket = (atTick: number, count: number, chunk: Buffer) => tick(atTick, message(2, Buffer.concat([packed(count), chunk])));

    expect(decoder.decode(splitPacket(40, 2, firstChunks[0]!), { ...context, sequence: 10 })).toEqual([]);
    expect(decoder.decode(splitPacket(40, 3, secondChunks[0]!), { ...context, sequence: 11 })).toEqual([]);
    expect(decoder.decode(splitPacket(40, 2, firstChunks[1]!), { ...context, sequence: 12 })[0])
      .toMatchObject({ packetName: "pingPong" });
    expect(decoder.decode(splitPacket(40, 3, secondChunks[1]!), { ...context, sequence: 13 })).toEqual([]);
    expect(decoder.decode(splitPacket(40, 3, secondChunks[2]!), { ...context, sequence: 14 })[0])
      .toMatchObject({ packetName: "version" });
  });

  test("reassembles same-count splits interleaved across ticks", () => {
    const decoder = new FishNetSessionDecoder();
    const context = { reliable: true, connectionId: "same-count-splits", direction: "inbound" as const, channel: 2 };
    const firstPayload = message(14, u32(202));
    const secondPayload = message(21, Buffer.from([0]));
    const firstChunks = [firstPayload.subarray(0, 3), firstPayload.subarray(3)];
    const secondChunks = [secondPayload.subarray(0, 2), secondPayload.subarray(2)];
    const splitPacket = (atTick: number, chunk: Buffer) => tick(atTick, message(2, Buffer.concat([packed(2), chunk])));

    expect(decoder.decode(splitPacket(50, firstChunks[0]!), { ...context, sequence: 20 })).toEqual([]);
    expect(decoder.decode(splitPacket(51, secondChunks[0]!), { ...context, sequence: 21 })).toEqual([]);
    expect(decoder.decode(splitPacket(50, firstChunks[1]!), { ...context, sequence: 22 })[0])
      .toMatchObject({ packetName: "pingPong" });
    expect(decoder.decode(splitPacket(51, secondChunks[1]!), { ...context, sequence: 23 })[0])
      .toMatchObject({ packetName: "version" });
  });

  test("bounds invalid split reassembly and tolerates gapped or reordered sequences", () => {
    const context = { reliable: true, connectionId: "bounded-split", direction: "inbound" as const, channel: 0 };
    const excessiveCount = tick(6, message(2, Buffer.concat([packed(1_025), Buffer.from([1])])));
    expect(new FishNetSessionDecoder().decode(excessiveCount, { ...context, sequence: 1 })[0])
      .toMatchObject({ packetName: "split", splitDropReason: "chunk-count" });

    const oversized = tick(6, message(2, Buffer.concat([packed(2), Buffer.alloc(1024 * 1024 + 1)])));
    expect(new FishNetSessionDecoder().decode(oversized, { ...context, sequence: 2 })[0])
      .toMatchObject({ packetName: "split", splitDropReason: "size-cap" });

    const complete = Buffer.concat([spawnWithLink(9, 1, 901, 44), linked(901, Buffer.from([5, 6]))]);
    const midpoint = Math.floor(complete.length / 2);
    const first = tick(6, message(2, Buffer.concat([packed(2), complete.subarray(0, midpoint)])));
    const second = tick(6, message(2, Buffer.concat([packed(2), complete.subarray(midpoint)])));

    // Interleaved reliable traffic leaves gaps between chunk sequences.
    const gapped = new FishNetSessionDecoder();
    expect(gapped.decode(first, { ...context, sequence: 10 })).toEqual([]);
    expect(gapped.decode(second, { ...context, sequence: 13 }).map(({ packetName }) => packetName))
      .toEqual(["objectSpawn", "rpcLink"]);

    // Wire reordering delivers a later chunk first; reassembly follows sequence order.
    const reordered = new FishNetSessionDecoder();
    expect(reordered.decode(second, { ...context, sequence: 21 })).toEqual([]);
    expect(reordered.decode(first, { ...context, sequence: 20 }).map(({ packetName }) => packetName))
      .toEqual(["objectSpawn", "rpcLink"]);

    const wrapped = new FishNetSessionDecoder();
    expect(wrapped.decode(first, { ...context, sequence: 0xffff })).toEqual([]);
    expect(wrapped.decode(second, { ...context, sequence: 0 }).map(({ packetName }) => packetName))
      .toEqual(["objectSpawn", "rpcLink"]);
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
      buildFingerprint: "synthetic-ambiguous",
      metadataVersion: 31,
      behaviours: [{
        typeName: "SyntheticBehaviour",
        rpcs: ["RpcSyntheticOne", "RpcSyntheticTwo"].map((methodName) => ({
          methodName,
          wireHash: 77,
          packetKind: "observersRpc" as const,
        })),
      }],
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
