---
"@kar-mi/spirit-vale-tools-rewards": minor
---

Report mob kills that no reward could be pinned to, instead of discarding them.

A kill was only emitted when it had both an identified mob and a correlated reward. Everything else
was dropped silently: an ambiguous kill returned early, and a kill with no gain and no drops fell
through to nothing. Experience arrives as a coalesced `ExpCoinsChanged_T` state update, so a kill is
only attributable when exactly one death sits inside the correlation window — which farming almost
never satisfies. Measured on a real session, 233 mobs died and produced 2 `rewards.kill` records;
the other kills existed nowhere, even though every one of them was identified. Experience totals
looked correct the whole time because they come from the state delta rather than from attribution.

An identified mob death is now reported whenever our side damaged it or a reward landed on it.
Experience cannot decide this on its own — at max level a real kill pays nothing — so the tracker
remembers which targets took our outgoing damage and clears each on death. A mob that died nearby
without us touching it, and paid nothing, is someone else's kill and is still ignored: on a measured
session that excluded 26 of 224 identified deaths, leaving 198.

`FishNetConfirmedMobKill` gains `attributed`, false when no reward could be pinned to it, in which
case its experience, coins and drops are zero and the reward continues to be reported on its own
unmatched event — counted once, not split or duplicated. Kills whose mob was never identified still
produce an `unmatched` event rather than a kill, since there is nothing to show.

`MobRewardMobSummary` gains `attributedKills` alongside `kills`, so a consumer can show a true kill
count without implying every kill's rewards are known. The read model stores both
(`reward_kills.attributed`, `reward_mob_totals.attributed_kills`) and `REWARDS_DOMAIN_VERSION` moves
to 3 so the cache rebuilds. Kill records logged before this change parse as `attributed: true`, which
is what they were.

Kills are correlated while capturing, so this only affects newly captured sessions; existing reward
logs contain only the kills that were attributable at the time.
