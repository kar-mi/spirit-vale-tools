---
"@kar-mi/spirit-vale-tools-combat": minor
---

Preserve observer-reported `maxStacks` in combat status events, replay, and active status snapshots. The value belongs to a status on its bearer: zero declares no ceiling, while an absent value means none was reported. Keep the last reported value across status feeds that omit it, and clear it when the status is removed.
