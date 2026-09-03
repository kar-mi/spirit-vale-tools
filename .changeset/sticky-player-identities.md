---
"@kar-mi/spirit-vale-tools-combat": minor
---

Add a `stickyPlayerIdentities` option to `FishNetActorDirectory`. When enabled, an object with
positive monster or summon/clone evidence (`MonsterController.Data` /
`SummoningComponent.SummonerSync`) is kept off the player identity roster: its display name is
never populated from owner-based propagation, and it is dropped from `getAttribution` / `snapshot`
as soon as the evidence is seen and again on despawn. Owner-based attribution still resolves the
summoner, so a summon's or clone's damage is still credited to its owner. A real player's identity
still survives its own despawn/respawn cycle. The default (option absent) is unchanged: every
identity is retained until it is directly replaced. This folds in behaviour the overlay previously
hand-rolled as a `FishNetActorDirectory` subclass.
