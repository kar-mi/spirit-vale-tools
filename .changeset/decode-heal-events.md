---
"@kar-mi/spirit-vale-tools-capture": patch
"@kar-mi/spirit-vale-tools-combat": patch
---

Decode `HealthComponent.Recover_C` and expose it from `FishNetCombatTracker` as a new `FishNetCombatHealEvent` (`kind: "heal"`). Healer attribution is best-effort, since the RPC carries no healer id: single matching healing-skill cast targeting the recipient resolves to `attribution: "exact"`/`"inferred"`, overlapping candidates resolve to `"ambiguous"`, and no match resolves to `"unattributed"` (still reports the healed target and amount). `parseDpsLogRecord` now recognizes `kind: "heal"` records from persisted logs.
