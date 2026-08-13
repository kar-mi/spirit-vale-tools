import type { FishNetPrefabDefinition } from "../definitions/rpc-map.ts";

const PLAYER_COMPONENTS = [
  { index: 0, typeName: "PlayerController" },
  { index: 1, typeName: "MoveComponent" },
  { index: 2, typeName: "HealthComponent" },
  { index: 3, typeName: "CombatComponent" },
  { index: 4, typeName: "SkillsComponent" },
  { index: 5, typeName: "StatusComponent" },
  { index: 6, typeName: "SummoningComponent" },
  { index: 7, typeName: "PlayerSave" },
  { index: 8, typeName: "FishNet.Component.Transforming.NetworkTransform" },
] as const;

/** Verified layouts for instantiated prefabs in the current build's default collection. */
export const FISHNET_PREFAB_DEFINITIONS = [
  { collectionId: 0, prefabId: 0, prefabName: "LootDrop", components: [
    { index: 0, typeName: "LootDrop" },
  ] },
  { collectionId: 0, prefabId: 1, prefabName: "PlayerClone", components: PLAYER_COMPONENTS },
  { collectionId: 0, prefabId: 2, prefabName: "SkillInstance", components: [
    { index: 1, typeName: "FishNet.Component.Transforming.NetworkTransform" },
  ] },
  { collectionId: 0, prefabId: 4, prefabName: "Player", components: PLAYER_COMPONENTS },
  { collectionId: 0, prefabId: 5, prefabName: "Monster", components: [
    { index: 0, typeName: "MonsterController" },
    { index: 1, typeName: "FishNet.Component.Transforming.NetworkTransform" },
    { index: 2, typeName: "MoveComponent" },
    { index: 3, typeName: "HealthComponent" },
    { index: 4, typeName: "CombatComponent" },
    { index: 5, typeName: "SkillsComponent" },
    { index: 6, typeName: "StatusComponent" },
    { index: 7, typeName: "SummoningComponent" },
  ] },
] as const satisfies readonly FishNetPrefabDefinition[];
