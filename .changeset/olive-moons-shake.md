---
"@kar-mi/spirit-vale-tools-combat": patch
---

Stop toggles and auras blinking out between server refreshes. A status the catalog gives no duration
is kept alive by the server re-stating it with one second left every ~0.2-0.7s, and that second was
taken as the whole expiry budget. Consumers judge it against a clock that extrapolates between
polls, so a late refresh plus the clock's lead overran the budget and the status lapsed and came
back. The keep-alive window now carries a second of headroom; nothing publishes this value for such
a status, so the only visible effect is that an aura that genuinely lapsed clears a second later.
