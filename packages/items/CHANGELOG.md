# @kar-mi/spirit-vale-tools-items

## 0.1.9

### Patch Changes

- 3079aba: Regenerated the bundled FishNet RPC map, prefab layouts, and static map-name table from a fresh game-build export (build fingerprint `866d79aa379d16d...`), and added `scripts/generate-map-names.ts` so the map-name table (`fishnet/map-definitions/current-build.ts`) is now build-derived like the RPC map instead of hand-pasted.

  Picks up real build changes: `Player`/`PlayerClone`/`Monster`/`BossGravestone`/`SkillInstance` prefab IDs were reassigned, `CharacterData`'s `CharacterStateData` gained `InstancedMapReturnMapId`/`InstancedMapReturnPosition`, several RPC wire hashes shifted (e.g. `FullHeal_C` 31→30, `ETUpdateRun` 95→97), and the static map catalog grew from 54 to 56 entries. `EternalTowerClientState` (the `match` parameter of `ETUpdateRun`) has no resolved fields in this build's export, unlike the prior build - the RPC still resolves by name, but its payload is left undecoded until a future export fills the struct in.

  The item catalog (`packages/items/src/definitions/*.ts`) is also regenerated against the same build: equipment/card/cosmetic counts shifted, and the "Echo" relic set was renamed `EchoMask_*` → `EchoFace_*` plus two new items (`Bloomroot`, `Earthspire`) - all carried over with a `weight: 0` placeholder pending manual review, per the generator's existing NEEDS REVIEW convention.

- Updated dependencies [3079aba]
  - @kar-mi/spirit-vale-tools-capture@2.2.0

## 0.1.8

### Patch Changes

- Updated dependencies [6258350]
  - @kar-mi/spirit-vale-tools-capture@2.0.0

## 0.1.7

### Patch Changes

- bbfec25: The item catalog (`packages/items/src/definitions/*.ts`) is now regenerated from a data-mine `items.json` export via `scripts/generate-items-map.ts`, instead of hand-pasted per category. The catalog picks up the current game build's item changes as a result: new equipment (the "Echo" gear set, the Gunslinger artifact set, and others), rebalanced equipment/card stat values, several renamed cosmetics, and a handful of removed items.

  `weight` and `substatGroup` on equipment definitions have no source in the data-mine export, so the generator carries them forward by item id from the previously bundled catalog; newly added equipment gets a `weight: 0` placeholder the generator flags for manual review rather than guessing at.

  `scripts/generate-rpc-map.ts` also moved from `packages/capture/scripts/` to the repo-root `scripts/` alongside the new generator, with its stale in-file path references updated to match.

## 0.1.6

### Patch Changes

- bf1d886: Correctly scale socketed card effects with their equipped gear's refine level, including the Delivery Robot card's weight bonus.

## 0.1.5

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0

## 0.1.4

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2

## 0.1.3

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-capture@0.2.1

## 0.1.2

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-capture@0.2.0

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
