---
"@kar-mi/spirit-vale-tools-capture": major
"@kar-mi/spirit-vale-tools-combat": major
---

Remove support for the legacy game build. The capture package no longer exports
`LEGACY_GAME_BUILD_FINGERPRINT`, and bundled RPC and semantic-map loaders now
accept only the current game build. The combat tracker likewise no longer loads
legacy semantic labels when given the retired build fingerprint.
