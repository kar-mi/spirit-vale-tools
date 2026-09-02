---
"@kar-mi/spirit-vale-tools-combat": major
---

Split the oversized `combat-tracker.ts` into focused modules: event/option types now live in `combat-events.ts`, stateless packet decoders in `combat-decoding.ts`, and summon and monster/boss identity handling in the new composed `FishNetSummonTracker` and `FishNetMonsterIdentityTracker` classes (both exported). `FishNetCombatFullHealEvent` is now exported.

Remove compatibility-only combat APIs: the deprecated, unused `localActorIdResolver` tracker option; the empty `CURRENT_BOSS_SKILL_NAMES` catalog; the positional `ticksPerSecond` argument from `DpsSessionLogFollower` in favor of `DpsSessionLogFollowerOptions.ticksPerSecond`; and the obsolete event-type re-exports from the `combat-tracker.ts` implementation module.

Rename the snapshot types retained from the removed `FishNetDpsMeter`: `FishNetDpsEncounterSnapshot` to `CombatEncounterSnapshot`, `FishNetDpsActorRow` to `CombatActorRow`, `FishNetDpsSkillRow` to `CombatSkillRow`, `FishNetDpsTimelinePoint` to `CombatTimelinePoint`, and `FishNetPersonalMatch` to `CombatPersonalMatch`.
