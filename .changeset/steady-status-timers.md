---
"@kar-mi/spirit-vale-tools-combat": patch
---

Stabilize status timers across observer-feed refreshes.

Timed statuses now retain their established expiry when refreshed values differ only because of server rounding, while still accepting genuine countdown progress and reapplications. Untimed toggles and auras keep their internal expiry refreshed so they remain visible while active, but no longer publish a misleading countdown. Skill activations also refresh ordinary self-granted buffs without altering summon stacks.
