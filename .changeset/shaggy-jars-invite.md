---
"@kar-mi/spirit-vale-tools-combat": minor
---

Catch reflected player deaths in the death log and the damage-taken meter. A boss spell reflect
sends the caster's own hit back at them, so it arrives on the party's team and attributed to the
victim themselves; both reducers read that as outgoing party damage and discarded it. Adds
`replayCombatCapture` / `decodeCombatCaptureJsonLines`, which re-run a raw packet capture through
the combat trackers offline.
