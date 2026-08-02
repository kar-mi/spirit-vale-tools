---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-combat": minor
"@kar-mi/spirit-vale-tools-rewards": patch
---

Name enemies from their spawn packets, so the DPS enemy breakdown stops labelling them `Enemy <id>`.

**The gap.** A monster's name was only ever learned from an activation record carrying
`MOB_IDENTITY_PREFIX` — that is, from the monster *doing* something. The death log labels the
attacker, which by definition acted, so it showed names. The enemy breakdown labels the *target*,
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
