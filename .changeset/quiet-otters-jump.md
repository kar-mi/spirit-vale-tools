---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-items": patch
---

Regenerated the bundled FishNet RPC map, prefab layouts, and static map-name table from a fresh game-build export (build fingerprint `866d79aa379d16d...`), and added `scripts/generate-map-names.ts` so the map-name table (`fishnet/map-definitions/current-build.ts`) is now build-derived like the RPC map instead of hand-pasted.

Picks up real build changes: `Player`/`PlayerClone`/`Monster`/`BossGravestone`/`SkillInstance` prefab IDs were reassigned, `CharacterData`'s `CharacterStateData` gained `InstancedMapReturnMapId`/`InstancedMapReturnPosition`, several RPC wire hashes shifted (e.g. `FullHeal_C` 31→30, `ETUpdateRun` 95→97), and the static map catalog grew from 54 to 56 entries. `EternalTowerClientState` (the `match` parameter of `ETUpdateRun`) has no resolved fields in this build's export, unlike the prior build - the RPC still resolves by name, but its payload is left undecoded until a future export fills the struct in.

The item catalog (`packages/items/src/definitions/*.ts`) is also regenerated against the same build: equipment/card/cosmetic counts shifted, and the "Echo" relic set was renamed `EchoMask_*` → `EchoFace_*` plus two new items (`Bloomroot`, `Earthspire`) - all carried over with a `weight: 0` placeholder pending manual review, per the generator's existing NEEDS REVIEW convention.
