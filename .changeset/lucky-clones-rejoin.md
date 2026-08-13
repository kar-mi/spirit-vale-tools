---
"@kar-mi/spirit-vale-tools-combat": patch
---

Count `PlayerClone` as a player-owned prefab again. A clone is a second network object under its owner's connection and deals damage under its own `AttackerId`, so excluding it in 2.2.5 stranded that damage on an anonymous actor instead of crediting the owner. Including it does not split a player into two meter rows: the actor directory propagates one identity across every object of an owner, and the meter folds those aggregates back together by display name.
