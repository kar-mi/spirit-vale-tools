import { describe, expect, test } from "bun:test";
import { recoverComponentFromPrefabLayouts } from "./rpc-inference.ts";
import type { FishNetRpcMap } from "../types.ts";

/** Two layouts share a controller at index 0 and a transform at index 8, mirroring a build where a unit and its clone are byte-identical. */
const map: FishNetRpcMap = {
  buildFingerprint: "synthetic-recovery",
  metadataVersion: 31,
  behaviours: [],
  broadcasts: [],
  prefabs: [
    { collectionId: 0, prefabId: 1, prefabName: "SyntheticUnitClone", components: [
      { index: 0, typeName: "SyntheticController" },
      { index: 8, typeName: "SyntheticTransform" },
    ] },
    { collectionId: 0, prefabId: 4, prefabName: "SyntheticUnit", components: [
      { index: 0, typeName: "SyntheticController" },
      { index: 8, typeName: "SyntheticTransform" },
    ] },
    { collectionId: 0, prefabId: 5, prefabName: "SyntheticCreature", components: [
      { index: 0, typeName: "SyntheticCreatureController" },
      { index: 8, typeName: "SyntheticOther" },
    ] },
  ],
};

const components = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("recoverComponentFromPrefabLayouts", () => {
  test("binds an index every layout consistent with the known bindings agrees on", () => {
    // Only the two unit layouts have SyntheticController at 0, and both put the transform at 8.
    expect(recoverComponentFromPrefabLayouts(map, components({ "70:0": "SyntheticController" }), 70, 8))
      .toBe("SyntheticTransform");
  });

  test("recovers nothing when the object has no verified binding to narrow from", () => {
    expect(recoverComponentFromPrefabLayouts(map, components({}), 70, 8)).toBeUndefined();
    expect(recoverComponentFromPrefabLayouts(map, components({ "99:0": "SyntheticController" }), 70, 8))
      .toBeUndefined();
  });

  test("recovers nothing when surviving layouts disagree on the index", () => {
    const wider: FishNetRpcMap = {
      ...map,
      prefabs: [
        ...(map.prefabs ?? []),
        { collectionId: 0, prefabId: 9, prefabName: "SyntheticVariant", components: [
          { index: 0, typeName: "SyntheticController" },
          { index: 8, typeName: "SyntheticDifferent" },
        ] },
      ],
    };

    expect(recoverComponentFromPrefabLayouts(wider, components({ "70:0": "SyntheticController" }), 70, 8))
      .toBeUndefined();
  });

  test("abandons the attempt when a surviving layout leaves the index blank", () => {
    const sparse: FishNetRpcMap = {
      ...map,
      prefabs: [
        ...(map.prefabs ?? []),
        { collectionId: 0, prefabId: 10, prefabName: "SyntheticSparse", components: [
          { index: 0, typeName: "SyntheticController" },
        ] },
      ],
    };

    expect(recoverComponentFromPrefabLayouts(sparse, components({ "70:0": "SyntheticController" }), 70, 8))
      .toBeUndefined();
  });

  test("discards a layout that contradicts a known binding", () => {
    // The creature layout is ruled out by index 0, so its differing index 8 must not block recovery.
    expect(recoverComponentFromPrefabLayouts(map, components({ "70:0": "SyntheticController", "70:8": "SyntheticTransform" }), 70, 3))
      .toBeUndefined();
  });

  test("never re-derives an index that is already bound", () => {
    expect(recoverComponentFromPrefabLayouts(map, components({ "70:0": "SyntheticController", "70:8": "SyntheticOther" }), 70, 8))
      .toBe(undefined);
  });
});
