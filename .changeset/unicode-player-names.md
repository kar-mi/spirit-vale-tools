---
"@kar-mi/spirit-vale-tools-combat": minor
---

Fix identity handling for non-Latin player names.

`decodeCharacterDataName` capped the CharacterData display name at 32 bytes and the guild role
at 32, while the authoritative reader in `@kar-mi/spirit-vale-tools-character` allows 64 and 80.
Those caps are byte counts, so they were effectively ten-character limits for Hangul and CJK:
a longer name made the decode throw and the local player was silently never identified. All
field caps now match the authoritative reader.

`normalizeName` now applies NFC before trimming, so the precomposed and conjoining-jamo
spellings of one Hangul name resolve to a single key instead of splitting one player into two
rows, and uses `toLowerCase` rather than `toLocaleLowerCase` so keys no longer depend on the
host locale. It is also exported now, so consumers can share the one identity key instead of
reimplementing it; `FishNetStatusTracker` now uses it internally.

Note that `actorRowId` derives from `normalizeName`, so stored `attackerRowId` values for
already-recorded encounters whose names were in NFD form will no longer match their rows.
