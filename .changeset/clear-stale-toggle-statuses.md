---
"@kar-mi/spirit-vale-tools-combat": patch
---

Fix toggle-style statuses (e.g. `Vitality`, or any status with no duration data) getting stuck active forever when their `RemoveEffect_T` packet is dropped. `FishNetStatusTracker` now clears an actor's active statuses when the actor despawns (`actorIdentity` `remove`), dies (`Death_C`), or the connection resets (zone transition/relog) - instead of relying solely on an explicit remove event, or (for zone transitions) blindly carrying stale statuses forward to the new actorId. Zone transitions reliably re-send `ApplyEffect_T` for whatever's genuinely still active shortly after loading, so clearing on reset and trusting that resync is both safe and closes the gap where a status that had actually already ended kept surviving every subsequent map change.
