---
"@kar-mi/spirit-vale-tools-combat": major
---

Attribute per-enemy damage to stable rendered actor rows instead of reusable network actor IDs, and give every unidentified player its own row.

Actor rows now carry a stable `rowId` (`name:` / `uid:` / `owner:` / `actor:`) and enemy breakdowns expose `attackerRowId`, so a reused actor ID can no longer assign one hit to two different players. The history schema stores outgoing enemy skills by actor lifetime rather than by actor ID.

Unidentified players are no longer folded into a single aggregate "Unidentified" row. Each keeps its own row, labelled `Unidentified (<actorId>)` and keyed by its own `rowId`, so their damage stays separable until an identity arrives. `unidentifiedActorIds` still lists every actor ID across those rows.

Also fixes the enemy breakdown silently dropping a still-anonymous attacker from an open encounter — the picker listed the mob while its skills table came back empty.
