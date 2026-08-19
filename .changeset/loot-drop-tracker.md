---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Add `FishNetLootDropTracker`, which tracks items on the ground from the spawn that places them to
the despawn that removes them: world position from the spawn transform, and name, sprite, rarity,
type and party lock from the `LootDrop` SyncVars.

Drops whose SyncVars arrive inside their spawn packet are named at spawn time; a follow-up SyncType
packet is not guaranteed and some drops never send one.

A despawn carries only an object id, so a removed drop is reported as gone rather than as picked up
by anyone.
