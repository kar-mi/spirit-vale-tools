---
"@kar-mi/spirit-vale-tools-combat": patch
---

Fix `FishNetStatusTracker` dropping still-active statuses (e.g. Haste) from `getActiveStatusesForName` after a zone transition or relog. An `actorIdentity` reset reassigns the local player a new `actorId` and clears the name lookup to avoid misattributing a recycled `actorId` to the wrong character, but previously the still-tracked buffs/debuffs under the old `actorId` were never reconciled, so they silently vanished from consumers like the overlay even though the buff was still running in-game. `consumeIdentity` now remembers the last known `actorId` per `uid` across resets and migrates that `actorId`'s active statuses onto the new one as soon as the same `uid` re-upserts, closing the gap. Other actors' identity events don't carry a `uid`, so this only applies to the local player and doesn't change recycled-`actorId` behavior for anyone else.
