# @kar-mi/spirit-vale-tools-capture

## 1.7.0

### Minor Changes

- 0c63a99: Decode the rotation quaternion FishNet's `NetworkTransform` and spawn RPCs carry (all three wire packings: 16-byte uncompressed, and the 8- and 4-byte "smallest three" compressed forms), and derive a heading (yaw) from it. `networkTransform.rotation`/`.heading` and `spawnLocalRotation`/`spawnHeading` are now populated on `DecodedFishNetPacket` instead of being left undecoded, and `FishNetPositionTracker`'s `FishNetPosition` gained an optional `heading` field that carries forward the same way position axes do.

## 1.6.0

### Minor Changes

- 74908b7: Decode NetworkTransform movement updates and track object positions.

  `NetworkTransform`'s three movement RPCs declare a bare `ArraySegment<byte>` that the generated RPC
  map cannot describe. Their layout is fixed by FishNet rather than the game build, so it is now
  parsed directly: `decodeNetworkTransformData` reads the per-axis flags, the fixed-point and float32
  axis forms, and the optional scale extension, and the result is exposed on a packet as
  `networkTransform`.

  `FishNetPositionTracker` turns those partial updates into whole positions by carrying each object's
  last known axes forward from its spawn transform. It performs no local-player inference of its own —
  the caller supplies the local object id from the existing identity sources.

- 74908b7: Decode object spawn transforms and every SyncType in a bundled body.

  `objectSpawn` previously skipped its transform header; its position and scale are now read and
  exposed as `spawnLocalPosition` and `spawnLocalScale`, with `spawnLocalRotation` for the
  uncompressed quaternion form. A `syncType` body carrying several SyncTypes now decodes all of them
  into `syncEntries` instead of only the first, so layouts that share a payload no longer fall into
  `undecodedPayload`.

  An ObjectSpawn's own SyncTypes are decoded too, as `spawnSyncEntries`. That body is framed
  differently from a standalone SyncType packet — each run is a component index, a count, and then
  that many index-prefixed values — and it is where a short-lived object's state often arrives, since
  a follow-up SyncType packet is not guaranteed.

  Adds `findPrefab` for resolving a spawn's collection and prefab IDs to the build's prefab layout,
  so consumers can match on `prefabName` rather than a wire ID that changes between builds.

- 74908b7: Recover component bindings for an object whose spawn was never captured.

  A capture that attaches mid-session never sees the local player's spawn, so nothing registers its
  component layout and every packet on its other components stays unresolved for the whole session —
  including the NetworkTransform updates carrying its position.

  Resolution now narrows the build's prefab layouts by the bindings already verified on that same
  object, and binds another index only where every surviving layout names the same type for it. The
  bar is deliberately high: at least one verified binding is required to narrow from, every survivor
  must define the wanted index, and they must agree. A layout contradicting a known binding is
  discarded; one leaving the index blank abandons the attempt.

## 1.5.0

### Minor Changes

- 4484e48: Update the bundled game build to `ae23cb62`. RPC behaviours, broadcasts and SyncTypes are unchanged from the previous build; the spawnable-prefab table was reassigned, moving the player clone to prefab 1, `SkillInstance` to 2 and leaving the real player on 4. Prefab definitions now carry `prefabName`, which is the only thing separating the identically shaped `Player` and `PlayerClone` layouts. Combat's actor directory derives its player prefab from the bundled map instead of a hardcoded ID that had gone stale two builds ago, so spawns without RPC-link registrations name players again and mirrored clones are no longer counted as actors.

## 1.4.0

### Minor Changes

- 5f45103: Decode the authoritative Eternal Tower run prefix and expose a stateful tracker for tower phase and floor.

## 1.3.3

### Patch Changes

- 6c65ece: Fix RPC mapping: add the LootDrop sync-only behaviour and correct prefab component/index assignments in the bundled FishNet metadata.

## 1.3.2

### Patch Changes

- f82d0d8: Update bundled FishNet RPC metadata and verified prefab layouts for the current game build.

## 1.3.1

### Patch Changes

- 70a8d83: Decode known map IDs to public names, including the current channel population arrays. Decode the
  floor from Eternal Tower run updates, clearly marking absent and undecodable runs.

## 1.3.0

### Minor Changes

- e4a1451: Update capture decoding for the current Spirit Vale network protocol and build fingerprint. Bundle the complete regenerated RPC map, recover client-writer-only ServerRPC registrations, correct current prefab component layouts, add signed packed 64-bit decoding, and reject RPC matches whose known signatures do not consume the payload exactly.

  Migrate market decoding to the current JSON vending contracts and update persisted market stalls to use `stallId` and `slotId`. This removes the public `stallIndex` and `rotationY` fields, replaces the old binary vending DTO decoder, and bumps the market read-model schema.

## 1.2.1

### Patch Changes

- d4f3926: Recover FishNet component types from verified, build-scoped prefab layouts when an instantiated spawn omits its RPC Link registrations.

## 1.2.0

### Minor Changes

- f343310: Improve FishNet packet recovery across reauthentication and unresolved traffic, add observer status, summon, and full-heal combat handling, and make JSONL output paths reliable on Windows.

## 1.1.0

### Minor Changes

- 32c4896: Name enemies from their spawn packets, so the DPS enemy breakdown stops labelling them `Enemy <id>`.

  **The gap.** A monster's name was only ever learned from an activation record carrying
  `MOB_IDENTITY_PREFIX` — that is, from the monster _doing_ something. The death log labels the
  attacker, which by definition acted, so it showed names. The enemy breakdown labels the _target_,
  and `FishNetCombatDamageEvent` carries the attacker's identity but nothing about the target, so a
  monster killed before it cast anything was never named at all. Whole encounters of farmed mobs came
  out as `Enemy 90`, `Enemy 91`.

  The name was in the stream the whole time: the reward tracker resolves it from `objectSpawn` and
  `MonsterController` sync packets against the bundled mob catalog, keyed by the same object id that
  combat calls `targetId`.

  **Sharing the identification.** `FishNetMonsterDirectory` moves into the capture package, which both
  sides already depend on, along with `decodeMonsterSpawn` and `decodeMonsterSync`. It resolves a
  `mobId` and nothing else; naming stays with whoever owns a catalog. `FishNetMobDirectory` is now a
  thin naming layer over it and behaves as before.

  **Combat.** `FishNetCombatTracker` accepts an optional `monsterCatalog`, and when given one it
  tracks spawns and emits flat `monsterIdentity` lifecycle events. The catalog is injected rather than
  imported because rewards already depends on combat; `mobDefinitionsById()` from the rewards package
  is the intended argument. Emitting identity once per object avoids repeating the same catalog data
  on every damage and death record. Without the option the tracker behaves exactly as before.

  **Persisting it.** `EncounterAggregate` gains `enemyNames`, captured when the hit lands rather than
  looked up when the encounter is written. This matters twice over: the combat log carries identity
  events rather than raw spawn packets; and an open encounter's
  enemy rows are deleted and rewritten on every indexing pass, which previously let an eviction from
  the capped `mobIdentities` map replace an already-stored name with null. Resuming an open encounter
  now restores the stored names for the same reason.

  Enemies that are absent from the bundled catalog, or that spawned before capture started, still fall
  back to the activation-derived name and then to `Enemy <id>`. Because the name has to be recorded at
  capture time, existing logs and read models are unaffected — only newly captured sessions carry it.

## 1.0.0

### Major Changes

- 32cdaba: Remove support for the legacy game build. The capture package no longer exports
  `LEGACY_GAME_BUILD_FINGERPRINT`, and bundled RPC and semantic-map loaders now
  accept only the current game build. The combat tracker likewise no longer loads
  legacy semantic labels when given the retired build fingerprint.

### Minor Changes

- 32cdaba: Classify build-specific health recovery as standard healing, passive regeneration, or drain healing. Attribute passive regeneration as self-healing and label drain recovery from visible local character traits while retaining a combined Siphon/Leech label for unknown or remote builds. Persist the optional recovery style in sanitized combat logs for replay compatibility.

## 0.2.4

### Patch Changes

- 21f610c: Resolve `Recover_C` (and other RPCs sharing a wire hash + packet kind across behaviour types, e.g. `HealthComponent` vs. `SkillsComponent`) using the invariant that a NetworkObject has at most one instance of each behaviour type: if every ambiguous candidate but one is already bound to a different component index on the same object, the remaining candidate is used. Previously such RPCs stayed unresolved (and were silently dropped by consumers) whenever the component's own binding hadn't already been established, which was the common case for `HealthComponent.Recover_C` — the root cause of heal events never appearing in real captures.

## 0.2.3

### Patch Changes

- 86aefa5: Decode `HealthComponent.Recover_C` and expose it from `FishNetCombatTracker` as a new `FishNetCombatHealEvent` (`kind: "heal"`). Healer attribution is best-effort, since the RPC carries no healer id: single matching healing-skill cast targeting the recipient resolves to `attribution: "exact"`/`"inferred"`, overlapping candidates resolve to `"ambiguous"`, and no match resolves to `"unattributed"` (still reports the healed target and amount). `parseDpsLogRecord` now recognizes `kind: "heal"` records from persisted logs.

  Also attribute heals that land via the `Regeneration` status (`Sanctuary`, `GuardianBond`, `SanctuaryField`, `HealAll` — per `Regeneration`'s effect list in the statuses catalog) instead of an immediate `Recover_C`: the caster is resolved once when `StatusComponent.ApplyEffect_T` grants the status (correlated against a recent matching cast, same ambiguity rules as direct heals) and reused for every `Recover_C` tick on that target until `RemoveEffect_T` clears it.

## 0.2.2

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.

## 0.2.1

### Patch Changes

- 9ecf64b: add status effects

## 0.2.0

### Minor Changes

- d2d24da: add status effects

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
