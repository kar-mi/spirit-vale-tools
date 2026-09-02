---
"@kar-mi/spirit-vale-tools-combat": minor
---

Split the oversized `combat-tracker.ts` into focused modules: event/option types now live in `combat-events.ts`, stateless packet decoders in `combat-decoding.ts`, and summon and monster/boss identity handling in the new composed `FishNetSummonTracker` and `FishNetMonsterIdentityTracker` classes (both exported). `FishNetCombatFullHealEvent` is now exported. Behavior and the `FishNetCombatTracker` API are unchanged.
