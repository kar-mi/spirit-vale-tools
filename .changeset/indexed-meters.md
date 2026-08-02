---
"@kar-mi/spirit-vale-tools-combat": patch
---

Index the tanked and healing meters alongside damage, so past analysis reads all three from the read
model instead of replaying the log once per meter.

`combat_actors`, `combat_skills`, `combat_targets` and `combat_timeline_buckets` gain a `meter`
column (`dps` | `tanked` | `healing`) and carry it in their primary keys; `indexCombatStream` drives
two `MeterReducer`s from the same pass, following the damage reducer's encounter boundaries.
`CombatHistoryStore.getEncounter` takes a `meter` option and renders any of the three in the same
shape. `COMBAT_DOMAIN_VERSION` moves to 3, so an existing cache drops and re-indexes the combat
domain on open — the JSON Lines logs stay canonical and untouched.

Three fixes fall out of this. The player death log was empty on real logs: a death event carries no
damage of its own — the lethal blow is a separate damage event — and `recordEncounterHit` returned
early on any hit that was not a positive one, before reaching the death-log branch. The enemy
breakdown still counts only positive hits; deaths are now recorded regardless.
 A resumed pass now restores the reducer's actor identity map, persisted
on the open encounter row as `identities_json`: without it, healing attribution and mob-target
detection silently degraded for events indexed after a resume, since both consult that map.
`loadOpenEncounter` also reads through the model's statement cache rather than `database.query`, so
`close()` finalizes those statements — a long-lived model that re-indexes a live session resumes on
every pass, and statements left in Bun's own cache keep the database file open on Windows.
