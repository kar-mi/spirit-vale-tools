---
"@kar-mi/spirit-vale-tools-capture": patch
"@kar-mi/spirit-vale-tools-combat": patch
---

Generate and consume the verified nested summon-calibration fields, while dropping heuristic recovery of unnamed summon packets. `CalibrateSummons_T` no longer requires each entry's `Id` to be a non-null string - it's null for an anonymous stack summon (e.g. a shinobi's clones), unlike a named one (e.g. `"Cactus Boss"`), and it was never actually used, only validated.

Decode `NetworkObject`-typed SyncTypes (`SummoningComponent`'s `SummonerSync`/`PrimarySync`, now carrying an explicit codec in the regenerated FishNet map) and consume `SummonSkillSync` as a login-restore fallback for `CalibrateSummons_T`.

A summon already active when the client connects is restored through `SummonSkillSync`, not `CalibrateSummons_T` - that RPC only fires on a later change. Because `SummonerSync`/`PrimarySync` previously had no decodable codec, the SyncType walk halted before ever reaching `SummonSkillSync`, so the overlay showed nothing for a summon restored at login. The combat tracker now fills in that one summon from `SummonSkillSync` without overwriting whatever a later `CalibrateSummons_T` snapshot reports.

`SummoningComponent.SummonSkillSync` lives on the summoned object itself, not the owning actor - the fallback credits the actor named by that same component's `SummonerSync`, tracked per summon object rather than per actor so `SummonSkillSync` and `SummonerSync` can arrive in either order, two objects reporting the same skill (e.g. two summoned clones) each count as their own stack, and a despawned object's contribution is corrected and forgotten rather than leaking onto a reused network object id.

Restore effects still active at login the same way: `PlayerSave.LoadCharacter_T`'s own `State.Effects` snapshot is the only packet that reports a buff that was already active when the client connects - `ApplyEffect_T`/`ApplyEffectDisplays_O` only fire on a later change or refresh, exactly like `CalibrateSummons_T` for summons.
