# @kar-mi/spirit-vale-tools-capture

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
