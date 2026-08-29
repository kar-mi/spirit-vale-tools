# @kar-mi/spirit-vale-tools-capture

## 2.5.0

### Minor Changes

- ad11639: Query Windows directly through `kernel32`/`iphlpapi` instead of shelling out to
  `tasklist.exe`, `netstat.exe`, `route.exe`, and `reg.exe`. Target tracking now walks a
  Toolhelp32 process snapshot and reads the PID-owned TCP/UDP tables through
  `GetExtendedTcpTable`/`GetExtendedUdpTable`, and adapter selection reads the default
  route through `GetBestRoute` and `GetIpAddrTable`. The tracker refreshes once per
  second, so this removes four process spawns and their console-output parsing from
  every refresh tick, and drops the locale- and format-sensitivity of scraping
  `netstat`/`tasklist`/`route` text.
  
  The new `win32-system.ts` states each `MIB_*_OWNER_PID` row layout once as data - row
  size plus the address, port, and owning-PID offsets per protocol and address family -
  so one reader walks all four table shapes rather than two near-duplicate readers
  branching on family, and the remaining struct constants (`PROCESSENTRY32W`,
  `MIB_IPFORWARDROW`, `MIB_IPADDRROW`) are named where they are used.
  
  `NpcapAvailability` no longer includes `"admin-only"`. That state was detected by
  reading the `npcap` service's `AdminOnly` registry value through `reg.exe`; an
  admin-only install is now reported when it actually blocks capture - `status()` returns
  `"error"` when Npcap enumerates no adapters, and opening a device surfaces
  `PCAP_ERROR_PERM_DENIED` with guidance to run elevated or reinstall Npcap without the
  administrator-only restriction. Consumers matching on the removed `"admin-only"` value
  should handle `"error"` instead.
  
  `parseTaskList` and `parseNetstat` are gone from `target-tracker.ts`, and
  `chooseDeviceByRouteOutput` is replaced by `chooseDeviceByRouteAddress`, which takes the
  resolved address rather than `route.exe` output. None of these were exported from the
  package entrypoints.

## 2.4.2

### Patch Changes

- f1694a0: Generate and consume the verified nested summon-calibration fields, while dropping heuristic recovery of unnamed summon packets. `CalibrateSummons_T` no longer requires each entry's `Id` to be a non-null string - it's null for an anonymous stack summon (e.g. a shinobi's clones), unlike a named one (e.g. `"Cactus Boss"`), and it was never actually used, only validated.
  
  Decode `NetworkObject`-typed SyncTypes (`SummoningComponent`'s `SummonerSync`/`PrimarySync`, now carrying an explicit codec in the regenerated FishNet map) and consume `SummonSkillSync` as a login-restore fallback for `CalibrateSummons_T`.
  
  A summon already active when the client connects is restored through `SummonSkillSync`, not `CalibrateSummons_T` - that RPC only fires on a later change. Because `SummonerSync`/`PrimarySync` previously had no decodable codec, the SyncType walk halted before ever reaching `SummonSkillSync`, so the overlay showed nothing for a summon restored at login. The combat tracker now fills in that one summon from `SummonSkillSync` without overwriting whatever a later `CalibrateSummons_T` snapshot reports.
  
  `SummoningComponent.SummonSkillSync` lives on the summoned object itself, not the owning actor - the fallback credits the actor named by that same component's `SummonerSync`, tracked per summon object rather than per actor so `SummonSkillSync` and `SummonerSync` can arrive in either order, two objects reporting the same skill (e.g. two summoned clones) each count as their own stack, and a despawned object's contribution is corrected and forgotten rather than leaking onto a reused network object id.
  
  Restore effects still active at login the same way: `PlayerSave.LoadCharacter_T`'s own `State.Effects` snapshot is the only packet that reports a buff that was already active when the client connects - `ApplyEffect_T`/`ApplyEffectDisplays_O` only fire on a later change or refresh, exactly like `CalibrateSummons_T` for summons.

## 2.4.1

### Patch Changes

- f181ebf: Reconstruct FishNet prefab IDs from runtime AssetPathHash ordering so gravestone spawns and SyncTypes decode correctly.

## 2.4.0

### Minor Changes

- 0dc8425: Decode complete player spawn SyncTypes from generated build mappings, including visual, movement, combat, health, and mana state.

  Expose spawn-embedded character resources safely after local-object proof, and add authoritative-first `normalizedMaxHp` and `normalizedMaxMp` values that can infer a missing maximum from a settled regeneration sequence.

## 2.3.0

### Minor Changes

- 813bce6: Restore market search, stall tracking, event logs, live following, and capture
  replay with the current vending contracts. Add deterministic search-request and
  stall-status field layouts to the supported FishNet map, including explicit
  verified-prefix handling for late-attach search requests, and register the market
  log stream. The restored market API intentionally excludes the former SQLite
  history and indexed read-model interfaces. Market event logs omit seller account
  identifiers while retaining seller display names, and omit stall account and
  visual-snapshot and archetype data. Item compatibility fingerprints and payload
  schema versions are recorded once as market metadata instead of repeated on
  every listing.

## 2.2.0

### Minor Changes

- 3079aba: Regenerated the bundled FishNet RPC map, prefab layouts, and static map-name table from a fresh game-build export (build fingerprint `866d79aa379d16d...`), and added `scripts/generate-map-names.ts` so the map-name table (`fishnet/map-definitions/current-build.ts`) is now build-derived like the RPC map instead of hand-pasted.

  Picks up real build changes: `Player`/`PlayerClone`/`Monster`/`BossGravestone`/`SkillInstance` prefab IDs were reassigned, `CharacterData`'s `CharacterStateData` gained `InstancedMapReturnMapId`/`InstancedMapReturnPosition`, several RPC wire hashes shifted (e.g. `FullHeal_C` 31→30, `ETUpdateRun` 95→97), and the static map catalog grew from 54 to 56 entries. `EternalTowerClientState` (the `match` parameter of `ETUpdateRun`) has no resolved fields in this build's export, unlike the prior build - the RPC still resolves by name, but its payload is left undecoded until a future export fills the struct in.

  The item catalog (`packages/items/src/definitions/*.ts`) is also regenerated against the same build: equipment/card/cosmetic counts shifted, and the "Echo" relic set was renamed `EchoMask_*` → `EchoFace_*` plus two new items (`Bloomroot`, `Earthspire`) - all carried over with a `weight: 0` placeholder pending manual review, per the generator's existing NEEDS REVIEW convention.

## 2.1.1

### Patch Changes

- 697afa6: `decodeBossGravestone` now reads the marker's `_killInfo` from a standalone SyncType as well as from a spawn's `spawnSyncEntries`.

  Creating a gravestone spawns the object carrying none of its fields and sends them straight after in a SyncType on the same object; only a marker already standing carries them in the spawn. Reading spawn entries alone therefore resolved every gravestone except the one the player had just made.

  Callers offering only `objectSpawn` packets see no behaviour change, but should now offer SyncTypes too.

## 2.1.0

### Minor Changes

- 04bf95c: Require Bun 1.4 or newer. The SQLite read model now relies on Bun 1.4's statement ownership and
  force-close behavior to release every outstanding database handle immediately on Windows.

## 2.0.0

### Major Changes

- 6258350: Rebuild Eternal Tower state from the `DrawTitle` and `ClientInstancedMapReady` RPCs, exposing the tower name, floor, and instance information when available. This replaces the previous phase-based tracker: `FishNetEternalTowerPhase` is no longer exported.

  Decode monster state and spawn SyncTypes from the bundled RPC map rather than heuristic scans of raw payload bytes. `decodeMonsterSync` is no longer exported; consume the decoded packet fields and `spawnSyncEntries` instead.

## 1.9.0

### Minor Changes

- ff7e85b: `decodeBossGravestone` now reads the boss's kill info from the bundled RPC map's own field schema instead of byte-scanning the spawn payload's tail for three plausible strings and a timestamp. `BossGraveStone`'s `SyncVar<BossKillInfo>` was never resolved into the wire map before, so this is a data-mine extraction fix as much as a decode one: `KillTime`/`KillerName`/`BossName`/`BossId` are now generated fields like any other SyncType, decoded automatically into a spawn's `spawnSyncEntries` the same way `LootDrop`'s `Dto`/`Lock` already are.

  `decodeBossGravestone`'s signature changes accordingly, from `(payload: Buffer, nowMs: number)` to `(packet: DecodedFishNetPacket)` — it now looks up the `BossGraveStone` entry in `packet.spawnSyncEntries` instead of taking a raw payload and an observation time to bound a plausible decode.

  `scripts/generate-rpc-map.ts` also had a path bug fixed: it was resolving `generated/` and `game-build.ts` relative to its own location as if it lived under `packages/capture/scripts/`, when it has lived at the repo-root `scripts/` since it was added. Running it wrote a stray `src/` at the repo root instead of updating `packages/capture/src/`.

## 1.8.0

### Minor Changes

- c4ed2e8: Decode `CharacterData` payloads through the bundled RPC map's own field schema instead of hand-rolled, positionally-hardcoded byte readers. The old readers silently misaligned every field after a build inserted `AppliedWriteIds` into `CharacterData`, and separately truncated non-Latin display names sized as if a character were always one byte. `character`'s `decodeCharacterRpcPayload` and `combat`'s actor-name resolution now both decode through `decodeFieldRun`/`characterDataParameter()`, so they can't drift from the game build's real field layout again.

  `capture` gains the schema-decoding building blocks this relies on (`decodeFieldRun`, `characterDataParameter`, and `repeated`/`dictionaryKey` array and dictionary support in the field decoder), and its bundled FishNet RPC map is now regenerated from the game build via `packages/capture/scripts/generate-rpc-map.ts` instead of hand-pasted, split into one file per network behaviour instead of one 12k+ line file.

  The bundled map's `syncTypes` also gained many previously-unextracted SyncVars now that the map is build-derived instead of hand-verified per behaviour: `HealthComponent` gained `barrierSync`/`overhealSync` (indexes 2/3, alongside `healthSync`/`maxHealthSync`), `SkillsComponent` gained `BondSync` (alongside `manaSync`/`maxManaSync`), `PlayerSave` gained `PlayerIdSync`/`ArenaRating`, and `CombatComponent`/`MonsterController`/`MoveComponent`/`PlayerController`/`StatusComponent`/`SummoningComponent` now carry SyncVar metadata they previously had none of at all (`PlayerController` alone gained 19 - chat room state, guild info, party ID, GM/jail flags, and more). `PlayerController.VisualData`'s nested `Appearance` field (display name/archetype, load-bearing for `combat`'s actor identity) also now resolves automatically instead of through a hand-verified override.

  The entire hand-rolled `game/` overlay directory - per-behaviour `syncTypes` overrides and PlayerSave's 7-file hand split alike - is gone. `rpc-definitions/index.ts` assembles `FISHNET_RPC_MAP` directly from generated output with no override layer of any kind; every RPC, broadcast, prefab, and SyncVar the package ships now traces to exactly one generated source. Field names that were previously hand-chosen (`CurrentHealth`/`MaxHealth`/`CurrentMana`/`MaxMana`) are now the build's own reflected names (`healthSync`/`maxHealthSync`/`manaSync`/`maxManaSync`); nothing reads them by string, only positionally, so this is not a breaking rename in practice.

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
