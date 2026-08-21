# @kar-mi/spirit-vale-tools-character

## 0.4.2

### Patch Changes

- c4ed2e8: Decode `CharacterData` payloads through the bundled RPC map's own field schema instead of hand-rolled, positionally-hardcoded byte readers. The old readers silently misaligned every field after a build inserted `AppliedWriteIds` into `CharacterData`, and separately truncated non-Latin display names sized as if a character were always one byte. `character`'s `decodeCharacterRpcPayload` and `combat`'s actor-name resolution now both decode through `decodeFieldRun`/`characterDataParameter()`, so they can't drift from the game build's real field layout again.

  `capture` gains the schema-decoding building blocks this relies on (`decodeFieldRun`, `characterDataParameter`, and `repeated`/`dictionaryKey` array and dictionary support in the field decoder), and its bundled FishNet RPC map is now regenerated from the game build via `packages/capture/scripts/generate-rpc-map.ts` instead of hand-pasted, split into one file per network behaviour instead of one 12k+ line file.

  The bundled map's `syncTypes` also gained many previously-unextracted SyncVars now that the map is build-derived instead of hand-verified per behaviour: `HealthComponent` gained `barrierSync`/`overhealSync` (indexes 2/3, alongside `healthSync`/`maxHealthSync`), `SkillsComponent` gained `BondSync` (alongside `manaSync`/`maxManaSync`), `PlayerSave` gained `PlayerIdSync`/`ArenaRating`, and `CombatComponent`/`MonsterController`/`MoveComponent`/`PlayerController`/`StatusComponent`/`SummoningComponent` now carry SyncVar metadata they previously had none of at all (`PlayerController` alone gained 19 - chat room state, guild info, party ID, GM/jail flags, and more). `PlayerController.VisualData`'s nested `Appearance` field (display name/archetype, load-bearing for `combat`'s actor identity) also now resolves automatically instead of through a hand-verified override.

  The entire hand-rolled `game/` overlay directory - per-behaviour `syncTypes` overrides and PlayerSave's 7-file hand split alike - is gone. `rpc-definitions/index.ts` assembles `FISHNET_RPC_MAP` directly from generated output with no override layer of any kind; every RPC, broadcast, prefab, and SyncVar the package ships now traces to exactly one generated source. Field names that were previously hand-chosen (`CurrentHealth`/`MaxHealth`/`CurrentMana`/`MaxMana`) are now the build's own reflected names (`healthSync`/`maxHealthSync`/`manaSync`/`maxManaSync`); nothing reads them by string, only positionally, so this is not a breaking rename in practice.

- Updated dependencies [c4ed2e8]
  - @kar-mi/spirit-vale-tools-capture@1.8.0

## 0.4.1

### Patch Changes

- bf1d886: Correctly scale socketed card effects with their equipped gear's refine level, including the Delivery Robot card's weight bonus.
- Updated dependencies [bf1d886]
  - @kar-mi/spirit-vale-tools-items@0.1.6

## 0.4.0

### Minor Changes

- 5bce16e: Surface character fields the decoder already walked but discarded, stop merging the action bar into the skill allocation, and decode inspected players.

  **Additive fields.** `CharacterSubstat.qualifier` (`StatData.ValueStr`) and `.index`, `CharacterEquipment.chaosType` (`EquipData.ChaosType`) and `.cardsBySlot`, plus `CharacterSnapshot.loadouts`, `.grimoires` and `.assignedSkills`. The dense `substats` and `cards` arrays are unchanged, so `rescaleSubstats` and every current consumer keep their present shape. The positional fields exist because a chaos roll is identified by being the last substat, and a densified array cannot express which card socket is empty.

  **Behaviour change.** `CharacterSnapshot.skills` previously merged `SkillSystemData.Assigned` — the 40-slot action bar — into `SkillSystemData.Skills`, taking the higher level per id. Those are different things: the action bar restates learned skills at levels that do not match the allocation, and carries skills granted by grimoires rather than by spent points. On a recorded level-121 job-70 Gunslinger the merge reported 146 skill points against a legal budget of 120 (50 base + 70 job), inventing Force Shot, Piercing Shot and Sniper Shot at full level and doubling Panic Burst. `skills` is now the allocation alone (still folding in `SkillCopy`, which legitimately restates a learned skill) and the action bar is reported separately as `assignedSkills`.

  **New `FishNetInspectRoster`.** `PlayerController.Inspect_T(conn, CharacterData)` carries another player's whole character in the same shape as `CharacterCallback_T`, minus the leading `CharacterUpdateType`. The roster keeps the most recent inspect per player, capped and evicted least-recently-inspected. It is separate from `FishNetCharacterTracker` on purpose — that class merges into a single local snapshot, so an inspected stranger routed through it would overwrite your own character. Matching is by RPC name only: the bundled prefab layout binds `PlayerController` from the spawn's prefab id, so the reply is named even on a capture that joined mid-session and saw no RPC Link registrations. The local character arrives on `PlayerSave` (`CharacterCallback_T`, `LoadCharacter_T`), so the only self/stranger ambiguity left is inspecting yourself, which `setLocalName` filters out.

## 0.3.1

### Patch Changes

- Updated dependencies [977fd5f]
  - @kar-mi/spirit-vale-tools-skills@0.2.0

## 0.3.0

### Minor Changes

- b8a7654: Scope live character tracking to the transport connection that pinned the local player object. The client keeps several server connections open at once, so an `authenticated` or `disconnect` raised on a neighbouring connection was releasing the pin held on the live one, blanking health and mana mid-session; object ids are only unique within a connection, so buffered records now key on both. Carried weight also survives connection boundaries, despawns and re-pins now — it is character-scoped like the snapshot it is derived from, and only a complete callback can restore it, so clearing it left the panel weightless until the following map change. Health and mana keep their object-scoped lifetime, since the sync stream refills them within moments.

## 0.2.2

### Patch Changes

- abf02e7: Clear stale carried-weight records when the local player object or connection changes while preserving complete weight callbacks received before the replacement object is identified.

## 0.2.1

### Patch Changes

- 6f655db: Preserve early health and mana syncs until the local multiplayer character is identified, keeping character records accurate when packets arrive in a different order across map changes.

## 0.2.0

### Minor Changes

- 32cdaba: Classify build-specific health recovery as standard healing, passive regeneration, or drain healing. Attribute passive regeneration as self-healing and label drain recovery from visible local character traits while retaining a combined Siphon/Leech label for unknown or remote builds. Persist the optional recovery style in sanitized combat logs for replay compatibility.

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0
  - @kar-mi/spirit-vale-tools-items@0.1.5
  - @kar-mi/spirit-vale-tools-skills@0.1.5

## 0.1.4

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2
  - @kar-mi/spirit-vale-tools-items@0.1.4
  - @kar-mi/spirit-vale-tools-skills@0.1.4

## 0.1.3

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-capture@0.2.1
  - @kar-mi/spirit-vale-tools-items@0.1.3
  - @kar-mi/spirit-vale-tools-skills@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-capture@0.2.0
  - @kar-mi/spirit-vale-tools-items@0.1.2
  - @kar-mi/spirit-vale-tools-skills@0.1.2

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
  - @kar-mi/spirit-vale-tools-items@0.1.1
  - @kar-mi/spirit-vale-tools-skills@0.1.1
