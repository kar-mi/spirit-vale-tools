---
"@kar-mi/spirit-vale-tools-combat": minor
---

Add a `stickyPlayerIdentities` option to `FishNetActorDirectory`. When enabled, an object with
positive monster or summon/clone evidence (`MonsterController.Data` /
`SummoningComponent.SummonerSync`) forgets its identity the moment it despawns, while a player's
identity still survives its own despawn/respawn cycle. The default (option absent) is unchanged:
every identity is retained until it is directly replaced. This folds in behaviour the overlay
previously hand-rolled as a `FishNetActorDirectory` subclass.
